/**
 * Resolves a relative `/api/...` asset URL (e.g. an uploaded note image served
 * by the storage Cloud Function as `/api/storage/...`) to an absolute URL.
 *
 * WHY: note content stores images as relative `<img src="/api/storage/...">`.
 * On the web that resolves against the site origin (which has the `/api/**`
 * hosting rewrite). Inside the Capacitor APK the WebView serves the bundled app
 * from `http://localhost`, so a relative `/api/...` src points at the local
 * server and 404s — the image appears broken. `<img>` loads don't go through
 * the patched `window.fetch`, so we must rewrite the src ourselves at render
 * time. This also fixes notes that were already saved with relative URLs (no
 * data migration needed).
 *
 * On the web build `VITE_API_BASE_URL` is unset, so the original relative URL is
 * returned unchanged and continues to work via the hosting rewrite.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

export function resolveAssetUrl(src?: string): string | undefined {
  if (!src) return src;
  if (API_BASE && src.startsWith("/api/")) return `${API_BASE}${src}`;
  return src;
}
