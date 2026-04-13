import { pgTable, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { chaptersTable } from "./chapters";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  chapterId: integer("chapter_id").notNull().references(() => chaptersTable.id, { onDelete: "cascade" }),
  mcqScore: integer("mcq_score"),
  mcqTotal: integer("mcq_total"),
  visited: boolean("visited").notNull().default(false),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;
