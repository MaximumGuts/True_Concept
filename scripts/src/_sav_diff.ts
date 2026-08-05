import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MCQ_A } from "./_sav_mcq_a";
import { MCQ_B } from "./_sav_mcq_b";
import { MCQ_AR } from "./_sav_ar";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const ALL = [...MCQ_A, ...MCQ_B, ...MCQ_AR];
function firstDiff(a: string, b: string) {
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a === b) return null;
  return { at: i, mine: a.slice(Math.max(0,i-25), i+25), live: b.slice(Math.max(0,i-25), i+25) };
}
(async () => {
  const kinds: Record<string, number> = {};
  const samples: string[] = [];
  for (const lang of ["en","as"] as const) {
    for (const m of ALL) {
      const d = await db.collection("mcqs").doc(`sav-ix-mcq-${lang}-${m.id}`).get();
      const x = d.data() as any;
      for (const [field, mine] of [["question", m[lang].question], ["explanation", m[lang].explanation]] as [string,string][]) {
        const df = firstDiff(mine, x[field]);
        if (df) {
          const key = `${field}`;
          kinds[key] = (kinds[key] ?? 0) + 1;
          if (samples.length < 8) samples.push(`${lang}/${m.id}/${field}\n    MINE: ...${df.mine}...\n    LIVE: ...${df.live}...`);
        }
      }
      const optDiff = JSON.stringify(m[lang].options) !== JSON.stringify(x.options);
      if (optDiff) { kinds["options"] = (kinds["options"] ?? 0) + 1; if (samples.length < 12) samples.push(`${lang}/${m.id}/options\n    MINE: ${JSON.stringify(m[lang].options)}\n    LIVE: ${JSON.stringify(x.options)}`); }
      if (x.correctIndex !== m.correctIndex) { kinds["correctIndex"] = (kinds["correctIndex"] ?? 0) + 1; samples.push(`!!! ${lang}/${m.id} correctIndex mine ${m.correctIndex} live ${x.correctIndex}`); }
      if (x.difficulty !== m.difficulty) kinds["difficulty"] = (kinds["difficulty"] ?? 0) + 1;
    }
  }
  console.log("fields differing from what I seeded:", JSON.stringify(kinds));
  samples.forEach(s => console.log("\n" + s));
})();
