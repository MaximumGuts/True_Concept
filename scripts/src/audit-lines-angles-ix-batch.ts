/**
 * Audit of the Lines and Angles (math-ix-c06) selfstudys MCQ batch.
 *
 * Adapted from `audit-quad-ix-batch.ts`. That script checks the generic seams
 * (set sizes, slot uniqueness, bank order uniqueness, EN/AS parity, bank
 * coverage, Assamese hygiene, whitelists, math integrity, figure HTTP 200) and
 * is chapter-parameterised, so it is run as-is with CHAPTER_ID=math-ix-c06.
 *
 * THIS script adds the checks that only make sense for this batch:
 *
 *   A. Source fidelity   — the 22 live English/Assamese docs still say exactly
 *                          what `_data/mathix-c06-ss-mcqs.ts` says, field by
 *                          field (question, all 4 options, correctIndex,
 *                          difficulty, explanation, figureUrl, set/order).
 *   B. Bank mirroring    — every one of the 22 x 2 mcqs has its paperQuestions
 *                          twin, carrying the same options, answer and figure.
 *   C. Slot ownership    — nothing foreign occupies mcqs sets 1-2 or bank
 *                          orders 100-121, and this batch touched nothing else.
 *   D. Assamese terms    — the batch uses this chapter's LIVE vocabulary, not a
 *                          synonym invented on the spot (ছেদক not তিৰ্যক ৰেখা,
 *                          বিপ্ৰতীপ কোণ, ৰৈখিক যোৰ, অনুৰূপ কোণ …), and no
 *                          Bengali র / Bengali digits anywhere.
 *   E. Answer sanity     — every correctIndex is re-derived from the item's own
 *                          numbers where the item is computational.
 *
 * Read-only. Safe to run any time.
 *   npx tsx src/audit-lines-angles-ix-batch.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { items } from "./_data/mathix-c06-ss-mcqs.js";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const CID = "math-ix-c06";
const ID_TAG = "ssd";
const SOURCE_PAPER = "Lines and Angles MCQ Practice (adapted)";
const FIG_BASE = "https://storage.googleapis.com/true-concept-353c9.firebasestorage.app/lines-angles-ix-chapter/";
const BANK_BASE = 100;
const SET_SIZE = 15;
const LETTERS = ["a", "b", "c", "d"];

const problems: string[] = [];
const fail = (m: string) => problems.push(m);
const ok = (m: string) => console.log(`  ok  ${m}`);

const BENGALI_RA = "র";
const BENGALI_DIGIT = /[০-৯]/;

/** Vocabulary this chapter already uses live — a batch that drifts from it
 *  reads as a different textbook to the student. */
const REQUIRED_TERMS: Record<string, string> = {
  "ছেদক": "transversal",
  "বিপ্ৰতীপ কোণ": "vertically opposite angles",
  "ৰৈখিক যোৰ": "linear pair",
  "অনুৰূপ কোণ": "corresponding angles",
  "সমদ্বিখণ্ডক": "bisector",
  "সম্পূৰক": "supplementary",
  "পূৰক": "complementary",
  "সমান্তৰাল": "parallel",
  "বহিঃকোণ": "exterior angle",
  "কোণৰ সমষ্টি ধৰ্ম": "angle sum property",
  "সমৰেখ": "collinear",
  "সমদ্বিবাহু": "isosceles",
};
/** Synonyms that exist in Assamese but are NOT what this chapter uses. */
const BANNED_TERMS: Record<string, string> = {
  "তিৰ্যক ৰেখা": "use ছেদক (this chapter's word for transversal)",
  "উলম্ব কোণ": "use বিপ্ৰতীপ কোণ",
  "সন্নিহিত যোৰ": "use ৰৈখিক যোৰ",
};

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/* ── E. Independent re-derivation of the computational answers ──────────────
   Written from the question's own numbers, NOT copied from the data file, so
   this disagrees loudly if the data file's correctIndex was ever mistyped. */
function reDerive(): Record<number, string> {
  const out: Record<number, string> = {};
  // Q1: A = 90, AB = AC -> B = C = (180-90)/2
  out[0] = `${(180 - 90) / 2}°`;
  // Q2: 180 - 53 - 44
  out[1] = `${180 - 53 - 44}°`;
  // Q3: C(4,2)
  out[2] = `${(4 * 3) / 2} lines`;
  // Q5: x = (180-x)/5
  out[4] = `${180 / 6}°`;
  // Q8: 180 - 50/2 - 50/2
  out[7] = `${180 - 50 / 2 - 50 / 2}°`;
  // Q9: 180/9 scaled by 2,3,4
  { const k = 180 / 9; out[8] = `${2 * k}°, ${3 * k}°, ${4 * k}°`; }
  // Q17: a+b=180, 2a-3b=60 -> 5b
  { const b = (2 * 180 - 60) / 5; out[16] = `${5 * b}°`; }
  // Q18: x = (90-x)+14
  out[17] = `${(90 + 14) / 2}°`;
  // Q19: x + x = 90
  out[18] = `${90 / 2}°`;
  // Q20: 70 - 42
  out[19] = `${70 - 42}°`;
  return out;
}

async function main() {
  console.log(`Auditing the selfstudys MCQ batch in ${CID}\n`);

  const mcqSnap = await db.collection("mcqs").where("chapterId", "==", CID).get();
  const pqSnap = await db.collection("paperQuestions").where("chapterId", "==", CID).get();
  const mcqs = new Map(mcqSnap.docs.map((d) => [d.id, d.data() as any]));
  const pqs = new Map(pqSnap.docs.map((d) => [d.id, d.data() as any]));
  console.log(`  chapter totals: mcqs=${mcqs.size}  paperQuestions=${pqs.size}\n`);

  // ── E. answer re-derivation, before anything touches the database ─────────
  const derived = reDerive();
  let derivedChecked = 0;
  for (const [iStr, expected] of Object.entries(derived)) {
    const it = items[Number(iStr)];
    const got = it.en.options[it.correctIndex];
    if (!got.includes(expected)) {
      fail(`i${iStr} (Q${Number(iStr) + 1}): re-derived answer "${expected}" is not the option marked correct ("${got}")`);
    } else derivedChecked++;
  }
  ok(`${derivedChecked}/${Object.keys(derived).length} computational answers re-derived from the question's own numbers and agree`);

  // ── A + B. live docs match the data file, field by field ─────────────────
  let checkedMcq = 0, checkedPq = 0;
  for (const it of items) {
    const pad = String(it.i).padStart(2, "0");
    const figureUrl = it.figure ? FIG_BASE + it.figure : undefined;
    for (const [lang, langName] of [["en", "English"], ["as", "Assamese"]] as const) {
      const side = it[lang];
      const mId = `mcq-${CID}-${ID_TAG}-${lang}-${pad}`;
      const pId = `pq-${CID}-${ID_TAG}-${lang}-${pad}`;
      const m = mcqs.get(mId);
      const p = pqs.get(pId);
      if (!m) { fail(`missing mcqs/${mId}`); continue; }
      if (!p) { fail(`missing paperQuestions/${pId}`); continue; }
      checkedMcq++; checkedPq++;

      if (m.language !== langName) fail(`${mId} language=${m.language}, expected ${langName}`);
      if (m.question !== side.question) fail(`${mId} question drifted from the data file`);
      if (JSON.stringify(m.options) !== JSON.stringify(side.options)) fail(`${mId} options drifted from the data file`);
      if (m.correctIndex !== it.correctIndex) fail(`${mId} correctIndex=${m.correctIndex}, data file says ${it.correctIndex}`);
      if (m.difficulty !== it.difficulty) fail(`${mId} difficulty=${m.difficulty}, data file says ${it.difficulty}`);
      if (m.setNumber !== 1 + Math.floor(it.i / SET_SIZE)) fail(`${mId} setNumber=${m.setNumber}`);
      if (m.order !== it.i % SET_SIZE) fail(`${mId} order=${m.order}`);
      if (m.sourcePaper !== SOURCE_PAPER) fail(`${mId} sourcePaper=${m.sourcePaper}`);
      if ((m.figureUrl ?? undefined) !== figureUrl) fail(`${mId} figureUrl=${m.figureUrl ?? "(none)"}, expected ${figureUrl ?? "(none)"}`);
      // the correct option must be the one the data file's needle names
      const needle = lang === "en" ? it.enNeedle : it.asNeedle;
      if (m.options?.[m.correctIndex] !== needle) {
        fail(`${mId} the option marked correct is "${m.options?.[m.correctIndex]}", needle says "${needle}"`);
      }
      // the explanation must announce the same letter it marks correct
      if (!String(m.explanation).includes(`(${LETTERS[it.correctIndex]})</strong>`)) {
        fail(`${mId} explanation does not announce option (${LETTERS[it.correctIndex]})`);
      }

      // bank twin
      if (p.language !== langName) fail(`${pId} language=${p.language}`);
      if (p.questionType !== "mcq") fail(`${pId} questionType=${p.questionType}, expected mcq`);
      if (p.marks !== 1) fail(`${pId} marks=${p.marks}, expected 1`);
      if (p.boards !== "Both") fail(`${pId} boards=${p.boards}`);
      if (p.difficulty !== it.difficulty) fail(`${pId} difficulty=${p.difficulty}`);
      if (p.order !== BANK_BASE + it.i) fail(`${pId} order=${p.order}, expected ${BANK_BASE + it.i}`);
      if ((p.figureUrl ?? undefined) !== figureUrl) fail(`${pId} figureUrl mismatch`);
      if (p.answer !== m.explanation) fail(`${pId} answer differs from the student explanation`);
      if (!String(p.question).startsWith(side.question)) fail(`${pId} question stem drifted`);
      for (let k = 0; k < 4; k++) {
        if (!String(p.question).includes(`(${LETTERS[k]}) ${side.options[k]}`)) {
          fail(`${pId} bank stem is missing option (${LETTERS[k]})`);
        }
      }
      // mandatory five-colour styling, on the live doc
      for (const hex of ["#d97706", "#da6b45", "#0d9488", "#16a34a", "#2563eb"]) {
        if (!String(m.explanation).includes(hex)) fail(`${mId} live explanation is missing colour ${hex}`);
        if (!String(p.answer).includes(hex)) fail(`${pId} live answer is missing colour ${hex}`);
      }
    }
  }
  ok(`${checkedMcq} mcqs and ${checkedPq} paperQuestions match the data file field by field`);
  if (checkedMcq !== items.length * 2) fail(`expected ${items.length * 2} mcqs from this batch, verified ${checkedMcq}`);

  // ── C. slot ownership ────────────────────────────────────────────────────
  const mySets = new Set([1, 2]);
  const foreignInSets = [...mcqs.entries()].filter(([id, d]) => mySets.has(d.setNumber) && !id.startsWith(`mcq-${CID}-${ID_TAG}-`));
  if (foreignInSets.length) fail(`${foreignInSets.length} foreign mcqs docs sit in sets 1-2: ${foreignInSets.slice(0, 5).map(([i]) => i).join(", ")}`);
  else ok("mcqs sets 1-2 contain only this batch's docs");

  const myOrders = new Set(items.map((it) => BANK_BASE + it.i));
  const foreignInBank = [...pqs.entries()].filter(([id, d]) => myOrders.has(d.order) && !id.startsWith(`pq-${CID}-${ID_TAG}-`));
  if (foreignInBank.length) fail(`${foreignInBank.length} foreign bank docs sit in orders 100-121`);
  else ok(`bank orders ${BANK_BASE}-${BANK_BASE + items.length - 1} contain only this batch's docs`);

  const outsideRange = [...pqs.entries()].filter(([id, d]) => id.startsWith(`pq-${CID}-${ID_TAG}-`) && (d.order < BANK_BASE || d.order > 299));
  if (outsideRange.length) fail(`${outsideRange.length} of this batch's bank docs sit outside the assigned 100-299 range`);
  else ok("this batch wrote nothing outside its assigned bank range 100-299");

  // the pre-existing 64 bank docs (orders 0-31) must be untouched
  const legacy = [...pqs.values()].filter((d) => d.order <= 31);
  if (legacy.length !== 64) fail(`the chapter's pre-existing bank docs (orders 0-31) now number ${legacy.length}, expected 64`);
  else ok("the chapter's 64 pre-existing bank docs (orders 0-31) are intact");

  // ── D. Assamese vocabulary and script hygiene, on the live docs ──────────
  const asBlob = [...mcqs.entries(), ...pqs.entries()]
    .filter(([id, d]) => id.includes(`-${ID_TAG}-as-`) && d.language === "Assamese")
    .flatMap(([, d]) => strings(d)).join("\n");
  if (!asBlob.length) fail("no Assamese text found for this batch");
  if (asBlob.includes(BENGALI_RA)) fail(`Assamese text contains Bengali র (U+09B0) — must be ৰ`);
  else ok("no Bengali র anywhere in this batch's Assamese text");
  if (BENGALI_DIGIT.test(asBlob)) fail("Assamese text contains Bengali digits — must use English digits");
  else ok("no Bengali digits — all numerals are ASCII");

  const missingTerms = Object.entries(REQUIRED_TERMS).filter(([t]) => !asBlob.includes(t));
  if (missingTerms.length) fail(`this chapter's live vocabulary is not being used: ${missingTerms.map(([t, e]) => `${t} (${e})`).join(", ")}`);
  else ok(`all ${Object.keys(REQUIRED_TERMS).length} of this chapter's key Assamese terms appear in the batch`);

  const usedBanned = Object.entries(BANNED_TERMS).filter(([t]) => asBlob.includes(t));
  if (usedBanned.length) fail(`off-vocabulary synonyms used: ${usedBanned.map(([t, e]) => `${t} — ${e}`).join("; ")}`);
  else ok("no off-vocabulary Assamese synonyms");

  // English docs must carry no Assamese script at all
  const enBlob = [...mcqs.entries(), ...pqs.entries()]
    .filter(([id]) => id.includes(`-${ID_TAG}-en-`))
    .flatMap(([, d]) => strings(d)).join("\n");
  if (/[ঀ-৿]/.test(enBlob)) fail("Assamese script leaked into this batch's English docs");
  else ok("no Assamese script in this batch's English docs");

  // ── figure URLs must resolve ─────────────────────────────────────────────
  const urls = new Set<string>();
  for (const [id, d] of [...mcqs.entries(), ...pqs.entries()]) {
    if (!id.includes(`-${ID_TAG}-`)) continue;
    for (const s of strings(d)) {
      for (const m of s.matchAll(/https?:\/\/[^\s"'<>)\\]+?\.png/g)) urls.add(m[0]);
    }
  }
  let broken = 0;
  await Promise.all([...urls].map(async (u) => {
    try {
      const r = await fetch(u, { method: "HEAD" });
      if (!r.ok) { fail(`figure HTTP ${r.status}: ${u}`); broken++; }
    } catch (e) { fail(`figure unreachable: ${u} (${(e as Error).message})`); broken++; }
  }));
  if (urls.size !== 12) fail(`expected 12 distinct figure URLs in this batch, found ${urls.size}`);
  if (!broken) ok(`all ${urls.size} distinct figure URLs return HTTP 200`);

  // ── report ───────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(70));
  if (!problems.length) { console.log("\nBATCH AUDIT CLEAN — no problems found."); return; }
  console.log(`\n${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.log(`  ! ${p}`));
  process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
