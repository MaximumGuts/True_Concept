import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { chaptersTable } from "./chapters";

export const qaTable = pgTable("qa", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull().references(() => chaptersTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  explanation: text("explanation").notNull(),
  youtubeId: text("youtube_id"),
  isImportant: boolean("is_important").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQaSchema = createInsertSchema(qaTable).omit({ id: true, createdAt: true });
export type InsertQa = z.infer<typeof insertQaSchema>;
export type QaItem = typeof qaTable.$inferSelect;
