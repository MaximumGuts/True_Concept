import { z } from "zod";

/**
 * Full-Length Question Paper SETS.
 *
 * Sets are top-level admin-named containers shown to students under the
 * "📜 Full Length Question Papers" card on /subjects. They group related
 * papers (e.g. "Class X SEBA Mock 2025", "Mathematics Practice Papers").
 *
 * Class-level filtering is set-wide — admin tags the whole set as IX / X /
 * Both, and students see only sets matching their preferred class.
 */
export const insertPaperSetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  classLevel: z.enum(["Class IX", "Class X", "Both"]).default("Both"),
  order: z.number().int().default(0),
});

export const paperSetSchema = insertPaperSetSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertPaperSet = z.infer<typeof insertPaperSetSchema>;
export type PaperSet = z.infer<typeof paperSetSchema>;
