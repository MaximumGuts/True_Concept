import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const isAs = lang === "as";

  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className="relative flex items-center gap-0 rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      style={{
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(99,179,237,0.25)",
        boxShadow: isAs
          ? "0 0 14px rgba(167,139,250,0.35), inset 0 0 8px rgba(167,139,250,0.08)"
          : "0 0 14px rgba(59,130,246,0.3), inset 0 0 8px rgba(59,130,246,0.06)",
        padding: "3px",
        transition: "box-shadow 0.35s ease",
        minWidth: 88,
      }}
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          left: isAs ? "calc(50% + 1px)" : 3,
          width: "calc(50% - 4px)",
          height: "calc(100% - 6px)",
          borderRadius: "9999px",
          background: isAs
            ? "linear-gradient(90deg,#7c3aed,#a78bfa)"
            : "linear-gradient(90deg,#1d4ed8,#3b82f6)",
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), background 0.35s ease",
          boxShadow: isAs
            ? "0 2px 8px rgba(167,139,250,0.5)"
            : "0 2px 8px rgba(59,130,246,0.5)",
        }}
      />
      {/* EN label */}
      <span
        className="relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300"
        style={{ color: isAs ? "rgba(148,163,184,0.7)" : "#ffffff", padding: "5px 10px" }}
      >
        EN
      </span>
      {/* AS label */}
      <span
        className="relative z-10 flex-1 text-center font-bold transition-colors duration-300"
        style={{
          color: isAs ? "#ffffff" : "rgba(148,163,184,0.7)",
          padding: "4px 10px",
          fontSize: 13,
          fontFamily: "'Noto Sans Bengali', 'Noto Sans', sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        অ
      </span>
    </button>
  );
}
