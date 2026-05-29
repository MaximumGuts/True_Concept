import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAdmin, requireAuth, type AuthUser } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.get("/subjects", async (req: Request, res: Response): Promise<void> => {
  const subjectsSnap = await db.collection("subjects").get();
  const subjects = subjectsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  
  const result = await Promise.all(subjects.map(async (s: any) => {
    const chaptersSnap = await db.collection("chapters").where("subjectId", "==", s.id).count().get();
    return { ...s, chapterCount: chaptersSnap.data().count };
  }));
  res.json(result);
});

router.post("/subjects", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { name, description, icon, classLevels, color } = req.body;
  if (!name || !description || !icon || !classLevels || !color) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const newRef = db.collection("subjects").doc();
  const newSubject = { name, description, icon, classLevels, color, createdAt: new Date() };
  await newRef.set(newSubject);
  res.status(201).json({ id: newRef.id, ...newSubject, chapterCount: 0 });
});

router.get("/subjects/:subjectId", async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId;
  const docSnap = await db.collection("subjects").doc(id).get();
  if (!docSnap.exists) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  
  const countSnap = await db.collection("chapters").where("subjectId", "==", id).count().get();
  res.json({ id: docSnap.id, ...docSnap.data(), chapterCount: countSnap.data().count });
});

router.put("/subjects/:subjectId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId;
  const { name, description, icon, classLevels, color } = req.body;
  
  const docRef = db.collection("subjects").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  
  const updates = { name, description, icon, classLevels, color };
  await docRef.update(updates);
  
  const countSnap = await db.collection("chapters").where("subjectId", "==", id).count().get();
  res.json({ id, ...docSnap.data(), ...updates, chapterCount: countSnap.data().count });
});

router.delete("/subjects/:subjectId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId;
  const docRef = db.collection("subjects").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  await docRef.delete();
  res.sendStatus(204);
});

export default router;
