import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

// Pages
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import SubjectsPage from "@/pages/subjects";
import SubjectDetailPage from "@/pages/subject-detail";
import ChapterDetailPage from "@/pages/chapter-detail";
import VirtualLabPage from "@/pages/virtual-lab";
import ExperimentDetailPage from "@/pages/experiment-detail";
import SearchPage from "@/pages/search";
import AdminDashboard from "@/pages/admin/index";
import AdminSubjectsPage from "@/pages/admin/subjects";
import AdminChaptersPage from "@/pages/admin/chapters";
import AdminExperimentsPage from "@/pages/admin/experiments";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactElement; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user.role !== "admin") return <Redirect to="/dashboard" />;
  if (!adminOnly && user.role === "admin") return <Redirect to="/admin" />;
  return children;
}

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />

        <Route path="/subjects">
          {() => (
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/subjects/:subjectId">
          {() => (
            <ProtectedRoute>
              <SubjectDetailPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/chapters/:chapterId">
          {() => (
            <ProtectedRoute>
              <ChapterDetailPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/dashboard">
          {() => (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/virtual-lab">
          {() => (
            <ProtectedRoute>
              <VirtualLabPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/virtual-lab/:experimentId">
          {() => (
            <ProtectedRoute>
              <ExperimentDetailPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/search">
          {() => (
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/admin">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/subjects">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminSubjectsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/chapters">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminChaptersPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/experiments">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminExperimentsPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
