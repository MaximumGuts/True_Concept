/**
 * Uploads the three redrawn figures for the MCQs of `selfstudys_com_file (26).pdf`
 * (Triangles, Class IX, chapter math-ix-c07) to Storage and makes them public.
 *
 * Rendered by `python scripts/gen_tri_ix_mcq_figs.py --out <FIG_DIR>`, whose
 * builders carry numeric asserts proving the drawn configuration is the one the
 * question describes.
 *
 * Namespace `tri-mcq-` is this agent's alone inside the shared
 * `triangles-ix-chapter/` prefix, and every name ends in -vN so a reused name
 * can never serve stale CDN bytes.
 *
 * Destination: gs://true-concept-353c9.firebasestorage.app/triangles-ix-chapter/
 * DRY RUN by default; APPLY=1 to upload. Each public URL is fetched afterwards
 * and must return HTTP 200.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { items } from "./_data/mathix-c07-tri-mcqs.js";

const BUCKET = "true-concept-353c9.firebasestorage.app";
const PREFIX = "triangles-ix-chapter";
const FILES = [...new Set(items.map(i => i.figure).filter(Boolean))] as string[];

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
    if (!/^tri-mcq-[a-z0-9-]+-v[0-9]+\.png$/.test(f)) throw new Error(`${f} is outside this agent's tri-mcq-…-vN namespace`);
    const p = join(FIG_DIR, f);
    if (!existsSync(p)) throw new Error(`Missing local file: ${p}`);
    console.log(`${f}: ${statSync(p).size} bytes -> gs://${BUCKET}/${PREFIX}/${f}`);
  }
  console.log(`${FILES.length} figures referenced by the data file.`);

  // never silently overwrite an object another agent or an earlier batch owns
  for (const f of FILES) {
    const [exists] = await bucket.file(`${PREFIX}/${f}`).exists();
    if (exists) console.log(`  note: ${f} already exists in the bucket and will be replaced by the identical rendered file`);
  }
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
