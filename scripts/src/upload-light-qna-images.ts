/**
 * One-off: upload the two ray-diagram images for "Extra QnA Part 1" Q86
 * into the same Cloud Storage bucket/prefix used by the admin's
 * ImageUploadButton (`note-uploads/<uuid>`), and print the markdown <img>
 * src paths to embed in the Q&A content.
 *
 * AUTH: same as seed-light-mcqs.ts — set GOOGLE_APPLICATION_CREDENTIALS.
 */
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

const PROJECT_ID = "true-concept-353c9";
const BUCKET = "true-concept-353c9.firebasestorage.app";
const UPLOAD_PREFIX = "note-uploads";

if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
    ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8")))
    : applicationDefault();
  initializeApp({ credential, projectId: PROJECT_ID });
}

const files = [
  { path: process.argv[2], label: "a" },
  { path: process.argv[3], label: "b" },
];

async function run() {
  const bucket = getStorage().bucket(BUCKET);
  for (const f of files) {
    if (!f.path) continue;
    const objectId = randomUUID();
    const dest = bucket.file(`${UPLOAD_PREFIX}/${objectId}`);
    const body = readFileSync(f.path);
    await dest.save(body, {
      contentType: "image/png",
      resumable: false,
      metadata: { cacheControl: "public, max-age=86400" },
    });
    console.log(`${f.label}: /api/storage/objects/${objectId}`);
  }
}

run().catch((err) => {
  console.error("✗ Upload failed:", err);
  process.exitCode = 1;
});
