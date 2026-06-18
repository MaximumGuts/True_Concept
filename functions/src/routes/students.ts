import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { requireAdmin, requireAuth, type AuthError } from "../middleware/auth.js";

export const students = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  try {
    const path = (req.path || req.url.split("?")[0] || "").replace(/^\/+|\/+$/g, "");

    // PATCH /api/students/me — student updates their own class/medium prefs
    if (req.method === "PATCH" && (path === "api/students/me" || path === "students/me" || path === "me")) {
      const user = requireAuth(req);
      if (user.role !== "student") {
        res.status(403).json({ error: "Only students can update their own prefs" });
        return;
      }
      const { classLevel, medium } = req.body ?? {};
      const validClasses = new Set(["Class IX", "Class X"]);
      const validMediums = new Set(["Assamese", "English"]);
      const updates: Record<string, string> = {};
      if (classLevel !== undefined) {
        if (!validClasses.has(classLevel)) {
          res.status(400).json({ error: "Invalid classLevel" });
          return;
        }
        updates.classLevel = classLevel;
      }
      if (medium !== undefined) {
        if (!validMediums.has(medium)) {
          res.status(400).json({ error: "Invalid medium" });
          return;
        }
        updates.medium = medium;
      }
      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "Nothing to update" });
        return;
      }
      const ref = db.collection("students").doc(user.id);
      const snap = await ref.get();
      if (!snap.exists) {
        res.status(404).json({ error: "Student not found" });
        return;
      }
      await ref.update(updates);

      // When `reset: true` (class or medium change) — erase all progress data
      // so the student starts fresh in their new class/medium. Keeps XP/badges.
      const shouldReset = req.body?.reset === true;
      if (shouldReset) {
        const progressRef = db.collection("studentProgress").doc(user.id);
        const subcols = [
          "notes", "mcqs", "activity", "sessions", "questionResults",
          "chapterMastery", "experimentMastery", "dailyChallenges",
          "mockExamSessions", "bookmarks", "aiNarrations",
        ];
        // Delete every doc in every subcollection (batch in chunks of 500)
        for (const sub of subcols) {
          try {
            const subSnap = await progressRef.collection(sub).get();
            if (subSnap.empty) continue;
            const docs = subSnap.docs;
            for (let i = 0; i < docs.length; i += 500) {
              const batch = db.batch();
              docs.slice(i, i + 500).forEach((d) => batch.delete(d.ref));
              await batch.commit();
            }
          } catch (subErr) {
            console.warn(`[students reset] failed deleting ${sub}:`, subErr);
          }
        }
        // Delete root progress doc and the knowledge profile
        try { await progressRef.delete(); } catch { /* ignore */ }
        try { await db.collection("studentKnowledgeProfiles").doc(user.id).delete(); } catch { /* ignore */ }
        // Bust AI mentor cache
        try { await db.collection("aiRecommendations").doc(user.id).delete(); } catch { /* ignore */ }
      } else {
        // Non-reset patch: just bust AI cache + patch profile medium/class
        try { await db.collection("aiRecommendations").doc(user.id).delete(); } catch { /* ignore */ }
        try {
          const profileRef = db.collection("studentKnowledgeProfiles").doc(user.id);
          const profileSnap = await profileRef.get();
          if (profileSnap.exists) {
            const profileUpdates: Record<string, unknown> = {};
            if (updates.classLevel !== undefined) profileUpdates.classLevel = updates.classLevel;
            if (updates.medium !== undefined) profileUpdates.medium = updates.medium;
            if (Object.keys(profileUpdates).length > 0) await profileRef.update(profileUpdates);
          }
        } catch (err) {
          console.warn("[students PATCH] profile sync failed:", err);
        }
      }

      res.json({ ok: true, classLevel: updates.classLevel ?? snap.data()?.classLevel ?? null, medium: updates.medium ?? snap.data()?.medium ?? null });
      return;
    }

    // GET /api/students/me — returns the caller's own prefs (used to seed StudentPrefsContext on login)
    if (req.method === "GET" && (path === "api/students/me" || path === "students/me" || path === "me")) {
      const user = requireAuth(req);
      if (user.role !== "student") {
        res.status(403).json({ error: "Only students can read their own profile" });
        return;
      }
      const snap = await db.collection("students").doc(user.id).get();
      if (!snap.exists) {
        res.status(404).json({ error: "Student not found" });
        return;
      }
      const data = snap.data() ?? {};
      res.json({
        id: snap.id,
        name: data.name ?? null,
        classLevel: data.classLevel ?? null,
        medium: data.medium ?? null,
        board: data.board ?? null,
      });
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // GET /api/students — list all students (admin only)
    requireAdmin(req);

    const snap = await db.collection("students").orderBy("createdAt", "desc").get();
    const studentsList = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
      lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() ?? null,
    }));
    res.json(studentsList);
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Students error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
