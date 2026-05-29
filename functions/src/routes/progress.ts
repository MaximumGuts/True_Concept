import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath } from "../utils/router.js";
import { requireAuth, type AuthError } from "../middleware/auth.js";

export const progress = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/progress");

  try {
    // GET /api/progress — chapter-level progress for the current student
    // Reads from studentProgress/{uid}/chapterMastery (new system)
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const user = requireAuth(req);

      const [masterySnap, chaptersSnap, subjectsSnap] = await Promise.all([
        db.collection("studentProgress").doc(user.id)
          .collection("chapterMastery").get(),
        db.collection("chapters").get(),
        db.collection("subjects").get(),
      ]);

      const chapterMap = new Map(chaptersSnap.docs.map((d: any) => [d.id, d.data()]));
      const subjectMap = new Map(subjectsSnap.docs.map((d: any) => [d.id, d.data()]));

      const rows = masterySnap.docs.map((doc: any) => {
        const m = doc.data();
        const c: any = chapterMap.get(m.chapterId) || {};
        const s: any = subjectMap.get(m.subjectId || c.subjectId) || {};
        return {
          id:             doc.id,
          userId:         user.id,
          chapterId:      m.chapterId,
          chapterTitle:   m.chapterTitle || c.title || "",
          subjectName:    m.subjectName  || s.name  || "",
          subjectId:      m.subjectId    || c.subjectId || "",
          // Keep legacy field names for API client compatibility
          mcqScore:       m.mcqTotalCorrect   ?? null,
          mcqTotal:       m.mcqTotalAttempted ?? null,
          mcqBestScore:   m.mcqBestScore      ?? null,
          mcqAccuracy:    m.mcqAccuracy       ?? null,
          masteryScore:   m.masteryScore      ?? 0,
          masteryStatus:  m.masteryStatus     ?? "not_started",
          visited:        m.masteryStatus !== "not_started",
          notesCompleted: m.notesCompleted    ?? 0,
          lastAccessedAt: m.lastStudiedAt?.toDate?.()?.toISOString() ?? null,
        };
      }).sort((a: any, b: any) =>
        new Date(b.lastAccessedAt ?? 0).getTime() - new Date(a.lastAccessedAt ?? 0).getTime()
      );

      res.json(rows);
      return;
    }

    // POST /api/progress/mcq-score — legacy endpoint kept for API client compat.
    // The client SDK now writes to studentProgress directly; this endpoint just
    // writes to the old `progress` collection for any admin tools that still read it.
    if (req.method === "POST" && subPath === "/mcq-score") {
      const user = requireAuth(req);
      const { chapterId, score, total } = req.body;
      if (!chapterId || score == null || total == null) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const existingSnap = await db.collection("progress")
        .where("userId", "==", user.id)
        .where("chapterId", "==", chapterId)
        .limit(1).get();

      let pId: string;
      let pData: any;
      if (!existingSnap.empty) {
        const docRef = existingSnap.docs[0].ref;
        pId = docRef.id;
        await docRef.update({ mcqScore: score, mcqTotal: total, lastAccessedAt: new Date() });
        pData = { ...existingSnap.docs[0].data(), mcqScore: score, mcqTotal: total };
      } else {
        const newRef = db.collection("progress").doc();
        pId = newRef.id;
        pData = { userId: user.id, chapterId, mcqScore: score, mcqTotal: total, visited: true, lastAccessedAt: new Date() };
        await newRef.set(pData);
      }

      res.json([{ id: pId, ...pData, lastAccessedAt: new Date().toISOString() }]);
      return;
    }

    // POST /api/progress/mark-chapter — legacy endpoint; client SDK handles new writes.
    if (req.method === "POST" && subPath === "/mark-chapter") {
      const user = requireAuth(req);
      const { chapterId } = req.body;
      if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }

      const existingSnap = await db.collection("progress")
        .where("userId", "==", user.id)
        .where("chapterId", "==", chapterId)
        .limit(1).get();
      if (!existingSnap.empty) {
        await existingSnap.docs[0].ref.update({ visited: true, lastAccessedAt: new Date() });
      } else {
        await db.collection("progress").add({ userId: user.id, chapterId, visited: true, lastAccessedAt: new Date() });
      }
      res.json({ ok: true });
      return;
    }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) { res.status(authErr.status).json({ error: authErr.error }); return; }
    console.error("Progress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
