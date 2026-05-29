import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

export interface BroadcastMessage {
  notificationId: string;
  contentType: string;
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
  targetClass: string | null;
  targetMedium: string;
  headline: string;
  message: string;
  callToAction: string;
  headline_as?: string;
  message_as?: string;
  callToAction_as?: string;
  urgency: "high" | "medium" | "low";
  actionLink: string;
  createdAt: Timestamp;
}

const BROADCAST_SEEN_KEY = "trueconcept_broadcast_seen";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(BROADCAST_SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markSeen(id: string) {
  const seen = getSeenIds();
  seen.add(id);
  // Keep only last 50 seen IDs to prevent unbounded growth
  const arr = [...seen].slice(-50);
  localStorage.setItem(BROADCAST_SEEN_KEY, JSON.stringify(arr));
}

export function useBroadcastMessages() {
  const { prefs } = useStudentPrefs();
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "broadcastMessages"),
      orderBy("createdAt", "desc"),
      limit(20)  // fetch more so filtering still leaves enough to show
    );

    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ notificationId: d.id, ...d.data() } as BroadcastMessage));

      // Keep only messages targeted at this student's class and medium
      const filtered = all.filter((m) => {
        // Older docs without targetClass/targetMedium → show to everyone
        if (!m.targetClass && !m.targetMedium) return true;

        const classMatch = !m.targetClass || m.targetClass === prefs?.class;
        const mediumMatch =
          !m.targetMedium ||
          m.targetMedium === "Both" ||
          m.targetMedium === prefs?.medium;

        return classMatch && mediumMatch;
      });

      setMessages(filtered);
      const seen = getSeenIds();
      setUnseenCount(filtered.filter((m) => !seen.has(m.notificationId)).length);
    });

    return unsub;
  }, [prefs?.class, prefs?.medium]);

  const markAllSeen = () => {
    messages.forEach((m) => markSeen(m.notificationId));
    setUnseenCount(0);
  };

  return { messages, unseenCount, markAllSeen };
}
