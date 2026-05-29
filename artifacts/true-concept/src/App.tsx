import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { StudentPrefsProvider } from "@/contexts/StudentPrefsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LabTrackingRoute } from "@/lib/analytics/lab-tracking-context";
// LanguageProvider is intentionally *not* mounted at app root. It's wrapped
// around virtual-lab routes only (see VirtualLabRoute below) so the Assamese
// toggle's effect is strictly scoped to the lab and cannot leak into AI
// Mentor, broadcasts, notifications, chapter pages, or the dashboard.
import StudentPrefsModal from "@/components/StudentPrefsModal";
import Layout from "@/components/Layout";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import { useStudySession } from "@/hooks/useStudySession";

// Pages
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SubjectsPage from "@/pages/subjects";
import SubjectDetailPage from "@/pages/subject-detail";
import ChapterDetailPage from "@/pages/chapter-detail";
import VirtualLabPage from "@/pages/virtual-lab";
import ExperimentDetailPage from "@/pages/experiment-detail";
import { lazy, Suspense } from "react";
const CombinationReactionsLab = lazy(() => import("@/components/lab/sims/combination-reactions-lab"));
const DecompositionReactionsLab = lazy(() => import("@/components/lab/sims/decomposition-reactions-lab"));
const DisplacementReactionsLab = lazy(() => import("@/components/lab/sims/displacement-reactions-lab"));
const ReactiveMetalsLab = lazy(() => import("@/components/lab/sims/reactive-metals").then(m => ({ default: m.ReactiveMetalsModule })));
const MineralAcidsLab = lazy(() => import("@/components/lab/sims/mineral-acids").then(m => ({ default: m.MineralAcidsModule })));
const OrganicReactionsLab = lazy(() => import("@/components/lab/sims/organic-reactions").then(m => ({ default: m.OrganicReactionsModule })));
const AnimalCellLab = lazy(() => import("@/components/lab/sims/biology/animal-cell").then(m => ({ default: m.AnimalCellModule })));
const PlantCellLab = lazy(() => import("@/components/lab/sims/biology/plant-cell").then(m => ({ default: m.PlantCellModule })));
const DigestiveSystemLab    = lazy(() => import("@/components/lab/sims/biology/digestive-system").then(m => ({ default: m.DigestiveSystemModule })));
const RespiratorySystemLab  = lazy(() => import("@/components/lab/sims/biology/respiratory-system").then(m => ({ default: m.RespiratorySystemModule })));
const HeartCirculationLab   = lazy(() => import("@/components/lab/sims/biology/heart-circulation").then(m => ({ default: m.HeartCirculationModule })));
const ExcretorySystemLab    = lazy(() => import("@/components/lab/sims/biology/excretory-system").then(m => ({ default: m.ExcretorySystemModule })));
const DoubleDisplacementLab = lazy(() => import("@/components/lab/sims/double-displacement-lab"));
const RedoxReactionsLab = lazy(() => import("@/components/lab/sims/redox-reactions-lab"));
const IonicNeutralizationLab = lazy(() => import("@/components/lab/sims/ionic-neutralization-lab"));
const AcidMetalOxideLab = lazy(() => import("@/components/lab/sims/acid-metal-oxide-lab"));
const CarbonateReactionsLab = lazy(() => import("@/components/lab/sims/carbonate-reactions-lab"));
const IndustrialChemicalsLab = lazy(() => import("@/components/lab/sims/industrial-chemicals-lab"));
import SearchPage from "@/pages/search";
import AdminDashboard from "@/pages/admin/index";
import AdminSubjectsPage from "@/pages/admin/subjects";
import AdminChaptersPage from "@/pages/admin/chapters";
import AdminExperimentsPage from "@/pages/admin/experiments";
import AdminStudentsPage from "@/pages/admin/students";
import ChapterContentPage from "@/pages/admin/chapter-content";
import AdminPapersPage from "@/pages/admin/papers";
import AdminPaperSetDetailPage from "@/pages/admin/paper-set-detail";
import AdminSettingsPage from "@/pages/admin/settings";
import PrivacyPolicyPage from "@/pages/privacy";
import AboutPage from "@/pages/about";
import PaperSetsPage from "@/pages/paper-sets";
import PaperSetDetailPage from "@/pages/paper-set-detail";
import PaperReaderPage from "@/pages/paper-reader";
import DashboardPage from "@/pages/dashboard";
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

/**
 * Wraps a virtual-lab route with both auth protection AND the LanguageProvider
 * (Assamese/English toggle context). Used for every /virtual-lab/* path so the
 * toggle's scope is strictly limited to the lab subtree.
 */
function VirtualLabRoute({ children }: { children: React.ReactElement }) {
  return (
    <ProtectedRoute>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  useStudySession(); // initializes session tracker for signed-in students
  return (
    <Layout>
      <StudentPrefsModal />
      {user?.role === "student" && <WhatsAppPopup />}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/about" component={AboutPage} />

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
            <VirtualLabRoute>
              <VirtualLabPage />
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/physics">
          {() => (
            <VirtualLabRoute>
              <VirtualLabPage />
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/chemistry">
          {() => (
            <VirtualLabRoute>
              <VirtualLabPage />
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology">
          {() => (
            <VirtualLabRoute>
              <VirtualLabPage />
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/combination-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-combination-reactions" experimentTitle="Combination Reactions" subjectId="chemistry" subjectName="Chemistry"><CombinationReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/decomposition-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-decomposition-reactions" experimentTitle="Decomposition Reactions" subjectId="chemistry" subjectName="Chemistry"><DecompositionReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/reactive-metals">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-reactive-metals" experimentTitle="Reactions with Oxygen and Water" subjectId="chemistry" subjectName="Chemistry"><ReactiveMetalsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/mineral-acids">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-mineral-acids" experimentTitle="Reactions with Mineral Acids" subjectId="chemistry" subjectName="Chemistry"><MineralAcidsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/organic-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-organic-reactions" experimentTitle="Organic Reactions" subjectId="chemistry" subjectName="Chemistry"><OrganicReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/animal-cell">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-animal-cell" experimentTitle="Animal Cell" subjectId="biology" subjectName="Biology"><AnimalCellLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/plant-cell">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-plant-cell" experimentTitle="Plant Cell" subjectId="biology" subjectName="Biology"><PlantCellLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/respiratory-system">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-respiratory-system" experimentTitle="Human Respiratory System" subjectId="biology" subjectName="Biology"><RespiratorySystemLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/digestive-system">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-digestive-system" experimentTitle="Human Digestive System" subjectId="biology" subjectName="Biology"><DigestiveSystemLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/heart-circulation">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-heart-circulation" experimentTitle="Human Heart & Blood Circulation" subjectId="biology" subjectName="Biology"><HeartCirculationLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/biology/excretory-system">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#020B1A" }}><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="biology-excretory-system" experimentTitle="Human Excretory System & Nephron" subjectId="biology" subjectName="Biology"><ExcretorySystemLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/displacement-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-displacement-reactions" experimentTitle="Displacement Reactions" subjectId="chemistry" subjectName="Chemistry"><DisplacementReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/double-displacement">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-double-displacement" experimentTitle="Double Displacement Reactions" subjectId="chemistry" subjectName="Chemistry"><DoubleDisplacementLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/redox-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-redox-reactions" experimentTitle="Redox Reactions" subjectId="chemistry" subjectName="Chemistry"><RedoxReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/ionic-neutralization">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-ionic-neutralization" experimentTitle="Ionic Neutralization" subjectId="chemistry" subjectName="Chemistry"><IonicNeutralizationLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/acid-metal-oxide">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-acid-metal-oxide" experimentTitle="Acid + Metal Oxide" subjectId="chemistry" subjectName="Chemistry"><AcidMetalOxideLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/carbonate-reactions">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-carbonate-reactions" experimentTitle="Carbonate Reactions" subjectId="chemistry" subjectName="Chemistry"><CarbonateReactionsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/industrial-chemicals">
          {() => (
            <VirtualLabRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}><div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>}>
                <LabTrackingRoute experimentId="chem-industrial-chemicals" experimentTitle="Industrial Chemicals" subjectId="chemistry" subjectName="Chemistry"><IndustrialChemicalsLab /></LabTrackingRoute>
              </Suspense>
            </VirtualLabRoute>
          )}
        </Route>
        <Route path="/virtual-lab/:experimentId">
          {() => (
            <VirtualLabRoute>
              <ExperimentDetailPage />
            </VirtualLabRoute>
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
        <Route path="/admin/students">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminStudentsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/chapters/:chapterId/content">
          {() => (
            <ProtectedRoute adminOnly>
              <ChapterContentPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/settings">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminSettingsPage />
            </ProtectedRoute>
          )}
        </Route>

        {/* ── Full Length Question Papers (admin) ──────────────────── */}
        <Route path="/admin/papers">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminPapersPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/admin/papers/:setId">
          {() => (
            <ProtectedRoute adminOnly>
              <AdminPaperSetDetailPage />
            </ProtectedRoute>
          )}
        </Route>

        {/* ── Full Length Question Papers (student) ────────────────── */}
        <Route path="/papers">
          {() => (
            <ProtectedRoute>
              <PaperSetsPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/papers/:setId">
          {() => (
            <ProtectedRoute>
              <PaperSetDetailPage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/papers/:setId/:paperId">
          {() => (
            <ProtectedRoute>
              <PaperReaderPage />
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
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <StudentPrefsProvider>
                {/* LanguageProvider is mounted inside each virtual-lab route
                    via VirtualLabRoute — never at app root — so the Assamese
                    toggle's effect is strictly scoped to the lab. */}
                <AppRoutes />
              </StudentPrefsProvider>
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
