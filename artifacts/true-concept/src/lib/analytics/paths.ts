import { db } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";

/**
 * Firestore layout for AI analytics layer:
 *
 *   studentProgress/{uid}/sessions/{sessionId}             — study sessions
 *   studentProgress/{uid}/questionResults/{questionId}     — per-MCQ-question results
 *   studentProgress/{uid}/chapterMastery/{chapterId}       — chapter mastery scores
 *   studentProgress/{uid}/experimentMastery/{experimentId} — virtual-lab sim mastery
 *   studentKnowledgeProfiles/{uid}                         — AI-ready knowledge profile
 */

export const COL_KNOWLEDGE_PROFILES  = "studentKnowledgeProfiles";
export const SUB_SESSIONS            = "sessions";
export const SUB_QUESTION_RESULTS    = "questionResults";
export const SUB_CHAPTER_MASTERY     = "chapterMastery";
export const SUB_EXPERIMENT_MASTERY  = "experimentMastery";

// ── Session refs ──────────────────────────────────────────────────────────────

export const sessionsCol = (uid: string) =>
  collection(db, "studentProgress", uid, SUB_SESSIONS);

export const sessionDoc = (uid: string, sessionId: string) =>
  doc(db, "studentProgress", uid, SUB_SESSIONS, sessionId);

// ── Per-question refs ─────────────────────────────────────────────────────────

export const questionResultsCol = (uid: string) =>
  collection(db, "studentProgress", uid, SUB_QUESTION_RESULTS);

export const questionResultDoc = (uid: string, questionId: string) =>
  doc(db, "studentProgress", uid, SUB_QUESTION_RESULTS, questionId);

// ── Chapter mastery refs ──────────────────────────────────────────────────────

export const chapterMasteryCol = (uid: string) =>
  collection(db, "studentProgress", uid, SUB_CHAPTER_MASTERY);

export const chapterMasteryDoc = (uid: string, chapterId: string) =>
  doc(db, "studentProgress", uid, SUB_CHAPTER_MASTERY, chapterId);

// ── Experiment mastery refs ───────────────────────────────────────────────────

export const experimentMasteryCol = (uid: string) =>
  collection(db, "studentProgress", uid, SUB_EXPERIMENT_MASTERY);

export const experimentMasteryDoc = (uid: string, experimentId: string) =>
  doc(db, "studentProgress", uid, SUB_EXPERIMENT_MASTERY, experimentId);

// ── Knowledge profile refs ────────────────────────────────────────────────────

export const knowledgeProfileDoc = (uid: string) =>
  doc(db, COL_KNOWLEDGE_PROFILES, uid);
