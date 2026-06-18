/**
 * <BookmarkButton> — outline ☆ → filled ⭐ toggle for saving a note / MCQ set /
 * MCQ / Q&A. Reads the shared BookmarksContext, so all instances stay in sync
 * and a single Firestore listener backs them.
 *
 * Renders nothing for non-students (admins / logged-out) since bookmarks are a
 * student-only feature. Stops click propagation so it never triggers the
 * surrounding card / quiz tap.
 */

import { Bookmark as BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import type { BookmarkData } from "@/lib/bookmarks/bookmark-service";

interface Props {
  data: BookmarkData;
  /** Icon size in px. Default 18. */
  size?: number;
  className?: string;
}

export default function BookmarkButton({ data, size = 18, className = "" }: Props) {
  const { user } = useAuth();
  const { isBookmarked, toggle } = useBookmarks();
  const [busy, setBusy] = useState(false);

  if (user?.role !== "student") return null;

  const on = isBookmarked(data.type, data.refId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try { await toggle(data); } finally { setBusy(false); }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      title={on ? "Remove bookmark" : "Save for later"}
      data-testid={`bookmark-${data.type}-${data.refId}`}
      className={`shrink-0 inline-flex items-center justify-center rounded-xl p-2 transition-colors ${
        on
          ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
          : "text-gray-400 dark:text-gray-500 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/10"
      } ${busy ? "opacity-60 pointer-events-none" : ""} ${className}`}
    >
      <BookmarkIcon
        style={{ width: size, height: size }}
        className={on ? "fill-current" : ""}
        strokeWidth={2.4}
      />
    </button>
  );
}
