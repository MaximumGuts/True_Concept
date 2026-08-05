// Seed the 22 MCQs of `Books/selfstudys_com_file (25).pdf` into math-ix-c06
// (Lines and Angles).
//   mcqs            22 x 2 languages, setNumber = 1 + floor(i/15), order = i % 15
//   paperQuestions  22 x 2 languages, order = 100 + i, questionType "mcq", marks 1
//
// Deterministic doc ids (re-runnable — a second run overwrites rather than
// duplicates). DRY RUN by default; APPLY=1 to write.
//
// math-ix-c06 is a medium:"Both" chapter — ONE chapter holds both languages,
// separated by the per-doc `language` field, so every question is seeded twice.
//
// Nine other agents write other chapters concurrently. This script owns ONLY
// the `-ssd-` id namespace, mcqs sets 1..2 of math-ix-c06 and paperQuestions
// orders 100..121, and it aborts if anything foreign is sitting in those slots.
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { items, SsMcqItem } from "./_data/mathix-c06-ss-mcqs.js";

const CHAPTER = "math-ix-c06";
const SOURCE_PAPER = "Lines and Angles MCQ Practice (adapted)";
const APPLY = process.env.APPLY === "1";
const SET_SIZE = 15;
const BANK_BASE = 100;
const BANK_MAX = 299;                        // range assigned to this agent
const ID_TAG = "ssd";
const FIG_BASE = "https://storage.googleapis.com/true-concept-353c9.firebasestorage.app/lines-angles-ix-chapter/";

const LETTERS = ["a", "b", "c", "d"];
const setNumberOf = (i: number) => 1 + Math.floor(i / SET_SIZE);
const orderOf = (i: number) => i % SET_SIZE;
const bankOrderOf = (i: number) => BANK_BASE + i;

const failures: string[] = [];
const fail = (s: string) => failures.push(s);

const BENGALI_RA = "র";        // র — forbidden
const ASSAMESE_RA = "ৰ";       // ৰ — required
const BENGALI_DIGITS = /[০-৯]/;
const BENGALI_BLOCK = /[ঀ-৿]/;

// ---------------- colour-styled explanation (identical structure EN + AS) ---
const L = {
  en: { given: "Given", working: "Working", correct: "Correct option:", note: "Note: ", stop: "." },
  as: { given: "দিয়া আছে", working: "সমাধান", correct: "শুদ্ধ বিকল্প:", note: "টোকাঃ ", stop: "।" },
} as const;

function explanationOf(lang: "en" | "as", it: SsMcqItem): string {
  const c = it[lang], t = L[lang];
  const head = `**<span style="color:#d97706">${t.given}</span>** — <span style="color:#0d9488">${c.given}</span>`;
  const mid = `**<span style="color:#da6b45">${t.working}</span>**\n\n${c.work}`;
  const tail = `<span style="color:#16a34a"><strong>${t.correct} (${LETTERS[it.correctIndex]})</strong> — ${c.answerLabel}${t.stop}</span>`;
  const note = c.note ? `\n\n<span style="color:#2563eb">${t.note}${c.note}</span>` : "";
  return `${head}\n\n${mid}\n\n${tail}${note}`;
}

/** Teacher-bank stem: the question with its four options spelled out. */
function pqQuestion(lang: "en" | "as", it: SsMcqItem): string {
  const c = it[lang];
  return c.question + "\n\n" + c.options.map((o, k) => `(${LETTERS[k]}) ${o}`).join("\n");
}

// ---------------- answer justification (never trust the printed key) --------
function runChecker() {
  const divergences: SsMcqItem[] = [];
  for (const it of items) {
    const tag = `i${it.i} (source Q${it.i + 1})`;
    if (!(it.correctIndex >= 0 && it.correctIndex <= 3)) fail(`${tag} correctIndex out of range`);
    if (!(it.printedKey >= 0 && it.printedKey <= 3)) fail(`${tag} printedKey out of range`);
    if (it.warrant.trim().length < 25) fail(`${tag} warrant too thin to be an audit trail`);

    // exact-match needle: substring matching is unusable here because the
    // Assamese distractor অসমান literally contains the correct answer সমান.
    for (const [lang, needle] of [["en", it.enNeedle], ["as", it.asNeedle]] as const) {
      const opts = it[lang].options;
      if (opts[it.correctIndex] !== needle) {
        fail(`${tag} ${lang} options[correctIndex] is "${opts[it.correctIndex]}" but the needle says "${needle}"`);
      }
    }

    if (it.correctIndex !== it.printedKey) {
      divergences.push(it);
      if (!it.en.note?.trim()) fail(`${tag} divergence from printed key undocumented (EN note)`);
      if (!it.as.note?.trim()) fail(`${tag} divergence from printed key undocumented (AS note)`);
    }
  }
  if (divergences.length) {
    console.log(`\nPrinted answer key overridden on ${divergences.length} item(s):`);
    for (const it of divergences) {
      console.log(`  i${it.i} (source Q${it.i + 1}): printed (${LETTERS[it.printedKey]}) "${it.en.options[it.printedKey]}"`
        + ` -> seeded (${LETTERS[it.correctIndex]}) "${it.en.options[it.correctIndex]}"`);
      console.log(`      warrant: ${it.warrant}`);
    }
    console.log("");
  } else {
    console.log(`Printed answer key agreed with the re-solved answer on all ${items.length} items.`);
  }
}

// ---------------- structural + script + styling validation ------------------
function validateContent() {
  for (const it of items) {
    const tag = `i${it.i}`;
    const asTexts = [it.as.question, ...it.as.options, it.as.given, it.as.work, it.as.answerLabel, it.as.note ?? ""];
    const enTexts = [it.en.question, ...it.en.options, it.en.given, it.en.work, it.en.answerLabel, it.en.note ?? ""];

    for (const t of asTexts) {
      if (t.includes(BENGALI_RA)) fail(`${tag} AS contains Bengali র (U+09B0)`);
      if (BENGALI_DIGITS.test(t)) fail(`${tag} AS contains Bengali digits`);
      for (const m of t.match(/\$[^$]*\$|\\text\{[^}]*\}/g) || []) {
        if (BENGALI_BLOCK.test(m)) fail(`${tag} AS has bare Assamese inside maths: ${m.slice(0, 34)}`);
      }
    }
    if (!asTexts.some(t => t.includes(ASSAMESE_RA))) fail(`${tag} AS has no ৰ anywhere — suspicious`);
    for (const t of enTexts) {
      if (BENGALI_BLOCK.test(t)) fail(`${tag} Assamese script leaked into the English doc`);
    }
    for (const t of [...asTexts, ...enTexts]) {
      if ((t.match(/\$/g) || []).length % 2 !== 0) fail(`${tag} unbalanced $ in "${t.slice(0, 40)}"`);
    }

    // the student MCQ screen renders `question` without KaTeX and `options` as
    // plain text, so neither may carry LaTeX — Unicode ∠ ° △ ∥ ⊥ only.
    for (const [lang, side] of [["en", it.en], ["as", it.as]] as const) {
      if (side.question.includes("$") || side.question.includes("\\")) fail(`${tag} ${lang} question carries LaTeX (not rendered on the MCQ screen)`);
      for (const o of side.options) {
        if (o.includes("$") || o.includes("\\") || o.includes("<")) fail(`${tag} ${lang} option is not plain text: "${o}"`);
      }
      if (side.options.length !== 4) fail(`${tag} ${lang} does not have exactly 4 options`);
      if (new Set(side.options).size !== 4) fail(`${tag} ${lang} has duplicate options`);
      if (!side.question.trim() || !side.given.trim() || !side.work.trim() || !side.answerLabel.trim()) fail(`${tag} ${lang} has an empty field`);
    }

    // mandatory five-colour styling must survive into the composed explanation
    for (const lang of ["en", "as"] as const) {
      const e = explanationOf(lang, it);
      for (const hex of ["#d97706", "#da6b45", "#0d9488", "#16a34a", "#2563eb"]) {
        if (!e.includes(hex)) fail(`${tag} ${lang} explanation is missing colour ${hex}`);
      }
      const open = (e.match(/<span/g) || []).length, closed = (e.match(/<\/span>/g) || []).length;
      if (open !== closed) fail(`${tag} ${lang} explanation has unbalanced <span> tags`);
    }

    if (!["easy", "moderate", "hard"].includes(it.difficulty)) fail(`${tag} bad difficulty "${it.difficulty}"`);
    // -v2 suffix is mandatory: the bucket serves a long cacheControl and a
    // reused filename would keep serving stale bytes.
    if (it.figure && !/^ss-mcq-q\d{2}-[a-z0-9-]+-v2\.png$/.test(it.figure)) {
      fail(`${tag} figure name outside this agent's ss-mcq-…-v2 namespace: ${it.figure}`);
    }
  }

  // index integrity
  const seen = new Set<number>();
  items.forEach(it => { if (seen.has(it.i)) fail(`duplicate i=${it.i}`); seen.add(it.i); });
  for (let k = 0; k < items.length; k++) if (!seen.has(k)) fail(`missing i=${k}`);

  // the source numbered 1..22 straight through, one band, no gaps
  if (items.length !== 22) fail(`expected 22 items (source Q1..Q22), found ${items.length}`);

  // assigned slot integrity
  for (const it of items) {
    const o = bankOrderOf(it.i);
    if (o < BANK_BASE || o > BANK_MAX) fail(`i${it.i} bank order ${o} outside the assigned range ${BANK_BASE}..${BANK_MAX}`);
  }

  // 15-per-set rule: only the LAST set may be short
  const sets = new Map<number, number>();
  items.forEach(it => sets.set(setNumberOf(it.i), (sets.get(setNumberOf(it.i)) ?? 0) + 1));
  const nums = [...sets.keys()].sort((a, b) => a - b);
  for (const n of nums) {
    const size = sets.get(n)!;
    if (size > SET_SIZE) fail(`set ${n} holds ${size} items (> ${SET_SIZE})`);
    if (size < SET_SIZE && n !== nums[nums.length - 1]) fail(`set ${n} is short but is not the last set`);
  }
  // and the order slots inside each set must be unique
  const slots = new Set<string>();
  items.forEach(it => {
    const k = `${setNumberOf(it.i)}/${orderOf(it.i)}`;
    if (slots.has(k)) fail(`duplicate mcq slot ${k}`);
    slots.add(k);
  });
}

// ---------------- seeding ---------------------------------------------------
async function run() {
  runChecker();
  validateContent();
  if (failures.length) {
    console.error("CHECKER FAILED — refusing to seed:");
    [...new Set(failures)].forEach(f => console.error("  -", f));
    process.exitCode = 1;
    return;
  }
  const figFiles = new Set(items.map(it => it.figure).filter(Boolean) as string[]);
  console.log(`Checker passed: ${items.length} items x 2 languages; `
    + `${items.filter(it => it.figure).length} figure-bearing items over ${figFiles.size} distinct PNGs.`);

  if (getApps().length === 0) {
    const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
    initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
  }
  const db = getFirestore();

  // safety: nobody else may already own our bank orders or our mcq slots
  const usedOrders = new Set(items.map(it => bankOrderOf(it.i)));
  const pqSnap = await db.collection("paperQuestions").where("chapterId", "==", CHAPTER).get();
  const foreignPq = pqSnap.docs.filter(d =>
    usedOrders.has(d.data().order ?? -1) && !d.id.startsWith(`pq-${CHAPTER}-${ID_TAG}-`));
  console.log(`Existing paperQuestions in ${CHAPTER}: ${pqSnap.size} (foreign inside orders `
    + `${Math.min(...usedOrders)}-${Math.max(...usedOrders)}: ${foreignPq.length})`);
  if (foreignPq.length) {
    console.error("Aborting: bank orders this script wants are already used by docs it does not own:");
    foreignPq.slice(0, 10).forEach(d => console.error("  -", d.id, "order", d.data().order));
    process.exitCode = 1;
    return;
  }

  const mcqSnap = await db.collection("mcqs").where("chapterId", "==", CHAPTER).get();
  const mySets = new Set(items.map(it => setNumberOf(it.i)));
  const foreignMcq = mcqSnap.docs.filter(d =>
    mySets.has(d.data().setNumber) && !d.id.startsWith(`mcq-${CHAPTER}-${ID_TAG}-`));
  console.log(`Existing mcqs in ${CHAPTER}: ${mcqSnap.size} (foreign inside sets ${[...mySets].join(",")}: ${foreignMcq.length})`);
  if (foreignMcq.length) {
    console.error("Aborting: mcqs docs sitting in this script's sets that it does not own:");
    foreignMcq.slice(0, 10).forEach(d => console.error("  -", d.id, "set", d.data().setNumber, "order", d.data().order));
    process.exitCode = 1;
    return;
  }

  type Op = { coll: string; id: string; data: Record<string, unknown> };
  const ops: Op[] = [];

  for (const it of items) {
    const pad = String(it.i).padStart(2, "0");
    const figureUrl = it.figure ? FIG_BASE + it.figure : undefined;
    for (const [lang, langName] of [["en", "English"], ["as", "Assamese"]] as const) {
      const c = it[lang];
      ops.push({
        coll: "mcqs", id: `mcq-${CHAPTER}-${ID_TAG}-${lang}-${pad}`,
        data: {
          chapterId: CHAPTER, language: langName,
          question: c.question, options: c.options, correctIndex: it.correctIndex,
          explanation: explanationOf(lang, it),
          difficulty: it.difficulty,
          setNumber: setNumberOf(it.i), order: orderOf(it.i),
          sourcePaper: SOURCE_PAPER,
          ...(figureUrl ? { figureUrl } : {}),
          createdAt: FieldValue.serverTimestamp(),
        },
      });
      ops.push({
        coll: "paperQuestions", id: `pq-${CHAPTER}-${ID_TAG}-${lang}-${pad}`,
        data: {
          chapterId: CHAPTER, language: langName,
          question: pqQuestion(lang, it), answer: explanationOf(lang, it),
          questionType: "mcq", marks: 1, difficulty: it.difficulty,
          boards: "Both", order: bankOrderOf(it.i),
          sourcePaper: SOURCE_PAPER,
          ...(figureUrl ? { figureUrl } : {}),
          createdAt: FieldValue.serverTimestamp(),
        },
      });
    }
  }

  const sets = new Map<number, number>();
  items.forEach(it => sets.set(setNumberOf(it.i), (sets.get(setNumberOf(it.i)) ?? 0) + 1));
  const diff = new Map<string, number>();
  items.forEach(it => diff.set(it.difficulty, (diff.get(it.difficulty) ?? 0) + 1));
  console.log(`Plan: ${ops.length} set() writes`);
  console.log(`  mcqs           ${items.length} EN + ${items.length} AS   (sets ${[...sets.entries()].sort((a, b) => a[0] - b[0]).map(([s, n]) => `${s}:${n}`).join(", ")})`);
  console.log(`  paperQuestions ${items.length} EN + ${items.length} AS   (orders ${BANK_BASE}-${BANK_BASE + items.length - 1})`);
  console.log(`  difficulty     ${[...diff.entries()].map(([d, n]) => `${d}:${n}`).join(", ")}`);
  console.log(`  figureUrl set on ${items.filter(it => it.figure).length} x 2 mcqs and the same x 2 paperQuestions`);

  if (!APPLY) {
    console.log("\nDRY RUN (set APPLY=1 to write). Sample ops:");
    for (const s of [
      ops.find(o => o.coll === "mcqs" && o.id.endsWith("-en-06")),
      ops.find(o => o.coll === "mcqs" && o.id.endsWith("-as-06")),
      ops.find(o => o.coll === "paperQuestions" && o.id.endsWith("-as-21")),
    ]) console.log(JSON.stringify(s, null, 1));
    return;
  }

  let batch = db.batch(), n = 0, committed = 0;
  for (const op of ops) {
    batch.set(db.collection(op.coll).doc(op.id), op.data);
    if (++n === 400) { await batch.commit(); committed += n; n = 0; batch = db.batch(); }
  }
  if (n) { await batch.commit(); committed += n; }
  console.log(`APPLIED: ${committed} writes committed.`);
}

run().catch(e => { console.error(e); process.exitCode = 1; });
