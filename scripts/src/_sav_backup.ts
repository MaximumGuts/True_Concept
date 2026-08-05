import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync } from "fs";
if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();
(async () => {
  const ids = ["JlihiH0kUvITdyEtngx8","m2D2vkTH7PxHEn7WuBQP"];
  const out: any[] = [];
  for (const id of ids) {
    const d = await db.collection("qa").doc(id).get();
    out.push({ collection: "qa", id, data: d.data() });
  }
  writeFileSync("math-ix-c11-backup.json", JSON.stringify(out, null, 2), "utf8");
  console.log("backed up", out.length, "docs to scripts/math-ix-c11-backup.json");
})();
