import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useSearch, getSearchQueryKey } from "@workspace/api-client-react";
import { ChevronRight, BookOpen, ClipboardList, HelpCircle, FlaskConical, ScrollText, BookText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

const hints = ["reflection", "ohm's law", "photosynthesis", "trigonometry", "myopia", "respiration"];

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ResultBase {
  id:            string;
  title:         string;
  body?:         string;
  chapterId?:    string;
  subjectName?:  string;
  chapterNumber?: number;
  classLevel?:   string | null;
  medium?:       string | null;
  href:          string;
}

/* Render the matched query word inside the body as a highlighted span. Keeps
 * the search feeling "smart" without any heavy library. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!text || !query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-orange-200/40 text-orange-900 dark:bg-orange-500/20 dark:text-orange-100 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function CategoryHeader({ icon: Icon, label, count, color }: {
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

function ResultCard({ result, query, subtitle, testIdPrefix }: {
  result: ResultBase;
  query: string;
  subtitle?: string;
  testIdPrefix: string;
}) {
  return (
    <Link href={result.href}>
      <div
        data-testid={`${testIdPrefix}-${result.id}`}
        className="flex items-start gap-3 p-4 liquid-card rounded-2xl hover:scale-[1.01] cursor-pointer transition-all group card-hover"
      >
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 dark:text-gray-100 text-sm group-hover:text-orange-700 dark:hover:text-orange-300 transition-colors line-clamp-2">
            <Highlight text={result.title} query={query} />
          </p>
          {result.body && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-medium">
              <Highlight text={result.body.slice(0, 140)} query={query} />
              {result.body.length > 140 ? "…" : ""}
            </p>
          )}
          {subtitle && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-bold">{subtitle}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors" />
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const isStudent = user?.role === "student";

  // Debounce — wait 400ms after the user stops typing, and only search when
  // they've typed at least 3 chars. Cuts wasted Cloud Function invocations
  // while feeling instant to the user.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setDebouncedQuery("");
      return;
    }
    const id = window.setTimeout(() => setDebouncedQuery(trimmed), 400);
    return () => window.clearTimeout(id);
  }, [query]);

  const { data, isLoading } = useSearch(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length >= 3, queryKey: getSearchQueryKey({ q: debouncedQuery }) } },
  );

  // Filter by class + medium when student is logged in (admins see everything).
  const matchesPrefs = (item: { classLevel?: string | null; medium?: string | null; board?: string | null }) => {
    if (!isStudent || !prefs) return true;
    const classOk  = !item.classLevel || item.classLevel === prefs.class;
    const mediumOk = !item.medium     || item.medium     === "Both" || item.medium === prefs.medium;
    const boardOk  = !item.board      || item.board       === "Both" || !prefs.board || item.board === prefs.board;
    return classOk && mediumOk && boardOk;
  };

  const d: any = data ?? {};
  const chapters: ResultBase[] = (d.chapters ?? []).filter(matchesPrefs);
  const notes:    ResultBase[] = (d.notes    ?? []).filter(matchesPrefs);
  const mcqs:     ResultBase[] = (d.mcqs     ?? []).filter(matchesPrefs);
  const qa:       ResultBase[] = (d.qa       ?? []).filter(matchesPrefs);
  const labs:     ResultBase[] = (d.labs     ?? []).filter(matchesPrefs);
  const papers:   ResultBase[] = (d.papers   ?? []).filter(matchesPrefs);

  const totalResults = chapters.length + notes.length + mcqs.length + qa.length + labs.length + papers.length;
  const hasResults = totalResults > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔍</div>
        <h1 className="font-black text-4xl text-gray-900 dark:text-gray-100 mb-2" data-testid="heading-search">Search</h1>
        <p className="text-gray-600 dark:text-gray-300 font-bold">Notes · MCQs · Q&amp;A · Labs · Papers · Chapters</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">🔍</span>
        <input
          type="search"
          placeholder="Ask anything… e.g. 'why does current increase when resistance decreases?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-5 rounded-2xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-bold transition-colors text-base text-gray-900 dark:text-gray-100 shadow-sm"
          style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          data-testid="input-search"
          autoFocus
        />
      </div>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-20 liquid-card rounded-2xl" />)}
        </div>
      )}

      {debouncedQuery.length >= 3 && !isLoading && !hasResults && (
        <div className="liquid-panel rounded-3xl text-center py-16">
          <div className="text-5xl mb-3">🤷</div>
          <p className="font-black text-lg text-gray-900 dark:text-gray-100">No results for "{debouncedQuery}"</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium mb-5">Try different keywords or check spelling</p>
          <div className="flex flex-wrap justify-center gap-2">
            {hints.slice(0, 4).map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="px-3 py-2 liquid-card rounded-xl text-xs font-black text-orange-700 dark:text-orange-300 hover:scale-105 transition-transform"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {notes.length > 0 && (
          <section>
            <CategoryHeader icon={BookOpen}      label="Notes"          count={notes.length}    color="linear-gradient(135deg, #3b82f6, #6366f1)" />
            <div className="space-y-2">
              {notes.map((n) => (
                <ResultCard key={n.id} result={n} query={debouncedQuery} testIdPrefix="search-note" subtitle={n.subjectName ? `${n.subjectName} · Note` : undefined} />
              ))}
            </div>
          </section>
        )}

        {mcqs.length > 0 && (
          <section>
            <CategoryHeader icon={ClipboardList} label="MCQs"           count={mcqs.length}     color="linear-gradient(135deg, #e58359, #f08766)" />
            <div className="space-y-2">
              {mcqs.map((m) => (
                <ResultCard key={m.id} result={m} query={debouncedQuery} testIdPrefix="search-mcq" subtitle={m.subjectName ? `${m.subjectName} · MCQ` : undefined} />
              ))}
            </div>
          </section>
        )}

        {qa.length > 0 && (
          <section>
            <CategoryHeader icon={HelpCircle}    label="Q&A"            count={qa.length}       color="linear-gradient(135deg, #10b981, #14b8a6)" />
            <div className="space-y-2">
              {qa.map((q) => (
                <ResultCard key={q.id} result={q} query={debouncedQuery} testIdPrefix="search-qa"  subtitle={q.subjectName ? `${q.subjectName} · Q&A` : undefined} />
              ))}
            </div>
          </section>
        )}

        {labs.length > 0 && (
          <section>
            <CategoryHeader icon={FlaskConical}  label="Virtual Lab"    count={labs.length}     color="linear-gradient(135deg, #14b8a6, #0d9488)" />
            <div className="space-y-2">
              {labs.map((l) => (
                <ResultCard key={l.id} result={l} query={debouncedQuery} testIdPrefix="search-lab" subtitle="Hands-on experiment" />
              ))}
            </div>
          </section>
        )}

        {papers.length > 0 && (
          <section>
            <CategoryHeader icon={ScrollText}    label="Question Papers" count={papers.length} color="linear-gradient(135deg, #8b5cf6, #6366f1)" />
            <div className="space-y-2">
              {papers.map((p) => (
                <ResultCard key={p.id} result={p} query={debouncedQuery} testIdPrefix="search-paper" subtitle={p.subjectName ? `${p.subjectName} · Paper` : undefined} />
              ))}
            </div>
          </section>
        )}

        {chapters.length > 0 && (
          <section>
            <CategoryHeader icon={BookText}      label="Chapters"       count={chapters.length} color="linear-gradient(135deg, #fbbf24, #f59e0b)" />
            <div className="space-y-2">
              {chapters.map((ch) => (
                <ResultCard key={ch.id} result={ch} query={debouncedQuery} testIdPrefix="search-chapter"
                  subtitle={`${ch.subjectName ?? ""} · ${ch.classLevel ?? ""}${ch.chapterNumber ? ` · Ch. ${ch.chapterNumber}` : ""}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {!debouncedQuery && (
        <div className="text-center py-12">
          <p className="text-xl font-black text-gray-400 dark:text-gray-500 mb-2">Start typing to search</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-semibold mb-6">Type at least 3 characters — you can ask a full question</p>
          <div className="flex flex-wrap justify-center gap-2">
            {hints.map(hint => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="px-3 py-2 liquid-card rounded-xl text-xs font-black text-orange-700 dark:text-orange-300 hover:scale-105 transition-transform"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
