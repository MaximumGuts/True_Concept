/**
 * Next-Best-Action engine (Phase 7C) — Cloud Function version.
 *
 * Pure async function: takes a uid + the Firestore db handle, returns the
 * structured recommendation. The HTTP layer (ai-mentor.ts) just wraps this.
 *
 * Mirrors `artifacts/api-server/src/routes/next-recommendation.ts`. Keep both
 * in sync (future: extract to a shared workspace package).
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  LAB_REGISTRY,
  getLabsForChapterKey,
  getLabRouteForExperimentId,
  buildChapterKey,
  type BilingualField,
  type LabRegistryEntry,
} from "./lab-chapter-registry.js";
import { callGemini, parseGeminiJson } from "./gemini.js";

const PASS_THRESHOLD = 60;
const ACTIVITY_LOOKBACK = 50;
// AI narration cache — bilingual reason text per (uid, kind, target.id).
// Generated narrations live up to 7 days; recommendations naturally invalidate
// the cache when kind or target.id changes (different doc key).
const NARRATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RecKind =
  | "unread_note"
  | "note_video"
  | "lab"
  | "lab_quiz"
  | "chapter_mcq"
  | "qna"
  | "qna_video"
  | "next_chapter"
  | "all_caught_up";

export interface NextRecommendation {
  kind: RecKind;
  rung: number;
  target: {
    id: string;
    title: BilingualField<string>;
    chapterId?: string;
    chapterTitle?: BilingualField<string>;
    subjectId?: string;
    subjectName?: BilingualField<string>;
    ctaUrl: string;
    youtubeId?: string;
  };
  reason: BilingualField<string>;
  emoji?: string;
  bilingualReady: boolean;
  generatedAt: string;
}

function bi(en: string, as: string): BilingualField<string> {
  return { en, as };
}

function biSame(text: string): BilingualField<string> {
  return { en: text, as: text };
}

function chapterKeyForChapter(chapter: { classLevel?: string; chapterNumber?: number }): string | null {
  if (!chapter.chapterNumber) return null;
  const cls = chapter.classLevel?.includes("10") || chapter.classLevel?.toLowerCase().includes("x")
    ? "X"
    : chapter.classLevel?.includes("9") || chapter.classLevel?.toLowerCase().includes("ix")
      ? "IX"
      : null;
  if (!cls) return null;
  return buildChapterKey(cls, chapter.chapterNumber);
}

function emptyRecommendation(message: string): NextRecommendation {
  return {
    kind: "all_caught_up",
    rung: 99,
    target: { id: "none", title: biSame(""), ctaUrl: "/dashboard" },
    reason: bi(message, message),
    emoji: "🎉",
    bilingualReady: true,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Compute the next best action for a given student.
 * Pass in the firestore db handle (already initialized by the caller).
 */
export async function computeNextRecommendation(
  uid: string,
  db: FirebaseFirestore.Firestore,
): Promise<NextRecommendation> {
  const [
    profileSnap,
    chapterMasterySnap,
    experimentMasterySnap,
    activitySnap,
    studentSnap,
  ] = await Promise.all([
    db.collection("studentKnowledgeProfiles").doc(uid).get(),
    db.collection("studentProgress").doc(uid).collection("chapterMastery").orderBy("lastStudiedAt", "desc").get(),
    db.collection("studentProgress").doc(uid).collection("experimentMastery").get(),
    db.collection("studentProgress").doc(uid).collection("activity").orderBy("at", "desc").limit(ACTIVITY_LOOKBACK).get(),
    db.collection("students").doc(uid).get(),
  ]);

  const profile = profileSnap.exists ? (profileSnap.data() as Record<string, any>) : null;
  const studentData = studentSnap.exists ? (studentSnap.data() as Record<string, any>) : {};
  const classLevel  = (profile?.classLevel || studentData.class || "10") as string;
  const medium      = (profile?.medium || studentData.medium || "English") as string;
  const isAssamese  = medium === "Assamese";

  // experimentId → mastery doc
  const expMasteryMap = new Map<string, any>();
  for (const d of experimentMasterySnap.docs) expMasteryMap.set(d.id, d.data());

  // chapterId → set of activity types seen recently
  const activityIndex = new Map<string, Set<string>>();
  for (const d of activitySnap.docs) {
    const a = d.data() as { type?: string; chapterId?: string };
    if (a.type && a.chapterId) {
      if (!activityIndex.has(a.chapterId)) activityIndex.set(a.chapterId, new Set());
      activityIndex.get(a.chapterId)!.add(a.type);
    }
  }

  // ── Focus chapter: most recently studied, or cold-start = first of class ──
  let focusChapterId: string | null = null;
  let focusMastery: any = null;
  if (!chapterMasterySnap.empty) {
    focusMastery = chapterMasterySnap.docs[0].data();
    focusChapterId = focusMastery.chapterId;
  }

  if (!focusChapterId) {
    // Avoid composite index (classLevel + chapterNumber) — fetch + sort in memory.
    // Chapter collections are small (~10-15 per subject per class).
    const classChaptersSnap = await db.collection("chapters")
      .where("classLevel", "==", classLevel).get();
    if (classChaptersSnap.empty) {
      return emptyRecommendation("No chapters available for your class yet.");
    }
    const sorted = classChaptersSnap.docs
      .map((d: any) => ({ id: d.id, data: d.data() as Record<string, any> }))
      .sort((a, b) => (a.data.chapterNumber ?? 0) - (b.data.chapterNumber ?? 0));
    const first = sorted[0];
    focusChapterId = first.id;
    focusMastery = {
      chapterId: first.id,
      chapterTitle: first.data.title ?? "",
      subjectId: first.data.subjectId ?? "",
      subjectName: "",
      notesCompleted: 0,
      mcqAttemptCount: 0,
      mcqBestScore: 0,
    };
  }

  // ── Load focus chapter + counts ──
  const chapterDocSnap = await db.collection("chapters").doc(focusChapterId!).get();
  if (!chapterDocSnap.exists) {
    return emptyRecommendation("Focus chapter no longer exists.");
  }
  const chapter = chapterDocSnap.data() as Record<string, any>;
  const chapterKey = chapterKeyForChapter(chapter);

  // Avoid composite index (chapterId + order) on notes — fetch + sort in memory.
  // Notes per chapter are small (typically 5-15).
  const [notesSnap, mcqsSnap, qaSnap] = await Promise.all([
    db.collection("notes").where("chapterId", "==", focusChapterId).get(),
    db.collection("mcqs").where("chapterId", "==", focusChapterId).limit(1).get(),
    db.collection("qa").where("chapterId", "==", focusChapterId).limit(1).get(),
  ]);

  const notes = (notesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Array<Record<string, any>>)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const hasMcq = !mcqsSnap.empty;
  const hasQa  = !qaSnap.empty;

  const notesCompleted = focusMastery.notesCompleted ?? 0;
  const mcqAttemptCount = focusMastery.mcqAttemptCount ?? 0;
  const mcqBestScore = focusMastery.mcqBestScore ?? 0;

  const chapterTitleBi = biSame(focusMastery.chapterTitle || chapter.title || "");
  const subjectNameBi  = biSame(focusMastery.subjectName  || "");

  // ── Walk the ladder ──

  // RUNG 1: Unread notes
  if (notes.length > 0 && notesCompleted < notes.length) {
    const nextNote = notes[notesCompleted];
    const noteTitle = nextNote.title || "Untitled note";
    return {
      kind: "unread_note",
      rung: 1,
      target: {
        id: nextNote.id,
        title: biSame(noteTitle),
        chapterId: focusChapterId!,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=notes&note=${nextNote.id}`,
        youtubeId: nextNote.youtubeId ?? undefined,
      },
      reason: bi(
        `Continue with "${noteTitle}" — ${notesCompleted}/${notes.length} notes done in this chapter.`,
        `"${noteTitle}" পঢ়ি থাকক — এই অধ্যায়ত ${notesCompleted}/${notes.length} টা টোকা শেষ হৈছে।`,
      ),
      emoji: "📖",
      bilingualReady: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // RUNG 3-4: Labs for this chapter
  const labs: LabRegistryEntry[] = chapterKey ? getLabsForChapterKey(chapterKey) : [];
  const recommendableLabs = isAssamese
    ? (labs.some(l => l.bilingualReady && !expMasteryMap.get(l.experimentId)?.completed)
        ? labs.filter(l => l.bilingualReady)
        : labs)
    : labs;

  const incompleteLab = recommendableLabs.find(l => !expMasteryMap.get(l.experimentId)?.completed);
  if (incompleteLab) {
    return {
      kind: "lab",
      rung: 3,
      target: {
        id: incompleteLab.experimentId,
        title: incompleteLab.experimentTitle,
        chapterId: focusChapterId!,
        chapterTitle: chapterTitleBi,
        subjectId: incompleteLab.subjectId,
        subjectName: incompleteLab.subjectName,
        ctaUrl: getLabRouteForExperimentId(incompleteLab.experimentId),
      },
      reason: bi(
        `Try the ${incompleteLab.experimentTitle.en} lab — it covers what you just read.`,
        `${incompleteLab.experimentTitle.as} পৰীক্ষাগাৰটো চেষ্টা কৰক — এইটোৱে আপুনি এতিয়া পঢ়া বিষয়টো ব্যাখ্যা কৰে।`,
      ),
      emoji: incompleteLab.emoji ?? "🔬",
      bilingualReady: incompleteLab.bilingualReady,
      generatedAt: new Date().toISOString(),
    };
  }

  const untestedLab = recommendableLabs.find(l => {
    const m = expMasteryMap.get(l.experimentId);
    return m?.completed && !m?.quizAttempts;
  });
  if (untestedLab) {
    return {
      kind: "lab_quiz",
      rung: 4,
      target: {
        id: untestedLab.experimentId,
        title: untestedLab.experimentTitle,
        chapterId: focusChapterId!,
        chapterTitle: chapterTitleBi,
        subjectId: untestedLab.subjectId,
        subjectName: untestedLab.subjectName,
        ctaUrl: getLabRouteForExperimentId(untestedLab.experimentId),
      },
      reason: bi(
        `Take the ${untestedLab.experimentTitle.en} lab quiz to lock in what you learned.`,
        `শিকিথকা কথা পকা কৰিবলৈ ${untestedLab.experimentTitle.as} পৰীক্ষাগাৰৰ কুইজ দিয়ক।`,
      ),
      emoji: "🎯",
      bilingualReady: untestedLab.bilingualReady,
      generatedAt: new Date().toISOString(),
    };
  }

  // RUNG 5: Chapter MCQ
  if (hasMcq && (mcqAttemptCount === 0 || mcqBestScore < PASS_THRESHOLD)) {
    const isRetry = mcqAttemptCount > 0;
    return {
      kind: "chapter_mcq",
      rung: 5,
      target: {
        id: focusChapterId!,
        title: chapterTitleBi,
        chapterId: focusChapterId!,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=mcq`,
      },
      reason: isRetry
        ? bi(
            `Your chapter MCQ score is ${mcqBestScore}/100 — retry to push it past ${PASS_THRESHOLD}.`,
            `অধ্যায়ৰ MCQ স্ক'ৰ ${mcqBestScore}/১০০ — ${PASS_THRESHOLD} পাৰ কৰিবলৈ আকৌ চেষ্টা কৰক।`,
          )
        : bi(
            `You've covered the notes & lab — now try the chapter MCQ.`,
            `টোকা আৰু পৰীক্ষাগাৰ শেষ হৈছে — এতিয়া অধ্যায়ৰ MCQ চেষ্টা কৰক।`,
          ),
      emoji: "🧠",
      bilingualReady: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // RUNG 6: Q&A not viewed
  const seenForChapter = activityIndex.get(focusChapterId!) ?? new Set();
  if (hasQa && !seenForChapter.has("qa_viewed")) {
    return {
      kind: "qna",
      rung: 6,
      target: {
        id: focusChapterId!,
        title: chapterTitleBi,
        chapterId: focusChapterId!,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=qa`,
      },
      reason: bi(
        `Review the Q&A section to sharpen exam-style answers.`,
        `পৰীক্ষাৰ উত্তৰৰ ধাঁচ চোৱাৰ বাবে Q&A খণ্ডটো চাওক।`,
      ),
      emoji: "💬",
      bilingualReady: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // RUNG 8: Next chapter — fetch subject's chapters, sort + pick first > current.
  // Avoids a composite index on (subjectId + classLevel + chapterNumber).
  const subjectChaptersSnap = await db.collection("chapters")
    .where("subjectId", "==", chapter.subjectId)
    .where("classLevel", "==", chapter.classLevel)
    .get();

  const currentChNum = chapter.chapterNumber ?? 0;
  const laterChapters = subjectChaptersSnap.docs
    .map((d: any) => ({ id: d.id, data: d.data() as Record<string, any> }))
    .filter(c => (c.data.chapterNumber ?? 0) > currentChNum)
    .sort((a, b) => (a.data.chapterNumber ?? 0) - (b.data.chapterNumber ?? 0));

  if (laterChapters.length > 0) {
    const nextDoc = laterChapters[0];
    const next = nextDoc.data;
    const nextTitle = next.title || "Next chapter";
    return {
      kind: "next_chapter",
      rung: 8,
      target: {
        id: nextDoc.id,
        title: biSame(nextTitle),
        chapterId: nextDoc.id,
        chapterTitle: biSame(nextTitle),
        subjectId: next.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${nextDoc.id}`,
      },
      reason: bi(
        `You've cleared "${chapter.title}" — start "${nextTitle}".`,
        `"${chapter.title}" শেষ হৈছে — "${nextTitle}" আৰম্ভ কৰক।`,
      ),
      emoji: "➡️",
      bilingualReady: true,
      generatedAt: new Date().toISOString(),
    };
  }

  return emptyRecommendation(
    `Excellent — you've cleared every chapter in ${chapter.subjectName ?? "this subject"}. Try another subject!`,
  );
}

// ─── Phase 7E · AI Narrator ──────────────────────────────────────────────────
// Rewrites the engine's static `reason` text into warmer, personal copy via
// Gemini. Cached per (uid, kind, target.id) so repeat fetches don't burn
// tokens. Falls back to the engine's static reason on any AI failure.

function safeKey(s: string): string {
  // Firestore doc IDs cannot contain / # $ [ ] (and can't be ".." or "."),
  // so we sanitize aggressively. Lab/note IDs in this app are alphanumeric +
  // hyphens, but we belt-and-braces.
  return s.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 1000);
}

interface NarrationDoc {
  en: string;
  as: string;
  narratedAt: Timestamp;
  recKind: string;
  targetId: string;
}

/**
 * Enrich a recommendation with AI-narrated reason text.
 * Idempotent + cached. On any error, returns the input rec unchanged.
 */
export async function narrateRecommendation(
  rec: NextRecommendation,
  uid: string,
  db: FirebaseFirestore.Firestore,
): Promise<NextRecommendation> {
  // Don't narrate the "all caught up" celebration — it's already warm.
  if (rec.kind === "all_caught_up") return rec;

  const targetId = rec.target.id || "_";
  const cacheKey = safeKey(`${rec.kind}__${targetId}`);
  const cacheRef = db.collection("studentProgress").doc(uid)
    .collection("aiNarrations").doc(cacheKey);

  try {
    // ── Cache check ──
    const cached = await cacheRef.get();
    if (cached.exists) {
      const c = cached.data() as NarrationDoc;
      const ageMs = Date.now() - (c.narratedAt instanceof Timestamp ? c.narratedAt.toMillis() : 0);
      if (ageMs < NARRATION_TTL_MS && c.en && c.as) {
        return { ...rec, reason: { en: c.en, as: c.as } };
      }
    }

    // ── Cache miss → call Gemini ──
    // Read student first name for personalization
    const studentSnap = await db.collection("students").doc(uid).get();
    const fullName = (studentSnap.exists ? (studentSnap.data() as { name?: string }).name : "") || "Student";
    const firstName = fullName.split(" ")[0];

    const prompt = `You are an AI Academic Mentor for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India.

Student: ${firstName}
Their next-best action is a "${rec.kind}" recommendation.
Target title (English): ${rec.target.title.en}
Chapter (English): ${rec.target.chapterTitle?.en ?? "—"}
Subject (English): ${rec.target.subjectName?.en ?? "—"}
The deterministic engine's base reason is: "${rec.reason.en}"

Write a warm, encouraging, ONE sentence reason that:
- Uses ${firstName}'s first name naturally (don't force it)
- Feels like a personal nudge from a friendly mentor
- Stays under 22 words
- Avoids generic phrases like "Let's dive in" or "Get started"
- References the specific subject/chapter/target where possible

Output BOTH English and Assamese versions. The Assamese version must:
- Use Assamese script (অসমীয়া)
- Use simple, warm Assamese a Class 9-10 student in Assam will understand
- Keep technical subject names in English if they don't have natural Assamese equivalents

Return ONLY this JSON (no markdown fences, no commentary):
{
  "en": "English version here",
  "as": "Assamese version here"
}`;

    const raw = await callGemini(prompt);
    const parsed = parseGeminiJson<{ en?: string; as?: string }>(raw);

    if (!parsed.en || !parsed.as) {
      // Bad shape → keep engine fallback
      return rec;
    }

    // ── Cache for 7 days ──
    void cacheRef.set({
      en: parsed.en,
      as: parsed.as,
      narratedAt: FieldValue.serverTimestamp(),
      recKind: rec.kind,
      targetId,
    });

    return { ...rec, reason: { en: parsed.en, as: parsed.as } };
  } catch (err) {
    console.warn("[narrator] AI narration failed, falling back to engine reason:", (err as Error).message);
    return rec;
  }
}
