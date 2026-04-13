import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { signToken, requireAuth, type AuthUser } from "../middlewares/auth";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const authUser: AuthUser = { id: user.id, username: user.username, role: user.role as "admin" | "student", name: user.name };
  const token = signToken(authUser);
  req.log.info({ userId: user.id }, "User logged in");
  res.json({ user: authUser, token });
});

router.post("/auth/logout", (_req: Request, res: Response): void => {
  res.json({ ok: true });
});

router.get("/auth/me", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = (req as Request & { user: AuthUser }).user;
  res.json(user);
});

export default router;
