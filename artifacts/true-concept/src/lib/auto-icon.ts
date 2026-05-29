/**
 * Deterministic icon + gradient for content (chapters, MCQ sets, Q&A sets).
 * Same input always returns the same icon — feels like the icon was
 * "assigned" to that piece of content from the moment it was created,
 * even though we generate it on the fly.
 */

const ICON_POOL = [
  "📘", "📗", "📕", "📙", "📚", "🔬", "⚗️", "🧪", "🧬", "🪐",
  "🌍", "🌌", "🌠", "🧲", "⚡", "🔭", "💡", "🧠", "✏️", "🖋️",
  "📐", "📏", "🧮", "🔢", "📊", "📈", "🌱", "🌿", "🌸", "🌳",
  "🐚", "🦴", "🍀", "🔥", "💎", "⚛️", "🔋", "🌀", "🪶", "🎯",
];

const GRAD_POOL: string[] = [
  "linear-gradient(135deg, #da6b45, #b85535)",   // coral
  "linear-gradient(135deg, #6366f1, #4338ca)",   // indigo
  "linear-gradient(135deg, #14b8a6, #0d9488)",   // teal
  "linear-gradient(135deg, #fbbf24, #f59e0b)",   // honey
  "linear-gradient(135deg, #ec4899, #be185d)",   // pink
  "linear-gradient(135deg, #8b5cf6, #6d28d9)",   // violet
  "linear-gradient(135deg, #22c55e, #15803d)",   // emerald
  "linear-gradient(135deg, #0ea5e9, #0369a1)",   // sky
  "linear-gradient(135deg, #f97316, #c2410c)",   // orange
  "linear-gradient(135deg, #84cc16, #4d7c0f)",   // lime
  "linear-gradient(135deg, #ef4444, #b91c1c)",   // red
  "linear-gradient(135deg, #06b6d4, #0e7490)",   // cyan
];

const GLOW_POOL: string[] = [
  "rgba(218, 107, 69, 0.30)",
  "rgba(99, 102, 241, 0.30)",
  "rgba(20, 184, 166, 0.30)",
  "rgba(251, 191, 36, 0.30)",
  "rgba(236, 72, 153, 0.30)",
  "rgba(139, 92, 246, 0.30)",
  "rgba(34, 197, 94, 0.30)",
  "rgba(14, 165, 233, 0.30)",
  "rgba(249, 115, 22, 0.30)",
  "rgba(132, 204, 22, 0.30)",
  "rgba(239, 68, 68, 0.30)",
  "rgba(6, 182, 212, 0.30)",
];

/** djb2 string hash → uint32 */
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export interface AutoIcon {
  emoji: string;
  grad: string;
  glow: string;
}

export function getAutoIcon(seed: string | null | undefined, salt = ""): AutoIcon {
  const key = (seed ?? "") + "|" + salt;
  const h = hash(key);
  return {
    emoji: ICON_POOL[h % ICON_POOL.length],
    grad: GRAD_POOL[(h >>> 7) % GRAD_POOL.length],
    glow: GLOW_POOL[(h >>> 7) % GLOW_POOL.length],
  };
}
