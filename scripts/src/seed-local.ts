/**
 * Seeds local Firestore emulator with demo users and subjects.
 * Run: FIRESTORE_EMULATOR_HOST=localhost:8090 GCLOUD_PROJECT=demo-trueconcept npx tsx scripts/src/seed-local.ts
 */
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({ projectId: "demo-trueconcept" });
}

const db = getFirestore();

async function seed() {
  // Users
  const usersRef = db.collection("users");
  await usersRef.doc("admin").set({ username: "admin", password: "admin123", role: "admin", name: "Administrator" });
  await usersRef.doc("student1").set({ username: "student1", password: "student123", role: "student", name: "Student One" });
  console.log("✓ Users seeded");

  // Subjects
  const subjectsRef = db.collection("subjects");
  const mathId = "math-ix";
  const scienceId = "science-ix";
  await subjectsRef.doc(mathId).set({
    name: "Mathematics",
    description: "Class IX Mathematics covering algebra, geometry, and statistics.",
    icon: "calculator",
    classLevels: ["Class IX"],
    color: "#3B82F6",
    createdAt: new Date(),
  });
  await subjectsRef.doc(scienceId).set({
    name: "Science",
    description: "Class IX Science covering Physics, Chemistry, and Biology.",
    icon: "flask",
    classLevels: ["Class IX"],
    color: "#10B981",
    createdAt: new Date(),
  });
  console.log("✓ Subjects seeded");

  // Chapters
  const chaptersRef = db.collection("chapters");
  await chaptersRef.doc("ch-number-systems").set({
    subjectId: mathId,
    title: "Number Systems",
    description: "Real numbers, irrational numbers, and their properties.",
    classLevel: "Class IX",
    medium: "Both",
    order: 1,
    createdAt: new Date(),
  });
  await chaptersRef.doc("ch-motion").set({
    subjectId: scienceId,
    title: "Motion",
    description: "Distance, displacement, speed, velocity, and acceleration.",
    classLevel: "Class IX",
    medium: "Both",
    order: 1,
    createdAt: new Date(),
  });
  console.log("✓ Chapters seeded");

  console.log("\nDone! The app is ready at http://localhost:5174");
  console.log("  Admin:   admin / admin123");
  console.log("  Student: student1 / student123  (or use the student login button)");
}

seed().catch(console.error);
