import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Bell, BookOpen, PencilLine, MessageCircleQuestion, Play, Check, ScrollText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { markAllAsRead, isUnread, type AppNotification } from "@/lib/notifications/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  const map = {
    new_note:        { Icon: BookOpen,                color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    new_mcq:         { Icon: PencilLine,              color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    new_qa:          { Icon: MessageCircleQuestion,   color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
    new_video:       { Icon: Play,                    color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
    new_paper:       { Icon: ScrollText,              color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
    content_updated: { Icon: Bell,                    color: "#da6b45", bg: "rgba(218,107,69,0.15)" },
  } as const;
  const entry = map[type] ?? map.content_updated;
  const Icon = entry.Icon;
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: entry.bg }}>
      <Icon className="w-4 h-4" style={{ color: entry.color }} />
    </div>
  );
}

function relativeTime(ts: AppNotification["createdAt"]): string {
  if (!ts) return "";
  const date = ts.toDate?.() ?? new Date();
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function notificationLink(n: AppNotification): string {
  // Papers route into the Full Length Papers tree; chapterId on a paper
  // notification is actually the setId, refId is the paperId.
  if (n.type === "new_paper") {
    if (n.chapterId && n.refId) return `/papers/${n.chapterId}/${n.refId}`;
    if (n.chapterId) return `/papers/${n.chapterId}`;
    return "/papers";
  }
  const tabMap: Record<AppNotification["type"], string> = {
    new_mcq: "mcq",
    new_qa: "qa",
    new_note: "notes",
    new_video: "notes",
    new_paper: "papers",   // unused — paper case is short-circuited above
    content_updated: "notes",
  };
  const tab = tabMap[n.type] ?? "notes";
  if (n.chapterId) return `/chapters/${n.chapterId}?tab=${tab}`;
  return "/subjects";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const { notifications, unreadCount, isLoading, refreshSeen, tick } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Recompute unread count when tick changes (after markAllAsRead)
  void tick;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && unreadCount > 0) {
      // Mark all as read when the panel opens
      markAllAsRead();
      refreshSeen();
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        data-testid="button-notifications"
        className="relative w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-black text-white flex items-center justify-center px-1 shadow-md"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 sm:w-96 max-h-[70vh] overflow-hidden rounded-2xl shadow-2xl z-50"
            style={{
              // Solid dark slate so content behind the dropdown doesn't bleed through.
              // backdropFilter is kept for a subtle frosted edge on the small gap above the panel.
              background: "rgba(15, 23, 42, 0.97)",
              border: "1px solid rgba(218,107,69,0.35)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
            }}
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-foreground" />
                <h3 className="font-black text-foreground text-sm tracking-tight">Notifications</h3>
              </div>
              {notifications.length > 0 && (
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                  {notifications.length} recent
                </span>
              )}
            </div>

            {/* List */}
            <div className="max-h-[50vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-white/30 dark:bg-white/5 animate-pulse" />)}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="font-black text-foreground text-sm">No notifications yet</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">
                    You'll see updates here when new content is added.
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((n) => {
                    const unread = isUnread(n);
                    return (
                      <Link key={n.id} href={notificationLink(n)}>
                        <div
                          onClick={() => setOpen(false)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                            unread
                              ? "bg-orange-50/80 dark:bg-orange-900/10 hover:bg-orange-100/80 dark:hover:bg-orange-900/20"
                              : "hover:bg-white/40 dark:hover:bg-white/5"
                          }`}
                        >
                          <NotificationIcon type={n.type} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground text-sm leading-tight truncate">{n.title}</p>
                            <p className="text-xs text-muted-foreground font-semibold truncate">{n.body}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{relativeTime(n.createdAt)}</p>
                          </div>
                          {unread && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && unreadCount === 0 && (
              <div className="px-5 py-2 border-t border-border text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Check className="w-3 h-3" /> All caught up
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
