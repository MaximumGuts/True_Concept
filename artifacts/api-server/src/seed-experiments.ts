/**
 * Seeds the 25 Virtual Lab experiments. Idempotent â€” checks for existing
 * (subject + type) combination and skips if already present.
 *
 * Run via: pnpm --filter @workspace/db exec tsx ../../scripts/seed-experiments.ts
 */
import { db } from "@workspace/db";

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
    title: "Distanceâ€“Time Graph",
    objective: "Plot the distanceâ€“time graph of an object moving with uniform speed.",
    theory: "For uniform motion, distance covered is directly proportional to time. The slope of a distanceâ€“time graph gives the speed of the object.",
    apparatus: "Toy car\nMetre scale\nStopwatch\n(Simulated)",
    procedure: "Set the speed using the slider.\nPress Start to begin motion.\nObserve how the distanceâ€“time line forms.\nPause and record values in the observation table.\nChange the speed and repeat.",
    expectedResult: "The distanceâ€“time graph for a uniformly moving object is a straight line. Greater speed â†’ steeper slope.",
    explanation: "Slope of distanceâ€“time graph = distance/time = speed. A straight line confirms uniform motion.",
    hints: "Try speeds 1, 2 and 4 m/s and compare the slopes.",
    summary: "Slope of distanceâ€“time graph represents speed of the body.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "velocity-time",
    title: "Velocityâ€“Time Graph",
    objective: "Plot the velocityâ€“time graph for an object under constant acceleration.",
    theory: "For uniformly accelerated motion, velocity increases linearly with time. Slope of vâ€“t graph = acceleration.",
    apparatus: "Trolley\nInclined plane\nTicker tape\n(Simulated)",
    procedure: "Set acceleration using the slider.\nStart the motion.\nWatch the velocity grow with time.\nNote how the slope reflects acceleration.",
    expectedResult: "The vâ€“t graph is a straight inclined line whose slope equals the acceleration.",
    explanation: "v = u + at. The graph slope (Î”v/Î”t) gives a, and area under the graph gives displacement.",
    summary: "Slope of velocityâ€“time graph = acceleration; area under it = displacement.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "free-fall",
    title: "Free Fall under Gravity",
    objective: "Investigate how time and final velocity depend on the height of free fall.",
    theory: "An object falling freely under gravity (ignoring air resistance) has acceleration g = 9.8 m/sÂ².",
    apparatus: "Steel ball\nMetre scale\nStopwatch\n(Simulated)",
    procedure: "Choose the drop height.\nPress Drop.\nObserve the falling object and read time, velocity.\nRepeat for different heights.",
    expectedResult: "Time t = âˆš(2h/g), final velocity v = âˆš(2gh). Both increase with height.",
    explanation: "All bodies fall with the same acceleration g, regardless of mass (ignoring air drag).",
    summary: "Free-fall: vÂ² = 2gh, t = âˆš(2h/g).",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "motion-accel",
    title: "Motion with Constant Acceleration",
    objective: "Apply equations of motion: s = ut + Â½atÂ², v = u + at.",
    theory: "When acceleration is constant, the equations of motion relate u, v, a, s and t.",
    apparatus: "Trolley\nTrack\nMotion sensor\n(Simulated)",
    procedure: "Set initial velocity u.\nSet acceleration a.\nSet observation time t.\nRead the calculated displacement and final velocity.",
    expectedResult: "Displacement and final velocity match the equations of motion.",
    explanation: "These equations apply only for constant acceleration in a straight line.",
    summary: "Three equations of motion: v = u + at, s = ut + Â½atÂ², vÂ² = uÂ² + 2as.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "hard", type: "gravitation",
    title: "Universal Law of Gravitation",
    objective: "Study how gravitational force changes with mass and distance.",
    theory: "Newton's law: F = GÂ·mâ‚Â·mâ‚‚ / rÂ². G = 6.674 Ã— 10â»Â¹Â¹ NÂ·mÂ²/kgÂ².",
    apparatus: "Two large masses\nTorsion balance\n(Simulated)",
    procedure: "Adjust mass mâ‚ and mâ‚‚.\nAdjust distance r between them.\nObserve how F changes.\nDouble r and note the change in F.",
    expectedResult: "F doubles when either mass doubles. F becomes Â¼ when r doubles.",
    explanation: "Gravity acts between any two masses. It is an inverse-square force.",
    summary: "F = Gmâ‚mâ‚‚/rÂ². Inverse-square dependence on distance.",
  },
  {
    subject: "Physics", classLevel: "Class IX", difficulty: "easy", type: "archimedes",
    title: "Archimedes' Principle",
    objective: "Verify that buoyant force equals the weight of fluid displaced.",
    theory: "Buoyant force = Ï_fluid Ã— V_displaced Ã— g.",
    apparatus: "Overflow can\nMeasuring cylinder\nObject of known volume\n(Simulated)",
    procedure: "Choose the object's volume.\nGradually submerge it in water.\nObserve water displaced.\nRead the buoyant force.",
    expectedResult: "Buoyant force equals weight of displaced water.",
    explanation: "When immersed, an object pushes water aside. The water pushes back with an upward force equal to its own weight.",
    summary: "Buoyant force = weight of fluid displaced.",
  },

  {
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "kinetic-energy",
    title: "Kinetic Energy Simulation",
    objective: "Investigate how kinetic energy depends on mass and velocity.",
    theory: "KE = Â½mvÂ². Energy of motion is proportional to mass and to the square of velocity.",
    apparatus: "Trolley\nVelocity sensor\nMass blocks\n(Simulated)",
    procedure: "Set the mass.\nSet the velocity.\nObserve the kinetic energy bar.\nDouble the velocity and note the change.",
    expectedResult: "Doubling velocity quadruples KE. Doubling mass doubles KE.",
    explanation: "KE depends linearly on mass but quadratically on velocity, so velocity is the dominant factor.",
    summary: "KE = Â½mvÂ². Velocity matters more than mass.",
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
    subject: "Physics", classLevel: "Class IX", difficulty: "medium", type: "human-eye",
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
    explanation: "Reflected rays appear to diverge from a point behind the mirror â€” that's the virtual image.",
    summary: "Plane mirror image: virtual, upright, same size, laterally inverted, equal distance.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "convex-lens",
    title: "Image Formation by Lens and Mirror",
    objective: "Investigate how convex/concave lenses and concave/convex mirrors form images of an object placed at different distances, using ray diagrams and the lens/mirror formulas.",
    theory: "Spherical mirrors and thin lenses form images by reflecting or refracting light from an object. The position, size and nature of the image depend on the position of the object relative to the focal point F and the centre of curvature C (or 2F for lenses).\n\nNew Cartesian sign convention: distances are measured from the optical centre / pole of the element. Distances measured in the direction of incident light are positive; the opposite direction is negative. Heights above the principal axis are positive; below are negative.\n\nLens formula:  1/v âˆ’ 1/u = 1/f.   Linear magnification m = v/u = h_i/h_o.\nMirror formula: 1/v + 1/u = 1/f.   Linear magnification m = âˆ’v/u = h_i/h_o.\n\nIn this convention the sign of f is: convex lens f > 0, concave lens f < 0, concave mirror f < 0 (centre of curvature lies in front of the mirror, on the negative side), convex mirror f > 0 (centre of curvature lies behind the mirror). A positive m means an upright image; a negative m means an inverted image. |m| > 1 means magnified, |m| < 1 means diminished.",
    apparatus: "Convex lens, concave lens, concave mirror, convex mirror\nOptical bench with stand and clamps\nLighted object (e.g. illuminated arrow or candle)\nScreen for capturing real images\nMetre scale\n(Simulated in this Virtual Lab)",
    procedure: "Set the object distance using the slider.\nObserve image position, size and orientation.\nNote behaviour at u = f, 2f and beyond.",
    expectedResult: "u > 2f â†’ real, inverted, diminished. u between f and 2f â†’ real, inverted, magnified. u < f â†’ virtual, upright, magnified.",
    explanation: "Image properties depend on where the object is relative to focus and centre of curvature.",
    summary: "1/v âˆ’ 1/u = 1/f. Magnification m = v/u.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "refraction",
    title: "Refraction Through Glass Slab",
    objective: "Trace the path of light through a rectangular glass slab.",
    theory: "Snell's law: nâ‚ sin i = nâ‚‚ sin r.",
    apparatus: "Rectangular glass slab\nLaser\nProtractor\n(Simulated)",
    procedure: "Set the angle of incidence.\nObserve refraction at the first surface.\nObserve emergent ray at the second surface.",
    expectedResult: "Refracted ray bends toward the normal entering glass; emergent ray is parallel to incident ray but laterally shifted.",
    explanation: "Light slows down in a denser medium (n = 1.5 for glass) causing refraction.",
    summary: "Snell's law: nâ‚ sin i = nâ‚‚ sin r.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "power-of-lens",
    title: "Power of a Lens",
    objective: "Relate power of a lens to its focal length.",
    theory: "Power P = 1/f (in metres). Unit: dioptre (D).",
    apparatus: "Set of lenses with different f\n(Simulated)",
    procedure: "Adjust focal length.\nObserve how the lens shape changes.\nRead the power in dioptres.",
    expectedResult: "Shorter focal length â†’ higher power. P = 100/f (cm).",
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
    summary: "V = IR. Plot V vs I â†’ straight line, slope = R.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "series-circuit",
    title: "Resistors in Series",
    objective: "Investigate equivalent resistance of resistors in series.",
    theory: "R_total = Râ‚ + Râ‚‚ + Râ‚ƒ + â€¦",
    apparatus: "Resistors\nBattery\nAmmeter\n(Simulated)",
    procedure: "Add resistors using +.\nAdjust each resistance value.\nObserve total resistance and circuit current.",
    expectedResult: "Total resistance is the sum of individual resistances. Same current flows through each.",
    explanation: "Series resistors share the same current; voltages add up.",
    summary: "Series: R_total = Î£R. Same current everywhere.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "parallel-circuit",
    title: "Resistors in Parallel",
    objective: "Investigate equivalent resistance of resistors in parallel.",
    theory: "1/R_total = 1/Râ‚ + 1/Râ‚‚ + â€¦",
    apparatus: "Resistors\nBattery\nAmmeter\n(Simulated)",
    procedure: "Add resistors in parallel.\nAdjust each resistance value.\nObserve current through each branch.",
    expectedResult: "Total resistance is less than the smallest branch. Branch currents add up to total.",
    explanation: "Each parallel branch sees the same voltage, so smaller R gets more current.",
    summary: "Parallel: 1/R_total = Î£(1/R). Branch voltages equal.",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "medium", type: "heating-effect",
    title: "Heating Effect of Current",
    objective: "Study how heat produced depends on current, resistance and time.",
    theory: "Joule's law: H = IÂ²Rt.",
    apparatus: "Heater coil\nAmmeter\nThermometer\n(Simulated)",
    procedure: "Set current, resistance and time.\nObserve the wire glowing.\nRead the heat produced.",
    expectedResult: "Heat increases as the square of current.",
    explanation: "Electrical energy dissipates as heat due to resistance â€” basis of bulbs, heaters, fuses.",
    summary: "H = IÂ²Rt (Joule's law of heating).",
  },
  {
    subject: "Physics", classLevel: "Class X", difficulty: "easy", type: "sound-wave",
    title: "Sound Wave Visualization",
    objective: "Visualize how sound waves change with frequency and amplitude.",
    theory: "Sound is a longitudinal wave. Frequency = pitch, amplitude = loudness.",
    apparatus: "Tuning fork\nOscilloscope\n(Simulated)",
    procedure: "Adjust frequency.\nAdjust amplitude.\nObserve the changing waveform.",
    expectedResult: "Higher frequency â†’ more cycles per second. Higher amplitude â†’ taller wave.",
    explanation: "All sounds are made of waves with characteristic frequency and amplitude.",
    summary: "Pitch â†” frequency, loudness â†” amplitude.",
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
    theory: "Echo time = 2d/v, where v â‰ˆ 340 m/s in air.",
    apparatus: "Sound source\nReflecting wall\nStopwatch\n(Simulated)",
    procedure: "Set distance to the wall.\nObserve the calculated delay.\nNote the minimum distance for an audible echo (~17 m).",
    expectedResult: "Delay is proportional to distance. Below 17 m, echo merges with original sound.",
    explanation: "Persistence of hearing is 0.1 s; the echo must arrive after this to be heard separately.",
    summary: "t_echo = 2d/v. Minimum d for echo â‰ˆ 17 m.",
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
    explanation: "pH measures Hâº concentration. pH < 7 acidic, pH = 7 neutral, pH > 7 basic.",
    summary: "Indicators reveal whether a solution is acidic, basic or neutral.",
  },

  /* â”€â”€ Chapter 1: Chemical Reactions and Equations â”€â”€ */
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-mg-combustion",
    title: "Combustion of Magnesium",
    objective: "Study the combination reaction of magnesium with oxygen and observe the energy changes.",
    theory: "When magnesium burns in oxygen, it undergoes an exothermic combination reaction producing magnesium oxide (MgO). The reaction releases heat and an intensely bright white light. MgO is a basic oxide that turns moist red litmus paper blue.\n\nReaction: 2Mg + Oâ‚‚ â†’ 2MgO",
    apparatus: "Magnesium ribbon\nBunsen burner or spirit lamp\nTongs\nChinese dish",
    procedure: "Hold a piece of Mg ribbon with tongs.\nIgnite the ribbon in the burner flame.\nDo NOT look directly at the flame.\nCollect the white ash (MgO) in a Chinese dish.\nTest the ash with moist red litmus paper.",
    expectedResult: "Magnesium burns with a dazzling white flame. A white powdery ash of MgO is formed. The ash turns moist red litmus blue â€” confirming it is a basic oxide.",
    explanation: "This is a combination reaction (A + B â†’ AB) and also an oxidation reaction (Mg gains oxygen). The enormous energy released makes the flame bright enough to damage eyesight.",
    hints: "Watch the litmus paper test â€” MgO dissolves in water to give Mg(OH)â‚‚, a base.",
    summary: "2Mg + Oâ‚‚ â†’ 2MgO. Combination + exothermic. MgO is a basic oxide.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-slaking-lime",
    title: "Slaking of Lime (CaO + Hâ‚‚O)",
    objective: "Observe the highly exothermic combination reaction of calcium oxide with water.",
    theory: "Calcium oxide (quicklime) reacts vigorously with water releasing a large amount of heat. The product, calcium hydroxide [Ca(OH)â‚‚], is called slaked lime. This reaction is used in whitewash and in the construction industry.\n\nReaction: CaO + Hâ‚‚O â†’ Ca(OH)â‚‚ + Heat",
    apparatus: "Calcium oxide (CaO) granules\nWater\nBeaker\nThermometer",
    procedure: "Place a small amount of CaO in a beaker.\nAdd water slowly and carefully.\nObserve the temperature rise and steam formation.\nTest the solution with red litmus â€” it should turn blue.",
    expectedResult: "The mixture becomes very hot (temperature rises above 80Â°C). Steam is produced. Milky slaked lime suspension forms. Red litmus turns blue (alkaline).",
    explanation: "The exothermic nature makes it dangerous to add too much water too quickly. Slaked lime is used to reduce soil acidity and to make whitewash.",
    hints: "Try touching the outside of the beaker â€” it will be very hot!",
    summary: "CaO + Hâ‚‚O â†’ Ca(OH)â‚‚ + Heat. Exothermic combination reaction.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-feso4-decomp",
    title: "Decomposition of Ferrous Sulphate",
    objective: "Study the thermal decomposition of ferrous sulphate crystals through observed colour changes.",
    theory: "Ferrous sulphate heptahydrate (FeSOâ‚„Â·7Hâ‚‚O) is green. On heating it first loses water (green â†’ white anhydrous FeSOâ‚„), then decomposes releasing SOâ‚‚ and SOâ‚ƒ gases, leaving reddish-brown iron(III) oxide.\n\nReaction: 2FeSOâ‚„ â†’ Feâ‚‚Oâ‚ƒ + SOâ‚‚â†‘ + SOâ‚ƒâ†‘",
    apparatus: "Ferrous sulphate crystals\nBoiling tube\nBunsen burner\nTest tube holder",
    procedure: "Take ferrous sulphate crystals in a boiling tube.\nHeat gently and observe colour change.\nContinue heating and note gas evolution.\nSmell the gas carefully from a distance (SOâ‚‚ is pungent).\nNote the final brown residue.",
    expectedResult: "Green crystals â†’ white powder (loss of water) â†’ brown Feâ‚‚Oâ‚ƒ residue. Pungent SOâ‚‚ and SOâ‚ƒ gases are evolved.",
    explanation: "Stage 1: FeSOâ‚„Â·7Hâ‚‚O â†’ FeSOâ‚„ + 7Hâ‚‚O (losing water of crystallisation). Stage 2: 2FeSOâ‚„ â†’ Feâ‚‚Oâ‚ƒ + SOâ‚‚ + SOâ‚ƒ (thermal decomposition). This is an endothermic reaction.",
    hints: "The three distinct colour changes (green â†’ white â†’ brown) are key observations.",
    summary: "2FeSOâ‚„ â†’ Feâ‚‚Oâ‚ƒ + SOâ‚‚â†‘ + SOâ‚ƒâ†‘. Endothermic decomposition. Three colour stages.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-water-electrolysis",
    title: "Electrolysis of Water",
    objective: "Decompose water into hydrogen and oxygen by passing electric current and verify the 2:1 volume ratio.",
    theory: "Water is a stable compound that can be decomposed by electricity (electrolysis). Hydrogen is produced at the cathode (negative electrode) and oxygen at the anode (positive electrode) in a 2:1 volume ratio.\n\nReaction: 2Hâ‚‚O â†’ 2Hâ‚‚ + Oâ‚‚",
    apparatus: "Hoffmann voltameter or beakers with electrodes\nDC power supply (6â€“12V)\nInert electrodes (carbon or platinum)\nDilute Hâ‚‚SOâ‚„ or NaOH solution",
    procedure: "Fill the apparatus with acidified water.\nConnect to DC supply and switch on.\nObserve bubble formation at both electrodes.\nCollect gases and test: Hâ‚‚ with a burning splint (pops), Oâ‚‚ relights a glowing splint.",
    expectedResult: "Twice the volume of gas (Hâ‚‚) collects at the cathode compared to oxygen at the anode. Hâ‚‚ burns with a squeaky pop; Oâ‚‚ relights a glowing splint.",
    explanation: "Electrolysis breaks chemical bonds using electrical energy â€” an endothermic decomposition. Dilute acid or base is added to improve conductivity (pure water is a poor conductor).",
    hints: "The 2:1 ratio reflects the formula Hâ‚‚O â€” two H atoms for every one O atom.",
    summary: "2Hâ‚‚O â†’ 2Hâ‚‚(g) + Oâ‚‚(g). Electrolytic decomposition. Hâ‚‚:Oâ‚‚ = 2:1 by volume.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-iron-cuso4",
    title: "Iron Displaces Copper from Copper Sulphate",
    objective: "Demonstrate a displacement reaction and observe the colour change and copper deposition.",
    theory: "Iron is more reactive than copper in the reactivity series. Fe displaces CuÂ²âº from CuSOâ‚„ solution, forming pale green FeSOâ‚„ solution and depositing red-brown metallic copper.\n\nReaction: Fe + CuSOâ‚„ â†’ FeSOâ‚„ + Cu",
    apparatus: "Iron nails (clean, rust-free)\nCopper sulphate solution (blue)\nBeaker",
    procedure: "Pour blue CuSOâ‚„ solution into a beaker.\nPlace clean iron nails into the solution.\nLeave for 15â€“20 minutes.\nObserve colour change in solution and deposit on nails.",
    expectedResult: "The blue CuSOâ‚„ solution turns pale green (FeSOâ‚„). Red-brown metallic copper deposits on the iron nails.",
    explanation: "Fe is higher than Cu in the reactivity series, so it displaces CuÂ²âº ions from solution. Feâ†’FeÂ²âº (oxidation) and CuÂ²âºâ†’Cu (reduction) â€” a redox reaction.",
    hints: "The more Fe nails you add, the more copper deposits. Leave overnight for a thick coating.",
    summary: "Fe + CuSOâ‚„ â†’ FeSOâ‚„ + Cu. Displacement + redox. Blue â†’ green solution.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-zn-hcl",
    title: "Zinc Reacts with Hydrochloric Acid",
    objective: "Study the displacement of hydrogen gas by zinc from dilute HCl.",
    theory: "Zinc is above hydrogen in the reactivity series. It displaces hydrogen from dilute HCl, producing zinc chloride solution and hydrogen gas. The reaction is exothermic.\n\nReaction: Zn + 2HCl â†’ ZnClâ‚‚ + Hâ‚‚â†‘",
    apparatus: "Zinc granules or pieces\nDilute hydrochloric acid\nTest tube\nDelivery tube",
    procedure: "Place zinc in a test tube.\nAdd dilute HCl.\nObserve vigorous bubbling.\nTest the gas with a burning splint (squeaky pop confirms Hâ‚‚).\nTouch the test tube â€” notice the warmth.",
    expectedResult: "Vigorous effervescence of Hâ‚‚ gas. Zinc dissolves. Solution warms up. Burning splint test gives a squeaky pop.",
    explanation: "This is both a displacement reaction (Zn displaces H from acid) and a redox reaction (Zn oxidised to ZnÂ²âº, Hâº reduced to Hâ‚‚). The heat release confirms it is exothermic.",
    hints: "The squeaky-pop test with a burning splint is the standard test for hydrogen gas.",
    summary: "Zn + 2HCl â†’ ZnClâ‚‚ + Hâ‚‚â†‘. Displacement, exothermic. Pop test for Hâ‚‚.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-lead-iodide",
    title: "Lead Iodide Precipitation",
    objective: "Observe a double displacement reaction producing a bright yellow precipitate.",
    theory: "When lead nitrate and potassium iodide solutions are mixed, lead iodide (PbIâ‚‚) precipitates immediately as a bright yellow solid. This is a double displacement and precipitation reaction.\n\nReaction: Pb(NOâ‚ƒ)â‚‚ + 2KI â†’ PbIâ‚‚â†“ + 2KNOâ‚ƒ",
    apparatus: "Lead nitrate solution\nPotassium iodide solution\nTwo test tubes or beakers",
    procedure: "Prepare solutions of Pb(NOâ‚ƒ)â‚‚ and KI separately.\nPour one solution into the other.\nObserve the instant bright yellow precipitate.\nFilter and dry to collect PbIâ‚‚.",
    expectedResult: "A bright canary-yellow precipitate of PbIâ‚‚ forms instantly when the solutions are mixed.",
    explanation: "In double displacement, the ions exchange partners. PbÂ²âº pairs with Iâ» to form insoluble PbIâ‚‚. The driving force is formation of an insoluble product.",
    hints: "Note: Lead compounds are toxic â€” handle with care and wash hands afterwards.",
    summary: "Pb(NOâ‚ƒ)â‚‚ + 2KI â†’ PbIâ‚‚â†“ + 2KNOâ‚ƒ. Double displacement + precipitation.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-baso4",
    title: "Barium Sulphate Precipitation",
    objective: "Confirm the presence of sulphate ions using a precipitation reaction.",
    theory: "Barium chloride reacts with sulphuric acid or sulphate salts to produce barium sulphate, a white insoluble precipitate. BaSOâ‚„ is insoluble even in dilute HCl â€” this distinguishes it from other white precipitates.\n\nReaction: BaClâ‚‚ + Hâ‚‚SOâ‚„ â†’ BaSOâ‚„â†“ + 2HCl",
    apparatus: "Barium chloride solution\nDilute sulphuric acid (or sulphate solution)\nTest tube",
    procedure: "Take BaClâ‚‚ solution in a test tube.\nAdd a few drops of dilute Hâ‚‚SOâ‚„.\nObserve the white precipitate immediately.\nAdd dilute HCl â€” precipitate should not dissolve.",
    expectedResult: "Instant white precipitate of BaSOâ‚„. It does NOT dissolve in dilute HCl â€” confirming sulphate ions.",
    explanation: "Insolubility in dilute HCl is the key distinguishing feature of BaSOâ‚„. This reaction is the standard confirmatory test for SOâ‚„Â²â» ions.",
    summary: "BaClâ‚‚ + Hâ‚‚SOâ‚„ â†’ BaSOâ‚„â†“ + 2HCl. White ppt., insoluble in HCl. Test for SOâ‚„Â²â».",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-cu-oxidation",
    title: "Oxidation of Copper",
    objective: "Observe the oxidation of copper on heating and the formation of black copper oxide.",
    theory: "Copper reacts with atmospheric oxygen on heating to form black copper(II) oxide. This is a combination and oxidation reaction.\n\nReaction: 2Cu + Oâ‚‚ â†’ 2CuO",
    apparatus: "Copper foil or wire\nBunsen burner\nTongs",
    procedure: "Hold a piece of copper with tongs.\nHeat it in the burner flame for a few minutes.\nObserve the colour change on the surface.\nRemove from flame and let it cool.",
    expectedResult: "The shiny red-orange copper turns black on the surface. The black coating is copper(II) oxide (CuO).",
    explanation: "Cu atoms on the surface react with Oâ‚‚ from air. Copper is oxidised (loses electrons â†’ CuÂ²âº). This is an exothermic combination reaction.",
    hints: "If you then reduce the black CuO with hydrogen gas, the copper colour returns â€” demonstrating CuO reduction.",
    summary: "2Cu + Oâ‚‚ â†’ 2CuO. Oxidation, combination, exothermic. Redâ†’Black.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "hard", type: "chem-cuo-reduction",
    title: "Reduction of Copper Oxide",
    objective: "Reduce black copper oxide using hydrogen gas to recover red copper metal.",
    theory: "CuO can be reduced by hydrogen gas. The hydrogen removes the oxygen from CuO, acting as the reducing agent. CuO is the oxidising agent. This is a redox reaction.\n\nReaction: CuO + Hâ‚‚ â†’ Cu + Hâ‚‚O",
    apparatus: "Black copper oxide (CuO powder)\nHydrogen gas supply\nHard glass test tube\nDelivery tube\nBunsen burner",
    procedure: "Place CuO in a hard glass test tube.\nPass dry hydrogen gas through the tube.\nHeat the CuO gently with a burner.\nObserve colour change.\nContinue until complete reduction.\nAllow Hâ‚‚ to flow until tube cools (prevents re-oxidation).",
    expectedResult: "Black CuO turns red/orange as Cu metal is restored. Water droplets appear at the open end of the tube.",
    explanation: "CuO is reduced (oxygen removed) â†’ Cu. Hâ‚‚ is oxidised (gains oxygen) â†’ Hâ‚‚O. Reduction requires the reducing agent to be present simultaneously â€” hence passing Hâ‚‚ while heating.",
    hints: "Keep Hâ‚‚ flowing until the tube cools to prevent freshly formed Cu from re-oxidising.",
    summary: "CuO + Hâ‚‚ â†’ Cu + Hâ‚‚O. CuO is oxidising agent; Hâ‚‚ is reducing agent. Redox.",
  },

  /* â”€â”€ Chapter 2: Acids, Bases and Salts â”€â”€ */
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-acid-metal",
    title: "Acid + Metal Reaction",
    objective: "Study the reaction of dilute acids with metals and identify which metals react.",
    theory: "Metals above hydrogen in the reactivity series displace Hâ‚‚ from dilute acids. Metals below hydrogen (like Cu) do not react with dilute HCl or Hâ‚‚SOâ‚„.\n\nExample: Zn + 2HCl â†’ ZnClâ‚‚ + Hâ‚‚â†‘",
    apparatus: "Zinc, iron, and copper pieces\nDilute HCl\nTest tubes\nBurning splint",
    procedure: "Add each metal (Zn, Fe, Cu) to dilute HCl in separate test tubes.\nObserve which metals produce gas.\nTest gas with a burning splint.",
    expectedResult: "Zn and Fe produce Hâ‚‚ gas (squeaky pop). Copper shows no reaction.",
    explanation: "Reactivity series determines which metals react. Only metals above H react with dilute acids to produce hydrogen gas.",
    hints: "Try the experiment with dilute Hâ‚‚SOâ‚„ too â€” the pattern will be identical.",
    summary: "Metals above H displace Hâ‚‚ from acids. Cu (below H) does not react.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-co2-evolution",
    title: "COâ‚‚ Evolution from Carbonates",
    objective: "Demonstrate that acids react with carbonates to produce COâ‚‚ gas.",
    theory: "Acids react with metal carbonates and bicarbonates to produce a salt, water, and carbon dioxide gas. The COâ‚‚ causes effervescence.\n\nReaction: Naâ‚‚COâ‚ƒ + 2HCl â†’ 2NaCl + Hâ‚‚O + COâ‚‚â†‘",
    apparatus: "Sodium carbonate powder\nDilute HCl\nTest tube\nDelivery tube\nLime water",
    procedure: "Add Naâ‚‚COâ‚ƒ to dilute HCl in a test tube.\nObserve vigorous effervescence.\nPass the evolved gas through lime water.\nObserve the lime water turning milky.",
    expectedResult: "Vigorous effervescence (COâ‚‚ gas). Lime water turns milky â€” confirming COâ‚‚.",
    explanation: "The carbonate ion (COâ‚ƒÂ²â») reacts with Hâº ions. COâ‚‚ is a product of most carbonate + acid reactions. The lime water test is the standard confirmation for COâ‚‚.",
    summary: "Naâ‚‚COâ‚ƒ + 2HCl â†’ 2NaCl + Hâ‚‚O + COâ‚‚â†‘. Acid + carbonate â†’ COâ‚‚ (effervescence).",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-lime-water",
    title: "Lime Water COâ‚‚ Test",
    objective: "Use lime water as a test to detect the presence of carbon dioxide.",
    theory: "Carbon dioxide reacts with calcium hydroxide (lime water) to form a white precipitate of calcium carbonate, turning the solution milky. Excess COâ‚‚ redissolves the precipitate.\n\nReaction: Ca(OH)â‚‚ + COâ‚‚ â†’ CaCOâ‚ƒâ†“ + Hâ‚‚O",
    apparatus: "Lime water\nCOâ‚‚ source (from acid + carbonate)\nDelivery tube\nTest tube",
    procedure: "Prepare lime water (Ca(OH)â‚‚ solution).\nBlow COâ‚‚ into the lime water through a tube.\nObserve the solution turning milky.\nContinue blowing â€” observe milkiness disappear with excess COâ‚‚.",
    expectedResult: "Lime water turns milky (CaCOâ‚ƒ precipitate). Excess COâ‚‚ clears it again (forms soluble Ca(HCOâ‚ƒ)â‚‚).",
    explanation: "First COâ‚‚: Ca(OH)â‚‚ + COâ‚‚ â†’ CaCOâ‚ƒâ†“ + Hâ‚‚O (milky). Excess COâ‚‚: CaCOâ‚ƒ + COâ‚‚ + Hâ‚‚O â†’ Ca(HCOâ‚ƒ)â‚‚ (clear again). This is a classic demonstration of COâ‚‚ detection.",
    hints: "The temporary milkiness and then clearing with excess COâ‚‚ is a commonly asked observation.",
    summary: "Ca(OH)â‚‚ + COâ‚‚ â†’ CaCOâ‚ƒâ†“ + Hâ‚‚O (milky). Excess COâ‚‚ clears the precipitate.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-neutralization",
    title: "Neutralization â€” HCl + NaOH",
    objective: "Observe how acid and base neutralize each other and track pH change with an indicator.",
    theory: "In a neutralization reaction, an acid and a base react to form a salt and water. The pH changes from acidic to neutral (7) at the equivalence point.\n\nReaction: HCl + NaOH â†’ NaCl + Hâ‚‚O",
    apparatus: "HCl solution\nNaOH solution\nBurette\nConical flask\nPhenolphthalein or universal indicator\npH meter (or pH paper)",
    procedure: "Take HCl in a conical flask with a few drops of phenolphthalein (colourless in acid).\nAdd NaOH dropwise from the burette.\nShake and observe colour change.\nRecord the volume of NaOH at the endpoint (colourless â†’ pink).",
    expectedResult: "Phenolphthalein turns pink at the equivalence point. pH changes from 1 to 7 to 13 as NaOH is added.",
    explanation: "Hâº + OHâ» â†’ Hâ‚‚O. At equivalence, all Hâº is consumed. The heat produced can be measured â€” neutralization is exothermic (~57 kJ/mol).",
    hints: "The endpoint is when one drop of NaOH causes a permanent colour change that lasts 30 seconds.",
    summary: "HCl + NaOH â†’ NaCl + Hâ‚‚O. Neutralization is exothermic. pH = 7 at equivalence.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "hard", type: "chem-brine-electrolysis",
    title: "Electrolysis of Brine â€” Chlor-Alkali Process",
    objective: "Understand the industrial electrolysis of sodium chloride solution producing Clâ‚‚, Hâ‚‚ and NaOH.",
    theory: "Electrolysis of concentrated NaCl solution (brine) produces three important chemicals: chlorine (Clâ‚‚) at the anode, hydrogen (Hâ‚‚) at the cathode, and sodium hydroxide (NaOH) in the solution.\n\nReaction: 2NaCl + 2Hâ‚‚O â†’ 2NaOH + Hâ‚‚â†‘ + Clâ‚‚â†‘",
    apparatus: "Concentrated NaCl solution\nInert electrodes\nDC power supply\nCollection tubes",
    procedure: "Set up the electrolysis apparatus with brine.\nSwitch on the DC supply.\nCollect gases at each electrode.\nTest: Clâ‚‚ bleaches litmus paper; Hâ‚‚ gives a pop with burning splint.",
    expectedResult: "Clâ‚‚ (yellowy-green, bleaches litmus) collects at anode. Hâ‚‚ (colourless, pops) collects at cathode. NaOH forms in solution.",
    explanation: "At anode: 2Clâ» â†’ Clâ‚‚ + 2eâ». At cathode: 2Hâ‚‚O + 2eâ» â†’ Hâ‚‚ + 2OHâ». OHâ» + Naâº â†’ NaOH in solution. All three products are commercially important.",
    hints: "Uses: Clâ‚‚ in water treatment and PVC; Hâ‚‚ in hydrogenation; NaOH in soap, paper, and de-greasing.",
    summary: "2NaCl + 2Hâ‚‚O â†’ 2NaOH + Hâ‚‚ + Clâ‚‚. Chlor-alkali process. Three useful products.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-nahco3-heat",
    title: "Decomposition of Baking Soda",
    objective: "Observe the thermal decomposition of sodium hydrogen carbonate.",
    theory: "Sodium bicarbonate (NaHCOâ‚ƒ) decomposes on heating to give sodium carbonate, carbon dioxide, and water. This reaction is the reason baked goods rise during cooking.\n\nReaction: 2NaHCOâ‚ƒ â†’ Naâ‚‚COâ‚ƒ + Hâ‚‚O + COâ‚‚â†‘",
    apparatus: "Baking soda (NaHCOâ‚ƒ)\nBoiling tube\nBunsen burner\nLime water",
    procedure: "Place baking soda in a boiling tube.\nHeat gently with a burner.\nPass evolved gas through lime water.\nObserve milky lime water (COâ‚‚).\nNote the residue (Naâ‚‚COâ‚ƒ).",
    expectedResult: "COâ‚‚ gas evolved turns lime water milky. White residue of Naâ‚‚COâ‚ƒ remains. Naâ‚‚COâ‚ƒ gives a more alkaline solution than NaHCOâ‚ƒ.",
    explanation: "The COâ‚‚ released causes bread and cakes to rise (making them light and fluffy). Naâ‚‚COâ‚ƒ is the solid residue â€” it is more alkaline, which is why over-baked goods can taste bitter.",
    hints: "Test the residue with litmus â€” Naâ‚‚COâ‚ƒ is more strongly alkaline than NaHCOâ‚ƒ.",
    summary: "2NaHCOâ‚ƒ â†’ Naâ‚‚COâ‚ƒ + Hâ‚‚O + COâ‚‚â†‘. Endothermic decomposition. COâ‚‚ leavens bread.",
  },

  /* â”€â”€ Chapter 3: Metals and Non-metals â”€â”€ */
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "hard", type: "chem-na-water",
    title: "Sodium Reacts with Water",
    objective: "Observe the vigorous reaction of sodium metal with water and identify the products.",
    theory: "Sodium is highly reactive and reacts explosively with water, releasing hydrogen gas and forming sodium hydroxide (a strong alkali). The heat released may ignite the Hâ‚‚.\n\nReaction: 2Na + 2Hâ‚‚O â†’ 2NaOH + Hâ‚‚â†‘",
    apparatus: "Sodium metal (stored in kerosene)\nTrough of water\nTongs\nUniversal indicator",
    procedure: "Add a few drops of universal indicator to water.\nUsing tongs, take a tiny piece of sodium from kerosene.\nDry briefly and drop it on the water surface.\nObserve carefully from a safe distance.",
    expectedResult: "Sodium floats, melts into a silver ball, moves rapidly, and may catch fire. Hâ‚‚ gas is released. Solution turns purple/blue â€” strongly alkaline (NaOH).",
    explanation: "Sodium is stored in kerosene because it reacts violently with air moisture and water. The Na melts due to the heat of its own reaction. Do not use large pieces â€” very dangerous.",
    hints: "Potassium reacts even more violently â€” always ignites Hâ‚‚. Never use large pieces of alkali metals.",
    summary: "2Na + 2Hâ‚‚O â†’ 2NaOH + Hâ‚‚â†‘. Vigorous exothermic. NaOH is strongly alkaline.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-amphoteric",
    title: "Amphoteric Nature of Aluminium Oxide",
    objective: "Demonstrate that Alâ‚‚Oâ‚ƒ reacts with both acids and bases â€” amphoteric behaviour.",
    theory: "Alâ‚‚Oâ‚ƒ is an amphoteric oxide â€” it reacts with both acids and alkalis. With HCl: Alâ‚‚Oâ‚ƒ + 6HCl â†’ 2AlClâ‚ƒ + 3Hâ‚‚O. With NaOH: Alâ‚‚Oâ‚ƒ + 2NaOH â†’ 2NaAlOâ‚‚ + Hâ‚‚O. This is unlike acidic oxides (react only with bases) and basic oxides (react only with acids).",
    apparatus: "Aluminium oxide powder\nDilute HCl\nDilute NaOH\nTest tubes",
    procedure: "Divide Alâ‚‚Oâ‚ƒ into two test tubes.\nAdd dilute HCl to one â€” warm gently.\nAdd dilute NaOH to the other â€” warm gently.\nObserve dissolution in both cases.",
    expectedResult: "Alâ‚‚Oâ‚ƒ dissolves in dilute HCl forming AlClâ‚ƒ solution. Alâ‚‚Oâ‚ƒ also dissolves in NaOH forming sodium aluminate (NaAlOâ‚‚). This confirms its amphoteric nature.",
    explanation: "Amphoteric behaviour is common in metals in the p-block (Al, Zn, Pb, Sn). ZnO also shows the same behaviour: ZnO + Hâ‚‚SOâ‚„ â†’ ZnSOâ‚„ + Hâ‚‚O; ZnO + 2NaOH â†’ Naâ‚‚ZnOâ‚‚ + Hâ‚‚O.",
    hints: "ZnO is another common amphoteric oxide â€” learn its reactions with HCl and NaOH.",
    summary: "Alâ‚‚Oâ‚ƒ + 6HCl â†’ 2AlClâ‚ƒ + 3Hâ‚‚O; Alâ‚‚Oâ‚ƒ + 2NaOH â†’ 2NaAlOâ‚‚ + Hâ‚‚O. Amphoteric.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "hard", type: "chem-thermite",
    title: "Thermite Reaction",
    objective: "Observe how a highly reactive metal (Al) reduces an oxide of a less reactive metal (Fe).",
    theory: "Aluminium reduces iron(III) oxide because Al is more reactive than Fe. The reaction releases enormous heat (~3500Â°C) producing molten iron and aluminium oxide slag.\n\nReaction: Feâ‚‚Oâ‚ƒ + 2Al â†’ Alâ‚‚Oâ‚ƒ + 2Fe + Heat (~3500Â°C)",
    apparatus: "Iron(III) oxide (Feâ‚‚Oâ‚ƒ) powder\nAluminium powder\nCrucible on sand\nMagnesium ribbon (igniter)\nSafety screen",
    procedure: "Mix Feâ‚‚Oâ‚ƒ and Al powder in a 3:1 mass ratio in a clay crucible.\nIgnite with a Mg ribbon (requires high temperature to initiate).\nStand back â€” observe the intense reaction.\nAfter cooling, find molten iron beads in the slag.",
    expectedResult: "Intense bright light and heat (~3500Â°C). Molten iron beads form at the bottom of the crucible. Alâ‚‚Oâ‚ƒ slag remains on top.",
    explanation: "More reactive metal (Al) displaces less reactive metal (Fe) from its oxide â€” a displacement reaction. The enormous energy release is harnessed in thermite welding for railway tracks.",
    hints: "Thermite welding is used to join railway rails in the field â€” the molten Fe flows into the gap and solidifies.",
    summary: "Feâ‚‚Oâ‚ƒ + 2Al â†’ Alâ‚‚Oâ‚ƒ + 2Fe + heat (~3500Â°C). Al displaces Fe. Used in rail welding.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-reactivity-series",
    title: "Metal Reactivity Series",
    objective: "Understand and apply the reactivity series to predict displacement reactions.",
    theory: "The reactivity series ranks metals in decreasing order of reactivity: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au. A more reactive metal displaces a less reactive metal from its salt solution.",
    apparatus: "Zinc, copper, iron pieces\nZnSOâ‚„, CuSOâ‚„, FeSOâ‚„ solutions\nTest tubes",
    procedure: "Add iron nail to CuSOâ‚„ â€” observe Cu deposition.\nAdd copper wire to ZnSOâ‚„ â€” observe no reaction.\nAdd zinc to FeSOâ‚„ â€” observe Fe deposition.\nRecord results in a table.",
    expectedResult: "Fe displaces Cu (Fe > Cu). Cu cannot displace Zn (Cu < Zn). Zn displaces Fe (Zn > Fe). Confirms the reactivity order Zn > Fe > Cu.",
    explanation: "A metal can only displace metals below it in the series from their salt solutions. This principle governs corrosion, galvanisation, and extraction of metals.",
    hints: "Galvanisation (coating Fe with Zn) works because Zn is more reactive â€” it corrodes preferentially protecting Fe.",
    summary: "Reactivity series: K>Na>Ca>Mg>Al>Zn>Fe>H>Cu>Ag>Au. Higher displaces lower.",
  },

  /* â”€â”€ Chapter 4: Carbon and its Compounds â”€â”€ */
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "easy", type: "chem-methane-combustion",
    title: "Combustion of Methane",
    objective: "Study the complete combustion of methane (natural gas) and identify the products.",
    theory: "Methane undergoes complete combustion in excess oxygen to produce COâ‚‚ and Hâ‚‚O. The flame is blue. This reaction releases a large amount of energy.\n\nReaction: CHâ‚„ + 2Oâ‚‚ â†’ COâ‚‚ + 2Hâ‚‚O + Heat",
    apparatus: "Methane gas supply (or candle)\nBurner\nDry cobalt chloride paper\nLime water",
    procedure: "Ignite the methane burner.\nHold a dry cold surface above flame â€” observe water droplets.\nTest droplets with cobalt chloride paper (turns pink).\nBubble gas products through lime water.",
    expectedResult: "Blue flame. Water droplets form on cold surface (cobalt chloride turns pink). Lime water turns milky (COâ‚‚ produced).",
    explanation: "Complete combustion requires excess oxygen. The blue colour of the flame indicates complete combustion. Incomplete combustion gives a yellow/orange sooty flame and CO (toxic).",
    hints: "LPG and natural gas undergo complete combustion in properly adjusted burners â€” hence the blue flame.",
    summary: "CHâ‚„ + 2Oâ‚‚ â†’ COâ‚‚ + 2Hâ‚‚O. Complete combustion: blue flame. Produces COâ‚‚ and Hâ‚‚O.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-hydrogenation",
    title: "Hydrogenation of Ethene",
    objective: "Understand how hydrogen adds across the C=C double bond to convert an unsaturated compound to a saturated one.",
    theory: "Hydrogenation is an addition reaction in which Hâ‚‚ adds across a double bond converting unsaturated hydrocarbons (oils) into saturated fats. A nickel catalyst and 150Â°C are needed.\n\nReaction: CHâ‚‚=CHâ‚‚ + Hâ‚‚ â†’ CHâ‚ƒâ€“CHâ‚ƒ (Ni, 150Â°C)",
    apparatus: "Bromine water (test reagent)\nEthene or ethylene gas\nHydrogen gas cylinder\nNickel catalyst\nReaction flask",
    procedure: "Pass ethene through bromine water â€” it decolourises it (confirms double bond).\nAdd ethene and Hâ‚‚ over Ni catalyst at 150Â°C.\nTest the product with bromine water â€” no decolourisation (double bond gone).\nNote the product is ethane (saturated).",
    expectedResult: "Unsaturated ethene decolourises bromine water. After hydrogenation, the product (ethane) does NOT decolourise bromine water â€” the double bond is gone.",
    explanation: "The C=C double bond breaks and each carbon gains one H atom. This is the basis of making vanaspati ghee from vegetable oils (liquid â†’ solid fats). Bromine water is the standard test for unsaturation.",
    hints: "The bromine water test is the key: unsaturated compounds decolourise it instantly; saturated compounds do not.",
    summary: "Câ‚‚Hâ‚„ + Hâ‚‚ â†’ Câ‚‚Hâ‚† (Ni catalyst, 150Â°C). Addition reaction. Unsaturated â†’ saturated.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-ethanol-na",
    title: "Ethanol Reacts with Sodium",
    objective: "Show that ethanol contains an OH group that reacts with sodium, but more slowly than water.",
    theory: "Sodium reacts with ethanol to produce sodium ethoxide and hydrogen gas. The reaction is similar to Na + water but significantly slower, indicating that the OH group in ethanol is less reactive than in water.\n\nReaction: 2Câ‚‚Hâ‚…OH + 2Na â†’ 2Câ‚‚Hâ‚…ONa + Hâ‚‚â†‘",
    apparatus: "Dry absolute ethanol\nSodium metal (small piece)\nDry test tube\nDelivery tube",
    procedure: "Take dry ethanol in a test tube.\nAdd a small, dry piece of sodium.\nObserve steady Hâ‚‚ evolution (not vigorous).\nTest gas with a burning splint.\nCompare to Na + water in a separate tube.",
    expectedResult: "Hâ‚‚ gas evolves steadily (squeaky pop). The reaction is much slower and calmer than Na + water, confirming ethanol's OH group is a weaker acid.",
    explanation: "The â€“OH group in alcohols can donate Hâº to sodium, but less readily than water. This shows the â€“OH in alcohols is covalently bonded and less ionisable, unlike the â€“OH in NaOH (ionic).",
    hints: "The slower rate compared to Na + water shows that the Câ€“O bond makes the OH less reactive than in Hâ‚‚O.",
    summary: "2Câ‚‚Hâ‚…OH + 2Na â†’ 2Câ‚‚Hâ‚…ONa + Hâ‚‚â†‘. Slower than Na + Hâ‚‚O. Shows OH in alcohol is covalent.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-esterification",
    title: "Esterification â€” Formation of Ester",
    objective: "Synthesise a sweet-smelling ester from an alcohol and a carboxylic acid using a catalyst.",
    theory: "Esterification is the reaction between a carboxylic acid and an alcohol (with concentrated Hâ‚‚SOâ‚„ catalyst and heat) to form an ester and water. Esters have pleasant fruity odours.\n\nReaction: Câ‚‚Hâ‚…OH + CHâ‚ƒCOOH â‡Œ CHâ‚ƒCOOCâ‚‚Hâ‚… + Hâ‚‚O (Hâ‚‚SOâ‚„, heat)",
    apparatus: "Ethanol\nGlacial acetic acid (ethanoic acid)\nConcentrated Hâ‚‚SOâ‚„\nRound-bottom flask\nWater bath\nDistillation setup",
    procedure: "Mix ethanol and glacial acetic acid in a flask.\nAdd a few drops of concentrated Hâ‚‚SOâ‚„.\nHeat gently in a warm water bath for 5 minutes.\nPour the product into sodium carbonate solution (neutralises acid).\nSmell the ester layer (fruity odour).",
    expectedResult: "A pleasant fruity-smelling liquid (ethyl ethanoate / ethyl acetate) forms in the organic layer. It smells like pear drops or nail-polish remover.",
    explanation: "Hâ‚‚SOâ‚„ is a catalyst â€” it speeds up but is not consumed. The reaction is reversible (â‡Œ), so yield is improved by removing the ester or adding excess of one reactant. Esters are used in perfumes and food flavouring.",
    hints: "Esters are named: alcohol part (ethyl) + acid part (ethanoate). Ethyl ethanoate smells like pear drops.",
    summary: "Câ‚‚Hâ‚…OH + CHâ‚ƒCOOH â‡Œ CHâ‚ƒCOOCâ‚‚Hâ‚… + Hâ‚‚O. Reversible, Hâ‚‚SOâ‚„ catalyst. Fruity smell.",
  },
  {
    subject: "Chemistry", classLevel: "Class X", difficulty: "medium", type: "chem-soap-hard-water",
    title: "Soap in Hard Water â€” Scum Formation",
    objective: "Understand why soap does not lather in hard water and how scum forms.",
    theory: "Soap is sodium stearate (RCOONa). Hard water contains CaÂ²âº and MgÂ²âº ions. These react with soap to form insoluble calcium/magnesium stearate (scum), wasting soap and preventing lathering.\n\nReaction: 2RCOONa + CaClâ‚‚ â†’ (RCOO)â‚‚Caâ†“ + 2NaCl",
    apparatus: "Soap solution\nSoft water (distilled)\nHard water (CaClâ‚‚ or MgSOâ‚„ solution)\nTest tubes",
    procedure: "Add equal amounts of soap to two test tubes.\nAdd soft water to one, hard water to the other.\nShake vigorously.\nObserve lather in soft water and scum in hard water.",
    expectedResult: "Soft water: rich lather forms easily. Hard water: no lather â€” instead a white scum (calcium stearate) floats on top.",
    explanation: "The insoluble scum is calcium or magnesium stearate â€” it does not clean. Hard water must be softened before soap can be used effectively. Detergents (synthetic) do not form scum and work in hard water.",
    hints: "Detergents replaced soap for laundry because they work in hard water by not forming scum.",
    summary: "Hard water (CaÂ²âº/MgÂ²âº) + soap â†’ insoluble scum. No lather. Detergents avoid this problem.",
  },
];

async function run() {
  let inserted = 0;
  let skipped = 0;
  for (const s of seeds) {
    const existingSnap = await db.collection("experiments")
      .where("subject", "==", s.subject)
      .where("type", "==", s.type)
      .limit(1)
      .get();
      
    if (!existingSnap.empty) {
      skipped++;
      continue;
    }
    await db.collection("experiments").add({
      subject: s.subject,
      classLevel: s.classLevel,
      difficulty: s.difficulty,
      type: s.type,
      title: s.title,
      objective: s.objective,
      theory: s.theory,
      apparatus: s.apparatus,
      procedure: s.procedure,
      expectedResult: s.expectedResult,
      explanation: s.explanation,
      hints: s.hints ?? null,
      summary: s.summary ?? null,
      createdAt: new Date(),
    });
    inserted++;
    console.log(`  + ${s.subject} / ${s.title}`);
  }
  console.log(`\nDone. Inserted: ${inserted}, Skipped (already exist): ${skipped}`);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
