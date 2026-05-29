# Student Progress Tracking — Architecture

## Firestore Layout

```
studentProgress/{uid}                          ← 1 doc per student, aggregate stats
  ├── totalNotesRead, totalMcqsAttempted, ...
  ├── currentStreak, longestStreak, lastActivityDate
  ├── lastStudiedChapterId, lastStudiedAt
  ├── subjectProgress: { [subjectId]: { ... } }   ← per-subject breakdown
  └── createdAt, updatedAt

studentProgress/{uid}/notes/{noteId}           ← 1 doc per opened note
  └── status, scrollPercent, openedAt, completedAt, readCount

studentProgress/{uid}/mcqs/{chapterId_setId}   ← 1 doc per MCQ set (NOT per attempt)
  ├── attemptCount, bestScore, lastScore
  └── recentAttempts: [last 5 attempts inline]   ← avoid extra reads

studentProgress/{uid}/activity/{autoId}        ← recent activity feed (capped at 50)
  └── type, refId, refTitle, timestamp, metadata
```

## Why This Structure

### 1. Aggregate stats in one doc = dashboard is cheap
The `StudentStats` doc has all numbers needed for the dashboard. **1 read** loads:
- All counters
- Streak info
- Last studied chapter
- Per-subject breakdown

### 2. Subcollections are loaded on demand
Per-note and per-MCQ docs are NOT read for the dashboard. They're only read when:
- Student opens a chapter → fetch all notes for that chapter (filtered by chapterId)
- Student opens MCQ history page

### 3. Stable composite IDs prevent duplicate writes
`mcqs/{chapterId_setId}` means:
- First attempt → creates the doc
- Second attempt → updates the same doc (incrementing counters)
- No "attempt explosion" — if a student takes the same set 100 times, you have 1 doc, not 100

### 4. Inline recent attempts in MCQ doc
`recentAttempts: [last 5]` lets the UI show attempt history WITHOUT a separate subcollection. Older attempts beyond 5 are just discarded — students rarely care about their 6th-most-recent attempt.

### 5. Activity feed is capped
The cleanup logic in `activity-service.ts` deletes old activity docs beyond 50. Keeps reads cheap and storage minimal.

## Read/Write Cost Analysis

| User Action | Reads | Writes |
|---|---|---|
| Open dashboard | 1 (stats) + 1 (activity query) | 0 |
| Open chapter notes list | 1 query (notes for chapter) | 0 |
| Open a note | 1 (note doc) | 1 (note doc, debounced) |
| Mark note complete | 0 | 2 (note doc + stats increment) |
| Submit MCQ set | 0 | 2 (mcq doc + stats increment) |
| Subject progress page | 1 (stats) | 0 |

**Average daily cost per active student:**
- Reads: ~10-20/day
- Writes: ~5-15/day

For 500 active students: **5,000-10,000 reads/day, 2,500-7,500 writes/day**.
Well within Firestore's free tier (50K reads, 20K writes/day).

## Security

Firestore security rules (Phase 10) enforce:
- A student can only read/write their own `studentProgress/{uid}/*` docs
- Admins can read all student progress for analytics
- No one can write to other students' progress

## Race Condition Safety

All counter updates use `FieldValue.increment(n)` which is atomic on Firestore's
servers. Two simultaneous writes (e.g. student opens 2 notes in different tabs)
will both correctly increment the counter — no lost writes.
