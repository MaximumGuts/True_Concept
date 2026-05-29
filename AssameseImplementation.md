# Biology Lab — Assamese Implementation Plan

## Goal

When a student whose `prefs.medium === "Assamese"` enters any Biology Lab simulation, **every visible word** must render in Assamese — UI chrome, organ labels on the diagram, functions / NCERT notes / fun facts in the side panel, the journey narration, and the quiz. All Assamese terms must be **scientifically/biologically correct** as used in NCERT Assam / SCERT Assam textbooks, not literal Google-Translate output.

A small **language toggle** (অ / EN) stays available in the lab header so a student can switch on demand (e.g. to cross-reference an English technical term).

This document is the plan. **No code changes have been made yet.** Once you approve, we'll execute phase-by-phase.

---

## Decisions Locked In (per your reply)

| # | Decision | Implication |
|---|---|---|
| 1 | **Virtual-Lab-only scope — permanent, not just this round.** Nothing outside `/virtual-lab/**` ever changes as part of this Assamese-UI workstream. AI Mentor, broadcast banner, chapter pages, dashboard, notifications, search — all untouched, now and in any future Assamese expansion. | All Assamese plumbing lives inside `lab/` and `i18n/biologyTranslations.ts`. Other pages remain English-UI (with admin-supplied Assamese content as today). |
| 2 | **Toggle is strictly lab-scoped.** Changing the toggle affects only what's rendered inside virtual lab routes. Zero coupling to any other surface. | The toggle's persisted value goes into a dedicated `localStorage["trueconcept_lab_lang"]` key — separate from `trueconcept_student_prefs`. AI Mentor / Broadcast / NotificationBell continue to read only from `prefs.medium`. |
| 3 | **Default language inside the lab is derived from `prefs.medium` once on first lab entry**, then `trueconcept_lab_lang` overrides it for all subsequent visits. This is *read-only* coupling — the lab reads `prefs.medium` to pick a default but never writes back to it. (If you want even this read-only seed removed, say so and I'll change the default to plain English.) | Assamese students don't have to click the toggle every time. But the toggle still wins if they prefer English inside the lab. |
| 4 | ~~TTS narration~~ — **dropped**. Per your call on 2026-05-17, voice narration is skipped for BOTH English and Assamese in this round. Existing broken voice code is left alone (not investigated, not removed). | Phase 4½ removed from the schedule. Data files do NOT need any `audio` field. |

---

## What Already Exists (Good News)

| Asset | File | State |
|---|---|---|
| Language context with `en`/`as` and `t(key)` helper | [LanguageContext.tsx](artifacts/true-concept/src/contexts/LanguageContext.tsx) | ✅ Working, with smooth opacity transition on toggle |
| Translation dictionary | [biologyTranslations.ts](artifacts/true-concept/src/i18n/biologyTranslations.ts) | ✅ 497 lines — UI controls, panel section headers, blood-type badges, module names |
| Toggle key registered as `ui.language` (`EN` ↔ `অ`) | biologyTranslations.ts | ✅ Exists |
| All 6 biology sim components call `useLanguage()` | `lab/sims/biology/*.tsx` | ✅ Wired |
| Per-sim data files (English source-of-truth) | `lab/sims/biology/*-data.ts` | ⚠️ Hardcoded English text in fields: `name`, `role`, `description`, `functions[]`, `secretions[]`, `examNotes[]`, `funFact`, `disorders`, `journeyNote`, quiz `q`/`opts[]`/`explanation` |

---

## What's Missing or Broken (Gap Analysis)

### Gap 1 — Default language is hardcoded English

[LanguageContext.tsx:21](artifacts/true-concept/src/contexts/LanguageContext.tsx#L21) — `useState<Lang>("en")`. An Assamese-medium student lands on the English version and must manually click the toggle every time they enter the lab. Must auto-default to `"as"` when `useStudentPrefs().prefs?.medium === "Assamese"`.

### Gap 2 — Data files contain raw English strings

Each `*-data.ts` file holds organ/quiz data inline. The `t()` helper only resolves keys that exist in the dictionary, so accessing `organ.functions[0]` returns the English string directly. We need to either:

- **(A) Convert each field to a translation key** (e.g. `functions: ["organ.mouth.fn.1", "organ.mouth.fn.2", …]`) and add each to `biologyTranslations.ts`, **or**
- **(B) Inline both languages** (e.g. `functions: { en: [...], as: [...] }`) and read via `lang`.

Recommendation: **(B) inline** — it keeps the source-of-truth and the translation co-located in the same file, which makes it harder to ship missing translations. Translators can review one file per module without jumping between dictionary entries. We'll add a tiny helper `pick(field, lang)` that returns `field[lang] ?? field.en`.

### Gap 3 — Diagram labels (SVG text)

The screenshot of "Human Digestive System" shows labels like "Oral Cavity", "Salivary Glands", "Pharynx", "Stomach", "Liver", "Gallbladder", "Pancreas", "Small Intestine", "Large Intestine", "Appendix", "Cecum / Colon", "Rectum" rendered as `<text>` inside the SVG. These pull from `ORGANS[id].name`. Once the data-file conversion (Gap 2) is done, these become translated automatically — we just need to make sure every label-render site reads via `pick(name, lang)`.

### Gap 4 — Journey/animation step narration

`JourneyStep.shortNote` (e.g. "Bolus pushed through pharynx") is in English. Same fix as Gap 2.

### Gap 5 — Quiz items

`QuizQ.q`, `QuizQ.opts[]`, `QuizQ.explanation` are all English. Highest-precision area — biological vocabulary in distractor options (e.g. "Pepsin", "Trypsin", "Lipase") must be transliterated faithfully (পেপ্‌চিন, ট্ৰিপ্‌চিন, লাইপেছ) and NOT translated to "fat enzyme" / "protein enzyme".

### Gap 6 — Toggle button placement

Confirmed key exists (`ui.language: "EN" / "অ"`). Need to audit whether it's rendered in every lab screen header (lab listing, experiment detail card, inside the simulation, on the quiz screen). Plan includes a single-pass placement audit.

### Gap 7 — Outside the lab

Per your request, this plan is **Biology Lab only**. Physics Lab, Chemistry Lab, and the rest of the app are out of scope for this round. Same pattern applies later.

---

## Per-Screen Coverage Matrix (5 scenarios you listed)

Each row maps your 5 screenshots to the exact file(s) and the work items.

### Screen 1 — Biology Lab landing (list of experiments)

**File:** [virtual-lab.tsx](artifacts/true-concept/src/pages/virtual-lab.tsx) — `SubjectLabPage subject="Biology"` branch + `BIOLOGY_MODULES` array.

| Element | Source today | Action |
|---|---|---|
| Page title "Biology Lab" | Hardcoded | Add key `lab.biology.title` |
| Subtitle "12 interactive experiments" | Computed string | Add key `lab.experimentsCount` with `{count}` placeholder |
| Module card title "Explore Animal Cell", "Explore Plant Cell", "Human Respiratory System"… | `BIOLOGY_MODULES[].title` | Already keyed via `t()` per `module.*` translations — VERIFY all 6 modules present |
| Module card subtitle "Interactive organelles · Live biological functions · AAA Quality" | `BIOLOGY_MODULES[].subtitle` | Add per-module subtitle keys |
| Type pill "2D DIAGRAM" / "LIVE ANIMATION" / "DOUBLE CIRCULATION" / "LIVE FILTRATION" | Hardcoded strings | Add pill-label keys |
| Play button (▶) | Icon-only | No change |
| Toggle button visible on this screen | Currently in module pages only — extend to lab listing | Add toggle in `SubjectLabPage` header |

### Screen 2 — Experiment detail card (e.g. "Human Digestive System" with START EXPLORATION / Take Quiz)

**File:** `lab/sims/biology/digestive-system.tsx` (and the 5 other sim files).

| Element | Source today | Action |
|---|---|---|
| Top pill "BIOLOGY VIRTUAL LAB" | Hardcoded | Add key `lab.pill.biology` |
| Title "Human Digestive System" | Module name | Already keyed (`module.digestiveSystem`) — verify |
| Subtitle/description paragraph ("Explore a fully interactive, anatomically accurate…") | Hardcoded | Add per-module description keys |
| Feature badges "12 ORGANS", "LIVE JOURNEY", "NCERT NOTES", "10 MCQS" | Hardcoded | Add keys, with numeric placeholders |
| "START EXPLORATION" button | Hardcoded | Already exists (`ui.startExploration`) |
| "Take Quiz" button | Hardcoded | Already exists (`ui.quiz`) |

### Screen 3 — Inside the simulation (interactive diagram with organ labels)

**Files:** Each sim's main render + SVG.

| Element | Source today | Action |
|---|---|---|
| Header title "Human Digestive System" | Same as Screen 2 | Same key |
| Hint text "CLICK ANY STRUCTURE TO EXPLORE · SCROLL TO ZOOM" | Hardcoded | Add key `lab.hint.clickToExplore` |
| Side-pill buttons "Journey" / "Quiz" / "Back" | Hardcoded | Add keys `ui.journey`, `ui.quiz`, `ui.back` (verify all present) |
| SVG organ labels — Oral Cavity, Salivary Glands, Pharynx, Esophagus, Stomach, Liver, Gallbladder, Pancreas, Small Intestine, Large Intestine, Appendix, Cecum / Colon, Rectum, Anus | `ORGANS[id].name` | Convert each `name` to bilingual `{en, as}` per Gap 2 |
| Right-rail placeholder "Click any organ to explore" + "12 interactive organs · NCERT aligned · Exam notes" | Mix of hardcoded + computed | Add keys |
| "▶ Watch Digestion Journey" / "▶ Filtration Journey" etc. | Per-module hardcoded | Already partially keyed (`ui.followJourney`, `ui.filtrationJourney`, `ui.nephronJourney`, `ui.followBloodJourney`) — verify digestion-specific |

### Screen 4 — Organ info panel (clicked organ details)

**Files:** Per-sim detail-panel component + organ data file.

| Element | Source today | Action |
|---|---|---|
| Organ name (e.g. "Pharynx") | `ORGANS[id].name` | Bilingual per Gap 2 |
| Role tag (e.g. "SWALLOWING PASSAGE — COMMON PATHWAY FOR FOOD AND AIR") | `ORGANS[id].role` | Bilingual |
| Description paragraph | `ORGANS[id].description` | Bilingual |
| Section header "FUNCTIONS" | Hardcoded | Already keyed (`panel.functions`) |
| Function bullets | `ORGANS[id].functions[]` | Bilingual array per organ |
| Section header "SECRETIONS / ENZYMES" | Hardcoded | Add key `panel.secretions` |
| Secretion bullets | `ORGANS[id].secretions[]` | Bilingual array |
| Section header "NCERT EXAM NOTES" | Hardcoded | Already keyed (`panel.examNotes`) |
| Exam-note bullets | `ORGANS[id].examNotes[]` | Bilingual array |
| Section header "FUN FACT" | Hardcoded | Already keyed (`panel.funFact`) |
| Fun fact body | `ORGANS[id].funFact` | Bilingual |
| Section header "Associated Disorders" | Hardcoded | Already keyed (`panel.disorders`) |
| Disorder list | `ORGANS[id].disorders` | Bilingual |
| Close (×) button | Icon-only | No change |
| Journey narration overlay | `JourneyStep.shortNote` + `ORGANS[id].journeyNote` | Bilingual |

### Screen 5 — Quiz (after experiment)

**Files:** Per-sim quiz component + `QUIZ` array in `-data.ts`.

| Element | Source today | Action |
|---|---|---|
| Quiz header "⚡ DIGESTIVE SYSTEM QUIZ" / "EXCRETORY SYSTEM QUIZ" etc. | Per-module hardcoded | Add per-module key `quiz.title.*` |
| "Score: 0/0  Q1/10" | Computed string | Add keys `quiz.score`, `quiz.questionOf` with placeholders |
| Question text (`q`) | `QUIZ[i].q` | Bilingual |
| Options (`opts[]`) | `QUIZ[i].opts` | Bilingual array |
| Explanation after answer (`explanation`) | `QUIZ[i].explanation` | Bilingual |
| Correct/Wrong feedback | Hardcoded | Already keyed (`ui.correct`, `ui.wrong`) |
| "Next Question →" / "See Results" / "Retry" buttons | Hardcoded | Already keyed |
| Final result message ("Excellent!", "Good work — review more!", "Review the module again.") | Hardcoded | Already keyed |

---

## Implementation Phases

### Phase 0 — Translation infrastructure (1 small PR, ~30 min)

1. Update [LanguageContext.tsx](artifacts/true-concept/src/contexts/LanguageContext.tsx) so that:
   - **Default is read once** from `localStorage["trueconcept_lab_lang"]`. If absent, seeded from `prefs.medium` (`"Assamese" → "as"`, else `"en"`).
   - **Toggle writes only** to `localStorage["trueconcept_lab_lang"]`. **Never writes back to `prefs.medium` or any other context.**
   - Reaffirm: this context is **mounted only inside the virtual-lab route subtree** so it cannot accidentally affect the rest of the app. We'll move `<LanguageProvider>` from the App root (if it's there today) to wrap only the virtual-lab routes.
2. Add a `pick<T>(field: BilingualField<T>, lang: Lang): T` helper to `lib/i18n.ts` so data files can co-locate translations.
3. Add a `BilingualField<T>` type so TypeScript flags missing translations at build time.
4. Ensure the toggle button (`ui.language`) is visibly placed in:
   - Biology Lab landing header (Screen 1) — currently missing
   - Experiment detail card header (Screen 2)
   - Simulation header (Screen 3)
   - Quiz screen header (Screen 5)
5. **Verification gate at end of Phase 0:** confirm by grepping the codebase that `useLanguage()` is not imported anywhere outside `pages/virtual-lab.tsx`, `pages/experiment-detail.tsx`, and `components/lab/**`. If it is, refactor or block.

### Phase 1 — Static UI strings (Screens 1, 2)

5. Audit `virtual-lab.tsx` and the `BIOLOGY_MODULES` array → add subtitle and pill-label keys to `biologyTranslations.ts`.
6. Audit each sim file's "landing card" view (the START EXPLORATION / Take Quiz screen) → key all hardcoded strings.
7. Verify each `module.*` key has an Assamese value (no fallback to English).

### Phase 2 — Data file conversion (Screens 3, 4) — the bulk of the work

For each of the 6 sim data files (order = simplest → most complex):

| Order | File | Approx organ/data count |
|---|---|---|
| 1 | `animal-cell-data.ts` (88 lines) | ~8 organelles |
| 2 | `plant-cell-data.ts` (98 lines) | ~10 organelles |
| 3 | `digestive-system-data.ts` (203 lines) | 12 organs |
| 4 | `excretory-system-data.ts` (227 lines) | ~10 organs/structures |
| 5 | `heart-circulation-data.ts` (244 lines) | 16 structures |
| 6 | `respiratory-system-data.ts` (422 lines) | 12 organs + sub-structures |

For each file:
- Convert `OrganData` interface fields from `string` / `string[]` to `BilingualField<string>` / `BilingualField<string[]>`.
- Write Assamese for every field. Source terminology from:
  - **Primary:** NCERT Assamese (অসমীয়া) Class IX/X Biology textbooks (chapter 6 "Life Processes" maps cleanly to digestive/respiratory/excretory/circulatory).
  - **Secondary:** SCERT Assam approved glossary.
  - **Tertiary:** *Vigyan Bharati Assamese Glossary* (for organelle names like mitochondria → মাইটকন্দ্ৰিয়া).
- Update each sim's render code to use `pick(organ.name, lang)`, `pick(organ.functions, lang)`, etc.

**Each data file gets its own commit** so a teacher can review one file at a time. Open question for you: do you want me to compile the Assamese drafts and have you/a teacher review, or do you have an authoritative glossary file already?

### Phase 3 — SVG label rendering (Screen 3)

8. Find every `<text>` inside biology SVG diagrams and confirm it reads from `pick(organ.name, lang)`.
9. Adjust font-family if needed — verify the Assamese glyphs render correctly in the SVG-embedded font (Assamese ৎ, ৰ, ঌ glyphs require a font that ships them; we already use system Bengali fonts which cover Assamese). Test on Android Chrome + iOS Safari.
10. Re-check label collisions — Assamese labels are typically 30–60% longer than English (e.g. "Gallbladder" → "পিত্তথলি" = same length; but "Salivary Glands" → "লালা গ্ৰন্থি" is longer). May need to reduce font size or shorten leader lines in 1–2 cases.

### Phase 4 — Journey narration (Screen 4 overlay)

11. Convert `journeyNote` and `JourneyStep.shortNote` to bilingual.
12. Translate animation step labels (e.g. "Step 1 of 8" — already keyed as `ui.step`, just verify it interpolates).

### ~~Phase 4½ — Voice / TTS~~ — DROPPED

Per your 2026-05-17 direction: voice narration is skipped for BOTH English and Assamese in this round. Existing broken voice code is left untouched. Data files do NOT carry any audio fields. Saves ~3-4 hr of work and removes a known fragile area (browser TTS Assamese voice availability is poor anyway).

### Phase 5 — Quiz translations (Screen 5)

13. Convert each module's `QUIZ` array to bilingual `q`/`opts`/`explanation`.
14. Critical: verify enzyme/scientific names in options preserve the conventional Assamese transliteration (পেপ্‌চিন, ট্ৰিপ্‌চিন, লাইপেছ, লালা এমাইলেজ).
15. Quiz title pill ("DIGESTIVE SYSTEM QUIZ", "RESPIRATORY SYSTEM QUIZ", etc.) — add 6 keys.

### Phase 6 — QA & verification

16. Set `prefs.medium = "Assamese"` in dev. Walk through every screen of every biology module. **Acceptance criterion: zero visible English words** anywhere except scientific names that are conventionally retained in English in NCERT Assamese textbooks (e.g. "DNA", "ATP", "pH"). Anything else is a bug.
17. Toggle to English mid-session — verify nothing regresses (no missing keys, no layout shift).
18. Test on real Android mobile (label sizing, font rendering).
19. Have one Assamese-medium Biology teacher review the terminology — required gate before shipping.

---

## Terminology Approach (Critical)

A pure transliteration like "এপেণ্ডিক্স" for Appendix is technically OK, but the NCERT Assamese textbook may use a different convention. Conversely, some Sanskrit-derived terms (যকৃৎ for liver, ফুসফুস for lungs, বৃক্ক for kidney) are mandatory because that's what the exam uses.

**Process:**
- For each organ/term, I'll cite the source (NCERT page reference, or "no NCERT precedent → SCERT glossary"). This goes in a `TERMINOLOGY.md` next to the data file as a translator note.
- Where multiple conventions exist (e.g. cell = কোষ universally; chloroplast = হৰিৎ লৱক vs ক্লোৰোপ্লাস্ট), I'll pick the NCERT-Assam form first and add the alternative as a parenthetical note in the description field.

**Sample non-trivial terms (sneak preview — to be reviewed by a teacher):**

| English | Proposed Assamese | NCERT/SCERT? |
|---|---|---|
| Cell | কোষ | NCERT |
| Cell wall | কোষ প্ৰাচীৰ | NCERT |
| Cell membrane / plasma membrane | কোষ পৰ্দা / প্লাজমা পৰ্দা | NCERT |
| Nucleus | কেন্দ্ৰক | NCERT |
| Chloroplast | হৰিৎ লৱক | NCERT |
| Mitochondria | মাইটকণ্ড্ৰিয়া | NCERT (transliterated) |
| Vacuole | ৰিক্তিকা | NCERT |
| Oral cavity / mouth | মুখ গহ্বৰ | NCERT |
| Salivary glands | লালা গ্ৰন্থি | NCERT |
| Pharynx | গ্ৰসনী / কণ্ঠনালী | NCERT |
| Esophagus | অন্ননালী / গ্ৰাসনালী | NCERT |
| Stomach | পাকস্থলী | NCERT |
| Liver | যকৃৎ | NCERT |
| Pancreas | অগ্ন্যাশয় | NCERT |
| Gallbladder | পিত্তথলি | NCERT |
| Small intestine | ক্ষুদ্ৰান্ত্ৰ | NCERT |
| Large intestine | বৃহদান্ত্ৰ | NCERT |
| Appendix | কৃমি আঁকশী (vermiform appendix) | NCERT |
| Heart | হৃদপিণ্ড | NCERT |
| Atrium (left/right) | অলিন্দ (বাওঁ/সোঁ) | NCERT |
| Ventricle (left/right) | নিলয় (বাওঁ/সোঁ) | NCERT |
| Valve | কপাটিকা | NCERT |
| Kidney | বৃক্ক | NCERT (preferred over কিডনি) |
| Nephron | নেফ্ৰন | Transliterated |
| Lungs | ফুসফুস | NCERT |
| Trachea | শ্বাসনালী | NCERT |
| Alveoli | বায়ুকোষ / এল্‌ভিওলাই | NCERT |

A full `TERMINOLOGY.md` (per module) will accompany Phase 2.

---

## Toggle UX

- Header pill: round-cornered, two-state: `EN` (active English) / `অ` (active Assamese).
- Default state: derived from `prefs.medium` on first lab entry.
- Override: clicking sets `localStorage["trueconcept_lab_lang"]`. Once set, it overrides `prefs.medium` for lab screens only — does **not** affect AI Mentor language, broadcast banner language, or any other surface.
- "Reset to my default" tiny link inside the toggle hover state (optional polish).

---

## What I Still Need from You (3 unanswered)

1. **Approval of the inline-bilingual approach (Gap 2 option B)** vs key-based dictionary entries. Default if you don't reply: I'll proceed with inline-bilingual (recommended).
2. **Authoritative terminology source.** If you have a school textbook PDF or a teacher who can validate the dictionary, share it. Default if you don't reply: I'll proceed with NCERT-Assam first edition + SCERT glossary and you do a final pass before merge.
3. **Acceptance bar for Phase 6.** Strict zero-English (excluding internationally retained scientific abbreviations like DNA / ATP / pH). Default: yes, strict.

The 2 scope questions and the TTS question are already locked above.

---

## Estimated Effort (rough)

| Phase | Effort |
|---|---|
| 0 — Infrastructure + scope-isolation guard | 45 min |
| 1 — Static UI strings | 1 hr |
| 2 — Data file conversion (6 files) | 6–8 hr (mostly translation review/verification) |
| 3 — SVG labels + layout tweaks | 1–2 hr |
| 4 — Journey narration text | 1 hr |
| ~~4½ — Voice / TTS~~ | **dropped** (see above) |
| 5 — Quizzes (6 files) | 2–3 hr |
| 6 — QA + teacher review | 2–3 hr |
| **Total** | **~14–19 hr** spread across reviewable commits |

---

## Open Questions

None outstanding. Scope is fixed: **virtual lab only, never outside it**, per your direction.

---

Ready when you are. Once you sign off (or edit), I'll start Phase 0.
