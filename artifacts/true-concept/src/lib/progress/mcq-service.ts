import { db } from "@/lib/firebase";
import {
  getDoc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  increment,
  writeBatch,
  where,
  Timestamp,
} from "firebase/firestore";
import { mcqDoc, mcqsCol, statsDoc, buildMcqSetKey } from "./paths";
import { defaultStudentStats, type McqProgress, type McqAttempt } from "./types";
import { logActivity } from "./activity-service";
import { todayLocalDate, computeStreakUpdate } from "./streak";
import { tracker } from "@/lib/analytics/tracking-engine";

/** Score percentage above which an MCQ set is considered "completed". */
export const MCQ_COMPLETION_THRESHOLD = 80;

/** Max number of attempt history entries kept inline in the MCQ doc. */
const MAX_RECENT_ATTEMPTS = 5;

/**
 * Records one MCQ attempt. The MCQ doc is keyed by `chapterId_setId` so
 * repeat attempts UPDATE the same doc (no attempt explosion).
 *
 * Atomically:
 *   1. Updates per-set doc (best score, last score, attempt list)
 *   2. Increments lifetime + per-subject counters in stats doc
 *   3. Updates streak based on today's activity
 *   4. Logs an activity entry for the dashboard feed
 */
export async function recordMcqAttempt(args: {
  uid: string;
  chapterId: string;
  setId: string;
  subjectId: string;
  totalQuestions: number;
  correctAnswers: number;
  durationSec: number;
  chapterTitle?: string;
  subjectName?: string;
  classLevel?: string | null;       // chapter's class — recorded on mastery doc
  medium?: string;                   // chapter's medium — recorded on mastery doc
}) {
  const setKey = buildMcqSetKey(args.chapterId, args.setId);
  const ref = mcqDoc(args.uid, setKey);
  const score = Math.round((args.correctAnswers / Math.max(1, args.totalQuestions)) * 100);

  const snap = await getDoc(ref);
  const now = Timestamp.now();

  const newAttempt: McqAttempt = {
    attemptedAt: now,
    score,
    correctAnswers: args.correctAnswers,
    totalQuestions: args.totalQuestions,
    durationSec: args.durationSec,
  };

  const batch = writeBatch(db);

  if (!snap.exists()) {
    // First attempt — create the doc
    const initialDoc: McqProgress = {
      setKey,
      chapterId: args.chapterId,
      subjectId: args.subjectId,
      setId: args.setId,
      totalQuestions: args.totalQuestions,
      attemptCount: 1,
      bestScore: score,
      lastScore: score,
      totalCorrect: args.correctAnswers,
      totalAttempted: args.totalQuestions,
      status: score >= MCQ_COMPLETION_THRESHOLD ? "completed" : "attempted",
      firstAttemptAt: now,
      lastAttemptAt: now,
      recentAttempts: [newAttempt],
    };
    batch.set(ref, initialDoc);
  } else {
    const cur = snap.data() as McqProgress;
    const newRecentAttempts = [newAttempt, ...(cur.recentAttempts ?? [])].slice(0, MAX_RECENT_ATTEMPTS);
    const bestScore = Math.max(cur.bestScore ?? 0, score);
    const status = bestScore >= MCQ_COMPLETION_THRESHOLD ? "completed" : "attempted";

    batch.update(ref, {
      attemptCount: increment(1),
      lastScore: score,
      bestScore,
      totalCorrect: increment(args.correctAnswers),
      totalAttempted: increment(args.totalQuestions),
      status,
      lastAttemptAt: now,
      recentAttempts: newRecentAttempts,
    });
  }

  // Stats updates
  await ensureStatsDoc(args.uid);
  const statsRef = statsDoc(args.uid);
  const statsSnap = await getDoc(statsRef);
  const streak = computeStreakUpdate(
    statsSnap.data()?.lastActivityDate ?? "",
    statsSnap.data()?.currentStreak ?? 0,
    statsSnap.data()?.longestStreak ?? 0
  );

  batch.update(statsRef, {
    totalMcqsAttempted: increment(args.totalQuestions),
    totalMcqsCorrect: increment(args.correctAnswers),
    [`subjectProgress.${args.subjectId}.subjectId`]: args.subjectId,
    [`subjectProgress.${args.subjectId}.mcqsAttempted`]: increment(args.totalQuestions),
    [`subjectProgress.${args.subjectId}.mcqsCorrect`]: increment(args.correctAnswers),
    lastStudiedChapterId: args.chapterId,
    lastStudiedChapterTitle: args.chapterTitle ?? null,
    lastStudiedAt: serverTimestamp(),
    lastActivityDate: todayLocalDate(),
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  void logActivity(args.uid, {
    type: score >= MCQ_COMPLETION_THRESHOLD ? "mcq_completed" : "mcq_attempted",
    refId: setKey,
    refTitle: args.chapterTitle ? `MCQ — ${args.chapterTitle}` : "MCQ Set",
    chapterId: args.chapterId,
    chapterTitle: args.chapterTitle,
    subjectId: args.subjectId,
    subjectName: args.subjectName,
    metadata: {
      score,
      correctAnswers: args.correctAnswers,
      totalQuestions: args.totalQuestions,
    },
  });

  // Notify engine: updates chapter mastery + triggers knowledge profile rebuild
  tracker.track({
    type:           "mcq_set_completed",
    uid:            args.uid,
    chapterId:      args.chapterId,
    subjectId:      args.subjectId,
    chapterTitle:   args.chapterTitle ?? "",
    subjectName:    args.subjectName  ?? "",
    classLevel:     args.classLevel,
    medium:         args.medium,
    score,
    totalCorrect:   args.correctAnswers,
    totalAttempted: args.totalQuestions,
  });
}

/** Fetch MCQ progress for all sets in one chapter (for badges in MCQ list). */
export async function fetchMcqProgressForChapter(uid: string, chapterId: string): Promise<McqProgress[]> {
  const q = query(mcqsCol(uid), where("chapterId", "==", chapterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as McqProgress);
}

async function ensureStatsDoc(uid: string) {
  const ref = statsDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const init = defaultStudentStats(uid, snap as unknown as never);
    await setDoc(ref, {
      ...init,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
