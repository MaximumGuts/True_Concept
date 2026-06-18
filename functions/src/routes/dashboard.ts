import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath } from "../utils/router.js";
import { requireAuth, type AuthError } from "../middleware/auth.js";

export const dashboard = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/dashboard");

  try {
    // GET /api/dashboard/summary
    // Reads from studentProgress/{uid} (new system) — one doc read + subjects for totals.
    // Optional query params `classLevel` and `medium` restrict total/visited counts
    // and subject-progress rows so the percentages reflect THIS student's track only.
    if (req.method === "GET" && subPath === "/summary") {
      const user = requireAuth(req);
      const classLevel = (req.query.classLevel as string | undefined)?.trim() || null;
      const medium     = (req.query.medium as string | undefined)?.trim() || null;
      const board      = (req.query.board as string | undefined)?.trim() || null;

      const [statsSnap, chaptersSnap, subjectsSnap, masterySnap] = await Promise.all([
        db.collection("studentProgress").doc(user.id).get(),
        db.collection("chapters").get(),
        db.collection("subjects").get(),
        db.collection("studentProgress").doc(user.id).collection("chapterMastery")
          .orderBy("lastStudiedAt", "desc").limit(5).get(),
      ]);

      const stats: any = statsSnap.exists ? statsSnap.data() : {};

      // Filter chapter docs by the student's class/medium track. A chapter with
      // medium === "Both" applies to either Assamese or English students.
      const trackChapters = chaptersSnap.docs.filter((c: any) => {
        const d = c.data();
        if (classLevel && d.classLevel && d.classLevel !== classLevel) return false;
        if (medium && d.medium && d.medium !== "Both" && d.medium !== medium) return false;
        if (board  && d.board  && d.board  !== "Both" && d.board  !== board)  return false;
        return true;
      });
      const trackChapterIds = new Set(trackChapters.map((c: any) => c.id));
      const totalChapters = trackChapters.length;

      // Count visited chapters within the track only.
      const allMasterySnap = await db.collection("studentProgress").doc(user.id)
        .collection("chapterMastery").get();
      const visitedChapters = allMasterySnap.docs.filter((d: any) => {
        const data = d.data();
        if (data.masteryStatus === "not_started") return false;
        // Prefer the chapterMastery's own class/medium (recorded at write-time).
        // Fall back to the chapter doc if the legacy mastery row didn't carry them.
        if (classLevel || medium) {
          const cl = data.classLevel ?? null;
          const md = data.medium ?? null;
          if (cl || md) {
            if (classLevel && cl && cl !== classLevel) return false;
            if (medium && md && md !== "Both" && md !== medium) return false;
            return true;
          }
          return trackChapterIds.has(data.chapterId);
        }
        return true;
      }).length;

      // Lifetime MCQ stats from stats doc
      const totalMcqAttempted = stats.totalMcqsAttempted ?? 0;
      const totalMcqCorrect   = stats.totalMcqsCorrect   ?? 0;
      const averageScore = totalMcqAttempted > 0
        ? Math.round((totalMcqCorrect / totalMcqAttempted) * 100 * 10) / 10
        : 0;

      // Recent chapters from chapterMastery subcollection (already sorted by lastStudiedAt desc)
      const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data()]));
      const recentChapters = masterySnap.docs.map((doc: any) => {
        const m = doc.data();
        const s: any = subjectMap.get(m.subjectId) || {};
        return {
          chapterId:      m.chapterId,
          chapterTitle:   m.chapterTitle  || "",
          subjectName:    m.subjectName   || s.name || "",
          mcqScore:       m.mcqTotalCorrect   ?? null,
          mcqTotal:       m.mcqTotalAttempted ?? null,
          mcqBestScore:   m.mcqBestScore      ?? null,
          masteryScore:   m.masteryScore      ?? 0,
          masteryStatus:  m.masteryStatus     ?? "not_started",
          visited:        true,
          lastAccessedAt: m.lastStudiedAt?.toDate?.()?.toISOString() ?? null,
        };
      });

      // Per-subject breakdown — only include subjects that have any chapter in
      // this student's track, and count chapters within the track only.
      const subjectIdsInTrack = new Set(trackChapters.map((c: any) => (c.data() as any).subjectId));
      const subjectProgressMap = new Map<string, any>();
      for (const s of subjectsSnap.docs) {
        if (!subjectIdsInTrack.has(s.id)) continue;
        subjectProgressMap.set(s.id, {
          subjectId: s.id, subjectName: s.data().name,
          chaptersTotal: 0, chaptersVisited: 0,
          // New fields from studentProgress stats doc
          notesRead:    (stats.subjectProgress?.[s.id]?.notesRead        ?? 0),
          mcqsAttempted:(stats.subjectProgress?.[s.id]?.mcqsAttempted    ?? 0),
          mcqsCorrect:  (stats.subjectProgress?.[s.id]?.mcqsCorrect      ?? 0),
        });
      }
      for (const c of trackChapters) {
        const data: any = c.data();
        if (subjectProgressMap.has(data.subjectId)) {
          subjectProgressMap.get(data.subjectId).chaptersTotal++;
        }
      }
      for (const doc of allMasterySnap.docs) {
        const m: any = doc.data();
        if (m.masteryStatus === "not_started") continue;
        if (!subjectProgressMap.has(m.subjectId)) continue;
        // Only count if it's a chapter from this track
        const inTrack = trackChapterIds.has(m.chapterId) ||
          ((classLevel == null && medium == null));
        if (!inTrack) continue;
        subjectProgressMap.get(m.subjectId).chaptersVisited++;
      }

      res.json({
        // Legacy fields (API client compatibility)
        totalChapters,
        visitedChapters,
        totalMcqAttempts: totalMcqAttempted,
        averageScore,
        recentChapters,
        subjectProgress: Array.from(subjectProgressMap.values()),
        // New enriched fields
        totalNotesRead:           stats.totalNotesRead            ?? 0,
        totalMcqsCorrect:         totalMcqCorrect,
        accuracyPercent:          averageScore,
        currentStreak:            stats.currentStreak             ?? 0,
        longestStreak:            stats.longestStreak             ?? 0,
        experimentsCompleted:     stats.totalExperimentsCompleted ?? 0,
        lastStudiedChapterId:     stats.lastStudiedChapterId      ?? null,
        lastStudiedChapterTitle:  stats.lastStudiedChapterTitle   ?? null,
      });
      return;
    }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) { res.status(authErr.status).json({ error: authErr.error }); return; }
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
