/**
 * BookmarksContext — one live Firestore subscription to the signed-in student's
 * bookmarks, shared by every <BookmarkButton> and the /bookmarks page.
 *
 * Centralising the subscription (instead of each button opening its own) keeps
 * reads to a single listener regardless of how many bookmark toggles are on
 * screen, and gives an instant O(1) `isBookmarked()` lookup.
 */

import {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
  type ReactNode,
} from "react";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import {
  bookmarksCol, buildBookmarkId, toggleBookmark,
  type Bookmark, type BookmarkData, type BookmarkType,
} from "@/lib/bookmarks/bookmark-service";

interface BookmarksContextValue {
  bookmarks: Bookmark[];
  ids: Set<string>;
  isLoading: boolean;
  isBookmarked: (type: BookmarkType, refId: string) => boolean;
  toggle: (data: BookmarkData) => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.role === "student" ? user.id : null;

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const q = query(bookmarksCol(uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setBookmarks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Bookmark, "id">) })));
        setIsLoading(false);
      },
      (err) => {
        console.error("[bookmarks] subscribe failed:", err);
        setIsLoading(false);
      },
    );
    return () => unsub();
  }, [uid]);

  const ids = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  const isBookmarked = useCallback(
    (type: BookmarkType, refId: string) => ids.has(buildBookmarkId(type, refId)),
    [ids],
  );

  const toggle = useCallback(
    async (data: BookmarkData) => {
      if (!uid) return;
      const on = ids.has(buildBookmarkId(data.type, data.refId));
      await toggleBookmark(uid, data, on);
    },
    [uid, ids],
  );

  const value = useMemo(
    () => ({ bookmarks, ids, isLoading, isBookmarked, toggle }),
    [bookmarks, ids, isLoading, isBookmarked, toggle],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) {
    // Safe fallback so the hook never throws if used outside the provider
    // (e.g. on a public page). Acts as a no-op empty bookmark set.
    return {
      bookmarks: [],
      ids: new Set(),
      isLoading: false,
      isBookmarked: () => false,
      toggle: async () => {},
    };
  }
  return ctx;
}
