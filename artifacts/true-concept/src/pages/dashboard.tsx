import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { ChevronRight, Flame, BookOpen, Trophy, PencilLine, FlaskConical, CheckCircle2, Clock, Play, MessageSquare } from "lucide-react";
// Play + MessageSquare used in ActivityIcon below
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { getGreeting } from "@/lib/progress/greeting";
import type { ActivityEntry } from "@/lib/progress/types";
import AiMentorCard from "@/components/AiMentorCard";
import NextRecommendationCard from "@/components/NextRecommendationCard";
import BroadcastBanner from "@/components/BroadcastBanner";

// ── Activity feed helpers ──────────────────────────────────────────────────

function ActivityIcon({ type }: { type: ActivityEntry["type"] }) {
  const map: Record<ActivityEntry["type"], { Icon: React.ElementType; color: string; bg: string }> = {
    note_opened:           { Icon: BookOpen,        color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    note_completed:        { Icon: CheckCircle2,    color: "#16a34a", bg: "rgba(22,163,74,0.15)"  },
    mcq_attempted:         { Icon: PencilLine,      color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    mcq_completed:         { Icon: Trophy,          color: "#da6b45", bg: "rgba(218,107,69,0.15)" },
    experiment_started:    { Icon: FlaskConical,    color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
    experiment_completed:  { Icon: FlaskConical,    color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
    qa_viewed:             { Icon: MessageSquare,   color: "#0891b2", bg: "rgba(8,145,178,0.15)"  },
    video_played:          { Icon: Play,            color: "#ef4444", bg: "rgba(239,68,68,0.15)"  },
  };
  const entry = map[type] ?? map.note_opened;
  const { Icon, color, bg } = entry;
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  );
}

function activityLabel(entry: ActivityEntry): string {
  switch (entry.type) {
    case "note_opened":          return `Started reading ${entry.refTitle}`;
    case "note_completed":       return `Finished ${entry.refTitle}`;
    case "mcq_attempted":        return `Practiced ${entry.refTitle} (${entry.metadata?.score ?? 0}%)`;
    case "mcq_completed":        return `Completed ${entry.refTitle} (${entry.metadata?.score ?? 0}%)`;
    case "experiment_started":   return `Started ${entry.refTitle}`;
    case "experiment_completed": return `Completed ${entry.refTitle}`;
    case "qa_viewed":            return `Reviewed Q&A — ${entry.chapterTitle ?? entry.refTitle}`;
    case "video_played":         return `Watched video — ${entry.chapterTitle ?? entry.refTitle}`;
    default:                     return entry.refTitle ?? "Activity";
  }
}

function relativeTime(ts: ActivityEntry["timestamp"]): string {
  if (!ts) return "";
  const date = (ts as { toDate?: () => Date }).toDate?.() ?? new Date();
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const statCards = [
  { key: "totalChapters", label: "Total Chapters", emoji: "📚", grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)" },
  { key: "visitedChapters", label: "Chapters Done", emoji: "✅", grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)" },
  { key: "totalMcqAttempts", label: "MCQ Attempts", emoji: "🎯", grad: "linear-gradient(135deg, #e58359, #f08766)", glow: "rgba(168,85,247,0.25)" },
  { key: "averageScore", label: "Avg Score", emoji: "⭐", grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.25)", suffix: "%" },
];

const progressGrads = [
  "linear-gradient(90deg, #3b82f6, #6366f1)",
  "linear-gradient(90deg, #10b981, #14b8a6)",
  "linear-gradient(90deg, #e58359, #f08766)",
  "linear-gradient(90deg, #ef4444, #f87171)",
  "linear-gradient(90deg, #f59e0b, #f97316)",
];

const recentGrads = [
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #e58359, #f08766)",
  "linear-gradient(135deg, #ef4444, #f87171)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
];

const motivations = [
  "Keep it up! You're doing amazing 🔥",
  "Stay consistent, success follows 💪",
  "Every chapter brings you closer 🎯",
  "You're a star student! ⭐",
];

// Same dev/prod base resolution as elsewhere — dev hits production functions
// directly because the Express api-server can't host the dashboard CF.
const DASHBOARD_BASE = import.meta.env.DEV
  ? "https://asia-south1-true-concept-353c9.cloudfunctions.net/dashboard"
  : "";

// Loose shape matching the dashboard summary route. Permissive (any) on the
// recentChapters/subjectProgress items because the existing JSX accesses both
// the new (chapterId/mcqBestScore) and legacy (id/mcqScore/mcqTotal) field names.
interface DashboardSummary {
  totalChapters?: number;
  visitedChapters?: number;
  totalMcqAttempts?: number;
  averageScore?: number;
  recentChapters?: any[];
  subjectProgress?: any[];
  totalNotesRead?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastStudiedChapterId?: string | null;
  lastStudiedChapterTitle?: string | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const { data: summary, isLoading } = useQuery<DashboardSummary>({
    // Key includes prefs so a class/medium change auto-refetches with new totals.
    queryKey: ["dashboardSummary", user?.id, prefs?.class ?? null, prefs?.medium ?? null],
    enabled: !!user,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (prefs?.class)  params.set("classLevel", prefs.class);
      if (prefs?.medium) params.set("medium", prefs.medium);
      const token = localStorage.getItem("trueconcept_token");
      const qs = params.toString();
      const res = await fetch(`${DASHBOARD_BASE}/api/dashboard/summary${qs ? `?${qs}` : ""}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Dashboard summary failed (${res.status})`);
      return res.json() as Promise<DashboardSummary>;
    },
  });
  const { data: progressStats } = useDashboardStats();
  const greeting = getGreeting();
  const msg = motivations[Math.floor(Math.random() * motivations.length)];

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
        <div className="h-28 liquid-card rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 liquid-card rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const visitedPct = summary?.totalChapters
    ? Math.round(((summary?.visitedChapters ?? 0) / summary.totalChapters) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden liquid-ai rounded-3xl p-6">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{greeting.emoji}</div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl text-gray-900 dark:text-white" data-testid="heading-dashboard">
                {greeting.text}, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-orange-600 dark:text-orange-300 text-sm font-semibold">{msg}</p>
            </div>
          </div>
          {summary?.totalChapters ? (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-orange-600 dark:text-orange-300 mb-2 font-bold">
                <span>Overall Progress</span>
                <span>{visitedPct}% Complete</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${visitedPct}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-semibold">{summary.visitedChapters} of {summary.totalChapters} chapters</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Mentor Card */}
      <AiMentorCard />

      {/* AI Mentor SECOND card — deterministic next-best-action (Phase 7D) */}
      <NextRecommendationCard />

      {/* Admin broadcast — new content alerts */}
      <BroadcastBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, emoji, grad, glow, suffix }) => {
          const val = summary?.[key as keyof typeof summary] ?? 0;
          const display = typeof val === "number" ? `${suffix === "%" ? Math.round(Number(val)) : val}${suffix ?? ""}` : "—";
          return (
            <div key={key} className="liquid-card rounded-2xl p-5" data-testid={`stat-${key}`}>
              <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-xl shadow-md"
                style={{ background: grad }}>
                <div className="absolute inset-0 rounded-2xl blur-md opacity-60" style={{ background: glow }} />
                <span className="relative">{emoji}</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-gray-100">{display}</div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Subject Progress */}
      {summary?.subjectProgress && summary.subjectProgress.length > 0 && (
        <div className="liquid-panel rounded-3xl p-6">
          <h2 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">📊 Subject Progress</h2>
          <div className="space-y-4">
            {summary.subjectProgress.map((sp, i) => {
              const pct = sp.chaptersTotal > 0 ? Math.round((sp.chaptersVisited / sp.chaptersTotal) * 100) : 0;
              return (
                <div key={sp.subjectId} data-testid={`progress-subject-${sp.subjectId}`}>
                  <div className="flex justify-between text-sm mb-2 font-bold text-gray-700 dark:text-gray-200">
                    <span>{sp.subjectName}</span>
                    <span className="text-gray-500 dark:text-gray-400">{sp.chaptersVisited}/{sp.chaptersTotal}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: progressGrads[i % progressGrads.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Streak + Notes Read row (from Firestore progress) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="liquid-card rounded-3xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}>
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Day Streak</p>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {progressStats?.currentStreak ?? 0}
              <span className="text-sm text-muted-foreground font-bold ml-1">days</span>
            </p>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">
              Longest: {progressStats?.longestStreak ?? 0} days
            </p>
          </div>
        </div>
        <div className="liquid-card rounded-3xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notes Completed</p>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {progressStats?.notesCompleted ?? 0}
            </p>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">
              Accuracy: {progressStats?.accuracyPercent ?? 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Activity feed (note opens, MCQ attempts, etc.) */}
      {progressStats?.recentActivity && progressStats.recentActivity.length > 0 && (
        <div className="liquid-panel rounded-3xl p-6">
          <h2 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Recent Activity
          </h2>
          <div className="space-y-2">
            {progressStats.recentActivity.slice(0, 8).map((a) => (
              <div key={a.id} className="liquid-inner rounded-2xl px-4 py-3 flex items-center gap-3">
                <ActivityIcon type={a.type} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                    {activityLabel(a)}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {relativeTime(a.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Chapters */}
      {summary?.recentChapters && summary.recentChapters.length > 0 ? (
        <div className="liquid-panel rounded-3xl p-6">
          <h2 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">🕐 Recently Visited</h2>
          <div className="space-y-2">
            {summary.recentChapters.map((ch, i) => (
              <Link key={ch.id} href={`/chapters/${ch.chapterId}`}>
                <div
                  data-testid={`card-recent-${ch.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 cursor-pointer transition-all group liquid-inner"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md"
                      style={{ background: recentGrads[i % recentGrads.length] }}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                        {ch.chapterTitle}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">{ch.subjectName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.mcqScore != null && ch.mcqTotal != null && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl liquid-card text-emerald-700 dark:text-emerald-300">
                        {ch.mcqScore}/{ch.mcqTotal} ✅
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : !isLoading && (
        <div className="liquid-panel rounded-3xl p-10 text-center">
          <div className="text-5xl mb-3">🚀</div>
          <p className="font-black text-lg text-gray-900 dark:text-gray-100">No chapters visited yet!</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-5 font-medium">Start exploring to track your progress.</p>
          <Link href="/subjects">
            <button className="px-6 py-3 rounded-2xl font-black text-sm text-white shadow-lg hover:opacity-90 transition-opacity"
              data-testid="button-explore-subjects"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
              📚 Explore Subjects
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
