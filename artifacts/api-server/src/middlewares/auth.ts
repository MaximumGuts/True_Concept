import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET ?? "trueconcept-secret-2024";

export interface AuthUser {
  id: number;
  username: string;
  role: "admin" | "student";
  name: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  (req as Request & { user: AuthUser }).user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    const user = (req as Request & { user: AuthUser }).user;
    if (!user || user.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const user = verifyToken(token);
    if (user) {
      (req as Request & { user?: AuthUser }).user = user;
    }
  }
  next();
}
