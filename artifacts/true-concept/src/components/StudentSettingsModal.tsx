import { useEffect, useState } from "react";
import { X, Settings as SettingsIcon, Check, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useStudentPrefs, type StudentClass, type StudentMedium } from "@/contexts/StudentPrefsContext";
import { useAuth } from "@/contexts/AuthContext";
import { clearProfileCache } from "@/lib/progress/profile-service";
import { WA_CHANNEL_URL, markChannelFollowed } from "@/lib/whatsapp-channel";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Same dev/prod base resolution used by useAiRecommendations — calls production
// Cloud Functions from dev because the Express api-server doesn't host PATCH /me.
const API_BASE = import.meta.env.DEV
  ? "https://asia-south1-true-concept-353c9.cloudfunctions.net"
  : "";

export default function StudentSettingsModal({ open, onClose }: Props) {
  const { prefs, setPrefs } = useStudentPrefs();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass]   = useState<StudentClass>(prefs?.class   ?? "Class IX");
  const [selectedMedium, setSelectedMedium] = useState<StudentMedium>(prefs?.medium ?? "English");
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync local state whenever modal opens (or prefs change while closed)
  useEffect(() => {
    if (open) {
      setSelectedClass(prefs?.class   ?? "Class IX");
      setSelectedMedium(prefs?.medium ?? "English");
      setSavedFlash(false);
      setErrorMsg(null);
    }
  }, [open, prefs?.class, prefs?.medium]);

  if (!open) return null;

  const dirty = selectedClass !== prefs?.class || selectedMedium !== prefs?.medium;

  const handleSave = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      // Persist to Firestore students/{uid} via Cloud Function. This also busts
      // the aiRecommendations cache server-side so the next AI mentor call
      // regenerates with the new medium/class.
      const url = `${API_BASE}/students/api/students/me`;
      // The students function is mounted at `students` in prod hosting and dev
      // proxy; the path inside the function matches either form.
      const fallbackUrl = `${API_BASE}/api/students/me`;
      const body = JSON.stringify({ classLevel: selectedClass, medium: selectedMedium });
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      let res = await fetch(url, { method: "PATCH", headers, body });
      if (!res.ok && res.status === 404) {
        // Hosting rewrite path
        res = await fetch(fallbackUrl, { method: "PATCH", headers, body });
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server rejected update (${res.status}): ${text.slice(0, 120)}`);
      }

      // Local pref store
      setPrefs({ class: selectedClass, medium: selectedMedium });

      // Wipe client caches so stale class/medium data doesn't linger.
      clearProfileCache();
      queryClient.removeQueries({ queryKey: ["studentProfile"] });
      // Invalidate every chapter/subject/dashboard/AI-mentor query.
      queryClient.invalidateQueries();

      setSavedFlash(true);
      setTimeout(() => {
        setSavedFlash(false);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-7 pb-4 text-center relative"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white/80" />
          </button>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-black text-2xl text-white mb-1">Settings</h2>
          <p className="text-indigo-200 text-sm font-semibold">Change your class and study medium</p>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Class selection */}
          <div>
            <p className="text-sm font-black text-gray-700 dark:text-gray-200 mb-2.5">Class</p>
            <div className="grid grid-cols-2 gap-3">
              {(["Class IX", "Class X"] as StudentClass[]).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                    selectedClass === cls
                      ? "border-orange-600 text-white shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300"
                  }`}
                  style={selectedClass === cls ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                >
                  <div className="text-2xl mb-1">{cls === "Class IX" ? "📗" : "📘"}</div>
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Medium selection */}
          <div>
            <p className="text-sm font-black text-gray-700 dark:text-gray-200 mb-2.5">Medium</p>
            <div className="grid grid-cols-2 gap-3">
              {(["Assamese", "English"] as StudentMedium[]).map((med) => (
                <button
                  key={med}
                  onClick={() => setSelectedMedium(med)}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                    selectedMedium === med
                      ? "border-emerald-500 text-white shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300"
                  }`}
                  style={selectedMedium === med ? { background: "linear-gradient(135deg, #10b981, #059669)" } : {}}
                >
                  <div className="text-2xl mb-1">{med === "Assamese" ? "🇮🇳" : "🌐"}</div>
                  {med === "Assamese" ? "অসমীয়া" : "English"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!dirty || savedFlash || saving}
            className={`w-full py-4 rounded-2xl text-white font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
              !dirty || saving ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
          >
            {savedFlash
              ? (<><Check className="w-5 h-5" /> Saved!</>)
              : saving
                ? (<><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>)
                : dirty ? "Save changes" : "No changes"}
          </button>

          {errorMsg && (
            <p className="text-center text-xs text-red-500 dark:text-red-400 font-bold">
              {errorMsg}
            </p>
          )}

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            Changing the medium updates your AI mentor language and the announcements you see.
          </p>

          {/* ── WhatsApp channel re-follow link ───────────────────────────
              For students who accidentally pressed "I've already followed"
              in the onboarding popup and now actually want to join the
              channel. Clicking this also marks the popup as followed so it
              won't re-appear, keeping the two surfaces in sync. */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <a
              href={WA_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={markChannelFollowed}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-white shadow-md hover:scale-[1.02] active:scale-100 transition-transform text-sm"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              data-testid="settings-follow-whatsapp"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Follow on WhatsApp
            </a>
            <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-2">
              Tap here if you haven&apos;t joined our channel yet — chapter notes, exam alerts, weekly MCQs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
