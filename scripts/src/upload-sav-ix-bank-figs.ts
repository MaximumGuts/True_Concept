/**
 * Uploads the redrawn Class IX "Surface Areas and Volumes" question-bank
 * figures (rendered by scripts/gen_surface_areas_ix_bank_figs.py) to the
 * chapter's existing Storage prefix.
 *
 * All names end in -v2 so nothing collides with, or is masked by, the long
 * cacheControl already serving the chapter's note figures.
 *
 * RUN:
 *   export TRUE_CONCEPT_SERVICE_KEY=$(cat "$TEMP/tc_key_b64.txt")
 *   FIG_DIR=<dir> npx tsx src/upload-sav-ix-bank-figs.ts          # dry run
 *   FIG_DIR=<dir> APPLY=1 npx tsx src/upload-sav-ix-bank-figs.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const BUCKET = "true-concept-353c9.firebasestorage.app";
const PREFIX = "surface-areas-volumes-ix-chapter";
const APPLY = process.env.APPLY === "1";
const FIG_DIR = process.env.FIG_DIR!;

export const SAV_FIGURES = [
  "sav-case1-cylinder-sphere-v2.png",
  "sav-case2-sheets-v2.png",
  "sav-case3-water-rise-v2.png",
  "sav-la38-sector-120-v2.png",
  "sav-la40-plot-drainlet-v2.png",
  "sav-sa27-triangle-5-12-13-v2.png",
  "sav-sa23-three-cubes-v2.png",
  "sav-la39-three-cylinders-v2.png",
] as const;

export const figUrl = (name: string) =>
  `https://storage.googleapis.com/${BUCKET}/${PREFIX}/${name}`;

if (getApps().length === 0) {
  const cred = JSON.parse(
    Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"),
  );
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9", storageBucket: BUCKET });
}

async function main() {
  const bucket = getStorage().bucket(BUCKET);
  console.log(APPLY ? "⚙️  APPLY — uploading\n" : "🔎 DRY RUN (APPLY=1 to upload)\n");
  for (const name of SAV_FIGURES) {
    const local = resolve(FIG_DIR, name);
    if (!existsSync(local)) throw new Error(`missing rendered figure: ${local}`);
    const bytes = readFileSync(local);
    if (APPLY) {
      const f = bucket.file(`${PREFIX}/${name}`);
      await f.save(bytes, {
        contentType: "image/png",
        resumable: false,
        metadata: { cacheControl: "public, max-age=300" },
      });
      await f.makePublic();
    }
    console.log(`  ${APPLY ? "uploaded" : "would upload"} ${name} (${(bytes.length / 1024).toFixed(0)} KB)`);
  }
  if (!APPLY) return;
  console.log("\nVerifying…");
  let bad = 0;
  for (const name of SAV_FIGURES) {
    const r = await fetch(figUrl(name), { method: "HEAD" });
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? "200 OK" : "FAIL " + r.status}  ${name}`);
  }
  console.log(bad === 0 ? "\n  ✓ all figures live" : `\n  ✗ ${bad} figure(s) not reachable`);
}

if (process.argv[1]?.includes("upload-sav-ix-bank-figs")) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
