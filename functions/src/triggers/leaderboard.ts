/**
 * Leaderboard trigger — updates the student's entry in
 * weeklyLeaderboard/{weekKey}/entries/{uid} whenever their studentXP doc
 * is written (created or updated).
 *
 * Requires a Firestore composite index on
 * weeklyLeaderboard/{weekKey}/entries:  weeklyXP DESC
 * (create via Firebase Console → Firestore → Indexes if needed).
 */

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "@workspace/db";
import { FieldValue } from "firebase-admin/firestore";

/** Same week-key formula as client — YYYY-WNN (ISO week). */
function getCurrentWeekKey(): string {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now.getTime() - jan1.getTime()) / 86400000) + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const updateLeaderboardOnXPWrite = onDocumentWritten(
  { document: "studentXP/{uid}", region: "asia-south1" },
  async (event) => {
    const uid = event.params.uid;
    if (!event.data?.after?.exists) return; // deletion — leave entry as-is

    const xpData  = event.data.after.data() as Record<string, unknown>;
    const weekKey = getCurrentWeekKey();

    // Fetch student's name + classLevel from the students collection
    let name       = "Student";
    let classLevel = "";
    try {
      const studentSnap = await db.collection("students").doc(uid).get();
      if (studentSnap.exists) {
        const studentData = studentSnap.data() as Record<string, string>;
        name       = studentData.name       ?? "Student";
        classLevel = studentData.classLevel ?? "";
      }
    } catch { /* non-fatal */ }

    const entry = {
      uid,
      name,
      classLevel,               // stored so clients can filter per-class
      level:      xpData.level     ?? 1,
      levelTitle: "Level",
      totalXP:    xpData.totalXP   ?? 0,
      weeklyXP:   xpData.weeklyXP  ?? 0,
      badgeCount: ((xpData.earnedBadgeIds as string[] | undefined) ?? []).length,
      updatedAt:  FieldValue.serverTimestamp(),
    };

    await db
      .collection("weeklyLeaderboard")
      .doc(weekKey)
      .collection("entries")
      .doc(uid)
      .set(entry, { merge: true });
  },
);
