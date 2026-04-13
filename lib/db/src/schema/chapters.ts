import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { subjectsTable } from "./subjects";

export const chaptersTable = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjectsTable.id, { onDelete: "cascade" }),
  classLevel: text("class_level", { enum: ["Class IX", "Class X"] }).notNull(),
  title: text("title").notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChapterSchema = createInsertSchema(chaptersTable).omit({ id: true, createdAt: true });
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chaptersTable.$inferSelect;
