/**
 * One-off: rename the 10 "Extra QnA Part 1" docs (just seeded into the `qa`
 * collection for phys-x-c01) so they read as a single numbered set:
 *   "QnA Set 1 — Q1" .. "QnA Set 1 — Q5"  (English, order 1-5)
 *   "QnA Set 1 — Q1" .. "QnA Set 1 — Q5"  (Assamese, order 6-10)
 * Only the title/question label is rewritten — content/answer is untouched.
 *
 * AUTH: set GOOGLE_APPLICATION_CREDENTIALS to the service-account JSON path.
 */
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "true-concept-353c9";
const CHAPTER_ID = "phys-x-c01";
const OLD_LABEL = "Extra QnA Part 1";
const NEW_LABEL = "QnA Set 1";

if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
    ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8")))
    : applicationDefault();
  initializeApp({ credential, projectId: PROJECT_ID });
  console.log(`→ Connecting to LIVE Firestore project: ${PROJECT_ID}`);
}

const db = getFirestore();

async function run() {
  const snap = await db.collection("qa")
    .where("chapterId", "==", CHAPTER_ID)
    .get();

  const docs = snap.docs
    .filter((d) => String(d.data().title ?? "").includes(OLD_LABEL))
    .sort((a, b) => (a.data().order ?? 0) - (b.data().order ?? 0));

  if (docs.length !== 10) {
    console.warn(`⚠ Expected 10 matching docs, found ${docs.length}. Proceeding anyway.`);
  }

  const batch = db.batch();
  docs.forEach((d) => {
    const order = d.data().order as number;
    const qNum = ((order - 1) % 5) + 1; // 1-5 -> 1-5, 6-10 -> 1-5
    const oldTitle = String(d.data().title ?? "");
    const rest = oldTitle.split("—").slice(1).join("—").replace(/^\s*Q\d+\.\s*/, "").trim();
    const newTitle = `${NEW_LABEL} — Q${qNum}. ${rest}`;
    batch.update(d.ref, { title: newTitle, question: newTitle });
    console.log(`  ${oldTitle}  →  ${newTitle}`);
  });
  await batch.commit();

  console.log(`✓ Renamed ${docs.length} Q&A titles to "${NEW_LABEL}" numbering`);
}

run().catch((err) => {
  console.error("✗ Rename failed:", err);
  process.exitCode = 1;
});
