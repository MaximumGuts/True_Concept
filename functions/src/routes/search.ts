import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";

/**
 * TRUE CONCEPT smart search.
 *
 * Single Cloud Function endpoint that indexes ALL content types and ranks
 * results. Key design choices (kept deliberately simple):
 *
 *   1. Module-scope in-memory cache with a 5-minute TTL. Every cold start
 *      pulls the full content index from Firestore once; subsequent calls
 *      within 5 minutes are served from RAM. At our scale (<1000 docs total)
 *      the whole index fits comfortably and cuts Firestore reads to ~zero.
 *
 *   2. The endpoint serves NOTES, MCQs, Q&A, CHAPTERS, EXPERIMENTS (labs),
 *      and PAPERS in a single grouped response. Previously only chapters +
 *      Q&A were searched.
 *
 *   3. Query pipeline (per request, runs in ~5ms once cache is warm):
 *        normalize → strip stop-words → expand synonyms → score every doc →
 *        sort → cap top-N per category → return grouped.
 *
 *   4. The legacy `questions` field is mirrored from the new `qa` field so
 *      the existing orval-generated client doesn't break.
 */

// ── Cache ────────────────────────────────────────────────────────────────

interface SearchDoc {
  id:            string;
  type:          "chapter" | "note" | "mcq" | "qa" | "lab" | "paper";
  title:         string;
  body:          string;
  chapterId?:    string;
  subjectId?:    string;
  subjectName?:  string;
  chapterNumber?: number;
  classLevel?:   string | null;
  medium?:       string | null;
  board?:        string | null;
  href:          string;
  /** Pre-computed lowercase title + body + tags, ready for substring matching. */
  searchableText: string;
  /** Extra rank boosts for this doc (e.g. mcq setNumber, paper order). */
  extra?:        Record<string, unknown>;
}

let CACHE: { docs: SearchDoc[]; loadedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ── Stop words & synonyms ────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being","am",
  "do","does","did","doing","done",
  "have","has","had","having",
  "can","could","will","would","should","shall","may","might","must",
  "what","why","how","when","where","who","whom","which","whose",
  "of","in","on","at","by","for","with","from","to","into","over","under",
  "and","or","but","not","no","yes","so","if","then","than","that","this","these","those",
  "it","its","i","you","he","she","they","we","my","your","his","her","their","our","me","us","him","them",
  "about","as","like","very","really","just","more","most","much","many","some","any","all","each","every","other","another",
]);

/** Educational synonym dictionary. Bidirectional — a query term that matches
 *  a key OR a value adds the OTHER side to the query, so "ohms law" finds
 *  notes that mention "V=IR" and vice versa. */
const SYNONYMS: Record<string, string[]> = {
  "ohms law":         ["v=ir", "voltage current resistance", "ohm law"],
  "myopia":           ["short sighted", "shortsightedness", "nearsighted", "cannot see far"],
  "hypermetropia":    ["far sighted", "farsightedness", "long sighted", "cannot see near"],
  "presbyopia":       ["old age sight", "age related vision"],
  "reflection":       ["mirror", "bouncing light"],
  "refraction":       ["bending light", "snells law"],
  "dispersion":       ["splitting of light", "rainbow", "prism"],
  "joule heating":    ["wire becomes hot", "heating effect of current", "heating wire"],
  "photosynthesis":   ["plants make food", "leaves food", "chlorophyll glucose"],
  "respiration":      ["breathing", "oxygen energy", "cellular respiration"],
  "mitochondria":     ["powerhouse of cell", "energy organelle"],
  "newton second law":["f=ma", "force mass acceleration"],
  "newton third law": ["action reaction", "equal opposite"],
  "gravitation":      ["gravity", "free fall", "weight"],
  "electromagnet":    ["electromagnetism", "magnetic effect current", "solenoid"],
  "acid":             ["acidic", "ph below 7", "sour"],
  "base":             ["basic", "alkali", "alkaline", "ph above 7"],
  "salt":             ["neutralization product"],
  "ph":               ["acidity", "ph scale", "ph value"],
  "atom":             ["atomic", "element particle"],
  "molecule":         ["molecular", "compound"],
  "electron":         ["electrons", "negative charge"],
  "proton":           ["protons", "positive charge"],
  "neutron":          ["neutrons", "neutral particle"],
  "valency":          ["combining capacity", "valence"],
  "mole":             ["avogadro number", "molar mass"],
  "tissue":           ["tissues", "group of cells"],
  "cell":             ["cells", "basic unit life"],
  "evolution":        ["natural selection", "darwin", "species change"],
  "heredity":         ["inheritance", "genes", "dna"],
  "polynomial":       ["polynomials", "algebraic expression"],
  "quadratic":        ["x squared", "ax2 bx c"],
  "trigonometry":     ["sin cos tan", "trig ratios"],
  "circle":           ["circles", "circumference area"],
  "triangle":         ["triangles", "pythagoras"],
  "probability":      ["chance", "likelihood"],
  "statistics":       ["mean median mode", "data analysis"],
  "circuit":          ["electric circuit", "wiring", "components"],
  "current":          ["electric current", "amperes", "flow of charge"],
  "voltage":          ["potential difference", "volts", "emf"],
  "resistance":       ["resistor", "ohms", "opposition to current"],
  "magnetic field":   ["magnet field", "lines of force"],
  "sound":            ["audio", "vibration", "waves"],
  "echo":             ["reflection of sound", "sound returning"],
  "force":            ["push pull", "newtons"],
  "motion":           ["movement", "speed velocity"],
  "speed":            ["fast slow", "distance per time"],
  "velocity":         ["speed direction", "vector speed"],
  "acceleration":     ["rate of change velocity", "speeding up"],
  "energy":           ["work done", "joules"],
  "work":             ["energy transfer", "force times distance"],
  "power":            ["rate of work", "watts"],
};

const SYNONYM_LOOKUP = (() => {
  // Build a flat map: every word/phrase → list of expansions.
  const m = new Map<string, string[]>();
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    const allTerms = [key, ...vals];
    for (const term of allTerms) {
      const others = allTerms.filter((t) => t !== term);
      const existing = m.get(term) ?? [];
      m.set(term, [...new Set([...existing, ...others])]);
    }
  }
  return m;
})();

// ── Query pipeline ───────────────────────────────────────────────────────

function normalizeText(s: string): string {
  return s.toLowerCase()
    .replace(/[^\p{L}\p{N}\s=]+/gu, " ")  // strip punctuation, keep '=' for "v=ir"
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(query: string): string[] {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  const words = normalized.split(" ").filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

/**
 * Returns ONLY the synonym-derived terms (does NOT include the raw keywords).
 * Multi-word synonyms are kept as whole phrases — they are NEVER split into
 * individual words, otherwise common pollutants like "law" or "light" would
 * make every Newton's Laws note match a search for "refraction".
 * Single-word synonyms (e.g. "mirror" from "reflection") are kept as-is.
 */
function getSynonymExpansions(keywords: string[], rawQuery: string): string[] {
  const out = new Set<string>();
  const normalizedQuery = normalizeText(rawQuery);

  for (const [term, expansions] of SYNONYM_LOOKUP) {
    // Multi-word synonym key matches the whole query (e.g. "ohms law" appears in query).
    if (term.includes(" ") && normalizedQuery.includes(term)) {
      for (const exp of expansions) out.add(exp);
    }
  }
  for (const kw of keywords) {
    const expansions = SYNONYM_LOOKUP.get(kw);
    if (expansions) {
      for (const exp of expansions) out.add(exp);
    }
  }
  // Don't echo back keywords as synonyms.
  for (const kw of keywords) out.delete(kw);
  return [...out];
}

// ── Ranking ──────────────────────────────────────────────────────────────

interface RankContext {
  rawKeywords:        string[];   // exact keywords extracted from the user query
  synonymExpansions:  string[];   // synonym-derived phrases (kept whole)
  normalizedQuery:    string;     // full normalized query (e.g. "ohms law")
}

/** Doc must clear this score floor to appear in results. Prevents single-word
 *  matches on common terms (e.g. "law", "energy") from polluting the list. */
const MIN_SCORE_THRESHOLD = 10;

function scoreDoc(doc: SearchDoc, ctx: RankContext): number {
  const title  = doc.title.toLowerCase();
  const text   = doc.searchableText;
  let score    = 0;

  // Strongest signal: the raw (un-expanded) query appears literally in title.
  if (ctx.normalizedQuery.length >= 3 && title.includes(ctx.normalizedQuery)) {
    score += 100;
  }
  // Same in body.
  if (ctx.normalizedQuery.length >= 3 && text.includes(ctx.normalizedQuery)) {
    score += 20;
  }

  // Raw keywords — what the student actually typed. High weight.
  for (const kw of ctx.rawKeywords) {
    if (title.includes(kw))      score += 15;
    else if (text.includes(kw))  score += 6;
  }

  // Synonym expansions — supportive matches. Low weight; substring match
  // against the whole searchableText so "snells law" must appear as a phrase
  // and won't trigger on every doc that just mentions "law".
  for (const exp of ctx.synonymExpansions) {
    if (text.includes(exp)) {
      score += exp.includes(" ") ? 5 : 3;  // multi-word phrase = stronger signal
    }
  }

  // Tiny type bias — primary content nudged first.
  const typeBoost: Record<SearchDoc["type"], number> = {
    note: 3, chapter: 2, mcq: 1, qa: 1, lab: 2, paper: 1,
  };
  score += typeBoost[doc.type] ?? 0;

  return score;
}

// ── Index builder ────────────────────────────────────────────────────────

async function buildIndex(): Promise<SearchDoc[]> {
  const [chaptersSnap, subjectsSnap, notesSnap, mcqsSnap, qaSnap, experimentsSnap, papersSnap, paperSetsSnap] =
    await Promise.all([
      db.collection("chapters").get(),
      db.collection("subjects").get(),
      db.collection("notes").get(),
      db.collection("mcqs").get(),
      db.collection("qa").get(),
      db.collection("experiments").get(),
      db.collection("papers").get(),
      db.collection("paperSets").get(),
    ]);

  const subjectMap = new Map<string, string>(
    subjectsSnap.docs.map((d: any) => [d.id, d.data().name ?? ""]),
  );
  type ChapterMeta = { classLevel: string | null; medium: string | null; board: string | null; subjectId: string; subjectName: string; chapterNumber?: number; title: string };
  const chapterMetaMap = new Map<string, ChapterMeta>();
  chaptersSnap.docs.forEach((d: any) => {
    const data = d.data();
    chapterMetaMap.set(d.id, {
      classLevel: data.classLevel ?? null,
      medium:     data.medium ?? "Both",
      board:      data.board ?? "Both",
      subjectId:  data.subjectId,
      subjectName: subjectMap.get(data.subjectId) ?? "",
      chapterNumber: data.chapterNumber,
      title:      data.title,
    });
  });
  const paperSetMap = new Map<string, { title: string; subjectId?: string }>(
    paperSetsSnap.docs.map((d: any) => [d.id, { title: d.data().title ?? "", subjectId: d.data().subjectId }]),
  );

  const docs: SearchDoc[] = [];

  // Chapters
  for (const d of chaptersSnap.docs) {
    const data = d.data() as any;
    const meta = chapterMetaMap.get(d.id)!;
    const title = data.title ?? "";
    const body  = data.description ?? "";
    docs.push({
      id: d.id, type: "chapter", title, body,
      subjectId: meta.subjectId, subjectName: meta.subjectName,
      chapterNumber: meta.chapterNumber, classLevel: meta.classLevel, medium: meta.medium, board: meta.board,
      href: `/chapters/${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${meta.subjectName}`),
    });
  }

  // Notes
  for (const d of notesSnap.docs) {
    const data = d.data() as any;
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.title ?? "";
    const body  = (data.content ?? "").slice(0, 500);
    docs.push({
      id: d.id, type: "note", title, body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId, subjectName: meta.subjectName,
      classLevel: meta.classLevel, medium: meta.medium, board: meta.board,
      href: `/chapters/${data.chapterId}?tab=notes&open=${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${meta.title}`),
    });
  }

  // MCQs
  for (const d of mcqsSnap.docs) {
    const data = d.data() as any;
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.question ?? "";
    const body  = (Array.isArray(data.options) ? data.options.join(" ") : "") + " " + (data.explanation ?? "");
    docs.push({
      id: d.id, type: "mcq", title, body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId, subjectName: meta.subjectName,
      classLevel: meta.classLevel, medium: meta.medium, board: meta.board,
      href: `/chapters/${data.chapterId}?tab=mcq`,
      searchableText: normalizeText(`${title} ${body} ${meta.title}`),
      extra: { setNumber: data.setNumber ?? 1 },
    });
  }

  // Q&A (also fed to legacy "questions" field on the response)
  for (const d of qaSnap.docs) {
    const data = d.data() as any;
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.title ?? data.question ?? "";
    const body  = data.content ?? data.answer ?? "";
    docs.push({
      id: d.id, type: "qa", title, body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId, subjectName: meta.subjectName,
      classLevel: meta.classLevel, medium: meta.medium, board: meta.board,
      href: `/chapters/${data.chapterId}?tab=qa`,
      searchableText: normalizeText(`${title} ${body} ${meta.title} ${data.explanation ?? ""}`),
    });
  }

  // Experiments (virtual labs)
  for (const d of experimentsSnap.docs) {
    const data = d.data() as any;
    const title = data.title ?? "";
    const body  = data.description ?? "";
    const slug  = data.slug ?? d.id;
    docs.push({
      id: d.id, type: "lab", title, body,
      classLevel: data.classLevel ?? null,
      medium:     null,  // labs are not bound to a single medium
      board:      null,  // labs apply to all boards
      href: `/virtual-lab/${slug}`,
      searchableText: normalizeText(`${title} ${body} ${data.subject ?? ""} lab experiment`),
    });
  }

  // Papers (full-length question papers, optional)
  for (const d of papersSnap.docs) {
    const data = d.data() as any;
    const set  = paperSetMap.get(data.setId);
    const title = data.title ?? "";
    const body  = (data.content ?? "").slice(0, 400);
    docs.push({
      id: d.id, type: "paper", title, body,
      subjectId: set?.subjectId, subjectName: set ? set.title : "",
      classLevel: data.classLevel ?? null,
      medium:     data.medium ?? null,
      board:      data.board ?? null,
      href: `/papers/${data.setId}/${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${set?.title ?? ""} paper`),
    });
  }

  return docs;
}

async function getIndex(): Promise<SearchDoc[]> {
  const now = Date.now();
  if (CACHE && now - CACHE.loadedAt < CACHE_TTL_MS) return CACHE.docs;
  const docs = await buildIndex();
  CACHE = { docs, loadedAt: now };
  return docs;
}

// ── Endpoint ─────────────────────────────────────────────────────────────

const MAX_PER_CATEGORY = 8;

export const search = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const rawQuery = (req.query.q as string ?? "").trim();
    if (rawQuery.length < 2) {
      res.json({ chapters: [], notes: [], mcqs: [], qa: [], labs: [], papers: [], questions: [] });
      return;
    }

    const normalizedQuery   = normalizeText(rawQuery);
    let   rawKeywords       = extractKeywords(rawQuery);
    // Fallback: if every word was a stop-word, search by the raw normalized text.
    if (rawKeywords.length === 0) rawKeywords = [normalizedQuery];
    const synonymExpansions = getSynonymExpansions(rawKeywords, rawQuery);

    const ctx: RankContext = { rawKeywords, synonymExpansions, normalizedQuery };

    const docs = await getIndex();

    // Score every doc; only keep matches above the min threshold.
    const scored: Array<{ doc: SearchDoc; score: number }> = [];
    for (const doc of docs) {
      const s = scoreDoc(doc, ctx);
      if (s >= MIN_SCORE_THRESHOLD) scored.push({ doc, score: s });
    }
    scored.sort((a, b) => b.score - a.score);

    // Bucket by type, cap per category.
    const buckets: Record<SearchDoc["type"], SearchDoc[]> = {
      chapter: [], note: [], mcq: [], qa: [], lab: [], paper: [],
    };
    for (const { doc } of scored) {
      const bucket = buckets[doc.type];
      if (bucket.length < MAX_PER_CATEGORY) bucket.push(doc);
    }

    // Response shape: new categorized fields + legacy `chapters`/`questions`
    // (mirroring qa) so the existing orval-generated client keeps working.
    res.json({
      chapters: buckets.chapter,
      notes:    buckets.note,
      mcqs:     buckets.mcq,
      qa:       buckets.qa,
      labs:     buckets.lab,
      papers:   buckets.paper,
      // legacy
      questions: buckets.qa.map((q) => ({
        id: q.id, chapterId: q.chapterId,
        question: q.title, answer: q.body,
        classLevel: q.classLevel, medium: q.medium,
      })),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
