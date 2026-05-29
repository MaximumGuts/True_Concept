import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { TRANSLATIONS } from "@/i18n/biologyTranslations";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

export type Lang = "en" | "as";

interface LangCtx {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: "en",
  t: (k) => k,
  toggleLang: () => {},
  isTransitioning: false,
});

// Lab-local storage key — intentionally separate from `trueconcept_student_prefs`
// so the toggle never bleeds into AI Mentor, broadcasts, notifications, etc.
const LAB_LANG_KEY = "trueconcept_lab_lang";

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LAB_LANG_KEY);
    return v === "as" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

function deriveDefault(mediumFromPrefs: string | undefined): Lang {
  // Read-only seed: if user has chosen Assamese as their study medium,
  // start the lab in Assamese. The toggle (if used) wins after that.
  if (mediumFromPrefs === "Assamese") return "as";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Pull medium from prefs context as a *one-time seed* for the default.
  // We deliberately do NOT subscribe and re-derive — the lab's language is
  // its own concern; once the student is in the lab, the toggle is the only
  // thing that should change it.
  const { prefs } = useStudentPrefs();
  const initialLang = useMemo<Lang>(() => {
    return readStoredLang() ?? deriveDefault(prefs?.medium);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [lang, setLang] = useState<Lang>(initialLang);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = useCallback(
    (key: string): string => {
      const entry = TRANSLATIONS[key];
      if (!entry) return key;
      return entry[lang] ?? entry["en"] ?? key;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLang((l) => {
        const next: Lang = l === "en" ? "as" : "en";
        // Persist to lab-local storage only — never to prefs or any other surface
        try { localStorage.setItem(LAB_LANG_KEY, next); } catch { /* ignore quota errors */ }
        return next;
      });
      setIsTransitioning(false);
    }, 220);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isTransitioning }}>
      <div
        style={{
          opacity: isTransitioning ? 0.08 : 1,
          transition: "opacity 0.22s ease",
          minHeight: "100%",
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
