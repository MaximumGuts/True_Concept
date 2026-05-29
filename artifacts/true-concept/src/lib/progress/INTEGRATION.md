.# Wiring the Progress System Into Your Existing Pages

The progress system is **fully built** but does nothing until you call its hooks in the existing UI. This file shows exactly where to add the calls.

## 1. Track note opens & scroll

**File:** `artifacts/true-concept/src/components/NoteEditorModal.tsx` or wherever notes are rendered.

```tsx
import { useNoteProgress } from "@/hooks/useNoteProgress";

function NoteReader({ note, chapter, subject }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { manualMarkComplete } = useNoteProgress({
    noteId: note.id,
    chapterId: chapter.id,
    subjectId: subject.id,
    noteTitle: note.title,
    chapterTitle: chapter.title,
    scrollContainer: containerRef.current,
  });

  return (
    <div ref={containerRef}>
      {/* ... existing markdown render ... */}
      <button onClick={manualMarkComplete}>Mark as Read</button>
    </div>
  );
}
```

## 2. Show note status badges in the chapter notes list

**File:** `artifacts/true-concept/src/pages/chapter-detail.tsx`

```tsx
import { useChapterNotesProgress } from "@/hooks/useNoteProgress";
import NoteStatusBadge from "@/components/progress/NoteStatusBadge";

function ChapterDetailPage() {
  const { progressById } = useChapterNotesProgress(chapterId);

  return notes.map((note) => (
    <div key={note.id}>
      {note.title}
      <NoteStatusBadge
        status={progressById[note.id]?.status}
        scrollPercent={progressById[note.id]?.scrollPercent}
      />
    </div>
  ));
}
```

## 3. Record MCQ attempts when a student submits

**File:** wherever the "Submit MCQs" button lives (likely `pages/chapter-detail.tsx`)

```tsx
import { useRecordMcqAttempt } from "@/hooks/useMcqProgress";

const recordAttempt = useRecordMcqAttempt();

const handleSubmit = async () => {
  const correct = userAnswers.filter(
    (a, i) => a === questions[i].answer,
  ).length;
  const duration = Math.floor((Date.now() - startTime) / 1000);

  await recordAttempt({
    chapterId: chapter.id,
    setId: mcqSet.id,
    subjectId: subject.id,
    totalQuestions: questions.length,
    correctAnswers: correct,
    durationSec: duration,
    chapterTitle: chapter.title,
    subjectName: subject.name,
  });

  setShowResults(true);
};
```

## 4. Show MCQ score badges in the chapter MCQ list

```tsx
import { useChapterMcqProgress } from "@/hooks/useMcqProgress";
import McqStatusBadge from "@/components/progress/McqStatusBadge";
import { buildMcqSetKey } from "@/lib/progress";

const { progressByKey } = useChapterMcqProgress(chapterId);

return mcqSets.map((set) => {
  const key = buildMcqSetKey(chapterId, set.id);
  return (
    <div key={set.id}>
      {set.title}
      <McqStatusBadge progress={progressByKey[key]} />
    </div>
  );
});
```

## 5. Track experiment completions

**File:** `artifacts/true-concept/src/pages/experiment-detail.tsx`

```tsx
import { markExperimentStarted, markExperimentCompleted } from "@/lib/progress";
import { useAuth } from "@/contexts/AuthContext";

const { user } = useAuth();

// On mount:
useEffect(() => {
  if (user?.role === "student") {
    void markExperimentStarted({
      uid: user.id,
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      subjectId: experiment.subjectId,
    });
  }
}, [user, experiment.id]);

// When user clicks "Done":
const handleDone = async () => {
  if (user?.role === "student") {
    await markExperimentCompleted({
      uid: user.id,
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      subjectId: experiment.subjectId,
    });
  }
  setLocation("/virtual-lab");
};
```

## 6. Deploy Firestore security rules

```powershell
# From project root
firebase deploy --only firestore:rules
```

This activates `firestore.rules` so students can only access their own progress data.

## 7. Verify offline persistence

The `firebase.ts` setup now uses `persistentLocalCache`. Test it:

1. Build the APK
2. Open the app, read a note
3. Turn on airplane mode
4. Read another note → should still record (queued)
5. Turn off airplane mode → progress syncs automatically

## Architecture Summary

```
artifacts/true-concept/src/
├── lib/
│   ├── firebase.ts                           ← updated with offline persistence
│   └── progress/
│       ├── ARCHITECTURE.md                  ← Firestore layout docs
│       ├── INTEGRATION.md                   ← this file
│       ├── index.ts                         ← barrel export
│       ├── types.ts                         ← all TS interfaces
│       ├── paths.ts                         ← Firestore path helpers
│       ├── greeting.ts                      ← time-aware greetings
│       ├── streak.ts                        ← streak math
│       ├── profile-service.ts               ← profile fetching + cache
│       ├── notes-service.ts                 ← note progress writes
│       ├── mcq-service.ts                   ← MCQ attempt writes
│       ├── activity-service.ts              ← activity feed CRUD
│       └── experiments-service.ts           ← experiment completion
├── hooks/
│   ├── useStudentProfile.ts                 ← profile data
│   ├── useNoteProgress.ts                   ← single + chapter notes
│   ├── useMcqProgress.ts                    ← single + chapter MCQs
│   ├── useDashboardStats.ts                 ← aggregate dashboard
│   └── useRecentActivity.ts                 ← activity feed
├── components/
│   ├── HomeGreeting.tsx                     ← personalized greeting card
│   └── progress/
│       ├── NoteStatusBadge.tsx
│       ├── McqStatusBadge.tsx
│       └── ProgressBar.tsx
└── pages/
    ├── home.tsx                             ← updated with HomeGreeting
    └── dashboard.tsx                        ← updated with streak + activity
```

## Read/Write Cost (per active student per day)

- **Reads:** ~10-20 (dashboard refresh + chapter notes list lookups)
- **Writes:** ~5-15 (note opens, scroll updates throttled, MCQ submissions)

For 500 active students: well within Firestore's free 50K reads / 20K writes daily limit.
