import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, experimentsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
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
  const exps = classLevel
    ? await db.select().from(experimentsTable).where(eq(experimentsTable.classLevel, classLevel as "Class IX" | "Class X"))
    : await db.select().from(experimentsTable);
  res.json(exps);
});

router.post("/experiments", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const data = pick(req.body) as Parameters<typeof db.insert>[0] extends infer _ ? Record<string, unknown> : never;
  const required = ["subject", "classLevel", "title", "objective", "procedure", "expectedResult", "explanation", "type"];
  for (const f of required) {
    if (!data[f]) { res.status(400).json({ error: `Missing field: ${f}` }); return; }
  }
  if (!data.difficulty) data.difficulty = "medium";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exp] = await db.insert(experimentsTable).values(data as any).returning();
  res.status(201).json(exp);
});

router.get("/experiments/:experimentId", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  const [exp] = await db.select().from(experimentsTable).where(eq(experimentsTable.id, id));
  if (!exp) { res.status(404).json({ error: "Experiment not found" }); return; }
  res.json(exp);
});

router.put("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  const data = pick(req.body);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exp] = await db.update(experimentsTable).set(data as any).where(eq(experimentsTable.id, id)).returning();
  if (!exp) { res.status(404).json({ error: "Experiment not found" }); return; }
  res.json(exp);
});

router.delete("/experiments/:experimentId", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.experimentId) ? req.params.experimentId[0] : req.params.experimentId, 10);
  await db.delete(experimentsTable).where(eq(experimentsTable.id, id));
  res.sendStatus(204);
});

export default router;
