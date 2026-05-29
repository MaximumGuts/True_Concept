/**
 * Web-only 31-second "loading interstitial" with a study tip + AdSense slot.
 *
 * Replaces the rewarded-ad gate on web (AdSense has no rewarded format).
 * Shown when a student opens a gated piece of content (note / MCQ / Q&A / lab)
 * and no cooldown is active. On completion, a shared 1-hour cooldown unlocks
 * ALL gated content site-wide until it expires.
 *
 * Layout: two-column on desktop (ad left, tip right); stacked on mobile
 * (tip top, ad bottom). Circular countdown ring at top-right of the modal.
 *
 * Failsafe rules (consistent with the Android UnlockGate's failsafe rule #4):
 *   • If AdSense doesn't load or fill, the countdown still runs and the tip
 *     stays visible. The user is never trapped because of a third-party issue.
 *   • No X / dismiss button until the countdown hits zero (then the modal
 *     auto-closes via onComplete). AdSense policy forbids user-dismissible
 *     display interstitials.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lightbulb } from "lucide-react";
import { pickTip, type StudyTip } from "./tip-picker";
import { ADSENSE_PUBLISHER_ID, ADSENSE_INTERSTITIAL_SLOT_ID } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

const COUNTDOWN_SECONDS = 31;

interface Props {
  /** Called when the countdown reaches 0. Parent starts the cooldown + unlocks. */
  onComplete: () => void;
}

export default function WebInterstitial({ onComplete }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const tip: StudyTip = useMemo(() => pickTip(), []);
  const adInsRef = useRef<HTMLModElement | null>(null);
  const adPushedRef = useRef(false);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Countdown tick. Setting via setInterval is fine for visual countdown.
  // The actual completion is gated on `secondsLeft <= 0` in the effect below.
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft > 0) return;
    // Tiny delay so the user sees "0" briefly instead of an abrupt jump.
    const t = window.setTimeout(onComplete, 200);
    return () => window.clearTimeout(t);
  }, [secondsLeft, onComplete]);

  // Push the ad slot once, after the <ins> mounts. AdSense's script reads the
  // queue on its own schedule; we don't need to wait for it.
  useEffect(() => {
    if (adPushedRef.current) return;
    if (!ADSENSE_PUBLISHER_ID || !ADSENSE_INTERSTITIAL_SLOT_ID) return;
    if (!adInsRef.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      adPushedRef.current = true;
    } catch (err) {
      // Ad-blocked or script not loaded → silent. Tip panel still visible,
      // countdown still ticks — failsafe rule #4.
      console.warn("[web-interstitial] adsbygoogle.push failed:", err);
    }
  }, []);

  // Circular progress ring math
  const ringRadius      = 22;
  const ringCircum      = 2 * Math.PI * ringRadius;
  const progressFrac    = (COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS;
  const ringDashOffset  = ringCircum * (1 - progressFrac);

  return createPortal(
    <div
      className="fixed inset-0 z-[10500] flex items-center justify-center p-4"
      style={{ background: "rgba(8,5,24,0.86)", backdropFilter: "blur(10px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-interstitial-title"
      data-testid="web-interstitial"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(28,18,68,0.98), rgba(20,14,48,0.98))",
          maxHeight: "92vh",
        }}
      >
        {/* Countdown ring (top-right) */}
        <div className="absolute top-4 right-4 z-10 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle
              cx="28" cy="28" r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="4"
            />
            <circle
              cx="28" cy="28" r={ringRadius}
              fill="none"
              stroke="url(#tc-ring-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={ringCircum}
              strokeDashoffset={ringDashOffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            <defs>
              <linearGradient id="tc-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"  stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#da6b45" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="absolute font-black text-white text-sm tabular-nums"
            data-testid="web-interstitial-countdown"
          >
            {secondsLeft}
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-5 p-5 md:p-6">
          {/* ── Ad slot (left on desktop, bottom on mobile via order) ───── */}
          <div
            className="rounded-2xl flex items-center justify-center order-2 md:order-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: 240,
              padding: 8,
            }}
          >
            {ADSENSE_PUBLISHER_ID && ADSENSE_INTERSTITIAL_SLOT_ID ? (
              <ins
                ref={adInsRef}
                className="adsbygoogle"
                style={{ display: "block", width: "100%", minHeight: 240 }}
                data-ad-client={ADSENSE_PUBLISHER_ID}
                data-ad-slot={ADSENSE_INTERSTITIAL_SLOT_ID}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            ) : (
              <span className="text-white/40 text-xs font-semibold text-center px-2">
                Ad space
              </span>
            )}
          </div>

          {/* ── Tip panel (right on desktop, top on mobile) ─────────────── */}
          <div className="flex flex-col gap-3 order-1 md:order-2 pr-12 md:pr-14">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span
                id="web-interstitial-title"
                className="text-[11px] font-black uppercase tracking-wider text-amber-300/90"
              >
                {tip.category}
              </span>
            </div>

            <h2 className="font-black text-white text-xl md:text-2xl leading-tight">
              <span className="mr-1.5">{tip.emoji}</span>
              {tip.title}
            </h2>

            <div className="h-px bg-gradient-to-r from-amber-400/40 via-orange-400/30 to-transparent" />

            <p className="text-white/85 font-medium text-sm md:text-[15px] leading-relaxed">
              {tip.body}
            </p>

            {tip.related && (
              tip.related.href ? (
                <a
                  href={tip.related.href}
                  className="inline-flex items-center gap-2 mt-1 text-xs font-black text-orange-300 hover:text-orange-200 transition-colors"
                >
                  📚 Related: {tip.related.label}
                </a>
              ) : (
                <p className="inline-flex items-center gap-2 mt-1 text-xs font-black text-orange-300/90">
                  📚 Related: {tip.related.label}
                </p>
              )
            )}

            <div className="mt-auto pt-3">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                Loading content… your tip ends in {secondsLeft}s
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
