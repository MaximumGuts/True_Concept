import { z } from "zod";

export const insertQaSchema = z.object({
  chapterId: z.string(),
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
  youtubeId: z.string().nullable().optional(),
  isImportant: z.boolean().default(false),
  order: z.number().default(0),
});

export const qaSchema = insertQaSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertQa = z.infer<typeof insertQaSchema>;
export type QaItem = z.infer<typeof qaSchema>;
