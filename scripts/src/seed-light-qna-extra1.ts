/**
 * One-off seed: "Extra QnA Part 1" — 5 long-answer numerical/conceptual
 * questions (Light – Reflection and Refraction, Class X), in English and
 * Assamese, written into the `qa` collection for chapterId "phys-x-c01".
 *
 * Mirrors the exact field shape the admin's content.ts POST handler writes
 * (title/content + legacy question/answer mirrors) so existing readers keep
 * working. Images for Q86 were pre-uploaded via upload-light-qna-images.ts.
 *
 * AUTH: set GOOGLE_APPLICATION_CREDENTIALS to the service-account JSON path.
 */
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "true-concept-353c9";
const CHAPTER_ID = "phys-x-c01";
const BATCH_LABEL = "Extra QnA Part 1";

if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
    ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8")))
    : applicationDefault();
  initializeApp({ credential, projectId: PROJECT_ID });
  console.log(`→ Connecting to LIVE Firestore project: ${PROJECT_ID}`);
}

const db = getFirestore();

const IMG_A = "/api/storage/objects/d0abd98f-a1b9-4cb9-9222-ae127a30a8b8";
const IMG_B = "/api/storage/objects/879da249-eb63-45ac-8b06-a25a7da2a1ee";

interface QaInput {
  title: string;
  content: string;
}

const englishQa: QaInput[] = [
  {
    title: `${BATCH_LABEL} — Q82. Needle in front of a convex mirror`,
    content: `**Question:** A 4.5 cm needle is placed 12 cm away from a convex mirror of focal length 15 cm. Give the location of the image and magnification. Describe what happens to the image as the needle is moved farther from the mirror.

*(2014/2015 — 3 Marks)*

**Solution**

Given: object distance $u = -12\\text{ cm}$, focal length $f = +15\\text{ cm}$ (convex mirror).

Using the mirror formula:
$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
$$\\frac{1}{15} = \\frac{1}{v} + \\frac{1}{-12} \\;\\Rightarrow\\; \\frac{1}{v} = \\frac{1}{15} + \\frac{1}{12} = \\frac{4+5}{60} = \\frac{9}{60}$$
$$v = \\frac{60}{9} = \\frac{20}{3} \\approx 6.66\\text{ cm}$$

So the image is formed <span style="color:#2563eb"><strong>6.66 cm behind the mirror</strong></span>.

Magnification:
$$m = \\frac{-v}{u} = \\frac{-6.66}{-12}$$

<span style="color:#16a34a"><u><strong>m = 0.55</strong></u></span>

As the needle is moved farther from the mirror, the image keeps **shrinking (gets more diminished)** and moves closer to the focus — as the object distance approaches infinity, the image size approaches zero and its position approaches the focal point ($v \\to f = 15$ cm).`,
  },
  {
    title: `${BATCH_LABEL} — Q83. Snell's law & n_AB vs n_BA`,
    content: `**Question:** (a) State Snell's Law. If $n_{ab}$ is the refractive index of medium 'b' with respect to 'a' and $n_{ba}$ is the refractive index of medium 'a' with respect to medium 'b', prove that $n_{ab} \\times n_{ba} = 1$.
(b) If the refractive index of medium A with respect to medium B is 4/5, then find the refractive index of medium B with respect to medium A.

*(2012/2015 — 3 Marks)*

**Solution**

**(a) Snell's Law:** The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant, for light of a given colour and for a given pair of media.

$$n_{ab} = \\frac{n_a}{n_b}, \\qquad n_{ba} = \\frac{n_b}{n_a}$$
$$n_{ab} \\times n_{ba} = \\frac{n_a}{n_b} \\times \\frac{n_b}{n_a} = 1$$

<u><strong>Hence proved.</strong></u>

**(b)**
$$n_{AB} = \\frac{4}{5} = \\frac{n_A}{n_B}$$
$$n_{BA} = \\frac{n_B}{n_A} = \\frac{5}{4} = 1.25$$

<span style="color:#16a34a"><u><strong>n_BA = 1.25</strong></u></span>`,
  },
  {
    title: `${BATCH_LABEL} — Q84. Convex lens — object distance & magnification`,
    content: `**Question:** A convex lens is of focal length 30 cm. Calculate at what distance should the object be placed from the lens so that it forms an image at 60 cm on the other side of the lens. Find the magnification produced by the lens in this case.

*(2014/2015 — 3 Marks)*

**Solution**

Focal length of lens $= +30$ cm

$$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$$
$$\\frac{1}{u} = \\frac{1}{v} - \\frac{1}{f} = \\frac{1}{60} - \\frac{1}{30} = \\frac{1-2}{60} = \\frac{-1}{60}$$
$$u = -60\\text{ cm}$$

So the object distance should be <span style="color:#2563eb"><strong>60 cm</strong></span>.

$$m = \\frac{v}{u} = \\frac{60}{-60} = -1$$

<span style="color:#16a34a"><u><strong>m = -1</strong></u></span>

Height of image is the same as that of the object (only inverted).`,
  },
  {
    title: `${BATCH_LABEL} — Q85. Refractive index of kerosene & glass slab`,
    content: `**Question:** (a) "The refractive index of kerosene is 1.44." What is meant by this statement?
(b) A ray of light strikes a glass slab at an angle of incidence equal to 30°. Find the refractive index of glass given that the angle of refraction is 19.5° (take $\\sin 19.5° = \\tfrac{1}{3}$ and $\\sin 30° = \\tfrac{1}{2}$).

*(2014/2015 — 3 Marks)*

**Solution**

**(a)** The refractive index of kerosene is 1.44. It means that the speed of light in air is 1.44 times the speed of light in kerosene.

**(b)** Angle of incidence $i = 30°$, Angle of refraction $r = 19.5°$

According to the law of refraction, $\\dfrac{\\sin i}{\\sin r} =$ constant (the refractive index of glass)

$$n = \\frac{\\sin 30°}{\\sin 19.5°} = \\frac{1/2}{1/3} = \\frac{3}{2} = 1.5$$

<span style="color:#16a34a"><u><strong>Refractive index of glass = 1.5</strong></u></span>`,
  },
  {
    title: `${BATCH_LABEL} — Q86. Half-covered convex lens — ray diagrams`,
    content: `**Question:** One half of a convex lens is covered with black paper.
(a) Show the formation of image of an object placed at $2F_1$ of such a covered lens, with the help of a ray diagram. Mention the position and nature of the image.
(b) Draw the ray diagram for the same object at the same position in front of the same lens, now uncovered. Will there be any difference in the image obtained in the two cases? Give reason for your answer.

*(2014/2015 — 3 Marks)*

**Solution**

**(a)**
<img src="${IMG_A}" alt="Ray diagram: half-covered convex lens, image at 2F2" style="width:100%;max-width:600px;display:block;margin:0 auto;" />

The image is formed at <span style="color:#2563eb"><strong>2F₂</strong></span> and is <u><strong>real and inverted</strong></u>.

**(b)**
<img src="${IMG_B}" alt="Ray diagram: fully uncovered convex lens, image at 2F2" style="width:100%;max-width:600px;display:block;margin:0 auto;" />

The image is again formed at **2F₂, real and inverted** — but it is <span style="color:#16a34a"><strong>more intense and bright</strong></span> than the image formed by the half-covered lens. This is because the covered half of the lens does not allow enough light to pass through to form the image (only the uncovered half refracts light).`,
  },
];

const assameseQa: QaInput[] = [
  {
    title: `${BATCH_LABEL} — Q82. উত্তল দৰ্পণৰ সমুখত চুঁচী`,
    content: `**প্রশ্ন:** 15 cm ফোকাস দূরত্বৰ উত্তল দৰ্পণৰপরা 12 cm দূরত্বত 4.5 cm দীঘল এটা চুঁচী থোৱা হৈছে। প্রতিবিম্বৰ স্থান আৰু বিবৰ্ধন নির্ণয় কৰক। চুঁচীটো দৰ্পণৰপরা আঁতরাই থ'লে প্রতিবিম্বৰ কি পরিবর্তন হয় বর্ণনা কৰক।

*(2014/2015 — 3 নম্বর)*

**সমাধান**

দিয়া আছে: বস্তু দূরত্ব $u = -12\\text{ cm}$, ফোকাস দূরত্ব $f = +15\\text{ cm}$ (উত্তল দৰ্পণ)।

দৰ্পণ সূত্র ব্যবহাৰ কৰি:
$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
$$\\frac{1}{15} = \\frac{1}{v} + \\frac{1}{-12} \\;\\Rightarrow\\; \\frac{1}{v} = \\frac{1}{15} + \\frac{1}{12} = \\frac{9}{60}$$
$$v = \\frac{20}{3} \\approx 6.66\\text{ cm}$$

সেয়েহে প্রতিবিম্বটো <span style="color:#2563eb"><strong>দৰ্পণৰ পিছফালে 6.66 cm দূরত্বত</strong></span> গঠন হয়।

বিবৰ্ধন:
$$m = \\frac{-v}{u} = \\frac{-6.66}{-12}$$

<span style="color:#16a34a"><u><strong>m = 0.55</strong></u></span>

চুঁচীটো দৰ্পণৰপরা আঁতরাই থ'লে, প্রতিবিম্ব **আৰু সৰু (সংকুচিত) হ'বলৈ ধরে** আৰু ফোকাসৰ ওচরলৈ আগবাঢ়ে — বস্তু দূরত্ব অনন্তলৈ গ'লে প্রতিবিম্বৰ আকাৰ শূন্যৰ ওচৰলৈ যায় আৰু ইয়াৰ স্থান ফোকাস বিন্দুৰ ($v \\to f = 15$ cm) ওচরলৈ যায়।`,
  },
  {
    title: `${BATCH_LABEL} — Q83. স্নেলৰ নিয়ম আৰু n_AB বনাম n_BA`,
    content: `**প্রশ্ন:** (a) স্নেলৰ নিয়ম কথন কৰক। $n_{ab}$ যদি 'b' মাধ্যমৰ 'a' ৰ প্রতি প্রতিসরাংক আৰু $n_{ba}$ যদি 'a' মাধ্যমৰ 'b' ৰ প্রতি প্রতিসরাংক হয়, তেন্তে প্রমাণ কৰক $n_{ab} \\times n_{ba} = 1$।
(b) যদি A মাধ্যমৰ B ৰ প্রতি প্রতিসরাংক 4/5, তেন্তে B মাধ্যমৰ A ৰ প্রতি প্রতিসরাংক নির্ণয় কৰক।

*(2012/2015 — 3 নম্বর)*

**সমাধান**

**(a) স্নেলৰ নিয়ম:** একে বর্ণৰ আলোক আৰু একে যোৰ মাধ্যমৰ বাবে, আপতন কোণৰ sine আৰু প্রতিসরণ কোণৰ sine ৰ অনুপাত এক ধ্রুৱক হয়।

$$n_{ab} = \\frac{n_a}{n_b}, \\qquad n_{ba} = \\frac{n_b}{n_a}$$
$$n_{ab} \\times n_{ba} = \\frac{n_a}{n_b} \\times \\frac{n_b}{n_a} = 1$$

<u><strong>প্রমাণিত হ'ল।</strong></u>

**(b)**
$$n_{AB} = \\frac{4}{5} = \\frac{n_A}{n_B}$$
$$n_{BA} = \\frac{n_B}{n_A} = \\frac{5}{4} = 1.25$$

<span style="color:#16a34a"><u><strong>n_BA = 1.25</strong></u></span>`,
  },
  {
    title: `${BATCH_LABEL} — Q84. উত্তল লেন্স — বস্তু দূরত্ব আৰু বিবৰ্ধন`,
    content: `**প্রশ্ন:** 30 cm ফোকাস দূরত্বৰ এটা উত্তল লেন্স আছে। লেন্সৰ আনফালে 60 cm দূরত্বত প্রতিবিম্ব গঠন হ'বৰ বাবে বস্তুটো লেন্সৰপরা কিমান দূরত্বত থ'ব লাগিব নির্ণয় কৰক। এই ক্ষেত্রত লেন্সে সৃষ্টি কৰা বিবৰ্ধন নির্ণয় কৰক।

*(2014/2015 — 3 নম্বর)*

**সমাধান**

লেন্সৰ ফোকাস দূরত্ব $= +30$ cm

$$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$$
$$\\frac{1}{u} = \\frac{1}{v} - \\frac{1}{f} = \\frac{1}{60} - \\frac{1}{30} = \\frac{1-2}{60} = \\frac{-1}{60}$$
$$u = -60\\text{ cm}$$

সেয়েহে বস্তুটো লেন্সৰপরা <span style="color:#2563eb"><strong>60 cm দূরত্বত</strong></span> থ'ব লাগিব।

$$m = \\frac{v}{u} = \\frac{60}{-60} = -1$$

<span style="color:#16a34a"><u><strong>m = -1</strong></u></span>

প্রতিবিম্বৰ উচ্চতা বস্তুৰ উচ্চতাৰ সমান (কেৱল উলোটা)।`,
  },
  {
    title: `${BATCH_LABEL} — Q85. কেৰাচিন আৰু কাঁচ স্লাবৰ প্রতিসরাংক`,
    content: `**প্রশ্ন:** (a) "কেৰাচিনৰ প্রতিসরাংক 1.44।" এই বিবৃতিৰ অর্থ কি?
(b) এটা আলোক ৰশ্মি 30° আপতন কোণত কাঁচ স্লাবত আপতিত হয়। প্রতিসরণ কোণ 19.5° হ'লে কাঁচৰ প্রতিসরাংক নির্ণয় কৰক ($\\sin 19.5° = \\tfrac{1}{3}$ আৰু $\\sin 30° = \\tfrac{1}{2}$ লওক)।

*(2014/2015 — 3 নম্বর)*

**সমাধান**

**(a)** কেৰাচিনৰ প্রতিসরাংক 1.44 ৰ অর্থ হ'ল বাতাসত আলোকৰ বেগ কেৰাচিনত আলোকৰ বেগৰ 1.44 গুণ।

**(b)** আপতন কোণ $i = 30°$, প্রতিসরণ কোণ $r = 19.5°$

প্রতিসরণৰ নিয়ম অনুসরি, $\\dfrac{\\sin i}{\\sin r} =$ ধ্রুৱক (কাঁচৰ প্রতিসরাংক)

$$n = \\frac{\\sin 30°}{\\sin 19.5°} = \\frac{1/2}{1/3} = \\frac{3}{2} = 1.5$$

<span style="color:#16a34a"><u><strong>কাঁচৰ প্রতিসরাংক = 1.5</strong></u></span>`,
  },
  {
    title: `${BATCH_LABEL} — Q86. আধা ঢাকি দিয়া উত্তল লেন্স — ৰশ্মি-চিত্র`,
    content: `**প্রশ্ন:** এটা উত্তল লেন্সৰ আধা ভাগ ক'লা কাগজেৰে ঢাকি দিয়া হৈছে।
(a) ঢাকি দিয়া লেন্সটোৰ সমুখত $2F_1$ ত থোৱা বস্তুৰ প্রতিবিম্ব ৰশ্মি-চিত্ৰৰ সহায়ত দেখুৱাওক। প্রতিবিম্বৰ স্থান আৰু প্রকৃতি উল্লেখ কৰক।
(b) একে বস্তু একে স্থানতে থওক, কিন্তু এইবাৰ লেন্সটো নুঢাকি। দুয়োটা ক্ষেত্রত পোৱা প্রতিবিম্বৰ মাজত কোনো পার্থক্য থাকিব নেকি? কারণ দিয়ক।

*(2014/2015 — 3 নম্বর)*

**সমাধান**

**(a)**
<img src="${IMG_A}" alt="আধা ঢাকি দিয়া উত্তল লেন্সৰ ৰশ্মি-চিত্র, প্রতিবিম্ব 2F2 ত" style="width:100%;max-width:600px;display:block;margin:0 auto;" />

প্রতিবিম্বটো <span style="color:#2563eb"><strong>2F₂ ত</strong></span> গঠন হয় আৰু ই <u><strong>বাস্তৱ আৰু উলোটা</strong></u>।

**(b)**
<img src="${IMG_B}" alt="সম্পূর্ণ মুকলি উত্তল লেন্সৰ ৰশ্মি-চিত্র, প্রতিবিম্ব 2F2 ত" style="width:100%;max-width:600px;display:block;margin:0 auto;" />

প্রতিবিম্বটো একেইদৰে **2F₂ ত গঠন হয়, বাস্তৱ আৰু উলোটা** — কিন্তু আধা ঢাকি দিয়া লেন্সৰ প্রতিবিম্বতকৈ ই <span style="color:#16a34a"><strong>অধিক তীব্র আৰু উজ্জ্বল</strong></span>। ইয়াৰ কারণ হ'ল ঢাকি দিয়া লেন্সে প্রতিবিম্ব গঠনৰ বাবে পর্যাপ্ত আলোক যাবলৈ নিদিয়ে (লেন্সৰ মাত্র আধাভাগেহে আলোক প্রতিসরণ কৰে)।`,
  },
];

async function run() {
  const col = db.collection("qa");

  // Start ordering after whatever Q&A already exists for this chapter.
  const existing = await col.where("chapterId", "==", CHAPTER_ID).get();
  let nextOrder = 1 + existing.docs.reduce((max, d) => Math.max(max, (d.data().order as number) ?? 0), 0);

  const all = [...englishQa, ...assameseQa];
  const batch = db.batch();
  for (const qa of all) {
    const ref = col.doc();
    batch.set(ref, {
      chapterId: CHAPTER_ID,
      title: qa.title,
      content: qa.content,
      question: qa.title,
      answer: qa.content,
      explanation: "",
      youtubeId: null,
      youtubeIds: [],
      isImportant: false,
      order: nextOrder++,
      createdAt: new Date(),
    });
  }
  await batch.commit();

  console.log(`✓ Seeded ${all.length} Q&A entries into chapter "${CHAPTER_ID}" (order ${nextOrder - all.length}-${nextOrder - 1})`);
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exitCode = 1;
});
