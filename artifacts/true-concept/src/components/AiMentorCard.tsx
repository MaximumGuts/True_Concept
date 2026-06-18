import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, RefreshCw, ArrowRight, Brain } from "lucide-react";
import { useAiRecommendations, type AiRecommendation } from "@/hooks/useAiRecommendations";
import { useTheme } from "@/contexts/ThemeContext";
import type { Timestamp } from "firebase/firestore";

// ── "Updated X min ago" helper ───────────────────────────────────────────────
// Reading freshness at a glance is the difference between "I trust this card"
// and "is this stale?". Shown in the header beside the refresh button.
function timeAgo(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const ms = (typeof ts.toMillis === "function" ? ts.toMillis() : 0);
  if (!ms) return "";
  const sec = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (sec < 30)        return "Just now";
  if (sec < 60)        return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60)        return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24)         return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

// ── Animated readiness ring ──────────────────────────────────────────────────

function ReadinessRing({ score }: { score: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const glowColor = score >= 75 ? "rgba(16,185,129,0.55)" : score >= 50 ? "rgba(245,158,11,0.55)" : "rgba(239,68,68,0.55)";

  // Smooth count-up animation
  const displayed = useMotionValue(0);
  const rounded = useTransform(displayed, (latest) => Math.round(latest));
  const dashOffset = useTransform(displayed, (latest) =>
    circumference - (latest / 100) * circumference,
  );

  useEffect(() => {
    const controls = animate(displayed, score, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [score, displayed]);

  return (
    <div className="relative w-16 h-16 shrink-0">
      {/* Halo glow pulsing */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: glowColor, filter: "blur(14px)" }}
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.85, 1.05, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 64 64" className="relative w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-gray-900 dark:text-white font-black text-lg leading-none">
          {rounded}
        </motion.span>
        <span className="text-gray-500 dark:text-white/55 text-[8px] font-bold tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

// ── Recommendation card with hover lift + shimmer chip ──────────────────────

function RecoCard({ reco, index }: { reco: AiRecommendation; index: number }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Dark palette — original colours (light text on dark tinted backgrounds)
  const priorityColorsDark = [
    { border: "rgba(47,255,124,0.45)", bg: "rgba(47,255,124,0.10)", badge: "linear-gradient(135deg,#66ff9c,#2fff7c)", iconBg: "rgba(47,255,124,0.18)", glow: "rgba(47,255,124,0.55)", ctaBg: "rgba(47,255,124,0.18)", title: "#4ade80", msg: "rgba(34,197,94,0.95)", cta: "#4ade80" },
    { border: "rgba(245,158,11,0.45)", bg: "rgba(245,158,11,0.10)", badge: "linear-gradient(135deg,#fbbf24,#f59e0b)", iconBg: "rgba(245,158,11,0.18)", glow: "rgba(245,158,11,0.55)", ctaBg: "rgba(245,158,11,0.18)", title: "#fef3c7", msg: "rgba(253,230,138,0.85)", cta: "#fef3c7" },
    { border: "rgba(16,185,129,0.45)", bg: "rgba(16,185,129,0.10)", badge: "linear-gradient(135deg,#34d399,#10b981)", iconBg: "rgba(16,185,129,0.18)", glow: "rgba(16,185,129,0.55)", ctaBg: "rgba(16,185,129,0.18)", title: "#d1fae5", msg: "rgba(167,243,208,0.85)", cta: "#d1fae5" },
  ];
  // Light palette — dark text on the same tinted backgrounds for readability
  const priorityColorsLight = [
    { border: "rgba(22,163,74,0.40)", bg: "rgba(22,163,74,0.08)", badge: "linear-gradient(135deg,#16a34a,#15803d)", iconBg: "rgba(22,163,74,0.15)", glow: "rgba(22,163,74,0.40)", ctaBg: "rgba(22,163,74,0.15)", title: "#14532d", msg: "rgba(20,83,45,0.85)", cta: "#14532d" },
    { border: "rgba(217,119,6,0.40)",  bg: "rgba(217,119,6,0.08)",  badge: "linear-gradient(135deg,#d97706,#b45309)", iconBg: "rgba(217,119,6,0.15)",  glow: "rgba(217,119,6,0.40)",  ctaBg: "rgba(217,119,6,0.15)",  title: "#78350f", msg: "rgba(120,53,15,0.85)",  cta: "#78350f" },
    { border: "rgba(13,148,136,0.40)", bg: "rgba(13,148,136,0.08)", badge: "linear-gradient(135deg,#0d9488,#0f766e)", iconBg: "rgba(13,148,136,0.15)", glow: "rgba(13,148,136,0.40)", ctaBg: "rgba(13,148,136,0.15)", title: "#134e4a", msg: "rgba(19,78,74,0.85)",   cta: "#134e4a" },
  ];

  const priorityColors = isDark ? priorityColorsDark : priorityColorsLight;
  const c = priorityColors[index] ?? priorityColors[2];

  const card = (
    <motion.div
      initial={{ opacity: 0, x: -12, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.15, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="relative rounded-2xl border p-3.5 sm:p-4 cursor-pointer overflow-hidden transition-shadow"
      style={{
        borderColor: c.border,
        background: c.bg,
        boxShadow: `0 0 0 transparent`,
      }}
    >
      {/* Subtle top inner glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${c.glow}, transparent)` }}
      />

      {/* Title row */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <motion.div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0"
          style={{ background: c.iconBg }}
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
          transition={{ duration: 0.5 }}
        >
          {reco.icon}
        </motion.div>
        <p
          className="font-black text-sm sm:text-[15px] leading-snug flex-1 min-w-0"
          style={{ color: c.title }}
        >
          {reco.title}
        </p>

        {/* Priority badge with shimmer sweep */}
        <div className="relative overflow-hidden rounded-md shrink-0">
          <span
            className="relative inline-block text-[9px] font-black text-white px-1.5 py-0.5 rounded-md tracking-wider"
            style={{ background: c.badge }}
          >
            #{reco.priority}
          </span>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 + index * 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Message */}
      <p
        className="text-xs sm:text-[13px] leading-relaxed mb-3"
        style={{ color: c.msg }}
      >
        {reco.message}
      </p>

      {/* Action pill with animated arrow */}
      <div className="flex justify-end">
        <motion.span
          whileHover={{ x: 2 }}
          className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl whitespace-nowrap"
          style={{
            background: c.ctaBg,
            border: `1px solid ${c.border}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12)`,
            color: c.cta,
          }}
        >
          {reco.actionLabel}
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          >
            <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </motion.span>
        </motion.span>
      </div>
    </motion.div>
  );

  if (reco.chapterId) {
    return (
      <Link href={`/chapters/${reco.chapterId}?tab=${reco.type === "retry" ? "mcq" : "notes"}`} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function AiMentorSkeleton() {
  return (
    <div className="liquid-ai rounded-3xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded-lg w-3/5" />
          <div className="h-3 bg-white/10 rounded-lg w-4/5" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/10 rounded-2xl" />)}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AiMentorCard() {
  const { data, isLoading, isPending, error, refresh } = useAiRecommendations();
  const [expanded, setExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading && !data) return <AiMentorSkeleton />;

  if (isPending || (!data && !error)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="liquid-ai rounded-3xl p-6 text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(129,140,248,0.4), transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative inline-block"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
        </motion.div>
        <p className="text-gray-900 dark:text-white font-black relative">AI Mentor is learning about you...</p>
        <p className="text-gray-500 dark:text-white/60 text-sm mt-1 relative">Complete a few notes or MCQs to activate personalized guidance.</p>
      </motion.div>
    );
  }

  if (error && !data) {
    return (
      <div className="liquid-ai rounded-3xl p-5 flex items-center gap-4">
        <Brain className="w-8 h-8 text-indigo-400 shrink-0" />
        <div className="flex-1">
          <p className="text-gray-900 dark:text-white font-black text-sm">AI Mentor</p>
          <p className="text-gray-500 dark:text-white/60 text-xs mt-0.5 break-all">{error ?? "Temporarily unavailable"}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 dark:text-white/60 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative liquid-ai rounded-3xl overflow-hidden"
      style={{ boxShadow: "0 8px 32px -10px rgba(99,102,241,0.45)" }}
    >
      {/* Drifting ambient orbs — gives the card a living feel */}
      <motion.div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.45), transparent 70%)", filter: "blur(50px)" }}
        animate={{ x: [0, 12, -6, 0], y: [0, -8, 6, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-12 w-60 h-60 rounded-full pointer-events-none opacity-70"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", filter: "blur(56px)" }}
        animate={{ x: [0, -8, 5, 0], y: [0, 6, -4, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sparkle decorations */}
      <motion.div
        className="absolute top-6 right-32 pointer-events-none text-amber-300/40"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 90, 180] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="w-3 h-3" />
      </motion.div>
      <motion.div
        className="absolute top-20 left-24 pointer-events-none text-violet-300/40"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5], rotate: [0, 60, 120] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      >
        <Sparkles className="w-2.5 h-2.5" />
      </motion.div>

      {/* Header */}
      <div className="relative p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Glowing pulsing AI icon — brand orange */}
            <div className="relative shrink-0">
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)", filter: "blur(12px)" }}
                animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)" }}
              >
                <motion.div
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {/* Live AI pulse dot */}
                <span className="relative flex h-1.5 w-1.5">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.9, 0.3, 0.9], scale: [1, 2.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <p className="text-gray-500 dark:text-white/55 text-[10px] font-black uppercase tracking-[0.16em] leading-tight">
                  AI Academic Mentor
                </p>
              </div>
              <p className="text-gray-900 dark:text-white font-black text-sm leading-tight mt-1">TRUE CONCEPT AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Freshness label — students can tell at a glance whether the
                cards reflect their latest activity or are stale. */}
            {data?.generatedAt && (
              <span
                className="text-[9px] font-black text-gray-400 dark:text-white/45 uppercase tracking-wider mr-0.5 hidden sm:inline"
                title={`Generated ${new Date((data.generatedAt as Timestamp).toMillis?.() ?? Date.now()).toLocaleString()}`}
              >
                Updated {timeAgo(data.generatedAt as Timestamp)}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 transition-colors"
              title="Refresh AI recommendations"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded
                ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-white/60" />
                : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-white/60" />}
            </button>
          </div>
        </div>

        {/* Greeting + readiness */}
        <div className="flex items-start gap-3 sm:gap-4">
          <ReadinessRing score={data.examReadinessScore} />
          <div className="flex-1 min-w-0 pt-0.5">
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-gray-900 dark:text-white font-black text-sm sm:text-[15px] leading-snug"
            >
              {data.greeting}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-gray-600 dark:text-white/70 text-xs sm:text-[13px] mt-1.5 leading-relaxed"
            >
              {data.examReadinessMessage}
            </motion.p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Recommendations */}
            <div className="px-4 sm:px-5 pb-4 flex flex-col gap-3 sm:gap-3.5">
              {data.topRecommendations.map((reco, i) => (
                <RecoCard key={i} reco={reco} index={i} />
              ))}
            </div>

            {/* Alerts row with subtle pulse */}
            {(data.weakTopicAlert || data.revisionAlert) && (
              <div className="px-4 sm:px-5 pb-3 space-y-2">
                {data.weakTopicAlert && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl relative overflow-hidden"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.30)" }}
                  >
                    <motion.span
                      className="text-base shrink-0 leading-snug"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >⚠️</motion.span>
                    <p className="text-red-700 dark:text-red-200 text-xs sm:text-[13px] font-semibold leading-relaxed">{data.weakTopicAlert}</p>
                  </motion.div>
                )}
                {data.revisionAlert && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl relative overflow-hidden"
                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.30)" }}
                  >
                    <motion.span
                      className="text-base shrink-0 leading-snug"
                      animate={{ rotate: [0, 12, -12, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >🔔</motion.span>
                    <p className="text-amber-700 dark:text-amber-200 text-xs sm:text-[13px] font-semibold leading-relaxed">{data.revisionAlert}</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Motivational footer */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative flex items-start gap-2.5 px-3.5 py-3 rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(168,85,247,0.10))",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {/* Subtle shimmer drift */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                />
                <p className="relative text-gray-700 dark:text-white/80 text-xs sm:text-[13px] font-semibold italic leading-relaxed flex-1">
                  {data.motivationalMessage}
                </p>
                <motion.span
                  className="relative text-base shrink-0"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >✨</motion.span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
