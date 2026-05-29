import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { ChevronRight, BookOpen, ScrollText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { MotionList, MotionItem, FadeIn } from "@/components/MotionList";
import { getSubjectTheme } from "@/lib/subject-theme";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-28 md:pb-12 blob-bg">
      <FadeIn>
        <div className="text-center mb-12">
          <span className="brand-pill mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Pick your subject
          </span>
          <div className="text-4xl mb-3 anim-float inline-block">📚</div>
          <h1 className="font-black text-4xl sm:text-5xl text-foreground mb-2 tracking-tight" data-testid="heading-subjects">
            {isStudent && prefs ? (
              <>
                <span className="gradient-text">{prefs.class}</span>
                <span className="text-foreground"> · </span>
                <span>{prefs.medium} Medium</span>
              </>
            ) : (
              <>All <span className="gradient-text">Subjects</span></>
            )}
          </h1>
          <p className="text-muted-foreground font-semibold text-base sm:text-lg">
            Choose a subject and start studying smarter ✨
          </p>
          {isStudent && prefs && (
            <p className="text-sm text-muted-foreground/80 font-medium mt-1">
              Showing subjects for your class and medium
            </p>
          )}
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="liquid-card rounded-3xl p-6">
              <div className="w-16 h-16 rounded-2xl mb-5 skeleton-shimmer" />
              <div className="h-5 w-3/4 mb-2 rounded skeleton-shimmer" />
              <div className="h-4 w-full mb-1 rounded skeleton-shimmer" />
              <div className="h-4 w-2/3 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ── Full Length Question Papers — visually unique entry point ──
              Sits first so it's discoverable. Different gradient (purple-gold
              instead of subject-theme palette), distinct icon (📜), and a
              subtle glow band signals "this is something else, not a subject". */}
          {isStudent && <FullLengthPapersCard />}
          {filtered.map((subject, idx) => {
            const theme = getSubjectTheme(subject.name, idx);
            return (
              <MotionItem key={subject.id}>
                <Link href={`/subjects/${subject.id}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    data-testid={`card-subject-${subject.id}`}
                    className="group liquid-card rounded-3xl overflow-hidden cursor-pointer relative h-full"
                  >
                    {/* Decorative giant letter watermark */}
                    <div
                      className="absolute -top-4 -right-2 text-[160px] font-black opacity-[0.07] pointer-events-none leading-none select-none"
                      style={{ color: theme.accent }}
                    >
                      {subject.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Top gradient stripe */}
                    <div className="h-2" style={{ background: theme.grad }} />

                    <div className="p-6 relative">
                      {/* Icon with glow */}
                      <div className="relative w-16 h-16 rounded-2xl mb-5 flex items-center justify-center text-3xl shadow-lg"
                        style={{ background: theme.grad }}>
                        <div className="absolute inset-0 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-opacity"
                          style={{ background: theme.glow }} />
                        <span className="relative">{theme.emoji}</span>
                      </div>

                      <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2 font-medium assamese-text">
                        {subject.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {subject.classLevels.map((cl) => (
                            <span key={cl} className="text-xs font-black px-3 py-1 rounded-full text-white shadow-sm"
                              style={{ background: theme.badge }}>
                              {cl}
                            </span>
                          ))}
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:translate-x-0.5 transition-transform"
                          style={{ background: theme.grad }}
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </MotionItem>
            );
          })}
        </MotionList>
      ) : (
        <FadeIn>
          {/* Even when no subjects exist, students should still see the
              Full Length Papers card — papers are independent content. */}
          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <FullLengthPapersCard />
            </div>
          )}
          <div className="liquid-panel rounded-3xl text-center py-20 px-6">
            <div className="text-6xl mb-4 anim-float">📭</div>
            <p className="font-black text-xl text-foreground mb-2">No subjects yet for {prefs?.class ?? "your class"}</p>
            <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto">
              Check back soon — new subjects are being added regularly.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

// ── Full Length Question Papers card — sibling to subject cards ────────────
// Distinct visual treatment (purple-gold gradient + 📜 icon + "EXAM PREP"
// pill) so it reads as parallel-tier content, not just another subject.
function FullLengthPapersCard() {
  return (
    <MotionItem>
      <Link href="/papers" data-testid="card-full-length-papers">
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="group rounded-3xl overflow-hidden cursor-pointer relative h-full shadow-xl"
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 55%, #4c1d95 100%)",
            border: "1px solid rgba(252,211,77,0.35)",
          }}
        >
          {/* Floating sparkle */}
          <motion.div
            className="absolute top-3 right-3 text-amber-300/80 pointer-events-none"
            animate={{ rotate: [0, 360], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>

          {/* Decorative giant 📜 watermark */}
          <div className="absolute -top-4 -right-2 text-[160px] opacity-[0.10] pointer-events-none leading-none select-none">
            📜
          </div>

          {/* Top hairline glow — warm amber accent */}
          <div className="h-2"
               style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)" }} />

          <div className="p-6 relative">
            {/* Icon with glow */}
            <div className="relative w-16 h-16 rounded-2xl mb-5 flex items-center justify-center shadow-lg"
                 style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.10))" }}>
              <div className="absolute inset-0 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-opacity"
                   style={{ background: "rgba(252,211,77,0.50)" }} />
              <ScrollText className="w-7 h-7 text-white relative" strokeWidth={2.2} />
            </div>

            {/* "EXAM PREP" pill */}
            <span className="inline-block text-[10px] font-black text-amber-100 uppercase tracking-[0.18em] mb-2 px-2 py-0.5 rounded-full bg-white/15">
              ✨ Exam Prep
            </span>

            <h3 className="text-lg font-black text-white mb-2 group-hover:text-amber-200 transition-colors leading-tight">
              Full Length Question Papers
            </h3>
            <p className="text-sm text-white/80 mb-5 leading-relaxed font-medium">
              Practice with board-style mock papers. Read, study, and prepare like the real exam.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-200 tracking-wide">Tap to open →</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:translate-x-0.5 transition-transform"
                   style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                <ChevronRight className="w-4 h-4 text-purple-900" strokeWidth={3} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </MotionItem>
  );
}
