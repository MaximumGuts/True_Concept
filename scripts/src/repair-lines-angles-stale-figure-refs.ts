/**
 * Repairs stale figure references in math-ix-c06 (Lines and Angles).
 *
 * FOUND BY: `audit-quad-ix-batch.ts` with CHAPTER_ID=math-ix-c06 reported 19
 * figure URLs returning HTTP 403. Listing the bucket showed why: a past redraw
 * migration renamed every `ex-fig-*.png` to `ex-fig-*-v2.png` (two of them to
 * `-v3`) and then DELETED the originals — but it did not repoint every
 * referencing document. The survivors have been pointing at deleted objects
 * ever since, so those diagrams render broken for students right now.
 *
 * This is the exact failure the circles deploy script warns about: a migration
 * that scans only some collections passes its own "zero stale references"
 * check while other collections still hold the dead name.
 *
 * The mapping is derived from the bucket itself, not hardcoded: for each stale
 * name we look for exactly one live object whose name is that stem plus a
 * `-vN` suffix. If a stale name has zero or more than one candidate the script
 * refuses to guess and reports it.
 *
 * Backs the affected docs up to `scripts/math-ix-c06-figure-refs-backup.json`
 * before writing. DRY RUN by default; APPLY=1 to write.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { writeFileSync } from "fs";
import { resolve } from "path";

const BUCKET = "true-concept-353c9.firebasestorage.app";
const PREFIX = "lines-angles-ix-chapter";
const CID = "math-ix-c06";
const COLLECTIONS = ["qa", "paperQuestions", "notes", "mcqs", "caseMcqs"] as const;
const FIELDS = ["content", "answer", "question", "explanation", "figureUrl", "passage", "title"];
const BACKUP = resolve(process.cwd(), "math-ix-c06-figure-refs-backup.json");

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9", storageBucket: BUCKET });
}
const db = getFirestore();
const bucket = getStorage().bucket(BUCKET);
const APPLY = process.env.APPLY === "1";

async function main() {
  // 1. what actually exists in the bucket
  const [files] = await bucket.getFiles({ prefix: PREFIX + "/" });
  const live = new Set(files.map((f) => f.name.replace(PREFIX + "/", "")));
  console.log(`${live.size} objects live under ${PREFIX}/`);

  // 2. every figure filename any doc in this chapter references
  type Hit = { coll: string; id: string; data: Record<string, any> };
  const hits: Hit[] = [];
  for (const coll of COLLECTIONS) {
    const snap = await db.collection(coll).where("chapterId", "==", CID).get();
    snap.docs.forEach((d) => hits.push({ coll, id: d.id, data: d.data() }));
  }
  const referenced = new Map<string, string[]>();   // filename -> doc keys
  for (const h of hits) {
    const blob = JSON.stringify(h.data);
    for (const m of blob.matchAll(new RegExp(`${PREFIX}/([A-Za-z0-9._-]+\\.png)`, "g"))) {
      referenced.set(m[1], [...new Set([...(referenced.get(m[1]) ?? []), `${h.coll}/${h.id}`])]);
    }
  }
  const stale = [...referenced.keys()].filter((f) => !live.has(f)).sort();
  console.log(`${referenced.size} distinct filenames referenced; ${stale.length} of them no longer exist.\n`);
  if (!stale.length) { console.log("Nothing to repair."); return; }

  // 3. derive old -> new from the bucket, refusing to guess
  const RENAMES = new Map<string, string>();
  const unresolved: string[] = [];
  for (const old of stale) {
    const stem = old.replace(/\.png$/, "");
    const candidates = [...live].filter((f) => new RegExp(`^${stem}-v\\d+\\.png$`).test(f));
    if (candidates.length === 1) {
      RENAMES.set(old, candidates[0]);
      console.log(`  ${old}\n    -> ${candidates[0]}   (${referenced.get(old)!.length} doc(s))`);
    } else {
      unresolved.push(`${old}: ${candidates.length} candidates [${candidates.join(", ")}]`);
    }
  }
  if (unresolved.length) {
    console.error("\nRefusing to guess for:");
    unresolved.forEach((u) => console.error("  ! " + u));
    process.exitCode = 1;
    return;
  }

  // 4. compute the patches
  type Patch = { coll: string; id: string; patch: Record<string, string>; before: Record<string, string> };
  const patches: Patch[] = [];
  for (const h of hits) {
    const patch: Record<string, string> = {}, before: Record<string, string> = {};
    for (const field of FIELDS) {
      const val = h.data[field];
      if (typeof val !== "string") continue;
      let next = val;
      // guard the replacement with the prefix so `x.png` cannot also rewrite
      // an unrelated `foo-x.png`
      for (const [o, n] of RENAMES) next = next.split(`${PREFIX}/${o}`).join(`${PREFIX}/${n}`);
      if (next !== val) { patch[field] = next; before[field] = val; }
    }
    if (Object.keys(patch).length) patches.push({ coll: h.coll, id: h.id, patch, before });
  }
  console.log(`\n${patches.length} document(s) to patch:`);
  patches.forEach((p) => console.log(`  ${p.coll}/${p.id}  [${Object.keys(p.patch).join(", ")}]`));

  if (!APPLY) { console.log("\nDRY RUN — nothing written. Set APPLY=1 to repair."); return; }

  // 5. back up the pre-change values, then write
  writeFileSync(BACKUP, JSON.stringify(
    { chapterId: CID, takenAt: new Date().toISOString(), renames: [...RENAMES], docs: patches.map((p) => ({ coll: p.coll, id: p.id, before: p.before })) },
    null, 2), "utf8");
  console.log(`\nBackup written to ${BACKUP}`);

  let batch = db.batch(), n = 0;
  for (const p of patches) {
    batch.update(db.collection(p.coll).doc(p.id), p.patch);
    if (++n === 400) { await batch.commit(); n = 0; batch = db.batch(); }
  }
  if (n) await batch.commit();
  console.log(`Patched ${patches.length} documents.`);

  // 6. verify: no reference in the chapter points at a dead object any more
  let remaining = 0;
  for (const coll of COLLECTIONS) {
    const snap = await db.collection(coll).where("chapterId", "==", CID).get();
    for (const d of snap.docs) {
      const blob = JSON.stringify(d.data());
      for (const m of blob.matchAll(new RegExp(`${PREFIX}/([A-Za-z0-9._-]+\\.png)`, "g"))) {
        if (!live.has(m[1])) { console.log(`  STALE still: ${coll}/${d.id} -> ${m[1]}`); remaining++; }
      }
    }
  }
  console.log(remaining === 0 ? "Verified: zero stale references remain." : `${remaining} stale references remain.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
