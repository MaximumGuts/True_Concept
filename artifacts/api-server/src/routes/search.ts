import { Router, type IRouter } from "express";
import { ilike, or, eq, and } from "drizzle-orm";
import { db, chaptersTable, qaTable, subjectsTable } from "@workspace/db";
import type { Request, Response } from "express";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/search", async (req: Request, res: Response): Promise<void> => {
  const q = req.query.q as string;
  if (!q || q.trim().length < 2) {
    res.json({ chapters: [], questions: [] });
    return;
  }

  const pattern = `%${q.trim()}%`;

  const chapters = await db
    .select({
      id: chaptersTable.id,
      subjectId: chaptersTable.subjectId,
      subjectName: subjectsTable.name,
      classLevel: chaptersTable.classLevel,
      title: chaptersTable.title,
      chapterNumber: chaptersTable.chapterNumber,
      description: chaptersTable.description,
      hasNotes: sql<boolean>`false`,
      hasMcqs: sql<boolean>`false`,
      hasQa: sql<boolean>`false`,
      hasVideo: sql<boolean>`false`,
    })
    .from(chaptersTable)
    .leftJoin(subjectsTable, eq(chaptersTable.subjectId, subjectsTable.id))
    .where(or(ilike(chaptersTable.title, pattern), ilike(chaptersTable.description, pattern)))
    .limit(10);

  const questions = await db
    .select()
    .from(qaTable)
    .where(or(ilike(qaTable.question, pattern), ilike(qaTable.answer, pattern)))
    .limit(10);

  res.json({ chapters, questions });
});

export default router;
