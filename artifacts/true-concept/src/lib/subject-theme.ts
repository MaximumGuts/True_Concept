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

export function getSubjectTheme(subjectName: string | undefined, fallbackIndex = 0): SubjectTheme {
  const n = (subjectName ?? "").toLowerCase();
  if (/physic/.test(n)) return PHYSICS;
  if (/chem/.test(n)) return CHEMISTRY;
  if (/bio|life ?science/.test(n)) return BIOLOGY;
  if (/math|গণিত|गणित/.test(n)) return MATH;
  if (/english|ইংৰাজী|अंग्रेज/.test(n)) return ENGLISH;
  if (/assam|অসম/.test(n)) return ASSAMESE;
  if (/hindi|हिंदी|হিন্দী/.test(n)) return HINDI;
  if (/social|histor|geograph|civic|economic|samajik|সামাজিক/.test(n)) return SOCIAL;
  if (/science|বিজ্ঞান|विज्ञान/.test(n)) return SCIENCE;
  return FALLBACKS[fallbackIndex % FALLBACKS.length];
}
