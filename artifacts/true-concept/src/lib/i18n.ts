import type { Lang } from "@/contexts/LanguageContext";

/**
 * A field that has both English and Assamese values.
 * Used by Biology Lab data files (organ names, functions, exam notes, quiz
 * questions, etc.) to co-locate translation with source-of-truth content.
 *
 * Example:
 *   const stomach: BilingualField<string> = {
 *     en: "Stomach",
 *     as: "পাকস্থলী",
 *   };
 *   const functions: BilingualField<string[]> = {
 *     en: ["Stores food", "Secretes HCl"],
 *     as: ["খাদ্য জমা ৰাখে", "HCl নিঃসৰণ কৰে"],
 *   };
 */
export interface BilingualField<T> {
  en: T;
  as: T;
}

/**
 * Pull the right-language value out of a BilingualField. Falls back to English
 * if the Assamese value is missing — never returns undefined for non-empty `en`.
 *
 * Usage inside a render:
 *   const { lang } = useLanguage();
 *   <h2>{pick(organ.name, lang)}</h2>
 */
export function pick<T>(field: BilingualField<T>, lang: Lang): T {
  const value = field[lang];
  if (value === undefined || value === null) return field.en;
  // Empty-string and empty-array also fall through to English so a stub
  // translation doesn't blank out the UI.
  if (typeof value === "string" && value.length === 0) return field.en;
  if (Array.isArray(value) && value.length === 0) return field.en;
  return value;
}

/**
 * Convenience: wrap a literal English string so it conforms to BilingualField
 * during translation rollout. Avoids `{ en: "...", as: "..." }` boilerplate
 * for strings not yet translated. Build-time grep for `enOnly(` finds the
 * pending-translation backlog.
 */
export function enOnly<T>(value: T): BilingualField<T> {
  return { en: value, as: value };
}
