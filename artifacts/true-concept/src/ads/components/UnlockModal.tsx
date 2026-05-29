/**
 * Bilingual modal that prompts the student to watch a rewarded ad to unlock
 * a feature for 1 hour.
 *
 * Used by `<UnlockGate>` only — never instantiated directly from pages.
 *
 * Strings are inline (En + As) and switched via `useStudentPrefs().prefs.medium`.
 * No LanguageContext dependency, so this modal works on every route — the
 * LanguageContext is scoped to /virtual-lab only and gates would otherwise
 * crash on the chapter detail / dashboard pages.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Play, X, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { FEATURE_LABELS, type UnlockFeature } from "../config";

interface Props {
  feature: UnlockFeature;
  /** Called when student taps "Watch Ad". Should resolve true on success, false if skipped. */
  onWatchAd: () => Promise<boolean>;
  /** Called when student taps "Maybe later" / X / outside the modal. */
  onDismiss: () => void;
}

// ── Per-feature visual theme ────────────────────────────────────────────────
const THEMES: Record<UnlockFeature, { icon: string; gradFrom: string; gradTo: string; glow: string }> = {
  notes: { icon: "📚", gradFrom: "#6366f1", gradTo: "#4f46e5", glow: "rgba(99,102,241,0.40)" },
  lab:   { icon: "🧪", gradFrom: "#10b981", gradTo: "#059669", glow: "rgba(16,185,129,0.40)" },
  mcq:   { icon: "🎯", gradFrom: "#f59e0b", gradTo: "#d97706", glow: "rgba(245,158,11,0.40)" },
  qna:   { icon: "❓", gradFrom: "#ec4899", gradTo: "#db2777", glow: "rgba(236,72,153,0.40)" },
};

// ── Bilingual strings — kept inline so this file is self-contained ──────────
const STRINGS = {
  title: {
    notes: { en: "Unlock Notes",       as: "টোকা আনলক কৰক" },
    lab:   { en: "Unlock Lab",         as: "পৰীক্ষাগাৰ আনলক কৰক" },
    mcq:   { en: "Unlock MCQ",         as: "MCQ আনলক কৰক" },
    qna:   { en: "Unlock Q&A",         as: "প্ৰশ্নোত্তৰ আনলক কৰক" },
  },
  description: {
    en: "Watch a short ad to get 1 hour of free access — across every chapter.",
    as: "এক চমু বিজ্ঞাপন চাই সকলো অধ্যায়ৰ বাবে এক ঘণ্টাৰ বিনামূলীয়া প্ৰৱেশ পাওক।",
  },
  watchBtn: {
    en: "Watch Ad",
    as: "বিজ্ঞাপন চাওক",
  },
  loadingBtn: {
    en: "Loading ad…",
    as: "বিজ্ঞাপন লোড হৈ আছে…",
  },
  laterBtn: {
    en: "Maybe later",
    as: "পিছত",
  },
  errorTitle: {
    en: "Ad didn't finish",
    as: "বিজ্ঞাপন সম্পূৰ্ণ নহ'ল"
  },
  errorBody: {
    en: "Please watch the full ad to unlock this feature.",
    as: "এই সুবিধা আনলক কৰিবলৈ সম্পূৰ্ণ বিজ্ঞাপন চাওক।",
  },
  // Per-feature reward description
  reward: {
    notes: { en: "1 hour of reading any chapter's notes",     as: "যিকোনো অধ্যায়ৰ টোকা এক ঘণ্টা পঢ়িব পাৰিব" },
    lab:   { en: "1 hour of running any experiment's simulation", as: "যিকোনো পৰীক্ষাৰ চিমুলেচন এক ঘণ্টা চলাব পাৰিব" },
    mcq:   { en: "1 hour of taking any chapter's MCQ tests",  as: "যিকোনো অধ্যায়ৰ MCQ পৰীক্ষা এক ঘণ্টা দিব পাৰিব" },
    qna:   { en: "1 hour of viewing any chapter's Q&A",       as: "যিকোনো অধ্যায়ৰ প্ৰশ্নোত্তৰ এক ঘণ্টা চাব পাৰিব" },
  },
};

export default function UnlockModal({ feature, onWatchAd, onDismiss }: Props) {
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";
  const [loading, setLoading] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  const theme = THEMES[feature];
  const label = FEATURE_LABELS[feature];
  const tr = <T,>(field: { en: T; as: T }): T => isAs ? field.as : field.en;

  const handleWatch = async () => {
    if (loading) return; // anti-double-click
    setLoading(true);
    setErrorShown(false);
    try {
      const earned = await onWatchAd();
      if (!earned) {
        // Student skipped the ad — show a gentle nudge and stay on the modal
        setErrorShown(true);
      }
      // If earned, the parent UnlockGate unmounts us — no state update needed
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10500] flex items-end sm:items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "var(--glass-card-bg, rgba(15,23,42,0.97))",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
          data-testid={`unlock-modal-${feature}`}
        >
          {/* Header with gradient + icon */}
          <div
            className="relative px-6 pt-7 pb-5 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})` }}
          >
            {/* Animated glow halo behind icon */}
            <motion.div
              className="absolute left-1/2 top-4 w-20 h-20 rounded-full pointer-events-none -translate-x-1/2"
              style={{ background: theme.glow, filter: "blur(20px)" }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label={isAs ? "বন্ধ কৰক" : "Close"}
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <motion.div
              className="relative text-5xl mb-2 inline-block"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {theme.icon}
            </motion.div>
            <h2 className="relative font-black text-xl tracking-tight">
              {tr(STRINGS.title[feature])}
            </h2>
            <p className="relative text-white/85 text-xs font-bold mt-1">
              {isAs ? label.as : label.en}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm font-bold text-foreground text-center leading-relaxed">
              {tr(STRINGS.description)}
            </p>

            {/* Reward callout */}
            <div
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.30)" }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-emerald-200 leading-relaxed">
                {tr(STRINGS.reward[feature])}
              </p>
            </div>

            {/* Error toast (shown when student skipped the ad) */}
            <AnimatePresence>
              {errorShown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.30)" }}
                  data-testid="unlock-error-toast"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-amber-200">{tr(STRINGS.errorTitle)}</p>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">{tr(STRINGS.errorBody)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Watch Ad button */}
            <button
              onClick={handleWatch}
              disabled={loading}
              data-testid="unlock-watch-ad"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white shadow-lg hover:scale-[1.02] active:scale-100 transition-transform text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})` }}
            >
              {loading
                ? (<><Loader2 className="w-4 h-4 animate-spin" /> {tr(STRINGS.loadingBtn)}</>)
                : (<><Play className="w-4 h-4 fill-current" /> {tr(STRINGS.watchBtn)}</>)}
            </button>

            {/* Maybe later */}
            <button
              onClick={onDismiss}
              disabled={loading}
              data-testid="unlock-maybe-later"
              className="w-full py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {tr(STRINGS.laterBtn)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
