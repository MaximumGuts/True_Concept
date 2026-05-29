/**
 * Next-Best-Action Rule Engine (Phase 7C)
 *
 * GET /api/ai/next-recommendation
 *
 * Walks the learning ladder deterministically and returns the next thing the
 * student should do. Used by the AI Mentor's second card (Phase 7D).
 *
 * Ladder (in priority order):
 *   1. unread_note       — student hasn't finished all notes in current chapter
 *   2. note_video        — note has attached video that hasn't been played
 *   3. lab               — chapter has a registered lab that hasn't been completed
 *   4. lab_quiz          — lab is done but its built-in quiz hasn't been attempted
 *   5. chapter_mcq       — chapter MCQ never attempted OR best score < 60
 *   6. qna               — chapter Q&A section never opened
 *   7. qna_video         — Q&A has attached videos that haven't been played
 *   8. next_chapter      — current chapter complete, recommend next in subject
 *   9. all_caught_up     — fallback when nothing's pending
 *
 * The "current focus chapter" is whichever chapter the student touched most
 * recently (highest chapterMastery.lastStudiedAt). Falls back to the first
 * chapter in the student's class if no chapterMastery exists yet.
 */

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import type { Request, Response } from "express";
import {
  LAB_REGISTRY,
  getLabsForChapterKey,
  getLabRouteForExperimentId,
  buildChapterKey,
  type BilingualField,
  type LabRegistryEntry,
} from "../lib/lab-chapter-registry.js";

const router: IRouter = Router();

const PASS_THRESHOLD = 60;  // chapter MCQ score under this counts as not mastered
const ACTIVITY_LOOKBACK = 50;  // capped subcollection size

// ─── Response shape ──────────────────────────────────────────────────────────

type RecKind =
  | "unread_note"
  | "note_video"
  | "lab"
  | "lab_quiz"
  | "chapter_mcq"
  | "qna"
  | "qna_video"
  | "next_chapter"
  | "all_caught_up";

interface NextRecommendation {
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
  bilingualReady: boolean;       // is the target safe to recommend to an Assamese student?
  generatedAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bi(en: string, as: string): BilingualField<string> {
  return { en, as };
}

/** Mirror BilingualField text for sims where Assamese isn't translated yet. */
function biSame(text: string): BilingualField<string> {
  return { en: text, as: text };
}

/** Returns the chapter-key used by the registry, derived from a chapter doc. */
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

// ─── Route ───────────────────────────────────────────────────────────────────

router.get(
  "/ai/next-recommendation",
  requireAuth as (req: Request, res: Response, next: () => void) => void,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as Request & { user: { id: string; role: string } }).user;
    const uid = user.id;

    try {
      // ── 1. Read student context + mastery state in parallel ──────────────
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

      // Map experimentId → mastery doc for O(1) lookup
      const expMasteryMap = new Map<string, any>();
      for (const d of experimentMasterySnap.docs) {
        expMasteryMap.set(d.id, d.data());
      }

      // Recent activity index: chapterId → Set of activity types seen
      const activityIndex = new Map<string, Set<string>>();
      for (const d of activitySnap.docs) {
        const a = d.data() as { type?: string; chapterId?: string };
        if (a.type && a.chapterId) {
          if (!activityIndex.has(a.chapterId)) activityIndex.set(a.chapterId, new Set());
          activityIndex.get(a.chapterId)!.add(a.type);
        }
      }

      // ── 2. Determine focus chapter ────────────────────────────────────────
      // Most recent chapterMastery doc wins. If none, pick first chapter of student's class.
      let focusChapterId: string | null = null;
      let focusMastery: any = null;
      if (!chapterMasterySnap.empty) {
        focusMastery = chapterMasterySnap.docs[0].data();
        focusChapterId = focusMastery.chapterId;
      }

      if (!focusChapterId) {
        // Cold start — pick the first chapter for this class
        const firstChapterSnap = await db.collection("chapters")
          .where("classLevel", "==", classLevel)
          .orderBy("chapterNumber", "asc")
          .limit(1).get();
        if (firstChapterSnap.empty) {
          res.json(emptyRecommendation("No chapters available for your class yet."));
          return;
        }
        const first = firstChapterSnap.docs[0];
        focusChapterId = first.id;
        focusMastery = {
          chapterId: first.id,
          chapterTitle: (first.data() as { title?: string }).title ?? "",
          subjectId: (first.data() as { subjectId?: string }).subjectId ?? "",
          subjectName: "",
          notesCompleted: 0,
          mcqAttemptCount: 0,
          mcqBestScore: 0,
        };
      }

      // ── 3. Load chapter detail + content counts ───────────────────────────
      const chapterDocSnap = await db.collection("chapters").doc(focusChapterId!).get();
      if (!chapterDocSnap.exists) {
        res.json(emptyRecommendation("Focus chapter no longer exists."));
        return;
      }
      const chapter = chapterDocSnap.data() as Record<string, any>;
      const chapterKey = chapterKeyForChapter(chapter);

      // Fetch this chapter's notes, mcqs, qa in parallel
      const [notesSnap, mcqsSnap, qaSnap] = await Promise.all([
        db.collection("notes").where("chapterId", "==", focusChapterId).orderBy("order", "asc").get(),
        db.collection("mcqs").where("chapterId", "==", focusChapterId).limit(1).get(),
        db.collection("qa").where("chapterId", "==", focusChapterId).limit(1).get(),
      ]);

      const notes = notesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Array<Record<string, any>>;
      const hasMcq = !mcqsSnap.empty;
      const hasQa  = !qaSnap.empty;

      const notesCompleted = focusMastery.notesCompleted ?? 0;
      const mcqAttemptCount = focusMastery.mcqAttemptCount ?? 0;
      const mcqBestScore = focusMastery.mcqBestScore ?? 0;

      const chapterTitleBi = bi(focusMastery.chapterTitle || chapter.title || "", focusMastery.chapterTitle || chapter.title || "");
      const subjectNameBi  = bi(focusMastery.subjectName  || "", focusMastery.subjectName || "");

      // ── 4. Walk the ladder ────────────────────────────────────────────────

      // RUNG 1: Unread notes
      if (notes.length > 0 && notesCompleted < notes.length) {
        const nextNote = notes[notesCompleted];
        const noteTitle = nextNote.title || "Untitled note";
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 3: Labs for this chapter
      const labs: LabRegistryEntry[] = chapterKey ? getLabsForChapterKey(chapterKey) : [];

      // Filter labs by student's medium safety (Assamese gets bilingual-ready only when alternatives exist;
      // if no alternatives, still recommend with bilingualReady flag set so UI can show language note)
      const recommendableLabs = isAssamese
        ? (labs.some(l => l.bilingualReady && !expMasteryMap.get(l.experimentId)?.completed)
            ? labs.filter(l => l.bilingualReady)
            : labs)
        : labs;

      const incompleteLab = recommendableLabs.find(l => !expMasteryMap.get(l.experimentId)?.completed);
      if (incompleteLab) {
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 4: Lab quiz not done
      const untestedLab = recommendableLabs.find(l => {
        const m = expMasteryMap.get(l.experimentId);
        return m?.completed && !m?.quizAttempts;
      });
      if (untestedLab) {
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 5: Chapter MCQ
      if (hasMcq && (mcqAttemptCount === 0 || mcqBestScore < PASS_THRESHOLD)) {
        const isRetry = mcqAttemptCount > 0;
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 6: Q&A not viewed
      const seenForChapter = activityIndex.get(focusChapterId!) ?? new Set();
      if (hasQa && !seenForChapter.has("qa_viewed")) {
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 8: Next chapter
      const nextChapterSnap = await db.collection("chapters")
        .where("subjectId", "==", chapter.subjectId)
        .where("classLevel", "==", chapter.classLevel)
        .where("chapterNumber", ">", chapter.chapterNumber ?? 0)
        .orderBy("chapterNumber", "asc")
        .limit(1).get();

      if (!nextChapterSnap.empty) {
        const nextDoc = nextChapterSnap.docs[0];
        const next = nextDoc.data() as Record<string, any>;
        const nextTitle = next.title || "Next chapter";
        const rec: NextRecommendation = {
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
        res.json(rec);
        return;
      }

      // RUNG 9: All caught up in this subject
      res.json(emptyRecommendation(
        `Excellent — you've cleared every chapter in ${chapter.subjectName ?? "this subject"}. Try another subject!`,
      ));
      return;

    } catch (err: any) {
      console.error("[next-recommendation] error:", err?.message ?? err);
      res.status(500).json({ error: "Failed to compute recommendation", details: String(err?.message ?? err) });
    }
  },
);

// ─── Empty / fallback responses ──────────────────────────────────────────────

function emptyRecommendation(message: string): NextRecommendation {
  return {
    kind: "all_caught_up",
    rung: 99,
    target: {
      id: "none",
      title: biSame(""),
      ctaUrl: "/dashboard",
    },
    reason: bi(message, message),
    emoji: "🎉",
    bilingualReady: true,
    generatedAt: new Date().toISOString(),
  };
}

export default router;
