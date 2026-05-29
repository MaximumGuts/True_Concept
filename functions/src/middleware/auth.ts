import jwt from "jsonwebtoken";
import type { Request } from "firebase-functions/v2/https";

const JWT_SECRET = process.env.SESSION_SECRET ?? "trueconcept-secret-2024";

export interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "student";
  name: string;
}

export interface AuthError {
  status: number;
  error: string;
}

export function signToken(user: AuthUser): string {
  // 180 days — students stay signed in for 6 months without re-OTP.
  // This drastically reduces SMS auth costs (Phone Auth is ~₹0.83/SMS in India,
  // and there is no longer a free monthly quota).
  return jwt.sign(user, JWT_SECRET, { expiresIn: "180d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Extract the authenticated user from a request's Authorization header.
 * Returns null if no valid token is present (does not throw).
 */
export function extractAuthUser(req: Request): AuthUser | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}

/**
 * Require a valid authenticated user. Throws an AuthError if not present.
 */
export function requireAuth(req: Request): AuthUser {
  const user = extractAuthUser(req);
  if (!user) {
    const err: AuthError = { status: 401, error: "Unauthorized" };
    throw err;
  }
  return user;
}

/**
 * Require an authenticated admin user. Throws an AuthError if not admin.
 */
export function requireAdmin(req: Request): AuthUser {
  const user = requireAuth(req);
  if (user.role !== "admin") {
    const err: AuthError = { status: 403, error: "Admin access required" };
    throw err;
  }
  return user;
}
