import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGetMe } from "@workspace/api-client-react";
import { clearProfileCache } from "@/lib/progress/profile-service";

interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "student";
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("trueconcept_token"));
  const [isLoading, setIsLoading] = useState(true);

  const { data: meData, isLoading: meLoading } = useGetMe({
    query: { enabled: !!token, retry: false, queryKey: [`/api/auth/me`] },
  });

  useEffect(() => {
    if (!meLoading) {
      if (meData) {
        setUser(meData as AuthUser);
      } else if (!token) {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [meData, meLoading, token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("trueconcept_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("trueconcept_token");
    localStorage.removeItem("trueconcept_student_prefs");
    clearProfileCache();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
