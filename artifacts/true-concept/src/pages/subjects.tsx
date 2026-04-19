import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

const subjectColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.3)", badge: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.3)", badge: "linear-gradient(135deg, #10b981, #14b8a6)" },
  { grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.3)", badge: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { grad: "linear-gradient(135deg, #f43f5e, #fb7185)", glow: "rgba(244,63,94,0.3)", badge: "linear-gradient(135deg, #f43f5e, #fb7185)" },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.3)", badge: "linear-gradient(135deg, #f59e0b, #f97316)" },
];

const subjectEmojis = ["🔢", "🔬", "📐", "📖", "🧬", "⚛️"];

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useGetSubjects();
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();

  const isStudent = user?.role === "student";

  const filtered = subjects?.filter((s) => {
    if (!isStudent || !prefs) return true;
    return s.classLevels.includes(prefs.class);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">📚</div>
        <h1 className="font-black text-4xl text-gray-900 mb-2" data-testid="heading-subjects">
          {isStudent && prefs ? `${prefs.class} · ${prefs.medium} Medium` : "All Subjects"}
        </h1>
        <p className="text-gray-600 font-bold">Choose your subject and start studying!</p>
        {isStudent && prefs && (
          <p className="text-sm text-gray-400 font-medium mt-1">
            Showing subjects for your class and medium
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="liquid-card rounded-3xl p-6 animate-pulse">
              <div className="w-14 h-14 bg-white/40 rounded-2xl mb-4" />
              <div className="h-5 bg-white/40 rounded-lg mb-2 w-3/4" />
              <div className="h-4 bg-white/30 rounded mb-1" />
              <div className="h-4 bg-white/30 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((subject, idx) => {
            const col = subjectColors[idx % subjectColors.length];
            const emoji = subjectEmojis[idx % subjectEmojis.length];
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className="group liquid-card rounded-3xl overflow-hidden card-hover"
                >
                  <div className="h-2" style={{ background: col.grad }} />
                  <div className="p-6">
                    <div className="relative w-16 h-16 rounded-2xl mb-5 flex items-center justify-center text-3xl shadow-lg"
                      style={{ background: col.grad }}>
                      <div className="absolute inset-0 rounded-2xl blur-md opacity-50"
                        style={{ background: col.glow }} />
                      <span className="relative">{emoji}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2 font-medium assamese-text">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {subject.classLevels.map((cl) => (
                          <span key={cl} className="text-xs font-black px-3 py-1 rounded-full text-white shadow-sm"
                            style={{ background: col.badge }}>
                            {cl}
                          </span>
                        ))}
                      </div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
