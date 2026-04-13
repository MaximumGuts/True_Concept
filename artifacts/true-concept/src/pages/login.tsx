import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen flex items-center justify-center bg-[hsl(222,47%,11%)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 bg-[hsl(45,93%,47%)] rounded-xl flex items-center justify-center font-serif font-bold text-[hsl(222,47%,11%)] text-xl">TC</div>
              <div className="text-left">
                <h1 className="font-serif font-bold text-2xl text-white">TRUE CONCEPT</h1>
                <p className="text-blue-300 text-sm italic">Concepts. Clarity. Confidence.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to access your learning portal</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription data-testid="text-login-error">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1.5 h-11 text-base"
                data-testid="input-username"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 h-11 text-base"
                data-testid="input-password"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[hsl(222,47%,25%)] hover:bg-[hsl(222,47%,20%)] text-white font-semibold text-base"
              disabled={loginMutation.isPending}
              data-testid="button-submit-login"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setUsername("student1"); setPassword("student123"); }}
                className="text-xs bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 text-muted-foreground transition-colors"
                data-testid="button-demo-student"
              >
                Student: student1 / student123
              </button>
              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                className="text-xs bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 text-muted-foreground transition-colors"
                data-testid="button-demo-admin"
              >
                Admin: admin / admin123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
