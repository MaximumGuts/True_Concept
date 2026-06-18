/**
 * Content Index — a single Firestore document that caches curriculum-wide
 * content counts shared by ALL students.
 *
 * WHY THIS EXISTS
 * The AI knowledge-profile builder needs to know what content EXISTS (how many
 * MCQs per chapter, which chapters/subjects exist, how many papers) so it can
 * recommend new content and score honest coverage. That data is identical for
 * every student, so reading the whole mcqs/qa/papers collections on every
 * per-student profile rebuild would be O(content × students × rebuilds) reads
 * — thousands of duplicate reads. Instead we compute it ONCE into one document
 * and every profile rebuild reads just that single doc (O(1)).
 *
 * REFRESH STRATEGY
 *   • A Firestore trigger rebuilds this when admin writes mcqs/qa/papers/
 *     chapters/subjects (see triggers/content-index.ts).
 *   • A 6-hour TTL guards against missed trigger events: the profile builder
 *     calls `getContentIndex()` which rebuilds lazily if the cached doc is
 *     older than 6 hours.
 *
 * Path: contentIndex/global
 */

import { db } from "@workspace/db";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const DOC_PATH = ["contentIndex", "global"] as const;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export interface ContentIndexChapter {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classLevel: string;
  board: string;
  chapterNumber: number;
}

export interface ContentIndexSubject {
  id: string;
  name: string;
  classLevel: string;
}

export interface ContentIndex {
  mcqCountByChapter: Record<string, number>;
  qaCountByChapter:  Record<string, number>;
  chapters:          ContentIndexChapter[];
  subjects:          ContentIndexSubject[];
  paperCount:        number;
  updatedAt:         Timestamp | null;
}

/** Build the content index from scratch by scanning the content collections.
 *  This is the ONLY place that reads whole content collections — it runs at
 *  most once per content change (or once per 6h via TTL), not per student. */
export async function buildContentIndex(): Promise<ContentIndex> {
  const [mcqsSnap, qaSnap, papersSnap, chaptersSnap, subjectsSnap] = await Promise.all([
    db.collection("mcqs").get(),
    db.collection("qa").get(),
    db.collection("papers").get(),
    db.collection("chapters").get(),
    db.collection("subjects").get(),
  ]);

  const mcqCountByChapter: Record<string, number> = {};
  for (const d of mcqsSnap.docs) {
    const cid = (d.data() as any).chapterId;
    if (cid) mcqCountByChapter[cid] = (mcqCountByChapter[cid] ?? 0) + 1;
  }
  const qaCountByChapter: Record<string, number> = {};
  for (const d of qaSnap.docs) {
    const cid = (d.data() as any).chapterId;
    if (cid) qaCountByChapter[cid] = (qaCountByChapter[cid] ?? 0) + 1;
  }

  const chapters: ContentIndexChapter[] = chaptersSnap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      title: data.title ?? "",
      subjectId: data.subjectId ?? "",
      subjectName: data.subjectName ?? "",
      classLevel: data.classLevel ?? "",
      board: data.board ?? "Both",
      chapterNumber: data.chapterNumber ?? 0,
    };
  });

  const subjects: ContentIndexSubject[] = subjectsSnap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: data.name ?? "",
      classLevel: data.classLevel ?? "",
    };
  });

  return {
    mcqCountByChapter,
    qaCountByChapter,
    chapters,
    subjects,
    paperCount: papersSnap.size,
    updatedAt: null, // set on write
  };
}

/** Persist a freshly-built index to contentIndex/global. */
export async function writeContentIndex(index: ContentIndex): Promise<void> {
  await db.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set({
    ...index,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/** Force a full rebuild + write. Called by the content-index trigger. */
export async function rebuildAndStoreContentIndex(): Promise<void> {
  const index = await buildContentIndex();
  await writeContentIndex(index);
}

/**
 * Read the cached index. If missing or older than the TTL, rebuild it lazily
 * and return the fresh copy. This is what the profile builder calls — it costs
 * 1 document read in the common (fresh) case.
 */
export async function getContentIndex(): Promise<ContentIndex> {
  const ref = db.collection(DOC_PATH[0]).doc(DOC_PATH[1]);
  const snap = await ref.get();

  if (snap.exists) {
    const data = snap.data() as ContentIndex;
    const ageMs = data.updatedAt ? Date.now() - data.updatedAt.toMillis() : Infinity;
    if (ageMs < TTL_MS) return data;
  }

  // Missing or stale → rebuild now.
  const fresh = await buildContentIndex();
  await writeContentIndex(fresh);
  return { ...fresh, updatedAt: Timestamp.now() };
}
