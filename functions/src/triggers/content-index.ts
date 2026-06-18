import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "@workspace/db";
import { Timestamp } from "firebase-admin/firestore";
import { rebuildAndStoreContentIndex } from "../lib/content-index.js";

/**
 * Firestore triggers that rebuild the shared content index whenever admin adds,
 * edits, or deletes content. Keeps contentIndex/global fresh so the per-student
 * knowledge-profile builder can read it in a single document read.
 *
 * Debounced: each fire records `updatedAt`; if another write lands within 60s
 * we skip the rebuild (admin bulk-adding 20 MCQs triggers 1 rebuild, not 20).
 */

const DEBOUNCE_MS = 60 * 1000;

async function maybeRebuild(): Promise<void> {
  try {
    const ref = db.collection("contentIndex").doc("global");
    const snap = await ref.get();
    if (snap.exists) {
      const updatedAt = snap.data()?.updatedAt as Timestamp | undefined;
      if (updatedAt && Date.now() - updatedAt.toMillis() < DEBOUNCE_MS) {
        // A rebuild happened very recently — skip to coalesce bulk writes.
        return;
      }
    }
    await rebuildAndStoreContentIndex();
  } catch (err) {
    console.error("[content-index] rebuild failed:", err);
  }
}

export const onMcqWriteRebuildIndex = onDocumentWritten(
  { document: "mcqs/{mcqId}", region: "asia-south1" },
  async () => { await maybeRebuild(); },
);

export const onQaWriteRebuildIndex = onDocumentWritten(
  { document: "qa/{qaId}", region: "asia-south1" },
  async () => { await maybeRebuild(); },
);

export const onPaperWriteRebuildIndex = onDocumentWritten(
  { document: "papers/{paperId}", region: "asia-south1" },
  async () => { await maybeRebuild(); },
);

export const onChapterWriteRebuildIndex = onDocumentWritten(
  { document: "chapters/{chapterId}", region: "asia-south1" },
  async () => { await maybeRebuild(); },
);

export const onSubjectWriteRebuildIndex = onDocumentWritten(
  { document: "subjects/{subjectId}", region: "asia-south1" },
  async () => { await maybeRebuild(); },
);
