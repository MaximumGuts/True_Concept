import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.get("/search", async (req: Request, res: Response): Promise<void> => {
  const q = (req.query.q as string)?.toLowerCase();
  if (!q || q.trim().length < 2) {
    res.json({ chapters: [], questions: [] });
    return;
  }

  // Firestore doesn't support generic ILIKE across multiple fields easily.
  // A hacky solution is to fetch all chapters and filter them in memory,
  // which works for small datasets but isn't scalable.
  const chaptersSnap = await db.collection("chapters").get();
  const subjectsSnap = await db.collection("subjects").get();
  const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data().name]));
  
  const allChapters = chaptersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  
  const chapterMetaMap = new Map<string, { classLevel: string; medium: string }>();
  allChapters.forEach((c: any) => {
    chapterMetaMap.set(c.id, { classLevel: c.classLevel, medium: c.medium ?? "Both" });
  });

  const chapters = allChapters.filter((c: any) =>
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  ).map((c: any) => ({
    id: c.id,
    subjectId: c.subjectId,
    subjectName: subjectMap.get(c.subjectId) ?? "",
    classLevel: c.classLevel,
    medium: c.medium ?? "Both",
    title: c.title,
    chapterNumber: c.chapterNumber,
    description: c.description,
    hasNotes: false,
    hasMcqs: false,
    hasQa: false,
    hasVideo: false,
  })).slice(0, 10);

  const qaSnap = await db.collection("qa").get();
  const questions = qaSnap.docs
    .map((d: any) => ({ id: d.id, ...d.data() }))
    .filter((qa: any) => qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q))
    .map((qa: any) => {
      const meta = chapterMetaMap.get(qa.chapterId);
      return {
        ...qa,
        classLevel: meta?.classLevel ?? null,
        medium:     meta?.medium     ?? "Both",
      };
    })
    .slice(0, 10);

  res.json({ chapters, questions });
});

export default router;
