/**
 * Activity tiering — decides how much (if any) Gemini budget a student earns,
 * based on how actively they use the app.
 *
 * Gemini is only ever called on-demand (mentor card / next-recommendation
 * narration). A once-a-week student blows the 48h cache every visit, and a
 * student returning after a long gap triggers a fresh expensive call the moment
 * they reopen — the least-proven user at the most expensive moment. Tiering caps
 * that:
 *
 *   active   → fresh AI, 48h cache + AI-narrated next-recommendation
 *   casual   → AI mentor on a 7-day cache, NO per-recommendation narration
 *   dormant  → NO Gemini at all; a deterministic "welcome back" card is served
 *              instead. The student re-earns AI once renewed activity lifts them
 *              back to casual/active.
 *
 * Thresholds below are the "Balanced" policy. Reads zero extra Firestore docs —
 * everything comes from the knowledge profile the routes already load.
 */

import { Timestamp } from "firebase-admin/firestore";

export type ActivityTier = "active" | "casual" | "dormant";

const DAY = 86_400_000;

// ── Balanced policy ──────────────────────────────────────────────────────────
const DORMANT_AFTER_DAYS    = 14; // no activity for >14 days → dormant
const ACTIVE_WITHIN_DAYS    = 3;  // active within last 3 days ...
const ACTIVE_MIN_ACTIVE_DAYS = 3; // ... AND ≥3 distinct active days in last 30
//                                   (this gate is what makes a just-returned
//                                    student "earn back" full AI over a few days
//                                    rather than getting an expensive call on
//                                    their very first session back.)

/** Per-tier cache TTL for the mentor card. */
export const TIER_CACHE_TTL_MS: Record<ActivityTier, number> = {
  active:  48 * 60 * 60 * 1000, // 48h — fresh, as before
  casual:   7 * DAY,            // weekly refresh
  dormant:  1 * DAY,            // cheap static card; re-check daily
};

function toMs(ts: unknown): number {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  const raw = ts as { seconds?: number; _seconds?: number };
  const s = raw.seconds ?? raw._seconds;
  return s ? s * 1000 : 0;
}

/**
 * Classify a student into an activity tier from their knowledge profile.
 * Falls back to `updatedAt` when `lastActiveAt` is missing (older profiles
 * written before tiering shipped). No profile at all → dormant.
 */
export function getActivityTier(profile: Record<string, any> | null | undefined): ActivityTier {
  if (!profile) return "dormant";
  const lastMs = toMs(profile.lastActiveAt) || toMs(profile.updatedAt);
  if (!lastMs) return "dormant";

  const daysSinceActive = (Date.now() - lastMs) / DAY;
  if (daysSinceActive > DORMANT_AFTER_DAYS) return "dormant";

  const activeDays = profile.studyBehavior?.activeDaysLast30 ?? 0;
  if (daysSinceActive <= ACTIVE_WITHIN_DAYS && activeDays >= ACTIVE_MIN_ACTIVE_DAYS) {
    return "active";
  }
  return "casual";
}
