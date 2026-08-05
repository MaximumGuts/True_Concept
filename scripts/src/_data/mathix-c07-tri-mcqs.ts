// Triangles (Class IX, chapter math-ix-c07) — the 22 MCQs of
// `Books/selfstudys_com_file (26).pdf` (source "Question 1" .. "Question 22").
//
// SECTION MAP OF THE SOURCE (confirmed by reading all 6 pages, text layer + render):
//   pp.1-6  a single band, headed only by the chapter title "Triangles",
//           numbered continuously "Question 1" .. "Question 22", each followed by
//           four options (a)-(d) and an "Answer:" line.
//           22 items = 22 - 1 + 1. No Assertion-Reason, no case-based, no short /
//           long answer band exists anywhere in this PDF.
//   Only ONE printed diagram: Q22 (parallelogram with both diagonals drawn).
//
// English stems are REWORDED for copyright; numbers, concepts, option sets and
// answers are untouched except where `sourceRepair` documents a defect in the
// printed paper that could not be published as-is.
//
// The Assamese side reuses this chapter's LIVE vocabulary (dumped from the
// existing math-ix-c07 / c06 / c08 / c09 Assamese documents before writing):
//   ত্ৰিভুজ triangle | সৰ্বসম congruent | সৰ্বসমতাৰ বিধি congruence criterion
//   সমদ্বিবাহু isosceles | সমবাহু equilateral | বিষমবাহু scalene | সমকোণী right-angled
//   অতিভুজ hypotenuse | উন্নতি altitude | মধ্যমা median | লম্ব perpendicular
//   ভূমি base | বাহু side | কোণ angle | শীৰ্ষবিন্দু vertex | বহিঃকোণ exterior angle
//   অন্তঃস্থ বিপৰীত কোণ interior opposite angle | সমদ্বিখণ্ডক bisector
//   সমদ্বিখণ্ডিত কৰে bisects | অনুৰূপ মিল correspondence | CPCT (kept as-is)
//   সামান্তৰিক parallelogram | কৰ্ণ diagonal | আয়তক্ষেত্ৰ rectangle
//   বৰ্গক্ষেত্ৰ square | বৃত্ত circle | ব্যাসাৰ্ধ radius | কালি area
//   ৰেখাখণ্ড line segment | সম্পূৰক supplementary | পূৰক complementary
//   আটাইতকৈ দীঘল longest | আটাইতকৈ চুটি shortest | চে.মি. cm | উক্তি statement
//
// `printedKey` is the 0-based answer printed in the source; `correctIndex` is the
// answer THIS file asserts after re-solving from first principles. The seed script
// reports every divergence and demands a student-visible `note` in both languages.
//
// The seed script builds the colour-styled explanation from `given` / `work` /
// `answerLabel`, so both languages get an identical five-colour structure.
export type TriMcqSide = {
  question: string;
  options: string[];
  /** the data the question hands you — rendered teal */
  given: string;
  /** the worked steps — markdown, inline reasons already wrapped in blue spans */
  work: string;
  /** short phrase completing "Correct option: (x) — …" — rendered green */
  answerLabel: string;
  note?: string;
};

export type TriMcqItem = {
  i: number;
  difficulty: "easy" | "moderate" | "hard";
  correctIndex: number;
  printedKey: number;
  /** the theorem / property that settles the item (audit trail) */
  warrant: string;
  /** set when the printed paper is defective and the item had to be repaired */
  sourceRepair?: string;
  /** substring appearing in exactly one en option — the correct one */
  enNeedle: string;
  /** substring appearing in exactly one as option — the correct one */
  asNeedle: string;
  /** file name under triangles-ix-chapter/ (language-neutral, shared EN+AS) */
  figure?: string;
  en: TriMcqSide;
  as: TriMcqSide;
};

const B = (s: string) => `<span style="color:#2563eb">${s}</span>`;

export const items: TriMcqItem[] = [
  {
    i: 0, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "In △ABC ≅ △PQR the correspondence is A↔P, B↔Q, C↔R, so AB=PQ, BC=QR and CA=RP; only CA=RP appears among the options.",
    enNeedle: "CA = RP", asNeedle: "CA = RP",
    en: {
      question: "The congruence △ABC ≅ △PQR is known to hold. Which one of these equalities follows from it?",
      options: ["CB = QP", "CA = RP", "AC = RQ", "AB = RP"],
      given: "The congruence is written △ABC ≅ △PQR, so the vertices correspond as A ↔ P, B ↔ Q, C ↔ R.",
      work: "Corresponding parts of congruent triangles are equal, so read the sides off the correspondence in the same order:\n\n$AB = PQ,\\qquad BC = QR,\\qquad CA = RP$\n\nThe second option is exactly the third of these.\n\n" + B("The other three mix letters taken from different correspondences: CB pairs with RQ, AC with PR, and AB with PQ — so CB = QP, AC = RQ and AB = RP are all false."),
      answerLabel: "CA = RP, read straight off the correspondence C ↔ R, A ↔ P",
    },
    as: {
      question: "△ABC ≅ △PQR সৰ্বসমতাটো সত্য বুলি জনা গৈছে। ইয়াৰ পৰা তলৰ কোনটো সমতা ওলায়?",
      options: ["CB = QP", "CA = RP", "AC = RQ", "AB = RP"],
      given: "সৰ্বসমতাটো △ABC ≅ △PQR ৰূপত লিখা হৈছে, গতিকে শীৰ্ষবিন্দুৰ অনুৰূপ মিল হ'ল A ↔ P, B ↔ Q, C ↔ R।",
      work: "সৰ্বসম ত্ৰিভুজৰ অনুৰূপ অংশবোৰ সমান, গতিকে অনুৰূপ মিলটোৰ একে ক্ৰমতে বাহুকেইডাল লিখা যায়ঃ\n\n$AB = PQ,\\qquad BC = QR,\\qquad CA = RP$\n\nদ্বিতীয় বিকল্পটো ঠিক ইয়াৰে তৃতীয়টো।\n\n" + B("বাকী তিনিটাই বেলেগ বেলেগ অনুৰূপ মিলৰ আখৰ মিহলাইছে: CB ৰ লগত RQ, AC ৰ লগত PR আৰু AB ৰ লগত PQ মিলে — সেয়ে CB = QP, AC = RQ আৰু AB = RP তিনিওটাই অশুদ্ধ।"),
      answerLabel: "CA = RP, যিটো C ↔ R, A ↔ P অনুৰূপ মিলৰ পৰা পোনপটীয়াকৈ পোৱা যায়",
    },
  },
  {
    i: 1, difficulty: "easy", correctIndex: 2, printedKey: 2,
    warrant: "SAS needs the equal angle to be included between the two pairs of equal sides. At A the arms are AB and AC, at D they are DE and DF; AB = DE is given, so the second pair must be AC = DF.",
    sourceRepair: "The printed option (c) reads 'AC = DE' and the rule is printed as 'SA axiom'. DE is already matched with AB, so 'AC = DE' cannot complete an SAS pair; the intended partner of AC is DF. Option (c) is corrected to AC = DF (same slot, so the printed key still points at the right answer) and the rule is named SAS.",
    enNeedle: "AC = DF", asNeedle: "AC = DF",
    en: {
      question: "In △ABC and △DEF it is given that AB = DE and ∠A = ∠D. The two triangles will be congruent by the SAS criterion if, in addition,",
      options: ["BC = EF", "AC = EF", "AC = DF", "BC = DE"],
      given: "AB = DE and ∠A = ∠D, with the triangles matched as A ↔ D, B ↔ E, C ↔ F.",
      work: "SAS requires the equal angle to be the angle *included* between the two pairs of equal sides.\n\nAt $A$ the two arms are $AB$ and $AC$; at $D$ the two arms are $DE$ and $DF$. One pair, $AB = DE$, is already given, so the second pair must be\n\n$AC = DF$\n\n" + B("BC and EF lie opposite the given angles rather than alongside them, so BC = EF would only give SSA, which is not a congruence criterion."),
      answerLabel: "AC = DF, the second arm of the included angle",
      note: "The printed paper writes this option as \"AC = DE\" and calls the rule the \"SA axiom\". DE is already the partner of AB, so \"AC = DE\" cannot complete an SAS pair — the partner of AC is DF. The option and the name of the rule are corrected here; nothing else in the question changes.",
    },
    as: {
      question: "△ABC আৰু △DEF ত দিয়া আছে AB = DE আৰু ∠A = ∠D। ইয়াৰ লগতে আৰু কোনটো হ'লে ত্ৰিভুজ দুটা SAS বিধিমতে সৰ্বসম হ'ব?",
      options: ["BC = EF", "AC = EF", "AC = DF", "BC = DE"],
      given: "AB = DE আৰু ∠A = ∠D, আৰু ত্ৰিভুজ দুটাৰ অনুৰূপ মিল হ'ল A ↔ D, B ↔ E, C ↔ F।",
      work: "SAS ৰ বাবে সমান কোণটো সমান বাহুৰ দুযোৰৰ *মাজত থকা* কোণ হ'ব লাগিব।\n\n$A$ ত বাহু দুডাল হ'ল $AB$ আৰু $AC$; $D$ ত বাহু দুডাল হ'ল $DE$ আৰু $DF$। এযোৰ, $AB = DE$, ইতিমধ্যে দিয়া আছে, গতিকে দ্বিতীয় যোৰটো হ'ব লাগিবঃ\n\n$AC = DF$\n\n" + B("BC আৰু EF দিয়া কোণ দুটাৰ বিপৰীতে থাকে, কোণটোৰ বাহু হৈ নাথাকে; সেয়ে BC = EF দিলে কেৱল SSA হয়, যিটো সৰ্বসমতাৰ বিধি নহয়।"),
      answerLabel: "AC = DF, মাজত থকা কোণটোৰ দ্বিতীয় বাহুডাল",
      note: "মূল প্ৰশ্নকাকতত এই বিকল্পটো \"AC = DE\" বুলি লিখা আছে আৰু বিধিটোক \"SA স্বতঃসিদ্ধ\" বোলা হৈছে। DE ইতিমধ্যে AB ৰ অনুৰূপ, গতিকে \"AC = DE\" এ SAS যোৰ সম্পূৰ্ণ কৰিব নোৱাৰে — AC ৰ অনুৰূপ হ'ল DF। ইয়াত বিকল্পটো আৰু বিধিটোৰ নাম শুধৰোৱা হৈছে; প্ৰশ্নটোৰ আন একো সলনি কৰা হোৱা নাই।",
    },
  },
  {
    i: 2, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "The right angle is the largest angle of a right triangle (the other two sum to 90°), and the largest angle faces the longest side — the hypotenuse.",
    enNeedle: "hypotenuse", asNeedle: "অতিভুজ",
    en: {
      question: "In a right-angled triangle, which side is the longest?",
      options: ["The perpendicular", "The hypotenuse", "The base", "None of these"],
      given: "One angle of the triangle measures 90°.",
      work: "The angle sum of a triangle is $180°$, so the remaining two angles together make $90°$ and each of them is smaller than $90°$. The right angle is therefore the largest angle of the triangle.\n\nIn any triangle the largest angle faces the longest side, and the side facing the right angle is called the hypotenuse.\n\n" + B("The perpendicular and the base are the two arms of the right angle, so each of them faces one of the two smaller angles and is shorter."),
      answerLabel: "the hypotenuse",
    },
    as: {
      question: "সমকোণী ত্ৰিভুজ এটাত আটাইতকৈ দীঘল বাহুডাল কোনটো?",
      options: ["লম্ব", "অতিভুজ", "ভূমি", "ওপৰৰ এটাও নহয়"],
      given: "ত্ৰিভুজটোৰ এটা কোণৰ জোখ 90°।",
      work: "ত্ৰিভুজৰ কোণৰ সমষ্টি $180°$, গতিকে বাকী দুটা কোণৰ যোগফল $90°$ আৰু প্ৰতিটোৱেই $90°$ তকৈ সৰু। সেয়েহে সমকোণটোৱেই ত্ৰিভুজটোৰ বৃহত্তম কোণ।\n\nযিকোনো ত্ৰিভুজত বৃহত্তম কোণটোৰ বিপৰীতে থকা বাহুডালেই আটাইতকৈ দীঘল, আৰু সমকোণৰ বিপৰীতে থকা বাহুডালক অতিভুজ বোলা হয়।\n\n" + B("লম্ব আৰু ভূমি হ'ল সমকোণটোৰ দুডাল বাহু, গতিকে সিহঁতৰ প্ৰতিডালেই সৰু কোণ এটাৰ বিপৰীতে থাকে আৰু চুটি হয়।"),
      answerLabel: "অতিভুজ",
    },
  },
  {
    i: 3, difficulty: "moderate", correctIndex: 3, printedKey: 3,
    warrant: "∠C = 180° − 45° − 70° = 65°. Smallest angle A = 45° faces BC (shortest); largest angle B = 70° faces AC (longest).",
    enNeedle: "BC, AC", asNeedle: "BC, AC",
    en: {
      question: "In △ABC, ∠A = 45° and ∠B = 70°. Name the shortest side and the longest side of the triangle, in that order.",
      options: ["BC, AB", "AB, AC", "AB, BC", "BC, AC"],
      given: "∠A = 45° and ∠B = 70° in △ABC.",
      work: "First find the third angle:\n\n$\\angle C = 180° - 45° - 70° = 65°$\n\nThe three angles are $45°$, $70°$ and $65°$, so $\\angle A$ is the smallest and $\\angle B$ is the largest.\n\nIn a triangle a smaller angle faces a shorter side. The side opposite $\\angle A$ is $BC$, so $BC$ is the shortest; the side opposite $\\angle B$ is $AC$, so $AC$ is the longest.\n\n" + B("Written in the order the question asks — shortest first — the pair is BC, AC."),
      answerLabel: "BC, AC",
    },
    as: {
      question: "△ABC ত ∠A = 45° আৰু ∠B = 70°। ত্ৰিভুজটোৰ আটাইতকৈ চুটি বাহুডাল আৰু আটাইতকৈ দীঘল বাহুডাল ক্ৰমে লিখা।",
      options: ["BC, AB", "AB, AC", "AB, BC", "BC, AC"],
      given: "△ABC ত ∠A = 45° আৰু ∠B = 70°।",
      work: "প্ৰথমে তৃতীয় কোণটো উলিওৱা হয়ঃ\n\n$\\angle C = 180° - 45° - 70° = 65°$\n\nতিনিওটা কোণ হ'ল $45°$, $70°$ আৰু $65°$, গতিকে $\\angle A$ আটাইতকৈ সৰু আৰু $\\angle B$ আটাইতকৈ ডাঙৰ।\n\nত্ৰিভুজত সৰু কোণটোৰ বিপৰীতে চুটি বাহুডাল থাকে। $\\angle A$ ৰ বিপৰীতে থকা বাহুডাল হ'ল $BC$, গতিকে $BC$ আটাইতকৈ চুটি; $\\angle B$ ৰ বিপৰীতে থকা বাহুডাল হ'ল $AC$, গতিকে $AC$ আটাইতকৈ দীঘল।\n\n" + B("প্ৰশ্নত বিচৰা ক্ৰমত — প্ৰথমে চুটিটো — লিখিলে যোৰটো হ'ল BC, AC।"),
      answerLabel: "BC, AC",
    },
  },
  {
    i: 4, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "With BE = CF, △BEC ≅ △CFB by RHS (right angles at E and F, common hypotenuse BC, BE = CF), so ∠ACB = ∠ABC by CPCT, hence AB = AC and the triangle is isosceles.",
    sourceRepair: "The printed stem says only 'the altitudes ... are equal' without saying how many. Three equal altitudes force an equilateral triangle, which would make the printed answer 'isosceles' incomplete; two equal altitudes force exactly an isosceles triangle. The stem is stated here for two altitudes, matching the printed answer.",
    enNeedle: "isosceles", asNeedle: "সমদ্বিবাহু",
    en: {
      question: "Two of the altitudes of a triangle, each drawn from a vertex to the opposite side, turn out to be equal in length. The triangle must then be",
      options: ["scalene", "isosceles", "equilateral", "right-angled"],
      given: "In △ABC the altitude BE on AC and the altitude CF on AB satisfy BE = CF.",
      work: "Compare the right triangles $BEC$ and $CFB$:\n\n$\\angle BEC = \\angle CFB = 90°$ " + B("(each of BE and CF is an altitude)") + "\n\n$BC = CB$ " + B("(the hypotenuse common to both)") + "\n\n$BE = CF$ " + B("(given)") + "\n\nSo $\\triangle BEC \\cong \\triangle CFB$ by the RHS criterion, and by CPCT\n\n$\\angle BCE = \\angle CBF$, i.e. $\\angle ACB = \\angle ABC$\n\nSides opposite equal angles are equal, so $AB = AC$ and the triangle has two equal sides.",
      answerLabel: "isosceles",
      note: "The printed stem does not say how many altitudes are equal. Two equal altitudes give exactly an isosceles triangle; all three equal would give an equilateral one. The stem is written here for two altitudes so that the printed answer \"isosceles\" is the only correct one.",
    },
    as: {
      question: "ত্ৰিভুজ এটাৰ দুডাল উন্নতি, যিবোৰ প্ৰতিটো শীৰ্ষবিন্দুৰ পৰা বিপৰীত বাহুলৈ টনা হৈছে, দৈৰ্ঘ্যত সমান হৈ পৰিছে। তেন্তে ত্ৰিভুজটো অৱশ্যেই হ'ব",
      options: ["বিষমবাহু", "সমদ্বিবাহু", "সমবাহু", "সমকোণী"],
      given: "△ABC ত AC ৰ ওপৰৰ উন্নতি BE আৰু AB ৰ ওপৰৰ উন্নতি CF ৰ ক্ষেত্ৰত BE = CF।",
      work: "$BEC$ আৰু $CFB$ সমকোণী ত্ৰিভুজ দুটা তুলনা কৰা হওকঃ\n\n$\\angle BEC = \\angle CFB = 90°$ " + B("(BE আৰু CF প্ৰতিডালেই উন্নতি)") + "\n\n$BC = CB$ " + B("(দুয়োটাৰে সাধাৰণ অতিভুজ)") + "\n\n$BE = CF$ " + B("(দিয়া আছে)") + "\n\nগতিকে RHS সৰ্বসমতাৰ বিধিমতে $\\triangle BEC \\cong \\triangle CFB$, আৰু CPCT ৰ পৰাঃ\n\n$\\angle BCE = \\angle CBF$, অৰ্থাৎ $\\angle ACB = \\angle ABC$\n\nসমান কোণৰ বিপৰীতে থকা বাহু সমান, গতিকে $AB = AC$ আৰু ত্ৰিভুজটোৰ দুডাল বাহু সমান।",
      answerLabel: "সমদ্বিবাহু",
      note: "মূল প্ৰশ্নত কেইডাল উন্নতি সমান সেয়া কোৱা হোৱা নাই। দুডাল উন্নতি সমান হ'লে ঠিক সমদ্বিবাহু ত্ৰিভুজ পোৱা যায়; তিনিওডাল সমান হ'লে সমবাহু হ'লহেঁতেন। ইয়াত প্ৰশ্নটো দুডাল উন্নতিৰ বাবে লিখা হৈছে, যাতে মূল উত্তৰ \"সমদ্বিবাহু\" ইয়েই একমাত্ৰ শুদ্ধ উত্তৰ হয়।",
    },
  },
  {
    i: 5, difficulty: "hard", correctIndex: 3, printedKey: 3,
    warrant: "∠ADB is an exterior angle of △ADC, so ∠ADB = ∠DAC + ∠C = ∠BAD + ∠C > ∠BAD. In △ABD the greater angle faces the greater side, so AB > BD.",
    enNeedle: "BA > BD", asNeedle: "BA > BD",
    figure: "tri-mcq-q06-angle-bisector-d-v2.png",
    en: {
      question: "In △ABC the point D lies on the side BC and AD bisects ∠BAC. Which of the following is always true?",
      options: ["BD = CD", "CD > CA", "BD > BA", "BA > BD"],
      given: "D is a point of side BC and ∠BAD = ∠DAC.",
      work: "$\\angle ADB$ is an exterior angle of $\\triangle ADC$ at $D$, so it equals the sum of the two interior opposite angles:\n\n$\\angle ADB = \\angle DAC + \\angle ACD$\n\nSince $AD$ bisects $\\angle A$ we have $\\angle DAC = \\angle BAD$, hence\n\n$\\angle ADB = \\angle BAD + \\angle ACD > \\angle BAD$\n\nNow work inside $\\triangle ABD$. The greater angle faces the greater side; $\\angle ADB$ faces $AB$ and $\\angle BAD$ faces $BD$, so\n\n$AB > BD$ " + B("that is, BA > BD") + "\n\n" + B("BD = CD would require AD to be a median, and CD > CA and BD > BA are the reverse inequalities — none of the three follows from the bisector alone."),
      answerLabel: "BA > BD",
    },
    as: {
      question: "△ABC ত D বিন্দুটো BC বাহুৰ ওপৰত আছে আৰু AD য়ে ∠BAC ক সমদ্বিখণ্ডিত কৰে। তলৰ কোনটো সদায় সত্য?",
      options: ["BD = CD", "CD > CA", "BD > BA", "BA > BD"],
      given: "D হ'ল BC বাহুৰ এটা বিন্দু আৰু ∠BAD = ∠DAC।",
      work: "$\\angle ADB$ হ'ল $D$ ত $\\triangle ADC$ ৰ এটা বহিঃকোণ, গতিকে ই অন্তঃস্থ বিপৰীত কোণ দুটাৰ সমষ্টিৰ সমানঃ\n\n$\\angle ADB = \\angle DAC + \\angle ACD$\n\nযিহেতু $AD$ য়ে $\\angle A$ ক সমদ্বিখণ্ডিত কৰে, $\\angle DAC = \\angle BAD$, সেয়ে\n\n$\\angle ADB = \\angle BAD + \\angle ACD > \\angle BAD$\n\nএতিয়া $\\triangle ABD$ ৰ ভিতৰত চোৱা হওক। ডাঙৰ কোণটোৰ বিপৰীতে ডাঙৰ বাহুডাল থাকে; $\\angle ADB$ ৰ বিপৰীতে $AB$ আৰু $\\angle BAD$ ৰ বিপৰীতে $BD$ আছে, গতিকে\n\n$AB > BD$ " + B("অৰ্থাৎ BA > BD") + "\n\n" + B("BD = CD হ'বলৈ AD মধ্যমা হ'ব লাগিলহেঁতেন, আৰু CD > CA বা BD > BA হ'ল ওলোটা অসমতা — সমদ্বিখণ্ডকটোৰ পৰা এইকেইটাৰ এটাও নোলায়।"),
      answerLabel: "BA > BD",
    },
  },
  {
    i: 6, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Same correspondence A↔P, B↔Q, C↔R: AB=PQ, BC=QR, CA=RP. Only CA=RP is among the options.",
    enNeedle: "CA = RP", asNeedle: "CA = RP",
    en: {
      question: "Given that △ABC ≅ △PQR, pick the equality below that is a valid consequence of this congruence.",
      options: ["CA = RP", "AB = RP", "AC = RQ", "CB = QP"],
      given: "△ABC ≅ △PQR, so the vertices are matched as A ↔ P, B ↔ Q, C ↔ R.",
      work: "Write the correspondence down first, then read the sides off it in the same order:\n\n$AB = PQ,\\qquad BC = QR,\\qquad CA = RP$\n\nOnly the first option is one of these three equalities.\n\n" + B("AB pairs with PQ (not RP), AC pairs with PR (not RQ), and CB pairs with RQ (not QP)."),
      answerLabel: "CA = RP",
    },
    as: {
      question: "△ABC ≅ △PQR দিয়া আছে। এই সৰ্বসমতাৰ পৰা বৈধভাৱে ওলোৱা সমতাটো বাছি উলিওৱা।",
      options: ["CA = RP", "AB = RP", "AC = RQ", "CB = QP"],
      given: "△ABC ≅ △PQR, গতিকে শীৰ্ষবিন্দুৰ অনুৰূপ মিল হ'ল A ↔ P, B ↔ Q, C ↔ R।",
      work: "প্ৰথমে অনুৰূপ মিলটো লিখা হওক, তাৰ পিছত একে ক্ৰমতে বাহুকেইডাল পঢ়া হওকঃ\n\n$AB = PQ,\\qquad BC = QR,\\qquad CA = RP$\n\nএই তিনিটা সমতাৰ ভিতৰত কেৱল প্ৰথম বিকল্পটোহে আছে।\n\n" + B("AB ৰ অনুৰূপ PQ (RP নহয়), AC ৰ অনুৰূপ PR (RQ নহয়), আৰু CB ৰ অনুৰূপ RQ (QP নহয়)।"),
      answerLabel: "CA = RP",
    },
  },
  {
    i: 7, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Congruence is denoted by ≅ and the vertices must be listed in the order of the correspondence, giving △ABC ≅ △PQR.",
    enNeedle: "△ABC ≅ △PQR", asNeedle: "△ABC ≅ △PQR",
    en: {
      question: "Two triangles ABC and PQR are congruent under the correspondence A ↔ P, B ↔ Q, C ↔ R. How is this fact written in symbols?",
      options: ["△ABC ≅ △PQR", "△ABC = △PQR", "△ABC and △PQR are scalene triangles", "△ABC and △PQR are isosceles triangles"],
      given: "The vertices are matched as A ↔ P, B ↔ Q, C ↔ R.",
      work: "Congruence of two figures is written with the symbol $\\cong$, and the letters on either side of it must be listed in the order of the correspondence.\n\nHere the order is $A, B, C$ against $P, Q, R$, so the statement reads\n\n$\\triangle ABC \\cong \\triangle PQR$\n\n" + B("An equals sign would claim the two triangles are the same triangle, and being scalene or isosceles says nothing about a correspondence between two triangles."),
      answerLabel: "△ABC ≅ △PQR",
    },
    as: {
      question: "ABC আৰু PQR ত্ৰিভুজ দুটা A ↔ P, B ↔ Q, C ↔ R অনুৰূপ মিলত সৰ্বসম। এই কথাটো সংকেতেৰে কেনেকৈ লিখা হয়?",
      options: ["△ABC ≅ △PQR", "△ABC = △PQR", "△ABC আৰু △PQR বিষমবাহু ত্ৰিভুজ", "△ABC আৰু △PQR সমদ্বিবাহু ত্ৰিভুজ"],
      given: "শীৰ্ষবিন্দুৰ অনুৰূপ মিল হ'ল A ↔ P, B ↔ Q, C ↔ R।",
      work: "দুটা চিত্ৰৰ সৰ্বসমতা $\\cong$ সংকেতেৰে লিখা হয়, আৰু ইয়াৰ দুয়োফালৰ আখৰবোৰ অনুৰূপ মিলটোৰ ক্ৰমতে লিখিব লাগে।\n\nইয়াত ক্ৰমটো হ'ল $A, B, C$ ৰ বিপৰীতে $P, Q, R$, গতিকে উক্তিটো হ'বঃ\n\n$\\triangle ABC \\cong \\triangle PQR$\n\n" + B("সমান চিহ্নই ক'ব যে ত্ৰিভুজ দুটা একেটাই ত্ৰিভুজ, আৰু বিষমবাহু বা সমদ্বিবাহু হোৱাটোৱে দুটা ত্ৰিভুজৰ অনুৰূপ মিলৰ বিষয়ে একো নকয়।"),
      answerLabel: "△ABC ≅ △PQR",
    },
  },
  {
    i: 8, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "△ABD ≅ △ACD by ASA (∠BAD = ∠CAD, AD common, ∠ADB = ∠ADC = 90°), so AB = AC by CPCT — the triangle is isosceles.",
    enNeedle: "isosceles", asNeedle: "সমদ্বিবাহু",
    en: {
      question: "In △ABC the bisector of ∠A is perpendicular to the side BC. The triangle ABC must then be",
      options: ["obtuse-angled", "isosceles", "scalene", "equilateral"],
      given: "AD bisects ∠A, D lies on BC, and AD ⊥ BC.",
      work: "Compare $\\triangle ABD$ and $\\triangle ACD$:\n\n$\\angle BAD = \\angle CAD$ " + B("(AD is the bisector of ∠A)") + "\n\n$AD = AD$ " + B("(common side)") + "\n\n$\\angle ADB = \\angle ADC = 90°$ " + B("(AD ⊥ BC)") + "\n\nSo $\\triangle ABD \\cong \\triangle ACD$ by the ASA criterion, and by CPCT\n\n$AB = AC$\n\nTwo sides of the triangle are equal.\n\n" + B("Nothing forces the third side BC to match AB, so the triangle need not be equilateral."),
      answerLabel: "isosceles",
    },
    as: {
      question: "△ABC ত ∠A ৰ সমদ্বিখণ্ডকডাল BC বাহুৰ লম্ব। তেন্তে ABC ত্ৰিভুজটো অৱশ্যেই হ'ব",
      options: ["স্থূলকোণী", "সমদ্বিবাহু", "বিষমবাহু", "সমবাহু"],
      given: "AD য়ে ∠A ক সমদ্বিখণ্ডিত কৰে, D, BC ৰ ওপৰত আছে আৰু AD ⊥ BC।",
      work: "$\\triangle ABD$ আৰু $\\triangle ACD$ তুলনা কৰা হওকঃ\n\n$\\angle BAD = \\angle CAD$ " + B("(AD হ'ল ∠A ৰ সমদ্বিখণ্ডক)") + "\n\n$AD = AD$ " + B("(সাধাৰণ বাহু)") + "\n\n$\\angle ADB = \\angle ADC = 90°$ " + B("(AD ⊥ BC)") + "\n\nগতিকে ASA সৰ্বসমতাৰ বিধিমতে $\\triangle ABD \\cong \\triangle ACD$, আৰু CPCT ৰ পৰাঃ\n\n$AB = AC$\n\nত্ৰিভুজটোৰ দুডাল বাহু সমান।\n\n" + B("তৃতীয় বাহু BC ও AB ৰ সমান হ'বই লাগিব বুলি একো নাই, গতিকে ত্ৰিভুজটো সমবাহু হ'বই লাগে বুলি ক'ব নোৱাৰি।"),
      answerLabel: "সমদ্বিবাহু",
    },
  },
  {
    i: 9, difficulty: "hard", correctIndex: 3, printedKey: 3,
    warrant: "AB=QR gives A↔Q,B↔R; BC=RP gives B↔R,C↔P; CA=QP gives C↔P,A↔Q. Consistent correspondence A↔Q, B↔R, C↔P, so listing the first triangle against P,Q,R gives △CAB ≅ △PQR by SSS.",
    enNeedle: "△CAB ≅ △PQR", asNeedle: "△CAB ≅ △PQR",
    en: {
      question: "In two triangles it is given that AB = QR, BC = RP and CA = QP. Which congruence statement is correct?",
      options: ["△BCA ≅ △PQR", "△ABC ≅ △PQR", "△CBA ≅ △PQR", "△CAB ≅ △PQR"],
      given: "AB = QR, BC = RP and CA = QP.",
      work: "Match the endpoints of each equal pair of sides:\n\n$AB = QR$ pairs $A$ with $Q$ and $B$ with $R$;\n\n$BC = RP$ pairs $B$ with $R$ and $C$ with $P$;\n\n$CA = QP$ pairs $C$ with $P$ and $A$ with $Q$.\n\nAll three readings agree, so the correspondence is $A \\leftrightarrow Q$, $B \\leftrightarrow R$, $C \\leftrightarrow P$.\n\nTo write the congruence with $PQR$ on the right, list the first triangle in the order that $P, Q, R$ demands: the vertex matching $P$ is $C$, the one matching $Q$ is $A$, the one matching $R$ is $B$. Hence\n\n$\\triangle CAB \\cong \\triangle PQR$ " + B("by SSS, since all three pairs of sides are equal") + "\n\n" + B("Each of the other three orderings pairs at least one wrong vertex — △ABC ≅ △PQR, for instance, would need AB = PQ, which is not given."),
      answerLabel: "△CAB ≅ △PQR",
    },
    as: {
      question: "দুটা ত্ৰিভুজত দিয়া আছে AB = QR, BC = RP আৰু CA = QP। কোনটো সৰ্বসমতাৰ উক্তি শুদ্ধ?",
      options: ["△BCA ≅ △PQR", "△ABC ≅ △PQR", "△CBA ≅ △PQR", "△CAB ≅ △PQR"],
      given: "AB = QR, BC = RP আৰু CA = QP।",
      work: "সমান বাহুৰ প্ৰতিযোৰৰ প্ৰান্তবিন্দুকেইটা মিলোৱা হওকঃ\n\n$AB = QR$ এ $A$ ৰ লগত $Q$ আৰু $B$ ৰ লগত $R$ মিলায়;\n\n$BC = RP$ এ $B$ ৰ লগত $R$ আৰু $C$ ৰ লগত $P$ মিলায়;\n\n$CA = QP$ এ $C$ ৰ লগত $P$ আৰু $A$ ৰ লগত $Q$ মিলায়।\n\nতিনিওটা পঢ়াই একে কথা কয়, গতিকে অনুৰূপ মিলটো হ'ল $A \\leftrightarrow Q$, $B \\leftrightarrow R$, $C \\leftrightarrow P$।\n\nসোঁফালে $PQR$ ৰাখি সৰ্বসমতাটো লিখিবলৈ প্ৰথম ত্ৰিভুজটো $P, Q, R$ ৰ ক্ৰম অনুসৰি লিখিব লাগেঃ $P$ ৰ অনুৰূপ $C$, $Q$ ৰ অনুৰূপ $A$, আৰু $R$ ৰ অনুৰূপ $B$। গতিকে\n\n$\\triangle CAB \\cong \\triangle PQR$ " + B("SSS বিধিমতে, যিহেতু তিনিওযোৰ বাহুৱেই সমান") + "\n\n" + B("বাকী তিনিটা ক্ৰমৰ প্ৰতিটোৱে অন্ততঃ এটা ভুল শীৰ্ষবিন্দু মিলায় — যেনে △ABC ≅ △PQR হ'বলৈ AB = PQ লাগিলহেঁতেন, যিটো দিয়া হোৱা নাই।"),
      answerLabel: "△CAB ≅ △PQR",
    },
  },
  {
    i: 10, difficulty: "moderate", correctIndex: 2, printedKey: 2,
    warrant: "△ABE ≅ △ACF by AAS (∠A common, ∠AEB = ∠AFC = 90°, AB = AC), so BE = CF by CPCT.",
    enNeedle: "BE = CF", asNeedle: "BE = CF",
    figure: "tri-mcq-q11-isosceles-altitudes-v2.png",
    en: {
      question: "In an isosceles triangle ABC the two equal sides are AC and AB. BE is the altitude drawn to AC and CF the altitude drawn to AB. Which relation holds between BE and CF?",
      options: ["BE > CF", "BE < CF", "BE = CF", "None of these"],
      given: "AB = AC; BE ⊥ AC with E on AC, and CF ⊥ AB with F on AB.",
      work: "Compare $\\triangle ABE$ and $\\triangle ACF$:\n\n$\\angle A = \\angle A$ " + B("(the same angle serves both triangles)") + "\n\n$\\angle AEB = \\angle AFC = 90°$ " + B("(BE and CF are altitudes)") + "\n\n$AB = AC$ " + B("(given)") + "\n\nSo $\\triangle ABE \\cong \\triangle ACF$ by the AAS criterion, and by CPCT\n\n$BE = CF$\n\n" + B("The two altitudes to the equal sides of an isosceles triangle are therefore always equal, whatever the size of the triangle."),
      answerLabel: "BE = CF",
    },
    as: {
      question: "সমদ্বিবাহু ত্ৰিভুজ ABC ৰ সমান বাহু দুডাল হ'ল AC আৰু AB। BE হ'ল AC লৈ টনা উন্নতি আৰু CF হ'ল AB লৈ টনা উন্নতি। BE আৰু CF ৰ মাজত কোনটো সম্পৰ্ক থাকে?",
      options: ["BE > CF", "BE < CF", "BE = CF", "ওপৰৰ এটাও নহয়"],
      given: "AB = AC; BE ⊥ AC আৰু E, AC ৰ ওপৰত; CF ⊥ AB আৰু F, AB ৰ ওপৰত।",
      work: "$\\triangle ABE$ আৰু $\\triangle ACF$ তুলনা কৰা হওকঃ\n\n$\\angle A = \\angle A$ " + B("(একেটা কোণেই দুয়োটা ত্ৰিভুজত আছে)") + "\n\n$\\angle AEB = \\angle AFC = 90°$ " + B("(BE আৰু CF উন্নতি)") + "\n\n$AB = AC$ " + B("(দিয়া আছে)") + "\n\nগতিকে AAS সৰ্বসমতাৰ বিধিমতে $\\triangle ABE \\cong \\triangle ACF$, আৰু CPCT ৰ পৰাঃ\n\n$BE = CF$\n\n" + B("সেয়েহে সমদ্বিবাহু ত্ৰিভুজৰ সমান বাহু দুডাললৈ টনা উন্নতি দুডাল ত্ৰিভুজটোৰ জোখ যিয়েই নহওক, সদায় সমান।"),
      answerLabel: "BE = CF",
    },
  },
  {
    i: 11, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "SSS, SAS, ASA (with AAS) and RHS are the accepted criteria; SSA is not, because two sides and a non-included angle can produce two different triangles.",
    enNeedle: "SSA", asNeedle: "SSA",
    en: {
      question: "Which of the following is NOT a valid criterion for the congruence of two triangles?",
      options: ["SSS", "SSA", "ASA", "SAS"],
      given: "The standard congruence criteria studied for triangles.",
      work: "The accepted criteria are SSS, SAS, ASA (together with its companion AAS) and RHS for right triangles.\n\nSSA is not one of them. Two sides together with an angle that is *not* included between them can be fitted together in two different ways, producing two triangles that are not congruent to each other.\n\n" + B("That is exactly why SSA is left out of the list of congruence criteria."),
      answerLabel: "SSA",
    },
    as: {
      question: "তলৰ কোনটো দুটা ত্ৰিভুজৰ সৰ্বসমতাৰ বৈধ বিধি নহয়?",
      options: ["SSS", "SSA", "ASA", "SAS"],
      given: "ত্ৰিভুজৰ বাবে পঢ়া প্ৰামাণিক সৰ্বসমতাৰ বিধিবোৰ।",
      work: "গ্ৰহণযোগ্য বিধিবোৰ হ'ল SSS, SAS, ASA (ইয়াৰ সংগী AAS ৰ সৈতে) আৰু সমকোণী ত্ৰিভুজৰ বাবে RHS।\n\nSSA ইয়াৰ ভিতৰত নাই। দুডাল বাহু আৰু সিহঁতৰ *মাজত নথকা* এটা কোণ দুটা বেলেগ বেলেগ ধৰণে বহুৱাব পাৰি, আৰু তাৰ পৰা পৰস্পৰ সৰ্বসম নোহোৱা দুটা ত্ৰিভুজ পোৱা যায়।\n\n" + B("ঠিক এই কাৰণতেই SSA ক সৰ্বসমতাৰ বিধিৰ তালিকাত ৰখা হোৱা নাই।"),
      answerLabel: "SSA",
    },
  },
  {
    i: 12, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "∠A = 180° − 30° − 70° = 80° is the largest angle, and the side opposite it is BC.",
    enNeedle: "BC", asNeedle: "BC",
    en: {
      question: "In △ABC, ∠B = 30° and ∠C = 70°. Which side of the triangle is the longest?",
      options: ["AB", "BC", "AC", "AB or AC"],
      given: "∠B = 30° and ∠C = 70° in △ABC.",
      work: "Find the third angle first:\n\n$\\angle A = 180° - 30° - 70° = 80°$\n\nThe angles are $80°$, $30°$ and $70°$, so $\\angle A$ is the largest.\n\nThe longest side of a triangle faces its largest angle, and the side opposite $\\angle A$ is $BC$.\n\n" + B("AB faces ∠C = 70° and AC faces ∠B = 30°, so both are shorter than BC; and since 80° occurs only once there is no tie, which rules out \"AB or AC\"."),
      answerLabel: "BC",
    },
    as: {
      question: "△ABC ত ∠B = 30° আৰু ∠C = 70°। ত্ৰিভুজটোৰ কোনডাল বাহু আটাইতকৈ দীঘল?",
      options: ["AB", "BC", "AC", "AB বা AC"],
      given: "△ABC ত ∠B = 30° আৰু ∠C = 70°।",
      work: "প্ৰথমে তৃতীয় কোণটো উলিওৱা হওকঃ\n\n$\\angle A = 180° - 30° - 70° = 80°$\n\nকোণকেইটা হ'ল $80°$, $30°$ আৰু $70°$, গতিকে $\\angle A$ আটাইতকৈ ডাঙৰ।\n\nত্ৰিভুজৰ আটাইতকৈ দীঘল বাহুডাল ইয়াৰ বৃহত্তম কোণটোৰ বিপৰীতে থাকে, আৰু $\\angle A$ ৰ বিপৰীতে থকা বাহুডাল হ'ল $BC$।\n\n" + B("AB এ ∠C = 70° ৰ বিপৰীতে আৰু AC এ ∠B = 30° ৰ বিপৰীতে থাকে, গতিকে দুয়োডালেই BC তকৈ চুটি; আৰু 80° মাত্ৰ এবাৰহে আহিছে বাবে সমান হোৱাৰ প্ৰশ্নই নাই, সেয়ে \"AB বা AC\" বাদ পৰে।"),
      answerLabel: "BC",
    },
  },
  {
    i: 13, difficulty: "easy", correctIndex: 0, printedKey: 0,
    warrant: "Isosceles triangle theorem: if AB = AC then ∠B = ∠C, proved by △ABD ≅ △ACD (SAS) with AD the bisector of ∠A.",
    enNeedle: "always equal", asNeedle: "সদায় সমান",
    en: {
      question: "In any triangle, the two angles that lie opposite a pair of equal sides are",
      options: ["always equal", "always unequal", "supplementary", "complementary"],
      given: "A triangle in which two sides are equal.",
      work: "Take $\\triangle ABC$ with $AB = AC$, and let $AD$ be the bisector of $\\angle A$ meeting $BC$ at $D$. In $\\triangle ABD$ and $\\triangle ACD$:\n\n$AB = AC$ " + B("(given)") + "\n\n$\\angle BAD = \\angle CAD$ " + B("(AD is the bisector)") + "\n\n$AD = AD$ " + B("(common side)") + "\n\nSo $\\triangle ABD \\cong \\triangle ACD$ by SAS, and by CPCT $\\angle B = \\angle C$.\n\n" + B("Supplementary would mean the two add up to 180°, impossible inside a triangle; complementary (90°) happens only in the special right isosceles case, not in general."),
      answerLabel: "always equal",
    },
    as: {
      question: "যিকোনো ত্ৰিভুজত, সমান বাহু এযোৰৰ বিপৰীতে থকা কোণ দুটা হ'ল",
      options: ["সদায় সমান", "সদায় অসমান", "সম্পূৰক (যোগফল 180°)", "পূৰক (যোগফল 90°)"],
      given: "এনে এটা ত্ৰিভুজ য'ত দুডাল বাহু সমান।",
      work: "$AB = AC$ থকা $\\triangle ABC$ লোৱা হওক, আৰু $AD$ ক $\\angle A$ ৰ সমদ্বিখণ্ডক ধৰা হওক যিয়ে $BC$ ক $D$ ত লগ পায়। $\\triangle ABD$ আৰু $\\triangle ACD$ তঃ\n\n$AB = AC$ " + B("(দিয়া আছে)") + "\n\n$\\angle BAD = \\angle CAD$ " + B("(AD হ'ল সমদ্বিখণ্ডক)") + "\n\n$AD = AD$ " + B("(সাধাৰণ বাহু)") + "\n\nগতিকে SAS বিধিমতে $\\triangle ABD \\cong \\triangle ACD$, আৰু CPCT ৰ পৰা $\\angle B = \\angle C$।\n\n" + B("সম্পূৰক হ'লে দুয়োটাৰ যোগফল 180° হ'লহেঁতেন, যিটো ত্ৰিভুজৰ ভিতৰত অসম্ভৱ; আৰু পূৰক (90°) কেৱল সমকোণী সমদ্বিবাহুৰ বিশেষ ক্ষেত্ৰতহে হয়, সাধাৰণভাৱে নহয়।"),
      answerLabel: "সদায় সমান",
    },
  },
  {
    i: 14, difficulty: "easy", correctIndex: 3, printedKey: 3,
    warrant: "Equal sides face equal angles, so all three angles are equal; 3x = 180° gives x = 60°.",
    enNeedle: "60°", asNeedle: "60°",
    en: {
      question: "Each angle of an equilateral triangle measures",
      options: ["90°", "180°", "120°", "60°"],
      given: "All three sides of the triangle are equal.",
      work: "Equal sides face equal angles, so all three angles of an equilateral triangle are equal. Call each of them $x$.\n\n$x + x + x = 180°$\n\n$3x = 180°$\n\n$x = 60°$\n\n" + B("90° would make the angle sum 270° and 120° would make it 360°, while 180° is the whole angle sum by itself — none of them can be an angle of a triangle here."),
      answerLabel: "60°",
    },
    as: {
      question: "সমবাহু ত্ৰিভুজ এটাৰ প্ৰতিটো কোণৰ জোখ হ'ল",
      options: ["90°", "180°", "120°", "60°"],
      given: "ত্ৰিভুজটোৰ তিনিওডাল বাহুৱেই সমান।",
      work: "সমান বাহুৰ বিপৰীতে সমান কোণ থাকে, গতিকে সমবাহু ত্ৰিভুজৰ তিনিওটা কোণেই সমান। প্ৰতিটোক $x$ ধৰা হওক।\n\n$x + x + x = 180°$\n\n$3x = 180°$\n\n$x = 60°$\n\n" + B("90° হ'লে কোণৰ সমষ্টি 270° আৰু 120° হ'লে 360° হ'লহেঁতেন, আৰু 180° নিজেই গোটেই সমষ্টিটো — গতিকে ইয়াৰ এটাও ত্ৰিভুজটোৰ কোণ হ'ব নোৱাৰে।"),
      answerLabel: "60°",
    },
  },
  {
    i: 15, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "Correspondence A↔P, B↔Q, C↔R gives PQ = AB = 5 cm (i.e. QP = 5 cm) and ∠P = ∠A = 60°.",
    sourceRepair: "The printed stem is incomplete — 'If AB = 5 cm, and then which of the following is true?' — the angle datum is missing. All four printed options quote 60° and the printed answer is 'QP = 5 cm, ∠P = 60°', which fixes the missing datum as ∠A = 60°. It is restored here.",
    enNeedle: "QP = 5 cm, ∠P = 60°", asNeedle: "QP = 5 চে.মি., ∠P = 60°",
    en: {
      question: "△ABC ≅ △PQR. If AB = 5 cm and ∠A = 60°, which of the following is true?",
      options: ["QR = 5 cm, ∠R = 60°", "QP = 5 cm, ∠P = 60°", "QP = 5 cm, ∠R = 60°", "QR = 5 cm, ∠Q = 60°"],
      given: "△ABC ≅ △PQR, AB = 5 cm and ∠A = 60°.",
      work: "The correspondence is $A \\leftrightarrow P$, $B \\leftrightarrow Q$, $C \\leftrightarrow R$.\n\nThe side $AB$ therefore matches $PQ$, and $QP$ names the very same segment:\n\n$QP = PQ = AB = 5$ cm\n\nThe angle at $A$ matches the angle at $P$:\n\n$\\angle P = \\angle A = 60°$\n\n" + B("QR matches BC, whose length is never given, and ∠Q and ∠R match ∠B and ∠C, whose sizes are never given either — so the other three options cannot be established."),
      answerLabel: "QP = 5 cm, ∠P = 60°",
      note: "The printed stem is incomplete — it reads \"If AB = 5 cm, and then which of the following is true?\", with the angle datum missing. All four printed options quote 60° and the printed answer is \"QP = 5 cm, ∠P = 60°\", which fixes the missing datum as ∠A = 60°. It has been restored here.",
    },
    as: {
      question: "△ABC ≅ △PQR। যদি AB = 5 চে.মি. আৰু ∠A = 60°, তেন্তে তলৰ কোনটো সত্য?",
      options: ["QR = 5 চে.মি., ∠R = 60°", "QP = 5 চে.মি., ∠P = 60°", "QP = 5 চে.মি., ∠R = 60°", "QR = 5 চে.মি., ∠Q = 60°"],
      given: "△ABC ≅ △PQR, AB = 5 চে.মি. আৰু ∠A = 60°।",
      work: "অনুৰূপ মিলটো হ'ল $A \\leftrightarrow P$, $B \\leftrightarrow Q$, $C \\leftrightarrow R$।\n\nগতিকে $AB$ বাহুডালৰ অনুৰূপ হ'ল $PQ$, আৰু $QP$ এ ঠিক সেই একেডাল ৰেখাখণ্ডকেই বুজায়ঃ\n\n$QP = PQ = AB = 5$ চে.মি.\n\n$A$ ৰ কোণটোৰ অনুৰূপ হ'ল $P$ ৰ কোণটোঃ\n\n$\\angle P = \\angle A = 60°$\n\n" + B("QR ৰ অনুৰূপ BC, যাৰ দৈৰ্ঘ্য দিয়াই হোৱা নাই, আৰু ∠Q আৰু ∠R ৰ অনুৰূপ ∠B আৰু ∠C, যিবোৰৰ জোখো দিয়া হোৱা নাই — গতিকে বাকী তিনিটা বিকল্প প্ৰতিষ্ঠা কৰিব নোৱাৰি।"),
      answerLabel: "QP = 5 চে.মি., ∠P = 60°",
      note: "মূল প্ৰশ্নটো অসম্পূৰ্ণভাৱে ছপা হৈছে — \"If AB = 5 cm, and then which of the following is true?\" — কোণৰ তথ্যটো নাই। ছপা হোৱা চাৰিওটা বিকল্পতে 60° আছে আৰু ছপা উত্তৰটো \"QP = 5 cm, ∠P = 60°\", যিয়ে হেৰোৱা তথ্যটো ∠A = 60° বুলি নিৰ্ধাৰণ কৰে। ইয়াত সেইটো ঘূৰাই দিয়া হৈছে।",
    },
  },
  {
    i: 16, difficulty: "hard", correctIndex: 2, printedKey: 2,
    warrant: "Adding OA+OB>AB, OB+OC>BC and OC+OA>CA gives 2(OA+OB+OC) > AB+BC+CA, i.e. OA+OB+OC > ½(AB+BC+CA). The stronger '>' without the half is false (centroid of an equilateral triangle is a counterexample).",
    enNeedle: "> ½(AB + BC + CA)", asNeedle: "> ½(AB + BC + CA)",
    en: {
      question: "O is any point in the interior of △ABC. Which of the following is always true?",
      options: ["(OA + OB + OC) < ½(AB + BC + CA)", "(OA + OB + OC) > (AB + BC + CA)", "(OA + OB + OC) > ½(AB + BC + CA)", "None of these"],
      given: "O lies inside △ABC, so the three triangles OAB, OBC and OCA all exist.",
      work: "In each of the three small triangles the sum of two sides exceeds the third:\n\n$OA + OB > AB$\n\n$OB + OC > BC$\n\n$OC + OA > CA$\n\nAdd the three inequalities. Each of $OA$, $OB$, $OC$ appears twice on the left:\n\n$2(OA + OB + OC) > AB + BC + CA$\n\n$OA + OB + OC > \\frac{1}{2}(AB + BC + CA)$\n\n" + B("The stronger claim without the half is false: put O at the centre of an equilateral triangle of side 1 and OA + OB + OC ≈ 1.73, which is less than the perimeter 3."),
      answerLabel: "(OA + OB + OC) > ½(AB + BC + CA)",
    },
    as: {
      question: "O হ'ল △ABC ৰ ভিতৰত থকা যিকোনো এটা বিন্দু। তলৰ কোনটো সদায় সত্য?",
      options: ["(OA + OB + OC) < ½(AB + BC + CA)", "(OA + OB + OC) > (AB + BC + CA)", "(OA + OB + OC) > ½(AB + BC + CA)", "ওপৰৰ এটাও নহয়"],
      given: "O, △ABC ৰ ভিতৰত আছে, গতিকে OAB, OBC আৰু OCA — তিনিওটা ত্ৰিভুজেই আছে।",
      work: "তিনিওটা সৰু ত্ৰিভুজৰ প্ৰতিটোতে দুডাল বাহুৰ সমষ্টি তৃতীয় বাহুডালতকৈ ডাঙৰঃ\n\n$OA + OB > AB$\n\n$OB + OC > BC$\n\n$OC + OA > CA$\n\nতিনিওটা অসমতা যোগ কৰা হওক। বাওঁফালে $OA$, $OB$ আৰু $OC$ প্ৰতিটোৱে দুবাৰকৈ আহেঃ\n\n$2(OA + OB + OC) > AB + BC + CA$\n\n$OA + OB + OC > \\frac{1}{2}(AB + BC + CA)$\n\n" + B("আধাটো নোহোৱাকৈ কৰা বেছি শক্তিশালী দাবীটো অশুদ্ধ: 1 বাহুৰ সমবাহু ত্ৰিভুজ এটাৰ কেন্দ্ৰত O ৰাখিলে OA + OB + OC ≈ 1.73 হয়, যিটো পৰিসীমা 3 তকৈ কম।"),
      answerLabel: "(OA + OB + OC) > ½(AB + BC + CA)",
    },
  },
  {
    i: 17, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "Triangle inequality: 2.3 + 3 = 5.3 < 5.4, so set (b) is impossible; 6+7>7, 3.4+6.1=9.5>8.3 and 3+5>5 all hold.",
    enNeedle: "5.4 cm", asNeedle: "5.4 চে.মি.",
    en: {
      question: "A triangle cannot be drawn when the measures of its three sides are",
      options: ["6 cm, 7 cm, 7 cm", "5.4 cm, 2.3 cm, 3 cm", "8.3 cm, 3.4 cm, 6.1 cm", "3 cm, 5 cm, 5 cm"],
      given: "Four sets of three side lengths, one of which cannot close into a triangle.",
      work: "A triangle exists only if the sum of any two of its sides is greater than the third. It is enough to test the two shorter sides of each set against the longest one:\n\n$2.3 + 3 = 5.3 < 5.4$ " + B("the second set fails") + "\n\n$6 + 7 = 13 > 7$ " + B("the first set is fine") + "\n\n$3.4 + 6.1 = 9.5 > 8.3$ " + B("the third set is fine") + "\n\n$3 + 5 = 8 > 5$ " + B("the fourth set is fine") + "\n\nOnly the second set breaks the condition, so those three lengths cannot form a triangle.",
      answerLabel: "5.4 cm, 2.3 cm, 3 cm",
    },
    as: {
      question: "ত্ৰিভুজ এটা অংকন কৰিব নোৱাৰি যেতিয়া ইয়াৰ তিনিওডাল বাহুৰ জোখ হয়",
      options: ["6 চে.মি., 7 চে.মি., 7 চে.মি.", "5.4 চে.মি., 2.3 চে.মি., 3 চে.মি.", "8.3 চে.মি., 3.4 চে.মি., 6.1 চে.মি.", "3 চে.মি., 5 চে.মি., 5 চে.মি."],
      given: "তিনিটাকৈ বাহুৰ চাৰিটা সমষ্টি, যাৰ এটাই ত্ৰিভুজ গঠন কৰিব নোৱাৰে।",
      work: "ত্ৰিভুজ এটা তেতিয়াহে থাকে যেতিয়া ইয়াৰ যিকোনো দুডাল বাহুৰ সমষ্টি তৃতীয় বাহুডালতকৈ ডাঙৰ হয়। প্ৰতিটো সমষ্টিৰ চুটি দুডাল বাহুক আটাইতকৈ দীঘলডালৰ সৈতে পৰীক্ষা কৰিলেই যথেষ্টঃ\n\n$2.3 + 3 = 5.3 < 5.4$ " + B("দ্বিতীয়টো বিফল হয়") + "\n\n$6 + 7 = 13 > 7$ " + B("প্ৰথমটো ঠিক আছে") + "\n\n$3.4 + 6.1 = 9.5 > 8.3$ " + B("তৃতীয়টো ঠিক আছে") + "\n\n$3 + 5 = 8 > 5$ " + B("চতুৰ্থটো ঠিক আছে") + "\n\nকেৱল দ্বিতীয় সমষ্টিটোৱেহে চৰ্তটো ভাঙে, গতিকে সেই তিনিটা দৈৰ্ঘ্যৰে ত্ৰিভুজ গঠন কৰিব নোৱাৰি।",
      answerLabel: "5.4 চে.মি., 2.3 চে.মি., 3 চে.মি.",
    },
  },
  {
    i: 18, difficulty: "easy", correctIndex: 1, printedKey: 1,
    warrant: "Every equilateral triangle already has three 60° angles, so equal angles or proportional sides hold for any pair; only equal sides give SSS and hence congruence.",
    enNeedle: "their sides are equal", asNeedle: "বাহুবোৰ সমান",
    en: {
      question: "Two equilateral triangles are congruent to each other exactly when",
      options: ["their areas are in the same ratio", "their sides are equal", "their side lengths are in the same ratio", "their angles are equal"],
      given: "Two triangles, each of them equilateral.",
      work: "Every equilateral triangle already has all three angles equal to $60°$, and its three sides are automatically in the ratio $1 : 1 : 1$. So equal angles, equal ratios of sides and equal ratios of areas hold for *every* pair of equilateral triangles, congruent or not — none of them can be the deciding condition.\n\nWhat is still free is the size. As soon as the side of one equals the side of the other, all three pairs of sides are equal and SSS gives the congruence.\n\n" + B("Equal angles alone give similarity, not congruence."),
      answerLabel: "their sides are equal",
    },
    as: {
      question: "দুটা সমবাহু ত্ৰিভুজ ঠিক তেতিয়াহে পৰস্পৰ সৰ্বসম হয় যেতিয়া",
      options: ["সিহঁতৰ কালি সমান অনুপাতত থাকে", "সিহঁতৰ বাহুবোৰ সমান হয়", "সিহঁতৰ বাহুৰ দৈৰ্ঘ্য সমান অনুপাতত থাকে", "সিহঁতৰ কোণবোৰ সমান হয়"],
      given: "দুটা ত্ৰিভুজ, প্ৰতিটোৱেই সমবাহু।",
      work: "প্ৰতিটো সমবাহু ত্ৰিভুজৰ তিনিওটা কোণেই ইতিমধ্যে $60°$, আৰু ইয়াৰ তিনিওডাল বাহু আপোনা-আপুনি $1 : 1 : 1$ অনুপাতত থাকে। গতিকে সমান কোণ, বাহুৰ সমান অনুপাত আৰু কালিৰ সমান অনুপাত — এইবোৰ *প্ৰতিযোৰ* সমবাহু ত্ৰিভুজৰ বাবেই সত্য, সৰ্বসম হওক বা নহওক — সেয়ে ইয়াৰ এটাও নিৰ্ণায়ক চৰ্ত হ'ব নোৱাৰে।\n\nবাকী থকাটো হ'ল জোখ। এটাৰ বাহু আনটোৰ বাহুৰ সমান হোৱাৰ লগে লগে তিনিওযোৰ বাহু সমান হয় আৰু SSS এ সৰ্বসমতা দিয়ে।\n\n" + B("কেৱল সমান কোণে সদৃশতা দিয়ে, সৰ্বসমতা নিদিয়ে।"),
      answerLabel: "সিহঁতৰ বাহুবোৰ সমান হয়",
    },
  },
  {
    i: 19, difficulty: "moderate", correctIndex: 3, printedKey: 3,
    warrant: "2.2 + 3.1 = 5.3, exactly equal to the third length, so the three points are collinear and no triangle exists; the other three sets satisfy the strict inequality.",
    enNeedle: "5.3 cm", asNeedle: "5.3 চে.মি.",
    en: {
      question: "A triangle cannot be constructed when the lengths of its sides are",
      options: ["4 cm, 6 cm, 6 cm", "9.3 cm, 5.2 cm, 7.4 cm", "6 cm, 7 cm, 8 cm", "5.3 cm, 2.2 cm, 3.1 cm"],
      given: "Four sets of three side lengths, one of which cannot form a triangle.",
      work: "The sum of any two sides of a triangle must be *strictly* greater than the third — equality is not enough.\n\n$2.2 + 3.1 = 5.3$ " + B("exactly the third length, not more than it — the fourth set fails") + "\n\n$5.2 + 7.4 = 12.6 > 9.3$ " + B("the second set is fine") + "\n\n$4 + 6 = 10 > 6$ " + B("the first set is fine") + "\n\n$6 + 7 = 13 > 8$ " + B("the third set is fine") + "\n\nWith $2.2 + 3.1 = 5.3$ the two shorter segments lie flat along the longest one, so the three points fall on a single straight line and no triangle is formed.",
      answerLabel: "5.3 cm, 2.2 cm, 3.1 cm",
    },
    as: {
      question: "ত্ৰিভুজ এটা গঠন কৰিব নোৱাৰি যেতিয়া ইয়াৰ বাহুকেইডালৰ দৈৰ্ঘ্য হয়",
      options: ["4 চে.মি., 6 চে.মি., 6 চে.মি.", "9.3 চে.মি., 5.2 চে.মি., 7.4 চে.মি.", "6 চে.মি., 7 চে.মি., 8 চে.মি.", "5.3 চে.মি., 2.2 চে.মি., 3.1 চে.মি."],
      given: "তিনিটাকৈ বাহুৰ চাৰিটা সমষ্টি, যাৰ এটাই ত্ৰিভুজ গঠন কৰিব নোৱাৰে।",
      work: "ত্ৰিভুজৰ যিকোনো দুডাল বাহুৰ সমষ্টি তৃতীয় বাহুডালতকৈ *কঠোৰভাৱে* ডাঙৰ হ'ব লাগিব — সমান হ'লেই নহ'ব।\n\n$2.2 + 3.1 = 5.3$ " + B("ঠিক তৃতীয় দৈৰ্ঘ্যটোৰ সমান, তাতকৈ ডাঙৰ নহয় — চতুৰ্থটো বিফল হয়") + "\n\n$5.2 + 7.4 = 12.6 > 9.3$ " + B("দ্বিতীয়টো ঠিক আছে") + "\n\n$4 + 6 = 10 > 6$ " + B("প্ৰথমটো ঠিক আছে") + "\n\n$6 + 7 = 13 > 8$ " + B("তৃতীয়টো ঠিক আছে") + "\n\n$2.2 + 3.1 = 5.3$ হোৱাত চুটি ৰেখাখণ্ড দুডাল আটাইতকৈ দীঘলডালৰ ওপৰতে পৰি থাকে, গতিকে তিনিওটা বিন্দু এডালেই পোন ৰেখাত পৰে আৰু কোনো ত্ৰিভুজ গঠন নহয়।",
      answerLabel: "5.3 চে.মি., 2.2 চে.মি., 3.1 চে.মি.",
    },
  },
  {
    i: 20, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "Equal area does not fix a rectangle's shape (1x12 and 3x4 both have area 12 but are not congruent); equal side, equal radius and equal length do determine a square, a circle and a segment completely.",
    sourceRepair: "The printed option reads 'Two lines having same length are congruent'. A line has no length, so it is stated here as a line segment. The mathematics of the item and its answer are unchanged.",
    enNeedle: "rectangles", asNeedle: "আয়তক্ষেত্ৰ",
    en: {
      question: "Which one of the following statements is incorrect?",
      options: [
        "Two squares with the same side length are congruent",
        "Two rectangles with the same area are congruent",
        "Two circles with the same radius are congruent",
        "Two line segments of the same length are congruent",
      ],
      given: "Four statements about when two figures are congruent.",
      work: "Congruent figures must have the same shape **and** the same size, so every measurement has to match.\n\nA square is completely determined by its side, a circle by its radius and a segment by its length — so those three statements are correct.\n\nArea does **not** determine a rectangle. A rectangle of $1 \\times 12$ and a rectangle of $3 \\times 4$ both have area $12$, yet one cannot be placed on the other:\n\n$1 \\times 12 = 12 = 3 \\times 4$, but $1 \\neq 3$ and $12 \\neq 4$\n\n" + B("So the statement about rectangles is the incorrect one."),
      answerLabel: "Two rectangles with the same area are congruent",
      note: "The printed option reads \"Two lines having same length are congruent\". A line has no length, so it is written here as a line segment; the mathematics of the question and its answer are unchanged.",
    },
    as: {
      question: "তলৰ কোনটো উক্তি অশুদ্ধ?",
      options: [
        "একে বাহুৰ দৈৰ্ঘ্যৰ দুটা বৰ্গক্ষেত্ৰ সৰ্বসম",
        "একে কালিৰ দুটা আয়তক্ষেত্ৰ সৰ্বসম",
        "একে ব্যাসাৰ্ধৰ দুটা বৃত্ত সৰ্বসম",
        "একে দৈৰ্ঘ্যৰ দুডাল ৰেখাখণ্ড সৰ্বসম",
      ],
      given: "দুটা চিত্ৰ কেতিয়া সৰ্বসম হয় সেই বিষয়ে চাৰিটা উক্তি।",
      work: "সৰ্বসম চিত্ৰৰ আকৃতি **আৰু** জোখ দুয়োটাই একে হ'ব লাগিব, গতিকে প্ৰতিটো জোখেই মিলিব লাগিব।\n\nবৰ্গক্ষেত্ৰ এটা ইয়াৰ বাহুৰে, বৃত্ত এটা ইয়াৰ ব্যাসাৰ্ধেৰে আৰু ৰেখাখণ্ড এডাল ইয়াৰ দৈৰ্ঘ্যৰে সম্পূৰ্ণৰূপে নিৰ্ধাৰিত হয় — গতিকে সেই তিনিটা উক্তি শুদ্ধ।\n\nকিন্তু কালিয়ে আয়তক্ষেত্ৰ এটা নিৰ্ধাৰণ **নকৰে**। $1 \\times 12$ আৰু $3 \\times 4$ জোখৰ দুটা আয়তক্ষেত্ৰৰ কালি দুয়োটাই $12$, তথাপি এটাক আনটোৰ ওপৰত বহুৱাব নোৱাৰিঃ\n\n$1 \\times 12 = 12 = 3 \\times 4$, কিন্তু $1 \\neq 3$ আৰু $12 \\neq 4$\n\n" + B("গতিকে আয়তক্ষেত্ৰৰ উক্তিটোৱেই অশুদ্ধ।"),
      answerLabel: "একে কালিৰ দুটা আয়তক্ষেত্ৰ সৰ্বসম",
      note: "মূল বিকল্পটো \"Two lines having same length are congruent\" বুলি ছপা হৈছে। ৰেখাৰ দৈৰ্ঘ্য নাথাকে, সেয়ে ইয়াত ইয়াক ৰেখাখণ্ড বুলি লিখা হৈছে; প্ৰশ্নটোৰ গণিত আৰু উত্তৰ অপৰিৱৰ্তিত।",
    },
  },
  {
    i: 21, difficulty: "moderate", correctIndex: 1, printedKey: 1,
    warrant: "In △ABD and △BAC: AB common, AD = BC (opposite sides of the parallelogram) and BD = AC (given equal diagonals) — three pairs of sides, hence SSS.",
    enNeedle: "SSS", asNeedle: "SSS",
    figure: "tri-mcq-q22-pgram-equal-diagonals-v2.png",
    en: {
      question: "In parallelogram ABCD the two diagonals are equal in length. By which criterion are △ABD and △ABC congruent?",
      options: ["AAS", "SSS", "SAS", "RHS"],
      given: "ABCD is a parallelogram and its diagonals satisfy AC = BD.",
      work: "The two triangles share the side $AB$. Compare them:\n\n$AB = BA$ " + B("(common side)") + "\n\n$AD = BC$ " + B("(opposite sides of a parallelogram are equal)") + "\n\n$BD = AC$ " + B("(given: the diagonals are equal)") + "\n\nThree pairs of sides are equal and no angle is needed, so the criterion used is SSS.\n\n" + B("A parallelogram whose diagonals are equal is in fact a rectangle, which is why the figure is drawn as one."),
      answerLabel: "SSS",
    },
    as: {
      question: "সামান্তৰিক ABCD ৰ কৰ্ণ দুডালৰ দৈৰ্ঘ্য সমান। কোন বিধিমতে △ABD আৰু △ABC সৰ্বসম?",
      options: ["AAS", "SSS", "SAS", "RHS"],
      given: "ABCD এটা সামান্তৰিক আৰু ইয়াৰ কৰ্ণ দুডালৰ ক্ষেত্ৰত AC = BD।",
      work: "ত্ৰিভুজ দুটাৰ $AB$ বাহুডাল সাধাৰণ। সিহঁতক তুলনা কৰা হওকঃ\n\n$AB = BA$ " + B("(সাধাৰণ বাহু)") + "\n\n$AD = BC$ " + B("(সামান্তৰিকৰ বিপৰীত বাহু সমান)") + "\n\n$BD = AC$ " + B("(দিয়া আছেঃ কৰ্ণ দুডাল সমান)") + "\n\nতিনিওযোৰ বাহু সমান আৰু কোনো কোণৰ প্ৰয়োজন হোৱা নাই, গতিকে ব্যৱহৃত বিধিটো হ'ল SSS।\n\n" + B("যিটো সামান্তৰিকৰ কৰ্ণ দুডাল সমান, সেইটো প্ৰকৃততে এটা আয়তক্ষেত্ৰ — সেয়েহে চিত্ৰটো আয়তক্ষেত্ৰ হিচাপেই অংকন কৰা হৈছে।"),
      answerLabel: "SSS",
    },
  },
];
