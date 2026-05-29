import { z } from "zod";

export const insertVideoSchema = z.object({
  chapterId: z.string(),
  youtubeId: z.string(),
  title: z.string(),
  description: z.string(),
});

export const videoSchema = insertVideoSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = z.infer<typeof videoSchema>;
