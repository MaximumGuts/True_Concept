import { db } from "@workspace/db";

/**
 * Notification types — emitted by the server when admins add new content.
 * Students read this collection in real-time to power the bell icon.
 */
export type NotificationType =
  | "new_note"
  | "new_mcq"
  | "new_qa"
  | "new_video"
  | "new_paper"
  | "content_updated";

export interface NotificationRecord {
  type: NotificationType;
  title: string;                    // headline shown in dropdown
  body: string;                     // sub-text (e.g. "in Chapter 3 — Light")
  refId: string;                    // noteId / mcqId / qaId / chapterId / paperId
  refKind: "note" | "mcq" | "qa" | "chapter" | "paper";
  chapterId?: string;
  chapterTitle?: string;
  subjectId?: string;
  subjectName?: string;
  classLevel?: string | null;       // copied from chapter — used for student targeting
  medium?: string;                  // "Assamese" | "English" | "Both"
  createdAt: Date;
}

/**
 * Write a notification doc. Fire-and-forget: failure to log a notification
 * should never block the actual content save, so we swallow errors.
 */
export async function emitNotification(rec: Omit<NotificationRecord, "createdAt">) {
  try {
    // Strip undefined values (Firestore rejects them)
    const clean: Record<string, unknown> = { createdAt: new Date() };
    for (const [k, v] of Object.entries(rec)) {
      if (v !== undefined && v !== null) clean[k] = v;
    }
    await db.collection("notifications").add(clean);
  } catch (err) {
    console.error("[notifications] emit failed:", err);
  }
}

/**
 * Helper: enrich a notification with chapter + subject context.
 * Looks up the chapter doc once to grab title and subject name.
 */
export async function emitContentNotification(args: {
  type: NotificationType;
  refId: string;
  refKind: "note" | "mcq" | "qa";
  refTitle: string;                 // e.g. note title or "MCQ Set"
  chapterId: string;
}) {
  let chapterTitle: string | undefined;
  let subjectId: string | undefined;
  let subjectName: string | undefined;
  let classLevel: string | null = null;
  let medium = "Both";

  try {
    const chapterSnap = await db.collection("chapters").doc(args.chapterId).get();
    if (chapterSnap.exists) {
      const data = chapterSnap.data();
      chapterTitle = data?.title;
      subjectId = data?.subjectId;
      classLevel = data?.classLevel ?? null;
      medium = data?.medium ?? "Both";
      if (subjectId) {
        const subjSnap = await db.collection("subjects").doc(subjectId).get();
        subjectName = subjSnap.data()?.name;
      }
    }
  } catch {
    // Ignore — notification still goes out without enrichment
  }

  const kindLabel = {
    new_note:   "📝 New Note",
    new_mcq:    "🎯 New Quiz",
    new_qa:     "❓ New Q&A",
    new_video:  "🎬 New Video",
    new_paper:  "📜 New Paper",
    content_updated: "✏️ Content Updated",
  }[args.type] ?? "🔔 New";

  await emitNotification({
    type: args.type,
    title: `${kindLabel}: ${args.refTitle}`,
    body: chapterTitle ? `In ${chapterTitle}${subjectName ? ` (${subjectName})` : ""}` : "Open to read",
    refId: args.refId,
    refKind: args.refKind,
    chapterId: args.chapterId,
    chapterTitle,
    subjectId,
    subjectName,
    classLevel,
    medium,
  });
}
