import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

async function enrichChapters(chapters: any[]) {
  if (chapters.length === 0) return [];
  
  const subjectsSnap = await db.collection("subjects").get();
  const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data().name]));

  return await Promise.all(chapters.map(async (c) => {
    const [notesSnap, mcqsSnap, qaSnap, videosSnap] = await Promise.all([
      db.collection("notes").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("mcqs").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("qa").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("videos").where("chapterId", "==", c.id).limit(1).get()
    ]);
    
    return {
      ...c,
      subjectName: subjectMap.get(c.subjectId) ?? "",
      hasNotes: !notesSnap.empty,
      hasMcqs: !mcqsSnap.empty,
      hasQa: !qaSnap.empty,
      hasVideo: !videosSnap.empty,
    };
  }));
}

router.get("/chapters", async (req: Request, res: Response): Promise<void> => {
  const { subjectId, classLevel } = req.query;
  
  let query: any = db.collection("chapters");
  if (subjectId) query = query.where("subjectId", "==", subjectId);
  if (classLevel) query = query.where("classLevel", "==", classLevel);
  
  // We cannot order directly if we have equality filters on multiple fields without a composite index, 
  // but let's sort in memory for simplicity or rely on firestore if index exists.
  const snap = await query.get();
  let chapters = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  
  chapters.sort((a: any, b: any) => a.chapterNumber - b.chapterNumber);

  res.json(await enrichChapters(chapters));
});

router.post("/chapters", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
  if (!subjectId || !classLevel || !title || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  
  const newRef = db.collection("chapters").doc();
  const data = {
    subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber: chapterNumber ?? 1, description, createdAt: new Date()
  };
  await newRef.set(data);
  
  const enriched = await enrichChapters([{ id: newRef.id, ...data }]);
  res.status(201).json(enriched[0]);
});

router.get("/chapters/:chapterId", async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId;
  const docSnap = await db.collection("chapters").doc(id).get();
  if (!docSnap.exists) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  const enriched = await enrichChapters([{ id: docSnap.id, ...docSnap.data() }]);
  res.json(enriched[0]);
});

router.put("/chapters/:chapterId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId;
  const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
  
  const docRef = db.collection("chapters").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  
  const updates = { subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber, description };
  await docRef.update(updates);
  
  const enriched = await enrichChapters([{ id, ...docSnap.data(), ...updates }]);
  res.json(enriched[0]);
});

router.delete("/chapters/:chapterId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.chapterId) ? req.params.chapterId[0] : req.params.chapterId;
  await db.collection("chapters").doc(id).delete();
  res.sendStatus(204);
});

export default router;
