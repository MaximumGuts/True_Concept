/**
 * Admin: Paper Sets index — create / rename / re-order / delete the
 * top-level containers that group full-length papers (e.g. "Class X SEBA
 * Mock 2025", "Mathematics Practice").
 *
 * Click a set → /admin/papers/:setId — where individual papers are managed
 * inside the chosen set.
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, Edit2, Trash2, Check, X, ScrollText, ChevronRight,
} from "lucide-react";
import {
  useGetPaperSets, useCreatePaperSet, useUpdatePaperSet, useDeletePaperSet,
  paperSetsKey,
  type PaperSet, type PaperSetClassLevel,
} from "@/lib/papers-api";

const CLASS_OPTIONS: PaperSetClassLevel[] = ["Class IX", "Class X", "Both"];

export default function AdminPapersPage() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { data: sets, isLoading } = useGetPaperSets();
  const create = useCreatePaperSet();
  const update = useUpdatePaperSet();
  const del = useDeletePaperSet();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string; description: string; classLevel: PaperSetClassLevel; order: number;
  }>({ name: "", description: "", classLevel: "Both", order: 0 });

  const invalidate = () => qc.invalidateQueries({ queryKey: paperSetsKey() });

  const openNew = () => {
    setEditingId(null);
    setForm({ name: "", description: "", classLevel: "Both", order: 0 });
    setShowForm(true);
  };
  const openEdit = (s: PaperSet) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description ?? "",
      classLevel: s.classLevel,
      order: s.order ?? 0,
    });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      if (editingId) {
        await update.mutateAsync({ setId: editingId, data: form });
      } else {
        await create.mutateAsync(form);
      }
      invalidate();
      cancel();
    } catch (err) {
      console.error("[admin/papers] save failed:", err);
      alert(`Could not save: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  const handleDelete = async (setId: string) => {
    try {
      await del.mutateAsync({ setId });
      invalidate();
      setDelConfirm(null);
    } catch (err) {
      console.error("[admin/papers] delete failed:", err);
      alert(`Could not delete: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin/subjects")}
          className="p-2 rounded-xl liquid-card hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-gray-100">📜 Paper Sets</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Top-level groups that hold your Full Length Question Papers
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          data-testid="button-new-paper-set"
        >
          <Plus className="w-4 h-4" /> New Set
        </button>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="liquid-panel rounded-3xl p-5 mb-5 space-y-3"
          data-testid="paper-set-form"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-900 dark:text-gray-100">
              {editingId ? "Edit Set" : "Add New Set"}
            </h2>
            <button type="button" onClick={cancel} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-600 dark:text-gray-300 mb-1.5">Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Class X SEBA Mock 2025"
              className="w-full h-10 px-3 rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
              data-testid="input-set-name"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-600 dark:text-gray-300 mb-1.5">Description (optional)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. 10 mock papers based on the SEBA 2024 pattern"
              className="w-full h-10 px-3 rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-600 dark:text-gray-300 mb-1.5">Class</label>
              <select
                value={form.classLevel}
                onChange={e => setForm(f => ({ ...f, classLevel: e.target.value as PaperSetClassLevel }))}
                className="w-full h-10 px-3 rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
              >
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-600 dark:text-gray-300 mb-1.5">Display order</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) || 0 }))}
                className="w-full h-10 px-3 rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
            >
              <Check className="w-4 h-4" /> {create.isPending || update.isPending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={cancel} className="px-5 py-2 rounded-xl liquid-card text-gray-700 dark:text-gray-200 font-black text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading && (
        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-20 liquid-card rounded-2xl animate-pulse" />)}</div>
      )}

      {!isLoading && (!sets || sets.length === 0) && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-16">
          <ScrollText className="w-10 h-10 text-purple-400 mx-auto mb-2" />
          <p className="font-black text-gray-700 dark:text-gray-200 mb-1">No paper sets yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Click "New Set" to create your first group of full-length papers.
          </p>
        </div>
      )}

      {!isLoading && sets && sets.length > 0 && (
        <div className="space-y-3">
          {sets.map((s) => (
            <div key={s.id} className="liquid-card rounded-2xl p-4 flex items-start gap-3" data-testid={`paper-set-${s.id}`}>
              <Link href={`/admin/papers/${s.id}`} className="flex-1 min-w-0 cursor-pointer">
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm shrink-0"
                        style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                    {s.classLevel}
                  </span>
                  <p className="font-black text-gray-900 dark:text-gray-100 text-sm leading-tight flex-1 min-w-0">{s.name}</p>
                </div>
                {s.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 line-clamp-2">{s.description}</p>
                )}
                <p className="text-[10px] text-purple-600 dark:text-purple-300 font-black mt-1.5 flex items-center gap-0.5">
                  Manage papers <ChevronRight className="w-3 h-3" />
                </p>
              </Link>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                </button>
                {delConfirm === s.id ? (
                  <>
                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-xl bg-red-100 hover:bg-red-200" title="Confirm delete (also removes all papers)">
                      <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                    <button onClick={() => setDelConfirm(null)} className="p-2 rounded-xl liquid-inner" title="Cancel">
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDelConfirm(s.id)} className="p-2 rounded-xl liquid-inner hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete">
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
