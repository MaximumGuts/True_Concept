/**
 * Immersive paper reader.
 *
 * Mirrors NoteReaderModal's styling (full-screen scroll area, markdown body,
 * optional YouTube embeds) but:
 *   • no UnlockGate (papers are ad-free per product decision)
 *   • no Mark-as-Read CTA (no AI tracking on papers)
 *   • no NextStepCard
 *
 * Just: title → markdown body → optional embedded videos at the bottom.
 */

import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import "katex/dist/katex.min.css";
import { markdownComponents } from "@/lib/markdown-components";
import { ArrowLeft, X, Play } from "lucide-react";
import { useGetPaper, useGetPaperSet } from "@/lib/papers-api";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";

/** Single video card — opens YouTube app/site so ads play correctly. */
function PaperVideoEmbed({ youtubeId, index, total }: { youtubeId: string; index: number; total: number }) {
  return (
    <YouTubeThumbnail
      youtubeId={youtubeId}
      label={total > 1 ? `Video ${index} of ${total}` : "Video"}
    />
  );
}

export default function PaperReaderPage() {
  const [, params] = useRoute("/papers/:setId/:paperId");
  const [, setLocation] = useLocation();
  const setId = params?.setId ?? "";
  const paperId = params?.paperId ?? "";

  const { data: paper, isLoading, error } = useGetPaper(paperId);
  const { data: set } = useGetPaperSet(setId);

  // Lock body scroll while open (mirrors NoteReaderModal behaviour)
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLocation(`/papers/${setId}`); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setId, setLocation]);

  const handleClose = () => setLocation(`/papers/${setId}`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[40] bg-background"
      data-testid="paper-reader"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="flex flex-col h-full"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/85 border-b border-border shadow-sm"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))" }}>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button
              onClick={handleClose}
              data-testid="button-close-paper"
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base shrink-0 shadow-md"
                 style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              📜
            </div>
            <div className="flex-1 min-w-0">
              {set && <p className="text-[10px] font-black text-purple-400 uppercase tracking-wider truncate">{set.name}</p>}
              <h1 className="font-black text-base sm:text-lg text-foreground truncate">
                {isLoading ? "Loading…" : paper?.title ?? "Paper"}
              </h1>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0 hidden sm:flex"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Body — extra bottom padding for the native AdMob banner */}
        <div className="flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-6 liquid-card rounded-lg animate-pulse" />)}
              </div>
            )}

            {error && (
              <div className="liquid-card rounded-3xl text-center py-12">
                <p className="font-black text-rose-500 text-sm">Could not load this paper</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{error.message}</p>
              </div>
            )}

            {!isLoading && !error && paper && (
              <>
                <div className="note-reading-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={markdownComponents}
                  >
                    {paper.content || "_(This paper has no content yet — your teacher will fill it in soon.)_"}
                  </ReactMarkdown>
                </div>

                {/* Videos */}
                {paper.youtubeIds && paper.youtubeIds.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/15 dark:bg-red-500/20">
                        <Play className="w-4 h-4 text-red-600 dark:text-red-400 fill-current" />
                      </div>
                      <h3 className="font-black text-base text-foreground">
                        {paper.youtubeIds.length === 1 ? "Walkthrough Video" : `${paper.youtubeIds.length} Walkthrough Videos`}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {paper.youtubeIds.map((vid, idx) => (
                        <PaperVideoEmbed key={`${vid}-${idx}`} youtubeId={vid} index={idx + 1} total={paper.youtubeIds.length} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
