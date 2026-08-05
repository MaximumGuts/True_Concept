import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const PICKS: [string, string][] = [
  ["mcqs", "sav-ix-mcq-as-b23-block-shortest-edge"],
  ["mcqs", "sav-ix-mcq-as-a09-iron-beam-weight"],
  ["mcqs", "sav-ix-mcq-as-b32-hemisphere-tsa-from-volume"],
  ["mcqs", "sav-ix-mcq-en-b29-cone-identity-zero"],
  ["mcqs", "sav-ix-mcq-as-b11-cube-side-up-50pc"],
  ["paperQuestions", "sav-ix-pq-as-v04-cube-cut-into-two-cuboids"],
  ["paperQuestions", "sav-ix-pq-as-s30-spherical-ball-radius-from-cost"],
  ["paperQuestions", "sav-ix-pq-en-s27-triangle-revolved-tsa-ratio"],
  ["paperQuestions", "sav-ix-pq-as-case2-bird-feeder-0"],
  ["qa", "sav-ix-qa-as-p4"],
];

(async () => {
  for (const [col, id] of PICKS) {
    const d = await db.collection(col).doc(id).get();
    if (!d.exists) { console.log(`\n!!!!! MISSING ${col}/${id}`); continue; }
    const x = d.data() as any;
    console.log("\n" + "=".repeat(78));
    console.log(`${col}/${id}  [lang=${x.language} diff=${x.difficulty} type=${x.questionType ?? "-"} marks=${x.marks ?? "-"} set=${x.setNumber ?? "-"} order=${x.order}]`);
    console.log("-".repeat(78));
    if (col === "caseMcqs") {
      console.log("PASSAGE:\n" + x.passage);
      x.subQuestions.forEach((s: any, i: number) => {
        console.log(`\n--- SUB ${i} (correctIndex ${s.correctIndex}) ---`);
        console.log(s.question);
        s.options.forEach((o: string, k: number) => console.log(`  (${"abcd"[k]}) ${o}${k === s.correctIndex ? "   <== KEY" : ""}`));
        console.log(s.explanation);
      });
    } else if (col === "mcqs") {
      console.log("Q: " + x.question);
      x.options.forEach((o: string, k: number) => console.log(`  (${"abcd"[k]}) ${o}${k === x.correctIndex ? "   <== KEY" : ""}`));
      console.log("\nEXPLANATION:\n" + x.explanation);
      if (x.figureUrl) console.log("figureUrl: " + x.figureUrl);
    } else {
      console.log("Q: " + x.question);
      console.log("\nA:\n" + x.answer);
      if (x.figureUrl) console.log("figureUrl: " + x.figureUrl);
    }
  }
})();
