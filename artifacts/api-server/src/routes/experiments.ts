import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

const FIELDS = [
  "subject", "classLevel", "title", "objective", "theory", "apparatus",
  "procedure", "expectedResult", "explanation", "videoUrl", "hints",
  "summary", "type", "difficulty",
] as const;

function pick(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of FIELDS) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
}

router.get("/experiments", async (req: Request, res: Response): Promise<void> => {
  const { classLevel } = req.query;
  let query: any = db.collection("experiments");
  if (classLevel) {
    query = query.where("classLevel", "==", classLevel);
  }
  
  const snap = await query.get();
  const exps = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  res.json(exps);
});

router.post("/experiments", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const data = pick(req.body);
  const required = ["subject", "classLevel", "title", "objective", "procedure", "expectedResult", "explanation", "type"];
  for (const f of required) {
    if (!data[f]) { res.status(400).json({ error: `Missing field: ${f}` }); return; }
  }
  if (!data.difficulty) data.difficulty = "medium";
  
  const newRef = db.collection("experiments").doc();
  const newData = { ...data, createdAt: new Date() };
  await newRef.set(newData);
  res.status(201).json({ id: newRef.id, ...newData });
});

router.get("/experiments/:experimentId", async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId;
  const docSnap = await db.collection("experiments").doc(id).get();
  if (!docSnap.exists) { res.status(404).json({ error: "Experiment not found" }); return; }
  res.json({ id: docSnap.id, ...docSnap.data() });
});

router.put("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId;
  const data = pick(req.body);
  
  const docRef = db.collection("experiments").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) { res.status(404).json({ error: "Experiment not found" }); return; }
  
  await docRef.update(data);
  res.json({ id, ...docSnap.data(), ...data });
});

router.delete("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId;
  await db.collection("experiments").doc(id).delete();
  res.sendStatus(204);
});

export default router;
