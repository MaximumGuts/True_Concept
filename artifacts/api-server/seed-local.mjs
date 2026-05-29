/**
 * Seeds local Firestore emulator with demo users and subjects.
 * Run: node seed-local.mjs
 */
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({ projectId: "demo-trueconcept" });
}

const db = getFirestore();

async function seed() {
  const usersRef = db.collection("users");
  await usersRef.doc("admin").set({ username: "admin", password: "admin123", role: "admin", name: "Administrator" });
  await usersRef.doc("student1").set({ username: "student1", password: "student123", role: "student", name: "Student One" });
  console.log("✓ Users seeded");

  const subjectsRef = db.collection("subjects");
  await subjectsRef.doc("math-ix").set({
    name: "Mathematics", description: "Class IX Mathematics covering algebra, geometry, and statistics.",
    icon: "calculator", classLevels: ["Class IX"], color: "#3B82F6", createdAt: new Date(),
  });
  await subjectsRef.doc("science-ix").set({
    name: "Science", description: "Class IX Science covering Physics, Chemistry, and Biology.",
    icon: "flask", classLevels: ["Class IX"], color: "#10B981", createdAt: new Date(),
  });
  console.log("✓ Subjects seeded");

  const chaptersRef = db.collection("chapters");
  await chaptersRef.doc("ch-number-systems").set({
    subjectId: "math-ix", title: "Number Systems",
    description: "Real numbers, irrational numbers, and their properties.",
    classLevel: "Class IX", medium: "Both", order: 1, createdAt: new Date(),
  });
  await chaptersRef.doc("ch-motion").set({
    subjectId: "science-ix", title: "Motion",
    description: "Distance, displacement, speed, velocity, and acceleration.",
    classLevel: "Class IX", medium: "Both", order: 1, createdAt: new Date(),
  });
  console.log("✓ Chapters seeded");

  console.log("\nApp ready at http://localhost:5174");
  console.log("  Admin:   admin / admin123");
  console.log("  Student: student1 / student123");
}

seed().catch(console.error);
