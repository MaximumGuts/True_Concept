import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  BookOpen, FlaskConical, Home, LayoutDashboard, LogOut, Menu, Search, X, Settings, ChevronRight, Sparkles
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user?.role === "admin"
    ? [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
        { href: "/admin/chapters", label: "Chapters", icon: BookOpen },
        { href: "/admin/experiments", label: "Lab", icon: FlaskConical },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/subjects", label: "Subjects", icon: BookOpen },
        { href: "/virtual-lab", label: "Virtual Lab", icon: FlaskConical },
        { href: "/search", label: "Search", icon: Search },
      ];

  const isActive = (href: string) => location === href || (href !== "/" && location.startsWith(href));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"}>
              <div className="flex items-center gap-2.5 cursor-pointer" data-testid="logo">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>TC</div>
                <div>
                  <span className="font-black text-lg tracking-tight" style={{
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>TRUE CONCEPT</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 bg-white/60 rounded-2xl p-1 shadow-inner border border-white/80">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <button
                      data-testid={`nav-${label.toLowerCase()}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isActive(href)
                          ? "text-white shadow-md"
                          : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                      }`}
                      style={isActive(href) ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 bg-white/70 rounded-xl px-3 py-1.5 border border-purple-100">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name.split(" ")[0]}</span>
                  </div>
                  <button
                    onClick={logout}
                    data-testid="button-logout"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="font-black text-sm px-5 py-2 rounded-xl text-white shadow-lg hover:opacity-90 transition-opacity" data-testid="button-login-nav"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                    Login
                  </button>
                </Link>
              )}
              {user && (
                <button
                  className="md:hidden p-2 rounded-xl hover:bg-purple-50 text-gray-600"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-purple-100 px-4 py-3 space-y-1.5">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive(href)
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                  style={isActive(href) ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile bottom nav for students */}
      {user && user.role === "student" && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/60 flex z-40 shadow-xl">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex-1">
              <button className={`w-full flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-bold transition-all ${
                isActive(href) ? "text-purple-600" : "text-gray-400"
              }`}>
                <div className={`p-1.5 rounded-xl transition-all ${isActive(href) ? "bg-purple-100" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {label}
              </button>
            </Link>
          ))}
        </nav>
      )}

      {/* Padding for mobile bottom nav */}
      {user && user.role === "student" && <div className="h-20 md:hidden" />}
    </div>
  );
}
