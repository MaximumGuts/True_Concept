import type { Request } from "firebase-functions/v2/https";

/**
 * Response-like interface for Firebase Functions.
 * Firebase Functions v2 uses Express-compatible response objects,
 * so we define a minimal interface to avoid importing Express directly.
 */
interface FunctionsResponse {
  set(name: string, value: string): void;
  status(code: number): FunctionsResponse;
  send(body: string): void;
}

/**
 * Handle CORS for Firebase Functions.
 * Sets permissive headers (all origins, common methods, Authorization header).
 * Returns true if the request was a preflight OPTIONS request (already handled).
 */
export function handleCors(req: Request, res: FunctionsResponse): boolean {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }

  return false;
}
