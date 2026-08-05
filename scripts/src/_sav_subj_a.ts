/**
 * Subjective questions 1-20 of Books/TpA6OWPT3v9ql0s11FBO.pdf:
 *   VSA   Q1-Q10   -> qa part 0
 *   SA-I  Q11-Q20  -> qa part 1
 *
 * Worked answers follow the publisher's printed solutions (pp. 10-11); the
 * wording of each question is paraphrased for copyright while every given
 * number and every answer is unchanged.  Q17's original wording ("...height 2
 * times the base radius, which is square of 2...") was garbled in the source
 * and has been restated unambiguously with the same data the printed solution
 * actually uses ($r = 4$ m, $h = 2r$).
 */
import { SubjItem, sol } from "./_sav_bank";

export const SUBJ_A: SubjItem[] = [
  // ---------------------------------------------------------------- VSA ----
  {
    id: "v01-sheet-melted-into-cube",
    questionType: "1-mark",
    marks: 1,
    difficulty: "easy",
    part: 0,
    en: {
      question:
        "A metal sheet $27$ cm long, $8$ cm broad and $1$ cm thick is melted down and recast as a cube. Find the volume of the cube so formed.",
      answer: sol(
        "en",
        "the sheet is a cuboid of dimensions $27\\ \\text{cm}\\times 8\\ \\text{cm}\\times 1\\ \\text{cm}$.",
        "Melting and recasting changes the shape but not the amount of metal, so the cube has exactly the volume of the sheet.\n\n$$V = 27\\times 8\\times 1 = 216\\ \\text{cm}^3$$",
        "The volume of the cube formed is $216\\ \\text{cm}^3$.",
        "If the edge were wanted too, it would be $\\sqrt[3]{216} = 6$ cm.",
      ),
    },
    as: {
      question:
        "$27$ চে.মি. দীঘল, $8$ চে.মি. বহল আৰু $1$ চে.মি. ডাঠ ধাতুৰ এখন পাত গলাই এটা ঘনক গঢ়া হ'ল। এইদৰে গঠিত ঘনকটোৰ আয়তন নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "পাতখন হ'ল $27\\ \\text{cm}\\times 8\\ \\text{cm}\\times 1\\ \\text{cm}$ জোখৰ এটা আয়তঘন।",
        "গলাই পুনৰ গঢ়িলে আকৃতি সলনি হয়, কিন্তু ধাতুৰ পৰিমাণ সলনি নহয়, গতিকে ঘনকটোৰ আয়তন ঠিক পাতখনৰ আয়তনৰ সমান।\n\n$$V = 27\\times 8\\times 1 = 216\\ \\text{cm}^3$$",
        "গঠিত ঘনকটোৰ আয়তন $216\\ \\text{cm}^3$।",
        "ধাৰটোও বিচাৰিলে সেয়া হ'লহেঁতেন $\\sqrt[3]{216} = 6$ চে.মি.।",
      ),
    },
  },
  {
    id: "v02-open-box-weight",
    questionType: "2-mark",
    marks: 2,
    difficulty: "hard",
    part: 0,
    en: {
      question:
        "An open box has external dimensions $52$ cm, $40$ cm and $29$ cm, and its walls are $2$ cm thick. If $1\\ \\text{cm}^3$ of the metal used weighs $0.5$ g, find the weight of the box.",
      answer: sol(
        "en",
        "external dimensions $52\\ \\text{cm}\\times 40\\ \\text{cm}\\times 29\\ \\text{cm}$, thickness $= 2\\ \\text{cm}$, $1\\ \\text{cm}^3$ of metal weighs $0.5$ g.",
        "The box is **open**, so length and breadth each lose $2\\times 2 = 4$ cm, but the height loses only $2$ cm (there is a bottom but no lid).\n\n$$\\text{internal dimensions} = 48\\ \\text{cm}\\times 36\\ \\text{cm}\\times 27\\ \\text{cm}$$\n\n$$\\text{volume of metal} = 52\\times 40\\times 29 - 48\\times 36\\times 27 = 60320 - 46656 = 13664\\ \\text{cm}^3$$\n\n$$\\text{weight} = \\frac{13664\\times 0.5}{1000}\\ \\text{kg} = 6.832\\ \\text{kg}$$",
        "The box weighs $6.832$ kg.",
        "Subtracting $2\\times 2$ cm from the height as well would treat the box as closed and give the wrong volume of metal.",
      ),
    },
    as: {
      question:
        "মুকলি মুখৰ এটা বাকচৰ বাহ্যিক জোখ $52$ চে.মি., $40$ চে.মি. আৰু $29$ চে.মি., আৰু ইয়াৰ দেৱাল $2$ চে.মি. ডাঠ। যদি ব্যৱহৃত ধাতুৰ $1\\ \\text{cm}^3$ ৰ ওজন $0.5$ গ্ৰাম, তেন্তে বাকচটোৰ ওজন নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "বাহ্যিক জোখ $52\\ \\text{cm}\\times 40\\ \\text{cm}\\times 29\\ \\text{cm}$, ডাঠ $= 2\\ \\text{cm}$, ধাতুৰ $1\\ \\text{cm}^3$ ৰ ওজন $0.5$ গ্ৰাম।",
        "বাকচটোৰ মুখ **মুকলি**, গতিকে দৈৰ্ঘ্য আৰু প্ৰস্থ প্ৰতিটোৱে $2\\times 2 = 4$ চে.মি. হেৰুৱায়, কিন্তু উচ্চতাই হেৰুৱায় মাত্ৰ $2$ চে.মি. (তল আছে কিন্তু ঢাকনি নাই)।\n\n$$\\text{আভ্যন্তৰীণ জোখ} = 48\\ \\text{cm}\\times 36\\ \\text{cm}\\times 27\\ \\text{cm}$$\n\n$$\\text{ধাতুৰ আয়তন} = 52\\times 40\\times 29 - 48\\times 36\\times 27 = 60320 - 46656 = 13664\\ \\text{cm}^3$$\n\n$$\\text{ওজন} = \\frac{13664\\times 0.5}{1000}\\ \\text{kg} = 6.832\\ \\text{kg}$$",
        "বাকচটোৰ ওজন $6.832$ কি.গ্ৰা.।",
        "উচ্চতাৰ পৰাও $2\\times 2$ চে.মি. বিয়োগ কৰিলে বাকচটোক বন্ধ বুলি ধৰা হ'লহেঁতেন আৰু ধাতুৰ আয়তন ভুল ওলালহেঁতেন।",
      ),
    },
  },
  {
    id: "v03-cylinder-height-equal-volume-sphere",
    questionType: "1-mark",
    marks: 1,
    difficulty: "easy",
    part: 0,
    en: {
      question:
        "A circular cylinder and a sphere have the same radius, and their volumes are equal. Find the height of the cylinder.",
      answer: sol(
        "en",
        "radius of the cylinder $=$ radius of the sphere $= r$; the volumes are equal.",
        "$$\\pi r^2 h = \\frac{4}{3}\\pi r^3$$\n\nCancelling $\\pi r^2$ from both sides,\n\n$$h = \\frac{4}{3}r$$",
        "The height of the cylinder is $\\dfrac{4}{3}$ times its radius.",
      ),
    },
    as: {
      question:
        "এটা বৃত্তাকাৰ বেলন আৰু এটা গোলকৰ ব্যাসাৰ্ধ একেই, আৰু সিহঁতৰ আয়তনো সমান। বেলনটোৰ উচ্চতা নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "বেলনৰ ব্যাসাৰ্ধ $=$ গোলকৰ ব্যাসাৰ্ধ $= r$; আয়তন দুটা সমান।",
        "$$\\pi r^2 h = \\frac{4}{3}\\pi r^3$$\n\nদুয়োফালৰ পৰা $\\pi r^2$ কাটিলে,\n\n$$h = \\frac{4}{3}r$$",
        "বেলনটোৰ উচ্চতা ইয়াৰ ব্যাসাৰ্ধৰ $\\dfrac{4}{3}$ গুণ।",
      ),
    },
  },
  {
    id: "v04-cube-cut-into-two-cuboids",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 0,
    en: {
      question:
        "A solid cube is cut into two cuboids of equal volume. Find the total surface area of one of these cuboids.",
      answer: sol(
        "en",
        "the cube has edge $a$; it is cut into two cuboids of equal volume.",
        "One straight cut halves exactly one dimension, so each piece measures\n\n$$a\\ \\text{by}\\ a\\ \\text{by}\\ \\frac{a}{2}$$\n\n$$\\text{TSA} = 2\\left(a\\times a + a\\times\\frac{a}{2} + \\frac{a}{2}\\times a\\right) = 2\\left(a^2+\\frac{a^2}{2}+\\frac{a^2}{2}\\right) = 2\\left(2a^2\\right) = 4a^2$$",
        "The total surface area of one cuboid is $4a^2$ square units, where $a$ is the edge of the cube.",
        "The two halves together have surface area $8a^2$, which is more than the cube's own $6a^2$ — the cut creates two new faces of area $a^2$ each.",
      ),
    },
    as: {
      question:
        "এটা কঠিন ঘনকক সমান আয়তনৰ দুটা আয়তঘনত কটা হ'ল। এই আয়তঘন দুটাৰ এটাৰ সম্পূৰ্ণ পৃষ্ঠকালি নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "ঘনকটোৰ ধাৰ $a$; ইয়াক সমান আয়তনৰ দুটা আয়তঘনত কটা হৈছে।",
        "এটা পোন কাটিয়ে ঠিক এটা জোখকহে আধা কৰে, গতিকে প্ৰতিটো ডোখৰৰ জোখ হ'ব\n\n$$a\\ \\text{বাই}\\ a\\ \\text{বাই}\\ \\frac{a}{2}$$\n\n$$\\text{TSA} = 2\\left(a\\times a + a\\times\\frac{a}{2} + \\frac{a}{2}\\times a\\right) = 2\\left(a^2+\\frac{a^2}{2}+\\frac{a^2}{2}\\right) = 2\\left(2a^2\\right) = 4a^2$$",
        "এটা আয়তঘনৰ সম্পূৰ্ণ পৃষ্ঠকালি $4a^2$ বৰ্গ একক, য'ত $a$ হ'ল ঘনকটোৰ ধাৰ।",
        "দুয়োটা ডোখৰৰ মুঠ পৃষ্ঠকালি $8a^2$, যিটো ঘনকটোৰ নিজৰ $6a^2$ তকৈ বেছি — কাটিটোৱে $a^2$ কালিৰ দুখন নতুন পৃষ্ঠ সৃষ্টি কৰে।",
      ),
    },
  },
  {
    id: "v05-sphere-radius-doubled-ratio",
    questionType: "1-mark",
    marks: 1,
    difficulty: "easy",
    part: 0,
    en: {
      question:
        "If the radius of a sphere is doubled, what is the ratio of the volume of the first sphere to that of the second?",
      answer: sol(
        "en",
        "old radius $= r$, new radius $= 2r$.",
        "$$V_1 = \\frac{4}{3}\\pi r^3, \\qquad V_2 = \\frac{4}{3}\\pi (2r)^3 = \\frac{4}{3}\\pi\\times 8r^3$$\n\n$$V_1 : V_2 = \\frac{4}{3}\\pi r^3 : \\frac{32}{3}\\pi r^3 = 1 : 8$$",
        "The required ratio is $1 : 8$.",
        "Read the order carefully — the **first** (smaller) sphere is named first, so the answer is $1 : 8$, not $8 : 1$.",
      ),
    },
    as: {
      question:
        "যদি এটা গোলকৰ ব্যাসাৰ্ধ দুগুণ কৰা হয়, তেন্তে প্ৰথম গোলকটোৰ আয়তন আৰু দ্বিতীয়টোৰ আয়তনৰ অনুপাত কিমান?",
      answer: sol(
        "as",
        "আগৰ ব্যাসাৰ্ধ $= r$, নতুন ব্যাসাৰ্ধ $= 2r$।",
        "$$V_1 = \\frac{4}{3}\\pi r^3, \\qquad V_2 = \\frac{4}{3}\\pi (2r)^3 = \\frac{4}{3}\\pi\\times 8r^3$$\n\n$$V_1 : V_2 = \\frac{4}{3}\\pi r^3 : \\frac{32}{3}\\pi r^3 = 1 : 8$$",
        "বিচৰা অনুপাতটো $1 : 8$।",
        "ক্ৰমটো মনোযোগেৰে পঢ়া — **প্ৰথম** (সৰু) গোলকটোৰ কথা আগত কোৱা হৈছে, গতিকে উত্তৰটো $1 : 8$, $8 : 1$ নহয়।",
      ),
    },
  },
  {
    id: "v06-cinema-hall-volume",
    questionType: "1-mark",
    marks: 1,
    difficulty: "easy",
    part: 0,
    en: {
      question:
        "A cinema hall measures $120$ m, $50$ m and $30$ m. Find the volume of the hall.",
      answer: sol(
        "en",
        "$l = 120\\ \\text{m}$, $b = 50\\ \\text{m}$, $h = 30\\ \\text{m}$.",
        "The hall is a cuboid, so\n\n$$V = l\\times b\\times h = 120\\times 50\\times 30 = 180000\\ \\text{m}^3$$",
        "The volume of the hall is $180000\\ \\text{m}^3$.",
      ),
    },
    as: {
      question:
        "এখন চিনেমা হলৰ জোখ $120$ মি., $50$ মি. আৰু $30$ মি.। হলখনৰ আয়তন নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 120\\ \\text{m}$, $b = 50\\ \\text{m}$, $h = 30\\ \\text{m}$।",
        "হলখন এটা আয়তঘন, গতিকে\n\n$$V = l\\times b\\times h = 120\\times 50\\times 30 = 180000\\ \\text{m}^3$$",
        "হলখনৰ আয়তন $180000\\ \\text{m}^3$।",
      ),
    },
  },
  {
    id: "v07-sphere-inscribed-in-cube",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 0,
    en: {
      question:
        "A sphere is inscribed in a cube. Find the ratio of the volume of the cube to the volume of the sphere.",
      answer: sol(
        "en",
        "the sphere touches all six faces of the cube, so the edge of the cube equals the diameter of the sphere. Let the edge be $a$.",
        "$$\\text{radius of the sphere} = \\frac{a}{2}$$\n\n$$V_{\\text{cube}} = a^3, \\qquad V_{\\text{sphere}} = \\frac{4}{3}\\pi\\left(\\frac{a}{2}\\right)^3 = \\frac{\\pi a^3}{6}$$\n\n$$\\frac{V_{\\text{cube}}}{V_{\\text{sphere}}} = \\frac{a^3}{\\tfrac{\\pi a^3}{6}} = \\frac{6}{\\pi}$$",
        "The required ratio is $6 : \\pi$.",
        "The answer carries no $a$, so it is the same for every cube — the inscribed sphere always fills about $52\\%$ of the cube.",
      ),
    },
    as: {
      question:
        "এটা ঘনকৰ ভিতৰত এটা গোলক অন্তৰ্লিখিত কৰা হৈছে। ঘনকটোৰ আয়তন আৰু গোলকটোৰ আয়তনৰ অনুপাত নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "গোলকটোৱে ঘনকটোৰ ছয়োখন পৃষ্ঠকে স্পৰ্শ কৰে, গতিকে ঘনকটোৰ ধাৰ গোলকটোৰ ব্যাসৰ সমান। ধাৰটো $a$ ধৰা হ'ল।",
        "$$\\text{গোলকটোৰ ব্যাসাৰ্ধ} = \\frac{a}{2}$$\n\n$$V_{\\text{cube}} = a^3, \\qquad V_{\\text{sphere}} = \\frac{4}{3}\\pi\\left(\\frac{a}{2}\\right)^3 = \\frac{\\pi a^3}{6}$$\n\n$$\\frac{V_{\\text{cube}}}{V_{\\text{sphere}}} = \\frac{a^3}{\\tfrac{\\pi a^3}{6}} = \\frac{6}{\\pi}$$",
        "বিচৰা অনুপাতটো $6 : \\pi$।",
        "উত্তৰটোত $a$ নাই, গতিকে ই প্ৰতিটো ঘনকৰ বাবেই একে — অন্তৰ্লিখিত গোলকে সদায় ঘনকটোৰ প্ৰায় $52\\%$ ভৰাই ৰাখে।",
      ),
    },
  },
  {
    id: "v08-teak-log-planks",
    questionType: "1-mark",
    marks: 1,
    difficulty: "easy",
    part: 0,
    en: {
      question:
        "A teak wood log is a cuboid of volume $76800\\ \\text{m}^3$. How many rectangular planks of size $40\\ \\text{m}\\times 12\\ \\text{m}\\times 20\\ \\text{m}$ can be cut from it?",
      answer: sol(
        "en",
        "volume of the log $= 76800\\ \\text{m}^3$; each plank is $40\\ \\text{m}\\times 12\\ \\text{m}\\times 20\\ \\text{m}$.",
        "$$\\text{volume of one plank} = 40\\times 12\\times 20 = 9600\\ \\text{m}^3$$\n\n$$\\text{number of planks} = \\frac{76800}{9600} = 8$$",
        "$8$ planks can be cut from the log.",
      ),
    },
    as: {
      question:
        "চেগুন কাঠৰ এটা গুৰি হ'ল $76800\\ \\text{m}^3$ আয়তনৰ এটা আয়তঘন। ইয়াৰ পৰা $40\\ \\text{m}\\times 12\\ \\text{m}\\times 20\\ \\text{m}$ জোখৰ কিমানখন আয়তাকাৰ তক্তা কাটিব পাৰি?",
      answer: sol(
        "as",
        "গুৰিটোৰ আয়তন $= 76800\\ \\text{m}^3$; প্ৰতিখন তক্তা $40\\ \\text{m}\\times 12\\ \\text{m}\\times 20\\ \\text{m}$।",
        "$$\\text{এখন তক্তাৰ আয়তন} = 40\\times 12\\times 20 = 9600\\ \\text{m}^3$$\n\n$$\\text{তক্তাৰ সংখ্যা} = \\frac{76800}{9600} = 8$$",
        "গুৰিটোৰ পৰা $8$ খন তক্তা কাটিব পাৰি।",
      ),
    },
  },
  {
    id: "v09-cylinder-cone-volume-ratio",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 0,
    en: {
      question:
        "The radii of the bases of a cylinder and a cone are in the ratio $3 : 4$ and their heights are in the ratio $2 : 3$. Find the ratio of their volumes.",
      answer: sol(
        "en",
        "radii $= 3x$ (cylinder) and $4x$ (cone); heights $= 2y$ (cylinder) and $3y$ (cone).",
        "$$V_{\\text{cylinder}} = \\pi(3x)^2(2y) = 18\\pi x^2 y$$\n\n$$V_{\\text{cone}} = \\frac{1}{3}\\pi(4x)^2(3y) = \\frac{1}{3}\\pi\\times 16x^2\\times 3y = 16\\pi x^2 y$$\n\n$$V_{\\text{cylinder}} : V_{\\text{cone}} = 18 : 16 = 9 : 8$$",
        "The ratio of their volumes is $9 : 8$.",
        "The cone has the bigger base and the greater height yet the smaller volume, because of the factor $\\tfrac13$ in its formula.",
      ),
    },
    as: {
      question:
        "এটা বেলন আৰু এটা শংকুৰ ভূমিৰ ব্যাসাৰ্ধৰ অনুপাত $3 : 4$ আৰু সিহঁতৰ উচ্চতাৰ অনুপাত $2 : 3$। সিহঁতৰ আয়তনৰ অনুপাত নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "ব্যাসাৰ্ধ $= 3x$ (বেলন) আৰু $4x$ (শংকু); উচ্চতা $= 2y$ (বেলন) আৰু $3y$ (শংকু)।",
        "$$V_{\\text{cylinder}} = \\pi(3x)^2(2y) = 18\\pi x^2 y$$\n\n$$V_{\\text{cone}} = \\frac{1}{3}\\pi(4x)^2(3y) = \\frac{1}{3}\\pi\\times 16x^2\\times 3y = 16\\pi x^2 y$$\n\n$$V_{\\text{cylinder}} : V_{\\text{cone}} = 18 : 16 = 9 : 8$$",
        "সিহঁতৰ আয়তনৰ অনুপাত $9 : 8$।",
        "শংকুটোৰ ভূমি ডাঙৰ আৰু উচ্চতাও বেছি, তথাপি ইয়াৰ আয়তন কম — কাৰণ ইয়াৰ সূত্ৰত $\\tfrac13$ গুণকটো আছে।",
      ),
    },
  },
  {
    id: "v10-hemisphere-volume-from-base-area",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 0,
    en: {
      question:
        "The area of the base of a solid hemisphere is $81\\pi$ sq. cm. Find its volume.",
      answer: sol(
        "en",
        "area of the flat circular base $= 81\\pi\\ \\text{cm}^2$.",
        "$$\\pi r^2 = 81\\pi \\implies r^2 = 81 \\implies r = 9\\ \\text{cm}$$\n\n$$V = \\frac{2}{3}\\pi r^3 = \\frac{2}{3}\\pi (9)^3 = \\frac{2}{3}\\pi\\times 729 = 486\\pi\\ \\text{cm}^3$$",
        "The volume of the hemisphere is $486\\pi\\ \\text{cm}^3$.",
        "The base of a hemisphere is the flat circular face, of area $\\pi r^2$ — not the curved surface $2\\pi r^2$.",
      ),
    },
    as: {
      question:
        "এটা কঠিন অৰ্ধগোলকৰ ভূমিৰ কালি $81\\pi$ বৰ্গ চে.মি.। ইয়াৰ আয়তন নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "সমতল চক্ৰীয় ভূমিটোৰ কালি $= 81\\pi\\ \\text{cm}^2$।",
        "$$\\pi r^2 = 81\\pi \\implies r^2 = 81 \\implies r = 9\\ \\text{cm}$$\n\n$$V = \\frac{2}{3}\\pi r^3 = \\frac{2}{3}\\pi (9)^3 = \\frac{2}{3}\\pi\\times 729 = 486\\pi\\ \\text{cm}^3$$",
        "অৰ্ধগোলকটোৰ আয়তন $486\\pi\\ \\text{cm}^3$।",
        "অৰ্ধগোলকৰ ভূমি হ'ল সমতল চক্ৰীয় পৃষ্ঠখন, যাৰ কালি $\\pi r^2$ — বক্ৰ পৃষ্ঠ $2\\pi r^2$ নহয়।",
      ),
    },
  },

  // --------------------------------------------------------------- SA-I ----
  {
    id: "s11-three-cubes-joined-surface-area",
    questionType: "2-mark",
    marks: 2,
    difficulty: "easy",
    part: 1,
    en: {
      question:
        "Three cubes, each of edge $5$ cm, are joined end to end. Find the surface area of the resulting cuboid.",
      answer: sol(
        "en",
        "three cubes of edge $5$ cm joined in a row.",
        "$$l = 5+5+5 = 15\\ \\text{cm},\\qquad b = 5\\ \\text{cm},\\qquad h = 5\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2(15\\times 5 + 5\\times 5 + 5\\times 15)$$\n\n$$= 2(75+25+75) = 2\\times 175 = 350\\ \\text{cm}^2$$",
        "The surface area of the resulting cuboid is $350\\ \\text{cm}^2$.",
        "Three separate cubes would have shown $3\\times 150 = 450\\ \\text{cm}^2$; joining them hides four faces of $25\\ \\text{cm}^2$ each.",
      ),
    },
    as: {
      question:
        "প্ৰতিটো $5$ চে.মি. ধাৰৰ তিনিটা ঘনক মূৰে-মূৰে লগ লগোৱা হ'ল। ফলত পোৱা আয়তঘনটোৰ পৃষ্ঠকালি নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$5$ চে.মি. ধাৰৰ তিনিটা ঘনক শাৰী পাতি লগ লগোৱা হৈছে।",
        "$$l = 5+5+5 = 15\\ \\text{cm},\\qquad b = 5\\ \\text{cm},\\qquad h = 5\\ \\text{cm}$$\n\n$$\\text{TSA} = 2(lb+bh+hl) = 2(15\\times 5 + 5\\times 5 + 5\\times 15)$$\n\n$$= 2(75+25+75) = 2\\times 175 = 350\\ \\text{cm}^2$$",
        "ফলত পোৱা আয়তঘনটোৰ পৃষ্ঠকালি $350\\ \\text{cm}^2$।",
        "পৃথকে থাকিলে তিনিটা ঘনকৰ মুঠ $3\\times 150 = 450\\ \\text{cm}^2$ হ'লহেঁতেন; লগ লগালে $25\\ \\text{cm}^2$ কৈ চাৰিখন পৃষ্ঠ ঢাক খায়।",
      ),
    },
  },
  {
    id: "s12-sphere-diameter-from-tsa-616",
    questionType: "2-mark",
    marks: 2,
    difficulty: "easy",
    part: 1,
    en: {
      question:
        "Find the diameter of the sphere whose total surface area is $616\\ \\text{cm}^2$.",
      answer: sol(
        "en",
        "surface area of the sphere $= 616\\ \\text{cm}^2$.",
        "$$4\\pi r^2 = 616 \\implies 4\\times\\frac{22}{7}\\times r^2 = 616$$\n\n$$r^2 = \\frac{616\\times 7}{4\\times 22} = \\frac{4312}{88} = 49 \\implies r = 7\\ \\text{cm}$$\n\n$$d = 2r = 14\\ \\text{cm}$$",
        "The diameter of the sphere is $14$ cm.",
      ),
    },
    as: {
      question:
        "যিটো গোলকৰ সম্পূৰ্ণ পৃষ্ঠকালি $616\\ \\text{cm}^2$, তাৰ ব্যাস নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "গোলকটোৰ পৃষ্ঠকালি $= 616\\ \\text{cm}^2$।",
        "$$4\\pi r^2 = 616 \\implies 4\\times\\frac{22}{7}\\times r^2 = 616$$\n\n$$r^2 = \\frac{616\\times 7}{4\\times 22} = \\frac{4312}{88} = 49 \\implies r = 7\\ \\text{cm}$$\n\n$$d = 2r = 14\\ \\text{cm}$$",
        "গোলকটোৰ ব্যাস $14$ চে.মি.।",
      ),
    },
  },
  {
    id: "s13-cube-immersed-water-rise",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 1,
    en: {
      question:
        "A cube of edge $8$ cm is completely immersed in a rectangular vessel containing water. If the base of the vessel measures $17$ cm by $14$ cm, find the rise in the water level.",
      answer: sol(
        "en",
        "edge of the cube $= 8\\ \\text{cm}$; base of the vessel $= 17\\ \\text{cm}\\times 14\\ \\text{cm}$.",
        "$$\\text{volume of the cube} = 8^3 = 512\\ \\text{cm}^3$$\n\nThe water pushed aside forms a layer of the same volume across the whole base. Let the rise be $x$ cm.\n\n$$17\\times 14\\times x = 512 \\implies 238x = 512$$\n\n$$x = \\frac{512}{238} = 2.15\\ \\text{cm}\\ \\text{(approx.)}$$",
        "The water level rises by about $2.15$ cm.",
        "This works only because the cube is **completely** immersed — otherwise the displaced volume would be less than $512\\ \\text{cm}^3$.",
      ),
    },
    as: {
      question:
        "$8$ চে.মি. ধাৰৰ এটা ঘনক পানী থকা এটা আয়তাকাৰ পাত্ৰত সম্পূৰ্ণকৈ ডুবাই দিয়া হ'ল। যদি পাত্ৰটোৰ তলিৰ জোখ $17$ চে.মি. বাই $14$ চে.মি., তেন্তে পানীৰ স্তৰৰ বৃদ্ধি নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "ঘনকটোৰ ধাৰ $= 8\\ \\text{cm}$; পাত্ৰটোৰ তলি $= 17\\ \\text{cm}\\times 14\\ \\text{cm}$।",
        "$$\\text{ঘনকটোৰ আয়তন} = 8^3 = 512\\ \\text{cm}^3$$\n\nআঁতৰি যোৱা পানীখিনিয়ে গোটেই তলিখনৰ ওপৰত সেই একেই আয়তনৰ এটা স্তৰ গঠন কৰে। বৃদ্ধিটো $x$ চে.মি. ধৰা হ'ল।\n\n$$17\\times 14\\times x = 512 \\implies 238x = 512$$\n\n$$x = \\frac{512}{238} = 2.15\\ \\text{cm}\\ \\text{(প্ৰায়)}$$",
        "পানীৰ স্তৰ প্ৰায় $2.15$ চে.মি. বাঢ়ে।",
        "এইটো খাটে কেৱল ঘনকটো **সম্পূৰ্ণকৈ** ডুবি থকা বাবেহে — নহ'লে অপসাৰিত আয়তন $512\\ \\text{cm}^3$ তকৈ কম হ'লহেঁতেন।",
      ),
    },
  },
  {
    id: "s14-cold-storage-volume",
    questionType: "2-mark",
    marks: 2,
    difficulty: "hard",
    part: 1,
    en: {
      question:
        "The length of a cold storage is three times its breadth and its height is $5$ m. The area of its four walls (including the doors) is $256\\ \\text{m}^2$. Find its volume.",
      answer: sol(
        "en",
        "$l = 3b$, $h = 5\\ \\text{m}$, area of four walls $= 256\\ \\text{m}^2$.",
        "$$2(l+b)h = 256 \\implies 2(3b+b)\\times 5 = 256$$\n\n$$40b = 256 \\implies b = 6.4\\ \\text{m}, \\qquad l = 3\\times 6.4 = 19.2\\ \\text{m}$$\n\n$$V = l\\times b\\times h = 19.2\\times 6.4\\times 5 = 614.4\\ \\text{m}^3$$",
        "The volume of the cold storage is $614.4\\ \\text{m}^3$.",
        "\"Area of the four walls\" is the lateral surface area $2(l+b)h$; the floor and the ceiling are not part of it.",
      ),
    },
    as: {
      question:
        "এটা শীতল ভঁৰালৰ দৈৰ্ঘ্য ইয়াৰ প্ৰস্থৰ তিনি গুণ আৰু ইয়াৰ উচ্চতা $5$ মি.। ইয়াৰ চাৰিওখন দেৱালৰ (দুৱাৰকে ধৰি) কালি $256\\ \\text{m}^2$। ইয়াৰ আয়তন নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 3b$, $h = 5\\ \\text{m}$, চাৰিওখন দেৱালৰ কালি $= 256\\ \\text{m}^2$।",
        "$$2(l+b)h = 256 \\implies 2(3b+b)\\times 5 = 256$$\n\n$$40b = 256 \\implies b = 6.4\\ \\text{m}, \\qquad l = 3\\times 6.4 = 19.2\\ \\text{m}$$\n\n$$V = l\\times b\\times h = 19.2\\times 6.4\\times 5 = 614.4\\ \\text{m}^3$$",
        "শীতল ভঁৰালটোৰ আয়তন $614.4\\ \\text{m}^3$।",
        "“চাৰিওখন দেৱালৰ কালি” মানে কাষৰ পৃষ্ঠকালি $2(l+b)h$; মজিয়া আৰু চালখন ইয়াৰ অন্তৰ্ভুক্ত নহয়।",
      ),
    },
  },
  {
    id: "s15-two-cones-volume-ratio",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 1,
    en: {
      question:
        "Two cones have their heights in the ratio $1 : 4$ and the radii of their bases in the ratio $4 : 1$. Find the ratio of their volumes.",
      answer: sol(
        "en",
        "heights $= h$ and $4h$; base radii $= 4r$ and $r$.",
        "$$V_1 = \\frac{1}{3}\\pi(4r)^2 h = \\frac{16\\pi r^2 h}{3}$$\n\n$$V_2 = \\frac{1}{3}\\pi r^2 (4h) = \\frac{4\\pi r^2 h}{3}$$\n\n$$\\frac{V_1}{V_2} = \\frac{16}{4} = \\frac{4}{1}$$",
        "The ratio of their volumes is $4 : 1$.",
        "The radius is squared but the height is not, which is why the wide, short cone wins.",
      ),
    },
    as: {
      question:
        "দুটা শংকুৰ উচ্চতাৰ অনুপাত $1 : 4$ আৰু সিহঁতৰ ভূমিৰ ব্যাসাৰ্ধৰ অনুপাত $4 : 1$। সিহঁতৰ আয়তনৰ অনুপাত নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "উচ্চতা $= h$ আৰু $4h$; ভূমিৰ ব্যাসাৰ্ধ $= 4r$ আৰু $r$।",
        "$$V_1 = \\frac{1}{3}\\pi(4r)^2 h = \\frac{16\\pi r^2 h}{3}$$\n\n$$V_2 = \\frac{1}{3}\\pi r^2 (4h) = \\frac{4\\pi r^2 h}{3}$$\n\n$$\\frac{V_1}{V_2} = \\frac{16}{4} = \\frac{4}{1}$$",
        "সিহঁতৰ আয়তনৰ অনুপাত $4 : 1$।",
        "ব্যাসাৰ্ধটো বৰ্গ হয় কিন্তু উচ্চতাটো নহয়, সেয়েহে বহল আৰু চাপৰ শংকুটোৱেই আগবাঢ়ি যায়।",
      ),
    },
  },
  {
    id: "s16-21-hemispherical-bowls-capacity",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 1,
    en: {
      question:
        "The radius of the circular part of a hemispherical bowl is $9$ cm. Find the total capacity of $21$ such bowls.",
      answer: sol(
        "en",
        "$r = 9\\ \\text{cm}$; there are $21$ identical bowls.",
        "$$\\text{volume of one bowl} = \\frac{2}{3}\\pi r^3 = \\frac{2}{3}\\times\\frac{22}{7}\\times 9^3 = \\frac{2\\times 22\\times 729}{21}\\ \\text{cm}^3$$\n\n$$\\text{capacity of }21\\text{ bowls} = 21\\times\\frac{2\\times 22\\times 729}{21} = 2\\times 22\\times 729 = 32076\\ \\text{cm}^3$$",
        "The total capacity of the $21$ bowls is $32076\\ \\text{cm}^3$.",
        "The $21$ cancels the $7$ hidden in $\\pi = \\tfrac{22}{7}$ together with the $3$ in the formula, so the answer stays a whole number.",
      ),
    },
    as: {
      question:
        "এটা অৰ্ধগোলাকাৰ বাটিৰ চক্ৰীয় অংশটোৰ ব্যাসাৰ্ধ $9$ চে.মি.। এনে $21$ টা বাটিৰ মুঠ ধাৰণ ক্ষমতা নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$r = 9\\ \\text{cm}$; একেধৰণৰ $21$ টা বাটি আছে।",
        "$$\\text{এটা বাটিৰ আয়তন} = \\frac{2}{3}\\pi r^3 = \\frac{2}{3}\\times\\frac{22}{7}\\times 9^3 = \\frac{2\\times 22\\times 729}{21}\\ \\text{cm}^3$$\n\n$$21\\text{ টা বাটিৰ ধাৰণ ক্ষমতা} = 21\\times\\frac{2\\times 22\\times 729}{21} = 2\\times 22\\times 729 = 32076\\ \\text{cm}^3$$",
        "$21$ টা বাটিৰ মুঠ ধাৰণ ক্ষমতা $32076\\ \\text{cm}^3$।",
        "$21$ টোৱে $\\pi = \\tfrac{22}{7}$ ত লুকাই থকা $7$ আৰু সূত্ৰটোৰ $3$ দুয়োটাকে কাটি দিয়ে, সেয়েহে উত্তৰটো পূৰ্ণসংখ্যা হৈ থাকে।",
      ),
    },
  },
  {
    id: "s17-cloth-length-for-cone",
    questionType: "2-mark",
    marks: 2,
    difficulty: "hard",
    part: 1,
    en: {
      question:
        "A cone has base radius $2^2$ m and its height is twice the base radius. Cloth $100\\pi$ m wide is used to make its curved surface. Find the length of cloth required.",
      answer: sol(
        "en",
        "$r = 2^2 = 4\\ \\text{m}$, $h = 2r = 8\\ \\text{m}$, width of the cloth $= 100\\pi\\ \\text{m}$.",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{4^2+8^2} = \\sqrt{16+64} = \\sqrt{80} = 4\\sqrt{5}\\ \\text{m}$$\n\n$$\\text{CSA} = \\pi r l = \\pi\\times 4\\times 4\\sqrt{5} = 16\\sqrt{5}\\,\\pi\\ \\text{m}^2$$\n\nThe cloth is a rectangle of the same area, so\n\n$$\\text{length} = \\frac{16\\sqrt{5}\\,\\pi}{100\\pi} = \\frac{16\\sqrt{5}}{100} = 0.36\\ \\text{m}\\ \\text{(approx.)}$$",
        "The length of cloth required is about $0.36$ m, that is $36$ cm.",
        "Only the curved surface is covered by cloth; the circular base of a cone is left open.",
      ),
    },
    as: {
      question:
        "এটা শংকুৰ ভূমিৰ ব্যাসাৰ্ধ $2^2$ মি. আৰু ইয়াৰ উচ্চতা ভূমিৰ ব্যাসাৰ্ধৰ দুগুণ। ইয়াৰ বক্ৰ পৃষ্ঠ বনাবলৈ $100\\pi$ মি. বহল কাপোৰ ব্যৱহাৰ কৰা হৈছে। প্ৰয়োজনীয় কাপোৰৰ দৈৰ্ঘ্য নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$r = 2^2 = 4\\ \\text{m}$, $h = 2r = 8\\ \\text{m}$, কাপোৰৰ প্ৰস্থ $= 100\\pi\\ \\text{m}$।",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{4^2+8^2} = \\sqrt{16+64} = \\sqrt{80} = 4\\sqrt{5}\\ \\text{m}$$\n\n$$\\text{CSA} = \\pi r l = \\pi\\times 4\\times 4\\sqrt{5} = 16\\sqrt{5}\\,\\pi\\ \\text{m}^2$$\n\nকাপোৰখন একেই কালিৰ এখন আয়তক্ষেত্ৰ, গতিকে\n\n$$\\text{দৈৰ্ঘ্য} = \\frac{16\\sqrt{5}\\,\\pi}{100\\pi} = \\frac{16\\sqrt{5}}{100} = 0.36\\ \\text{m}\\ \\text{(প্ৰায়)}$$",
        "প্ৰয়োজনীয় কাপোৰৰ দৈৰ্ঘ্য প্ৰায় $0.36$ মি., অৰ্থাৎ $36$ চে.মি.।",
        "কাপোৰেৰে কেৱল বক্ৰ পৃষ্ঠটোহে ঢকা হয়; শংকুৰ চক্ৰীয় ভূমিটো মুকলি হৈয়ে থাকে।",
      ),
    },
  },
  {
    id: "s18-dome-painting-cost",
    questionType: "2-mark",
    marks: 2,
    difficulty: "easy",
    part: 1,
    en: {
      question:
        "The dome of a building is in the form of a hemisphere. If its radius is $14$ cm, find the cost of painting it at ₹$3$ per sq. cm.",
      answer: sol(
        "en",
        "$r = 14\\ \\text{cm}$, rate $=$ ₹$3$ per $\\text{cm}^2$; only the curved surface of a dome is painted.",
        "$$\\text{CSA} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times 14\\times 14 = 2\\times 22\\times 2\\times 14 = 1232\\ \\text{cm}^2$$\n\n$$\\text{cost} = 1232\\times 3 = 3696$$",
        "The cost of painting the dome is ₹$3696$.",
        "A dome's flat circular rim is not painted, so $2\\pi r^2$ is used and not $3\\pi r^2$.",
      ),
    },
    as: {
      question:
        "এটা অট্টালিকাৰ গম্বুজ অৰ্ধগোলকৰ আকৃতিৰ। যদি ইয়াৰ ব্যাসাৰ্ধ $14$ চে.মি., তেন্তে প্ৰতি বৰ্গ চে.মি.ত ₹$3$ হাৰত ইয়াক ৰং কৰাৰ খৰচ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$r = 14\\ \\text{cm}$, হাৰ $=$ প্ৰতি $\\text{cm}^2$ ত ₹$3$; গম্বুজৰ কেৱল বক্ৰ পৃষ্ঠটোহে ৰং কৰা হয়।",
        "$$\\text{CSA} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times 14\\times 14 = 2\\times 22\\times 2\\times 14 = 1232\\ \\text{cm}^2$$\n\n$$\\text{খৰচ} = 1232\\times 3 = 3696$$",
        "গম্বুজটো ৰং কৰাৰ খৰচ ₹$3696$।",
        "গম্বুজৰ সমতল চক্ৰীয় দাঁতিখন ৰং কৰা নহয়, সেয়েহে $3\\pi r^2$ নহয়, $2\\pi r^2$ ব্যৱহাৰ কৰা হৈছে।",
      ),
    },
  },
  {
    id: "s19-cone-20x-from-csa-154",
    questionType: "2-mark",
    marks: 2,
    difficulty: "easy",
    part: 1,
    en: {
      question:
        "The curved surface area of a cone is $154\\ \\text{cm}^2$. If its radius is $x$ cm and its slant height is $7$ cm, find the value of $20x$.",
      answer: sol(
        "en",
        "CSA $= 154\\ \\text{cm}^2$, $l = 7\\ \\text{cm}$, $r = x\\ \\text{cm}$.",
        "$$\\pi r l = 154 \\implies \\frac{22}{7}\\times x\\times 7 = 154$$\n\n$$22x = 154 \\implies x = 7$$\n\n$$20x = 20\\times 7 = 140$$",
        "The value of $20x$ is $140$.",
        "The question does not stop at $x$; the last multiplication is part of the answer.",
      ),
    },
    as: {
      question:
        "এটা শংকুৰ বক্ৰ পৃষ্ঠকালি $154\\ \\text{cm}^2$। যদি ইয়াৰ ব্যাসাৰ্ধ $x$ চে.মি. আৰু তিৰ্যক উচ্চতা $7$ চে.মি., তেন্তে $20x$ ৰ মান নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "CSA $= 154\\ \\text{cm}^2$, $l = 7\\ \\text{cm}$, $r = x\\ \\text{cm}$।",
        "$$\\pi r l = 154 \\implies \\frac{22}{7}\\times x\\times 7 = 154$$\n\n$$22x = 154 \\implies x = 7$$\n\n$$20x = 20\\times 7 = 140$$",
        "$20x$ ৰ মান $140$।",
        "প্ৰশ্নটো $x$ তে ৰৈ নাযায়; শেষৰ পূৰণটোও উত্তৰৰ অংশ।",
      ),
    },
  },
  {
    id: "s20-cylinder-radius-from-csa-968",
    questionType: "2-mark",
    marks: 2,
    difficulty: "moderate",
    part: 1,
    en: {
      question:
        "The height of a cylinder is $11$ cm and the area of its curved surface is $968$ sq. cm. Find the radius of the cylinder.",
      answer: sol(
        "en",
        "$h = 11\\ \\text{cm}$, CSA $= 968\\ \\text{cm}^2$.",
        "$$2\\pi r h = 968 \\implies 2\\times\\frac{22}{7}\\times r\\times 11 = 968$$\n\n$$\\frac{484}{7}r = 968 \\implies r = \\frac{968\\times 7}{484} = 14\\ \\text{cm}$$",
        "The radius of the cylinder is $14$ cm.",
      ),
    },
    as: {
      question:
        "এটা বেলনৰ উচ্চতা $11$ চে.মি. আৰু ইয়াৰ বক্ৰ পৃষ্ঠৰ কালি $968$ বৰ্গ চে.মি.। বেলনটোৰ ব্যাসাৰ্ধ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$h = 11\\ \\text{cm}$, CSA $= 968\\ \\text{cm}^2$।",
        "$$2\\pi r h = 968 \\implies 2\\times\\frac{22}{7}\\times r\\times 11 = 968$$\n\n$$\\frac{484}{7}r = 968 \\implies r = \\frac{968\\times 7}{484} = 14\\ \\text{cm}$$",
        "বেলনটোৰ ব্যাসাৰ্ধ $14$ চে.মি.।",
      ),
    },
  },
];
