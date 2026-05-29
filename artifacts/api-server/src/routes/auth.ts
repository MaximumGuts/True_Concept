import { Router, type IRouter } from "express";
import { db, firebaseAuth } from "@workspace/db";
import { signToken, requireAuth, type AuthUser } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

// Admin login — username + password against Firestore users collection
router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const usersSnap = await db.collection("users").where("username", "==", username).get();
  if (usersSnap.empty) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const userDoc = usersSnap.docs[0];
  const user = userDoc.data();
  if (user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const authUser: AuthUser = { id: userDoc.id, username: user.username, role: user.role as "admin" | "student", name: user.name };
  const token = signToken(authUser);
  req.log.info({ userId: userDoc.id }, "Admin logged in");
  res.json({ user: authUser, token });
});

// Student phone login — verifies Firebase ID token, creates/gets student profile
router.post("/auth/phone-login", async (req: Request, res: Response): Promise<void> => {
  const { idToken, name, classLevel, medium, board } = req.body;

  if (!idToken) {
    res.status(400).json({ error: "Firebase ID token required" });
    return;
  }

  let decoded: { uid: string; phone_number?: string };
  try {
    decoded = await firebaseAuth.verifyIdToken(idToken);
  } catch (err) {
    req.log.error({ err, tokenPreview: idToken?.slice(0, 40) }, "verifyIdToken failed");
    const code = (err as { code?: string })?.code ?? "unknown";
    const message = (err as { message?: string })?.message ?? "Token verification failed";
    res.status(401).json({ error: "Invalid or expired token", code, detail: message });
    return;
  }

  const { uid, phone_number: phone } = decoded;
  const studentRef = db.collection("students").doc(uid);
  const studentSnap = await studentRef.get();

  if (!studentSnap.exists) {
    // New student — profile required
    if (!name || !classLevel || !medium || !board) {
      res.json({ needsProfile: true });
      return;
    }
    await studentRef.set({
      phone: phone ?? "",
      name,
      classLevel,
      medium,
      board,
      createdAt: new Date(),
      lastLogin: new Date(),
    });
  } else {
    await studentRef.update({ lastLogin: new Date() });
  }

  const profile = studentSnap.exists ? studentSnap.data() : { name, classLevel, medium, board };
  const authUser: AuthUser = {
    id: uid,
    username: phone ?? uid,
    role: "student",
    name: profile!.name,
  };

  const token = signToken(authUser);
  req.log.info({ uid, phone }, "Student phone login");
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
