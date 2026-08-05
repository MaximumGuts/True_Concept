import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const RA = String.fromCharCode(0x09b0);
const DIG = /[\u09E6-\u09EF]/;
const WRONG = ["\u09AA\u09CD\u09F0\u09A4\u09BF\u099C\u09CD\u099E\u09BE","\u0989\u09B2\u09CB\u099F\u09BE","\u0989\u09B2\u099F\u09BE","\u09AE\u09BE\u099D","\u0986\u09AD\u09BE\u09B8\u09C0","\u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09F0"];
(async () => {
  let ra=0, dig=0, wrong=0, n=0;
  const hits: string[] = [];
  for (const col of ["mcqs","caseMcqs","qa","paperQuestions"]) {
    const s = await db.collection(col).where("chapterId","==","math-ix-c11").get();
    for (const d of s.docs) {
      const x = d.data() as any;
      if (x.language !== "Assamese") continue;
      n++;
      const t = JSON.stringify(x);
      if (t.includes(RA)) { ra++; hits.push(`RA ${col}/${d.id}`); }
      if (DIG.test(t)) { dig++; hits.push(`DIGIT ${col}/${d.id}`); }
      for (const w of WRONG) if (t.includes(w)) { wrong++; hits.push(`TERM(${w}) ${col}/${d.id}`); }
    }
  }
  console.log(`math-ix-c11 Assamese docs scanned: ${n}`);
  console.log(`  stray Bengali RA: ${ra}   stray digits: ${dig}   wrong terms: ${wrong}`);
  hits.slice(0,20).forEach(h=>console.log("   " + h));
  // final counts
  for (const col of ["mcqs","caseMcqs","qa","paperQuestions","notes"]) {
    const s = await db.collection(col).where("chapterId","==","math-ix-c11").get();
    const en = s.docs.filter(d=>(d.data() as any).language==="English").length;
    const as = s.docs.filter(d=>(d.data() as any).language==="Assamese").length;
    console.log(`${col}: total ${s.size}  EN ${en}  AS ${as}  ${en===as?"PARITY OK":"PARITY FAIL"}`);
  }
})();
