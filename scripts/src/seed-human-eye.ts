/**
 * One-off seed for the Human Eye experiment (Class IX Physics).
 *
 * Writes a single document to `experiments` collection in your live Firestore.
 * Idempotent: if an experiment with type "human-eye" already exists, it UPDATES
 * (so you can safely re-run after fixing any typo here).
 *
 * AUTHENTICATION — choose ONE of:
 *
 *   1. Service account env var (recommended for CI / one-off):
 *      $env:TRUE_CONCEPT_SERVICE_KEY = "<base64-encoded service-account JSON>"
 *      npx tsx scripts/src/seed-human-eye.ts
 *
 *   2. Application Default Credentials (your local gcloud login):
 *      gcloud auth application-default login
 *      $env:GOOGLE_CLOUD_PROJECT = "true-concept-353c9"
 *      npx tsx scripts/src/seed-human-eye.ts
 *
 *   3. Service account JSON file path:
 *      $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
 *      npx tsx scripts/src/seed-human-eye.ts
 *
 * Local emulator mode:
 *      $env:FIRESTORE_EMULATOR_HOST = "localhost:8090"
 *      $env:GCLOUD_PROJECT = "demo-trueconcept"
 *      npx tsx scripts/src/seed-human-eye.ts
 */

import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "true-concept-353c9";

if (getApps().length === 0) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "demo-trueconcept" });
    console.log(`→ Connecting to LOCAL emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
  } else {
    const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
      ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8")))
      : applicationDefault();
    initializeApp({ credential, projectId: PROJECT_ID });
    console.log(`→ Connecting to LIVE Firestore project: ${PROJECT_ID}`);
  }
}

const db = getFirestore();

// ─── The experiment document ─────────────────────────────────────────────────
const humanEye = {
  subject: "Physics",
  classLevel: "Class IX",
  difficulty: "medium",
  type: "human-eye",
  title: "Human Eye — Structure, Accommodation and Defects",
  objective:
    "Explore the anatomy of the human eye, understand how images are formed on the retina, study accommodation (lens-thickness adjustment for near and distant objects), and investigate the two main vision defects — myopia and hypermetropia — together with their correction using concave and convex lenses.",
  theory:
    "The human eye is a living optical instrument. Light enters through the cornea, passes through the pupil, is refracted by the crystalline lens, and converges to form a real, inverted, diminished image on the retina. The brain interprets the inverted image as upright.\n\n" +
    "Key parts and their functions:\n" +
    "• Cornea — transparent dome at the front; responsible for ~67% of the eye's focusing power.\n" +
    "• Iris and Pupil — the coloured ring and its central opening control the amount of light entering the eye (dilates in dim light, contracts in bright light).\n" +
    "• Crystalline Lens — a flexible biconvex lens; changes thickness to fine-tune focus.\n" +
    "• Ciliary Muscles — contract to make the lens thicker (near vision) or relax to make it thinner (distant vision). This adjustment is called ACCOMMODATION.\n" +
    "• Aqueous Humor — clear watery fluid between the cornea and the lens.\n" +
    "• Vitreous Humor — clear jelly-like fluid filling the back chamber.\n" +
    "• Retina — light-sensitive layer with rod cells (low-light vision) and cone cells (colour vision). The image is formed here.\n" +
    "• Yellow Spot (Macula / Fovea) — the centre of sharpest vision; highest density of cones.\n" +
    "• Blind Spot — region where the optic nerve exits; no photoreceptors, so images falling here are not seen.\n" +
    "• Optic Nerve — carries the visual signal from the retina to the brain.\n\n" +
    "Lens formula: 1/v − 1/u = 1/f.   Power of a lens: P = 1/f (in metres), measured in dioptres (D).\n\n" +
    "Range of vision in a normal eye — Near point ≈ 25 cm, Far point = infinity.\n\n" +
    "Defects of vision:\n" +
    "• MYOPIA (short-sightedness): the eyeball is elongated or the lens is too powerful, so the image of a distant object forms IN FRONT of the retina. Distant objects appear blurred. Corrected using a CONCAVE (diverging) lens of suitable negative power, which pushes the focal point back onto the retina.\n" +
    "• HYPERMETROPIA (long-sightedness): the eyeball is too short or the lens is too weak, so the image of a near object forms BEHIND the retina. Near objects appear blurred. Corrected using a CONVEX (converging) lens of suitable positive power, which brings the focal point forward onto the retina.",
  apparatus:
    "Detailed cross-sectional model of the human eye\n" +
    "Object (illuminated arrow / scene)\n" +
    "Concave lens of variable power (for myopia)\n" +
    "Convex lens of variable power (for hypermetropia)\n" +
    "Optical ray-tracing tool\n" +
    "Comparative patient-view panel\n" +
    "(All simulated in this Virtual Lab)",
  procedure:
    "1. Open the EYE EXPLORER tab. Tap on each labelled part of the eye to read its function in the side panel.\n" +
    "2. Toggle Inside/Outside view to see the cutaway with all internal parts and labels.\n" +
    "3. Turn Rays On. Use the Object Distance slider to move the object near and far — observe how the LENS THICKNESS changes (thicker for near, thinner for far) and how the CILIARY MUSCLES read 'Contracted' or 'Relaxed'.\n" +
    "4. Read the live LENS FORMULA card to see f update with object distance — this is accommodation in action.\n" +
    "5. Open the MYOPIA tab. Increase the Eyeball Length or Lens Power. Notice the rays converge IN FRONT of the retina — distant objects in the Patient View become blurred.\n" +
    "6. Press 'Apply Concave Lens'. Watch the lens appear in front of the eye, the rays diverge slightly, and the focal point moves BACK onto the retina. The blurred view becomes sharp. Note the required power P (negative dioptres).\n" +
    "7. Open the HYPERMETROPIA tab. Decrease the Eyeball Length or Lens Power. The rays converge BEHIND the retina — near objects in the Patient View become blurred.\n" +
    "8. Press 'Apply Convex Lens'. Watch the lens appear, the rays converge sooner, and the focal point moves FORWARD onto the retina. Note the required power P (positive dioptres).\n" +
    "9. Attempt the quiz at the bottom to test your understanding of lens choice, image location, and accommodation.",
  expectedResult:
    "In a normal eye, the image always forms ON the retina — real, inverted, diminished. " +
    "In MYOPIA, the image of a distant object forms IN FRONT of the retina, so the Patient View blurs. A concave lens of suitable negative power restores focus onto the retina and the view becomes clear. " +
    "In HYPERMETROPIA, the image of a near object forms BEHIND the retina, so the Patient View blurs. A convex lens of suitable positive power restores focus onto the retina and the view becomes clear. " +
    "Accommodation thickens the lens for near objects and thins it for distant objects, keeping the image sharp on the retina.",
  explanation:
    "The focusing power of the eye comes mostly from the curved cornea, with fine-tuning done by the variable crystalline lens controlled by the ciliary muscles. The retina is the photo-sensitive screen on which all images must form for clear vision. Any mismatch between the eyeball length and the eye's focusing power leads to a defect: too long → myopia, too short → hypermetropia. Both are corrected by placing a lens of appropriate power in front of the eye so that the combined system once again focuses light precisely on the retina. The sign of the required power tells us the type of lens — negative (diverging, concave) for myopia and positive (converging, convex) for hypermetropia.",
  hints:
    "Remember: myopia → concave (−P), hypermetropia → convex (+P). Power P = 1/f where f is in METRES. A 2 D concave lens has f = −50 cm. The blind spot is where the optic nerve leaves the eye; the yellow spot is where colour vision is sharpest.",
  summary:
    "Image forms on the retina — real, inverted, diminished. Accommodation = ciliary-controlled change in lens thickness. Myopia corrected by concave lens (negative power). Hypermetropia corrected by convex lens (positive power). P = 1/f (m), unit: dioptre (D).",
  createdAt: new Date(),
};

async function run() {
  const col = db.collection("experiments");

  // Idempotency: look up an existing doc with type "human-eye"
  const existing = await col.where("type", "==", "human-eye").limit(1).get();

  if (!existing.empty) {
    const docRef = existing.docs[0].ref;
    // Preserve original createdAt so we don't lie about creation time on update.
    const { createdAt, ...updatable } = humanEye;
    void createdAt;
    await docRef.update(updatable);
    console.log(`✓ UPDATED existing experiment doc: ${docRef.id}`);
    console.log(`  title:      ${humanEye.title}`);
    console.log(`  classLevel: ${humanEye.classLevel}`);
    console.log(`  subject:    ${humanEye.subject}`);
  } else {
    const ref = await col.add(humanEye);
    console.log(`✓ CREATED new experiment doc: ${ref.id}`);
    console.log(`  title:      ${humanEye.title}`);
    console.log(`  classLevel: ${humanEye.classLevel}`);
    console.log(`  subject:    ${humanEye.subject}`);
  }

  console.log("\nStudents on Class IX Physics → Virtual Lab hub should now see the 👁️ Human Eye card.");
  console.log("Assamese version auto-appears when language is toggled (overlay keyed off type=\"human-eye\").");
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exitCode = 1;
});
