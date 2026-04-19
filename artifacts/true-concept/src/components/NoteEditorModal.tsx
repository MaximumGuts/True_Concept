import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { X, Eye, Edit3, Youtube, Bold, Italic, List, Hash, Calculator } from "lucide-react";
import "katex/dist/katex.min.css";
import ImageUploadButton from "./ImageUploadButton";

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    type: string;
    youtubeId: string;
    order: number;
  }) => void;
  isPending?: boolean;
  initial?: {
    title: string;
    content: string;
    type: string;
    youtubeId?: string | null;
    order: number;
  };
  mode: "create" | "edit";
}

const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return "";
};

const TOOLBAR_ACTIONS = [
  { icon: Bold, label: "Bold", syntax: "**text**", insert: "**", after: "**" },
  { icon: Italic, label: "Italic", syntax: "*text*", insert: "*", after: "*" },
  { icon: Hash, label: "Heading", syntax: "## Heading", insert: "\n## ", after: "" },
  { icon: List, label: "List", syntax: "- item", insert: "\n- ", after: "" },
  { icon: Calculator, label: "Inline Math", syntax: "$formula$", insert: "$", after: "$" },
];

const PLACEHOLDER = `## Introduction

Write your notes here. You can use:

**Bold text** and *italic text*

## Mathematical Formulas

Inline math: $E = mc^2$ or block math:

$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$

$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

## Lists

- Point one
- Point two  
- Point three

## Tables

| Column 1 | Column 2 |
|----------|----------|
| Value A  | Value B  |

Paste freely — all formatting is preserved.`;

export default function NoteEditorModal({
  isOpen, onClose, onSave, isPending, initial, mode,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [order, setOrder] = useState(0);
  const [activePane, setActivePane] = useState<"write" | "preview">("write");
  const [urlError, setUrlError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setTitle(initial.title);
        setContent(initial.content);
        setType(initial.type);
        setOrder(initial.order);
        const ytId = initial.youtubeId ?? "";
        setYoutubeId(ytId);
        setYoutubeUrl(ytId ? `https://youtu.be/${ytId}` : "");
      } else {
        setTitle(""); setContent(""); setType("text"); setOrder(0);
        setYoutubeUrl(""); setYoutubeId("");
      }
      setUrlError(""); setActivePane("write");
    }
  }, [isOpen, initial]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleYoutubeChange = (url: string) => {
    setYoutubeUrl(url);
    setUrlError("");
    if (!url.trim()) { setYoutubeId(""); return; }
    const id = extractYouTubeId(url.trim());
    if (id) { setYoutubeId(id); }
    else { setYoutubeId(""); setUrlError("Invalid YouTube URL — use youtube.com/watch?v=... or youtu.be/..."); }
  };

  const insertAtCursor = useCallback((before: string, after: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || "text";
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, [content]);

  const insertBlockMath = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const math = "\n\n$$\n\\frac{a}{b}\n$$\n";
    setContent(c => c.slice(0, pos) + math + c.slice(pos));
    setTimeout(() => { el.focus(); el.setSelectionRange(pos + 5, pos + 14); }, 0);
  }, []);

  const insertImageHtml = useCallback((html: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent(c => c + html);
      return;
    }
    const pos = el.selectionStart;
    setContent(c => c.slice(0, pos) + html + c.slice(pos));
    setTimeout(() => { el.focus(); el.setSelectionRange(pos + html.length, pos + html.length); }, 0);
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content, type, youtubeId, order });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "min(92vh, 900px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shadow"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>✏️</div>
            <div>
              <h2 className="font-black text-gray-900 text-base leading-tight">
                {mode === "create" ? "Create New Note" : "Edit Note"}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Markdown + KaTeX math supported</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Title + Meta row */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 bg-white shrink-0 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-xl font-black text-gray-900 border-0 outline-none bg-transparent placeholder-gray-300 assamese-input"
            data-testid="input-note-title"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select value={type} onChange={e => setType(e.target.value)}
              className="h-8 px-3 rounded-lg border border-gray-200 text-xs font-black text-gray-700 bg-white focus:outline-none">
              <option value="text">📝 Text Note</option>
              <option value="pdf">📄 PDF</option>
              <option value="image">🖼️ Image</option>
            </select>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Youtube className="w-4 h-4 text-red-500 shrink-0" />
              <input
                value={youtubeUrl}
                onChange={e => handleYoutubeChange(e.target.value)}
                placeholder="Optional: YouTube URL for this note..."
                className="flex-1 h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-purple-300 min-w-0"
              />
              {youtubeId && !urlError && (
                <span className="text-xs text-emerald-600 font-black whitespace-nowrap">✅ {youtubeId}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-gray-500">Order:</span>
              <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))}
                className="w-16 h-8 px-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none" />
            </div>
          </div>
          {urlError && <p className="text-xs text-red-500 font-bold">{urlError}</p>}
        </div>

        {/* Toolbar + Pane toggle */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-1">
            {TOOLBAR_ACTIONS.map(({ icon: Icon, label, insert, after }) => (
              <button
                key={label}
                title={label}
                onClick={() => label === "Block Math" ? insertBlockMath() : insertAtCursor(insert, after)}
                className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-purple-700"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button
              title="Block Math"
              onClick={insertBlockMath}
              className="px-2 py-1 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-purple-700 text-xs font-black"
            >
              $$
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <ImageUploadButton onInsert={insertImageHtml} />
          </div>
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            <button
              onClick={() => setActivePane("write")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-black transition-all ${
                activePane === "write" ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Write
            </button>
            <button
              onClick={() => setActivePane("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-black transition-all ${
                activePane === "preview" ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Editor / Preview Area */}
        <div className="flex-1 overflow-hidden">
          {activePane === "write" ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={PLACEHOLDER}
              className="w-full h-full px-6 py-5 text-sm font-mono text-gray-800 leading-relaxed resize-none border-0 outline-none bg-white"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Noto Sans Bengali', 'Courier New', monospace", fontSize: "13.5px", lineHeight: "1.75" }}
              data-testid="input-note-content"
              spellCheck
            />
          ) : (
            <div className="h-full overflow-y-auto px-8 py-6 bg-white note-reading-prose">
              {content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-300 italic text-center mt-20 text-base">Nothing to preview yet — start writing!</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50 shrink-0">
          <p className="text-xs text-gray-400 font-medium">
            Tip: Use <code className="bg-gray-200 px-1 rounded text-xs">$...$</code> for inline math,{" "}
            <code className="bg-gray-200 px-1 rounded text-xs">$$...$$</code> for block math equations
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || isPending}
              className="px-6 py-2 rounded-xl text-white text-sm font-black shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
              data-testid="button-save-note"
            >
              {isPending ? "Saving..." : mode === "create" ? "Create Note ✨" : "Save Changes ✅"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
