/**
 * Fills the local Firestore emulator with a realistic slice of production, so
 * localhost testing exercises real shapes instead of an empty database.
 *
 * Two phases, run separately, because a single process cannot talk to both
 * production and the emulator: the Admin SDK routes ALL traffic to the emulator
 * as soon as FIRESTORE_EMULATOR_HOST is set, so the export must finish before
 * that variable exists.
 *
 *   # 1. pull a slice of production to disk (no emulator involved)
 *   export TRUE_CONCEPT_SERVICE_KEY=$(cat "$TEMP/tc_key_b64.txt")
 *   npx tsx src/emulator-data.ts export
 *
 *   # 2. start the emulator, then push that slice into it
 *   firebase emulators:start
 *   FIRESTORE_EMULATOR_HOST=localhost:8090 npx tsx src/emulator-data.ts import
 *
 * Then run the app against it with VITE_USE_EMULATORS=1 (see lib/firebase.ts).
 *
 * WHY A SLICE, NOT EVERYTHING
 * Production holds ~6,900 documents; copying all of them makes a snapshot that
 * is slow to load and stale within days. Structure (subjects, chapters,
 * settings) is copied whole because the app breaks without it; bulk content is
 * capped per collection, which is enough to exercise every screen.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync, readFileSync, existsSync } from "fs";

const MODE = (process.argv[2] ?? "").toLowerCase();
const FILE = process.env.SNAPSHOT_PATH ?? "./emulator-snapshot.json";
/** Per-collection cap for bulk content. Structural collections ignore it. */
const CAP = Number(process.env.CAP ?? 60);
const STRUCTURAL = new Set(["subjects", "chapters", "appSettings", "experiments", "users"]);
/** Never copied: real people's data has no place in a throwaway sandbox. */
const SKIP = new Set([
  "students", "teachers", "progress", "studentProgress", "studentXP",
  "studentKnowledgeProfiles", "studentStudyPlans", "aiRecommendations",
  "notifications", "broadcastMessages", "generatedPapers",
]);

if (MODE !== "export" && MODE !== "import") {
  console.error("usage: emulator-data.ts <export|import>");
  process.exit(1);
}

const emulating = !!process.env.FIRESTORE_EMULATOR_HOST;
if (MODE === "export" && emulating) {
  console.error("FIRESTORE_EMULATOR_HOST is set — export would read the emulator, not production. Unset it.");
  process.exit(1);
}
if (MODE === "import" && !emulating) {
  console.error(
    "FIRESTORE_EMULATOR_HOST is NOT set — import would write to PRODUCTION.\n" +
    "Re-run as: FIRESTORE_EMULATOR_HOST=localhost:8090 npx tsx src/emulator-data.ts import",
  );
  process.exit(1);
}

if (getApps().length === 0) {
  if (MODE === "export") {
    const c = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
    initializeApp({ credential: cert(c), projectId: "true-concept-353c9" });
  } else {
    // The emulator accepts any credential; the project id just has to match.
    initializeApp({ projectId: "true-concept-353c9" });
  }
}
const db = getFirestore();

type Snapshot = Record<string, Record<string, unknown>>;

async function doExport() {
  const cols = await db.listCollections();
  const out: Snapshot = {};
  let total = 0;
  for (const c of cols) {
    if (SKIP.has(c.id)) { console.log(`  skip      ${c.id} (real user data)`); continue; }
    const structural = STRUCTURAL.has(c.id);
    const snap = structural ? await c.get() : await c.limit(CAP).get();
    out[c.id] = {};
    for (const d of snap.docs) out[c.id][d.id] = d.data();
    total += snap.size;
    console.log(`  ${structural ? "all      " : `capped ${String(CAP).padStart(3)}`} ${c.id}: ${snap.size}`);
  }
  writeFileSync(FILE, JSON.stringify(out, null, 1), "utf8");
  console.log(`\n${total} document(s) -> ${FILE}`);
  console.log("Next: firebase emulators:start   then   FIRESTORE_EMULATOR_HOST=localhost:8090 npx tsx src/emulator-data.ts import");
}

async function doImport() {
  if (!existsSync(FILE)) { console.error(`${FILE} not found — run the export phase first.`); process.exit(1); }
  const snap = JSON.parse(readFileSync(FILE, "utf8")) as Snapshot;
  let total = 0;
  for (const [col, docs] of Object.entries(snap)) {
    const ids = Object.keys(docs);
    // Firestore caps a batch at 500 writes.
    for (let i = 0; i < ids.length; i += 400) {
      const batch = db.batch();
      for (const id of ids.slice(i, i + 400)) batch.set(db.collection(col).doc(id), docs[id] as object);
      await batch.commit();
    }
    total += ids.length;
    console.log(`  ${String(ids.length).padStart(5)}  ${col}`);
  }
  console.log(`\n${total} document(s) written to the emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
  console.log("Now run the app with VITE_USE_EMULATORS=1 — it will show a loud console banner when sandboxed.");
}

(MODE === "export" ? doExport() : doImport()).catch((e) => {
  console.error(String(e?.message ?? e));
  process.exit(1);
});
