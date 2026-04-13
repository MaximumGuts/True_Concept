import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        queryClient.clear();
        login(data.token, data.user as { id: number; username: string; role: "admin" | "student"; name: string });
        if (data.user.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      },
      onError: () => {
        setError("Invalid username or password. Please try again.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    loginMutation.mutate({ data: { username, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-hero">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>TC</div>
              <h1 className="font-black text-3xl text-white">TRUE CONCEPT</h1>
              <p className="text-purple-300 font-semibold italic">Concepts. Clarity. Confidence. 🌟</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          <div className="text-center mb-6">
            <h2 className="font-black text-2xl text-gray-900">Welcome back! 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue your learning journey</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription data-testid="text-login-error">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full h-12 px-4 rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold transition-colors text-sm"
                data-testid="input-username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold transition-colors text-sm"
                data-testid="input-password"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-black text-base text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
              disabled={loginMutation.isPending}
              data-testid="button-submit-login"
            >
              {loginMutation.isPending ? "Signing in... ⏳" : "Sign In 🚀"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wide mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setUsername("student1"); setPassword("student123"); }}
                className="text-xs bg-purple-50 hover:bg-purple-100 border-2 border-purple-100 rounded-xl px-3 py-2.5 text-purple-700 font-bold transition-colors"
                data-testid="button-demo-student"
              >
                🎓 Student Login
              </button>
              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                className="text-xs bg-amber-50 hover:bg-amber-100 border-2 border-amber-100 rounded-xl px-3 py-2.5 text-amber-700 font-bold transition-colors"
                data-testid="button-demo-admin"
              >
                🔑 Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
