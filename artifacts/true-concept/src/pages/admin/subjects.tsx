import { useState } from "react";
import { Link } from "wouter";
import {
  useGetSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "@workspace/api-client-react";
import { BookOpen, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminSubjectsPage() {
  const { data: subjects, isLoading } = useGetSubjects();
  const queryClient = useQueryClient();
  const createSubject = useCreateSubject({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const updateSubject = useUpdateSubject({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const deleteSubject = useDeleteSubject({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "BookOpen", color: "#2563eb", classLevels: ["Class IX", "Class X"] });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ name: "", description: "", icon: "BookOpen", color: "#2563eb", classLevels: ["Class IX", "Class X"] });
    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (s: { id: number; name: string; description: string; icon: string; color: string; classLevels: string[] }) => {
    setEditId(s.id);
    setForm({ name: s.name, description: s.description, icon: s.icon, color: s.color, classLevels: s.classLevels });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateSubject.mutate({ id: editId, data: form });
    } else {
      createSubject.mutate({ data: form });
    }
    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground" data-testid="heading-admin-subjects">Subjects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all subjects in the portal</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} data-testid="button-add-subject">
          <Plus className="w-4 h-4 mr-1" /> Add Subject
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4" data-testid="form-subject">
          <h2 className="font-semibold text-foreground">{editId ? "Edit Subject" : "New Subject"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Subject Name</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Mathematics" data-testid="input-subject-name" className="mt-1" />
            </div>
            <div>
              <Label>Color (hex)</Label>
              <Input value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#2563eb" data-testid="input-subject-color" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="Brief description" data-testid="input-subject-description" className="mt-1" />
          </div>
          <div>
            <Label className="mb-2 block">Class Levels</Label>
            <div className="flex gap-3">
              {["Class IX", "Class X"].map((cl) => (
                <label key={cl} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.classLevels.includes(cl)}
                    onChange={(e) => {
                      setForm(f => ({
                        ...f,
                        classLevels: e.target.checked ? [...f.classLevels, cl] : f.classLevels.filter(x => x !== cl)
                      }));
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{cl}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" data-testid="button-submit-subject">
              <Check className="w-4 h-4 mr-1" /> {editId ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {subjects?.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" data-testid={`subject-row-${s.id}`}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}20` }}>
                <BookOpen className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground truncate">{s.description}</p>
                <div className="flex gap-1 mt-1">
                  {s.classLevels.map(cl => (
                    <span key={cl} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{cl}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => handleEdit(s)} data-testid={`button-edit-subject-${s.id}`}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                {deleteConfirm === s.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="destructive" onClick={() => { deleteSubject.mutate({ id: s.id }); setDeleteConfirm(null); }} data-testid={`button-confirm-delete-${s.id}`}>
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(s.id)} data-testid={`button-delete-subject-${s.id}`}>
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
