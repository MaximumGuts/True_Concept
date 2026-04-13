import { useState } from "react";
import { Link } from "wouter";
import { useSearch, getSearchQueryKey } from "@workspace/api-client-react";
import { Search, BookOpen, HelpCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6" data-testid="heading-search">Search</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search chapters, topics, questions..."
          value={query}
          onChange={handleChange}
          className="pl-10 h-12 text-base"
          data-testid="input-search"
          autoFocus
        />
      </div>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
        </div>
      )}

      {debouncedQuery.length >= 2 && !isLoading && !hasResults && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No results for "{debouncedQuery}"</p>
          <p className="text-muted-foreground text-sm mt-1">Try different keywords</p>
        </div>
      )}

      {data?.chapters && data.chapters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Chapters
          </h2>
          <div className="space-y-2">
            {data.chapters.map((ch) => (
              <Link key={ch.id} href={`/chapters/${ch.id}`}>
                <div
                  data-testid={`search-chapter-${ch.id}`}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{ch.title}</p>
                    <p className="text-sm text-muted-foreground">{ch.subjectName} · {ch.classLevel} · Chapter {ch.chapterNumber}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.questions && data.questions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Questions
          </h2>
          <div className="space-y-2">
            {data.questions.map((q) => (
              <Link key={q.id} href={`/chapters/${q.chapterId}`}>
                <div
                  data-testid={`search-question-${q.id}`}
                  className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{q.answer}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!debouncedQuery && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium text-foreground/50">Search study materials</p>
          <p className="text-sm mt-1">Find chapters, topics, and exam questions</p>
        </div>
      )}
    </div>
  );
}
