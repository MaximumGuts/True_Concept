import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, subjectsTable, chaptersTable } from "@workspace/db";
import { requireAdmin, requireAuth, type AuthUser } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.get("/subjects", async (req: Request, res: Response): Promise<void> => {
  const subjects = await db.select().from(subjectsTable);
  const chapterCounts = await db
    .select({ subjectId: chaptersTable.subjectId, count: sql<number>`count(*)::int` })
    .from(chaptersTable)
    .groupBy(chaptersTable.subjectId);
  const countMap = new Map(chapterCounts.map((c) => [c.subjectId, c.count]));
  const result = subjects.map((s) => ({ ...s, chapterCount: countMap.get(s.id) ?? 0 }));
  res.json(result);
});

router.post("/subjects", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { name, description, icon, classLevels, color } = req.body;
  if (!name || !description || !icon || !classLevels || !color) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [subject] = await db.insert(subjectsTable).values({ name, description, icon, classLevels, color }).returning();
  res.status(201).json({ ...subject, chapterCount: 0 });
});

router.get("/subjects/:subjectId", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId, 10);
  const [subject] = await db.select().from(subjectsTable).where(eq(subjectsTable.id, id));
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(chaptersTable)
    .where(eq(chaptersTable.subjectId, id));
  res.json({ ...subject, chapterCount: countRow?.count ?? 0 });
});

router.put("/subjects/:subjectId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId, 10);
  const { name, description, icon, classLevels, color } = req.body;
  const [subject] = await db.update(subjectsTable).set({ name, description, icon, classLevels, color }).where(eq(subjectsTable.id, id)).returning();
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  const [countRow] = await db.select({ count: sql<number>`count(*)::int` }).from(chaptersTable).where(eq(chaptersTable.subjectId, id));
  res.json({ ...subject, chapterCount: countRow?.count ?? 0 });
});

router.delete("/subjects/:subjectId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId, 10);
  const [subject] = await db.delete(subjectsTable).where(eq(subjectsTable.id, id)).returning();
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
