# Firestore content backups

Every destructive content script in `scripts/src/` writes one of these **before**
it changes anything. They are the only undo that exists — there is no staging
project and Firestore has no built-in point-in-time restore on this plan — so
they are committed to the repo rather than left loose on one laptop.

Restore with:

```bash
cd scripts
export TRUE_CONCEPT_SERVICE_KEY=$(cat "$TEMP/tc_key_b64.txt")

npx tsx src/restore-from-backup.ts ../backups/<date>/<file>.json            # dry run
APPLY=1 npx tsx src/restore-from-backup.ts ../backups/<date>/<file>.json    # write
```

The dry run reports how many documents differ from live and how many no longer
exist, so a restore is never a blind write.

## Which files need `COLLECTION=`

Most backups say which collection they came from, either in their keys
(`"notes/abc123"`) or in the documents' own fields. Two cases cannot be
inferred and the tool refuses rather than guessing:

- **notes vs qa** — identical field sets (`title`, `content`, `order`,
  `language`, `chapterId`); the one distinguishing field (`type`) is missing
  from older documents. Guessing here once misfiled a Motion *note* as a `qa`.
- **partial-field backups** — the `mcq-sets-*` files hold only `setNumber` and
  `order`, so there is nothing to fingerprint. These restore with `merge`, so
  other fields on the live document are left alone.

| File | Restore with |
|---|---|
| `advmath-c4-ex41-page7-backup.json` | *(no flag needed)* |
| `class-ix-science-notes-backup.json` | `COLLECTION=notes` |
| `class-ix-science-test-mcqs-backup.json` | *(no flag needed)* |
| `ix-science-notes-followups-backup.json` | `COLLECTION=notes` |
| `mcq-sets-backup-1rhhnleF2f3105ZR8ES6.json` | `COLLECTION=mcqs` *(partial)* |
| `mcq-sets-backup-phys-x-c01.json` | `COLLECTION=mcqs` *(partial)* |
| `motion-placeholder-note-backup.json` | `COLLECTION=notes` |
| `quad-ix-legacy-assamese-backup.json` | *(no flag needed)* |
| `quad-ix-mcq-sets-backup.json` | `COLLECTION=mcqs` *(partial)* |
| `quad-ix-stale-figure-refs-backup.json` | *(no flag needed)* |
| `stray-test-mcq-backup.json` | *(no flag needed)* |
| `tissues-seba-terms-backup.json` | `COLLECTION=notes` |
| `untagged-seed-mcqs-backup.json` | *(no flag needed)* |

## What is in each

**2026-08-04 — Quadrilaterals + Motion batch**
- `quad-ix-mcq-sets-backup.json` — MCQ set/order slots before repacking `math-ix-c08` to 15/15/15/15/4
- `quad-ix-stale-figure-refs-backup.json` — docs before 34 dead figure URLs were repointed to their `-v2` files
- `quad-ix-legacy-assamese-backup.json` — before ৰম্বছ → ৰম্বাচ and the Bengali-digit part titles were fixed
- `motion-placeholder-note-backup.json` — the stub note deleted before the 5-part Motion notes were seeded
- `mcq-sets-backup-phys-x-c01.json` + `-1rhhnleF2f3105ZR8ES6.json` — Light chapter slots before repacking to 8 × 15
- `stray-test-mcq-backup.json` — the junk `"Test"` MCQ that rendered to both mediums in `math-ix-c01`
- `class-ix-science-test-mcqs-backup.json` — the 28 placeholder MCQs deleted from Class IX science chapters

**2026-08-05 — Class IX science notes + Advance Math**
- `class-ix-science-notes-backup.json` — the placeholder note cleared before the 8-chapter seed
- `untagged-seed-mcqs-backup.json` — the last 8 MCQs with no `language` field
- `ix-science-notes-followups-backup.json` — before the SEBA terminology fix and the NCERT provenance notes
- `tissues-seba-terms-backup.json` — before সহযোগী কোষ → সংগী কোষ, নলিকা → নলীকা, চালনী → চালনি
- `advmath-c4-ex41-page7-backup.json` — before Exercise 4.1's missing page-7 content was added

## Convention for new scripts

Write backups to `../backups/<YYYY-MM-DD>/<what-it-touched>-backup.json`, prefer
the `{"collection/docId": {...}}` shape (it needs no `COLLECTION=` flag to
restore), and add a row to the table above.

`emulator-snapshot.json` is **not** here and is gitignored — it is a disposable
slice of production for the local emulator, regenerated on demand.
