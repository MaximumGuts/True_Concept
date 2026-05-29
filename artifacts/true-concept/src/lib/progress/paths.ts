import { db } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";

/**
 * Single source of truth for Firestore paths used by progress tracking.
 *
 * Layout:
 *   studentProgress/{uid}                    — aggregate stats (1 doc / student)
 *   studentProgress/{uid}/notes/{noteId}     — per-note progress
 *   studentProgress/{uid}/mcqs/{setKey}      — per-MCQ-set progress
 *   studentProgress/{uid}/activity/{autoId}  — recent activity feed
 *
 * Why one root + subcollections (not flat top-level collections):
 *   - All a student's data lives under one path → 1 security rule covers everything
 *   - Subcollections only get read on-demand (notes list page, MCQ history page)
 *   - Aggregate stats are a SINGLE doc → dashboard = 1 read
 */

export const COL_STUDENT_PROGRESS = "studentProgress";
export const SUB_NOTES = "notes";
export const SUB_MCQS = "mcqs";
export const SUB_ACTIVITY = "activity";

/** Doc ref for the aggregate stats of one student. */
export const statsDoc = (uid: string) =>
  doc(db, COL_STUDENT_PROGRESS, uid);

/** Subcollection of notes progress for one student. */
export const notesCol = (uid: string) =>
  collection(db, COL_STUDENT_PROGRESS, uid, SUB_NOTES);

/** Doc ref for a single note's progress. */
export const noteDoc = (uid: string, noteId: string) =>
  doc(db, COL_STUDENT_PROGRESS, uid, SUB_NOTES, noteId);

/** Subcollection of MCQ progress for one student. */
export const mcqsCol = (uid: string) =>
  collection(db, COL_STUDENT_PROGRESS, uid, SUB_MCQS);

/**
 * Doc ref for one MCQ set's progress.
 * The setKey is composite: `${chapterId}_${setId}` — stable so the same set
 * always writes to the same doc (prevents duplicate attempt docs).
 */
export const mcqDoc = (uid: string, setKey: string) =>
  doc(db, COL_STUDENT_PROGRESS, uid, SUB_MCQS, setKey);

/** Subcollection of recent activity entries. */
export const activityCol = (uid: string) =>
  collection(db, COL_STUDENT_PROGRESS, uid, SUB_ACTIVITY);

/** Helper to build the composite key for an MCQ set. */
export const buildMcqSetKey = (chapterId: string, setId: string) =>
  `${chapterId}_${setId}`;
