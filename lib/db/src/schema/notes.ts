import { z } from "zod";

export const insertNoteSchema = z.object({
  chapterId: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.enum(["text", "pdf", "image"]).default("text"),
  fileUrl: z.string().nullable().optional(),
  youtubeId: z.string().nullable().optional(),
  order: z.number().default(0),
});

export const noteSchema = insertNoteSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = z.infer<typeof noteSchema>;
