import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import {
  useGetChapter, getGetChapterQueryKey,
  useGetNotes, getGetNotesQueryKey,
  useGetMcqs, getGetMcqsQueryKey,
  useGetQa, getGetQaQueryKey,
  useGetVideos, getGetVideosQueryKey,
  useMarkChapterVisited, useSaveMcqScore,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

type Tab = "notes" | "mcq" | "qa" | "video";

function NotesTab({ chapterId }: { chapterId: number }) {
  const { data: notes, isLoading } = useGetNotes(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetNotesQueryKey({ chapterId }) } }
  );
  if (isLoading) return <div className="animate-pulse space-y-4">{[1,2].map(i => <div key={i} className="h-40 liquid-card rounded-2xl" />)}</div>;
  if (!notes?.length) return (
    <div className="liquid-panel rounded-3xl text-center py-16">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-black text-lg text-gray-900">No notes yet — check back soon!</p>
    </div>
  );
  return (
    <div className="space-y-5">
      {notes.map((note) => (
        <div key={note.id} className="liquid-panel rounded-3xl overflow-hidden" data-testid={`note-${note.id}`}>
          <div className="px-6 py-4 border-b border-white/40" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.05))" }}>
            <h3 className="text-lg font-black text-purple-900">📝 {note.title}</h3>
          </div>
          <div className="p-6 prose-content" dangerouslySetInnerHTML={{
            __html: note.content
              .replace(/^# (.+)$/gm, '<h1>$1</h1>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/`(.+?)`/g, '<code>$1</code>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(.+)$/gm, (line) => line.startsWith('<') ? line : `<p>${line}</p>`)
          }} />
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
      if (user && !scoreSaved) { saveScore.mutate({ data: { chapterId, score, total: mcqs.length } }); setScoreSaved(true); }
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
    const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
    const pct = Math.round((score / mcqs.length) * 100);
    return (
      <div className="liquid-panel rounded-3xl text-center py-10 px-6" data-testid="mcq-results">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : pct >= 40 ? "💪" : "📚"}</div>
        <div className="text-6xl font-black mb-2" style={{
          background: pct >= 70 ? "linear-gradient(135deg, #10b981, #14b8a6)" : "linear-gradient(135deg, #f59e0b, #f97316)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>{pct}%</div>
        <p className="text-xl font-black text-gray-900 mb-1">{score} of {mcqs.length} correct!</p>
        <p className="font-bold text-sm mb-8 text-gray-500">
          {pct >= 80 ? "Excellent! You're a genius! 🎉" : pct >= 60 ? "Good job! Keep it up! 💪" : pct >= 40 ? "Nice try! Review and retry! 📖" : "Keep practicing! You've got this! 🚀"}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
          <div className="liquid-card rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-emerald-600">{score}</div>
            <div className="text-xs font-black text-gray-500">Correct ✅</div>
          </div>
          <div className="liquid-card rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-red-500">{mcqs.length - score}</div>
            <div className="text-xs font-black text-gray-500">Wrong ❌</div>
          </div>
          <div className="liquid-card rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-blue-600">{mcqs.length}</div>
            <div className="text-xs font-black text-gray-500">Total 📊</div>
          </div>
        </div>
        <button onClick={resetQuiz} className="px-8 py-3 rounded-2xl font-black text-white shadow-xl hover:opacity-90 transition-opacity"
          data-testid="button-retry-mcq"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>🔄 Try Again</button>
      </div>
    );
  }

  const current = mcqs[currentIdx];
  const isCorrect = selectedAnswer === current.correctIndex;

  return (
    <div className="space-y-4" data-testid="mcq-quiz">
      {/* Progress */}
      <div className="liquid-card rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm font-black text-gray-500 mb-3">
          <span>Question {currentIdx + 1} of {mcqs.length}</span>
          <span className="liquid-inner text-purple-700 px-3 py-1 rounded-full text-xs font-black"
            >🎯 {Math.round(((currentIdx + 1) / mcqs.length) * 100)}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / mcqs.length) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7)" }} />
        </div>
      </div>

      {/* Question */}
      <div className="liquid-panel rounded-3xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>Q{currentIdx + 1}</div>
          <p className="text-base font-black text-gray-900 leading-relaxed pt-1.5" data-testid="text-question">{current.question}</p>
        </div>

        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let bgStyle: React.CSSProperties = {};
            let borderStyle: React.CSSProperties = { border: "1px solid rgba(255,255,255,0.4)" };
            let textCls = "text-gray-700";
            let label = String.fromCharCode(65 + i);

            if (selectedAnswer !== null) {
              if (i === current.correctIndex) {
                bgStyle = { background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.5)" };
                textCls = "text-emerald-800"; label = "✅";
              } else if (i === selectedAnswer) {
                bgStyle = { background: "rgba(244,63,94,0.12)", border: "1.5px solid rgba(244,63,94,0.4)" };
                textCls = "text-red-700"; label = "❌";
              } else {
                bgStyle = { background: "rgba(0,0,0,0.03)" };
                textCls = "text-gray-400 opacity-60";
              }
            } else {
              bgStyle = { background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)" };
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedAnswer !== null}
                data-testid={`option-${i}`}
                className={`w-full text-left p-4 rounded-2xl transition-all text-sm font-semibold flex items-start gap-3 ${
                  selectedAnswer === null ? "hover:scale-[1.01] cursor-pointer" : "cursor-default"
                } ${textCls}`}
                style={{ ...bgStyle, ...borderStyle }}
              >
                <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5 liquid-inner">{label}</span>
                {opt}
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
        <div key={item.id} className="liquid-card rounded-2xl overflow-hidden" data-testid={`qa-${item.id}`}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-white/30 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5 shadow-md"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>{i + 1}</div>
              <div className="flex-1">
                {item.isImportant && (
                  <span className="inline-block text-xs font-black liquid-inner text-amber-700 px-2 py-0.5 rounded-full mb-1.5">⭐ Important</span>
                )}
                <p className="font-black text-gray-900 text-sm leading-relaxed">{item.question}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center liquid-inner shrink-0">
              {expanded.has(item.id) ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expanded.has(item.id) && (
            <div className="px-5 pb-5 border-t border-white/30 pt-4" style={{ background: "rgba(124,58,237,0.04)" }}>
              <div className="prose-content mb-2" dangerouslySetInnerHTML={{ __html: `<p>${item.answer.replace(/\n/g, '</p><p>')}</p>` }} />
              {item.explanation && (
                <div className="liquid-inner rounded-xl p-3 mt-2">
                  <p className="text-xs font-black text-blue-700 mb-1">💡 Extra Explanation</p>
                  <p className="text-sm text-blue-800 font-medium">{item.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function VideoTab({ chapterId }: { chapterId: number }) {
  const { data: videos, isLoading } = useGetVideos(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetVideosQueryKey({ chapterId }) } }
  );
  if (isLoading) return <div className="h-48 liquid-card rounded-2xl animate-pulse" />;
  if (!videos?.length) return (
    <div className="liquid-panel rounded-3xl text-center py-16">
      <div className="text-5xl mb-3">🎬</div><p className="font-black text-lg text-gray-900">No videos yet</p>
    </div>
  );
  return (
    <div className="space-y-6" data-testid="video-list">
      {videos.map((video) => (
        <div key={video.id} className="liquid-panel rounded-3xl overflow-hidden" data-testid={`video-${video.id}`}>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-5">
            <h3 className="font-black text-gray-900 mb-1">🎬 {video.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: "notes" as Tab, label: "Notes", emoji: "📝", grad: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "mcq" as Tab, label: "Quiz", emoji: "🎯", grad: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { id: "qa" as Tab, label: "Q&A", emoji: "❓", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
  { id: "video" as Tab, label: "Video", emoji: "🎬", grad: "linear-gradient(135deg, #f43f5e, #fb7185)" },
];

export default function ChapterDetailPage() {
  const [, params] = useRoute("/chapters/:chapterId");
  const chapterId = parseInt(params?.chapterId ?? "0", 10);
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const markVisited = useMarkChapterVisited();

  const { data: chapter, isLoading } = useGetChapter(chapterId, {
    query: { enabled: !!chapterId, queryKey: getGetChapterQueryKey(chapterId) },
  });

  useEffect(() => { if (chapterId) markVisited.mutate({ data: { chapterId } }); }, [chapterId]);

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

      {/* Tab Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {TABS.map(({ id, label, emoji, grad }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === id ? "text-white shadow-lg scale-105" : "liquid-card text-gray-600 hover:scale-105"
            }`}
            style={activeTab === id ? { background: grad } : {}}
          >
            <span className="text-lg sm:text-base">{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && <NotesTab chapterId={chapterId} />}
      {activeTab === "mcq" && <McqTab chapterId={chapterId} />}
      {activeTab === "qa" && <QaTab chapterId={chapterId} />}
      {activeTab === "video" && <VideoTab chapterId={chapterId} />}
    </div>
  );
}
