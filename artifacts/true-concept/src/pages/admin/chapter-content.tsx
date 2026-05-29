import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetChapter, getGetChapterQueryKey,
  useGetNotes, getGetNotesQueryKey, useCreateNote, useUpdateNote, useDeleteNote,
  useGetMcqs, getGetMcqsQueryKey, useCreateMcq, useUpdateMcq, useDeleteMcq,
  useGetQa, getGetQaQueryKey, useCreateQa, useUpdateQa, useDeleteQa,
} from "@workspace/api-client-react";
import { ArrowLeft, Plus, Edit2, Trash2, X, Check, Youtube, ChevronDown, ChevronRight } from "lucide-react";
import NoteEditorModal from "@/components/NoteEditorModal";
import ImageUploadButton from "@/components/ImageUploadButton";

type ContentTab = "notes" | "mcq" | "qa";

const TABS = [
  { id: "notes" as ContentTab, label: "📝 Notes", color: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "mcq" as ContentTab, label: "🎯 MCQs", color: "linear-gradient(135deg, #e58359, #f08766)" },
  { id: "qa" as ContentTab, label: "❓ Q&A", color: "linear-gradient(135deg, #10b981, #14b8a6)" },
];

/* ─── Shared helpers ─────────────────────── */
function SectionHeader({ title, onAdd, addLabel = "Add New" }: { title: string; onAdd: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">{title}</h3>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-sm shadow-lg hover:opacity-90 transition-opacity"
        style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
        data-testid="button-add-content"
      >
        <Plus className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );
}

function FormCard({ children, title, onCancel, onSubmit, isPending }: {
  children: React.ReactNode; title: string; onCancel: () => void; onSubmit: (e: React.FormEvent) => void; isPending?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="liquid-panel rounded-3xl p-6 mb-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-gray-900 dark:text-gray-100">{title}</h4>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {children}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
          <Check className="w-4 h-4" /> {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl liquid-card text-gray-700 dark:text-gray-200 font-black text-sm hover:scale-105 transition-transform">
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, required, type = "text", testId }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string; testId?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      className="w-full h-11 px-4 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100 transition-colors"
      style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
      data-testid={testId} />
  );
}

function TextArea({ value, onChange, placeholder, required, rows = 3, testId }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number; testId?: string;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100 transition-colors resize-vertical"
      style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
      data-testid={testId} />
  );
}

function ItemRow({ children, onEdit, onDelete, deleteConfirm, onConfirmDelete, onCancelDelete, testId }: {
  children: React.ReactNode; onEdit: () => void; onDelete: () => void; deleteConfirm: boolean;
  onConfirmDelete: () => void; onCancelDelete: () => void; testId?: string;
}) {
  return (
    <div className="liquid-card rounded-2xl p-4 flex items-start gap-3" data-testid={testId}>
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex gap-1.5 shrink-0 mt-0.5">
        <button onClick={onEdit} className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform" title="Edit">
          <Edit2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
        </button>
        {deleteConfirm ? (
          <>
            <button onClick={onConfirmDelete} className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-colors" title="Confirm delete">
              <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </button>
            <button onClick={onCancelDelete} className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform" title="Cancel">
              <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </>
        ) : (
          <button onClick={onDelete} className="p-2 rounded-xl liquid-inner hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Notes Section (uses NoteEditorModal) ── */
function NotesSection({ chapterId }: { chapterId: string }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetNotesQueryKey({ chapterId }) });
  const { data: notes, isLoading } = useGetNotes({ chapterId }, { query: { queryKey: getGetNotesQueryKey({ chapterId }) } });
  const create = useCreateNote({ mutation: { onSuccess: inv } });
  const update = useUpdateNote({ mutation: { onSuccess: inv } });
  const del = useDeleteNote({ mutation: { onSuccess: inv } });

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<{ title: string; content: string; type: string; youtubeId: string | null; youtubeIds?: string[]; order: number } | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const openNew = () => { setEditId(null); setEditInitial(null); setModalOpen(true); };
  const openEdit = (n: any) => {
    setEditId(n.id);
    setEditInitial({
      title: n.title,
      content: n.content,
      type: n.type,
      youtubeId: n.youtubeId ?? null,
      youtubeIds: Array.isArray(n.youtubeIds) ? n.youtubeIds : undefined,
      order: n.order,
    });
    setModalOpen(true);
  };

  const handleSave = (data: { title: string; content: string; type: string; youtubeId: string; youtubeIds: string[]; order: number }) => {
    const payload = {
      ...data,
      chapterId,
      youtubeId: data.youtubeId || undefined,
      youtubeIds: data.youtubeIds && data.youtubeIds.length > 0 ? data.youtubeIds : undefined,
    } as any;
    if (editId) update.mutate({ noteId: editId, data: payload });
    else create.mutate({ data: payload });
    setModalOpen(false);
    setEditId(null);
    setEditInitial(null);
  };

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`📝 Notes (${notes?.length ?? 0})`} onAdd={openNew} addLabel="Add Note" />

      <NoteEditorModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditId(null); setEditInitial(null); }}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
        initial={editInitial ?? undefined}
        mode={editId ? "edit" : "create"}
      />

      {notes?.length === 0 && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600 dark:text-gray-300">No notes yet. Click "Add Note" to create one.</p>
        </div>
      )}

      <div className="space-y-3">
        {notes?.map(n => (
          <ItemRow key={n.id} onEdit={() => openEdit(n)} onDelete={() => setDelConfirm(n.id)}
            deleteConfirm={delConfirm === n.id}
            onConfirmDelete={() => { del.mutate({ noteId: n.id }); setDelConfirm(null); }}
            onCancelDelete={() => setDelConfirm(null)}
            testId={`note-row-${n.id}`}>
            <p className="font-black text-gray-900 dark:text-gray-100 text-sm">{n.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-semibold line-clamp-2">{n.content.slice(0, 100)}…</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs liquid-inner text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-black">{n.type}</span>
              {(n as any).youtubeId && (
                <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-black">
                  <Youtube className="w-3 h-3" /> Video attached
                </span>
              )}
            </div>
          </ItemRow>
        ))}
      </div>
    </div>
  );
}

/* ─── MCQs Section — grouped by set ─────────
   Admin sees MCQs the same way students do: a list of "Set 1 / Set 2 / Set 3"
   cards, each expandable to reveal its questions. Mirrors the student set-
   picker UX so admin's mental model matches what's shipped. */
function mcqSetNumber(m: { setNumber?: number }): number {
  const n = m.setNumber;
  return typeof n === "number" && n >= 1 ? Math.floor(n) : 1;
}

function McqSection({ chapterId }: { chapterId: string }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetMcqsQueryKey({ chapterId }) });
  const { data: mcqs, isLoading } = useGetMcqs({ chapterId }, { query: { queryKey: getGetMcqsQueryKey({ chapterId }) } });
  const create = useCreateMcq({ mutation: { onSuccess: inv } });
  const update = useUpdateMcq({ mutation: { onSuccess: inv } });
  const del = useDeleteMcq({ mutation: { onSuccess: inv } });

  const blank = { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", order: 0, setNumber: 1 };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  // Default: every set card starts expanded so admin sees questions immediately.
  // Admin can collapse to reduce clutter when there are many sets.
  const [collapsedSets, setCollapsedSets] = useState<Set<number>>(new Set());

  // Group + sort: { 1: [q1, q2, ...], 2: [...], ... }
  const setsMap = useMemo(() => {
    const m = new Map<number, typeof mcqs>();
    (mcqs ?? []).forEach((q) => {
      const n = mcqSetNumber(q as { setNumber?: number });
      if (!m.has(n)) m.set(n, []);
      m.get(n)!.push(q);
    });
    // Stable order within a set: by `order` then by id
    m.forEach((arr) => arr?.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
    return m;
  }, [mcqs]);

  const setNumbers = useMemo(
    () => Array.from(setsMap.keys()).sort((a, b) => a - b),
    [setsMap],
  );

  const nextSetNumber = setNumbers.length === 0 ? 1 : Math.max(...setNumbers) + 1;

  const openNew = (presetSet?: number) => {
    setForm({ ...blank, setNumber: presetSet ?? 1 });
    setEditId(null);
    setShowForm(true);
  };
  const openNewSet = () => openNew(nextSetNumber);
  const openEdit = (m: { id: string; question: string; options: string[]; correctIndex: number; explanation: string; order: number; setNumber?: number }) => {
    setForm({
      question: m.question, options: [...m.options], correctIndex: m.correctIndex,
      explanation: m.explanation, order: m.order,
      setNumber: m.setNumber && m.setNumber >= 1 ? m.setNumber : 1,
    });
    setEditId(m.id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(blank); };

  const toggleSet = (n: number) => {
    setCollapsedSets((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const setOption = (i: number, v: string) => setForm(f => {
    const opts = [...f.options]; opts[i] = v; return { ...f, options: opts };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, chapterId, options: form.options.filter(o => o.trim()) };
    if (editId) update.mutate({ mcqId: editId, data: payload });
    else create.mutate({ data: payload });
    cancel();
  };

  const optionLabels = ["A", "B", "C", "D"];

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">
          🎯 MCQs ({mcqs?.length ?? 0}) {setNumbers.length > 0 && <span className="text-sm font-bold text-gray-500 dark:text-gray-400">· {setNumbers.length} {setNumbers.length === 1 ? "set" : "sets"}</span>}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={openNewSet}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl liquid-card text-orange-700 dark:text-orange-300 font-black text-xs hover:scale-105 transition-transform"
            title={`Start Set ${nextSetNumber}`}
            data-testid="button-new-mcq-set"
          >
            <Plus className="w-3.5 h-3.5" /> New Set
          </button>
          <button
            onClick={() => openNew()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-sm shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
            data-testid="button-add-content"
          >
            <Plus className="w-4 h-4" /> Add MCQ
          </button>
        </div>
      </div>

      {showForm && (
        <FormCard title={editId ? "Edit MCQ" : `Add MCQ${form.setNumber ? ` to Set ${form.setNumber}` : ""}`} onCancel={cancel} onSubmit={handleSubmit} isPending={create.isPending || update.isPending}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Question *</FieldLabel>
              <ImageUploadButton compact onInsert={html => setForm(f => ({ ...f, question: f.question + html }))} />
            </div>
            <TextArea value={form.question} onChange={v => setForm(f => ({ ...f, question: v }))} rows={2} required
              placeholder="e.g. What is the value of π (pi) to 2 decimal places?" testId="input-mcq-question" />
          </div>

          <div>
            <FieldLabel>Answer Options * — select the correct answer with the radio button</FieldLabel>
            <div className="space-y-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <input type="radio" name="correctIndex" checked={form.correctIndex === i}
                    onChange={() => setForm(f => ({ ...f, correctIndex: i }))}
                    className="w-4 h-4 accent-orange-600 shrink-0" data-testid={`radio-correct-${i}`} />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                    style={{ background: form.correctIndex === i ? "linear-gradient(135deg, #10b981, #14b8a6)" : "linear-gradient(135deg, #9ca3af, #6b7280)" }}>
                    {optionLabels[i]}
                  </div>
                  <input type="text" value={form.options[i]} onChange={e => setOption(i, e.target.value)}
                    placeholder={`Option ${optionLabels[i]}`} required={i < 2}
                    className="flex-1 h-10 px-3 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100"
                    style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
                    data-testid={`input-option-${i}`} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-semibold">🔘 Select the radio button next to the correct answer</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Explanation * (shown after answering)</FieldLabel>
              <ImageUploadButton compact onInsert={html => setForm(f => ({ ...f, explanation: f.explanation + html }))} />
            </div>
            <TextArea value={form.explanation} onChange={v => setForm(f => ({ ...f, explanation: v }))} rows={3} required
              placeholder="Explain why the correct answer is correct..." testId="input-mcq-explanation" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Set Number</FieldLabel>
              <TextInput type="number" value={form.setNumber}
                onChange={v => setForm(f => ({ ...f, setNumber: Math.max(1, Number(v) || 1) }))}
                placeholder="1" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-semibold">
                Groups MCQs into tests. Set 1, Set 2, etc. Defaults to 1.
              </p>
            </div>
            <div>
              <FieldLabel>Order (within set)</FieldLabel>
              <TextInput type="number" value={form.order} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} placeholder="0" />
            </div>
          </div>
        </FormCard>
      )}

      {mcqs?.length === 0 && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600 dark:text-gray-300">No MCQs yet. Click "Add MCQ" to create your first question.</p>
        </div>
      )}

      <div className="space-y-4">
        {setNumbers.map((setNum) => {
          const setMcqs = setsMap.get(setNum) ?? [];
          const isCollapsed = collapsedSets.has(setNum);
          return (
            <div
              key={setNum}
              className="liquid-panel rounded-3xl overflow-hidden"
              data-testid={`mcq-set-${setNum}`}
            >
              {/* Set header — click anywhere to toggle expand/collapse */}
              <button
                type="button"
                onClick={() => toggleSet(setNum)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
                data-testid={`mcq-set-header-${setNum}`}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #e58359, #f08766)" }}
                >
                  S{setNum}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 dark:text-gray-100 text-base leading-tight">Set {setNum}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                    {setMcqs.length} {setMcqs.length === 1 ? "question" : "questions"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openNew(setNum); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl liquid-card text-orange-700 dark:text-orange-300 font-black text-xs hover:scale-105 transition-transform shrink-0"
                  title={`Add an MCQ to Set ${setNum}`}
                  data-testid={`button-add-to-set-${setNum}`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  {isCollapsed
                    ? <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                </div>
              </button>

              {/* Expanded content — the actual MCQ cards */}
              {!isCollapsed && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/10 dark:border-white/5">
                  {setMcqs.map((m, idx) => (
                    <div
                      key={m.id}
                      className="liquid-card rounded-2xl p-4"
                      data-testid={`mcq-row-${m.id}`}
                    >
                      {/* Question + Set chip + per-question actions */}
                      <div className="flex items-start gap-2 mb-3 flex-wrap">
                        <span className="text-xs font-black text-gray-500 dark:text-gray-400 mt-0.5 shrink-0">
                          Q{idx + 1}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm shrink-0"
                          style={{ background: "linear-gradient(135deg, #e58359, #f08766)" }}>
                          Set {setNum}
                        </span>
                        <p className="font-black text-gray-900 dark:text-gray-100 text-sm leading-relaxed flex-1 min-w-0">
                          {m.question}
                        </p>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => openEdit(m)}
                            className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                          </button>
                          {delConfirm === m.id ? (
                            <>
                              <button
                                onClick={() => { del.mutate({ mcqId: m.id }); setDelConfirm(null); }}
                                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-colors"
                                title="Confirm delete"
                              >
                                <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                              <button
                                onClick={() => setDelConfirm(null)}
                                className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDelConfirm(m.id)}
                              className="p-2 rounded-xl liquid-inner hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Options grid — correct answer highlighted in emerald */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {m.options.map((opt, i) => (
                          <span
                            key={i}
                            className={`text-xs px-3 py-2 rounded-xl font-semibold ${
                              i === m.correctIndex
                                ? "text-emerald-800 dark:text-emerald-300 font-black"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                            style={
                              i === m.correctIndex
                                ? { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)" }
                                : { background: "rgba(0,0,0,0.04)" }
                            }
                          >
                            {optionLabels[i]}. {opt} {i === m.correctIndex ? "✅" : ""}
                          </span>
                        ))}
                      </div>

                      {/* Explanation snippet */}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic font-medium">
                        💡 {m.explanation.slice(0, 100)}…
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Q&A Section (note-style bundles) ─────
   One Q&A doc = one markdown bundle (like a note). Admin packs multiple
   Q+A pairs into the body using markdown headings, plus optional videos.
   The student-facing QaTab renders title + markdown body — mirrors notes. */
function QaSection({ chapterId }: { chapterId: string }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetQaQueryKey({ chapterId }) });
  const { data: qa, isLoading } = useGetQa({ chapterId }, { query: { queryKey: getGetQaQueryKey({ chapterId }) } });
  const create = useCreateQa({ mutation: { onSuccess: inv } });
  const update = useUpdateQa({ mutation: { onSuccess: inv } });
  const del = useDeleteQa({ mutation: { onSuccess: inv } });

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<{ title: string; content: string; type: string; youtubeId: string | null; youtubeIds?: string[]; order: number } | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const openNew = () => { setEditId(null); setEditInitial(null); setModalOpen(true); };
  const openEdit = (q: any) => {
    const ids: string[] = (Array.isArray(q.youtubeIds) && q.youtubeIds.length > 0)
      ? q.youtubeIds
      : (q.youtubeId ? [q.youtubeId] : []);
    setEditId(q.id);
    setEditInitial({
      title: q.title ?? q.question ?? "",
      content: q.content ?? q.answer ?? "",
      type: "text",
      youtubeId: ids[0] ?? null,
      youtubeIds: ids,
      order: q.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = (data: { title: string; content: string; type: string; youtubeId: string; youtubeIds: string[]; order: number }) => {
    const youtubeIds = (data.youtubeIds ?? []).filter(Boolean);
    const payload = {
      chapterId,
      title: data.title,
      content: data.content,
      youtubeId: youtubeIds[0] || undefined,
      youtubeIds: youtubeIds.length > 0 ? youtubeIds : undefined,
      order: data.order,
    } as any;
    if (editId) update.mutate({ qaId: editId, data: payload });
    else create.mutate({ data: payload });
    setModalOpen(false);
    setEditId(null);
    setEditInitial(null);
  };

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`❓ Q&A (${qa?.length ?? 0})`} onAdd={openNew} addLabel="Add Q&A" />

      <NoteEditorModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditId(null); setEditInitial(null); }}
        onSave={handleSave}
        isPending={create.isPending || update.isPending}
        initial={editInitial ?? undefined}
        mode={editId ? "edit" : "create"}
      />

      {qa?.length === 0 && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600 dark:text-gray-300">No Q&A yet. Click "Add Q&A" to create a bundle.</p>
        </div>
      )}

      <div className="space-y-3">
        {qa?.map((q: any) => {
          const title = q.title ?? q.question ?? "(untitled)";
          const body = q.content ?? q.answer ?? "";
          const ytIds: string[] = (Array.isArray(q.youtubeIds) && q.youtubeIds.length > 0)
            ? q.youtubeIds
            : (q.youtubeId ? [q.youtubeId] : []);
          return (
            <ItemRow key={q.id} onEdit={() => openEdit(q)} onDelete={() => setDelConfirm(q.id)}
              deleteConfirm={delConfirm === q.id}
              onConfirmDelete={() => { del.mutate({ qaId: q.id }); setDelConfirm(null); }}
              onCancelDelete={() => setDelConfirm(null)}
              testId={`qa-row-${q.id}`}>
              <p className="font-black text-gray-900 dark:text-gray-100 text-sm">{title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-semibold line-clamp-2">
                {body.slice(0, 100)}{body.length > 100 ? "…" : ""}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {ytIds.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-black">
                    <Youtube className="w-3 h-3" />
                    {ytIds.length > 1 ? `${ytIds.length} Videos` : "Video"}
                  </span>
                )}
                {q.isImportant && <span className="text-xs liquid-inner text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-black">⭐ Important</span>}
              </div>
            </ItemRow>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────── */
export default function ChapterContentPage() {
  const [, params] = useRoute("/admin/chapters/:chapterId/content");
  const chapterId = params?.chapterId ?? "";
  const [activeTab, setActiveTab] = useState<ContentTab>("notes");

  const { data: chapter, isLoading } = useGetChapter(chapterId, {
    query: { enabled: !!chapterId, queryKey: getGetChapterQueryKey(chapterId) },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse blob-bg space-y-4">
        <div className="h-6 liquid-card rounded-xl w-24" />
        <div className="h-20 liquid-dark rounded-3xl" />
        <div className="h-12 liquid-card rounded-2xl" />
        <div className="h-64 liquid-card rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 blob-bg">
      <Link href="/admin/chapters">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 mb-6 transition-colors" data-testid="button-back-chapters">
          <ArrowLeft className="w-4 h-4" /> Back to Chapters
        </button>
      </Link>

      <div className="relative overflow-hidden liquid-dark rounded-3xl p-5 text-white mb-6">
        <div className="absolute top-0 right-0 text-[80px] opacity-10 font-black leading-none pointer-events-none">
          {chapter?.chapterNumber}
        </div>
        <div className="relative">
          <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1 rounded-full inline-block mb-2">
            Chapter {chapter?.chapterNumber} · {chapter?.classLevel}
          </span>
          <h1 className="font-black text-2xl leading-tight" data-testid="heading-chapter-content">
            📚 {chapter?.title}
          </h1>
          <p className="text-orange-300 text-sm font-semibold mt-1">
            Notes open a full editor · Q&amp;A supports math formulas · Attach YouTube per note/Q&amp;A
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {TABS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all text-center ${
              activeTab === id ? "text-white shadow-lg scale-105" : "liquid-card text-gray-600 dark:text-gray-300 hover:scale-105"
            }`}
            style={activeTab === id ? { background: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "notes" && <NotesSection chapterId={chapterId} />}
        {activeTab === "mcq" && <McqSection chapterId={chapterId} />}
        {activeTab === "qa" && <QaSection chapterId={chapterId} />}
      </div>
    </div>
  );
}
