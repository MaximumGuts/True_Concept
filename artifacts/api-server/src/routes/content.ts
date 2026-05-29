import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

// ── Notification helper ────────────────────────────────────────────────────────
// Looks up chapter + subject and writes a notification doc so the bell icon works.
async function writeNotification(
  type: "new_note" | "new_mcq" | "new_qa" | "new_video",
  refId: string,
  refKind: "note" | "mcq" | "qa" | "chapter",
  chapterId: string,
  titleVerb: string   // e.g. "New Note", "New MCQ", "New Q&A", "New Video"
) {
  try {
    const [chapterSnap] = await Promise.all([db.collection("chapters").doc(chapterId).get()]);
    if (!chapterSnap.exists) return;
    const chapter = chapterSnap.data() as { title: string; subjectId: string; classLevel?: string; medium?: string };
    const subjectSnap = await db.collection("subjects").doc(chapter.subjectId).get();
    const subjectName: string = subjectSnap.exists ? (subjectSnap.data() as { name: string }).name : "";

    await db.collection("notifications").add({
      type,
      title: `${titleVerb} — ${chapter.title}`,
      body: subjectName ? `${subjectName} · ${chapter.title}` : chapter.title,
      refId,
      refKind,
      chapterId,
      chapterTitle: chapter.title,
      subjectId: chapter.subjectId,
      subjectName,
      classLevel: chapter.classLevel ?? null,
      medium: chapter.medium ?? "Both",
      createdAt: new Date(),
    });
  } catch (err) {
    // Notification failure must never break the main request
    console.error("[notification] write failed:", err);
  }
}

// Notes
router.get("/notes", async (req: Request, res: Response): Promise<void> => {
  const chapterId = req.query.chapterId as string;
  if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
  const snap = await db.collection("notes").where("chapterId", "==", chapterId).get();
  const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  res.json(docs);
});

router.post("/notes", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, title, content, type, fileUrl, youtubeId, order } = req.body;
  if (!chapterId || !title || content == null || !type) { res.status(400).json({ error: "Missing required fields" }); return; }
  
  const newRef = db.collection("notes").doc();
  const data = { chapterId, title, content, type, fileUrl: fileUrl || null, youtubeId: youtubeId || null, order: order ?? 0, createdAt: new Date() };
  await newRef.set(data);
  await writeNotification("new_note", newRef.id, "note", chapterId, "New Note");
  res.status(201).json({ id: newRef.id, ...data });
});

router.put("/notes/:noteId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
  const { chapterId, title, content, type, fileUrl, youtubeId, order } = req.body;
  
  const docRef = db.collection("notes").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) { res.status(404).json({ error: "Note not found" }); return; }
  
  const updates = { chapterId, title, content, type, fileUrl: fileUrl || null, youtubeId: youtubeId || null, order };
  await docRef.update(updates);
  res.json({ id, ...docSnap.data(), ...updates });
});

router.delete("/notes/:noteId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
  await db.collection("notes").doc(id).delete();
  res.sendStatus(204);
});

// MCQs
router.get("/mcqs", async (req: Request, res: Response): Promise<void> => {
  const chapterId = req.query.chapterId as string;
  if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
  const snap = await db.collection("mcqs").where("chapterId", "==", chapterId).get();
  const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  res.json(docs);
});

router.post("/mcqs", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, question, options, correctIndex, explanation, order } = req.body;
  if (!chapterId || !question || !options || correctIndex == null || !explanation) { res.status(400).json({ error: "Missing required fields" }); return; }
  
  const newRef = db.collection("mcqs").doc();
  const data = { chapterId, question, options, correctIndex, explanation, order: order ?? 0, createdAt: new Date() };
  await newRef.set(data);
  await writeNotification("new_mcq", newRef.id, "mcq", chapterId, "New MCQ");
  res.status(201).json({ id: newRef.id, ...data });
});

router.put("/mcqs/:mcqId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.mcqId) ? req.params.mcqId[0] : req.params.mcqId;
  const { chapterId, question, options, correctIndex, explanation, order } = req.body;
  
  const docRef = db.collection("mcqs").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) { res.status(404).json({ error: "MCQ not found" }); return; }
  
  const updates = { chapterId, question, options, correctIndex, explanation, order };
  await docRef.update(updates);
  res.json({ id, ...docSnap.data(), ...updates });
});

router.delete("/mcqs/:mcqId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.mcqId) ? req.params.mcqId[0] : req.params.mcqId;
  await db.collection("mcqs").doc(id).delete();
  res.sendStatus(204);
});

// Q&A
router.get("/qa", async (req: Request, res: Response): Promise<void> => {
  const chapterId = req.query.chapterId as string;
  if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
  const snap = await db.collection("qa").where("chapterId", "==", chapterId).get();
  const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  res.json(docs);
});

router.post("/qa", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, question, answer, explanation, youtubeId, isImportant, order } = req.body;
  if (!chapterId || !question || !answer || explanation == null) { res.status(400).json({ error: "Missing required fields" }); return; }
  
  const newRef = db.collection("qa").doc();
  const data = { chapterId, question, answer, explanation, youtubeId: youtubeId || null, isImportant: isImportant ?? false, order: order ?? 0, createdAt: new Date() };
  await newRef.set(data);
  await writeNotification("new_qa", newRef.id, "qa", chapterId, "New Q&A");
  res.status(201).json({ id: newRef.id, ...data });
});

router.put("/qa/:qaId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.qaId) ? req.params.qaId[0] : req.params.qaId;
  const { chapterId, question, answer, explanation, youtubeId, isImportant, order } = req.body;
  
  const docRef = db.collection("qa").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) { res.status(404).json({ error: "Q&A not found" }); return; }
  
  const updates = { chapterId, question, answer, explanation, youtubeId: youtubeId || null, isImportant, order };
  await docRef.update(updates);
  res.json({ id, ...docSnap.data(), ...updates });
});

router.delete("/qa/:qaId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.qaId) ? req.params.qaId[0] : req.params.qaId;
  await db.collection("qa").doc(id).delete();
  res.sendStatus(204);
});

// Videos
router.get("/videos", async (req: Request, res: Response): Promise<void> => {
  const chapterId = req.query.chapterId as string;
  if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
  const snap = await db.collection("videos").where("chapterId", "==", chapterId).get();
  res.json(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
});

router.post("/videos", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { chapterId, youtubeId, title, description } = req.body;
  if (!chapterId || !youtubeId || !title || !description) { res.status(400).json({ error: "Missing required fields" }); return; }
  
  const newRef = db.collection("videos").doc();
  const data = { chapterId, youtubeId, title, description, createdAt: new Date() };
  await newRef.set(data);
  await writeNotification("new_video", newRef.id, "chapter", chapterId, "New Video");
  res.status(201).json({ id: newRef.id, ...data });
});

router.put("/videos/:videoId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId;
  const { chapterId, youtubeId, title, description } = req.body;
  
  const docRef = db.collection("videos").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) { res.status(404).json({ error: "Video not found" }); return; }
  
  const updates = { chapterId, youtubeId, title, description };
  await docRef.update(updates);
  res.json({ id, ...docSnap.data(), ...updates });
});

router.delete("/videos/:videoId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId;
  await db.collection("videos").doc(id).delete();
  res.sendStatus(204);
});

export default router;
