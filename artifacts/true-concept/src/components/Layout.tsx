import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen, FlaskConical, Home, LayoutDashboard, LogOut, Menu, Search, X, Settings, ChevronRight
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(222,47%,11%)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"}>
              <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
                <div className="w-8 h-8 bg-[hsl(45,93%,47%)] rounded-lg flex items-center justify-center font-serif font-bold text-[hsl(222,47%,11%)] text-sm">TC</div>
                <span className="font-serif font-bold text-lg tracking-wide">TRUE CONCEPT</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <button
                      data-testid={`nav-${label.toLowerCase()}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.startsWith(href)
                          ? "bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)]"
                          : "text-blue-100 hover:bg-white/10"
                      }`}
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
                  <span className="hidden sm:block text-sm text-blue-200">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    data-testid="button-logout"
                    className="text-blue-100 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)] hover:bg-[hsl(45,93%,40%)] font-semibold" data-testid="button-login-nav">
                    Login
                  </Button>
                </Link>
              )}
              {user && (
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-white/10"
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
          <div className="md:hidden bg-[hsl(222,47%,9%)] border-t border-white/10 px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.startsWith(href)
                      ? "bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)]"
                      : "text-blue-100 hover:bg-white/10"
                  }`}
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(222,47%,11%)] border-t border-white/10 flex z-40">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex-1">
              <button className={`w-full flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
                location.startsWith(href) ? "text-[hsl(45,93%,47%)]" : "text-blue-300"
              }`}>
                <Icon className="w-5 h-5" />
                {label}
              </button>
            </Link>
          ))}
        </nav>
      )}

      {/* Padding for mobile bottom nav */}
      {user && user.role === "student" && <div className="h-16 md:hidden" />}
    </div>
  );
}
