import { Link } from "wouter";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, CheckCircle, TrendingUp, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Chapters", value: summary?.totalChapters ?? 0, icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
    { label: "Chapters Visited", value: summary?.visitedChapters ?? 0, icon: CheckCircle, color: "bg-green-500/10 text-green-600" },
    { label: "MCQ Attempts", value: summary?.totalMcqAttempts ?? 0, icon: TrendingUp, color: "bg-purple-500/10 text-purple-600" },
    { label: "Avg Score", value: `${summary?.averageScore ?? 0}%`, icon: TrendingUp, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground" data-testid="heading-dashboard">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Subject Progress */}
      {summary?.subjectProgress && summary.subjectProgress.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-lg text-foreground mb-4">Subject Progress</h2>
          <div className="space-y-4">
            {summary.subjectProgress.map((sp) => {
              const pct = sp.chaptersTotal > 0 ? Math.round((sp.chaptersVisited / sp.chaptersTotal) * 100) : 0;
              return (
                <div key={sp.subjectId} data-testid={`progress-subject-${sp.subjectId}`}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">{sp.subjectName}</span>
                    <span className="text-muted-foreground">{sp.chaptersVisited}/{sp.chaptersTotal} chapters</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(222,47%,25%)] rounded-full transition-all duration-500"
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
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Recently Visited
          </h2>
          <div className="space-y-3">
            {summary.recentChapters.map((ch) => (
              <Link key={ch.id} href={`/chapters/${ch.chapterId}`}>
                <div
                  data-testid={`card-recent-${ch.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {ch.chapterTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">{ch.subjectName}</div>
                  </div>
                  {ch.mcqScore != null && ch.mcqTotal != null && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {ch.mcqScore}/{ch.mcqTotal}
                      </div>
                      <div className="text-xs text-muted-foreground">MCQ score</div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No chapters visited yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">Start exploring subjects and chapters</p>
          <Link href="/subjects">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity" data-testid="button-explore-subjects">
              Explore Subjects
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
