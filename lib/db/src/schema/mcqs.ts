import { z } from "zod";

export const insertMcqSchema = z.object({
  chapterId: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string(),
  order: z.number().default(0),
  // Set grouping inside a chapter. Defaults to 1 so legacy MCQs that pre-date
  // this field land in "Set 1" without any backfill.
  setNumber: z.number().int().min(1).default(1),
});

export const mcqSchema = insertMcqSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertMcq = z.infer<typeof insertMcqSchema>;
export type Mcq = z.infer<typeof mcqSchema>;
