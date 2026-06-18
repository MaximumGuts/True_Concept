import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetSubject, getGetSubjectQueryKey,
  useGetChapters, getGetChaptersQueryKey,
} from "@workspace/api-client-react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { MotionList, MotionItem, FadeIn } from "@/components/MotionList";
import { getSubjectTheme } from "@/lib/subject-theme";
import { getAutoIcon } from "@/lib/auto-icon";

const CLASS_LEVELS = ["Class IX", "Class X"];

export default function SubjectDetailPage() {
  const [, params] = useRoute("/subjects/:subjectId");
  const subjectId = params?.subjectId ?? "";
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
    const mediumOk = ch.medium === prefs.medium || ch.medium === "Both";
    const board = (ch as any).board as string | undefined;
    const boardOk = !board || board === "Both" || !prefs.board || board === prefs.board;
    return mediumOk && boardOk;
  });

  const subjectTheme = getSubjectTheme(subject?.name, 0, subject?.color);

  if (subjectLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="h-6 w-24 rounded-xl skeleton-shimmer" />
        <div className="h-36 rounded-3xl skeleton-shimmer" />
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <FadeIn>
        <Link href="/subjects">
          <button className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-orange-700 dark:hover:text-orange-300 mb-6 transition-colors group" data-testid="button-back-subjects">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> All Subjects
          </button>
        </Link>
      </FadeIn>

      {/* Hero panel — themed by subject */}
      <FadeIn delay={0.05}>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${subjectTheme.accent}, ${subjectTheme.accent}DD)` }}
        >
          {/* Decorative blob */}
          <div className="absolute -top-12 -right-8 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: subjectTheme.glow }} />

          {/* Giant emoji watermark */}
          <div className="absolute -top-4 right-2 text-[140px] opacity-10 leading-none pointer-events-none select-none">
            {subjectTheme.emoji}
          </div>

          {/* Subject letter watermark */}
          <div className="absolute bottom-2 -right-2 text-[110px] opacity-[0.08] font-black leading-none pointer-events-none select-none">
            {subject?.name?.charAt(0)}
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
              {subjectTheme.emoji} Subject
            </span>
            <h1 className="font-black text-3xl sm:text-4xl mb-2 assamese-text drop-shadow-sm" data-testid="heading-subject">
              {subject?.name}
            </h1>
            <p className="text-white/90 font-medium text-sm sm:text-base assamese-text leading-relaxed max-w-xl">
              {subject?.description}
            </p>
            {isStudent && prefs && (
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full font-black text-white bg-white/20 backdrop-blur-sm">
                  📚 {prefs.class}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-black text-white bg-white/20 backdrop-blur-sm">
                  🌐 {prefs.medium} Medium
                </span>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Class Selector — only shown to admins */}
      {!isStudent && (
        <FadeIn delay={0.1}>
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
            {CLASS_LEVELS.filter((cl) => subject?.classLevels.includes(cl)).map((cl) => (
              <button
                key={cl}
                onClick={() => setSelectedClass(cl)}
                data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                  selectedClass === cl
                    ? "text-white shadow-lg scale-105"
                    : "liquid-card text-foreground hover:scale-105"
                }`}
                style={selectedClass === cl ? { background: "var(--grad-brand)" } : {}}
              >
                {cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Chapters list header */}
      {filteredChapters && filteredChapters.length > 0 && (
        <FadeIn delay={0.12}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-foreground text-lg sm:text-xl">
              📖 Chapters <span className="text-muted-foreground font-bold text-sm">({filteredChapters.length})</span>
            </h2>
          </div>
        </FadeIn>
      )}

      {chaptersLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />)}
        </div>
      ) : filteredChapters && filteredChapters.length > 0 ? (
        <MotionList className="space-y-4">
          {filteredChapters.map((chapter) => (
            <MotionItem key={chapter.id}>
              <Link href={`/chapters/${chapter.id}`} className="block">
                <motion.div
                  whileHover={{ x: 4, y: -2 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  data-testid={`card-chapter-${chapter.id}`}
                  className="group liquid-card rounded-2xl p-4 sm:p-5 cursor-pointer relative overflow-hidden"
                >
                  {/* Hover glow accent — slides in from left */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: subjectTheme.grad }}
                  />

                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-2xl"
                      style={{ background: getAutoIcon(chapter.id, chapter.title).grad }}>
                      <div className="absolute inset-0 rounded-2xl blur-sm opacity-50"
                        style={{ background: getAutoIcon(chapter.id, chapter.title).glow }} />
                      <span className="relative drop-shadow-sm">{getAutoIcon(chapter.id, chapter.title).emoji}</span>
                      <div className="absolute -bottom-1 -right-1 min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow"
                        style={{ background: subjectTheme.accent }}>
                        {chapter.chapterNumber}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">
                        Chapter {chapter.chapterNumber}
                      </p>
                      <h3 className="font-black text-foreground text-base sm:text-lg group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors mb-1 leading-snug assamese-text">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 font-medium assamese-text">
                        {chapter.description}
                      </p>
                      <div className="flex gap-1.5 mt-2.5 flex-wrap">
                        {chapter.medium && chapter.medium !== "Both" && (
                          <span className="inline-flex items-center gap-1 text-[10px] liquid-inner text-foreground px-2 py-0.5 rounded-full font-black uppercase tracking-wide">
                            {chapter.medium === "Assamese" ? "অসমীয়া" : "English"}
                          </span>
                        )}
                        {chapter.hasNotes && (
                          <span className="inline-flex items-center gap-1 text-[10px] liquid-inner text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">📝 Notes</span>
                        )}
                        {chapter.hasMcqs && (
                          <span className="inline-flex items-center gap-1 text-[10px] liquid-inner text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">🎯 MCQ</span>
                        )}
                        {chapter.hasQa && (
                          <span className="inline-flex items-center gap-1 text-[10px] liquid-inner text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">❓ Q&amp;A</span>
                        )}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 liquid-inner group-hover:scale-110 group-hover:translate-x-0.5 transition-transform">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </MotionItem>
          ))}
        </MotionList>
      ) : (
        <FadeIn>
          <div className="liquid-panel rounded-3xl text-center py-16 px-6">
            <div className="text-5xl mb-3 anim-float inline-block">📭</div>
            <p className="font-black text-lg text-foreground mb-2">No chapters yet for {selectedClass}</p>
            {isStudent && prefs && (
              <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto">
                No {prefs.medium} medium chapters found for {prefs.class} in this subject.
              </p>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
