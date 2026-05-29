/**
 * Comprehensive seed for TRUE CONCEPT Firestore DB.
 * Idempotent — uses fixed document IDs; re-running overwrites.
 *
 * Usage (against real Firebase project):
 *   FIREBASE_SERVICE_ACCOUNT_KEY=<base64-json> node seed-real-data.mjs
 *
 * Usage (against local emulator):
 *   FIRESTORE_EMULATOR_HOST=localhost:8090 GCLOUD_PROJECT=demo-trueconcept node seed-real-data.mjs
 */
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (getApps().length === 0) {
  const credential = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? cert(JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")))
    : applicationDefault();
  initializeApp({ credential, projectId: process.env.GCLOUD_PROJECT });
}

const db = getFirestore();
const now = Timestamp.now();

// ─────────────────────────────────────────────────────────────────────────────
// USERS (admin)
// ─────────────────────────────────────────────────────────────────────────────

async function seedUsers() {
  await db.collection("users").doc("admin").set({
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator",
    createdAt: now,
  });
  console.log("✓ Users");
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS
// ─────────────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { id: "math-ix",    name: "Mathematics",      classLevels: ["Class IX"],          color: "#1e3a8a", icon: "Calculator",  description: "Algebra, geometry, mensuration and statistics for Class IX." },
  { id: "math-x",    name: "Mathematics",      classLevels: ["Class X"],           color: "#1e3a8a", icon: "Calculator",  description: "Real numbers, quadratics, trigonometry and probability for Class X." },
  { id: "phys-ix",   name: "Physics",          classLevels: ["Class IX"],          color: "#0f766e", icon: "Zap",        description: "Motion, force, gravitation, work, energy and sound." },
  { id: "chem-ix",   name: "Chemistry",        classLevels: ["Class IX"],          color: "#7c2d12", icon: "FlaskConical", description: "Matter, atoms, molecules and the structure of the atom." },
  { id: "bio-ix",    name: "Biology",          classLevels: ["Class IX"],          color: "#14532d", icon: "Leaf",       description: "Cell biology, tissues, diversity of life and natural resources." },
  { id: "phys-x",    name: "Physics",          classLevels: ["Class X"],           color: "#0f766e", icon: "Zap",        description: "Light, electricity, magnetism and sources of energy." },
  { id: "chem-x",    name: "Chemistry",        classLevels: ["Class X"],           color: "#7c2d12", icon: "FlaskConical", description: "Chemical reactions, acids-bases, metals, carbon and periodic table." },
  { id: "bio-x",     name: "Biology",          classLevels: ["Class X"],           color: "#14532d", icon: "Leaf",       description: "Life processes, reproduction, heredity and environment." },
  { id: "sst-ix",    name: "Social Science",   classLevels: ["Class IX"],          color: "#713f12", icon: "Globe",      description: "History, Geography, Political Science and Economics for Class IX." },
  { id: "sst-x",     name: "Social Science",   classLevels: ["Class X"],           color: "#713f12", icon: "Globe",      description: "India and the Contemporary World, Democratic Politics and Economics for Class X." },
  { id: "eng-ix-x",  name: "English",          classLevels: ["Class IX", "Class X"], color: "#312e81", icon: "BookOpen",  description: "Prose, poetry, grammar and writing skills for Class IX & X." },
];

async function seedSubjects() {
  const batch = db.batch();
  for (const s of SUBJECTS) {
    const { id, ...data } = s;
    batch.set(db.collection("subjects").doc(id), { ...data, createdAt: now });
  }
  await batch.commit();
  console.log(`✓ Subjects (${SUBJECTS.length})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTERS  (title, description, medium, order, subjectId, classLevel)
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  // ── Math IX ────────────────────────────────────────────────────────────────
  { id:"math-ix-c01", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:1,  title:"Number Systems",                      description:"Real numbers, irrational numbers and their properties on the number line." },
  { id:"math-ix-c02", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:2,  title:"Polynomials",                          description:"Definition, zeroes, Remainder and Factor theorems." },
  { id:"math-ix-c03", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:3,  title:"Coordinate Geometry",                  description:"Cartesian plane, plotting points and distance." },
  { id:"math-ix-c04", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:4,  title:"Linear Equations in Two Variables",    description:"Equations of the form ax + by + c = 0, graphical representation." },
  { id:"math-ix-c05", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:5,  title:"Introduction to Euclid's Geometry",    description:"Euclid's axioms, postulates and the foundations of geometry." },
  { id:"math-ix-c06", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:6,  title:"Lines and Angles",                     description:"Pairs of angles, parallel lines, transversal and angle sum property." },
  { id:"math-ix-c07", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:7,  title:"Triangles",                            description:"Congruence criteria: SAS, ASA, SSS, RHS and their applications." },
  { id:"math-ix-c08", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:8,  title:"Quadrilaterals",                       description:"Properties of parallelograms, rhombus, rectangle and square." },
  { id:"math-ix-c09", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:9,  title:"Circles",                              description:"Chords, arcs, angles subtended and cyclic quadrilaterals." },
  { id:"math-ix-c10", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:10, title:"Heron's Formula",                      description:"Area of triangles using semi-perimeter; applications to quadrilaterals." },
  { id:"math-ix-c11", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:11, title:"Surface Areas and Volumes",            description:"Cuboid, cube, cylinder, cone, sphere and hemisphere." },
  { id:"math-ix-c12", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:12, title:"Statistics",                           description:"Collection, presentation of data; mean, median and mode." },
  { id:"math-ix-c13", subjectId:"math-ix", classLevel:"Class IX", medium:"Both", order:13, title:"Probability",                          description:"Experimental probability; simple events and their likelihood." },

  // ── Math X ─────────────────────────────────────────────────────────────────
  { id:"math-x-c01",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:1,  title:"Real Numbers",                         description:"Euclid's division lemma, Fundamental Theorem of Arithmetic, irrational numbers." },
  { id:"math-x-c02",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:2,  title:"Polynomials",                          description:"Zeroes, relationship between zeroes and coefficients, division algorithm." },
  { id:"math-x-c03",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:3,  title:"Pair of Linear Equations in Two Variables", description:"Graphical and algebraic methods; substitution, elimination, cross-multiplication." },
  { id:"math-x-c04",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:4,  title:"Quadratic Equations",                  description:"Standard form, factorisation, completing the square, quadratic formula." },
  { id:"math-x-c05",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:5,  title:"Arithmetic Progressions",              description:"General term, sum of n terms and applications." },
  { id:"math-x-c06",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:6,  title:"Triangles",                            description:"Similar triangles, BPT, Pythagoras theorem and its converse." },
  { id:"math-x-c07",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:7,  title:"Coordinate Geometry",                  description:"Distance formula, section formula, area of triangle." },
  { id:"math-x-c08",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:8,  title:"Introduction to Trigonometry",         description:"Trigonometric ratios, identities and complementary angles." },
  { id:"math-x-c09",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:9,  title:"Some Applications of Trigonometry",    description:"Heights and distances using angles of elevation and depression." },
  { id:"math-x-c10",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:10, title:"Circles",                              description:"Tangent to a circle; number of tangents from a point." },
  { id:"math-x-c11",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:11, title:"Areas Related to Circles",             description:"Perimeter and area of a circle, sector, segment." },
  { id:"math-x-c12",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:12, title:"Surface Areas and Volumes",            description:"Combination of solids; conversion of one solid to another." },
  { id:"math-x-c13",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:13, title:"Statistics",                           description:"Mean, median, mode of grouped data; cumulative frequency." },
  { id:"math-x-c14",  subjectId:"math-x",  classLevel:"Class X",  medium:"Both", order:14, title:"Probability",                          description:"Classical definition; theoretical probability of events." },

  // ── Physics IX ─────────────────────────────────────────────────────────────
  { id:"phys-ix-c01", subjectId:"phys-ix", classLevel:"Class IX", medium:"Both", order:1,  title:"Motion",                               description:"Distance, displacement, speed, velocity, acceleration, equations of motion." },
  { id:"phys-ix-c02", subjectId:"phys-ix", classLevel:"Class IX", medium:"Both", order:2,  title:"Force and Laws of Motion",             description:"Newton's three laws, inertia, momentum, impulse." },
  { id:"phys-ix-c03", subjectId:"phys-ix", classLevel:"Class IX", medium:"Both", order:3,  title:"Gravitation",                          description:"Universal gravitation, free fall, mass vs weight, pressure, Archimedes' principle." },
  { id:"phys-ix-c04", subjectId:"phys-ix", classLevel:"Class IX", medium:"Both", order:4,  title:"Work, Energy and Power",               description:"Work, kinetic and potential energy, conservation of energy, power." },
  { id:"phys-ix-c05", subjectId:"phys-ix", classLevel:"Class IX", medium:"Both", order:5,  title:"Sound",                                description:"Nature of sound, wave properties, reflection, resonance, human ear." },

  // ── Chemistry IX ───────────────────────────────────────────────────────────
  { id:"chem-ix-c01", subjectId:"chem-ix", classLevel:"Class IX", medium:"Both", order:1,  title:"Matter in Our Surroundings",           description:"States of matter, physical properties, interconversion, evaporation." },
  { id:"chem-ix-c02", subjectId:"chem-ix", classLevel:"Class IX", medium:"Both", order:2,  title:"Is Matter Around Us Pure?",            description:"Mixtures, solutions, suspensions, colloids, separation techniques." },
  { id:"chem-ix-c03", subjectId:"chem-ix", classLevel:"Class IX", medium:"Both", order:3,  title:"Atoms and Molecules",                  description:"Laws of chemical combination, atomic mass, molecules, mole concept." },
  { id:"chem-ix-c04", subjectId:"chem-ix", classLevel:"Class IX", medium:"Both", order:4,  title:"Structure of the Atom",                description:"Subatomic particles, Thomson, Rutherford, Bohr models, valence electrons." },

  // ── Biology IX ─────────────────────────────────────────────────────────────
  { id:"bio-ix-c01",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:1,  title:"The Fundamental Unit of Life",         description:"Cell structure, organelles, differences between plant and animal cells." },
  { id:"bio-ix-c02",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:2,  title:"Tissues",                              description:"Plant tissues (meristematic, permanent) and animal tissues (epithelial, connective, muscular, nervous)." },
  { id:"bio-ix-c03",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:3,  title:"Diversity in Living Organisms",        description:"Classification: five kingdoms, binomial nomenclature, major phyla." },
  { id:"bio-ix-c04",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:4,  title:"Why Do We Fall Ill?",                  description:"Health, disease, infectious and non-infectious diseases, prevention." },
  { id:"bio-ix-c05",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:5,  title:"Natural Resources",                    description:"Air, water, soil, biogeochemical cycles, ozone layer." },
  { id:"bio-ix-c06",  subjectId:"bio-ix",  classLevel:"Class IX", medium:"Both", order:6,  title:"Improvement in Food Resources",        description:"Crop production, crop variety improvement, animal husbandry." },

  // ── Physics X ──────────────────────────────────────────────────────────────
  { id:"phys-x-c01",  subjectId:"phys-x",  classLevel:"Class X",  medium:"Both", order:1,  title:"Light – Reflection and Refraction",    description:"Laws of reflection/refraction, mirrors, lenses, lens formula, power." },
  { id:"phys-x-c02",  subjectId:"phys-x",  classLevel:"Class X",  medium:"Both", order:2,  title:"The Human Eye and the Colourful World", description:"Structure of eye, defects of vision, dispersion, atmospheric refraction." },
  { id:"phys-x-c03",  subjectId:"phys-x",  classLevel:"Class X",  medium:"Both", order:3,  title:"Electricity",                          description:"Ohm's law, resistance, series/parallel circuits, electrical energy and power." },
  { id:"phys-x-c04",  subjectId:"phys-x",  classLevel:"Class X",  medium:"Both", order:4,  title:"Magnetic Effects of Electric Current", description:"Magnetic field, Fleming's rules, electric motor, electromagnetic induction, generator." },
  { id:"phys-x-c05",  subjectId:"phys-x",  classLevel:"Class X",  medium:"Both", order:5,  title:"Sources of Energy",                   description:"Conventional and non-conventional sources, fossil fuels, solar, wind, nuclear energy." },

  // ── Chemistry X ────────────────────────────────────────────────────────────
  { id:"chem-x-c01",  subjectId:"chem-x",  classLevel:"Class X",  medium:"Both", order:1,  title:"Chemical Reactions and Equations",     description:"Types of chemical reactions, balancing equations, oxidation and reduction." },
  { id:"chem-x-c02",  subjectId:"chem-x",  classLevel:"Class X",  medium:"Both", order:2,  title:"Acids, Bases and Salts",               description:"Properties, neutralisation, pH, salts and their preparation." },
  { id:"chem-x-c03",  subjectId:"chem-x",  classLevel:"Class X",  medium:"Both", order:3,  title:"Metals and Non-metals",                description:"Physical and chemical properties, reactivity series, ionic bonding, corrosion." },
  { id:"chem-x-c04",  subjectId:"chem-x",  classLevel:"Class X",  medium:"Both", order:4,  title:"Carbon and Its Compounds",             description:"Covalent bonding, versatile carbon, homologous series, ethanol, ethanoic acid, soaps." },
  { id:"chem-x-c05",  subjectId:"chem-x",  classLevel:"Class X",  medium:"Both", order:5,  title:"Periodic Classification of Elements",  description:"Döbereiner's triads, Newlands' octaves, Mendeleev's table, modern periodic table." },

  // ── Biology X ──────────────────────────────────────────────────────────────
  { id:"bio-x-c01",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:1,  title:"Life Processes",                       description:"Nutrition, respiration, transportation and excretion in plants and animals." },
  { id:"bio-x-c02",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:2,  title:"Control and Coordination",             description:"Nervous system, reflex action, hormones, endocrine system in plants and animals." },
  { id:"bio-x-c03",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:3,  title:"How do Organisms Reproduce?",          description:"Asexual and sexual reproduction, reproductive systems, reproductive health." },
  { id:"bio-x-c04",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:4,  title:"Heredity and Evolution",               description:"Mendel's laws, sex determination, evolution, Darwin's theory, human evolution." },
  { id:"bio-x-c05",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:5,  title:"Our Environment",                      description:"Ecosystem, food chains, ozone depletion, waste management." },
  { id:"bio-x-c06",   subjectId:"bio-x",   classLevel:"Class X",  medium:"Both", order:6,  title:"Management of Natural Resources",      description:"Conservation of forests, water, coal, petroleum and sustainable development." },
];

async function seedChapters() {
  const batches = [];
  let batch = db.batch();
  let count = 0;
  for (const c of CHAPTERS) {
    const { id, ...data } = c;
    batch.set(db.collection("chapters").doc(id), { ...data, createdAt: now });
    count++;
    if (count % 400 === 0) { batches.push(batch); batch = db.batch(); }
  }
  batches.push(batch);
  for (const b of batches) await b.commit();
  console.log(`✓ Chapters (${CHAPTERS.length})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTES  (Markdown content per chapter)
// ─────────────────────────────────────────────────────────────────────────────

const NOTES = [
  // ── Motion (Physics IX) ───────────────────────────────────────────────────
  { id:"note-phys-ix-c01", chapterId:"phys-ix-c01", title:"Motion – Complete Notes", content:`
# Motion

## Key Definitions

| Term | Definition |
|------|-----------|
| **Distance** | Total path length covered (scalar) |
| **Displacement** | Shortest distance from start to end with direction (vector) |
| **Speed** | Distance ÷ Time (scalar, SI unit: m/s) |
| **Velocity** | Displacement ÷ Time (vector, SI unit: m/s) |
| **Acceleration** | Change in velocity ÷ Time (vector, SI unit: m/s²) |

## Equations of Uniformly Accelerated Motion

$$v = u + at$$

$$s = ut + \\frac{1}{2}at^2$$

$$v^2 = u^2 + 2as$$

$$s_n = u + \\frac{a(2n-1)}{2}$$

> **u** = initial velocity, **v** = final velocity, **a** = acceleration, **t** = time, **s** = displacement

## Graphical Representation

- **Distance–Time graph**: Slope = speed. Straight line → uniform motion. Curve → non-uniform.
- **Velocity–Time graph**: Slope = acceleration. Area under graph = displacement.

## Uniform vs Non-Uniform Motion

- **Uniform motion**: Equal distances in equal time intervals (constant speed).
- **Non-uniform motion**: Unequal distances in equal time intervals.

## Circular Motion

- Object moves in a circle at constant speed but velocity continuously changes (direction changes).
- It is **accelerated motion** even at constant speed.

## Important Points

- Distance ≥ |Displacement|
- For a round trip, displacement = 0 but distance > 0
- Average speed = Total distance / Total time
- Average velocity = Total displacement / Total time
`.trim() },

  // ── Force and Laws of Motion ───────────────────────────────────────────────
  { id:"note-phys-ix-c02", chapterId:"phys-ix-c02", title:"Force and Laws of Motion – Complete Notes", content:`
# Force and Laws of Motion

## Newton's Laws

### First Law (Law of Inertia)
Every object continues in its state of rest or uniform motion in a straight line unless acted upon by an external net force.

> **Inertia** is the tendency of an object to resist change in its state of motion. It depends on **mass**.

### Second Law
$$F = ma$$

The net force on an object equals its mass multiplied by its acceleration.

- **1 Newton (N)** = force that gives 1 kg an acceleration of 1 m/s²
- **Momentum** $p = mv$  (unit: kg·m/s)
- Second law restated: $F = \\frac{\\Delta p}{\\Delta t}$

### Third Law
*Every action has an equal and opposite reaction acting on different objects.*

$$F_{AB} = -F_{BA}$$

## Conservation of Momentum

In the absence of external forces, total momentum of a system remains constant.

$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$

## Key Terms

| Term | Explanation |
|------|------------|
| **Inertia of rest** | Tendency to stay at rest |
| **Inertia of motion** | Tendency to continue moving |
| **Impulse** | F × t = change in momentum |

## Common Examples

- Seat belts work because of inertia (1st law)
- Recoil of a gun (3rd law)
- Rocket propulsion (3rd law + conservation of momentum)
`.trim() },

  // ── Gravitation ───────────────────────────────────────────────────────────
  { id:"note-phys-ix-c03", chapterId:"phys-ix-c03", title:"Gravitation – Complete Notes", content:`
# Gravitation

## Universal Law of Gravitation (Newton)

$$F = G \\frac{m_1 m_2}{r^2}$$

- **G** = 6.674 × 10⁻¹¹ N·m²/kg² (Universal gravitational constant)
- Force is attractive, acts along the line joining the two objects.

## Acceleration Due to Gravity (g)

$$g = \\frac{GM}{R^2}$$

- On Earth: **g = 9.8 m/s²** (approx. 10 m/s² for calculations)
- g decreases as you go above or below Earth's surface.

## Free Fall

Object falling under gravity alone (air resistance neglected).

$$h = \\frac{1}{2}gt^2 \\quad v = gt \\quad v^2 = 2gh$$

## Mass vs Weight

| | Mass | Weight |
|-|------|--------|
| **Definition** | Amount of matter | Gravitational force on object |
| **Unit** | kg | N (Newton) |
| **Type** | Scalar | Vector |
| **Varies?** | No | Yes (location changes g) |

$$W = mg$$

## Thrust, Pressure, Buoyancy

- **Pressure** = Force / Area  (unit: Pascal = N/m²)
- **Buoyancy**: Upward force exerted by a fluid on a submerged object.

## Archimedes' Principle

When an object is fully or partially submerged in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced.

## Floatation

Object floats when **density of object ≤ density of fluid**.
`.trim() },

  // ── Work, Energy and Power ─────────────────────────────────────────────────
  { id:"note-phys-ix-c04", chapterId:"phys-ix-c04", title:"Work, Energy and Power – Complete Notes", content:`
# Work, Energy and Power

## Work

$$W = F \\cdot d \\cdot \\cos\\theta$$

- Work is done only when force causes displacement.
- **θ** = angle between force and displacement.
- Unit: **Joule (J)** = N·m
- Work is **zero** when: force ⊥ displacement, or no displacement.

## Energy

Capacity to do work. Unit: **Joule (J)**

### Kinetic Energy (KE)
$$KE = \\frac{1}{2}mv^2$$

### Potential Energy (PE)
$$PE = mgh$$

### Law of Conservation of Energy
Energy can neither be created nor destroyed; it can only be transformed from one form to another. **Total mechanical energy = KE + PE = constant** (in the absence of friction).

## Power

$$P = \\frac{W}{t} = F \\cdot v$$

- Unit: **Watt (W)** = J/s
- 1 **horsepower** (hp) = 746 W
- **1 kWh** = 3.6 × 10⁶ J (commercial unit of energy)

## Work–Energy Theorem

$$W_{net} = \\Delta KE = \\frac{1}{2}mv^2 - \\frac{1}{2}mu^2$$

## Key Points

- A stretched spring / compressed gas has potential energy (elastic PE).
- Running water and wind have kinetic energy → used in hydropower and wind energy.
`.trim() },

  // ── Number Systems ────────────────────────────────────────────────────────
  { id:"note-math-ix-c01", chapterId:"math-ix-c01", title:"Number Systems – Complete Notes", content:`
# Number Systems

## Types of Numbers

$$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$

| Symbol | Set | Examples |
|--------|-----|---------|
| ℕ | Natural numbers | 1, 2, 3, … |
| ℤ | Integers | …−2, −1, 0, 1, 2, … |
| ℚ | Rational numbers | p/q, q ≠ 0; terminating or repeating decimals |
| 𝕀 | Irrational numbers | Non-terminating, non-repeating; e.g. √2, π |
| ℝ | Real numbers | ℚ ∪ 𝕀 |

## Irrational Numbers

- Cannot be expressed as p/q (p, q integers, q ≠ 0).
- Examples: $\\sqrt{2}$, $\\sqrt{3}$, $\\pi$, $e$
- **Proof that √2 is irrational**: assume √2 = p/q in lowest terms → 2q² = p² → p is even → p = 2k → 2q² = 4k² → q² = 2k² → q is even. Contradiction.

## Representing Irrational Numbers on Number Line

Use the **Pythagorean method**: construct right triangles to locate $\\sqrt{2}$, $\\sqrt{3}$, etc.

## Laws of Exponents (Real Numbers)

$$a^m \\cdot a^n = a^{m+n}$$
$$(a^m)^n = a^{mn}$$
$$a^m \\cdot b^m = (ab)^m$$
$$a^0 = 1$$
$$a^{-n} = \\frac{1}{a^n}$$
$$a^{1/n} = \\sqrt[n]{a}$$

## Rationalisation

To rationalise $\\dfrac{1}{\\sqrt{a}+\\sqrt{b}}$, multiply by conjugate $\\dfrac{\\sqrt{a}-\\sqrt{b}}{\\sqrt{a}-\\sqrt{b}}$.

$$\\frac{1}{\\sqrt{2}+1} \\times \\frac{\\sqrt{2}-1}{\\sqrt{2}-1} = \\sqrt{2}-1$$
`.trim() },

  // ── Polynomials (IX) ──────────────────────────────────────────────────────
  { id:"note-math-ix-c02", chapterId:"math-ix-c02", title:"Polynomials – Complete Notes", content:`
# Polynomials

## Definition
An expression of the form $a_n x^n + a_{n-1}x^{n-1} + \\cdots + a_1 x + a_0$ where $a_n \\neq 0$.

- **Degree**: Highest power of variable.
- **Linear**: degree 1 | **Quadratic**: degree 2 | **Cubic**: degree 3.

## Zeroes of a Polynomial
A value **c** such that p(c) = 0.

- A polynomial of degree n has **at most n zeroes**.
- Geometrically: zeroes are the x-intercepts of y = p(x).

## Remainder Theorem
When p(x) is divided by (x − a), the remainder is **p(a)**.

## Factor Theorem
(x − a) is a factor of p(x) if and only if **p(a) = 0**.

## Algebraic Identities (must memorise)

$$(a+b)^2 = a^2 + 2ab + b^2$$
$$(a-b)^2 = a^2 - 2ab + b^2$$
$$(a+b)(a-b) = a^2 - b^2$$
$$(x+a)(x+b) = x^2 + (a+b)x + ab$$
$$(a+b+c)^2 = a^2+b^2+c^2+2ab+2bc+2ca$$
$$(a+b)^3 = a^3+3a^2b+3ab^2+b^3$$
$$(a-b)^3 = a^3-3a^2b+3ab^2-b^3$$
$$a^3+b^3+c^3-3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca)$$
`.trim() },

  // ── Real Numbers (X) ──────────────────────────────────────────────────────
  { id:"note-math-x-c01", chapterId:"math-x-c01", title:"Real Numbers – Complete Notes", content:`
# Real Numbers

## Euclid's Division Lemma
For any two positive integers **a** and **b**:
$$a = bq + r \\quad 0 \\leq r < b$$

Used to find **HCF** by repeated application (Euclid's Division Algorithm).

## Fundamental Theorem of Arithmetic
Every composite number can be expressed as a **unique product of prime numbers** (order doesn't matter).

$$540 = 2^2 \\times 3^3 \\times 5$$

### HCF and LCM using Prime Factorisation
- **HCF** = product of smallest powers of common prime factors.
- **LCM** = product of greatest powers of all prime factors.
- **HCF × LCM = Product of the two numbers**

## Irrational Numbers
$\\sqrt{p}$ is irrational if **p is a prime number**.

Proof template: assume rational → p/q in lowest form → contradiction → irrational.

## Decimal Expansion

| Type | Example | Nature |
|------|---------|--------|
| Terminating | 7/8 = 0.875 | Denominator has only 2's and 5's |
| Non-terminating repeating | 1/3 = 0.333… | Rational |
| Non-terminating non-repeating | √2, π | Irrational |
`.trim() },

  // ── Quadratic Equations (X) ───────────────────────────────────────────────
  { id:"note-math-x-c04", chapterId:"math-x-c04", title:"Quadratic Equations – Complete Notes", content:`
# Quadratic Equations

## Standard Form
$$ax^2 + bx + c = 0, \\quad a \\neq 0$$

## Methods of Solution

### 1. Factorisation
Split the middle term: find p, q such that p + q = b and p × q = ac.

### 2. Completing the Square
$$x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0 \\Rightarrow \\left(x+\\frac{b}{2a}\\right)^2 = \\frac{b^2-4ac}{4a^2}$$

### 3. Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Discriminant (D)

$$D = b^2 - 4ac$$

| D | Nature of Roots |
|---|----------------|
| D > 0 | Two distinct real roots |
| D = 0 | Two equal (real) roots |
| D < 0 | No real roots |

## Sum and Product of Roots

If α and β are roots:
$$\\alpha + \\beta = -\\frac{b}{a} \\qquad \\alpha \\cdot \\beta = \\frac{c}{a}$$
`.trim() },

  // ── Light – Reflection and Refraction (X) ─────────────────────────────────
  { id:"note-phys-x-c01", chapterId:"phys-x-c01", title:"Light – Reflection and Refraction – Complete Notes", content:`
# Light – Reflection and Refraction

## Reflection

**Laws of Reflection**
1. Angle of incidence (i) = Angle of reflection (r)
2. Incident ray, normal and reflected ray are coplanar.

### Spherical Mirrors

| Term | Meaning |
|------|---------|
| Pole (P) | Centre of mirror surface |
| Centre of Curvature (C) | Centre of the sphere |
| Radius of Curvature (R) | Radius of sphere |
| Principal Focus (F) | Point where parallel rays converge/diverge after reflection |
| Focal length (f) | PF = R/2 |

$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}$$

**Sign convention**: Distances measured from pole. Distances in direction of incident light → positive.

**Magnification**: $m = -\\frac{v}{u} = \\frac{h'}{h}$

## Refraction

**Snell's Law**:
$$n_1 \\sin i = n_2 \\sin r \\quad \\Rightarrow \\quad \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} = n_{21}$$

**Refractive index**: $n = \\frac{c}{v}$ where c = speed of light in vacuum.

### Lenses

| Type | Converging? | f |
|------|------------|---|
| Convex | Yes | Positive |
| Concave | No | Negative |

**Lens formula**: $\\dfrac{1}{v} - \\dfrac{1}{u} = \\dfrac{1}{f}$

**Magnification**: $m = \\dfrac{v}{u}$

**Power of lens**: $P = \\dfrac{1}{f}$ (unit: **dioptre, D**)

- Convex: P > 0 | Concave: P < 0
- Combined power: $P = P_1 + P_2$
`.trim() },

  // ── Electricity (X) ───────────────────────────────────────────────────────
  { id:"note-phys-x-c03", chapterId:"phys-x-c03", title:"Electricity – Complete Notes", content:`
# Electricity

## Electric Current and Charge

$$I = \\frac{Q}{t}$$

- **I** = current (A), **Q** = charge (C), **t** = time (s)
- 1 Coulomb = charge on 6.25 × 10¹⁸ electrons.

## Potential Difference (Voltage)

$$V = \\frac{W}{Q}$$

- Unit: **Volt (V)**. 1 V = 1 J/C.

## Ohm's Law

$$V = IR$$

- Valid at constant temperature.
- **R** = resistance (Ω, ohm).

## Resistance Factors

$$R = \\rho \\frac{L}{A}$$

- **ρ** (resistivity) depends on material; **L** = length; **A** = cross-sectional area.
- Resistance increases with temperature (for conductors).

## Resistors in Series and Parallel

| | Series | Parallel |
|-|--------|---------|
| **Total R** | $R_s = R_1 + R_2 + \\cdots$ | $\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots$ |
| **Current** | Same through all | Splits (I = I₁ + I₂) |
| **Voltage** | Splits (V = V₁ + V₂) | Same across all |

## Electrical Power and Energy

$$P = VI = I^2 R = \\frac{V^2}{R}$$

$$E = Pt = VIt$$

- Unit of energy: **kWh** (commercial). 1 kWh = 3.6 × 10⁶ J.
- **1 unit** of electricity = 1 kWh.

## Heating Effect (Joule's Law)

$$H = I^2 R t$$

Applications: electric heater, iron, toaster, filament bulb, fuse.
`.trim() },

  // ── Chemical Reactions and Equations (X) ──────────────────────────────────
  { id:"note-chem-x-c01", chapterId:"chem-x-c01", title:"Chemical Reactions and Equations – Complete Notes", content:`
# Chemical Reactions and Equations

## Types of Chemical Reactions

### 1. Combination Reaction
Two or more substances combine to form one product.
$$\\text{CaO} + \\text{H}_2\\text{O} \\rightarrow \\text{Ca(OH)}_2$$

### 2. Decomposition Reaction
A single compound breaks into simpler substances.
$$\\text{2FeSO}_4 \\xrightarrow{\\Delta} \\text{Fe}_2\\text{O}_3 + \\text{SO}_2 + \\text{SO}_3$$

### 3. Displacement Reaction
More reactive element displaces less reactive one.
$$\\text{Fe} + \\text{CuSO}_4 \\rightarrow \\text{FeSO}_4 + \\text{Cu}$$

### 4. Double Displacement (Precipitation / Neutralisation)
$$\\text{Na}_2\\text{SO}_4 + \\text{BaCl}_2 \\rightarrow \\text{BaSO}_4 \\downarrow + 2\\text{NaCl}$$

### 5. Oxidation and Reduction (Redox)
- **Oxidation**: gain of oxygen OR loss of hydrogen OR loss of electrons.
- **Reduction**: loss of oxygen OR gain of hydrogen OR gain of electrons.
- **Oxidising agent**: gets reduced | **Reducing agent**: gets oxidised.

## Corrosion and Rancidity

- **Corrosion**: slow oxidation of metals; e.g. rusting of iron.
  $$4\\text{Fe} + 3\\text{O}_2 + x\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$$
- **Rancidity**: oxidation of fats/oils giving bad smell; prevented by antioxidants, vacuum packing, N₂ flushing.

## Balancing Equations — Steps
1. Write unbalanced (skeleton) equation.
2. Count atoms on each side.
3. Adjust coefficients (never change subscripts).
4. Verify balance.
`.trim() },

  // ── Matter in Our Surroundings (Chem IX) ──────────────────────────────────
  { id:"note-chem-ix-c01", chapterId:"chem-ix-c01", title:"Matter in Our Surroundings – Complete Notes", content:`
# Matter in Our Surroundings

## States of Matter

| Property | Solid | Liquid | Gas |
|----------|-------|--------|-----|
| Shape | Fixed | No fixed shape | No fixed shape |
| Volume | Fixed | Fixed | No fixed volume |
| Compressibility | Very low | Low | High |
| Fluidity | Cannot flow | Flows | Flows easily |
| Particle arrangement | Closely packed, regular | Less ordered | Randomly arranged |
| Intermolecular forces | Very strong | Strong | Very weak |

## Change of State

$$\\text{Solid} \\underset{\\text{Freezing}}{\\overset{\\text{Melting}}{\\rightleftharpoons}} \\text{Liquid} \\underset{\\text{Condensation}}{\\overset{\\text{Vaporisation}}{\\rightleftharpoons}} \\text{Gas}$$

- **Sublimation**: solid → gas directly (e.g. dry ice, naphthalene, iodine)
- **Deposition**: gas → solid directly

## Important Temperatures
- **Melting Point** of ice = 0°C = 273 K
- **Boiling Point** of water = 100°C = 373 K
- **Latent Heat of Fusion** (ice) = 334 J/g
- **Latent Heat of Vaporisation** (water) = 2260 J/g

## Kelvin–Celsius Conversion
$$T(K) = T(°C) + 273$$

## Evaporation
- Occurs at **all temperatures** (unlike boiling, which occurs at boiling point).
- Factors increasing evaporation: higher temperature, more surface area, lower humidity, wind.
- Evaporation causes **cooling** (sweat, wet cloth).
`.trim() },

  // ── The Fundamental Unit of Life (Bio IX) ─────────────────────────────────
  { id:"note-bio-ix-c01", chapterId:"bio-ix-c01", title:"The Fundamental Unit of Life – Complete Notes", content:`
# The Fundamental Unit of Life

## The Cell
The **cell** is the basic structural and functional unit of all living organisms.

- **Robert Hooke** (1665) — first observed cells in cork.
- **Schleiden & Schwann** (1839) — Cell Theory: all living things are made of cells.
- **Virchow** (1855) — Omnis cellula e cellula (cells arise from existing cells).

## Prokaryotic vs Eukaryotic Cells

| Feature | Prokaryotic | Eukaryotic |
|---------|-------------|------------|
| Nucleus | No true nucleus (nucleoid) | True nucleus with nuclear membrane |
| Size | 1–10 μm | 10–100 μm |
| Membrane-bound organelles | Absent | Present |
| Examples | Bacteria, blue-green algae | Plants, animals, fungi |

## Plant Cell vs Animal Cell

| Feature | Plant Cell | Animal Cell |
|---------|-----------|-------------|
| Cell wall | Present (cellulose) | Absent |
| Chloroplasts | Present | Absent |
| Large central vacuole | Present | Small/absent |
| Centrioles | Absent | Present |
| Plastids | Present | Absent |

## Key Organelles

| Organelle | Function |
|-----------|----------|
| **Cell membrane** | Selectively permeable boundary |
| **Nucleus** | Controls all cellular activities, contains DNA |
| **Mitochondria** | "Powerhouse" — cellular respiration, ATP production |
| **Chloroplast** | Photosynthesis (plants only) |
| **Ribosome** | Protein synthesis |
| **ER (Rough)** | Protein synthesis and transport |
| **ER (Smooth)** | Lipid synthesis |
| **Golgi apparatus** | Packaging and secretion |
| **Lysosome** | Intracellular digestion ("suicide bags") |
| **Vacuole** | Storage; maintains turgor pressure in plants |

## Osmosis and Diffusion

- **Diffusion**: Movement of molecules from high to low concentration.
- **Osmosis**: Movement of water across a semi-permeable membrane from dilute to concentrated solution.
- **Plasmolysis**: Shrinkage of cell membrane away from cell wall in hypertonic solution.
- **Turgidity**: Cell swells in hypotonic solution.
`.trim() },

  // ── Life Processes (Bio X) ─────────────────────────────────────────────────
  { id:"note-bio-x-c01", chapterId:"bio-x-c01", title:"Life Processes – Complete Notes", content:`
# Life Processes

## Nutrition

### Autotrophic (Photosynthesis)
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Sunlight, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

Stages: Light reactions (thylakoid) → Dark reactions / Calvin cycle (stroma).

### Heterotrophic (in Humans)
Mouth → Oesophagus → Stomach → Small intestine → Large intestine

- **Saliva** (amylase): starch → maltose
- **Gastric juice** (pepsin + HCl): protein digestion
- **Bile** (liver): emulsification of fats
- **Pancreatic juice**: amylase, lipase, trypsin

## Respiration

### Aerobic
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{38 ATP}$$

### Anaerobic
- In yeast: Glucose → Ethanol + CO₂ + 2 ATP
- In muscles (lack of O₂): Glucose → Lactic acid + 2 ATP (causes muscle cramps)

## Transportation

### In Plants
- **Water & minerals**: Xylem (transpiration pull)
- **Food**: Phloem (pressure flow / mass flow)

### In Humans (Blood)
- **Heart**: Double pump; 4 chambers (2 auricles + 2 ventricles)
- **Systemic circulation**: Heart → Body → Heart
- **Pulmonary circulation**: Heart → Lungs → Heart
- **Blood pressure**: Normal ≈ 120/80 mmHg

## Excretion

### In Humans
- **Kidneys**: Filter blood → form urine (urea, water, salts)
- **Nephron**: Filtration → Selective reabsorption → Secretion → Urine
- **Dialysis**: Artificial kidney function for kidney failure

### In Plants
- CO₂ (by diffusion), O₂ (by diffusion), excess water (transpiration)
- Some wastes stored in leaves, bark.
`.trim() },
];

async function seedNotes() {
  const batches = [];
  let batch = db.batch();
  let count = 0;
  for (const n of NOTES) {
    const { id, ...data } = n;
    batch.set(db.collection("notes").doc(id), { ...data, createdAt: now });
    count++;
    if (count % 400 === 0) { batches.push(batch); batch = db.batch(); }
  }
  batches.push(batch);
  for (const b of batches) await b.commit();
  console.log(`✓ Notes (${NOTES.length} chapters)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MCQs
// ─────────────────────────────────────────────────────────────────────────────

const MCQS = [
  // Physics IX – Motion
  { id:"mcq-phys-ix-c01-01", chapterId:"phys-ix-c01", question:"An object travels 16 m in the first 2 s, and 28 m in next 4 s. What is its average speed?", options:["6 m/s","7.3 m/s","5.5 m/s","10 m/s"], correctIndex:1, explanation:"Total distance = 44 m, total time = 6 s. Average speed = 44/6 ≈ 7.3 m/s." },
  { id:"mcq-phys-ix-c01-02", chapterId:"phys-ix-c01", question:"Which of the following is a vector quantity?", options:["Speed","Distance","Displacement","Time"], correctIndex:2, explanation:"Displacement has both magnitude and direction — it is a vector quantity." },
  { id:"mcq-phys-ix-c01-03", chapterId:"phys-ix-c01", question:"The area under a velocity-time graph represents:", options:["Acceleration","Displacement","Speed","Force"], correctIndex:1, explanation:"Area under v-t graph = displacement covered in that time interval." },
  { id:"mcq-phys-ix-c01-04", chapterId:"phys-ix-c01", question:"A car starts from rest and attains a velocity of 20 m/s in 4 s. Its acceleration is:", options:["2.5 m/s²","5 m/s²","80 m/s²","0.2 m/s²"], correctIndex:1, explanation:"a = (v − u)/t = (20 − 0)/4 = 5 m/s²." },
  { id:"mcq-phys-ix-c01-05", chapterId:"phys-ix-c01", question:"For a body moving in a circle at constant speed:", options:["Velocity is constant","Acceleration is zero","Velocity changes","Speed changes"], correctIndex:2, explanation:"Direction of velocity continuously changes in circular motion, so velocity changes even though speed is constant." },

  // Physics IX – Force
  { id:"mcq-phys-ix-c02-01", chapterId:"phys-ix-c02", question:"Which law explains why passengers jerk forward when a moving bus suddenly stops?", options:["Newton's 1st law","Newton's 2nd law","Newton's 3rd law","Law of Gravitation"], correctIndex:0, explanation:"Passengers continue in their state of motion (inertia) when the bus stops — 1st law (law of inertia)." },
  { id:"mcq-phys-ix-c02-02", chapterId:"phys-ix-c02", question:"The SI unit of momentum is:", options:["kg·m/s","N/m","J/s","N·s²"], correctIndex:0, explanation:"Momentum = mass × velocity = kg × m/s = kg·m/s." },
  { id:"mcq-phys-ix-c02-03", chapterId:"phys-ix-c02", question:"A force of 10 N acts on a body of mass 2 kg. Its acceleration is:", options:["20 m/s²","0.2 m/s²","5 m/s²","12 m/s²"], correctIndex:2, explanation:"a = F/m = 10/2 = 5 m/s² (Newton's 2nd law)." },

  // Math IX – Number Systems
  { id:"mcq-math-ix-c01-01", chapterId:"math-ix-c01", question:"Which of the following is irrational?", options:["√4","√9","√16","√5"], correctIndex:3, explanation:"√5 cannot be expressed as p/q — it is irrational. √4 = 2, √9 = 3, √16 = 4 are rational." },
  { id:"mcq-math-ix-c01-02", chapterId:"math-ix-c01", question:"Every integer is:", options:["A natural number","A rational number","An irrational number","A whole number"], correctIndex:1, explanation:"Every integer can be written as p/1, so every integer is a rational number." },
  { id:"mcq-math-ix-c01-03", chapterId:"math-ix-c01", question:"The decimal expansion of a rational number is:", options:["Always terminating","Non-terminating non-repeating","Either terminating or non-terminating repeating","Always non-terminating"], correctIndex:2, explanation:"Rational numbers have either terminating OR non-terminating but repeating decimal expansions." },

  // Math X – Real Numbers
  { id:"mcq-math-x-c01-01", chapterId:"math-x-c01", question:"HCF(306, 657) = ?", options:["9","18","27","3"], correctIndex:0, explanation:"657 = 306 × 2 + 45; 306 = 45 × 6 + 36; 45 = 36 × 1 + 9; 36 = 9 × 4 + 0. HCF = 9." },
  { id:"mcq-math-x-c01-02", chapterId:"math-x-c01", question:"If LCM(26, 91) = 182 and HCF = 13, what is 26 × 91?", options:["182","2366","2366","1820"], correctIndex:1, explanation:"Product of numbers = HCF × LCM = 13 × 182 = 2366." },

  // Math X – Quadratic Equations
  { id:"mcq-math-x-c04-01", chapterId:"math-x-c04", question:"The discriminant of 2x² − 5x + 3 = 0 is:", options:["1","−1","25","49"], correctIndex:0, explanation:"D = b² − 4ac = 25 − 4(2)(3) = 25 − 24 = 1." },
  { id:"mcq-math-x-c04-02", chapterId:"math-x-c04", question:"Roots of x² − 5x + 6 = 0 are:", options:["2 and 3","−2 and −3","1 and 6","−1 and −6"], correctIndex:0, explanation:"(x − 2)(x − 3) = 0 ⟹ x = 2 or x = 3." },

  // Chemistry X – Chemical Reactions
  { id:"mcq-chem-x-c01-01", chapterId:"chem-x-c01", question:"Which type of reaction is represented by: A + BC → AC + B?", options:["Combination","Decomposition","Displacement","Double displacement"], correctIndex:2, explanation:"Element A displaces B from compound BC — this is a displacement (single replacement) reaction." },
  { id:"mcq-chem-x-c01-02", chapterId:"chem-x-c01", question:"Rancidity of food is caused by:", options:["Reduction of fats","Oxidation of fats","Hydrolysis of proteins","Addition of preservatives"], correctIndex:1, explanation:"Oxidation of unsaturated fats produces aldehydes and ketones with unpleasant smell/taste — rancidity." },

  // Biology X – Life Processes
  { id:"mcq-bio-x-c01-01", chapterId:"bio-x-c01", question:"Which organelle is called the 'powerhouse of the cell'?", options:["Nucleus","Ribosome","Mitochondria","Chloroplast"], correctIndex:2, explanation:"Mitochondria produce ATP via cellular respiration, providing energy for all cellular activities." },
  { id:"mcq-bio-x-c01-02", chapterId:"bio-x-c01", question:"The enzyme that breaks down starch in saliva is:", options:["Pepsin","Trypsin","Salivary amylase","Lipase"], correctIndex:2, explanation:"Salivary amylase (ptyalin) converts starch into maltose in the mouth." },
];

async function seedMCQs() {
  const batches = [];
  let batch = db.batch();
  let count = 0;
  for (const m of MCQS) {
    const { id, ...data } = m;
    batch.set(db.collection("mcqs").doc(id), { ...data, createdAt: now });
    count++;
    if (count % 400 === 0) { batches.push(batch); batch = db.batch(); }
  }
  batches.push(batch);
  for (const b of batches) await b.commit();
  console.log(`✓ MCQs (${MCQS.length})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Q&A
// ─────────────────────────────────────────────────────────────────────────────

const QAS = [
  { id:"qa-phys-ix-c01-01", chapterId:"phys-ix-c01", question:"Distinguish between distance and displacement.", answer:"**Distance** is the total path length covered by an object irrespective of direction. It is a scalar quantity. **Displacement** is the shortest distance between the initial and final positions of an object, measured with direction. It is a vector quantity. Distance ≥ |displacement|; for a closed path, displacement = 0 but distance > 0." },
  { id:"qa-phys-ix-c02-01", chapterId:"phys-ix-c02", question:"State and explain Newton's third law of motion with two examples.", answer:"**Statement**: To every action there is an equal and opposite reaction, acting on different objects.\n\n**Examples**:\n1. *Rocket propulsion*: Burning gases are expelled backward (action); the rocket moves forward (reaction).\n2. *Walking*: We push the ground backward (action); the ground pushes us forward (reaction) allowing us to walk." },
  { id:"qa-phys-ix-c03-01", chapterId:"phys-ix-c03", question:"State the Universal Law of Gravitation and write the formula.", answer:"**Law**: Every object in the universe attracts every other object with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between them.\n\n$$F = G\\frac{m_1 m_2}{r^2}$$\n\nwhere G = 6.674 × 10⁻¹¹ N·m²/kg²." },
  { id:"qa-math-ix-c01-01", chapterId:"math-ix-c01", question:"Prove that √2 is irrational.", answer:"**Proof by contradiction**: Assume √2 is rational. Then √2 = p/q where p, q are integers, q ≠ 0, and p/q is in its lowest terms (HCF of p and q is 1).\n\nSquaring: 2 = p²/q² ⟹ p² = 2q².\n\nSo 2 divides p². Since 2 is prime, 2 divides p. Let p = 2k.\n\nThen 4k² = 2q² ⟹ q² = 2k², so 2 divides q.\n\nBut then both p and q are divisible by 2, contradicting that HCF(p, q) = 1. Hence √2 is irrational." },
  { id:"qa-math-x-c04-01", chapterId:"math-x-c04", question:"Derive the quadratic formula.", answer:"Starting from ax² + bx + c = 0:\n\nDivide by a: x² + (b/a)x + c/a = 0\n\nComplete the square: x² + (b/a)x + (b/2a)² = (b/2a)² − c/a\n\n$$(x + b/2a)^2 = \\frac{b^2 - 4ac}{4a^2}$$\n\n$$x + \\frac{b}{2a} = \\pm\\frac{\\sqrt{b^2-4ac}}{2a}$$\n\n$$\\boxed{x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}}$$" },
  { id:"qa-chem-x-c01-01", chapterId:"chem-x-c01", question:"What is a redox reaction? Give one example.", answer:"A **redox reaction** is one in which oxidation and reduction occur simultaneously.\n\n- **Oxidation**: loss of electrons (increase in oxidation state)\n- **Reduction**: gain of electrons (decrease in oxidation state)\n\n**Example**: CuO + H₂ → Cu + H₂O\n- H₂ is oxidised (loses electrons, oxidation state 0 → +1)\n- Cu in CuO is reduced (gains electrons, oxidation state +2 → 0)\n- H₂ is the reducing agent; CuO is the oxidising agent." },
  { id:"qa-bio-x-c01-01", chapterId:"bio-x-c01", question:"Explain the double circulation of blood in humans.", answer:"In humans, blood passes through the heart **twice** in one complete circulation — this is called **double circulation**.\n\n1. **Pulmonary circulation** (Right side): Deoxygenated blood from the body enters the right atrium → right ventricle → lungs (for oxygenation) → back to left atrium.\n\n2. **Systemic circulation** (Left side): Oxygenated blood from lungs enters the left atrium → left ventricle → aorta → all body organs → returns as deoxygenated blood to right atrium.\n\nAdvantage: Ensures efficient separation of oxygenated and deoxygenated blood, allowing high metabolic rate in warm-blooded animals." },
];

async function seedQAs() {
  const batch = db.batch();
  for (const q of QAS) {
    const { id, ...data } = q;
    batch.set(db.collection("qa").doc(id), { ...data, createdAt: now });
  }
  await batch.commit();
  console.log(`✓ Q&A (${QAS.length})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN ALL
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Seeding TRUE CONCEPT database...\n");
  await seedUsers();
  await seedSubjects();
  await seedChapters();
  await seedNotes();
  await seedMCQs();
  await seedQAs();
  console.log("\n✅ All done!\n");
  console.log("  Admin login:   admin / admin123");
  console.log("  Students:      Use mobile OTP login\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
