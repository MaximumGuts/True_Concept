import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath, extractParam } from "../utils/router.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";

const FIELDS = [
  "subject", "classLevel", "title", "objective", "theory", "apparatus",
  "procedure", "expectedResult", "explanation", "videoUrl", "hints",
  "summary", "type", "difficulty",
] as const;

function pick(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of FIELDS) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
}

export const experiments = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/experiments");

  try {
    // GET /api/experiments — list experiments (with optional classLevel filter)
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const { classLevel } = req.query;
      let query: any = db.collection("experiments");
      if (classLevel) {
        query = query.where("classLevel", "==", classLevel);
      }
      const snap = await query.get();
      const exps = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json(exps);
      return;
    }

    // POST /api/experiments — create experiment (admin only)
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const data = pick(req.body);
      const required = ["subject", "classLevel", "title", "objective", "procedure", "expectedResult", "explanation", "type"];
      for (const f of required) {
        if (!data[f]) { res.status(400).json({ error: `Missing field: ${f}` }); return; }
      }
      if (!data.difficulty) data.difficulty = "medium";

      const newRef = db.collection("experiments").doc();
      const newData = { ...data, createdAt: new Date() };
      await newRef.set(newData);
      res.status(201).json({ id: newRef.id, ...newData });
      return;
    }

    // DELETE /api/experiments/delete-by-subject?subject=Chemistry — bulk delete (admin only)
    if (req.method === "DELETE" && subPath === "/delete-by-subject") {
      requireAdmin(req);
      const subject = req.query.subject as string;
      if (!subject) { res.status(400).json({ error: "subject query param required" }); return; }
      const snap = await db.collection("experiments").where("subject", "==", subject).get();
      const batch = db.batch();
      snap.docs.forEach((d: any) => batch.delete(d.ref));
      await batch.commit();
      res.json({ deleted: snap.size });
      return;
    }

    // Routes with :experimentId param
    const paramId = extractParam(subPath);

    // GET /api/experiments/:experimentId
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("experiments").doc(paramId).get();
      if (!docSnap.exists) { res.status(404).json({ error: "Experiment not found" }); return; }
      res.json({ id: docSnap.id, ...docSnap.data() });
      return;
    }

    // PUT /api/experiments/:experimentId — update (admin only)
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const data = pick(req.body);
      const docRef = db.collection("experiments").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) { res.status(404).json({ error: "Experiment not found" }); return; }
      await docRef.update(data);
      res.json({ id: paramId, ...docSnap.data(), ...data });
      return;
    }

    // DELETE /api/experiments/:experimentId — delete (admin only)
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      await db.collection("experiments").doc(paramId).delete();
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
    console.error("Experiments error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
