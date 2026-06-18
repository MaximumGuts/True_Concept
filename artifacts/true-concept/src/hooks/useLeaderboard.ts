import { useState, useEffect } from "react";
import { query, orderBy, limit, getDocs } from "firebase/firestore";
import { weeklyLeaderboardEntriesCol } from "@/lib/analytics/paths";
import { getCurrentWeekKey } from "@/lib/gamification/xp-config";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

export interface LeaderboardEntry {
  uid:        string;
  name:       string;
  classLevel: string;
  level:      number;
  levelTitle: string;
  totalXP:    number;
  weeklyXP:   number;
  badgeCount: number;
  rank:       number;
}

export function useLeaderboard(maxEntries = 10) {
  const { user }  = useAuth();
  const { prefs } = useStudentPrefs();
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [myRank, setMyRank]     = useState<number | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const weekKey    = getCurrentWeekKey();
    const myClass    = prefs?.class ?? null;   // filter to same class
    setLoading(true);

    // Fetch enough to guarantee we get maxEntries after class filtering.
    // Client-side filter avoids a composite Firestore index (weeklyXP+classLevel).
    getDocs(
      query(
        weeklyLeaderboardEntriesCol(weekKey),
        orderBy("weeklyXP", "desc"),
        limit(100),
      ),
    )
      .then((snap) => {
        const all = snap.docs.map((d) => d.data() as Omit<LeaderboardEntry, "rank">);

        // Filter to the student's class (if known); fall back to all if no class set
        const filtered = myClass
          ? all.filter((e) => !e.classLevel || e.classLevel === myClass)
          : all;

        const list: LeaderboardEntry[] = filtered
          .slice(0, maxEntries)
          .map((e, i) => ({ ...e, rank: i + 1 }));

        setEntries(list);
        const me = list.find((e) => e.uid === user.id);
        setMyRank(me?.rank ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, prefs?.class, maxEntries]); // eslint-disable-line react-hooks/exhaustive-deps

  return { entries, isLoading, myRank };
}
