import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db, chaptersTable, subjectsTable, notesTable, mcqsTable, qaTable, videosTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

async function enrichChapters(chapters: (typeof chaptersTable.$inferSelect)[]) {
  if (chapters.length === 0) return [];
  const ids = chapters.map((c) => c.id);

  const subjectIds = [...new Set(chapters.map((c) => c.subjectId))];
  const subjects = await db.select({ id: subjectsTable.id, name: subjectsTable.name }).from(subjectsTable);
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const [noteCounts, mcqCounts, qaCounts, videoCounts] = await Promise.all([
    db.select({ chapterId: notesTable.chapterId, count: sql<number>`count(*)::int` }).from(notesTable).groupBy(notesTable.chapterId),
    db.select({ chapterId: mcqsTable.chapterId, count: sql<number>`count(*)::int` }).from(mcqsTable).groupBy(mcqsTable.chapterId),
    db.select({ chapterId: qaTable.chapterId, count: sql<number>`count(*)::int` }).from(qaTable).groupBy(qaTable.chapterId),
    db.select({ chapterId: videosTable.chapterId, count: sql<number>`count(*)::int` }).from(videosTable).groupBy(videosTable.chapterId),
  ]);

  const nm = new Map(noteCounts.map((r) => [r.chapterId, r.count]));
  const mm = new Map(mcqCounts.map((r) => [r.chapterId, r.count]));
  const qm = new Map(qaCounts.map((r) => [r.chapterId, r.count]));
  const vm = new Map(videoCounts.map((r) => [r.chapterId, r.count]));

  return chapters.map((c) => ({
    ...c,
    subjectName: subjectMap.get(c.subjectId) ?? "",
    hasNotes: (nm.get(c.id) ?? 0) > 0,
    hasMcqs: (mm.get(c.id) ?? 0) > 0,
    hasQa: (qm.get(c.id) ?? 0) > 0,
    hasVideo: (vm.get(c.id) ?? 0) > 0,
  }));
}

router.get("/chapters", async (req: Request, res: Response): Promise<void> => {
  const { subjectId, classLevel } = req.query;
  const conditions = [];
  if (subjectId) conditions.push(eq(chaptersTable.subjectId, parseInt(subjectId as string, 10)));
  if (classLevel) conditions.push(eq(chaptersTable.classLevel, classLevel as "Class IX" | "Class X"));

  const chapters = conditions.length
    ? await db.select().from(chaptersTable).where(and(...conditions)).orderBy(chaptersTable.chapterNumber)
    : await db.select().from(chaptersTable).orderBy(chaptersTable.chapterNumber);

  res.json(await enrichChapters(chapters));
});

router.post("/chapters", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
  if (!subjectId || !classLevel || !title || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [chapter] = await db.insert(chaptersTable).values({
    subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber: chapterNumber ?? 1, description,
  }).returning();
  const enriched = await enrichChapters([chapter]);
  res.status(201).json(enriched[0]);
});

router.get("/chapters/:chapterId", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId, 10);
  const [chapter] = await db.select().from(chaptersTable).where(eq(chaptersTable.id, id));
  if (!chapter) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  const enriched = await enrichChapters([chapter]);
  res.json(enriched[0]);
});

router.put("/chapters/:chapterId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId, 10);
  const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
  const [chapter] = await db.update(chaptersTable).set({
    subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber, description,
  }).where(eq(chaptersTable.id, id)).returning();
  if (!chapter) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  const enriched = await enrichChapters([chapter]);
  res.json(enriched[0]);
});

router.delete("/chapters/:chapterId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId, 10);
  const [chapter] = await db.delete(chaptersTable).where(eq(chaptersTable.id, id)).returning();
  if (!chapter) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
