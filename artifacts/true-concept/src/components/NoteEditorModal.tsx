import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import {
  X, Eye, Edit3, Youtube, Bold, Italic, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3, List, ListOrdered, ListChecks,
  Quote, Minus, Link as LinkIcon, Table as TableIcon,
  Lightbulb, AlertTriangle, Info, Star, BookOpen,
  Sigma, FunctionSquare, Columns2, Underline, Palette,
} from "lucide-react";
import "katex/dist/katex.min.css";
import ImageUploadButton from "./ImageUploadButton";
import { preserveSpaces } from "@/lib/preserve-spaces";
import { markdownComponents } from "@/lib/markdown-components";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";


interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    type: string;
    youtubeId: string;       // legacy: first id in the list (for backwards-compat)
    youtubeIds: string[];    // new: full array
    order: number;
  }) => void;
  isPending?: boolean;
  initial?: {
    title: string;
    content: string;
    type: string;
    youtubeId?: string | null;
    youtubeIds?: string[];
    order: number;
  };
  mode: "create" | "edit";
}

type ViewMode = "write" | "preview" | "split";

const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return "";
};

// ── Greek letters & math symbols ──────────────────────────────────────────────
const GREEK_LETTERS: { sym: string; name: string; tex: string }[] = [
  { sym: "α", name: "alpha", tex: "\\alpha" },
  { sym: "β", name: "beta", tex: "\\beta" },
  { sym: "γ", name: "gamma", tex: "\\gamma" },
  { sym: "δ", name: "delta", tex: "\\delta" },
  { sym: "ε", name: "epsilon", tex: "\\epsilon" },
  { sym: "θ", name: "theta", tex: "\\theta" },
  { sym: "λ", name: "lambda", tex: "\\lambda" },
  { sym: "μ", name: "mu", tex: "\\mu" },
  { sym: "π", name: "pi", tex: "\\pi" },
  { sym: "ρ", name: "rho", tex: "\\rho" },
  { sym: "σ", name: "sigma", tex: "\\sigma" },
  { sym: "τ", name: "tau", tex: "\\tau" },
  { sym: "φ", name: "phi", tex: "\\phi" },
  { sym: "ω", name: "omega", tex: "\\omega" },
  { sym: "Δ", name: "Delta", tex: "\\Delta" },
  { sym: "Σ", name: "Sigma", tex: "\\Sigma" },
  { sym: "Π", name: "Pi", tex: "\\Pi" },
  { sym: "Ω", name: "Omega", tex: "\\Omega" },
];

const OPERATORS: { sym: string; name: string; tex: string }[] = [
  { sym: "≤", name: "less than or equal", tex: "\\leq" },
  { sym: "≥", name: "greater than or equal", tex: "\\geq" },
  { sym: "≠", name: "not equal", tex: "\\neq" },
  { sym: "≈", name: "approximately", tex: "\\approx" },
  { sym: "±", name: "plus minus", tex: "\\pm" },
  { sym: "×", name: "times", tex: "\\times" },
  { sym: "÷", name: "divide", tex: "\\div" },
  { sym: "·", name: "cdot", tex: "\\cdot" },
  { sym: "∞", name: "infinity", tex: "\\infty" },
  { sym: "∝", name: "proportional", tex: "\\propto" },
  { sym: "→", name: "right arrow", tex: "\\rightarrow" },
  { sym: "⇒", name: "implies", tex: "\\Rightarrow" },
  { sym: "°", name: "degree", tex: "^{\\circ}" },
];

const FORMULA_TEMPLATES: { label: string; preview: string; tex: string }[] = [
  { label: "Fraction",      preview: "a/b",           tex: "\\frac{a}{b}" },
  { label: "Square root",   preview: "√x",            tex: "\\sqrt{x}" },
  { label: "Nth root",      preview: "ⁿ√x",           tex: "\\sqrt[n]{x}" },
  { label: "Power",         preview: "xⁿ",            tex: "x^{n}" },
  { label: "Subscript",     preview: "xₙ",            tex: "x_{n}" },
  { label: "Sub & Super",   preview: "xₙ²",           tex: "x_{n}^{2}" },
  { label: "Sum",           preview: "Σ",             tex: "\\sum_{i=1}^{n} x_i" },
  { label: "Integral",      preview: "∫",             tex: "\\int_{a}^{b} f(x)\\, dx" },
  { label: "Limit",         preview: "lim",           tex: "\\lim_{x \\to \\infty}" },
  { label: "Vector",        preview: "v⃗",            tex: "\\vec{v}" },
  { label: "Bar (mean)",    preview: "x̄",             tex: "\\bar{x}" },
  { label: "Hat",           preview: "x̂",             tex: "\\hat{x}" },
  { label: "Matrix 2×2",    preview: "[a b; c d]",    tex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
  { label: "Equation align", preview: "= …\\n= …",    tex: "\\begin{aligned}\nx &= a + b \\\\\n  &= c\n\\end{aligned}" },
];

const CALLOUT_TEMPLATES: { label: string; emoji: string; word: string; icon: any; color: string }[] = [
  { label: "Note",      emoji: "📝", word: "Note",      icon: BookOpen,       color: "#da6b45" },
  { label: "Tip",       emoji: "💡", word: "Tip",       icon: Lightbulb,      color: "#f59e0b" },
  { label: "Important", emoji: "⭐", word: "Important", icon: Star,           color: "#f59e0b" },
  { label: "Warning",   emoji: "⚠️", word: "Warning",   icon: AlertTriangle,  color: "#dc2626" },
  { label: "Definition", emoji: "📖", word: "Definition", icon: Info,         color: "#0ea5e9" },
];

const TABLE_PRESETS: number[][] = [
  [2, 2], [3, 2], [3, 3], [4, 3], [5, 3], [4, 4], [5, 5],
];

// ── Basic text colors ──────────────────────────────────────────────────────
const TEXT_COLORS: { name: string; hex: string }[] = [
  { name: "Red", hex: "#dc2626" },
  { name: "Orange", hex: "#da6b45" },
  { name: "Amber", hex: "#d97706" },
  { name: "Green", hex: "#16a34a" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Pink", hex: "#db2777" },
  { name: "Gray", hex: "#6b7280" },
  { name: "Black", hex: "#111827" },
];

const PLACEHOLDER = `# Chapter Title

Write a short introduction here. Use **bold** and *italic* for emphasis.

## Subsection

> 💡 **Tip:** Use the toolbar buttons to quickly insert formulas, tables and callouts.

### Inline math
Inertia depends on mass: $F = ma$ — Newton's second law.

### Block math
$$
v^2 = u^2 + 2as
$$

### Tables
| Quantity | Symbol | Unit |
|----------|--------|------|
| Velocity | v      | m/s  |
| Mass     | m      | kg   |
| Force    | F      | N    |

### Lists
- First point
- Second point
- Third point

1. Numbered first
2. Numbered second

> ⭐ **Important:** Anything inside a quote block becomes a highlighted callout.
`;

// ── Dropdown helper ────────────────────────────────────────────────────────────

function Dropdown({
  trigger, children, align = "left",
}: {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; placement: "below" | "above"; maxHeight: number } | null>(null);

  const POPOVER_WIDTH = 280;
  const GAP = 6;
  const VIEWPORT_PADDING = 8;

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Decide vertical placement
    const spaceBelow = vh - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const placement: "below" | "above" =
      spaceBelow >= 200 || spaceBelow >= spaceAbove ? "below" : "above";

    const maxHeight = Math.min(
      placement === "below" ? spaceBelow - GAP : spaceAbove - GAP,
      Math.round(vh * 0.6),
    );

    // Horizontal: align under trigger, then clamp into viewport
    let left = align === "right" ? rect.right - POPOVER_WIDTH : rect.left;
    left = Math.max(VIEWPORT_PADDING, Math.min(left, vw - POPOVER_WIDTH - VIEWPORT_PADDING));

    const top = placement === "below" ? rect.bottom + GAP : rect.top - GAP;

    setPos({ top, left, placement, maxHeight });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
  }, [open, computePosition]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, computePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all text-gray-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-300"
      >
        {trigger}
      </button>
      {open && pos && createPortal(
        <div
          ref={popoverRef}
          role="menu"
          className="fixed z-[10000] rounded-2xl shadow-2xl border p-2 overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          style={{
            top: pos.placement === "below" ? pos.top : undefined,
            bottom: pos.placement === "above" ? window.innerHeight - pos.top : undefined,
            left: pos.left,
            width: POPOVER_WIDTH,
            maxHeight: pos.maxHeight,
            boxShadow:
              "0 24px 48px -12px rgba(15, 10, 40, 0.45), 0 8px 16px -8px rgba(15, 10, 40, 0.25), 0 0 0 1px rgba(218, 107, 69, 0.08)",
          }}
        >
          {children(() => setOpen(false))}
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Toolbar button ─────────────────────────────────────────────────────────────

function TBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-300 shrink-0"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-0.5 shrink-0" />;
}

// ── Main editor ────────────────────────────────────────────────────────────────

export default function NoteEditorModal({
  isOpen, onClose, onSave, isPending, initial, mode,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  // Multi-YouTube: each row is { url, id } so we can show a per-row error
  const [youtubeRows, setYoutubeRows] = useState<{ url: string; id: string; error?: string }[]>([{ url: "", id: "" }]);
  const [order, setOrder] = useState(0);
  const [view, setView] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setTitle(initial.title);
        setContent(initial.content);
        setType(initial.type);
        setOrder(initial.order);
        // Prefer the new array; fall back to legacy single ID
        const initialAny = initial as { youtubeIds?: string[]; youtubeId?: string | null };
        const ids: string[] = (initialAny.youtubeIds && initialAny.youtubeIds.length > 0)
          ? initialAny.youtubeIds
          : (initialAny.youtubeId ? [initialAny.youtubeId] : []);
        setYoutubeRows(
          ids.length > 0
            ? ids.map((id) => ({ url: `https://youtu.be/${id}`, id }))
            : [{ url: "", id: "" }]
        );
      } else {
        setTitle(""); setContent(""); setType("text"); setOrder(0);
        setYoutubeRows([{ url: "", id: "" }]);
      }
      // default to split view on wide screens, write on narrow
      setView(window.innerWidth >= 900 ? "split" : "write");
    }
  }, [isOpen, initial]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Update one row in the youtube list (by index). Re-extracts the ID from the URL.
  const updateYoutubeRow = (index: number, url: string) => {
    setYoutubeRows((rows) => rows.map((row, i) => {
      if (i !== index) return row;
      if (!url.trim()) return { url, id: "", error: undefined };
      const id = extractYouTubeId(url.trim());
      if (id) return { url, id, error: undefined };
      return { url, id: "", error: "Invalid YouTube URL" };
    }));
  };

  const addYoutubeRow = () => {
    setYoutubeRows((rows) => [...rows, { url: "", id: "" }]);
  };

  const removeYoutubeRow = (index: number) => {
    setYoutubeRows((rows) => rows.length > 1 ? rows.filter((_, i) => i !== index) : [{ url: "", id: "" }]);
  };

  // ── Content insertion helpers ───────────────────────────────────────────────

  const wrapSelection = useCallback((before: string, after: string, placeholder = "text") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, [content]);

  const insertAtCursor = useCallback((text: string, cursorOffset?: number) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + text);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newContent = content.slice(0, start) + text + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      const pos = start + (cursorOffset ?? text.length);
      el.setSelectionRange(pos, pos);
    }, 0);
  }, [content]);

  const insertLinePrefix = useCallback((prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    // If selection spans multiple lines, prefix each
    if (end > start && content.slice(start, end).includes("\n")) {
      const block = content.slice(lineStart, end);
      const prefixed = block.split("\n").map((l) => prefix + l).join("\n");
      const newContent = content.slice(0, lineStart) + prefixed + content.slice(end);
      setContent(newContent);
      setTimeout(() => { el.focus(); el.setSelectionRange(lineStart, lineStart + prefixed.length); }, 0);
    } else {
      const before = content.slice(0, lineStart);
      const after = content.slice(lineStart);
      // If line already starts with prefix, toggle off
      if (after.startsWith(prefix)) {
        setContent(before + after.slice(prefix.length));
        setTimeout(() => { el.focus(); el.setSelectionRange(start - prefix.length, end - prefix.length); }, 0);
      } else {
        setContent(before + prefix + after);
        setTimeout(() => { el.focus(); el.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
      }
    }
  }, [content]);

  // ── Specific inserters ──────────────────────────────────────────────────────

  const insertHeading = (level: 1 | 2 | 3) => insertLinePrefix("#".repeat(level) + " ");
  const insertBold = () => wrapSelection("**", "**", "bold text");
  const insertItalic = () => wrapSelection("*", "*", "italic text");
  const insertStrike = () => wrapSelection("~~", "~~", "strikethrough");
  const insertUnderline = () => wrapSelection("<u>", "</u>", "underlined text");
  const insertColor = (hex: string) => wrapSelection(`<span style="color:${hex}">`, "</span>", "colored text");
  const insertInlineCode = () => wrapSelection("`", "`", "code");
  const insertCodeBlock = () => insertAtCursor("\n```\ncode here\n```\n", 5);
  const insertQuote = () => insertLinePrefix("> ");
  const insertHr = () => insertAtCursor("\n\n---\n\n");
  const insertBullet = () => insertLinePrefix("- ");
  const insertNumbered = () => insertLinePrefix("1. ");
  const insertChecklist = () => insertLinePrefix("- [ ] ");
  const insertInlineMath = () => wrapSelection("$", "$", "x^2");
  const insertBlockMath = () => insertAtCursor("\n\n$$\n\n$$\n\n", 5);
  const insertLink = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const selected = content.slice(start, end) || "link text";
    insertAtCursor(`[${selected}](https://)`);
  };
  const insertCallout = (emoji: string, word: string) => {
    const block = `\n> ${emoji} **${word}:** Type your message here…\n\n`;
    insertAtCursor(block, block.length - 2);
  };
  const insertTable = (rows: number, cols: number) => {
    const headers = Array(cols).fill(0).map((_, i) => `Header ${i + 1}`).join(" | ");
    const sep = Array(cols).fill("------").join(" | ");
    const bodyRow = Array(cols).fill("Cell").join(" | ");
    const body = Array(rows).fill(0).map(() => bodyRow).join(" |\n| ");
    insertAtCursor(`\n\n| ${headers} |\n| ${sep} |\n| ${body} |\n\n`);
  };
  const insertSymbol = (tex: string) => insertAtCursor(tex);
  const insertFormulaTemplate = (tex: string) => {
    insertAtCursor(`$${tex}$`);
  };
  const insertImageHtml = useCallback((html: string) => insertAtCursor(html), [insertAtCursor]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") { e.preventDefault(); insertBold(); return; }
      if (e.key === "i") { e.preventDefault(); insertItalic(); return; }
      if (e.key === "k") { e.preventDefault(); insertLink(); return; }
      if (e.key === "e") { e.preventDefault(); insertInlineCode(); return; }
      if (e.shiftKey && e.key === "M") { e.preventDefault(); insertInlineMath(); return; }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const youtubeIds = youtubeRows.map((r) => r.id).filter(Boolean);
    onSave({
      title: title.trim(),
      content,
      type,
      youtubeId: youtubeIds[0] ?? "",   // legacy field for backwards compat
      youtubeIds,                        // new array field
      order,
    });
  };

  if (!isOpen) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "min(95vh, 1000px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shadow"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>✏️</div>
            <div>
              <h2 className="font-black text-gray-900 dark:text-gray-100 text-base leading-tight">
                {mode === "create" ? "Create New Note" : "Edit Note"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Markdown · KaTeX · Tables · Callouts · Images · YouTube</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Title + meta */}
        <div className="px-5 pt-3 pb-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 space-y-2.5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title…"
            className="w-full text-xl font-black text-gray-900 dark:text-gray-100 border-0 outline-none bg-transparent placeholder-gray-300 assamese-input"
            data-testid="input-note-title"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="h-8 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-black text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none">
              <option value="text">📝 Text</option>
              <option value="pdf">📄 PDF</option>
              <option value="image">🖼️ Image</option>
            </select>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400">Order:</span>
              <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
                className="w-14 h-8 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none" />
            </div>
          </div>

          {/* YouTube links — supports multiple */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">YouTube Videos (optional)</span>
              <button
                type="button"
                onClick={addYoutubeRow}
                className="text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
              >
                + Add another video
              </button>
            </div>
            {youtubeRows.map((row, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <input
                  value={row.url}
                  onChange={(e) => updateYoutubeRow(i, e.target.value)}
                  placeholder={`YouTube URL #${i + 1}…`}
                  className="flex-1 h-8 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-300 min-w-0"
                />
                {row.id && !row.error && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black whitespace-nowrap">✓ {row.id}</span>
                )}
                {row.error && (
                  <span className="text-xs text-red-500 font-bold whitespace-nowrap">{row.error}</span>
                )}
                {youtubeRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeYoutubeRow(i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Remove this video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-0.5">
            {/* Headings */}
            <TBtn title="Heading 1" onClick={() => insertHeading(1)}><Heading1 className="w-4 h-4" /></TBtn>
            <TBtn title="Heading 2" onClick={() => insertHeading(2)}><Heading2 className="w-4 h-4" /></TBtn>
            <TBtn title="Heading 3" onClick={() => insertHeading(3)}><Heading3 className="w-4 h-4" /></TBtn>
            <Sep />
            {/* Inline */}
            <TBtn title="Bold (Ctrl+B)" onClick={insertBold}><Bold className="w-4 h-4" /></TBtn>
            <TBtn title="Italic (Ctrl+I)" onClick={insertItalic}><Italic className="w-4 h-4" /></TBtn>
            <TBtn title="Strikethrough" onClick={insertStrike}><Strikethrough className="w-4 h-4" /></TBtn>
            <TBtn title="Underline" onClick={insertUnderline}><Underline className="w-4 h-4" /></TBtn>
            <TBtn title="Inline code (Ctrl+E)" onClick={insertInlineCode}><Code className="w-4 h-4" /></TBtn>

            {/* Text color picker */}
            <Dropdown
              trigger={<><Palette className="w-4 h-4" /><span className="text-[10px] ml-0.5">▾</span></>}
            >
              {(close) => (
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Text color</p>
                  <div className="grid grid-cols-5 gap-1.5 px-1 pb-1">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.name}
                        onClick={() => { insertColor(c.hex); close(); }}
                        className="w-9 h-9 rounded-lg border border-black/10 dark:border-white/10 hover:scale-110 transition-transform"
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Dropdown>
            <Sep />
            {/* Lists */}
            <TBtn title="Bulleted list" onClick={insertBullet}><List className="w-4 h-4" /></TBtn>
            <TBtn title="Numbered list" onClick={insertNumbered}><ListOrdered className="w-4 h-4" /></TBtn>
            <TBtn title="Checklist" onClick={insertChecklist}><ListChecks className="w-4 h-4" /></TBtn>
            <Sep />
            {/* Blocks */}
            <TBtn title="Quote" onClick={insertQuote}><Quote className="w-4 h-4" /></TBtn>
            <TBtn title="Code block" onClick={insertCodeBlock}><Code2 className="w-4 h-4" /></TBtn>
            <TBtn title="Horizontal rule" onClick={insertHr}><Minus className="w-4 h-4" /></TBtn>
            <Sep />
            {/* Insert */}
            <TBtn title="Link (Ctrl+K)" onClick={insertLink}><LinkIcon className="w-4 h-4" /></TBtn>
            <ImageUploadButton onInsert={insertImageHtml} />

            {/* Table picker */}
            <Dropdown
              trigger={<><TableIcon className="w-4 h-4" /><span className="text-[10px] ml-0.5">▾</span></>}
            >
              {(close) => (
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Insert table</p>
                  <div className="flex flex-col gap-1">
                    {TABLE_PRESETS.map(([cols, rows]) => (
                      <button
                        key={`${cols}x${rows}`}
                        type="button"
                        onClick={() => { insertTable(rows, cols); close(); }}
                        className="text-left px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 text-sm font-semibold text-gray-700 dark:text-gray-200"
                      >
                        {cols} columns × {rows + 1} rows
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Dropdown>

            {/* Callout picker */}
            <Dropdown
              trigger={<><Lightbulb className="w-4 h-4" /><span className="text-[10px] ml-0.5">▾</span></>}
            >
              {(close) => (
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Insert highlighted callout</p>
                  <div className="flex flex-col gap-0.5">
                    {CALLOUT_TEMPLATES.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => { insertCallout(c.emoji, c.word); close(); }}
                        className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 text-sm font-semibold text-gray-700 dark:text-gray-200"
                      >
                        <span style={{ color: c.color }}>{c.emoji}</span>
                        <span className="font-black" style={{ color: c.color }}>{c.label}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">styled box</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 px-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
                    Renders with purple left border + lavender background
                  </p>
                </div>
              )}
            </Dropdown>

            <Sep />

            {/* Math: inline */}
            <TBtn title="Inline math: $ x $" onClick={insertInlineMath}>
              <span className="font-black text-base px-1">$x$</span>
            </TBtn>
            {/* Math: block */}
            <TBtn title="Block math: $$ … $$" onClick={insertBlockMath}>
              <span className="font-black text-sm px-1">$$</span>
            </TBtn>

            {/* Math symbols */}
            <Dropdown
              trigger={<><Sigma className="w-4 h-4" /><span className="text-[10px] ml-0.5">▾</span></>}
            >
              {(close) => (
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1">Greek letters</p>
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    {GREEK_LETTERS.map((g) => (
                      <button
                        key={g.name}
                        type="button"
                        title={`${g.name} → ${g.tex}`}
                        onClick={() => { insertSymbol(`$${g.tex}$`); close(); }}
                        className="w-9 h-9 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 text-base font-black text-gray-800 dark:text-gray-100 flex items-center justify-center"
                      >
                        {g.sym}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1">Operators</p>
                  <div className="grid grid-cols-6 gap-1">
                    {OPERATORS.map((o) => (
                      <button
                        key={o.name}
                        type="button"
                        title={`${o.name} → ${o.tex}`}
                        onClick={() => { insertSymbol(`$${o.tex}$`); close(); }}
                        className="w-9 h-9 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 text-base font-black text-gray-800 dark:text-gray-100 flex items-center justify-center"
                      >
                        {o.sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Dropdown>

            {/* Formula templates */}
            <Dropdown
              trigger={<><FunctionSquare className="w-4 h-4" /><span className="text-[10px] ml-0.5">▾</span></>}
            >
              {(close) => (
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Formula templates</p>
                  <div className="flex flex-col gap-0.5">
                    {FORMULA_TEMPLATES.map((f) => (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => { insertFormulaTemplate(f.tex); close(); }}
                        className="flex items-center justify-between text-left px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30"
                      >
                        <span className="font-black text-sm text-gray-700 dark:text-gray-200">{f.label}</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-mono">{f.preview}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Dropdown>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 ml-2 shrink-0">
            <button
              type="button" onClick={() => setView("write")}
              title="Write only"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black transition-all ${
                view === "write" ? "bg-orange-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              type="button" onClick={() => setView("split")}
              title="Split view (recommended)"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black transition-all ${
                view === "split" ? "bg-orange-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <Columns2 className="w-3 h-3" />
            </button>
            <button
              type="button" onClick={() => setView("preview")}
              title="Preview only"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black transition-all ${
                view === "preview" ? "bg-orange-600 text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Editor / Preview Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Write pane */}
          {(view === "write" || view === "split") && (
            <div className={`${view === "split" ? "w-1/2 border-r border-gray-100 dark:border-gray-800" : "w-full"} h-full overflow-hidden`}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER}
                className="w-full h-full px-6 py-5 text-sm font-mono text-gray-800 dark:text-gray-100 leading-relaxed resize-none border-0 outline-none bg-white dark:bg-gray-900"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Noto Sans Bengali', 'Courier New', monospace", fontSize: "13.5px", lineHeight: "1.75" }}
                data-testid="input-note-content"
                spellCheck
              />
            </div>
          )}

          {/* Preview pane */}
          {(view === "preview" || view === "split") && (
            <div className={`${view === "split" ? "w-1/2" : "w-full"} h-full overflow-y-auto px-8 py-6 bg-white dark:bg-gray-900 note-reading-prose`}>
              {content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={markdownComponents}
                >
                  {preserveSpaces(content)}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-300 dark:text-gray-600 italic text-center mt-20 text-base">Live preview will appear here as you type…</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0 gap-3">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium hidden sm:block">
            <kbd className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">Ctrl+B</kbd> bold ·{" "}
            <kbd className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">Ctrl+I</kbd> italic ·{" "}
            <kbd className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">Ctrl+K</kbd> link ·{" "}
            <kbd className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">Ctrl+Shift+M</kbd> math
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || isPending}
              className="px-6 py-2 rounded-xl text-white text-sm font-black shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
              data-testid="button-save-note"
            >
              {isPending ? "Saving…" : mode === "create" ? "Create Note ✨" : "Save Changes ✅"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
