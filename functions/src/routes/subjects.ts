import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath, extractParam } from "../utils/router.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";

export const subjects = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/subjects");

  try {
    // GET /api/subjects — list all subjects (deduplicates by name, keeps the one with most chapters)
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const subjectsSnap = await db.collection("subjects").get();
      const subjectsList = subjectsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      const withCounts = await Promise.all(subjectsList.map(async (s: any) => {
        const chaptersSnap = await db.collection("chapters").where("subjectId", "==", s.id).count().get();
        return { ...s, chapterCount: chaptersSnap.data().count };
      }));

      // Deduplicate by name — keep the doc with the most chapters (so existing content stays linked)
      const seen = new Map<string, any>();
      for (const s of withCounts) {
        const key = (s.name as string).trim().toLowerCase();
        const existing = seen.get(key);
        if (!existing || s.chapterCount > existing.chapterCount) {
          seen.set(key, s);
        }
      }

      res.json([...seen.values()]);
      return;
    }

    // POST /api/subjects/cleanup-duplicates — admin: merge & delete duplicate subjects
    if (req.method === "POST" && subPath === "/cleanup-duplicates") {
      requireAdmin(req);
      const subjectsSnap = await db.collection("subjects").get();
      const subjectsList = subjectsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      const withCounts = await Promise.all(subjectsList.map(async (s: any) => {
        const chaptersSnap = await db.collection("chapters").where("subjectId", "==", s.id).count().get();
        return { ...s, chapterCount: chaptersSnap.data().count };
      }));

      // Group by normalised name
      const groups = new Map<string, any[]>();
      for (const s of withCounts) {
        const key = (s.name as string).trim().toLowerCase();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
      }

      let merged = 0;
      let deleted = 0;
      for (const group of groups.values()) {
        if (group.length <= 1) continue;
        // Keep the one with most chapters; among ties, keep the oldest (lowest createdAt)
        group.sort((a: any, b: any) => {
          if (b.chapterCount !== a.chapterCount) return b.chapterCount - a.chapterCount;
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return ta - tb;
        });
        const canonical = group[0];
        const duplicates = group.slice(1);

        for (const dup of duplicates) {
          // Re-parent all chapters from duplicate to canonical
          const chapSnap = await db.collection("chapters").where("subjectId", "==", dup.id).get();
          const batch = db.batch();
          for (const ch of chapSnap.docs) {
            batch.update(ch.ref, { subjectId: canonical.id });
          }
          await batch.commit();
          merged += chapSnap.size;
          // Delete the duplicate subject doc
          await db.collection("subjects").doc(dup.id).delete();
          deleted++;
        }
      }

      res.json({ ok: true, duplicatesDeleted: deleted, chaptersMigrated: merged });
      return;
    }

    // POST /api/subjects — create subject (admin only)
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const { name, description, icon, classLevels, color } = req.body;
      if (!name || !description || !icon || !classLevels || !color) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const newRef = db.collection("subjects").doc();
      const newSubject = { name, description, icon, classLevels, color, createdAt: new Date() };
      await newRef.set(newSubject);
      res.status(201).json({ id: newRef.id, ...newSubject, chapterCount: 0 });
      return;
    }

    // GET /api/subjects/:subjectId
    const paramId = extractParam(subPath);
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("subjects").doc(paramId).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      const countSnap = await db.collection("chapters").where("subjectId", "==", paramId).count().get();
      res.json({ id: docSnap.id, ...docSnap.data(), chapterCount: countSnap.data().count });
      return;
    }

    // PUT /api/subjects/:subjectId — update (admin only)
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const { name, description, icon, classLevels, color } = req.body;
      const docRef = db.collection("subjects").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      const updates = { name, description, icon, classLevels, color };
      await docRef.update(updates);
      const countSnap = await db.collection("chapters").where("subjectId", "==", paramId).count().get();
      res.json({ id: paramId, ...docSnap.data(), ...updates, chapterCount: countSnap.data().count });
      return;
    }

    // DELETE /api/subjects/:subjectId — delete (admin only)
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      const docRef = db.collection("subjects").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      await docRef.delete();
      res.status(204).send("");
      return;
    }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Subjects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
