import { Link } from "wouter";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight } from "lucide-react";

const statCards = [
  { key: "totalChapters", label: "Total Chapters", emoji: "📚", grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)" },
  { key: "visitedChapters", label: "Chapters Done", emoji: "✅", grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)" },
  { key: "totalMcqAttempts", label: "MCQ Attempts", emoji: "🎯", grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.25)" },
  { key: "averageScore", label: "Avg Score", emoji: "⭐", grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.25)", suffix: "%" },
];

const progressGrads = [
  "linear-gradient(90deg, #3b82f6, #6366f1)",
  "linear-gradient(90deg, #10b981, #14b8a6)",
  "linear-gradient(90deg, #8b5cf6, #a855f7)",
  "linear-gradient(90deg, #f43f5e, #fb7185)",
  "linear-gradient(90deg, #f59e0b, #f97316)",
];

const recentGrads = [
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #8b5cf6, #a855f7)",
  "linear-gradient(135deg, #f43f5e, #fb7185)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
];

const motivations = [
  "Keep it up! You're doing amazing 🔥",
  "Stay consistent, success follows 💪",
  "Every chapter brings you closer 🎯",
  "You're a star student! ⭐",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();
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
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">👋</div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl" data-testid="heading-dashboard">
                Hey, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-purple-300 text-sm font-semibold">{msg}</p>
            </div>
          </div>
          {summary?.totalChapters ? (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-300 mb-2 font-bold">
                <span>Overall Progress</span>
                <span>{visitedPct}% Complete</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${visitedPct}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
              </div>
              <p className="text-xs text-purple-400 mt-1 font-semibold">{summary.visitedChapters} of {summary.totalChapters} chapters</p>
            </div>
          ) : null}
        </div>
      </div>

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
              <div className="text-3xl font-black text-gray-900">{display}</div>
              <div className="text-xs font-bold text-gray-500 mt-0.5">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Subject Progress */}
      {summary?.subjectProgress && summary.subjectProgress.length > 0 && (
        <div className="liquid-panel rounded-3xl p-6">
          <h2 className="font-black text-xl text-gray-900 mb-5 flex items-center gap-2">📊 Subject Progress</h2>
          <div className="space-y-4">
            {summary.subjectProgress.map((sp, i) => {
              const pct = sp.chaptersTotal > 0 ? Math.round((sp.chaptersVisited / sp.chaptersTotal) * 100) : 0;
              return (
                <div key={sp.subjectId} data-testid={`progress-subject-${sp.subjectId}`}>
                  <div className="flex justify-between text-sm mb-2 font-bold text-gray-700">
                    <span>{sp.subjectName}</span>
                    <span className="text-gray-500">{sp.chaptersVisited}/{sp.chaptersTotal}</span>
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

      {/* Recent Chapters */}
      {summary?.recentChapters && summary.recentChapters.length > 0 ? (
        <div className="liquid-panel rounded-3xl p-6">
          <h2 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">🕐 Recently Visited</h2>
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
                      <div className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                        {ch.chapterTitle}
                      </div>
                      <div className="text-xs text-gray-500 font-bold">{ch.subjectName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.mcqScore != null && ch.mcqTotal != null && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl liquid-card text-emerald-700">
                        {ch.mcqScore}/{ch.mcqTotal} ✅
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : !isLoading && (
        <div className="liquid-panel rounded-3xl p-10 text-center">
          <div className="text-5xl mb-3">🚀</div>
          <p className="font-black text-lg text-gray-900">No chapters visited yet!</p>
          <p className="text-gray-500 text-sm mt-1 mb-5 font-medium">Start exploring to track your progress.</p>
          <Link href="/subjects">
            <button className="px-6 py-3 rounded-2xl font-black text-sm text-white shadow-lg hover:opacity-90 transition-opacity"
              data-testid="button-explore-subjects"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              📚 Explore Subjects
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
