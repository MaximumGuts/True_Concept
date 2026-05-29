import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "trueconcept_theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {}
  return "system";
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

interface ProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// Dark-mode lock released — light-mode polish in progress. The toggle in the
// header now actually flips the theme. Keep this flag for an easy re-lock if
// we ever need to ship a dark-only build again.
const FORCE_DARK = false;

export function ThemeProvider({ children, defaultTheme = "system" }: ProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme() ?? defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    FORCE_DARK ? "dark" : theme === "system" ? getSystemTheme() : theme,
  );

  useEffect(() => {
    if (FORCE_DARK) {
      setResolvedTheme("dark");
      applyTheme("dark");
      return;
    }
    const next: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (FORCE_DARK) return;
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = getSystemTheme();
      setResolvedTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    if (FORCE_DARK) return; // ignored while dark-mode is locked
    setThemeState(next);
  }, []);
  const toggleTheme = useCallback(() => {
    if (FORCE_DARK) return; // ignored while dark-mode is locked
    setThemeState(prev => {
      const current = prev === "system" ? getSystemTheme() : prev;
      return current === "dark" ? "light" : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
