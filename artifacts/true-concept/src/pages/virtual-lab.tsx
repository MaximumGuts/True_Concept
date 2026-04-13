import { useState } from "react";
import { Link } from "wouter";
import { useGetExperiments, getGetExperimentsQueryKey } from "@workspace/api-client-react";
import { FlaskConical, Zap, Lightbulb, Magnet, Eye } from "lucide-react";

const experimentIcons: Record<string, React.ElementType> = {
  "light-reflection": Eye,
  "light-refraction": Eye,
  "electric-circuit": Zap,
  "lens": Lightbulb,
  "magnet": Magnet,
  "custom": FlaskConical,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function VirtualLabPage() {
  const [selectedClass, setSelectedClass] = useState("All");
  const { data: experiments, isLoading } = useGetExperiments(
    selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined,
    { query: { queryKey: getGetExperimentsQueryKey(selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined) } }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="bg-[hsl(222,47%,11%)] text-white rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[hsl(45,93%,47%)]/20 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-[hsl(45,93%,47%)]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" data-testid="heading-virtual-lab">
            Virtual Science Lab
          </h1>
        </div>
        <p className="text-blue-300">
          Explore interactive science experiments without needing physical equipment. Click any experiment to begin.
        </p>
      </div>

      {/* Class Filter */}
      <div className="flex gap-2 mb-6">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedClass === cl
                ? "bg-[hsl(222,47%,25%)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cl}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experiments?.map((exp) => {
            const Icon = experimentIcons[exp.type] ?? FlaskConical;
            return (
              <Link key={exp.id} href={`/virtual-lab/${exp.id}`}>
                <div
                  data-testid={`card-experiment-${exp.id}`}
                  className="group bg-card border border-border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[hsl(222,47%,11%)] rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[hsl(45,93%,47%)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">{exp.classLevel}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[exp.difficulty]}`}>
                          {exp.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{exp.objective}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {!isLoading && !experiments?.length && (
            <div className="col-span-2 text-center py-12">
              <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No experiments available for {selectedClass}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
