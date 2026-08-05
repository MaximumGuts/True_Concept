/**
 * The 3 case-based blocks of Books/TpA6OWPT3v9ql0s11FBO.pdf:
 *   Case I   Q36-40  clay cylinder (r = 6, h = 8) moulded into a sphere
 *   Case II  Q41-45  bird feeder made from a 44 cm x 15 cm sheet
 *   Case III Q46-50  ball dropped into a cylindrical container of water
 *
 * Names in the passages have been changed freely (allowed for case studies);
 * the mathematics, the option sets and the answers are untouched.  Passage
 * figures are redrawn (see gen_surface_areas_ix_bank_figs.py) and embedded as
 * <img>; the publisher's photograph of the bird feeder is not reproduced.
 */
import { CaseItem, sol, figUrl } from "./_sav_bank";

const img = (name: string, alt: string) =>
  `<img src="${figUrl(name)}" alt="${alt}" style="width:100%;display:block;margin-right:auto;" />`;

export const CASES: CaseItem[] = [
  {
    id: "case1-clay-cylinder-to-sphere",
    difficulty: "moderate",
    figure: "sav-case1-cylinder-sphere-v2.png",
    correctIndexes: [0, 2, 3, 3, 0],
    en: {
      passage: `To introduce mensuration to her class, a teacher brings a lump of modelling clay into the room. She first shapes the clay into a cylinder of radius $6$ cm and height $8$ cm, and then reworks the very same clay into a sphere.

${img("sav-case1-cylinder-sphere-v2.png", "A cylinder of base radius 6 cm and height 8 cm on the left, and the sphere of equal volume on the right")}

Read the situation above and answer the questions that follow.`,
      subs: [
        {
          question: "Find the volume of the cylindrical shape.",
          options: ["$288\\pi\\ \\text{cm}^3$", "$244\\pi\\ \\text{cm}^3$", "$240\\pi\\ \\text{cm}^3$", "$216\\pi\\ \\text{cm}^3$"],
          explanation: sol(
            "en",
            "$r = 6\\ \\text{cm}$, $h = 8\\ \\text{cm}$.",
            "$$V = \\pi r^2 h = \\pi (6)^2\\times 8 = \\pi\\times 36\\times 8 = 288\\pi\\ \\text{cm}^3$$",
            "The volume of the cylinder is $288\\pi\\ \\text{cm}^3$ — option (A).",
          ),
        },
        {
          question: "The formula for the volume of a sphere is",
          options: [
            "$\\dfrac{4}{3}\\pi r^2$",
            "$\\pi r^2 h$",
            "$\\dfrac{4}{3}\\pi r^3$",
            "$\\dfrac{2}{3}\\pi r^3$",
          ],
          explanation: sol(
            "en",
            "",
            "A sphere of radius $r$ has volume $\\dfrac{4}{3}\\pi r^3$ and surface area $4\\pi r^2$.",
            "The volume of a sphere is $\\dfrac{4}{3}\\pi r^3$ — option (C).",
            "Option (B) is the volume of a cylinder and option (D) is the volume of a hemisphere.",
          ),
        },
        {
          question: "When the clay is reshaped from one solid into another, which of these stays the same?",
          options: ["Area", "Curved surface area", "Radius", "Volume"],
          explanation: sol(
            "en",
            "",
            "No clay is added and none is taken away, so the amount of space the clay occupies cannot change. That amount is exactly its **volume**.\n\nThe shape changes completely, so its surface area, its curved surface area and its radius all change with it.",
            "It is the volume that stays the same — option (D).",
            "This single fact is what makes every \"melted and recast\" problem solvable: set the two volumes equal.",
          ),
        },
        {
          question: "The radius of the sphere is",
          options: ["$2$ cm", "$4$ cm", "$5$ cm", "$6$ cm"],
          explanation: sol(
            "en",
            "volume of the sphere $=$ volume of the cylinder $= 288\\pi\\ \\text{cm}^3$.",
            "$$\\frac{4}{3}\\pi R^3 = 288\\pi \\implies R^3 = \\frac{288\\times 3}{4} = 216$$\n\n$$R = \\sqrt[3]{216} = 6\\ \\text{cm}$$",
            "The radius of the sphere is $6$ cm — option (D).",
            "The sphere happens to have the same radius as the cylinder here; that is a coincidence of these particular numbers, not a rule.",
          ),
        },
        {
          question: "Find the volume of the sphere the teacher made.",
          options: ["$288\\pi\\ \\text{cm}^3$", "$184\\pi\\ \\text{cm}^3$", "$240\\pi\\ \\text{cm}^3$", "$216\\pi\\ \\text{cm}^3$"],
          explanation: sol(
            "en",
            "the same clay is used, so the volume is unchanged.",
            "$$V_{\\text{sphere}} = V_{\\text{cylinder}} = 288\\pi\\ \\text{cm}^3$$\n\nChecking directly with $R = 6\\ \\text{cm}$:\n\n$$\\frac{4}{3}\\pi (6)^3 = \\frac{4}{3}\\pi\\times 216 = 288\\pi\\ \\text{cm}^3$$",
            "The volume of the sphere is $288\\pi\\ \\text{cm}^3$ — option (A).",
          ),
        },
      ],
    },
    as: {
      passage: `শ্ৰেণীটোত পৰিমিতি বিষয়টো বুজাবলৈ শিক্ষয়িত্ৰীগৰাকীয়ে এমুঠি মডেলিং মাটি লৈ আহিল। তেওঁ প্ৰথমে মাটিখিনিৰে $6$ চে.মি. ব্যাসাৰ্ধ আৰু $8$ চে.মি. উচ্চতাৰ এটা বেলন গঢ়ি ল'লে, তাৰ পিছত ঠিক সেই মাটিখিনিকেই পুনৰ গঢ়ি এটা গোলক তৈয়াৰ কৰিলে।

${img("sav-case1-cylinder-sphere-v2.png", "বাওঁফালে 6 চে.মি. ভূমি-ব্যাসাৰ্ধ আৰু 8 চে.মি. উচ্চতাৰ এটা বেলন, সোঁফালে সমান আয়তনৰ গোলকটো")}

ওপৰৰ পৰিস্থিতিটো পঢ়ি তলৰ প্ৰশ্নবোৰৰ উত্তৰ দিয়া।`,
      subs: [
        {
          question: "বেলনাকাৰ আকৃতিটোৰ আয়তন নিৰ্ণয় কৰা।",
          options: ["$288\\pi\\ \\text{cm}^3$", "$244\\pi\\ \\text{cm}^3$", "$240\\pi\\ \\text{cm}^3$", "$216\\pi\\ \\text{cm}^3$"],
          explanation: sol(
            "as",
            "$r = 6\\ \\text{cm}$, $h = 8\\ \\text{cm}$।",
            "$$V = \\pi r^2 h = \\pi (6)^2\\times 8 = \\pi\\times 36\\times 8 = 288\\pi\\ \\text{cm}^3$$",
            "বেলনটোৰ আয়তন $288\\pi\\ \\text{cm}^3$ — বিকল্প (A)।",
          ),
        },
        {
          question: "গোলকৰ আয়তনৰ সূত্ৰটো হ'ল",
          options: [
            "$\\dfrac{4}{3}\\pi r^2$",
            "$\\pi r^2 h$",
            "$\\dfrac{4}{3}\\pi r^3$",
            "$\\dfrac{2}{3}\\pi r^3$",
          ],
          explanation: sol(
            "as",
            "",
            "$r$ ব্যাসাৰ্ধৰ এটা গোলকৰ আয়তন $\\dfrac{4}{3}\\pi r^3$ আৰু পৃষ্ঠকালি $4\\pi r^2$।",
            "গোলকৰ আয়তন $\\dfrac{4}{3}\\pi r^3$ — বিকল্প (C)।",
            "বিকল্প (B) হ'ল বেলনৰ আয়তন আৰু বিকল্প (D) হ'ল অৰ্ধগোলকৰ আয়তন।",
          ),
        },
        {
          question: "মাটিখিনি এটা ঘনবস্তুৰ পৰা আন এটালৈ পুনৰ গঢ়ি লওঁতে ইয়াৰ কোনটো একেই থাকে?",
          options: ["কালি", "বক্ৰ পৃষ্ঠকালি", "ব্যাসাৰ্ধ", "আয়তন"],
          explanation: sol(
            "as",
            "",
            "মাটি একোৱেই যোগ কৰা হোৱা নাই আৰু একোৱেই আঁতৰোৱাও হোৱা নাই, গতিকে মাটিখিনিয়ে দখল কৰা স্থানৰ পৰিমাণ সলনি হ'ব নোৱাৰে। সেই পৰিমাণটোৱেই হৈছে ইয়াৰ **আয়তন**।\n\nআকৃতিটো সম্পূৰ্ণৰূপে সলনি হয়, গতিকে ইয়াৰ পৃষ্ঠকালি, বক্ৰ পৃষ্ঠকালি আৰু ব্যাসাৰ্ধ সকলোবোৰ তাৰ লগে লগে সলনি হয়।",
            "আয়তনটোৱেই একেই থাকে — বিকল্প (D)।",
            "এই এটা তথ্যৰ বলতেই প্ৰতিটো “গলাই পুনৰ গঢ়া” প্ৰশ্ন সমাধান কৰিব পাৰি: আয়তন দুটা সমান পাতি লোৱা।",
          ),
        },
        {
          question: "গোলকটোৰ ব্যাসাৰ্ধ হ'ল",
          options: ["$2$ চে.মি.", "$4$ চে.মি.", "$5$ চে.মি.", "$6$ চে.মি."],
          explanation: sol(
            "as",
            "গোলকৰ আয়তন $=$ বেলনৰ আয়তন $= 288\\pi\\ \\text{cm}^3$।",
            "$$\\frac{4}{3}\\pi R^3 = 288\\pi \\implies R^3 = \\frac{288\\times 3}{4} = 216$$\n\n$$R = \\sqrt[3]{216} = 6\\ \\text{cm}$$",
            "গোলকটোৰ ব্যাসাৰ্ধ $6$ চে.মি. — বিকল্প (D)।",
            "ইয়াত গোলকটোৰ ব্যাসাৰ্ধ বেলনটোৰ ব্যাসাৰ্ধৰ সমান হৈ পৰিছে; সেয়া এই সংখ্যাকেইটাৰ কাকতালীয় ফল, কোনো নিয়ম নহয়।",
          ),
        },
        {
          question: "শিক্ষয়িত্ৰীগৰাকীয়ে বনোৱা গোলকটোৰ আয়তন নিৰ্ণয় কৰা।",
          options: ["$288\\pi\\ \\text{cm}^3$", "$184\\pi\\ \\text{cm}^3$", "$240\\pi\\ \\text{cm}^3$", "$216\\pi\\ \\text{cm}^3$"],
          explanation: sol(
            "as",
            "একেই মাটিখিনিয়েই ব্যৱহাৰ হৈছে, গতিকে আয়তন অপৰিৱৰ্তিত।",
            "$$V_{\\text{sphere}} = V_{\\text{cylinder}} = 288\\pi\\ \\text{cm}^3$$\n\n$R = 6\\ \\text{cm}$ ৰে পোনে পোনে পৰীক্ষা কৰিলে:\n\n$$\\frac{4}{3}\\pi (6)^3 = \\frac{4}{3}\\pi\\times 216 = 288\\pi\\ \\text{cm}^3$$",
            "গোলকটোৰ আয়তন $288\\pi\\ \\text{cm}^3$ — বিকল্প (A)।",
          ),
        },
      ],
    },
  },
  {
    id: "case2-bird-feeder",
    difficulty: "moderate",
    figure: "sav-case2-sheets-v2.png",
    correctIndexes: [1, 2, 0, 3, 0],
    en: {
      passage: `Anwesha noticed that the birds visiting her terrace had nothing to eat, so she decided to build them a feeder. She took a flexible rectangular plastic sheet measuring $44\\ \\text{cm}\\times 15\\ \\text{cm}$, rolled it along its length and taped the two opposite edges together to form the tube of a cylinder. From a square sheet of size $15\\ \\text{cm}\\times 15\\ \\text{cm}$ she then cut out the circle she needed for the base, and the feeder was ready.

${img("sav-case2-sheets-v2.png", "A 44 cm by 15 cm rectangular sheet, and a 15 cm by 15 cm square sheet with the circular base marked on it as a dashed circle")}

Read the situation above and answer the questions that follow. (Take $\\pi = \\dfrac{22}{7}$.)`,
      subs: [
        {
          question: "The curved surface area of the cylinder that is formed is",
          options: ["$550\\ \\text{cm}^2$", "$660\\ \\text{cm}^2$", "$430\\ \\text{cm}^2$", "$840\\ \\text{cm}^2$"],
          explanation: sol(
            "en",
            "the rectangular sheet is $44\\ \\text{cm}\\times 15\\ \\text{cm}$ and it is rolled, not stretched.",
            "Rolling changes the shape but not the area, and the rolled sheet becomes exactly the curved surface of the cylinder.\n\n$$\\text{CSA} = \\text{area of the sheet} = 44\\times 15 = 660\\ \\text{cm}^2$$",
            "The curved surface area is $660\\ \\text{cm}^2$ — option (B).",
          ),
        },
        {
          question: "The radius of the base of the cylinder is",
          options: ["$5$ cm", "$6$ cm", "$7$ cm", "$8$ cm"],
          explanation: sol(
            "en",
            "the sheet is rolled along its **length**, so the $44$ cm edge becomes the circumference of the base.",
            "$$2\\pi r = 44 \\implies 2\\times\\frac{22}{7}\\times r = 44$$\n\n$$r = \\frac{44\\times 7}{2\\times 22} = 7\\ \\text{cm}$$",
            "The radius of the base is $7$ cm — option (C).",
            "The remaining $15$ cm edge becomes the height of the cylinder.",
          ),
        },
        {
          question: "The area of the circular base required for the cylinder is",
          options: ["$154\\ \\text{cm}^2$", "$164\\ \\text{cm}^2$", "$240\\ \\text{cm}^2$", "$184\\ \\text{cm}^2$"],
          explanation: sol(
            "en",
            "$r = 7\\ \\text{cm}$.",
            "$$\\text{area} = \\pi r^2 = \\frac{22}{7}\\times 7\\times 7 = 154\\ \\text{cm}^2$$",
            "The area of the circular base is $154\\ \\text{cm}^2$ — option (A).",
          ),
        },
        {
          question:
            "How much of the square sheet will be left unused once the circular base has been cut out of it?",
          options: ["$78\\ \\text{cm}^2$", "$62\\ \\text{cm}^2$", "$75\\ \\text{cm}^2$", "$71\\ \\text{cm}^2$"],
          explanation: sol(
            "en",
            "square sheet $15\\ \\text{cm}\\times 15\\ \\text{cm}$; circle of area $154\\ \\text{cm}^2$ removed.",
            "$$\\text{area of the square} = 15\\times 15 = 225\\ \\text{cm}^2$$\n\n$$\\text{left over} = 225 - 154 = 71\\ \\text{cm}^2$$",
            "The area left unused is $71\\ \\text{cm}^2$ — option (D).",
            "The circle has diameter $14$ cm, which does fit inside a $15$ cm square — with $0.5$ cm to spare on each side.",
          ),
        },
        {
          question: "The volume of seed that can be filled into the cylinder for the birds is",
          options: ["$2310\\ \\text{cm}^3$", "$2425\\ \\text{cm}^3$", "$2623\\ \\text{cm}^3$", "$2810\\ \\text{cm}^3$"],
          explanation: sol(
            "en",
            "$r = 7\\ \\text{cm}$, $h = 15\\ \\text{cm}$.",
            "$$V = \\pi r^2 h = \\frac{22}{7}\\times 7\\times 7\\times 15 = 22\\times 7\\times 15 = 2310\\ \\text{cm}^3$$",
            "The cylinder holds $2310\\ \\text{cm}^3$ of seed — option (A).",
          ),
        },
      ],
    },
    as: {
      passage: `অন্বেষাই লক্ষ্য কৰিলে যে তেওঁৰ ঘৰৰ চাললৈ অহা চৰাইবোৰে খাবলৈ একোৱেই পোৱা নাই, সেয়ে তেওঁ সিহঁতৰ বাবে এটা খাদ্যপাত্ৰ সাজিব বুলি ঠিক কৰিলে। তেওঁ $44\\ \\text{cm}\\times 15\\ \\text{cm}$ জোখৰ এখন নমনীয় আয়তাকাৰ প্লাষ্টিকৰ পাত ল'লে, ইয়াক দৈৰ্ঘ্যৰ কাষেৰে মেৰিয়াই বিপৰীত দাঁতি দুটা টেপেৰে লগ লগাই এটা বেলনৰ নলী গঠন কৰিলে। তাৰ পিছত $15\\ \\text{cm}\\times 15\\ \\text{cm}$ জোখৰ এখন বৰ্গাকাৰ পাতৰ পৰা তলিৰ বাবে লাগতিয়াল চক্ৰীটো কাটি উলিয়ালে, আৰু খাদ্যপাত্ৰটো সাজু হ'ল।

${img("sav-case2-sheets-v2.png", "44 চে.মি. বাই 15 চে.মি. আয়তাকাৰ পাত এখন, আৰু 15 চে.মি. বাই 15 চে.মি. বৰ্গাকাৰ পাত এখন য'ত চক্ৰীয় তলিটো ডাশ্‌ ৰেখাৰে চিহ্নিত")}

ওপৰৰ পৰিস্থিতিটো পঢ়ি তলৰ প্ৰশ্নবোৰৰ উত্তৰ দিয়া। ($\\pi = \\dfrac{22}{7}$ ধৰিবা।)`,
      subs: [
        {
          question: "গঠিত হোৱা বেলনটোৰ বক্ৰ পৃষ্ঠকালি হ'ল",
          options: ["$550\\ \\text{cm}^2$", "$660\\ \\text{cm}^2$", "$430\\ \\text{cm}^2$", "$840\\ \\text{cm}^2$"],
          explanation: sol(
            "as",
            "আয়তাকাৰ পাতখন $44\\ \\text{cm}\\times 15\\ \\text{cm}$ আৰু ইয়াক মেৰিওৱা হৈছে, টনা হোৱা নাই।",
            "মেৰিওৱাত আকৃতি সলনি হয় কিন্তু কালি সলনি নহয়, আৰু মেৰিওৱা পাতখনেই বেলনটোৰ বক্ৰ পৃষ্ঠ হৈ পৰে।\n\n$$\\text{CSA} = \\text{পাতখনৰ কালি} = 44\\times 15 = 660\\ \\text{cm}^2$$",
            "বক্ৰ পৃষ্ঠকালি $660\\ \\text{cm}^2$ — বিকল্প (B)।",
          ),
        },
        {
          question: "বেলনটোৰ ভূমিৰ ব্যাসাৰ্ধ হ'ল",
          options: ["$5$ চে.মি.", "$6$ চে.মি.", "$7$ চে.মি.", "$8$ চে.মি."],
          explanation: sol(
            "as",
            "পাতখন ইয়াৰ **দৈৰ্ঘ্য** ৰ কাষেৰে মেৰিওৱা হৈছে, গতিকে $44$ চে.মি. দাঁতিটো ভূমিৰ পৰিধি হৈ পৰে।",
            "$$2\\pi r = 44 \\implies 2\\times\\frac{22}{7}\\times r = 44$$\n\n$$r = \\frac{44\\times 7}{2\\times 22} = 7\\ \\text{cm}$$",
            "ভূমিৰ ব্যাসাৰ্ধ $7$ চে.মি. — বিকল্প (C)।",
            "বাকী থকা $15$ চে.মি. দাঁতিটো বেলনটোৰ উচ্চতা হৈ পৰে।",
          ),
        },
        {
          question: "বেলনটোৰ বাবে লাগতিয়াল চক্ৰীয় তলিটোৰ কালি হ'ল",
          options: ["$154\\ \\text{cm}^2$", "$164\\ \\text{cm}^2$", "$240\\ \\text{cm}^2$", "$184\\ \\text{cm}^2$"],
          explanation: sol(
            "as",
            "$r = 7\\ \\text{cm}$।",
            "$$\\text{কালি} = \\pi r^2 = \\frac{22}{7}\\times 7\\times 7 = 154\\ \\text{cm}^2$$",
            "চক্ৰীয় তলিটোৰ কালি $154\\ \\text{cm}^2$ — বিকল্প (A)।",
          ),
        },
        {
          question: "বৰ্গাকাৰ পাতখনৰ পৰা চক্ৰীয় তলিটো কাটি উলিওৱাৰ পিছত কিমান অংশ অব্যৱহৃত হৈ ৰ'ব?",
          options: ["$78\\ \\text{cm}^2$", "$62\\ \\text{cm}^2$", "$75\\ \\text{cm}^2$", "$71\\ \\text{cm}^2$"],
          explanation: sol(
            "as",
            "বৰ্গাকাৰ পাতখন $15\\ \\text{cm}\\times 15\\ \\text{cm}$; $154\\ \\text{cm}^2$ কালিৰ চক্ৰীটো আঁতৰোৱা হৈছে।",
            "$$\\text{বৰ্গটোৰ কালি} = 15\\times 15 = 225\\ \\text{cm}^2$$\n\n$$\\text{বাকী ৰোৱা} = 225 - 154 = 71\\ \\text{cm}^2$$",
            "অব্যৱহৃত হৈ ৰোৱা কালি $71\\ \\text{cm}^2$ — বিকল্প (D)।",
            "চক্ৰীটোৰ ব্যাস $14$ চে.মি., যিটো $15$ চে.মি. ৰ বৰ্গটোৰ ভিতৰত সোমায় — প্ৰতিফালে $0.5$ চে.মি. উদ্বৃত্ত থাকে।",
          ),
        },
        {
          question: "চৰাইৰ বাবে বেলনটোত ভৰাব পৰা গুটিৰ আয়তন হ'ল",
          options: ["$2310\\ \\text{cm}^3$", "$2425\\ \\text{cm}^3$", "$2623\\ \\text{cm}^3$", "$2810\\ \\text{cm}^3$"],
          explanation: sol(
            "as",
            "$r = 7\\ \\text{cm}$, $h = 15\\ \\text{cm}$।",
            "$$V = \\pi r^2 h = \\frac{22}{7}\\times 7\\times 7\\times 15 = 22\\times 7\\times 15 = 2310\\ \\text{cm}^3$$",
            "বেলনটোৱে $2310\\ \\text{cm}^3$ গুটি ধাৰণ কৰিব পাৰে — বিকল্প (A)।",
          ),
        },
      ],
    },
  },
  {
    id: "case3-ball-in-water",
    difficulty: "hard",
    figure: "sav-case3-water-rise-v2.png",
    correctIndexes: [1, 3, 2, 0, 1],
    en: {
      passage: `Nabajyoti wanted to find the radius $r$ of a small ball without measuring it directly. He took a cylindrical container of radius $R = 7$ cm and height $10$ cm and filled it a little under half way with water, as in figure (1). He then let the ball slip gently into the container, as in figure (2).

He saw that the water level climbed from $P$ to $Q$ — a rise of $3.4$ cm.

${img("sav-case3-water-rise-v2.png", "Figure (1): a cylinder of radius 7 cm and height 10 cm with water standing at level P. Figure (2): the same cylinder with the ball inside and the water risen 3.4 cm from P to Q")}

Read the situation above and answer the questions that follow. (Take $\\pi = \\dfrac{22}{7}$.)`,
      subs: [
        {
          question: "What is the approximate radius of the ball?",
          options: ["$3$ cm", "$5$ cm", "$7$ cm", "$9$ cm"],
          explanation: sol(
            "en",
            "$R = 7\\ \\text{cm}$, rise in water level $= 3.4\\ \\text{cm}$.",
            "The volume of the ball equals the volume of water it pushes up.\n\n$$\\frac{4}{3}\\pi r^3 = \\pi R^2\\times 3.4 = \\pi(7)^2\\times 3.4$$\n\n$$r^3 = \\frac{7\\times 7\\times 3.4\\times 3}{4} = 124.95$$\n\n$$r \\approx 5\\ \\text{cm}$$",
            "The radius of the ball is about $5$ cm — option (B).",
            "$5^3 = 125$, so $124.95$ is as good as an exact cube here.",
          ),
        },
        {
          question: "What is the volume of the cylinder?",
          options: ["$1260\\ \\text{cm}^3$", "$540\\ \\text{cm}^3$", "$1620\\ \\text{cm}^3$", "$1540\\ \\text{cm}^3$"],
          explanation: sol(
            "en",
            "$R = 7\\ \\text{cm}$, $h = 10\\ \\text{cm}$.",
            "$$V = \\pi R^2 h = \\frac{22}{7}\\times 7\\times 7\\times 10 = 22\\times 7\\times 10 = 1540\\ \\text{cm}^3$$",
            "The volume of the cylinder is $1540\\ \\text{cm}^3$ — option (D).",
          ),
        },
        {
          question: "What is the volume of the spherical ball?",
          options: ["$620\\ \\text{cm}^3$", "$824.26\\ \\text{cm}^3$", "$523.81\\ \\text{cm}^3$", "$430.1\\ \\text{cm}^3$"],
          explanation: sol(
            "en",
            "$r = 5\\ \\text{cm}$.",
            "$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\times\\frac{22}{7}\\times 5\\times 5\\times 5 = \\frac{11000}{21}$$\n\n$$= 523.81\\ \\text{cm}^3\\ \\text{(approx.)}$$",
            "The volume of the ball is about $523.81\\ \\text{cm}^3$ — option (C).",
          ),
        },
        {
          question: "How many litres of water can the full container hold?",
          options: ["$1.54$ litres", "$2$ litres", "$5$ litres", "$7.5$ litres"],
          explanation: sol(
            "en",
            "volume of the cylinder $= 1540\\ \\text{cm}^3$; $1$ litre $= 1000\\ \\text{cm}^3$.",
            "$$\\text{capacity} = \\frac{1540}{1000} = 1.54\\ \\text{litres}$$",
            "The container holds $1.54$ litres — option (A).",
          ),
        },
        {
          question: "What is the total surface area of the spherical ball?",
          options: ["$441.34\\ \\text{cm}^2$", "$314.29\\ \\text{cm}^2$", "$620\\ \\text{cm}^2$", "$816\\ \\text{cm}^2$"],
          explanation: sol(
            "en",
            "$r = 5\\ \\text{cm}$.",
            "$$\\text{TSA} = 4\\pi r^2 = 4\\times\\frac{22}{7}\\times 5\\times 5 = \\frac{2200}{7} = 314.29\\ \\text{cm}^2\\ \\text{(approx.)}$$",
            "The total surface area of the ball is about $314.29\\ \\text{cm}^2$ — option (B).",
            "A sphere has only one surface, so its curved surface area and its total surface area are the same number.",
          ),
        },
      ],
    },
    as: {
      passage: `নৱজ্যোতিয়ে পোনে পোনে নজুখাকৈ এটা সৰু বলৰ ব্যাসাৰ্ধ $r$ উলিয়াব বিচাৰিছিল। তেওঁ $R = 7$ চে.মি. ব্যাসাৰ্ধ আৰু $10$ চে.মি. উচ্চতাৰ এটা বেলনাকাৰ পাত্ৰ লৈ ইয়াত আধাতকৈ অলপ কম পানী ভৰালে, যেনেকৈ চিত্ৰ (1) ত দেখুওৱা হৈছে। তাৰ পিছত তেওঁ বলটো লাহেকৈ পাত্ৰটোত পেলাই দিলে, যেনেকৈ চিত্ৰ (2) ত আছে।

তেওঁ দেখিলে যে পানীৰ স্তৰটো $P$ ৰ পৰা $Q$ লৈ উঠি গ'ল — অৰ্থাৎ $3.4$ চে.মি. বাঢ়িল।

${img("sav-case3-water-rise-v2.png", "চিত্ৰ (1): 7 চে.মি. ব্যাসাৰ্ধ আৰু 10 চে.মি. উচ্চতাৰ এটা বেলন, পানী P স্তৰত। চিত্ৰ (2): একেই বেলনটো, ভিতৰত বলটো আৰু পানী P ৰ পৰা Q লৈ 3.4 চে.মি. বাঢ়িছে")}

ওপৰৰ পৰিস্থিতিটো পঢ়ি তলৰ প্ৰশ্নবোৰৰ উত্তৰ দিয়া। ($\\pi = \\dfrac{22}{7}$ ধৰিবা।)`,
      subs: [
        {
          question: "বলটোৰ আসন্ন ব্যাসাৰ্ধ কিমান?",
          options: ["$3$ চে.মি.", "$5$ চে.মি.", "$7$ চে.মি.", "$9$ চে.মি."],
          explanation: sol(
            "as",
            "$R = 7\\ \\text{cm}$, পানীৰ স্তৰৰ বৃদ্ধি $= 3.4\\ \\text{cm}$।",
            "বলটোৰ আয়তন, ই ওপৰলৈ ঠেলি দিয়া পানীখিনিৰ আয়তনৰ সমান।\n\n$$\\frac{4}{3}\\pi r^3 = \\pi R^2\\times 3.4 = \\pi(7)^2\\times 3.4$$\n\n$$r^3 = \\frac{7\\times 7\\times 3.4\\times 3}{4} = 124.95$$\n\n$$r \\approx 5\\ \\text{cm}$$",
            "বলটোৰ ব্যাসাৰ্ধ প্ৰায় $5$ চে.মি. — বিকল্প (B)।",
            "$5^3 = 125$, গতিকে ইয়াত $124.95$ এটা সঠিক ঘনৰ সমানেই।",
          ),
        },
        {
          question: "বেলনটোৰ আয়তন কিমান?",
          options: ["$1260\\ \\text{cm}^3$", "$540\\ \\text{cm}^3$", "$1620\\ \\text{cm}^3$", "$1540\\ \\text{cm}^3$"],
          explanation: sol(
            "as",
            "$R = 7\\ \\text{cm}$, $h = 10\\ \\text{cm}$।",
            "$$V = \\pi R^2 h = \\frac{22}{7}\\times 7\\times 7\\times 10 = 22\\times 7\\times 10 = 1540\\ \\text{cm}^3$$",
            "বেলনটোৰ আয়তন $1540\\ \\text{cm}^3$ — বিকল্প (D)।",
          ),
        },
        {
          question: "গোলাকাৰ বলটোৰ আয়তন কিমান?",
          options: ["$620\\ \\text{cm}^3$", "$824.26\\ \\text{cm}^3$", "$523.81\\ \\text{cm}^3$", "$430.1\\ \\text{cm}^3$"],
          explanation: sol(
            "as",
            "$r = 5\\ \\text{cm}$।",
            "$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\times\\frac{22}{7}\\times 5\\times 5\\times 5 = \\frac{11000}{21}$$\n\n$$= 523.81\\ \\text{cm}^3\\ \\text{(প্ৰায়)}$$",
            "বলটোৰ আয়তন প্ৰায় $523.81\\ \\text{cm}^3$ — বিকল্প (C)।",
          ),
        },
        {
          question: "সম্পূৰ্ণকৈ ভৰালে পাত্ৰটোত কিমান লিটাৰ পানী ধৰিব?",
          options: ["$1.54$ লিটাৰ", "$2$ লিটাৰ", "$5$ লিটাৰ", "$7.5$ লিটাৰ"],
          explanation: sol(
            "as",
            "বেলনটোৰ আয়তন $= 1540\\ \\text{cm}^3$; $1$ লিটাৰ $= 1000\\ \\text{cm}^3$।",
            "$$\\text{ধাৰণ ক্ষমতা} = \\frac{1540}{1000} = 1.54\\ \\text{লিটাৰ}$$",
            "পাত্ৰটোত $1.54$ লিটাৰ পানী ধৰিব — বিকল্প (A)।",
          ),
        },
        {
          question: "গোলাকাৰ বলটোৰ সম্পূৰ্ণ পৃষ্ঠকালি কিমান?",
          options: ["$441.34\\ \\text{cm}^2$", "$314.29\\ \\text{cm}^2$", "$620\\ \\text{cm}^2$", "$816\\ \\text{cm}^2$"],
          explanation: sol(
            "as",
            "$r = 5\\ \\text{cm}$।",
            "$$\\text{TSA} = 4\\pi r^2 = 4\\times\\frac{22}{7}\\times 5\\times 5 = \\frac{2200}{7} = 314.29\\ \\text{cm}^2\\ \\text{(প্ৰায়)}$$",
            "বলটোৰ সম্পূৰ্ণ পৃষ্ঠকালি প্ৰায় $314.29\\ \\text{cm}^2$ — বিকল্প (B)।",
            "গোলকৰ পৃষ্ঠ মাত্ৰ এখনেই, গতিকে ইয়াৰ বক্ৰ পৃষ্ঠকালি আৰু সম্পূৰ্ণ পৃষ্ঠকালি একেই সংখ্যা।",
          ),
        },
      ],
    },
  },
];
