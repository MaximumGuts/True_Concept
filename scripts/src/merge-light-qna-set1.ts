/**
 * One-off: collapse the 10 separate "QnA Set 1 — Qn" docs (5 English + 5
 * Assamese) into just 2 docs — one English card titled "Extra QnA Set 1"
 * and one Assamese card with the same title — each containing all 5
 * questions concatenated as sections in a single note-style body, so
 * students open ONE card and read all 5 Q&As in one reader view (mirrors
 * how a single Note's content is one long markdown document).
 *
 * Reads the existing 10 docs (so none of the already-written content/LaTeX
 * needs retyping), reassembles them in Q1..Q5 order per language, deletes
 * the 10 originals, and writes the 2 merged docs.
 *
 * AUTH: set GOOGLE_APPLICATION_CREDENTIALS to the service-account JSON path.
 */
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "true-concept-353c9";
const CHAPTER_ID = "phys-x-c01";
const SET_LABEL = "Extra QnA Set 1";

if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
    ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8")))
    : applicationDefault();
  initializeApp({ credential, projectId: PROJECT_ID });
  console.log(`→ Connecting to LIVE Firestore project: ${PROJECT_ID}`);
}

const db = getFirestore();

// Crude Assamese-script detector (covers the Bengali/Assamese Unicode block).
function isAssamese(text: string): boolean {
  return /[ঀ-৿]/.test(text);
}

async function run() {
  const col = db.collection("qa");
  const snap = await col.where("chapterId", "==", CHAPTER_ID).get();

  const matches = snap.docs.filter((d) => String(d.data().title ?? "").startsWith("QnA Set 1"));
  if (matches.length !== 10) {
    console.warn(`⚠ Expected 10 matching docs, found ${matches.length}. Proceeding with what's found.`);
  }

  const english = matches
    .filter((d) => !isAssamese(String(d.data().title ?? "")))
    .sort((a, b) => (a.data().order ?? 0) - (b.data().order ?? 0));
  const assamese = matches
    .filter((d) => isAssamese(String(d.data().title ?? "")))
    .sort((a, b) => (a.data().order ?? 0) - (b.data().order ?? 0));

  function buildCombined(docs: typeof matches, headingWord: string): string {
    return docs
      .map((d) => {
        const data = d.data();
        const m = String(data.title ?? "").match(/Q(\d+)\.\s*(.*)$/);
        const num = m ? m[1] : "?";
        const topic = m ? m[2] : "";
        return `## ${headingWord} ${num}. ${topic}\n\n${data.content ?? data.answer ?? ""}`;
      })
      .join("\n\n---\n\n");
  }

  const englishContent = buildCombined(english, "Question");
  const assameseContent = buildCombined(assamese, "প্রশ্ন");

  // Existing order baseline: continue after the lowest order among the originals
  // so the new merged cards slot into roughly the same place.
  const baseOrder = Math.min(...matches.map((d) => (d.data().order as number) ?? 0));

  const batch = db.batch();
  matches.forEach((d) => batch.delete(d.ref));

  const enRef = col.doc();
  batch.set(enRef, {
    chapterId: CHAPTER_ID,
    title: SET_LABEL,
    content: englishContent,
    question: SET_LABEL,
    answer: englishContent,
    explanation: "",
    youtubeId: null,
    youtubeIds: [],
    isImportant: false,
    order: baseOrder,
    createdAt: new Date(),
  });

  const asRef = col.doc();
  batch.set(asRef, {
    chapterId: CHAPTER_ID,
    title: SET_LABEL,
    content: assameseContent,
    question: SET_LABEL,
    answer: assameseContent,
    explanation: "",
    youtubeId: null,
    youtubeIds: [],
    isImportant: false,
    order: baseOrder + 1,
    createdAt: new Date(),
  });

  await batch.commit();

  console.log(`✓ Deleted ${matches.length} individual docs, created 2 merged "${SET_LABEL}" cards (English + Assamese)`);
}

run().catch((err) => {
  console.error("✗ Merge failed:", err);
  process.exitCode = 1;
});
