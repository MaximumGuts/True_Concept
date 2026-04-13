import { Link } from "wouter";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, TrendingUp, ChevronRight } from "lucide-react";

const statCards = [
  { key: "totalChapters", label: "Total Chapters", emoji: "📚", gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50", text: "text-blue-700" },
  { key: "visitedChapters", label: "Chapters Done", emoji: "✅", gradient: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700" },
  { key: "totalMcqAttempts", label: "MCQ Attempts", emoji: "🎯", gradient: "from-purple-400 to-purple-600", bg: "bg-purple-50", text: "text-purple-700" },
  { key: "averageScore", label: "Avg MCQ Score", emoji: "⭐", gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700", suffix: "%" },
];

const progressColors = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-violet-500",
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
];

const motivationalMessages = [
  "Keep it up! You're doing amazing 🔥",
  "Stay consistent, success follows 💪",
  "Every chapter brings you closer to your goal 🎯",
  "You're a star student! ⭐",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();
  const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
        <div className="h-28 bg-gray-100 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const visitedPct = summary?.totalChapters ? Math.round(((summary?.visitedChapters ?? 0) / summary.totalChapters) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-2xl"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">👋</div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl" data-testid="heading-dashboard">
                Hey, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-purple-200 text-sm font-semibold">{msg}</p>
            </div>
          </div>
          {summary?.totalChapters ? (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-2 font-semibold">
                <span>Overall Progress</span>
                <span>{visitedPct}% Complete</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${visitedPct}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
              </div>
              <p className="text-xs text-purple-300 mt-1">{summary.visitedChapters} of {summary.totalChapters} chapters completed</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, emoji, gradient, bg, text, suffix }) => {
          const val = summary?.[key as keyof typeof summary] ?? 0;
          const display = typeof val === "number" ? `${suffix === "%" ? Math.round(Number(val)) : val}${suffix ?? ""}` : "—";
          return (
            <div key={key} className={`${bg} rounded-2xl p-5 border-2 border-white shadow-sm`} data-testid={`stat-${key}`}>
              <div className="text-3xl mb-3">{emoji}</div>
              <div className={`text-3xl font-black ${text}`}>{display}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Subject Progress */}
      {summary?.subjectProgress && summary.subjectProgress.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-purple-50 shadow-sm p-6">
          <h2 className="font-black text-xl text-gray-900 mb-5 flex items-center gap-2">
            <span>📊</span> Subject Progress
          </h2>
          <div className="space-y-4">
            {summary.subjectProgress.map((sp, i) => {
              const pct = sp.chaptersTotal > 0 ? Math.round((sp.chaptersVisited / sp.chaptersTotal) * 100) : 0;
              const grad = progressColors[i % progressColors.length];
              return (
                <div key={sp.subjectId} data-testid={`progress-subject-${sp.subjectId}`}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-800">{sp.subjectName}</span>
                    <span className="font-semibold text-gray-500">{sp.chaptersVisited}/{sp.chaptersTotal} chapters</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Chapters */}
      {summary?.recentChapters && summary.recentChapters.length > 0 ? (
        <div className="bg-white rounded-3xl border-2 border-purple-50 shadow-sm p-6">
          <h2 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
            <span>🕐</span> Recently Visited
          </h2>
          <div className="space-y-3">
            {summary.recentChapters.map((ch, i) => (
              <Link key={ch.id} href={`/chapters/${ch.chapterId}`}>
                <div
                  data-testid={`card-recent-${ch.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 cursor-pointer transition-colors group border-2 border-transparent hover:border-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black bg-gradient-to-br ${progressColors[i % progressColors.length]}`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {ch.chapterTitle}
                      </div>
                      <div className="text-xs text-gray-400 font-semibold">{ch.subjectName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.mcqScore != null && ch.mcqTotal != null && (
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-xl">
                        {ch.mcqScore}/{ch.mcqTotal} ✅
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-purple-50 shadow-sm p-10 text-center">
          <div className="text-5xl mb-3">🚀</div>
          <p className="font-black text-lg text-gray-900">No chapters visited yet!</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Start exploring subjects and chapters to track your progress.</p>
          <Link href="/subjects">
            <button className="px-6 py-3 rounded-2xl font-black text-sm text-white shadow-md hover:opacity-90 transition-opacity" data-testid="button-explore-subjects"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              📚 Explore Subjects
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
