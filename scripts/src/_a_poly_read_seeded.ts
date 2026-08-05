/** Agent A — print seeded docs in full for manual human reading. */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const PICK = (process.env.PICK ?? "03,09,12,16,20").split(",");

async function main() {
  for (const n of PICK) {
    for (const tag of ["en", "as"]) {
      const d = (await db.collection("mcqs").doc(`polyss-mcq-${tag}-${n}`).get()).data();
      if (!d) { console.log(`MISSING polyss-mcq-${tag}-${n}`); continue; }
      console.log("\n" + "=".repeat(78));
      console.log(`polyss-mcq-${tag}-${n}  [${d.language}]  set ${d.setNumber} order ${d.order}  difficulty=${d.difficulty}`);
      console.log("-".repeat(78));
      console.log("Q: " + d.question);
      (d.options as string[]).forEach((o, i) =>
        console.log(`  (${"abcd"[i]}) ${o}${i === d.correctIndex ? "     <== correctIndex" : ""}`));
      console.log("\nEXPLANATION:\n" + d.explanation);
    }
  }
  // one full bank doc
  const b = (await db.collection("paperQuestions").doc("polyss-pq-as-16").get()).data();
  console.log("\n\n" + "#".repeat(78));
  console.log("paperQuestions/polyss-pq-as-16 (full doc)");
  console.log("#".repeat(78));
  console.log(JSON.stringify(b, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
