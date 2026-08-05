/**
 * Reads the seeded Triangles MCQs back out of Firestore and re-checks them
 * against the data file — the live docs, not the local objects that produced
 * them. Also dumps a sample for the mandatory human read-through.
 *
 * Checks, per language:
 *   - 22 mcqs and 22 paperQuestions exist under this batch's sourcePaper
 *   - every field round-tripped (question, options, correctIndex, difficulty,
 *     setNumber/order slot, figureUrl)
 *   - set sizes 15 + 7 with contiguous orders, bank orders 100..121 unique
 *   - EN and AS agree on correctIndex, difficulty and figure for every item
 *   - all five mandatory colours present in every explanation and every answer
 *   - Assamese hygiene on the LIVE strings (ৰ not র, ASCII digits)
 *   - every figureUrl returns HTTP 200
 *
 * SAMPLE=1 additionally prints 5 English + 5 Assamese docs in full.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { items } from "./_data/mathix-c07-tri-mcqs.js";

const CHAPTER = "math-ix-c07";
const SOURCE_PAPER = "Triangles MCQ Practice (adapted)";
const COLOURS = ["#d97706", "#da6b45", "#0d9488", "#16a34a", "#2563eb"];
const LETTERS = ["a", "b", "c", "d"];

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const problems: string[] = [];
const fail = (s: string) => problems.push(s);

async function main() {
  const mcqSnap = await db.collection("mcqs").where("chapterId", "==", CHAPTER).where("sourcePaper", "==", SOURCE_PAPER).get();
  const pqSnap = await db.collection("paperQuestions").where("chapterId", "==", CHAPTER).where("sourcePaper", "==", SOURCE_PAPER).get();
  console.log(`live mcqs: ${mcqSnap.size}   live paperQuestions: ${pqSnap.size}   (expected ${items.length * 2} each)`);
  if (mcqSnap.size !== items.length * 2) fail(`mcqs count ${mcqSnap.size}, expected ${items.length * 2}`);
  if (pqSnap.size !== items.length * 2) fail(`paperQuestions count ${pqSnap.size}, expected ${items.length * 2}`);

  const mcq = new Map(mcqSnap.docs.map(d => [d.id, d.data()]));
  const pq = new Map(pqSnap.docs.map(d => [d.id, d.data()]));
  const urls = new Set<string>();

  for (const it of items) {
    const pad = String(it.i).padStart(2, "0");
    for (const [lang, langName] of [["en", "English"], ["as", "Assamese"]] as const) {
      const c = it[lang];
      const mId = `mcq-${CHAPTER}-tri-${lang}-${pad}`;
      const pId = `pq-${CHAPTER}-tri-${lang}-${pad}`;
      const m = mcq.get(mId), p = pq.get(pId);
      if (!m) { fail(`${mId} missing from Firestore`); continue; }
      if (!p) { fail(`${pId} missing from Firestore`); continue; }

      if (m.language !== langName) fail(`${mId} language "${m.language}"`);
      if (m.question !== c.question) fail(`${mId} question does not match the data file`);
      if (JSON.stringify(m.options) !== JSON.stringify(c.options)) fail(`${mId} options do not match the data file`);
      if (m.correctIndex !== it.correctIndex) fail(`${mId} correctIndex ${m.correctIndex} != ${it.correctIndex}`);
      if (m.difficulty !== it.difficulty) fail(`${mId} difficulty "${m.difficulty}"`);
      if (m.setNumber !== 1 + Math.floor(it.i / 15)) fail(`${mId} setNumber ${m.setNumber}`);
      if (m.order !== it.i % 15) fail(`${mId} order ${m.order}`);
      if (p.order !== 100 + it.i) fail(`${pId} bank order ${p.order}`);
      if (p.questionType !== "mcq") fail(`${pId} questionType "${p.questionType}"`);
      if (p.marks !== 1) fail(`${pId} marks ${p.marks}`);
      if (p.boards !== "Both") fail(`${pId} boards "${p.boards}"`);
      if (p.difficulty !== it.difficulty) fail(`${pId} difficulty "${p.difficulty}"`);

      // the live answer must name the same option letter the data file asserts
      const wanted = `${LETTERS[it.correctIndex]})</strong>`;
      if (!String(m.explanation).includes(wanted)) fail(`${mId} explanation does not announce option (${LETTERS[it.correctIndex]})`);
      if (!String(p.answer).includes(wanted)) fail(`${pId} answer does not announce option (${LETTERS[it.correctIndex]})`);

      for (const [tag, txt] of [[mId, String(m.explanation)], [pId, String(p.answer)]] as const) {
        for (const hex of COLOURS) if (!txt.includes(hex)) fail(`${tag} missing colour ${hex}`);
        if ((txt.match(/<span/g) || []).length !== (txt.match(/<\/span>/g) || []).length) fail(`${tag} unbalanced <span>`);
        if ((txt.match(/\$/g) || []).length % 2 !== 0) fail(`${tag} unbalanced $`);
      }

      // every one of the four options must appear verbatim in the bank question
      for (const o of c.options) if (!String(p.question).includes(o)) fail(`${pId} bank question is missing option "${o}"`);

      if (it.figure) {
        const want = `triangles-ix-chapter/${it.figure}`;
        if (!String(m.figureUrl ?? "").endsWith(want)) fail(`${mId} figureUrl "${m.figureUrl}"`);
        if (!String(p.figureUrl ?? "").endsWith(want)) fail(`${pId} figureUrl "${p.figureUrl}"`);
        urls.add(String(m.figureUrl)); urls.add(String(p.figureUrl));
      } else {
        if (m.figureUrl) fail(`${mId} has an unexpected figureUrl`);
      }

      if (langName === "Assamese") {
        const blob = [m.question, ...(m.options as string[]), m.explanation, p.question, p.answer].join("\n");
        if (blob.includes("র")) fail(`${mId}/${pId} contains Bengali র on the live doc`);
        if (/[০-৯]/.test(blob)) fail(`${mId}/${pId} contains Bengali digits on the live doc`);
      }
    }
    // EN/AS must agree on everything language-independent
    const en = mcq.get(`mcq-${CHAPTER}-tri-en-${pad}`), as = mcq.get(`mcq-${CHAPTER}-tri-as-${pad}`);
    if (en && as) {
      if (en.correctIndex !== as.correctIndex) fail(`i${it.i} EN/AS correctIndex disagree`);
      if (en.difficulty !== as.difficulty) fail(`i${it.i} EN/AS difficulty disagree`);
      if ((en.figureUrl ?? null) !== (as.figureUrl ?? null)) fail(`i${it.i} EN/AS figureUrl disagree`);
      if (en.setNumber !== as.setNumber || en.order !== as.order) fail(`i${it.i} EN/AS slot disagree`);
    }
  }

  // slot + bank-order uniqueness across the live docs
  for (const lang of ["English", "Assamese"]) {
    const mine = mcqSnap.docs.filter(d => d.data().language === lang);
    const slots = mine.map(d => `${d.data().setNumber}/${d.data().order}`);
    if (new Set(slots).size !== slots.length) fail(`${lang} mcqs have duplicate (set, order) slots`);
    const bySet = new Map<number, number[]>();
    mine.forEach(d => bySet.set(d.data().setNumber, [...(bySet.get(d.data().setNumber) ?? []), d.data().order]));
    for (const [s, orders] of [...bySet].sort((a, b) => a[0] - b[0])) {
      const sorted = [...orders].sort((a, b) => a - b);
      const want = sorted.map((_, i) => i);
      console.log(`  ${lang} set ${s}: ${sorted.length} questions, orders ${sorted[0]}..${sorted[sorted.length - 1]}`);
      if (JSON.stringify(sorted) !== JSON.stringify(want)) fail(`${lang} set ${s} orders not contiguous from 0`);
    }
    const bank = pqSnap.docs.filter(d => d.data().language === lang).map(d => d.data().order as number);
    if (new Set(bank).size !== bank.length) fail(`${lang} bank orders contain duplicates`);
    const lo = Math.min(...bank), hi = Math.max(...bank);
    console.log(`  ${lang} bank orders ${lo}..${hi} (${bank.length} docs)`);
    if (lo !== 100 || hi !== 100 + items.length - 1) fail(`${lang} bank order range ${lo}..${hi} is not 100..${100 + items.length - 1}`);
  }

  console.log(`\nchecking ${urls.size} distinct figure URLs…`);
  for (const u of urls) {
    const r = await fetch(u, { method: "HEAD" });
    console.log(`  HTTP ${r.status}  ${u.split("/").pop()}`);
    if (!r.ok) fail(`figure ${r.status}: ${u}`);
  }

  if (process.env.SAMPLE === "1") {
    const pick = [1, 4, 9, 15, 20];
    for (const lang of ["en", "as"] as const) {
      for (const i of pick) {
        const d = mcq.get(`mcq-${CHAPTER}-tri-${lang}-${String(i).padStart(2, "0")}`)!;
        console.log("\n" + "=".repeat(72));
        console.log(`${lang.toUpperCase()} i${i} (source Q${i + 1})  set ${d.setNumber}/order ${d.order}  ${d.difficulty}  fig=${d.figureUrl ? "yes" : "no"}`);
        console.log("Q: " + d.question);
        (d.options as string[]).forEach((o, k) => console.log(`  (${LETTERS[k]}) ${o}${k === d.correctIndex ? "   <== correct" : ""}`));
        console.log("EXPLANATION:\n" + d.explanation);
      }
    }
  }

  console.log("\n" + "=".repeat(72));
  if (!problems.length) { console.log("LIVE VERIFICATION CLEAN — every check passed."); return; }
  console.log(`${problems.length} PROBLEM(S):`);
  problems.forEach(p => console.log("  ! " + p));
  process.exitCode = 1;
}
main().catch(e => { console.error(e); process.exit(1); });
