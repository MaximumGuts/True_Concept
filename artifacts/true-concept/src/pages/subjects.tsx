import { useState } from "react";
import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { BookOpen, FlaskConical, TrendingUp, ChevronRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Calculator: TrendingUp,
  FlaskConical,
  TrendingUp,
  BookOpen,
};

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useGetSubjects();
  const [selectedClass, setSelectedClass] = useState("All");

  const filtered = subjects?.filter((s) =>
    selectedClass === "All" || s.classLevels.includes(selectedClass)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2" data-testid="heading-subjects">
          Subjects
        </h1>
        <p className="text-muted-foreground">Browse all available subjects and chapters</p>
      </div>

      {/* Class Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedClass === cl
                ? "bg-[hsl(222,47%,25%)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cl}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-xl mb-4" />
              <div className="h-5 bg-muted rounded mb-2 w-3/4" />
              <div className="h-4 bg-muted rounded mb-1" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((subject) => {
            const Icon = iconMap[subject.icon] ?? BookOpen;
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className="group bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {subject.classLevels.map((cl) => (
                        <span key={cl} className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {cl}
                        </span>
                      ))}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
