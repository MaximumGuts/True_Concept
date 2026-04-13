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
import { ArrowLeft, FileText, CheckSquare, HelpCircle, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "notes" | "mcq" | "qa" | "video";

function NotesTab({ chapterId }: { chapterId: number }) {
  const { data: notes, isLoading } = useGetNotes(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetNotesQueryKey({ chapterId }) } }
  );

  if (isLoading) return <div className="animate-pulse space-y-4">{[1,2].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}</div>;
  if (!notes?.length) return (
    <div className="text-center py-12">
      <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No notes available yet</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {notes.map((note) => (
        <div key={note.id} className="bg-card border border-border rounded-xl p-6" data-testid={`note-${note.id}`}>
          <h3 className="text-lg font-semibold text-foreground mb-4 pb-3 border-b border-border">{note.title}</h3>
          <div className="prose-content" dangerouslySetInnerHTML={{
            __html: note.content
              .replace(/^# (.+)$/gm, '<h1>$1</h1>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/`(.+?)`/g, '<code>$1</code>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<[h1-6p])/gm, '')
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
      setSelectedAnswer(answers[currentIdx + 1]);
      setShowExplanation(answers[currentIdx + 1] !== null);
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

  if (isLoading) return <div className="h-48 bg-muted rounded-xl animate-pulse" />;
  if (!mcqs?.length) return (
    <div className="text-center py-12">
      <CheckSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No MCQs available yet</p>
    </div>
  );

  if (quizComplete) {
    const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
    const pct = Math.round((score / mcqs.length) * 100);
    return (
      <div className="text-center py-10 px-4 bg-card border border-border rounded-xl" data-testid="mcq-results">
        <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
          {pct}%
        </div>
        <p className="text-xl font-semibold text-foreground mb-1">{score} out of {mcqs.length} correct</p>
        <p className="text-muted-foreground mb-6">
          {pct >= 70 ? "Excellent work! Keep it up." : pct >= 40 ? "Good attempt! Review and try again." : "Keep practicing! Review the chapter notes."}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-xs text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-red-600">{mcqs.length - score}</div>
            <div className="text-xs text-red-700">Wrong</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-blue-600">{mcqs.length}</div>
            <div className="text-xs text-blue-700">Total</div>
          </div>
        </div>
        <Button onClick={resetQuiz} data-testid="button-retry-mcq">Try Again</Button>
      </div>
    );
  }

  const current = mcqs[currentIdx];
  const isCorrect = selectedAnswer === current.correctIndex;

  return (
    <div className="space-y-4" data-testid="mcq-quiz">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Question {currentIdx + 1} of {mcqs.length}</span>
        <div className="h-2 flex-1 mx-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentIdx + 1) / mcqs.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-base font-medium text-foreground mb-5" data-testid="text-question">{current.question}</p>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let cls = "border-border hover:border-primary/40 hover:bg-muted/40";
            if (selectedAnswer !== null) {
              if (i === current.correctIndex) cls = "border-green-500 bg-green-50";
              else if (i === selectedAnswer) cls = "border-red-400 bg-red-50";
              else cls = "border-border opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedAnswer !== null}
                data-testid={`option-${i}`}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm ${cls} ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`} data-testid="text-explanation">
            <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
            <p>{current.explanation}</p>
          </div>
        )}

        {selectedAnswer !== null && (
          <Button className="mt-4 w-full" onClick={handleNext} data-testid="button-next-question">
            {currentIdx < mcqs.length - 1 ? "Next Question" : "View Results"}
          </Button>
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

  if (isLoading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}</div>;
  if (!qa?.length) return (
    <div className="text-center py-12">
      <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No Q&amp;A available yet</p>
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
      {qa.map((item) => (
        <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden" data-testid={`qa-${item.id}`}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex-1">
              {item.isImportant && (
                <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-2">
                  Important
                </span>
              )}
              <p className="font-medium text-foreground text-sm sm:text-base">{item.question}</p>
            </div>
            {expanded.has(item.id) ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />}
          </button>
          {expanded.has(item.id) && (
            <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4">
              <div className="prose-content mb-3" dangerouslySetInnerHTML={{ __html: `<p>${item.answer.replace(/\n/g, '</p><p>')}</p>` }} />
              {item.explanation && (
                <div className="bg-blue-50 rounded-lg p-3 mt-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Explanation</p>
                  <p className="text-sm text-blue-800">{item.explanation}</p>
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

  if (isLoading) return <div className="h-48 bg-muted rounded-xl animate-pulse" />;
  if (!videos?.length) return (
    <div className="text-center py-12">
      <Play className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No video available yet</p>
    </div>
  );

  return (
    <div className="space-y-6" data-testid="video-list">
      {videos.map((video) => (
        <div key={video.id} className="bg-card border border-border rounded-xl overflow-hidden" data-testid={`video-${video.id}`}>
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
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "notes", label: "Notes", icon: FileText },
  { id: "mcq", label: "MCQ Quiz", icon: CheckSquare },
  { id: "qa", label: "Q&A", icon: HelpCircle },
  { id: "video", label: "Video", icon: Play },
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
    if (chapterId) {
      markVisited.mutate({ data: { chapterId } });
    }
  }, [chapterId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-24 mb-4" />
        <div className="h-8 bg-muted rounded w-2/3 mb-8" />
        <div className="h-12 bg-muted rounded mb-6" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Back */}
      <Link href={`/subjects/${chapter?.subjectId}`}>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="button-back-subject">
          <ArrowLeft className="w-4 h-4" />
          Back to {chapter?.subjectName ?? "Subject"}
        </button>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Chapter {chapter?.chapterNumber} · {chapter?.classLevel}
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground" data-testid="heading-chapter">
          {chapter?.title}
        </h1>
        {chapter?.description && (
          <p className="text-muted-foreground mt-2 text-sm">{chapter.description}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
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
