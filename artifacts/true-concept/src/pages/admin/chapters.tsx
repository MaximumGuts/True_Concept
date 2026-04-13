import { useState } from "react";
import {
  useGetSubjects,
  useGetChapters, getGetChaptersQueryKey,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
} from "@workspace/api-client-react";
import { Plus, Edit2, Trash2, X, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

const CLASS_LEVELS = ["Class IX", "Class X"] as const;

export default function AdminChaptersPage() {
  const queryClient = useQueryClient();
  const { data: subjects } = useGetSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<"Class IX" | "Class X">("Class IX");

  const { data: chapters, isLoading } = useGetChapters(
    { subjectId: selectedSubjectId, classLevel: selectedClass },
    { query: { enabled: !!selectedSubjectId, queryKey: getGetChaptersQueryKey({ subjectId: selectedSubjectId, classLevel: selectedClass }) } }
  );

  const createChapter = useCreateChapter({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const updateChapter = useUpdateChapter({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const deleteChapter = useDeleteChapter({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", chapterNumber: 1, classLevel: "Class IX" as "Class IX" | "Class X" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ title: "", description: "", chapterNumber: 1, classLevel: selectedClass });
    setShowForm(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateChapter.mutate({ id: editId, data: form });
    } else {
      createChapter.mutate({ data: { ...form, subjectId: selectedSubjectId } });
    }
    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground" data-testid="heading-admin-chapters">Chapters</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage chapters for each subject</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            className="w-full h-10 px-3 pr-8 rounded-lg border border-border bg-card text-foreground text-sm appearance-none"
            data-testid="select-subject"
          >
            <option value={0}>Select a subject...</option>
            {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="flex gap-2">
          {CLASS_LEVELS.map(cl => (
            <button
              key={cl}
              onClick={() => setSelectedClass(cl)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedClass === cl ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
              data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cl}
            </button>
          ))}
        </div>
        {selectedSubjectId > 0 && (
          <Button onClick={() => setShowForm(!showForm)} data-testid="button-add-chapter">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && selectedSubjectId > 0 && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4" data-testid="form-chapter">
          <h2 className="font-semibold text-foreground">{editId ? "Edit Chapter" : "New Chapter"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Chapter title" className="mt-1" data-testid="input-chapter-title" />
            </div>
            <div>
              <Label>Chapter Number</Label>
              <Input type="number" min={1} value={form.chapterNumber} onChange={e => setForm(f => ({ ...f, chapterNumber: Number(e.target.value) }))} required className="mt-1" data-testid="input-chapter-number" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" className="mt-1" data-testid="input-chapter-description" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" data-testid="button-submit-chapter">
              <Check className="w-4 h-4 mr-1" /> {editId ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Chapters List */}
      {!selectedSubjectId ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Select a subject to view its chapters</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : chapters?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No chapters yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters?.map((ch) => (
            <div key={ch.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" data-testid={`chapter-row-${ch.id}`}>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                {ch.chapterNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{ch.title}</p>
                <p className="text-sm text-muted-foreground truncate">{ch.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setEditId(ch.id); setForm({ title: ch.title, description: ch.description ?? "", chapterNumber: ch.chapterNumber, classLevel: ch.classLevel as "Class IX" | "Class X" }); setShowForm(true); }}
                  data-testid={`button-edit-chapter-${ch.id}`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                {deleteConfirm === ch.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="destructive" onClick={() => { deleteChapter.mutate({ id: ch.id }); setDeleteConfirm(null); }} data-testid={`button-confirm-delete-${ch.id}`}>
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(ch.id)} data-testid={`button-delete-chapter-${ch.id}`}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
