/**
 * Restores Firestore documents from a backup file written by one of the content
 * scripts in this folder.
 *
 * WHY THIS EXISTS
 * Every destructive script writes a JSON backup before it touches anything, but
 * until now nothing could read one back — the undo existed only in the sense
 * that the bytes were on disk. This makes those files usable.
 *
 *   npx tsx src/restore-from-backup.ts ../backups/2026-08-05/foo-backup.json
 *   APPLY=1 npx tsx src/restore-from-backup.ts ../backups/2026-08-05/foo-backup.json
 *
 * SHAPES
 * The scripts grew three backup shapes. This reads all three and refuses on
 * anything it does not recognise, rather than guessing at your data:
 *
 *   A  { "collection/docId": {...fullDoc} }        — most patch scripts
 *   B  [ { id, data: {...fullDoc} } ]              — the delete scripts
 *   C  { docId: { setNumber, order } }             — partial-field backups
 *
 * A and B carry whole documents and can be restored directly. C only holds the
 * fields a script changed, so it needs a target collection: pass COLLECTION=mcqs.
 * Restoring C never deletes other fields — it merges.
 *
 * DRY RUN by default; APPLY=1 to write.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";

if (getApps().length === 0) {
  const cred = JSON.parse(
    Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"),
  );
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const APPLY = process.env.APPLY === "1";
const FILE = process.argv[2];
/* `COLLECTION=` (set but empty) must count as unset — otherwise `??` happily
   returns "" and every write targets a collection literally named "". */
const COLLECTION = process.env.COLLECTION?.trim() || undefined;

if (!FILE) { console.error("usage: restore-from-backup.ts <path/to/backup.json>   [COLLECTION=mcqs]"); process.exit(1); }
if (!existsSync(FILE)) { console.error(`${FILE} not found`); process.exit(1); }

type Target = { col: string; id: string; data: Record<string, unknown>; partial: boolean };

function parse(raw: unknown): Target[] {
  // Shape B — array of { id, data }
  if (Array.isArray(raw)) {
    return raw.map((e) => {
      const r = e as { id: string; data: Record<string, unknown> };
      if (!r?.id || !r?.data) throw new Error("array entry is not { id, data }");
      const col = COLLECTION ?? String(r.data.chapterId ? guessFromData(r.data) : "");
      if (!col) throw new Error(`cannot tell which collection ${r.id} belongs to — pass COLLECTION=...`);
      return { col, id: r.id, data: r.data, partial: false };
    });
  }
  const obj = raw as Record<string, Record<string, unknown>>;
  const keys = Object.keys(obj);
  if (!keys.length) return [];

  // Shape B-single — one { id, data } object rather than an array of them.
  // Checked before the generic paths, or "id" and "data" get read as doc IDs.
  if (keys.length === 2 && keys.includes("id") && keys.includes("data") && typeof (obj as any).id === "string") {
    const id = (obj as any).id as string;
    const data = (obj as any).data as Record<string, unknown>;
    const col = COLLECTION ?? guessFromData(data);
    if (!col) throw new Error(`cannot tell which collection "${id}" belongs to — pass COLLECTION=...`);
    return [{ col, id, data, partial: false }];
  }

  // Shape A — keys look like "collection/docId"
  if (keys.every((k) => k.includes("/"))) {
    return keys.map((k) => {
      const [col, ...rest] = k.split("/");
      return { col, id: rest.join("/"), data: obj[k], partial: false };
    });
  }

  // Shape C — flat docId -> partial fields. Needs an explicit collection, and
  // must be recognisably partial (a real document always carries chapterId).
  const looksPartial = keys.every((k) => {
    const v = obj[k];
    return v && typeof v === "object" && !("chapterId" in v);
  });
  if (looksPartial) {
    if (!COLLECTION) {
      throw new Error(
        "this is a partial-field backup (no chapterId on any entry), so the collection is ambiguous.\n" +
        "Re-run with COLLECTION=mcqs (or whichever collection the script changed).",
      );
    }
    return keys.map((k) => ({ col: COLLECTION, id: k, data: obj[k], partial: true }));
  }

  // Flat docId -> full document. An explicit COLLECTION wins; otherwise each
  // document is placed by its own fingerprint, which is reliable here because
  // these collections have disjoint field sets.
  return keys.map((k) => {
    const col = COLLECTION ?? guessFromData(obj[k]);
    if (!col) {
      const hint = "title" in obj[k] && "content" in obj[k]
        ? ' It looks like a note or a Q&A — those are indistinguishable by fields, so say which: COLLECTION=notes or COLLECTION=qa.'
        : " Pass COLLECTION=...";
      throw new Error(`cannot tell which collection "${k}" belongs to from its fields.${hint}`);
    }
    return { col, id: k, data: obj[k], partial: false };
  });
}

/**
 * Place a document by its field fingerprint. Only fingerprints that are
 * genuinely unambiguous are used.
 *
 * `notes` and `qa` are DELIBERATELY not guessed: both are { title, content,
 * order, language, chapterId } and the one field that separates them (`type`)
 * is absent from older documents. An early version of this guessed, and
 * classified a legacy Motion *note* as a `qa` — which would have restored it
 * into the wrong collection. Refusing and asking for COLLECTION is the only
 * safe behaviour there.
 */
function guessFromData(d: Record<string, unknown>): string {
  if ("subQuestions" in d) return "caseMcqs";
  if ("options" in d && "correctIndex" in d) return "mcqs";
  if ("questionType" in d && "marks" in d) return "paperQuestions";
  return "";
}

async function main() {
  console.log(`${APPLY ? "APPLY - restoring" : "DRY RUN (APPLY=1 to write)"}\n  file: ${FILE}\n`);
  const targets = parse(JSON.parse(readFileSync(FILE, "utf8")));
  if (!targets.length) { console.log("  backup is empty — nothing to restore"); return; }

  const byCol = new Map<string, number>();
  for (const t of targets) byCol.set(t.col, (byCol.get(t.col) ?? 0) + 1);
  console.log(`  ${targets.length} document(s) across ${byCol.size} collection(s):`);
  for (const [c, n] of [...byCol].sort()) console.log(`    ${String(n).padStart(4)}  ${c}`);
  console.log(targets[0].partial
    ? "\n  MODE: partial — only the fields in the backup are written, others are left alone"
    : "\n  MODE: whole documents — each target is replaced by its backed-up content");

  // Show what actually differs, so a restore is never a blind write.
  let differs = 0, missing = 0;
  for (const t of targets.slice(0, 400)) {
    const snap = await db.collection(t.col).doc(t.id).get();
    if (!snap.exists) { missing++; continue; }
    const cur = snap.data() as Record<string, unknown>;
    const changed = Object.keys(t.data).some((k) => JSON.stringify(cur[k]) !== JSON.stringify(t.data[k]));
    if (changed) differs++;
  }
  console.log(`\n  of the first ${Math.min(targets.length, 400)}: ${differs} differ from the backup, ${missing} no longer exist (would be recreated)`);
  if (!differs && !missing) console.log("  live data already matches this backup — restoring would change nothing");

  if (!APPLY) return;

  let written = 0;
  for (let i = 0; i < targets.length; i += 400) {
    const batch = db.batch();
    for (const t of targets.slice(i, i + 400)) {
      batch.set(db.collection(t.col).doc(t.id), t.data, t.partial ? { merge: true } : {});
      written++;
    }
    await batch.commit();
  }
  console.log(`\n  restored ${written} document(s)`);
}
main().catch((e) => { console.error("\n  " + String(e?.message ?? e)); process.exit(1); });
