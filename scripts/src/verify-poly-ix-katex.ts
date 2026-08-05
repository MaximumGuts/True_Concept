/**
 * Render every math segment of the seeded Polynomials SelfStudys docs through the
 * real KaTeX build the app uses, in strict mode.
 *
 * A lost backslash or an unclosed \frac{ typechecks, seeds cleanly and only shows
 * up as garbled output on the student's screen, so the only trustworthy check is to
 * actually run the typesetter over the live strings.
 *
 * Read-only.  RUN:  npx tsx src/verify-poly-ix-katex.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

/* katex lives in the app workspace, not in scripts/, so it is loaded by path —
   deliberately the very same build the student bundle renders with. */
const katex = (await import(
  pathToFileURL(resolve(process.cwd(), "../artifacts/true-concept/node_modules/katex/dist/katex.js")).href
)).default as { renderToString: (t: string, o: Record<string, unknown>) => string };

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const CID = "math-ix-c02";
const SOURCE = "Polynomials MCQ Practice — SelfStudys Set (adapted)";

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

async function main() {
  const docs: Array<{ col: string; id: string; d: any }> = [];
  for (const col of ["mcqs", "paperQuestions"]) {
    const snap = await db.collection(col).where("chapterId", "==", CID).get();
    snap.docs.forEach((x) => {
      if (x.data().sourcePaper === SOURCE) docs.push({ col, id: x.id, d: x.data() });
    });
  }
  console.log(`rendering math from ${docs.length} seeded docs\n`);

  let segments = 0;
  const failures: string[] = [];

  for (const { col, id, d } of docs) {
    for (const s of strings(d)) {
      // strip the styling spans; they are HTML around the math, not math
      const text = s;
      const noDisplay = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, b: string) => {
        try { katex.renderToString(b, { displayMode: true, strict: "error", throwOnError: true }); }
        catch (e) { failures.push(`${col}/${id}: display $$${b.slice(0, 60)}$$ -> ${(e as Error).message}`); }
        segments++;
        return " ";
      });
      for (const m of noDisplay.matchAll(/\$([^$]+)\$/g)) {
        segments++;
        try {
          katex.renderToString(m[1], { displayMode: false, strict: "error", throwOnError: true });
        } catch (e) {
          failures.push(`${col}/${id}: inline $${m[1].slice(0, 60)}$ -> ${(e as Error).message}`);
        }
      }
    }
  }

  console.log(`  ${segments} math segments rendered`);
  console.log("\n" + "=".repeat(70));
  if (!failures.length) { console.log("\nKATEX CLEAN — every math segment typesets in strict mode."); return; }
  console.log(`\n${failures.length} KATEX FAILURE(S):`);
  failures.forEach((f) => console.log(`  ! ${f}`));
  process.exitCode = 1;
}
main().catch((e) => { console.error(e); process.exit(1); });
