/**
 * math-ix-c02 — replace the Bengali digits ১/২ in two Assamese `qa` titles.
 *
 * Pre-existing defect, not introduced by the SelfStudys batch: the two solved-example
 * pages are titled "বহুপদ — সমাধান কৰা উদাহৰণ (ভাগ ১)" and "(ভাগ ২)". The standing
 * rule is that numerals in Assamese-medium content stay ASCII (the SEBA textbook's own
 * convention), so ১ -> 1 and ২ -> 2. The `question` field mirrors `title` on these docs
 * and carries the same digit, so both fields are rewritten.
 *
 * Only these two documents and only these two fields are touched; the answer bodies are
 * left exactly as they are. The full prior state of both docs is written to
 * scripts/math-ix-c02-backup.json before anything is changed.
 *
 * RUN:
 *   export TRUE_CONCEPT_SERVICE_KEY=$(< "$TEMP/tc_key_b64.txt")
 *   npx tsx src/fix-poly-ix-bengali-digit-titles.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const IDS = ["ZXlHAYnqPUeiGVwMQtqY", "pkgsBkJYruN1yvO1EExC"];
const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const toAscii = (s: string) => s.replace(/[০-৯]/g, (d) => String(BENGALI_DIGITS.indexOf(d)));

async function main() {
  const backup: Record<string, unknown> = {};
  const updates: Array<{ id: string; patch: Record<string, string> }> = [];

  for (const id of IDS) {
    const snap = await db.collection("qa").doc(id).get();
    if (!snap.exists) throw new Error(`qa/${id} does not exist — aborting`);
    const d = snap.data()!;
    backup[`qa/${id}`] = d;

    const patch: Record<string, string> = {};
    for (const field of ["title", "question"]) {
      const val = d[field];
      if (typeof val === "string" && /[০-৯]/.test(val)) patch[field] = toAscii(val);
    }
    if (Object.keys(patch).length) updates.push({ id, patch });
    console.log(`qa/${id}`);
    for (const [f, v] of Object.entries(patch)) console.log(`   ${f}: ${d[f]}  ->  ${v}`);
  }

  const path = resolve(process.cwd(), "math-ix-c02-backup.json");
  writeFileSync(path, JSON.stringify(backup, null, 2), "utf8");
  console.log(`\nbackup written to ${path}`);

  const batch = db.batch();
  updates.forEach((u) => batch.update(db.collection("qa").doc(u.id), u.patch));
  await batch.commit();
  console.log(`updated ${updates.length} doc(s)`);

  // read back and confirm no Bengali digit survives in the touched fields
  for (const id of IDS) {
    const d = (await db.collection("qa").doc(id).get()).data()!;
    for (const field of ["title", "question"]) {
      if (/[০-৯]/.test(String(d[field]))) throw new Error(`qa/${id}.${field} still has Bengali digits`);
    }
    console.log(`verified qa/${id}: ${d.title}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
