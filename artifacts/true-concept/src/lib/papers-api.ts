/**
 * Hand-written React Query hooks for the Full Length Question Papers API.
 *
 * Talks to the `content` Cloud Function via the same `/api/...` rewrites used
 * by the rest of the app. Mirrors the orval-generated useGetNotes pattern but
 * stays out of the OpenAPI client so the generator doesn't need a re-spin.
 *
 * Surface:
 *   • useGetPaperSets({ classLevel? })          — list sets (student-side filtered)
 *   • useGetPaperSet(setId)                     — fetch one set
 *   • useGetPapers({ setId })                   — list papers within a set
 *   • useGetPaper(paperId)                      — fetch one paper
 *   • useCreatePaperSet / useUpdatePaperSet / useDeletePaperSet
 *   • useCreatePaper    / useUpdatePaper    / useDeletePaper
 */

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
} from "@tanstack/react-query";

// ── Types (mirror the schemas in lib/db/src/schema/paperSets|papers.ts) ────

export type PaperSetClassLevel = "Class IX" | "Class X" | "Both";

export interface PaperSet {
  id: string;
  name: string;
  description?: string;
  classLevel: PaperSetClassLevel;
  order: number;
  createdAt?: { _seconds: number; _nanoseconds: number } | string;
}

export interface Paper {
  id: string;
  setId: string;
  title: string;
  content: string;
  youtubeIds: string[];
  order: number;
  createdAt?: { _seconds: number; _nanoseconds: number } | string;
}

export interface CreatePaperSetBody {
  name: string;
  description?: string;
  classLevel?: PaperSetClassLevel;
  order?: number;
}

export interface UpdatePaperSetBody {
  name?: string;
  description?: string;
  classLevel?: PaperSetClassLevel;
  order?: number;
}

export interface CreatePaperBody {
  setId: string;
  title: string;
  content: string;
  youtubeIds?: string[];
  order?: number;
}

export interface UpdatePaperBody {
  setId?: string;
  title?: string;
  content?: string;
  youtubeIds?: string[];
  order?: number;
}

// ── Internal fetch wrapper ────────────────────────────────────────────────
// Reuse the same window.fetch the orval client uses — main.tsx already patches
// window.fetch in Capacitor builds so relative /api/* URLs hit Firebase Hosting.

function authHeader(): HeadersInit {
  const tok = localStorage.getItem("trueconcept_token");
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Query keys (stable cache identity) ────────────────────────────────────

export const paperSetsKey = (classLevel?: PaperSetClassLevel | "All") =>
  ["paperSets", classLevel ?? "All"] as const;

export const paperSetKey = (setId: string) => ["paperSet", setId] as const;

export const papersKey = (setId: string) => ["papers", setId] as const;

export const paperKey = (paperId: string) => ["paper", paperId] as const;

// ── Query hooks ───────────────────────────────────────────────────────────

export function useGetPaperSets(
  args: { classLevel?: PaperSetClassLevel | "All" } = {},
  options?: { enabled?: boolean }
) {
  const cls = args.classLevel ?? "All";
  return useQuery<PaperSet[]>({
    queryKey: paperSetsKey(cls),
    queryFn: () => {
      const qs = cls === "All" ? "" : `?classLevel=${encodeURIComponent(cls)}`;
      return jsonFetch<PaperSet[]>(`/api/papers/sets${qs}`);
    },
    ...options,
  } as UseQueryOptions<PaperSet[]>);
}

export function useGetPaperSet(setId: string, options?: { enabled?: boolean }) {
  return useQuery<PaperSet>({
    queryKey: paperSetKey(setId),
    queryFn: () => jsonFetch<PaperSet>(`/api/papers/sets/${setId}`),
    enabled: !!setId && (options?.enabled ?? true),
  });
}

export function useGetPapers(args: { setId: string }, options?: { enabled?: boolean }) {
  return useQuery<Paper[]>({
    queryKey: papersKey(args.setId),
    queryFn: () => jsonFetch<Paper[]>(`/api/papers?setId=${encodeURIComponent(args.setId)}`),
    enabled: !!args.setId && (options?.enabled ?? true),
  });
}

export function useGetPaper(paperId: string, options?: { enabled?: boolean }) {
  return useQuery<Paper>({
    queryKey: paperKey(paperId),
    queryFn: () => jsonFetch<Paper>(`/api/papers/${paperId}`),
    enabled: !!paperId && (options?.enabled ?? true),
  });
}

// ── Mutation hooks (admin) ────────────────────────────────────────────────

export function useCreatePaperSet() {
  return useMutation<PaperSet, Error, CreatePaperSetBody>({
    mutationFn: (body) =>
      jsonFetch<PaperSet>("/api/papers/sets", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

export function useUpdatePaperSet() {
  return useMutation<PaperSet, Error, { setId: string; data: UpdatePaperSetBody }>({
    mutationFn: ({ setId, data }) =>
      jsonFetch<PaperSet>(`/api/papers/sets/${setId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  });
}

export function useDeletePaperSet() {
  return useMutation<void, Error, { setId: string }>({
    mutationFn: ({ setId }) =>
      jsonFetch<void>(`/api/papers/sets/${setId}`, { method: "DELETE" }),
  });
}

export function useCreatePaper() {
  return useMutation<Paper, Error, CreatePaperBody>({
    mutationFn: (body) =>
      jsonFetch<Paper>("/api/papers", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

export function useUpdatePaper() {
  return useMutation<Paper, Error, { paperId: string; data: UpdatePaperBody }>({
    mutationFn: ({ paperId, data }) =>
      jsonFetch<Paper>(`/api/papers/${paperId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  });
}

export function useDeletePaper() {
  return useMutation<void, Error, { paperId: string }>({
    mutationFn: ({ paperId }) =>
      jsonFetch<void>(`/api/papers/${paperId}`, { method: "DELETE" }),
  });
}
