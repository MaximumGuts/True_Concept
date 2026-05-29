/**
 * Student-facing Paper Sets picker — opens from the
 * "📜 Full Length Question Papers" card on /subjects.
 *
 * Lists admin-created sets filtered by the student's class preference
 * (Class IX / Class X / Both). Tap a set → /papers/:setId to see its papers.
 */

import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ScrollText, ChevronRight, Sparkles } from "lucide-react";
import { useStudentPrefs, type StudentClass } from "@/contexts/StudentPrefsContext";
import { useGetPaperSets, type PaperSetClassLevel } from "@/lib/papers-api";

function ClassFilterFor(cls: StudentClass | undefined): PaperSetClassLevel | "All" {
  // Students see their class + Both. The Cloud Function does the merging
  // server-side when classLevel != "All", so we just forward the preference.
  if (!cls) return "All";
  return cls;
}

export default function PaperSetsPage() {
  const [, setLocation] = useLocation();
  const { prefs } = useStudentPrefs();
  const filter = ClassFilterFor(prefs?.class);
  const { data: sets, isLoading, error } = useGetPaperSets({ classLevel: filter });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/85 border-b border-border"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/subjects")}
            className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors"
            data-testid="button-back-paper-sets"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-wider">SEBA & CBSE</p>
            <h1 className="font-black text-base text-foreground leading-tight">Full Length Question Papers</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Hero panel */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 mb-6 text-white shadow-xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed 60%, #5b21b6)" }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" }} />
          <ScrollText className="w-10 h-10 text-white/90 mb-3 relative" />
          <h2 className="font-black text-2xl leading-tight relative">Full Length Papers</h2>
          <p className="text-white/85 text-sm font-semibold mt-1 relative">
            Practice with full board-style papers — pick a set to begin.
          </p>
          {prefs?.class && (
            <p className="text-[11px] text-white/70 font-bold mt-2 relative">
              Showing papers for <span className="text-white">{prefs.class}</span>
            </p>
          )}
        </motion.div>

        {/* States */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-24 liquid-card rounded-2xl animate-pulse" />)}
          </div>
        )}

        {error && (
          <div className="liquid-card rounded-3xl text-center py-12">
            <p className="font-black text-rose-500 text-sm">Could not load paper sets</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && (!sets || sets.length === 0) && (
          <div className="liquid-card rounded-3xl text-center py-16">
            <ScrollText className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="font-black text-lg text-foreground mb-1">No paper sets available yet</p>
            <p className="text-xs text-muted-foreground font-medium px-4">
              Your teacher hasn't uploaded any full-length papers for{" "}
              {prefs?.class ?? "your class"} yet. Check back soon!
            </p>
          </div>
        )}

        {!isLoading && !error && sets && sets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sets.map((s, i) => (
              <Link key={s.id} href={`/papers/${s.id}`} data-testid={`paper-set-card-${s.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="liquid-card rounded-3xl p-5 cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                       style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)" }} />
                  <div className="flex items-start gap-3 relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shrink-0 shadow-md"
                         style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                      📜
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300">
                          {s.classLevel}
                        </span>
                      </div>
                      <p className="font-black text-foreground text-base leading-snug">{s.name}</p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground font-medium mt-1 line-clamp-2">{s.description}</p>
                      )}
                      <p className="text-[10px] text-purple-500 dark:text-purple-300 font-black mt-2 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        Tap to open
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
