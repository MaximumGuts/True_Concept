import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  className?: string;
  compact?: boolean;
}

export default function ThemeToggle({ className = "", compact = false }: Props) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      data-testid="theme-toggle"
      className={`relative inline-flex items-center rounded-full transition-all duration-300 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
        compact ? "h-8 w-14" : "h-9 w-16"
      } ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1c100a 0%, #3a1c11 60%, #5a2a17 100%)"
          : "linear-gradient(135deg, #fde68a 0%, #fbbf24 60%, #f59e0b 100%)",
        boxShadow: isDark
          ? "inset 0 2px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(76,29,149,0.3)"
          : "inset 0 2px 4px rgba(146,64,14,0.15), 0 2px 8px rgba(245,158,11,0.25)",
      }}
    >
      {/* Sliding knob */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
          compact ? "w-6 h-6" : "w-7 h-7"
        }`}
        style={{
          left: isDark
            ? compact
              ? "calc(100% - 1.625rem)"
              : "calc(100% - 1.875rem)"
            : "0.125rem",
          background: isDark
            ? "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
          boxShadow: isDark
            ? "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 2px 6px rgba(146,64,14,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {isDark ? (
          <Moon
            className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}
            style={{ color: "#5a2a17", fill: "#5a2a17" }}
          />
        ) : (
          <Sun
            className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}
            style={{ color: "#b45309" }}
          />
        )}
      </span>

      {/* Decorative tiny stars (visible only in dark) */}
      <span
        aria-hidden
        className={`absolute transition-opacity duration-300 ${isDark ? "opacity-90" : "opacity-0"}`}
        style={{ left: "0.55rem", top: "0.4rem", color: "#fef3c7", fontSize: 8 }}
      >
        ✦
      </span>
      <span
        aria-hidden
        className={`absolute transition-opacity duration-300 ${isDark ? "opacity-70" : "opacity-0"}`}
        style={{ left: "1.2rem", top: "1.1rem", color: "#fde68a", fontSize: 6 }}
      >
        ✦
      </span>

      {/* Decorative tiny ray (visible only in light, on right) */}
      <span
        aria-hidden
        className={`absolute transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-80"}`}
        style={{ right: "0.55rem", top: "0.55rem", color: "#fff7ed", fontSize: 8 }}
      >
        ✦
      </span>
    </button>
  );
}
