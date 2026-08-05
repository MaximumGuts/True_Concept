import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
const DIG = /[\u09E6-\u09EF]/g;
const MAP: Record<string,string> = {};
"\u09E6\u09E7\u09E8\u09E9\u09EA\u09EB\u09EC\u09ED\u09EE\u09EF".split("").forEach((c,i)=>{MAP[c]=String(i);});
const APPLY = process.env.APPLY === "1";
(async () => {
  const ids = ["JlihiH0kUvITdyEtngx8","m2D2vkTH7PxHEn7WuBQP"];
  for (const id of ids) {
    const ref = db.collection("qa").doc(id);
    const d = await ref.get();
    const x = d.data() as any;
    if (x.chapterId !== "math-ix-c11") { console.log("SKIP (wrong chapter)", id, x.chapterId); continue; }
    const patch: Record<string,string> = {};
    for (const f of ["title","question","answer"]) {
      const v = x[f];
      if (typeof v === "string" && DIG.test(v)) patch[f] = v.replace(DIG, (c)=>MAP[c]);
    }
    console.log(id, "lang", x.language, "| before:", JSON.stringify(x.title), "-> after:", JSON.stringify(patch.title ?? x.title), "| fields:", Object.keys(patch).join(","));
    if (APPLY && Object.keys(patch).length) { await ref.update(patch); console.log("  patched"); }
  }
})();
