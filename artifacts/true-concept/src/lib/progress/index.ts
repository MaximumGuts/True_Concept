/**
 * Barrel export — single import point for the progress system.
 * Use this in components/pages: `import { useDashboardStats } from "@/lib/progress"`
 */

// Types
export type {
  StudentStats,
  NoteProgress,
  NoteStatus,
  McqProgress,
  McqAttempt,
  ActivityEntry,
  ActivityType,
  DashboardSummary,
  SubjectAggregate,
} from "./types";

// Services
export {
  markNoteOpened,
  markNoteCompleted,
  updateScrollProgress,
  fetchNotesProgressForChapter,
  SCROLL_COMPLETION_THRESHOLD,
} from "./notes-service";

export {
  recordMcqAttempt,
  fetchMcqProgressForChapter,
  MCQ_COMPLETION_THRESHOLD,
} from "./mcq-service";

export {
  markExperimentStarted,
  markExperimentCompleted,
} from "./experiments-service";

export {
  fetchRecentActivity,
  logActivity,
} from "./activity-service";

export {
  fetchStudentProfile,
  clearProfileCache,
  type StudentProfile,
} from "./profile-service";

export { getGreeting, getFirstName, type Greeting, type TimeOfDay } from "./greeting";
export { todayLocalDate, computeStreakUpdate } from "./streak";
export { buildMcqSetKey } from "./paths";
