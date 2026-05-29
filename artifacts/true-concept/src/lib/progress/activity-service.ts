import {
  addDoc,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { activityCol } from "./paths";
import type { ActivityEntry, ActivityType } from "./types";

const MAX_ACTIVITY_ENTRIES = 50;
const RECENT_FETCH_LIMIT = 20;

/**
 * Logs a single activity entry. Capped via deferred cleanup so we don't pay for
 * a query+delete on every write — only roughly every 10th call.
 */
export async function logActivity(
  uid: string,
  entry: {
    type: ActivityType;
    refId: string;
    refTitle: string;
    chapterId?: string;
    chapterTitle?: string;
    subjectId?: string;
    subjectName?: string;
    metadata?: ActivityEntry["metadata"];
  }
) {
  // Strip undefined values (Firestore rejects them)
  const clean: Record<string, unknown> = { type: entry.type, refId: entry.refId, refTitle: entry.refTitle };
  if (entry.chapterId)     clean.chapterId = entry.chapterId;
  if (entry.chapterTitle)  clean.chapterTitle = entry.chapterTitle;
  if (entry.subjectId)     clean.subjectId = entry.subjectId;
  if (entry.subjectName)   clean.subjectName = entry.subjectName;
  if (entry.metadata)      clean.metadata = entry.metadata;
  clean.timestamp = serverTimestamp();

  await addDoc(activityCol(uid), clean);

  // Probabilistic cleanup — runs ~10% of the time
  if (Math.random() < 0.1) {
    void cleanupOldActivity(uid);
  }
}

/** Fetches the most recent activity entries (for dashboard feed). */
export async function fetchRecentActivity(uid: string): Promise<ActivityEntry[]> {
  const q = query(
    activityCol(uid),
    orderBy("timestamp", "desc"),
    limit(RECENT_FETCH_LIMIT)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityEntry));
}

/**
 * Internal: deletes entries beyond the MAX. Runs occasionally so the activity
 * collection doesn't grow unbounded.
 */
async function cleanupOldActivity(uid: string) {
  try {
    const q = query(activityCol(uid), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    if (snap.size <= MAX_ACTIVITY_ENTRIES) return;
    const toDelete = snap.docs.slice(MAX_ACTIVITY_ENTRIES);
    await Promise.all(toDelete.map((d) => deleteDoc(d.ref)));
  } catch {
    // Cleanup failures are non-fatal
  }
}
