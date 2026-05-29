import type { Timestamp } from "firebase/firestore";

// ── Study Session ─────────────────────────────────────────────────────────────
// One doc per user session (app open → close / idle timeout).
// Powers: daily duration, weekly duration, preferred study time, session trends.

export interface StudySession {
  sessionId: string;
  uid: string;
  startedAt: Timestamp;
  endedAt: Timestamp | null;
  durationMs: number;           // total wall-clock duration, written on end
  activeDurationMs: number;     // tab-visible time only (paused when hidden)

  // Content touched this session
  chaptersVisited: string[];    // chapterId[]
  notesOpened: number;
  notesCompleted: number;
  mcqsAttempted: number;        // individual questions answered
  questionsCorrect: number;
  experimentsStarted: number;

  // Derived — set on end
  accuracyThisSession: number;  // 0-100

  // Time context
  date: string;                 // YYYY-MM-DD (local timezone)
  hourStarted: number;          // 0-23, for preferred-study-time analysis
}

// ── Per-Question Result ───────────────────────────────────────────────────────
// One doc per MCQ question per student.
// Powers: "retry these 15 questions", weak question detection, spaced repetition.

export interface QuestionResult {
  questionId: string;           // Firestore MCQ document ID
  chapterId: string;
  subjectId: string;
  totalAttempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  accuracy: number;             // 0-100
  lastAttemptedAt: Timestamp;
  lastResult: "correct" | "wrong";
  consecutiveCorrect: number;   // spaced repetition: strong if ≥ 3
  consecutiveWrong: number;     // retry flag if ≥ 2
  /** MCQ set this question belongs to (1, 2, …). Lets the AI mentor filter weak-question lists by set. */
  setNumber?: number;
}

// ── Chapter Mastery ───────────────────────────────────────────────────────────
// One doc per chapter per student. The primary mastery signal.
// Powers: "weak topic detection", exam readiness, revision planning.

export type MasteryStatus = "not_started" | "in_progress" | "practiced" | "mastered";
export type TrendDirection   = "improving" | "declining" | "stable" | "unknown";

export interface ChapterMastery {
  chapterId: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;

  // Class/medium copied from the chapter doc so the AI can reason per-track
  // without joining back. Optional because older rows may pre-date this field.
  classLevel?: string | null;
  medium?: string;

  // Notes engagement component (0-100)
  notesCompleted: number;         // absolute count
  notesEngagementScore: number;   // proxy 0-100: min(notesCompleted * 25, 100)
  totalReadingTimeMs: number;     // accumulated reading time across all sessions

  // MCQ component
  mcqBestScore: number;           // 0-100
  mcqLastScore: number;
  mcqAttemptCount: number;
  mcqTotalCorrect: number;
  mcqTotalAttempted: number;
  mcqAccuracy: number;            // 0-100
  mcqScoreHistory: number[];      // last 5 attempt scores (oldest→newest)

  // Computed composite
  masteryScore: number;           // 0-100, weighted: 0.4*notes + 0.6*mcq
  masteryStatus: MasteryStatus;
  trend: TrendDirection;
  improvementDelta: number;       // lastMcqScore - firstMcqScore

  // Temporal
  firstStudiedAt: Timestamp | null;
  lastStudiedAt: Timestamp | null;
  lastRevisedAt: Timestamp | null; // set when student returns after ≥ 3 days gap
  revisionCount: number;

  updatedAt: Timestamp;
}

// ── Experiment (Virtual Lab) Mastery ──────────────────────────────────────────
// One doc per virtual-lab sim per student.
// Powers: lab progress rung in the recommendation ladder, "you haven't finished
// the Heart Circulation lab" alerts, AI Mentor lab suggestions.

export type ExperimentCompletionSignal = "journey" | "interaction" | "quiz";

export interface ExperimentMastery {
  experimentId: string;           // sim registry id, e.g. "animal-cell"
  experimentTitle: string;        // human-readable, e.g. "Animal Cell"
  subjectId: string;
  subjectName: string;            // e.g. "Biology"
  chapterId: string | null;       // mapped via lab→chapter registry (Phase 7B); null until then

  // Exploration counters
  startedCount: number;           // times EXPLORE view entered
  completedCount: number;         // times completion heuristic fired

  // Status flags
  completed: boolean;             // ever completed
  firstCompletionSignal: ExperimentCompletionSignal | null;

  // Lab MCQ (separate from chapter MCQ so it doesn't pollute chapterMastery)
  quizAttempts: number;
  quizBestScore: number;          // 0-100
  quizLastScore: number;
  quizTotalCorrect: number;
  quizTotalAttempted: number;
  quizScoreHistory: number[];     // last 5 (oldest → newest)

  // Temporal
  firstStartedAt: Timestamp | null;
  lastStartedAt: Timestamp | null;
  firstCompletedAt: Timestamp | null;
  lastCompletedAt: Timestamp | null;

  updatedAt: Timestamp;
}

// ── Student Knowledge Profile ─────────────────────────────────────────────────
// Single document per student. The AI Academic Mentor reads THIS document.
// Rebuilt after significant events (MCQ attempt, daily first activity).
// Stored in top-level collection `studentKnowledgeProfiles/{uid}`.

export interface WeakTopicEntry {
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;
  masteryScore: number;           // < 40
  mcqAccuracy: number;
  daysSinceStudy: number;
  revisionCount: number;
}

export interface StrongTopicEntry {
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;
  masteryScore: number;           // > 75
  mcqAccuracy: number;
}

export interface RetryQuestion {
  questionId: string;
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;
  accuracy: number;               // < 50
  totalAttempts: number;
  consecutiveWrong: number;
}

export interface SubjectMasteryEntry {
  subjectId: string;
  subjectName: string;
  masteryScore: number;           // avg of chapter mastery scores in subject
  trend: TrendDirection;
  chaptersStudied: number;
  lastStudied: string;            // ISO YYYY-MM-DD or ""
}

export interface StudyBehaviorProfile {
  totalStudyTimeMs: number;
  avgDailyStudyTimeMs: number;
  preferredStudyHour: number;     // 0-23
  consistencyScore: number;       // 0-100
  currentStreak: number;
  longestStreak: number;
  activeDaysLast30: number;
  avgSessionDurationMs: number;
  totalSessions: number;
}

export interface LearningPatternProfile {
  averageMcqAccuracy: number;
  averageNotesEngagement: number;
  improvementTrend: TrendDirection;
  learningVelocity: number;       // chapters reaching mastery ≥ 60 per week
  strongestSubjectId: string | null;
  weakestSubjectId: string | null;
}

export interface RevisionProfile {
  chaptersNeedingRevision: string[]; // chapterId[] studied but not revisited in > 7 days
  avgRevisionGapDays: number;
  lastRevisionDate: string | null;   // ISO YYYY-MM-DD
  totalRevisions: number;
}

export interface StudentKnowledgeProfile {
  uid: string;

  // Copied from student profile for AI reads without extra joins
  classLevel: string;
  medium: string;

  // Mastery maps
  masteryMap: Record<string, number>;                    // chapterId → score
  subjectMastery: Record<string, SubjectMasteryEntry>;  // subjectId → entry
  weakTopicMap: Record<string, WeakTopicEntry>;          // chapterId → entry (score < 40)
  strongTopicMap: Record<string, StrongTopicEntry>;      // chapterId → entry (score > 75)

  // Behavioral profiles
  studyBehavior: StudyBehaviorProfile;
  learningPattern: LearningPatternProfile;
  revisionProfile: RevisionProfile;

  // AI-ready composite scores
  examReadinessScore: number;     // 0-100
  confidenceScore: number;        // 0-100, based on accuracy trends

  // Retry suggestions — AI can surface these directly
  suggestedRetryQuestions: RetryQuestion[];

  // Metadata
  updatedAt: Timestamp;
  version: number;                // increment on schema changes
}
