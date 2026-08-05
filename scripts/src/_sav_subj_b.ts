/**
 * Subjective questions 21-40 of Books/TpA6OWPT3v9ql0s11FBO.pdf:
 *   SA-II Q21-Q28  -> qa part 2
 *   SA-II Q29-Q35  -> qa part 3
 *   LA    Q36-Q40  -> qa part 4
 *
 * Figures for Q23, Q27, Q38, Q39 and Q40 are redrawn from the questions' own
 * data (gen_surface_areas_ix_bank_figs.py), never cropped from the PDF.
 */
import { SubjItem, sol, figUrl } from "./_sav_bank";

const img = (name: string, alt: string) =>
  `<img src="${figUrl(name)}" alt="${alt}" style="width:100%;display:block;margin-right:auto;" />`;

export const SUBJ_B: SubjItem[] = [
  // -------------------------------------------------------------- SA-II ----
  {
    id: "s21-cubical-box-painting-cost",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 2,
    en: {
      question:
        "The base of a cubical box has perimeter $250$ m. Find the cost of painting its lateral surface at ₹$10$ per $\\text{m}^2$.",
      answer: sol(
        "en",
        "perimeter of the square base $= 250\\ \\text{m}$, rate $=$ ₹$10$ per $\\text{m}^2$.",
        "$$4a = 250 \\implies a = 62.5\\ \\text{m}$$\n\n$$\\text{LSA} = 4a^2 = 4\\times (62.5)^2 = 4\\times 3906.25 = 15625\\ \\text{m}^2$$\n\n$$\\text{cost} = 15625\\times 10 = 156250$$",
        "The total cost of painting is ₹$156250$.",
        "Only the four side faces are painted, so $4a^2$ is used rather than the full $6a^2$.",
      ),
    },
    as: {
      question:
        "এটা ঘনক আকৃতিৰ বাকচৰ তলিৰ পৰিসীমা $250$ মি.। প্ৰতি $\\text{m}^2$ ত ₹$10$ হাৰত ইয়াৰ কাষৰ পৃষ্ঠ ৰং কৰাৰ খৰচ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "বৰ্গাকাৰ তলিটোৰ পৰিসীমা $= 250\\ \\text{m}$, হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$10$।",
        "$$4a = 250 \\implies a = 62.5\\ \\text{m}$$\n\n$$\\text{LSA} = 4a^2 = 4\\times (62.5)^2 = 4\\times 3906.25 = 15625\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = 15625\\times 10 = 156250$$",
        "ৰং কৰাৰ মুঠ খৰচ ₹$156250$।",
        "কেৱল কাষৰ চাৰিখন পৃষ্ঠহে ৰং কৰা হয়, সেয়েহে সম্পূৰ্ণ $6a^2$ ৰ সলনি $4a^2$ ব্যৱহাৰ কৰা হৈছে।",
      ),
    },
  },
  {
    id: "s22-cube-20cm-tsa-lsa-diagonal",
    questionType: "3-mark",
    marks: 3,
    difficulty: "easy",
    part: 2,
    en: {
      question:
        "Find the total surface area, the lateral surface area and the length of the diagonal of a cube each of whose edges measures $20$ cm. (Take $\\sqrt{3} = 1.732$.)",
      answer: sol(
        "en",
        "edge $a = 20\\ \\text{cm}$, $\\sqrt{3} = 1.732$.",
        "$$\\text{TSA} = 6a^2 = 6\\times 20^2 = 6\\times 400 = 2400\\ \\text{cm}^2$$\n\n$$\\text{LSA} = 4a^2 = 4\\times 400 = 1600\\ \\text{cm}^2$$\n\n$$\\text{diagonal} = \\sqrt{3}\\,a = 1.732\\times 20 = 34.64\\ \\text{cm}$$",
        "TSA $= 2400\\ \\text{cm}^2$, LSA $= 1600\\ \\text{cm}^2$, diagonal $= 34.64$ cm.",
        "The diagonal here is the space diagonal of the solid, $\\sqrt{3}\\,a$ — the diagonal of a single face would be only $\\sqrt{2}\\,a$.",
      ),
    },
    as: {
      question:
        "যিটো ঘনকৰ প্ৰতিটো ধাৰৰ জোখ $20$ চে.মি., তাৰ সম্পূৰ্ণ পৃষ্ঠকালি, কাষৰ পৃষ্ঠকালি আৰু কৰ্ণৰ দৈৰ্ঘ্য নিৰ্ণয় কৰা। ($\\sqrt{3} = 1.732$ ধৰিবা।)",
      answer: sol(
        "as",
        "ধাৰ $a = 20\\ \\text{cm}$, $\\sqrt{3} = 1.732$।",
        "$$\\text{TSA} = 6a^2 = 6\\times 20^2 = 6\\times 400 = 2400\\ \\text{cm}^2$$\n\n$$\\text{LSA} = 4a^2 = 4\\times 400 = 1600\\ \\text{cm}^2$$\n\n$$\\text{কৰ্ণ} = \\sqrt{3}\\,a = 1.732\\times 20 = 34.64\\ \\text{cm}$$",
        "TSA $= 2400\\ \\text{cm}^2$, LSA $= 1600\\ \\text{cm}^2$, কৰ্ণ $= 34.64$ চে.মি.।",
        "ইয়াত কৰ্ণটো ঘনবস্তুটোৰ কৰ্ণ, $\\sqrt{3}\\,a$ — এখন পৃষ্ঠৰ কৰ্ণ হ'লহেঁতেন মাত্ৰ $\\sqrt{2}\\,a$।",
      ),
    },
  },
  {
    id: "s23-three-cubes-tsa-ratio",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 2,
    figure: "sav-sa23-three-cubes-v2.png",
    en: {
      question:
        "Three equal cubes are placed adjacently in a row. Find the ratio of the total surface area of the resulting cuboid to the sum of the surface areas of the three cubes.",
      answer: sol(
        "en",
        "each cube has edge $a$ units; the three are placed in a row.",
        `${img("sav-sa23-three-cubes-v2.png", "Three identical cubes of edge a placed side by side in a row, forming a cuboid of dimensions 3a by a by a")}\n\n$$\\text{TSA of one cube} = 6a^2 \\implies \\text{sum for three cubes} = 18a^2$$\n\nThe resulting cuboid has $l = 3a$, $b = a$, $h = a$.\n\n$$\\text{TSA of the cuboid} = 2(lb+bh+hl) = 2(3a^2+a^2+3a^2) = 2\\times 7a^2 = 14a^2$$\n\n$$\\text{ratio} = \\frac{14a^2}{18a^2} = \\frac{7}{9}$$`,
        "The required ratio is $7 : 9$.",
        "The four hidden faces at the two joins account for exactly the missing $4a^2$.",
      ),
    },
    as: {
      question:
        "তিনিটা সমান ঘনক শাৰী পাতি কাষে-কাষে ৰখা হ'ল। ফলত পোৱা আয়তঘনটোৰ সম্পূৰ্ণ পৃষ্ঠকালি আৰু ঘনক তিনিটাৰ পৃষ্ঠকালিৰ যোগফলৰ অনুপাত নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "প্ৰতিটো ঘনকৰ ধাৰ $a$ একক; তিনিওটা শাৰী পাতি ৰখা হৈছে।",
        `${img("sav-sa23-three-cubes-v2.png", "a ধাৰৰ তিনিটা একেধৰণৰ ঘনক শাৰী পাতি কাষে-কাষে ৰখা হৈছে, ফলত 3a বাই a বাই a জোখৰ এটা আয়তঘন গঠিত হৈছে")}\n\n$$\\text{এটা ঘনকৰ TSA} = 6a^2 \\implies \\text{তিনিটা ঘনকৰ যোগফল} = 18a^2$$\n\nফলত পোৱা আয়তঘনটোৰ $l = 3a$, $b = a$, $h = a$।\n\n$$\\text{আয়তঘনটোৰ TSA} = 2(lb+bh+hl) = 2(3a^2+a^2+3a^2) = 2\\times 7a^2 = 14a^2$$\n\n$$\\text{অনুপাত} = \\frac{14a^2}{18a^2} = \\frac{7}{9}$$`,
        "বিচৰা অনুপাতটো $7 : 9$।",
        "দুটা সংযোগস্থলত ঢাক খোৱা চাৰিখন পৃষ্ঠই ঠিক হেৰোৱা $4a^2$ খিনিৰ হিচাপ দিয়ে।",
      ),
    },
  },
  {
    id: "s24-room-distempering-cost",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 2,
    en: {
      question:
        "A room is $16$ m long, $9$ m wide and $3$ m high. It has two doors, each $2\\ \\text{m}\\times 2.5\\ \\text{m}$, and three windows, each $1.6\\ \\text{m}\\times 75\\ \\text{cm}$. Find the cost of distempering the walls of the room from the inside at ₹$8$ per square metre.",
      answer: sol(
        "en",
        "$l = 16\\ \\text{m}$, $b = 9\\ \\text{m}$, $h = 3\\ \\text{m}$; two doors $2\\ \\text{m}\\times 2.5\\ \\text{m}$; three windows $1.6\\ \\text{m}\\times 0.75\\ \\text{m}$; rate $=$ ₹$8$ per $\\text{m}^2$.",
        "$$\\text{area of the four walls} = 2(l+b)h = 2(16+9)\\times 3 = 150\\ \\text{m}^2$$\n\n$$\\text{area of the doors} = 2\\times(2\\times 2.5) = 10\\ \\text{m}^2$$\n\n$$\\text{area of the windows} = 3\\times(1.6\\times 0.75) = 3.6\\ \\text{m}^2$$\n\n$$\\text{area to be distempered} = 150 - (10+3.6) = 136.4\\ \\text{m}^2$$\n\n$$\\text{cost} = 136.4\\times 8 = 1091.20$$",
        "The cost of distempering the walls is ₹$1091.20$.",
        "$75$ cm must be written as $0.75$ m before it multiplies a length already in metres.",
      ),
    },
    as: {
      question:
        "এটা কোঠা $16$ মি. দীঘল, $9$ মি. বহল আৰু $3$ মি. ওখ। ইয়াত প্ৰতিটো $2\\ \\text{m}\\times 2.5\\ \\text{m}$ ৰ দুখন দুৱাৰ আৰু প্ৰতিখন $1.6\\ \\text{m}\\times 75\\ \\text{cm}$ ৰ তিনিখন খিৰিকী আছে। প্ৰতি বৰ্গ মিটাৰত ₹$8$ হাৰত কোঠাটোৰ দেৱাল ভিতৰফালৰ পৰা ডিষ্টেম্পাৰ কৰাৰ খৰচ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 16\\ \\text{m}$, $b = 9\\ \\text{m}$, $h = 3\\ \\text{m}$; দুখন দুৱাৰ $2\\ \\text{m}\\times 2.5\\ \\text{m}$; তিনিখন খিৰিকী $1.6\\ \\text{m}\\times 0.75\\ \\text{m}$; হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$8$।",
        "$$\\text{চাৰিওখন দেৱালৰ কালি} = 2(l+b)h = 2(16+9)\\times 3 = 150\\ \\text{m}^2$$\n\n$$\\text{দুৱাৰৰ কালি} = 2\\times(2\\times 2.5) = 10\\ \\text{m}^2$$\n\n$$\\text{খিৰিকীৰ কালি} = 3\\times(1.6\\times 0.75) = 3.6\\ \\text{m}^2$$\n\n$$\\text{ডিষ্টেম্পাৰ কৰিব লগা কালি} = 150 - (10+3.6) = 136.4\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = 136.4\\times 8 = 1091.20$$",
        "দেৱাল ডিষ্টেম্পাৰ কৰাৰ খৰচ ₹$1091.20$।",
        "মিটাৰত থকা এটা দৈৰ্ঘ্যৰ সৈতে পূৰণ কৰাৰ আগতে $75$ চে.মি. ক $0.75$ মি. বুলি লিখিব লাগে।",
      ),
    },
  },
  {
    id: "s25-oil-tin-boxes-cost",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 2,
    en: {
      question:
        "A cuboidal oil tin measures $4\\ \\text{m}\\times 2\\ \\text{m}\\times 0.75\\ \\text{m}$. Find the cost of the tin sheet needed to make $20$ such boxes, if tin sheet costs ₹$20$ per square metre.",
      answer: sol(
        "en",
        "$l = 4\\ \\text{m}$, $b = 2\\ \\text{m}$, $h = 0.75\\ \\text{m}$; $20$ boxes; rate $=$ ₹$20$ per $\\text{m}^2$.",
        "$$\\text{surface area of one box} = 2(lb+bh+hl) = 2(4\\times 2 + 2\\times 0.75 + 0.75\\times 4)$$\n\n$$= 2(8+1.5+3) = 2\\times 12.5 = 25\\ \\text{m}^2$$\n\n$$\\text{sheet for }20\\text{ boxes} = 20\\times 25 = 500\\ \\text{m}^2$$\n\n$$\\text{cost} = 500\\times 20 = 10000$$",
        "The cost of the tin sheet required is ₹$10000$.",
      ),
    },
    as: {
      question:
        "আয়তঘন আকৃতিৰ এটা তেলৰ টিনৰ জোখ $4\\ \\text{m}\\times 2\\ \\text{m}\\times 0.75\\ \\text{m}$। যদি টিনৰ পাতৰ দাম প্ৰতি বৰ্গ মিটাৰত ₹$20$, তেন্তে এনে $20$ টা বাকচ বনাবলৈ লগা টিনৰ পাতৰ খৰচ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 4\\ \\text{m}$, $b = 2\\ \\text{m}$, $h = 0.75\\ \\text{m}$; $20$ টা বাকচ; হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$20$।",
        "$$\\text{এটা বাকচৰ পৃষ্ঠকালি} = 2(lb+bh+hl) = 2(4\\times 2 + 2\\times 0.75 + 0.75\\times 4)$$\n\n$$= 2(8+1.5+3) = 2\\times 12.5 = 25\\ \\text{m}^2$$\n\n$$20\\text{ টা বাকচৰ বাবে পাত} = 20\\times 25 = 500\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = 500\\times 20 = 10000$$",
        "প্ৰয়োজনীয় টিনৰ পাতৰ খৰচ ₹$10000$।",
      ),
    },
  },
  {
    id: "s26-iron-pipe-csa",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 2,
    en: {
      question:
        "The external diameter of an iron pipe is $35$ cm and its length is $30$ cm. If the pipe is $2.5$ cm thick, find its curved surface area.",
      answer: sol(
        "en",
        "external diameter $= 35\\ \\text{cm} \\Rightarrow R = 17.5\\ \\text{cm}$; thickness $= 2.5\\ \\text{cm}$; $h = 30\\ \\text{cm}$.",
        "$$r = R - \\text{thickness} = 17.5 - 2.5 = 15\\ \\text{cm}$$\n\nA pipe is a hollow cylinder, so it has an outer curved surface and an inner one.\n\n$$\\text{CSA} = 2\\pi R h + 2\\pi r h = 2\\pi h(R+r)$$\n\n$$= 2\\times\\frac{22}{7}\\times 30\\times (17.5+15) = \\frac{44}{7}\\times 30\\times 32.5 = \\frac{42900}{7}$$\n\n$$= 6128.57\\ \\text{cm}^2\\ \\text{(approx.)}$$",
        "The curved surface area of the pipe is about $6128.57\\ \\text{cm}^2$.",
        "Only the curved surfaces are asked for; the two flat rings at the ends of the pipe are not included.",
      ),
    },
    as: {
      question:
        "লোহাৰ এডাল নলীৰ বাহ্যিক ব্যাস $35$ চে.মি. আৰু ইয়াৰ দৈৰ্ঘ্য $30$ চে.মি.। যদি নলীডাল $2.5$ চে.মি. ডাঠ, তেন্তে ইয়াৰ বক্ৰ পৃষ্ঠকালি নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "বাহ্যিক ব্যাস $= 35\\ \\text{cm} \\Rightarrow R = 17.5\\ \\text{cm}$; ডাঠ $= 2.5\\ \\text{cm}$; $h = 30\\ \\text{cm}$।",
        "$$r = R - \\text{ডাঠ} = 17.5 - 2.5 = 15\\ \\text{cm}$$\n\nনলী এডাল এটা ফোপোলা বেলন, গতিকে ইয়াৰ বাহিৰৰ আৰু ভিতৰৰ দুয়োখন বক্ৰ পৃষ্ঠ থাকে।\n\n$$\\text{CSA} = 2\\pi R h + 2\\pi r h = 2\\pi h(R+r)$$\n\n$$= 2\\times\\frac{22}{7}\\times 30\\times (17.5+15) = \\frac{44}{7}\\times 30\\times 32.5 = \\frac{42900}{7}$$\n\n$$= 6128.57\\ \\text{cm}^2\\ \\text{(প্ৰায়)}$$",
        "নলীডালৰ বক্ৰ পৃষ্ঠকালি প্ৰায় $6128.57\\ \\text{cm}^2$।",
        "কেৱল বক্ৰ পৃষ্ঠহে বিচৰা হৈছে; নলীৰ দুয়োমূৰৰ সমতল বলয় দুটা ইয়াত ধৰা হোৱা নাই।",
      ),
    },
  },
  {
    id: "s27-triangle-revolved-tsa-ratio",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 2,
    figure: "sav-sa27-triangle-5-12-13-v2.png",
    en: {
      question:
        "A right triangle with sides $5$ cm, $12$ cm and $13$ cm is revolved first about the side of length $12$ cm and then about the side of length $5$ cm. Find the ratio of the total surface areas of the two cones so formed.",
      answer: sol(
        "en",
        "the triangle has legs $5$ cm and $12$ cm and hypotenuse $13$ cm; revolving about a leg makes that leg the height and the other leg the radius, while the hypotenuse becomes the slant height in both cases.",
        `${img("sav-sa27-triangle-5-12-13-v2.png", "Right triangle ABC with the right angle at B, BC = 5 cm, AB = 12 cm and hypotenuse AC = 13 cm")}\n\n**Revolving about the $12$ cm side:** $r = 5$, $l = 13$\n\n$$S_1 = \\pi r(l+r) = \\pi(5)(13+5) = 90\\pi\\ \\text{cm}^2$$\n\n**Revolving about the $5$ cm side:** $r = 12$, $l = 13$\n\n$$S_2 = \\pi r(l+r) = \\pi(12)(13+12) = 300\\pi\\ \\text{cm}^2$$\n\n$$\\frac{S_1}{S_2} = \\frac{90\\pi}{300\\pi} = \\frac{3}{10}$$`,
        "The ratio of the total surface areas is $3 : 10$.",
        "The slant height is the hypotenuse in both cases because the axis of rotation is always one of the two legs.",
      ),
    },
    as: {
      question:
        "$5$ চে.মি., $12$ চে.মি. আৰু $13$ চে.মি. বাহুৰ এটা সমকোণী ত্ৰিভুজক প্ৰথমে $12$ চে.মি. বাহুৰ চাৰিওফালে আৰু তাৰ পিছত $5$ চে.মি. বাহুৰ চাৰিওফালে ঘূৰোৱা হ'ল। এইদৰে গঠিত শংকু দুটাৰ সম্পূৰ্ণ পৃষ্ঠকালিৰ অনুপাত নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "ত্ৰিভুজটোৰ লম্ব ভুজ দুটা $5$ চে.মি. আৰু $12$ চে.মি. আৰু অতিভুজ $13$ চে.মি.; এটা লম্ব ভুজৰ চাৰিওফালে ঘূৰালে সেই ভুজডাল উচ্চতা আৰু আনটো ভুজ ব্যাসাৰ্ধ হয়, আৰু দুয়োটা ক্ষেত্ৰতে অতিভুজডাল তিৰ্যক উচ্চতা হয়।",
        `${img("sav-sa27-triangle-5-12-13-v2.png", "সমকোণী ত্ৰিভুজ ABC, B ত সমকোণ, BC = 5 চে.মি., AB = 12 চে.মি. আৰু অতিভুজ AC = 13 চে.মি.")}\n\n**$12$ চে.মি. বাহুৰ চাৰিওফালে ঘূৰালে:** $r = 5$, $l = 13$\n\n$$S_1 = \\pi r(l+r) = \\pi(5)(13+5) = 90\\pi\\ \\text{cm}^2$$\n\n**$5$ চে.মি. বাহুৰ চাৰিওফালে ঘূৰালে:** $r = 12$, $l = 13$\n\n$$S_2 = \\pi r(l+r) = \\pi(12)(13+12) = 300\\pi\\ \\text{cm}^2$$\n\n$$\\frac{S_1}{S_2} = \\frac{90\\pi}{300\\pi} = \\frac{3}{10}$$`,
        "সম্পূৰ্ণ পৃষ্ঠকালিৰ অনুপাত $3 : 10$।",
        "দুয়োটা ক্ষেত্ৰতে তিৰ্যক উচ্চতাডাল অতিভুজ, কাৰণ ঘূৰ্ণনৰ অক্ষডাল সদায় লম্ব ভুজ দুটাৰ এটা।",
      ),
    },
  },
  {
    id: "s28-hundred-cones-painting",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 2,
    en: {
      question:
        "At a construction site a deep pit is fenced off from the rest of the area with $100$ hollow cones. Each cone has base diameter $20$ cm and height half a metre. What is the cost of painting the outer surface of all the cones at ₹$30$ per $\\text{m}^2$? (Use $\\pi = 3.14$ and $\\sqrt{26} = 5.1$.)",
      answer: sol(
        "en",
        "$d = 20\\ \\text{cm} \\Rightarrow r = 10\\ \\text{cm} = 0.1\\ \\text{m}$, $h = \\dfrac{1}{2}\\ \\text{m}$, $100$ cones, rate $=$ ₹$30$ per $\\text{m}^2$.",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{(0.1)^2+\\left(\\tfrac{1}{2}\\right)^2} = \\sqrt{0.01+0.25} = \\sqrt{0.26} = \\frac{\\sqrt{26}}{10} = 0.51\\ \\text{m}$$\n\n$$\\text{CSA of }100\\text{ cones} = 100\\times\\pi r l = 100\\times 3.14\\times 0.1\\times 0.51 = 16.014\\ \\text{m}^2$$\n\n$$\\text{cost} = 16.014\\times 30 = 480.42$$",
        "The total cost of painting is ₹$480.42$.",
        "The cones are hollow and only the outer surface is painted, so the base circles do not enter the calculation.",
      ),
    },
    as: {
      question:
        "এটা নিৰ্মাণস্থলীত এটা গভীৰ গাঁত বাকী অংশৰ পৰা $100$ টা ফোপোলা শংকুৰে ঘেৰি ৰখা হৈছে। প্ৰতিটো শংকুৰ ভূমিৰ ব্যাস $20$ চে.মি. আৰু উচ্চতা আধা মিটাৰ। প্ৰতি $\\text{m}^2$ ত ₹$30$ হাৰত সকলোবোৰ শংকুৰ বাহিৰৰ পৃষ্ঠ ৰং কৰাৰ খৰচ কিমান? ($\\pi = 3.14$ আৰু $\\sqrt{26} = 5.1$ ধৰিবা।)",
      answer: sol(
        "as",
        "$d = 20\\ \\text{cm} \\Rightarrow r = 10\\ \\text{cm} = 0.1\\ \\text{m}$, $h = \\dfrac{1}{2}\\ \\text{m}$, $100$ টা শংকু, হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$30$।",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{(0.1)^2+\\left(\\tfrac{1}{2}\\right)^2} = \\sqrt{0.01+0.25} = \\sqrt{0.26} = \\frac{\\sqrt{26}}{10} = 0.51\\ \\text{m}$$\n\n$$100\\text{ টা শংকুৰ CSA} = 100\\times\\pi r l = 100\\times 3.14\\times 0.1\\times 0.51 = 16.014\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = 16.014\\times 30 = 480.42$$",
        "ৰং কৰাৰ মুঠ খৰচ ₹$480.42$।",
        "শংকুবোৰ ফোপোলা আৰু কেৱল বাহিৰৰ পৃষ্ঠহে ৰং কৰা হয়, গতিকে ভূমিৰ চক্ৰীবোৰ হিচাপত নাহে।",
      ),
    },
  },
  {
    id: "s29-lead-pipe-volume",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 3,
    en: {
      question:
        "Find the volume of a lead pipe $3.5$ m long whose external diameter is $2.4$ cm and whose lead is $3$ mm thick. (Given that $1\\ \\text{cm}^3$ of lead weighs $12$ g.)",
      answer: sol(
        "en",
        "external diameter $= 2.4\\ \\text{cm} \\Rightarrow R = 1.2\\ \\text{cm}$; thickness $= 3\\ \\text{mm} = 0.3\\ \\text{cm}$; $h = 3.5\\ \\text{m} = 350\\ \\text{cm}$.",
        "$$r = R - \\text{thickness} = 1.2 - 0.3 = 0.9\\ \\text{cm}$$\n\n$$V = \\pi\\left(R^2-r^2\\right)h = \\frac{22}{7}\\times\\left[(1.2)^2-(0.9)^2\\right]\\times 350$$\n\n$$= \\frac{22}{7}\\times (1.44-0.81)\\times 350 = \\frac{22}{7}\\times 0.63\\times 350 = 22\\times 0.09\\times 350$$\n\n$$= 693\\ \\text{cm}^3$$",
        "The volume of lead in the pipe is $693\\ \\text{cm}^3$.",
        "Every length has to be in centimetres before the formula is used; the weight per $\\text{cm}^3$ is extra information here and is not needed for the volume.",
      ),
    },
    as: {
      question:
        "$3.5$ মি. দীঘল সীহৰ এডাল নলীৰ বাহ্যিক ব্যাস $2.4$ চে.মি. আৰু সীহখিনি $3$ মি.মি. ডাঠ। নলীডালৰ আয়তন নিৰ্ণয় কৰা। (দিয়া আছে যে সীহৰ $1\\ \\text{cm}^3$ ৰ ওজন $12$ গ্ৰাম।)",
      answer: sol(
        "as",
        "বাহ্যিক ব্যাস $= 2.4\\ \\text{cm} \\Rightarrow R = 1.2\\ \\text{cm}$; ডাঠ $= 3\\ \\text{mm} = 0.3\\ \\text{cm}$; $h = 3.5\\ \\text{m} = 350\\ \\text{cm}$।",
        "$$r = R - \\text{ডাঠ} = 1.2 - 0.3 = 0.9\\ \\text{cm}$$\n\n$$V = \\pi\\left(R^2-r^2\\right)h = \\frac{22}{7}\\times\\left[(1.2)^2-(0.9)^2\\right]\\times 350$$\n\n$$= \\frac{22}{7}\\times (1.44-0.81)\\times 350 = \\frac{22}{7}\\times 0.63\\times 350 = 22\\times 0.09\\times 350$$\n\n$$= 693\\ \\text{cm}^3$$",
        "নলীডালত থকা সীহৰ আয়তন $693\\ \\text{cm}^3$।",
        "সূত্ৰটো ব্যৱহাৰ কৰাৰ আগতে প্ৰতিটো দৈৰ্ঘ্য চেণ্টিমিটাৰত থাকিব লাগিব; ইয়াত প্ৰতি $\\text{cm}^3$ ৰ ওজনটো অতিৰিক্ত তথ্য আৰু আয়তন উলিয়াবলৈ ইয়াৰ প্ৰয়োজন নাই।",
      ),
    },
  },
  {
    id: "s30-spherical-ball-radius-from-cost",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 3,
    en: {
      question:
        "The total cost of making a solid spherical ball is ₹$67914$ at ₹$14$ per cubic metre. Find the radius of the ball.",
      answer: sol(
        "en",
        "total cost $=$ ₹$67914$, rate $=$ ₹$14$ per $\\text{m}^3$.",
        "$$\\text{volume} = \\frac{\\text{total cost}}{\\text{cost per }\\text{m}^3} = \\frac{67914}{14}$$\n\n$$\\frac{4}{3}\\pi r^3 = \\frac{67914}{14} \\implies \\frac{4}{3}\\times\\frac{22}{7}\\times r^3 = \\frac{67914}{14}$$\n\n$$r^3 = \\frac{67914\\times 3\\times 7}{14\\times 4\\times 22} = \\frac{101871}{88} = 1157.625$$\n\n$$r = \\sqrt[3]{1157.625} = 10.5\\ \\text{m}$$",
        "The radius of the ball is $10.5$ m.",
        "$1157.625 = (10.5)^3$, so the cube root is exact here.",
      ),
    },
    as: {
      question:
        "প্ৰতি ঘন মিটাৰত ₹$14$ হাৰত এটা কঠিন গোলাকাৰ বল বনোৱাৰ মুঠ খৰচ ₹$67914$। বলটোৰ ব্যাসাৰ্ধ নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "মুঠ খৰচ $=$ ₹$67914$, হাৰ $=$ প্ৰতি $\\text{m}^3$ ত ₹$14$।",
        "$$\\text{আয়তন} = \\frac{\\text{মুঠ খৰচ}}{\\text{প্ৰতি }\\text{m}^3\\text{ ৰ খৰচ}} = \\frac{67914}{14}$$\n\n$$\\frac{4}{3}\\pi r^3 = \\frac{67914}{14} \\implies \\frac{4}{3}\\times\\frac{22}{7}\\times r^3 = \\frac{67914}{14}$$\n\n$$r^3 = \\frac{67914\\times 3\\times 7}{14\\times 4\\times 22} = \\frac{101871}{88} = 1157.625$$\n\n$$r = \\sqrt[3]{1157.625} = 10.5\\ \\text{m}$$",
        "বলটোৰ ব্যাসাৰ্ধ $10.5$ মি.।",
        "$1157.625 = (10.5)^3$, গতিকে ইয়াত ঘনমূলটো সঠিক।",
      ),
    },
  },
  {
    id: "s31-rectangular-solid-height",
    questionType: "3-mark",
    marks: 3,
    difficulty: "easy",
    part: 3,
    en: {
      question:
        "The length and the breadth of a rectangular solid are $35$ cm and $20$ cm respectively. If its volume is $7000\\ \\text{cm}^3$, find its height (in cm).",
      answer: sol(
        "en",
        "$l = 35\\ \\text{cm}$, $b = 20\\ \\text{cm}$, $V = 7000\\ \\text{cm}^3$.",
        "$$V = l\\times b\\times h \\implies 7000 = 35\\times 20\\times h$$\n\n$$700h = 7000 \\implies h = 10\\ \\text{cm}$$",
        "The height of the solid is $10$ cm.",
      ),
    },
    as: {
      question:
        "এটা আয়তাকাৰ ঘনবস্তুৰ দৈৰ্ঘ্য আৰু প্ৰস্থ ক্ৰমে $35$ চে.মি. আৰু $20$ চে.মি.। যদি ইয়াৰ আয়তন $7000\\ \\text{cm}^3$, তেন্তে ইয়াৰ উচ্চতা (চে.মি.ত) নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 35\\ \\text{cm}$, $b = 20\\ \\text{cm}$, $V = 7000\\ \\text{cm}^3$।",
        "$$V = l\\times b\\times h \\implies 7000 = 35\\times 20\\times h$$\n\n$$700h = 7000 \\implies h = 10\\ \\text{cm}$$",
        "ঘনবস্তুটোৰ উচ্চতা $10$ চে.মি.।",
      ),
    },
  },
  {
    id: "s32-sphere-volume-equals-sa",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 3,
    en: {
      question:
        "If the volume and the surface area of a sphere are numerically equal, find its radius (in units).",
      answer: sol(
        "en",
        "volume of the sphere $=$ surface area of the sphere, numerically.",
        "$$\\frac{4}{3}\\pi r^3 = 4\\pi r^2$$\n\nDividing both sides by $4\\pi r^2$ (which is non-zero),\n\n$$\\frac{r}{3} = 1 \\implies r = 3$$",
        "The radius of the sphere is $3$ units.",
        "The two quantities are of different kinds — one is a volume and the other an area — so they can only be compared as numbers, which is exactly what the question means by \"numerically equal\".",
      ),
    },
    as: {
      question:
        "যদি এটা গোলকৰ আয়তন আৰু পৃষ্ঠকালি সাংখ্যিকভাৱে সমান হয়, তেন্তে ইয়াৰ ব্যাসাৰ্ধ (এককত) নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "গোলকটোৰ আয়তন $=$ গোলকটোৰ পৃষ্ঠকালি, সাংখ্যিকভাৱে।",
        "$$\\frac{4}{3}\\pi r^3 = 4\\pi r^2$$\n\nদুয়োফালে $4\\pi r^2$ (যিটো শূন্য নহয়) ৰে হৰণ কৰিলে,\n\n$$\\frac{r}{3} = 1 \\implies r = 3$$",
        "গোলকটোৰ ব্যাসাৰ্ধ $3$ একক।",
        "ৰাশি দুটা বেলেগ ধৰণৰ — এটা আয়তন আৰু আনটো কালি — গতিকে সিহঁতক কেৱল সংখ্যা হিচাপেহে তুলনা কৰিব পাৰি, আৰু “সাংখ্যিকভাৱে সমান” বুলি প্ৰশ্নটোত ঠিক সেইটোৱেই বুজোৱা হৈছে।",
      ),
    },
  },
  {
    id: "s33-small-balls-from-iron-ball",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 3,
    en: {
      question:
        "How many spherical balls of diameter $1$ cm can be made from an iron ball of diameter $6$ cm?",
      answer: sol(
        "en",
        "big ball: $d = 6\\ \\text{cm} \\Rightarrow R = 3\\ \\text{cm}$; small ball: $d = 1\\ \\text{cm} \\Rightarrow r = \\dfrac{1}{2}\\ \\text{cm}$.",
        "$$\\text{number of balls} = \\frac{\\tfrac{4}{3}\\pi R^3}{\\tfrac{4}{3}\\pi r^3} = \\left(\\frac{R}{r}\\right)^3 = \\left(\\frac{3}{\\tfrac12}\\right)^3 = 6^3 = 216$$",
        "$216$ small balls can be made.",
        "The ratio of the **diameters** is $6 : 1$, and cubing that ratio gives the count directly.",
      ),
    },
    as: {
      question:
        "$6$ চে.মি. ব্যাসৰ এটা লোহাৰ বলৰ পৰা $1$ চে.মি. ব্যাসৰ কিমানটা গোলাকাৰ বল বনাব পাৰি?",
      answer: sol(
        "as",
        "ডাঙৰ বল: $d = 6\\ \\text{cm} \\Rightarrow R = 3\\ \\text{cm}$; সৰু বল: $d = 1\\ \\text{cm} \\Rightarrow r = \\dfrac{1}{2}\\ \\text{cm}$।",
        "$$\\text{বলৰ সংখ্যা} = \\frac{\\tfrac{4}{3}\\pi R^3}{\\tfrac{4}{3}\\pi r^3} = \\left(\\frac{R}{r}\\right)^3 = \\left(\\frac{3}{\\tfrac12}\\right)^3 = 6^3 = 216$$",
        "$216$ টা সৰু বল বনাব পাৰি।",
        "**ব্যাস** দুটাৰ অনুপাত $6 : 1$, আৰু সেই অনুপাতটো ঘন কৰিলেই সংখ্যাটো পোনে পোনে ওলায়।",
      ),
    },
  },
  {
    id: "s34-closed-tank-bottom-thickness",
    questionType: "3-mark",
    marks: 3,
    difficulty: "hard",
    part: 3,
    en: {
      question:
        "A closed cuboidal tank can store $5040$ litres of water. Its external dimensions are $2.2\\ \\text{m}\\times 1.7\\ \\text{m}\\times 1.7\\ \\text{m}$. If the side walls of the tank are $5$ cm thick, what is the thickness of the bottom and the top of the tank, given that the two are the same?",
      answer: sol(
        "en",
        "capacity $= 5040$ litres $= 5.040\\ \\text{m}^3$; external dimensions $2.2\\ \\text{m}\\times 1.7\\ \\text{m}\\times 1.7\\ \\text{m}$; side walls $5\\ \\text{cm} = 0.05\\ \\text{m}$ thick.",
        "The two side-wall pairs reduce the length and the breadth:\n\n$$\\text{internal length} = 2.2 - 2\\times 0.05 = 2.1\\ \\text{m}$$\n\n$$\\text{internal breadth} = 1.7 - 2\\times 0.05 = 1.6\\ \\text{m}$$\n\nLet the thickness of the bottom (and of the top) be $x$ m, so the internal height is $(1.7-2x)$ m.\n\n$$2.1\\times 1.6\\times (1.7-2x) = 5.040 \\implies 3.36(1.7-2x) = 5.040$$\n\n$$1.7-2x = \\frac{5.040}{3.36} = 1.5 \\implies 2x = 0.2 \\implies x = 0.1\\ \\text{m}$$",
        "The thickness of the bottom (and of the top) is $0.1$ m, that is $10$ cm.",
        "The tank is **closed**, so the height loses the thickness twice — once at the bottom and once at the top.",
      ),
    },
    as: {
      question:
        "আয়তঘন আকৃতিৰ এটা বন্ধ টেংকিয়ে $5040$ লিটাৰ পানী ৰাখিব পাৰে। ইয়াৰ বাহ্যিক জোখ $2.2\\ \\text{m}\\times 1.7\\ \\text{m}\\times 1.7\\ \\text{m}$। যদি টেংকিটোৰ কাষৰ দেৱালবোৰ $5$ চে.মি. ডাঠ, তেন্তে টেংকিটোৰ তল আৰু ওপৰৰ ডাঠ কিমান, ধৰি লোৱা যে দুয়োটা একে?",
      answer: sol(
        "as",
        "ধাৰণ ক্ষমতা $= 5040$ লিটাৰ $= 5.040\\ \\text{m}^3$; বাহ্যিক জোখ $2.2\\ \\text{m}\\times 1.7\\ \\text{m}\\times 1.7\\ \\text{m}$; কাষৰ দেৱাল $5\\ \\text{cm} = 0.05\\ \\text{m}$ ডাঠ।",
        "কাষৰ দেৱালৰ যোৰ দুটাই দৈৰ্ঘ্য আৰু প্ৰস্থ কমাই দিয়ে:\n\n$$\\text{আভ্যন্তৰীণ দৈৰ্ঘ্য} = 2.2 - 2\\times 0.05 = 2.1\\ \\text{m}$$\n\n$$\\text{আভ্যন্তৰীণ প্ৰস্থ} = 1.7 - 2\\times 0.05 = 1.6\\ \\text{m}$$\n\nতলৰ (আৰু ওপৰৰ) ডাঠ $x$ মি. ধৰা হ'ল, গতিকে আভ্যন্তৰীণ উচ্চতা $(1.7-2x)$ মি.।\n\n$$2.1\\times 1.6\\times (1.7-2x) = 5.040 \\implies 3.36(1.7-2x) = 5.040$$\n\n$$1.7-2x = \\frac{5.040}{3.36} = 1.5 \\implies 2x = 0.2 \\implies x = 0.1\\ \\text{m}$$",
        "তলৰ (আৰু ওপৰৰ) ডাঠ $0.1$ মি., অৰ্থাৎ $10$ চে.মি.।",
        "টেংকিটো **বন্ধ**, গতিকে উচ্চতাই ডাঠখিনি দুবাৰ হেৰুৱায় — এবাৰ তলত আৰু এবাৰ ওপৰত।",
      ),
    },
  },
  {
    id: "s35-cone-radius-tsa-25-24",
    questionType: "3-mark",
    marks: 3,
    difficulty: "moderate",
    part: 3,
    en: {
      question:
        "The slant height of a cone is $25$ cm and its vertical height is $24$ cm. Find the radius and the total surface area of the cone.",
      answer: sol(
        "en",
        "$l = 25\\ \\text{cm}$, $h = 24\\ \\text{cm}$.",
        "$$l^2 = h^2+r^2 \\implies r^2 = 25^2-24^2 = 625-576 = 49$$\n\n$$r = 7\\ \\text{cm}$$\n\n$$\\text{TSA} = \\pi r(l+r) = \\frac{22}{7}\\times 7\\times (25+7) = 22\\times 32 = 704\\ \\text{cm}^2$$",
        "The radius is $7$ cm and the total surface area is $704\\ \\text{cm}^2$.",
        "$625-576$ is quickest as $(25-24)(25+24) = 1\\times 49$.",
      ),
    },
    as: {
      question:
        "এটা শংকুৰ তিৰ্যক উচ্চতা $25$ চে.মি. আৰু ইয়াৰ উলম্ব উচ্চতা $24$ চে.মি.। শংকুটোৰ ব্যাসাৰ্ধ আৰু সম্পূৰ্ণ পৃষ্ঠকালি নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$l = 25\\ \\text{cm}$, $h = 24\\ \\text{cm}$।",
        "$$l^2 = h^2+r^2 \\implies r^2 = 25^2-24^2 = 625-576 = 49$$\n\n$$r = 7\\ \\text{cm}$$\n\n$$\\text{TSA} = \\pi r(l+r) = \\frac{22}{7}\\times 7\\times (25+7) = 22\\times 32 = 704\\ \\text{cm}^2$$",
        "ব্যাসাৰ্ধ $7$ চে.মি. আৰু সম্পূৰ্ণ পৃষ্ঠকালি $704\\ \\text{cm}^2$।",
        "$625-576$ ৰ আটাইতকৈ দ্ৰুত হিচাপ হ'ল $(25-24)(25+24) = 1\\times 49$।",
      ),
    },
  },

  // ------------------------------------------------------------------ LA ---
  {
    id: "l36-hollow-hemispherical-vessel-cost",
    questionType: "5-mark",
    marks: 5,
    difficulty: "hard",
    part: 4,
    en: {
      question:
        "The internal and external diameters of a hollow hemispherical vessel are $24$ cm and $25$ cm respectively. The cost of painting one square centimetre of its surface is $7$ paise. Find the total cost of painting the vessel all over. (Ignore the area of the edge.)",
      answer: sol(
        "en",
        "internal diameter $= 24\\ \\text{cm} \\Rightarrow r = 12\\ \\text{cm}$; external diameter $= 25\\ \\text{cm} \\Rightarrow R = 12.5\\ \\text{cm}$; rate $= 7$ paise per $\\text{cm}^2$.",
        "Painting it \"all over\" means both the outer and the inner curved surfaces.\n\n$$\\text{external surface} = 2\\pi R^2 = 2\\times\\frac{22}{7}\\times (12.5)^2$$\n\n$$\\text{internal surface} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times (12)^2$$\n\n$$\\text{total area} = 2\\times\\frac{22}{7}\\left[(12.5)^2+(12)^2\\right] = \\frac{44}{7}\\left[\\frac{625}{4}+144\\right]$$\n\n$$= \\frac{44}{7}\\times\\frac{625+576}{4} = \\frac{44}{7}\\times\\frac{1201}{4} = \\frac{13211}{7}\\ \\text{cm}^2$$\n\n$$\\text{cost} = \\frac{13211}{7}\\times\\frac{7}{100} = \\frac{13211}{100} = 132.11$$",
        "The total cost of painting the vessel is ₹$132.11$.",
        "The rate is in **paise**, so it has to be divided by $100$ to give an answer in rupees; conveniently the $7$ of $\\pi = \\tfrac{22}{7}$ cancels against the $7$ paise.",
      ),
    },
    as: {
      question:
        "ফোপোলা অৰ্ধগোলাকাৰ এটা পাত্ৰৰ আভ্যন্তৰীণ আৰু বাহ্যিক ব্যাস ক্ৰমে $24$ চে.মি. আৰু $25$ চে.মি.। ইয়াৰ পৃষ্ঠৰ এক বৰ্গ চেণ্টিমিটাৰ ৰং কৰাৰ খৰচ $7$ পইচা। পাত্ৰটো সম্পূৰ্ণৰূপে ৰং কৰাৰ মুঠ খৰচ নিৰ্ণয় কৰা। (দাঁতিৰ কালি নধৰিবা।)",
      answer: sol(
        "as",
        "আভ্যন্তৰীণ ব্যাস $= 24\\ \\text{cm} \\Rightarrow r = 12\\ \\text{cm}$; বাহ্যিক ব্যাস $= 25\\ \\text{cm} \\Rightarrow R = 12.5\\ \\text{cm}$; হাৰ $= $ প্ৰতি $\\text{cm}^2$ ত $7$ পইচা।",
        "“সম্পূৰ্ণৰূপে” ৰং কৰা মানে বাহিৰৰ আৰু ভিতৰৰ দুয়োখন বক্ৰ পৃষ্ঠ।\n\n$$\\text{বাহ্যিক পৃষ্ঠ} = 2\\pi R^2 = 2\\times\\frac{22}{7}\\times (12.5)^2$$\n\n$$\\text{আভ্যন্তৰীণ পৃষ্ঠ} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times (12)^2$$\n\n$$\\text{মুঠ কালি} = 2\\times\\frac{22}{7}\\left[(12.5)^2+(12)^2\\right] = \\frac{44}{7}\\left[\\frac{625}{4}+144\\right]$$\n\n$$= \\frac{44}{7}\\times\\frac{625+576}{4} = \\frac{44}{7}\\times\\frac{1201}{4} = \\frac{13211}{7}\\ \\text{cm}^2$$\n\n$$\\text{খৰচ} = \\frac{13211}{7}\\times\\frac{7}{100} = \\frac{13211}{100} = 132.11$$",
        "পাত্ৰটো ৰং কৰাৰ মুঠ খৰচ ₹$132.11$।",
        "হাৰটো **পইচা** ত দিয়া আছে, গতিকে টকাত উত্তৰ পাবলৈ ইয়াক $100$ ৰে হৰণ কৰিব লাগে; সুবিধাজনকভাৱে $\\pi = \\tfrac{22}{7}$ ৰ $7$ টো $7$ পইচাৰ লগত কাটি যায়।",
      ),
    },
  },
  {
    id: "l37-coins-in-cylindrical-block",
    questionType: "5-mark",
    marks: 5,
    difficulty: "moderate",
    part: 4,
    en: {
      question:
        "Coins of the same size are stacked one above the other to form a cylindrical block of volume $67.76\\ \\text{cm}^3$. Find the number of coins in the block, given that each coin is $2$ mm thick and has radius $1.4$ cm.",
      answer: sol(
        "en",
        "volume of the block $= 67.76\\ \\text{cm}^3$, radius of each coin $= 1.4\\ \\text{cm}$, thickness of each coin $= 2\\ \\text{mm}$.",
        "The stack is itself a cylinder of radius $1.4$ cm. Let its height be $h$.\n\n$$\\pi r^2 h = 67.76 \\implies \\frac{22}{7}\\times 1.4\\times 1.4\\times h = 67.76$$\n\n$$6.16\\,h = 67.76 \\implies h = 11\\ \\text{cm} = 110\\ \\text{mm}$$\n\nIf $n$ coins are used, then $n\\times(\\text{thickness of one coin}) = h$:\n\n$$n\\times 2 = 110 \\implies n = 55$$",
        "There are $55$ coins in the block.",
        "The height comes out in centimetres but the thickness is in millimetres, so one of the two must be converted before dividing.",
      ),
    },
    as: {
      question:
        "একেই জোখৰ মুদ্ৰা ইটোৰ ওপৰত সিটোকৈ থৈ $67.76\\ \\text{cm}^3$ আয়তনৰ এটা বেলনাকাৰ স্তম্ভ গঠন কৰা হ'ল। প্ৰতিটো মুদ্ৰা $2$ মি.মি. ডাঠ আৰু ইয়াৰ ব্যাসাৰ্ধ $1.4$ চে.মি. হ'লে, স্তম্ভটোত থকা মুদ্ৰাৰ সংখ্যা নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "স্তম্ভটোৰ আয়তন $= 67.76\\ \\text{cm}^3$, প্ৰতিটো মুদ্ৰাৰ ব্যাসাৰ্ধ $= 1.4\\ \\text{cm}$, প্ৰতিটো মুদ্ৰাৰ ডাঠ $= 2\\ \\text{mm}$।",
        "স্তম্ভটো নিজেই $1.4$ চে.মি. ব্যাসাৰ্ধৰ এটা বেলন। ইয়াৰ উচ্চতা $h$ ধৰা হ'ল।\n\n$$\\pi r^2 h = 67.76 \\implies \\frac{22}{7}\\times 1.4\\times 1.4\\times h = 67.76$$\n\n$$6.16\\,h = 67.76 \\implies h = 11\\ \\text{cm} = 110\\ \\text{mm}$$\n\nযদি $n$ টা মুদ্ৰা ব্যৱহাৰ হৈছে, তেন্তে $n\\times(\\text{এটা মুদ্ৰাৰ ডাঠ}) = h$:\n\n$$n\\times 2 = 110 \\implies n = 55$$",
        "স্তম্ভটোত $55$ টা মুদ্ৰা আছে।",
        "উচ্চতাটো চেণ্টিমিটাৰত ওলায় কিন্তু ডাঠটো মিলিমিটাৰত আছে, গতিকে হৰণ কৰাৰ আগতে দুয়োটাৰ এটা সলনি কৰিব লাগিব।",
      ),
    },
  },
  {
    id: "l38-sector-rolled-into-cone",
    questionType: "5-mark",
    marks: 5,
    difficulty: "hard",
    part: 4,
    figure: "sav-la38-sector-120-v2.png",
    en: {
      question:
        "A sector of a circle has radius $15$ cm and central angle $120°$. It is rolled up and its two bounding radii are joined to form a cone of radius $5$ cm. Find **(i)** the volume of the cone and **(ii)** the total surface area of the cone.",
      answer: sol(
        "en",
        "radius of the sector $= 15\\ \\text{cm}$, central angle $= 120°$; the cone formed has radius $r = 5\\ \\text{cm}$.",
        `${img("sav-la38-sector-120-v2.png", "A sector AOB of a circle of centre O, with OA = OB = 15 cm and angle AOB = 120 degrees")}\n\nWhen the sector is rolled up, its radius becomes the slant height of the cone.\n\n$$l = 15\\ \\text{cm}$$\n\n**(i)** $$h = \\sqrt{l^2-r^2} = \\sqrt{15^2-5^2} = \\sqrt{225-25} = \\sqrt{200} = 10\\sqrt{2}\\ \\text{cm}$$\n\n$$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\times\\frac{22}{7}\\times 25\\times 10\\sqrt{2} = \\frac{5500\\sqrt{2}}{21}\\ \\text{cm}^3$$\n\nTaking $\\sqrt{2} = 1.41$, this is $369.29\\ \\text{cm}^3$ approximately.\n\n**(ii)** $$\\text{TSA} = \\pi r(r+l) = \\frac{22}{7}\\times 5\\times (5+15) = \\frac{22}{7}\\times 5\\times 20 = \\frac{2200}{7} = 314.29\\ \\text{cm}^2$$`,
        "(i) Volume $\\approx 369.29\\ \\text{cm}^3$. (ii) Total surface area $\\approx 314.29\\ \\text{cm}^2$.",
        "As a check, the arc of the sector is $\\tfrac{120}{360}\\times 2\\pi(15) = 10\\pi$ cm, which is exactly the circumference $2\\pi(5)$ of the base of the cone.",
      ),
    },
    as: {
      question:
        "এটা বৃত্তৰ খণ্ডৰ ব্যাসাৰ্ধ $15$ চে.মি. আৰু কেন্দ্ৰীয় কোণ $120°$। ইয়াক মেৰিয়াই সীমা নিৰ্ধাৰণ কৰা ব্যাসাৰ্ধ দুডাল লগ লগাই $5$ চে.মি. ব্যাসাৰ্ধৰ এটা শংকু গঠন কৰা হ'ল। নিৰ্ণয় কৰা **(i)** শংকুটোৰ আয়তন আৰু **(ii)** শংকুটোৰ সম্পূৰ্ণ পৃষ্ঠকালি।",
      answer: sol(
        "as",
        "বৃত্তখণ্ডটোৰ ব্যাসাৰ্ধ $= 15\\ \\text{cm}$, কেন্দ্ৰীয় কোণ $= 120°$; গঠিত শংকুটোৰ ব্যাসাৰ্ধ $r = 5\\ \\text{cm}$।",
        `${img("sav-la38-sector-120-v2.png", "কেন্দ্ৰ O থকা এটা বৃত্তৰ খণ্ড AOB, য'ত OA = OB = 15 চে.মি. আৰু কোণ AOB = 120 ডিগ্ৰী")}\n\nবৃত্তখণ্ডটো মেৰিয়ালে ইয়াৰ ব্যাসাৰ্ধডাল শংকুটোৰ তিৰ্যক উচ্চতা হৈ পৰে।\n\n$$l = 15\\ \\text{cm}$$\n\n**(i)** $$h = \\sqrt{l^2-r^2} = \\sqrt{15^2-5^2} = \\sqrt{225-25} = \\sqrt{200} = 10\\sqrt{2}\\ \\text{cm}$$\n\n$$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\times\\frac{22}{7}\\times 25\\times 10\\sqrt{2} = \\frac{5500\\sqrt{2}}{21}\\ \\text{cm}^3$$\n\n$\\sqrt{2} = 1.41$ ধৰিলে এইটো প্ৰায় $369.29\\ \\text{cm}^3$।\n\n**(ii)** $$\\text{TSA} = \\pi r(r+l) = \\frac{22}{7}\\times 5\\times (5+15) = \\frac{22}{7}\\times 5\\times 20 = \\frac{2200}{7} = 314.29\\ \\text{cm}^2$$`,
        "(i) আয়তন $\\approx 369.29\\ \\text{cm}^3$। (ii) সম্পূৰ্ণ পৃষ্ঠকালি $\\approx 314.29\\ \\text{cm}^2$।",
        "পৰীক্ষা হিচাপে, বৃত্তখণ্ডটোৰ চাপৰ দৈৰ্ঘ্য $\\tfrac{120}{360}\\times 2\\pi(15) = 10\\pi$ চে.মি., যিটো শংকুটোৰ ভূমিৰ পৰিধি $2\\pi(5)$ ৰ ঠিক সমান।",
      ),
    },
  },
  {
    id: "l39-three-cylinders-csa-tsa-ratio",
    questionType: "5-mark",
    marks: 5,
    difficulty: "moderate",
    part: 4,
    figure: "sav-la39-three-cylinders-v2.png",
    en: {
      question:
        "Three identical cylinders, each of base radius $r$ units and height $h$ units, are placed one above the other to form a single new cylinder. Find the ratio (in terms of $r$ and $h$) of the curved surface area to the total surface area of the cylinder so formed.",
      answer: sol(
        "en",
        "three identical cylinders of radius $r$ and height $h$, stacked vertically.",
        `${img("sav-la39-three-cylinders-v2.png", "Three identical cylinders of base radius r and height h stacked one above the other, forming a single cylinder of height 3h")}\n\nStacking does not change the radius; only the heights add up.\n\n$$\\text{radius of the new cylinder} = r, \\qquad \\text{height} = 3h$$\n\n$$\\text{CSA} = 2\\pi r(3h) = 6\\pi r h$$\n\n$$\\text{TSA} = 2\\pi r(r+3h)$$\n\n$$\\frac{\\text{CSA}}{\\text{TSA}} = \\frac{6\\pi r h}{2\\pi r(r+3h)} = \\frac{3h}{r+3h}$$`,
        "The required ratio is $3h : (r+3h)$.",
        "The joins between the cylinders disappear inside the new solid, so the two circular faces at the very top and very bottom are the only flat surfaces left.",
      ),
    },
    as: {
      question:
        "প্ৰতিটো $r$ একক ভূমি-ব্যাসাৰ্ধ আৰু $h$ একক উচ্চতাৰ তিনিটা একেধৰণৰ বেলন ইটোৰ ওপৰত সিটোকৈ থৈ এটা নতুন বেলন গঠন কৰা হ'ল। এইদৰে গঠিত বেলনটোৰ বক্ৰ পৃষ্ঠকালি আৰু সম্পূৰ্ণ পৃষ্ঠকালিৰ অনুপাত ($r$ আৰু $h$ ৰ ৰাশিত) নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "$r$ ব্যাসাৰ্ধ আৰু $h$ উচ্চতাৰ তিনিটা একেধৰণৰ বেলন উলম্বভাৱে ইটোৰ ওপৰত সিটোকৈ থোৱা হৈছে।",
        `${img("sav-la39-three-cylinders-v2.png", "r ভূমি-ব্যাসাৰ্ধ আৰু h উচ্চতাৰ তিনিটা একেধৰণৰ বেলন ইটোৰ ওপৰত সিটোকৈ থোৱা হৈছে, ফলত 3h উচ্চতাৰ এটা বেলন গঠিত হৈছে")}\n\nইটোৰ ওপৰত সিটোকৈ থ'লে ব্যাসাৰ্ধ সলনি নহয়; কেৱল উচ্চতাবোৰহে যোগ হয়।\n\n$$\\text{নতুন বেলনটোৰ ব্যাসাৰ্ধ} = r, \\qquad \\text{উচ্চতা} = 3h$$\n\n$$\\text{CSA} = 2\\pi r(3h) = 6\\pi r h$$\n\n$$\\text{TSA} = 2\\pi r(r+3h)$$\n\n$$\\frac{\\text{CSA}}{\\text{TSA}} = \\frac{6\\pi r h}{2\\pi r(r+3h)} = \\frac{3h}{r+3h}$$`,
        "বিচৰা অনুপাতটো $3h : (r+3h)$।",
        "বেলনকেইটাৰ সংযোগস্থলবোৰ নতুন ঘনবস্তুটোৰ ভিতৰত হেৰাই যায়, গতিকে একেবাৰে ওপৰৰ আৰু একেবাৰে তলৰ চক্ৰীয় পৃষ্ঠ দুখনেই বাকী থকা একমাত্ৰ সমতল পৃষ্ঠ।",
      ),
    },
  },
  {
    id: "l40-plot-drainlet-depth",
    questionType: "5-mark",
    marks: 5,
    difficulty: "hard",
    part: 4,
    figure: "sav-la40-plot-drainlet-v2.png",
    en: {
      question:
        "A plot of land is rectangular, measuring $240\\ \\text{m}\\times 180\\ \\text{m}$. A drainlet $10$ m wide is dug all round it on the outside, and the earth taken out is spread evenly over the plot, raising its surface level by $25$ cm. Find the depth of the drainlet.",
      answer: sol(
        "en",
        "plot $= 240\\ \\text{m}\\times 180\\ \\text{m}$; drainlet width $= 10\\ \\text{m}$, dug outside the plot; the level of the plot rises by $25\\ \\text{cm} = 0.25\\ \\text{m}$.",
        `${img("sav-la40-plot-drainlet-v2.png", "A 240 m by 180 m rectangular plot with a 10 m wide band dug all around it on the outside")}\n\n$$\\text{volume of earth spread on the plot} = 240\\times 180\\times 0.25 = 10800\\ \\text{m}^3$$\n\nThe drainlet is the ring outside the plot. Splitting it into two long strips and two short ones:\n\n$$\\text{floor area} = 2\\big[(240+2\\times 10)\\times 10\\big] + 2\\big[180\\times 10\\big]$$\n\n$$= 2(260\\times 10) + 2(180\\times 10) = 5200+3600 = 8800\\ \\text{m}^2$$\n\nLet the depth be $x$ m. All the earth dug out of the drainlet was spread on the plot, so\n\n$$8800x = 10800 \\implies x = \\frac{10800}{8800} = 1.23\\ \\text{m}\\ \\text{(approx.)}$$`,
        "The depth of the drainlet is about $1.23$ m.",
        "The two longer strips run $260$ m, not $240$ m — they include the corners, which is exactly why the short strips are taken as $180$ m and not $200$ m.",
      ),
    },
    as: {
      question:
        "এখন মাটিৰ প্লট আয়তাকাৰ, জোখ $240\\ \\text{m}\\times 180\\ \\text{m}$। ইয়াৰ চাৰিওফালে বাহিৰফালে $10$ মি. বহল এটা নলা খন্দা হ'ল, আৰু উলিওৱা মাটিখিনি প্লটখনৰ ওপৰত সমানকৈ বিয়পাই দিয়াত ইয়াৰ পৃষ্ঠৰ স্তৰ $25$ চে.মি. ওখ হ'ল। নলাটোৰ গভীৰতা নিৰ্ণয় কৰা।",
      answer: sol(
        "as",
        "প্লটখন $= 240\\ \\text{m}\\times 180\\ \\text{m}$; নলাৰ প্ৰস্থ $= 10\\ \\text{m}$, প্লটখনৰ বাহিৰফালে খন্দা; প্লটখনৰ স্তৰ $25\\ \\text{cm} = 0.25\\ \\text{m}$ ওখ হয়।",
        `${img("sav-la40-plot-drainlet-v2.png", "240 মি. বাই 180 মি. এখন আয়তাকাৰ প্লট, ইয়াৰ চাৰিওফালে বাহিৰফালে 10 মি. বহল এটা পট্টি খন্দা হৈছে")}\n\n$$\\text{প্লটখনত বিয়পোৱা মাটিৰ আয়তন} = 240\\times 180\\times 0.25 = 10800\\ \\text{m}^3$$\n\nনলাটো হ'ল প্লটখনৰ বাহিৰৰ বলয়টো। ইয়াক দুটা দীঘল আৰু দুটা চুটি পট্টিত ভাগ কৰিলে:\n\n$$\\text{তলিৰ কালি} = 2\\big[(240+2\\times 10)\\times 10\\big] + 2\\big[180\\times 10\\big]$$\n\n$$= 2(260\\times 10) + 2(180\\times 10) = 5200+3600 = 8800\\ \\text{m}^2$$\n\nগভীৰতা $x$ মি. ধৰা হ'ল। নলাটোৰ পৰা উলিওৱা গোটেই মাটিখিনি প্লটখনত বিয়পোৱা হৈছে, গতিকে\n\n$$8800x = 10800 \\implies x = \\frac{10800}{8800} = 1.23\\ \\text{m}\\ \\text{(প্ৰায়)}$$`,
        "নলাটোৰ গভীৰতা প্ৰায় $1.23$ মি.।",
        "দীঘল পট্টি দুটাৰ দৈৰ্ঘ্য $260$ মি., $240$ মি. নহয় — সেই দুটাতে চুকবোৰ ধৰা হৈছে, আৰু সেই কাৰণেই চুটি পট্টি দুটা $200$ মি. নহয়, $180$ মি. ধৰা হৈছে।",
      ),
    },
  },
];
