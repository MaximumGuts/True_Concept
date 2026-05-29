import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Settings, Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSettingsPage() {
  const { user, login } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(user?.username ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedUsername = newUsername.trim();
    const usernameChanged = trimmedUsername.length > 0 && trimmedUsername !== user?.username;
    const passwordChanged = newPassword.length > 0;
    if (!usernameChanged && !passwordChanged) {
      setError("Change at least one field — username or password.");
      return;
    }
    if (passwordChanged && newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("trueconcept_token");
      const res = await fetch("/api/auth/credentials", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: usernameChanged ? trimmedUsername : undefined,
          newPassword: passwordChanged ? newPassword : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Failed to update credentials");
        return;
      }
      // Refresh auth state with the new token (the JWT embeds the username,
      // so the old token would still report the old username on next /me).
      login(data.token, data.user);
      setSuccess("Credentials updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 blob-bg space-y-6">
      <Link href="/admin">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors" data-testid="button-back-admin">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </button>
      </Link>

      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #b85535 0%, #da6b45 60%, #f5a584 100%)" }}
      >
        <div className="absolute top-2 right-4 text-[110px] opacity-15 leading-none pointer-events-none select-none">⚙️</div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
            <Settings className="w-3 h-3" /> Admin Settings
          </span>
          <h1 className="font-black text-2xl sm:text-3xl mb-1 tracking-tight">Change Credentials</h1>
          <p className="text-white/90 font-medium text-sm">
            Update your admin username and password. You'll stay signed in.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="liquid-panel rounded-3xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1.5">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 pr-11 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
              data-testid="input-current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-white/40"
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1.5">
            New Username
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="username"
            placeholder="Leave unchanged to keep current username"
            className="w-full h-11 px-4 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
            data-testid="input-new-username"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
            Current: <span className="text-orange-700 dark:text-orange-300">{user?.username}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1.5">
            New Password (optional)
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Leave blank to keep current password"
              className="w-full h-11 px-4 pr-11 rounded-xl border border-white/50 dark:border-white/10 focus:border-orange-400 focus:outline-none font-semibold text-sm text-gray-900 dark:text-gray-100"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
              data-testid="input-new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-white/40"
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
            Min. 6 characters.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm font-black">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800 px-4 py-3 text-sm font-black">
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-black text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
          data-testid="button-save-credentials"
        >
          <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
