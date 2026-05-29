import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";
import { emitContentNotification, emitNotification } from "../lib/notifications.js";

/**
 * Content function — handles notes, mcqs, qa, and videos.
 *
 * The original Express routes were:
 *   /api/notes, /api/mcqs, /api/qa, /api/videos
 *
 * Firebase Hosting rewrites each of these prefixes to this single function.
 * We determine the resource type from the URL path.
 */

function getContentType(url: string): { type: string; id: string | null } {
  const path = url.split("?")[0];

  // ── Special case: /api/papers/sets/... (nested route under /api/papers) ──
  // Must run BEFORE the generic /api/papers matcher, otherwise "sets" would
  // be interpreted as a paper ID instead of as the paperSets sub-resource.
  if (path.startsWith("/api/papers/sets")) {
    const rest = path.slice("/api/papers/sets".length);
    if (!rest || rest === "/") return { type: "paperSets", id: null };
    const id = rest.startsWith("/") ? rest.slice(1) : rest;
    if (id && !id.includes("/")) return { type: "paperSets", id };
  }

  // Match flat patterns like /api/notes, /api/notes/abc123
  const patterns = ["notes", "mcqs", "qa", "videos", "papers"] as const;
  for (const p of patterns) {
    const prefix = `/api/${p}`;
    if (path.startsWith(prefix)) {
      const rest = path.slice(prefix.length);
      if (!rest || rest === "/") return { type: p, id: null };
      const id = rest.startsWith("/") ? rest.slice(1) : rest;
      if (id && !id.includes("/")) return { type: p, id };
    }
  }

  return { type: "", id: null };
}

export const content = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const { type, id } = getContentType(req.url || req.path || "");

  if (!type) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  try {
    // ─── NOTES ──────────────────────────────────────────────────────────────
    if (type === "notes") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId as string;
        if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
        const snap = await db.collection("notes").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, title, content: noteContent, type: noteType, fileUrl, youtubeId, youtubeIds, order } = req.body;
        if (!chapterId || !title || noteContent == null || !noteType) { res.status(400).json({ error: "Missing required fields" }); return; }
        const newRef = db.collection("notes").doc();
        // Normalize: store both array (new) + single id (legacy back-compat).
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : (youtubeId ? [youtubeId] : []);
        const data = {
          chapterId, title, content: noteContent, type: noteType,
          fileUrl: fileUrl || null,
          youtubeId: ytArray[0] ?? null,                    // legacy field
          youtubeIds: ytArray,                              // new array field
          order: order ?? 0,
          createdAt: new Date(),
        };
        await newRef.set(data);
        // Fire-and-forget notification for students
        void emitContentNotification({
          type: "new_note",
          refId: newRef.id,
          refKind: "note",
          refTitle: title,
          chapterId,
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, title, content: noteContent, type: noteType, fileUrl, youtubeId, youtubeIds, order } = req.body;
        const docRef = db.collection("notes").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "Note not found" }); return; }
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : (youtubeId ? [youtubeId] : []);
        const updates = {
          chapterId, title, content: noteContent, type: noteType,
          fileUrl: fileUrl || null,
          youtubeId: ytArray[0] ?? null,
          youtubeIds: ytArray,
          order,
        };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("notes").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }

    // ─── MCQS ───────────────────────────────────────────────────────────────
    if (type === "mcqs") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId as string;
        if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
        const snap = await db.collection("mcqs").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, question, options, correctIndex, explanation, order, setNumber } = req.body;
        if (!chapterId || !question || !options || correctIndex == null || !explanation) { res.status(400).json({ error: "Missing required fields" }); return; }
        const newRef = db.collection("mcqs").doc();
        const data = {
          chapterId, question, options, correctIndex, explanation,
          order: order ?? 0,
          setNumber: Number.isFinite(setNumber) && setNumber >= 1 ? Math.floor(setNumber) : 1,
          createdAt: new Date(),
        };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_mcq",
          refId: newRef.id,
          refKind: "mcq",
          refTitle: "New MCQ added",
          chapterId,
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, question, options, correctIndex, explanation, order, setNumber } = req.body;
        const docRef = db.collection("mcqs").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "MCQ not found" }); return; }
        const updates = {
          chapterId, question, options, correctIndex, explanation, order,
          setNumber: Number.isFinite(setNumber) && setNumber >= 1 ? Math.floor(setNumber) : 1,
        };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("mcqs").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }

    // ─── Q&A ────────────────────────────────────────────────────────────────
    if (type === "qa") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId as string;
        if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
        const snap = await db.collection("qa").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        // ── Dual-shape body (note-style preferred, legacy still accepted) ──
        // New shape (mirrors notes):  { chapterId, title, content, youtubeIds, order }
        // Legacy shape (deprecated):  { chapterId, question, answer, explanation, isImportant, ... }
        // We map: title → question, content → answer (so existing readers keep
        // working), and always persist both shapes for max backward compat.
        const { chapterId, title, content, question, answer, explanation, youtubeId, youtubeIds, isImportant, order } = req.body;
        const effectiveTitle  = (typeof title === "string" && title.trim()) ? title : question;
        const effectiveBody   = (typeof content === "string" && content.length > 0) ? content : answer;
        if (!chapterId || !effectiveTitle || !effectiveBody) {
          res.status(400).json({ error: "Missing required fields (need chapterId + title|question + content|answer)" });
          return;
        }
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : (youtubeId ? [youtubeId] : []);
        const newRef = db.collection("qa").doc();
        const data = {
          chapterId,
          // New (note-style) fields
          title:    effectiveTitle,
          content:  effectiveBody,
          // Legacy fields — kept populated so older student clients keep rendering
          question: effectiveTitle,
          answer:   effectiveBody,
          explanation: explanation ?? "",
          youtubeId: ytArray[0] ?? null,
          youtubeIds: ytArray,
          isImportant: isImportant ?? false,
          order: order ?? 0,
          createdAt: new Date(),
        };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_qa",
          refId: newRef.id,
          refKind: "qa",
          refTitle: effectiveTitle.length > 60 ? effectiveTitle.slice(0, 60) + "…" : effectiveTitle,
          chapterId,
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, title, content, question, answer, explanation, youtubeId, youtubeIds, isImportant, order } = req.body;
        const effectiveTitle = (typeof title === "string" && title.trim()) ? title : question;
        const effectiveBody  = (typeof content === "string" && content.length > 0) ? content : answer;
        const docRef = db.collection("qa").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "Q&A not found" }); return; }
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : (youtubeId ? [youtubeId] : []);
        const updates: Record<string, unknown> = {
          chapterId,
          youtubeId:  ytArray[0] ?? null,
          youtubeIds: ytArray,
          order,
        };
        // Only overwrite fields we were actually given (so partial updates work)
        if (effectiveTitle !== undefined) { updates.title = effectiveTitle; updates.question = effectiveTitle; }
        if (effectiveBody  !== undefined) { updates.content = effectiveBody; updates.answer = effectiveBody; }
        if (explanation    !== undefined)   updates.explanation = explanation;
        if (isImportant    !== undefined)   updates.isImportant = isImportant;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("qa").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }

    // ─── VIDEOS ─────────────────────────────────────────────────────────────
    if (type === "videos") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId as string;
        if (!chapterId) { res.status(400).json({ error: "chapterId required" }); return; }
        const snap = await db.collection("videos").where("chapterId", "==", chapterId).get();
        res.json(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, youtubeId, title, description } = req.body;
        if (!chapterId || !youtubeId || !title || !description) { res.status(400).json({ error: "Missing required fields" }); return; }
        const newRef = db.collection("videos").doc();
        const data = { chapterId, youtubeId, title, description, createdAt: new Date() };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_video",
          refId: newRef.id,
          refKind: "note",     // video relates to chapter context — use chapter route on click
          refTitle: title,
          chapterId,
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, youtubeId, title, description } = req.body;
        const docRef = db.collection("videos").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "Video not found" }); return; }
        const updates = { chapterId, youtubeId, title, description };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("videos").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }

    // ─── PAPER SETS — /api/papers/sets ───────────────────────────────────
    if (type === "paperSets") {
      if (req.method === "GET" && !id) {
        // Public list — students need this to render the set picker. Optional
        // ?classLevel= query filters server-side (cheap; Firestore index-friendly).
        const classFilter = req.query.classLevel as string | undefined;
        let q: FirebaseFirestore.Query = db.collection("paperSets");
        if (classFilter && classFilter !== "All") {
          // Students should see their class OR "Both" — pass each separately
          // because Firestore doesn't support OR cleanly in a single query.
          const [matching, both] = await Promise.all([
            db.collection("paperSets").where("classLevel", "==", classFilter).get(),
            db.collection("paperSets").where("classLevel", "==", "Both").get(),
          ]);
          const docs = [...matching.docs, ...both.docs]
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          res.json(docs);
          return;
        }
        const snap = await q.get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }

      if (req.method === "GET" && id) {
        const docSnap = await db.collection("paperSets").doc(id).get();
        if (!docSnap.exists) { res.status(404).json({ error: "Paper set not found" }); return; }
        res.json({ id, ...docSnap.data() });
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { name, description, classLevel, order } = req.body;
        if (!name) { res.status(400).json({ error: "name required" }); return; }
        const allowedClasses = new Set(["Class IX", "Class X", "Both"]);
        const safeClass = allowedClasses.has(classLevel) ? classLevel : "Both";
        const newRef = db.collection("paperSets").doc();
        const data = {
          name, description: description ?? "",
          classLevel: safeClass,
          order: order ?? 0,
          createdAt: new Date(),
        };
        await newRef.set(data);
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { name, description, classLevel, order } = req.body;
        const docRef = db.collection("paperSets").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "Paper set not found" }); return; }
        const allowedClasses = new Set(["Class IX", "Class X", "Both"]);
        const updates: Record<string, unknown> = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (classLevel !== undefined && allowedClasses.has(classLevel)) updates.classLevel = classLevel;
        if (order !== undefined) updates.order = order;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        // Cascade — also delete all papers belonging to this set so we don't
        // leak orphaned documents that students would never see again anyway.
        const papersSnap = await db.collection("papers").where("setId", "==", id).get();
        const batch = db.batch();
        papersSnap.docs.forEach((d) => batch.delete(d.ref));
        batch.delete(db.collection("paperSets").doc(id));
        await batch.commit();
        res.status(204).send("");
        return;
      }
    }

    // ─── PAPERS — /api/papers, /api/papers/:id ────────────────────────────
    if (type === "papers") {
      if (req.method === "GET" && !id) {
        const setId = req.query.setId as string | undefined;
        if (!setId) { res.status(400).json({ error: "setId query required" }); return; }
        const snap = await db.collection("papers").where("setId", "==", setId).get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }

      if (req.method === "GET" && id) {
        const docSnap = await db.collection("papers").doc(id).get();
        if (!docSnap.exists) { res.status(404).json({ error: "Paper not found" }); return; }
        res.json({ id, ...docSnap.data() });
        return;
      }

      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { setId, title, content: body, youtubeIds, order } = req.body;
        if (!setId || !title) { res.status(400).json({ error: "setId + title required" }); return; }
        // Make sure the parent set exists so we don't create orphan papers.
        const setSnap = await db.collection("paperSets").doc(setId).get();
        if (!setSnap.exists) { res.status(404).json({ error: "Parent paper set not found" }); return; }
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : [];
        const newRef = db.collection("papers").doc();
        const data = {
          setId, title,
          content: body ?? "",
          youtubeIds: ytArray,
          order: order ?? 0,
          createdAt: new Date(),
        };
        await newRef.set(data);

        // Broadcast — write the notification doc directly (papers don't have
        // chapter context, so the enrichment-helper emitContentNotification
        // wouldn't have anything to look up). The broadcast-recommendation
        // trigger picks this up and writes the Gemini hype message.
        const setData = setSnap.data() as { name?: string; classLevel?: string } | undefined;
        void emitNotification({
          type: "new_paper",
          title: `📜 New Paper: ${title}`,
          body: `In ${setData?.name ?? "Full Length Papers"}`,
          refId: newRef.id,
          refKind: "paper",
          chapterId: setId,           // synthetic — points at the paperSet for routing
          chapterTitle: setData?.name,
          subjectName: "Full Length Papers",
          classLevel: setData?.classLevel ?? null,
          medium: "Both",
        });

        res.status(201).json({ id: newRef.id, ...data });
        return;
      }

      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { setId, title, content: body, youtubeIds, order } = req.body;
        const docRef = db.collection("papers").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) { res.status(404).json({ error: "Paper not found" }); return; }
        const ytArray: string[] = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : [];
        const updates: Record<string, unknown> = { youtubeIds: ytArray };
        if (setId !== undefined) updates.setId = setId;
        if (title !== undefined) updates.title = title;
        if (body !== undefined) updates.content = body;
        if (order !== undefined) updates.order = order;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }

      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("papers").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
