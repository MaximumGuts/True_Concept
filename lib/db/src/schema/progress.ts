import { z } from "zod";

export const insertProgressSchema = z.object({
  userId: z.string(),
  chapterId: z.string(),
  mcqScore: z.number().nullable().optional(),
  mcqTotal: z.number().nullable().optional(),
  visited: z.boolean().default(false),
});

export const progressSchema = insertProgressSchema.extend({
  id: z.string(),
  lastAccessedAt: z.date().default(() => new Date()),
});

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = z.infer<typeof progressSchema>;
