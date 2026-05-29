import type { Timestamp } from "firebase/firestore";

// ────────────────────────────────────────────────────────────────────────────
// Aggregate Stats — single doc per student, lightweight, read for dashboard
// ────────────────────────────────────────────────────────────────────────────

export interface SubjectAggregate {
  subjectId: string;
  notesRead: number;
  mcqsAttempted: number;
  mcqsCorrect: number;
  experimentsCompleted: number;
}

export interface StudentStats {
  uid: string;
  // Lifetime counters
  totalNotesRead: number;
  totalMcqsAttempted: number;
  totalMcqsCorrect: number;
  totalExperimentsCompleted: number;
  // Streak tracking (consecutive days with at least 1 activity)
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;          // YYYY-MM-DD (local date)
  // Quick-resume info
  lastStudiedChapterId: string | null;
  lastStudiedChapterTitle: string | null;
  lastStudiedAt: Timestamp | null;
  // Per-subject breakdown for dashboard pie/bars
  subjectProgress: Record<string, SubjectAggregate>;
  // Bookkeeping
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ────────────────────────────────────────────────────────────────────────────
// Per-Note Progress — subcollection doc
// ────────────────────────────────────────────────────────────────────────────

export type NoteStatus = "unread" | "in_progress" | "completed";

export interface NoteProgress {
  noteId: string;
  chapterId: string;
  subjectId: string;
  status: NoteStatus;
  scrollPercent: number;             // 0-100, max ever reached
  openedAt: Timestamp;
  lastReadAt: Timestamp;
  completedAt: Timestamp | null;
  readCount: number;                 // how many times opened
  totalReadingTimeMs: number;        // accumulated reading time across all sessions
}

// ────────────────────────────────────────────────────────────────────────────
// Per-MCQ-Set Progress — subcollection doc keyed by `${chapterId}_${setId}`
// ────────────────────────────────────────────────────────────────────────────

export interface McqAttempt {
  attemptedAt: Timestamp;
  score: number;                     // 0-100
  correctAnswers: number;
  totalQuestions: number;
  durationSec: number;
}

export interface McqProgress {
  setKey: string;                    // `${chapterId}_${setId}` for stable doc ID
  chapterId: string;
  subjectId: string;
  setId: string;
  totalQuestions: number;
  attemptCount: number;
  bestScore: number;                 // 0-100
  lastScore: number;
  totalCorrect: number;              // sum across all attempts
  totalAttempted: number;            // sum across all attempts
  status: "not_started" | "attempted" | "completed";  // completed = scored ≥80%
  firstAttemptAt: Timestamp;
  lastAttemptAt: Timestamp;
  recentAttempts: McqAttempt[];      // last 5 attempts inline (avoid extra reads)
}

// ────────────────────────────────────────────────────────────────────────────
// Recent Activity — subcollection doc, capped at 50 entries via cleanup
// ────────────────────────────────────────────────────────────────────────────

export type ActivityType =
  | "note_opened"
  | "note_completed"
  | "mcq_attempted"
  | "mcq_completed"
  | "experiment_started"
  | "experiment_completed"
  | "qa_viewed"
  | "video_played";

export interface ActivityEntry {
  id: string;                        // auto-generated doc ID
  type: ActivityType;
  refId: string;                     // noteId / chapterId / experimentId
  refTitle: string;                  // human-readable title for UI
  chapterId?: string;
  chapterTitle?: string;
  subjectId?: string;
  subjectName?: string;
  metadata?: {
    score?: number;                  // for mcq_completed
    correctAnswers?: number;
    totalQuestions?: number;
  };
  timestamp: Timestamp;
}

// ────────────────────────────────────────────────────────────────────────────
// Dashboard Summary — derived/computed shape (not stored as-is)
// ────────────────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  notesCompleted: number;
  notesInProgress: number;
  mcqsAttempted: number;
  mcqsCompleted: number;
  accuracyPercent: number;           // 0-100
  experimentsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedChapterId: string | null;
  lastStudiedChapterTitle: string | null;
  recentActivity: ActivityEntry[];
  subjectProgress: SubjectAggregate[];
}

// ────────────────────────────────────────────────────────────────────────────
// Defaults — used when creating a fresh stats doc for a new student
// ────────────────────────────────────────────────────────────────────────────

export function defaultStudentStats(uid: string, now: Timestamp): StudentStats {
  return {
    uid,
    totalNotesRead: 0,
    totalMcqsAttempted: 0,
    totalMcqsCorrect: 0,
    totalExperimentsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
    lastStudiedChapterId: null,
    lastStudiedChapterTitle: null,
    lastStudiedAt: null,
    subjectProgress: {},
    createdAt: now,
    updatedAt: now,
  };
}
