import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "@workspace/db";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { handleCors } from "../utils/cors.js";
import { getSubPath } from "../utils/router.js";
import { requireAuth, type AuthError } from "../middleware/auth.js";
import { callGemini, parseGeminiJson } from "../lib/gemini.js";
import { computeNextRecommendation, narrateRecommendation } from "../lib/next-recommendation.js";
import { getActivityTier, TIER_CACHE_TTL_MS, type ActivityTier } from "../lib/activity-tier.js";

// Firebase Secret — set via `firebase functions:secrets:set GEMINI_API_KEY`
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

// Cache TTL is now activity-tier-aware (see lib/activity-tier.ts):
//   active  → 48h (fresh)   ·   casual → 7 days   ·   dormant → no Gemini at all
// This caps Gemini cost for infrequent / returning users while keeping the
// experience fresh for students who actually study daily. A student can always
// force-regenerate via the manual refresh button (POST /api/ai/refresh).

export interface AiRecommendation {
  priority: number;
  type: "revision" | "retry" | "study" | "practice";
  icon: string;
  title: string;
  message: string;
  actionLabel: string;
  chapterId: string | null;
}

export interface AiMentorResponse {
  greeting: string;
  examReadinessMessage: string;
  topRecommendations: AiRecommendation[];
  weakTopicAlert: string | null;
  revisionAlert: string | null;
  motivationalMessage: string;
  nextBestAction: {
    message: string;
    chapterId: string | null;
    tab: "notes" | "mcq" | "qa" | null;
  };
  generatedAt: Timestamp;
  examReadinessScore: number;
  /** Activity tier this card was generated for. Used to bust the cache when a
   *  student crosses a tier boundary (e.g. returns from dormant). */
  tier?: ActivityTier;
}

/**
 * Build a deterministic "welcome back" mentor card for dormant students —
 * NO Gemini call. Uses the knowledge profile + the rule-based next-recommendation
 * engine (also non-AI) so a returning/uninstalled-then-reopened student gets an
 * instant, zero-cost card. They re-earn full AI once renewed activity lifts
 * their tier (see lib/activity-tier.ts).
 */
async function buildDormantMentor(
  uid: string,
  profile: Record<string, any>,
  firstName: string,
): Promise<AiMentorResponse> {
  const isAs   = (profile.medium ?? "English") === "Assamese";
  const score  = profile.examReadinessScore ?? 0;
  const streak = profile.studyBehavior?.currentStreak ?? 0;
  const pick   = (en: string, as: string) => (isAs ? as : en);

  // One concrete next step from the deterministic rule engine (no Gemini).
  let nextRec: Awaited<ReturnType<typeof computeNextRecommendation>> | null = null;
  try { nextRec = await computeNextRecommendation(uid, db); } catch { /* best effort */ }
  const hasNext = !!nextRec && nextRec.kind !== "all_caught_up";
  const nextReason = hasNext ? (isAs ? nextRec!.reason.as : nextRec!.reason.en) : null;

  const weak = Object.values(profile.weakTopicMap ?? {}) as any[];
  const revisionNeeded = (profile.revisionProfile?.chaptersNeedingRevision ?? []) as string[];

  const recs: AiRecommendation[] = [];
  if (hasNext) {
    recs.push({
      priority: recs.length + 1,
      type: "study",
      icon: nextRec!.emoji ?? "📘",
      title: pick("Pick up where you left off", "য'ত এৰিছিলা তাৰ পৰা আৰম্ভ কৰক"),
      message: nextReason!,
      actionLabel: pick("Resume", "আকৌ আৰম্ভ"),
      chapterId: nextRec!.target.chapterId ?? null,
    });
  }
  if (weak[0]) {
    recs.push({
      priority: recs.length + 1,
      type: "revision",
      icon: "🔄",
      title: pick("Strengthen a weak chapter", "এটা দুৰ্বল অধ্যায় শক্তিশালী কৰক"),
      message: pick(
        `Revisit ${weak[0].chapterTitle} — a quick review will rebuild your confidence.`,
        `${weak[0].chapterTitle} পুনৰ চাওক — সোনকালে এবাৰ চালে আত্মবিশ্বাস ঘূৰি আহিব।`,
      ),
      actionLabel: pick("Review", "পুনৰীক্ষণ"),
      chapterId: weak[0].chapterId ?? null,
    });
  }
  // Habit restart — always available.
  recs.push({
    priority: recs.length + 1,
    type: "practice",
    icon: "🔥",
    title: pick("Take today's Daily Challenge", "আজিৰ দৈনিক প্ৰত্যাহ্বান লওক"),
    message: pick(
      "10 quick questions to restart your streak.",
      "আপোনাৰ ষ্ট্ৰিক পুনৰ আৰম্ভ কৰিবলৈ ১০টা সোনকালীয়া প্ৰশ্ন।",
    ),
    actionLabel: pick("Start", "আৰম্ভ"),
    chapterId: null,
  });

  return {
    greeting: pick(`Welcome back, ${firstName}! 👋`, `আকৌ স্বাগতম, ${firstName}! 👋`),
    examReadinessMessage: pick(
      `Your exam readiness is ${score}/100. A few focused sessions this week will lift it fast.`,
      `আপোনাৰ পৰীক্ষাৰ প্ৰস্তুতি ${score}/১০০। এই সপ্তাহত কেইটামান মনোযোগী অধ্যয়নে ইয়াক সোনকালে বঢ়াব।`,
    ),
    topRecommendations: recs.slice(0, 3),
    weakTopicAlert: weak[0]
      ? pick(`${weak[0].chapterTitle} needs attention.`, `${weak[0].chapterTitle} ৰ প্ৰতি মনোযোগ দিয়া দৰকাৰ।`)
      : null,
    revisionAlert: revisionNeeded.length > 0
      ? pick(`${revisionNeeded.length} chapter(s) are due for revision.`, `${revisionNeeded.length} টা অধ্যায় পুনৰীক্ষণৰ বাবে বাকী আছে।`)
      : null,
    motivationalMessage: streak > 0
      ? pick("Small steps every day beat last-minute cramming. Let's go!", "প্ৰতিদিনে সৰু পদক্ষেপে শেষ মুহূৰ্তৰ পঢ়াতকৈ ভাল। আহক!")
      : pick("Every topper started with a single chapter. Today is a great day to restart.", "প্ৰতিজন টপাৰে এটা অধ্যায়ৰ পৰাই আৰম্ভ কৰিছিল। আজি পুনৰ আৰম্ভ কৰাৰ উত্তম দিন।"),
    nextBestAction: {
      message: nextReason ?? pick(
        "Open any chapter and read one note to get back in rhythm.",
        "যিকোনো অধ্যায় খুলি এটা টোকা পঢ়ি ছন্দলৈ ঘূৰি আহক।",
      ),
      chapterId: nextRec?.target.chapterId ?? null,
      tab: "notes",
    },
    examReadinessScore: score,
    tier: "dormant",
    generatedAt: Timestamp.now(),
  };
}

export const aiMentor = onRequest(
  { region: "asia-south1", invoker: "public", timeoutSeconds: 30, secrets: [GEMINI_API_KEY] },
  async (req, res) => {
    if (handleCors(req, res)) return;

    const subPath = getSubPath(req, "/api/ai");

    try {
      if (req.method === "GET" && subPath === "/mentor") {
        const user = requireAuth(req);
        const uid  = user.id;

        // ── Read knowledge profile (needed for activity tiering) ─────────────
        const profileSnap = await db.collection("studentKnowledgeProfiles").doc(uid).get();

        if (!profileSnap.exists) {
          res.status(202).json({ pending: true, message: "Profile not ready yet. Study a bit first!" });
          return;
        }

        const profile = profileSnap.data() as Record<string, any>;

        // ── Activity tier — gates how (and whether) we spend Gemini on this user
        //   active  → fresh AI, 48h cache
        //   casual  → AI, 7-day cache (regenerated far less often)
        //   dormant → NO Gemini; deterministic "welcome back" card. The student
        //             re-earns AI once renewed activity lifts the tier.
        const tier = getActivityTier(profile);

        // ── Tier-aware cache check ───────────────────────────────────────────
        // Also bust when the stored tier differs from the current one, so a
        // returning student stops seeing the static card the moment their
        // activity lifts them out of "dormant" (and vice-versa).
        const cacheRef = db.collection("aiRecommendations").doc(uid);
        const cacheSnap = await cacheRef.get();
        if (cacheSnap.exists) {
          const cached = cacheSnap.data() as AiMentorResponse;
          const generatedMs = (cached.generatedAt as Timestamp).toMillis();
          const cachedTier  = (cached.tier ?? "active") as ActivityTier;
          if (cachedTier === tier && Date.now() - generatedMs < TIER_CACHE_TTL_MS[tier]) {
            res.json(cached);
            return;
          }
        }

        // ── Read student name (used by both the static + AI paths) ───────────
        const studentSnap = await db.collection("students").doc(uid).get();
        const studentName: string = studentSnap.exists
          ? (studentSnap.data() as { name?: string }).name ?? "Student"
          : "Student";
        const firstName = studentName.split(" ")[0];

        // ── Dormant: serve a deterministic card — ZERO Gemini cost ───────────
        if (tier === "dormant") {
          const staticResult = await buildDormantMentor(uid, profile, firstName);
          await cacheRef.set({ ...staticResult, generatedAt: FieldValue.serverTimestamp() });
          res.json(staticResult);
          return;
        }

        // ── Build prompt ─────────────────────────────────────────────────────
        const weak = Object.values(profile.weakTopicMap ?? {}) as any[];
        const strong = Object.values(profile.strongTopicMap ?? {}) as any[];
        const subjectMastery = Object.values(profile.subjectMastery ?? {}) as any[];
        const retry = (profile.suggestedRetryQuestions ?? []) as any[];
        const revisionNeeded = (profile.revisionProfile?.chaptersNeedingRevision ?? []) as string[];

        // ── Read recent activity (last 10 events) so Gemini doesn't repeat
        // itself when the student JUST followed its previous advice ─────────
        // Without this context, Gemini sees "still weak in Force and Laws of Motion"
        // and keeps recommending the same retry, ignoring that the student attempted
        // exactly that MCQ set 30 seconds ago. The recent-activity excerpt teaches
        // Gemini to acknowledge progress and shift to the next-appropriate task.
        let recentActivityFormatted = "(no recent activity recorded)";
        try {
          const activitySnap = await db
            .collection("studentProgress").doc(uid).collection("activity")
            .orderBy("at", "desc")
            .limit(10)
            .get();
          if (!activitySnap.empty) {
            recentActivityFormatted = activitySnap.docs
              .map((d) => {
                const a = d.data() as { type?: string; refTitle?: string; chapterTitle?: string; at?: Timestamp };
                const ago = a.at ? Math.round((Date.now() - a.at.toMillis()) / 60000) : -1;
                const label = a.refTitle || a.chapterTitle || "(untitled)";
                const agoStr = ago < 0 ? "" : ago < 60 ? ` (${ago}m ago)` : ago < 1440 ? ` (${Math.round(ago/60)}h ago)` : ` (${Math.round(ago/1440)}d ago)`;
                return `- ${a.type ?? "event"}: ${label}${agoStr}`;
              })
              .join("\n");
          }
        } catch (err) {
          console.warn("[ai-mentor] could not read recent activity:", err);
        }

        const weakFormatted = weak.slice(0, 5)
          .map((t: any) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100, MCQ accuracy ${t.mcqAccuracy}%, not studied in ${t.daysSinceStudy} days`)
          .join("\n");

        const strongFormatted = strong.slice(0, 3)
          .map((t: any) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100`)
          .join("\n");

        const subjectFormatted = subjectMastery
          .map((s: any) => `- ${s.subjectName}: ${s.masteryScore}/100 (${s.trend})`)
          .join("\n");

        const retryFormatted = retry.slice(0, 5)
          .map((q: any) => `- ${q.chapterTitle}: accuracy ${q.accuracy}%, wrong ${q.consecutiveWrong} times in a row`)
          .join("\n");

        // ── Content gap map — what's available that the student hasn't done ──────
        const p: any = profile;
        const cov = p.contentCoverage ?? {};
        const unexploredFormatted = (p.unexploredChapters ?? []).slice(0, 6)
          .map((c: any) => `- ${c.chapterTitle} (${c.subjectName})`)
          .join("\n") || "None — student has started every chapter";
        const unpracticedMcqFormatted = (p.chaptersWithUnpracticedMcqs ?? []).slice(0, 5)
          .map((c: any) => `- ${c.chapterTitle} (${c.subjectName}): ${c.mcqAvailable} MCQs available, never attempted`)
          .join("\n") || "None";
        const qaToReviewFormatted = (p.chaptersWithQaToReview ?? []).slice(0, 5)
          .map((c: any) => `- ${c.chapterTitle} (${c.subjectName}): ${c.qaAvailable} Q&A available`)
          .join("\n") || "None";
        const emptySubjectsFormatted = (p.emptySubjects ?? [])
          .map((s: any) => `- ${s.subjectName} (${s.chapterCount} chapters, never opened)`)
          .join("\n") || "None — student has touched every subject";

        // Resolve revision chapter titles. When a chapter is in the revision
        // queue but absent from weak/strong maps (e.g. student studied it
        // briefly but never wrote a chapterMastery doc), fall back to the
        // chapters collection so we never feed raw IDs (e.g. "phys-ix-c01")
        // into the prompt — Gemini was using those IDs as the human-facing
        // "chapter name" in its recommendation text.
        const revisionFormatted = (await Promise.all(
          revisionNeeded.slice(0, 5).map(async (cid: string) => {
            const m = weak.find((t: any) => t.chapterId === cid) ||
                      strong.find((t: any) => t.chapterId === cid);
            if (m) return `- ${m.chapterTitle} (${m.daysSinceStudy} days ago)`;
            try {
              const chSnap = await db.collection("chapters").doc(cid).get();
              const title = chSnap.exists ? (chSnap.data() as { title?: string }).title : null;
              if (title) return `- ${title} (not recently studied)`;
            } catch { /* fall through */ }
            // No title available — drop the entry rather than expose the ID
            return null;
          })
        )).filter(Boolean).join("\n") || "None";

        const firstWeakChapterId = weak[0]?.chapterId ?? null;
        const firstRevisionChapterId = revisionNeeded[0] ?? null;
        const firstRetryChapterId    = retry[0]?.chapterId ?? null;

        const isAssamese = (profile.medium ?? "English") === "Assamese";
        const langInstruction = isAssamese
          ? "Respond ENTIRELY in Assamese (Assamese script — অসমীয়া). Use simple, warm Assamese that a Class 9-10 student from Assam can easily understand. Chapter names and subject names may stay in English."
          : "Respond in simple English.";

        const prompt = `You are an AI Academic Mentor for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India. Be warm, specific, encouraging and practical. ${langInstruction}

Student: ${firstName}
Class: ${profile.classLevel || "9"}, Medium: ${profile.medium || "English"}
Exam Readiness: ${profile.examReadinessScore ?? 0}/100 (based on coverage of ALL chapters — honest score)
Confidence: ${profile.confidenceScore ?? 0}/100
Study Streak: ${profile.studyBehavior?.currentStreak ?? 0} days (longest: ${profile.studyBehavior?.longestStreak ?? 0})
Daily Challenge Streak: ${(profile as any).dailyChallengeStreak ?? 0} days
Last Daily Challenge Score: ${(profile as any).lastChallengeScore != null ? `${(profile as any).lastChallengeScore}%` : "Not attempted yet"}
Avg Daily Challenge Score (last 7 days): ${(profile as any).avgChallengeScore != null ? `${(profile as any).avgChallengeScore}%` : "N/A"}
Last Mock Exam Score: ${(profile as any).lastMockScore != null ? `${(profile as any).lastMockScore}%` : "No mock exam taken yet"}
Mock Exams Taken: ${(profile as any).mockExamCount ?? 0}
Preferred study time: ${profile.studyBehavior?.preferredStudyHour ?? 20}:00
Active days this month: ${profile.studyBehavior?.activeDaysLast30 ?? 0}/30
Consistency: ${profile.studyBehavior?.consistencyScore ?? 0}/100
Overall MCQ Accuracy: ${profile.learningPattern?.averageMcqAccuracy ?? 0}%
Learning Trend: ${profile.learningPattern?.improvementTrend ?? "stable"}

Subject Mastery:
${subjectFormatted || "No data yet"}

Weak Topics (urgent attention needed):
${weakFormatted || "None identified yet"}

Strong Topics:
${strongFormatted || "None yet"}

Chapters not revised in 7+ days:
${revisionFormatted}

MCQ questions to retry (wrong multiple times):
${retryFormatted || "None yet"}

═══ CONTENT AVAILABLE THAT THE STUDENT HASN'T DONE YET ═══
Curriculum coverage: ${cov.chaptersStudied ?? 0}/${cov.totalChapters ?? 0} chapters studied (${cov.chapterCoveragePct ?? 0}%), ${cov.mcqsAttempted ?? 0}/${cov.totalMcqs ?? 0} MCQs attempted (${cov.mcqCoveragePct ?? 0}%), ${cov.subjectsStarted ?? 0}/${cov.totalSubjects ?? 0} subjects started.

New / unexplored chapters (student has NEVER opened these — great for "explore something new"):
${unexploredFormatted}

Chapters studied but MCQs never attempted (student read notes but skipped the quiz):
${unpracticedMcqFormatted}

Chapters with Q&A available to review:
${qaToReviewFormatted}

Subjects completely untouched:
${emptySubjectsFormatted}

Full-length question papers available: ${p.availablePapersCount ?? 0} ${(p.availablePapersCount ?? 0) > 0 ? "(student can attempt a full mock paper)" : ""}

Recent activity (last 10 things this student did, newest first):
${recentActivityFormatted}

IMPORTANT GUIDANCE for picking recommendations:
- If the student JUST did the activity you were about to recommend (within the last hour), acknowledge their effort and shift to the NEXT-priority task instead. Do not repeat the same recommendation back.
- Each of the 3 topRecommendations MUST target a DIFFERENT chapter or a different activity type (revision / retry / study / new chapter / practice MCQs / review Q&A / attempt paper). No duplicates.
- USE the "CONTENT AVAILABLE" section above to recommend genuinely NEW things: an unexplored chapter, MCQs the student skipped, Q&A to review, an untouched subject, or a full-length paper. This is how you surface freshly-added content.
- If a whole subject is untouched, gently encourage starting it (balance across subjects matters for board exams).
- If the student has skipped MCQs in chapters they've read, nudge them to test themselves — reading without testing is weak revision.
- The "retry" card is only worth showing if there are unresolved weak questions the student hasn't attempted in the last hour. Otherwise replace it with a "practice new MCQs" / "explore new chapter" / "attempt a paper" recommendation.
- **NEVER use raw chapter IDs** (anything that looks like an internal slug — for example "phys-ix-c01", "chem-x-04", numeric IDs). The chapter NAMES are the human-readable titles such as "Force and Laws of Motion", "Light — Reflection and Refraction", "মেট্ৰিকছ আৰু ইয়াৰ গুণ" etc. If a chapter's title is not provided in the data above, simply omit that chapter from your recommendation and pick a different one.

Return ONLY this JSON (no markdown):
{
  "greeting": "short warm greeting using first name, mention something specific like their streak or last activity",
  "examReadinessMessage": "specific message about their ${profile.examReadinessScore ?? 0}/100 score and top 1-2 things to improve it",
  "topRecommendations": [
    {
      "priority": 1,
      "type": "revision",
      "icon": "🔄",
      "title": "short title",
      "message": "specific actionable advice, mention exact chapter name",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstRevisionChapterId ?? firstWeakChapterId}"
    },
    {
      "priority": 2,
      "type": "retry",
      "icon": "🎯",
      "title": "short title",
      "message": "specific actionable advice about MCQ retry",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstRetryChapterId ?? firstWeakChapterId}"
    },
    {
      "priority": 3,
      "type": "study",
      "icon": "📚",
      "title": "short title",
      "message": "specific advice about next chapter to study",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstWeakChapterId}"
    }
  ],
  "weakTopicAlert": "one sentence about the biggest weakness subject/chapter",
  "revisionAlert": ${revisionNeeded.length > 0 ? '"one sentence about forgotten chapters"' : "null"},
  "motivationalMessage": "one sentence personal motivation based on streak/progress",
  "nextBestAction": {
    "message": "one sentence: the single most important thing to do RIGHT NOW",
    "chapterId": "${firstRevisionChapterId ?? firstWeakChapterId ?? null}",
    "tab": "notes"
  }
}`;

        // ── Call Gemini ──────────────────────────────────────────────────────
        const raw  = await callGemini(prompt);
        const aiData = parseGeminiJson<Omit<AiMentorResponse, "generatedAt" | "examReadinessScore">>(raw);

        const result: AiMentorResponse = {
          ...aiData,
          examReadinessScore: profile.examReadinessScore ?? 0,
          tier,
          generatedAt: Timestamp.now(),
        };

        // ── Cache to Firestore ───────────────────────────────────────────────
        await cacheRef.set({ ...result, generatedAt: FieldValue.serverTimestamp() });

        res.json(result);
        return;
      }

      // POST /api/ai/refresh — force regenerate (ignore cache)
      if (req.method === "POST" && subPath === "/mentor/refresh") {
        const user = requireAuth(req);
        await db.collection("aiRecommendations").doc(user.id).delete();
        res.json({ ok: true });
        return;
      }

      // GET /api/ai/next-recommendation — Phase 7C rule engine + Phase 7E AI narration.
      // Engine computes the deterministic pick; narrator rewrites the reason
      // text via Gemini (cached 7d per kind+target, falls back to engine text on error).
      if (req.method === "GET" && subPath === "/next-recommendation") {
        const user = requireAuth(req);
        const rec = await computeNextRecommendation(user.id, db);
        // Only spend Gemini on AI narration for active students. Casual/dormant
        // users get the rule engine's static bilingual reason text, which is
        // already perfectly serviceable — this removes the largest share of
        // Gemini calls (narration regenerates per kind+target as students advance).
        const profSnap = await db.collection("studentKnowledgeProfiles").doc(user.id).get();
        const tier = getActivityTier(profSnap.exists ? (profSnap.data() as Record<string, any>) : null);
        const narrated = tier === "active"
          ? await narrateRecommendation(rec, user.id, db)
          : rec;
        res.json(narrated);
        return;
      }

      // POST /api/ai/next-recommendation/refresh — clear narration cache for this rec
      if (req.method === "POST" && subPath === "/next-recommendation/refresh") {
        const user = requireAuth(req);
        // Delete every cached narration for this student so the next GET regenerates.
        const cacheCol = db.collection("studentProgress").doc(user.id).collection("aiNarrations");
        const snap = await cacheCol.get();
        const batch = db.batch();
        snap.docs.forEach((d: FirebaseFirestore.QueryDocumentSnapshot) => batch.delete(d.ref));
        await batch.commit();
        res.json({ ok: true, cleared: snap.size });
        return;
      }

      res.status(404).json({ error: "Not found" });
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.status && authErr.error) {
        res.status(authErr.status).json({ error: authErr.error });
        return;
      }
      console.error("[ai-mentor] error:", err);
      res.status(500).json({ error: "AI mentor temporarily unavailable" });
    }
  }
);
