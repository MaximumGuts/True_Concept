import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const experimentsTable = pgTable("experiments", {
  id: serial("id").primaryKey(),
  classLevel: text("class_level", { enum: ["Class IX", "Class X"] }).notNull(),
  title: text("title").notNull(),
  objective: text("objective").notNull(),
  procedure: text("procedure").notNull(),
  expectedResult: text("expected_result").notNull(),
  explanation: text("explanation").notNull(),
  type: text("type", { enum: ["light-reflection", "light-refraction", "electric-circuit", "lens", "magnet", "custom"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExperimentSchema = createInsertSchema(experimentsTable).omit({ id: true, createdAt: true });
export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = typeof experimentsTable.$inferSelect;
