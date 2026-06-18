import { useState, useEffect, useRef } from "react";
import { onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { studentXPDoc, type StudentXPDoc, tryAwardDailyStreakXP } from "@/lib/gamification/xp-service";
import {
  getLevelForXP, getXPToNextLevel, BADGES,
  type LevelDef,
} from "@/lib/gamification/xp-config";
import type { BadgeDef } from "@/lib/gamification/xp-config";

export interface GamificationState {
  totalXP:          number;
  weeklyXP:         number;
  level:            LevelDef;
  xpToNext:         number;
  xpInCurrentLevel: number;
  progressPct:      number;
  earnedBadges:     BadgeDef[];
  isLoading:        boolean;
  /** Set to a LevelDef when the student JUST levelled up — consumer shows the celebration. */
  newLevelUp:       LevelDef | null;
  clearLevelUp:     () => void;
}

export function useGamification(): GamificationState {
  const { user } = useAuth();
  const [data, setData]         = useState<StudentXPDoc | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [newLevelUp, setLevelUp] = useState<LevelDef | null>(null);
  const prevLevelRef             = useRef<number>(0);

  // Real-time listener on studentXP doc
  useEffect(() => {
    if (!user?.id || user.role !== "student") { setLoading(false); return; }
    const unsub = onSnapshot(
      studentXPDoc(user.id),
      (snap) => {
        const incoming = snap.exists() ? (snap.data() as StudentXPDoc) : null;
        setData(incoming);
        setLoading(false);

        // Level-up detection: compare with previous snapshot
        if (incoming) {
          const currentLevel = incoming.level ?? 1;
          if (prevLevelRef.current > 0 && currentLevel > prevLevelRef.current) {
            setLevelUp(getLevelForXP(incoming.totalXP));
          }
          prevLevelRef.current = currentLevel;
        }
      },
      () => setLoading(false),
    );
    return unsub;
  }, [user?.id, user?.role]);

  // Award daily streak XP once per day, using the real currentStreak value
  useEffect(() => {
    if (!user?.id || user.role !== "student") return;
    getDoc(doc(db, "studentProgress", user.id))
      .then((snap) => {
        const streak = snap.exists() ? ((snap.data() as Record<string, number>).currentStreak ?? 0) : 0;
        void tryAwardDailyStreakXP(user.id!, streak);
      })
      .catch(() => {
        void tryAwardDailyStreakXP(user.id!, 0);
      });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalXP  = data?.totalXP ?? 0;
  const weeklyXP = data?.weeklyXP ?? 0;
  const level    = getLevelForXP(totalXP);
  const { current: xpInLevel, needed } = getXPToNextLevel(totalXP);
  const progressPct = needed > 0 ? Math.min(100, Math.round((xpInLevel / needed) * 100)) : 100;

  const earnedBadges = BADGES.filter(
    (b) => (data?.earnedBadgeIds ?? []).includes(b.id),
  );

  return {
    totalXP, weeklyXP, level,
    xpToNext: needed, xpInCurrentLevel: xpInLevel, progressPct,
    earnedBadges, isLoading,
    newLevelUp,
    clearLevelUp: () => setLevelUp(null),
  };
}
