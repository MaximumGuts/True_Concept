import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "@workspace/db";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { handleCors } from "../utils/cors.js";
import { getSubPath } from "../utils/router.js";
import { requireAuth, type AuthError } from "../middleware/auth.js";
import { callGemini, parseGeminiJson } from "../lib/gemini.js";
import { computeNextRecommendation, narrateRecommendation } from "../lib/next-recommendation.js";

// Firebase Secret — set via `firebase functions:secrets:set GEMINI_API_KEY`
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

// Cache: skip Gemini call if recommendation is < 6 hours old
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

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

        // ── Check cache ──────────────────────────────────────────────────────
        const cacheRef = db.collection("aiRecommendations").doc(uid);
        const cacheSnap = await cacheRef.get();

        if (cacheSnap.exists) {
          const cached = cacheSnap.data() as AiMentorResponse;
          const generatedMs = (cached.generatedAt as Timestamp).toMillis();
          if (Date.now() - generatedMs < CACHE_TTL_MS) {
            res.json(cached);
            return;
          }
        }

        // ── Read knowledge profile ───────────────────────────────────────────
        const profileSnap = await db.collection("studentKnowledgeProfiles").doc(uid).get();

        if (!profileSnap.exists) {
          res.status(202).json({ pending: true, message: "Profile not ready yet. Study a bit first!" });
          return;
        }

        const profile = profileSnap.data() as Record<string, any>;

        // ── Read student name ────────────────────────────────────────────────
        const studentSnap = await db.collection("students").doc(uid).get();
        const studentName: string = studentSnap.exists
          ? (studentSnap.data() as { name?: string }).name ?? "Student"
          : "Student";
        const firstName = studentName.split(" ")[0];

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
Exam Readiness: ${profile.examReadinessScore ?? 0}/100
Confidence: ${profile.confidenceScore ?? 0}/100
Study Streak: ${profile.studyBehavior?.currentStreak ?? 0} days (longest: ${profile.studyBehavior?.longestStreak ?? 0})
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

Recent activity (last 10 things this student did, newest first):
${recentActivityFormatted}

IMPORTANT GUIDANCE for picking recommendations:
- If the student JUST did the activity you were about to recommend (within the last hour), acknowledge their effort and shift to the NEXT-priority task instead. Do not repeat the same recommendation back.
- Each of the 3 topRecommendations MUST target a DIFFERENT chapter or a different activity type (revision / retry / study). No duplicates.
- The "retry" card is only worth showing if there are unresolved weak questions the student hasn't attempted in the last hour. Otherwise replace it with a different priority (e.g. a quick lab experiment, a Q&A review).
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
        const narrated = await narrateRecommendation(rec, user.id, db);
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
