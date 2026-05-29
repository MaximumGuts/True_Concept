/**
 * Student-facing paper picker — shows the papers belonging to one Paper Set.
 *
 * Tap a paper → /papers/:setId/:paperId (the immersive reader).
 */

import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ScrollText, FileText, ChevronRight, Youtube } from "lucide-react";
import { useGetPaperSet, useGetPapers } from "@/lib/papers-api";

export default function PaperSetDetailPage() {
  const [, params] = useRoute("/papers/:setId");
  const [, setLocation] = useLocation();
  const setId = params?.setId ?? "";

  const { data: set, isLoading: setLoading } = useGetPaperSet(setId);
  const { data: papers, isLoading: papersLoading, error } = useGetPapers({ setId });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/85 border-b border-border"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/papers")}
            className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors"
            data-testid="button-back-paper-list"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-wider">📜 PAPER SET</p>
            <h1 className="font-black text-base text-foreground leading-tight truncate">
              {setLoading ? "Loading…" : set?.name ?? "Paper set"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Set hero panel */}
        {set && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-5 mb-5 text-white shadow-xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed 60%, #5b21b6)" }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" }} />
            <p className="text-[10px] font-black text-white/70 uppercase tracking-wider relative">{set.classLevel}</p>
            <h2 className="font-black text-2xl leading-tight mt-1 relative">{set.name}</h2>
            {set.description && (
              <p className="text-white/85 text-sm font-semibold mt-2 leading-relaxed relative">{set.description}</p>
            )}
            {papers && (
              <p className="text-[11px] text-white/70 font-bold mt-3 relative">
                {papers.length === 1 ? "1 paper available" : `${papers.length} papers available`}
              </p>
            )}
          </motion.div>
        )}

        {/* States */}
        {papersLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 liquid-card rounded-2xl animate-pulse" />)}
          </div>
        )}

        {error && (
          <div className="liquid-card rounded-3xl text-center py-12">
            <p className="font-black text-rose-500 text-sm">Could not load papers</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{error.message}</p>
          </div>
        )}

        {!papersLoading && !error && (!papers || papers.length === 0) && (
          <div className="liquid-card rounded-3xl text-center py-16">
            <ScrollText className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="font-black text-lg text-foreground mb-1">No papers yet</p>
            <p className="text-xs text-muted-foreground font-medium">Your teacher will add papers here soon.</p>
          </div>
        )}

        {!papersLoading && !error && papers && papers.length > 0 && (
          <div className="space-y-3" data-testid="paper-list">
            {papers.map((p, i) => (
              <Link key={p.id} href={`/papers/${setId}/${p.id}`} data-testid={`paper-card-${p.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  whileTap={{ scale: 0.99 }}
                  className="liquid-card rounded-2xl p-4 cursor-pointer flex items-start gap-3 relative overflow-hidden"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                       style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground text-sm leading-snug">{p.title}</p>
                    {p.content && (
                      <p className="text-xs text-muted-foreground font-medium mt-1 line-clamp-2">
                        {p.content.replace(/[#*_`>~\-\[\]()!|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120)}…
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300">
                        📜 Open Paper
                      </span>
                      {p.youtubeIds && p.youtubeIds.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500">
                          <Youtube className="w-3 h-3" />
                          {p.youtubeIds.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
