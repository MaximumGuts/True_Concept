import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetChapter, getGetChapterQueryKey,
  useGetNotes, getGetNotesQueryKey, useCreateNote, useUpdateNote, useDeleteNote,
  useGetMcqs, getGetMcqsQueryKey, useCreateMcq, useUpdateMcq, useDeleteMcq,
  useGetQa, getGetQaQueryKey, useCreateQa, useUpdateQa, useDeleteQa,
  useGetVideos, getGetVideosQueryKey, useCreateVideo, useUpdateVideo, useDeleteVideo,
} from "@workspace/api-client-react";
import { ArrowLeft, Plus, Edit2, Trash2, X, Check, ChevronDown } from "lucide-react";

type ContentTab = "notes" | "mcq" | "qa" | "video";

const TABS = [
  { id: "notes" as ContentTab, label: "📝 Notes", color: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "mcq" as ContentTab, label: "🎯 MCQs", color: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { id: "qa" as ContentTab, label: "❓ Q&A", color: "linear-gradient(135deg, #10b981, #14b8a6)" },
  { id: "video" as ContentTab, label: "🎬 Videos", color: "linear-gradient(135deg, #f43f5e, #fb7185)" },
];

/* ─── Shared helpers ─────────────────────── */
function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-black text-lg text-gray-900">{title}</h3>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-sm shadow-lg hover:opacity-90 transition-opacity"
        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
        data-testid="button-add-content"
      >
        <Plus className="w-4 h-4" /> Add New
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
        <h4 className="font-black text-gray-900">{title}</h4>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      {children}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
          <Check className="w-4 h-4" /> {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl liquid-card text-gray-700 font-black text-sm hover:scale-105 transition-transform">
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-black text-gray-700 mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, required, type = "text", testId }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string; testId?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      className="w-full h-11 px-4 rounded-xl border border-white/50 focus:border-purple-400 focus:outline-none font-semibold text-sm text-gray-900 transition-colors"
      style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
      data-testid={testId} />
  );
}

function TextArea({ value, onChange, placeholder, required, rows = 3, testId }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number; testId?: string;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-white/50 focus:border-purple-400 focus:outline-none font-semibold text-sm text-gray-900 transition-colors resize-vertical"
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
          <Edit2 className="w-3.5 h-3.5 text-purple-600" />
        </button>
        {deleteConfirm ? (
          <>
            <button onClick={onConfirmDelete} className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-colors" title="Confirm delete">
              <Check className="w-3.5 h-3.5 text-red-600" />
            </button>
            <button onClick={onCancelDelete} className="p-2 rounded-xl liquid-inner hover:scale-110 transition-transform" title="Cancel">
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </>
        ) : (
          <button onClick={onDelete} className="p-2 rounded-xl liquid-inner hover:bg-red-50 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Notes Tab ──────────────────────────── */
function NotesSection({ chapterId }: { chapterId: number }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetNotesQueryKey({ chapterId }) });
  const { data: notes, isLoading } = useGetNotes({ chapterId }, { query: { queryKey: getGetNotesQueryKey({ chapterId }) } });
  const create = useCreateNote({ mutation: { onSuccess: inv } });
  const update = useUpdateNote({ mutation: { onSuccess: inv } });
  const del = useDeleteNote({ mutation: { onSuccess: inv } });

  const blank = { title: "", content: "", type: "text", order: 0 };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  const openNew = () => { setForm(blank); setEditId(null); setShowForm(true); };
  const openEdit = (n: { id: number; title: string; content: string; type: string; order: number }) => {
    setForm({ title: n.title, content: n.content, type: n.type, order: n.order });
    setEditId(n.id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(blank); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) update.mutate({ id: editId, data: { ...form, chapterId } });
    else create.mutate({ data: { ...form, chapterId } });
    cancel();
  };

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`📝 Notes (${notes?.length ?? 0})`} onAdd={openNew} />

      {showForm && (
        <FormCard title={editId ? "Edit Note" : "Add Note"} onCancel={cancel} onSubmit={handleSubmit} isPending={create.isPending || update.isPending}>
          <div>
            <FieldLabel>Title *</FieldLabel>
            <TextInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Introduction to Real Numbers" required testId="input-note-title" />
          </div>
          <div>
            <FieldLabel>Content * (supports markdown: **bold**, ## heading, - list)</FieldLabel>
            <TextArea value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} rows={8} required
              placeholder={"## Key Concepts\n\nWrite your notes here...\n\n**Important:** Use markdown formatting.\n\n- Point 1\n- Point 2"}
              testId="input-note-content" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Type</FieldLabel>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-white/50 focus:border-purple-400 focus:outline-none font-semibold text-sm text-gray-900 appearance-none"
                style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
                <option value="text">📝 Text / Markdown</option>
                <option value="pdf">📄 PDF Link</option>
                <option value="image">🖼️ Image Link</option>
              </select>
            </div>
            <div>
              <FieldLabel>Order (display sequence)</FieldLabel>
              <TextInput type="number" value={form.order} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} placeholder="0" />
            </div>
          </div>
        </FormCard>
      )}

      {notes?.length === 0 && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600">No notes yet. Click "Add New" to start.</p>
        </div>
      )}

      <div className="space-y-3">
        {notes?.map(n => (
          <ItemRow key={n.id} onEdit={() => openEdit(n)} onDelete={() => setDelConfirm(n.id)}
            deleteConfirm={delConfirm === n.id}
            onConfirmDelete={() => { del.mutate({ id: n.id }); setDelConfirm(null); }}
            onCancelDelete={() => setDelConfirm(null)}
            testId={`note-row-${n.id}`}>
            <p className="font-black text-gray-900 text-sm">{n.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-semibold line-clamp-2">{n.content.slice(0, 100)}…</p>
            <span className="mt-1 inline-block text-xs liquid-inner text-purple-700 px-2 py-0.5 rounded-full font-black">{n.type}</span>
          </ItemRow>
        ))}
      </div>
    </div>
  );
}

/* ─── MCQs Tab ───────────────────────────── */
function McqSection({ chapterId }: { chapterId: number }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetMcqsQueryKey({ chapterId }) });
  const { data: mcqs, isLoading } = useGetMcqs({ chapterId }, { query: { queryKey: getGetMcqsQueryKey({ chapterId }) } });
  const create = useCreateMcq({ mutation: { onSuccess: inv } });
  const update = useUpdateMcq({ mutation: { onSuccess: inv } });
  const del = useDeleteMcq({ mutation: { onSuccess: inv } });

  const blank = { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", order: 0 };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  const openNew = () => { setForm(blank); setEditId(null); setShowForm(true); };
  const openEdit = (m: { id: number; question: string; options: string[]; correctIndex: number; explanation: string; order: number }) => {
    setForm({ question: m.question, options: [...m.options], correctIndex: m.correctIndex, explanation: m.explanation, order: m.order });
    setEditId(m.id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(blank); };

  const setOption = (i: number, v: string) => setForm(f => {
    const opts = [...f.options]; opts[i] = v; return { ...f, options: opts };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, chapterId, options: form.options.filter(o => o.trim()) };
    if (editId) update.mutate({ id: editId, data: payload });
    else create.mutate({ data: payload });
    cancel();
  };

  const optionLabels = ["A", "B", "C", "D"];

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`🎯 MCQs (${mcqs?.length ?? 0})`} onAdd={openNew} />

      {showForm && (
        <FormCard title={editId ? "Edit MCQ" : "Add MCQ"} onCancel={cancel} onSubmit={handleSubmit} isPending={create.isPending || update.isPending}>
          <div>
            <FieldLabel>Question *</FieldLabel>
            <TextArea value={form.question} onChange={v => setForm(f => ({ ...f, question: v }))} rows={2} required
              placeholder="e.g. What is the value of π (pi) to 2 decimal places?" testId="input-mcq-question" />
          </div>

          <div>
            <FieldLabel>Answer Options * (select the correct one with the radio button)</FieldLabel>
            <div className="space-y-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={form.correctIndex === i}
                    onChange={() => setForm(f => ({ ...f, correctIndex: i }))}
                    className="w-4 h-4 accent-purple-600 shrink-0"
                    data-testid={`radio-correct-${i}`}
                  />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                    style={{ background: form.correctIndex === i ? "linear-gradient(135deg, #10b981, #14b8a6)" : "linear-gradient(135deg, #9ca3af, #6b7280)" }}>
                    {optionLabels[i]}
                  </div>
                  <input
                    type="text"
                    value={form.options[i]}
                    onChange={e => setOption(i, e.target.value)}
                    placeholder={`Option ${optionLabels[i]}`}
                    required={i < 2}
                    className="flex-1 h-10 px-3 rounded-xl border border-white/50 focus:border-purple-400 focus:outline-none font-semibold text-sm text-gray-900"
                    style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
                    data-testid={`input-option-${i}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5 font-semibold">🔘 Select the radio button next to the correct answer</p>
          </div>

          <div>
            <FieldLabel>Explanation * (shown to students after answering)</FieldLabel>
            <TextArea value={form.explanation} onChange={v => setForm(f => ({ ...f, explanation: v }))} rows={3} required
              placeholder="Explain why the correct answer is correct..." testId="input-mcq-explanation" />
          </div>

          <div>
            <FieldLabel>Order (display sequence)</FieldLabel>
            <TextInput type="number" value={form.order} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} placeholder="0" />
          </div>
        </FormCard>
      )}

      {mcqs?.length === 0 && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600">No MCQs yet. Click "Add New" to create questions.</p>
        </div>
      )}

      <div className="space-y-3">
        {mcqs?.map((m, idx) => (
          <ItemRow key={m.id} onEdit={() => openEdit(m)} onDelete={() => setDelConfirm(m.id)}
            deleteConfirm={delConfirm === m.id}
            onConfirmDelete={() => { del.mutate({ id: m.id }); setDelConfirm(null); }}
            onCancelDelete={() => setDelConfirm(null)}
            testId={`mcq-row-${m.id}`}>
            <div className="flex items-start gap-2">
              <span className="text-xs font-black text-gray-400 mt-0.5 shrink-0">Q{idx + 1}</span>
              <p className="font-black text-gray-900 text-sm leading-relaxed">{m.question}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {m.options.map((opt, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                  i === m.correctIndex
                    ? "text-emerald-800 font-black"
                    : "text-gray-500"
                }`}
                  style={i === m.correctIndex ? { background: "rgba(16,185,129,0.12)" } : { background: "rgba(0,0,0,0.04)" }}>
                  {optionLabels[i]}. {opt} {i === m.correctIndex ? "✅" : ""}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic font-medium">💡 {m.explanation.slice(0, 80)}…</p>
          </ItemRow>
        ))}
      </div>
    </div>
  );
}

/* ─── Q&A Tab ────────────────────────────── */
function QaSection({ chapterId }: { chapterId: number }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetQaQueryKey({ chapterId }) });
  const { data: qa, isLoading } = useGetQa({ chapterId }, { query: { queryKey: getGetQaQueryKey({ chapterId }) } });
  const create = useCreateQa({ mutation: { onSuccess: inv } });
  const update = useUpdateQa({ mutation: { onSuccess: inv } });
  const del = useDeleteQa({ mutation: { onSuccess: inv } });

  const blank = { question: "", answer: "", explanation: "", isImportant: false, order: 0 };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  const openNew = () => { setForm(blank); setEditId(null); setShowForm(true); };
  const openEdit = (q: { id: number; question: string; answer: string; explanation: string | null; isImportant: boolean; order: number }) => {
    setForm({ question: q.question, answer: q.answer, explanation: q.explanation ?? "", isImportant: q.isImportant, order: q.order });
    setEditId(q.id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(blank); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) update.mutate({ id: editId, data: { ...form, chapterId } });
    else create.mutate({ data: { ...form, chapterId } });
    cancel();
  };

  if (isLoading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`❓ Q&A (${qa?.length ?? 0})`} onAdd={openNew} />

      {showForm && (
        <FormCard title={editId ? "Edit Q&A" : "Add Q&A"} onCancel={cancel} onSubmit={handleSubmit} isPending={create.isPending || update.isPending}>
          <div>
            <FieldLabel>Question *</FieldLabel>
            <TextArea value={form.question} onChange={v => setForm(f => ({ ...f, question: v }))} rows={2} required
              placeholder="e.g. What is the difference between distance and displacement?" testId="input-qa-question" />
          </div>
          <div>
            <FieldLabel>Answer * (write a complete answer)</FieldLabel>
            <TextArea value={form.answer} onChange={v => setForm(f => ({ ...f, answer: v }))} rows={5} required
              placeholder="Write a detailed answer here..." testId="input-qa-answer" />
          </div>
          <div>
            <FieldLabel>Explanation (optional — extra detail or memory tip)</FieldLabel>
            <TextArea value={form.explanation} onChange={v => setForm(f => ({ ...f, explanation: v }))} rows={3}
              placeholder="Add a tip, example, or extra explanation..." testId="input-qa-explanation" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={form.isImportant}
                onChange={e => setForm(f => ({ ...f, isImportant: e.target.checked }))}
                className="w-4 h-4 accent-amber-500"
                data-testid="checkbox-important"
              />
              <label htmlFor="isImportant" className="text-sm font-black text-amber-700 cursor-pointer">⭐ Mark as Important (for exams)</label>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <FieldLabel>Order:</FieldLabel>
              <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                className="w-20 h-9 px-3 rounded-lg border border-white/50 font-semibold text-sm text-gray-900"
                style={{ background: "rgba(255,255,255,0.7)" }} />
            </div>
          </div>
        </FormCard>
      )}

      {qa?.length === 0 && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600">No Q&A yet. Click "Add New" to create questions.</p>
        </div>
      )}

      <div className="space-y-3">
        {qa?.map((q, idx) => (
          <ItemRow key={q.id} onEdit={() => openEdit(q)} onDelete={() => setDelConfirm(q.id)}
            deleteConfirm={delConfirm === q.id}
            onConfirmDelete={() => { del.mutate({ id: q.id }); setDelConfirm(null); }}
            onCancelDelete={() => setDelConfirm(null)}
            testId={`qa-row-${q.id}`}>
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xs font-black text-gray-400 mt-0.5 shrink-0">Q{idx + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-gray-900 text-sm leading-tight">{q.question}</p>
                  {q.isImportant && <span className="text-xs liquid-inner text-amber-700 px-2 py-0.5 rounded-full font-black">⭐ Important</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-medium">{q.answer}</p>
                {q.explanation && (
                  <p className="text-xs text-blue-500 mt-0.5 italic font-medium">💡 {q.explanation.slice(0, 60)}…</p>
                )}
              </div>
            </div>
          </ItemRow>
        ))}
      </div>
    </div>
  );
}

/* ─── Videos Tab ─────────────────────────── */
function VideoSection({ chapterId }: { chapterId: number }) {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: getGetVideosQueryKey({ chapterId }) });
  const { data: videos, isLoading } = useGetVideos({ chapterId }, { query: { queryKey: getGetVideosQueryKey({ chapterId }) } });
  const create = useCreateVideo({ mutation: { onSuccess: inv } });
  const update = useUpdateVideo({ mutation: { onSuccess: inv } });
  const del = useDeleteVideo({ mutation: { onSuccess: inv } });

  const blank = { title: "", youtubeUrl: "", youtubeId: "", description: "" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const [urlError, setUrlError] = useState("");

  const extractYouTubeId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return "";
  };

  const handleUrlChange = (url: string) => {
    setForm(f => ({ ...f, youtubeUrl: url }));
    setUrlError("");
    const id = extractYouTubeId(url.trim());
    if (url.trim() && !id) setUrlError("⚠️ Invalid YouTube URL. Use a youtube.com/watch?v=... or youtu.be/... link");
    else setForm(f => ({ ...f, youtubeUrl: url, youtubeId: id }));
  };

  const openNew = () => { setForm(blank); setEditId(null); setShowForm(true); setUrlError(""); };
  const openEdit = (v: { id: number; title: string; youtubeId: string; description: string }) => {
    setForm({ title: v.title, youtubeUrl: `https://youtu.be/${v.youtubeId}`, youtubeId: v.youtubeId, description: v.description });
    setEditId(v.id); setShowForm(true); setUrlError("");
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(blank); setUrlError(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.youtubeId) { setUrlError("⚠️ Please enter a valid YouTube URL"); return; }
    const payload = { chapterId, youtubeId: form.youtubeId, title: form.title, description: form.description };
    if (editId) update.mutate({ id: editId, data: payload });
    else create.mutate({ data: payload });
    cancel();
  };

  if (isLoading) return <div className="space-y-3">{[1].map(i => <div key={i} className="h-16 liquid-card rounded-2xl animate-pulse" />)}</div>;

  return (
    <div>
      <SectionHeader title={`🎬 Videos (${videos?.length ?? 0})`} onAdd={openNew} />

      {showForm && (
        <FormCard title={editId ? "Edit Video" : "Add Video"} onCancel={cancel} onSubmit={handleSubmit} isPending={create.isPending || update.isPending}>
          <div>
            <FieldLabel>Video Title *</FieldLabel>
            <TextInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} required
              placeholder="e.g. Real Numbers — Full Chapter Explanation" testId="input-video-title" />
          </div>
          <div>
            <FieldLabel>YouTube URL or Video ID *</FieldLabel>
            <TextInput value={form.youtubeUrl} onChange={handleUrlChange} required
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ  or  youtu.be/dQw4w9WgXcQ"
              testId="input-video-url" />
            {urlError && <p className="text-xs text-red-500 mt-1.5 font-bold">{urlError}</p>}
            {form.youtubeId && !urlError && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-emerald-600 font-black">✅ Video ID: {form.youtubeId}</span>
                <a href={`https://youtu.be/${form.youtubeId}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-500 underline font-bold">Preview →</a>
              </div>
            )}
          </div>
          <div>
            <FieldLabel>Description *</FieldLabel>
            <TextArea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} rows={3} required
              placeholder="Brief description of what this video covers..." testId="input-video-description" />
          </div>
        </FormCard>
      )}

      {videos?.length === 0 && !showForm && (
        <div className="liquid-card rounded-3xl text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-black text-gray-600">No videos yet. Click "Add New" to add a YouTube video.</p>
        </div>
      )}

      <div className="space-y-3">
        {videos?.map(v => (
          <ItemRow key={v.id} onEdit={() => openEdit(v)} onDelete={() => setDelConfirm(v.id)}
            deleteConfirm={delConfirm === v.id}
            onConfirmDelete={() => { del.mutate({ id: v.id }); setDelConfirm(null); }}
            onCancelDelete={() => setDelConfirm(null)}
            testId={`video-row-${v.id}`}>
            <div className="flex items-center gap-3">
              <div className="w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title}
                  className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm">{v.title}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{v.description.slice(0, 60)}…</p>
                <a href={`https://youtu.be/${v.youtubeId}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-500 font-bold hover:underline">🎬 youtu.be/{v.youtubeId}</a>
              </div>
            </div>
          </ItemRow>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────── */
export default function ChapterContentPage() {
  const [, params] = useRoute("/admin/chapters/:chapterId/content");
  const chapterId = parseInt(params?.chapterId ?? "0", 10);
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
      {/* Back */}
      <Link href="/admin/chapters">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-chapters">
          <ArrowLeft className="w-4 h-4" /> Back to Chapters
        </button>
      </Link>

      {/* Chapter Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-5 text-white mb-6">
        <div className="absolute top-0 right-0 text-[80px] opacity-10 font-black leading-none pointer-events-none">
          {chapter?.chapterNumber}
        </div>
        <div className="relative">
          <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1 rounded-full inline-block mb-2">
            Chapter {chapter?.chapterNumber} · {chapter?.classLevel} · {chapter?.subjectName}
          </span>
          <h1 className="font-black text-2xl leading-tight" data-testid="heading-chapter-content">
            📚 {chapter?.title}
          </h1>
          <p className="text-purple-300 text-sm font-semibold mt-1">Manage all content for this chapter</p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {TABS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            data-testid={`tab-${id}`}
            className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all text-center ${
              activeTab === id ? "text-white shadow-lg scale-105" : "liquid-card text-gray-600 hover:scale-105"
            }`}
            style={activeTab === id ? { background: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "notes" && <NotesSection chapterId={chapterId} />}
        {activeTab === "mcq" && <McqSection chapterId={chapterId} />}
        {activeTab === "qa" && <QaSection chapterId={chapterId} />}
        {activeTab === "video" && <VideoSection chapterId={chapterId} />}
      </div>
    </div>
  );
}
