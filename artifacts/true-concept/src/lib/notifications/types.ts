import type { Timestamp } from "firebase/firestore";

export type NotificationType =
  | "new_note"
  | "new_mcq"
  | "new_qa"
  | "new_video"
  | "new_paper"
  | "content_updated";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  refId: string;
  refKind: "note" | "mcq" | "qa" | "chapter" | "paper";
  chapterId?: string;
  chapterTitle?: string;
  subjectId?: string;
  subjectName?: string;
  classLevel?: string | null;          // populated for new docs; older docs may lack this
  medium?: string;                     // "Assamese" | "English" | "Both"
  createdAt: Timestamp;
}

const LAST_SEEN_KEY = "trueconcept_notifications_last_seen";

/** Returns the timestamp the user last opened the notifications panel. */
export function getLastSeenTimestamp(): number {
  const stored = localStorage.getItem(LAST_SEEN_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

/** Marks all notifications as read by recording the current time. */
export function markAllAsRead() {
  localStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
}

/** True if a notification is unread (newer than last-seen). */
export function isUnread(n: AppNotification): boolean {
  const lastSeen = getLastSeenTimestamp();
  const created = n.createdAt?.toMillis?.() ?? 0;
  return created > lastSeen;
}
