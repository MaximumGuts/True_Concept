import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetSubject, getGetSubjectQueryKey,
  useGetChapters, getGetChaptersQueryKey,
} from "@workspace/api-client-react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

const chapterColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.3)" },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.3)" },
  { grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.3)" },
  { grad: "linear-gradient(135deg, #f43f5e, #fb7185)", glow: "rgba(244,63,94,0.3)" },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.3)" },
  { grad: "linear-gradient(135deg, #06b6d4, #3b82f6)", glow: "rgba(6,182,212,0.3)" },
];

const CLASS_LEVELS = ["Class IX", "Class X"];

export default function SubjectDetailPage() {
  const [, params] = useRoute("/subjects/:subjectId");
  const subjectId = parseInt(params?.subjectId ?? "0", 10);
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const isStudent = user?.role === "student";

  const defaultClass = isStudent && prefs ? prefs.class : "Class IX";
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);

  useEffect(() => {
    if (isStudent && prefs) setSelectedClass(prefs.class);
  }, [isStudent, prefs]);

  const { data: subject, isLoading: subjectLoading } = useGetSubject(subjectId, {
    query: { enabled: !!subjectId, queryKey: getGetSubjectQueryKey(subjectId) },
  });

  const { data: chapters, isLoading: chaptersLoading } = useGetChapters(
    { subjectId, classLevel: selectedClass as "Class IX" | "Class X" },
    { query: { enabled: !!subjectId, queryKey: getGetChaptersQueryKey({ subjectId, classLevel: selectedClass as "Class IX" | "Class X" }) } }
  );

  const filteredChapters = chapters?.filter((ch) => {
    if (!isStudent || !prefs) return true;
    return ch.medium === prefs.medium || ch.medium === "Both";
  });

  if (subjectLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-6 liquid-card rounded-xl w-24" />
        <div className="h-32 liquid-dark rounded-3xl" />
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 liquid-card rounded-2xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <Link href="/subjects">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-subjects">
          <ArrowLeft className="w-4 h-4" /> All Subjects
        </button>
      </Link>

      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white mb-8">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 font-black leading-none pointer-events-none">
          {subject?.name?.charAt(0)}
        </div>
        <h1 className="font-black text-3xl sm:text-4xl mb-2 relative assamese-text" data-testid="heading-subject">{subject?.name}</h1>
        <p className="text-purple-300 font-semibold relative assamese-text">{subject?.description}</p>
        {isStudent && prefs && (
          <div className="mt-3 flex gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-black text-purple-200"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              {prefs.class}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-black text-purple-200"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              {prefs.medium} Medium
            </span>
          </div>
        )}
      </div>

      {/* Class Selector — only shown to admins or when not filtered */}
      {!isStudent && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {CLASS_LEVELS.filter((cl) => subject?.classLevels.includes(cl)).map((cl) => (
            <button
              key={cl}
              onClick={() => setSelectedClass(cl)}
              data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                selectedClass === cl
                  ? "text-white shadow-lg scale-105"
                  : "liquid-card text-gray-700 hover:scale-105"
              }`}
              style={selectedClass === cl ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
            >
              {cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
            </button>
          ))}
        </div>
      )}

      {chaptersLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 liquid-card rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredChapters && filteredChapters.length > 0 ? (
        <div className="space-y-4">
          {filteredChapters.map((chapter, i) => {
            const col = chapterColors[i % chapterColors.length];
            return (
              <Link key={chapter.id} href={`/chapters/${chapter.id}`} className="block">
                <div
                  data-testid={`card-chapter-${chapter.id}`}
                  className="group liquid-card rounded-2xl p-4 sm:p-5 card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md font-black text-white text-sm"
                      style={{ background: col.grad }}>
                      <div className="absolute inset-0 rounded-2xl blur-sm opacity-50" style={{ background: col.glow }} />
                      <span className="relative">{chapter.chapterNumber}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-0.5">Chapter {chapter.chapterNumber}</p>
                      <h3 className="font-black text-gray-900 group-hover:text-purple-700 transition-colors mb-1 assamese-text">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1 font-medium assamese-text">{chapter.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {chapter.medium && chapter.medium !== "Both" && (
                          <span className="inline-flex items-center gap-1 text-xs liquid-inner text-indigo-700 px-2.5 py-1 rounded-full font-black">
                            {chapter.medium === "Assamese" ? "🇮🇳 অসমীয়া" : "🌐 English"}
                          </span>
                        )}
                        {chapter.hasNotes && (
                          <span className="inline-flex items-center gap-1 text-xs liquid-inner text-blue-700 px-2.5 py-1 rounded-full font-black">📝 Notes</span>
                        )}
                        {chapter.hasMcqs && (
                          <span className="inline-flex items-center gap-1 text-xs liquid-inner text-purple-700 px-2.5 py-1 rounded-full font-black">🎯 MCQ</span>
                        )}
                        {chapter.hasQa && (
                          <span className="inline-flex items-center gap-1 text-xs liquid-inner text-emerald-700 px-2.5 py-1 rounded-full font-black">❓ Q&amp;A</span>
                        )}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 liquid-inner group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="liquid-panel rounded-3xl text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-black text-lg text-gray-900">No chapters yet for {selectedClass}</p>
          {isStudent && prefs && (
            <p className="text-gray-500 text-sm mt-2 font-medium">
              No {prefs.medium} medium chapters found for {prefs.class} in this subject.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
