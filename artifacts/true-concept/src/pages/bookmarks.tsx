/**
 * Bookmarks page — /bookmarks
 *
 * One hub for everything a student saved for revision, grouped into sections:
 *   • Notes      → tap to open the note in its chapter
 *   • MCQ Sets   → tap to open the set in its chapter
 *   • Saved MCQs → expand to read the question, correct answer & explanation
 *   • Q&A        → expand to read the answer inline
 *
 * Notes & sets deep-link back into chapter-detail (which honors ?note= / ?set=).
 * MCQs & Q&A store their full content, so they render inline here without
 * re-fetching the chapter.
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import "katex/dist/katex.min.css";
import { markdownComponents } from "@/lib/markdown-components";
import {
  ArrowLeft, ChevronDown, ChevronUp, ChevronRight,
  BookOpen, Target, HelpCircle, Bookmark as BookmarkIcon,
} from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import BookmarkButton from "@/components/BookmarkButton";
import type { Bookmark } from "@/lib/bookmarks/bookmark-service";

function SectionHeader({ icon: Icon, label, count, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; count: number; color: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
        style={{ background: color }}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label} <span className="text-gray-400 dark:text-gray-500">({count})</span>
      </h2>
    </div>
  );
}

/** Note / MCQ-set card that deep-links back into the chapter. */
function LinkCard({ b, href, subtitle }: { b: Bookmark; href: string; subtitle: string }) {
  return (
    <div className="relative">
      <Link href={href}>
        <div className="flex items-start gap-3 p-4 pr-12 liquid-card rounded-2xl hover:scale-[1.01] cursor-pointer transition-all group">
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 dark:text-gray-100 text-sm assamese-text line-clamp-2">{b.title}</p>
            {b.preview && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-medium assamese-text">{b.preview}</p>}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-bold assamese-text">{subtitle}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors" />
        </div>
      </Link>
      <div className="absolute top-2.5 right-2.5 z-10">
        <BookmarkButton size={17} data={b} />
      </div>
    </div>
  );
}

/** Expandable card that renders saved MCQ / Q&A content inline for revision. */
function InlineCard({ b }: { b: Bookmark }) {
  const [open, setOpen] = useState(false);
  const optLabels = ["A", "B", "C", "D", "E", "F"];
  return (
    <div className="relative liquid-card rounded-2xl overflow-hidden">
      <div className="absolute top-2.5 right-2.5 z-10">
        <BookmarkButton size={17} data={b} />
      </div>
      <button onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 pr-12 flex items-start justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
        <div className="flex-1 min-w-0">
          <div className="font-black text-gray-900 dark:text-gray-100 text-sm assamese-text line-clamp-2 note-reading-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
              {b.question || b.title}
            </ReactMarkdown>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-bold assamese-text">
            {b.chapterTitle ?? ""}{b.subjectName ? ` · ${b.subjectName}` : ""}
            {b.type === "mcq" && b.setNumber ? ` · Set ${b.setNumber}` : ""}
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 shrink-0">
          {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-black/5 dark:border-white/10 p-4 pt-3">
          {b.type === "mcq" ? (
            <>
              <div className="space-y-2">
                {(b.options ?? []).map((opt, i) => {
                  const correct = i === b.correctIndex;
                  return (
                    <div key={i}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-semibold ${
                        correct
                          ? "text-emerald-900 dark:text-emerald-200"
                          : "text-gray-600 dark:text-gray-300 liquid-inner"
                      }`}
                      style={correct ? { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)" } : {}}>
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-black shrink-0"
                        style={{ background: correct ? "linear-gradient(135deg,#10b981,#14b8a6)" : "linear-gradient(135deg,#9ca3af,#6b7280)" }}>
                        {optLabels[i] ?? i + 1}
                      </span>
                      <span className="assamese-text">{opt}</span>
                      {correct && <span className="ml-auto text-[10px] font-black text-emerald-600 dark:text-emerald-300 uppercase">Correct</span>}
                    </div>
                  );
                })}
              </div>
              {b.explanation && (
                <div className="mt-3 p-3 rounded-xl liquid-inner text-sm font-medium text-gray-700 dark:text-gray-200 note-reading-prose">
                  <p className="font-black text-xs text-orange-500 uppercase tracking-wide mb-1">💡 Explanation</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{b.explanation}</ReactMarkdown>
                </div>
              )}
            </>
          ) : (
            <div className="note-reading-prose text-sm text-gray-700 dark:text-gray-200">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={markdownComponents}
              >
                {b.answer || ""}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  const [, setLocation] = useLocation();
  const { bookmarks, isLoading } = useBookmarks();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";

  const notes = bookmarks.filter((b) => b.type === "note");
  const sets  = bookmarks.filter((b) => b.type === "mcq_set");
  const mcqs  = bookmarks.filter((b) => b.type === "mcq");
  const qnas  = bookmarks.filter((b) => b.type === "qna");

  const L = {
    title:    isAssamese ? "সংৰক্ষিত"            : "Bookmarks",
    subtitle: isAssamese ? "পিছত পঢ়িবলৈ সংৰক্ষণ কৰা বস্তু" : "Saved for later revision",
    notes:    isAssamese ? "টোকা"               : "Notes",
    sets:     isAssamese ? "MCQ ছেট"            : "MCQ Sets",
    mcqs:     isAssamese ? "সংৰক্ষিত MCQ"        : "Saved MCQs",
    qa:       isAssamese ? "প্ৰশ্নোত্তৰ"         : "Q&A",
    empty:    isAssamese ? "এতিয়ালৈকে একো সংৰক্ষণ কৰা নাই" : "No bookmarks yet",
    emptyHint:isAssamese ? "যিকোনো টোকা, MCQ বা প্ৰশ্নোত্তৰৰ 🔖 আইকনত টিপি সংৰক্ষণ কৰক।"
                         : "Tap the 🔖 icon on any note, MCQ or Q&A to save it here.",
    back:     isAssamese ? "হোমলৈ যাওক"         : "Back to Home",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg space-y-6">
      <button
        onClick={() => setLocation("/dashboard")}
        className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)" }}>
        <div className="absolute top-2 right-4 text-[100px] opacity-10 leading-none select-none">🔖</div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 uppercase tracking-wider mb-3">
            <BookmarkIcon className="w-3 h-3" /> {L.title}
          </span>
          <h1 className="font-black text-2xl sm:text-3xl mb-1">{L.title}</h1>
          <p className="text-white/85 text-sm font-medium">{L.subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 liquid-card rounded-2xl" />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="liquid-panel rounded-3xl text-center py-16">
          <div className="text-5xl mb-3">🔖</div>
          <p className="font-black text-lg text-gray-900 dark:text-gray-100">{L.empty}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium px-6">{L.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-7">
          {notes.length > 0 && (
            <section>
              <SectionHeader icon={BookOpen} label={L.notes} count={notes.length} color="linear-gradient(135deg, #3b82f6, #6366f1)" />
              <div className="space-y-2">
                {notes.map((b) => (
                  <LinkCard key={b.id} b={b}
                    href={`/chapters/${b.chapterId}?tab=notes&note=${b.refId}`}
                    subtitle={`${b.chapterTitle ?? ""}${b.subjectName ? ` · ${b.subjectName}` : ""}`} />
                ))}
              </div>
            </section>
          )}

          {sets.length > 0 && (
            <section>
              <SectionHeader icon={Target} label={L.sets} count={sets.length} color="linear-gradient(135deg, #e58359, #f08766)" />
              <div className="space-y-2">
                {sets.map((b) => (
                  <LinkCard key={b.id} b={b}
                    href={`/chapters/${b.chapterId}?tab=mcq&set=${b.setNumber ?? 1}`}
                    subtitle={`${b.chapterTitle ?? ""}${b.subjectName ? ` · ${b.subjectName}` : ""}`} />
                ))}
              </div>
            </section>
          )}

          {mcqs.length > 0 && (
            <section>
              <SectionHeader icon={Target} label={L.mcqs} count={mcqs.length} color="linear-gradient(135deg, #f59e0b, #d97706)" />
              <div className="space-y-2">
                {mcqs.map((b) => <InlineCard key={b.id} b={b} />)}
              </div>
            </section>
          )}

          {qnas.length > 0 && (
            <section>
              <SectionHeader icon={HelpCircle} label={L.qa} count={qnas.length} color="linear-gradient(135deg, #10b981, #14b8a6)" />
              <div className="space-y-2">
                {qnas.map((b) => <InlineCard key={b.id} b={b} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
