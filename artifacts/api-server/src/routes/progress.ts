import { Router, type IRouter } from "express";
import { and, eq, avg, count, sql } from "drizzle-orm";
import { db, progressTable, chaptersTable, subjectsTable } from "@workspace/db";
import { requireAuth, type AuthUser } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

function getUser(req: Request): AuthUser {
  return (req as Request & { user: AuthUser }).user;
}

router.get("/progress", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);
  const rows = await db
    .select({
      id: progressTable.id,
      userId: progressTable.userId,
      chapterId: progressTable.chapterId,
      chapterTitle: chaptersTable.title,
      subjectName: subjectsTable.name,
      mcqScore: progressTable.mcqScore,
      mcqTotal: progressTable.mcqTotal,
      visited: progressTable.visited,
      lastAccessedAt: progressTable.lastAccessedAt,
    })
    .from(progressTable)
    .leftJoin(chaptersTable, eq(progressTable.chapterId, chaptersTable.id))
    .leftJoin(subjectsTable, eq(chaptersTable.subjectId, subjectsTable.id))
    .where(eq(progressTable.userId, user.id))
    .orderBy(progressTable.lastAccessedAt);
  res.json(rows);
});

router.post("/progress/mcq-score", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);
  const { chapterId, score, total } = req.body;
  if (!chapterId || score == null || total == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [existing] = await db.select().from(progressTable).where(and(eq(progressTable.userId, user.id), eq(progressTable.chapterId, chapterId)));
  let row;
  if (existing) {
    [row] = await db.update(progressTable).set({ mcqScore: score, mcqTotal: total, lastAccessedAt: new Date() }).where(eq(progressTable.id, existing.id)).returning();
  } else {
    [row] = await db.insert(progressTable).values({ userId: user.id, chapterId, mcqScore: score, mcqTotal: total, visited: true, lastAccessedAt: new Date() }).returning();
  }

  const [withNames] = await db
    .select({
      id: progressTable.id,
      userId: progressTable.userId,
      chapterId: progressTable.chapterId,
      chapterTitle: chaptersTable.title,
      subjectName: subjectsTable.name,
      mcqScore: progressTable.mcqScore,
      mcqTotal: progressTable.mcqTotal,
      visited: progressTable.visited,
      lastAccessedAt: progressTable.lastAccessedAt,
    })
    .from(progressTable)
    .leftJoin(chaptersTable, eq(progressTable.chapterId, chaptersTable.id))
    .leftJoin(subjectsTable, eq(chaptersTable.subjectId, subjectsTable.id))
    .where(eq(progressTable.id, row!.id));

  res.json(withNames);
});

router.post("/progress/mark-chapter", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);
  const { chapterId } = req.body;
  if (!chapterId) {
    res.status(400).json({ error: "chapterId required" });
    return;
  }

  const [existing] = await db.select().from(progressTable).where(and(eq(progressTable.userId, user.id), eq(progressTable.chapterId, chapterId)));
  if (existing) {
    await db.update(progressTable).set({ visited: true, lastAccessedAt: new Date() }).where(eq(progressTable.id, existing.id));
  } else {
    await db.insert(progressTable).values({ userId: user.id, chapterId, visited: true, lastAccessedAt: new Date() });
  }
  res.json({ ok: true });
});

router.get("/dashboard/summary", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = getUser(req);

  const [totalChaptersRow] = await db.select({ count: sql<number>`count(*)::int` }).from(chaptersTable);
  const [visitedRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(progressTable)
    .where(and(eq(progressTable.userId, user.id), eq(progressTable.visited, true)));
  const [mcqAttemptsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(progressTable)
    .where(and(eq(progressTable.userId, user.id), sql`${progressTable.mcqScore} is not null`));
  const [avgScoreRow] = await db
    .select({ avg: sql<number>`coalesce(avg(mcq_score::float / nullif(mcq_total, 0) * 100), 0)` })
    .from(progressTable)
    .where(and(eq(progressTable.userId, user.id), sql`${progressTable.mcqTotal} > 0`));

  const recentChapters = await db
    .select({
      id: progressTable.id,
      userId: progressTable.userId,
      chapterId: progressTable.chapterId,
      chapterTitle: chaptersTable.title,
      subjectName: subjectsTable.name,
      mcqScore: progressTable.mcqScore,
      mcqTotal: progressTable.mcqTotal,
      visited: progressTable.visited,
      lastAccessedAt: progressTable.lastAccessedAt,
    })
    .from(progressTable)
    .leftJoin(chaptersTable, eq(progressTable.chapterId, chaptersTable.id))
    .leftJoin(subjectsTable, eq(chaptersTable.subjectId, subjectsTable.id))
    .where(eq(progressTable.userId, user.id))
    .orderBy(sql`${progressTable.lastAccessedAt} desc`)
    .limit(5);

  const subjectProgress = await db
    .select({
      subjectId: subjectsTable.id,
      subjectName: subjectsTable.name,
      chaptersTotal: sql<number>`count(distinct ${chaptersTable.id})::int`,
      chaptersVisited: sql<number>`count(distinct case when ${progressTable.visited} then ${chaptersTable.id} end)::int`,
    })
    .from(subjectsTable)
    .leftJoin(chaptersTable, eq(chaptersTable.subjectId, subjectsTable.id))
    .leftJoin(
      progressTable,
      and(eq(progressTable.chapterId, chaptersTable.id), eq(progressTable.userId, user.id))
    )
    .groupBy(subjectsTable.id, subjectsTable.name);

  res.json({
    totalChapters: totalChaptersRow?.count ?? 0,
    visitedChapters: visitedRow?.count ?? 0,
    totalMcqAttempts: mcqAttemptsRow?.count ?? 0,
    averageScore: Math.round((avgScoreRow?.avg ?? 0) * 10) / 10,
    recentChapters,
    subjectProgress,
  });
});

export default router;
