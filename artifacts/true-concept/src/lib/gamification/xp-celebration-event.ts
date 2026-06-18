/**
 * Event bus for XP "big win" celebrations (confetti overlay). Framework-free
 * so it can be fired from xp-service.ts (no React context). Mirrors the
 * lighter-weight xp-toast-event.ts, but this one is reserved for milestones
 * (level-up, new badge, perfect score, challenge/streak) — not routine XP.
 */

export interface Celebration {
  emoji: string;
  title: string;
  subtitle: string;
}

type CelebrationListener = (c: Celebration) => void;
const listeners = new Set<CelebrationListener>();

export function onXPCelebration(fn: CelebrationListener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function emitXPCelebration(c: Celebration): void {
  listeners.forEach((fn) => fn(c));
}
