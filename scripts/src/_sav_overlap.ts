import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
(async () => {
  const s = await db.collection("paperQuestions").where("chapterId","==","math-ix-c11").where("language","==","English").get();
  const old = s.docs.filter(d => !d.id.startsWith("sav-ix-")).map(d => d.data() as any);
  for (const o of [26, 33, 45]) {
    const h = old.find(x => x.order === o);
    if (h) console.log(`\norder ${o} [${h.questionType}]\n${String(h.question).replace(/\s+/g, " ")}\n`);
  }
})();
