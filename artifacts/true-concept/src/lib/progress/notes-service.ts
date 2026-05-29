import { db } from "@/lib/firebase";
import {
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { noteDoc, notesCol, statsDoc } from "./paths";
import type { NoteProgress, NoteStatus } from "./types";
import { defaultStudentStats } from "./types";
import { logActivity } from "./activity-service";
import { tracker } from "@/lib/analytics/tracking-engine";

/** Threshold above which a note is considered "completed" via scroll. */
export const SCROLL_COMPLETION_THRESHOLD = 85;

/** Track in-flight writes per (uid, noteId) to prevent duplicate writes. */
const pendingWrites = new Set<string>();

function lockKey(uid: string, noteId: string) {
  return `${uid}:${noteId}`;
}

/**
 * Records that a student opened a note. Idempotent: if the note doc
 * already exists, only increments readCount and updates lastReadAt.
 */
export async function markNoteOpened(args: {
  uid: string;
  noteId: string;
  chapterId: string;
  subjectId: string;
  noteTitle?: string;
  chapterTitle?: string;
}) {
  const key = lockKey(args.uid, args.noteId);
  if (pendingWrites.has(key)) return;
  pendingWrites.add(key);

  try {
    const ref = noteDoc(args.uid, args.noteId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // First time opening this note — create the doc + log activity
      await setDoc(ref, {
        noteId: args.noteId,
        chapterId: args.chapterId,
        subjectId: args.subjectId,
        status: "in_progress" as NoteStatus,
        scrollPercent: 0,
        openedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
        completedAt: null,
        readCount: 1,
      });

      await ensureStatsDoc(args.uid);
      await updateDoc(statsDoc(args.uid), {
        lastStudiedChapterId: args.chapterId,
        lastStudiedChapterTitle: args.chapterTitle ?? null,
        lastStudiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      void logActivity(args.uid, {
        type: "note_opened",
        refId: args.noteId,
        refTitle: args.noteTitle ?? "Note",
        chapterId: args.chapterId,
        chapterTitle: args.chapterTitle,
        subjectId: args.subjectId,
      });
    } else {
      // Re-open — bump counters
      await updateDoc(ref, {
        lastReadAt: serverTimestamp(),
        readCount: increment(1),
      });
    }

    // Notify engine (session counters + chapter visited)
    tracker.track({
      type: "note_opened",
      uid: args.uid,
      noteId: args.noteId,
      chapterId: args.chapterId,
      subjectId: args.subjectId,
      noteTitle: args.noteTitle,
      chapterTitle: args.chapterTitle,
    });
  } finally {
    pendingWrites.delete(key);
  }
}

/**
 * Updates the highest scroll-percent reached. Only writes if the new value
 * is meaningfully greater (>5% increase) to avoid hammering Firestore.
 */
export async function updateScrollProgress(args: {
  uid: string;
  noteId: string;
  scrollPercent: number;       // 0-100
  readingTimeMs?: number;      // elapsed reading time to credit on auto-complete
  totalNotesInChapter?: number;
}) {
  const ref = noteDoc(args.uid, args.noteId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const current = (snap.data().scrollPercent as number) ?? 0;
  const next = Math.min(100, Math.max(0, args.scrollPercent));

  // Only write if scroll advanced ≥5% — debounce fired too aggressively otherwise
  if (next < current + 5) return;

  // Auto-complete when threshold reached
  const shouldComplete = next >= SCROLL_COMPLETION_THRESHOLD && snap.data().status !== "completed";

  if (shouldComplete) {
    // Pull the chapter/subject IDs for the activity log
    const { chapterId, subjectId, noteId } = snap.data() as NoteProgress;
    await markNoteCompleted({
      uid:                 args.uid,
      noteId,
      chapterId,
      subjectId,
      readingTimeMs:       args.readingTimeMs,
      totalNotesInChapter: args.totalNotesInChapter,
      noteTitle:           undefined,
      _existingDoc:        true,
      _newScrollPercent:   next,
    });
  } else {
    await updateDoc(ref, {
      scrollPercent: next,
      lastReadAt: serverTimestamp(),
    });
  }
}

/**
 * Marks a note as completed. Increments lifetime + per-subject counters
 * atomically in a batch write.
 */
export async function markNoteCompleted(args: {
  uid: string;
  noteId: string;
  chapterId: string;
  subjectId: string;
  noteTitle?: string;
  chapterTitle?: string;
  subjectName?: string;
  /** Chapter's classLevel — recorded on chapterMastery for AI per-track filtering. */
  classLevel?: string | null;
  /** Chapter's medium — recorded on chapterMastery for AI per-track filtering. */
  medium?: string;
  /** Time spent reading this note in the current session (ms). */
  readingTimeMs?: number;
  /** Total notes in the chapter — enables exact completion % in mastery score. */
  totalNotesInChapter?: number;
  /** internal — already verified note doc exists */
  _existingDoc?: boolean;
  /** internal — scroll percent at time of completion */
  _newScrollPercent?: number;
}) {
  const ref = noteDoc(args.uid, args.noteId);
  if (!args._existingDoc) {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Note was never opened — create it first
      await markNoteOpened(args);
    } else if (snap.data().status === "completed") {
      // Already completed — no-op (prevents duplicate counter increments)
      return;
    }
  }

  const batch = writeBatch(db);

  batch.update(ref, {
    status: "completed" as NoteStatus,
    completedAt: serverTimestamp(),
    lastReadAt: serverTimestamp(),
    scrollPercent: args._newScrollPercent ?? 100,
    totalReadingTimeMs: increment(args.readingTimeMs ?? 0),
  });

  await ensureStatsDoc(args.uid);
  batch.update(statsDoc(args.uid), {
    totalNotesRead: increment(1),
    [`subjectProgress.${args.subjectId}.subjectId`]: args.subjectId,
    [`subjectProgress.${args.subjectId}.notesRead`]: increment(1),
    lastStudiedChapterId: args.chapterId,
    lastStudiedChapterTitle: args.noteTitle ?? null,
    lastStudiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  void logActivity(args.uid, {
    type: "note_completed",
    refId: args.noteId,
    refTitle: args.noteTitle ?? "Note",
    chapterId: args.chapterId,
    subjectId: args.subjectId,
  });

  // Notify engine: updates session counter + triggers chapter mastery update
  tracker.track({
    type:                "note_completed",
    uid:                 args.uid,
    noteId:              args.noteId,
    chapterId:           args.chapterId,
    subjectId:           args.subjectId,
    chapterTitle:        args.chapterTitle        ?? "",
    subjectName:         args.subjectName         ?? "",
    classLevel:          args.classLevel,
    medium:              args.medium,
    readingTimeMs:       args.readingTimeMs       ?? 0,
    totalNotesInChapter: args.totalNotesInChapter,
  });
}

/** Fetch all note progress for one chapter (for showing badges in notes list). */
export async function fetchNotesProgressForChapter(uid: string, chapterId: string): Promise<NoteProgress[]> {
  const q = query(notesCol(uid), where("chapterId", "==", chapterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as NoteProgress);
}

/** Internal helper — creates the stats doc if missing. */
async function ensureStatsDoc(uid: string) {
  const ref = statsDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // serverTimestamp() doesn't work in defaultStudentStats — use it inline
    const init = defaultStudentStats(uid, snap as unknown as never);
    await setDoc(ref, {
      ...init,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
