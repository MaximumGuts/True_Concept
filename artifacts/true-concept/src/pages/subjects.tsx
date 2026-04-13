import { useState } from "react";
import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";

const subjectGradients = [
  "from-blue-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-purple-400 to-violet-600",
  "from-rose-400 to-pink-600",
  "from-orange-400 to-amber-600",
];

const subjectEmojis = ["🔢", "🔬", "📐", "📖", "🧬", "⚛️"];
const subjectBorders = ["border-blue-100", "border-emerald-100", "border-purple-100", "border-rose-100", "border-orange-100"];
const subjectBgs = ["bg-blue-50", "bg-emerald-50", "bg-purple-50", "bg-rose-50", "bg-orange-50"];

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useGetSubjects();
  const [selectedClass, setSelectedClass] = useState("All");

  const filtered = subjects?.filter((s) =>
    selectedClass === "All" || s.classLevels.includes(selectedClass)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">📚</div>
        <h1 className="font-black text-4xl text-gray-900 mb-2" data-testid="heading-subjects">
          All Subjects
        </h1>
        <p className="text-gray-500 font-semibold">Choose your subject and start studying!</p>
      </div>

      {/* Class Filter */}
      <div className="flex gap-3 mb-8 justify-center overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 ${
              selectedClass === cl
                ? "text-white border-transparent shadow-lg scale-105"
                : "bg-white border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-700"
            }`}
            style={selectedClass === cl ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
          >
            {cl === "All" ? "🌟 All" : cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-gray-100 rounded-3xl p-6 animate-pulse">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4" />
              <div className="h-5 bg-gray-200 rounded-lg mb-2 w-3/4" />
              <div className="h-4 bg-gray-100 rounded mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((subject, idx) => {
            const grad = subjectGradients[idx % subjectGradients.length];
            const emoji = subjectEmojis[idx % subjectEmojis.length];
            const border = subjectBorders[idx % subjectBorders.length];
            const bg = subjectBgs[idx % subjectBgs.length];
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className={`group bg-white border-2 ${border} rounded-3xl overflow-hidden cursor-pointer card-hover shadow-sm`}
                >
                  <div className={`h-2 bg-gradient-to-r ${grad}`} />
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${grad} shadow-lg text-3xl`}>
                      {emoji}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2 font-medium">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {subject.classLevels.map((cl) => (
                          <span key={cl} className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${grad} text-white shadow-sm`}>
                            {cl}
                          </span>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
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
