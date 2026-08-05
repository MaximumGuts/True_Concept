/**
 * Live audit of the Class IX "Surface Areas and Volumes" (math-ix-c11)
 * question-bank batch. Adapted from audit-quad-ix-batch.ts.
 *
 * Reads what is actually in Firestore (not the seed files) and checks:
 *   1. mcq set sizes (15 per set, only the last may be short) and slot uniqueness
 *   2. paperQuestions order uniqueness per language, and the owned range
 *   3. English / Assamese parity in every collection
 *   4. bank coverage: every mcq, case sub-question and subjective question mirrored
 *   5. Assamese hygiene: no Bengali র, no ০-৯ digits, no bare Assamese in $…$
 *   6. whitelist compliance for difficulty / questionType / marks / boards
 *   7. every figureUrl returns HTTP 200
 *   8. colour styling present on every explanation and answer
 *
 * RUN:
 *   export TRUE_CONCEPT_SERVICE_KEY=$(cat "$TEMP/tc_key_b64.txt")
 *   npx tsx src/audit-sav-ix-batch.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const CHAPTER = "math-ix-c11";
const BATCH_SOURCES = [
  "Surface Areas and Volumes MCQ Practice (adapted)",
  "Surface Areas and Volumes Assertion-Reason Practice (adapted)",
  "Surface Areas and Volumes Case Based MCQ Practice (adapted)",
  "Surface Areas and Volumes Subjective Practice (adapted)",
];
const OWNED_ORDER_MIN = 100;
const OWNED_ORDER_MAX = 399;

const DIFFICULTIES = new Set(["easy", "moderate", "hard"]);
const QTYPES = new Set(["mcq", "1-mark", "2-mark", "3-mark", "4-mark", "5-mark", "case_based"]);
const BENGALI_RA = /র/;
const BENGALI_DIGITS = /[০-৯]/;
const BENGALI_BLOCK = /[ঀ-৿]/;

if (getApps().length === 0) {
  const cred = JSON.parse(
    Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"),
  );
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const errors: string[] = [];
const warns: string[] = [];
const bad = (m: string) => errors.push(m);
const warn = (m: string) => warns.push(m);

/** Bare Assamese inside $…$ / $$…$$ outside \text{} throws in KaTeX strict mode. */
function mathHygiene(where: string, s: string) {
  const spans: string[] = [];
  for (const m of s.matchAll(/\$\$([\s\S]+?)\$\$/g)) spans.push(m[1]);
  const noDisplay = s.replace(/\$\$[\s\S]+?\$\$/g, "");
  for (const m of noDisplay.matchAll(/\$([^$\n]+?)\$/g)) spans.push(m[1]);
  for (const span of spans) {
    const stripped = span.replace(/\\text\{[^{}]*\}/g, "").replace(/\\mathrm\{[^{}]*\}/g, "");
    if (BENGALI_BLOCK.test(stripped)) bad(`${where}: bare Assamese inside math -> ${span.slice(0, 70)}`);
  }
}

function assameseHygiene(where: string, s: string) {
  if (BENGALI_RA.test(s)) bad(`${where}: Bengali র (U+09B0)`);
  if (BENGALI_DIGITS.test(s)) bad(`${where}: Bengali/Assamese digit ০-৯`);
  mathHygiene(where, s);
}

function styling(where: string, s: string) {
  if (!s.includes("#da6b45")) bad(`${where}: no coral heading`);
  if (!s.includes("#16a34a")) bad(`${where}: no green final answer`);
}

async function main() {
  const figures = new Set<string>();

  // ------------------------------------------------------------ mcqs -----
  const mcqSnap = await db.collection("mcqs").where("chapterId", "==", CHAPTER).get();
  const mcqs = mcqSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((m) => BATCH_SOURCES.includes(m.sourcePaper));
  const byLangSets: Record<string, Record<number, any[]>> = {};
  for (const m of mcqs) {
    (byLangSets[m.language] ??= {})[m.setNumber] ??= [];
    byLangSets[m.language][m.setNumber].push(m);
    if (m.options?.length !== 4) bad(`mcqs/${m.id}: ${m.options?.length} options`);
    if (typeof m.correctIndex !== "number" || m.correctIndex < 0 || m.correctIndex > 3)
      bad(`mcqs/${m.id}: correctIndex ${m.correctIndex}`);
    if (!DIFFICULTIES.has(m.difficulty)) bad(`mcqs/${m.id}: difficulty ${m.difficulty}`);
    styling(`mcqs/${m.id}`, m.explanation ?? "");
    if (m.language === "Assamese")
      assameseHygiene(`mcqs/${m.id}`, `${m.question} ${(m.options ?? []).join(" ")} ${m.explanation}`);
    if (m.figureUrl) figures.add(m.figureUrl);
  }
  console.log(`mcqs (this batch): ${mcqs.length}`);
  for (const [lang, sets] of Object.entries(byLangSets)) {
    const nums = Object.keys(sets).map(Number).sort((a, b) => a - b);
    const sizes = nums.map((n) => sets[n].length);
    console.log(`  ${lang}: sets ${nums.join(",")} sizes ${sizes.join(",")}`);
    nums.forEach((n, i) => {
      const isLast = i === nums.length - 1;
      if (!isLast && sets[n].length !== 15) bad(`mcqs/${lang}/set${n}: ${sets[n].length} items (must be 15)`);
      if (sets[n].length > 15) bad(`mcqs/${lang}/set${n}: ${sets[n].length} items (over 15)`);
      const orders = sets[n].map((m: any) => m.order).sort((a: number, b: number) => a - b);
      const uniq = new Set(orders);
      if (uniq.size !== orders.length) bad(`mcqs/${lang}/set${n}: duplicate order slots`);
      orders.forEach((o: number, k: number) => {
        if (o !== k) bad(`mcqs/${lang}/set${n}: order ${o} at position ${k} (must be contiguous from 0)`);
      });
    });
  }
  const enM = mcqs.filter((m) => m.language === "English").length;
  const asM = mcqs.filter((m) => m.language === "Assamese").length;
  if (enM !== asM) bad(`mcqs parity: ${enM} EN vs ${asM} AS`);

  // -------------------------------------------------------- caseMcqs -----
  const caseSnap = await db.collection("caseMcqs").where("chapterId", "==", CHAPTER).get();
  const cases = caseSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((c) => BATCH_SOURCES.includes(c.sourcePaper));
  let subCount = 0;
  for (const c of cases) {
    subCount += c.subQuestions?.length ?? 0;
    if (!DIFFICULTIES.has(c.difficulty)) bad(`caseMcqs/${c.id}: difficulty ${c.difficulty}`);
    (c.subQuestions ?? []).forEach((s: any, i: number) => {
      if (s.options?.length !== 4) bad(`caseMcqs/${c.id}/sub${i}: ${s.options?.length} options`);
      if (s.correctIndex < 0 || s.correctIndex > 3) bad(`caseMcqs/${c.id}/sub${i}: correctIndex ${s.correctIndex}`);
      styling(`caseMcqs/${c.id}/sub${i}`, s.explanation ?? "");
      if (c.language === "Assamese")
        assameseHygiene(`caseMcqs/${c.id}/sub${i}`, `${s.question} ${(s.options ?? []).join(" ")} ${s.explanation}`);
      if (s.figureUrl) figures.add(s.figureUrl);
    });
    if (c.language === "Assamese") assameseHygiene(`caseMcqs/${c.id}/passage`, c.passage ?? "");
    for (const m of (c.passage ?? "").matchAll(/src="([^"]+)"/g)) figures.add(m[1]);
  }
  const enC = cases.filter((c) => c.language === "English").length;
  const asC = cases.filter((c) => c.language === "Assamese").length;
  console.log(`caseMcqs: ${cases.length} (EN ${enC} / AS ${asC}), sub-questions total ${subCount}`);
  if (enC !== asC) bad(`caseMcqs parity: ${enC} EN vs ${asC} AS`);

  // -------------------------------------------------------------- qa -----
  const qaSnap = await db.collection("qa").where("chapterId", "==", CHAPTER).get();
  const qa = qaSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((q) => BATCH_SOURCES.includes(q.sourcePaper));
  for (const q of qa) {
    styling(`qa/${q.id}`, q.answer ?? "");
    if (q.title !== q.question) bad(`qa/${q.id}: title != question`);
    if (q.language === "Assamese") assameseHygiene(`qa/${q.id}`, `${q.title} ${q.answer}`);
    for (const m of (q.answer ?? "").matchAll(/src="([^"]+)"/g)) figures.add(m[1]);
  }
  const enQ = qa.filter((q) => q.language === "English").length;
  const asQ = qa.filter((q) => q.language === "Assamese").length;
  console.log(`qa: ${qa.length} (EN ${enQ} / AS ${asQ})`);
  if (enQ !== asQ) bad(`qa parity: ${enQ} EN vs ${asQ} AS`);
  // qa orders must not collide with the pre-existing NCERT qa docs
  const allQa = qaSnap.docs.map((d) => d.data() as any);
  for (const lang of ["English", "Assamese"]) {
    const orders = allQa.filter((q) => q.language === lang).map((q) => q.order);
    if (new Set(orders).size !== orders.length) bad(`qa/${lang}: duplicate order across the whole chapter`);
  }

  // -------------------------------------------------- paperQuestions -----
  const pqSnap = await db.collection("paperQuestions").where("chapterId", "==", CHAPTER).get();
  const allPq = pqSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  const pq = allPq.filter((p) => BATCH_SOURCES.includes(p.sourcePaper));
  const typeCount: Record<string, number> = {};
  for (const p of pq) {
    typeCount[`${p.language}/${p.questionType}`] = (typeCount[`${p.language}/${p.questionType}`] ?? 0) + 1;
    if (!QTYPES.has(p.questionType)) bad(`pq/${p.id}: questionType ${p.questionType}`);
    if (!DIFFICULTIES.has(p.difficulty)) bad(`pq/${p.id}: difficulty ${p.difficulty}`);
    if (p.boards !== "Both") bad(`pq/${p.id}: boards ${p.boards}`);
    if (p.questionType === "mcq" && p.marks !== 1) bad(`pq/${p.id}: mcq with marks ${p.marks}`);
    if (p.questionType === "case_based" && p.marks !== 1) bad(`pq/${p.id}: case_based with marks ${p.marks}`);
    if (/^\d-mark$/.test(p.questionType) && p.marks !== Number(p.questionType[0]))
      bad(`pq/${p.id}: ${p.questionType} with marks ${p.marks}`);
    if (p.order < OWNED_ORDER_MIN || p.order > OWNED_ORDER_MAX)
      bad(`pq/${p.id}: order ${p.order} outside owned range ${OWNED_ORDER_MIN}-${OWNED_ORDER_MAX}`);
    styling(`pq/${p.id}`, p.answer ?? "");
    if (p.language === "Assamese") assameseHygiene(`pq/${p.id}`, `${p.question} ${p.answer}`);
    if (p.figureUrl) figures.add(p.figureUrl);
    for (const m of (p.question ?? "").matchAll(/src="([^"]+)"/g)) figures.add(m[1]);
    for (const m of (p.answer ?? "").matchAll(/src="([^"]+)"/g)) figures.add(m[1]);
  }
  console.log(`paperQuestions (this batch): ${pq.length}`);
  console.log("  by type:", JSON.stringify(typeCount));
  const enP = pq.filter((p) => p.language === "English").length;
  const asP = pq.filter((p) => p.language === "Assamese").length;
  if (enP !== asP) bad(`paperQuestions parity: ${enP} EN vs ${asP} AS`);
  // order uniqueness across the WHOLE chapter, per language
  for (const lang of ["English", "Assamese"]) {
    const orders = allPq.filter((p) => p.language === lang).map((p) => p.order);
    const dup = orders.filter((o, i) => orders.indexOf(o) !== i);
    if (dup.length) bad(`paperQuestions/${lang}: duplicate orders ${[...new Set(dup)].join(",")}`);
  }

  // -------------------------------------------------- bank coverage ------
  // every mcq, every case sub-question and every subjective question must be
  // mirrored in the bank, per language
  const expectedPerLang = enM + subCount / 2 + 40;
  if (enP !== expectedPerLang)
    bad(`bank coverage: ${enP} EN paperQuestions but expected ${expectedPerLang} (${enM} mcq + ${subCount / 2} case subs + 40 subjective)`);
  else console.log(`✓ bank coverage: ${enP} per language = ${enM} mcq + ${subCount / 2} case subs + 40 subjective`);

  // ------------------------------------------------------- figures -------
  console.log(`\nfigures referenced: ${figures.size}`);
  for (const url of [...figures].sort()) {
    const r = await fetch(url, { method: "HEAD" });
    console.log(`  ${r.ok ? "200 OK" : "FAIL " + r.status}  ${url.split("/").pop()}`);
    if (!r.ok) bad(`figure not reachable (${r.status}): ${url}`);
  }

  // --------------------------------------------------------- verdict -----
  console.log("");
  if (warns.length) { console.log(`⚠ ${warns.length} warning(s):`); warns.forEach((w) => console.log("   " + w)); }
  if (errors.length) {
    console.log(`✗ ${errors.length} problem(s):`);
    errors.slice(0, 60).forEach((e) => console.log("   " + e));
    process.exit(1);
  }
  console.log("✓ audit clean");
}

main().catch((e) => { console.error(e); process.exit(1); });
