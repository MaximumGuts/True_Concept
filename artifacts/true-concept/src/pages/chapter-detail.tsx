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

  if (isLoading) return <div className="animate-pulse space-y-4">{[1,2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}</div>;
  if (!notes?.length) return (
    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-black text-lg text-gray-900">No notes available yet</p>
      <p className="text-gray-400 text-sm mt-1 font-medium">Check back soon!</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {notes.map((note) => (
        <div key={note.id} className="bg-white border-2 border-purple-100 rounded-3xl overflow-hidden shadow-sm" data-testid={`note-${note.id}`}>
          <div className="px-6 py-4 border-b border-purple-50" style={{ background: "linear-gradient(135deg, #faf5ff, #ede9fe)" }}>
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
              .replace(/^(.+)$/gm, (line) => {
                if (line.startsWith('<')) return line;
                return `<p>${line}</p>`;
              })
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

  useEffect(() => {
    if (mcqs) setAnswers(new Array(mcqs.length).fill(null));
  }, [mcqs]);

  const handleSelect = (optIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!mcqs) return;
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      const next = answers[currentIdx + 1];
      setSelectedAnswer(next);
      setShowExplanation(next !== null);
    } else {
      const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
      setQuizComplete(true);
      if (user && !scoreSaved) {
        saveScore.mutate({ data: { chapterId, score, total: mcqs.length } });
        setScoreSaved(true);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers(mcqs ? new Array(mcqs.length).fill(null) : []);
    setQuizComplete(false);
    setScoreSaved(false);
  };

  if (isLoading) return <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!mcqs?.length) return (
    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-black text-lg text-gray-900">No MCQs yet</p>
    </div>
  );

  if (quizComplete) {
    const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
    const pct = Math.round((score / mcqs.length) * 100);
    const isGreat = pct >= 70;
    return (
      <div className="text-center py-10 px-6 bg-white border-2 border-gray-100 rounded-3xl shadow-sm" data-testid="mcq-results">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : pct >= 40 ? "💪" : "📚"}</div>
        <div className={`text-6xl font-black mb-2 ${isGreat ? "text-emerald-500" : "text-amber-500"}`}>{pct}%</div>
        <p className="text-xl font-black text-gray-900 mb-1">{score} out of {mcqs.length} correct!</p>
        <p className={`font-semibold text-sm mb-8 ${isGreat ? "text-emerald-600" : "text-amber-600"}`}>
          {pct >= 80 ? "Excellent! You're a genius! 🎉" : pct >= 60 ? "Good job! Keep it up! 💪" : pct >= 40 ? "Nice try! Review and retry! 📖" : "Keep practicing! You've got this! 🚀"}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-3">
            <div className="text-2xl font-black text-emerald-600">{score}</div>
            <div className="text-xs font-bold text-emerald-500">Correct ✅</div>
          </div>
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-3">
            <div className="text-2xl font-black text-red-500">{mcqs.length - score}</div>
            <div className="text-xs font-bold text-red-400">Wrong ❌</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-3">
            <div className="text-2xl font-black text-blue-600">{mcqs.length}</div>
            <div className="text-xs font-bold text-blue-400">Total 📊</div>
          </div>
        </div>
        <button onClick={resetQuiz} className="px-8 py-3 rounded-2xl font-black text-white shadow-lg hover:opacity-90 transition-opacity" data-testid="button-retry-mcq"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  const current = mcqs[currentIdx];
  const isCorrect = selectedAnswer === current.correctIndex;

  return (
    <div className="space-y-4" data-testid="mcq-quiz">
      {/* Progress bar */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm font-bold text-gray-500 mb-3">
          <span>Question {currentIdx + 1} of {mcqs.length}</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black text-xs">
            🎯 {Math.round(((currentIdx + 1) / mcqs.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / mcqs.length) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7)" }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border-2 border-purple-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            Q{currentIdx + 1}
          </div>
          <p className="text-base font-bold text-gray-900 leading-relaxed pt-1" data-testid="text-question">{current.question}</p>
        </div>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let cls = "border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
            let icon = String.fromCharCode(65 + i);
            if (selectedAnswer !== null) {
              if (i === current.correctIndex) { cls = "border-emerald-400 bg-emerald-50 text-emerald-800"; icon = "✅"; }
              else if (i === selectedAnswer) { cls = "border-red-400 bg-red-50 text-red-700"; icon = "❌"; }
              else cls = "border-gray-100 bg-gray-50 text-gray-400 opacity-70";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedAnswer !== null}
                data-testid={`option-${i}`}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-semibold flex items-start gap-3 ${cls} ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: selectedAnswer !== null && i === current.correctIndex ? "#dcfce7" : selectedAnswer !== null && i === selectedAnswer ? "#fee2e2" : "#f3e8ff", color: selectedAnswer !== null && i === current.correctIndex ? "#16a34a" : selectedAnswer !== null && i === selectedAnswer ? "#dc2626" : "#7c3aed" }}>
                  {icon}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-4 p-4 rounded-2xl border-2 text-sm font-semibold ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`} data-testid="text-explanation">
            <p className="font-black mb-1">{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p>
            <p>{current.explanation}</p>
          </div>
        )}

        {selectedAnswer !== null && (
          <button className="mt-4 w-full py-3.5 rounded-2xl font-black text-white shadow-lg hover:opacity-90 transition-opacity" onClick={handleNext} data-testid="button-next-question"
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

  if (isLoading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}</div>;
  if (!qa?.length) return (
    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-black text-lg text-gray-900">No Q&amp;A available yet</p>
    </div>
  );

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3" data-testid="qa-list">
      {qa.map((item, i) => (
        <div key={item.id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 transition-colors" data-testid={`qa-${item.id}`}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-purple-50/50 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                {i + 1}
              </div>
              <div className="flex-1">
                {item.isImportant && (
                  <span className="inline-block text-xs font-black text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full mb-1.5">
                    ⭐ Important
                  </span>
                )}
                <p className="font-bold text-gray-900 text-sm leading-relaxed">{item.question}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 shrink-0">
              {expanded.has(item.id)
                ? <ChevronUp className="w-4 h-4 text-gray-500" />
                : <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </div>
          </button>
          {expanded.has(item.id) && (
            <div className="px-5 pb-5 border-t border-purple-50 pt-4" style={{ background: "linear-gradient(135deg, #faf5ff, #fdf4ff)" }}>
              <div className="prose-content mb-3" dangerouslySetInnerHTML={{ __html: `<p>${item.answer.replace(/\n/g, '</p><p>')}</p>` }} />
              {item.explanation && (
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-3 mt-3">
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

  if (isLoading) return <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!videos?.length) return (
    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <div className="text-5xl mb-3">🎬</div>
      <p className="font-black text-lg text-gray-900">No videos yet</p>
    </div>
  );

  return (
    <div className="space-y-6" data-testid="video-list">
      {videos.map((video) => (
        <div key={video.id} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm" data-testid={`video-${video.id}`}>
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
            <p className="text-sm text-gray-500 font-medium">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: "notes" as Tab, label: "Notes", emoji: "📝", gradient: "from-blue-400 to-indigo-500" },
  { id: "mcq" as Tab, label: "MCQ Quiz", emoji: "🎯", gradient: "from-purple-400 to-violet-500" },
  { id: "qa" as Tab, label: "Q&A", emoji: "❓", gradient: "from-emerald-400 to-teal-500" },
  { id: "video" as Tab, label: "Video", emoji: "🎬", gradient: "from-rose-400 to-pink-500" },
];

export default function ChapterDetailPage() {
  const [, params] = useRoute("/chapters/:chapterId");
  const chapterId = parseInt(params?.chapterId ?? "0", 10);
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const markVisited = useMarkChapterVisited();

  const { data: chapter, isLoading } = useGetChapter(chapterId, {
    query: { enabled: !!chapterId, queryKey: getGetChapterQueryKey(chapterId) },
  });

  useEffect(() => {
    if (chapterId) markVisited.mutate({ data: { chapterId } });
  }, [chapterId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded-xl w-24" />
        <div className="h-28 bg-gray-100 rounded-3xl" />
        <div className="h-12 bg-gray-100 rounded-2xl" />
        <div className="h-48 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8">
      {/* Back */}
      <Link href={`/subjects/${chapter?.subjectId}`}>
        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-subject">
          <ArrowLeft className="w-4 h-4" />
          Back to {chapter?.subjectName ?? "Subject"}
        </button>
      </Link>

      {/* Chapter Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white mb-6"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)" }}>
        <div className="absolute top-0 right-0 text-[100px] opacity-10 font-black leading-none">
          {chapter?.chapterNumber}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full">
              Chapter {chapter?.chapterNumber} · {chapter?.classLevel}
            </div>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl leading-tight" data-testid="heading-chapter">
            {chapter?.title}
          </h1>
          {chapter?.description && (
            <p className="text-purple-200 mt-2 text-sm font-medium">{chapter.description}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {TABS.map(({ id, label, emoji, gradient }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all border-2 ${
              activeTab === id
                ? "text-white border-transparent shadow-md scale-105"
                : "bg-white border-gray-100 text-gray-500 hover:border-purple-200 hover:text-purple-700"
            }`}
            style={activeTab === id ? { background: `linear-gradient(135deg, ${gradient.includes('blue') ? '#3b82f6,#6366f1' : gradient.includes('purple') ? '#7c3aed,#8b5cf6' : gradient.includes('emerald') ? '#10b981,#14b8a6' : '#f43f5e,#ec4899'})` } : {}}
          >
            <span className="text-lg sm:text-base">{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-[10px]">{label.split(" ")[0]}</span>
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
