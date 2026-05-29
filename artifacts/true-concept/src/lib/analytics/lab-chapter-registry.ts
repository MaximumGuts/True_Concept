/**
 * Lab → NCERT Chapter Registry (Phase 7B)
 *
 * Maps each virtual-lab experimentId to its NCERT (2023-24 syllabus)
 * class + chapter + subject + topic. The Phase 7C rule engine reads this to:
 *   - Suggest the right lab when a student finishes the relevant note
 *   - Resolve experimentMastery → chapter for cross-correlation with chapterMastery
 *   - Hide labs from students whose current class/track doesn't include them
 *
 * NCERT chapter numbers below follow the chapter ordering printed in the
 * SCERT-Assam Class IX & X Science textbooks in current use. Note: SCERT-Assam
 * still uses the **pre-rationalization NCERT numbering** for Class X (where
 * Periodic Classification was Ch 5 and Life Processes was Ch 6). The
 * chemistry chapter numbers (Ch 1-4) are identical in both numbering schemes.
 * If/when SCERT-Assam adopts the 2023-24 rationalization, Life Processes
 * will shift from Ch 6 to Ch 5 — update the four body-system lab entries below.
 *
 * Reference: NCERT Class X "Science (Code 086)" + Class IX "Science"
 * — https://ncert.nic.in/textbook.php → kesc1=Class X · iesc1=Class IX
 *
 * `ncertChapterKey` is a stable string ("class10-ch05") used by the engine
 * to identify a chapter without depending on Firestore's auto-generated
 * chapter doc IDs.
 *
 * Bilingual titles use NCERT-Assam preferred terminology (SCERT-Assam glossary).
 * Chemistry/Physics sims are not bilingually-translated yet (Phase 2 covered
 * Biology only) — their `as` titles equal their `en` titles as a graceful
 * fallback. When those subjects are translated, only this file needs updating.
 */

import type { BilingualField } from "@/lib/i18n";

export type NcertClass = "IX" | "X";
export type LabSubjectId = "biology" | "chemistry" | "physics";

export interface LabRegistryEntry {
  experimentId: string;
  experimentTitle: BilingualField<string>;

  subjectId: LabSubjectId;
  subjectName: BilingualField<string>;

  // NCERT mapping
  ncertClass: NcertClass;
  ncertChapterNumber: number;
  ncertChapterKey: string;             // stable: "class10-ch05" — engine joins on this
  ncertChapterTitle: BilingualField<string>;

  // Sub-topic within the chapter (Life Processes has nutrition/respiration/etc.)
  // Used by the engine to recommend the lab when a student finishes a note
  // tagged with the same topic.
  ncertTopic?: BilingualField<string>;

  // Whether the sim has been bilingually translated (Phase 2 outcome).
  // Mentor uses this to decide if it's safe to recommend to Assamese students.
  bilingualReady: boolean;

  // For Mentor card UI (Phase 7D)
  emoji?: string;
}

// ─── Bilingual subject names ──────────────────────────────────────────────────

const SUBJECT_NAME_BIOLOGY:   BilingualField<string> = { en: "Biology",   as: "জীৱবিজ্ঞান" };
const SUBJECT_NAME_CHEMISTRY: BilingualField<string> = { en: "Chemistry", as: "ৰসায়নবিজ্ঞান" };
const SUBJECT_NAME_PHYSICS:   BilingualField<string> = { en: "Physics",   as: "পদাৰ্থ বিজ্ঞান" };

// ─── Bilingual chapter titles (NCERT-Assam) ───────────────────────────────────

const CH_IX_05_FUND_UNIT:  BilingualField<string> = { en: "The Fundamental Unit of Life", as: "জীৱনৰ মৌলিক একক" };
const CH_X_01_CHEM_RXN:    BilingualField<string> = { en: "Chemical Reactions and Equations", as: "ৰাসায়নিক বিক্ৰিয়া আৰু সমীকৰণ" };
const CH_X_02_ACIDS_BASES: BilingualField<string> = { en: "Acids, Bases and Salts", as: "অম্ল, ক্ষাৰক আৰু লৱণ" };
const CH_X_03_METALS:      BilingualField<string> = { en: "Metals and Non-metals", as: "ধাতু আৰু অধাতু" };
const CH_X_04_CARBON:      BilingualField<string> = { en: "Carbon and its Compounds", as: "কাৰ্বন আৰু ইয়াৰ যৌগসমূহ" };
const CH_X_06_LIFE_PROC:   BilingualField<string> = { en: "Life Processes", as: "জৈৱিক প্ৰক্ৰিয়াসমূহ" };

// ─── Sub-topic helpers (Life Processes has 4 main topics) ─────────────────────

const TOPIC_NUTRITION:      BilingualField<string> = { en: "Nutrition", as: "পুষ্টি" };
const TOPIC_RESPIRATION:    BilingualField<string> = { en: "Respiration", as: "শ্বসন" };
const TOPIC_TRANSPORTATION: BilingualField<string> = { en: "Transportation", as: "পৰিবহন" };
const TOPIC_EXCRETION:      BilingualField<string> = { en: "Excretion", as: "ৰেচন" };

// Chemistry Class X topic clusters — strings mirror NCERT section headings exactly
// so the rule engine can match labs to notes whose titles use the same terminology.

// Ch 1 (Chemical Reactions and Equations) — 5 distinct topic sections
const TOPIC_COMBINATION:    BilingualField<string> = { en: "Combination Reactions", as: "সংযোগ বিক্ৰিয়া" };
const TOPIC_DECOMPOSITION:  BilingualField<string> = { en: "Decomposition Reactions", as: "বিযোজন বিক্ৰিয়া" };
const TOPIC_DISPLACEMENT:   BilingualField<string> = { en: "Displacement Reactions", as: "প্ৰতিস্থাপন বিক্ৰিয়া" };
const TOPIC_DOUBLE_DISP:    BilingualField<string> = { en: "Double Displacement & Precipitation Reactions", as: "দ্বৈত প্ৰতিস্থাপন আৰু অৱক্ষেপণ বিক্ৰিয়া" };
const TOPIC_REDOX:          BilingualField<string> = { en: "Oxidation & Reduction (Redox) Reactions", as: "জাৰণ আৰু বিজাৰণ বিক্ৰিয়া" };

// Ch 2 (Acids, Bases and Salts) — 4 distinct topic sections
const TOPIC_IONIC_NEUTRAL:    BilingualField<string> = { en: "Ionic Dissociation & Neutralization", as: "আয়নিক বিয়োজন আৰু প্ৰশমন" };
const TOPIC_ACID_METAL_OXIDE: BilingualField<string> = { en: "Acid-Base Interactions with Metals & Oxides", as: "ধাতু আৰু অক্সাইডৰ সৈতে অম্ল-ক্ষাৰৰ বিক্ৰিয়া" };
const TOPIC_CARBONATES:       BilingualField<string> = { en: "Reactions with Carbonates & Hydrogen Carbonates", as: "কাৰ্বনেট আৰু হাইড্ৰ\'জেন কাৰ্বনেটৰ বিক্ৰিয়া" };
const TOPIC_INDUSTRIAL_SALTS: BilingualField<string> = { en: "Industrial Chemicals from Common Salt", as: "সাধাৰণ লৱণৰ পৰা শিল্পিক ৰসায়ন" };

// Ch 3 (Metals and Non-metals) — 2 lab-relevant topic sections
const TOPIC_METALS_AIR_H2O: BilingualField<string> = { en: "Metals — Reactions with Oxygen & Water", as: "ধাতু — অক্সিজেন আৰু পানীৰ সৈতে বিক্ৰিয়া" };
const TOPIC_METALS_ACIDS:   BilingualField<string> = { en: "Metals — Reactions with Mineral Acids", as: "ধাতু — খনিজ অম্লৰ সৈতে বিক্ৰিয়া" };

// Ch 4 (Carbon and its Compounds) — 1 lab covers multiple sections
const TOPIC_CARBON_COMPOUNDS: BilingualField<string> = { en: "Combustion, Esterification, Saponification & Addition Reactions", as: "দহন, এষ্টাৰীকৰণ, ছেপ\'নিফিকেচন আৰু সংযোজন বিক্ৰিয়া" };

// ─── Registry ─────────────────────────────────────────────────────────────────

export const LAB_REGISTRY: Record<string, LabRegistryEntry> = {

  // ═══ BIOLOGY (6 labs) ════════════════════════════════════════════════════════
  // Cells live in Class IX Ch 5. Body systems (digestive/respiratory/heart/excretory)
  // are all in Class X Ch 5 "Life Processes" — they're the 4 main topics of that chapter.

  "biology-animal-cell": {
    experimentId:      "biology-animal-cell",
    experimentTitle:   { en: "Animal Cell", as: "প্ৰাণী কোষ" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "IX",
    ncertChapterNumber: 5,
    ncertChapterKey:   "class09-ch05",
    ncertChapterTitle: CH_IX_05_FUND_UNIT,
    bilingualReady:    true,
    emoji:             "🔬",
  },

  "biology-plant-cell": {
    experimentId:      "biology-plant-cell",
    experimentTitle:   { en: "Plant Cell", as: "উদ্ভিদ কোষ" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "IX",
    ncertChapterNumber: 5,
    ncertChapterKey:   "class09-ch05",
    ncertChapterTitle: CH_IX_05_FUND_UNIT,
    bilingualReady:    true,
    emoji:             "🌿",
  },

  "biology-digestive-system": {
    experimentId:      "biology-digestive-system",
    experimentTitle:   { en: "Human Digestive System", as: "মানুহৰ পাচন তন্ত্ৰ" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "X",
    ncertChapterNumber: 6,
    ncertChapterKey:   "class10-ch06",
    ncertChapterTitle: CH_X_06_LIFE_PROC,
    ncertTopic:        TOPIC_NUTRITION,
    bilingualReady:    true,
    emoji:             "🫀",
  },

  "biology-respiratory-system": {
    experimentId:      "biology-respiratory-system",
    experimentTitle:   { en: "Human Respiratory System", as: "মানুহৰ শ্বসন তন্ত্ৰ" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "X",
    ncertChapterNumber: 6,
    ncertChapterKey:   "class10-ch06",
    ncertChapterTitle: CH_X_06_LIFE_PROC,
    ncertTopic:        TOPIC_RESPIRATION,
    bilingualReady:    true,
    emoji:             "🫁",
  },

  "biology-heart-circulation": {
    experimentId:      "biology-heart-circulation",
    experimentTitle:   { en: "Human Heart & Blood Circulation", as: "মানুহৰ হৃদপিণ্ড আৰু ৰক্তসংবহন" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "X",
    ncertChapterNumber: 6,
    ncertChapterKey:   "class10-ch06",
    ncertChapterTitle: CH_X_06_LIFE_PROC,
    ncertTopic:        TOPIC_TRANSPORTATION,
    bilingualReady:    true,
    emoji:             "❤️",
  },

  "biology-excretory-system": {
    experimentId:      "biology-excretory-system",
    experimentTitle:   { en: "Human Excretory System & Nephron", as: "মানুহৰ ৰেচন তন্ত্ৰ আৰু নেফ্ৰন" },
    subjectId:         "biology",
    subjectName:       SUBJECT_NAME_BIOLOGY,
    ncertClass:        "X",
    ncertChapterNumber: 6,
    ncertChapterKey:   "class10-ch06",
    ncertChapterTitle: CH_X_06_LIFE_PROC,
    ncertTopic:        TOPIC_EXCRETION,
    bilingualReady:    true,
    emoji:             "🫘",
  },

  // ═══ CHEMISTRY · Class X Ch 1 — Chemical Reactions and Equations (5 labs) ════
  // NCERT lists 5 reaction types: combination, decomposition, displacement,
  // double displacement, oxidation-reduction (redox).

  "chem-combination-reactions": {
    experimentId:      "chem-combination-reactions",
    experimentTitle:   { en: "Combination Reactions", as: "সংযোগ বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 1,
    ncertChapterKey:   "class10-ch01",
    ncertChapterTitle: CH_X_01_CHEM_RXN,
    ncertTopic:        TOPIC_COMBINATION,
    bilingualReady:    true,
    emoji:             "⚗️",
  },

  "chem-decomposition-reactions": {
    experimentId:      "chem-decomposition-reactions",
    experimentTitle:   { en: "Decomposition Reactions", as: "বিযোজন বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 1,
    ncertChapterKey:   "class10-ch01",
    ncertChapterTitle: CH_X_01_CHEM_RXN,
    ncertTopic:        TOPIC_DECOMPOSITION,
    bilingualReady:    true,
    emoji:             "🔥",
  },

  "chem-displacement-reactions": {
    experimentId:      "chem-displacement-reactions",
    experimentTitle:   { en: "Displacement Reactions", as: "প্ৰতিস্থাপন বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 1,
    ncertChapterKey:   "class10-ch01",
    ncertChapterTitle: CH_X_01_CHEM_RXN,
    ncertTopic:        TOPIC_DISPLACEMENT,
    bilingualReady:    true,
    emoji:             "🔵",
  },

  "chem-double-displacement": {
    experimentId:      "chem-double-displacement",
    experimentTitle:   { en: "Double Displacement & Precipitation Reactions", as: "দ্বৈত প্ৰতিস্থাপন আৰু অৱক্ষেপণ বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 1,
    ncertChapterKey:   "class10-ch01",
    ncertChapterTitle: CH_X_01_CHEM_RXN,
    ncertTopic:        TOPIC_DOUBLE_DISP,
    bilingualReady:    true,
    emoji:             "🟡",
  },

  "chem-redox-reactions": {
    experimentId:      "chem-redox-reactions",
    experimentTitle:   { en: "Redox Reactions (Oxidation & Reduction)", as: "ৰেডক্স বিক্ৰিয়া (জাৰণ আৰু অপচয়ন)" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 1,
    ncertChapterKey:   "class10-ch01",
    ncertChapterTitle: CH_X_01_CHEM_RXN,
    ncertTopic:        TOPIC_REDOX,
    bilingualReady:    true,
    emoji:             "🔁",
  },

  // ═══ CHEMISTRY · Class X Ch 2 — Acids, Bases and Salts (4 labs) ══════════════

  "chem-ionic-neutralization": {
    experimentId:      "chem-ionic-neutralization",
    experimentTitle:   { en: "Ionic Dissociation & Neutralization", as: "আয়নিক বিযোজন আৰু নিৰপেক্ষণ" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 2,
    ncertChapterKey:   "class10-ch02",
    ncertChapterTitle: CH_X_02_ACIDS_BASES,
    ncertTopic:        TOPIC_IONIC_NEUTRAL,
    bilingualReady:    true,
    emoji:             "⚖️",
  },

  "chem-acid-metal-oxide": {
    experimentId:      "chem-acid-metal-oxide",
    experimentTitle:   { en: "Acid Reactions with Metals & Metal Oxides", as: "ধাতু আৰু ধাতু অক্সাইডৰ সৈতে অম্ল বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 2,
    ncertChapterKey:   "class10-ch02",
    ncertChapterTitle: CH_X_02_ACIDS_BASES,
    ncertTopic:        TOPIC_ACID_METAL_OXIDE,
    bilingualReady:    true,
    emoji:             "🧪",
  },

  "chem-carbonate-reactions": {
    experimentId:      "chem-carbonate-reactions",
    experimentTitle:   { en: "Reactions with Metal Carbonates & Hydrogen Carbonates", as: "ধাতু কাৰ্বনেট আৰু হাইড্ৰ'জেনকাৰ্বনেটৰ সৈতে বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 2,
    ncertChapterKey:   "class10-ch02",
    ncertChapterTitle: CH_X_02_ACIDS_BASES,
    ncertTopic:        TOPIC_CARBONATES,
    bilingualReady:    true,
    emoji:             "🫧",
  },

  "chem-industrial-chemicals": {
    experimentId:      "chem-industrial-chemicals",
    experimentTitle:   { en: "Industrial Chemicals from Common Salt", as: "সাধাৰণ লৱণৰ পৰা শিল্প ৰাসায়নিক" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 2,
    ncertChapterKey:   "class10-ch02",
    ncertChapterTitle: CH_X_02_ACIDS_BASES,
    ncertTopic:        TOPIC_INDUSTRIAL_SALTS,
    bilingualReady:    true,
    emoji:             "🧂",
  },

  // ═══ CHEMISTRY · Class X Ch 3 — Metals and Non-metals (2 labs) ═══════════════

  "chem-mineral-acids": {
    experimentId:      "chem-mineral-acids",
    experimentTitle:   { en: "Metals — Reactions with Mineral Acids", as: "ধাতু — খনিজ অম্লৰ সৈতে বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 3,
    ncertChapterKey:   "class10-ch03",
    ncertChapterTitle: CH_X_03_METALS,
    ncertTopic:        TOPIC_METALS_ACIDS,
    bilingualReady:    true,
    emoji:             "🧪",
  },

  "chem-reactive-metals": {
    experimentId:      "chem-reactive-metals",
    experimentTitle:   { en: "Reactive Metals — Reactions with Oxygen & Water", as: "ক্ৰিয়াশীল ধাতু — অক্সিজেন আৰু পানীৰ সৈতে বিক্ৰিয়া" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 3,
    ncertChapterKey:   "class10-ch03",
    ncertChapterTitle: CH_X_03_METALS,
    ncertTopic:        TOPIC_METALS_AIR_H2O,
    bilingualReady:    true,
    emoji:             "⚗️",
  },

  // ═══ CHEMISTRY · Class X Ch 4 — Carbon and its Compounds (1 lab) ═════════════

  "chem-organic-reactions": {
    experimentId:      "chem-organic-reactions",
    experimentTitle:   { en: "Organic Reactions (Combustion, Esterification, etc.)", as: "জৈৱ বিক্ৰিয়া (দহন, ইষ্টাৰিফিকেচন ইত্যাদি)" },
    subjectId:         "chemistry",
    subjectName:       SUBJECT_NAME_CHEMISTRY,
    ncertClass:        "X",
    ncertChapterNumber: 4,
    ncertChapterKey:   "class10-ch04",
    ncertChapterTitle: CH_X_04_CARBON,
    ncertTopic:        TOPIC_CARBON_COMPOUNDS,
    bilingualReady:    true,
    emoji:             "🍑",
  },

};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLabByExperimentId(experimentId: string): LabRegistryEntry | undefined {
  return LAB_REGISTRY[experimentId];
}

/**
 * All labs that belong to a specific NCERT chapter. Used by the rule engine to
 * answer "what lab should I recommend after this chapter's notes?"
 */
export function getLabsForChapterKey(chapterKey: string): LabRegistryEntry[] {
  return Object.values(LAB_REGISTRY).filter(l => l.ncertChapterKey === chapterKey);
}

/**
 * All labs for a subject. Used to gate recommendations by the student's
 * chosen subjects (e.g., only show Chemistry labs to a Chemistry student).
 */
export function getLabsBySubject(subjectId: LabSubjectId): LabRegistryEntry[] {
  return Object.values(LAB_REGISTRY).filter(l => l.subjectId === subjectId);
}

/**
 * Labs that are safe to recommend to an Assamese-medium student right now
 * (bilingually translated). For English-medium students, this filter is a no-op.
 */
export function getBilingualReadyLabs(): LabRegistryEntry[] {
  return Object.values(LAB_REGISTRY).filter(l => l.bilingualReady);
}

/**
 * Build a stable chapterKey from (class, chapter number). Mirrors the format
 * used in LAB_REGISTRY entries. Engine uses this to look up Firestore chapter
 * docs by (classLevel, chapterNumber) and join them with experimentMastery.
 */
export function buildChapterKey(ncertClass: NcertClass, chapterNumber: number): string {
  const classNum = ncertClass === "IX" ? "09" : "10";
  const chNum = String(chapterNumber).padStart(2, "0");
  return `class${classNum}-ch${chNum}`;
}

/**
 * Coverage summary (for debug / admin sanity-check):
 *   biology   → 6 labs across 2 NCERT chapters (IX-Ch5 Fundamental Unit of Life,
 *               X-Ch6 Life Processes — SCERT-Assam numbering)
 *   chemistry → 12 labs across 4 NCERT chapters (X-Ch1, X-Ch2, X-Ch3, X-Ch4)
 *   physics   → 0 registered here (physics labs are handled dynamically via
 *               the /:experimentId route, which loads experiment docs from
 *               Firestore — those docs carry their own chapterId field).
 */
export const LAB_REGISTRY_COVERAGE = {
  totalLabs: Object.keys(LAB_REGISTRY).length,
  bySubject: {
    biology:   getLabsBySubject("biology").length,
    chemistry: getLabsBySubject("chemistry").length,
    physics:   getLabsBySubject("physics").length,
  },
  byChapter: Array.from(new Set(Object.values(LAB_REGISTRY).map(l => l.ncertChapterKey))),
} as const;
