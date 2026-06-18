import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { isUnread, type AppNotification } from "@/lib/notifications/types";

// Fetch more than we display so the class/medium filter still leaves enough entries.
const NOTIFICATIONS_LIMIT = 60;

/**
 * Subscribes to the most recent notifications in real-time.
 * The bell badge updates instantly when admins add new content.
 *
 * Returns:
 *   - notifications: most recent N entries, newest first
 *   - unreadCount: how many haven't been seen by this user
 *   - isLoading: true on initial fetch
 */
export function useNotifications() {
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const [rawNotifications, setRawNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);  // forces re-compute of unread count after markAllAsRead

  useEffect(() => {
    if (!user || user.role !== "student") {
      setRawNotifications([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(NOTIFICATIONS_LIMIT)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: AppNotification[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AppNotification, "id">),
        }));
        setRawNotifications(list);
        setIsLoading(false);
      },
      (err) => {
        console.error("[notifications] subscribe failed:", err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  // Filter by student's class + medium. Legacy notifications without these
  // fields fall through and are shown to everyone (one-time backward-compat).
  const notifications = rawNotifications.filter((n) => {
    if (!prefs) return true;
    const classOk  = !n.classLevel || n.classLevel === prefs.class;
    const mediumOk = !n.medium     || n.medium     === "Both" || n.medium === prefs.medium;
    const board    = (n as { board?: string }).board;
    const boardOk  = !board || board === "Both" || !prefs.board || board === prefs.board;
    return classOk && mediumOk && boardOk;
  }).slice(0, 30);

  const unreadCount = notifications.filter(isUnread).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    refreshSeen: () => setTick((t) => t + 1),  // call this after markAllAsRead
    tick,
  };
}
