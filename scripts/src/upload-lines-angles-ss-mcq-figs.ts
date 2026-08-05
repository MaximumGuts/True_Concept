/**
 * Uploads the twelve redrawn figures for the 22 MCQs of
 * `Books/selfstudys_com_file (25).pdf` (Lines and Angles, math-ix-c06).
 *
 * Rendered by `python scripts/gen_lines_angles_ix_ss_figs.py --out <FIG_DIR>`.
 * The `ss-mcq-` namespace under this prefix is this agent's alone — the
 * chapter's pre-existing figures all live under `qa-fig-` / `ex-fig-`.
 *
 * Every filename ends `-v2`: the bucket serves a long cacheControl, so a reused
 * name would keep serving stale bytes.
 *
 * Destination: gs://true-concept-353c9.firebasestorage.app/lines-angles-ix-chapter/
 * DRY RUN by default; APPLY=1 to upload. Each public URL is fetched afterwards
 * and must return HTTP 200.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { items } from "./_data/mathix-c06-ss-mcqs.js";

const BUCKET = "true-concept-353c9.firebasestorage.app";
const PREFIX = "lines-angles-ix-chapter";
const FILES = [...new Set(items.map(i => i.figure).filter(Boolean))].sort() as string[];

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9", storageBucket: BUCKET });
}
const bucket = getStorage().bucket(BUCKET);
const APPLY = process.env.APPLY === "1";
const FIG_DIR = process.env.FIG_DIR;

async function main() {
  if (!FIG_DIR) throw new Error("Set FIG_DIR to the directory holding the rendered PNGs.");
  for (const f of FILES) {
    if (!/^ss-mcq-q\d{2}-[a-z0-9-]+-v2\.png$/.test(f)) {
      throw new Error(`${f} is outside this agent's ss-mcq-…-v2 namespace`);
    }
    const p = join(FIG_DIR, f);
    if (!existsSync(p)) throw new Error(`Missing local file: ${p}`);
    console.log(`${f}: ${statSync(p).size} bytes -> gs://${BUCKET}/${PREFIX}/${f}`);
  }
  console.log(`${FILES.length} distinct figures referenced by the data file.`);
  if (!APPLY) { console.log("DRY RUN — nothing uploaded. Set APPLY=1 to upload."); return; }

  for (const f of FILES) {
    const dest = `${PREFIX}/${f}`;
    await bucket.upload(join(FIG_DIR, f), {
      destination: dest,
      metadata: { contentType: "image/png", cacheControl: "public, max-age=300" },
    });
    await bucket.file(dest).makePublic();
    const url = `https://storage.googleapis.com/${BUCKET}/${dest}`;
    const res = await fetch(url);
    console.log(`${url} -> HTTP ${res.status} (${res.headers.get("content-length")} bytes)`);
    if (res.status !== 200) throw new Error(`Public URL check failed for ${dest}`);
  }
  console.log("Uploaded and verified.");
}

main().catch((e) => { console.error(e); process.exit(1); });
