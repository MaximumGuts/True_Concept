import {
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { chapterMasteryDoc, chapterMasteryCol } from "./paths";
import type { ChapterMastery, MasteryStatus, TrendDirection } from "./types";

// ── Mastery formula constants ──────────────────────────────────────────────────

// Notes engagement fallback: each note contributes 25 pts when total is unknown (4 notes = 100%)
const NOTE_ENGAGEMENT_PER_NOTE = 25;
// Weighted composite: notes 30%, MCQ 60%, lab 10%
const NOTES_WEIGHT = 0.30;
const MCQ_WEIGHT   = 0.60;
const LAB_WEIGHT   = 0.10;
// Mastery status thresholds
const MASTERED_THRESHOLD  = 75;
const PRACTICED_THRESHOLD = 50;
const IN_PROGRESS_MIN     = 1;
// Revision: return after this many days gap counts as a "revision"
const REVISION_GAP_DAYS = 3;
// Max score history entries kept inline
const MAX_SCORE_HISTORY = 5;

// ── Internal helpers ──────────────────────────────────────────────────────────

function computeMasteryScore(notesEngagement: number, mcqBest: number, labScore = 0): number {
  if (mcqBest === 0 && notesEngagement === 0 && labScore === 0) return 0;
  if (mcqBest === 0 && labScore === 0) return Math.round(notesEngagement * NOTES_WEIGHT * 1.5); // notes-only
  return Math.round(notesEngagement * NOTES_WEIGHT + mcqBest * MCQ_WEIGHT + labScore * LAB_WEIGHT);
}

function computeStatus(score: number, notesCompleted: number, mcqAttempts: number): MasteryStatus {
  if (notesCompleted === 0 && mcqAttempts === 0) return "not_started";
  if (score >= MASTERED_THRESHOLD) return "mastered";
  if (score >= PRACTICED_THRESHOLD) return "practiced";
  if (score >= IN_PROGRESS_MIN) return "in_progress";
  return "not_started";
}

function computeTrend(history: number[]): TrendDirection {
  if (history.length < 2) return "unknown";
  const first = history[0];
  const last  = history[history.length - 1];
  const delta = last - first;
  if (delta > 5)  return "improving";
  if (delta < -5) return "declining";
  return "stable";
}

function daysBetween(tsMs: number): number {
  return Math.floor((Date.now() - tsMs) / 86_400_000);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Called whenever a note in a chapter is marked completed.
 * Updates the notes-engagement component of chapter mastery.
 */
export async function onNoteCompleted(args: {
  uid: string;
  chapterId: string;
  subjectId: string;
  chapterTitle: string;
  subjectName: string;
  classLevel?: string | null;       // chapter's class — used by AI for per-track filtering
  medium?: string;                   // chapter's medium ("Assamese" | "English" | "Both")
  readingTimeMs?: number;
  totalNotesInChapter?: number; // when known, gives exact % instead of proxy formula
}): Promise<void> {
  const ref = chapterMasteryDoc(args.uid, args.chapterId);
  const snap = await getDoc(ref);

  try {
    const cur              = snap.exists() ? (snap.data() as ChapterMastery) : null;
    const newNotesCompleted = (cur?.notesCompleted ?? 0) + 1;
    const newEngagement = args.totalNotesInChapter
      ? Math.round((newNotesCompleted / args.totalNotesInChapter) * 100)
      : Math.min(100, newNotesCompleted * NOTE_ENGAGEMENT_PER_NOTE);

    if (!cur) {
      const mastery = computeMasteryScore(newEngagement, 0, 0);
      const initial: Omit<ChapterMastery, "updatedAt"> = {
        chapterId:            args.chapterId,
        subjectId:            args.subjectId,
        subjectName:          args.subjectName,
        chapterTitle:         args.chapterTitle,
        classLevel:           args.classLevel ?? null,
        medium:               args.medium ?? "Both",
        notesCompleted:       1,
        notesEngagementScore: newEngagement,
        totalReadingTimeMs:   args.readingTimeMs ?? 0,
        mcqBestScore:         0,
        mcqLastScore:         0,
        mcqAttemptCount:      0,
        mcqTotalCorrect:      0,
        mcqTotalAttempted:    0,
        mcqAccuracy:          0,
        mcqScoreHistory:      [],
        masteryScore:         mastery,
        masteryStatus:        computeStatus(mastery, 1, 0),
        trend:                "unknown",
        improvementDelta:     0,
        firstStudiedAt:       Timestamp.now(),
        lastStudiedAt:        Timestamp.now(),
        lastRevisedAt:        null,
        revisionCount:        0,
      };
      await setDoc(ref, { ...initial, updatedAt: serverTimestamp() });
      return;
    }

    // cur is ChapterMastery (not null) past this point
    const newMastery = computeMasteryScore(newEngagement, cur.mcqBestScore ?? 0, (cur as any).labCompletionScore ?? 0);
    const newStatus  = computeStatus(newMastery, newNotesCompleted, cur.mcqAttemptCount ?? 0);

    // Revision detection
    const lastStudiedMs = cur.lastStudiedAt instanceof Timestamp
      ? cur.lastStudiedAt.toMillis()
      : Date.now();
    const isRevision = daysBetween(lastStudiedMs) >= REVISION_GAP_DAYS;

    const updates: Record<string, unknown> = {
      notesCompleted:       newNotesCompleted,
      notesEngagementScore: newEngagement,
      totalReadingTimeMs:   increment(args.readingTimeMs ?? 0),
      masteryScore:         newMastery,
      masteryStatus:        newStatus,
      lastStudiedAt:        serverTimestamp(),
      updatedAt:            serverTimestamp(),
    };

    if (isRevision) {
      updates.lastRevisedAt = serverTimestamp();
      updates.revisionCount = increment(1);
    }
    if (!cur.firstStudiedAt) {
      updates.firstStudiedAt = serverTimestamp();
    }

    await updateDoc(ref, updates);
  } catch {
    // Mastery update must never break the main flow
  }
}

/**
 * Called whenever a student completes an MCQ set.
 * Updates the MCQ component of chapter mastery.
 */
export async function onMcqAttempted(args: {
  uid: string;
  chapterId: string;
  subjectId: string;
  chapterTitle: string;
  subjectName: string;
  classLevel?: string | null;
  medium?: string;
  score: number;          // 0-100
  totalCorrect: number;
  totalAttempted: number;
}): Promise<void> {
  const ref = chapterMasteryDoc(args.uid, args.chapterId);
  const snap = await getDoc(ref);

  try {
    if (!snap.exists()) {
      const engagement   = 0;
      const mastery      = computeMasteryScore(engagement, args.score);
      const initial: Omit<ChapterMastery, "updatedAt"> = {
        chapterId:            args.chapterId,
        subjectId:            args.subjectId,
        subjectName:          args.subjectName,
        chapterTitle:         args.chapterTitle,
        classLevel:           args.classLevel ?? null,
        medium:               args.medium ?? "Both",
        notesCompleted:       0,
        notesEngagementScore: 0,
        totalReadingTimeMs:   0,
        mcqBestScore:         args.score,
        mcqLastScore:         args.score,
        mcqAttemptCount:      1,
        mcqTotalCorrect:      args.totalCorrect,
        mcqTotalAttempted:    args.totalAttempted,
        mcqAccuracy:          args.totalAttempted > 0
          ? Math.round((args.totalCorrect / args.totalAttempted) * 100)
          : 0,
        mcqScoreHistory:      [args.score],
        masteryScore:         mastery,
        masteryStatus:        computeStatus(mastery, 0, 1),
        trend:                "unknown",
        improvementDelta:     0,
        firstStudiedAt:       Timestamp.now(),
        lastStudiedAt:        Timestamp.now(),
        lastRevisedAt:        null,
        revisionCount:        0,
      };
      await setDoc(ref, { ...initial, updatedAt: serverTimestamp() });
      return;
    }

    const cur = snap.data() as ChapterMastery;
    const newBest    = Math.max(cur.mcqBestScore ?? 0, args.score);
    const newTotalQ  = (cur.mcqTotalAttempted ?? 0) + args.totalAttempted;
    const newTotalC  = (cur.mcqTotalCorrect ?? 0) + args.totalCorrect;
    const newAccuracy = newTotalQ > 0 ? Math.round((newTotalC / newTotalQ) * 100) : 0;

    const rawHistory  = Array.isArray(cur.mcqScoreHistory) ? cur.mcqScoreHistory : [];
    const newHistory  = [...rawHistory, args.score].slice(-MAX_SCORE_HISTORY);
    const newTrend    = computeTrend(newHistory);
    const firstScore  = newHistory[0] ?? args.score;
    const delta       = args.score - firstScore;

    const newEngagement = cur.notesEngagementScore ?? 0;
    const newMastery    = computeMasteryScore(newEngagement, newBest, (cur as any).labCompletionScore ?? 0);
    const newAttempts   = (cur.mcqAttemptCount ?? 0) + 1;
    const newStatus     = computeStatus(newMastery, cur.notesCompleted ?? 0, newAttempts);

    // Revision detection
    const lastStudiedMs = cur.lastStudiedAt instanceof Timestamp
      ? cur.lastStudiedAt.toMillis()
      : Date.now();
    const isRevision = daysBetween(lastStudiedMs) >= REVISION_GAP_DAYS;

    const updates: Record<string, unknown> = {
      mcqBestScore:      newBest,
      mcqLastScore:      args.score,
      mcqAttemptCount:   increment(1),
      mcqTotalCorrect:   increment(args.totalCorrect),
      mcqTotalAttempted: increment(args.totalAttempted),
      mcqAccuracy:       newAccuracy,
      mcqScoreHistory:   newHistory,
      masteryScore:      newMastery,
      masteryStatus:     newStatus,
      trend:             newTrend,
      improvementDelta:  delta,
      lastStudiedAt:     serverTimestamp(),
      updatedAt:         serverTimestamp(),
    };

    if (isRevision) {
      updates.lastRevisedAt = serverTimestamp();
      updates.revisionCount = increment(1);
    }
    if (!cur.firstStudiedAt) {
      updates.firstStudiedAt = serverTimestamp();
    }
    // Backfill class/medium on legacy docs that pre-date these fields
    if (!cur.classLevel && args.classLevel) updates.classLevel = args.classLevel;
    if (!cur.medium && args.medium) updates.medium = args.medium;

    await updateDoc(ref, updates);
  } catch {
    // Non-fatal
  }
}

// ── Bulk reads for profile building ───────────────────────────────────────────

/** Fetch all chapter mastery docs for a student. Used by profile builder. */
export async function fetchAllChapterMastery(uid: string): Promise<ChapterMastery[]> {
  const snap = await getDocs(chapterMasteryCol(uid));
  return snap.docs.map((d) => d.data() as ChapterMastery);
}

/**
 * Computes per-subject mastery summary from chapter mastery docs.
 * Returns a map of subjectId → { avgMastery, lastStudied, chaptersStudied }.
 */
export function groupBySubject(
  masteries: ChapterMastery[]
): Record<string, { avg: number; count: number; lastStudied: string; subjectName: string }> {
  const groups: Record<string, { sum: number; count: number; lastStudied: string; subjectName: string }> = {};

  for (const m of masteries) {
    if (!groups[m.subjectId]) {
      groups[m.subjectId] = { sum: 0, count: 0, lastStudied: "", subjectName: m.subjectName };
    }
    const g = groups[m.subjectId];
    g.sum += m.masteryScore;
    g.count++;

    const raw = m.lastStudiedAt as unknown as { seconds: number } | null;
    const lastMs = m.lastStudiedAt instanceof Timestamp
      ? m.lastStudiedAt.toMillis()
      : (raw?.seconds ?? 0) * 1000;
    const dateStr = lastMs ? new Date(lastMs).toISOString().slice(0, 10) : "";
    if (dateStr > g.lastStudied) g.lastStudied = dateStr;
  }

  return Object.fromEntries(
    Object.entries(groups).map(([sid, g]) => [sid, { avg: Math.round(g.sum / g.count), ...g }])
  );
}

/**
 * Returns chapters that haven't been studied in more than `gapDays` days.
 */
export function findChaptersNeedingRevision(
  masteries: ChapterMastery[],
  gapDays = 7
): string[] {
  return masteries
    .filter((m) => {
      if (m.masteryStatus === "not_started") return false;
      const raw = m.lastStudiedAt as unknown as { seconds: number } | null;
      const lastMs = m.lastStudiedAt instanceof Timestamp
        ? m.lastStudiedAt.toMillis()
        : (raw?.seconds ?? 0) * 1000;
      if (!lastMs) return false;
      return daysBetween(lastMs) >= gapDays;
    })
    .map((m) => m.chapterId);
}
