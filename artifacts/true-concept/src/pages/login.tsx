import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<"student" | "admin" | null>(null);
  const [error, setError] = useState("");

  const handleStudentLogin = async () => {
    setError("");
    setLoading("student");
    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      queryClient.clear();
      login(data.token, data.user);
      setLocation("/subjects");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleAdminLogin = async () => {
    setError("");
    setLoading("admin");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin123" }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      queryClient.clear();
      login(data.token, data.user);
      setLocation("/admin");
    } catch {
      setError("Admin login failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-hero">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <div className="inline-flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>TC</div>
              <h1 className="font-black text-3xl text-white">TRUE CONCEPT</h1>
              <p className="text-purple-300 font-semibold italic text-sm">Concepts. Clarity. Confidence. 🌟</p>
            </div>
          </Link>
        </div>

        <div className="text-center mb-6">
          <p className="text-white/70 font-semibold text-base">Who are you?</p>
        </div>

        {/* Two-choice cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Student */}
          <button
            onClick={handleStudentLogin}
            disabled={!!loading}
            data-testid="button-enter-student"
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 -translate-y-6 translate-x-6"
              style={{ background: "radial-gradient(circle, white, transparent)" }} />
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="font-black text-xl text-white mb-1">Student</h2>
            <p className="text-purple-200 text-sm font-semibold">
              {loading === "student" ? "Entering... ⏳" : "Tap to enter"}
            </p>
          </button>

          {/* Admin */}
          <button
            onClick={handleAdminLogin}
            disabled={!!loading}
            data-testid="button-enter-admin"
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 -translate-y-6 translate-x-6"
              style={{ background: "radial-gradient(circle, white, transparent)" }} />
            <div className="text-5xl mb-4">🔑</div>
            <h2 className="font-black text-xl text-white mb-1">Admin</h2>
            <p className="text-amber-100 text-sm font-semibold">
              {loading === "admin" ? "Entering... ⏳" : "Tap to enter"}
            </p>
          </button>
        </div>

        {error && (
          <div className="mt-4 text-center text-sm font-semibold text-red-300 bg-red-500/10 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
