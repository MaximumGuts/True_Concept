import { z } from "zod";

/**
 * Individual full-length question papers.
 *
 * Each paper belongs to a paperSet. The content model mirrors notes —
 * markdown body with optional embedded YouTube videos and images. Students
 * read the paper exactly like reading a note, but without any unlock gate
 * or AI tracking (per product decision: papers are free practice material).
 */
export const insertPaperSchema = z.object({
  setId: z.string(),
  title: z.string().min(1),
  content: z.string(),
  /** Multi-video field (matches notes/qa). Legacy single-id field is also accepted on read. */
  youtubeIds: z.array(z.string()).optional().default([]),
  order: z.number().int().default(0),
});

export const paperSchema = insertPaperSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type Paper = z.infer<typeof paperSchema>;
