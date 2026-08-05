/**
 * Seeds the Class IX "Surface Areas and Volumes" (math-ix-c11) question-bank
 * batch built from Books/363aWhhC9QJozZLaEhZD.pdf and
 * Books/TpA6OWPT3v9ql0s11FBO.pdf.
 *
 * Writes, in English AND Assamese:
 *   mcqs            62 per language (22 + 35 plain MCQs + 5 assertion-reason)
 *   caseMcqs         3 per language (5 sub-questions each)
 *   qa               5 per language (the 40 subjective questions, grouped)
 *   paperQuestions 117 per language (every one of the above, mirrored)
 *
 * IDEMPOTENT: every document has a deterministic id of the form
 *   sav-ix-<collection>-<en|as>-<item-id>
 * so a re-run overwrites in place instead of duplicating.
 *
 * Bank `order` range used: 100-216 per language (the slice this batch owns is
 * 100-399; existing NCERT content occupies 0-57 and is not touched).
 *
 * RUN:
 *   export TRUE_CONCEPT_SERVICE_KEY=$(cat "$TEMP/tc_key_b64.txt")
 *   npx tsx src/seed-sav-ix-batch.ts            # validate + dry run
 *   APPLY=1 npx tsx src/seed-sav-ix-batch.ts    # write
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { McqItem, SubjItem, Lang, optionsBlock, amber, figUrl } from "./_sav_bank";
import { MCQ_A } from "./_sav_mcq_a";
import { MCQ_B } from "./_sav_mcq_b";
import { MCQ_AR } from "./_sav_ar";
import { CASES } from "./_sav_case";
import { SUBJ_A } from "./_sav_subj_a";
import { SUBJ_B } from "./_sav_subj_b";

const CHAPTER = "math-ix-c11";
const APPLY = process.env.APPLY === "1";

const SRC_MCQ = "Surface Areas and Volumes MCQ Practice (adapted)";
const SRC_AR = "Surface Areas and Volumes Assertion-Reason Practice (adapted)";
const SRC_CASE = "Surface Areas and Volumes Case Based MCQ Practice (adapted)";
const SRC_SUBJ = "Surface Areas and Volumes Subjective Practice (adapted)";

const SET_START = 1; // the chapter has no mcqs yet, so both languages start at set 1
const MCQ_PER_SET = 15;
const BANK_START = 100;

const ALL_MCQS: McqItem[] = [...MCQ_A, ...MCQ_B, ...MCQ_AR];
const ALL_SUBJ: SubjItem[] = [...SUBJ_A, ...SUBJ_B];
const AR_IDS = new Set(MCQ_AR.map((m) => m.id));

const QA_TITLES: Record<number, { en: string; as: string }> = {
  0: {
    en: "Surface Areas and Volumes — Very Short Answer Questions",
    as: "পৃষ্ঠকালি আৰু আয়তন — অতি চমু উত্তৰৰ প্ৰশ্ন",
  },
  1: {
    en: "Surface Areas and Volumes — Short Answer Questions (Part 1)",
    as: "পৃষ্ঠকালি আৰু আয়তন — চমু উত্তৰৰ প্ৰশ্ন (ভাগ 1)",
  },
  2: {
    en: "Surface Areas and Volumes — Short Answer Questions (Part 2)",
    as: "পৃষ্ঠকালি আৰু আয়তন — চমু উত্তৰৰ প্ৰশ্ন (ভাগ 2)",
  },
  3: {
    en: "Surface Areas and Volumes — Short Answer Questions (Part 3)",
    as: "পৃষ্ঠকালি আৰু আয়তন — চমু উত্তৰৰ প্ৰশ্ন (ভাগ 3)",
  },
  4: {
    en: "Surface Areas and Volumes — Long Answer Questions",
    as: "পৃষ্ঠকালি আৰু আয়তন — দীঘল উত্তৰৰ প্ৰশ্ন",
  },
};
const QA_ORDER_BASE = 6; // existing qa docs occupy orders 0-5 in both languages

const DIFF_AS: Record<string, string> = { easy: "সহজ", moderate: "মধ্যম", hard: "কঠিন" };
const MARKS_WORD = { en: (m: number) => (m === 1 ? "1 mark" : `${m} marks`), as: (m: number) => `${m} নম্বৰ` };

// ---------------------------------------------------------------- checks ---

const BENGALI_RA = /র/;
const BENGALI_DIGITS = /[০-৯]/;
const DIFFICULTIES = new Set(["easy", "moderate", "hard"]);
const QTYPES = new Set(["mcq", "1-mark", "2-mark", "3-mark", "4-mark", "5-mark", "case_based"]);

const problems: string[] = [];
const fail = (m: string) => problems.push(m);

function checkAssamese(where: string, s: string) {
  if (BENGALI_RA.test(s)) fail(`${where}: contains Bengali র (U+09B0)`);
  if (BENGALI_DIGITS.test(s)) fail(`${where}: contains Bengali/Assamese digit ০-৯`);
}

function checkStyling(where: string, s: string) {
  if (!s.includes("#da6b45")) fail(`${where}: missing coral solution heading`);
  if (!s.includes("#16a34a")) fail(`${where}: missing green final answer`);
}

function validate() {
  const ids = new Set<string>();
  for (const m of ALL_MCQS) {
    if (ids.has(m.id)) fail(`duplicate item id ${m.id}`);
    ids.add(m.id);
    if (!DIFFICULTIES.has(m.difficulty)) fail(`${m.id}: bad difficulty ${m.difficulty}`);
    for (const lang of ["en", "as"] as const) {
      const side = m[lang];
      if (side.options.length !== 4) fail(`${m.id}/${lang}: ${side.options.length} options`);
      if (m.correctIndex < 0 || m.correctIndex > 3) fail(`${m.id}: correctIndex ${m.correctIndex}`);
      checkStyling(`${m.id}/${lang}`, side.explanation);
      if (lang === "as") {
        checkAssamese(`${m.id}/as/question`, side.question);
        checkAssamese(`${m.id}/as/options`, side.options.join(" "));
        checkAssamese(`${m.id}/as/explanation`, side.explanation);
      }
    }
    // English and Assamese option sets must line up one-for-one
    if (m.en.options.length !== m.as.options.length) fail(`${m.id}: EN/AS option count mismatch`);
  }
  for (const c of CASES) {
    if (ids.has(c.id)) fail(`duplicate item id ${c.id}`);
    ids.add(c.id);
    if (c.correctIndexes.length !== 5) fail(`${c.id}: ${c.correctIndexes.length} correctIndexes`);
    for (const lang of ["en", "as"] as const) {
      const side = c[lang];
      if (side.subs.length !== c.correctIndexes.length)
        fail(`${c.id}/${lang}: ${side.subs.length} subs vs ${c.correctIndexes.length} answers`);
      side.subs.forEach((s, i) => {
        if (s.options.length !== 4) fail(`${c.id}/${lang}/sub${i}: ${s.options.length} options`);
        checkStyling(`${c.id}/${lang}/sub${i}`, s.explanation);
        if (lang === "as") {
          checkAssamese(`${c.id}/as/sub${i}`, s.question + " " + s.options.join(" ") + " " + s.explanation);
        }
      });
      if (lang === "as") checkAssamese(`${c.id}/as/passage`, side.passage);
    }
    c.correctIndexes.forEach((ci, i) => {
      if (ci < 0 || ci > 3) fail(`${c.id}/sub${i}: correctIndex ${ci}`);
    });
  }
  for (const s of ALL_SUBJ) {
    if (ids.has(s.id)) fail(`duplicate item id ${s.id}`);
    ids.add(s.id);
    if (!DIFFICULTIES.has(s.difficulty)) fail(`${s.id}: bad difficulty ${s.difficulty}`);
    if (!QTYPES.has(s.questionType)) fail(`${s.id}: bad questionType ${s.questionType}`);
    const declared = Number(s.questionType.split("-")[0]);
    if (declared !== s.marks) fail(`${s.id}: questionType ${s.questionType} vs marks ${s.marks}`);
    if (!(s.part in QA_TITLES)) fail(`${s.id}: unknown qa part ${s.part}`);
    for (const lang of ["en", "as"] as const) {
      checkStyling(`${s.id}/${lang}`, s[lang].answer);
      if (lang === "as") checkAssamese(`${s.id}/as`, s.as.question + " " + s.as.answer);
    }
  }
  // figures referenced anywhere must be among the uploaded ones
  const uploaded = new Set([
    "sav-case1-cylinder-sphere-v2.png",
    "sav-case2-sheets-v2.png",
    "sav-case3-water-rise-v2.png",
    "sav-la38-sector-120-v2.png",
    "sav-la40-plot-drainlet-v2.png",
    "sav-sa27-triangle-5-12-13-v2.png",
    "sav-sa23-three-cubes-v2.png",
    "sav-la39-three-cylinders-v2.png",
  ]);
  const blob = JSON.stringify([ALL_MCQS, CASES, ALL_SUBJ]);
  for (const m of blob.match(/sav-[a-z0-9-]+\.png/g) ?? []) {
    if (!uploaded.has(m)) fail(`unknown figure referenced: ${m}`);
  }
}

// ------------------------------------------------------------- doc build ---

function qaBody(lang: Lang, part: number): string {
  const items = ALL_SUBJ.filter((s) => s.part === part);
  const qLabel = lang === "en" ? "Question" : "প্ৰশ্ন";
  const qColon = lang === "en" ? "**Question:**" : "**প্ৰশ্ন:**";
  return items
    .map((s, i) => {
      const side = s[lang];
      const tag =
        lang === "en"
          ? `*(${MARKS_WORD.en(s.marks)} — ${s.difficulty})*`
          : `*(${MARKS_WORD.as(s.marks)} — ${DIFF_AS[s.difficulty]})*`;
      return [
        `## ${amber(`${qLabel} ${i + 1}`)}`,
        `${amber(qColon)} ${side.question}`,
        tag,
        side.answer,
      ].join("\n\n");
    })
    .join("\n\n---\n\n");
}

interface Doc { col: string; id: string; data: Record<string, unknown> }

function buildDocs(): Doc[] {
  const docs: Doc[] = [];
  const now = FieldValue.serverTimestamp();

  for (const lang of ["en", "as"] as const) {
    const language = lang === "en" ? "English" : "Assamese";
    let bankOrder = BANK_START;

    // ---- mcqs (+ their paperQuestions mirror)
    ALL_MCQS.forEach((m, i) => {
      const side = m[lang];
      const sourcePaper = AR_IDS.has(m.id) ? SRC_AR : SRC_MCQ;
      const base: Record<string, unknown> = {
        chapterId: CHAPTER,
        language,
        question: side.question,
        options: side.options,
        correctIndex: m.correctIndex,
        explanation: side.explanation,
        difficulty: m.difficulty,
        setNumber: SET_START + Math.floor(i / MCQ_PER_SET),
        order: i % MCQ_PER_SET,
        sourcePaper,
        createdAt: now,
      };
      if (m.figure) base.figureUrl = figUrl(m.figure);
      docs.push({ col: "mcqs", id: `sav-ix-mcq-${lang}-${m.id}`, data: base });

      const pq: Record<string, unknown> = {
        chapterId: CHAPTER,
        language,
        questionType: "mcq",
        difficulty: m.difficulty,
        marks: 1,
        boards: "Both",
        question: `${side.question}\n\n${optionsBlock(side.options)}`,
        answer: side.explanation,
        order: bankOrder++,
        sourcePaper,
        createdAt: now,
      };
      if (m.figure) pq.figureUrl = figUrl(m.figure);
      docs.push({ col: "paperQuestions", id: `sav-ix-pq-${lang}-${m.id}`, data: pq });
    });

    // ---- caseMcqs (+ one paperQuestion per sub-question)
    CASES.forEach((c, ci) => {
      const side = c[lang];
      docs.push({
        col: "caseMcqs",
        id: `sav-ix-case-${lang}-${c.id}`,
        data: {
          chapterId: CHAPTER,
          language,
          passage: side.passage,
          subQuestions: side.subs.map((s, i) => ({
            question: s.question,
            options: s.options,
            correctIndex: c.correctIndexes[i],
            explanation: s.explanation,
          })),
          difficulty: c.difficulty,
          order: ci,
          sourcePaper: SRC_CASE,
          createdAt: now,
        },
      });

      // The passage carries its figure as an embedded <img>; the teacher bank
      // repeats the passage in every sub-question doc, so each mirror gets the
      // same figure via figureUrl as well.
      const roman = ["(i)", "(ii)", "(iii)", "(iv)", "(v)"];
      side.subs.forEach((s, i) => {
        const pq: Record<string, unknown> = {
          chapterId: CHAPTER,
          language,
          questionType: "case_based",
          difficulty: c.difficulty,
          marks: 1,
          boards: "Both",
          question: `${side.passage}\n\n**${roman[i]}** ${s.question}\n\n${optionsBlock(s.options)}`,
          answer: s.explanation,
          order: bankOrder++,
          sourcePaper: SRC_CASE,
          createdAt: now,
        };
        if (c.figure) pq.figureUrl = figUrl(c.figure);
        docs.push({ col: "paperQuestions", id: `sav-ix-pq-${lang}-${c.id}-${i}`, data: pq });
      });
    });

    // ---- subjective: paperQuestions mirror
    ALL_SUBJ.forEach((s) => {
      const side = s[lang];
      const pq: Record<string, unknown> = {
        chapterId: CHAPTER,
        language,
        questionType: s.questionType,
        difficulty: s.difficulty,
        marks: s.marks,
        boards: "Both",
        question: side.question,
        answer: side.answer,
        order: bankOrder++,
        sourcePaper: SRC_SUBJ,
        createdAt: now,
      };
      if (s.figure) pq.figureUrl = figUrl(s.figure);
      docs.push({ col: "paperQuestions", id: `sav-ix-pq-${lang}-${s.id}`, data: pq });
    });

    // ---- qa: the subjective questions grouped into readable parts
    for (const part of Object.keys(QA_TITLES).map(Number)) {
      const title = QA_TITLES[part][lang];
      docs.push({
        col: "qa",
        id: `sav-ix-qa-${lang}-p${part}`,
        data: {
          chapterId: CHAPTER,
          language,
          title,
          question: title,
          answer: qaBody(lang, part),
          order: QA_ORDER_BASE + part,
          sourcePaper: SRC_SUBJ,
          createdAt: now,
        },
      });
    }
  }
  return docs;
}

// ------------------------------------------------------------------ main ---

async function main() {
  validate();
  if (problems.length) {
    console.error(`✗ ${problems.length} validation problem(s):`);
    problems.slice(0, 40).forEach((p) => console.error("   " + p));
    process.exit(1);
  }
  console.log("✓ content validation passed");

  const docs = buildDocs();
  const byCol: Record<string, number> = {};
  for (const d of docs) byCol[d.col] = (byCol[d.col] ?? 0) + 1;
  console.log("documents to write:", JSON.stringify(byCol));

  // order uniqueness inside the batch, per collection per language
  const seen = new Set<string>();
  for (const d of docs) {
    const key = `${d.col}/${d.data.language}/${d.data.order}${d.col === "mcqs" ? "/" + d.data.setNumber : ""}`;
    if (seen.has(key)) throw new Error(`duplicate slot ${key} (doc ${d.id})`);
    seen.add(key);
  }
  console.log("✓ slot uniqueness inside the batch");

  if (!APPLY) {
    console.log("\n🔎 DRY RUN — set APPLY=1 to write.");
    const sample = docs.find((d) => d.col === "mcqs")!;
    console.log("\nsample mcq doc id:", sample.id);
    return;
  }

  if (getApps().length === 0) {
    const cred = JSON.parse(
      Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"),
    );
    initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
  }
  const db = getFirestore();

  let written = 0;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    for (const d of docs.slice(i, i + 400)) {
      batch.set(db.collection(d.col).doc(d.id), d.data);
      written++;
    }
    await batch.commit();
    console.log(`  committed ${Math.min(i + 400, docs.length)}/${docs.length}`);
  }
  console.log(`\n✓ wrote ${written} documents`);
}

main().catch((e) => { console.error(e); process.exit(1); });
