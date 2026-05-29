import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { useBroadcastMessages, type BroadcastMessage } from "@/hooks/useBroadcastMessages";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

function urgencyStyle(urgency: BroadcastMessage["urgency"]) {
  if (urgency === "high")   return { bg: "linear-gradient(135deg,#7c3aed,#4f46e5)", badge: "#ef4444", label: "New" };
  if (urgency === "medium") return { bg: "linear-gradient(135deg,#0369a1,#0284c7)", badge: "#f59e0b", label: "Update" };
  return                          { bg: "linear-gradient(135deg,#065f46,#059669)", badge: "#6366f1", label: "Info" };
}

function SingleBroadcast({ msg, isAssamese, onDismiss }: { msg: BroadcastMessage; isAssamese: boolean; onDismiss: () => void }) {
  const { bg, badge, label } = urgencyStyle(msg.urgency);
  const headline    = isAssamese ? (msg.headline_as    ?? msg.headline)    : msg.headline;
  const message     = isAssamese ? (msg.message_as     ?? msg.message)     : msg.message;
  const callToAction = isAssamese ? (msg.callToAction_as ?? msg.callToAction) : msg.callToAction;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="relative rounded-2xl p-4 text-white overflow-hidden"
      style={{ background: bg }}
    >
      {/* Glow blob */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle,white,transparent)" }} />

      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/20 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-white/70" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <Megaphone className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: badge }}>
              {label}
            </span>
            <span className="text-white/60 text-[10px] font-bold">{msg.subjectName}</span>
          </div>
          <p className="font-black text-sm leading-snug">{headline}</p>
          <p className="text-white/75 text-xs mt-1 leading-relaxed">{message}</p>

          <Link href={msg.actionLink}>
            <button className="mt-2.5 flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              {callToAction} <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function BroadcastBanner() {
  const { messages, markAllSeen } = useBroadcastMessages();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = messages.filter((m) => !dismissed.has(m.notificationId)).slice(0, 2);
  if (visible.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    markAllSeen();
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.map((msg) => (
          <SingleBroadcast
            key={msg.notificationId}
            msg={msg}
            isAssamese={isAssamese}
            onDismiss={() => dismiss(msg.notificationId)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
