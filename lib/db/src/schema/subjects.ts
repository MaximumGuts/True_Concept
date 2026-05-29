import { z } from "zod";

export const insertSubjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string().default("BookOpen"),
  classLevels: z.array(z.string()),
  color: z.string().default("#1e3a8a"),
});

export const subjectSchema = insertSubjectSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = z.infer<typeof subjectSchema>;
