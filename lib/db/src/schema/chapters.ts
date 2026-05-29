import { z } from "zod";

export const insertChapterSchema = z.object({
  subjectId: z.string(),
  classLevel: z.enum(["Class IX", "Class X"]),
  medium: z.enum(["Assamese", "English", "Both"]).default("Both"),
  title: z.string(),
  chapterNumber: z.number(),
  description: z.string(),
});

export const chapterSchema = insertChapterSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
