import { useState } from "react";
import { Link } from "wouter";
import { useSearch, getSearchQueryKey } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";

const hints = ["polynomial", "reflection", "irrational", "electricity", "motion"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data, isLoading } = useSearch(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length >= 2, queryKey: getSearchQueryKey({ q: debouncedQuery }) } }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setTimeout(() => setDebouncedQuery(val), 300);
  };

  const hasResults = data && (data.chapters.length > 0 || data.questions.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔍</div>
        <h1 className="font-black text-4xl text-gray-900 mb-2" data-testid="heading-search">Search</h1>
        <p className="text-gray-600 font-bold">Find any chapter, topic, or exam question</p>
      </div>

      {/* Search Input — liquid glass */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">🔍</span>
        <input
          type="search"
          placeholder="Type to search… e.g. 'algebra', 'reflection'"
          value={query}
          onChange={handleChange}
          className="w-full h-14 pl-12 pr-5 rounded-2xl border border-white/50 focus:border-purple-400 focus:outline-none font-bold transition-colors text-base text-gray-900 shadow-sm"
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

      {debouncedQuery.length >= 2 && !isLoading && !hasResults && (
        <div className="liquid-panel rounded-3xl text-center py-16">
          <div className="text-5xl mb-3">🤷</div>
          <p className="font-black text-lg text-gray-900">No results for "{debouncedQuery}"</p>
          <p className="text-gray-500 text-sm mt-1 font-medium">Try different keywords</p>
        </div>
      )}

      {data?.chapters && data.chapters.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📚</span>
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide">Chapters ({data.chapters.length})</h2>
          </div>
          <div className="space-y-2">
            {data.chapters.map((ch) => (
              <Link key={ch.id} href={`/chapters/${ch.id}`}>
                <div
                  data-testid={`search-chapter-${ch.id}`}
                  className="flex items-center justify-between p-4 liquid-card rounded-2xl hover:scale-[1.01] cursor-pointer transition-all group card-hover"
                >
                  <div>
                    <p className="font-black text-gray-900 group-hover:text-purple-700 transition-colors">{ch.title}</p>
                    <p className="text-sm text-gray-500 font-bold">{ch.subjectName} · {ch.classLevel} · Ch. {ch.chapterNumber}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.questions && data.questions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide">Questions ({data.questions.length})</h2>
          </div>
          <div className="space-y-2">
            {data.questions.map((q) => (
              <Link key={q.id} href={`/chapters/${q.chapterId}`}>
                <div
                  data-testid={`search-question-${q.id}`}
                  className="p-4 liquid-card rounded-2xl hover:scale-[1.01] cursor-pointer transition-all group card-hover"
                >
                  <p className="font-black text-gray-900 text-sm group-hover:text-purple-700 transition-colors line-clamp-2">{q.question}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">{q.answer}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!debouncedQuery && (
        <div className="text-center py-12">
          <p className="text-xl font-black text-gray-400 mb-2">Start typing to search</p>
          <p className="text-sm text-gray-400 font-semibold mb-6">Type at least 2 characters</p>
          <div className="flex flex-wrap justify-center gap-2">
            {hints.map(hint => (
              <button
                key={hint}
                onClick={() => { setQuery(hint); setTimeout(() => setDebouncedQuery(hint), 100); }}
                className="px-3 py-2 liquid-card rounded-xl text-xs font-black text-purple-700 hover:scale-105 transition-transform"
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
