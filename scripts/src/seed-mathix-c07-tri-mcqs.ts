// Seed the 22 MCQs of `Books/selfstudys_com_file (26).pdf` into math-ix-c07 (Triangles).
//   mcqs            22 x 2 languages, setNumber = 1 + floor(i/15), order = i % 15
//   paperQuestions  22 x 2 languages, order = 100 + i, questionType "mcq", marks 1
// Deterministic doc ids (re-runnable), dry run by default, APPLY=1 to write.
//
// math-ix-c07 is a medium:"Both" chapter — ONE chapter holds both languages,
// separated by the per-doc `language` field. Every question is seeded twice.
//
// Nine other agents write OTHER chapters concurrently; this script owns ONLY
// the `-tri-` id namespace inside math-ix-c07, mcqs sets 1..2 and
// paperQuestions orders 100..299, and it aborts if anything foreign is found
// inside those slots.
//
// Refuses to write unless every check below passes:
//   * the printed answer key is re-derived and any divergence must be documented
//   * every repair of a defective source item must be documented in BOTH languages
//   * Assamese script hygiene (ৰ not র, ASCII digits, no Assamese bare in maths)
//   * the five mandatory colours survive into the composed explanation
//   * no lost-backslash LaTeX, no unbalanced $ or <span>
//   * assigned slot ranges and the 15-per-set rule
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { items, TriMcqItem } from "./_data/mathix-c07-tri-mcqs.js";

const CHAPTER = "math-ix-c07";
const SOURCE_PAPER = "Triangles MCQ Practice (adapted)";
const APPLY = process.env.APPLY === "1";
const SET_SIZE = 15;
const BANK_BASE = 100;
const BANK_MAX = 299;                       // assigned range 100..299
const ID_TAG = "tri";
const FIG_BASE = "https://storage.googleapis.com/true-concept-353c9.firebasestorage.app/triangles-ix-chapter/";

const LETTERS = ["a", "b", "c", "d"];
const setNumberOf = (i: number) => 1 + Math.floor(i / SET_SIZE);
const orderOf = (i: number) => i % SET_SIZE;
const bankOrderOf = (i: number) => BANK_BASE + i;

const failures: string[] = [];
const fail = (s: string) => failures.push(s);

const BENGALI_RA = "র";        // U+09B0 — forbidden
const ASSAMESE_RA = "ৰ";       // U+09F0 — required
const BENGALI_DIGITS = /[০-৯]/;
const BENGALI_BLOCK = /[ঀ-৿]/;

// ---------------- colour-styled explanation (identical structure in EN and AS) ----
const L = {
  en: { given: "Given", working: "Working", correct: "Correct option:", note: "Note: ", stop: "." },
  as: { given: "দিয়া আছে", working: "সমাধান", correct: "শুদ্ধ বিকল্প:", note: "টোকাঃ ", stop: "।" },
} as const;

function explanationOf(lang: "en" | "as", it: TriMcqItem): string {
  const c = it[lang], t = L[lang];
  const head = `**<span style="color:#d97706">${t.given}</span>** — <span style="color:#0d9488">${c.given}</span>`;
  const mid = `**<span style="color:#da6b45">${t.working}</span>**\n\n${c.work}`;
  const tail = `<span style="color:#16a34a"><strong>${t.correct} (${LETTERS[it.correctIndex]})</strong> — ${c.answerLabel}${t.stop}</span>`;
  const note = c.note ? `\n\n<span style="color:#2563eb">${t.note}${c.note}</span>` : "";
  return `${head}\n\n${mid}\n\n${tail}${note}`;
}

function pqQuestion(lang: "en" | "as", it: TriMcqItem): string {
  const c = it[lang];
  return c.question + "\n\n" + c.options.map((o, k) => `(${LETTERS[k]}) ${o}`).join("\n");
}

// ---------------- answer justification (never trust the printed key) --------------
function runChecker() {
  const divergences: TriMcqItem[] = [];
  const repairs: TriMcqItem[] = [];
  for (const it of items) {
    const tag = `i${it.i} (source Q${it.i + 1})`;
    if (!(it.correctIndex >= 0 && it.correctIndex <= 3)) fail(`${tag} correctIndex out of range`);
    if (!(it.printedKey >= 0 && it.printedKey <= 3)) fail(`${tag} printedKey out of range`);
    if (it.warrant.trim().length < 25) fail(`${tag} warrant too thin to be an audit trail`);

    for (const [lang, needle] of [["en", it.enNeedle], ["as", it.asNeedle]] as const) {
      const opts = it[lang].options;
      if (!opts[it.correctIndex]?.includes(needle)) fail(`${tag} ${lang} answer option lacks needle "${needle}"`);
      if (opts.filter(o => o.includes(needle)).length !== 1) fail(`${tag} ${lang} needle "${needle}" is not unique among the options`);
    }

    if (it.correctIndex !== it.printedKey) {
      divergences.push(it);
      if (!it.en.note?.trim()) fail(`${tag} divergence from printed key undocumented (EN note)`);
      if (!it.as.note?.trim()) fail(`${tag} divergence from printed key undocumented (AS note)`);
    }
    // a repaired source item must carry a student-visible note in BOTH languages
    if (it.sourceRepair) {
      repairs.push(it);
      if (it.sourceRepair.trim().length < 40) fail(`${tag} sourceRepair too thin`);
      if (!it.en.note?.trim()) fail(`${tag} sourceRepair not surfaced to the student (EN note)`);
      if (!it.as.note?.trim()) fail(`${tag} sourceRepair not surfaced to the student (AS note)`);
    }
    // conversely, a note must be justified by a divergence or a repair
    if ((it.en.note || it.as.note) && !it.sourceRepair && it.correctIndex === it.printedKey) {
      fail(`${tag} carries a note but neither a divergence nor a sourceRepair explains it`);
    }
  }
  if (divergences.length) {
    console.log(`\nPrinted answer key overridden on ${divergences.length} item(s):`);
    for (const it of divergences) {
      console.log(`  i${it.i} (source Q${it.i + 1}): printed (${LETTERS[it.printedKey]}) "${it.en.options[it.printedKey]}"`
        + ` -> seeded (${LETTERS[it.correctIndex]}) "${it.en.options[it.correctIndex]}"`);
      console.log(`      warrant: ${it.warrant}`);
    }
  } else {
    console.log(`Printed answer key agreed with the re-solved answer on all ${items.length} items.`);
  }
  if (repairs.length) {
    console.log(`\nDefective source items repaired (${repairs.length}), each with a student-visible note in both languages:`);
    for (const it of repairs) console.log(`  i${it.i} (source Q${it.i + 1}): ${it.sourceRepair}`);
  }
  console.log("");
}

/* A LaTeX string typed into a plain JS template literal silently loses its
   backslashes ("$\angle A$" -> "$angle A$"): it typechecks, seeds clean, and
   only shows up as garbled prose on the student's screen. Same detector the
   chapter audit uses. */
const COMMANDS = /\b(parallel|triangle|angle|perp|cong|frac|dfrac|sqrt|times|cdot|Rightarrow|leftrightarrow|therefore|because|circ|overline|widehat|sim|neq|leq|geq|approx|qquad|quad)\b/;

function checkMath(tag: string, s: string) {
  const segments: string[] = [];
  const inlineOnly = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, body: string) => { segments.push(body); return " "; });
  if ((inlineOnly.match(/\$/g) ?? []).length % 2 !== 0) { fail(`${tag} has an unbalanced $ delimiter`); return; }
  for (const m of inlineOnly.matchAll(/\$([^$]+)\$/g)) segments.push(m[1]);
  for (const body of segments) {
    if (/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^>]*)?>/.test(body)) fail(`${tag} has an HTML tag inside maths: $${body.slice(0, 50)}$`);
    if (BENGALI_BLOCK.test(body) && !/\\text\{/.test(body)) fail(`${tag} has bare Assamese inside maths: $${body.slice(0, 40)}$`);
    const bare = COMMANDS.exec(body.replace(/\\[a-zA-Z]+/g, " "));
    if (bare) fail(`${tag} looks like a lost backslash — "${bare[1]}" as bare text in $${body.slice(0, 50)}$`);
  }
}

// ---------------- structural + script + styling validation -----------------------
function validateContent() {
  for (const it of items) {
    const tag = `i${it.i}`;
    const asTexts = [it.as.question, ...it.as.options, it.as.given, it.as.work, it.as.answerLabel, it.as.note ?? ""];
    const enTexts = [it.en.question, ...it.en.options, it.en.given, it.en.work, it.en.answerLabel, it.en.note ?? ""];

    for (const t of asTexts) {
      if (t.includes(BENGALI_RA)) fail(`${tag} AS contains Bengali র (U+09B0)`);
      if (BENGALI_DIGITS.test(t)) fail(`${tag} AS contains Bengali digits`);
    }
    if (!asTexts.some(t => t.includes(ASSAMESE_RA))) fail(`${tag} AS has no ৰ anywhere — suspicious`);
    /* The EN note quotes the printed Assamese-free source verbatim, but the EN
       body must never carry Assamese script. */
    for (const t of enTexts) {
      if (BENGALI_BLOCK.test(t)) fail(`${tag} Assamese script leaked into the English doc`);
    }
    for (const t of [...asTexts, ...enTexts]) checkMath(tag, t);

    for (const [lang, side] of [["en", it.en], ["as", it.as]] as const) {
      /* The student MCQ screen renders the stem and the options through
         InlineMarkdown (markdown + KaTeX + raw HTML). Keeping them plain Unicode
         — △ ≅ ∠ ° ½ — matches the sibling chapters and removes any chance of a
         half-escaped LaTeX fragment reaching a student. */
      if (side.question.includes("$") || side.question.includes("\\")) fail(`${tag} ${lang} question carries LaTeX; keep the stem plain Unicode`);
      for (const o of side.options) {
        if (o.includes("$") || o.includes("\\")) fail(`${tag} ${lang} option carries LaTeX: "${o}"`);
        /* "<" is fine as a comparison sign, but "<x" would be parsed as an HTML tag. */
        if (/<[a-zA-Z/!]/.test(o)) fail(`${tag} ${lang} option has what looks like an HTML tag: "${o}"`);
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
    if (it.figure && !/^tri-mcq-[a-z0-9-]+-v[0-9]+\.png$/.test(it.figure)) fail(`${tag} figure name outside the tri-mcq-…-vN namespace: ${it.figure}`);
  }

  // index integrity
  const seen = new Set<number>();
  items.forEach(it => { if (seen.has(it.i)) fail(`duplicate i=${it.i}`); seen.add(it.i); });
  for (let k = 0; k < items.length; k++) if (!seen.has(k)) fail(`missing i=${k}`);

  // assigned slot integrity
  for (const it of items) {
    if (bankOrderOf(it.i) < BANK_BASE || bankOrderOf(it.i) > BANK_MAX) fail(`i${it.i} bank order ${bankOrderOf(it.i)} outside the assigned range ${BANK_BASE}..${BANK_MAX}`);
  }

  // 15-per-set rule: only the LAST set may be short
  const sets = new Map<number, number>();
  items.forEach(it => sets.set(setNumberOf(it.i), (sets.get(setNumberOf(it.i)) ?? 0) + 1));
  const nums = [...sets.keys()].sort((a, b) => a - b);
  if (nums[0] !== 1) fail(`set numbering must start at 1, starts at ${nums[0]}`);
  for (const n of nums) {
    const size = sets.get(n)!;
    if (size > SET_SIZE) fail(`set ${n} holds ${size} items (> ${SET_SIZE})`);
    if (size < SET_SIZE && n !== nums[nums.length - 1]) fail(`set ${n} is short but is not the last set`);
  }

  // difficulty spread — "everything moderate" is a tagging smell
  const diffs = new Map<string, number>();
  items.forEach(it => diffs.set(it.difficulty, (diffs.get(it.difficulty) ?? 0) + 1));
  console.log("Difficulty spread:", [...diffs].map(([k, v]) => `${k}=${v}`).join("  "));
  if (diffs.size < 3) fail(`difficulty spread uses only ${diffs.size} of the 3 values`);
}

// ---------------- seeding --------------------------------------------------------
async function run() {
  runChecker();
  validateContent();
  if (failures.length) {
    console.error("CHECKER FAILED — refusing to seed:");
    [...new Set(failures)].forEach(f => console.error("  -", f));
    process.exitCode = 1;
    return;
  }
  const figs = [...new Set(items.filter(it => it.figure).map(it => it.figure!))];
  console.log(`Checker passed: ${items.length} items x 2 languages, ${items.filter(it => it.figure).length} figure-bearing (${figs.length} distinct PNGs).`);

  if (getApps().length === 0) {
    const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
    initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
  }
  const db = getFirestore();

  // safety: nobody else may already own our bank orders or our mcq slots
  const pqSnap = await db.collection("paperQuestions").where("chapterId", "==", CHAPTER).get();
  const inRange = pqSnap.docs.filter(d => {
    const o = d.data().order ?? -1;
    return o >= BANK_BASE && o <= BANK_MAX;
  });
  const foreignPq = inRange.filter(d => !d.id.startsWith(`pq-${CHAPTER}-${ID_TAG}-`));
  console.log(`Existing paperQuestions in ${CHAPTER}: ${pqSnap.size} (orders ${BANK_BASE}-${BANK_MAX} present: ${inRange.length}, foreign: ${foreignPq.length})`);
  if (foreignPq.length) {
    console.error(`Aborting: orders ${BANK_BASE}..${BANK_MAX} are already used by docs this script does not own:`);
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
  console.log(`Plan: ${ops.length} set() writes`);
  console.log(`  mcqs           ${items.length} EN + ${items.length} AS   (sets ${[...sets.entries()].sort((a, b) => a[0] - b[0]).map(([s, n]) => `${s}:${n}`).join(", ")})`);
  console.log(`  paperQuestions ${items.length} EN + ${items.length} AS   (orders ${BANK_BASE}-${BANK_BASE + items.length - 1})`);
  console.log(`  figureUrl set on ${items.filter(i => i.figure).length} x 2 mcqs and the same x 2 paperQuestions`);

  if (!APPLY) {
    console.log("\nDRY RUN (set APPLY=1 to write). Sample ops:");
    for (const s of [
      ops.find(o => o.coll === "mcqs" && o.id.endsWith("-en-05")),
      ops.find(o => o.coll === "mcqs" && o.id.endsWith("-as-05")),
      ops.find(o => o.coll === "paperQuestions" && o.id.endsWith("-as-21")),
    ]) console.log(JSON.stringify(s, null, 1));
    return;
  }

  let n = 0;
  for (let k = 0; k < ops.length; k += 400) {
    const batch = db.batch();
    for (const op of ops.slice(k, k + 400)) batch.set(db.collection(op.coll).doc(op.id), op.data);
    await batch.commit();
    n += Math.min(400, ops.length - k);
    console.log(`  committed ${n}/${ops.length}`);
  }
  console.log("Done.");
}

run().catch(e => { console.error(e); process.exit(1); });
