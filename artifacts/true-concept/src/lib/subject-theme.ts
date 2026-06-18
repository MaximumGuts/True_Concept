// Shared subject theme — maps subject names to a coordinated visual identity.
// Tries name-based matching first (so "Physics" always gets ⚛️), then falls back
// to deterministic index-based assignment so the same subject always looks the same.

export interface SubjectTheme {
  emoji: string;
  grad: string;
  glow: string;
  badge: string;
  accent: string;
}

const PHYSICS: SubjectTheme = {
  emoji: "⚛️",
  grad: "linear-gradient(135deg, #3b82f6, #6366f1)",
  glow: "rgba(99, 102, 241, 0.32)",
  badge: "linear-gradient(135deg, #3b82f6, #6366f1)",
  accent: "#6366f1",
};

const CHEMISTRY: SubjectTheme = {
  emoji: "🧪",
  grad: "linear-gradient(135deg, #14b8a6, #0d9488)",
  glow: "rgba(20, 184, 166, 0.32)",
  badge: "linear-gradient(135deg, #14b8a6, #0d9488)",
  accent: "#0d9488",
};

const BIOLOGY: SubjectTheme = {
  emoji: "🧬",
  grad: "linear-gradient(135deg, #10b981, #059669)",
  glow: "rgba(16, 185, 129, 0.32)",
  badge: "linear-gradient(135deg, #10b981, #059669)",
  accent: "#059669",
};

const MATH: SubjectTheme = {
  emoji: "🔢",
  grad: "linear-gradient(135deg, #da6b45, #b85535)",
  glow: "rgba(218, 107, 69, 0.32)",
  badge: "linear-gradient(135deg, #da6b45, #b85535)",
  accent: "#b85535",
};

const ENGLISH: SubjectTheme = {
  emoji: "📖",
  grad: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  glow: "rgba(251, 191, 36, 0.32)",
  badge: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  accent: "#f59e0b",
};

const ASSAMESE: SubjectTheme = {
  emoji: "📜",
  grad: "linear-gradient(135deg, #ef4444, #dc2626)",
  glow: "rgba(239, 68, 68, 0.32)",
  badge: "linear-gradient(135deg, #ef4444, #dc2626)",
  accent: "#dc2626",
};

const HINDI: SubjectTheme = {
  emoji: "🌸",
  grad: "linear-gradient(135deg, #ec4899, #db2777)",
  glow: "rgba(236, 72, 153, 0.32)",
  badge: "linear-gradient(135deg, #ec4899, #db2777)",
  accent: "#db2777",
};

const SOCIAL: SubjectTheme = {
  emoji: "🌍",
  grad: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  glow: "rgba(14, 165, 233, 0.32)",
  badge: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  accent: "#0284c7",
};

const SCIENCE: SubjectTheme = {
  emoji: "🔬",
  grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  glow: "rgba(139, 92, 246, 0.32)",
  badge: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  accent: "#7c3aed",
};

const FALLBACKS: SubjectTheme[] = [
  MATH, PHYSICS, CHEMISTRY, BIOLOGY, ENGLISH, SOCIAL, HINDI, ASSAMESE, SCIENCE,
];

// ── Custom-color support ──────────────────────────────────────────────
// Admins can pick a per-subject color (stored as a hex string). When present
// it drives the whole theme (gradient, glow, badge, accent); only the emoji
// stays name-based so "Math" keeps 🔢 etc.

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

// factor < 1 darkens toward black, > 1 lightens toward white.
function shade([r, g, b]: [number, number, number], factor: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function customTheme(color: string, emoji: string): SubjectTheme | null {
  const rgb = parseHex(color);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  const darker = shade(rgb, 0.78);
  const grad = `linear-gradient(135deg, ${color}, ${darker})`;
  return {
    emoji,
    grad,
    glow: `rgba(${r}, ${g}, ${b}, 0.32)`,
    badge: grad,
    accent: color,
  };
}

function baseTheme(subjectName: string | undefined, fallbackIndex: number): SubjectTheme {
  const n = (subjectName ?? "").toLowerCase();
  if (/physic/.test(n)) return PHYSICS;
  if (/chem/.test(n)) return CHEMISTRY;
  if (/bio|life ?science/.test(n)) return BIOLOGY;
  if (/math|গণিত|गणित/.test(n)) return MATH;
  if (/english|ইংৰাজী|अंग्रेज/.test(n)) return ENGLISH;
  if (/assam|অসম/.test(n)) return ASSAMESE;
  if (/hindi|हिंदी|হিন্দী/.test(n)) return HINDI;
  if (/social|histor|geograph|civic|economic|samajik|সামাজিক/.test(n)) return SOCIAL;
  if (/science|বিজ্ঞান|विज्ञান/.test(n)) return SCIENCE;
  return FALLBACKS[fallbackIndex % FALLBACKS.length];
}

export function getSubjectTheme(
  subjectName: string | undefined,
  fallbackIndex = 0,
  customColor?: string | null,
): SubjectTheme {
  const base = baseTheme(subjectName, fallbackIndex);
  if (customColor) {
    const custom = customTheme(customColor, base.emoji);
    if (custom) return custom;
  }
  return base;
}
