import { useState } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetSubject,
  getGetSubjectQueryKey,
  useGetChapters,
  getGetChaptersQueryKey,
} from "@workspace/api-client-react";
import { BookOpen, FileText, HelpCircle, Play, CheckSquare, ChevronRight, ArrowLeft } from "lucide-react";

const CLASS_LEVELS = ["Class IX", "Class X"];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="h-5 bg-muted rounded w-2/3 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/subjects">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="button-back-subjects">
          <ArrowLeft className="w-4 h-4" />
          All Subjects
        </button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2" data-testid="heading-subject">
          {subject?.name}
        </h1>
        <p className="text-muted-foreground">{subject?.description}</p>
      </div>

      {/* Class Selector */}
      <div className="flex gap-2 mb-6">
        {CLASS_LEVELS.filter((cl) => subject?.classLevels.includes(cl)).map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedClass === cl
                ? "bg-[hsl(222,47%,25%)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cl}
          </button>
        ))}
      </div>

      {/* Chapters List */}
      {chaptersLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : chapters && chapters.length > 0 ? (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
              <div
                data-testid={`card-chapter-${chapter.id}`}
                className="group bg-card border border-border rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Chapter {chapter.chapterNumber}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{chapter.description}</p>
                    {/* Content badges */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {chapter.hasNotes && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          <FileText className="w-3 h-3" /> Notes
                        </span>
                      )}
                      {chapter.hasMcqs && (
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                          <CheckSquare className="w-3 h-3" /> MCQ
                        </span>
                      )}
                      {chapter.hasQa && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          <HelpCircle className="w-3 h-3" /> Q&amp;A
                        </span>
                      )}
                      {chapter.hasVideo && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                          <Play className="w-3 h-3" /> Video
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No chapters available</p>
          <p className="text-muted-foreground text-sm mt-1">No content for {selectedClass} yet.</p>
        </div>
      )}
    </div>
  );
}
