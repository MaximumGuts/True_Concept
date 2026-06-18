/**
 * RecommendationPopup — a lively, attention-grabbing pop-up that surfaces the
 * AI Mentor's single most important next action, shown ONCE per app open.
 *
 * Reuses the same engine as NextRecommendationCard (`useNextRecommendation`)
 * and the shared bilingual labels. Tapping the CTA navigates to the target
 * (note / video / lab / MCQ / Q&A / next chapter). Dismissible.
 *
 * "Once per app open" = once per browser session, gated via sessionStorage so
 * a returning student isn't nagged on every dashboard visit but does see it
 * again after fully reopening the app.
 *
 * Mounted globally in Layout.tsx (students only).
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useNextRecommendation } from "@/hooks/useNextRecommendation";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { RUNG_LABELS, CTA_LABEL, pickLang } from "@/lib/recommendation-labels";

const SESSION_KEY = "tc_rec_popup_shown";
const SHOW_DELAY_MS = 1200;

const THEME_DARK = {
  cardBg:     "linear-gradient(160deg, #1f2937 0%, #111827 100%)",
  border:     "rgba(255,148,80,0.40)",
  title:      "#ffedd5",
  msg:        "rgba(254,215,170,0.88)",
  chip:       "linear-gradient(135deg,#ffb380,#ff9450)",
  ctaBg:      "linear-gradient(135deg,#ff9450,#f97316)",
  glow:       "rgba(255,148,80,0.45)",
};
const THEME_LIGHT = {
  ...THEME_DARK,
  cardBg:     "linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%)",
  title:      "#92400e",
  msg:        "rgba(120,53,15,0.82)",
};

export default function RecommendationPopup() {
  const { data } = useNextRecommendation();
  const { prefs } = useStudentPrefs();
  const { resolvedTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const isAssamese = prefs?.medium === "Assamese";
  const theme = resolvedTheme === "dark" ? THEME_DARK : THEME_LIGHT;

  // Decide whether to show — once data is ready, not already shown this session,
  // and there's an actionable recommendation.
  useEffect(() => {
    if (open) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (!data) return;
    if (data.kind === "all_caught_up" || !data.target.ctaUrl) return;

    const t = window.setTimeout(() => {
      // Re-check the flag at fire time (guards against double-mount races).
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [data, open]);

  if (!data) return null;

  const title = pickLang(data.target.title, isAssamese);
  const reason = pickLang(data.reason, isAssamese);
  const subjectName = data.target.subjectName ? pickLang(data.target.subjectName, isAssamese) : null;
  const chapterTitle = data.target.chapterTitle ? pickLang(data.target.chapterTitle, isAssamese) : null;
  const ctaLabel = CTA_LABEL[data.kind] ?? CTA_LABEL.unread_note;
  const rungLabel = RUNG_LABELS[data.kind] ?? "AI";

  const close = () => setOpen(false);
  const go = () => {
    close();
    if (data.target.ctaUrl) setLocation(data.target.ctaUrl);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10500] flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border"
            style={{ background: theme.cardBg, borderColor: theme.border, boxShadow: `0 20px 60px -12px ${theme.glow}` }}
          >
            {/* Ambient glow orb */}
            <motion.div
              className="absolute -top-16 -right-12 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)`, filter: "blur(36px)" }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Close */}
            <button
              onClick={close}
              aria-label="Dismiss"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full text-white uppercase tracking-[0.14em]"
                  style={{ background: theme.chip }}>
                  <Sparkles className="w-3 h-3" /> {isAssamese ? "তোমাৰ বাবে" : "For You"}
                </span>
                <span className="text-[10px] font-black px-2 py-1 rounded-md text-white tracking-[0.12em]"
                  style={{ background: theme.chip }}>
                  {rungLabel}
                </span>
              </div>

              {/* Bouncy emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.1 }}
                className="text-5xl mb-3 select-none"
                style={{ filter: `drop-shadow(0 0 10px ${theme.glow})` }}
              >
                {data.emoji ?? "✨"}
              </motion.div>

              {(subjectName || chapterTitle) && (
                <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: theme.msg }}>
                  {[subjectName, chapterTitle].filter(Boolean).join(" · ")}
                </p>
              )}

              <h3 className="font-black text-lg leading-snug mb-2" style={{ color: theme.title }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: theme.msg }}>
                {reason}
              </p>

              {/* CTA */}
              <motion.button
                onClick={go}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden inline-flex items-center justify-center gap-2 text-white font-black text-sm py-3.5 rounded-2xl"
                style={{ background: theme.ctaBg, boxShadow: `0 8px 24px -6px ${theme.glow}` }}
                data-testid="button-rec-popup-cta"
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)" }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
                <span className="relative z-10">{pickLang(ctaLabel, isAssamese)}</span>
                <ArrowRight className="relative z-10 w-4 h-4" strokeWidth={2.5} />
              </motion.button>

              <button
                onClick={close}
                className="w-full mt-2 py-2 text-xs font-bold rounded-xl transition-colors"
                style={{ color: theme.msg }}
              >
                {isAssamese ? "পিছত" : "Maybe later"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
