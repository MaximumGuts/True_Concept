import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { createPortal } from "react-dom";
import {
  WA_CHANNEL_URL,
  markChannelFollowed,
  markChannelAlreadyFollowed,
  snoozeChannelPopup,
  shouldShowChannelPopup,
} from "@/lib/whatsapp-channel";

const SHOW_DELAY_MS = 1200;

/**
 * First-time onboarding nag for the TRUE CONCEPT WhatsApp channel.
 *
 * WhatsApp does not expose any API to detect channel subscribers, so we infer
 * subscription state from user behaviour (see lib/whatsapp-channel.ts).
 *
 * Behaviour summary:
 *   • Clicks "Follow on WhatsApp"     → permanent dismissal (status = followed)
 *   • Clicks "I've already followed"  → permanent dismissal (status = already)
 *   • Clicks "Maybe later" / X / outside → 7-day snooze
 *
 * Students who pressed "already" by mistake can use the Follow on WhatsApp
 * button in the Settings menu (StudentSettingsModal) to re-open the channel.
 */
export default function WhatsAppPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShowChannelPopup()) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleSnooze = () => {
    snoozeChannelPopup();
    setVisible(false);
  };
  const handleFollow = () => {
    markChannelFollowed();
    setVisible(false);
  };
  const handleAlreadyFollowed = () => {
    markChannelAlreadyFollowed();
    setVisible(false);
  };

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleSnooze}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--glass-card-bg)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
        }}
      >
        {/* Green WhatsApp header stripe */}
        <div
          className="px-6 pt-6 pb-4 text-white"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
        >
          <button
            onClick={handleSnooze}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="text-4xl mb-2">📣</div>
          <h2 className="font-black text-xl tracking-tight">Join our WhatsApp Channel!</h2>
          <p className="text-white/80 text-sm font-semibold mt-1">
            Get instant updates, tips, and study material from TRUE CONCEPT
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <ul className="space-y-2 text-sm font-semibold text-foreground">
            {[
              "📚 Chapter-wise study notes",
              "🔔 Exam alerts & reminders",
              "🎯 Practice MCQs every week",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a
            href={WA_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleFollow}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white shadow-lg hover:scale-[1.02] active:scale-100 transition-transform text-sm"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          >
            {/* WhatsApp icon (inline SVG to avoid extra deps) */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Follow on WhatsApp
          </a>

          {/* "I've already followed" — permanent opt-out for users who joined elsewhere */}
          <button
            onClick={handleAlreadyFollowed}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-bold text-sm border transition-colors hover:bg-emerald-500/10"
            style={{ borderColor: "rgba(16,185,129,0.35)", color: "rgb(52,211,153)" }}
          >
            <Check className="w-4 h-4" />
            I&apos;ve already followed
          </button>

          {/* Snooze 7 days */}
          <button
            onClick={handleSnooze}
            className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
