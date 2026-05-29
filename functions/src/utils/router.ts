import type { Request } from "firebase-functions/v2/https";

/**
 * Extract the sub-path after the function name from the request URL.
 *
 * Firebase Functions receive the full path. When invoked via Firebase Hosting
 * rewrites, the path is the original request path (e.g. "/api/subjects/abc123").
 * When called directly, the path is just "/<functionName>/..." .
 *
 * This function strips the known `prefix` and returns the remaining path segments.
 *
 * Example:
 *   getSubPath(req, "/api/subjects") → "" or "/abc123"
 *   getSubPath(req, "/api/auth")     → "/login" or "/phone-login"
 */
export function getSubPath(req: Request, prefix: string): string {
  const url = req.url || req.path || "";
  // Strip query string
  const pathOnly = url.split("?")[0];

  // Try stripping the prefix first
  if (pathOnly.startsWith(prefix)) {
    return pathOnly.slice(prefix.length) || "/";
  }

  // Fallback: just use the raw path (for direct function invocation)
  return pathOnly || "/";
}

/**
 * Extract a path parameter from a sub-path.
 *
 * Example:
 *   extractParam("/abc123") → "abc123"
 *   extractParam("/")       → null
 */
export function extractParam(subPath: string): string | null {
  const clean = subPath.startsWith("/") ? subPath.slice(1) : subPath;
  // Only return if it's a single segment (no further slashes)
  if (clean && !clean.includes("/")) return clean;
  return null;
}
