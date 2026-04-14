import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

type LoginTab = "student" | "admin";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<LoginTab>("student");

  const [studentName, setStudentName] = useState("");
  const [studentError, setStudentError] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const adminLoginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        queryClient.clear();
        login(data.token, data.user as { id: number; username: string; role: "admin" | "student"; name: string });
        if (data.user.role === "admin") setLocation("/admin");
        else setLocation("/subjects");
      },
      onError: () => setAdminError("Invalid username or password. Please try again."),
    },
  });

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    if (!studentName.trim()) { setStudentError("Please enter your name."); return; }
    setStudentLoading(true);
    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: studentName.trim() }),
      });
      if (!res.ok) { setStudentError("Login failed. Please try again."); setStudentLoading(false); return; }
      const data = await res.json();
      queryClient.clear();
      login(data.token, data.user);
      setLocation("/subjects");
    } catch {
      setStudentError("Network error. Please try again.");
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    if (!username || !password) { setAdminError("Please enter both username and password."); return; }
    adminLoginMutation.mutate({ data: { username, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-hero">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>TC</div>
              <h1 className="font-black text-3xl text-white">TRUE CONCEPT</h1>
              <p className="text-purple-300 font-semibold italic text-sm">Concepts. Clarity. Confidence. 🌟</p>
            </div>
          </Link>
        </div>

        <div className="liquid-panel rounded-3xl overflow-hidden">
          {/* Tab toggle */}
          <div className="flex p-1.5 gap-1.5 bg-gray-100/60">
            <button
              onClick={() => setTab("student")}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                tab === "student" ? "text-white shadow-lg" : "text-gray-600 hover:bg-white/50"
              }`}
              style={tab === "student" ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
              data-testid="tab-student"
            >
              🎓 I'm a Student
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                tab === "admin" ? "text-white shadow-lg" : "text-gray-600 hover:bg-white/50"
              }`}
              style={tab === "admin" ? { background: "linear-gradient(135deg, #f59e0b, #f97316)" } : {}}
              data-testid="tab-admin"
            >
              🔑 Admin
            </button>
          </div>

          <div className="p-8">
            {tab === "student" ? (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">👋</div>
                  <h2 className="font-black text-2xl text-gray-900">Welcome!</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Just enter your name to start learning</p>
                </div>

                {studentError && (
                  <Alert variant="destructive" className="mb-4 rounded-2xl liquid-card border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{studentError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full h-13 px-4 rounded-2xl border border-white/60 focus:border-purple-400 focus:outline-none font-semibold transition-colors text-sm text-gray-900 assamese-input"
                      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", height: "52px" }}
                      data-testid="input-student-name"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 rounded-2xl font-black text-base text-white shadow-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                    disabled={studentLoading}
                    data-testid="button-student-enter"
                  >
                    {studentLoading ? "Entering... ⏳" : "Enter the Portal 🚀"}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                  No account needed — your name is all we need!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🔑</div>
                  <h2 className="font-black text-2xl text-gray-900">Admin Login</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Sign in to manage content</p>
                </div>

                {adminError && (
                  <Alert variant="destructive" className="mb-4 rounded-2xl liquid-card border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription data-testid="text-login-error">{adminError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full h-12 px-4 rounded-2xl border border-white/60 focus:border-amber-400 focus:outline-none font-semibold transition-colors text-sm text-gray-900"
                      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
                      data-testid="input-username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-12 px-4 rounded-2xl border border-white/60 focus:border-amber-400 focus:outline-none font-semibold transition-colors text-sm text-gray-900"
                      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
                      data-testid="input-password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 rounded-2xl font-black text-base text-white shadow-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
                    disabled={adminLoginMutation.isPending}
                    data-testid="button-submit-login"
                  >
                    {adminLoginMutation.isPending ? "Signing in... ⏳" : "Sign In 🔑"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
