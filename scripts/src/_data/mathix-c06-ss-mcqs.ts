// Lines and Angles (Class IX, chapter math-ix-c06) — the 22 MCQs of
// `Books/selfstudys_com_file (25).pdf`.
//
// CONFIRMED SECTION MAP: the PDF is 6 pages, titled "Lines and Angles" on p.1,
// and holds exactly ONE band — "Question 1." … "Question 22.", numbered
// straight through with no restart, each followed by four options (a)–(d) and
// an "Answer:" line. There is no Assertion–Reason, Case-Based, Very Short,
// Short or Long band anywhere in the file, and the file contains no diagrams
// (its only vector drawings are the horizontal rules between questions).
// 22 − 1 + 1 = 22 questions extracted. Nothing sits between bands because
// there is only one band.
//
// English stems are REWORDED for copyright; the numbers, the concepts, the
// option sets and the answers are untouched. The Assamese side reuses this
// chapter's own LIVE vocabulary (mined from the existing math-ix-c06 docs):
//   ৰেখা line | সৰলৰেখা straight line | ৰশ্মি ray | ৰেখাখণ্ড segment
//   কোণ angle | সমকোণ right angle | সূক্ষ্মকোণ acute | স্থূলকোণ obtuse
//   সমৰেখ collinear | সমতল plane | লম্ব perpendicular | সমান্তৰাল parallel
//   ছেদক transversal | অনুৰূপ কোণ corresponding | একান্তৰ কোণ alternate
//   বিপ্ৰতীপ কোণ vertically opposite | ৰৈখিক যোৰ linear pair
//   সন্নিহিত কোণ adjacent | সম্পূৰক supplementary | পূৰক complementary
//   অন্তঃকোণ interior angle | বহিঃকোণ exterior angle | সমদ্বিখণ্ডক bisector
//   কোণৰ সমষ্টি ধৰ্ম angle sum property | সমদ্বিবাহু isosceles | ভূমিৰ কোণ base angle
//   স্বীকাৰ্য axiom | উপপাদ্য theorem | ছেদবিন্দু point of intersection
//
// `printedKey` is the 0-based answer printed in the source PDF; `correctIndex`
// is the answer THIS file asserts after re-solving every item by hand. Where
// they differ the seed script reports it and demands a student-visible note in
// both languages. (They agree on all 22 here.)
//
// The seed script composes the colour-styled explanation from
// `given` / `work` / `answerLabel`, so both languages get an identical
// five-colour structure.

export type SsMcqSide = {
  /** plain text only — the student MCQ screen renders this without KaTeX */
  question: string;
  /** plain text only, exactly 4 */
  options: string[];
  /** the data the question hands you — rendered teal */
  given: string;
  /** worked steps — markdown + KaTeX, inline reasons already in blue spans */
  work: string;
  /** short phrase completing "Correct option: (x) — …" — rendered green */
  answerLabel: string;
  note?: string;
};

export type SsMcqItem = {
  i: number;
  difficulty: "easy" | "moderate" | "hard";
  correctIndex: number;
  printedKey: number;
  /** the theorem / property that settles the item (audit trail) */
  warrant: string;
  /** must equal options[correctIndex] exactly — catches a mis-set correctIndex */
  enNeedle: string;
  asNeedle: string;
  /** file name under lines-angles-ix-chapter/ (language-neutral, shared EN+AS) */
  figure?: string;
  en: SsMcqSide;
  as: SsMcqSide;
};

const B = (s: string) => `<span style="color:#2563eb">${s}</span>`;
const G = (s: string) => `<span style="color:#16a34a">${s}</span>`;

export const items: SsMcqItem[] = [
  // ── Q1 ───────────────────────────────────────────────────────────────────
  {
    i: 0, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Angles opposite the equal sides of an isosceles triangle are equal, and the three angles of a triangle add up to 180°; 90° + 2B = 180° gives B = 45°.",
    enNeedle: "45°", asNeedle: "45°",
    figure: "ss-mcq-q01-right-isosceles-v2.png",
    en: {
      question: "In △ABC the angle at A measures 90° and the two sides AB and AC are equal in length. How large is ∠B?",
      options: ["45°", "35°", "75°", "65°"],
      given: "In $\\triangle ABC$, $\\angle A = 90°$ and $AB = AC$.",
      work: `Since $AB = AC$, the triangle is isosceles, and the angles lying opposite those two equal sides are equal ${B("(angles opposite equal sides of a triangle are equal)")}, so $\\angle B = \\angle C$.

$\\angle A + \\angle B + \\angle C = 180°$ ${B("(angle sum property of a triangle)")}

$90° + \\angle B + \\angle B = 180°$

$2\\angle B = 90° \\implies \\angle B = 45°$`,
      answerLabel: "$\\angle B = 45°$",
    },
    as: {
      question: "△ABC ত A ত থকা কোণটোৰ জোখ 90° আৰু AB আৰু AC বাহু দুটাৰ দৈৰ্ঘ্য সমান। ∠B কিমান?",
      options: ["45°", "35°", "75°", "65°"],
      given: "$\\triangle ABC$ ত $\\angle A = 90°$ আৰু $AB = AC$।",
      work: `যিহেতু $AB = AC$, ত্ৰিভুজটো সমদ্বিবাহু, আৰু সেই সমান বাহু দুটাৰ বিপৰীতে থকা কোণ দুটা সমান ${B("(ত্ৰিভুজৰ সমান বাহুৰ বিপৰীতে থকা কোণ সমান)")}, গতিকে $\\angle B = \\angle C$।

$\\angle A + \\angle B + \\angle C = 180°$ ${B("(ত্ৰিভুজৰ কোণৰ সমষ্টি ধৰ্ম)")}

$90° + \\angle B + \\angle B = 180°$

$2\\angle B = 90° \\implies \\angle B = 45°$`,
      answerLabel: "$\\angle B = 45°$",
    },
  },

  // ── Q2 ───────────────────────────────────────────────────────────────────
  {
    i: 1, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "Angle sum property: 53° + B + 44° = 180°, so B = 83°.",
    enNeedle: "83°", asNeedle: "83°",
    en: {
      question: "Two of the angles of △ABC are ∠A = 53° and ∠C = 44°. What does ∠B measure?",
      options: ["46°", "83°", "93°", "73°"],
      given: "In $\\triangle ABC$, $\\angle A = 53°$ and $\\angle C = 44°$.",
      work: `$\\angle A + \\angle B + \\angle C = 180°$ ${B("(angle sum property of a triangle)")}

$53° + \\angle B + 44° = 180°$

$\\angle B = 180° - 97°$

$\\angle B = 83°$`,
      answerLabel: "$\\angle B = 83°$",
    },
    as: {
      question: "△ABC ৰ দুটা কোণ হ'ল ∠A = 53° আৰু ∠C = 44°। ∠B ৰ জোখ কিমান?",
      options: ["46°", "83°", "93°", "73°"],
      given: "$\\triangle ABC$ ত $\\angle A = 53°$ আৰু $\\angle C = 44°$।",
      work: `$\\angle A + \\angle B + \\angle C = 180°$ ${B("(ত্ৰিভুজৰ কোণৰ সমষ্টি ধৰ্ম)")}

$53° + \\angle B + 44° = 180°$

$\\angle B = 180° - 97°$

$\\angle B = 83°$`,
      answerLabel: "$\\angle B = 83°$",
    },
  },

  // ── Q3 ───────────────────────────────────────────────────────────────────
  {
    i: 2, difficulty: "moderate", correctIndex: 2, printedKey: 2,
    warrant: "Exactly one line passes through two distinct points, and with no three of the four points collinear no two pairs give the same line, so the count is the number of pairs, (4x3)/2 = 6.",
    enNeedle: "6 lines", asNeedle: "6 ডাল ৰেখা",
    figure: "ss-mcq-q03-four-points-six-lines-v2.png",
    en: {
      question: "Four points are marked in a plane so that no three of them lie on one line. How many different lines can be drawn joining pairs of these points?",
      options: ["4 lines", "8 lines", "6 lines", "2 lines"],
      given: "Four points $A$, $B$, $C$, $D$ in a plane, no three of them collinear.",
      work: `Through any two distinct points there passes one and only one line ${B("(Euclid's first postulate)")}, so each unordered pair of the four points determines exactly one line.

Because no three of the points are collinear, two different pairs can never determine the same line — every pair gives a fresh line.

Number of pairs $= \\dfrac{4 \\times 3}{2} = 6$

The six lines are $AB$, $AC$, $AD$, $BC$, $BD$ and $CD$, as drawn in the figure.`,
      answerLabel: "6 lines",
    },
    as: {
      question: "এখন সমতলত চাৰিটা বিন্দু এনেদৰে চিহ্নিত কৰা হৈছে যাতে সিহঁতৰ তিনিটাও সমৰেখ নহয়। এই বিন্দুবোৰৰ যোৰ সংযোগ কৰি কিমানডাল বেলেগ বেলেগ ৰেখা আঁকিব পাৰি?",
      options: ["4 ডাল ৰেখা", "8 ডাল ৰেখা", "6 ডাল ৰেখা", "2 ডাল ৰেখা"],
      given: "এখন সমতলত চাৰিটা বিন্দু $A$, $B$, $C$, $D$, য'ত তিনিটাও বিন্দু সমৰেখ নহয়।",
      work: `দুটা পৃথক বিন্দুৰ মাজেৰে কেৱল এডালহে ৰেখা যায় ${B("(ইউক্লিডৰ প্ৰথম স্বীকাৰ্য)")}, গতিকে চাৰিটা বিন্দুৰ প্ৰতিযোৰে ঠিক এডালকৈ ৰেখা নিৰ্ধাৰণ কৰে।

তিনিটাও বিন্দু সমৰেখ নোহোৱাৰ বাবে দুটা বেলেগ বেলেগ যোৰে কেতিয়াও একেডাল ৰেখা নিদিয়ে — প্ৰতিযোৰেই নতুন এডাল ৰেখা দিয়ে।

যোৰৰ সংখ্যা $= \\dfrac{4 \\times 3}{2} = 6$

চিত্ৰত অঁকাৰ দৰে ৰেখা 6 ডাল হ'ল $AB$, $AC$, $AD$, $BC$, $BD$ আৰু $CD$।`,
      answerLabel: "6 ডাল ৰেখা",
    },
  },

  // ── Q4 ───────────────────────────────────────────────────────────────────
  {
    i: 3, difficulty: "moderate", correctIndex: 2, printedKey: 2,
    warrant: "If A = B + C then A + (B + C) = 180° gives 2A = 180°, A = 90°, so the triangle is right angled.",
    enNeedle: "A right-angled triangle", asNeedle: "এটা সমকোণী ত্ৰিভুজ",
    en: {
      question: "In a triangle one angle is exactly as large as the other two put together. Such a triangle must be:",
      options: ["An acute-angled triangle", "An obtuse-angled triangle", "A right-angled triangle", "None of these"],
      given: "In $\\triangle ABC$ one angle equals the sum of the remaining two; take $\\angle A = \\angle B + \\angle C$.",
      work: `$\\angle A + \\angle B + \\angle C = 180°$ ${B("(angle sum property of a triangle)")}

Replace $\\angle B + \\angle C$ by $\\angle A$, which the question says they are equal to:

$\\angle A + \\angle A = 180°$

$2\\angle A = 180° \\implies \\angle A = 90°$

So one angle of the triangle is a right angle. ${B("It cannot be acute-angled (that needs all three angles below 90°) nor obtuse-angled (that needs an angle above 90°).")}`,
      answerLabel: "a right-angled triangle",
    },
    as: {
      question: "এটা ত্ৰিভুজৰ এটা কোণ বাকী দুটা কোণৰ যোগফলৰ ঠিক সমান। এনে ত্ৰিভুজটো নিশ্চয়কৈ হ'ব-",
      options: ["এটা সূক্ষ্মকোণী ত্ৰিভুজ", "এটা স্থূলকোণী ত্ৰিভুজ", "এটা সমকোণী ত্ৰিভুজ", "এটাও নহয়"],
      given: "$\\triangle ABC$ ত এটা কোণ বাকী দুটাৰ যোগফলৰ সমান; ধৰোঁ $\\angle A = \\angle B + \\angle C$।",
      work: `$\\angle A + \\angle B + \\angle C = 180°$ ${B("(ত্ৰিভুজৰ কোণৰ সমষ্টি ধৰ্ম)")}

প্ৰশ্নমতে $\\angle B + \\angle C$ ৰ ঠাইত $\\angle A$ বহুৱাই পাওঁ:

$\\angle A + \\angle A = 180°$

$2\\angle A = 180° \\implies \\angle A = 90°$

গতিকে ত্ৰিভুজটোৰ এটা কোণ সমকোণ। ${B("ই সূক্ষ্মকোণী হ'ব নোৱাৰে (তাৰ বাবে তিনিওটা কোণেই 90° তকৈ সৰু হ'ব লাগে) আৰু স্থূলকোণীও হ'ব নোৱাৰে (তাৰ বাবে এটা কোণ 90° তকৈ ডাঙৰ হ'ব লাগে)।")}`,
      answerLabel: "এটা সমকোণী ত্ৰিভুজ",
    },
  },

  // ── Q5 ───────────────────────────────────────────────────────────────────
  {
    i: 4, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "x = (180 - x)/5 gives 5x = 180 - x, 6x = 180, x = 30; supplement 150 and 150/5 = 30 checks out.",
    enNeedle: "30°", asNeedle: "30°",
    en: {
      question: "An angle measures one-fifth of its own supplement. Find the angle.",
      options: ["15°", "30°", "75°", "150°"],
      given: "Let the angle be $x$. Its supplement is $(180° - x)$, and the question says $x = \\dfrac{1}{5}(180° - x)$.",
      work: `Multiply both sides by $5$:

$5x = 180° - x$

$5x + x = 180°$

$6x = 180° \\implies x = 30°$

${B("Check: the supplement is $180° - 30° = 150°$, and one-fifth of $150°$ is $30°$ — the condition holds. ($150°$ is offered as a distractor because it is the supplement, not the angle.)")}`,
      answerLabel: "the angle is $30°$",
    },
    as: {
      question: "এটা কোণৰ জোখ ইয়াৰ নিজৰ সম্পূৰক কোণৰ 1/5 ভাগৰ সমান। কোণটো নিৰ্ণয় কৰা।",
      options: ["15°", "30°", "75°", "150°"],
      given: "ধৰোঁ কোণটো $x$। ইয়াৰ সম্পূৰক কোণ $(180° - x)$, আৰু প্ৰশ্নমতে $x = \\dfrac{1}{5}(180° - x)$।",
      work: `দুয়োফালে $5$ ৰে পূৰণ কৰি:

$5x = 180° - x$

$5x + x = 180°$

$6x = 180° \\implies x = 30°$

${B("পৰীক্ষা: সম্পূৰক কোণটো $180° - 30° = 150°$, আৰু $150°$ ৰ 1/5 ভাগ হ'ল $30°$ — চৰ্তটো সিদ্ধ হৈছে। ($150°$ বিকল্পটো দিয়া হৈছে কাৰণ সেইটো সম্পূৰক কোণ, বিচৰা কোণটো নহয়।)")}`,
      answerLabel: "কোণটো $30°$",
    },
  },

  // ── Q6 ───────────────────────────────────────────────────────────────────
  {
    i: 5, difficulty: "easy", correctIndex: 2, printedKey: 2,
    warrant: "Vertically opposite angles are equal, so an angle a plus its vertically opposite angle a equals 2a — double the original.",
    enNeedle: "Double the measure of the original angle", asNeedle: "মূল কোণটোৰ জোখৰ দুগুণ",
    figure: "ss-mcq-q06-vertically-opposite-v2.png",
    en: {
      question: "An angle is added to the angle vertically opposite to it. The total is always:",
      options: ["Zero", "Thrice the measure of the original angle", "Double the measure of the original angle", "Equal to the measure of the original angle"],
      given: "In the figure the lines $AB$ and $CD$ cut each other at $O$; $\\angle 1$ and $\\angle 3$ are a pair of vertically opposite angles.",
      work: `$\\angle 1 = \\angle 3$ ${B("(if two lines intersect, the vertically opposite angles are equal — Theorem 6.1)")}

Write the original angle as $\\angle 1 = a$. Then its vertically opposite angle is also $a$, so their sum is

$a + a = 2a$

which is twice the original angle. ${B("In the drawn figure $\\angle 1 = \\angle 3 = 55°$, and $55° + 55° = 110° = 2 \\times 55°$.")}`,
      answerLabel: "double the measure of the original angle",
    },
    as: {
      question: "এটা কোণৰ লগত ইয়াৰ বিপ্ৰতীপ কোণটো যোগ কৰা হ'ল। যোগফলটো সদায় হ'ব-",
      options: ["শূন্য", "মূল কোণটোৰ জোখৰ তিনিগুণ", "মূল কোণটোৰ জোখৰ দুগুণ", "মূল কোণটোৰ জোখৰ সমান"],
      given: "চিত্ৰত $AB$ আৰু $CD$ ৰেখা দুডালে $O$ ত ইটোৱে সিটোক ছেদ কৰিছে; $\\angle 1$ আৰু $\\angle 3$ হৈছে এযোৰ বিপ্ৰতীপ কোণ।",
      work: `$\\angle 1 = \\angle 3$ ${B("(দুডাল ৰেখাই ইটোৱে সিটোক ছেদ কৰিলে বিপ্ৰতীপ কোণবোৰ সমান হয় — উপপাদ্য 6.1)")}

মূল কোণটো $\\angle 1 = a$ ধৰোঁ। তেন্তে ইয়াৰ বিপ্ৰতীপ কোণটোও $a$, গতিকে সিহঁতৰ যোগফল

$a + a = 2a$

অৰ্থাৎ মূল কোণটোৰ দুগুণ। ${B("অঁকা চিত্ৰখনত $\\angle 1 = \\angle 3 = 55°$, আৰু $55° + 55° = 110° = 2 \\times 55°$।")}`,
      answerLabel: "মূল কোণটোৰ জোখৰ দুগুণ",
    },
  },

  // ── Q7 ───────────────────────────────────────────────────────────────────
  {
    i: 6, difficulty: "easy", correctIndex: 3, printedKey: 3,
    warrant: "Corresponding angles axiom: a transversal cutting two parallel lines makes each pair of corresponding angles equal. Of the four options only 'corresponding' names an angle pair formed by a transversal.",
    enNeedle: "Corresponding", asNeedle: "অনুৰূপ",
    figure: "ss-mcq-q07-corresponding-angles-v2.png",
    en: {
      question: "Fill in the blank: when a transversal cuts a pair of parallel lines, every pair of ______ angles that it forms is congruent.",
      options: ["Equal", "Complementary", "Supplementary", "Corresponding"],
      given: "In the figure the parallel lines $l$ and $m$ are cut by the transversal $t$ at $B$ and $C$; $x$ and $y$ are the two marked angles.",
      work: `$x$ and $y$ sit in matching positions at the two crossings — each is above its own line and on the same side of the transversal — so $x$ and $y$ form a pair of corresponding angles.

$x = y$ ${B("(corresponding angles axiom: if a transversal cuts two parallel lines, then each pair of corresponding angles is equal)")}

In the drawn figure $x = y = 66°$. The blank has to be filled with the *name of an angle pair*, and of the four choices only \"corresponding\" names a pair produced by a transversal.`,
      answerLabel: "corresponding angles",
      note: "In the printed source the blank has been left already filled in (\"the pairs of corresponding angles are congruent\") while the four options are still offered, which makes the printed stem impossible to answer. It is restored here as the fill-in-the-blank it was meant to be; the answer key, option (d), is unchanged. Alternate interior angles are congruent as well, but \"alternate\" is not one of the options.",
    },
    as: {
      question: "খালী ঠাই পূৰণ কৰা: এডাল ছেদকে এযোৰ সমান্তৰাল ৰেখা ছেদ কৰিলে ই গঠন কৰা প্ৰতিযোৰ ______ কোণ সমান হয়।",
      options: ["সমান", "পূৰক", "সম্পূৰক", "অনুৰূপ"],
      given: "চিত্ৰত $l$ আৰু $m$ সমান্তৰাল ৰেখা দুডালক ছেদক $t$ য়ে $B$ আৰু $C$ ত ছেদ কৰিছে; $x$ আৰু $y$ হৈছে চিহ্নিত কৰা কোণ দুটা।",
      work: `$x$ আৰু $y$ দুয়োটা ছেদবিন্দুত একেই ধৰণৰ স্থানত আছে — প্ৰতিটোৱেই নিজৰ ৰেখাডালৰ ওপৰফালে আৰু ছেদকৰ একেফালে — গতিকে $x$ আৰু $y$ এযোৰ অনুৰূপ কোণ।

$x = y$ ${B("(অনুৰূপ কোণ স্বীকাৰ্য: এডাল ছেদকে দুডাল সমান্তৰাল ৰেখা ছেদ কৰিলে প্ৰতিযোৰ অনুৰূপ কোণ সমান হয়)")}

অঁকা চিত্ৰখনত $x = y = 66°$। খালী ঠাইখিনিত এযোৰ কোণৰ *নাম* বহিব লাগে, আৰু চাৰিটা বিকল্পৰ ভিতৰত কেৱল \"অনুৰূপ\" শব্দটোৱেহে ছেদকে গঠন কৰা এযোৰ কোণৰ নাম বুজায়।`,
      answerLabel: "অনুৰূপ কোণ",
      note: "মূল প্ৰশ্নকাকতত খালী ঠাইখিনি আগতেই পূৰণ কৰি থোৱা হৈছে (\"অনুৰূপ কোণৰ যোৰবোৰ সমান\") অথচ চাৰিটা বিকল্পও দিয়া আছে, যাৰ ফলত ছপা হোৱা প্ৰশ্নটোৰ উত্তৰ দিয়াই সম্ভৱ নহয়। ইয়াত ইয়াক পুনৰ খালী-ঠাই-পূৰণ প্ৰশ্ন হিচাপে দিয়া হৈছে; উত্তৰ বিকল্প (d) অপৰিৱৰ্তিত। একান্তৰ অন্তঃকোণবোৰো সমান হয়, কিন্তু \"একান্তৰ\" বিকল্পবোৰৰ ভিতৰত নাই।",
    },
  },

  // ── Q8 ───────────────────────────────────────────────────────────────────
  {
    i: 7, difficulty: "hard", correctIndex: 1, printedKey: 1,
    warrant: "Each base angle is 50°, so each half is 25°; in triangle OBC the angle sum gives BOC = 180° - 25° - 25° = 130°.",
    enNeedle: "130°", asNeedle: "130°",
    figure: "ss-mcq-q08-base-bisectors-v2.png",
    en: {
      question: "In an isosceles triangle ABC with AB = AC, the bisectors of the two base angles meet at O. If ∠B = ∠C = 50°, what is ∠BOC?",
      options: ["120°", "130°", "80°", "150°"],
      given: "$\\triangle ABC$ with $AB = AC$ and $\\angle B = \\angle C = 50°$. $BO$ bisects $\\angle B$, $CO$ bisects $\\angle C$, and the two bisectors meet at $O$.",
      work: `$\\angle OBC = \\dfrac{1}{2}\\angle B = \\dfrac{50°}{2} = 25°$ ${B("(BO is the bisector of ∠B)")}

$\\angle OCB = \\dfrac{1}{2}\\angle C = \\dfrac{50°}{2} = 25°$ ${B("(CO is the bisector of ∠C)")}

Now work inside $\\triangle OBC$:

$\\angle BOC + \\angle OBC + \\angle OCB = 180°$ ${B("(angle sum property of a triangle)")}

$\\angle BOC + 25° + 25° = 180°$

$\\angle BOC = 180° - 50° = 130°$

${B("Note the shortcut this illustrates: $\\angle BOC = 90° + \\dfrac{1}{2}\\angle A$, and here $\\angle A = 180° - 50° - 50° = 80°$, giving $90° + 40° = 130°$.")}`,
      answerLabel: "$\\angle BOC = 130°$",
    },
    as: {
      question: "AB = AC থকা এটা সমদ্বিবাহু ত্ৰিভুজ ABC ৰ ভূমিৰ কোণ দুটাৰ সমদ্বিখণ্ডক O ত লগ লাগিছে। যদি ∠B = ∠C = 50°, তেন্তে ∠BOC কিমান?",
      options: ["120°", "130°", "80°", "150°"],
      given: "$\\triangle ABC$ ত $AB = AC$ আৰু $\\angle B = \\angle C = 50°$। $BO$ এ $\\angle B$ ক আৰু $CO$ এ $\\angle C$ ক সমদ্বিখণ্ডিত কৰে, আৰু সমদ্বিখণ্ডক দুডাল $O$ ত লগ লাগে।",
      work: `$\\angle OBC = \\dfrac{1}{2}\\angle B = \\dfrac{50°}{2} = 25°$ ${B("(BO হৈছে ∠B ৰ সমদ্বিখণ্ডক)")}

$\\angle OCB = \\dfrac{1}{2}\\angle C = \\dfrac{50°}{2} = 25°$ ${B("(CO হৈছে ∠C ৰ সমদ্বিখণ্ডক)")}

এতিয়া $\\triangle OBC$ ৰ ভিতৰত কাম কৰোঁ:

$\\angle BOC + \\angle OBC + \\angle OCB = 180°$ ${B("(ত্ৰিভুজৰ কোণৰ সমষ্টি ধৰ্ম)")}

$\\angle BOC + 25° + 25° = 180°$

$\\angle BOC = 180° - 50° = 130°$

${B("ইয়াত দেখুওৱা চমু নিয়মটো মন কৰা: $\\angle BOC = 90° + \\dfrac{1}{2}\\angle A$, আৰু ইয়াত $\\angle A = 180° - 50° - 50° = 80°$, গতিকে $90° + 40° = 130°$।")}`,
      answerLabel: "$\\angle BOC = 130°$",
    },
  },

  // ── Q9 ───────────────────────────────────────────────────────────────────
  {
    i: 8, difficulty: "moderate", correctIndex: 2, printedKey: 2,
    warrant: "2k + 3k + 4k = 180° gives k = 20°, so the angles in order are 40°, 60°, 80°.",
    enNeedle: "40°, 60°, 80°", asNeedle: "40°, 60°, 80°",
    figure: "ss-mcq-q09-ratio-triangle-v2.png",
    en: {
      question: "The three angles of a triangle are in the ratio 2 : 3 : 4. Listed in that same order, the angles are:",
      options: ["80°, 40°, 60°", "20°, 60°, 80°", "40°, 60°, 80°", "60°, 40°, 80°"],
      given: "The three angles are in the ratio $2 : 3 : 4$, so write them as $2k$, $3k$ and $4k$.",
      work: `$2k + 3k + 4k = 180°$ ${B("(angle sum property of a triangle)")}

$9k = 180° \\implies k = 20°$

$2k = 2 \\times 20° = 40°$

$3k = 3 \\times 20° = 60°$

$4k = 4 \\times 20° = 80°$

${B("Check both conditions: $40° + 60° + 80° = 180°$, and $40 : 60 : 80 = 2 : 3 : 4$. Option (a) and option (d) hold the same three numbers but not in the order asked for, and option (b) does not even add up to $180°$.")}`,
      answerLabel: "$40°$, $60°$, $80°$",
    },
    as: {
      question: "এটা ত্ৰিভুজৰ তিনিটা কোণ 2 : 3 : 4 অনুপাতত আছে। একেই ক্ৰমত লিখিলে কোণকেইটা হ'ব-",
      options: ["80°, 40°, 60°", "20°, 60°, 80°", "40°, 60°, 80°", "60°, 40°, 80°"],
      given: "তিনিটা কোণ $2 : 3 : 4$ অনুপাতত আছে, গতিকে সিহঁতক $2k$, $3k$ আৰু $4k$ বুলি লিখোঁ।",
      work: `$2k + 3k + 4k = 180°$ ${B("(ত্ৰিভুজৰ কোণৰ সমষ্টি ধৰ্ম)")}

$9k = 180° \\implies k = 20°$

$2k = 2 \\times 20° = 40°$

$3k = 3 \\times 20° = 60°$

$4k = 4 \\times 20° = 80°$

${B("দুয়োটা চৰ্তেই পৰীক্ষা কৰা: $40° + 60° + 80° = 180°$, আৰু $40 : 60 : 80 = 2 : 3 : 4$। বিকল্প (a) আৰু (d) ত একেকেইটা সংখ্যাই আছে, কিন্তু বিচৰা ক্ৰমত নাই; বিকল্প (b) ৰ যোগফলেই $180°$ নহয়।")}`,
      answerLabel: "$40°$, $60°$, $80°$",
    },
  },

  // ── Q10 ──────────────────────────────────────────────────────────────────
  {
    i: 9, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "By definition an acute angle measures strictly between 0° and 90°.",
    enNeedle: "Less than 90 degrees", asNeedle: "90 ডিগ্ৰীতকৈ কম",
    en: {
      question: "An acute angle is one whose measure is:",
      options: ["More than 90 degrees", "Less than 90 degrees", "Equal to 90 degrees", "Equal to 180 degrees"],
      given: "The standard classification of angles by their size.",
      work: `An angle smaller than a right angle is called acute — that is, its measure $\\theta$ satisfies

$$0° < \\theta < 90°$$

${B("For comparison: exactly $90°$ is a right angle, between $90°$ and $180°$ is an obtuse angle, exactly $180°$ is a straight angle, and between $180°$ and $360°$ is a reflex angle. Each of the three wrong options names one of these other kinds.")}`,
      answerLabel: "less than 90 degrees",
    },
    as: {
      question: "সূক্ষ্মকোণ হৈছে এনে এটা কোণ, যাৰ জোখ-",
      options: ["90 ডিগ্ৰীতকৈ বেছি", "90 ডিগ্ৰীতকৈ কম", "90 ডিগ্ৰীৰ সমান", "180 ডিগ্ৰীৰ সমান"],
      given: "কোণৰ জোখ অনুসৰি কৰা সাধাৰণ শ্ৰেণীবিভাজন।",
      work: `সমকোণতকৈ সৰু কোণক সূক্ষ্মকোণ বোলে — অৰ্থাৎ ইয়াৰ জোখ $\\theta$ এ সিদ্ধ কৰে

$$0° < \\theta < 90°$$

${B("তুলনাৰ বাবে: ঠিক $90°$ হ'লে সমকোণ, $90°$ আৰু $180°$ ৰ মাজত হ'লে স্থূলকোণ, ঠিক $180°$ হ'লে সৰলকোণ, আৰু $180°$ আৰু $360°$ ৰ মাজত হ'লে প্ৰবৃদ্ধ কোণ। ভুল বিকল্প তিনিটাই এইবোৰৰে এটা এটা কোণৰ কথা কৈছে।")}`,
      answerLabel: "90 ডিগ্ৰীতকৈ কম",
    },
  },

  // ── Q11 ──────────────────────────────────────────────────────────────────
  {
    i: 10, difficulty: "easy", correctIndex: 3, printedKey: 3,
    warrant: "Parallel lines are coplanar lines with no point in common, so the set of intersection points is empty (the source writes this as 'Null').",
    enNeedle: "Null — they do not intersect at all", asNeedle: "শূন্য — সিহঁতে ছেদেই নকৰে",
    figure: "ss-mcq-q11-parallel-no-common-v2.png",
    en: {
      question: "At how many points do two parallel lines intersect?",
      options: ["One point", "Two points", "Three points", "Null — they do not intersect at all"],
      given: "Two lines $l$ and $m$ drawn in one plane that never meet, however far they are produced.",
      work: `By definition, two lines lying in the same plane are parallel exactly when they have no point in common.

A point of intersection would be a common point, and parallel lines have none — so the set of their intersection points is empty.

${B("The source writes this answer as \"Null\", meaning the null (empty) set of intersection points. In the figure the gap between $l$ and $m$ stays the same all along, which is why they never close on each other.")}`,
      answerLabel: "Null — there is no point of intersection at all",
    },
    as: {
      question: "দুডাল সমান্তৰাল ৰেখাই কিমানটা বিন্দুত ইটোৱে সিটোক ছেদ কৰে?",
      options: ["এটা বিন্দুত", "দুটা বিন্দুত", "তিনিটা বিন্দুত", "শূন্য — সিহঁতে ছেদেই নকৰে"],
      given: "একেখন সমতলত অঁকা $l$ আৰু $m$ ৰেখা দুডাল, যিমানেই বঢ়োৱা নহওক কিয় সিহঁতে কেতিয়াও লগ নাপায়।",
      work: `সংজ্ঞা অনুসৰি, একেখন সমতলত থকা দুডাল ৰেখা ঠিক তেতিয়াহে সমান্তৰাল হয় যেতিয়া সিহঁতৰ কোনো সাধাৰণ বিন্দু নাথাকে।

ছেদবিন্দু এটা থাকিলে সেয়া এটা সাধাৰণ বিন্দু হ'লহেঁতেন, কিন্তু সমান্তৰাল ৰেখাৰ তেনে বিন্দু নাথাকে — গতিকে সিহঁতৰ ছেদবিন্দুৰ সংখ্যা শূন্য।

${B("মূল উৎসত এই উত্তৰটো \"Null\" বুলি লিখা হৈছে, অৰ্থাৎ ছেদবিন্দুৰ শূন্য (ৰিক্ত) সংগ্ৰহ। চিত্ৰত $l$ আৰু $m$ ৰ মাজৰ ব্যৱধান সৰ্বত্ৰেই একে থাকে, সেইবাবেই সিহঁতে কেতিয়াও ওচৰ চাপি নাহে।")}`,
      answerLabel: "শূন্য — ছেদবিন্দু একেবাৰেই নাই",
    },
  },

  // ── Q12 ──────────────────────────────────────────────────────────────────
  {
    i: 11, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "If a + b = 180° then the angle between the bisectors is a/2 + b/2 = (a+b)/2 = 90°, a right angle.",
    enNeedle: "A right angle", asNeedle: "এটা সমকোণ",
    figure: "ss-mcq-q12-adjacent-bisectors-v2.png",
    en: {
      question: "Two adjacent angles are supplementary. The angle contained between their bisectors is:",
      options: ["An acute angle", "A right angle", "An obtuse angle", "None of these"],
      given: "In the figure $XOY$ is a line and ray $OZ$ stands on it, so $\\angle YOZ$ and $\\angle ZOX$ are adjacent supplementary angles. Ray $OP$ bisects $\\angle YOZ$ and ray $OQ$ bisects $\\angle ZOX$.",
      work: `Write $\\angle YOZ = a$ and $\\angle ZOX = b$. Then

$a + b = 180°$ ${B("(the two angles form a linear pair)")}

$\\angle POZ = \\dfrac{a}{2}$ and $\\angle ZOQ = \\dfrac{b}{2}$ ${B("(OP and OQ are the two bisectors)")}

Ray $OZ$ lies between $OP$ and $OQ$, so the angle between the bisectors is

$\\angle POQ = \\angle POZ + \\angle ZOQ = \\dfrac{a}{2} + \\dfrac{b}{2} = \\dfrac{a + b}{2} = \\dfrac{180°}{2} = 90°$

${B("Notice this comes out the same whatever $a$ and $b$ are, as long as they add to $180°$ — the answer never depends on where $OZ$ is drawn.")}`,
      answerLabel: "a right angle ($90°$)",
    },
    as: {
      question: "দুটা সন্নিহিত কোণ সম্পূৰক। সিহঁতৰ সমদ্বিখণ্ডক দুডালৰ মাজত থকা কোণটো হ'ল-",
      options: ["এটা সূক্ষ্মকোণ", "এটা সমকোণ", "এটা স্থূলকোণ", "এটাও নহয়"],
      given: "চিত্ৰত $XOY$ এডাল ৰেখা আৰু ৰশ্মি $OZ$ ইয়াৰ ওপৰত থিয় হৈছে, গতিকে $\\angle YOZ$ আৰু $\\angle ZOX$ সন্নিহিত সম্পূৰক কোণ। ৰশ্মি $OP$ এ $\\angle YOZ$ ক আৰু ৰশ্মি $OQ$ এ $\\angle ZOX$ ক সমদ্বিখণ্ডিত কৰে।",
      work: `ধৰোঁ $\\angle YOZ = a$ আৰু $\\angle ZOX = b$। তেন্তে

$a + b = 180°$ ${B("(কোণ দুটাই এটা ৰৈখিক যোৰ গঠন কৰে)")}

$\\angle POZ = \\dfrac{a}{2}$ আৰু $\\angle ZOQ = \\dfrac{b}{2}$ ${B("(OP আৰু OQ হৈছে সমদ্বিখণ্ডক দুডাল)")}

ৰশ্মি $OZ$ এ $OP$ আৰু $OQ$ ৰ মাজত পৰে, গতিকে সমদ্বিখণ্ডক দুডালৰ মাজৰ কোণটো

$\\angle POQ = \\angle POZ + \\angle ZOQ = \\dfrac{a}{2} + \\dfrac{b}{2} = \\dfrac{a + b}{2} = \\dfrac{180°}{2} = 90°$

${B("মন কৰা, $a$ আৰু $b$ যিয়েই নহওক কিয়, যিমান দিনে সিহঁতৰ যোগফল $180°$ হয়, উত্তৰটো একেই ওলায় — $OZ$ ক'ত আঁকিলে তাৰ ওপৰত উত্তৰ নিৰ্ভৰ নকৰে।")}`,
      answerLabel: "এটা সমকোণ ($90°$)",
    },
  },

  // ── Q13 ──────────────────────────────────────────────────────────────────
  {
    i: 12, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "Infinitely many lines pass through a single given point; uniqueness needs two points (Euclid's first postulate). The other three statements are true.",
    enNeedle: "Through a given point only one straight line can be drawn.",
    asNeedle: "এটা নিৰ্দিষ্ট বিন্দুৰ মাজেৰে কেৱল এডালহে সৰলৰেখা আঁকিব পাৰি।",
    en: {
      question: "Which one of these statements is NOT true?",
      options: [
        "A line can be produced to any length we wish.",
        "Through a given point only one straight line can be drawn.",
        "Through two given points one and only one straight line can be drawn.",
        "Two straight lines can cut each other at only one point.",
      ],
      given: "Four statements about lines are offered; exactly one of them is false.",
      work: `**(a)** True — a line has no end points, so it can be produced indefinitely in either direction.

**(b)** ${G("False")} — through a single given point you can draw endlessly many straight lines, one in every possible direction. ${B("Only once a second point is fixed does the line become unique.")}

**(c)** True — this is Euclid's first postulate: through two distinct points there passes exactly one line.

**(d)** True — two distinct straight lines that meet at all can share only one point; if they shared two points they would be the same line.`,
      answerLabel: "\"Through a given point only one straight line can be drawn\" — this is the false statement",
    },
    as: {
      question: "তলৰ কোনটো উক্তি সত্য নহয়?",
      options: [
        "এডাল ৰেখাক ইচ্ছামতে যিকোনো দৈৰ্ঘ্যলৈ বঢ়াব পাৰি।",
        "এটা নিৰ্দিষ্ট বিন্দুৰ মাজেৰে কেৱল এডালহে সৰলৰেখা আঁকিব পাৰি।",
        "দুটা নিৰ্দিষ্ট বিন্দুৰ মাজেৰে কেৱল এডালহে সৰলৰেখা আঁকিব পাৰি।",
        "দুডাল সৰলৰেখাই কেৱল এটা বিন্দুতহে ইটোৱে সিটোক ছেদ কৰিব পাৰে।",
      ],
      given: "ৰেখাৰ বিষয়ে চাৰিটা উক্তি দিয়া হৈছে; ইয়াৰে ঠিক এটা উক্তি অসত্য।",
      work: `**(a)** সত্য — ৰেখাৰ কোনো অন্তবিন্দু নাথাকে, গতিকে ইয়াক দুয়োফালে অসীমলৈকে বঢ়াব পাৰি।

**(b)** ${G("অসত্য")} — এটা মাত্ৰ নিৰ্দিষ্ট বিন্দুৰ মাজেৰে অসংখ্য সৰলৰেখা আঁকিব পাৰি, প্ৰতিটো সম্ভৱ দিশত এডালকৈ। ${B("দ্বিতীয় এটা বিন্দু নিৰ্ধাৰণ কৰিলেহে ৰেখাডাল অদ্বিতীয় হয়।")}

**(c)** সত্য — এইটোৱেই ইউক্লিডৰ প্ৰথম স্বীকাৰ্য: দুটা পৃথক বিন্দুৰ মাজেৰে ঠিক এডালহে ৰেখা যায়।

**(d)** সত্য — লগ পোৱা দুডাল পৃথক সৰলৰেখাৰ কেৱল এটাহে সাধাৰণ বিন্দু থাকিব পাৰে; দুটা সাধাৰণ বিন্দু থাকিলে সিহঁত একেডাল ৰেখাই হ'লহেঁতেন।`,
      answerLabel: "\"এটা নিৰ্দিষ্ট বিন্দুৰ মাজেৰে কেৱল এডালহে সৰলৰেখা আঁকিব পাৰি\" — এইটোৱেই অসত্য উক্তি",
    },
  },

  // ── Q14 ──────────────────────────────────────────────────────────────────
  {
    i: 13, difficulty: "easy", correctIndex: 2, printedKey: 2,
    warrant: "Parallel lines never meet, so they share no point at all — the number of common points is 0.",
    enNeedle: "No common point", asNeedle: "এটাও সাধাৰণ বিন্দু নাথাকে",
    figure: "ss-mcq-q11-parallel-no-common-v2.png",
    en: {
      question: "How many points do two parallel lines have in common?",
      options: ["One common point", "Two common points", "No common point", "Infinitely many common points"],
      given: "Two parallel lines $l$ and $m$ drawn in one plane.",
      work: `Parallel lines are coplanar lines that never meet, however far they are produced ${B("(this is the definition of parallel lines)")}.

A common point of the two lines would be a point where they meet — and parallel lines have no such point.

So the number of common points is $0$.

${B("If two distinct lines did share even one point they would be intersecting lines, not parallel; and if they shared two points they would be the very same line.")}`,
      answerLabel: "no common point at all",
    },
    as: {
      question: "দুডাল সমান্তৰাল ৰেখাৰ কিমানটা সাধাৰণ বিন্দু থাকে?",
      options: ["এটা সাধাৰণ বিন্দু", "দুটা সাধাৰণ বিন্দু", "এটাও সাধাৰণ বিন্দু নাথাকে", "অসংখ্য সাধাৰণ বিন্দু"],
      given: "একেখন সমতলত অঁকা $l$ আৰু $m$ সমান্তৰাল ৰেখা দুডাল।",
      work: `সমান্তৰাল ৰেখা হৈছে একেখন সমতলত থকা এনে ৰেখা, যিমানেই বঢ়োৱা নহওক কিয় যিয়ে কেতিয়াও লগ নাপায় ${B("(এইটোৱেই সমান্তৰাল ৰেখাৰ সংজ্ঞা)")}।

ৰেখা দুডালৰ সাধাৰণ বিন্দু এটা থাকিলে সেয়া সিহঁতে লগ পোৱা বিন্দু হ'লহেঁতেন — কিন্তু সমান্তৰাল ৰেখাৰ তেনে বিন্দু নাথাকে।

গতিকে সাধাৰণ বিন্দুৰ সংখ্যা $0$।

${B("দুডাল পৃথক ৰেখাৰ এটাও সাধাৰণ বিন্দু থাকিলে সিহঁত ছেদক ৰেখা হ'লহেঁতেন, সমান্তৰাল নহয়; আৰু দুটা সাধাৰণ বিন্দু থাকিলে সিহঁত একেডাল ৰেখাই হ'লহেঁতেন।")}`,
      answerLabel: "এটাও সাধাৰণ বিন্দু নাথাকে",
    },
  },

  // ── Q15 ──────────────────────────────────────────────────────────────────
  {
    i: 14, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Exterior angle property (Theorem 6.8): the exterior angle equals the sum of the two interior opposite angles.",
    enNeedle: "Two", asNeedle: "দুই",
    figure: "ss-mcq-q15-exterior-angle-v2.png",
    en: {
      question: "When one side of a triangle is produced, the exterior angle so formed equals the sum of the ______ interior opposite angles.",
      options: ["Two", "Four", "One", "Three"],
      given: "In the figure, side $BC$ of $\\triangle ABC$ is produced to $D$; $\\angle 3 = \\angle ACD$ is the exterior angle so formed, and $\\angle 1$, $\\angle 2$ are the interior angles at $A$ and $B$.",
      work: `$\\angle 1 + \\angle 2 + \\angle ACB = 180°$ ${B("(angle sum property of $\\triangle ABC$)")}

$\\angle 3 + \\angle ACB = 180°$ ${B("(linear pair, since $BCD$ is a straight line)")}

The right-hand sides are equal, so the left-hand sides are equal:

$\\angle 3 + \\angle ACB = \\angle 1 + \\angle 2 + \\angle ACB$

$\\angle 3 = \\angle 1 + \\angle 2$

So the exterior angle equals the sum of the **two** interior opposite angles ${B("(exterior angle property, Theorem 6.8)")}. A triangle has three interior angles; one of them is adjacent to the exterior angle, which leaves exactly two opposite ones.`,
      answerLabel: "two",
    },
    as: {
      question: "এটা ত্ৰিভুজৰ এটা বাহু বঢ়ালে গঠিত বহিঃকোণটো ______ টা সন্নিহিত নথকা অন্তঃকোণৰ যোগফলৰ সমান হয়।",
      options: ["দুই", "চাৰি", "এক", "তিনি"],
      given: "চিত্ৰত $\\triangle ABC$ ৰ $BC$ বাহুক $D$ লৈ বঢ়োৱা হৈছে; এইদৰে গঠিত বহিঃকোণটো $\\angle 3 = \\angle ACD$, আৰু $\\angle 1$, $\\angle 2$ হৈছে $A$ আৰু $B$ ত থকা অন্তঃকোণ।",
      work: `$\\angle 1 + \\angle 2 + \\angle ACB = 180°$ ${B("($\\triangle ABC$ ৰ কোণৰ সমষ্টি ধৰ্ম)")}

$\\angle 3 + \\angle ACB = 180°$ ${B("(ৰৈখিক যোৰ, যিহেতু $BCD$ এডাল সৰলৰেখা)")}

সোঁফালৰ ৰাশি দুটা সমান, গতিকে বাওঁফালৰ ৰাশি দুটাও সমান:

$\\angle 3 + \\angle ACB = \\angle 1 + \\angle 2 + \\angle ACB$

$\\angle 3 = \\angle 1 + \\angle 2$

গতিকে বহিঃকোণটো **দুই**টা সন্নিহিত নথকা অন্তঃকোণৰ যোগফলৰ সমান ${B("(বহিঃকোণ ধৰ্ম, উপপাদ্য 6.8)")}। ত্ৰিভুজ এটাৰ তিনিটা অন্তঃকোণ থাকে; তাৰে এটা বহিঃকোণটোৰ সন্নিহিত, গতিকে বাকী থাকে ঠিক দুটা বিপৰীত অন্তঃকোণ।`,
      answerLabel: "দুই",
    },
  },

  // ── Q16 ──────────────────────────────────────────────────────────────────
  {
    i: 15, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "Both lines make a 90° corresponding angle with the transversal l; equal corresponding angles force the two lines to be parallel (converse of the corresponding angles axiom).",
    enNeedle: "Parallel to each other", asNeedle: "পৰস্পৰ সমান্তৰাল",
    figure: "ss-mcq-q16-perp-same-line-v2.png",
    en: {
      question: "Two straight lines are each drawn perpendicular to the same line l. These two lines are then:",
      options: ["Lines that meet each other when extended", "Parallel to each other", "Lines with 180° between them", "Perpendicular to each other"],
      given: "In the figure, $m \\perp l$ and $n \\perp l$, and $m$, $n$ are distinct lines.",
      work: `Treat $l$ as a transversal cutting the two lines $m$ and $n$.

The angle $m$ makes with $l$ is $90°$, and the angle $n$ makes with $l$ is $90°$ as well. These two angles sit in matching positions at the two crossings, so they are a pair of corresponding angles — and they are equal.

$m \\parallel n$ ${B("(converse of the corresponding angles axiom: if a transversal makes a pair of equal corresponding angles with two lines, then those lines are parallel)")}

${B("The same conclusion follows from Theorem 6.6 as well: lines parallel to the same line are parallel to one another, and the perpendicular direction to $l$ is a single fixed direction.")}`,
      answerLabel: "parallel to each other",
    },
    as: {
      question: "দুডাল সৰলৰেখা একেডাল ৰেখা l ৰ ওপৰত লম্বকৈ অঁকা হৈছে। তেন্তে ৰেখা দুডাল হ'ব-",
      options: ["বঢ়ালে ইটোৱে সিটোক লগ পোৱা ৰেখা", "পৰস্পৰ সমান্তৰাল", "মাজত 180° কোণ থকা ৰেখা", "পৰস্পৰ লম্ব"],
      given: "চিত্ৰত $m \\perp l$ আৰু $n \\perp l$, আৰু $m$, $n$ পৃথক ৰেখা।",
      work: `$l$ ক $m$ আৰু $n$ ৰেখা দুডালৰ ছেদক হিচাপে ধৰা যাওক।

$m$ এ $l$ ৰ সৈতে গঠন কৰা কোণটো $90°$, আৰু $n$ এ $l$ ৰ সৈতে গঠন কৰা কোণটোও $90°$। এই কোণ দুটা দুয়োটা ছেদবিন্দুত একেই ধৰণৰ স্থানত আছে, গতিকে সিহঁত এযোৰ অনুৰূপ কোণ — আৰু সিহঁত সমান।

$m \\parallel n$ ${B("(অনুৰূপ কোণ স্বীকাৰ্যৰ বিপৰীত: এডাল ছেদকে দুডাল ৰেখাৰ সৈতে এযোৰ সমান অনুৰূপ কোণ গঠন কৰিলে সেই ৰেখা দুডাল সমান্তৰাল হয়)")}

${B("উপপাদ্য 6.6 ৰ পৰাও একেই সিদ্ধান্ত পোৱা যায়: একেডাল ৰেখাৰ সমান্তৰাল ৰেখাবোৰ পৰস্পৰ সমান্তৰাল, আৰু $l$ ৰ লম্ব দিশটো এটাই নিৰ্দিষ্ট দিশ।")}`,
      answerLabel: "পৰস্পৰ সমান্তৰাল",
    },
  },

  // ── Q17 ──────────────────────────────────────────────────────────────────
  {
    i: 16, difficulty: "hard", correctIndex: 1, printedKey: 1,
    warrant: "Linear pair gives a = 180 - b; substituting in 2a - 3b = 60 gives 360 - 5b = 60, so 5b = 300 (b = 60, a = 120, and 2(120) - 3(60) = 60 checks).",
    enNeedle: "300°", asNeedle: "300°",
    figure: "ss-mcq-q17-linear-pair-v2.png",
    en: {
      question: "Two angles measuring a and b form a linear pair and satisfy 2a - 3b = 60°. What is the value of 5b?",
      options: ["120°", "300°", "60°", "None of these"],
      given: "$a$ and $b$ form a linear pair, so $a + b = 180°$; and $2a - 3b = 60°$.",
      work: `From the linear pair, $a = 180° - b$.

Substitute this into the second condition:

$2(180° - b) - 3b = 60°$

$360° - 2b - 3b = 60°$

$360° - 5b = 60°$

$5b = 360° - 60°$

$5b = 300°$

${B("The question asks for $5b$, not for $b$ — so stop here. If you do want the angles: $b = 60°$ and $a = 180° - 60° = 120°$, and indeed $2(120°) - 3(60°) = 240° - 180° = 60°$. Option (a) $120°$ is the value of $a$ and option (c) $60°$ is the value of $b$, both offered as traps.")}`,
      answerLabel: "$5b = 300°$",
    },
    as: {
      question: "a আৰু b জোখৰ দুটা কোণে এটা ৰৈখিক যোৰ গঠন কৰে আৰু 2a - 3b = 60° সিদ্ধ কৰে। 5b ৰ মান কিমান?",
      options: ["120°", "300°", "60°", "এটাও নহয়"],
      given: "$a$ আৰু $b$ য়ে এটা ৰৈখিক যোৰ গঠন কৰে, গতিকে $a + b = 180°$; আৰু $2a - 3b = 60°$।",
      work: `ৰৈখিক যোৰৰ পৰা, $a = 180° - b$।

ইয়াক দ্বিতীয় চৰ্তটোত প্ৰতিস্থাপন কৰি:

$2(180° - b) - 3b = 60°$

$360° - 2b - 3b = 60°$

$360° - 5b = 60°$

$5b = 360° - 60°$

$5b = 300°$

${B("প্ৰশ্নত $b$ নহয়, $5b$ বিচৰা হৈছে — গতিকে ইয়াতেই ৰ'ব লাগে। কোণ দুটা লাগিলে: $b = 60°$ আৰু $a = 180° - 60° = 120°$, আৰু সঁচাকৈয়ে $2(120°) - 3(60°) = 240° - 180° = 60°$। বিকল্প (a) $120°$ হৈছে $a$ ৰ মান আৰু বিকল্প (c) $60°$ হৈছে $b$ ৰ মান — দুয়োটাই ফান্দ হিচাপে দিয়া হৈছে।")}`,
      answerLabel: "$5b = 300°$",
    },
  },

  // ── Q18 ──────────────────────────────────────────────────────────────────
  {
    i: 17, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "x = (90 - x) + 14 gives 2x = 104, x = 52; its complement 38 differs from it by exactly 14.",
    enNeedle: "52°", asNeedle: "52°",
    en: {
      question: "An angle is 14° larger than its own complement. The angle is:",
      options: ["38°", "52°", "50°", "None of these"],
      given: "Let the angle be $x$. Its complement is $(90° - x)$, and the question says $x = (90° - x) + 14°$.",
      work: `$x = 90° - x + 14°$

$x = 104° - x$

$x + x = 104°$

$2x = 104° \\implies x = 52°$

${B("Check: the complement is $90° - 52° = 38°$, and $52° - 38° = 14°$ exactly as required. Option (a) $38°$ is that complement, offered as a trap.")}`,
      answerLabel: "the angle is $52°$",
    },
    as: {
      question: "এটা কোণ ইয়াৰ নিজৰ পূৰক কোণতকৈ 14° ডাঙৰ। কোণটো হ'ল-",
      options: ["38°", "52°", "50°", "এটাও নহয়"],
      given: "ধৰোঁ কোণটো $x$। ইয়াৰ পূৰক কোণ $(90° - x)$, আৰু প্ৰশ্নমতে $x = (90° - x) + 14°$।",
      work: `$x = 90° - x + 14°$

$x = 104° - x$

$x + x = 104°$

$2x = 104° \\implies x = 52°$

${B("পৰীক্ষা: পূৰক কোণটো $90° - 52° = 38°$, আৰু $52° - 38° = 14°$ — ঠিক যিদৰে বিচৰা হৈছিল। বিকল্প (a) $38°$ হৈছে সেই পূৰক কোণটোৱেই, ফান্দ হিচাপে দিয়া হৈছে।")}`,
      answerLabel: "কোণটো $52°$",
    },
  },

  // ── Q19 ──────────────────────────────────────────────────────────────────
  {
    i: 18, difficulty: "easy", correctIndex: 2, printedKey: 2,
    warrant: "Being its own complement means x + x = 90°, so x = 45°.",
    enNeedle: "45°", asNeedle: "45°",
    en: {
      question: "Which angle is its own complement?",
      options: ["30°", "90°", "45°", "180°"],
      given: "Let the required angle be $x$. Saying it is its own complement means $x$ and $x$ are complementary.",
      work: `Two angles are complementary when they add up to $90°$ ${B("(definition of complementary angles)")}.

$x + x = 90°$

$2x = 90° \\implies x = 45°$

${B("So $45°$ is the only angle equal to its own complement — the complement of $45°$ is $90° - 45° = 45°$ again. (Similarly, $90°$ is the only angle equal to its own supplement.)")}`,
      answerLabel: "$45°$",
    },
    as: {
      question: "কোনটো কোণ ইয়াৰ নিজৰেই পূৰক কোণ?",
      options: ["30°", "90°", "45°", "180°"],
      given: "ধৰোঁ বিচৰা কোণটো $x$। ই নিজৰেই পূৰক কোণ বুলি কোৱাৰ অৰ্থ হ'ল $x$ আৰু $x$ পূৰক।",
      work: `দুটা কোণৰ যোগফল $90°$ হ'লে সিহঁতক পূৰক কোণ বোলে ${B("(পূৰক কোণৰ সংজ্ঞা)")}।

$x + x = 90°$

$2x = 90° \\implies x = 45°$

${B("গতিকে $45°$ ৰেই কেৱল নিজৰ পূৰক কোণ নিজেই — $45°$ ৰ পূৰক কোণ $90° - 45° = 45°$। (একেদৰে, $90°$ ৰেই কেৱল নিজৰ সম্পূৰক কোণ নিজেই।)")}`,
      answerLabel: "$45°$",
    },
  },

  // ── Q20 ──────────────────────────────────────────────────────────────────
  {
    i: 19, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "A ray in the interior of an angle splits it: BAX + XAC = BAC, so XAC = 70 - 42 = 28.",
    enNeedle: "28°", asNeedle: "28°",
    figure: "ss-mcq-q20-interior-ray-v2.png",
    en: {
      question: "The point X lies inside ∠BAC. If ∠BAC = 70° and ∠BAX = 42°, what is ∠XAC?",
      options: ["28°", "29°", "27°", "30°"],
      given: "$X$ lies in the interior of $\\angle BAC$, with $\\angle BAC = 70°$ and $\\angle BAX = 42°$.",
      work: `Because $X$ is inside the angle, ray $AX$ runs between ray $AB$ and ray $AC$ and cuts $\\angle BAC$ into two adjacent parts:

$\\angle BAX + \\angle XAC = \\angle BAC$ ${B("(angle addition for a ray lying in the interior of an angle)")}

$42° + \\angle XAC = 70°$

$\\angle XAC = 70° - 42°$

$\\angle XAC = 28°$`,
      answerLabel: "$\\angle XAC = 28°$",
    },
    as: {
      question: "X বিন্দুটো ∠BAC ৰ ভিতৰত আছে। যদি ∠BAC = 70° আৰু ∠BAX = 42°, তেন্তে ∠XAC কিমান?",
      options: ["28°", "29°", "27°", "30°"],
      given: "$X$ বিন্দুটো $\\angle BAC$ ৰ ভিতৰত আছে, য'ত $\\angle BAC = 70°$ আৰু $\\angle BAX = 42°$।",
      work: `যিহেতু $X$ কোণটোৰ ভিতৰত আছে, ৰশ্মি $AX$ এ ৰশ্মি $AB$ আৰু ৰশ্মি $AC$ ৰ মাজেৰে গৈ $\\angle BAC$ ক দুটা সন্নিহিত ভাগত ভগাই দিয়ে:

$\\angle BAX + \\angle XAC = \\angle BAC$ ${B("(কোণৰ ভিতৰত থকা ৰশ্মিৰ বাবে কোণৰ যোগ নিয়ম)")}

$42° + \\angle XAC = 70°$

$\\angle XAC = 70° - 42°$

$\\angle XAC = 28°$`,
      answerLabel: "$\\angle XAC = 28°$",
    },
  },

  // ── Q21 ──────────────────────────────────────────────────────────────────
  {
    i: 20, difficulty: "moderate", correctIndex: 0, printedKey: 0,
    warrant: "Definition of parallel lines: coplanar lines that never meet however far produced. Sharing a plane is necessary but not sufficient, and having a point of intersection is the opposite of being parallel.",
    enNeedle: "They never meet, however far they are produced on either side",
    asNeedle: "দুয়োফালে যিমানেই বঢ়োৱা নহওক কিয়, সিহঁতে কেতিয়াও লগ নাপায়",
    figure: "ss-mcq-q11-parallel-no-common-v2.png",
    en: {
      question: "Two lines in a plane are parallel to each other exactly when:",
      options: [
        "They never meet, however far they are produced on either side",
        "Both of the lines lie in the same plane",
        "They are parallel to the plane in which they lie",
        "Their point of intersection is a unique point",
      ],
      given: "The definition of parallel lines is what is being tested here.",
      work: `**(a)** ${G("Correct")} — two coplanar lines are parallel precisely when they have no point in common, that is, they never meet however far they are produced in either direction.

**(b)** Lying in the same plane is necessary but nowhere near enough — two lines drawn in one plane may perfectly well cut each other.

**(c)** A line lying in a plane is *contained* in that plane, not parallel to it, so this option says nothing at all about how the two lines are related.

**(d)** Having a point of intersection is exactly what parallel lines do **not** have; this describes intersecting lines.

${B("Option (a) is the working definition used all through this chapter: parallel lines are coplanar lines with no common point, which is why the figure shows $l$ and $m$ carrying arrowheads at both ends — however far you follow them, the gap never closes.")}`,
      answerLabel: "they never meet, however far they are produced on either side",
    },
    as: {
      question: "এখন সমতলত থকা দুডাল ৰেখা ঠিক তেতিয়াহে পৰস্পৰ সমান্তৰাল হয়, যেতিয়া-",
      options: [
        "দুয়োফালে যিমানেই বঢ়োৱা নহওক কিয়, সিহঁতে কেতিয়াও লগ নাপায়",
        "ৰেখা দুডাল একেখন সমতলতে থাকে",
        "সিহঁত থকা সমতলখনৰ সৈতে সিহঁত সমান্তৰাল হয়",
        "সিহঁতৰ ছেদবিন্দুটো এটা অদ্বিতীয় বিন্দু হয়",
      ],
      given: "ইয়াত সমান্তৰাল ৰেখাৰ সংজ্ঞাটোৱেই পৰীক্ষা কৰা হৈছে।",
      work: `**(a)** ${G("শুদ্ধ")} — একেখন সমতলত থকা দুডাল ৰেখা ঠিক তেতিয়াহে সমান্তৰাল হয় যেতিয়া সিহঁতৰ কোনো সাধাৰণ বিন্দু নাথাকে, অৰ্থাৎ দুয়োফালে যিমানেই বঢ়োৱা নহওক কিয় সিহঁতে কেতিয়াও লগ নাপায়।

**(b)** একেখন সমতলত থকাটো প্ৰয়োজনীয়, কিন্তু একেবাৰেই যথেষ্ট নহয় — একেখন সমতলত অঁকা দুডাল ৰেখাই ইটোৱে সিটোক ভালদৰেই ছেদ কৰিব পাৰে।

**(c)** সমতল এখনত থকা ৰেখা এডাল সেই সমতলখনৰ *ভিতৰত* থাকে, সমতলখনৰ সমান্তৰাল নহয়; গতিকে এই বিকল্পটোৱে ৰেখা দুডালৰ সম্পৰ্কৰ বিষয়ে একোৱেই নকয়।

**(d)** ছেদবিন্দু থকাটোৱেই হৈছে সমান্তৰাল ৰেখাত **নাথাকে** এনে কথা; ই ছেদক ৰেখাৰ কথাহে বুজায়।

${B("এই গোটেই অধ্যায়টোত ব্যৱহাৰ কৰা সংজ্ঞাটোৱেই হৈছে বিকল্প (a): সমান্তৰাল ৰেখা হৈছে একেখন সমতলত থকা এনে ৰেখা যাৰ কোনো সাধাৰণ বিন্দু নাথাকে। সেইবাবেই চিত্ৰত $l$ আৰু $m$ ৰ দুয়োমূৰত কাঁড়চিহ্ন দিয়া হৈছে — যিমানেই আগবাঢ়ি যোৱা নহওক কিয়, মাজৰ ব্যৱধান কেতিয়াও বন্ধ নহয়।")}`,
      answerLabel: "দুয়োফালে যিমানেই বঢ়োৱা নহওক কিয়, সিহঁতে কেতিয়াও লগ নাপায়",
    },
  },

  // ── Q22 ──────────────────────────────────────────────────────────────────
  {
    i: 21, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Theorem 6.1 — if two lines intersect each other, then the vertically opposite angles are equal; proved by comparing the two linear pairs at the point of intersection.",
    enNeedle: "Equal", asNeedle: "সমান",
    figure: "ss-mcq-q06-vertically-opposite-v2.png",
    en: {
      question: "Two lines cut each other at a point. The vertically opposite angles so formed are:",
      options: ["Equal", "Unequal", "Cannot be determined", "None of the above"],
      given: "Lines $AB$ and $CD$ cut each other at $O$, forming $\\angle 1$, $\\angle 2$, $\\angle 3$ and $\\angle 4$ as marked in the figure.",
      work: `$\\angle 1 + \\angle 2 = 180°$ ${B("(linear pair — ray $OC$ stands on the line $AB$)")}

$\\angle 2 + \\angle 3 = 180°$ ${B("(linear pair — ray $OB$ stands on the line $CD$)")}

Both left-hand sides equal $180°$, so

$\\angle 1 + \\angle 2 = \\angle 2 + \\angle 3 \\implies \\angle 1 = \\angle 3$

The same argument applied to the other two linear pairs gives $\\angle 2 = \\angle 4$.

${B("This is Theorem 6.1: if two lines intersect each other, then the vertically opposite angles are equal. In the drawn figure $\\angle 1 = \\angle 3 = 55°$ and $\\angle 2 = \\angle 4 = 125°$.")}`,
      answerLabel: "equal",
    },
    as: {
      question: "দুডাল ৰেখাই এটা বিন্দুত ইটোৱে সিটোক ছেদ কৰে। এইদৰে গঠিত বিপ্ৰতীপ কোণবোৰ হ'ব-",
      options: ["সমান", "অসমান", "নিৰ্ণয় কৰিব নোৱাৰি", "ওপৰৰ এটাও নহয়"],
      given: "$AB$ আৰু $CD$ ৰেখা দুডালে $O$ ত ইটোৱে সিটোক ছেদ কৰি চিত্ৰত চিহ্নিত কৰাৰ দৰে $\\angle 1$, $\\angle 2$, $\\angle 3$ আৰু $\\angle 4$ গঠন কৰিছে।",
      work: `$\\angle 1 + \\angle 2 = 180°$ ${B("(ৰৈখিক যোৰ — ৰশ্মি $OC$ ৰেখা $AB$ ৰ ওপৰত থিয় হৈছে)")}

$\\angle 2 + \\angle 3 = 180°$ ${B("(ৰৈখিক যোৰ — ৰশ্মি $OB$ ৰেখা $CD$ ৰ ওপৰত থিয় হৈছে)")}

দুয়োটা বাওঁফালৰ ৰাশিয়েই $180°$ ৰ সমান, গতিকে

$\\angle 1 + \\angle 2 = \\angle 2 + \\angle 3 \\implies \\angle 1 = \\angle 3$

আন যোৰ দুটা ৰৈখিক যোৰতো একেই যুক্তি প্ৰয়োগ কৰিলে পোৱা যায় $\\angle 2 = \\angle 4$।

${B("এইটোৱেই উপপাদ্য 6.1: দুডাল ৰেখাই ইটোৱে সিটোক ছেদ কৰিলে বিপ্ৰতীপ কোণবোৰ সমান হয়। অঁকা চিত্ৰখনত $\\angle 1 = \\angle 3 = 55°$ আৰু $\\angle 2 = \\angle 4 = 125°$।")}`,
      answerLabel: "সমান",
    },
  },
];
