/**
 * Picks a study tip to show in the web interstitial, avoiding immediate repeats.
 *
 * Anti-repeat: keeps the last `RECENT_LIMIT` shown tip IDs in localStorage.
 * When picking, excludes those from the candidate pool. If the pool runs out
 * (small library), we just shuffle the full set again.
 */

import tipsData from "@/data/study-tips.json";

export interface StudyTip {
  id:        string;
  category:  string;
  emoji:     string;
  title:     string;
  body:      string;
  /** Optional NCERT chapter reference. `href` is optional — when omitted the
   *  label renders as plain text instead of a link (use this when you don't
   *  have a real chapter route to jump to). */
  related?: { label: string; href?: string };
}

const ALL_TIPS: StudyTip[] = tipsData as StudyTip[];

const RECENT_KEY  = "tc_recent_tip_ids";
const RECENT_LIMIT = 5;

function readRecent(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function rememberRecent(id: string): void {
  if (typeof localStorage === "undefined") return;
  const recent = readRecent();
  const next = [id, ...recent.filter((x) => x !== id)].slice(0, RECENT_LIMIT);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
}

export function pickTip(): StudyTip {
  if (ALL_TIPS.length === 0) {
    // Defensive fallback — should never happen with the bundled JSON.
    return {
      id:       "empty",
      category: "Study tip",
      emoji:    "📚",
      title:    "Keep learning!",
      body:     "Every small effort compounds. Reading one more page today is a win.",
    };
  }

  const recent = readRecent();
  const fresh  = ALL_TIPS.filter((t) => !recent.includes(t.id));
  const pool   = fresh.length > 0 ? fresh : ALL_TIPS;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  rememberRecent(chosen.id);
  return chosen;
}
