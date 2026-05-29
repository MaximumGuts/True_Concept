import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { statsDoc } from "./paths";
import { defaultStudentStats } from "./types";
import { logActivity } from "./activity-service";
import { todayLocalDate, computeStreakUpdate } from "./streak";

/**
 * Logs a "started" event for an experiment. Cheap — only writes activity feed,
 * no counter increment (we increment on completion).
 */
export async function markExperimentStarted(args: {
  uid: string;
  experimentId: string;
  experimentTitle: string;
  subjectId?: string;
  subjectName?: string;
}) {
  void logActivity(args.uid, {
    type: "experiment_started",
    refId: args.experimentId,
    refTitle: args.experimentTitle,
    subjectId: args.subjectId,
    subjectName: args.subjectName,
  });
}

/**
 * Logs experiment completion + increments lifetime + per-subject counters.
 */
export async function markExperimentCompleted(args: {
  uid: string;
  experimentId: string;
  experimentTitle: string;
  subjectId?: string;
  subjectName?: string;
}) {
  const ref = statsDoc(args.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const init = defaultStudentStats(args.uid, snap as unknown as never);
    await setDoc(ref, {
      ...init,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const fresh = await getDoc(ref);
  const streak = computeStreakUpdate(
    fresh.data()?.lastActivityDate ?? "",
    fresh.data()?.currentStreak ?? 0,
    fresh.data()?.longestStreak ?? 0
  );

  const batch = writeBatch(db);
  const updates: Record<string, unknown> = {
    totalExperimentsCompleted: increment(1),
    lastActivityDate: todayLocalDate(),
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    updatedAt: serverTimestamp(),
  };
  if (args.subjectId) {
    updates[`subjectProgress.${args.subjectId}.subjectId`] = args.subjectId;
    updates[`subjectProgress.${args.subjectId}.experimentsCompleted`] = increment(1);
  }
  batch.update(ref, updates);
  await batch.commit();

  void logActivity(args.uid, {
    type: "experiment_completed",
    refId: args.experimentId,
    refTitle: args.experimentTitle,
    subjectId: args.subjectId,
    subjectName: args.subjectName,
  });
}
