/**
 * Shared constants + state helpers for the TRUE CONCEPT WhatsApp channel.
 *
 * Used by:
 *   • WhatsAppPopup.tsx        — the first-time onboarding nag
 *   • StudentSettingsModal.tsx — the "Follow on WhatsApp" button in Settings
 *
 * Keeping the URL and the localStorage key in one place ensures that an action
 * from either surface ("Follow" or "I've already followed") is consistently
 * persisted — clicking Follow from the Settings menu permanently silences the
 * popup, even if the student had previously dismissed it.
 */

export const WA_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb86fMdBlHpj4FnS5i1z";

const STORAGE_KEY = "wa_popup_state_v2";

export type WaPopupStatus = "followed" | "already" | "snoozed";

export interface WaPopupState {
  status: WaPopupStatus;
  /** ms epoch; only set when status === "snoozed" */
  snoozedUntil?: number;
}

export function readWaPopupState(): WaPopupState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WaPopupState;
    if (parsed?.status === "followed" || parsed?.status === "already") return parsed;
    if (parsed?.status === "snoozed" && typeof parsed.snoozedUntil === "number") return parsed;
  } catch { /* corrupt entry — fall through */ }
  return null;
}

export function writeWaPopupState(state: WaPopupState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* localStorage blocked — silently no-op */ }
}

/** Mark the channel as followed. Called from the Follow button in either surface. */
export function markChannelFollowed(): void {
  writeWaPopupState({ status: "followed" });
}

/** Mark as "already followed" — permanent opt-out without opening WhatsApp. */
export function markChannelAlreadyFollowed(): void {
  writeWaPopupState({ status: "already" });
}

/** Snooze the popup for N days (used by Maybe later / X / outside click). */
export function snoozeChannelPopup(days = 7): void {
  writeWaPopupState({
    status: "snoozed",
    snoozedUntil: Date.now() + days * 24 * 60 * 60 * 1000,
  });
}

/** Should the popup be allowed to show right now? */
export function shouldShowChannelPopup(state: WaPopupState | null = readWaPopupState()): boolean {
  if (!state) return true;
  if (state.status === "followed" || state.status === "already") return false;
  if (state.status === "snoozed" && state.snoozedUntil) {
    return Date.now() >= state.snoozedUntil;
  }
  return true;
}
