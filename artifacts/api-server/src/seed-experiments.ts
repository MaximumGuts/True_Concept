/**
 * Seeds the 25 Virtual Lab experiments. Idempotent — checks for existing
 * (subject + type) combination and skips if already present.
 *
 * Run via: pnpm --filter @workspace/db exec tsx ../../scripts/seed-experiments.ts
 */
import { db, experimentsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

type Seed = {
  subject: "Physics" | "Chemistry";
  classLevel: "Class IX" | "Class X";
  difficulty: "easy" | "medium" | "hard";
  type: string;
  title: string;
  objective: string;
  theory: string;
  apparatus: string;
  procedure: string;
  expectedResult: string;
  explanation: string;
  hints?: string;
  summary?: string;
};

const seeds: Seed[] = [
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "distance-time",
    title: "Distance–Time Graph",
    objective: "Plot the distance–time graph of an object moving with uniform speed.",
    theory: "For uniform motion, distance covered is directly proportional to time. The slope of a distance–time graph gives the speed of the object.",
    apparatus: "Toy car\nMetre scale\nStopwatch\n(Simulated)",
    procedure: "Set the speed using the slider.\nPress Start to begin motion.\nObserve how the distance–time line forms.\nPause and record values in the observation table.\nChange the speed and repeat.",
    expectedResult: "The distance–time graph for a uniformly moving object is a straight line. Greater speed → steeper slope.",
    explanation: "Slope of distance–time graph = distance/time = speed. A straight line confirms uniform motion.",
    hints: "Try speeds 1, 2 and 4 m/s and compare the slopes.",
    summary: "Slope of distance–time graph represents speed of the body.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "velocity-time",
    title: "Velocity–Time Graph",
    objective: "Plot the velocity–time graph for an object under constant acceleration.",
    theory: "For uniformly accelerated motion, velocity increases linearly with time. Slope of v–t graph = acceleration.",
    apparatus: "Trolley\nInclined plane\nTicker tape\n(Simulated)",
    procedure: "Set acceleration using the slider.\nStart the motion.\nWatch the velocity grow with time.\nNote how the slope reflects acceleration.",
    expectedResult: "The v–t graph is a straight inclined line whose slope equals the acceleration.",
    explanation: "v = u + at. The graph slope (Δv/Δt) gives a, and area under the graph gives displacement.",
    summary: "Slope of velocity–time graph = acceleration; area under it = displacement.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "free-fall",
    title: "Free Fall under Gravity",
    objective: "Investigate how time and final velocity depend on the height of free fall.",
    theory: "An object falling freely under gravity (ignoring air resistance) has acceleration g = 9.8 m/s².",
    apparatus: "Steel ball\nMetre scale\nStopwatch\n(Simulated)",
    procedure: "Choose the drop height.\nPress Drop.\nObserve the falling object and read time, velocity.\nRepeat for different heights.",
    expectedResult: "Time t = √(2h/g), final velocity v = √(2gh). Both increase with height.",
    explanation: "All bodies fall with the same acceleration g, regardless of mass (ignoring air drag).",
    summary: "Free-fall: v² = 2gh, t = √(2h/g).",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "motion-accel",
    title: "Motion with Constant Acceleration",
    objective: "Apply equations of motion: s = ut + ½at², v = u + at.",
    theory: "When acceleration is constant, the equations of motion relate u, v, a, s and t.",
    apparatus: "Trolley\nTrack\nMotion sensor\n(Simulated)",
    procedure: "Set initial velocity u.\nSet acceleration a.\nSet observation time t.\nRead the calculated displacement and final velocity.",
    expectedResult: "Displacement and final velocity match the equations of motion.",
    explanation: "These equations apply only for constant acceleration in a straight line.",
    summary: "Three equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "hard", type: "gravitation",
    title: "Universal Law of Gravitation",
    objective: "Study how gravitational force changes with mass and distance.",
    theory: "Newton's law: F = G·m₁·m₂ / r². G = 6.674 × 10⁻¹¹ N·m²/kg².",
    apparatus: "Two large masses\nTorsion balance\n(Simulated)",
    procedure: "Adjust mass m₁ and m₂.\nAdjust distance r between them.\nObserve how F changes.\nDouble r and note the change in F.",
    expectedResult: "F doubles when either mass doubles. F becomes ¼ when r doubles.",
    explanation: "Gravity acts between any two masses. It is an inverse-square force.",
    summary: "F = Gm₁m₂/r². Inverse-square dependence on distance.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "archimedes",
    title: "Archimedes' Principle",
    objective: "Verify that buoyant force equals the weight of fluid displaced.",
    theory: "Buoyant force = ρ_fluid × V_displaced × g.",
    apparatus: "Overflow can\nMeasuring cylinder\nObject of known volume\n(Simulated)",
    procedure: "Choose the object's volume.\nGradually submerge it in water.\nObserve water displaced.\nRead the buoyant force.",
    expectedResult: "Buoyant force equals weight of displaced water.",
    explanation: "When immersed, an object pushes water aside. The water pushes back with an upward force equal to its own weight.",
    summary: "Buoyant force = weight of fluid displaced.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "density",
    title: "Density Determination",
    objective: "Determine density of an object from its mass and volume.",
    theory: "Density ρ = mass / volume. Unit: g/cm³ or kg/m³.",
    apparatus: "Balance\nMeasuring cylinder\nIrregular object\n(Simulated)",
    procedure: "Measure the mass of the object.\nMeasure the volume of water displaced.\nCalculate density = m/V.\nCompare with water's density (1 g/cm³).",
    expectedResult: "Density determines whether the object sinks (>1 g/cm³) or floats (<1 g/cm³) in water.",
    explanation: "Density is an intrinsic property of a substance. Objects denser than the fluid sink.",
    summary: "ρ = m/V. Floats if ρ < ρ_fluid, sinks if ρ > ρ_fluid.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "kinetic-energy",
    title: "Kinetic Energy Simulation",
    objective: "Investigate how kinetic energy depends on mass and velocity.",
    theory: "KE = ½mv². Energy of motion is proportional to mass and to the square of velocity.",
    apparatus: "Trolley\nVelocity sensor\nMass blocks\n(Simulated)",
    procedure: "Set the mass.\nSet the velocity.\nObserve the kinetic energy bar.\nDouble the velocity and note the change.",
    expectedResult: "Doubling velocity quadruples KE. Doubling mass doubles KE.",
    explanation: "KE depends linearly on mass but quadratically on velocity, so velocity is the dominant factor.",
    summary: "KE = ½mv². Velocity matters more than mass.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "potential-energy",
    title: "Potential Energy Simulation",
    objective: "Investigate gravitational potential energy.",
    theory: "PE = mgh. Energy stored due to position above ground.",
    apparatus: "Mass\nMetre scale\n(Simulated)",
    procedure: "Set the mass of the object.\nSet the height above the ground.\nObserve the calculated potential energy.",
    expectedResult: "PE increases linearly with both mass and height.",
    explanation: "Lifting an object against gravity stores energy in it as gravitational PE.",
    summary: "PE = mgh.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "hard", type: "pendulum",
    title: "Conservation of Energy (Pendulum)",
    objective: "Observe the conversion between kinetic and potential energy.",
    theory: "In an ideal pendulum, mechanical energy (KE + PE) stays constant.",
    apparatus: "Bob\nString\nProtractor\n(Simulated)",
    procedure: "Choose a release angle.\nWatch the pendulum swing.\nObserve KE and PE bars at each position.\nNote that total stays the same.",
    expectedResult: "KE is maximum at the bottom; PE is maximum at the highest point. Total = constant.",
    explanation: "Energy transforms between KE and PE but the sum is conserved (in the absence of friction).",
    summary: "Total mechanical energy = KE + PE = constant.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "reflection",
    title: "Laws of Reflection",
    objective: "Verify that the angle of incidence equals the angle of reflection.",
    theory: "Two laws: (1) i = r, (2) incident ray, normal and reflected ray lie in the same plane.",
    apparatus: "Plane mirror\nLaser pointer\nProtractor\n(Simulated)",
    procedure: "Set the angle of incidence using the slider.\nObserve the reflected ray.\nMeasure both angles from the normal.",
    expectedResult: "The reflected angle always equals the incident angle.",
    explanation: "Laws of reflection apply to all reflecting surfaces.",
    summary: "Angle of incidence = angle of reflection.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "plane-mirror",
    title: "Image Formation by Plane Mirror",
    objective: "Study image properties formed by a plane mirror.",
    theory: "A plane mirror forms a virtual, upright, laterally inverted image at the same distance behind the mirror.",
    apparatus: "Plane mirror\nObject\nMetre scale\n(Simulated)",
    procedure: "Place the object at different distances from the mirror.\nObserve the image position and orientation.",
    expectedResult: "Image distance = object distance. Image is virtual, upright, same size, laterally inverted.",
    explanation: "Reflected rays appear to diverge from a point behind the mirror — that's the virtual image.",
    summary: "Plane mirror image: virtual, upright, same size, laterally inverted, equal distance.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "convex-lens",
    title: "Image Formation by Lens and Mirror",
    objective: "Investigate how convex/concave lenses and concave/convex mirrors form images of an object placed at different distances, using ray diagrams and the lens/mirror formulas.",
    theory: "Spherical mirrors and thin lenses form images by reflecting or refracting light from an object. The position, size and nature of the image depend on the position of the object relative to the focal point F and the centre of curvature C (or 2F for lenses).\n\nNew Cartesian sign convention: distances are measured from the optical centre / pole of the element. Distances measured in the direction of incident light are positive; the opposite direction is negative. Heights above the principal axis are positive; below are negative.\n\nLens formula:  1/v − 1/u = 1/f.   Linear magnification m = v/u = h_i/h_o.\nMirror formula: 1/v + 1/u = 1/f.   Linear magnification m = −v/u = h_i/h_o.\n\nIn this convention the sign of f is: convex lens f > 0, concave lens f < 0, concave mirror f < 0 (centre of curvature lies in front of the mirror, on the negative side), convex mirror f > 0 (centre of curvature lies behind the mirror). A positive m means an upright image; a negative m means an inverted image. |m| > 1 means magnified, |m| < 1 means diminished.",
    apparatus: "Convex lens, concave lens, concave mirror, convex mirror\nOptical bench with stand and clamps\nLighted object (e.g. illuminated arrow or candle)\nScreen for capturing real images\nMetre scale\n(Simulated in this Virtual Lab)",
    procedure: "Set the object distance using the slider.\nObserve image position, size and orientation.\nNote behaviour at u = f, 2f and beyond.",
    expectedResult: "u > 2f → real, inverted, diminished. u between f and 2f → real, inverted, magnified. u < f → virtual, upright, magnified.",
    explanation: "Image properties depend on where the object is relative to focus and centre of curvature.",
    summary: "1/v − 1/u = 1/f. Magnification m = v/u.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "refraction",
    title: "Refraction Through Glass Slab",
    objective: "Trace the path of light through a rectangular glass slab.",
    theory: "Snell's law: n₁ sin i = n₂ sin r.",
    apparatus: "Rectangular glass slab\nLaser\nProtractor\n(Simulated)",
    procedure: "Set the angle of incidence.\nObserve refraction at the first surface.\nObserve emergent ray at the second surface.",
    expectedResult: "Refracted ray bends toward the normal entering glass; emergent ray is parallel to incident ray but laterally shifted.",
    explanation: "Light slows down in a denser medium (n = 1.5 for glass) causing refraction.",
    summary: "Snell's law: n₁ sin i = n₂ sin r.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "power-of-lens",
    title: "Power of a Lens",
    objective: "Relate power of a lens to its focal length.",
    theory: "Power P = 1/f (in metres). Unit: dioptre (D).",
    apparatus: "Set of lenses with different f\n(Simulated)",
    procedure: "Adjust focal length.\nObserve how the lens shape changes.\nRead the power in dioptres.",
    expectedResult: "Shorter focal length → higher power. P = 100/f (cm).",
    explanation: "A more curved lens converges light more strongly, hence higher power.",
    summary: "P = 1/f (m). Unit: dioptre.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "ohms-law",
    title: "Ohm's Law Verification",
    objective: "Verify Ohm's law V = IR by varying voltage in a circuit.",
    theory: "At constant temperature, current through a metallic conductor is directly proportional to applied voltage: V = IR.",
    apparatus: "Battery\nResistor\nAmmeter\nVoltmeter\n(Simulated)",
    procedure: "Set the resistance.\nVary the voltage from 0 to 12 V.\nRead the current at each voltage.\nClick 'Record' to plot V vs I.",
    expectedResult: "V vs I plot is a straight line through the origin. Slope = R.",
    explanation: "Ohm's law holds for ohmic conductors at constant temperature.",
    summary: "V = IR. Plot V vs I → straight line, slope = R.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "series-circuit",
    title: "Resistors in Series",
    objective: "Investigate equivalent resistance of resistors in series.",
    theory: "R_total = R₁ + R₂ + R₃ + …",
    apparatus: "Resistors\nBattery\nAmmeter\n(Simulated)",
    procedure: "Add resistors using +.\nAdjust each resistance value.\nObserve total resistance and circuit current.",
    expectedResult: "Total resistance is the sum of individual resistances. Same current flows through each.",
    explanation: "Series resistors share the same current; voltages add up.",
    summary: "Series: R_total = ΣR. Same current everywhere.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "parallel-circuit",
    title: "Resistors in Parallel",
    objective: "Investigate equivalent resistance of resistors in parallel.",
    theory: "1/R_total = 1/R₁ + 1/R₂ + …",
    apparatus: "Resistors\nBattery\nAmmeter\n(Simulated)",
    procedure: "Add resistors in parallel.\nAdjust each resistance value.\nObserve current through each branch.",
    expectedResult: "Total resistance is less than the smallest branch. Branch currents add up to total.",
    explanation: "Each parallel branch sees the same voltage, so smaller R gets more current.",
    summary: "Parallel: 1/R_total = Σ(1/R). Branch voltages equal.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "heating-effect",
    title: "Heating Effect of Current",
    objective: "Study how heat produced depends on current, resistance and time.",
    theory: "Joule's law: H = I²Rt.",
    apparatus: "Heater coil\nAmmeter\nThermometer\n(Simulated)",
    procedure: "Set current, resistance and time.\nObserve the wire glowing.\nRead the heat produced.",
    expectedResult: "Heat increases as the square of current.",
    explanation: "Electrical energy dissipates as heat due to resistance — basis of bulbs, heaters, fuses.",
    summary: "H = I²Rt (Joule's law of heating).",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "sound-wave",
    title: "Sound Wave Visualization",
    objective: "Visualize how sound waves change with frequency and amplitude.",
    theory: "Sound is a longitudinal wave. Frequency = pitch, amplitude = loudness.",
    apparatus: "Tuning fork\nOscilloscope\n(Simulated)",
    procedure: "Adjust frequency.\nAdjust amplitude.\nObserve the changing waveform.",
    expectedResult: "Higher frequency → more cycles per second. Higher amplitude → taller wave.",
    explanation: "All sounds are made of waves with characteristic frequency and amplitude.",
    summary: "Pitch ↔ frequency, loudness ↔ amplitude.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "pitch",
    title: "Frequency and Pitch",
    objective: "Listen to how pitch changes with frequency.",
    theory: "Audible range for humans: 20 Hz to 20 000 Hz.",
    apparatus: "Tone generator\nSpeaker\n(Simulated)",
    procedure: "Press Play to start the tone.\nSlide the frequency.\nNotice the perceived pitch change.",
    expectedResult: "Increasing frequency raises the pitch.",
    explanation: "Higher frequency = more vibrations per second = higher pitch.",
    summary: "Pitch is the brain's interpretation of frequency.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "echo",
    title: "Echo Delay",
    objective: "Calculate the time delay between sound and its echo.",
    theory: "Echo time = 2d/v, where v ≈ 340 m/s in air.",
    apparatus: "Sound source\nReflecting wall\nStopwatch\n(Simulated)",
    procedure: "Set distance to the wall.\nObserve the calculated delay.\nNote the minimum distance for an audible echo (~17 m).",
    expectedResult: "Delay is proportional to distance. Below 17 m, echo merges with original sound.",
    explanation: "Persistence of hearing is 0.1 s; the echo must arrive after this to be heard separately.",
    summary: "t_echo = 2d/v. Minimum d for echo ≈ 17 m.",
  },
  {
    subject: "Chemistry", classLevel: "Class IX", difficulty: "easy", type: "filtration",
    title: "Separation by Filtration",
    objective: "Separate insoluble solid from a liquid using filter paper.",
    theory: "Filter paper has tiny pores that allow liquid to pass but trap insoluble particles.",
    apparatus: "Beaker\nFunnel\nFilter paper\nMixture (sand + water)\n(Simulated)",
    procedure: "Fold the filter paper and place it in the funnel.\nPour the mixture slowly.\nObserve clear filtrate collecting and residue staying on the paper.",
    expectedResult: "Sand (residue) remains on the paper; clear water (filtrate) passes through.",
    explanation: "Filtration separates components based on particle size.",
    summary: "Filtration = separating insoluble solid from liquid.",
  },
  {
    subject: "Chemistry", classLevel: "Class IX", difficulty: "medium", type: "crystallization",
    title: "Crystallization of Copper Sulphate",
    objective: "Obtain pure crystals of copper sulphate from its solution.",
    theory: "Solubility decreases as temperature falls. Slow cooling allows pure crystals to form.",
    apparatus: "Beaker\nBurner\nCopper sulphate\nWater\n(Simulated)",
    procedure: "Heat the saturated copper sulphate solution.\nCool it slowly.\nObserve blue crystals forming as the solution cools.",
    expectedResult: "Bright blue cubic crystals of copper sulphate appear at the bottom.",
    explanation: "Crystallization gives purer crystals than evaporation because impurities stay in solution.",
    summary: "Crystallization = pure solids from supersaturated solutions.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "ph-testing",
    title: "pH Testing with Indicators",
    objective: "Identify acidic, basic and neutral solutions using indicators.",
    theory: "Indicators change colour with pH. Common indicators: litmus, phenolphthalein, universal indicator.",
    apparatus: "Test tubes\nDroppers\nSolutions: HCl, NaOH, water, soap solution\nIndicators\n(Simulated)",
    procedure: "Choose a solution.\nChoose an indicator.\nObserve the colour change.\nMatch the colour with pH.",
    expectedResult: "Acids turn blue litmus red. Bases turn red litmus blue and pink with phenolphthalein.",
    explanation: "pH measures H⁺ concentration. pH < 7 acidic, pH = 7 neutral, pH > 7 basic.",
    summary: "Indicators reveal whether a solution is acidic, basic or neutral.",
  },
];

async function run() {
  let inserted = 0;
  let skipped = 0;
  for (const s of seeds) {
    const existing = await db.select().from(experimentsTable)
      .where(and(eq(experimentsTable.subject, s.subject), eq(experimentsTable.type, s.type as never)));
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await db.insert(experimentsTable).values({
      subject: s.subject,
      classLevel: s.classLevel,
      difficulty: s.difficulty,
      type: s.type as never,
      title: s.title,
      objective: s.objective,
      theory: s.theory,
      apparatus: s.apparatus,
      procedure: s.procedure,
      expectedResult: s.expectedResult,
      explanation: s.explanation,
      hints: s.hints ?? null,
      summary: s.summary ?? null,
    });
    inserted++;
    console.log(`  + ${s.subject} / ${s.title}`);
  }
  console.log(`\nDone. Inserted: ${inserted}, Skipped (already exist): ${skipped}`);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
