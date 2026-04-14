import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import "katex/dist/katex.min.css";
import {
  useGetChapter, getGetChapterQueryKey,
  useGetNotes, getGetNotesQueryKey,
  useGetMcqs, getGetMcqsQueryKey,
  useGetQa, getGetQaQueryKey,
  useMarkChapterVisited, useSaveMcqScore,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

type Tab = "notes" | "mcq" | "qa";

function YouTubeEmbed({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg" style={{ background: "#000" }}>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Lecture Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function NoteAccordion({ note, defaultOpen }: { note: { id: number; title: string; content: string; youtubeId?: string | null }; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div data-testid={`note-${note.id}`}>
      {/* Clickable header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-7 py-5 text-left hover:bg-gray-50 transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          📝
        </div>
        <h2 className="flex-1 text-lg font-black text-gray-900 leading-tight assamese-text">{note.title}</h2>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${open ? "bg-purple-100" : "bg-gray-100 group-hover:bg-gray-200"}`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180 text-purple-600" : "text-gray-500"}`} />
        </div>
      </button>

      {/* Expandable body */}
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-7 pb-7 pt-1 note-reading-prose" style={{ borderTop: "1px solid #f3f4f6" }}>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
          >
            {note.content}
          </ReactMarkdown>
        </div>
        {note.youtubeId && (
          <div className="px-7 pb-7">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">🎬 Related Video</p>
            <YouTubeEmbed youtubeId={note.youtubeId} />
          </div>
        )}
      </div>
    </div>
  );
}

function NotesTab({ chapterId }: { chapterId: number }) {
  const { data: notes, isLoading } = useGetNotes(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetNotesQueryKey({ chapterId }) } }
  );

  if (isLoading) return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className={`p-7 ${i > 1 ? "border-t border-gray-100" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg" />
            <div className="h-5 bg-gray-100 rounded-lg w-2/5" />
          </div>
          <div className="space-y-2">
            {[1,2,3].map(j => <div key={j} className="h-4 bg-gray-50 rounded w-full" />)}
          </div>
        </div>
      ))}
    </div>
  );

  if (!notes?.length) return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 text-center py-20">
      <div className="text-5xl mb-4">📭</div>
      <p className="font-black text-lg text-gray-700">No notes yet — check back soon!</p>
      <p className="text-gray-400 text-sm mt-1 font-medium">Your teacher will upload notes for this chapter.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {notes.map((note, idx) => (
        <div key={note.id} className={idx > 0 ? "border-t border-gray-100" : ""}>
          <NoteAccordion note={note} defaultOpen={idx === 0} />
        </div>
      ))}
    </div>
  );
}

function McqTab({ chapterId }: { chapterId: number }) {
  const { user } = useAuth();
  const { data: mcqs, isLoading } = useGetMcqs(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetMcqsQueryKey({ chapterId }) } }
  );
  const saveScore = useSaveMcqScore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => { if (mcqs) setAnswers(new Array(mcqs.length).fill(null)); }, [mcqs]);

  const handleSelect = (optIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    setShowExplanation(true);
    const na = [...answers]; na[currentIdx] = optIdx; setAnswers(na);
  };

  const handleNext = () => {
    if (!mcqs) return;
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      const next = answers[currentIdx + 1];
      setSelectedAnswer(next); setShowExplanation(next !== null);
    } else {
      const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
      setQuizComplete(true);
      if (user && user.id !== 0 && !scoreSaved) { saveScore.mutate({ data: { chapterId, score, total: mcqs.length } }); setScoreSaved(true); }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0); setSelectedAnswer(null); setShowExplanation(false);
    setAnswers(mcqs ? new Array(mcqs.length).fill(null) : []); setQuizComplete(false); setScoreSaved(false);
  };

  if (isLoading) return <div className="h-48 liquid-card rounded-2xl animate-pulse" />;
  if (!mcqs?.length) return (
    <div className="liquid-panel rounded-3xl text-center py-16">
      <div className="text-5xl mb-3">📭</div><p className="font-black text-lg text-gray-900">No MCQs yet</p>
    </div>
  );

  if (quizComplete) {
    const score = answers.filter((a, i) => a === mcqs![i].correctIndex).length;
    const pct = Math.round((score / mcqs.length) * 100);
    return (
      <div className="liquid-panel rounded-3xl p-8 text-center" data-testid="quiz-complete">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</div>
        <h3 className="font-black text-2xl text-gray-900 mb-2">Quiz Complete!</h3>
        <p className="text-4xl font-black mb-1" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {score}/{mcqs.length}
        </p>
        <p className="text-gray-600 font-semibold mb-6">{pct}% correct</p>
        <button onClick={resetQuiz} className="px-8 py-3 rounded-2xl text-white font-black shadow-xl hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }} data-testid="button-retry-quiz">
          Try Again 🔄
        </button>
      </div>
    );
  }

  const current = mcqs[currentIdx];
  const optLabels = ["A", "B", "C", "D"];
  const isCorrect = selectedAnswer === current.correctIndex;

  return (
    <div className="liquid-panel rounded-3xl p-6" data-testid="mcq-question">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-gray-500">Question {currentIdx + 1} of {mcqs.length}</span>
        <div className="flex gap-1.5">
          {mcqs.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              i < currentIdx ? "w-5 bg-emerald-400" :
              i === currentIdx ? "w-8 bg-purple-500" : "w-5 bg-gray-200"
            }`} />
          ))}
        </div>
      </div>

      <p className="text-lg font-black text-gray-900 leading-relaxed mb-6" data-testid="text-question">{current.question}</p>

      <div className="space-y-3 mb-4">
        {current.options.map((opt, i) => {
          const chosen = selectedAnswer === i;
          const correct = i === current.correctIndex;
          let style: React.CSSProperties = {};
          let cls = "w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold text-base ";
          if (selectedAnswer === null) {
            cls += "border-transparent liquid-card hover:border-purple-300 hover:scale-[1.01]";
          } else if (correct) {
            cls += "border-emerald-400 text-emerald-900"; style = { background: "rgba(16,185,129,0.1)" };
          } else if (chosen) {
            cls += "border-red-300 text-red-700"; style = { background: "rgba(239,68,68,0.08)" };
          } else {
            cls += "border-transparent liquid-inner text-gray-400";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls} style={style} data-testid={`option-${i}`}>
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm"
                  style={{ background: correct && selectedAnswer !== null ? "linear-gradient(135deg,#10b981,#14b8a6)" : "linear-gradient(135deg,#9ca3af,#6b7280)" }}>
                  {optLabels[i]}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`mt-4 p-4 rounded-2xl text-sm font-semibold liquid-inner ${isCorrect ? "text-emerald-800" : "text-amber-800"}`}
          data-testid="text-explanation">
          <p className="font-black mb-1">{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p>
          <p>{current.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <button className="mt-4 w-full py-3.5 rounded-2xl font-black text-white shadow-xl hover:opacity-90 transition-opacity"
          onClick={handleNext} data-testid="button-next-question"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          {currentIdx < mcqs.length - 1 ? "Next Question →" : "View Results 🏆"}
        </button>
      )}
    </div>
  );
}

function QaTab({ chapterId }: { chapterId: number }) {
  const { data: qa, isLoading } = useGetQa(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetQaQueryKey({ chapterId }) } }
  );
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  if (isLoading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 liquid-card rounded-2xl" />)}</div>;
  if (!qa?.length) return (
    <div className="liquid-panel rounded-3xl text-center py-16">
      <div className="text-5xl mb-3">📭</div><p className="font-black text-lg text-gray-900">No Q&amp;A yet</p>
    </div>
  );

  const toggle = (id: number) => {
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="space-y-3" data-testid="qa-list">
      {qa.map((item, i) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`qa-${item.id}`}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5 shadow-md"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>{i + 1}</div>
              <div className="flex-1">
                {item.isImportant && (
                  <span className="inline-block text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-1.5">⭐ Important</span>
                )}
                <p className="font-black text-gray-900 text-sm leading-relaxed">{item.question}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 shrink-0">
              {expanded.has(item.id) ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>

          {expanded.has(item.id) && (
            <div className="border-t border-gray-100 bg-gray-50">
              {/* Answer */}
              <div className="px-5 pt-5 pb-4 note-reading-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {item.answer}
                </ReactMarkdown>
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div className="mx-5 mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-wide mb-1">💡 Extra Explanation</p>
                  <p className="text-sm text-blue-800 font-medium leading-relaxed">{item.explanation}</p>
                </div>
              )}

              {/* Embedded YouTube video for Q&A */}
              {item.youtubeId && (
                <div className="px-5 pb-5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">🎬 Video Explanation</p>
                  <YouTubeEmbed youtubeId={item.youtubeId} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: "notes" as Tab, label: "Notes", emoji: "📝", grad: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "mcq" as Tab, label: "Quiz", emoji: "🎯", grad: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { id: "qa" as Tab, label: "Q&A", emoji: "❓", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
];

export default function ChapterDetailPage() {
  const [, params] = useRoute("/chapters/:chapterId");
  const chapterId = parseInt(params?.chapterId ?? "0", 10);
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const { user } = useAuth();
  const markVisited = useMarkChapterVisited();

  const { data: chapter, isLoading } = useGetChapter(chapterId, {
    query: { enabled: !!chapterId, queryKey: getGetChapterQueryKey(chapterId) },
  });

  useEffect(() => { if (chapterId && user && user.id !== 0) markVisited.mutate({ data: { chapterId } }); }, [chapterId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4 blob-bg">
        <div className="h-6 liquid-card rounded-xl w-24" />
        <div className="h-28 liquid-dark rounded-3xl" />
        <div className="h-12 liquid-card rounded-2xl" />
        <div className="h-48 liquid-card rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      {/* Back */}
      <Link href={`/subjects/${chapter?.subjectId}`}>
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-subject">
          <ArrowLeft className="w-4 h-4" /> Back to {chapter?.subjectName ?? "Subject"}
        </button>
      </Link>

      {/* Chapter Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white mb-6">
        <div className="absolute top-0 right-0 text-[100px] opacity-10 font-black leading-none pointer-events-none">
          {chapter?.chapterNumber}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1.5 rounded-full">
              Chapter {chapter?.chapterNumber} · {chapter?.classLevel}
            </span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl leading-tight" data-testid="heading-chapter">{chapter?.title}</h1>
          {chapter?.description && (
            <p className="text-purple-300 mt-2 text-sm font-semibold">{chapter.description}</p>
          )}
        </div>
      </div>

      {/* Tab Buttons — 3 tabs now */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {TABS.map(({ id, label, emoji, grad }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === id ? "text-white shadow-lg scale-105" : "liquid-card text-gray-600 hover:scale-105"
            }`}
            style={activeTab === id ? { background: grad } : {}}
          >
            <span className="text-lg sm:text-base">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && <NotesTab chapterId={chapterId} />}
      {activeTab === "mcq" && <McqTab chapterId={chapterId} />}
      {activeTab === "qa" && <QaTab chapterId={chapterId} />}
    </div>
  );
}
