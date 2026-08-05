/**
 * Shared types + colour-styling helpers for the Class IX "Surface Areas and
 * Volumes" (math-ix-c11) question-bank batch.
 *
 * Sources: Books/363aWhhC9QJozZLaEhZD.pdf and Books/TpA6OWPT3v9ql0s11FBO.pdf.
 *
 * Every explanation / answer produced through `sol()` carries the mandatory
 * five-colour system, identically in English and Assamese:
 *   #d97706 amber  — question / heading labels
 *   #da6b45 coral  — "Solution" heading
 *   #0d9488 teal   — given data
 *   #16a34a green  — final answer
 *   #2563eb blue   — inline parenthetical remarks
 */

export type Lang = "en" | "as";
export type Difficulty = "easy" | "moderate" | "hard";

export const amber = (s: string) => `<span style="color:#d97706">${s}</span>`;
export const coral = (s: string) => `<span style="color:#da6b45">${s}</span>`;
export const teal = (s: string) => `<span style="color:#0d9488">${s}</span>`;
export const green = (s: string) => `<span style="color:#16a34a">${s}</span>`;
export const blue = (s: string) => `<span style="color:#2563eb">${s}</span>`;

/** Builds a fully colour-styled worked solution. */
export function sol(
  lang: Lang,
  given: string,
  steps: string,
  answer: string,
  note?: string,
): string {
  const head = lang === "en" ? "**Solution**" : "**সমাধান**";
  const givenLabel = lang === "en" ? "Given:" : "দিয়া আছে:";
  const parts = [
    coral(head),
    given ? teal(`${givenLabel} ${given}`) : "",
    steps,
    green(`**${answer}**`),
    note ? blue(note) : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}

export interface Side {
  question: string;
  options: string[];
  explanation: string;
}

export interface McqItem {
  id: string;
  difficulty: Difficulty;
  correctIndex: number;
  figure?: string;
  en: Side;
  as: Side;
}

export interface CaseSub {
  question: string;
  options: string[];
  explanation: string;
}

export interface CaseItem {
  id: string;
  difficulty: Difficulty;
  figure?: string;
  correctIndexes: number[];
  en: { passage: string; subs: CaseSub[] };
  as: { passage: string; subs: CaseSub[] };
}

export type SubjType = "1-mark" | "2-mark" | "3-mark" | "5-mark";

export interface SubjItem {
  id: string;
  questionType: SubjType;
  marks: number;
  difficulty: Difficulty;
  part: number; // which qa document this question belongs to (0-based)
  figure?: string;
  en: { question: string; answer: string };
  as: { question: string; answer: string };
}

/** Standard assertion–reason option set, used by every A-R question. */
export const AR_OPTIONS_EN = [
  "Both Assertion (A) and Reason (R) are correct statements, and Reason (R) is the correct explanation of Assertion (A).",
  "Both Assertion (A) and Reason (R) are correct statements, but Reason (R) is not the correct explanation of Assertion (A).",
  "Assertion (A) is a correct statement, but Reason (R) is a wrong statement.",
  "Assertion (A) is a wrong statement, but Reason (R) is a correct statement.",
];

export const AR_OPTIONS_AS = [
  "উক্তি (A) আৰু যুক্তি (R) দুয়োটাই সত্য, আৰু যুক্তি (R), উক্তি (A) ৰ শুদ্ধ ব্যাখ্যা।",
  "উক্তি (A) আৰু যুক্তি (R) দুয়োটাই সত্য, কিন্তু যুক্তি (R), উক্তি (A) ৰ শুদ্ধ ব্যাখ্যা নহয়।",
  "উক্তি (A) সত্য, কিন্তু যুক্তি (R) অসত্য।",
  "উক্তি (A) অসত্য, কিন্তু যুক্তি (R) সত্য।",
];

export const AR_DIRECTIONS_EN = `${amber("**Directions:**")} In the question below a statement of **Assertion (A)** is followed by a statement of **Reason (R)**. Choose the correct answer out of the four choices given.`;
export const AR_DIRECTIONS_AS = `${amber("**নিৰ্দেশনা:**")} তলৰ প্ৰশ্নটোত এটা **উক্তি (A)** ৰ পিছত এটা **যুক্তি (R)** দিয়া হৈছে। দিয়া চাৰিটা বিকল্পৰ পৰা শুদ্ধ উত্তৰটো বাছি লোৱা।`;

export function arQuestion(lang: Lang, assertion: string, reason: string): string {
  if (lang === "en") {
    return `${AR_DIRECTIONS_EN}\n\n${amber("**Assertion (A):**")} ${assertion}\n\n${amber("**Reason (R):**")} ${reason}`;
  }
  return `${AR_DIRECTIONS_AS}\n\n${amber("**উক্তি (A):**")} ${assertion}\n\n${amber("**যুক্তি (R):**")} ${reason}`;
}

const BUCKET = "true-concept-353c9.firebasestorage.app";
const PREFIX = "surface-areas-volumes-ix-chapter";
export const figUrl = (name: string) =>
  `https://storage.googleapis.com/${BUCKET}/${PREFIX}/${name}`;

/** The app labels options A-D in every view, so the bank must match. */
export const OPT_LETTERS = ["A", "B", "C", "D"];

/** Renders an MCQ's options as the flat text the teacher paper bank expects. */
export function optionsBlock(options: string[]): string {
  return options.map((o, i) => `(${OPT_LETTERS[i]}) ${o}`).join(" &nbsp;&nbsp; ");
}
