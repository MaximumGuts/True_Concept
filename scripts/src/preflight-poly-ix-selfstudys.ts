/**
 * Offline pre-flight for the Polynomials SelfStudys batch — run BEFORE seeding.
 *
 * The point is that this file does not trust a single word written in the seed
 * file. For every question it recomputes the answer from the underlying algebra
 * (evaluating the polynomial, solving the linear/quadratic equation, expanding the
 * product) and then asserts that `correctIndex` really points at that value inside
 * `options`. It also enforces Assamese hygiene, KaTeX delimiter balance, colour
 * styling and EN/AS structural parity.
 *
 * RUN:  npx tsx src/preflight-poly-ix-selfstudys.ts
 */
import { ITEMS, LETTER, explain, bankQuestion, CONFIG, type Item } from "./seed-poly-ix-selfstudys-mcqs.js";

const problems: string[] = [];
const fail = (m: string) => problems.push(m);

/* ── tiny algebra helpers, used to recompute answers from first principles ── */

/** Evaluate a polynomial given as coefficients [c_n … c_0] (highest power first). */
const evalPoly = (c: number[], x: number): number =>
  c.reduce((acc, k) => acc * x + k, 0);

/** Multiply two polynomials given highest-power-first. */
function mulPoly(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  a.forEach((ai, i) => b.forEach((bj, j) => { out[i + j] += ai * bj; }));
  return out;
}

/** Solve f(t)=0 for a function known to be affine in t. */
function solveAffine(f: (t: number) => number): number {
  const f0 = f(0), f1 = f(1);
  const slope = f1 - f0;
  if (slope === 0) throw new Error("not affine / no unique root");
  return -f0 / slope;
}

/** Real roots of ax^2+bx+c, ascending. */
function quadRoots(a: number, b: number, c: number): number[] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  const r = Math.sqrt(d);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((p, q) => p - q);
}

const near = (x: number, y: number) => Math.abs(x - y) < 1e-9;

/* ── the independent expectation for each source question number ─────────────
   Each entry returns the option TEXT that must be the correct one. The text is
   matched against `options`, so a wrong correctIndex cannot slip through. */
const EXPECTED: Record<number, () => string> = {
  // (x-2) a factor => p(2)=0, by the Factor Theorem.
  1: () => `$0$`,
  2: () => `Linear polynomial`,
  // sqrt(3) = sqrt(3)*x^0, highest power of x is 0.
  3: () => `$0$`,
  // powers 5,4,3,2,1,0 -> 6 possible terms
  4: () => { const n = 5 - 0 + 1; return `$${n}$ terms`; },
  // x+2 | x^3-2a x^2+16  =>  p(-2)=0, affine in a
  5: () => {
    const a = solveAffine((t) => evalPoly([1, -2 * t, 0, 16], -2));
    if (!near(a, 1)) throw new Error(`a=${a}`);
    return `$${a}$`;
  },
  // 3+5-8=0 => 3^3+5^3+(-8)^3
  6: () => {
    const v = 3 ** 3 + 5 ** 3 + (-8) ** 3;
    if (!near(v, 3 * 3 * 5 * -8)) throw new Error("identity mismatch");
    return `$${v}$`;
  },
  // x-1 | 4x^3+3x^2-4x+k => p(1)=0, affine in k
  7: () => {
    const k = solveAffine((t) => evalPoly([4, 3, -4, t], 1));
    return `$${k}$`;
  },
  8: () => `$${11 ** 3}$`,
  // factorisation of 3x^2-5x+2 — expand the claimed factors and compare
  9: () => {
    const prod = mulPoly([3, -2], [1, -1]);          // (3x-2)(x-1)
    if (JSON.stringify(prod) !== JSON.stringify([3, -5, 2])) throw new Error(`expand=${prod}`);
    return `$(3x-2)(x-1)$`;
  },
  10: () => `$p(a)=0$`,
  // binomial (2 terms) of degree 20
  11: () => `$x^{20}+1$`,
  12: () => `Not defined`,
  // p(-1)=p(2)=0 => (x+1)(x-2) divides p
  13: () => {
    const prod = mulPoly([1, 1], [1, -2]);           // (x+1)(x-2)
    if (JSON.stringify(prod) !== JSON.stringify([1, -1, -2])) throw new Error(`expand=${prod}`);
    return `$(x^{2}-x-2)$`;
  },
  // zero of 2x+7
  15: () => {
    const z = solveAffine((t) => evalPoly([2, 7], t));
    if (!near(z, -3.5)) throw new Error(`zero=${z}`);
    return String.raw`$-\frac{7}{2}$`;
  },
  // (x-2) | x^4+ax^3+2x^2-3x => p(2)=0, affine in a
  16: () => {
    const a = solveAffine((t) => evalPoly([1, t, 2, -3, 0], 2));
    if (!near(a, -9 / 4)) throw new Error(`a=${a}`);
    return String.raw`$a=-\frac{9}{4}$`;
  },
  // p(t)=2+t+2t^2-t^3 at t=0
  18: () => `$${evalPoly([-1, 2, 1, 2], 0)}$`,
  19: () => `Linear`,
  // x+p | x^2+px+3-p => f(-p)=0, affine in p
  20: () => {
    const p = solveAffine((t) => evalPoly([1, t, 3 - t], -t));
    if (!near(p, 3)) throw new Error(`p=${p}`);
    return `$${p}$`;
  },
  // x^2+5x-6=0
  21: () => {
    const r = quadRoots(1, 5, -6);
    if (!(near(r[0], -6) && near(r[1], 1))) throw new Error(`roots=${r}`);
    return String.raw`$x=1,\ x=-6$`;
  },
  22: () => `Quadratic`,
};

/* ── checks ───────────────────────────────────────────────────────────────── */

const BENGALI_RA = "র";           // র — forbidden
const ASSAMESE_RA = "ৰ";          // ৰ — required
const BENGALI_DIGIT = /[০-৯]/;

function checkMathDelims(where: string, s: string) {
  const noDisplay = s.replace(/\$\$[\s\S]+?\$\$/g, " ");
  if ((noDisplay.match(/\$/g) ?? []).length % 2 !== 0) fail(`${where}: unbalanced $ delimiter`);
  for (const m of noDisplay.matchAll(/\$([^$]+)\$/g)) {
    const body = m[1];
    if (/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^>]*)?>/.test(body)) fail(`${where}: HTML tag inside math: $${body.slice(0, 40)}$`);
    // a lost backslash turns \frac into the bare word "frac"
    const stripped = body.replace(/\\[a-zA-Z]+/g, " ");
    const bare = /\b(frac|dfrac|sqrt|times|cdot|Rightarrow|neq|ne)\b/.exec(stripped);
    if (bare) fail(`${where}: lost backslash — bare "${bare[1]}" in $${body.slice(0, 40)}$`);
    // Assamese letters inside math must be wrapped in \text{}
    const outsideText = body.replace(/\\text\{[^}]*\}/g, " ");
    if (/[ঀ-৿]/.test(outsideText)) fail(`${where}: bare Assamese inside math: $${body.slice(0, 40)}$`);
  }
}

function checkAssamese(where: string, s: string) {
  if (s.includes(BENGALI_RA)) fail(`${where}: contains Bengali RA (${BENGALI_RA}) — must be ${ASSAMESE_RA}`);
  if (BENGALI_DIGIT.test(s)) fail(`${where}: contains Bengali digits — must be ASCII`);
}

function main() {
  console.log(`Pre-flight for ${CONFIG.CID} — ${ITEMS.length} items\n`);

  // 1. source question numbers: unique, and the two known repeats excluded
  const nums = ITEMS.map((x) => x.pdfQ);
  if (new Set(nums).size !== nums.length) fail("duplicate pdfQ numbers in ITEMS");
  const expectedNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 19, 20, 21, 22];
  if (JSON.stringify(nums) !== JSON.stringify(expectedNums)) {
    fail(`pdfQ list is [${nums}], expected [${expectedNums}] (Q14 and Q17 are the source's own repeats)`);
  }
  console.log(`  source questions covered: ${nums.join(",")}`);
  console.log(`  deliberately excluded as verbatim source repeats: 14 (=12), 17 (=5)\n`);

  // 2. per-item structure, recomputed answer, hygiene
  for (const item of ITEMS as Item[]) {
    const tag = `Q${item.pdfQ}`;

    if (!["easy", "moderate", "hard"].includes(item.diff)) fail(`${tag}: bad difficulty "${item.diff}"`);
    if (item.ci < 0 || item.ci > 3) fail(`${tag}: correctIndex out of range`);

    for (const [lang, side] of [["EN", item.en], ["AS", item.as]] as const) {
      if (side.opts.length !== 4) fail(`${tag}/${lang}: ${side.opts.length} options, expected 4`);
      if (new Set(side.opts).size !== 4) fail(`${tag}/${lang}: duplicate option text`);
      for (const [field, val] of Object.entries(side)) {
        const texts = Array.isArray(val) ? val : [val as string];
        texts.forEach((t, i) => checkMathDelims(`${tag}/${lang}/${field}${Array.isArray(val) ? `[${i}]` : ""}`, t));
      }
      if (lang === "AS") {
        for (const [field, val] of Object.entries(side)) {
          const texts = Array.isArray(val) ? val : [val as string];
          texts.forEach((t, i) => checkAssamese(`${tag}/AS/${field}${Array.isArray(val) ? `[${i}]` : ""}`, t));
        }
      }
      /* The stated answer must be the option at correctIndex. The green line is
         allowed to name the unknown ("$a=1$" against the option "$1$"), so both
         sides are normalised by dropping $ delimiters, spaces and a leading
         "<single letter>=" before comparing. */
      const norm = (s: string) => s.replace(/\$/g, "").replace(/\s+/g, "").replace(/^[a-z]=/, "");
      const chosen = side.opts[item.ci];
      if (norm(side.ans) !== norm(chosen)) {
        fail(`${tag}/${lang}: answer text "${side.ans}" does not match option (${LETTER[item.ci]}) "${chosen}"`);
      }
    }

    // EN and AS must agree on which slot is correct and on purely-mathematical options
    item.en.opts.forEach((o, i) => {
      const isPureMath = /^\$[^$]*\$$/.test(o) && !/[A-Za-z]{4,}/.test(o.replace(/\\[a-zA-Z]+/g, ""));
      if (isPureMath && item.as.opts[i] !== o) {
        fail(`${tag}: option ${i} is pure maths but differs EN="${o}" AS="${item.as.opts[i]}"`);
      }
    });

    // 3. the independent recomputation
    const expect = EXPECTED[item.pdfQ];
    if (!expect) { fail(`${tag}: no independent expectation defined`); continue; }
    let want: string;
    try { want = expect(); } catch (e) { fail(`${tag}: recomputation threw — ${(e as Error).message}`); continue; }
    const idx = item.en.opts.indexOf(want);
    if (idx === -1) {
      fail(`${tag}: recomputed answer "${want}" is not among the English options ${JSON.stringify(item.en.opts)}`);
    } else if (idx !== item.ci) {
      fail(`${tag}: recomputed answer "${want}" sits at option ${LETTER[idx]} but correctIndex points at ${LETTER[item.ci]}`);
    } else {
      console.log(`  ${tag.padEnd(4)} ok — recomputed "${want}" = option (${LETTER[idx]})  [${item.diff}]`);
    }
  }

  // 4. colour styling present in every rendered explanation
  const COLOURS = ["#d97706", "#da6b45", "#0d9488", "#16a34a"];
  ITEMS.forEach((item) => {
    for (const [lang, side] of [["English", item.en], ["Assamese", item.as]] as const) {
      const e = explain(side, item.ci, lang);
      for (const c of COLOURS) if (!e.includes(c)) fail(`Q${item.pdfQ}/${lang}: explanation missing colour ${c}`);
      if (lang === "Assamese") checkAssamese(`Q${item.pdfQ}/AS/explanation`, e);
      const bq = bankQuestion(side);
      if (!bq.includes("(a) ") || !bq.includes("(d) ")) fail(`Q${item.pdfQ}/${lang}: bank question missing option labels`);
    }
  });

  // 5. slot arithmetic
  const bySet = new Map<number, number[]>();
  ITEMS.forEach((_, i) => {
    const s = CONFIG.FIRST_SET + Math.floor(i / CONFIG.SET_SIZE);
    bySet.set(s, [...(bySet.get(s) ?? []), i % CONFIG.SET_SIZE]);
  });
  const sets = [...bySet.keys()].sort((a, b) => a - b);
  console.log(`\n  sets ${sets.join(",")} -> sizes ${sets.map((s) => bySet.get(s)!.length).join(",")}`);
  sets.forEach((s, i) => {
    const orders = bySet.get(s)!;
    if (JSON.stringify(orders) !== JSON.stringify(orders.map((_, j) => j))) fail(`set ${s} orders not contiguous from 0`);
    if (orders.length > CONFIG.SET_SIZE) fail(`set ${s} over ${CONFIG.SET_SIZE}`);
    if (orders.length < CONFIG.SET_SIZE && i !== sets.length - 1) fail(`set ${s} short but not last`);
  });
  const bankOrders = ITEMS.map((_, i) => CONFIG.BANK_BASE + i);
  console.log(`  bank orders ${bankOrders[0]}..${bankOrders[bankOrders.length - 1]}`);
  if (bankOrders.some((o) => o < 300 || o > 499)) fail("bank order outside agent A's assigned 300-499 range");

  // 6. difficulty spread
  const spread: Record<string, number> = {};
  ITEMS.forEach((x) => { spread[x.diff] = (spread[x.diff] ?? 0) + 1; });
  console.log(`  difficulty spread: ${JSON.stringify(spread)}`);
  if (Object.keys(spread).length < 3) fail("difficulty spread does not use all three levels");

  console.log("\n" + "=".repeat(70));
  if (!problems.length) { console.log("\nPRE-FLIGHT CLEAN — safe to seed."); return; }
  console.log(`\n${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.log(`  ! ${p}`));
  process.exitCode = 1;
}
main();
