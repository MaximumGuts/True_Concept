/** Cross-PDF duplicate scan: compares the numeric fingerprint of every item. */
import { MCQ_A } from "./_sav_mcq_a";
import { MCQ_B } from "./_sav_mcq_b";
import { MCQ_AR } from "./_sav_ar";
import { CASES } from "./_sav_case";
import { SUBJ_A } from "./_sav_subj_a";
import { SUBJ_B } from "./_sav_subj_b";

interface Item { id: string; src: string; text: string }
const items: Item[] = [];
MCQ_A.forEach((m) => items.push({ id: m.id, src: "PDF1-mcq", text: m.en.question }));
MCQ_B.forEach((m) => items.push({ id: m.id, src: "PDF2-mcq", text: m.en.question }));
MCQ_AR.forEach((m) => items.push({ id: m.id, src: "PDF2-ar", text: m.en.question }));
CASES.forEach((c) => c.en.subs.forEach((s, i) =>
  items.push({ id: `${c.id}#${i}`, src: "PDF2-case", text: c.en.passage.replace(/<img[^>]*>/g, "") + " " + s.question })));
[...SUBJ_A, ...SUBJ_B].forEach((s) => items.push({ id: s.id, src: "PDF2-subj", text: s.en.question }));

const nums = (t: string) => {
  const set = new Set((t.match(/\d+(?:\.\d+)?/g) ?? []).filter((n) => n !== "2" && n !== "3"));
  return set;
};
const jac = (a: Set<string>, b: Set<string>) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach((x) => { if (b.has(x)) inter++; });
  return inter / (a.size + b.size - inter);
};

const fp = items.map((it) => ({ ...it, n: nums(it.text) }));
const pairs: string[] = [];
for (let i = 0; i < fp.length; i++)
  for (let j = i + 1; j < fp.length; j++) {
    const s = jac(fp[i].n, fp[j].n);
    if (s >= 0.6 && fp[i].src !== fp[j].src)
      pairs.push(`${s.toFixed(2)}  [${fp[i].src}] ${fp[i].id}\n        [${fp[j].src}] ${fp[j].id}`);
  }
console.log(`items compared: ${items.length}`);
console.log(`cross-source pairs with numeric-fingerprint similarity >= 0.60: ${pairs.length}`);
pairs.forEach((p) => console.log("  " + p));
