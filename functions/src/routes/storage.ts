import { onRequest } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";
import "@workspace/db"; // ensures firebase-admin initializeApp() ran
import { handleCors } from "../utils/cors.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";

/**
 * Storage function — admin-uploaded images for note/Q&A/paper bodies.
 *
 * Single-shot proxy upload (NOT signed-URL direct-to-GCS). The function
 * receives the file bytes and pipes them into the project's Cloud Storage
 * bucket. We chose the proxy model because the signed-URL approach requires
 * configuring bucket-level CORS for `storage.googleapis.com` — an extra
 * out-of-band step that's easy to forget and fails silently in the browser.
 * Proxying keeps everything inside Firebase Hosting's CORS perimeter at the
 * cost of a few MB of function bandwidth per image (admin uploads only —
 * negligible at this volume).
 *
 * Flow:
 *   1. POST /api/storage/upload  with Content-Type: image/*  and raw bytes
 *        → { objectPath: "/objects/<uuid>" }
 *   2. Markdown embeds <img src="/api/storage/objects/<uuid>" ... />
 *   3. GET /api/storage/objects/<uuid>  streams the file back (public read).
 *
 * **Bucket name.** db/src/index.ts initializes firebase-admin without a
 * storageBucket option, so `getStorage().bucket()` (no arg) would throw.
 * We resolve the bucket explicitly from STORAGE_BUCKET env or fall back to
 * the GCLOUD_PROJECT + `.firebasestorage.app` convention this project uses.
 */

const UPLOAD_PREFIX = "note-uploads";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB hard cap per image

function getBucketName(): string {
  if (process.env.STORAGE_BUCKET) return process.env.STORAGE_BUCKET;
  const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  if (projectId) return `${projectId}.firebasestorage.app`;
  throw new Error("Could not resolve storage bucket name");
}

export const storage = onRequest(
  { region: "asia-south1", invoker: "public", memory: "512MiB" },
  async (req, res) => {
    if (handleCors(req, res)) return;

    try {
      const path = (req.path || req.url.split("?")[0] || "").replace(/^\/+|\/+$/g, "");
      const bucket = getStorage().bucket(getBucketName());

      // ── POST /api/storage/upload  — admin uploads raw image bytes ─
      if (req.method === "POST" && /(?:^|\/)upload$/.test(path)) {
        requireAdmin(req);

        // Firebase-functions exposes the unparsed body as req.rawBody (Buffer).
        // The frontend sets Content-Type: image/* and PUT/POSTs the file
        // directly — no multipart parsing required.
        const body = (req as unknown as { rawBody?: Buffer }).rawBody;
        if (!body || body.length === 0) {
          res.status(400).json({ error: "Empty body" });
          return;
        }
        if (body.length > MAX_UPLOAD_BYTES) {
          res.status(413).json({ error: "File too large (max 10 MB)" });
          return;
        }
        const contentType = req.headers["content-type"] || "application/octet-stream";
        if (!contentType.toString().startsWith("image/")) {
          res.status(400).json({ error: "Only image/* uploads are allowed" });
          return;
        }

        const objectId = randomUUID();
        const file = bucket.file(`${UPLOAD_PREFIX}/${objectId}`);
        await file.save(body, {
          contentType: contentType.toString(),
          resumable: false,
          metadata: { cacheControl: "public, max-age=86400" },
        });

        res.json({ objectPath: `/objects/${objectId}` });
        return;
      }

      // ── GET /api/storage/objects/<id> — public read ──────────────
      if (req.method === "GET") {
        const m = path.match(/(?:^|\/)objects\/([^/]+)$/);
        if (m) {
          const objectId = m[1];
          const file = bucket.file(`${UPLOAD_PREFIX}/${objectId}`);
          const [exists] = await file.exists();
          if (!exists) { res.status(404).json({ error: "Not found" }); return; }
          const [metadata] = await file.getMetadata();
          res.set("Content-Type", String(metadata.contentType ?? "application/octet-stream"));
          res.set("Cache-Control", "public, max-age=86400");
          file
            .createReadStream()
            .on("error", (e) => {
              console.error("[storage] stream error:", e);
              if (!res.headersSent) res.status(500).end();
            })
            .pipe(res);
          return;
        }
      }

      res.status(404).json({ error: "Not found" });
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.status && authErr.error) {
        res.status(authErr.status).json({ error: authErr.error });
        return;
      }
      console.error("Storage error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
