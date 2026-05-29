import {
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { experimentMasteryDoc } from "./paths";
import type {
  ExperimentMastery,
  ExperimentCompletionSignal,
} from "./types";

const MAX_QUIZ_HISTORY = 5;

/** Called when the student enters a sim's EXPLORE view. */
export async function onExperimentStarted(args: {
  uid: string;
  experimentId: string;
  experimentTitle: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string | null;
}): Promise<void> {
  const ref = experimentMasteryDoc(args.uid, args.experimentId);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const initial: Omit<ExperimentMastery, "updatedAt"> = {
        experimentId:          args.experimentId,
        experimentTitle:       args.experimentTitle,
        subjectId:             args.subjectId,
        subjectName:           args.subjectName,
        chapterId:             args.chapterId ?? null,
        startedCount:          1,
        completedCount:        0,
        completed:             false,
        firstCompletionSignal: null,
        quizAttempts:          0,
        quizBestScore:         0,
        quizLastScore:         0,
        quizTotalCorrect:      0,
        quizTotalAttempted:    0,
        quizScoreHistory:      [],
        firstStartedAt:        Timestamp.now(),
        lastStartedAt:         Timestamp.now(),
        firstCompletedAt:      null,
        lastCompletedAt:       null,
      };
      await setDoc(ref, { ...initial, updatedAt: serverTimestamp() });
      return;
    }
    await updateDoc(ref, {
      startedCount:  increment(1),
      lastStartedAt: serverTimestamp(),
      updatedAt:     serverTimestamp(),
    });
  } catch {
    // Never break the sim UI on tracking failure
  }
}

/**
 * Called when the lab completion heuristic fires (journey finished OR
 * ≥5 distinct structures interacted with, OR a successful lab MCQ attempt).
 * Idempotent against firstCompletedAt — only set once.
 */
export async function onExperimentCompleted(args: {
  uid: string;
  experimentId: string;
  experimentTitle: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string | null;
  signal: ExperimentCompletionSignal;
}): Promise<void> {
  const ref = experimentMasteryDoc(args.uid, args.experimentId);
  try {
    const snap = await getDoc(ref);
    const now = serverTimestamp();

    if (!snap.exists()) {
      // Completion before any started event (shouldn't happen but seed cleanly)
      const initial: Omit<ExperimentMastery, "updatedAt"> = {
        experimentId:          args.experimentId,
        experimentTitle:       args.experimentTitle,
        subjectId:             args.subjectId,
        subjectName:           args.subjectName,
        chapterId:             args.chapterId ?? null,
        startedCount:          1,
        completedCount:        1,
        completed:             true,
        firstCompletionSignal: args.signal,
        quizAttempts:          0,
        quizBestScore:         0,
        quizLastScore:         0,
        quizTotalCorrect:      0,
        quizTotalAttempted:    0,
        quizScoreHistory:      [],
        firstStartedAt:        Timestamp.now(),
        lastStartedAt:         Timestamp.now(),
        firstCompletedAt:      Timestamp.now(),
        lastCompletedAt:       Timestamp.now(),
      };
      await setDoc(ref, { ...initial, updatedAt: now });
      return;
    }

    const cur = snap.data() as ExperimentMastery;
    const updates: Record<string, unknown> = {
      completedCount:  increment(1),
      completed:       true,
      lastCompletedAt: now,
      updatedAt:       now,
    };
    if (!cur.firstCompletedAt) {
      updates.firstCompletedAt = now;
      updates.firstCompletionSignal = args.signal;
    }
    await updateDoc(ref, updates);
  } catch {
    // Non-fatal
  }
}

/**
 * Called when the student finishes a lab's built-in MCQ quiz.
 * Updates quiz signals on the experiment mastery doc.
 * NOTE: this is separate from `onMcqAttempted` (chapter MCQ) — lab quizzes
 * are intentionally NOT routed into chapterMastery so they don't double-count.
 */
export async function onLabQuizAttempted(args: {
  uid: string;
  experimentId: string;
  experimentTitle: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string | null;
  score: number;          // 0-100
  totalCorrect: number;
  totalAttempted: number;
}): Promise<void> {
  const ref = experimentMasteryDoc(args.uid, args.experimentId);
  try {
    const snap = await getDoc(ref);
    const now = serverTimestamp();

    if (!snap.exists()) {
      const initial: Omit<ExperimentMastery, "updatedAt"> = {
        experimentId:          args.experimentId,
        experimentTitle:       args.experimentTitle,
        subjectId:             args.subjectId,
        subjectName:           args.subjectName,
        chapterId:             args.chapterId ?? null,
        startedCount:          1,
        completedCount:        1,
        completed:             true,
        firstCompletionSignal: "quiz",
        quizAttempts:          1,
        quizBestScore:         args.score,
        quizLastScore:         args.score,
        quizTotalCorrect:      args.totalCorrect,
        quizTotalAttempted:    args.totalAttempted,
        quizScoreHistory:      [args.score],
        firstStartedAt:        Timestamp.now(),
        lastStartedAt:         Timestamp.now(),
        firstCompletedAt:      Timestamp.now(),
        lastCompletedAt:       Timestamp.now(),
      };
      await setDoc(ref, { ...initial, updatedAt: now });
      return;
    }

    const cur = snap.data() as ExperimentMastery;
    const newBest    = Math.max(cur.quizBestScore ?? 0, args.score);
    const rawHist    = Array.isArray(cur.quizScoreHistory) ? cur.quizScoreHistory : [];
    const newHistory = [...rawHist, args.score].slice(-MAX_QUIZ_HISTORY);

    const updates: Record<string, unknown> = {
      quizAttempts:       increment(1),
      quizBestScore:      newBest,
      quizLastScore:      args.score,
      quizTotalCorrect:   increment(args.totalCorrect),
      quizTotalAttempted: increment(args.totalAttempted),
      quizScoreHistory:   newHistory,
      lastCompletedAt:    now,
      completed:          true,
      completedCount:     cur.completed ? increment(0) : increment(1),
      updatedAt:          now,
    };
    if (!cur.firstCompletedAt) {
      updates.firstCompletedAt = now;
      updates.firstCompletionSignal = "quiz";
    }
    await updateDoc(ref, updates);
  } catch {
    // Non-fatal
  }
}
