/**
 * The 22 multiple-choice questions of Books/363aWhhC9QJozZLaEhZD.pdf
 * ("Surface Areas and Volumes", Questions 1-22, answers printed inline).
 *
 * Wording is paraphrased for copyright; every number, option set and answer is
 * unchanged from the source.  Where the PDF's text layer had reflowed a
 * question across a page break (Q10, Q18, Q21) the page images were read to
 * reconstruct the original before rewording.
 */
import { McqItem, sol } from "./_sav_bank";

export const MCQ_A: McqItem[] = [
  {
    id: "a01-balloon-volume-ratio",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "A spherical balloon is blown up until its radius becomes double what it was at the start. The volume of the blown-up balloon compared with its original volume is in the ratio",
      options: ["8 : 1", "4 : 1", "5 : 1", "6 : 1"],
      explanation: sol(
        "en",
        "original radius $= r$, new radius $= 2r$.",
        "The volume of a sphere is $\\dfrac{4}{3}\\pi r^3$, so volume varies as the **cube** of the radius.\n\n$$\\frac{V_{\\text{new}}}{V_{\\text{old}}} = \\frac{\\tfrac{4}{3}\\pi (2r)^3}{\\tfrac{4}{3}\\pi r^3} = \\frac{8r^3}{r^3} = \\frac{8}{1}$$",
        "The required ratio is $8 : 1$ — option (A).",
        "Doubling the radius multiplies the surface area by $2^2 = 4$ but the volume by $2^3 = 8$; option (B) is the surface-area answer.",
      ),
    },
    as: {
      question:
        "এটা গোলাকাৰ বেলুন ফুলাই ইয়াৰ ব্যাসাৰ্ধ আৰম্ভণিৰ তুলনাত দুগুণ কৰা হ'ল। ফুলোৱাৰ পিছৰ বেলুনটোৰ আয়তন আৰু ইয়াৰ আৰম্ভণিৰ আয়তনৰ অনুপাত হ'ব",
      options: ["8 : 1", "4 : 1", "5 : 1", "6 : 1"],
      explanation: sol(
        "as",
        "আৰম্ভণিৰ ব্যাসাৰ্ধ $= r$, নতুন ব্যাসাৰ্ধ $= 2r$।",
        "গোলকৰ আয়তন $\\dfrac{4}{3}\\pi r^3$, গতিকে আয়তন ব্যাসাৰ্ধৰ **ঘন** অনুপাতে সলনি হয়।\n\n$$\\frac{V_{\\text{new}}}{V_{\\text{old}}} = \\frac{\\tfrac{4}{3}\\pi (2r)^3}{\\tfrac{4}{3}\\pi r^3} = \\frac{8r^3}{r^3} = \\frac{8}{1}$$",
        "বিচৰা অনুপাতটো $8 : 1$ — বিকল্প (A)।",
        "ব্যাসাৰ্ধ দুগুণ কৰিলে পৃষ্ঠকালি $2^2 = 4$ গুণ হয় কিন্তু আয়তন $2^3 = 8$ গুণ হয়; বিকল্প (B) টো পৃষ্ঠকালিৰ উত্তৰ।",
      ),
    },
  },
  {
    id: "a02-longest-rod-cube",
    difficulty: "easy",
    correctIndex: 2,
    en: {
      question:
        "What is the greatest length of a straight rod that can be placed inside a cubical vessel whose edge measures $10$ cm?",
      options: ["$10$ cm", "$10\\sqrt{2}$ cm", "$10\\sqrt{3}$ cm", "$20$ cm"],
      explanation: sol(
        "en",
        "edge of the cube $a = 10\\ \\text{cm}$.",
        "The longest rod that fits lies along the **space diagonal** of the cube, whose length is $\\sqrt{3}\\,a$.\n\n$$\\text{diagonal} = \\sqrt{a^2+a^2+a^2} = \\sqrt{3a^2} = \\sqrt{3}\\times 10 = 10\\sqrt{3}\\ \\text{cm}$$",
        "The longest rod is $10\\sqrt{3}$ cm — option (C).",
        "$10\\sqrt{2}$ cm is the diagonal of one **face**, not of the solid, so option (B) is the trap here.",
      ),
    },
    as: {
      question:
        "$10$ চে.মি. ধাৰৰ এটা ঘনক আকৃতিৰ পাত্ৰৰ ভিতৰত ৰাখিব পৰা এডাল পোন দণ্ডৰ সৰ্বাধিক দৈৰ্ঘ্য কিমান?",
      options: ["$10$ চে.মি.", "$10\\sqrt{2}$ চে.মি.", "$10\\sqrt{3}$ চে.মি.", "$20$ চে.মি."],
      explanation: sol(
        "as",
        "ঘনকটোৰ ধাৰ $a = 10\\ \\text{cm}$।",
        "ভিতৰত সোমোৱা আটাইতকৈ দীঘল দণ্ডডাল ঘনকটোৰ **কৰ্ণ** ৰ ওপৰত থাকে, যাৰ দৈৰ্ঘ্য $\\sqrt{3}\\,a$।\n\n$$\\text{কৰ্ণ} = \\sqrt{a^2+a^2+a^2} = \\sqrt{3a^2} = \\sqrt{3}\\times 10 = 10\\sqrt{3}\\ \\text{cm}$$",
        "আটাইতকৈ দীঘল দণ্ডডালৰ দৈৰ্ঘ্য $10\\sqrt{3}$ চে.মি. — বিকল্প (C)।",
        "$10\\sqrt{2}$ চে.মি. হ'ল এখন **পৃষ্ঠ** ৰ কৰ্ণ, ঘনবস্তুটোৰ কৰ্ণ নহয়; সেয়ে বিকল্প (B) টোৱেই ইয়াত ফান্দ।",
      ),
    },
  },
  {
    id: "a03-cone-slant-40-60",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question:
        "The vertical height of a right circular cone is $40$ cm and the diameter of its base is $60$ cm. The slant height of the cone is",
      options: ["$25$ cm", "$100$ cm", "$75$ cm", "$50$ cm"],
      explanation: sol(
        "en",
        "$h = 40\\ \\text{cm}$, $d = 60\\ \\text{cm} \\Rightarrow r = 30\\ \\text{cm}$.",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{30^2+40^2} = \\sqrt{900+1600} = \\sqrt{2500} = 50\\ \\text{cm}$$",
        "The slant height is $50$ cm — option (D).",
        "The radius, not the diameter, goes into the Pythagoras step — using $60$ instead of $30$ is the commonest slip here.",
      ),
    },
    as: {
      question:
        "এটা সমবৃত্তভূমিক শংকুৰ উলম্ব উচ্চতা $40$ চে.মি. আৰু ইয়াৰ ভূমিৰ ব্যাস $60$ চে.মি.। শংকুটোৰ তিৰ্যক উচ্চতা হ'ল",
      options: ["$25$ চে.মি.", "$100$ চে.মি.", "$75$ চে.মি.", "$50$ চে.মি."],
      explanation: sol(
        "as",
        "$h = 40\\ \\text{cm}$, $d = 60\\ \\text{cm} \\Rightarrow r = 30\\ \\text{cm}$।",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{30^2+40^2} = \\sqrt{900+1600} = \\sqrt{2500} = 50\\ \\text{cm}$$",
        "তিৰ্যক উচ্চতা $50$ চে.মি. — বিকল্প (D)।",
        "পাইথাগোৰাছৰ খোজটোত ব্যাস নহয়, ব্যাসাৰ্ধহে বহুৱাব লাগে — $30$ ৰ ঠাইত $60$ বহুওৱাটোৱেই ইয়াৰ আটাইতকৈ সাধাৰণ ভুল।",
      ),
    },
  },
  {
    id: "a04-pillar-cost",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "A pillar is cylindrical in shape with base diameter $4$ m and height $21$ m. At Rs. $1.50$ per cubic metre, the cost of constructing the pillar is",
      options: ["Rs. $396$", "Rs. $400$", "Rs. $410$", "Rs. $420$"],
      explanation: sol(
        "en",
        "$d = 4\\ \\text{m} \\Rightarrow r = 2\\ \\text{m}$, $h = 21\\ \\text{m}$, rate $=$ Rs. $1.50$ per $\\text{m}^3$.",
        "$$V = \\pi r^2 h = \\frac{22}{7}\\times 2^2 \\times 21 = \\frac{22}{7}\\times 4 \\times 21 = 22\\times 4\\times 3 = 264\\ \\text{m}^3$$\n\n$$\\text{cost} = 264 \\times 1.50 = 396$$",
        "The cost of construction is Rs. $396$ — option (A).",
        "The rate is per cubic metre, so it is the **volume** that must be costed, not any surface area.",
      ),
    },
    as: {
      question:
        "এটা স্তম্ভ বেলনাকাৰ, ইয়াৰ ভূমিৰ ব্যাস $4$ মি. আৰু উচ্চতা $21$ মি.। প্ৰতি ঘন মিটাৰত $1.50$ টকা হাৰত স্তম্ভটো নিৰ্মাণৰ খৰচ হ'ল",
      options: ["$396$ টকা", "$400$ টকা", "$410$ টকা", "$420$ টকা"],
      explanation: sol(
        "as",
        "$d = 4\\ \\text{m} \\Rightarrow r = 2\\ \\text{m}$, $h = 21\\ \\text{m}$, হাৰ $=$ প্ৰতি $\\text{m}^3$ ত $1.50$ টকা।",
        "$$V = \\pi r^2 h = \\frac{22}{7}\\times 2^2 \\times 21 = \\frac{22}{7}\\times 4 \\times 21 = 22\\times 4\\times 3 = 264\\ \\text{m}^3$$\n\n$$\\text{খৰচ} = 264 \\times 1.50 = 396$$",
        "নিৰ্মাণৰ খৰচ $396$ টকা — বিকল্প (A)।",
        "হাৰটো প্ৰতি ঘন মিটাৰত দিয়া আছে, গতিকে কোনো পৃষ্ঠকালি নহয়, **আয়তন** টোহে খৰচৰ হিচাপত ল'ব লাগে।",
      ),
    },
  },
  {
    id: "a05-cone-height-5-13",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question:
        "A right circular cone has base radius $5$ cm and slant height $13$ cm. Its vertical height is",
      options: ["$8$ cm", "$14$ cm", "$6$ cm", "$12$ cm"],
      explanation: sol(
        "en",
        "$r = 5\\ \\text{cm}$, $l = 13\\ \\text{cm}$.",
        "$$h = \\sqrt{l^2-r^2} = \\sqrt{13^2-5^2} = \\sqrt{169-25} = \\sqrt{144} = 12\\ \\text{cm}$$",
        "The height of the cone is $12$ cm — option (D).",
        "$(5, 12, 13)$ is a Pythagorean triple, so the answer comes out whole.",
      ),
    },
    as: {
      question:
        "এটা সমবৃত্তভূমিক শংকুৰ ভূমিৰ ব্যাসাৰ্ধ $5$ চে.মি. আৰু তিৰ্যক উচ্চতা $13$ চে.মি.। ইয়াৰ উলম্ব উচ্চতা হ'ল",
      options: ["$8$ চে.মি.", "$14$ চে.মি.", "$6$ চে.মি.", "$12$ চে.মি."],
      explanation: sol(
        "as",
        "$r = 5\\ \\text{cm}$, $l = 13\\ \\text{cm}$।",
        "$$h = \\sqrt{l^2-r^2} = \\sqrt{13^2-5^2} = \\sqrt{169-25} = \\sqrt{144} = 12\\ \\text{cm}$$",
        "শংকুটোৰ উচ্চতা $12$ চে.মি. — বিকল্প (D)।",
        "$(5, 12, 13)$ এটা পাইথাগোৰীয় ত্ৰয়ী, সেয়েহে উত্তৰটো পূৰ্ণসংখ্যা হৈ ওলাল।",
      ),
    },
  },
  {
    id: "a06-cone-csa-21-14",
    difficulty: "easy",
    correctIndex: 1,
    en: {
      question:
        "For a right circular cone whose slant height is $14$ cm and base radius is $21$ cm, the curved surface area equals",
      options: ["$308\\ \\text{cm}^2$", "$924\\ \\text{cm}^2$", "$232\\ \\text{cm}^2$", "$446\\ \\text{cm}^2$"],
      explanation: sol(
        "en",
        "$l = 14\\ \\text{cm}$, $r = 21\\ \\text{cm}$.",
        "$$\\text{CSA} = \\pi r l = \\frac{22}{7}\\times 21\\times 14 = 22\\times 3\\times 14 = 924\\ \\text{cm}^2$$",
        "The curved surface area is $924\\ \\text{cm}^2$ — option (B).",
        "Here the slant height happens to be smaller than the radius; that is allowed, since $l$ and $r$ are simply two sides of the right triangle and only $l > h$ is forced.",
      ),
    },
    as: {
      question:
        "যিটো সমবৃত্তভূমিক শংকুৰ তিৰ্যক উচ্চতা $14$ চে.মি. আৰু ভূমিৰ ব্যাসাৰ্ধ $21$ চে.মি., তাৰ বক্ৰ পৃষ্ঠকালি হ'ল",
      options: ["$308\\ \\text{cm}^2$", "$924\\ \\text{cm}^2$", "$232\\ \\text{cm}^2$", "$446\\ \\text{cm}^2$"],
      explanation: sol(
        "as",
        "$l = 14\\ \\text{cm}$, $r = 21\\ \\text{cm}$।",
        "$$\\text{CSA} = \\pi r l = \\frac{22}{7}\\times 21\\times 14 = 22\\times 3\\times 14 = 924\\ \\text{cm}^2$$",
        "বক্ৰ পৃষ্ঠকালি $924\\ \\text{cm}^2$ — বিকল্প (B)।",
        "ইয়াত তিৰ্যক উচ্চতাটো ব্যাসাৰ্ধতকৈ সৰু হৈ পৰিছে; সেয়া হ'ব পাৰে, কাৰণ $l$ আৰু $r$ কেৱল সমকোণী ত্ৰিভুজটোৰ দুটা বাহু আৰু কেৱল $l > h$ হ'বই লাগে।",
      ),
    },
  },
  {
    id: "a07-cube-volume-perimeter-40",
    difficulty: "easy",
    correctIndex: 1,
    en: {
      question:
        "One face of a cube has perimeter $40$ cm. The volume of the cube, in $\\text{cm}^3$, is",
      options: ["$1600$", "$1000$", "$800$", "$160$"],
      explanation: sol(
        "en",
        "perimeter of one (square) face $= 40\\ \\text{cm}$.",
        "A face of a cube is a square of side $a$, so its perimeter is $4a$.\n\n$$4a = 40 \\implies a = 10\\ \\text{cm}$$\n\n$$V = a^3 = 10^3 = 1000\\ \\text{cm}^3$$",
        "The volume of the cube is $1000\\ \\text{cm}^3$ — option (B).",
      ),
    },
    as: {
      question:
        "এটা ঘনকৰ এখন পৃষ্ঠৰ পৰিসীমা $40$ চে.মি.। ঘনকটোৰ আয়তন $\\text{cm}^3$ ত হ'ল",
      options: ["$1600$", "$1000$", "$800$", "$160$"],
      explanation: sol(
        "as",
        "এখন (বৰ্গাকাৰ) পৃষ্ঠৰ পৰিসীমা $= 40\\ \\text{cm}$।",
        "ঘনকৰ এখন পৃষ্ঠ হ'ল $a$ বাহুৰ এটা বৰ্গ, গতিকে ইয়াৰ পৰিসীমা $4a$।\n\n$$4a = 40 \\implies a = 10\\ \\text{cm}$$\n\n$$V = a^3 = 10^3 = 1000\\ \\text{cm}^3$$",
        "ঘনকটোৰ আয়তন $1000\\ \\text{cm}^3$ — বিকল্প (B)।",
      ),
    },
  },
  {
    id: "a08-cylinder-volume-14-4",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "A cylinder is $14$ cm tall and the diameter of its base is $4$ cm. Its volume is",
      options: ["$176\\ \\text{cm}^3$", "$196\\ \\text{cm}^3$", "$276\\ \\text{cm}^3$", "$352\\ \\text{cm}^3$"],
      explanation: sol(
        "en",
        "$h = 14\\ \\text{cm}$, $d = 4\\ \\text{cm} \\Rightarrow r = 2\\ \\text{cm}$.",
        "$$V = \\pi r^2 h = \\frac{22}{7}\\times 2^2 \\times 14 = \\frac{22}{7}\\times 4\\times 14 = 22\\times 4\\times 2 = 176\\ \\text{cm}^3$$",
        "The volume is $176\\ \\text{cm}^3$ — option (A).",
        "Option (D), $352$, is what you get if the diameter is used in place of the radius, since that doubles… and then squares.",
      ),
    },
    as: {
      question:
        "এটা বেলনৰ উচ্চতা $14$ চে.মি. আৰু ইয়াৰ ভূমিৰ ব্যাস $4$ চে.মি.। ইয়াৰ আয়তন হ'ল",
      options: ["$176\\ \\text{cm}^3$", "$196\\ \\text{cm}^3$", "$276\\ \\text{cm}^3$", "$352\\ \\text{cm}^3$"],
      explanation: sol(
        "as",
        "$h = 14\\ \\text{cm}$, $d = 4\\ \\text{cm} \\Rightarrow r = 2\\ \\text{cm}$।",
        "$$V = \\pi r^2 h = \\frac{22}{7}\\times 2^2 \\times 14 = \\frac{22}{7}\\times 4\\times 14 = 22\\times 4\\times 2 = 176\\ \\text{cm}^3$$",
        "আয়তন $176\\ \\text{cm}^3$ — বিকল্প (A)।",
        "ব্যাসাৰ্ধৰ ঠাইত ব্যাস বহুৱালে বিকল্প (D), অৰ্থাৎ $352$ ওলায়।",
      ),
    },
  },
  {
    id: "a09-iron-beam-weight",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "An iron beam measures $9$ m in length, $40$ cm in width and $20$ cm in depth. If the iron weighs $50$ kg per cubic metre, the beam weighs",
      options: ["$27$ kg", "$36$ kg", "$48$ kg", "$56$ kg"],
      explanation: sol(
        "en",
        "$l = 9\\ \\text{m}$, $b = 40\\ \\text{cm} = 0.4\\ \\text{m}$, $h = 20\\ \\text{cm} = 0.2\\ \\text{m}$, density $= 50\\ \\text{kg/m}^3$.",
        "All three measurements must be in the same unit before multiplying.\n\n$$V = l\\times b\\times h = 9\\times 0.4\\times 0.2 = 0.72\\ \\text{m}^3$$\n\n$$\\text{weight} = 0.72\\times 50 = 36\\ \\text{kg}$$",
        "The beam weighs $36$ kg — option (B).",
      ),
    },
    as: {
      question:
        "লোহাৰে নিৰ্মিত আয়তঘন আকৃতিৰ এডাল চতিৰ দৈৰ্ঘ্য $9$ মি., প্ৰস্থ $40$ চে.মি. আৰু গভীৰতা $20$ চে.মি.। যদি লোহাৰ ওজন প্ৰতি ঘন মিটাৰত $50$ কি.গ্ৰা., তেন্তে চতিডালৰ ওজন হ'ল",
      options: ["$27$ কি.গ্ৰা.", "$36$ কি.গ্ৰা.", "$48$ কি.গ্ৰা.", "$56$ কি.গ্ৰা."],
      explanation: sol(
        "as",
        "$l = 9\\ \\text{m}$, $b = 40\\ \\text{cm} = 0.4\\ \\text{m}$, $h = 20\\ \\text{cm} = 0.2\\ \\text{m}$, ঘনত্ব $= 50\\ \\text{kg/m}^3$।",
        "পূৰণ কৰাৰ আগতে তিনিওটা জোখ একেটা এককলৈ অনা প্ৰয়োজন।\n\n$$V = l\\times b\\times h = 9\\times 0.4\\times 0.2 = 0.72\\ \\text{m}^3$$\n\n$$\\text{ওজন} = 0.72\\times 50 = 36\\ \\text{kg}$$",
        "চতিডালৰ ওজন $36$ কি.গ্ৰা. — বিকল্প (B)।",
      ),
    },
  },
  {
    id: "a10-conical-tent-canvas-cost",
    difficulty: "easy",
    correctIndex: 1,
    en: {
      question:
        "The canvas that covers a conical tent has an area of $4526\\ \\text{m}^2$. If canvas costs Rs. $17$ per square metre, the total cost of the canvas is",
      options: ["₹$52100$", "₹$76942$", "₹$65000$", "₹$85246$"],
      explanation: sol(
        "en",
        "area of canvas $= 4526\\ \\text{m}^2$, rate $=$ Rs. $17$ per $\\text{m}^2$.",
        "$$\\text{cost} = \\text{area}\\times\\text{rate} = 4526\\times 17$$\n\n$$4526\\times 17 = 4526\\times 10 + 4526\\times 7 = 45260 + 31682 = 76942$$",
        "The total cost of the canvas is ₹$76942$ — option (B).",
      ),
    },
    as: {
      question:
        "এটা শংকু আকৃতিৰ তম্বু ঢাকি থকা কেনভাচৰ কালি $4526\\ \\text{m}^2$। যদি কেনভাচৰ দাম প্ৰতি বৰ্গ মিটাৰত $17$ টকা, তেন্তে কেনভাচৰ মুঠ খৰচ হ'ল",
      options: ["₹$52100$", "₹$76942$", "₹$65000$", "₹$85246$"],
      explanation: sol(
        "as",
        "কেনভাচৰ কালি $= 4526\\ \\text{m}^2$, হাৰ $=$ প্ৰতি $\\text{m}^2$ ত $17$ টকা।",
        "$$\\text{খৰচ} = \\text{কালি}\\times\\text{হাৰ} = 4526\\times 17$$\n\n$$4526\\times 17 = 4526\\times 10 + 4526\\times 7 = 45260 + 31682 = 76942$$",
        "কেনভাচৰ মুঠ খৰচ ₹$76942$ — বিকল্প (B)।",
      ),
    },
  },
  {
    id: "a11-cuboid-box-surface-area",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "A box is a cuboid of length $80$ cm, breadth $40$ cm and height $20$ cm. Its surface area is",
      options: ["$11200$ sq. cm", "$13000$ sq. cm", "$13400$ sq. cm", "$12000$ sq. cm"],
      explanation: sol(
        "en",
        "$l = 80\\ \\text{cm}$, $b = 40\\ \\text{cm}$, $h = 20\\ \\text{cm}$.",
        "$$\\text{TSA} = 2(lb + bh + hl)$$\n\n$$= 2\\big(80\\times 40 + 40\\times 20 + 20\\times 80\\big) = 2(3200 + 800 + 1600)$$\n\n$$= 2\\times 5600 = 11200\\ \\text{cm}^2$$",
        "The surface area of the box is $11200$ sq. cm — option (A).",
      ),
    },
    as: {
      question:
        "এটা বাকচ হ'ল $80$ চে.মি. দৈৰ্ঘ্য, $40$ চে.মি. প্ৰস্থ আৰু $20$ চে.মি. উচ্চতাৰ এটা আয়তঘন। ইয়াৰ পৃষ্ঠকালি হ'ল",
      options: ["$11200$ বৰ্গ চে.মি.", "$13000$ বৰ্গ চে.মি.", "$13400$ বৰ্গ চে.মি.", "$12000$ বৰ্গ চে.মি."],
      explanation: sol(
        "as",
        "$l = 80\\ \\text{cm}$, $b = 40\\ \\text{cm}$, $h = 20\\ \\text{cm}$।",
        "$$\\text{TSA} = 2(lb + bh + hl)$$\n\n$$= 2\\big(80\\times 40 + 40\\times 20 + 20\\times 80\\big) = 2(3200 + 800 + 1600)$$\n\n$$= 2\\times 5600 = 11200\\ \\text{cm}^2$$",
        "বাকচটোৰ পৃষ্ঠকালি $11200$ বৰ্গ চে.মি. — বিকল্প (A)।",
      ),
    },
  },
  {
    id: "a12-sphere-csa-from-volume",
    difficulty: "hard",
    correctIndex: 0,
    en: {
      question:
        "A sphere has volume $38808$ cu. cm. Its curved surface area, in $\\text{cm}^2$, is",
      options: ["$5544$", "$1386$", "$8316$", "$4158$"],
      explanation: sol(
        "en",
        "volume of the sphere $= 38808\\ \\text{cm}^3$.",
        "First recover the radius:\n\n$$\\frac{4}{3}\\pi r^3 = 38808 \\implies \\frac{4}{3}\\times\\frac{22}{7}\\times r^3 = 38808$$\n\n$$r^3 = \\frac{38808\\times 3\\times 7}{4\\times 22} = \\frac{814968}{88} = 9261 \\implies r = 21\\ \\text{cm}$$\n\n$$\\text{CSA} = 4\\pi r^2 = 4\\times\\frac{22}{7}\\times 21^2 = 4\\times 22\\times 63 = 5544\\ \\text{cm}^2$$",
        "The curved surface area is $5544\\ \\text{cm}^2$ — option (A).",
        "$9261 = 21^3$; spotting the perfect cube saves the whole cube-root computation.",
      ),
    },
    as: {
      question:
        "এটা গোলকৰ আয়তন $38808$ ঘন চে.মি.। ইয়াৰ বক্ৰ পৃষ্ঠকালি $\\text{cm}^2$ ত হ'ল",
      options: ["$5544$", "$1386$", "$8316$", "$4158$"],
      explanation: sol(
        "as",
        "গোলকটোৰ আয়তন $= 38808\\ \\text{cm}^3$।",
        "প্ৰথমে ব্যাসাৰ্ধ উলিয়াওঁ:\n\n$$\\frac{4}{3}\\pi r^3 = 38808 \\implies \\frac{4}{3}\\times\\frac{22}{7}\\times r^3 = 38808$$\n\n$$r^3 = \\frac{38808\\times 3\\times 7}{4\\times 22} = \\frac{814968}{88} = 9261 \\implies r = 21\\ \\text{cm}$$\n\n$$\\text{CSA} = 4\\pi r^2 = 4\\times\\frac{22}{7}\\times 21^2 = 4\\times 22\\times 63 = 5544\\ \\text{cm}^2$$",
        "বক্ৰ পৃষ্ঠকালি $5544\\ \\text{cm}^2$ — বিকল্প (A)।",
        "$9261 = 21^3$; পূৰ্ণ ঘনটো চিনি পালে গোটেই ঘনমূলৰ হিচাপটো সাঁচি যায়।",
      ),
    },
  },
  {
    id: "a13-cone-height-from-volume-77",
    difficulty: "moderate",
    correctIndex: 3,
    en: {
      question:
        "A right circular cone of base radius $3.5$ cm has volume $77\\ \\text{cm}^3$. Its height is",
      options: ["$9$ cm", "$11$ cm", "$4$ cm", "$6$ cm"],
      explanation: sol(
        "en",
        "$r = 3.5\\ \\text{cm}$, $V = 77\\ \\text{cm}^3$.",
        "$$V = \\frac{1}{3}\\pi r^2 h \\implies 77 = \\frac{1}{3}\\times\\frac{22}{7}\\times (3.5)^2\\times h$$\n\n$$\\frac{1}{3}\\times\\frac{22}{7}\\times 12.25 = \\frac{269.5}{21} = 12.8\\overline{3}$$\n\n$$h = \\frac{77\\times 3\\times 7}{22\\times 12.25} = \\frac{1617}{269.5} = 6\\ \\text{cm}$$",
        "The height of the cone is $6$ cm — option (D).",
        "Do not forget the factor $\\tfrac{1}{3}$ — leaving it out gives $h = 2$ cm, which is not even on the list.",
      ),
    },
    as: {
      question:
        "$3.5$ চে.মি. ভূমি-ব্যাসাৰ্ধৰ এটা সমবৃত্তভূমিক শংকুৰ আয়তন $77\\ \\text{cm}^3$। ইয়াৰ উচ্চতা হ'ল",
      options: ["$9$ চে.মি.", "$11$ চে.মি.", "$4$ চে.মি.", "$6$ চে.মি."],
      explanation: sol(
        "as",
        "$r = 3.5\\ \\text{cm}$, $V = 77\\ \\text{cm}^3$।",
        "$$V = \\frac{1}{3}\\pi r^2 h \\implies 77 = \\frac{1}{3}\\times\\frac{22}{7}\\times (3.5)^2\\times h$$\n\n$$\\frac{1}{3}\\times\\frac{22}{7}\\times 12.25 = \\frac{269.5}{21} = 12.8\\overline{3}$$\n\n$$h = \\frac{77\\times 3\\times 7}{22\\times 12.25} = \\frac{1617}{269.5} = 6\\ \\text{cm}$$",
        "শংকুটোৰ উচ্চতা $6$ চে.মি. — বিকল্প (D)।",
        "$\\tfrac{1}{3}$ গুণকটো পাহৰিব নালাগে — সেইটো এৰি দিলে $h = 2$ চে.মি. ওলায়, যিটো তালিকাতেই নাই।",
      ),
    },
  },
  {
    id: "a14-spheres-volume-64-27",
    difficulty: "easy",
    correctIndex: 3,
    en: {
      question:
        "The volumes of two spheres are in the ratio $64 : 27$. The ratio of their radii is",
      options: ["$8 : 3$", "$16 : 9$", "$10 : 7$", "$4 : 3$"],
      explanation: sol(
        "en",
        "$V_1 : V_2 = 64 : 27$.",
        "$$\\frac{V_1}{V_2} = \\frac{\\tfrac{4}{3}\\pi r_1^{\\,3}}{\\tfrac{4}{3}\\pi r_2^{\\,3}} = \\left(\\frac{r_1}{r_2}\\right)^{3} = \\frac{64}{27}$$\n\n$$\\frac{r_1}{r_2} = \\sqrt[3]{\\frac{64}{27}} = \\frac{4}{3}$$",
        "The radii are in the ratio $4 : 3$ — option (D).",
        "Take the **cube** root, not the square root; $8 : 3$ and $16 : 9$ are both square-root style traps.",
      ),
    },
    as: {
      question:
        "দুটা গোলকৰ আয়তনৰ অনুপাত $64 : 27$। সিহঁতৰ ব্যাসাৰ্ধৰ অনুপাত হ'ল",
      options: ["$8 : 3$", "$16 : 9$", "$10 : 7$", "$4 : 3$"],
      explanation: sol(
        "as",
        "$V_1 : V_2 = 64 : 27$।",
        "$$\\frac{V_1}{V_2} = \\frac{\\tfrac{4}{3}\\pi r_1^{\\,3}}{\\tfrac{4}{3}\\pi r_2^{\\,3}} = \\left(\\frac{r_1}{r_2}\\right)^{3} = \\frac{64}{27}$$\n\n$$\\frac{r_1}{r_2} = \\sqrt[3]{\\frac{64}{27}} = \\frac{4}{3}$$",
        "ব্যাসাৰ্ধ দুটাৰ অনুপাত $4 : 3$ — বিকল্প (D)।",
        "বৰ্গমূল নহয়, **ঘনমূল** ল'ব লাগে; $8 : 3$ আৰু $16 : 9$ দুয়োটাই বৰ্গমূল-ধৰণৰ ফান্দ।",
      ),
    },
  },
  {
    id: "a15-cylinder-tsa-28-20",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "A cylinder has base diameter $28$ cm and height $20$ cm. Its total surface area, in $\\text{cm}^2$, is",
      options: ["$2993$", "$2992$", "$2292$", "$2229$"],
      explanation: sol(
        "en",
        "$d = 28\\ \\text{cm} \\Rightarrow r = 14\\ \\text{cm}$, $h = 20\\ \\text{cm}$.",
        "$$\\text{TSA} = 2\\pi r(h+r) = 2\\times\\frac{22}{7}\\times 14\\times (20+14)$$\n\n$$= 2\\times 22\\times 2\\times 34 = 88\\times 34 = 2992\\ \\text{cm}^2$$",
        "The total surface area is $2992\\ \\text{cm}^2$ — option (B).",
        "The other three options differ from $2992$ only by a digit or two, so the arithmetic must be carried through exactly.",
      ),
    },
    as: {
      question:
        "এটা বেলনৰ ভূমিৰ ব্যাস $28$ চে.মি. আৰু উচ্চতা $20$ চে.মি.। ইয়াৰ সম্পূৰ্ণ পৃষ্ঠকালি $\\text{cm}^2$ ত হ'ল",
      options: ["$2993$", "$2992$", "$2292$", "$2229$"],
      explanation: sol(
        "as",
        "$d = 28\\ \\text{cm} \\Rightarrow r = 14\\ \\text{cm}$, $h = 20\\ \\text{cm}$।",
        "$$\\text{TSA} = 2\\pi r(h+r) = 2\\times\\frac{22}{7}\\times 14\\times (20+14)$$\n\n$$= 2\\times 22\\times 2\\times 34 = 88\\times 34 = 2992\\ \\text{cm}^2$$",
        "সম্পূৰ্ণ পৃষ্ঠকালি $2992\\ \\text{cm}^2$ — বিকল্প (B)।",
        "বাকী তিনিওটা বিকল্প $2992$ ৰ পৰা মাত্ৰ এটা-দুটা অংকহে বেলেগ, গতিকে হিচাপটো নিখুঁতভাৱে কৰিব লাগিব।",
      ),
    },
  },
  {
    id: "a16-similar-cones-volume-ratio",
    difficulty: "moderate",
    correctIndex: 3,
    en: {
      question:
        "Two similar right circular cones have base radii $2$ cm and $6$ cm. The ratio of their volumes is",
      options: ["$1 : 3$", "$1 : 9$", "$9 : 1$", "$1 : 27$"],
      explanation: sol(
        "en",
        "$r_1 = 2\\ \\text{cm}$, $r_2 = 6\\ \\text{cm}$, and the cones are **similar**.",
        "For similar solids every linear measurement is in the same ratio, so the heights are in the ratio $2 : 6 = 1 : 3$ as well, and volume varies as the cube of that ratio.\n\n$$\\frac{V_1}{V_2} = \\left(\\frac{r_1}{r_2}\\right)^{3} = \\left(\\frac{2}{6}\\right)^{3} = \\left(\\frac{1}{3}\\right)^{3} = \\frac{1}{27}$$",
        "The volumes are in the ratio $1 : 27$ — option (D).",
        "If the cones were not similar, the heights would be independent and no single ratio could be given.",
      ),
    },
    as: {
      question:
        "দুটা সদৃশ সমবৃত্তভূমিক শংকুৰ ভূমিৰ ব্যাসাৰ্ধ $2$ চে.মি. আৰু $6$ চে.মি.। সিহঁতৰ আয়তনৰ অনুপাত হ'ল",
      options: ["$1 : 3$", "$1 : 9$", "$9 : 1$", "$1 : 27$"],
      explanation: sol(
        "as",
        "$r_1 = 2\\ \\text{cm}$, $r_2 = 6\\ \\text{cm}$, আৰু শংকু দুটা **সদৃশ**।",
        "সদৃশ ঘনবস্তুৰ ক্ষেত্ৰত প্ৰতিটো ৰৈখিক জোখ একেই অনুপাতত থাকে, গতিকে উচ্চতা দুটাও $2 : 6 = 1 : 3$ অনুপাতত, আৰু আয়তন সেই অনুপাতৰ ঘনৰ সমানুপাতিক।\n\n$$\\frac{V_1}{V_2} = \\left(\\frac{r_1}{r_2}\\right)^{3} = \\left(\\frac{2}{6}\\right)^{3} = \\left(\\frac{1}{3}\\right)^{3} = \\frac{1}{27}$$",
        "আয়তন দুটাৰ অনুপাত $1 : 27$ — বিকল্প (D)।",
        "শংকু দুটা সদৃশ নহ'লে উচ্চতা দুটা স্বাধীন হ'লহেঁতেন আৰু কোনো এটা নিৰ্দিষ্ট অনুপাত দিব পৰা নগ'লহেঁতেন।",
      ),
    },
  },
  {
    id: "a17-sandbox-volume",
    difficulty: "easy",
    correctIndex: 0,
    en: {
      question:
        "A rectangular sand pit is $5$ m wide and $2$ m long. How many cubic metres of sand are needed to fill it to a depth of $10$ cm?",
      options: ["$1$", "$10$", "$100$", "$1000$"],
      explanation: sol(
        "en",
        "$b = 5\\ \\text{m}$, $l = 2\\ \\text{m}$, depth $= 10\\ \\text{cm} = 0.1\\ \\text{m}$.",
        "$$V = l\\times b\\times h = 2\\times 5\\times 0.1 = 1\\ \\text{m}^3$$",
        "$1$ cubic metre of sand is needed — option (A).",
        "The depth must be converted to metres first; leaving it as $10$ produces option (C), $100$.",
      ),
    },
    as: {
      question:
        "এটা আয়তাকাৰ বালিৰ গাঁতৰ প্ৰস্থ $5$ মি. আৰু দৈৰ্ঘ্য $2$ মি.। ইয়াক $10$ চে.মি. গভীৰতালৈকে ভৰাবলৈ কিমান ঘন মিটাৰ বালিৰ প্ৰয়োজন?",
      options: ["$1$", "$10$", "$100$", "$1000$"],
      explanation: sol(
        "as",
        "$b = 5\\ \\text{m}$, $l = 2\\ \\text{m}$, গভীৰতা $= 10\\ \\text{cm} = 0.1\\ \\text{m}$।",
        "$$V = l\\times b\\times h = 2\\times 5\\times 0.1 = 1\\ \\text{m}^3$$",
        "$1$ ঘন মিটাৰ বালিৰ প্ৰয়োজন — বিকল্প (A)।",
        "গভীৰতাটো প্ৰথমে মিটাৰলৈ সলনি কৰিব লাগে; $10$ হিচাপে এৰি দিলে বিকল্প (C), অৰ্থাৎ $100$ ওলায়।",
      ),
    },
  },
  {
    id: "a18-well-cementing-cost",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "The inner curved surface of a well $14$ m deep and of radius $2$ m is to be cemented at the rate of ₹$2$ per $\\text{m}^2$. The cost of cementing is",
      options: ["₹$352$", "₹$176$", "₹$56$", "₹$112$"],
      explanation: sol(
        "en",
        "$h = 14\\ \\text{m}$, $r = 2\\ \\text{m}$, rate $=$ ₹$2$ per $\\text{m}^2$.",
        "A well is a cylinder, and only its **inner curved** surface is cemented.\n\n$$\\text{CSA} = 2\\pi r h = 2\\times\\frac{22}{7}\\times 2\\times 14 = 2\\times 22\\times 2\\times 2 = 176\\ \\text{m}^2$$\n\n$$\\text{cost} = 176\\times 2 = 352$$",
        "The cost of cementing is ₹$352$ — option (A).",
        "Option (B), ₹$176$, is the **area** in $\\text{m}^2$, not the cost.",
      ),
    },
    as: {
      question:
        "$14$ মি. গভীৰ আৰু $2$ মি. ব্যাসাৰ্ধৰ এটা কুঁৱাৰ ভিতৰৰ বক্ৰ পৃষ্ঠত প্ৰতি $\\text{m}^2$ ত ₹$2$ হাৰত ছিমেণ্ট লগোৱা হ'ব। ছিমেণ্ট লগোৱাৰ খৰচ হ'ল",
      options: ["₹$352$", "₹$176$", "₹$56$", "₹$112$"],
      explanation: sol(
        "as",
        "$h = 14\\ \\text{m}$, $r = 2\\ \\text{m}$, হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$2$।",
        "কুঁৱা এটা বেলন, আৰু ইয়াৰ কেৱল **ভিতৰৰ বক্ৰ** পৃষ্ঠতহে ছিমেণ্ট লগোৱা হয়।\n\n$$\\text{CSA} = 2\\pi r h = 2\\times\\frac{22}{7}\\times 2\\times 14 = 2\\times 22\\times 2\\times 2 = 176\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = 176\\times 2 = 352$$",
        "ছিমেণ্ট লগোৱাৰ খৰচ ₹$352$ — বিকল্প (A)।",
        "বিকল্প (B), ₹$176$ হ'ল $\\text{m}^2$ ত **কালি** টো, খৰচ নহয়।",
      ),
    },
  },
  {
    id: "a19-cone-slant-15-20",
    difficulty: "easy",
    correctIndex: 2,
    en: {
      question:
        "A cone has base radius $15$ cm and vertical height $20$ cm. Its slant height is",
      options: ["$21$ cm", "$20$ cm", "$25$ cm", "$15$ cm"],
      explanation: sol(
        "en",
        "$r = 15\\ \\text{cm}$, $h = 20\\ \\text{cm}$.",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{15^2+20^2} = \\sqrt{225+400} = \\sqrt{625} = 25\\ \\text{cm}$$",
        "The slant height is $25$ cm — option (C).",
        "$(15, 20, 25)$ is just $(3, 4, 5)$ multiplied by $5$.",
      ),
    },
    as: {
      question:
        "এটা শংকুৰ ভূমিৰ ব্যাসাৰ্ধ $15$ চে.মি. আৰু উলম্ব উচ্চতা $20$ চে.মি.। ইয়াৰ তিৰ্যক উচ্চতা হ'ল",
      options: ["$21$ চে.মি.", "$20$ চে.মি.", "$25$ চে.মি.", "$15$ চে.মি."],
      explanation: sol(
        "as",
        "$r = 15\\ \\text{cm}$, $h = 20\\ \\text{cm}$।",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{15^2+20^2} = \\sqrt{225+400} = \\sqrt{625} = 25\\ \\text{cm}$$",
        "তিৰ্যক উচ্চতা $25$ চে.মি. — বিকল্প (C)।",
        "$(15, 20, 25)$ হ'ল $(3, 4, 5)$ ক $5$ ৰে পূৰণ কৰাটোহে।",
      ),
    },
  },
  {
    id: "a20-hemispherical-bowl-outer-csa",
    difficulty: "moderate",
    correctIndex: 1,
    en: {
      question:
        "A hemispherical bowl is made from steel $0.25$ cm thick. If its inner radius is $3.25$ cm, the curved surface area of its outer surface is",
      options: ["$154\\ \\text{cm}^2$", "$77\\ \\text{cm}^2$", "$115.5\\ \\text{cm}^2$", "$38.5\\ \\text{cm}^2$"],
      explanation: sol(
        "en",
        "inner radius $r = 3.25\\ \\text{cm}$, thickness $= 0.25\\ \\text{cm}$.",
        "$$R = r + \\text{thickness} = 3.25 + 0.25 = 3.5\\ \\text{cm}$$\n\n$$\\text{outer CSA} = 2\\pi R^2 = 2\\times\\frac{22}{7}\\times (3.5)^2 = 2\\times\\frac{22}{7}\\times 12.25 = 77\\ \\text{cm}^2$$",
        "The outer curved surface area is $77\\ \\text{cm}^2$ — option (B).",
        "Option (A), $154$, is $4\\pi R^2$, the surface of a whole **sphere** of the same radius.",
      ),
    },
    as: {
      question:
        "এটা অৰ্ধগোলাকাৰ বাটি $0.25$ চে.মি. ডাঠ ইস্পাতেৰে তৈয়াৰ কৰা হৈছে। যদি ইয়াৰ ভিতৰৰ ব্যাসাৰ্ধ $3.25$ চে.মি., তেন্তে ইয়াৰ বাহিৰৰ পৃষ্ঠৰ বক্ৰ পৃষ্ঠকালি হ'ল",
      options: ["$154\\ \\text{cm}^2$", "$77\\ \\text{cm}^2$", "$115.5\\ \\text{cm}^2$", "$38.5\\ \\text{cm}^2$"],
      explanation: sol(
        "as",
        "ভিতৰৰ ব্যাসাৰ্ধ $r = 3.25\\ \\text{cm}$, ডাঠ $= 0.25\\ \\text{cm}$।",
        "$$R = r + \\text{ডাঠ} = 3.25 + 0.25 = 3.5\\ \\text{cm}$$\n\n$$\\text{বাহিৰৰ CSA} = 2\\pi R^2 = 2\\times\\frac{22}{7}\\times (3.5)^2 = 2\\times\\frac{22}{7}\\times 12.25 = 77\\ \\text{cm}^2$$",
        "বাহিৰৰ বক্ৰ পৃষ্ঠকালি $77\\ \\text{cm}^2$ — বিকল্প (B)।",
        "বিকল্প (A), $154$ হ'ল $4\\pi R^2$, অৰ্থাৎ একেই ব্যাসাৰ্ধৰ এটা সম্পূৰ্ণ **গোলক** ৰ পৃষ্ঠকালি।",
      ),
    },
  },
  {
    id: "a21-conical-tent-cost-15-20",
    difficulty: "hard",
    correctIndex: 2,
    en: {
      question:
        "A conical tent is $15$ m high and the radius of its base is $20$ m. At ₹$7$ per $\\text{m}^2$, the cost of the canvas required to make the tent is",
      options: ["₹$10000$", "₹$12000$", "₹$11000$", "₹$9000$"],
      explanation: sol(
        "en",
        "$h = 15\\ \\text{m}$, $r = 20\\ \\text{m}$, rate $=$ ₹$7$ per $\\text{m}^2$.",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{400+225} = \\sqrt{625} = 25\\ \\text{m}$$\n\nThe canvas covers only the curved surface of the tent.\n\n$$\\text{CSA} = \\pi r l = \\frac{22}{7}\\times 20\\times 25 = \\frac{11000}{7}\\ \\text{m}^2$$\n\n$$\\text{cost} = \\frac{11000}{7}\\times 7 = 11000$$",
        "The cost of the canvas is ₹$11000$ — option (C).",
        "Because the rate is exactly $7$, the $7$ in $\\pi = \\tfrac{22}{7}$ cancels and the answer is a round number.",
      ),
    },
    as: {
      question:
        "এটা শংকু আকৃতিৰ তম্বু $15$ মি. ওখ আৰু ইয়াৰ ভূমিৰ ব্যাসাৰ্ধ $20$ মি.। প্ৰতি $\\text{m}^2$ ত ₹$7$ হাৰত তম্বুটো নিৰ্মাণ কৰিবলৈ লগা কেনভাচৰ খৰচ হ'ল",
      options: ["₹$10000$", "₹$12000$", "₹$11000$", "₹$9000$"],
      explanation: sol(
        "as",
        "$h = 15\\ \\text{m}$, $r = 20\\ \\text{m}$, হাৰ $=$ প্ৰতি $\\text{m}^2$ ত ₹$7$।",
        "$$l = \\sqrt{r^2+h^2} = \\sqrt{400+225} = \\sqrt{625} = 25\\ \\text{m}$$\n\nকেনভাচে তম্বুটোৰ কেৱল বক্ৰ পৃষ্ঠটোহে ঢাকে।\n\n$$\\text{CSA} = \\pi r l = \\frac{22}{7}\\times 20\\times 25 = \\frac{11000}{7}\\ \\text{m}^2$$\n\n$$\\text{খৰচ} = \\frac{11000}{7}\\times 7 = 11000$$",
        "কেনভাচৰ খৰচ ₹$11000$ — বিকল্প (C)।",
        "হাৰটো ঠিক $7$ হোৱা বাবে $\\pi = \\tfrac{22}{7}$ ৰ $7$ টো কাটি যায় আৰু উত্তৰটো এটা পূৰ্ণ সংখ্যা হয়।",
      ),
    },
  },
  {
    id: "a22-cylinder-diameter-from-csa",
    difficulty: "moderate",
    correctIndex: 0,
    en: {
      question:
        "A right circular cylinder of height $14$ cm has curved surface area $88\\ \\text{cm}^2$. The diameter of its base is",
      options: ["$2$ cm", "$3$ cm", "$4$ cm", "$6$ cm"],
      explanation: sol(
        "en",
        "$h = 14\\ \\text{cm}$, CSA $= 88\\ \\text{cm}^2$.",
        "$$2\\pi r h = 88 \\implies 2\\times\\frac{22}{7}\\times r\\times 14 = 88$$\n\n$$88r = 88 \\implies r = 1\\ \\text{cm}$$\n\n$$d = 2r = 2\\ \\text{cm}$$",
        "The diameter of the base is $2$ cm — option (A).",
        "The question asks for the **diameter**; stopping at $r = 1$ cm is the mistake the option list is waiting for.",
      ),
    },
    as: {
      question:
        "$14$ চে.মি. উচ্চতাৰ এটা সমবৃত্তভূমিক বেলনৰ বক্ৰ পৃষ্ঠকালি $88\\ \\text{cm}^2$। ইয়াৰ ভূমিৰ ব্যাস হ'ল",
      options: ["$2$ চে.মি.", "$3$ চে.মি.", "$4$ চে.মি.", "$6$ চে.মি."],
      explanation: sol(
        "as",
        "$h = 14\\ \\text{cm}$, CSA $= 88\\ \\text{cm}^2$।",
        "$$2\\pi r h = 88 \\implies 2\\times\\frac{22}{7}\\times r\\times 14 = 88$$\n\n$$88r = 88 \\implies r = 1\\ \\text{cm}$$\n\n$$d = 2r = 2\\ \\text{cm}$$",
        "ভূমিৰ ব্যাস $2$ চে.মি. — বিকল্প (A)।",
        "প্ৰশ্নটোত **ব্যাস** বিচৰা হৈছে; $r = 1$ চে.মি. তে ৰৈ যোৱাটোৱেই বিকল্প তালিকাখনে অপেক্ষা কৰি থকা ভুলটো।",
      ),
    },
  },
];
