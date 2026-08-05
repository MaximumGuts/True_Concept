/**
 * The 35 objective-type MCQs of Books/TpA6OWPT3v9ql0s11FBO.pdf
 * ("Surface Areas and Volumes", OBJECTIVE TYPE QUESTIONS 1-35; the printed
 * ANSWERS section on pp. 6-9 supplies every worked solution).
 *
 * Wording is paraphrased for copyright; every number, option set and answer is
 * unchanged.  Q17's option (B) and Q19's option (B) were read off the rendered
 * page images because the text layer mangled the stacked fractions.
 */
import { McqItem, sol } from "./_sav_bank";

export const MCQ_B: McqItem[] = [
  {
    id: "b01-cube-sa-side-5",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question: "The surface area of a cube of edge $5$ cm is",
      options: ["$125\\ \\text{cm}^2$", "$28\\ \\text{cm}^2$", "$100\\ \\text{cm}^2$", "$150\\ \\text{cm}^2$"],
      explanation: sol(
        "en",
        "edge of the cube $a = 5\\ \\text{cm}$.",
        "$$\\text{Surface area} = 6a^2 = 6\\times 5^2 = 6\\times 25 = 150\\ \\text{cm}^2$$",
        "The surface area is $150\\ \\text{cm}^2$ — option (D).",
        "Option (A), $125$, is the **volume** $a^3$, not the surface area.",
      ),
    },
    as: {
      question: "$5$ চে.মি. ধাৰৰ এটা ঘনকৰ পৃষ্ঠকালি হ'ল",
      options: ["$125\\ \\text{cm}^2$", "$28\\ \\text{cm}^2$", "$100\\ \\text{cm}^2$", "$150\\ \\text{cm}^2$"],
      explanation: sol(
        "as",
        "ঘনকটোৰ ধাৰ $a = 5\\ \\text{cm}$।",
        "$$\\text{পৃষ্ঠকালি} = 6a^2 = 6\\times 5^2 = 6\\times 25 = 150\\ \\text{cm}^2$$",
        "পৃষ্ঠকালি $150\\ \\text{cm}^2$ — বিকল্প (D)।",
        "বিকল্প (A), $125$ হ'ল **আয়তন** $a^3$, পৃষ্ঠকালি নহয়।",
      ),
    },
  },
  {
    id: "b02-cube-side-from-tsa-216",
    difficulty: "easy",
    correctIndex: 2,
    en: {
      question: "The total surface area of a cube is $216\\ \\text{cm}^2$. Each of its edges measures",
      options: ["$4$ cm", "$5$ cm", "$6$ cm", "$7$ cm"],
      explanation: sol(
        "en",
        "TSA of the cube $= 216\\ \\text{cm}^2$.",
        "$$6a^2 = 216 \\implies a^2 = 36 \\implies a = 6\\ \\text{cm}$$",
        "Each edge is $6$ cm — option (C).",
      ),
    },
    as: {
      question: "এটা ঘনকৰ সম্পূৰ্ণ পৃষ্ঠকালি $216\\ \\text{cm}^2$। ইয়াৰ প্ৰতিটো ধাৰৰ জোখ হ'ল",
      options: ["$4$ চে.মি.", "$5$ চে.মি.", "$6$ চে.মি.", "$7$ চে.মি."],
      explanation: sol(
        "as",
        "ঘনকটোৰ সম্পূৰ্ণ পৃষ্ঠকালি $= 216\\ \\text{cm}^2$।",
        "$$6a^2 = 216 \\implies a^2 = 36 \\implies a = 6\\ \\text{cm}$$",
        "প্ৰতিটো ধাৰ $6$ চে.মি. — বিকল্প (C)।",
      ),
    },
  },
  {
    id: "b03-cuboid-tsa-formula",
    difficulty: "easy",
    correctIndex: 1,
    en: {
      question:
        "The total surface area of a cuboid whose dimensions are $x$ units, $y$ units and $z$ units is _______ sq. units.",
      options: ["$4\\{xy+yz+zx\\}$", "$2\\{xy+yz+zx\\}$", "$3\\{xy+yz+zx\\}$", "none of these"],
      explanation: sol(
        "en",
        "$l = x$, $b = y$, $h = z$.",
        "A cuboid has three **pairs** of identical rectangular faces, of areas $xy$, $yz$ and $zx$.\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2\\{xy+yz+zx\\}$$",
        "The total surface area is $2\\{xy+yz+zx\\}$ sq. units — option (B).",
      ),
    },
    as: {
      question:
        "$x$ একক, $y$ একক আৰু $z$ একক জোখৰ এটা আয়তঘনৰ সম্পূৰ্ণ পৃষ্ঠকালি _______ বৰ্গ একক।",
      options: ["$4\\{xy+yz+zx\\}$", "$2\\{xy+yz+zx\\}$", "$3\\{xy+yz+zx\\}$", "ইয়াৰ কোনোটোৱেই নহয়"],
      explanation: sol(
        "as",
        "$l = x$, $b = y$, $h = z$।",
        "আয়তঘন এটাত $xy$, $yz$ আৰু $zx$ কালিৰ তিনি **যোৰ** একেধৰণৰ আয়তাকাৰ পৃষ্ঠ থাকে।\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2\\{xy+yz+zx\\}$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $2\\{xy+yz+zx\\}$ বৰ্গ একক — বিকল্প (B)।",
      ),
    },
  },
  {
    id: "b04-cube-lsa-formula",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question: "The lateral surface area of a cube of edge $a$ units is _______ sq. units.",
      options: ["$4a^2$", "$6a^2$", "$a^2$", "$a^3$"],
      explanation: sol(
        "en",
        "edge of the cube $= a$ units.",
        "The lateral surface consists of the four **side** faces only — the top and the bottom are left out.\n\n$$\\text{LSA} = 4a^2$$",
        "The lateral surface area is $4a^2$ sq. units — option (A).",
        "$6a^2$ is the total surface area, which includes the top and bottom faces as well.",
      ),
    },
    as: {
      question: "$a$ একক ধাৰৰ এটা ঘনকৰ কাষৰ পৃষ্ঠকালি _______ বৰ্গ একক।",
      options: ["$4a^2$", "$6a^2$", "$a^2$", "$a^3$"],
      explanation: sol(
        "as",
        "ঘনকটোৰ ধাৰ $= a$ একক।",
        "কাষৰ পৃষ্ঠকালিত কেৱল চাৰিখন **কাষৰ** পৃষ্ঠহে ধৰা হয় — ওপৰ আৰু তলৰ পৃষ্ঠ দুখন বাদ দিয়া হয়।\n\n$$\\text{LSA} = 4a^2$$",
        "কাষৰ পৃষ্ঠকালি $4a^2$ বৰ্গ একক — বিকল্প (A)।",
        "$6a^2$ হ'ল সম্পূৰ্ণ পৃষ্ঠকালি, য'ত ওপৰ আৰু তলৰ পৃষ্ঠ দুখনো ধৰা হৈছে।",
      ),
    },
  },
  {
    id: "b05-cuboid-equal-face-pairs",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question: "The number of pairs of faces of equal area in a cuboid is",
      options: ["$6$", "$4$", "$2$", "$3$"],
      explanation: sol(
        "en",
        "a cuboid of length $l$, breadth $b$, height $h$.",
        "Its six faces come in matching pairs: two of area $lb$, two of area $bh$ and two of area $hl$.",
        "There are $3$ such pairs — option (D).",
        "Option (A), $6$, counts the faces themselves rather than the pairs.",
      ),
    },
    as: {
      question: "এটা আয়তঘনত সমান কালিৰ পৃষ্ঠৰ যোৰৰ সংখ্যা হ'ল",
      options: ["$6$", "$4$", "$2$", "$3$"],
      explanation: sol(
        "as",
        "$l$ দৈৰ্ঘ্য, $b$ প্ৰস্থ আৰু $h$ উচ্চতাৰ এটা আয়তঘন।",
        "ইয়াৰ ছখন পৃষ্ঠ যোৰ পাতি থাকে: $lb$ কালিৰ দুখন, $bh$ কালিৰ দুখন আৰু $hl$ কালিৰ দুখন।",
        "এনে যোৰৰ সংখ্যা $3$ — বিকল্প (D)।",
        "বিকল্প (A), $6$ এ যোৰ নহয়, পৃষ্ঠকেইখনকহে গণিছে।",
      ),
    },
  },
  {
    id: "b06-cube-lsa-side-6",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question: "The lateral surface area of a cube of edge $6$ units is",
      options: ["$144$ sq. units", "$154$ sq. units", "$134$ sq. units", "$216$ sq. units"],
      explanation: sol(
        "en",
        "edge $a = 6$ units.",
        "$$\\text{LSA} = 4a^2 = 4\\times 6^2 = 4\\times 36 = 144\\ \\text{sq. units}$$",
        "The lateral surface area is $144$ sq. units — option (A).",
        "Option (D), $216$, is $6a^2$ with $a = 6$ — the total surface area, or coincidentally $a^3$ as well.",
      ),
    },
    as: {
      question: "$6$ একক ধাৰৰ এটা ঘনকৰ কাষৰ পৃষ্ঠকালি হ'ল",
      options: ["$144$ বৰ্গ একক", "$154$ বৰ্গ একক", "$134$ বৰ্গ একক", "$216$ বৰ্গ একক"],
      explanation: sol(
        "as",
        "ধাৰ $a = 6$ একক।",
        "$$\\text{LSA} = 4a^2 = 4\\times 6^2 = 4\\times 36 = 144\\ \\text{বৰ্গ একক}$$",
        "কাষৰ পৃষ্ঠকালি $144$ বৰ্গ একক — বিকল্প (A)।",
        "বিকল্প (D), $216$ হ'ল $a = 6$ ৰ বাবে $6a^2$ — সম্পূৰ্ণ পৃষ্ঠকালি, আৰু কাকতালীয়ভাৱে $a^3$ ও।",
      ),
    },
  },
  {
    id: "b07-cuboid-tsa-12-9-8",
    difficulty: "easy",
    correctIndex: 1,
    en: {
      question: "A cuboid is $12$ cm long, $9$ cm broad and $8$ cm high. Its total surface area is",
      options: ["$864\\ \\text{cm}^2$", "$552\\ \\text{cm}^2$", "$432\\ \\text{cm}^2$", "$276\\ \\text{cm}^2$"],
      explanation: sol(
        "en",
        "$l = 12\\ \\text{cm}$, $b = 9\\ \\text{cm}$, $h = 8\\ \\text{cm}$.",
        "$$\\text{TSA} = 2(lb+bh+hl) = 2\\big[(12\\times 9)+(9\\times 8)+(12\\times 8)\\big]$$\n\n$$= 2(108+72+96) = 2\\times 276 = 552\\ \\text{cm}^2$$",
        "The total surface area is $552\\ \\text{cm}^2$ — option (B).",
        "Option (D), $276$, is the bracket before it is doubled.",
      ),
    },
    as: {
      question: "এটা আয়তঘন $12$ চে.মি. দীঘল, $9$ চে.মি. বহল আৰু $8$ চে.মি. ওখ। ইয়াৰ সম্পূৰ্ণ পৃষ্ঠকালি হ'ল",
      options: ["$864\\ \\text{cm}^2$", "$552\\ \\text{cm}^2$", "$432\\ \\text{cm}^2$", "$276\\ \\text{cm}^2$"],
      explanation: sol(
        "as",
        "$l = 12\\ \\text{cm}$, $b = 9\\ \\text{cm}$, $h = 8\\ \\text{cm}$।",
        "$$\\text{TSA} = 2(lb+bh+hl) = 2\\big[(12\\times 9)+(9\\times 8)+(12\\times 8)\\big]$$\n\n$$= 2(108+72+96) = 2\\times 276 = 552\\ \\text{cm}^2$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $552\\ \\text{cm}^2$ — বিকল্প (B)।",
        "বিকল্প (D), $276$ হ'ল দুগুণ কৰাৰ আগৰ বন্ধনীটোৰ মান।",
      ),
    },
  },
  {
    id: "b08-two-unit-cubes-joined",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "The edge of a cube is $1$ cm. When two such cubes are joined face to face, the total surface area of the figure formed is",
      options: [
        "$2(2+1+2)\\ \\text{cm}^2$",
        "$2(2+2+2)\\ \\text{cm}^2$",
        "$2(1+1+1)\\ \\text{cm}^2$",
        "$2(1+1+2)\\ \\text{cm}^2$",
      ],
      explanation: sol(
        "en",
        "two cubes, each of edge $1$ cm, joined along one face.",
        "The result is a cuboid with\n\n$$l = 2\\ \\text{cm},\\quad b = 1\\ \\text{cm},\\quad h = 1\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2(2\\times 1 + 1\\times 1 + 1\\times 2) = 2(2+1+2)\\ \\text{cm}^2$$",
        "The total surface area is $2(2+1+2)\\ \\text{cm}^2$, i.e. $10\\ \\text{cm}^2$ — option (A).",
        "Two separate cubes would have had $2\\times 6 = 12\\ \\text{cm}^2$; joining them hides the two touching faces, which is exactly the $2\\ \\text{cm}^2$ lost.",
      ),
    },
    as: {
      question:
        "এটা ঘনকৰ ধাৰ $1$ চে.মি.। এনে দুটা ঘনক পৃষ্ঠে-পৃষ্ঠে লগ লগাই দিলে, গঠিত আকৃতিটোৰ সম্পূৰ্ণ পৃষ্ঠকালি হ'ব",
      options: [
        "$2(2+1+2)\\ \\text{cm}^2$",
        "$2(2+2+2)\\ \\text{cm}^2$",
        "$2(1+1+1)\\ \\text{cm}^2$",
        "$2(1+1+2)\\ \\text{cm}^2$",
      ],
      explanation: sol(
        "as",
        "প্ৰতিটো $1$ চে.মি. ধাৰৰ দুটা ঘনক এখন পৃষ্ঠেৰে লগ লগোৱা হৈছে।",
        "ফলত পোৱা আয়তঘনটোৰ\n\n$$l = 2\\ \\text{cm},\\quad b = 1\\ \\text{cm},\\quad h = 1\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2(2\\times 1 + 1\\times 1 + 1\\times 2) = 2(2+1+2)\\ \\text{cm}^2$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $2(2+1+2)\\ \\text{cm}^2$, অৰ্থাৎ $10\\ \\text{cm}^2$ — বিকল্প (A)।",
        "পৃথকে থাকিলে দুটা ঘনকৰ মুঠ $2\\times 6 = 12\\ \\text{cm}^2$ হ'লহেঁতেন; লগ লগালে স্পৰ্শ কৰা পৃষ্ঠ দুখন ঢাক খায়, সেয়াই হেৰোৱা $2\\ \\text{cm}^2$।",
      ),
    },
  },
  {
    id: "b09-cuboid-edges-doubled",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "If every edge of a cuboid whose total surface area is $S$ is doubled, the total surface area of the new cuboid is",
      options: ["$2S$", "$4S$", "$6S$", "$8S$"],
      explanation: sol(
        "en",
        "$2(lb+bh+hl) = S$; the new dimensions are $2l$, $2b$, $2h$.",
        "$$\\text{new TSA} = 2\\big[(2l)(2b)+(2b)(2h)+(2h)(2l)\\big] = 2\\big[4lb+4bh+4hl\\big]$$\n\n$$= 4\\times 2(lb+bh+hl) = 4S$$",
        "The new total surface area is $4S$ — option (B).",
        "Surface area is a two-dimensional measure, so it scales by $2^2 = 4$; option (D), $8S$, is how the **volume** scales.",
      ),
    },
    as: {
      question:
        "যিটো আয়তঘনৰ সম্পূৰ্ণ পৃষ্ঠকালি $S$, তাৰ প্ৰতিটো ধাৰ দুগুণ কৰিলে নতুন আয়তঘনটোৰ সম্পূৰ্ণ পৃষ্ঠকালি হ'ব",
      options: ["$2S$", "$4S$", "$6S$", "$8S$"],
      explanation: sol(
        "as",
        "$2(lb+bh+hl) = S$; নতুন জোখকেইটা $2l$, $2b$, $2h$।",
        "$$\\text{নতুন TSA} = 2\\big[(2l)(2b)+(2b)(2h)+(2h)(2l)\\big] = 2\\big[4lb+4bh+4hl\\big]$$\n\n$$= 4\\times 2(lb+bh+hl) = 4S$$",
        "নতুন সম্পূৰ্ণ পৃষ্ঠকালি $4S$ — বিকল্প (B)।",
        "পৃষ্ঠকালি এটা দ্বিমাত্ৰিক জোখ, গতিকে ই $2^2 = 4$ গুণ হয়; বিকল্প (D), $8S$ হ'ল **আয়তন** কেনেকৈ বাঢ়ে তাৰ উত্তৰ।",
      ),
    },
  },
  {
    id: "b10-six-cubes-joined",
    difficulty: "moderate",
    correctIndex: 3,
    en: {
      question:
        "Six cubes, each of edge $2$ cm, are joined in a row. The total surface area (in $\\text{cm}^2$) of the resulting cuboid is",
      options: ["$144$", "$48$", "$24$", "$104$"],
      explanation: sol(
        "en",
        "six cubes of edge $2$ cm joined end to end.",
        "The resulting cuboid has\n\n$$l = 6\\times 2 = 12\\ \\text{cm},\\quad b = 2\\ \\text{cm},\\quad h = 2\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2\\big[(12\\times 2)+(2\\times 2)+(2\\times 12)\\big]$$\n\n$$= 2(24+4+24) = 2\\times 52 = 104\\ \\text{cm}^2$$",
        "The total surface area is $104\\ \\text{cm}^2$ — option (D).",
        "Option (A), $144$, is $6\\times 24$: the surface area the six cubes would have had if they had stayed apart.",
      ),
    },
    as: {
      question:
        "প্ৰতিটো $2$ চে.মি. ধাৰৰ ছটা ঘনক শাৰী পাতি লগ লগোৱা হ'ল। ফলত পোৱা আয়তঘনটোৰ সম্পূৰ্ণ পৃষ্ঠকালি ($\\text{cm}^2$ ত) হ'ল",
      options: ["$144$", "$48$", "$24$", "$104$"],
      explanation: sol(
        "as",
        "$2$ চে.মি. ধাৰৰ ছটা ঘনক মূৰে-মূৰে লগ লগোৱা হৈছে।",
        "ফলত পোৱা আয়তঘনটোৰ\n\n$$l = 6\\times 2 = 12\\ \\text{cm},\\quad b = 2\\ \\text{cm},\\quad h = 2\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2\\big[(12\\times 2)+(2\\times 2)+(2\\times 12)\\big]$$\n\n$$= 2(24+4+24) = 2\\times 52 = 104\\ \\text{cm}^2$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $104\\ \\text{cm}^2$ — বিকল্প (D)।",
        "বিকল্প (A), $144$ হ'ল $6\\times 24$: ঘনক ছটা পৃথকে থাকিলে যিমান পৃষ্ঠকালি হ'লহেঁতেন।",
      ),
    },
  },
  {
    id: "b11-cube-side-up-50pc",
    difficulty: "hard",
    correctIndex: 2,
    en: {
      question: "If each edge of a cube is increased by $50\\%$, its surface area increases by",
      options: ["$50\\%$", "$100\\%$", "$125\\%$", "$150\\%$"],
      explanation: sol(
        "en",
        "original edge $= a$; new edge $= a + 50\\%$ of $a$.",
        "$$\\text{new edge} = a + \\frac{a}{2} = \\frac{3a}{2}$$\n\n$$S_1 = 6a^2, \\qquad S_2 = 6\\left(\\frac{3a}{2}\\right)^2 = \\frac{9}{4}\\times 6a^2$$\n\n$$\\text{increase} = \\frac{S_2-S_1}{S_1}\\times 100\\% = \\left(\\frac{9}{4}-1\\right)\\times 100\\% = \\frac{5}{4}\\times 100\\%$$",
        "The surface area increases by $125\\%$ — option (C).",
        "The area becomes $\\tfrac94$ of what it was, which is a $125\\%$ **increase**, not a $225\\%$ one — the original $100\\%$ must be subtracted.",
      ),
    },
    as: {
      question: "এটা ঘনকৰ প্ৰতিটো ধাৰ $50\\%$ বৃদ্ধি কৰিলে ইয়াৰ পৃষ্ঠকালি বাঢ়ে",
      options: ["$50\\%$", "$100\\%$", "$125\\%$", "$150\\%$"],
      explanation: sol(
        "as",
        "আৰম্ভণিৰ ধাৰ $= a$; নতুন ধাৰ $= a$ ৰ লগত $a$ ৰ $50\\%$।",
        "$$\\text{নতুন ধাৰ} = a + \\frac{a}{2} = \\frac{3a}{2}$$\n\n$$S_1 = 6a^2, \\qquad S_2 = 6\\left(\\frac{3a}{2}\\right)^2 = \\frac{9}{4}\\times 6a^2$$\n\n$$\\text{বৃদ্ধি} = \\frac{S_2-S_1}{S_1}\\times 100\\% = \\left(\\frac{9}{4}-1\\right)\\times 100\\% = \\frac{5}{4}\\times 100\\%$$",
        "পৃষ্ঠকালি $125\\%$ বাঢ়ে — বিকল্প (C)।",
        "কালিটো আগৰ $\\tfrac94$ গুণ হয়, যিটো $125\\%$ **বৃদ্ধি**, $225\\%$ নহয় — আগৰ $100\\%$ টো বিয়োগ কৰিব লাগে।",
      ),
    },
  },
  {
    id: "b12-cylinder-radius-csa-two-thirds",
    difficulty: "hard",
    correctIndex: 1,
    en: {
      question:
        "The curved surface area of a right circular cylinder of height $15$ cm is $\\dfrac{2}{3}$ of the sum of the areas of its two circular faces. Find the radius of its base.",
      options: ["$22$ cm", "$22.5$ cm", "$20$ cm", "$20.5$ cm"],
      explanation: sol(
        "en",
        "$h = 15\\ \\text{cm}$, and $\\text{CSA} = \\dfrac{2}{3}\\times(\\text{sum of the two circular faces})$.",
        "$$2\\pi r h = \\frac{2}{3}\\big(2\\pi r^2\\big)$$\n\nCancelling $2\\pi r$ from both sides,\n\n$$h = \\frac{2}{3}r \\implies 15 = \\frac{2}{3}r \\implies r = \\frac{45}{2} = 22.5\\ \\text{cm}$$",
        "The radius of the base is $22.5$ cm — option (B).",
        "The two circular faces together have area $2\\pi r^2$, not $\\pi r^2$ — halving that is the usual slip.",
      ),
    },
    as: {
      question:
        "$15$ চে.মি. উচ্চতাৰ এটা সমবৃত্তভূমিক বেলনৰ বক্ৰ পৃষ্ঠকালি, ইয়াৰ চক্ৰীয় পৃষ্ঠ দুখনৰ কালিৰ যোগফলৰ $\\dfrac{2}{3}$ ভাগ। ইয়াৰ ভূমিৰ ব্যাসাৰ্ধ নিৰ্ণয় কৰা।",
      options: ["$22$ চে.মি.", "$22.5$ চে.মি.", "$20$ চে.মি.", "$20.5$ চে.মি."],
      explanation: sol(
        "as",
        "$h = 15\\ \\text{cm}$, আৰু $\\text{CSA} = \\dfrac{2}{3}\\times(\\text{চক্ৰীয় পৃষ্ঠ দুখনৰ কালিৰ যোগফল})$।",
        "$$2\\pi r h = \\frac{2}{3}\\big(2\\pi r^2\\big)$$\n\nদুয়োফালৰ পৰা $2\\pi r$ কাটিলে,\n\n$$h = \\frac{2}{3}r \\implies 15 = \\frac{2}{3}r \\implies r = \\frac{45}{2} = 22.5\\ \\text{cm}$$",
        "ভূমিৰ ব্যাসাৰ্ধ $22.5$ চে.মি. — বিকল্প (B)।",
        "চক্ৰীয় পৃষ্ঠ দুখনৰ মুঠ কালি $2\\pi r^2$, $\\pi r^2$ নহয় — ইয়াক আধা কৰাটোৱেই সাধাৰণ ভুল।",
      ),
    },
  },
  {
    id: "b13-cylinder-h-plus-r",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "The total surface area of a cylinder is $550\\ \\text{cm}^2$ and the circumference of its base is $50$ cm. The sum of its height and its radius is",
      options: ["$11$ cm", "$50$ cm", "$45$ cm", "$55$ cm"],
      explanation: sol(
        "en",
        "$\\text{TSA} = 2\\pi r(h+r) = 550\\ \\text{cm}^2$, circumference $= 2\\pi r = 50\\ \\text{cm}$.",
        "Divide the first equation by the second — the whole factor $2\\pi r$ cancels.\n\n$$\\frac{2\\pi r(h+r)}{2\\pi r} = \\frac{550}{50} \\implies h+r = 11\\ \\text{cm}$$",
        "The sum of the height and the radius is $11$ cm — option (A).",
        "Neither $h$ nor $r$ can be found separately from the data given, but their **sum** comes out at once.",
      ),
    },
    as: {
      question:
        "এটা বেলনৰ সম্পূৰ্ণ পৃষ্ঠকালি $550\\ \\text{cm}^2$ আৰু ইয়াৰ ভূমিৰ পৰিধি $50$ চে.মি.। ইয়াৰ উচ্চতা আৰু ব্যাসাৰ্ধৰ যোগফল হ'ল",
      options: ["$11$ চে.মি.", "$50$ চে.মি.", "$45$ চে.মি.", "$55$ চে.মি."],
      explanation: sol(
        "as",
        "$\\text{TSA} = 2\\pi r(h+r) = 550\\ \\text{cm}^2$, পৰিধি $= 2\\pi r = 50\\ \\text{cm}$।",
        "প্ৰথম সমীকৰণটো দ্বিতীয়টোৰে হৰণ কৰা — গোটেই $2\\pi r$ গুণকটো কাটি যায়।\n\n$$\\frac{2\\pi r(h+r)}{2\\pi r} = \\frac{550}{50} \\implies h+r = 11\\ \\text{cm}$$",
        "উচ্চতা আৰু ব্যাসাৰ্ধৰ যোগফল $11$ চে.মি. — বিকল্প (A)।",
        "দিয়া তথ্যৰ পৰা $h$ বা $r$ কোনোটোৱেই পৃথককৈ উলিয়াব নোৱাৰি, কিন্তু সিহঁতৰ **যোগফল** টো লগে লগে ওলাই পৰে।",
      ),
    },
  },
  {
    id: "b14-cylinder-lsa-factor",
    difficulty: "hard",
    correctIndex: 3,
    en: {
      question:
        "The altitude of a circular cylinder is made six times as large while its base area is reduced to one-ninth of its value. The factor by which the lateral surface area of the cylinder increases is",
      options: ["$\\dfrac{2}{3}$", "$\\dfrac{1}{2}$", "$\\dfrac{3}{2}$", "$2$"],
      explanation: sol(
        "en",
        "new height $= 6h$; new base area $= \\dfrac{1}{9}\\pi r^2$.",
        "$$\\text{new base area} = \\frac{1}{9}\\pi r^2 = \\pi\\left(\\frac{r}{3}\\right)^2 \\implies \\text{new radius} = \\frac{r}{3}$$\n\n$$\\text{old LSA} = 2\\pi r h, \\qquad \\text{new LSA} = 2\\pi\\left(\\frac{r}{3}\\right)(6h) = 4\\pi r h$$\n\n$$\\text{factor} = \\frac{4\\pi r h}{2\\pi r h} = 2$$",
        "The lateral surface area becomes $2$ times as large — option (D).",
        "The base area shrinks by a factor $9$, so the radius shrinks only by a factor $3$: it is the **square** of the radius that sits in the base area.",
      ),
    },
    as: {
      question:
        "এটা বৃত্তাকাৰ বেলনৰ উচ্চতা ছয় গুণ কৰা হ'ল আৰু ইয়াৰ ভূমিৰ কালি আগৰ এক-নৱমাংশলৈ কমোৱা হ'ল। বেলনটোৰ কাষৰ পৃষ্ঠকালি যিমান গুণ বাঢ়ে সেই গুণকটো হ'ল",
      options: ["$\\dfrac{2}{3}$", "$\\dfrac{1}{2}$", "$\\dfrac{3}{2}$", "$2$"],
      explanation: sol(
        "as",
        "নতুন উচ্চতা $= 6h$; নতুন ভূমিৰ কালি $= \\dfrac{1}{9}\\pi r^2$।",
        "$$\\text{নতুন ভূমিৰ কালি} = \\frac{1}{9}\\pi r^2 = \\pi\\left(\\frac{r}{3}\\right)^2 \\implies \\text{নতুন ব্যাসাৰ্ধ} = \\frac{r}{3}$$\n\n$$\\text{আগৰ LSA} = 2\\pi r h, \\qquad \\text{নতুন LSA} = 2\\pi\\left(\\frac{r}{3}\\right)(6h) = 4\\pi r h$$\n\n$$\\text{গুণক} = \\frac{4\\pi r h}{2\\pi r h} = 2$$",
        "কাষৰ পৃষ্ঠকালি $2$ গুণ হয় — বিকল্প (D)।",
        "ভূমিৰ কালি $9$ ভাগ কমে, গতিকে ব্যাসাৰ্ধ কমে মাত্ৰ $3$ ভাগ: ভূমিৰ কালিত ব্যাসাৰ্ধৰ **বৰ্গ** টোহে থাকে।",
      ),
    },
  },
  {
    id: "b15-cone-base-area-from-csa",
    difficulty: "hard",
    correctIndex: 3,
    en: {
      question:
        "A cone of slant height $\\dfrac{x}{2}$ has curved surface area $2\\pi x$. The area of its base is",
      options: ["$4\\pi$ sq. units", "$4\\pi x^2$ sq. units", "$\\pi x^2$ sq. units", "$16\\pi$ sq. units"],
      explanation: sol(
        "en",
        "slant height $l = \\dfrac{x}{2}$, curved surface area $= 2\\pi x$. Let the base radius be $R$.",
        "$$\\pi R l = 2\\pi x \\implies \\pi R\\left(\\frac{x}{2}\\right) = 2\\pi x$$\n\n$$\\frac{R}{2} = 2 \\implies R = 4$$\n\n$$\\text{base area} = \\pi R^2 = \\pi(4)^2 = 16\\pi\\ \\text{sq. units}$$",
        "The area of the base is $16\\pi$ sq. units — option (D).",
        "The variable $x$ cancels completely, which is why the answer carries no $x$ at all.",
      ),
    },
    as: {
      question:
        "$\\dfrac{x}{2}$ তিৰ্যক উচ্চতাৰ এটা শংকুৰ বক্ৰ পৃষ্ঠকালি $2\\pi x$। ইয়াৰ ভূমিৰ কালি হ'ল",
      options: ["$4\\pi$ বৰ্গ একক", "$4\\pi x^2$ বৰ্গ একক", "$\\pi x^2$ বৰ্গ একক", "$16\\pi$ বৰ্গ একক"],
      explanation: sol(
        "as",
        "তিৰ্যক উচ্চতা $l = \\dfrac{x}{2}$, বক্ৰ পৃষ্ঠকালি $= 2\\pi x$। ভূমিৰ ব্যাসাৰ্ধ $R$ ধৰা হ'ল।",
        "$$\\pi R l = 2\\pi x \\implies \\pi R\\left(\\frac{x}{2}\\right) = 2\\pi x$$\n\n$$\\frac{R}{2} = 2 \\implies R = 4$$\n\n$$\\text{ভূমিৰ কালি} = \\pi R^2 = \\pi(4)^2 = 16\\pi\\ \\text{বৰ্গ একক}$$",
        "ভূমিৰ কালি $16\\pi$ বৰ্গ একক — বিকল্প (D)।",
        "$x$ চলকটো সম্পূৰ্ণকৈ কাটি যায়, সেয়েহে উত্তৰটোত $x$ এটাও নাথাকে।",
      ),
    },
  },
  {
    id: "b16-two-cones-csa-ratio",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question:
        "Two cones have equal diameters. If their slant heights are in the ratio $5 : 4$, the ratio of their curved surface areas is",
      options: ["$4 : 5$", "$25 : 16$", "$16 : 25$", "$5 : 4$"],
      explanation: sol(
        "en",
        "the two cones share the same radius $r$; slant heights $= 5x$ and $4x$.",
        "$$\\frac{\\text{CSA}_1}{\\text{CSA}_2} = \\frac{\\pi r (5x)}{\\pi r (4x)} = \\frac{5}{4}$$",
        "The curved surface areas are in the ratio $5 : 4$ — option (D).",
        "Because the radii are equal, the CSA is directly proportional to the slant height; nothing gets squared here, so $25 : 16$ is a trap.",
      ),
    },
    as: {
      question:
        "দুটা শংকুৰ ব্যাস সমান। যদি সিহঁতৰ তিৰ্যক উচ্চতাৰ অনুপাত $5 : 4$, তেন্তে সিহঁতৰ বক্ৰ পৃষ্ঠকালিৰ অনুপাত হ'ল",
      options: ["$4 : 5$", "$25 : 16$", "$16 : 25$", "$5 : 4$"],
      explanation: sol(
        "as",
        "শংকু দুটাৰ ব্যাসাৰ্ধ একেই, $r$; তিৰ্যক উচ্চতা $5x$ আৰু $4x$।",
        "$$\\frac{\\text{CSA}_1}{\\text{CSA}_2} = \\frac{\\pi r (5x)}{\\pi r (4x)} = \\frac{5}{4}$$",
        "বক্ৰ পৃষ্ঠকালিৰ অনুপাত $5 : 4$ — বিকল্প (D)।",
        "ব্যাসাৰ্ধ সমান হোৱা বাবে বক্ৰ পৃষ্ঠকালি তিৰ্যক উচ্চতাৰ সৈতে সৰলভাৱে সমানুপাতিক; ইয়াত একোৱেই বৰ্গ নহয়, গতিকে $25 : 16$ এটা ফান্দ।",
      ),
    },
  },
  {
    id: "b17-cone-tsa-2r-half-l",
    difficulty: "moderate",
    correctIndex: 2,
    en: {
      question:
        "The total surface area of a cone whose radius is $2r$ and whose slant height is $\\dfrac{l}{2}$ is",
      options: [
        "$2\\pi r(l+r)$",
        "$\\pi r\\left(l+\\dfrac{r}{4}\\right)$",
        "$\\pi r(4r+l)$",
        "$2\\pi r$",
      ],
      explanation: sol(
        "en",
        "radius $R = 2r$, slant height $L = \\dfrac{l}{2}$.",
        "$$\\text{TSA} = \\pi R(L+R) = \\pi (2r)\\left(\\frac{l}{2}+2r\\right)$$\n\n$$= 2\\pi r\\left(\\frac{l}{2}+2r\\right) = \\pi r l + 4\\pi r^2 = \\pi r(l+4r)$$",
        "The total surface area is $\\pi r(4r+l)$ — option (C).",
        "Substitute $R$ and $L$ into $\\pi R(L+R)$ **before** expanding; substituting into $\\pi r(l+r)$ directly is what produces the wrong options.",
      ),
    },
    as: {
      question:
        "যিটো শংকুৰ ব্যাসাৰ্ধ $2r$ আৰু তিৰ্যক উচ্চতা $\\dfrac{l}{2}$, তাৰ সম্পূৰ্ণ পৃষ্ঠকালি হ'ল",
      options: [
        "$2\\pi r(l+r)$",
        "$\\pi r\\left(l+\\dfrac{r}{4}\\right)$",
        "$\\pi r(4r+l)$",
        "$2\\pi r$",
      ],
      explanation: sol(
        "as",
        "ব্যাসাৰ্ধ $R = 2r$, তিৰ্যক উচ্চতা $L = \\dfrac{l}{2}$।",
        "$$\\text{TSA} = \\pi R(L+R) = \\pi (2r)\\left(\\frac{l}{2}+2r\\right)$$\n\n$$= 2\\pi r\\left(\\frac{l}{2}+2r\\right) = \\pi r l + 4\\pi r^2 = \\pi r(l+4r)$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $\\pi r(4r+l)$ — বিকল্প (C)।",
        "বিস্তাৰ কৰাৰ **আগতে** $\\pi R(L+R)$ ত $R$ আৰু $L$ বহুৱাব লাগে; পোনে পোনে $\\pi r(l+r)$ ত বহুওৱাটোৱেই ভুল বিকল্পবোৰ ওলোৱাৰ কাৰণ।",
      ),
    },
  },
  {
    id: "b18-hemispherical-container-csa",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "The internal and external radii of a hemispherical container are $r_1$ and $r_2$ respectively. The curved surface area of the container is",
      options: [
        "$\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$",
        "$2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$",
        "$2\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$",
        "$\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$",
      ],
      explanation: sol(
        "en",
        "internal radius $r_1$, external radius $r_2$.",
        "A hollow hemispherical container has **two** curved surfaces, one inside and one outside.\n\n$$\\text{inner CSA} = 2\\pi r_1^{\\,2}, \\qquad \\text{outer CSA} = 2\\pi r_2^{\\,2}$$\n\n$$\\text{total curved surface area} = 2\\pi r_1^{\\,2} + 2\\pi r_2^{\\,2} = 2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$$",
        "The curved surface area is $2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$ — option (B).",
        "The **difference** $\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$ is the area of the flat ring at the rim, not a curved surface.",
      ),
    },
    as: {
      question:
        "এটা অৰ্ধগোলাকাৰ পাত্ৰৰ আভ্যন্তৰীণ আৰু বাহ্যিক ব্যাসাৰ্ধ ক্ৰমে $r_1$ আৰু $r_2$। পাত্ৰটোৰ বক্ৰ পৃষ্ঠকালি হ'ল",
      options: [
        "$\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$",
        "$2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$",
        "$2\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$",
        "$\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$",
      ],
      explanation: sol(
        "as",
        "আভ্যন্তৰীণ ব্যাসাৰ্ধ $r_1$, বাহ্যিক ব্যাসাৰ্ধ $r_2$।",
        "ফোপোলা অৰ্ধগোলাকাৰ পাত্ৰ এটাৰ **দুখন** বক্ৰ পৃষ্ঠ থাকে — এখন ভিতৰত আৰু এখন বাহিৰত।\n\n$$\\text{ভিতৰৰ CSA} = 2\\pi r_1^{\\,2}, \\qquad \\text{বাহিৰৰ CSA} = 2\\pi r_2^{\\,2}$$\n\n$$\\text{মুঠ বক্ৰ পৃষ্ঠকালি} = 2\\pi r_1^{\\,2} + 2\\pi r_2^{\\,2} = 2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$$",
        "বক্ৰ পৃষ্ঠকালি $2\\pi\\left(r_1^{\\,2}+r_2^{\\,2}\\right)$ — বিকল্প (B)।",
        "**অন্তৰ** $\\pi\\left(r_2^{\\,2}-r_1^{\\,2}\\right)$ টো হ'ল দাঁতিৰ সমতল বলয়টোৰ কালি, কোনো বক্ৰ পৃষ্ঠ নহয়।",
      ),
    },
  },
  {
    id: "b19-spheres-sa-ratio-4-5",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question: "The radii of two spheres are in the ratio $4 : 5$. The ratio of their surface areas is",
      options: ["$4 : 5$", "$2 : \\sqrt{5}$", "$5 : 4$", "$16 : 25$"],
      explanation: sol(
        "en",
        "$r_1 : r_2 = 4 : 5$.",
        "$$\\frac{S_1}{S_2} = \\frac{4\\pi r_1^{\\,2}}{4\\pi r_2^{\\,2}} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{4}{5}\\right)^2 = \\frac{16}{25}$$",
        "The surface areas are in the ratio $16 : 25$ — option (D).",
        "Surface area goes with the square of the radius; had the question asked for volumes, the answer would have been $64 : 125$.",
      ),
    },
    as: {
      question: "দুটা গোলকৰ ব্যাসাৰ্ধৰ অনুপাত $4 : 5$। সিহঁতৰ পৃষ্ঠকালিৰ অনুপাত হ'ল",
      options: ["$4 : 5$", "$2 : \\sqrt{5}$", "$5 : 4$", "$16 : 25$"],
      explanation: sol(
        "as",
        "$r_1 : r_2 = 4 : 5$।",
        "$$\\frac{S_1}{S_2} = \\frac{4\\pi r_1^{\\,2}}{4\\pi r_2^{\\,2}} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{4}{5}\\right)^2 = \\frac{16}{25}$$",
        "পৃষ্ঠকালিৰ অনুপাত $16 : 25$ — বিকল্প (D)।",
        "পৃষ্ঠকালি ব্যাসাৰ্ধৰ বৰ্গৰ সমানুপাতিক; আয়তন বিচাৰিলে উত্তৰটো $64 : 125$ হ'লহেঁতেন।",
      ),
    },
  },
  {
    id: "b20-balloon-sa-ratio-7-14",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "As air is pumped in, the radius of a spherical balloon grows from $7$ cm to $14$ cm. The ratio of the surface areas of the balloon in the two cases is",
      options: ["$1 : 4$", "$1 : 3$", "$2 : 3$", "$2 : 1$"],
      explanation: sol(
        "en",
        "$r_1 = 7\\ \\text{cm}$, $r_2 = 14\\ \\text{cm}$.",
        "$$S_1 = 4\\pi(7)^2 = 196\\pi\\ \\text{cm}^2, \\qquad S_2 = 4\\pi(14)^2 = 784\\pi\\ \\text{cm}^2$$\n\n$$S_1 : S_2 = 196 : 784 = 1 : 4$$",
        "The ratio of the surface areas is $1 : 4$ — option (A).",
        "The order matters: the smaller balloon is named first, so the ratio is $1 : 4$ and not $4 : 1$.",
      ),
    },
    as: {
      question:
        "বতাহ ভৰোৱাৰ লগে লগে এটা গোলাকাৰ বেলুনৰ ব্যাসাৰ্ধ $7$ চে.মি. ৰ পৰা $14$ চে.মি. লৈ বাঢ়িল। দুয়োটা অৱস্থাত বেলুনটোৰ পৃষ্ঠকালিৰ অনুপাত হ'ল",
      options: ["$1 : 4$", "$1 : 3$", "$2 : 3$", "$2 : 1$"],
      explanation: sol(
        "as",
        "$r_1 = 7\\ \\text{cm}$, $r_2 = 14\\ \\text{cm}$।",
        "$$S_1 = 4\\pi(7)^2 = 196\\pi\\ \\text{cm}^2, \\qquad S_2 = 4\\pi(14)^2 = 784\\pi\\ \\text{cm}^2$$\n\n$$S_1 : S_2 = 196 : 784 = 1 : 4$$",
        "পৃষ্ঠকালিৰ অনুপাত $1 : 4$ — বিকল্প (A)।",
        "ক্ৰমটো গুৰুত্বপূৰ্ণ: সৰু বেলুনটোৰ কথা প্ৰথমে কোৱা হৈছে, গতিকে অনুপাতটো $1 : 4$, $4 : 1$ নহয়।",
      ),
    },
  },
  {
    id: "b21-tank-two-thirds-filled",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "A tank measures $6\\ \\text{m}\\times 5\\ \\text{m}\\times 4\\ \\text{m}$. Two-thirds of it is filled with water. The volume of the water is",
      options: ["$80\\ \\text{m}^3$", "$60\\ \\text{m}^3$", "$50\\ \\text{m}^3$", "$40\\ \\text{m}^3$"],
      explanation: sol(
        "en",
        "tank dimensions $6\\ \\text{m}\\times 5\\ \\text{m}\\times 4\\ \\text{m}$; the water fills $\\tfrac{2}{3}$ of it.",
        "$$\\text{capacity} = 6\\times 5\\times 4 = 120\\ \\text{m}^3$$\n\n$$\\text{volume of water} = \\frac{2}{3}\\times 120 = 80\\ \\text{m}^3$$",
        "The volume of the water is $80\\ \\text{m}^3$ — option (A).",
      ),
    },
    as: {
      question:
        "এটা টেংকিৰ জোখ $6\\ \\text{m}\\times 5\\ \\text{m}\\times 4\\ \\text{m}$। ইয়াৰ তিনি ভাগৰ দুভাগ পানীৰে ভৰা আছে। পানীখিনিৰ আয়তন হ'ল",
      options: ["$80\\ \\text{m}^3$", "$60\\ \\text{m}^3$", "$50\\ \\text{m}^3$", "$40\\ \\text{m}^3$"],
      explanation: sol(
        "as",
        "টেংকিটোৰ জোখ $6\\ \\text{m}\\times 5\\ \\text{m}\\times 4\\ \\text{m}$; পানীয়ে ইয়াৰ $\\tfrac{2}{3}$ ভাগ ভৰাই আছে।",
        "$$\\text{ধাৰণ ক্ষমতা} = 6\\times 5\\times 4 = 120\\ \\text{m}^3$$\n\n$$\\text{পানীৰ আয়তন} = \\frac{2}{3}\\times 120 = 80\\ \\text{m}^3$$",
        "পানীখিনিৰ আয়তন $80\\ \\text{m}^3$ — বিকল্প (A)।",
      ),
    },
  },
  {
    id: "b22-cuboid-volume-from-faces",
    difficulty: "moderate",
    correctIndex: 2,
    en: {
      question:
        "If $A$, $B$ and $C$ are the areas of three adjacent faces of a cuboid, then its volume is",
      options: ["$ABC$", "$2ABC$", "$\\sqrt{ABC}$", "$A+B+C$"],
      explanation: sol(
        "en",
        "$A = lb$, $B = bh$, $C = hl$ for a cuboid of dimensions $l$, $b$, $h$.",
        "$$ABC = (lb)(bh)(hl) = l^2b^2h^2 = (lbh)^2$$\n\n$$\\therefore\\ lbh = \\sqrt{ABC}$$",
        "The volume of the cuboid is $\\sqrt{ABC}$ — option (C).",
        "Each of $l$, $b$, $h$ appears exactly twice in the product $ABC$, which is precisely why the square root recovers the volume.",
      ),
    },
    as: {
      question:
        "যদি $A$, $B$ আৰু $C$ এটা আয়তঘনৰ তিনিখন সংলগ্ন পৃষ্ঠৰ কালি হয়, তেন্তে ইয়াৰ আয়তন হ'ল",
      options: ["$ABC$", "$2ABC$", "$\\sqrt{ABC}$", "$A+B+C$"],
      explanation: sol(
        "as",
        "$l$, $b$, $h$ জোখৰ আয়তঘন এটাৰ বাবে $A = lb$, $B = bh$, $C = hl$।",
        "$$ABC = (lb)(bh)(hl) = l^2b^2h^2 = (lbh)^2$$\n\n$$\\therefore\\ lbh = \\sqrt{ABC}$$",
        "আয়তঘনটোৰ আয়তন $\\sqrt{ABC}$ — বিকল্প (C)।",
        "$ABC$ পূৰণফলটোত $l$, $b$, $h$ প্ৰতিটোৱে ঠিক দুবাৰকৈ আহিছে, সেয়েহে বৰ্গমূলে আয়তনটো ওভতাই আনে।",
      ),
    },
  },
  {
    id: "b23-block-shortest-edge",
    difficulty: "hard",
    correctIndex: 2,
    en: {
      question:
        "The areas of the adjacent faces of a rectangular block are in the ratio $2 : 3 : 4$ and its volume is $9000\\ \\text{cm}^3$. The length of the shortest edge is",
      options: ["$30$ cm", "$20$ cm", "$15$ cm", "$10$ cm"],
      explanation: sol(
        "en",
        "$lb : bh : lh = 2 : 3 : 4$ and $lbh = 9000\\ \\text{cm}^3$.",
        "Write $lb = 2x$, $bh = 3x$, $lh = 4x$. Multiplying the three,\n\n$$(lbh)^2 = 24x^3 \\implies (9000)^2 = 24x^3 \\implies x^3 = \\frac{81000000}{24} = 3375000$$\n\n$$x = 150 \\implies lb = 300,\\ bh = 450,\\ lh = 600$$\n\n$$h = \\frac{lbh}{lb} = \\frac{9000}{300} = 30\\ \\text{cm}, \\quad l = \\frac{9000}{450} = 20\\ \\text{cm}, \\quad b = \\frac{9000}{600} = 15\\ \\text{cm}$$",
        "The shortest edge measures $15$ cm — option (C).",
        "All three edges appear among the options, so the last step — picking the **smallest** of $30$, $20$ and $15$ — is where the question is really decided.",
      ),
    },
    as: {
      question:
        "এটা আয়তাকাৰ ঘনবস্তুৰ সংলগ্ন পৃষ্ঠকেইখনৰ কালিৰ অনুপাত $2 : 3 : 4$ আৰু ইয়াৰ আয়তন $9000\\ \\text{cm}^3$। আটাইতকৈ চুটি ধাৰটোৰ দৈৰ্ঘ্য হ'ল",
      options: ["$30$ চে.মি.", "$20$ চে.মি.", "$15$ চে.মি.", "$10$ চে.মি."],
      explanation: sol(
        "as",
        "$lb : bh : lh = 2 : 3 : 4$ আৰু $lbh = 9000\\ \\text{cm}^3$।",
        "$lb = 2x$, $bh = 3x$, $lh = 4x$ ধৰা হ'ল। তিনিওটা পূৰণ কৰিলে,\n\n$$(lbh)^2 = 24x^3 \\implies (9000)^2 = 24x^3 \\implies x^3 = \\frac{81000000}{24} = 3375000$$\n\n$$x = 150 \\implies lb = 300,\\ bh = 450,\\ lh = 600$$\n\n$$h = \\frac{lbh}{lb} = \\frac{9000}{300} = 30\\ \\text{cm}, \\quad l = \\frac{9000}{450} = 20\\ \\text{cm}, \\quad b = \\frac{9000}{600} = 15\\ \\text{cm}$$",
        "আটাইতকৈ চুটি ধাৰটোৰ দৈৰ্ঘ্য $15$ চে.মি. — বিকল্প (C)।",
        "তিনিওটা ধাৰেই বিকল্পৰ তালিকাত আছে, গতিকে শেষৰ খোজটো — $30$, $20$ আৰু $15$ ৰ ভিতৰত **আটাইতকৈ সৰুটো** বাছি লোৱা — তাতেই প্ৰশ্নটোৰ ফলাফল নিৰ্ধাৰিত হয়।",
      ),
    },
  },
  {
    id: "b24-cylinders-radii-ratio",
    difficulty: "hard",
    correctIndex: 3,
    en: {
      question:
        "The heights of two cylinders are in the ratio $5 : 3$ and their volumes are in the ratio $20 : 27$. The ratio of their radii is",
      options: ["$25 : 9$", "$5 : 3$", "$4 : 9$", "$2 : 3$"],
      explanation: sol(
        "en",
        "$h_1 : h_2 = 5 : 3$ and $V_1 : V_2 = 20 : 27$.",
        "$$\\frac{V_1}{V_2} = \\frac{\\pi r_1^{\\,2}h_1}{\\pi r_2^{\\,2}h_2} \\implies \\frac{20}{27} = \\left(\\frac{r_1}{r_2}\\right)^{2}\\times\\frac{5}{3}$$\n\n$$\\left(\\frac{r_1}{r_2}\\right)^{2} = \\frac{20}{27}\\times\\frac{3}{5} = \\frac{4}{9} \\implies \\frac{r_1}{r_2} = \\frac{2}{3}$$",
        "The radii are in the ratio $2 : 3$ — option (D).",
        "Option (C), $4 : 9$, is the ratio of the **squares** of the radii — a very easy place to stop one step early.",
      ),
    },
    as: {
      question:
        "দুটা বেলনৰ উচ্চতাৰ অনুপাত $5 : 3$ আৰু সিহঁতৰ আয়তনৰ অনুপাত $20 : 27$। সিহঁতৰ ব্যাসাৰ্ধৰ অনুপাত হ'ল",
      options: ["$25 : 9$", "$5 : 3$", "$4 : 9$", "$2 : 3$"],
      explanation: sol(
        "as",
        "$h_1 : h_2 = 5 : 3$ আৰু $V_1 : V_2 = 20 : 27$।",
        "$$\\frac{V_1}{V_2} = \\frac{\\pi r_1^{\\,2}h_1}{\\pi r_2^{\\,2}h_2} \\implies \\frac{20}{27} = \\left(\\frac{r_1}{r_2}\\right)^{2}\\times\\frac{5}{3}$$\n\n$$\\left(\\frac{r_1}{r_2}\\right)^{2} = \\frac{20}{27}\\times\\frac{3}{5} = \\frac{4}{9} \\implies \\frac{r_1}{r_2} = \\frac{2}{3}$$",
        "ব্যাসাৰ্ধৰ অনুপাত $2 : 3$ — বিকল্প (D)।",
        "বিকল্প (C), $4 : 9$ হ'ল ব্যাসাৰ্ধৰ **বৰ্গ** ৰ অনুপাত — এখোজ আগতেই ৰৈ যোৱাটো ইয়াত অতি সহজ।",
      ),
    },
  },
  {
    id: "b25-cylinder-volume-ratio-3-1",
    difficulty: "moderate",
    correctIndex: 2,
    en: {
      question:
        "The altitude of a circular cylinder is made three times as large and its base area is reduced to one-ninth of its value. The ratio of the original volume to the new volume is",
      options: ["$2 : 3$", "$1 : 2$", "$3 : 1$", "$2 : 1$"],
      explanation: sol(
        "en",
        "new height $= 3h$; new base area $= \\dfrac{1}{9}\\pi r^2$, so the new radius is $\\dfrac{r}{3}$.",
        "$$V_1 = \\pi r^2 h, \\qquad V_2 = \\pi\\left(\\frac{r}{3}\\right)^2(3h) = \\frac{\\pi r^2 h}{3}$$\n\n$$\\frac{V_1}{V_2} = \\frac{\\pi r^2 h}{\\tfrac{1}{3}\\pi r^2 h} = \\frac{3}{1}$$",
        "The ratio of the volumes is $3 : 1$ — option (C).",
        "The base area falls by $9$ and the height rises by only $3$, so the volume ends up one-third of what it was.",
      ),
    },
    as: {
      question:
        "এটা বৃত্তাকাৰ বেলনৰ উচ্চতা তিনি গুণ কৰা হ'ল আৰু ইয়াৰ ভূমিৰ কালি আগৰ এক-নৱমাংশলৈ কমোৱা হ'ল। আগৰ আয়তন আৰু নতুন আয়তনৰ অনুপাত হ'ল",
      options: ["$2 : 3$", "$1 : 2$", "$3 : 1$", "$2 : 1$"],
      explanation: sol(
        "as",
        "নতুন উচ্চতা $= 3h$; নতুন ভূমিৰ কালি $= \\dfrac{1}{9}\\pi r^2$, গতিকে নতুন ব্যাসাৰ্ধ $\\dfrac{r}{3}$।",
        "$$V_1 = \\pi r^2 h, \\qquad V_2 = \\pi\\left(\\frac{r}{3}\\right)^2(3h) = \\frac{\\pi r^2 h}{3}$$\n\n$$\\frac{V_1}{V_2} = \\frac{\\pi r^2 h}{\\tfrac{1}{3}\\pi r^2 h} = \\frac{3}{1}$$",
        "আয়তনৰ অনুপাত $3 : 1$ — বিকল্প (C)।",
        "ভূমিৰ কালি $9$ ভাগ কমে আৰু উচ্চতা বাঢ়ে মাত্ৰ $3$ গুণ, সেয়েহে আয়তনটো আগৰ এক-তৃতীয়াংশ হৈ পৰে।",
      ),
    },
  },
  {
    id: "b26-cylinder-volume-from-csa-1520",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "The curved surface area of a right circular cylinder is $1520\\ \\text{cm}^2$ and the diameter of its base is $30$ cm. The volume of the cylinder is",
      options: ["$11400\\ \\text{cm}^3$", "$11560\\ \\text{cm}^3$", "$12700\\ \\text{cm}^3$", "$11600\\ \\text{cm}^3$"],
      explanation: sol(
        "en",
        "CSA $= 1520\\ \\text{cm}^2$, $d = 30\\ \\text{cm} \\Rightarrow r = 15\\ \\text{cm}$.",
        "$$2\\pi r h = 1520 \\implies \\pi(15)h = 760 \\implies h = \\frac{760}{15\\pi}$$\n\n$$V = \\pi r^2 h = \\pi(15)^2\\times\\frac{760}{15\\pi} = 15\\times 760 = 11400\\ \\text{cm}^3$$",
        "The volume is $11400\\ \\text{cm}^3$ — option (A).",
        "There is a shortcut worth remembering: $V = \\pi r^2 h = \\tfrac{r}{2}\\times(2\\pi r h) = \\tfrac{15}{2}\\times 1520 = 11400$.",
      ),
    },
    as: {
      question:
        "এটা সমবৃত্তভূমিক বেলনৰ বক্ৰ পৃষ্ঠকালি $1520\\ \\text{cm}^2$ আৰু ইয়াৰ ভূমিৰ ব্যাস $30$ চে.মি.। বেলনটোৰ আয়তন হ'ল",
      options: ["$11400\\ \\text{cm}^3$", "$11560\\ \\text{cm}^3$", "$12700\\ \\text{cm}^3$", "$11600\\ \\text{cm}^3$"],
      explanation: sol(
        "as",
        "CSA $= 1520\\ \\text{cm}^2$, $d = 30\\ \\text{cm} \\Rightarrow r = 15\\ \\text{cm}$।",
        "$$2\\pi r h = 1520 \\implies \\pi(15)h = 760 \\implies h = \\frac{760}{15\\pi}$$\n\n$$V = \\pi r^2 h = \\pi(15)^2\\times\\frac{760}{15\\pi} = 15\\times 760 = 11400\\ \\text{cm}^3$$",
        "আয়তন $11400\\ \\text{cm}^3$ — বিকল্প (A)।",
        "মনত ৰখাৰ যোগ্য এটা চমু পথ আছে: $V = \\pi r^2 h = \\tfrac{r}{2}\\times(2\\pi r h) = \\tfrac{15}{2}\\times 1520 = 11400$।",
      ),
    },
  },
  {
    id: "b27-wire-length-increase",
    difficulty: "moderate",
    correctIndex: 2,
    en: {
      question:
        "The radius of a wire is reduced to one-third of what it was. If the volume stays the same, the length will increase",
      options: ["$3$ times", "$6$ times", "$9$ times", "$27$ times"],
      explanation: sol(
        "en",
        "new radius $r_2 = \\dfrac{r_1}{3}$, i.e. $r_1 = 3r_2$; the volume is unchanged.",
        "A wire is a long cylinder, so $\\pi r^2 h$ must stay constant.\n\n$$\\pi r_1^{\\,2}h_1 = \\pi r_2^{\\,2}h_2 \\implies (3r_2)^2 h_1 = r_2^{\\,2}h_2$$\n\n$$9r_2^{\\,2}h_1 = r_2^{\\,2}h_2 \\implies h_2 = 9h_1$$",
        "The length increases $9$ times — option (C).",
        "Volume is preserved, not surface area; the length must make up for the **square** of the radius, hence $9$ and not $3$.",
      ),
    },
    as: {
      question:
        "এডাল তাঁৰৰ ব্যাসাৰ্ধ আগৰ এক-তৃতীয়াংশলৈ কমোৱা হ'ল। আয়তন একেই থাকিলে দৈৰ্ঘ্য বাঢ়িব",
      options: ["$3$ গুণ", "$6$ গুণ", "$9$ গুণ", "$27$ গুণ"],
      explanation: sol(
        "as",
        "নতুন ব্যাসাৰ্ধ $r_2 = \\dfrac{r_1}{3}$, অৰ্থাৎ $r_1 = 3r_2$; আয়তন অপৰিৱৰ্তিত।",
        "তাঁৰ এডাল এটা দীঘল বেলন, গতিকে $\\pi r^2 h$ ধ্ৰুৱক হৈ থাকিব লাগিব।\n\n$$\\pi r_1^{\\,2}h_1 = \\pi r_2^{\\,2}h_2 \\implies (3r_2)^2 h_1 = r_2^{\\,2}h_2$$\n\n$$9r_2^{\\,2}h_1 = r_2^{\\,2}h_2 \\implies h_2 = 9h_1$$",
        "দৈৰ্ঘ্য $9$ গুণ বাঢ়ে — বিকল্প (C)।",
        "ইয়াত আয়তন অপৰিৱৰ্তিত, পৃষ্ঠকালি নহয়; দৈৰ্ঘ্যই ব্যাসাৰ্ধৰ **বৰ্গ** ৰ ক্ষতি পূৰণ কৰিব লাগে, সেয়েহে $3$ নহয়, $9$।",
      ),
    },
  },
  {
    id: "b28-cone-volume-increase-10pc",
    difficulty: "hard",
    correctIndex: 2,
    en: {
      question:
        "If both the radius and the height of a cone are increased by $10\\%$, the volume of the cone increases by approximately",
      options: ["$10\\%$", "$21\\%$", "$33\\%$", "$100\\%$"],
      explanation: sol(
        "en",
        "new radius $= 1.1r$, new height $= 1.1h$.",
        "$$V_1 = \\frac{1}{3}\\pi r^2 h, \\qquad V_2 = \\frac{1}{3}\\pi (1.1r)^2 (1.1h) = (1.1)^3 V_1$$\n\n$$(1.1)^3 = \\frac{1331}{1000} = 1.331$$\n\n$$\\text{increase} = (1.331-1)\\times 100\\% = 33.1\\%$$",
        "The volume increases by about $33\\%$ — option (C).",
        "Option (B), $21\\%$, is $(1.1)^2-1$: the increase in a two-dimensional quantity such as base area, not in volume.",
      ),
    },
    as: {
      question:
        "এটা শংকুৰ ব্যাসাৰ্ধ আৰু উচ্চতা দুয়োটা $10\\%$ কৈ বৃদ্ধি কৰিলে শংকুটোৰ আয়তন প্ৰায় কিমান বাঢ়িব",
      options: ["$10\\%$", "$21\\%$", "$33\\%$", "$100\\%$"],
      explanation: sol(
        "as",
        "নতুন ব্যাসাৰ্ধ $= 1.1r$, নতুন উচ্চতা $= 1.1h$।",
        "$$V_1 = \\frac{1}{3}\\pi r^2 h, \\qquad V_2 = \\frac{1}{3}\\pi (1.1r)^2 (1.1h) = (1.1)^3 V_1$$\n\n$$(1.1)^3 = \\frac{1331}{1000} = 1.331$$\n\n$$\\text{বৃদ্ধি} = (1.331-1)\\times 100\\% = 33.1\\%$$",
        "আয়তন প্ৰায় $33\\%$ বাঢ়ে — বিকল্প (C)।",
        "বিকল্প (B), $21\\%$ হ'ল $(1.1)^2-1$: ভূমিৰ কালিৰ দৰে দ্বিমাত্ৰিক ৰাশিৰ বৃদ্ধি, আয়তনৰ নহয়।",
      ),
    },
  },
  {
    id: "b29-cone-identity-zero",
    difficulty: "hard",
    correctIndex: 1,
    en: {
      question:
        "If $h$, $S$ and $V$ denote respectively the height, the curved surface area and the volume of a right circular cone, then $3\\pi V h^3 - S^2h^2 + 9V^2$ is equal to",
      options: ["$8$", "$0$", "$4\\pi$", "$32\\pi^2$"],
      explanation: sol(
        "en",
        "$S = \\pi r l = \\pi r\\sqrt{r^2+h^2}$ and $V = \\dfrac{1}{3}\\pi r^2 h$.",
        "$$3\\pi V h^3 = 3\\pi\\left(\\frac{1}{3}\\pi r^2 h\\right)h^3 = \\pi^2 r^2 h^4$$\n\n$$S^2h^2 = \\pi^2r^2\\left(r^2+h^2\\right)h^2 = \\pi^2r^4h^2 + \\pi^2r^2h^4$$\n\n$$9V^2 = 9\\left(\\frac{1}{3}\\pi r^2h\\right)^2 = \\pi^2r^4h^2$$\n\n$$\\therefore\\ \\pi^2r^2h^4 - \\pi^2r^4h^2 - \\pi^2r^2h^4 + \\pi^2r^4h^2 = 0$$",
        "The expression equals $0$ — option (B).",
        "Every term cancels in pairs, so the identity holds for **every** right circular cone, whatever its dimensions.",
      ),
    },
    as: {
      question:
        "যদি $h$, $S$ আৰু $V$ এ ক্ৰমে এটা সমবৃত্তভূমিক শংকুৰ উচ্চতা, বক্ৰ পৃষ্ঠকালি আৰু আয়তন বুজায়, তেন্তে $3\\pi V h^3 - S^2h^2 + 9V^2$ ৰ মান হ'ল",
      options: ["$8$", "$0$", "$4\\pi$", "$32\\pi^2$"],
      explanation: sol(
        "as",
        "$S = \\pi r l = \\pi r\\sqrt{r^2+h^2}$ আৰু $V = \\dfrac{1}{3}\\pi r^2 h$।",
        "$$3\\pi V h^3 = 3\\pi\\left(\\frac{1}{3}\\pi r^2 h\\right)h^3 = \\pi^2 r^2 h^4$$\n\n$$S^2h^2 = \\pi^2r^2\\left(r^2+h^2\\right)h^2 = \\pi^2r^4h^2 + \\pi^2r^2h^4$$\n\n$$9V^2 = 9\\left(\\frac{1}{3}\\pi r^2h\\right)^2 = \\pi^2r^4h^2$$\n\n$$\\therefore\\ \\pi^2r^2h^4 - \\pi^2r^4h^2 - \\pi^2r^2h^4 + \\pi^2r^4h^2 = 0$$",
        "প্ৰকাশৰাশিটোৰ মান $0$ — বিকল্প (B)।",
        "প্ৰতিটো পদ যোৰে যোৰে কাটি যায়, গতিকে অভেদটো জোখ যিয়েই নহওক, **প্ৰতিটো** সমবৃত্তভূমিক শংকুৰ বাবেই সত্য।",
      ),
    },
  },
  {
    id: "b30-sphere-diameter-down-25pc",
    difficulty: "hard",
    correctIndex: 1,
    en: {
      question:
        "The diameter of a sphere is decreased by $25\\%$. By what percentage does its volume decrease?",
      options: ["$25\\%$", "$57.81\\%$", "$43.50\\%$", "$50\\%$"],
      explanation: sol(
        "en",
        "the new diameter is $75\\%$ of the old one, so the new radius is $\\dfrac{3}{4}$ of the old radius.",
        "$$\\frac{V_{\\text{new}}}{V_{\\text{old}}} = \\left(\\frac{3}{4}\\right)^3 = \\frac{27}{64}$$\n\n$$\\text{decrease} = \\left(1-\\frac{27}{64}\\right)\\times 100\\% = \\frac{37}{64}\\times 100\\% = 57.8125\\%$$",
        "The volume decreases by about $57.81\\%$ — option (B).",
        "A $25\\%$ cut in a linear measurement is nowhere near a $25\\%$ cut in volume; the cube makes the drop more than twice as large.",
      ),
    },
    as: {
      question:
        "এটা গোলকৰ ব্যাস $25\\%$ হ্ৰাস কৰা হ'ল। ইয়াৰ আয়তন শতকৰা কিমান হ্ৰাস পাব?",
      options: ["$25\\%$", "$57.81\\%$", "$43.50\\%$", "$50\\%$"],
      explanation: sol(
        "as",
        "নতুন ব্যাসটো আগৰটোৰ $75\\%$, গতিকে নতুন ব্যাসাৰ্ধ আগৰ ব্যাসাৰ্ধৰ $\\dfrac{3}{4}$ ভাগ।",
        "$$\\frac{V_{\\text{new}}}{V_{\\text{old}}} = \\left(\\frac{3}{4}\\right)^3 = \\frac{27}{64}$$\n\n$$\\text{হ্ৰাস} = \\left(1-\\frac{27}{64}\\right)\\times 100\\% = \\frac{37}{64}\\times 100\\% = 57.8125\\%$$",
        "আয়তন প্ৰায় $57.81\\%$ হ্ৰাস পায় — বিকল্প (B)।",
        "কোনো ৰৈখিক জোখৰ $25\\%$ হ্ৰাসে আয়তনৰ $25\\%$ হ্ৰাস নানে; ঘনৰ কাৰণে পতনটো দুগুণতকৈও বেছি হয়।",
      ),
    },
  },
  {
    id: "b31-cone-hemisphere-cylinder-ratio",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "A cone, a hemisphere and a cylinder stand on equal bases and have the same height. The ratio of their volumes is",
      options: ["$1 : 2 : 3$", "$2 : 1 : 3$", "$2 : 3 : 1$", "$3 : 2 : 1$"],
      explanation: sol(
        "en",
        "all three have base radius $r$; for a hemisphere the height equals the radius, so $h = r$ for all three.",
        "$$V_{\\text{cone}} = \\frac{1}{3}\\pi r^2(r) = \\frac{1}{3}\\pi r^3$$\n\n$$V_{\\text{hemisphere}} = \\frac{2}{3}\\pi r^3, \\qquad V_{\\text{cylinder}} = \\pi r^2(r) = \\pi r^3$$\n\n$$\\text{ratio} = \\frac{1}{3} : \\frac{2}{3} : 1 = 1 : 2 : 3$$",
        "The volumes are in the ratio $1 : 2 : 3$ — option (A).",
        "The hemisphere fixes the common height: its height cannot be anything other than its own radius.",
      ),
    },
    as: {
      question:
        "এটা শংকু, এটা অৰ্ধগোলক আৰু এটা বেলন সমান ভূমিৰ ওপৰত থিয় হৈ আছে আৰু সিহঁতৰ উচ্চতাও একে। সিহঁতৰ আয়তনৰ অনুপাত হ'ল",
      options: ["$1 : 2 : 3$", "$2 : 1 : 3$", "$2 : 3 : 1$", "$3 : 2 : 1$"],
      explanation: sol(
        "as",
        "তিনিওটাৰে ভূমিৰ ব্যাসাৰ্ধ $r$; অৰ্ধগোলকৰ উচ্চতা ইয়াৰ ব্যাসাৰ্ধৰ সমান, গতিকে তিনিওটাৰে $h = r$।",
        "$$V_{\\text{cone}} = \\frac{1}{3}\\pi r^2(r) = \\frac{1}{3}\\pi r^3$$\n\n$$V_{\\text{hemisphere}} = \\frac{2}{3}\\pi r^3, \\qquad V_{\\text{cylinder}} = \\pi r^2(r) = \\pi r^3$$\n\n$$\\text{অনুপাত} = \\frac{1}{3} : \\frac{2}{3} : 1 = 1 : 2 : 3$$",
        "আয়তনৰ অনুপাত $1 : 2 : 3$ — বিকল্প (A)।",
        "অৰ্ধগোলকটোৱেই সাধাৰণ উচ্চতাটো নিৰ্ধাৰণ কৰি দিয়ে: ইয়াৰ উচ্চতা নিজৰ ব্যাসাৰ্ধৰ বাহিৰে আন একো হ'ব নোৱাৰে।",
      ),
    },
  },
  {
    id: "b32-hemisphere-tsa-from-volume",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question: "The volume of a hemisphere is $19404$ cubic cm. Its total surface area is",
      options: ["$2772$ sq. cm", "$4158$ sq. cm", "$5544$ sq. cm", "$1386$ sq. cm"],
      explanation: sol(
        "en",
        "volume of the hemisphere $= 19404\\ \\text{cm}^3$.",
        "$$\\frac{2}{3}\\pi r^3 = 19404 \\implies r^3 = \\frac{19404\\times 3\\times 7}{2\\times 22} = \\frac{407484}{44} = 9261$$\n\n$$r = 21\\ \\text{cm}$$\n\n$$\\text{TSA} = 3\\pi r^2 = 3\\times\\frac{22}{7}\\times 21^2 = 3\\times 22\\times 63 = 4158\\ \\text{cm}^2$$",
        "The total surface area is $4158$ sq. cm — option (B).",
        "A solid hemisphere has $3\\pi r^2$, not $2\\pi r^2$: the flat circular top must be counted too. Option (A), $2772$, is that curved part alone.",
      ),
    },
    as: {
      question: "এটা অৰ্ধগোলকৰ আয়তন $19404$ ঘন চে.মি.। ইয়াৰ সম্পূৰ্ণ পৃষ্ঠকালি হ'ল",
      options: ["$2772$ বৰ্গ চে.মি.", "$4158$ বৰ্গ চে.মি.", "$5544$ বৰ্গ চে.মি.", "$1386$ বৰ্গ চে.মি."],
      explanation: sol(
        "as",
        "অৰ্ধগোলকটোৰ আয়তন $= 19404\\ \\text{cm}^3$।",
        "$$\\frac{2}{3}\\pi r^3 = 19404 \\implies r^3 = \\frac{19404\\times 3\\times 7}{2\\times 22} = \\frac{407484}{44} = 9261$$\n\n$$r = 21\\ \\text{cm}$$\n\n$$\\text{TSA} = 3\\pi r^2 = 3\\times\\frac{22}{7}\\times 21^2 = 3\\times 22\\times 63 = 4158\\ \\text{cm}^2$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $4158$ বৰ্গ চে.মি. — বিকল্প (B)।",
        "কঠিন অৰ্ধগোলক এটাৰ $3\\pi r^2$, $2\\pi r^2$ নহয়: ওপৰৰ সমতল চক্ৰীখনো গণিব লাগে। বিকল্প (A), $2772$ হ'ল কেৱল সেই বক্ৰ অংশটো।",
      ),
    },
  },
  {
    id: "b33-largest-sphere-in-cube",
    difficulty: "moderate",
    correctIndex: 3,
    en: {
      question:
        "The largest possible sphere is cut out of a cube of edge $5$ cm. The volume of that sphere is",
      options: [
        "$27\\pi\\ \\text{cm}^3$",
        "$30\\pi\\ \\text{cm}^3$",
        "$108\\pi\\ \\text{cm}^3$",
        "$\\dfrac{125}{6}\\pi\\ \\text{cm}^3$",
      ],
      explanation: sol(
        "en",
        "edge of the cube $= 5\\ \\text{cm}$.",
        "The largest sphere that fits has its diameter equal to the edge of the cube.\n\n$$2r = 5 \\implies r = \\frac{5}{2}\\ \\text{cm}$$\n\n$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi\\times\\frac{5\\times 5\\times 5}{2\\times 2\\times 2} = \\frac{4\\times 125}{3\\times 8}\\pi = \\frac{125}{6}\\pi\\ \\text{cm}^3$$",
        "The volume of the sphere is $\\dfrac{125}{6}\\pi\\ \\text{cm}^3$ — option (D).",
        "It is the edge, not the space diagonal, that limits the sphere — the sphere touches the centre of each face.",
      ),
    },
    as: {
      question:
        "$5$ চে.মি. ধাৰৰ এটা ঘনকৰ পৰা সম্ভৱপৰ আটাইতকৈ ডাঙৰ গোলকটো কাটি উলিওৱা হ'ল। সেই গোলকটোৰ আয়তন হ'ল",
      options: [
        "$27\\pi\\ \\text{cm}^3$",
        "$30\\pi\\ \\text{cm}^3$",
        "$108\\pi\\ \\text{cm}^3$",
        "$\\dfrac{125}{6}\\pi\\ \\text{cm}^3$",
      ],
      explanation: sol(
        "as",
        "ঘনকটোৰ ধাৰ $= 5\\ \\text{cm}$।",
        "ভিতৰত সোমোৱা আটাইতকৈ ডাঙৰ গোলকটোৰ ব্যাস ঘনকটোৰ ধাৰৰ সমান হয়।\n\n$$2r = 5 \\implies r = \\frac{5}{2}\\ \\text{cm}$$\n\n$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi\\times\\frac{5\\times 5\\times 5}{2\\times 2\\times 2} = \\frac{4\\times 125}{3\\times 8}\\pi = \\frac{125}{6}\\pi\\ \\text{cm}^3$$",
        "গোলকটোৰ আয়তন $\\dfrac{125}{6}\\pi\\ \\text{cm}^3$ — বিকল্প (D)।",
        "গোলকটোক সীমাবদ্ধ কৰে ধাৰটোৱে, কৰ্ণডালে নহয় — গোলকটোৱে প্ৰতিখন পৃষ্ঠৰ কেন্দ্ৰত স্পৰ্শ কৰে।",
      ),
    },
  },
  {
    id: "b34-water-rise-sphere-dropped",
    difficulty: "hard",
    correctIndex: 2,
    en: {
      question:
        "A cylindrical vessel $60$ cm in diameter is partly filled with water. A sphere $60$ cm in diameter is gently dropped into it. To what further height will the water rise in the cylinder?",
      options: ["$15$ cm", "$30$ cm", "$40$ cm", "$25$ cm"],
      explanation: sol(
        "en",
        "the cylinder and the sphere both have diameter $60$ cm, so both have radius $30$ cm.",
        "The water pushed up equals the volume of the sphere.\n\n$$\\pi(30)^2 h = \\frac{4}{3}\\pi(30)^3$$\n\n$$h = \\frac{4}{3}\\times 30 = 40\\ \\text{cm}$$",
        "The water rises a further $40$ cm — option (C).",
        "Whenever a sphere is dropped into a cylinder of the **same** radius $r$, the rise is always $\\tfrac{4}{3}r$ — the numbers hardly matter.",
      ),
    },
    as: {
      question:
        "$60$ চে.মি. ব্যাসৰ এটা বেলনাকাৰ পাত্ৰত আংশিকভাৱে পানী ভৰা আছে। $60$ চে.মি. ব্যাসৰ এটা গোলক ইয়াত লাহেকৈ পেলাই দিয়া হ'ল। বেলনটোত পানীৰ স্তৰ আৰু কিমান উচ্চতা বাঢ়িব?",
      options: ["$15$ চে.মি.", "$30$ চে.মি.", "$40$ চে.মি.", "$25$ চে.মি."],
      explanation: sol(
        "as",
        "বেলন আৰু গোলক দুয়োটাৰে ব্যাস $60$ চে.মি., গতিকে দুয়োটাৰে ব্যাসাৰ্ধ $30$ চে.মি.।",
        "ওপৰলৈ ঠেলি দিয়া পানীখিনিৰ আয়তন গোলকটোৰ আয়তনৰ সমান।\n\n$$\\pi(30)^2 h = \\frac{4}{3}\\pi(30)^3$$\n\n$$h = \\frac{4}{3}\\times 30 = 40\\ \\text{cm}$$",
        "পানীৰ স্তৰ আৰু $40$ চে.মি. বাঢ়িব — বিকল্প (C)।",
        "একেই ব্যাসাৰ্ধ $r$ ৰ বেলনত এটা গোলক পেলালে বৃদ্ধিটো সদায় $\\tfrac{4}{3}r$ হয় — সংখ্যাবোৰে বিশেষ পাৰ্থক্য নকৰে।",
      ),
    },
  },
  {
    id: "b35-cube-volume-from-diagonal",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "The length of the diagonal of a cube is $\\left(14\\times\\sqrt{3}\\right)$ cm. The volume of the cube is",
      options: [
        "$2744\\sqrt{3}\\ \\text{cm}^3$",
        "$2744\\ \\text{cm}^3$",
        "$588\\ \\text{cm}^3$",
        "$3528\\ \\text{cm}^3$",
      ],
      explanation: sol(
        "en",
        "diagonal of the cube $= 14\\sqrt{3}\\ \\text{cm}$.",
        "$$\\sqrt{3}\\,a = 14\\sqrt{3} \\implies a = 14\\ \\text{cm}$$\n\n$$V = a^3 = 14\\times 14\\times 14 = 2744\\ \\text{cm}^3$$",
        "The volume of the cube is $2744\\ \\text{cm}^3$ — option (B).",
        "The $\\sqrt{3}$ cancels straight away, so the edge is a whole number and no surd survives into the volume.",
      ),
    },
    as: {
      question:
        "এটা ঘনকৰ কৰ্ণৰ দৈৰ্ঘ্য $\\left(14\\times\\sqrt{3}\\right)$ চে.মি.। ঘনকটোৰ আয়তন হ'ল",
      options: [
        "$2744\\sqrt{3}\\ \\text{cm}^3$",
        "$2744\\ \\text{cm}^3$",
        "$588\\ \\text{cm}^3$",
        "$3528\\ \\text{cm}^3$",
      ],
      explanation: sol(
        "as",
        "ঘনকটোৰ কৰ্ণ $= 14\\sqrt{3}\\ \\text{cm}$।",
        "$$\\sqrt{3}\\,a = 14\\sqrt{3} \\implies a = 14\\ \\text{cm}$$\n\n$$V = a^3 = 14\\times 14\\times 14 = 2744\\ \\text{cm}^3$$",
        "ঘনকটোৰ আয়তন $2744\\ \\text{cm}^3$ — বিকল্প (B)।",
        "$\\sqrt{3}$ টো লগে লগে কাটি যায়, গতিকে ধাৰটো পূৰ্ণসংখ্যা হয় আৰু আয়তনত কোনো কৰণী নাথাকে।",
      ),
    },
  },
];
