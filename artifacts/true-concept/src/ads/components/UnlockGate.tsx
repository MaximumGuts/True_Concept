/**
 * <UnlockGate feature="notes"> ... </UnlockGate>
 *
 * Wraps protected content. Decision tree (MASTER_PLAN Section 9):
 *
 *   1. In the 24-hour grace period after signup?
 *      └── YES → render children directly (no modal)
 *
 *   2. Feature already unlocked (active 1-hour window)?
 *      └── YES → render children directly
 *
 *   3. Otherwise → render <UnlockModal> as an overlay on top of `fallback`.
 *      • Watch Ad earned → unlock persists → re-render shows children
 *      • Watch Ad skipped → modal stays (error toast)
 *      • Maybe later / X / outside → call onDismiss prop (parent decides)
 *
 * On Capacitor `appStateChange → isActive` and on web `visibilitychange`,
 * the gate re-evaluates so a freshly-expired unlock locks the UI again
 * without requiring a full page navigation.
 */

import { useState, useEffect, useCallback, type ReactNode } from "react";
import UnlockModal from "./UnlockModal";
import WebInterstitial from "../web-interstitial/WebInterstitial";
import { isCooldownActive, startCooldown } from "../web-interstitial/cooldown";
import { isInGracePeriod } from "../grace-period";
import { isFeatureUnlocked } from "../unlock-manager";
import { unlockNotes, unlockLab, unlockMCQ, unlockQnA } from "../unlock-actions";
import type { UnlockFeature } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  feature: UnlockFeature;
  children: ReactNode;
  /** What to render BEHIND the modal while the gate is closed. Defaults to nothing. */
  fallback?: ReactNode;
  /** Called when the student dismisses the modal (Maybe later / X / outside). */
  onDismiss?: () => void;
}

const ACTION_BY_FEATURE: Record<UnlockFeature, () => Promise<boolean>> = {
  notes:     unlockNotes,
  lab:       unlockLab,
  mcq:       unlockMCQ,
  qna:       unlockQnA,
  mock_exam: unlockMCQ, // mock exam uses MCQ unlock action (same rewarded ad)
};

/** True only when running inside the Capacitor APK (Android). Web uses the
 *  separate WebInterstitial pathway (study-tip popup with AdSense slot). */
function isNativeApp(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Cap = (window as any).Capacitor;
  return Cap?.isNativePlatform?.() === true;
}

/** Re-evaluates whether the gate should be open without showing any UI. On
 *  web, the shared 1-hour cooldown unlocks ALL gated features at once. */
function isOpen(feature: UnlockFeature): boolean {
  if (isInGracePeriod()) return true;
  if (!isNativeApp() && isCooldownActive()) return true;
  if (isFeatureUnlocked(feature)) return true;
  return false;
}

export default function UnlockGate({ feature, children, fallback, onDismiss }: Props) {
  // Track open state in React so we can re-render after a successful unlock.
  // Initial value is read from localStorage on first mount.
  const [open, setOpen] = useState<boolean>(() => isOpen(feature));

  // Re-check when:
  //   • Tab becomes visible again (browser)
  //   • Capacitor app foregrounds (native)
  //   • Window focus returns
  //   • A storage event fires (another tab unlocked the same feature)
  useEffect(() => {
    const recheck = () => setOpen(isOpen(feature));
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);
    window.addEventListener("storage", recheck);

    // Capacitor app state — same idea as visibility, but native.
    // NOTE: in our @capacitor/app version, addListener returns the handle
    // SYNCHRONOUSLY, not a Promise — so we cannot chain .then on it
    // unconditionally (crashes the page with "d.addListener(...).then is not
    // a function"). Promise.resolve() normalises both sync and async return
    // shapes so the unsubscribe wiring works either way.
    const Cap = (window as any).Capacitor;
    const AppPlugin = Cap?.Plugins?.App;
    let capUnsub: (() => void) | null = null;
    if (AppPlugin?.addListener) {
      try {
        const result = AppPlugin.addListener(
          "appStateChange",
          ({ isActive }: { isActive: boolean }) => {
            if (isActive) recheck();
          },
        );
        // Whether `result` is a handle or a Promise<handle>, normalise + await.
        Promise.resolve(result)
          .then((handle: any) => {
            capUnsub = () => {
              try { handle?.remove?.(); } catch { /* noop */ }
            };
          })
          .catch(() => { /* noop */ });
      } catch { /* noop — listener wiring is best-effort */ }
    }

    return () => {
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("focus", recheck);
      window.removeEventListener("storage", recheck);
      if (capUnsub) capUnsub();
    };
  }, [feature]);

  const handleWatchAd = useCallback(async (): Promise<boolean> => {
    const earned = await ACTION_BY_FEATURE[feature]();
    if (earned) setOpen(true);
    return earned;
  }, [feature]);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // When the web interstitial finishes (31s countdown ends), start the shared
  // 1-hour cooldown and flip the gate open. All four features unlock at once.
  const handleWebInterstitialComplete = useCallback(() => {
    startCooldown();
    setOpen(true);
  }, []);

  if (open) return <>{children}</>;

  return (
    <>
      {fallback ?? null}
      {isNativeApp() ? (
        <UnlockModal
          feature={feature}
          onWatchAd={handleWatchAd}
          onDismiss={handleDismiss}
        />
      ) : (
        <WebInterstitial onComplete={handleWebInterstitialComplete} />
      )}
    </>
  );
}
