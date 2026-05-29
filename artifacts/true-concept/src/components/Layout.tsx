import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { BookOpen, FlaskConical, LogOut, Menu, Search, X, ChevronRight, LayoutDashboard, Users, Home, Settings } from "lucide-react";
import { adManager } from "@/ads/ad-manager";
import ThemeToggle from "@/components/ThemeToggle";
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
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
        { href: "/admin/chapters", label: "Chapters", icon: BookOpen },
        { href: "/admin/experiments", label: "Lab", icon: FlaskConical },
        { href: "/admin/students", label: "Students", icon: Users },
      ]
    : [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/subjects", label: "Subjects", icon: BookOpen },
        { href: "/virtual-lab", label: "Lab", icon: FlaskConical },
        { href: "/search", label: "Search", icon: Search },
      ];

  const isActive = (href: string) => location === href || (href !== "/" && location.startsWith(href));

  // ── Bottom-pill visibility (mobile only) ────────────────────────────────
  // Hide the floating bottom nav on detail / lab-runner screens so an ad
  // banner can take that space. PC view is unaffected (the pill is already
  // `md:hidden`); this predicate only changes whether it's mounted at all.
  // Patterns that hide the pill:
  //   /subjects/<id>           — chapters list inside a subject
  //   /chapters/<id>           — note / quiz / Q&A view of a chapter
  //   /virtual-lab/<anything>  — any lab hub (physics/chemistry/biology) or
  //                              experiment-runner page
  //   /papers (and deeper)     — Full Length Question Papers picker, set
  //                              detail, and the immersive paper reader
  // Top-level /subjects, /dashboard, /virtual-lab, /search keep the pill.
  const hideBottomNav =
    /^\/subjects\/[^/]+/.test(location) ||
    /^\/chapters\/[^/]+/.test(location) ||
    /^\/virtual-lab\/[^/]+/.test(location) ||
    /^\/papers(\/|$)/.test(location);

  // ── Bottom AdMob banner visibility (mobile only, native Android only) ──
  // The native AdMob banner sits on top of the WebView at the OS bottom and
  // appears on EXACTLY the same screens where the pill is hidden:
  //   • Subject → chapters list
  //   • Chapter → notes / MCQ / Q&A tabs (and the immersive note reader on top)
  //   • Any lab hub or experiment-runner page
  // The web build uses the AdSense stub provider which is a no-op for now.
  // The provider's showAdaptiveBanner() / hideBanner() are idempotent, so
  // navigating between two banner-pages doesn't flicker.
  const isStudent = user?.role === "student";
  useEffect(() => {
    if (isStudent && hideBottomNav) {
      void adManager.showAdaptiveBanner();
    } else {
      void adManager.hideBanner();
    }
  }, [isStudent, hideBottomNav]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────── */}
      {/* Premium polish:
          • Deep cosmic gradient extends from the OS status-bar safe area
            down into the header — replaces the previously-harsh seam where
            the orange Android status bar met the dark page.
          • Soft top-edge accent (1 px) glows in the brand orange for a hint
            of warmth without dominating.
          • Bottom edge fades to transparent so the header feels welded to
            the page below instead of cut off by a hard border. */}
      <header
        className="sticky top-0 z-50 backdrop-blur-2xl shadow-xl relative"
        style={{
          // max() picks whichever is larger: the device-reported safe area
          // (non-zero on notched phones / iOS) or the Capacitor fallback
          // injected via the .is-capacitor class on <html> (Android tablets
          // without a notch report 0 here even though the status bar exists).
          paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))",
          // Header background is theme-aware via CSS variables in index.css.
          // Light → soft cream, Dark → deep cosmic gradient.
          background: "var(--header-bg)",
        }}
      >
        {/* Top hairline glow — warm orange whisper at the very top */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "var(--header-glow-top)" }}
        />
        {/* Bottom soft fade — replaces the old border-b */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: "var(--header-glow-bottom)" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Top-left cluster: Notification Bell (students only) + Logo */}
            <div className="flex items-center gap-2">
              {user?.role === "student" && <NotificationBell />}
              <Link href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"}>
                <div className="flex items-center gap-2.5 cursor-pointer" data-testid="logo">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg"
                    style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>TC</div>
                  <span className="font-black text-lg tracking-tight hidden sm:inline" style={{
                    background: "linear-gradient(135deg, #da6b45, #fbbf24)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>TRUE CONCEPT</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav — liquid glass pill */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 liquid-inner rounded-2xl p-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <button
                      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
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

            {/* Right */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 liquid-inner rounded-xl px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.role === "admin" ? "Admin" : "Student"}</span>
                  </div>
                  {user.role === "student" && (
                    <button
                      onClick={() => setSettingsOpen(true)}
                      data-testid="button-settings"
                      title="Settings"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={logout}
                    data-testid="button-logout"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="font-black text-sm px-5 py-2 rounded-xl text-white shadow-lg hover:opacity-90 transition-opacity"
                    data-testid="button-login-nav"
                    style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
                    Login
                  </button>
                </Link>
              )}
              {user && (
                <button
                  className="md:hidden p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu — keeps the same gradient family so it feels like part of the header */}
        {user && mobileMenuOpen && (
          <div
            className="md:hidden px-4 py-3 space-y-1.5 backdrop-blur-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(28,18,68,0.92), rgba(20,14,48,0.95))",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                    isActive(href) ? "text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                  style={isActive(href) ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                </button>
              </Link>
            ))}
            {user.role === "student" && (
              <button
                onClick={() => { setMobileMenuOpen(false); setSettingsOpen(true); }}
                data-testid="mobile-button-settings"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
                <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
              </button>
            )}
          </div>
        )}
      </header>

      {user?.role === "student" && (
        <StudentSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}

      {/* ── Main ───────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/*
        ── Footer ─────────────────────────────────────────────────────
        Minimal footer so AdSense (and search engines) can find the
        Privacy Policy and About page from any route. Hidden on the
        Android APK because the system back / nav handles legal links
        through the OS app info screen instead.
      */}
      <footer className="w-full mt-8 mb-2 px-4 text-center text-[11px] text-gray-500 dark:text-gray-500 font-semibold opacity-80">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span>© {new Date().getFullYear()} TRUE CONCEPT</span>
          <span aria-hidden>·</span>
          <Link href="/about"><a className="hover:text-orange-700 dark:hover:text-orange-300 transition-colors">About</a></Link>
          <span aria-hidden>·</span>
          <Link href="/privacy"><a className="hover:text-orange-700 dark:hover:text-orange-300 transition-colors">Privacy Policy</a></Link>
        </div>
      </footer>

      {/* ── Mobile bottom nav — floating pill, solid bg, immersive-aware ─── */}
      {user && user.role === "student" && !hideBottomNav && (
        <nav
          className="md:hidden fixed left-1/2 -translate-x-1/2 z-40"
          style={{
            bottom: `calc(env(safe-area-inset-bottom, 0px) + 12px)`,
          }}
          data-testid="mobile-bottom-nav"
        >
          <div
            className="flex items-center gap-1 px-2 py-2 rounded-full shadow-2xl"
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
                    style={
                      active
                        ? { background: "linear-gradient(135deg, #da6b45, #b85535)" }
                        : {}
                    }
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

      {user && user.role === "student" && (
        // 80 px spacer always present for student-mobile pages:
        //   • non-banner pages → holds the floating pill above the safe area
        //   • banner pages     → reserves room so the native AdMob banner
        //                        doesn't overlap content (e.g. Mark-as-Read,
        //                        experiment controls)
        <div
          className="md:hidden"
          style={{ height: `calc(env(safe-area-inset-bottom, 0px) + 80px)` }}
        />
      )}
    </div>
  );
}
