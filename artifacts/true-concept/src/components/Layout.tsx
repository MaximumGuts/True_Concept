import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  BookOpen, FlaskConical, LogOut, Menu, Search, X, ChevronRight,
  LayoutDashboard, Users, Home, Settings, Trophy, Bookmark,
} from "lucide-react";
import { adManager } from "@/ads/ad-manager";
import ThemeToggle from "@/components/ThemeToggle";
import XPToastDisplay from "@/components/gamification/XPToastDisplay";
import XPCelebrationOverlay from "@/components/gamification/XPCelebrationOverlay";
import RecommendationPopup from "@/components/RecommendationPopup";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { useGamification } from "@/hooks/useGamification";
import { AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import StudentSettingsModal from "@/components/StudentSettingsModal";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navLinks = user?.role === "admin"
    ? [
        { href: "/admin",           label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/subjects",  label: "Subjects",  icon: BookOpen },
        { href: "/admin/chapters",  label: "Chapters",  icon: BookOpen },
        { href: "/admin/experiments", label: "Lab",     icon: FlaskConical },
        { href: "/admin/students",  label: "Students",  icon: Users },
      ]
    : [
        { href: "/dashboard",   label: "Home",     icon: Home },
        { href: "/subjects",    label: "Subjects", icon: BookOpen },
        { href: "/virtual-lab", label: "Lab",      icon: FlaskConical },
        { href: "/practice",    label: "Practice", icon: Trophy },
      ];

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  // ── Bottom-pill visibility ──────────────────────────────────────────────────
  const hideBottomNav =
    /^\/subjects\/[^/]+/.test(location) ||
    /^\/chapters\/[^/]+/.test(location) ||
    /^\/virtual-lab\/[^/]+/.test(location) ||
    /^\/papers(\/|$)/.test(location) ||
    /^\/practice(\/|$)/.test(location);

  const isStrictMockExam =
    /^\/practice\/mock-exam/.test(location) &&
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("mode") === "strict"
      : false);

  const showBanner = hideBottomNav && !isStrictMockExam;

  const isStudent = user?.role === "student";
  useEffect(() => {
    if (isStudent && showBanner) void adManager.showAdaptiveBanner();
    else void adManager.hideBanner();
  }, [isStudent, showBanner]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-2xl shadow-xl relative"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))",
          background: "var(--header-bg)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "var(--header-glow-top)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: "var(--header-glow-bottom)" }} />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16 gap-2">

            {/* ── LEFT: hamburger (mobile) + logo ──────────────────── */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Hamburger — mobile only, always leftmost */}
              {user && (
                <button
                  className="md:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              <Link href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"}>
                <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shrink-0"
                    style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
                  >TC</div>
                  <span
                    className="font-black text-lg tracking-tight hidden sm:inline"
                    style={{
                      background: "linear-gradient(135deg, #da6b45, #fbbf24)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}
                  >TRUE CONCEPT</span>
                </div>
              </Link>
            </div>

            {/* ── CENTER: desktop nav pill ──────────────────────────── */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 liquid-inner rounded-2xl p-1 mx-auto">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <button
                      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all duration-200 ${
                        isActive(href)
                          ? "text-white shadow-md"
                          : "text-gray-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-white/50 dark:hover:bg-white/10"
                      }`}
                      style={isActive(href) ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  </Link>
                ))}
              </nav>
            )}

            {/* ── RIGHT: action icons ───────────────────────────────── */}
            <div className="flex items-center gap-0.5 ml-auto">

              {/* Student icons: search, bookmark, notification (all screen sizes) */}
              {user?.role === "student" && (
                <>
                  <Link href="/search">
                    <button
                      title="Search"
                      data-testid="button-header-search"
                      className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <Search className="w-[18px] h-[18px]" />
                    </button>
                  </Link>
                  <Link href="/bookmarks">
                    <button
                      title="Bookmarks"
                      data-testid="button-header-bookmarks"
                      className={`p-2 rounded-xl transition-colors ${
                        isActive("/bookmarks")
                          ? "text-amber-500"
                          : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <Bookmark className={`w-[18px] h-[18px] ${isActive("/bookmarks") ? "fill-current" : ""}`} />
                    </button>
                  </Link>
                  <NotificationBell />
                </>
              )}

              {/* Desktop-only extras: theme toggle, settings, logout */}
              <div className="hidden md:flex items-center gap-0.5 ml-1">
                <ThemeToggle />
                {user?.role === "student" && (
                  <button
                    onClick={() => setSettingsOpen(true)}
                    data-testid="button-settings"
                    title="Settings"
                    className="p-2 rounded-xl text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                {user && (
                  <button
                    onClick={logout}
                    data-testid="button-logout"
                    title="Logout"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                )}
                {!user && (
                  <Link href="/login">
                    <button
                      className="font-black text-sm px-5 py-2 rounded-xl text-white shadow-lg hover:opacity-90 transition-opacity"
                      data-testid="button-login-nav"
                      style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
                    >Login</button>
                  </Link>
                )}
              </div>

              {/* Mobile: login button if not authenticated */}
              {!user && (
                <Link href="/login">
                  <button
                    className="md:hidden font-black text-sm px-4 py-1.5 rounded-xl text-white shadow-lg hover:opacity-90 transition-opacity"
                    data-testid="button-login-nav"
                    style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
                  >Login</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile slide-down menu ──────────────────────────────────────── */}
        {user && mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 space-y-1 backdrop-blur-xl
            bg-white/95 dark:bg-[rgba(20,14,48,0.97)]
            border-t border-gray-200 dark:border-white/6">
            {/* Nav links */}
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={closeMenu}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                    isActive(href)
                      ? "text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                  style={isActive(href) ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                </button>
              </Link>
            ))}

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1.5" />

            {/* Theme toggle row */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-gray-700 dark:text-gray-300">
              <span className="text-sm font-black flex-1">Theme</span>
              <ThemeToggle />
            </div>

            {/* Settings (students) */}
            {user.role === "student" && (
              <button
                onClick={() => { closeMenu(); setSettingsOpen(true); }}
                data-testid="mobile-button-settings"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
                <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
              </button>
            )}

            {/* Logout */}
            <button
              onClick={() => { closeMenu(); logout(); }}
              data-testid="mobile-button-logout"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
              <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
            </button>
          </div>
        )}
      </header>

      {user?.role === "student" && (
        <StudentSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full mt-8 mb-2 px-4 text-center text-[11px] text-gray-500 dark:text-gray-500 font-semibold opacity-80">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span>© {new Date().getFullYear()} TRUE CONCEPT</span>
          <span aria-hidden>·</span>
          <Link href="/about"><a className="hover:text-orange-700 dark:hover:text-orange-300 transition-colors">About</a></Link>
          <span aria-hidden>·</span>
          <Link href="/privacy"><a className="hover:text-orange-700 dark:hover:text-orange-300 transition-colors">Privacy Policy</a></Link>
        </div>
      </footer>

      {/* ── Mobile bottom nav — floating pill ─────────────────────────────
          Uses inset-x-0 + justify-center instead of left-1/2 + translateX so
          position:fixed is not broken by any transform on the nav element itself
          (a known WebView quirk with transform + fixed together).            */}
      {user?.role === "student" && !hideBottomNav && (
        <nav
          className="md:hidden fixed inset-x-0 z-40 flex justify-center pointer-events-none"
          style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)` }}
          data-testid="mobile-bottom-nav"
        >
          <div
            className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full shadow-2xl"
            style={{
              background: "var(--bottom-nav-bg)",
              border: "1px solid var(--bottom-nav-border)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(218,107,69,0.15)",
            }}
          >
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href}>
                  <button
                    data-testid={`bottom-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300 ${
                      active
                        ? "text-white shadow-lg scale-105"
                        : "text-gray-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-300"
                    }`}
                    style={active ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                  >
                    <Icon className={`shrink-0 transition-all ${active ? "w-4 h-4" : "w-5 h-5"}`} />
                    {active && <span className="whitespace-nowrap">{label}</span>}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Spacer — reserves room for the floating pill (or AdMob banner on
          banner-visible pages) so content is never obscured. */}
      {user?.role === "student" && (
        <div
          className="md:hidden"
          style={{ height: `calc(env(safe-area-inset-bottom, 0px) + 80px)` }}
        />
      )}

      {/* XP toast (all pages) + level-up modal (students only) */}
      <XPToastDisplay />
      {user?.role === "student" && <StudentGamificationModals />}
      {/* Confetti celebration for big wins (badges, perfect scores, streaks) */}
      <XPCelebrationOverlay />
      {/* Lively AI recommendation popup — once per app open, students only */}
      {user?.role === "student" && <RecommendationPopup />}
    </div>
  );
}

/** Mounts unconditionally so hooks are never called conditionally. */
function StudentGamificationModals() {
  const { newLevelUp, clearLevelUp } = useGamification();
  return (
    <AnimatePresence>
      {newLevelUp && <LevelUpModal newLevel={newLevelUp} onClose={clearLevelUp} />}
    </AnimatePresence>
  );
}
