import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath, extractParam } from "../utils/router.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";

async function enrichChapters(chapters: any[]) {
  if (chapters.length === 0) return [];

  const subjectsSnap = await db.collection("subjects").get();
  const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data().name]));

  return await Promise.all(chapters.map(async (c) => {
    const [notesSnap, mcqsSnap, qaSnap, videosSnap] = await Promise.all([
      db.collection("notes").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("mcqs").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("qa").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("videos").where("chapterId", "==", c.id).limit(1).get()
    ]);

    return {
      ...c,
      subjectName: subjectMap.get(c.subjectId) ?? "",
      hasNotes: !notesSnap.empty,
      hasMcqs: !mcqsSnap.empty,
      hasQa: !qaSnap.empty,
      hasVideo: !videosSnap.empty,
    };
  }));
}

export const chapters = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/chapters");

  try {
    // GET /api/chapters — list chapters (with optional filters)
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const { subjectId, classLevel } = req.query;

      let query: any = db.collection("chapters");
      if (subjectId) query = query.where("subjectId", "==", subjectId);
      if (classLevel) query = query.where("classLevel", "==", classLevel);

      const snap = await query.get();
      let chaptersList = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      chaptersList.sort((a: any, b: any) => a.chapterNumber - b.chapterNumber);

      res.json(await enrichChapters(chaptersList));
      return;
    }

    // POST /api/chapters — create chapter (admin only)
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
      if (!subjectId || !classLevel || !title) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const newRef = db.collection("chapters").doc();
      const data = {
        subjectId, classLevel, medium: medium ?? "Both", title,
        chapterNumber: chapterNumber ?? 1, description, createdAt: new Date()
      };
      await newRef.set(data);

      const enriched = await enrichChapters([{ id: newRef.id, ...data }]);
      res.status(201).json(enriched[0]);
      return;
    }

    // Routes with :chapterId param
    const paramId = extractParam(subPath);

    // GET /api/chapters/:chapterId
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("chapters").doc(paramId).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Chapter not found" });
        return;
      }
      const enriched = await enrichChapters([{ id: docSnap.id, ...docSnap.data() }]);
      res.json(enriched[0]);
      return;
    }

    // PUT /api/chapters/:chapterId — update (admin only)
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;

      const docRef = db.collection("chapters").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Chapter not found" });
        return;
      }

      const updates = { subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber, description };
      await docRef.update(updates);

      const enriched = await enrichChapters([{ id: paramId, ...docSnap.data(), ...updates }]);
      res.json(enriched[0]);
      return;
    }

    // DELETE /api/chapters/:chapterId — delete (admin only)
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      await db.collection("chapters").doc(paramId).delete();
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
    console.error("Chapters error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
