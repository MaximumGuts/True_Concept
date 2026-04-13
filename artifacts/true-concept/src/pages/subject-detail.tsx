import { useState } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetSubject, getGetSubjectQueryKey,
  useGetChapters, getGetChaptersQueryKey,
} from "@workspace/api-client-react";
import { FileText, HelpCircle, Play, CheckSquare, ChevronRight, ArrowLeft, BookOpen } from "lucide-react";

const CLASS_LEVELS = ["Class IX", "Class X"];

const chapterGradients = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-violet-500",
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
  "from-cyan-400 to-blue-500",
];

export default function SubjectDetailPage() {
  const [, params] = useRoute("/subjects/:subjectId");
  const subjectId = parseInt(params?.subjectId ?? "0", 10);
  const [selectedClass, setSelectedClass] = useState<string>("Class IX");

  const { data: subject, isLoading: subjectLoading } = useGetSubject(subjectId, {
    query: { enabled: !!subjectId, queryKey: getGetSubjectQueryKey(subjectId) },
  });

  const { data: chapters, isLoading: chaptersLoading } = useGetChapters(
    { subjectId, classLevel: selectedClass as "Class IX" | "Class X" },
    { query: { enabled: !!subjectId, queryKey: getGetChaptersQueryKey({ subjectId, classLevel: selectedClass as "Class IX" | "Class X" }) } }
  );

  if (subjectLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded-xl w-24" />
        <div className="h-32 bg-gray-100 rounded-3xl" />
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/subjects">
        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-subjects">
          <ArrowLeft className="w-4 h-4" />
          All Subjects
        </button>
      </Link>

      {/* Subject Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white mb-8"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)" }}>
        <div className="absolute top-0 right-0 text-[120px] opacity-10 font-black leading-none">
          {subject?.name?.charAt(0)}
        </div>
        <h1 className="font-black text-3xl sm:text-4xl mb-2 relative" data-testid="heading-subject">
          {subject?.name}
        </h1>
        <p className="text-purple-200 font-semibold relative">{subject?.description}</p>
      </div>

      {/* Class Selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {CLASS_LEVELS.filter((cl) => subject?.classLevels.includes(cl)).map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 ${
              selectedClass === cl
                ? "text-white border-transparent shadow-lg scale-105"
                : "bg-white border-gray-200 text-gray-600 hover:border-purple-200"
            }`}
            style={selectedClass === cl ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
          >
            {cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
          </button>
        ))}
      </div>

      {/* Chapters List */}
      {chaptersLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : chapters && chapters.length > 0 ? (
        <div className="space-y-3">
          {chapters.map((chapter, i) => {
            const grad = chapterGradients[i % chapterGradients.length];
            return (
              <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
                <div
                  data-testid={`card-chapter-${chapter.id}`}
                  className="group bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${grad} shadow-md font-black text-white text-sm`}>
                      {chapter.chapterNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Chapter {chapter.chapterNumber}</p>
                      <h3 className="font-black text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1 font-medium">{chapter.description}</p>
                      {/* Content badges */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {chapter.hasNotes && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                            📝 Notes
                          </span>
                        )}
                        {chapter.hasMcqs && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">
                            🎯 MCQ
                          </span>
                        )}
                        {chapter.hasQa && (
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                            ❓ Q&amp;A
                          </span>
                        )}
                        {chapter.hasVideo && (
                          <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full font-bold">
                            🎬 Video
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 group-hover:bg-purple-600 transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-gray-100">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-black text-lg text-gray-900">No chapters yet!</p>
          <p className="text-gray-400 text-sm mt-1 font-medium">No content available for {selectedClass} yet.</p>
        </div>
      )}
    </div>
  );
}
