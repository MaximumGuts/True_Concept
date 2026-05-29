import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.enum(["admin", "student"]).default("student"),
});

export const userSchema = insertUserSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;
