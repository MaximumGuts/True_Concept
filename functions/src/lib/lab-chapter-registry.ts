/**
 * Lab → NCERT Chapter Registry — SERVER-SIDE COPY
 *
 * Mirrors `artifacts/true-concept/src/lib/analytics/lab-chapter-registry.ts`.
 * Kept in sync manually. If you edit one, edit both.
 *
 * Future: extract to a `@workspace/lab-registry` shared package.
 */

export interface BilingualField<T> { en: T; as: T; }

export type NcertClass = "IX" | "X";
export type LabSubjectId = "biology" | "chemistry" | "physics";
export type ExperimentCompletionSignal = "journey" | "interaction" | "quiz";

export interface LabRegistryEntry {
  experimentId: string;
  experimentTitle: BilingualField<string>;

  subjectId: LabSubjectId;
  subjectName: BilingualField<string>;

  ncertClass: NcertClass;
  ncertChapterNumber: number;
  ncertChapterKey: string;
  ncertChapterTitle: BilingualField<string>;

  ncertTopic?: BilingualField<string>;

  bilingualReady: boolean;
  emoji?: string;
}

const SUBJECT_NAME_BIOLOGY:   BilingualField<string> = { en: "Biology",   as: "জীৱবিজ্ঞান" };
const SUBJECT_NAME_CHEMISTRY: BilingualField<string> = { en: "Chemistry", as: "ৰসায়নবিজ্ঞান" };

const CH_IX_05_FUND_UNIT:  BilingualField<string> = { en: "The Fundamental Unit of Life", as: "জীৱনৰ মৌলিক একক" };
const CH_X_01_CHEM_RXN:    BilingualField<string> = { en: "Chemical Reactions and Equations", as: "ৰাসায়নিক বিক্ৰিয়া আৰু সমীকৰণ" };
const CH_X_02_ACIDS_BASES: BilingualField<string> = { en: "Acids, Bases and Salts", as: "অম্ল, ক্ষাৰক আৰু লৱণ" };
const CH_X_03_METALS:      BilingualField<string> = { en: "Metals and Non-metals", as: "ধাতু আৰু অধাতু" };
const CH_X_04_CARBON:      BilingualField<string> = { en: "Carbon and its Compounds", as: "কাৰ্বন আৰু ইয়াৰ যৌগসমূহ" };
const CH_X_06_LIFE_PROC:   BilingualField<string> = { en: "Life Processes", as: "জৈৱিক প্ৰক্ৰিয়াসমূহ" };

const TOPIC_NUTRITION:      BilingualField<string> = { en: "Nutrition", as: "পুষ্টি" };
const TOPIC_RESPIRATION:    BilingualField<string> = { en: "Respiration", as: "শ্বসন" };
const TOPIC_TRANSPORTATION: BilingualField<string> = { en: "Transportation", as: "পৰিবহন" };
const TOPIC_EXCRETION:      BilingualField<string> = { en: "Excretion", as: "ৰেচন" };

const TOPIC_COMBINATION:    BilingualField<string> = { en: "Combination Reactions", as: "সংযোগ বিক্ৰিয়া" };
const TOPIC_DECOMPOSITION:  BilingualField<string> = { en: "Decomposition Reactions", as: "বিযোজন বিক্ৰিয়া" };
const TOPIC_DISPLACEMENT:   BilingualField<string> = { en: "Displacement Reactions", as: "প্ৰতিস্থাপন বিক্ৰিয়া" };
const TOPIC_DOUBLE_DISP:    BilingualField<string> = { en: "Double Displacement & Precipitation Reactions", as: "দ্বৈত প্ৰতিস্থাপন আৰু অৱক্ষেপণ বিক্ৰিয়া" };
const TOPIC_REDOX:          BilingualField<string> = { en: "Oxidation & Reduction (Redox) Reactions", as: "জাৰণ আৰু বিজাৰণ বিক্ৰিয়া" };

const TOPIC_IONIC_NEUTRAL:    BilingualField<string> = { en: "Ionic Dissociation & Neutralization", as: "আয়নিক বিয়োজন আৰু প্ৰশমন" };
const TOPIC_ACID_METAL_OXIDE: BilingualField<string> = { en: "Acid-Base Interactions with Metals & Oxides", as: "ধাতু আৰু অক্সাইডৰ সৈতে অম্ল-ক্ষাৰৰ বিক্ৰিয়া" };
const TOPIC_CARBONATES:       BilingualField<string> = { en: "Reactions with Carbonates & Hydrogen Carbonates", as: "কাৰ্বনেট আৰু হাইড্ৰ\'জেন কাৰ্বনেটৰ বিক্ৰিয়া" };
const TOPIC_INDUSTRIAL_SALTS: BilingualField<string> = { en: "Industrial Chemicals from Common Salt", as: "সাধাৰণ লৱণৰ পৰা শিল্পিক ৰসায়ন" };

const TOPIC_METALS_AIR_H2O: BilingualField<string> = { en: "Metals — Reactions with Oxygen & Water", as: "ধাতু — অক্সিজেন আৰু পানীৰ সৈতে বিক্ৰিয়া" };
const TOPIC_METALS_ACIDS:   BilingualField<string> = { en: "Metals — Reactions with Mineral Acids", as: "ধাতু — খনিজ অম্লৰ সৈতে বিক্ৰিয়া" };

const TOPIC_CARBON_COMPOUNDS: BilingualField<string> = { en: "Combustion, Esterification, Saponification & Addition Reactions", as: "দহন, এষ্টাৰীকৰণ, ছেপ\'নিফিকেচন আৰু সংযোজন বিক্ৰিয়া" };

export const LAB_REGISTRY: Record<string, LabRegistryEntry> = {
  "biology-animal-cell": { experimentId: "biology-animal-cell", experimentTitle: { en: "Animal Cell", as: "প্ৰাণী কোষ" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "IX", ncertChapterNumber: 5, ncertChapterKey: "class09-ch05", ncertChapterTitle: CH_IX_05_FUND_UNIT, bilingualReady: true, emoji: "🔬" },
  "biology-plant-cell": { experimentId: "biology-plant-cell", experimentTitle: { en: "Plant Cell", as: "উদ্ভিদ কোষ" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "IX", ncertChapterNumber: 5, ncertChapterKey: "class09-ch05", ncertChapterTitle: CH_IX_05_FUND_UNIT, bilingualReady: true, emoji: "🌿" },
  "biology-digestive-system": { experimentId: "biology-digestive-system", experimentTitle: { en: "Human Digestive System", as: "মানুহৰ পাচন তন্ত্ৰ" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_NUTRITION, bilingualReady: true, emoji: "🫀" },
  "biology-respiratory-system": { experimentId: "biology-respiratory-system", experimentTitle: { en: "Human Respiratory System", as: "মানুহৰ শ্বসন তন্ত্ৰ" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_RESPIRATION, bilingualReady: true, emoji: "🫁" },
  "biology-heart-circulation": { experimentId: "biology-heart-circulation", experimentTitle: { en: "Human Heart & Blood Circulation", as: "মানুহৰ হৃদপিণ্ড আৰু ৰক্তসংবহন" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_TRANSPORTATION, bilingualReady: true, emoji: "❤️" },
  "biology-excretory-system": { experimentId: "biology-excretory-system", experimentTitle: { en: "Human Excretory System & Nephron", as: "মানুহৰ ৰেচন তন্ত্ৰ আৰু নেফ্ৰন" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_EXCRETION, bilingualReady: true, emoji: "🫘" },

  "chem-combination-reactions": { experimentId: "chem-combination-reactions", experimentTitle: { en: "Combination Reactions", as: "সংযোগ বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_COMBINATION, bilingualReady: true, emoji: "⚗️" },
  "chem-decomposition-reactions": { experimentId: "chem-decomposition-reactions", experimentTitle: { en: "Decomposition Reactions", as: "বিযোজন বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DECOMPOSITION, bilingualReady: true, emoji: "🔥" },
  "chem-displacement-reactions": { experimentId: "chem-displacement-reactions", experimentTitle: { en: "Displacement Reactions", as: "প্ৰতিস্থাপন বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DISPLACEMENT, bilingualReady: true, emoji: "🔵" },
  "chem-double-displacement": { experimentId: "chem-double-displacement", experimentTitle: { en: "Double Displacement & Precipitation Reactions", as: "দ্বৈত প্ৰতিস্থাপন আৰু অৱক্ষেপণ বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DOUBLE_DISP, bilingualReady: true, emoji: "🟡" },
  "chem-redox-reactions": { experimentId: "chem-redox-reactions", experimentTitle: { en: "Redox Reactions (Oxidation & Reduction)", as: "ৰেডক্স বিক্ৰিয়া (জাৰণ আৰু অপচয়ন)" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_REDOX, bilingualReady: true, emoji: "🔁" },

  "chem-ionic-neutralization": { experimentId: "chem-ionic-neutralization", experimentTitle: { en: "Ionic Dissociation & Neutralization", as: "আয়নিক বিযোজন আৰু নিৰপেক্ষণ" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_IONIC_NEUTRAL, bilingualReady: true, emoji: "⚖️" },
  "chem-acid-metal-oxide": { experimentId: "chem-acid-metal-oxide", experimentTitle: { en: "Acid Reactions with Metals & Metal Oxides", as: "ধাতু আৰু ধাতু অক্সাইডৰ সৈতে অম্ল বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_ACID_METAL_OXIDE, bilingualReady: true, emoji: "🧪" },
  "chem-carbonate-reactions": { experimentId: "chem-carbonate-reactions", experimentTitle: { en: "Reactions with Metal Carbonates & Hydrogen Carbonates", as: "ধাতু কাৰ্বনেট আৰু হাইড্ৰ'জেনকাৰ্বনেটৰ সৈতে বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_CARBONATES, bilingualReady: true, emoji: "🫧" },
  "chem-industrial-chemicals": { experimentId: "chem-industrial-chemicals", experimentTitle: { en: "Industrial Chemicals from Common Salt", as: "সাধাৰণ লৱণৰ পৰা শিল্প ৰাসায়নিক" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_INDUSTRIAL_SALTS, bilingualReady: true, emoji: "🧂" },

  "chem-mineral-acids": { experimentId: "chem-mineral-acids", experimentTitle: { en: "Metals — Reactions with Mineral Acids", as: "ধাতু — খনিজ অম্লৰ সৈতে বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 3, ncertChapterKey: "class10-ch03", ncertChapterTitle: CH_X_03_METALS, ncertTopic: TOPIC_METALS_ACIDS, bilingualReady: true, emoji: "🧪" },
  "chem-reactive-metals": { experimentId: "chem-reactive-metals", experimentTitle: { en: "Reactive Metals — Reactions with Oxygen & Water", as: "ক্ৰিয়াশীল ধাতু — অক্সিজেন আৰু পানীৰ সৈতে বিক্ৰিয়া" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 3, ncertChapterKey: "class10-ch03", ncertChapterTitle: CH_X_03_METALS, ncertTopic: TOPIC_METALS_AIR_H2O, bilingualReady: true, emoji: "⚗️" },

  "chem-organic-reactions": { experimentId: "chem-organic-reactions", experimentTitle: { en: "Organic Reactions (Combustion, Esterification, etc.)", as: "জৈৱ বিক্ৰিয়া (দহন, ইষ্টাৰিফিকেচন ইত্যাদি)" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 4, ncertChapterKey: "class10-ch04", ncertChapterTitle: CH_X_04_CARBON, ncertTopic: TOPIC_CARBON_COMPOUNDS, bilingualReady: true, emoji: "🍑" },
};

export function getLabByExperimentId(experimentId: string): LabRegistryEntry | undefined {
  return LAB_REGISTRY[experimentId];
}

export function getLabsForChapterKey(chapterKey: string): LabRegistryEntry[] {
  return Object.values(LAB_REGISTRY).filter(l => l.ncertChapterKey === chapterKey);
}

export function buildChapterKey(ncertClass: NcertClass, chapterNumber: number): string {
  const classNum = ncertClass === "IX" ? "09" : "10";
  const chNum = String(chapterNumber).padStart(2, "0");
  return `class${classNum}-ch${chNum}`;
}

/**
 * Maps an experimentId to its student-facing route path so the Mentor card's
 * CTA can deep-link directly into the lab.
 */
export function getLabRouteForExperimentId(experimentId: string): string {
  // Biology Module labs live under /virtual-lab/biology/*
  if (experimentId.startsWith("biology-")) {
    const slug = experimentId.replace(/^biology-/, "");
    return `/virtual-lab/biology/${slug}`;
  }
  // Chemistry Module labs live under /virtual-lab/* (drop the "chem-" prefix)
  if (experimentId.startsWith("chem-")) {
    const slug = experimentId.replace(/^chem-/, "");
    return `/virtual-lab/${slug}`;
  }
  // Fallback: dynamic experiment detail page
  return `/virtual-lab/${experimentId}`;
}
