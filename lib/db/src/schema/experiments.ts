import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

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

export const experimentsTable = pgTable("experiments", {
  id: serial("id").primaryKey(),
  subject: text("subject", { enum: ["Physics", "Chemistry"] }).notNull().default("Physics"),
  classLevel: text("class_level", { enum: ["Class IX", "Class X"] }).notNull(),
  title: text("title").notNull(),
  objective: text("objective").notNull(),
  theory: text("theory").notNull().default(""),
  apparatus: text("apparatus").notNull().default(""),
  procedure: text("procedure").notNull(),
  expectedResult: text("expected_result").notNull(),
  explanation: text("explanation").notNull(),
  videoUrl: text("video_url"),
  hints: text("hints"),
  summary: text("summary"),
  type: text("type", { enum: SIM_TYPES }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExperimentSchema = createInsertSchema(experimentsTable).omit({ id: true, createdAt: true });
export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = typeof experimentsTable.$inferSelect;
