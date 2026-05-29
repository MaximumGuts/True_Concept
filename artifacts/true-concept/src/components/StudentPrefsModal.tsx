import { useState } from "react";
import { useStudentPrefs, type StudentClass, type StudentMedium } from "@/contexts/StudentPrefsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentPrefsModal() {
  const { user } = useAuth();
  const { prefs, setPrefs } = useStudentPrefs();
  const [selectedClass, setSelectedClass] = useState<StudentClass>("Class IX");
  const [selectedMedium, setSelectedMedium] = useState<StudentMedium>("English");

  if (!user || user.role !== "student" || prefs) return null;

  const handleSave = () => {
    setPrefs({ class: selectedClass, medium: selectedMedium });
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-7 pb-4 text-center"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
          <div className="text-4xl mb-3">📚</div>
          <h2 className="font-black text-2xl text-white mb-1">Quick Setup</h2>
          <p className="text-orange-200 text-sm font-semibold">Tell us about your class so we show the right content</p>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Class selection */}
          <div>
            <p className="text-sm font-black text-gray-700 dark:text-gray-200 mb-2.5">Which class are you in?</p>
            <div className="grid grid-cols-2 gap-3">
              {(["Class IX", "Class X"] as StudentClass[]).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                    selectedClass === cls
                      ? "border-orange-600 text-white shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300"
                  }`}
                  style={selectedClass === cls ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                >
                  <div className="text-2xl mb-1">{cls === "Class IX" ? "📗" : "📘"}</div>
                  {cls === "Class IX" ? "Class IX" : "Class X"}
                </button>
              ))}
            </div>
          </div>

          {/* Medium selection */}
          <div>
            <p className="text-sm font-black text-gray-700 dark:text-gray-200 mb-2.5">Which medium do you study in?</p>
            <div className="grid grid-cols-2 gap-3">
              {(["Assamese", "English"] as StudentMedium[]).map((med) => (
                <button
                  key={med}
                  onClick={() => setSelectedMedium(med)}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                    selectedMedium === med
                      ? "border-emerald-500 text-white shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300"
                  }`}
                  style={selectedMedium === med ? { background: "linear-gradient(135deg, #10b981, #059669)" } : {}}
                >
                  <div className="text-2xl mb-1">{med === "Assamese" ? "🇮🇳" : "🌐"}</div>
                  {med === "Assamese" ? "অসমীয়া" : "English"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl text-white font-black text-base shadow-xl hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
          >
            Start Learning 🚀
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            You can always change this from your profile
          </p>
        </div>
      </div>
    </div>
  );
}
