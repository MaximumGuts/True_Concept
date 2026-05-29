import { z } from "zod";

export const SIM_TYPES = [
  "distance-time",
  "velocity-time",
  "free-fall",
  "motion-accel",
  "gravitation",
  "archimedes",
  "density",
  "kinetic-energy",
  "potential-energy",
  "pendulum",
  "reflection",
  "plane-mirror",
  "convex-lens",
  "refraction",
  "power-of-lens",
  "ohms-law",
  "series-circuit",
  "parallel-circuit",
  "heating-effect",
  "sound-wave",
  "pitch",
  "echo",
  "filtration",
  "crystallization",
  "ph-testing",
  "light-reflection",
  "light-refraction",
  "electric-circuit",
  "lens",
  "magnet",
  "custom",
] as const;

export const insertExperimentSchema = z.object({
  subject: z.enum(["Physics", "Chemistry"]).default("Physics"),
  classLevel: z.enum(["Class IX", "Class X"]),
  title: z.string(),
  objective: z.string(),
  theory: z.string().default(""),
  apparatus: z.string().default(""),
  procedure: z.string(),
  expectedResult: z.string(),
  explanation: z.string(),
  videoUrl: z.string().nullable().optional(),
  hints: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  type: z.enum(SIM_TYPES),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const experimentSchema = insertExperimentSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = z.infer<typeof experimentSchema>;
