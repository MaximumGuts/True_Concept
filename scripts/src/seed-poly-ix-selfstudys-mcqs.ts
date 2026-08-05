/**
 * Polynomials (math-ix-c02) — SelfStudys MCQ worksheet, English + Assamese.
 *
 * SOURCE: Books/selfstudys_com_file (21).pdf — 6 pages, a single band of MCQs
 * numbered "Question 1" .. "Question 22", continuous (no per-band restart), no
 * figures, no case study / assertion-reason / subjective sections.
 *
 * Two of the 22 are verbatim repeats inside the source itself:
 *   - Q17 is character-for-character identical to Q5
 *   - Q14 is Q12 with the four options permuted (same stem, same answer)
 * Seeding both members of each pair would put the same question twice in front of
 * one student, so only the first occurrence of each pair is seeded: 20 unique MCQs.
 *
 * SOURCE ANSWER-KEY CORRECTION (Q16): the worksheet prints "a = -3/4" for
 * "find a such that (x-2) is a factor of x^4 + ax^3 + 2x^2 - 3x". That is wrong —
 * p(2) = 16 + 8a + 8 - 6 = 18 + 8a = 0 gives a = -9/4, which is also one of the
 * printed options. correctIndex points at -9/4 and the explanation says so openly.
 *
 * Wording is reworded from the source for copyright; every number, option set and
 * answer is mathematically identical to the original.
 *
 * Assamese terminology is taken verbatim from content already live in this chapter
 * (বহুপদ / মাত্ৰা / উৎপাদক / উৎপাদক উপপাদ্য / ধ্ৰুৱক বহুপদ / শূন্য বহুপদ / ৰৈখিক /
 * দ্বিঘাত / ত্ৰিঘাত / দ্বিপদী / একপদী / গুণাংক / সংজ্ঞায়িত নহয় / ইয়াৰ কোনোটোৱেই নহয়).
 * ৰ (U+09F0) only, never Bengali র. Digits stay ASCII.
 *
 * Idempotent: deterministic doc ids (polyss-mcq-.. and polyss-pq-..), written with set().
 *
 * RUN:
 *   export TRUE_CONCEPT_SERVICE_KEY=$(< "$TEMP/tc_key_b64.txt")
 *   npx tsx src/seed-poly-ix-selfstudys-mcqs.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (getApps().length === 0) {
  const cred = JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY!, "base64").toString("utf8"));
  initializeApp({ credential: cert(cred), projectId: "true-concept-353c9" });
}
const db = getFirestore();

const CID = "math-ix-c02";
const SOURCE = "Polynomials MCQ Practice — SelfStudys Set (adapted)";
const FIRST_SET = 4;   // chapter already holds sets 1-3 (15 each) per language
const BANK_BASE = 300; // agent A's exclusive paperQuestions order range is 300-499
const SET_SIZE = 15;

export type Side = { q: string; opts: [string, string, string, string]; given: string; work: string; ans: string };
export type Item = { pdfQ: number; diff: "easy" | "moderate" | "hard"; ci: 0 | 1 | 2 | 3; en: Side; as: Side };

export const ITEMS: Item[] = [
  {
    pdfQ: 1, diff: "easy", ci: 1,
    en: {
      q: String.raw`If $(x-2)$ is a factor of a polynomial $p(x)$, then $p(2)$ must be ______`,
      opts: [String.raw`$-1$`, String.raw`$0$`, String.raw`$-2$`, String.raw`$2$`],
      given: String.raw`$(x-2)$ is a factor of $p(x)$.`,
      work: String.raw`The Factor Theorem says that $(x-a)$ is a factor of $p(x)$ exactly when $p(a)=0$. Here $a=2$, so the polynomial must vanish at $x=2$.`,
      ans: String.raw`$0$`,
    },
    as: {
      q: String.raw`যদি $(x-2)$ কোনো বহুপদ $p(x)$ ৰ এটা উৎপাদক হয়, তেন্তে $p(2)$ ৰ মান ______ হ'ব লাগিব`,
      opts: [String.raw`$-1$`, String.raw`$0$`, String.raw`$-2$`, String.raw`$2$`],
      given: String.raw`$(x-2)$, $p(x)$ ৰ এটা উৎপাদক।`,
      work: String.raw`উৎপাদক উপপাদ্য অনুসৰি, $(x-a)$ তেতিয়াহে $p(x)$ ৰ উৎপাদক হয় যেতিয়া $p(a)=0$। ইয়াত $a=2$, গতিকে বহুপদটো $x=2$ ত শূন্য হ'বই লাগিব।`,
      ans: String.raw`$0$`,
    },
  },
  {
    pdfQ: 2, diff: "easy", ci: 0,
    en: {
      q: String.raw`A polynomial whose degree is $1$ is known as a`,
      opts: [`Linear polynomial`, `Quadratic polynomial`, `Monomial`, `Binomial`],
      given: String.raw`The degree of the polynomial is $1$.`,
      work: String.raw`Polynomials are named after their degree: degree $1$ is linear, degree $2$ is quadratic, degree $3$ is cubic. "Monomial" and "binomial" count the terms rather than measure the degree, so neither is the name being asked for.`,
      ans: `Linear polynomial`,
    },
    as: {
      q: String.raw`যিটো বহুপদৰ মাত্ৰা $1$, তাক কি বোলা হয়?`,
      opts: [`ৰৈখিক বহুপদ`, `দ্বিঘাত বহুপদ`, `একপদী`, `দ্বিপদী`],
      given: String.raw`বহুপদটোৰ মাত্ৰা $1$।`,
      work: String.raw`মাত্ৰা অনুসৰি বহুপদৰ নাম দিয়া হয়ঃ মাত্ৰা $1$ হ'লে ৰৈখিক, মাত্ৰা $2$ হ'লে দ্বিঘাত, মাত্ৰা $3$ হ'লে ত্ৰিঘাত। "একপদী" আৰু "দ্বিপদী" য়ে পদৰ সংখ্যা গণে, মাত্ৰা জোখা নাই, গতিকে সেই দুটা ইয়াত বিচৰা নাম নহয়।`,
      ans: `ৰৈখিক বহুপদ`,
    },
  },
  {
    pdfQ: 3, diff: "moderate", ci: 1,
    en: {
      q: String.raw`Treated as a polynomial, $\sqrt{3}$ has degree`,
      opts: [String.raw`$2$`, String.raw`$0$`, String.raw`$1$`, String.raw`$\frac{1}{2}$`],
      given: String.raw`The polynomial is the constant $\sqrt{3}$.`,
      work: String.raw`$\sqrt{3}$ is a fixed real number, so it can be written as $\sqrt{3}\,x^{0}$. The highest power of $x$ appearing in it is therefore $0$ <span style="color:#2563eb">(the square-root sign sits on the number $3$, not on the variable, so it never touches the degree)</span>`,
      ans: String.raw`$0$`,
    },
    as: {
      q: String.raw`বহুপদ হিচাপে ধৰিলে $\sqrt{3}$ ৰ মাত্ৰা কিমান?`,
      opts: [String.raw`$2$`, String.raw`$0$`, String.raw`$1$`, String.raw`$\frac{1}{2}$`],
      given: String.raw`বহুপদটো হ'ল ধ্ৰুৱক $\sqrt{3}$।`,
      work: String.raw`$\sqrt{3}$ এটা নিৰ্দিষ্ট বাস্তৱ সংখ্যা, গতিকে ইয়াক $\sqrt{3}\,x^{0}$ ৰূপে লিখিব পাৰি। সেয়েহে ইয়াত থকা $x$ ৰ সৰ্বোচ্চ ঘাত $0$ <span style="color:#2563eb">(বৰ্গমূলৰ চিহ্নটো $3$ সংখ্যাটোৰ ওপৰত আছে, চলকটোৰ ওপৰত নহয়, গতিকে ই মাত্ৰাক স্পৰ্শ নকৰে)</span>`,
      ans: String.raw`$0$`,
    },
  },
  {
    pdfQ: 4, diff: "moderate", ci: 2,
    en: {
      q: String.raw`At most how many terms can a polynomial of degree $5$ in $x$ have?`,
      opts: [`$5$ terms`, `$4$ terms`, `$6$ terms`, `$10$ terms`],
      given: String.raw`The polynomial is in one variable $x$ and its degree is $5$.`,
      work: String.raw`Written out in full, such a polynomial is $a_5x^{5}+a_4x^{4}+a_3x^{3}+a_2x^{2}+a_1x+a_0$. The powers of $x$ that may occur run from $5$ down to $0$, that is $5,4,3,2,1,0$, and no power can be repeated. That gives $6$ possible terms <span style="color:#2563eb">(the constant term $a_0$ is the one most often forgotten)</span>`,
      ans: `$6$ terms`,
    },
    as: {
      q: String.raw`$x$ ৰ $5$ মাত্ৰাৰ এটা বহুপদত সৰ্বাধিক কিমানটা পদ থাকিব পাৰে?`,
      opts: [`$5$ টা পদ`, `$4$ টা পদ`, `$6$ টা পদ`, `$10$ টা পদ`],
      given: String.raw`বহুপদটো এটা চলক $x$ ৰ আৰু ইয়াৰ মাত্ৰা $5$।`,
      work: String.raw`সম্পূৰ্ণকৈ লিখিলে এনে বহুপদ এটা হ'ল $a_5x^{5}+a_4x^{4}+a_3x^{3}+a_2x^{2}+a_1x+a_0$। ইয়াত $x$ ৰ যিবোৰ ঘাত আহিব পাৰে সেয়া $5$ ৰ পৰা $0$ লৈ, অৰ্থাৎ $5,4,3,2,1,0$, আৰু কোনো ঘাতৰ পুনৰাবৃত্তি হ'ব নোৱাৰে। গতিকে সম্ভাৱ্য পদৰ সংখ্যা $6$ <span style="color:#2563eb">(ধ্ৰুৱক পদ $a_0$ টোৱেই সৰ্বাধিক পাহৰা পদ)</span>`,
      ans: `$6$ টা পদ`,
    },
  },
  {
    pdfQ: 5, diff: "moderate", ci: 1,
    en: {
      q: String.raw`Given that $x+2$ divides $x^{3}-2ax^{2}+16$ exactly, the value of $a$ is`,
      opts: [String.raw`$3$`, String.raw`$1$`, String.raw`$4$`, String.raw`$2$`],
      given: String.raw`$p(x)=x^{3}-2ax^{2}+16$, and $x+2$ is a factor of it.`,
      work: String.raw`$x+2=0$ gives $x=-2$, so by the Factor Theorem $p(-2)=0$.

$p(-2)=(-2)^{3}-2a(-2)^{2}+16=-8-8a+16=8-8a$

$8-8a=0\Rightarrow a=1$`,
      ans: String.raw`$a=1$`,
    },
    as: {
      q: String.raw`$x+2$ য়ে $x^{3}-2ax^{2}+16$ ক নিঃশেষে ভাগ কৰে বুলি দিয়া আছে; $a$ ৰ মান হ'ল`,
      opts: [String.raw`$3$`, String.raw`$1$`, String.raw`$4$`, String.raw`$2$`],
      given: String.raw`$p(x)=x^{3}-2ax^{2}+16$, আৰু $x+2$ ইয়াৰ এটা উৎপাদক।`,
      work: String.raw`$x+2=0$ ৰ পৰা $x=-2$, গতিকে উৎপাদক উপপাদ্য অনুসৰি $p(-2)=0$।

$p(-2)=(-2)^{3}-2a(-2)^{2}+16=-8-8a+16=8-8a$

$8-8a=0\Rightarrow a=1$`,
      ans: String.raw`$a=1$`,
    },
  },
  {
    pdfQ: 6, diff: "moderate", ci: 1,
    en: {
      q: String.raw`Since $3+5-8=0$, what is the value of $(3)^{3}+(5)^{3}-(8)^{3}$?`,
      opts: [String.raw`$260$`, String.raw`$-360$`, String.raw`$-160$`, String.raw`$160$`],
      given: String.raw`$3+5+(-8)=0$, so the three numbers add up to zero.`,
      work: String.raw`When $a+b+c=0$, the identity $a^{3}+b^{3}+c^{3}=3abc$ holds. Taking $a=3$, $b=5$, $c=-8$:

$(3)^{3}+(5)^{3}+(-8)^{3}=3\times3\times5\times(-8)=-360$

Direct arithmetic agrees: $27+125-512=-360$.`,
      ans: String.raw`$-360$`,
    },
    as: {
      q: String.raw`যিহেতু $3+5-8=0$, $(3)^{3}+(5)^{3}-(8)^{3}$ ৰ মান কিমান?`,
      opts: [String.raw`$260$`, String.raw`$-360$`, String.raw`$-160$`, String.raw`$160$`],
      given: String.raw`$3+5+(-8)=0$, গতিকে সংখ্যা তিনিটাৰ যোগফল শূন্য।`,
      work: String.raw`$a+b+c=0$ হ'লে $a^{3}+b^{3}+c^{3}=3abc$ অভেদটো খাটে। $a=3$, $b=5$, $c=-8$ ল'লেঃ

$(3)^{3}+(5)^{3}+(-8)^{3}=3\times3\times5\times(-8)=-360$

পোনপটীয়া গণনায়ো একেই কয়ঃ $27+125-512=-360$।`,
      ans: String.raw`$-360$`,
    },
  },
  {
    pdfQ: 7, diff: "easy", ci: 3,
    en: {
      q: String.raw`For which value of $k$ is $x-1$ a factor of $4x^{3}+3x^{2}-4x+k$?`,
      opts: [String.raw`$3$`, String.raw`$0$`, String.raw`$1$`, String.raw`$-3$`],
      given: String.raw`$p(x)=4x^{3}+3x^{2}-4x+k$, and $x-1$ is a factor.`,
      work: String.raw`$x-1=0$ gives $x=1$, so $p(1)=0$.

$p(1)=4+3-4+k=3+k$

$3+k=0\Rightarrow k=-3$`,
      ans: String.raw`$k=-3$`,
    },
    as: {
      q: String.raw`$k$ ৰ কোনটো মানৰ বাবে $x-1$, $4x^{3}+3x^{2}-4x+k$ ৰ এটা উৎপাদক হয়?`,
      opts: [String.raw`$3$`, String.raw`$0$`, String.raw`$1$`, String.raw`$-3$`],
      given: String.raw`$p(x)=4x^{3}+3x^{2}-4x+k$, আৰু $x-1$ ইয়াৰ এটা উৎপাদক।`,
      work: String.raw`$x-1=0$ ৰ পৰা $x=1$, গতিকে $p(1)=0$।

$p(1)=4+3-4+k=3+k$

$3+k=0\Rightarrow k=-3$`,
      ans: String.raw`$k=-3$`,
    },
  },
  {
    pdfQ: 8, diff: "easy", ci: 1,
    en: {
      q: String.raw`Find the value of $(11)^{3}$.`,
      opts: [String.raw`$1313$`, String.raw`$1331$`, String.raw`$3131$`, String.raw`$3113$`],
      given: String.raw`The cube of $11$ has to be evaluated.`,
      work: String.raw`Write $11$ as $10+1$ and expand with $(a+b)^{3}=a^{3}+3a^{2}b+3ab^{2}+b^{3}$:

$(10+1)^{3}=1000+3(100)(1)+3(10)(1)+1$

$=1000+300+30+1=1331$`,
      ans: String.raw`$1331$`,
    },
    as: {
      q: String.raw`$(11)^{3}$ ৰ মান নিৰ্ণয় কৰা।`,
      opts: [String.raw`$1313$`, String.raw`$1331$`, String.raw`$3131$`, String.raw`$3113$`],
      given: String.raw`$11$ ৰ ঘন নিৰ্ণয় কৰিব লাগিব।`,
      work: String.raw`$11$ ক $10+1$ বুলি লিখি $(a+b)^{3}=a^{3}+3a^{2}b+3ab^{2}+b^{3}$ অভেদেৰে বিস্তাৰ কৰোঁঃ

$(10+1)^{3}=1000+3(100)(1)+3(10)(1)+1$

$=1000+300+30+1=1331$`,
      ans: String.raw`$1331$`,
    },
  },
  {
    pdfQ: 9, diff: "moderate", ci: 0,
    en: {
      q: String.raw`Which of the following is the factorised form of $3x^{2}-5x+2$?`,
      opts: [String.raw`$(3x-2)(x-1)$`, String.raw`$(x+2)(3x-1)$`, String.raw`$(3x+2)(x-1)$`, String.raw`$(x-2)(3x+1)$`],
      given: String.raw`The expression is $3x^{2}-5x+2$, so $a=3$, $b=-5$, $c=2$.`,
      work: String.raw`Split the middle term: look for two numbers whose product is $ac=3\times2=6$ and whose sum is $-5$. They are $-3$ and $-2$.

$3x^{2}-3x-2x+2=3x(x-1)-2(x-1)=(x-1)(3x-2)$`,
      ans: String.raw`$(3x-2)(x-1)$`,
    },
    as: {
      q: String.raw`তলৰ কোনটো $3x^{2}-5x+2$ ৰ উৎপাদকীকৃত ৰূপ?`,
      opts: [String.raw`$(3x-2)(x-1)$`, String.raw`$(x+2)(3x-1)$`, String.raw`$(3x+2)(x-1)$`, String.raw`$(x-2)(3x+1)$`],
      given: String.raw`ৰাশিটো হ'ল $3x^{2}-5x+2$, গতিকে $a=3$, $b=-5$, $c=2$।`,
      work: String.raw`মধ্য পদ ভাঙি লওঁঃ যিদুটা সংখ্যাৰ পূৰণফল $ac=3\times2=6$ আৰু যোগফল $-5$, সেই দুটা বিচাৰো। সিহঁত হ'ল $-3$ আৰু $-2$।

$3x^{2}-3x-2x+2=3x(x-1)-2(x-1)=(x-1)(3x-2)$`,
      ans: String.raw`$(3x-2)(x-1)$`,
    },
  },
  {
    pdfQ: 10, diff: "easy", ci: 1,
    en: {
      q: String.raw`Suppose $x-a$ is a factor of $p(x)=ax^{2}+bx+c$. Which statement must then be true?`,
      opts: [String.raw`$p(a)=2$`, String.raw`$p(a)=0$`, String.raw`$p(2)=1$`, String.raw`$p(b)=0$`],
      given: String.raw`$x-a$ is a factor of $p(x)=ax^{2}+bx+c$.`,
      work: String.raw`By the Factor Theorem, $(x-a)$ is a factor of $p(x)$ if and only if putting $x=a$ makes the polynomial vanish, that is $p(a)=0$. The remaining options fix values either at the wrong point or to the wrong number, and none of them follows from the given factor.`,
      ans: String.raw`$p(a)=0$`,
    },
    as: {
      q: String.raw`ধৰক $x-a$, $p(x)=ax^{2}+bx+c$ ৰ এটা উৎপাদক। তেন্তে তলৰ কোনটো উক্তি অৱশ্যে সত্য?`,
      opts: [String.raw`$p(a)=2$`, String.raw`$p(a)=0$`, String.raw`$p(2)=1$`, String.raw`$p(b)=0$`],
      given: String.raw`$x-a$, $p(x)=ax^{2}+bx+c$ ৰ এটা উৎপাদক।`,
      work: String.raw`উৎপাদক উপপাদ্য অনুসৰি, $(x-a)$ তেতিয়াহে আৰু কেৱল তেতিয়াহে $p(x)$ ৰ উৎপাদক হয় যেতিয়া $x=a$ বহালে বহুপদটো শূন্য হয়, অৰ্থাৎ $p(a)=0$। বাকী বিকল্পবোৰে হয় ভুল বিন্দুত নহয় ভুল সংখ্যাত মান নিৰ্দিষ্ট কৰিছে, আৰু দিয়া উৎপাদকটোৰ পৰা সেইবোৰৰ এটাও ওলাই নাহে।`,
      ans: String.raw`$p(a)=0$`,
    },
  },
  {
    pdfQ: 11, diff: "moderate", ci: 2,
    en: {
      q: String.raw`Which of these expressions is a binomial of degree $20$?`,
      opts: [String.raw`$20x+1$`, String.raw`$\frac{x}{20}+1$`, String.raw`$x^{20}+1$`, String.raw`$x^{2}+20$`],
      given: String.raw`A binomial has exactly two terms, and its degree is the highest power of the variable in it.`,
      work: String.raw`Every option has two terms, so the degree decides. $20x+1$ has degree $1$; $\frac{x}{20}+1$ also has degree $1$, since dividing by $20$ scales the coefficient and not the power; $x^{2}+20$ has degree $2$. Only $x^{20}+1$ has highest power $20$.`,
      ans: String.raw`$x^{20}+1$`,
    },
    as: {
      q: String.raw`তলৰ কোনটো ৰাশি $20$ মাত্ৰাৰ এটা দ্বিপদী?`,
      opts: [String.raw`$20x+1$`, String.raw`$\frac{x}{20}+1$`, String.raw`$x^{20}+1$`, String.raw`$x^{2}+20$`],
      given: String.raw`দ্বিপদীত ঠিক দুটা পদ থাকে, আৰু ইয়াৰ মাত্ৰা হ'ল ভিতৰত থকা চলকৰ সৰ্বোচ্চ ঘাত।`,
      work: String.raw`প্ৰতিটো বিকল্পতে দুটাকৈ পদ আছে, গতিকে মাত্ৰাইহে সিদ্ধান্ত দিব। $20x+1$ ৰ মাত্ৰা $1$; $\frac{x}{20}+1$ ৰো মাত্ৰা $1$, কাৰণ $20$ ৰে ভাগ কৰিলে গুণাংকহে সলনি হয়, ঘাত নহয়; $x^{2}+20$ ৰ মাত্ৰা $2$। কেৱল $x^{20}+1$ ৰহে সৰ্বোচ্চ ঘাত $20$।`,
      ans: String.raw`$x^{20}+1$`,
    },
  },
  {
    pdfQ: 12, diff: "easy", ci: 3,
    en: {
      q: String.raw`The degree of the zero polynomial is`,
      opts: [String.raw`$1$`, `Any natural number`, String.raw`$0$`, `Not defined`],
      given: String.raw`The polynomial under discussion is the zero polynomial, $p(x)=0$.`,
      work: String.raw`Degree means the highest power of the variable that carries a non-zero coefficient. In the zero polynomial every coefficient is zero, so there is no such power to point at and no value can be assigned <span style="color:#2563eb">(contrast a non-zero constant such as $7$, whose degree is perfectly well defined and equal to $0$)</span>`,
      ans: `Not defined`,
    },
    as: {
      q: String.raw`শূন্য বহুপদৰ মাত্ৰা হ'ল`,
      opts: [String.raw`$1$`, `যিকোনো স্বাভাৱিক সংখ্যা`, String.raw`$0$`, `সংজ্ঞায়িত নহয়`],
      given: String.raw`আলোচনাধীন বহুপদটো হ'ল শূন্য বহুপদ, $p(x)=0$।`,
      work: String.raw`মাত্ৰা মানে অশূন্য গুণাংক থকা পদবোৰৰ মাজত চলকৰ সৰ্বোচ্চ ঘাত। শূন্য বহুপদত প্ৰতিটো গুণাংকেই শূন্য, গতিকে দেখুৱাব পৰা তেনে কোনো ঘাতেই নাই আৰু কোনো মানো নিৰ্ধাৰণ কৰিব নোৱাৰি <span style="color:#2563eb">(ইয়াৰ বিপৰীতে $7$ ৰ দৰে এটা অশূন্য ধ্ৰুৱকৰ মাত্ৰা সুস্পষ্টভাৱে সংজ্ঞায়িত আৰু সেয়া $0$)</span>`,
      ans: `সংজ্ঞায়িত নহয়`,
    },
  },
  {
    pdfQ: 13, diff: "hard", ci: 2,
    en: {
      q: String.raw`For a polynomial $p(x)$ it is known that $p(-1)$ and $p(2)$ are both zero. Which expression is therefore a factor of $p(x)$?`,
      opts: [String.raw`$(x^{2}+2x-1)$`, String.raw`$(x^{2}-2x+1)$`, String.raw`$(x^{2}-x-2)$`, String.raw`$(x^{2}-x+2)$`],
      given: String.raw`$p(-1)=0$ and $p(2)=0$.`,
      work: String.raw`By the Factor Theorem $p(-1)=0$ makes $(x+1)$ a factor, and $p(2)=0$ makes $(x-2)$ a factor. Since $-1\neq2$ these are two different factors, so their product divides $p(x)$ as well:

$(x+1)(x-2)=x^{2}-2x+x-2=x^{2}-x-2$`,
      ans: String.raw`$(x^{2}-x-2)$`,
    },
    as: {
      q: String.raw`এটা বহুপদ $p(x)$ ৰ ক্ষেত্ৰত জনা গৈছে যে $p(-1)$ আৰু $p(2)$ দুয়োটাই শূন্য। গতিকে তলৰ কোনটো ৰাশি $p(x)$ ৰ এটা উৎপাদক?`,
      opts: [String.raw`$(x^{2}+2x-1)$`, String.raw`$(x^{2}-2x+1)$`, String.raw`$(x^{2}-x-2)$`, String.raw`$(x^{2}-x+2)$`],
      given: String.raw`$p(-1)=0$ আৰু $p(2)=0$।`,
      work: String.raw`উৎপাদক উপপাদ্য অনুসৰি $p(-1)=0$ ৰ বাবে $(x+1)$ এটা উৎপাদক, আৰু $p(2)=0$ ৰ বাবে $(x-2)$ এটা উৎপাদক। যিহেতু $-1\neq2$, এই দুটা পৃথক উৎপাদক, গতিকে সিহঁতৰ পূৰণফলেও $p(x)$ ক ভাগ কৰেঃ

$(x+1)(x-2)=x^{2}-2x+x-2=x^{2}-x-2$`,
      ans: String.raw`$(x^{2}-x-2)$`,
    },
  },
  {
    pdfQ: 15, diff: "easy", ci: 3,
    en: {
      q: String.raw`What is the zero of the polynomial $f(x)=2x+7$?`,
      opts: [String.raw`$\frac{2}{7}$`, String.raw`$-\frac{2}{7}$`, String.raw`$\frac{7}{2}$`, String.raw`$-\frac{7}{2}$`],
      given: String.raw`$f(x)=2x+7$.`,
      work: String.raw`A zero of $f$ is the value of $x$ at which $f(x)=0$:

$2x+7=0\Rightarrow2x=-7\Rightarrow x=-\frac{7}{2}$`,
      ans: String.raw`$-\frac{7}{2}$`,
    },
    as: {
      q: String.raw`$f(x)=2x+7$ বহুপদটোৰ শূন্য কি?`,
      opts: [String.raw`$\frac{2}{7}$`, String.raw`$-\frac{2}{7}$`, String.raw`$\frac{7}{2}$`, String.raw`$-\frac{7}{2}$`],
      given: String.raw`$f(x)=2x+7$।`,
      work: String.raw`$f$ ৰ শূন্য হ'ল $x$ ৰ সেই মান য'ত $f(x)=0$ হয়ঃ

$2x+7=0\Rightarrow2x=-7\Rightarrow x=-\frac{7}{2}$`,
      ans: String.raw`$-\frac{7}{2}$`,
    },
  },
  {
    pdfQ: 16, diff: "hard", ci: 2,
    en: {
      q: String.raw`Find the value of $a$ for which $(x-2)$ is a factor of the polynomial $x^{4}+ax^{3}+2x^{2}-3x$.`,
      opts: [String.raw`$a=-\frac{3}{4}$`, String.raw`$a=\frac{3}{4}$`, String.raw`$a=-\frac{9}{4}$`, String.raw`$a=\frac{9}{4}$`],
      given: String.raw`$p(x)=x^{4}+ax^{3}+2x^{2}-3x$, and $(x-2)$ is a factor of it.`,
      work: String.raw`Because $(x-2)$ is a factor, $p(2)=0$.

$p(2)=2^{4}+a\cdot2^{3}+2\cdot2^{2}-3\cdot2=16+8a+8-6=18+8a$

$18+8a=0\Rightarrow8a=-18\Rightarrow a=-\frac{18}{8}=-\frac{9}{4}$

Verify: with $a=-\frac{9}{4}$, $p(2)=16-18+8-6=0$, as required.

<span style="color:#2563eb">(The printed key in the source worksheet gives $a=-\frac{3}{4}$. That value fails the check, because it makes $p(2)=16-6+8-6=12\neq0$; the source key is simply wrong and the correct value is $-\frac{9}{4}$.)</span>`,
      ans: String.raw`$a=-\frac{9}{4}$`,
    },
    as: {
      q: String.raw`$x^{4}+ax^{3}+2x^{2}-3x$ বহুপদটোৰ $(x-2)$ এটা উৎপাদক হ'বলৈ $a$ ৰ মান নিৰ্ণয় কৰা।`,
      opts: [String.raw`$a=-\frac{3}{4}$`, String.raw`$a=\frac{3}{4}$`, String.raw`$a=-\frac{9}{4}$`, String.raw`$a=\frac{9}{4}$`],
      given: String.raw`$p(x)=x^{4}+ax^{3}+2x^{2}-3x$, আৰু $(x-2)$ ইয়াৰ এটা উৎপাদক।`,
      work: String.raw`$(x-2)$ উৎপাদক হোৱাৰ বাবে $p(2)=0$।

$p(2)=2^{4}+a\cdot2^{3}+2\cdot2^{2}-3\cdot2=16+8a+8-6=18+8a$

$18+8a=0\Rightarrow8a=-18\Rightarrow a=-\frac{18}{8}=-\frac{9}{4}$

পৰীক্ষাঃ $a=-\frac{9}{4}$ ল'লে $p(2)=16-18+8-6=0$ হয়, যিটোৱেই লাগিছিল।

<span style="color:#2563eb">(মূল প্ৰশ্নকাকতত ছপা উত্তৰ হিচাপে $a=-\frac{3}{4}$ দিয়া আছে। সেই মানটোৱে পৰীক্ষাত উতৰি নাযায়, কাৰণ তাত $p(2)=16-6+8-6=12\neq0$ হয়; উৎসৰ উত্তৰটো ভুল আৰু শুদ্ধ মান হ'ল $-\frac{9}{4}$।)</span>`,
      ans: String.raw`$a=-\frac{9}{4}$`,
    },
  },
  {
    pdfQ: 18, diff: "easy", ci: 0,
    en: {
      q: String.raw`What does $p(t)=2+t+2t^{2}-t^{3}$ evaluate to at $t=0$?`,
      opts: [String.raw`$2$`, String.raw`$1$`, String.raw`$4$`, String.raw`$0$`],
      given: String.raw`$p(t)=2+t+2t^{2}-t^{3}$, to be evaluated at $t=0$.`,
      work: String.raw`Substituting $t=0$ wipes out every term that carries $t$:

$p(0)=2+0+2(0)^{2}-(0)^{3}=2$

Only the constant term survives.`,
      ans: String.raw`$2$`,
    },
    as: {
      q: String.raw`$t=0$ ত $p(t)=2+t+2t^{2}-t^{3}$ ৰ মান কিমান হয়?`,
      opts: [String.raw`$2$`, String.raw`$1$`, String.raw`$4$`, String.raw`$0$`],
      given: String.raw`$p(t)=2+t+2t^{2}-t^{3}$, ইয়াৰ মান $t=0$ ত নিৰ্ণয় কৰিব লাগিব।`,
      work: String.raw`$t=0$ বহালে $t$ থকা প্ৰতিটো পদেই নাইকিয়া হৈ যায়ঃ

$p(0)=2+0+2(0)^{2}-(0)^{3}=2$

কেৱল ধ্ৰুৱক পদটোহে ৰৈ যায়।`,
      ans: String.raw`$2$`,
    },
  },
  {
    pdfQ: 19, diff: "easy", ci: 0,
    en: {
      q: String.raw`$1+3x$ is a ________ polynomial.`,
      opts: [`Linear`, `Quadratic`, `Cubic`, `None of these`],
      given: String.raw`The expression is $1+3x$.`,
      work: String.raw`The only power of $x$ present is $1$, in the term $3x$, so the degree is $1$, and a polynomial of degree $1$ is called linear <span style="color:#2563eb">(writing the constant first does not change the degree)</span>`,
      ans: `Linear`,
    },
    as: {
      q: String.raw`$1+3x$ এটা ________ বহুপদ।`,
      opts: [`ৰৈখিক`, `দ্বিঘাত`, `ত্ৰিঘাত`, `ইয়াৰ কোনোটোৱেই নহয়`],
      given: String.raw`ৰাশিটো হ'ল $1+3x$।`,
      work: String.raw`ইয়াত থকা $x$ ৰ একমাত্ৰ ঘাত হ'ল $1$, $3x$ পদটোত; গতিকে মাত্ৰা $1$, আৰু $1$ মাত্ৰাৰ বহুপদক ৰৈখিক বোলা হয় <span style="color:#2563eb">(ধ্ৰুৱক পদটো আগত লিখিলেও মাত্ৰা সলনি নহয়)</span>`,
      ans: `ৰৈখিক`,
    },
  },
  {
    pdfQ: 20, diff: "hard", ci: 1,
    en: {
      q: String.raw`For which value of $p$ is $x+p$ a factor of $x^{2}+px+3-p$?`,
      opts: [String.raw`$-3$`, String.raw`$3$`, String.raw`$1$`, String.raw`$-1$`],
      given: String.raw`$f(x)=x^{2}+px+3-p$, and $x+p$ is a factor of it.`,
      work: String.raw`$x+p=0$ gives $x=-p$, so $f(-p)=0$.

$f(-p)=(-p)^{2}+p(-p)+3-p=p^{2}-p^{2}+3-p=3-p$

$3-p=0\Rightarrow p=3$`,
      ans: String.raw`$p=3$`,
    },
    as: {
      q: String.raw`$p$ ৰ কোনটো মানৰ বাবে $x+p$, $x^{2}+px+3-p$ ৰ এটা উৎপাদক হয়?`,
      opts: [String.raw`$-3$`, String.raw`$3$`, String.raw`$1$`, String.raw`$-1$`],
      given: String.raw`$f(x)=x^{2}+px+3-p$, আৰু $x+p$ ইয়াৰ এটা উৎপাদক।`,
      work: String.raw`$x+p=0$ ৰ পৰা $x=-p$, গতিকে $f(-p)=0$।

$f(-p)=(-p)^{2}+p(-p)+3-p=p^{2}-p^{2}+3-p=3-p$

$3-p=0\Rightarrow p=3$`,
      ans: String.raw`$p=3$`,
    },
  },
  {
    pdfQ: 21, diff: "moderate", ci: 1,
    en: {
      q: String.raw`What is the solution of the quadratic equation $x^{2}+5x-6=0$?`,
      opts: [String.raw`$x=-1,\ x=6$`, String.raw`$x=1,\ x=-6$`, String.raw`$x=1$`, String.raw`$x=6$`],
      given: String.raw`$x^{2}+5x-6=0$.`,
      work: String.raw`Split the middle term with two numbers whose product is $-6$ and whose sum is $+5$; they are $+6$ and $-1$.

$x^{2}+6x-x-6=0$

$x(x+6)-1(x+6)=0$

$(x+6)(x-1)=0$

so $x=-6$ or $x=1$.`,
      ans: String.raw`$x=1,\ x=-6$`,
    },
    as: {
      q: String.raw`$x^{2}+5x-6=0$ দ্বিঘাত সমীকৰণটোৰ সমাধান কি?`,
      opts: [String.raw`$x=-1,\ x=6$`, String.raw`$x=1,\ x=-6$`, String.raw`$x=1$`, String.raw`$x=6$`],
      given: String.raw`$x^{2}+5x-6=0$।`,
      work: String.raw`যিদুটা সংখ্যাৰ পূৰণফল $-6$ আৰু যোগফল $+5$, সেই দুটাৰে মধ্য পদ ভাঙি লওঁ; সিহঁত হ'ল $+6$ আৰু $-1$।

$x^{2}+6x-x-6=0$

$x(x+6)-1(x+6)=0$

$(x+6)(x-1)=0$

গতিকে $x=-6$ বা $x=1$।`,
      ans: String.raw`$x=1,\ x=-6$`,
    },
  },
  {
    pdfQ: 22, diff: "easy", ci: 1,
    en: {
      q: String.raw`$x^{2}-x$ is a ________ polynomial.`,
      opts: [`Linear`, `Quadratic`, `Cubic`, `None of these`],
      given: String.raw`The expression is $x^{2}-x$.`,
      work: String.raw`The powers of $x$ occurring are $2$ and $1$, and the highest of them is $2$. A polynomial of degree $2$ is called quadratic.`,
      ans: `Quadratic`,
    },
    as: {
      q: String.raw`$x^{2}-x$ এটা ________ বহুপদ।`,
      opts: [`ৰৈখিক`, `দ্বিঘাত`, `ত্ৰিঘাত`, `ইয়াৰ কোনোটোৱেই নহয়`],
      given: String.raw`ৰাশিটো হ'ল $x^{2}-x$।`,
      work: String.raw`ইয়াত থকা $x$ ৰ ঘাতবোৰ হ'ল $2$ আৰু $1$, আৰু সিহঁতৰ সৰ্বোচ্চটো $2$। $2$ মাত্ৰাৰ বহুপদক দ্বিঘাত বোলা হয়।`,
      ans: `দ্বিঘাত`,
    },
  },
];

export const LETTER = ["a", "b", "c", "d"] as const;

export function explain(side: Side, ci: number, lang: "English" | "Assamese"): string {
  const [givenLbl, workLbl, ansLbl, stop] =
    lang === "English"
      ? ["Given", "Working", "Correct option", "."]
      : ["দিয়া আছে", "সমাধান", "শুদ্ধ বিকল্প", "।"];
  return (
    `**<span style="color:#d97706">${givenLbl}</span>** — <span style="color:#0d9488">${side.given}</span>\n\n` +
    `**<span style="color:#da6b45">${workLbl}</span>**\n\n` +
    `${side.work}\n\n` +
    `<span style="color:#16a34a"><strong>${ansLbl}: (${LETTER[ci]})</strong> — ${side.ans}${stop}</span>`
  );
}

export const bankQuestion = (side: Side): string =>
  `${side.q}\n\n` + side.opts.map((o, i) => `(${LETTER[i]}) ${o}`).join("\n");

export const CONFIG = { CID, SOURCE, FIRST_SET, BANK_BASE, SET_SIZE };

async function main() {
  const pad = (n: number) => String(n).padStart(2, "0");
  let mcqN = 0;
  let bankN = 0;
  const batch = db.batch();

  ITEMS.forEach((item, i) => {
    const setNumber = FIRST_SET + Math.floor(i / SET_SIZE);
    const order = i % SET_SIZE;
    const bankOrder = BANK_BASE + i;

    for (const [lang, tag, side] of [
      ["English", "en", item.en],
      ["Assamese", "as", item.as],
    ] as ["English" | "Assamese", "en" | "as", Side][]) {
      const expl = explain(side, item.ci, lang);

      batch.set(db.collection("mcqs").doc(`polyss-mcq-${tag}-${pad(i + 1)}`), {
        chapterId: CID,
        language: lang,
        question: side.q,
        options: side.opts,
        correctIndex: item.ci,
        explanation: expl,
        difficulty: item.diff,
        setNumber,
        order,
        sourcePaper: SOURCE,
        createdAt: FieldValue.serverTimestamp(),
      });
      mcqN++;

      batch.set(db.collection("paperQuestions").doc(`polyss-pq-${tag}-${pad(i + 1)}`), {
        chapterId: CID,
        language: lang,
        question: bankQuestion(side),
        answer: expl,
        questionType: "mcq",
        marks: 1,
        difficulty: item.diff,
        boards: "Both",
        order: bankOrder,
        sourcePaper: SOURCE,
        createdAt: FieldValue.serverTimestamp(),
      });
      bankN++;
    }
  });

  await batch.commit();
  console.log(`Seeded ${mcqN} mcqs and ${bankN} paperQuestions for ${CID}`);
  console.log(`  sets ${FIRST_SET}..${FIRST_SET + Math.floor((ITEMS.length - 1) / SET_SIZE)} per language`);
  console.log(`  bank orders ${BANK_BASE}..${BANK_BASE + ITEMS.length - 1} per language`);
}
/* Only seed when this file is the entry point — the pre-flight checker imports it. */
if (process.argv[1]?.replace(/\\/g, "/").endsWith("seed-poly-ix-selfstudys-mcqs.ts")) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
