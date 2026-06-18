/**
 * Gamification configuration — all XP values, level thresholds, and badge
 * definitions in one place. Change a number here; the whole system updates.
 */

// ── XP values ─────────────────────────────────────────────────────────────────

export const XP_VALUES = {
  // Notes
  NOTE_COMPLETED:          10,
  CHAPTER_ALL_NOTES_DONE:  50,   // bonus when every note in a chapter is read
  SUBJECT_COMPLETED:       200,  // bonus when every chapter in a subject is done

  // MCQ
  MCQ_ATTEMPT:             5,    // just trying a set
  MCQ_SCORE_50:            10,   // scored ≥ 50%
  MCQ_SCORE_75:            20,   // scored ≥ 75%
  MCQ_SCORE_100:           50,   // perfect score bonus

  // Virtual lab
  LAB_COMPLETED:           30,
  LAB_QUIZ_COMPLETED:      20,

  // Q&A
  QA_SECTION_VIEWED:       5,

  // Video
  VIDEO_WATCHED:           5,

  // Daily challenge
  DAILY_CHALLENGE_DONE:    20,
  DAILY_CHALLENGE_PERFECT: 30,   // bonus: scored 100%

  // Mock exam
  MOCK_EXAM_COMPLETED:     40,
  MOCK_EXAM_SCORE_75:      30,   // bonus ≥ 75%

  // Streaks
  STREAK_DAILY:            15,   // awarded once per day on any activity
  STREAK_7_DAY_BONUS:      100,
  STREAK_30_DAY_BONUS:     500,
} as const;

// ── Level definitions ─────────────────────────────────────────────────────────

export interface LevelDef {
  level:     number;
  title:     string;
  titleAs:   string;   // Assamese
  minXP:     number;
  color:     string;   // gradient stop
  emoji:     string;
}

export const LEVELS: LevelDef[] = [
  { level: 1,  title: "Beginner",           titleAs: "নতুন শিক্ষাৰ্থী",     minXP: 0,     color: "#9ca3af", emoji: "🌱" },
  { level: 2,  title: "Explorer",           titleAs: "অন্বেষক",              minXP: 100,   color: "#3b82f6", emoji: "🔭" },
  { level: 3,  title: "Learner",            titleAs: "শিক্ষাৰ্থী",           minXP: 300,   color: "#0ea5e9", emoji: "📖" },
  { level: 4,  title: "Scholar",            titleAs: "পণ্ডিত",               minXP: 600,   color: "#10b981", emoji: "🎓" },
  { level: 5,  title: "Achiever",           titleAs: "সাফল্যলাভকাৰী",       minXP: 1000,  color: "#f59e0b", emoji: "⭐" },
  { level: 6,  title: "Expert",             titleAs: "বিশেষজ্ঞ",             minXP: 1500,  color: "#f97316", emoji: "🏅" },
  { level: 7,  title: "Master",             titleAs: "মাষ্টাৰ",              minXP: 2200,  color: "#ef4444", emoji: "🔥" },
  { level: 8,  title: "Champion",           titleAs: "চেম্পিয়ন",            minXP: 3000,  color: "#8b5cf6", emoji: "🏆" },
  { level: 9,  title: "Legend",             titleAs: "কিংবদন্তি",            minXP: 4500,  color: "#ec4899", emoji: "💎" },
  { level: 10, title: "True Concept Star",  titleAs: "ট্ৰু কনচেপ্ট তাৰকা",  minXP: 7000,  color: "#da6b45", emoji: "🌟" },
];

/** Get level definition for a given XP total. */
export function getLevelForXP(totalXP: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

/** XP needed to reach the NEXT level (0 if already max). */
export function getXPToNextLevel(totalXP: number): { current: number; needed: number; nextLevel: LevelDef | null } {
  const current = getLevelForXP(totalXP);
  const nextIdx = current.level; // LEVELS is 1-indexed so LEVELS[current.level] is the next
  if (nextIdx >= LEVELS.length) return { current: totalXP - current.minXP, needed: 0, nextLevel: null };
  const next = LEVELS[nextIdx];
  return {
    current: totalXP - current.minXP,
    needed:  next.minXP - current.minXP,
    nextLevel: next,
  };
}

// ── Badge definitions ─────────────────────────────────────────────────────────

export interface BadgeDef {
  id:          string;
  name:        string;
  nameAs:      string;
  description: string;
  emoji:       string;
  color:       string;
  /** Called with the student's stats to check if the badge is earned. */
  check: (stats: BadgeCheckStats) => boolean;
}

export interface BadgeCheckStats {
  totalXP:           number;
  totalNotesRead:    number;
  totalLabsDone:     number;
  totalMcqAttempts:  number;
  mcqAccuracyPct:    number;
  currentStreak:     number;
  longestStreak:     number;
  weeklyRank:        number | null;
  challengesDone:    number;
  mockExamsDone:     number;
  perfectChallenges: number;   // daily challenges with 100% score
}

export const BADGES: BadgeDef[] = [
  {
    id: "first_note",    name: "First Step",      nameAs: "প্ৰথম পদক্ষেপ",
    description: "Complete your first note",       emoji: "📝", color: "#10b981",
    check: (s) => s.totalNotesRead >= 1,
  },
  {
    id: "notes_10",      name: "Note Taker",       nameAs: "টোকা লওঁতা",
    description: "Complete 10 notes",              emoji: "📚", color: "#3b82f6",
    check: (s) => s.totalNotesRead >= 10,
  },
  {
    id: "notes_50",      name: "Notes Master",     nameAs: "টোকা মাষ্টাৰ",
    description: "Complete 50 notes",              emoji: "🏆", color: "#8b5cf6",
    check: (s) => s.totalNotesRead >= 50,
  },
  {
    id: "first_lab",     name: "Lab Rookie",       nameAs: "পৰীক্ষাগাৰ নতুন",
    description: "Complete your first virtual lab",emoji: "🔬", color: "#14b8a6",
    check: (s) => s.totalLabsDone >= 1,
  },
  {
    id: "labs_5",        name: "Lab Explorer",     nameAs: "পৰীক্ষাগাৰ অন্বেষক",
    description: "Complete 5 virtual labs",        emoji: "⚗️", color: "#0ea5e9",
    check: (s) => s.totalLabsDone >= 5,
  },
  {
    id: "labs_10",       name: "Lab Expert",       nameAs: "পৰীক্ষাগাৰ বিশেষজ্ঞ",
    description: "Complete 10 virtual labs",       emoji: "🧬", color: "#f97316",
    check: (s) => s.totalLabsDone >= 10,
  },
  {
    id: "mcq_first",     name: "Quiz Taker",       nameAs: "কুইজ লওঁতা",
    description: "Attempt your first MCQ set",     emoji: "🎯", color: "#f59e0b",
    check: (s) => s.totalMcqAttempts >= 1,
  },
  {
    id: "mcq_accurate",  name: "Accurate Scorer",  nameAs: "সঠিক স্কোৰ",
    description: "Maintain 75%+ MCQ accuracy",     emoji: "✅", color: "#10b981",
    check: (s) => s.totalMcqAttempts >= 5 && s.mcqAccuracyPct >= 75,
  },
  {
    id: "mcq_champion",  name: "MCQ Champion",     nameAs: "MCQ চেম্পিয়ন",
    description: "Attempt 50+ MCQ sets",           emoji: "👑", color: "#da6b45",
    check: (s) => s.totalMcqAttempts >= 50,
  },
  {
    id: "streak_3",      name: "3-Day Streak",     nameAs: "৩ দিনৰ ষ্ট্ৰিক",
    description: "Study 3 days in a row",          emoji: "🔥", color: "#f97316",
    check: (s) => s.currentStreak >= 3 || s.longestStreak >= 3,
  },
  {
    id: "streak_7",      name: "Weekly Warrior",   nameAs: "সাপ্তাহিক যোদ্ধা",
    description: "Maintain a 7-day streak",        emoji: "⚡", color: "#ef4444",
    check: (s) => s.currentStreak >= 7 || s.longestStreak >= 7,
  },
  {
    id: "streak_30",     name: "Month Master",     nameAs: "মাহৰ মাষ্টাৰ",
    description: "Maintain a 30-day streak",       emoji: "💪", color: "#8b5cf6",
    check: (s) => s.currentStreak >= 30 || s.longestStreak >= 30,
  },
  {
    id: "daily_5",       name: "Challenge Seeker", nameAs: "প্ৰত্যাহ্বান সন্ধানী",
    description: "Complete 5 daily challenges",    emoji: "🎪", color: "#0ea5e9",
    check: (s) => s.challengesDone >= 5,
  },
  {
    id: "daily_perfect", name: "Perfect Learner",  nameAs: "নিখুঁত শিক্ষাৰ্থী",
    description: "Score 100% on a daily challenge",emoji: "💯", color: "#10b981",
    check: (s) => s.perfectChallenges >= 1,
  },
  {
    id: "top_10",        name: "Top Performer",    nameAs: "শীৰ্ষ পৰিৱেশক",
    description: "Reach top 10 on the weekly leaderboard", emoji: "🥇", color: "#fbbf24",
    check: (s) => s.weeklyRank !== null && s.weeklyRank <= 10,
  },
  {
    id: "xp_500",        name: "Rising Star",      nameAs: "উদীয়মান তাৰকা",
    description: "Earn 500 total XP",              emoji: "⭐", color: "#f59e0b",
    check: (s) => s.totalXP >= 500,
  },
  {
    id: "xp_2000",       name: "Science Explorer", nameAs: "বিজ্ঞান অন্বেষক",
    description: "Earn 2,000 total XP",            emoji: "🚀", color: "#8b5cf6",
    check: (s) => s.totalXP >= 2000,
  },
  {
    id: "mock_first",    name: "Exam Ready",       nameAs: "পৰীক্ষাৰ বাবে সাজু",
    description: "Complete your first mock exam",  emoji: "📋", color: "#6366f1",
    check: (s) => s.mockExamsDone >= 1,
  },
];

/** Current week key in "YYYY-WNN" format (ISO week). */
export function getCurrentWeekKey(): string {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now.getTime() - jan1.getTime()) / 86400000) + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}
