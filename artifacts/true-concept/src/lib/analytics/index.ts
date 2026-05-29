/**
 * Barrel export for the analytics layer.
 *
 * Components and hooks should import from here, not from sub-modules directly.
 * The tracking engine (tracker) is the primary entry point for recording events.
 */

// Primary entry point — use tracker.track() for all events
export { tracker } from "./tracking-engine";
export type { EngineEvent } from "./tracking-engine";

// Types
export type {
  StudySession,
  QuestionResult,
  ChapterMastery,
  MasteryStatus,
  TrendDirection,
  StudentKnowledgeProfile,
  WeakTopicEntry,
  StrongTopicEntry,
  RetryQuestion,
  SubjectMasteryEntry,
  StudyBehaviorProfile,
  LearningPatternProfile,
  RevisionProfile,
} from "./types";

// Services (use tracker.track() instead of these directly for events)
export { fetchAllChapterMastery, groupBySubject } from "./mastery-service";
export { fetchKnowledgeProfile, computeAndPersistProfile } from "./knowledge-profile-service";
export { fetchRecentSessions }                              from "./session-service";
export { fetchQuestionResultsForChapter }                  from "./question-service";

// Paths (for direct Firestore reads in hooks)
export { chapterMasteryDoc, chapterMasteryCol, knowledgeProfileDoc } from "./paths";
