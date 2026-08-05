import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const LOW = /\([a-d]\)/g, UP = /\([A-D]\)/g;
(async () => {
  for (const col of ["mcqs","caseMcqs","qa","paperQuestions"]) {
    const s = await db.collection(col).where("chapterId","==","math-ix-c11").get();
    let low = 0, up = 0, mine = 0, times = new Set<string>();
    for (const d of s.docs) {
      if (!d.id.startsWith("sav-ix-")) continue;
      mine++;
      const t = JSON.stringify(d.data());
      low += (t.match(LOW) ?? []).length;
      up += (t.match(UP) ?? []).length;
      times.add(d.updateTime!.toDate().toISOString());
    }
    console.log(`${col}: mine=${mine}  "(a-d)"=${low}  "(A-D)"=${up}  updateTimes=${[...times].sort().join(" | ").slice(0,140)}`);
  }
})();
