import { useState } from "react";
import {
  useGetExperiments,
  useCreateExperiment,
  useUpdateExperiment,
  useDeleteExperiment,
} from "@workspace/api-client-react";
import { FlaskConical, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

const EXPERIMENT_TYPES = ["light-reflection", "light-refraction", "electric-circuit", "lens", "magnet", "custom"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const CLASS_LEVELS = ["Class IX", "Class X"];

const emptyForm = {
  title: "",
  type: "custom",
  classLevel: "Class IX",
  difficulty: "medium",
  objective: "",
  procedure: "",
  expectedResult: "",
  explanation: "",
};

export default function AdminExperimentsPage() {
  const queryClient = useQueryClient();
  const { data: experiments, isLoading } = useGetExperiments();
  const createExp = useCreateExperiment({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const updateExp = useUpdateExperiment({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });
  const deleteExp = useDeleteExperiment({ mutation: { onSuccess: () => queryClient.invalidateQueries() } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const resetForm = () => { setForm(emptyForm); setShowForm(false); setEditId(null); };

  const handleEdit = (exp: typeof experiments extends (infer T)[] | undefined ? T : never) => {
    if (!exp) return;
    const e = exp as Record<string, string>;
    setEditId(Number(e.id));
    setForm({ title: e.title, type: e.type, classLevel: e.classLevel, difficulty: e.difficulty, objective: e.objective, procedure: e.procedure, expectedResult: e.expectedResult, explanation: e.explanation });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateExp.mutate({ id: editId, data: form });
    } else {
      createExp.mutate({ data: form });
    }
    resetForm();
  };

  const F = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground" data-testid="heading-admin-experiments">Experiments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage virtual lab experiments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} data-testid="button-add-experiment">
          <Plus className="w-4 h-4 mr-1" /> Add Experiment
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4" data-testid="form-experiment">
          <h2 className="font-semibold">{editId ? "Edit Experiment" : "New Experiment"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={F("title")} required placeholder="Experiment title" className="mt-1" data-testid="input-experiment-title" />
            </div>
            <div>
              <Label>Type</Label>
              <select value={form.type} onChange={F("type")} className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm mt-1" data-testid="select-type">
                {EXPERIMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label>Class Level</Label>
              <select value={form.classLevel} onChange={F("classLevel")} className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm mt-1" data-testid="select-class-level">
                {CLASS_LEVELS.map(cl => <option key={cl} value={cl}>{cl}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Difficulty</Label>
            <select value={form.difficulty} onChange={F("difficulty")} className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm mt-1" data-testid="select-difficulty">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Label>Objective</Label>
            <Input value={form.objective} onChange={F("objective")} required placeholder="What will students learn?" className="mt-1" data-testid="input-objective" />
          </div>
          <div>
            <Label>Procedure (one step per line)</Label>
            <textarea value={form.procedure} onChange={F("procedure")} rows={4} placeholder="Step 1...&#10;Step 2..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm resize-none" data-testid="input-procedure" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Expected Result</Label>
              <textarea value={form.expectedResult} onChange={F("expectedResult")} rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm resize-none" data-testid="input-expected-result" />
            </div>
            <div>
              <Label>Scientific Explanation</Label>
              <textarea value={form.explanation} onChange={F("explanation")} rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm resize-none" data-testid="input-explanation" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" data-testid="button-submit-experiment">
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
          {experiments?.map((exp) => (
            <div key={exp.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4" data-testid={`experiment-row-${exp.id}`}>
              <div className="w-10 h-10 rounded-lg bg-[hsl(222,47%,11%)] flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5 text-[hsl(45,93%,47%)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground">{exp.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    exp.difficulty === "easy" ? "bg-green-100 text-green-700" :
                    exp.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>{exp.difficulty}</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{exp.classLevel}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{exp.objective}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => handleEdit(exp)} data-testid={`button-edit-experiment-${exp.id}`}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                {deleteConfirm === exp.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="destructive" onClick={() => { deleteExp.mutate({ id: exp.id }); setDeleteConfirm(null); }}>
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(exp.id)} data-testid={`button-delete-experiment-${exp.id}`}>
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
