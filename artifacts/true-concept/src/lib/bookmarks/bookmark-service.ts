/**
 * Bookmark service — lets a student save notes, MCQ sets, individual MCQs and
 * Q&A items for later revision.
 *
 * Firestore layout (mirrors the rest of the per-student tree):
 *   studentProgress/{uid}/bookmarks/{bookmarkId}
 *
 * The doc id is deterministic (`${type}__${refId}`, sanitized) so toggling the
 * same item is idempotent — bookmarking twice never creates a duplicate, and
 * un-bookmarking always targets the right doc.
 *
 * Notes & MCQ sets store just enough to deep-link back into the chapter.
 * Single MCQs & Q&A additionally store their full content so the /bookmarks page
 * can render them inline for revision without re-fetching the chapter.
 */

import {
  collection, doc, setDoc, deleteDoc, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type BookmarkType = "note" | "mcq_set" | "mcq" | "qna";

export interface BookmarkData {
  type:          BookmarkType;
  /** noteId | mcqSetKey | questionId | qaId */
  refId:         string;
  chapterId:     string;
  subjectId?:    string | null;
  chapterTitle?: string | null;
  subjectName?:  string | null;
  /** Short display label for the list (note/Q&A title, "Set N", or the question). */
  title:         string;
  /** Optional snippet (notes). */
  preview?:      string | null;
  /** For mcq_set / mcq — which set the item belongs to. */
  setNumber?:    number | null;
  // ── Inline-render payload (mcq + qna) ──────────────────────────────────────
  question?:     string | null;   // mcq question / qna heading
  options?:      string[] | null; // mcq options
  correctIndex?: number | null;   // mcq correct option
  explanation?:  string | null;   // mcq explanation
  answer?:       string | null;   // qna answer/body (markdown)
}

export interface Bookmark extends BookmarkData {
  id:        string;
  createdAt: Timestamp | null;
}

// ── Paths ──────────────────────────────────────────────────────────────────

export const bookmarksCol = (uid: string) =>
  collection(db, "studentProgress", uid, "bookmarks");

export const bookmarkDoc = (uid: string, bookmarkId: string) =>
  doc(db, "studentProgress", uid, "bookmarks", bookmarkId);

/** Deterministic, Firestore-safe doc id for an item. */
export function buildBookmarkId(type: BookmarkType, refId: string): string {
  return `${type}__${refId}`.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 1400);
}

// ── Mutations ────────────────────────────────────────────────────────────────

/** Strip undefined fields — Firestore rejects them. */
function clean<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as T;
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export async function addBookmark(uid: string, data: BookmarkData): Promise<void> {
  const id = buildBookmarkId(data.type, data.refId);
  await setDoc(bookmarkDoc(uid, id), clean({ ...data, createdAt: serverTimestamp() }));
}

export async function removeBookmark(uid: string, type: BookmarkType, refId: string): Promise<void> {
  await deleteDoc(bookmarkDoc(uid, buildBookmarkId(type, refId)));
}

/**
 * Toggle a bookmark. Pass `currentlyOn` from the live subscription so we know
 * which way to flip without an extra read.
 */
export async function toggleBookmark(
  uid: string,
  data: BookmarkData,
  currentlyOn: boolean,
): Promise<void> {
  if (currentlyOn) await removeBookmark(uid, data.type, data.refId);
  else await addBookmark(uid, data);
}
