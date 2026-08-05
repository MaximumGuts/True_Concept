/**
 * Second verification pass for the Polynomials SelfStudys batch.
 *
 * The pre-flight checked the data I intended to write. This checks what Firestore
 * actually holds: it re-reads every seeded doc and re-runs the independent algebraic
 * recomputation against the LIVE `options`/`correctIndex`, so a serialisation slip
 * (a lost backslash, a truncated option, a mis-set index) cannot pass unnoticed.
 *
 * Read-only.
 *
 * RUN:  npx tsx src/verify-poly-ix-selfstudys-live.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const CID = "math-ix-c02";
const SOURCE = "Polynomials MCQ Practice — SelfStudys Set (adapted)";
const problems: string[] = [];
const fail = (m: string) => problems.push(m);

/* The same independent expectations as the pre-flight, restated here on purpose so
   this file does not import (and therefore cannot inherit a bug from) the seed data. */
const EXPECT: Record<number, string> = {
  1: "$0$", 2: "Linear polynomial", 3: "$0$", 4: "$6$ terms", 5: "$1$",
  6: "$-360$", 7: "$-3$", 8: "$1331$", 9: "$(3x-2)(x-1)$", 10: "$p(a)=0$",
  11: "$x^{20}+1$", 12: "Not defined", 13: "$(x^{2}-x-2)$",
  15: String.raw`$-\frac{7}{2}$`, 16: String.raw`$a=-\frac{9}{4}$`, 18: "$2$",
  19: "Linear", 20: "$3$", 21: String.raw`$x=1,\ x=-6$`, 22: "Quadratic",
};
/* seeded order (index within the batch) -> source question number */
const ORDERED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 19, 20, 21, 22];

const BENGALI_RA = "র";
const BENGALI_DIGIT = /[০-৯]/;
const COLOURS = ["#d97706", "#da6b45", "#0d9488", "#16a34a"];

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

async function main() {
  const mcqs = (await db.collection("mcqs").where("chapterId", "==", CID).get()).docs
    .map((d) => ({ id: d.id, ...d.data() } as any)).filter((x) => x.sourcePaper === SOURCE);
  const bank = (await db.collection("paperQuestions").where("chapterId", "==", CID).get()).docs
    .map((d) => ({ id: d.id, ...d.data() } as any)).filter((x) => x.sourcePaper === SOURCE);

  console.log(`live docs with sourcePaper "${SOURCE}":`);
  console.log(`  mcqs=${mcqs.length}  paperQuestions=${bank.length}\n`);
  if (mcqs.length !== 40) fail(`expected 40 mcqs, found ${mcqs.length}`);
  if (bank.length !== 40) fail(`expected 40 paperQuestions, found ${bank.length}`);

  for (const lang of ["English", "Assamese"] as const) {
    const mine = mcqs.filter((m) => m.language === lang)
      .sort((a, b) => (a.setNumber - b.setNumber) || (a.order - b.order));
    if (mine.length !== 20) fail(`${lang}: ${mine.length} mcqs, expected 20`);

    mine.forEach((m, i) => {
      const pdfQ = ORDERED[i];
      const want = EXPECT[pdfQ];
      const at = m.options?.[m.correctIndex];
      const tag = `${lang} mcqs/${m.id} (source Q${pdfQ})`;

      if (!Array.isArray(m.options) || m.options.length !== 4) fail(`${tag}: options is not a 4-array`);
      // For English the recomputed answer text must sit exactly at correctIndex.
      if (lang === "English") {
        const idx = m.options.indexOf(want);
        if (idx === -1) fail(`${tag}: recomputed answer "${want}" absent from live options ${JSON.stringify(m.options)}`);
        else if (idx !== m.correctIndex) fail(`${tag}: recomputed answer sits at ${idx} but correctIndex=${m.correctIndex}`);
      } else {
        // Assamese: pure-maths options must be byte-identical to the English ones.
        const en = mcqs.find((x) => x.language === "English" && x.id === m.id.replace("-as-", "-en-"));
        if (!en) fail(`${tag}: no English twin`);
        else {
          if (en.correctIndex !== m.correctIndex) fail(`${tag}: correctIndex ${m.correctIndex} != English twin ${en.correctIndex}`);
          if (en.difficulty !== m.difficulty) fail(`${tag}: difficulty differs from English twin`);
          if (en.setNumber !== m.setNumber || en.order !== m.order) fail(`${tag}: slot differs from English twin`);
          en.options.forEach((o: string, k: number) => {
            if (/^\$[^$]*\$$/.test(o) && !/[A-Za-z]{4,}/.test(o.replace(/\\[a-zA-Z]+/g, "")) && m.options[k] !== o) {
              fail(`${tag}: maths option ${k} drifted — EN "${o}" vs AS "${m.options[k]}"`);
            }
          });
        }
      }
      if (at === undefined) fail(`${tag}: correctIndex ${m.correctIndex} has no option`);

      // styling + hygiene
      for (const c of COLOURS) if (!String(m.explanation).includes(c)) fail(`${tag}: explanation missing colour ${c}`);
      if (String(m.explanation).length < 120) fail(`${tag}: explanation suspiciously short`);
      if (!["easy", "moderate", "hard"].includes(m.difficulty)) fail(`${tag}: bad difficulty "${m.difficulty}"`);

      if (lang === "Assamese") {
        const all = strings(m).join("\n");
        if (all.includes(BENGALI_RA)) fail(`${tag}: Bengali RA present`);
        if (BENGALI_DIGIT.test(all)) fail(`${tag}: Bengali digits present`);
      }
      // a lost backslash anywhere in the doc
      for (const s of strings(m)) {
        for (const mm of s.replace(/\$\$[\s\S]+?\$\$/g, " ").matchAll(/\$([^$]+)\$/g)) {
          const stripped = mm[1].replace(/\\[a-zA-Z]+/g, " ");
          const bare = /\b(frac|sqrt|times|cdot|Rightarrow|neq)\b/.exec(stripped);
          if (bare) fail(`${tag}: lost backslash — bare "${bare[1]}"`);
        }
      }
    });

    // set shape
    const bySet = new Map<number, number[]>();
    mine.forEach((m) => bySet.set(m.setNumber, [...(bySet.get(m.setNumber) ?? []), m.order]));
    const shape = [...bySet.entries()].sort((a, b) => a[0] - b[0])
      .map(([s, o]) => `set${s}:${o.length}`).join(" ");
    console.log(`  ${lang} mcqs sets -> ${shape}`);
    for (const [s, orders] of bySet) {
      const sorted = [...orders].sort((a, b) => a - b);
      if (JSON.stringify(sorted) !== JSON.stringify(sorted.map((_, j) => j))) fail(`${lang} set ${s}: orders not contiguous from 0 (${sorted})`);
    }

    // bank twins
    const b = bank.filter((x) => x.language === lang).sort((a, b2) => a.order - b2.order);
    if (b.length !== 20) fail(`${lang}: ${b.length} bank docs, expected 20`);
    const orders = b.map((x) => x.order);
    if (orders[0] !== 300 || orders[orders.length - 1] !== 319) fail(`${lang} bank orders ${orders[0]}..${orders[orders.length - 1]}, expected 300..319`);
    if (new Set(orders).size !== orders.length) fail(`${lang}: duplicate bank orders`);
    b.forEach((x, i) => {
      const tag = `${lang} paperQuestions/${x.id}`;
      if (x.questionType !== "mcq") fail(`${tag}: questionType "${x.questionType}"`);
      if (x.marks !== 1) fail(`${tag}: marks ${x.marks}, expected 1`);
      if (x.boards !== "Both") fail(`${tag}: boards "${x.boards}"`);
      if (!["easy", "moderate", "hard"].includes(x.difficulty)) fail(`${tag}: bad difficulty`);
      // the bank stem must carry all four labelled options
      for (const L of ["(a)", "(b)", "(c)", "(d)"]) if (!String(x.question).includes(L)) fail(`${tag}: stem missing ${L}`);
      // and its answer must equal the student explanation of the same item
      const twin = mine[i];
      if (twin && x.answer !== twin.explanation) fail(`${tag}: answer differs from mcq explanation of the same question`);
    });
    console.log(`  ${lang} bank orders -> ${orders[0]}..${orders[orders.length - 1]} (${orders.length} docs)`);
  }

  // difficulty spread across the batch
  const spread: Record<string, number> = {};
  mcqs.forEach((m) => { spread[m.difficulty] = (spread[m.difficulty] ?? 0) + 1; });
  console.log(`\n  difficulty spread (both languages): ${JSON.stringify(spread)}`);

  console.log("\n" + "=".repeat(70));
  if (!problems.length) { console.log("\nLIVE VERIFICATION CLEAN."); return; }
  console.log(`\n${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.log(`  ! ${p}`));
  process.exitCode = 1;
}
main().catch((e) => { console.error(e); process.exit(1); });
