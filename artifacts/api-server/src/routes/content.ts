import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, notesTable, mcqsTable, qaTable, videosTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

// Notes
router.get("/notes", async (req: Request, res: Response): Promise<void> => {
  const chapterId = parseInt(req.query.chapterId as string, 10);
  if (!chapterId) {
    res.status(400).json({ error: "chapterId required" });
    return;
  }
  const notes = await db.select().from(notesTable).where(eq(notesTable.chapterId, chapterId)).orderBy(notesTable.order);
  res.json(notes);
});

router.post("/notes", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, title, content, type, fileUrl, order } = req.body;
  if (!chapterId || !title || content == null || !type) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [note] = await db.insert(notesTable).values({ chapterId, title, content, type, fileUrl, order: order ?? 0 }).returning();
  res.status(201).json(note);
});

router.put("/notes/:noteId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId, 10);
  const { chapterId, title, content, type, fileUrl, order } = req.body;
  const [note] = await db.update(notesTable).set({ chapterId, title, content, type, fileUrl, order }).where(eq(notesTable.id, id)).returning();
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json(note);
});

router.delete("/notes/:noteId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId, 10);
  await db.delete(notesTable).where(eq(notesTable.id, id));
  res.sendStatus(204);
});

// MCQs
router.get("/mcqs", async (req: Request, res: Response): Promise<void> => {
  const chapterId = parseInt(req.query.chapterId as string, 10);
  if (!chapterId) {
    res.status(400).json({ error: "chapterId required" });
    return;
  }
  const mcqs = await db.select().from(mcqsTable).where(eq(mcqsTable.chapterId, chapterId)).orderBy(mcqsTable.order);
  res.json(mcqs);
});

router.post("/mcqs", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, question, options, correctIndex, explanation, order } = req.body;
  if (!chapterId || !question || !options || correctIndex == null || !explanation) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [mcq] = await db.insert(mcqsTable).values({ chapterId, question, options, correctIndex, explanation, order: order ?? 0 }).returning();
  res.status(201).json(mcq);
});

router.put("/mcqs/:mcqId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.mcqId) ? req.params.mcqId[0] : req.params.mcqId, 10);
  const { chapterId, question, options, correctIndex, explanation, order } = req.body;
  const [mcq] = await db.update(mcqsTable).set({ chapterId, question, options, correctIndex, explanation, order }).where(eq(mcqsTable.id, id)).returning();
  if (!mcq) {
    res.status(404).json({ error: "MCQ not found" });
    return;
  }
  res.json(mcq);
});

router.delete("/mcqs/:mcqId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.mcqId) ? req.params.mcqId[0] : req.params.mcqId, 10);
  await db.delete(mcqsTable).where(eq(mcqsTable.id, id));
  res.sendStatus(204);
});

// Q&A
router.get("/qa", async (req: Request, res: Response): Promise<void> => {
  const chapterId = parseInt(req.query.chapterId as string, 10);
  if (!chapterId) {
    res.status(400).json({ error: "chapterId required" });
    return;
  }
  const qa = await db.select().from(qaTable).where(eq(qaTable.chapterId, chapterId)).orderBy(qaTable.order);
  res.json(qa);
});

router.post("/qa", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, question, answer, explanation, isImportant, order } = req.body;
  if (!chapterId || !question || !answer || explanation == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [item] = await db.insert(qaTable).values({ chapterId, question, answer, explanation, isImportant: isImportant ?? false, order: order ?? 0 }).returning();
  res.status(201).json(item);
});

router.put("/qa/:qaId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.qaId) ? req.params.qaId[0] : req.params.qaId, 10);
  const { chapterId, question, answer, explanation, isImportant, order } = req.body;
  const [item] = await db.update(qaTable).set({ chapterId, question, answer, explanation, isImportant, order }).where(eq(qaTable.id, id)).returning();
  if (!item) {
    res.status(404).json({ error: "Q&A not found" });
    return;
  }
  res.json(item);
});

router.delete("/qa/:qaId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.qaId) ? req.params.qaId[0] : req.params.qaId, 10);
  await db.delete(qaTable).where(eq(qaTable.id, id));
  res.sendStatus(204);
});

// Videos
router.get("/videos", async (req: Request, res: Response): Promise<void> => {
  const chapterId = parseInt(req.query.chapterId as string, 10);
  if (!chapterId) {
    res.status(400).json({ error: "chapterId required" });
    return;
  }
  const videos = await db.select().from(videosTable).where(eq(videosTable.chapterId, chapterId));
  res.json(videos);
});

router.post("/videos", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, youtubeId, title, description } = req.body;
  if (!chapterId || !youtubeId || !title || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [video] = await db.insert(videosTable).values({ chapterId, youtubeId, title, description }).returning();
  res.status(201).json(video);
});

router.put("/videos/:videoId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId, 10);
  const { chapterId, youtubeId, title, description } = req.body;
  const [video] = await db.update(videosTable).set({ chapterId, youtubeId, title, description }).where(eq(videosTable.id, id)).returning();
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json(video);
});

router.delete("/videos/:videoId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId, 10);
  await db.delete(videosTable).where(eq(videosTable.id, id));
  res.sendStatus(204);
});

export default router;
