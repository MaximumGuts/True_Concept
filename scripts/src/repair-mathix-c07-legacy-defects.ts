/**
 * Repairs two PRE-EXISTING live defects in math-ix-c07 (Triangles), both found
 * by running the chapter audit as a baseline BEFORE this batch's MCQs were
 * seeded. Neither was introduced by the MCQ work.
 *
 * DEFECT 1 — 21 dead figure URLs.
 *   An earlier redraw pass uploaded every figure under a new "-vN" filename and
 *   then deleted the originals, but the six NCERT-exercise qa docs were never
 *   repointed. Every one of those 21 names now 403s, so a student opening
 *   Exercise 7.1 / 7.2 / 7.3 in either language sees broken images throughout.
 *   Each stale name has exactly ONE surviving successor in the bucket (verified
 *   by `_tri_inspect_defects.ts`), so the repoint is unambiguous; the script
 *   re-derives that mapping from the bucket at run time and refuses to run if
 *   any name resolves to zero or more than one successor.
 *
 * DEFECT 2 — Bengali digits in two Assamese qa titles.
 *   "(ভাগ ১)" / "(ভাগ ২)" must use ASCII digits per the chapter-wide rule that
 *   numbers in Assamese content stay 1, 2, 3 … as the SEBA textbook prints them.
 *
 * Everything it touches is written to scripts/math-ix-c07-legacy-backup.json
 * first (committed, because untracked backups have been lost before).
 * DRY RUN by default; APPLY=1 to write.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { writeFileSync } from "fs";
import { resolve } from "path";

const BUCKET = "true-concept-353c9.firebasestorage.app";
const CHAPTER = "math-ix-c07";
const PREFIX = "triangles-ix-chapter";
const COLLECTIONS = ["qa", "paperQuestions", "notes", "mcqs", "caseMcqs"] as const;
const BACKUP = resolve(process.cwd(), "math-ix-c07-legacy-backup.json");
const APPLY = process.env.APPLY === "1";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9", storageBucket: BUCKET });
}
const db = getFirestore();

const BENGALI_DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};
const deBengaliDigits = (s: string) => s.replace(/[০-৯]/g, d => BENGALI_DIGITS[d]);

/** Recursively rewrite every string inside a Firestore value. */
function mapStrings(v: unknown, f: (s: string) => string): unknown {
  if (typeof v === "string") return f(v);
  if (Array.isArray(v)) return v.map(x => mapStrings(x, f));
  if (v && typeof v === "object" && v.constructor === Object) {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, f)]));
  }
  return v;
}

async function main() {
  console.log(APPLY ? "APPLY — writing\n" : "DRY RUN (APPLY=1 to write)\n");

  // ── build the rename map from the bucket, not from a hand-typed list ──────
  const [objects] = await getStorage().bucket(BUCKET).getFiles({ prefix: PREFIX + "/" });
  const present = new Set(objects.map(o => o.name.slice(PREFIX.length + 1)));

  const docs: { coll: string; id: string; data: Record<string, unknown> }[] = [];
  for (const coll of COLLECTIONS) {
    const snap = await db.collection(coll).where("chapterId", "==", CHAPTER).get();
    snap.docs.forEach(d => docs.push({ coll, id: d.id, data: d.data() as Record<string, unknown> }));
  }
  console.log(`Loaded ${docs.length} docs from ${COLLECTIONS.join(", ")}.`);

  const referenced = new Set<string>();
  for (const d of docs) {
    for (const m of JSON.stringify(d.data).matchAll(new RegExp(`${PREFIX}/([A-Za-z0-9._-]+\\.png)`, "g"))) {
      referenced.add(m[1]);
    }
  }

  const renames: Record<string, string> = {};
  const unresolved: string[] = [];
  for (const name of [...referenced].sort()) {
    if (present.has(name)) continue;
    const stem = name.replace(/\.png$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const succ = [...present].filter(p => new RegExp(`^${stem}-v[0-9]+\\.png$`).test(p));
    if (succ.length === 1) renames[name] = succ[0];
    else unresolved.push(`${name} -> ${succ.length} candidates ${JSON.stringify(succ)}`);
  }
  if (unresolved.length) {
    console.error("Aborting — these dead figure names have no single successor:");
    unresolved.forEach(u => console.error("  " + u));
    process.exit(1);
  }
  console.log(`\nFigure repoints (${Object.keys(renames).length}), all derived from the bucket:`);
  for (const [o, n] of Object.entries(renames)) console.log(`  ${o}  ->  ${n}`);

  // ── compute the patch for every doc ──────────────────────────────────────
  const rewrite = (s: string) => {
    let out = s;
    for (const [o, n] of Object.entries(renames)) out = out.split(`${PREFIX}/${o}`).join(`${PREFIX}/${n}`);
    return out;
  };

  const touched: typeof docs = [];
  const patches: { coll: string; id: string; patch: Record<string, unknown>; why: string[] }[] = [];
  for (const d of docs) {
    const patch: Record<string, unknown> = {};
    const why: string[] = [];
    for (const [field, val] of Object.entries(d.data)) {
      if (field === "createdAt" || field === "updatedAt") continue;
      let next = mapStrings(val, rewrite);
      if (JSON.stringify(next) !== JSON.stringify(val)) why.push(`figures:${field}`);
      // Bengali digits: only inside Assamese docs, and never inside a URL
      if (d.data.language === "Assamese") {
        const before = JSON.stringify(next);
        next = mapStrings(next, s => (s.includes("storage.googleapis.com") ? s : deBengaliDigits(s)));
        if (JSON.stringify(next) !== before) why.push(`digits:${field}`);
      }
      if (JSON.stringify(next) !== JSON.stringify(val)) patch[field] = next;
    }
    if (Object.keys(patch).length) { patches.push({ coll: d.coll, id: d.id, patch, why }); touched.push(d); }
  }

  console.log(`\nDocuments to patch: ${patches.length}`);
  for (const p of patches) console.log(`  ${p.coll}/${p.id}  [${[...new Set(p.why)].join(", ")}]`);

  if (!patches.length) { console.log("Nothing to do."); return; }

  // ── back up the ORIGINAL documents before touching anything ──────────────
  writeFileSync(BACKUP, JSON.stringify({
    chapterId: CHAPTER,
    takenAt: new Date().toISOString(),
    reason: "pre-existing dead figure URLs + Bengali digits in Assamese qa titles",
    renames,
    docs: touched.map(d => ({ collection: d.coll, id: d.id, data: d.data })),
  }, null, 2), "utf8");
  console.log(`\nBackup of ${touched.length} original docs written to ${BACKUP}`);

  if (!APPLY) { console.log("\nDRY RUN — no writes. Set APPLY=1."); return; }

  for (const p of patches) {
    await db.collection(p.coll).doc(p.id).update(p.patch);
    console.log(`  patched ${p.coll}/${p.id}`);
  }

  // ── verify: no stale name survives, every referenced URL is 200, no digits ─
  console.log("\nVerifying…");
  let stale = 0, digits = 0;
  const urls = new Set<string>();
  for (const coll of COLLECTIONS) {
    const snap = await db.collection(coll).where("chapterId", "==", CHAPTER).get();
    for (const d of snap.docs) {
      const blob = JSON.stringify(d.data());
      for (const o of Object.keys(renames)) {
        const hits = (blob.match(new RegExp(`${PREFIX}/${o.replace(/[.]/g, "\\.")}(?![\\w-])`, "g")) || []).length;
        if (hits) { stale += hits; console.log(`  STALE ${hits}x ${o} in ${coll}/${d.id}`); }
      }
      if (d.data().language === "Assamese" && /[০-৯]/.test(blob)) {
        digits++; console.log(`  BENGALI DIGIT still in ${coll}/${d.id}`);
      }
      for (const m of blob.matchAll(/https?:\/\/[^\s"'<>)\\]+?\.(?:png|jpg|jpeg|svg|webp)/g)) urls.add(m[0]);
    }
  }
  console.log(stale === 0 ? "  zero stale figure references" : `  ${stale} stale references remain`);
  console.log(digits === 0 ? "  zero Bengali digits in Assamese docs" : `  ${digits} docs still carry Bengali digits`);

  let broken = 0;
  await Promise.all([...urls].map(async u => {
    const r = await fetch(u, { method: "HEAD" });
    if (!r.ok) { broken++; console.log(`  ${r.status}  ${u}`); }
  }));
  console.log(`  ${urls.size - broken}/${urls.size} figure URLs return HTTP 200`);
}

main().catch(e => { console.error(e); process.exit(1); });
