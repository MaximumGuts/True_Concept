import { createContext, useContext, useState, useCallback } from "react";

export type StudentClass = "Class IX" | "Class X";
export type StudentMedium = "Assamese" | "English";

export interface StudentPrefs {
  class: StudentClass;
  medium: StudentMedium;
}

interface StudentPrefsContextType {
  prefs: StudentPrefs | null;
  setPrefs: (prefs: StudentPrefs) => void;
  clearPrefs: () => void;
}

const STORAGE_KEY = "trueconcept_student_prefs";

function loadPrefs(): StudentPrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.class && parsed.medium) return parsed as StudentPrefs;
    return null;
  } catch {
    return null;
  }
}

const StudentPrefsContext = createContext<StudentPrefsContextType | null>(null);

export function StudentPrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<StudentPrefs | null>(loadPrefs);

  const setPrefs = useCallback((p: StudentPrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setPrefsState(p);
  }, []);

  const clearPrefs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPrefsState(null);
  }, []);

  return (
    <StudentPrefsContext.Provider value={{ prefs, setPrefs, clearPrefs }}>
      {children}
    </StudentPrefsContext.Provider>
  );
}

export function useStudentPrefs() {
  const ctx = useContext(StudentPrefsContext);
  if (!ctx) throw new Error("useStudentPrefs must be used within StudentPrefsProvider");
  return ctx;
}
