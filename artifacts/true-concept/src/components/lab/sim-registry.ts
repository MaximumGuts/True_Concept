import { lazy, type LazyExoticComponent } from "react";

type SimComp = LazyExoticComponent<() => JSX.Element>;

export const simRegistry: Record<string, SimComp> = {
  // Motion
  "distance-time": lazy(() => import("./sims/motion").then((m) => ({ default: m.DistanceTimeSim }))),
  "velocity-time": lazy(() => import("./sims/motion").then((m) => ({ default: m.VelocityTimeSim }))),
  "free-fall": lazy(() => import("./sims/motion").then((m) => ({ default: m.FreeFallSim }))),
  "motion-accel": lazy(() => import("./sims/motion").then((m) => ({ default: m.MotionAccelSim }))),
  "kinetic-energy": lazy(() => import("./sims/motion").then((m) => ({ default: m.KineticEnergySim }))),
  "potential-energy": lazy(() => import("./sims/motion").then((m) => ({ default: m.PotentialEnergySim }))),
  "pendulum": lazy(() => import("./sims/motion").then((m) => ({ default: m.PendulumSim }))),
  // Gravitation & Fluids
  "gravitation": lazy(() => import("./sims/gravitation-fluids").then((m) => ({ default: m.GravitationSim }))),
  "archimedes": lazy(() => import("./sims/gravitation-fluids").then((m) => ({ default: m.ArchimedesSim }))),
  "density": lazy(() => import("./sims/gravitation-fluids").then((m) => ({ default: m.DensitySim }))),
  // Optics
  "reflection": lazy(() => import("./sims/optics").then((m) => ({ default: m.ReflectionSim }))),
  "plane-mirror": lazy(() => import("./sims/optics").then((m) => ({ default: m.PlaneMirrorSim }))),
  "convex-lens": lazy(() => import("./sims/optics").then((m) => ({ default: m.ConvexLensSim }))),
  "refraction": lazy(() => import("./sims/optics").then((m) => ({ default: m.RefractionSim }))),
  "power-of-lens": lazy(() => import("./sims/optics").then((m) => ({ default: m.PowerOfLensSim }))),
  // Electricity
  "ohms-law": lazy(() => import("./sims/electricity").then((m) => ({ default: m.OhmsLawSim }))),
  "series-circuit": lazy(() => import("./sims/electricity").then((m) => ({ default: m.SeriesCircuitSim }))),
  "parallel-circuit": lazy(() => import("./sims/electricity").then((m) => ({ default: m.ParallelCircuitSim }))),
  "heating-effect": lazy(() => import("./sims/electricity").then((m) => ({ default: m.HeatingEffectSim }))),
  // Sound
  "sound-wave": lazy(() => import("./sims/sound").then((m) => ({ default: m.SoundWaveSim }))),
  "pitch": lazy(() => import("./sims/sound").then((m) => ({ default: m.PitchSim }))),
  "echo": lazy(() => import("./sims/sound").then((m) => ({ default: m.EchoSim }))),
  // Chemistry
  "filtration": lazy(() => import("./sims/chemistry").then((m) => ({ default: m.FiltrationSim }))),
  "crystallization": lazy(() => import("./sims/chemistry").then((m) => ({ default: m.CrystallizationSim }))),
  "ph-testing": lazy(() => import("./sims/chemistry").then((m) => ({ default: m.PHTestingSim }))),
  // Legacy (existing)
  "light-reflection": lazy(() => import("./LightReflection")),
  "light-refraction": lazy(() => import("./LightRefraction")),
  "electric-circuit": lazy(() => import("./ElectricCircuit")),
  "lens": lazy(() => import("./LensSim")),
  "magnet": lazy(() => import("./MagnetSim")),
};

export const SIM_TYPE_LABELS: Record<string, string> = {
  "distance-time": "Distance–Time Graph",
  "velocity-time": "Velocity–Time Graph",
  "free-fall": "Free Fall",
  "motion-accel": "Motion with Constant Acceleration",
  "gravitation": "Universal Gravitation",
  "archimedes": "Archimedes' Principle",
  "density": "Density Determination",
  "kinetic-energy": "Kinetic Energy",
  "potential-energy": "Potential Energy",
  "pendulum": "Pendulum / Conservation of Energy",
  "reflection": "Laws of Reflection",
  "plane-mirror": "Plane Mirror",
  "convex-lens": "Image Formation by Lens & Mirror",
  "refraction": "Refraction (Glass Slab)",
  "power-of-lens": "Power of Lens",
  "ohms-law": "Ohm's Law",
  "series-circuit": "Series Circuit",
  "parallel-circuit": "Parallel Circuit",
  "heating-effect": "Heating Effect of Current",
  "sound-wave": "Sound Wave",
  "pitch": "Frequency & Pitch",
  "echo": "Echo Delay",
  "filtration": "Filtration",
  "crystallization": "Crystallization",
  "ph-testing": "pH Testing with Indicators",
  "light-reflection": "Light Reflection (legacy)",
  "light-refraction": "Light Refraction (legacy)",
  "electric-circuit": "Electric Circuit (legacy)",
  "lens": "Lens (legacy)",
  "magnet": "Magnet (legacy)",
  "custom": "Custom (no simulation)",
};

export const SIM_EMOJIS: Record<string, string> = {
  "distance-time": "📈", "velocity-time": "📊", "free-fall": "🪂", "motion-accel": "🏃",
  "gravitation": "🪐", "archimedes": "🛁", "density": "⚖️",
  "kinetic-energy": "💨", "potential-energy": "📦", "pendulum": "🕰️",
  "reflection": "🪞", "plane-mirror": "🪞", "convex-lens": "🔭", "refraction": "🌈", "power-of-lens": "🔍",
  "ohms-law": "⚡", "series-circuit": "🔗", "parallel-circuit": "🔀", "heating-effect": "🔥",
  "sound-wave": "🌊", "pitch": "🎵", "echo": "📢",
  "filtration": "🧪", "crystallization": "💎", "ph-testing": "🧫",
  "light-reflection": "🪞", "light-refraction": "🌈", "electric-circuit": "⚡", "lens": "🔭", "magnet": "🧲", "custom": "🔬",
};
