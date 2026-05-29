import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAuth, type AuthUser } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

function getUser(req: Request): AuthUser {
  return (req as Request & { user: AuthUser }).user;
}

// GET /progress — chapter-level progress from studentProgress (new system)
router.get("/progress", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);

  const [masterySnap, chaptersSnap, subjectsSnap] = await Promise.all([
    db.collection("studentProgress").doc(user.id).collection("chapterMastery").get(),
    db.collection("chapters").get(),
    db.collection("subjects").get(),
  ]);

  const chapterMap = new Map(chaptersSnap.docs.map((d: any) => [d.id, d.data()]));
  const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data()]));

  const rows = masterySnap.docs.map((doc: any) => {
    const m = doc.data();
    const c: any = chapterMap.get(m.chapterId) || {};
    const s: any = subjectMap.get(m.subjectId || c.subjectId) || {};
    return {
      id:             doc.id,
      userId:         user.id,
      chapterId:      m.chapterId,
      chapterTitle:   m.chapterTitle || c.title || "",
      subjectName:    m.subjectName  || s.name  || "",
      subjectId:      m.subjectId    || c.subjectId || "",
      mcqScore:       m.mcqTotalCorrect   ?? null,
      mcqTotal:       m.mcqTotalAttempted ?? null,
      mcqBestScore:   m.mcqBestScore      ?? null,
      mcqAccuracy:    m.mcqAccuracy       ?? null,
      masteryScore:   m.masteryScore      ?? 0,
      masteryStatus:  m.masteryStatus     ?? "not_started",
      visited:        m.masteryStatus !== "not_started",
      notesCompleted: m.notesCompleted    ?? 0,
      lastAccessedAt: m.lastStudiedAt?.toDate?.()?.toISOString() ?? null,
    };
  }).sort((a: any, b: any) =>
    new Date(b.lastAccessedAt ?? 0).getTime() - new Date(a.lastAccessedAt ?? 0).getTime()
  );

  res.json(rows);
});

// POST /progress/mcq-score — legacy endpoint; client SDK handles new studentProgress writes
router.post("/progress/mcq-score", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);
  const { chapterId, score, total } = req.body;
  if (!chapterId || score == null || total == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const existingSnap = await db.collection("progress")
    .where("userId", "==", user.id)
    .where("chapterId", "==", chapterId)
    .limit(1).get();

  let pId: string;
  let pData: any;
  if (!existingSnap.empty) {
    const docRef = existingSnap.docs[0].ref;
    pId = docRef.id;
    await docRef.update({ mcqScore: score, mcqTotal: total, lastAccessedAt: new Date() });
    pData = { ...existingSnap.docs[0].data(), mcqScore: score, mcqTotal: total, lastAccessedAt: new Date() };
  } else {
    const newRef = db.collection("progress").doc();
    pId = newRef.id;
    pData = { userId: user.id, chapterId, mcqScore: score, mcqTotal: total, visited: true, lastAccessedAt: new Date() };
    await newRef.set(pData);
  }

  const chapterSnap = await db.collection("chapters").doc(chapterId).get();
  const chapterData: any = chapterSnap.exists ? chapterSnap.data() : {};
  const subjectSnap = chapterData.subjectId ? await db.collection("subjects").doc(chapterData.subjectId).get() : null;
  const subjectData: any = subjectSnap?.exists ? subjectSnap.data() : {};

  res.json([{
    id: pId, userId: pData.userId, chapterId: pData.chapterId,
    chapterTitle: chapterData.title ?? "", subjectName: subjectData.name ?? "",
    mcqScore: pData.mcqScore, mcqTotal: pData.mcqTotal,
    visited: pData.visited, lastAccessedAt: new Date().toISOString(),
  }]);
});

// POST /progress/mark-chapter — legacy; client SDK handles new studentProgress writes
router.post("/progress/mark-chapter", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);
  const { chapterId } = req.body;
  if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }

  const existingSnap = await db.collection("progress")
    .where("userId", "==", user.id)
    .where("chapterId", "==", chapterId)
    .limit(1).get();

  if (!existingSnap.empty) {
    await existingSnap.docs[0].ref.update({ visited: true, lastAccessedAt: new Date() });
  } else {
    await db.collection("progress").add({ userId: user.id, chapterId, visited: true, lastAccessedAt: new Date() });
  }
  res.json({ ok: true });
});

// GET /dashboard/summary — reads from studentProgress (new system)
router.get("/dashboard/summary", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);

  const [statsSnap, chaptersSnap, subjectsSnap, recentMasterySnap, allMasterySnap] = await Promise.all([
    db.collection("studentProgress").doc(user.id).get(),
    db.collection("chapters").get(),
    db.collection("subjects").get(),
    db.collection("studentProgress").doc(user.id).collection("chapterMastery")
      .orderBy("lastStudiedAt", "desc").limit(5).get(),
    db.collection("studentProgress").doc(user.id).collection("chapterMastery").get(),
  ]);

  const stats: any = statsSnap.exists ? statsSnap.data() : {};
  const totalChapters = chaptersSnap.size;
  const visitedChapters = allMasterySnap.docs.filter(
    (d: any) => d.data().masteryStatus !== "not_started"
  ).length;

  const totalMcqAttempted = stats.totalMcqsAttempted ?? 0;
  const totalMcqCorrect   = stats.totalMcqsCorrect   ?? 0;
  const averageScore = totalMcqAttempted > 0
    ? Math.round((totalMcqCorrect / totalMcqAttempted) * 100 * 10) / 10
    : 0;

  const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data()]));
  const recentChapters = recentMasterySnap.docs.map((doc: any) => {
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

  const subjectProgressMap = new Map<string, any>();
  for (const s of subjectsSnap.docs) {
    subjectProgressMap.set(s.id, {
      subjectId: s.id, subjectName: s.data().name,
      chaptersTotal: 0, chaptersVisited: 0,
      notesRead:     stats.subjectProgress?.[s.id]?.notesRead    ?? 0,
      mcqsAttempted: stats.subjectProgress?.[s.id]?.mcqsAttempted ?? 0,
      mcqsCorrect:   stats.subjectProgress?.[s.id]?.mcqsCorrect   ?? 0,
    });
  }
  for (const c of chaptersSnap.docs) {
    const data: any = c.data();
    if (subjectProgressMap.has(data.subjectId)) subjectProgressMap.get(data.subjectId).chaptersTotal++;
  }
  for (const doc of allMasterySnap.docs) {
    const m: any = doc.data();
    if (m.masteryStatus !== "not_started" && subjectProgressMap.has(m.subjectId)) {
      subjectProgressMap.get(m.subjectId).chaptersVisited++;
    }
  }

  res.json({
    totalChapters, visitedChapters,
    totalMcqAttempts: totalMcqAttempted, averageScore,
    recentChapters,
    subjectProgress: Array.from(subjectProgressMap.values()),
    totalNotesRead:           stats.totalNotesRead            ?? 0,
    totalMcqsCorrect:         totalMcqCorrect,
    accuracyPercent:          averageScore,
    currentStreak:            stats.currentStreak             ?? 0,
    longestStreak:            stats.longestStreak             ?? 0,
    experimentsCompleted:     stats.totalExperimentsCompleted ?? 0,
    lastStudiedChapterId:     stats.lastStudiedChapterId      ?? null,
    lastStudiedChapterTitle:  stats.lastStudiedChapterTitle   ?? null,
  });
});

export default router;
