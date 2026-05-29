/**
 * Admin: inside a single Paper Set — manage the papers themselves.
 *
 * Reuses NoteEditorModal so admin uses the same markdown editor + YouTube
 * attachment UI they already know from notes. A paper is conceptually
 * "a note that belongs to a paperSet" — same content model, different
 * Firestore collection + no chapterId.
 */

import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Edit2, Trash2, Check, X, ScrollText, Youtube } from "lucide-react";
import {
  useGetPaperSet, useGetPapers,
  useCreatePaper, useUpdatePaper, useDeletePaper,
  papersKey,
  type Paper,
} from "@/lib/papers-api";
import NoteEditorModal from "@/components/NoteEditorModal";

export default function AdminPaperSetDetailPage() {
  const [, params] = useRoute("/admin/papers/:setId");
  const [, setLocation] = useLocation();
  const setId = params?.setId ?? "";
  const qc = useQueryClient();

  const { data: set, isLoading: setLoading } = useGetPaperSet(setId);
  const { data: papers, isLoading: papersLoading } = useGetPapers({ setId });
  const create = useCreatePaper();
  const update = useUpdatePaper();
  const del = useDeletePaper();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<{
    title: string; content: string; type: string;
    youtubeId?: string | null; youtubeIds?: string[]; order: number;
  } | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: papersKey(setId) });

  const openNew = () => {
    setEditId(null);
    setEditInitial(null);
    setModalOpen(true);
  };

  const openEdit = (p: Paper) => {
    setEditId(p.id);
    setEditInitial({
      title: p.title,
      content: p.content,
      type: "text",                       // unused for papers; NoteEditorModal needs the field
      youtubeId: p.youtubeIds?.[0] ?? null,
      youtubeIds: p.youtubeIds ?? [],
      order: p.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (data: {
    title: string; content: string; type: string;
    youtubeId: string; youtubeIds: string[]; order: number;
  }) => {
    const youtubeIds = (data.youtubeIds ?? []).filter(Boolean);
    try {
      if (editId) {
        await update.mutateAsync({
          paperId: editId,
          data: {
            setId,
            title: data.title,
            content: data.content,
            youtubeIds,
            order: data.order,
          },
        });
      } else {
        await create.mutateAsync({
          setId,
          title: data.title,
          content: data.content,
          youtubeIds,
          order: data.order,
        });
      }
      invalidate();
      setModalOpen(false);
      setEditId(null);
      setEditInitial(null);
    } catch (err) {
      console.error("[admin/paper] save failed:", err);
      alert(`Could not save: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  const handleDelete = async (paperId: string) => {
    try {
      await del.mutateAsync({ paperId });
      invalidate();
      setDelConfirm(null);
    } catch (err) {
      console.error("[admin/paper] delete failed:", err);
      alert(`Could not delete: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  if (setLoading) return <div className="max-w-3xl mx-auto p-6"><div className="h-20 liquid-card rounded-2xl animate-pulse" /></div>;
  if (!set) return (
    <div className="max-w-3xl mx-auto p-6">
      <p className="text-center text-red-500 font-bold">Paper set not found.</p>
      <button onClick={() => setLocation("/admin/papers")} className="mt-4 mx-auto block text-purple-600 dark:text-purple-300 font-black text-sm">
        ← Back to all sets
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin/papers")}
          className="p-2 rounded-xl liquid-card hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-wider">📜 {set.classLevel} · Paper Set</p>
          <h1 className="font-black text-xl text-gray-900 dark:text-gray-100 leading-tight">{set.name}</h1>
          {set.description && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{set.description}</p>}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          data-testid="button-new-paper"
        >
          <Plus className="w-4 h-4" /> New Paper
        </button>
      </div>

      <NoteEditorModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditId(null); setEditInitial(null); }}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
        initial={editInitial ?? undefined}
        mode={editId ? "edit" : "create"}
      />

      {/* Empty */}
      {papersLoading && (
        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>
      )}

      {!papersLoading && (!papers || papers.length === 0) && (
        <div className="liquid-card rounded-3xl text-center py-16">
          <ScrollText className="w-10 h-10 text-purple-400 mx-auto mb-2" />
          <p className="font-black text-gray-700 dark:text-gray-200 mb-1">No papers in this set yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Click "New Paper" to add your first one (e.g. "Paper 1").
          </p>
        </div>
      )}

      {/* Papers list */}
      {!papersLoading && papers && papers.length > 0 && (
        <div className="space-y-3">
          {papers.map((p, idx) => (
            <div key={p.id} className="liquid-card rounded-2xl p-4 flex items-start gap-3" data-testid={`paper-row-${p.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-0.5 shrink-0">#{idx + 1}</span>
                  <p className="font-black text-gray-900 dark:text-gray-100 text-sm leading-tight flex-1 min-w-0">{p.title}</p>
                  {p.youtubeIds && p.youtubeIds.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10">
                      <Youtube className="w-3 h-3" />
                      {p.youtubeIds.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-medium">{p.content.slice(0, 140)}…</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                </button>
                {delConfirm === p.id ? (
                  <>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-red-100 hover:bg-red-200" title="Confirm delete">
                      <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                    <button onClick={() => setDelConfirm(null)} className="p-2 rounded-xl liquid-inner" title="Cancel">
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDelConfirm(p.id)} className="p-2 rounded-xl liquid-inner hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
