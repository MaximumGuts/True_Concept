import { MCQ_A } from "./_sav_mcq_a";
import { MCQ_B } from "./_sav_mcq_b";
import { MCQ_AR } from "./_sav_ar";
import { CASES } from "./_sav_case";

const L = ["a", "b", "c", "d"];
const strip = (s: string) =>
  s.replace(/\\text\{[^}]*\}/g, "").replace(/[$\\]/g, "").replace(/\s+/g, " ").trim();

console.log("=== PDF1 MCQs — source key: a c d a d b b a b b a a d d b d a a c b c a ===");
MCQ_A.forEach((m, i) =>
  console.log(`${String(i + 1).padStart(2)} -> (${L[m.correctIndex]})  ${strip(m.en.options[m.correctIndex]).slice(0, 44)}`),
);

console.log("\n=== PDF2 MCQs — source key: d c b a d a b a b d c b a d d d c b d a a c c d c a c c b b a b d c b ===");
MCQ_B.forEach((m, i) =>
  console.log(`${String(i + 1).padStart(2)} -> (${L[m.correctIndex]})  ${strip(m.en.options[m.correctIndex]).slice(0, 44)}`),
);

console.log("\n=== AR 51-55 — source key: a c d c b ===");
MCQ_AR.forEach((m, i) => console.log(`${51 + i} -> (${L[m.correctIndex]})`));

console.log("\n=== Cases 36-50 — source key: a c d d a | b c a d a | b d c a b ===");
CASES.forEach((c) => console.log(c.id, c.correctIndexes.map((x) => L[x]).join(" ")));
