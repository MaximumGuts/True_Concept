import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, experimentsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.get("/experiments", async (req: Request, res: Response): Promise<void> => {
  const { classLevel } = req.query;
  const exps = classLevel
    ? await db.select().from(experimentsTable).where(eq(experimentsTable.classLevel, classLevel as "Class IX" | "Class X"))
    : await db.select().from(experimentsTable);
  res.json(exps);
});

router.post("/experiments", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const { classLevel, title, objective, procedure, expectedResult, explanation, type, difficulty } = req.body;
  if (!classLevel || !title || !objective || !procedure || !expectedResult || !explanation || !type) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [exp] = await db.insert(experimentsTable).values({ classLevel, title, objective, procedure, expectedResult, explanation, type, difficulty: difficulty ?? "medium" }).returning();
  res.status(201).json(exp);
});

router.get("/experiments/:experimentId", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  const [exp] = await db.select().from(experimentsTable).where(eq(experimentsTable.id, id));
  if (!exp) {
    res.status(404).json({ error: "Experiment not found" });
    return;
  }
  res.json(exp);
});

router.put("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  const { classLevel, title, objective, procedure, expectedResult, explanation, type, difficulty } = req.body;
  const [exp] = await db.update(experimentsTable).set({ classLevel, title, objective, procedure, expectedResult, explanation, type, difficulty }).where(eq(experimentsTable.id, id)).returning();
  if (!exp) {
    res.status(404).json({ error: "Experiment not found" });
    return;
  }
  res.json(exp);
});

router.delete("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  await db.delete(experimentsTable).where(eq(experimentsTable.id, id));
  res.sendStatus(204);
});

export default router;
