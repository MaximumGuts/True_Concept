/**
 * The 5 Assertion & Reasoning based MCQs (Q. 51-55) of
 * Books/TpA6OWPT3v9ql0s11FBO.pdf.
 *
 * There is no `assertion_reason` questionType in this app — these are seeded as
 * ordinary 4-option `mcq` items with the A/R structure kept inside the question
 * text, exactly as math-ix-c09 already does.
 */
import { McqItem, sol, arQuestion, AR_OPTIONS_EN, AR_OPTIONS_AS } from "./_sav_bank";

export const MCQ_AR: McqItem[] = [
  {
    id: "ar51-wooden-box-internal-volume",
    difficulty: "hard",
    correctIndex: 0,
    en: {
      question: arQuestion(
        "en",
        "A wooden box measures $18$ cm, $10$ cm and $6$ cm on the outside and the wood is $5$ mm thick; therefore the volume inside the box is $765\\ \\text{cm}^3$.",
        "If a rectangular box has external dimensions $l$, $b$ and $h$ and its sides are $x$ thick, its internal volume is $(l-2x)(b-2x)(h-2x)$.",
      ),
      options: AR_OPTIONS_EN,
      explanation: sol(
        "en",
        "external dimensions $18\\ \\text{cm}$, $10\\ \\text{cm}$, $6\\ \\text{cm}$; thickness $= 5\\ \\text{mm} = \\dfrac{1}{2}\\ \\text{cm}$.",
        "Every dimension loses the thickness **twice**, once at each end:\n\n$$18-2\\times\\tfrac{1}{2} = 17, \\qquad 10-2\\times\\tfrac{1}{2} = 9, \\qquad 6-2\\times\\tfrac{1}{2} = 5$$\n\n$$\\text{internal volume} = 17\\times 9\\times 5 = 765\\ \\text{cm}^3$$",
        "The Assertion is true, the Reason is true, and the Reason is exactly the rule that produces $765\\ \\text{cm}^3$. Correct option: (A).",
        "The thickness must be converted from millimetres to centimetres before it is subtracted, otherwise the box comes out with negative dimensions.",
      ),
    },
    as: {
      question: arQuestion(
        "as",
        "কাঠৰ এটা বাকচৰ বাহিৰৰ জোখ $18$ চে.মি., $10$ চে.মি. আৰু $6$ চে.মি. আৰু কাঠখন $5$ মি.মি. ডাঠ; সেয়েহে বাকচটোৰ ভিতৰৰ আয়তন $765\\ \\text{cm}^3$।",
        "যদি এটা আয়তাকাৰ বাকচৰ বাহ্যিক জোখ $l$, $b$ আৰু $h$ আৰু ইয়াৰ কাষবোৰ $x$ ডাঠ, তেন্তে ইয়াৰ আভ্যন্তৰীণ আয়তন $(l-2x)(b-2x)(h-2x)$।",
      ),
      options: AR_OPTIONS_AS,
      explanation: sol(
        "as",
        "বাহ্যিক জোখ $18\\ \\text{cm}$, $10\\ \\text{cm}$, $6\\ \\text{cm}$; ডাঠ $= 5\\ \\text{mm} = \\dfrac{1}{2}\\ \\text{cm}$।",
        "প্ৰতিটো জোখে ডাঠখিনি **দুবাৰ** হেৰুৱায়, দুয়োমূৰত এবাৰকৈ:\n\n$$18-2\\times\\tfrac{1}{2} = 17, \\qquad 10-2\\times\\tfrac{1}{2} = 9, \\qquad 6-2\\times\\tfrac{1}{2} = 5$$\n\n$$\\text{আভ্যন্তৰীণ আয়তন} = 17\\times 9\\times 5 = 765\\ \\text{cm}^3$$",
        "উক্তি (A) সত্য, যুক্তি (R) সত্য, আৰু $765\\ \\text{cm}^3$ ওলোৱা নিয়মটোৱেই হৈছে যুক্তি (R)। শুদ্ধ বিকল্প: (A)।",
        "বিয়োগ কৰাৰ আগতে ডাঠখিনি মিলিমিটাৰৰ পৰা চেণ্টিমিটাৰলৈ সলনি কৰিব লাগে, নহ'লে বাকচটোৰ জোখ ঋণাত্মক হৈ পৰে।",
      ),
    },
  },
  {
    id: "ar52-cone-solid-rotation",
    difficulty: "easy",
    correctIndex: 2,
    en: {
      question: arQuestion(
        "en",
        "A cone is a solid figure.",
        "A cone is generated when a rectangular sheet is rotated about its axis.",
      ),
      options: AR_OPTIONS_EN,
      explanation: sol(
        "en",
        "",
        "A cone is indeed a three-dimensional solid, so the Assertion is true.\n\nBut rotating a **rectangle** about one of its sides sweeps out a **cylinder**, not a cone. A cone is produced by rotating a **right triangle** about one of the sides containing the right angle.",
        "The Assertion is a correct statement but the Reason is a wrong statement. Correct option: (C).",
        "Rotating a semicircle about its diameter is the third member of this family — it generates a sphere.",
      ),
    },
    as: {
      question: arQuestion(
        "as",
        "শংকু এটা ঘনবস্তু।",
        "এখন আয়তাকাৰ পাতক ইয়াৰ অক্ষৰ চাৰিওফালে ঘূৰালে এটা শংকু গঠিত হয়।",
      ),
      options: AR_OPTIONS_AS,
      explanation: sol(
        "as",
        "",
        "শংকু সঁচাকৈয়ে এটা ত্ৰিমাত্ৰিক ঘনবস্তু, গতিকে উক্তি (A) সত্য।\n\nকিন্তু এখন **আয়তক্ষেত্ৰ** ক ইয়াৰ এটা বাহুৰ চাৰিওফালে ঘূৰালে এটা **বেলন** সৃষ্টি হয়, শংকু নহয়। শংকু গঠিত হয় এটা **সমকোণী ত্ৰিভুজ** ক সমকোণ ধাৰণ কৰা এটা বাহুৰ চাৰিওফালে ঘূৰালে।",
        "উক্তি (A) সত্য কিন্তু যুক্তি (R) অসত্য। শুদ্ধ বিকল্প: (C)।",
        "এই শ্ৰেণীৰ তৃতীয়টো হ'ল অৰ্ধবৃত্ত এখনক ইয়াৰ ব্যাসৰ চাৰিওফালে ঘূৰোৱা — তাৰ পৰা এটা গোলক গঠিত হয়।",
      ),
    },
  },
  {
    id: "ar53-cone-slant-from-csa-550",
    difficulty: "moderate",
    correctIndex: 3,
    en: {
      question: arQuestion(
        "en",
        "The curved surface area of a cone is $550\\ \\text{cm}^2$ and its diameter is $14$ cm; hence its slant height is $20$ cm.",
        "The curved surface area of a cone whose base radius is $r$ and whose slant height is $l$ equals $\\pi r l$.",
      ),
      options: AR_OPTIONS_EN,
      explanation: sol(
        "en",
        "CSA $= 550\\ \\text{cm}^2$, $d = 14\\ \\text{cm} \\Rightarrow r = 7\\ \\text{cm}$.",
        "The Reason is a standard, correct formula. Applying it:\n\n$$\\pi r l = 550 \\implies \\frac{22}{7}\\times 7\\times l = 550 \\implies 22l = 550$$\n\n$$l = \\frac{550}{22} = 25\\ \\text{cm}$$\n\nThe slant height is $25$ cm, not the $20$ cm claimed.",
        "The Assertion is a wrong statement but the Reason is a correct statement. Correct option: (D).",
        "The diameter is $14$ cm, so the radius is $7$ cm — using $14$ as the radius would have given $l = 12.5$ cm, which is not $20$ cm either.",
      ),
    },
    as: {
      question: arQuestion(
        "as",
        "এটা শংকুৰ বক্ৰ পৃষ্ঠকালি $550\\ \\text{cm}^2$ আৰু ইয়াৰ ব্যাস $14$ চে.মি.; সেয়েহে ইয়াৰ তিৰ্যক উচ্চতা $20$ চে.মি.।",
        "যিটো শংকুৰ ভূমিৰ ব্যাসাৰ্ধ $r$ আৰু তিৰ্যক উচ্চতা $l$, তাৰ বক্ৰ পৃষ্ঠকালি $\\pi r l$।",
      ),
      options: AR_OPTIONS_AS,
      explanation: sol(
        "as",
        "CSA $= 550\\ \\text{cm}^2$, $d = 14\\ \\text{cm} \\Rightarrow r = 7\\ \\text{cm}$।",
        "যুক্তি (R) এটা প্ৰামাণিক আৰু শুদ্ধ সূত্ৰ। ইয়াক প্ৰয়োগ কৰিলে:\n\n$$\\pi r l = 550 \\implies \\frac{22}{7}\\times 7\\times l = 550 \\implies 22l = 550$$\n\n$$l = \\frac{550}{22} = 25\\ \\text{cm}$$\n\nতিৰ্যক উচ্চতা $25$ চে.মি., দাবী কৰা $20$ চে.মি. নহয়।",
        "উক্তি (A) অসত্য কিন্তু যুক্তি (R) সত্য। শুদ্ধ বিকল্প: (D)।",
        "ব্যাস $14$ চে.মি., গতিকে ব্যাসাৰ্ধ $7$ চে.মি. — $14$ ক ব্যাসাৰ্ধ ধৰিলে $l = 12.5$ চে.মি. ওলালহেঁতেন, সেইটোও $20$ চে.মি. নহয়।",
      ),
    },
  },
  {
    id: "ar54-sphere-radius-tripled",
    difficulty: "moderate",
    correctIndex: 2,
    en: {
      question: arQuestion(
        "en",
        "If the radius of a sphere is tripled, the ratio of the volume of the original sphere to that of the new one is $1 : 27$.",
        "The volume of a sphere of radius $r$ is $4\\pi r^3$.",
      ),
      options: AR_OPTIONS_EN,
      explanation: sol(
        "en",
        "original radius $= r$, new radius $= 3r$.",
        "$$\\frac{V_{\\text{old}}}{V_{\\text{new}}} = \\frac{\\tfrac{4}{3}\\pi r^3}{\\tfrac{4}{3}\\pi (3r)^3} = \\frac{r^3}{27r^3} = \\frac{1}{27}$$\n\nSo the Assertion is correct.\n\nThe Reason, however, states the formula as $4\\pi r^3$. The correct volume of a sphere is $\\dfrac{4}{3}\\pi r^3$ — the factor $\\dfrac{1}{3}$ is missing.",
        "The Assertion is a correct statement but the Reason is a wrong statement. Correct option: (C).",
        "The ratio survives the error because the same wrong constant would cancel top and bottom — but a stated formula still has to be right.",
      ),
    },
    as: {
      question: arQuestion(
        "as",
        "এটা গোলকৰ ব্যাসাৰ্ধ তিনি গুণ কৰিলে, আগৰ গোলকটোৰ আয়তন আৰু নতুনটোৰ আয়তনৰ অনুপাত $1 : 27$ হয়।",
        "$r$ ব্যাসাৰ্ধৰ এটা গোলকৰ আয়তন $4\\pi r^3$।",
      ),
      options: AR_OPTIONS_AS,
      explanation: sol(
        "as",
        "আগৰ ব্যাসাৰ্ধ $= r$, নতুন ব্যাসাৰ্ধ $= 3r$।",
        "$$\\frac{V_{\\text{old}}}{V_{\\text{new}}} = \\frac{\\tfrac{4}{3}\\pi r^3}{\\tfrac{4}{3}\\pi (3r)^3} = \\frac{r^3}{27r^3} = \\frac{1}{27}$$\n\nগতিকে উক্তি (A) শুদ্ধ।\n\nকিন্তু যুক্তি (R) ত সূত্ৰটো $4\\pi r^3$ বুলি কোৱা হৈছে। গোলকৰ শুদ্ধ আয়তন হ'ল $\\dfrac{4}{3}\\pi r^3$ — $\\dfrac{1}{3}$ গুণকটো নাই।",
        "উক্তি (A) সত্য কিন্তু যুক্তি (R) অসত্য। শুদ্ধ বিকল্প: (C)।",
        "অনুপাতটোত ভুলটোৰ প্ৰভাৱ নপৰে কাৰণ একেই ভুল ধ্ৰুৱকটো লব আৰু হৰত কাটি যায় — তথাপি লিখা সূত্ৰটো শুদ্ধ হ'বই লাগিব।",
      ),
    },
  },
  {
    id: "ar55-cone-hemisphere-height-ratio",
    difficulty: "hard",
    correctIndex: 1,
    en: {
      question: arQuestion(
        "en",
        "If a cone and a hemisphere have the same base and the same volume, the ratio of their heights is $2 : 1$.",
        "The volume of a cylinder of height $h$ and base radius $r$ is $\\pi r^2 h$.",
      ),
      options: AR_OPTIONS_EN,
      explanation: sol(
        "en",
        "the cone and the hemisphere share base radius $r$; let the cone's height be $h$. Their volumes are equal.",
        "$$\\frac{1}{3}\\pi r^2 h = \\frac{2}{3}\\pi r^3 \\implies h = 2r$$\n\nThe height of a hemisphere is its own radius $r$, so\n\n$$\\frac{h_{\\text{cone}}}{h_{\\text{hemisphere}}} = \\frac{2r}{r} = \\frac{2}{1}$$\n\nThe Assertion is correct. The Reason states the volume of a cylinder, which is also a correct statement — but no cylinder appears anywhere in the Assertion, so it explains nothing.",
        "Both the Assertion and the Reason are correct statements, but the Reason is not the correct explanation of the Assertion. Correct option: (B).",
        "For option (A) the Reason would have had to quote the volume of a cone or of a hemisphere.",
      ),
    },
    as: {
      question: arQuestion(
        "as",
        "যদি এটা শংকু আৰু এটা অৰ্ধগোলকৰ ভূমি একেই আৰু আয়তনো একেই, তেন্তে সিহঁতৰ উচ্চতাৰ অনুপাত $2 : 1$।",
        "$h$ উচ্চতা আৰু $r$ ভূমি-ব্যাসাৰ্ধৰ এটা বেলনৰ আয়তন $\\pi r^2 h$।",
      ),
      options: AR_OPTIONS_AS,
      explanation: sol(
        "as",
        "শংকু আৰু অৰ্ধগোলক দুয়োটাৰে ভূমিৰ ব্যাসাৰ্ধ $r$; শংকুটোৰ উচ্চতা $h$ ধৰা হ'ল। সিহঁতৰ আয়তন সমান।",
        "$$\\frac{1}{3}\\pi r^2 h = \\frac{2}{3}\\pi r^3 \\implies h = 2r$$\n\nঅৰ্ধগোলকৰ উচ্চতা ইয়াৰ নিজৰ ব্যাসাৰ্ধ $r$, গতিকে\n\n$$\\frac{h_{\\text{cone}}}{h_{\\text{hemisphere}}} = \\frac{2r}{r} = \\frac{2}{1}$$\n\nউক্তি (A) শুদ্ধ। যুক্তি (R) ত বেলনৰ আয়তন কোৱা হৈছে, সেইটোও এটা শুদ্ধ উক্তি — কিন্তু উক্তি (A) ত ক'তো বেলন এটা নাই, গতিকে ই একোৱেই ব্যাখ্যা নকৰে।",
        "উক্তি (A) আৰু যুক্তি (R) দুয়োটাই সত্য, কিন্তু যুক্তি (R), উক্তি (A) ৰ শুদ্ধ ব্যাখ্যা নহয়। শুদ্ধ বিকল্প: (B)।",
        "বিকল্প (A) হ'বলৈ যুক্তি (R) ত শংকু বা অৰ্ধগোলকৰ আয়তনৰ সূত্ৰ থাকিব লাগিছিল।",
      ),
    },
  },
];
