import { z } from "zod";

export const insertStudentSchema = z.object({
  phone: z.string(),
  name: z.string(),
  classLevel: z.enum(["Class IX", "Class X"]),
  medium: z.enum(["Assamese", "English"]),
  board: z.enum(["SEBA", "CBSE"]),
});

export const studentSchema = insertStudentSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  lastLogin: z.date().default(() => new Date()),
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = z.infer<typeof studentSchema>;
