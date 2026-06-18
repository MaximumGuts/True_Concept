/**
 * NextRecommendationCard — the AI Mentor's SECOND card.
 *
 * Surfaces the deterministic next-best-action from the Phase 7C rule engine:
 * notes → video → lab → lab MCQ → chapter MCQ → QnA → next chapter.
 *
 * Visual polish: drifting gradient orb, pulsing compass, live indicator,
 * bouncy emoji entrance, shimmer sweep across CTA, animated arrow.
 */

import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Compass, Sparkles } from "lucide-react";
import { useNextRecommendation, type NextRecommendation } from "@/hooks/useNextRecommendation";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { RUNG_LABELS, CTA_LABEL, HEADER_LABEL, pickLang } from "@/lib/recommendation-labels";

// ── Brand DNA theme — two variants: dark (original) + light ─────────────────
const ORANGE_THEME_DARK = {
  border:     "rgba(255,148,80,0.40)",
  bg:         "rgba(255,148,80,0.08)",
  chip:       "linear-gradient(135deg,#ffb380,#ff9450)",
  ctaBg:      "linear-gradient(135deg,#ff9450,#f97316)",
  glow:       "rgba(255,148,80,0.50)",
  orb:        "radial-gradient(circle, rgba(255,148,80,0.55), transparent 70%)",
  orbAlt:     "radial-gradient(circle, rgba(251,146,60,0.45), transparent 70%)",
  titleColor: "#ffedd5",
  msgColor:   "rgba(254,215,170,0.85)",
};
const ORANGE_THEME_LIGHT = {
  ...ORANGE_THEME_DARK,
  titleColor: "#92400e",   // amber-800 — readable on cream
  msgColor:   "rgba(120,53,15,0.80)", // amber-900 @ 80%
};

// ── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="liquid-ai rounded-3xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded-lg w-1/3" />
          <div className="h-2 bg-white/10 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2">
        <div className="h-4 bg-white/10 rounded-lg w-3/4" />
        <div className="h-3 bg-white/10 rounded-lg w-full" />
        <div className="h-11 bg-white/10 rounded-xl mt-3" />
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function NextRecommendationCard() {
  const { data, isLoading, error, refresh } = useNextRecommendation();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading && !data) return <Skeleton />;

  if (error && !data) {
    return (
      <div className="liquid-ai rounded-3xl p-5 flex items-center gap-4">
        <Compass className="w-7 h-7 text-cyan-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-white font-black text-sm">Next Best Step</p>
          <p className="text-gray-500 dark:text-white/60 text-xs mt-0.5 break-all">{error}</p>
        </div>
        <button onClick={handleRefresh} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <RefreshCw className={`w-4 h-4 text-gray-400 dark:text-white/60 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    );
  }

  if (!data) return null;

  return <Card data={data} isAssamese={isAssamese} refreshing={refreshing} onRefresh={handleRefresh} />;
}

// ── Card body ────────────────────────────────────────────────────────────────

function Card({ data, isAssamese, refreshing, onRefresh }: {
  data: NextRecommendation;
  isAssamese: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? ORANGE_THEME_DARK : ORANGE_THEME_LIGHT;
  const rungLabel = RUNG_LABELS[data.kind] ?? "AI";
  const title = pickLang(data.target.title, isAssamese);
  const reason = pickLang(data.reason, isAssamese);
  const chapterTitle = data.target.chapterTitle ? pickLang(data.target.chapterTitle, isAssamese) : null;
  const subjectName = data.target.subjectName ? pickLang(data.target.subjectName, isAssamese) : null;
  const ctaLabel = CTA_LABEL[data.kind] ?? CTA_LABEL.unread_note;
  const headerText = isAssamese ? HEADER_LABEL.as : HEADER_LABEL.en;
  const showLangNote = isAssamese && !data.bilingualReady;
  const isFinal = data.kind === "all_caught_up";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative liquid-ai rounded-3xl overflow-hidden"
      style={{ boxShadow: `0 8px 32px -8px ${theme.glow}` }}
    >
      {/* Ambient drifting gradient orbs — brand orange DNA */}
      <motion.div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: theme.orb, filter: "blur(40px)" }}
        animate={{
          x: [0, 8, -4, 0],
          y: [0, -6, 4, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-60"
        style={{ background: theme.orbAlt, filter: "blur(48px)" }}
        animate={{
          x: [0, -6, 4, 0],
          y: [0, 4, -3, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header strip */}
      <div className="relative p-4 sm:p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Glowing pulsing icon */}
          <div className="relative shrink-0">
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ background: theme.chip, filter: "blur(10px)" }}
              animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: theme.chip }}
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Compass className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </motion.div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {/* Live pulse dot */}
              <span className="relative flex h-1.5 w-1.5">
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.9, 0.3, 0.9], scale: [1, 2.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-gray-500 dark:text-white/55 text-[10px] font-black uppercase tracking-[0.16em] leading-tight">
                {headerText}
              </p>
            </div>
            <p className="text-gray-900 dark:text-white font-black text-sm leading-tight mt-1 truncate">
              {subjectName && chapterTitle ? `${subjectName} · ${chapterTitle}` : "TRUE CONCEPT AI"}
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors shrink-0"
          title="Refresh recommendation"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 dark:text-white/60 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Recommendation body */}
      <div className="relative px-4 sm:px-5 pb-4 sm:pb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl border p-4 backdrop-blur-[2px] overflow-hidden"
          style={{ borderColor: theme.border, background: theme.bg }}
        >
          {/* Subtle inner glow at top */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.glow}, transparent)` }}
          />

          {/* Chip row with sheen + bouncy emoji */}
          <div className="flex items-center gap-2.5 mb-3">
            {/* Chip with shimmer sweep */}
            <div className="relative overflow-hidden rounded-md">
              <span
                className="relative inline-block text-[9px] font-black text-white px-2 py-1 rounded-md tracking-[0.12em]"
                style={{ background: theme.chip }}
              >
                {rungLabel}
              </span>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />
            </div>

            {/* Bouncy springy emoji */}
            <motion.span
              key={data.emoji ?? "✨"}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.15 }}
              className="text-2xl leading-none select-none"
              style={{ filter: `drop-shadow(0 0 8px ${theme.glow})` }}
            >
              {data.emoji ?? "✨"}
            </motion.span>

            {showLangNote && (
              <span className="ml-auto text-[9px] font-bold text-amber-300/90 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                English only
              </span>
            )}
          </div>

          {/* Target title */}
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-black text-base sm:text-[17px] leading-snug mb-2"
            style={{ color: theme.titleColor }}
          >
            {title || (isAssamese ? "অভিনন্দন!" : "Great job!")}
          </motion.p>

          {/* Reason */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="text-xs sm:text-[13px] leading-relaxed mb-4"
            style={{ color: theme.msgColor }}
          >
            {reason}
          </motion.p>

          {/* CTA with shimmer + animated arrow + hover glow */}
          {data.target.ctaUrl && !isFinal ? (
            <Link href={data.target.ctaUrl}>
              <motion.button
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden inline-flex items-center justify-center gap-2 text-white font-black text-sm py-3 rounded-xl transition-shadow"
                style={{
                  background: theme.ctaBg,
                  boxShadow: `0 6px 20px -4px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                }}
                data-testid="button-next-best-action"
              >
                {/* Shimmer sweep across button */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)" }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                />
                <span className="relative z-10">{pickLang(ctaLabel, isAssamese)}</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </motion.span>
              </motion.button>
            </Link>
          ) : (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center gap-2 text-white/70 text-sm font-bold py-3"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isAssamese ? "সকলো শেষ হৈছে!" : "All caught up — keep going!"}
              <Sparkles className="w-4 h-4 text-amber-300" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
