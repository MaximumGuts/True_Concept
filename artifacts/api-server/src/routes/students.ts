import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

// GET /api/students — list all students (admin only)
router.get("/students", requireAdmin as (req: Request, res: Response, next: () => void) => void, async (_req: Request, res: Response): Promise<void> => {
  const snap = await db.collection("students").orderBy("createdAt", "desc").get();
  const students = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
    lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() ?? null,
  }));
  res.json(students);
});

export default router;
