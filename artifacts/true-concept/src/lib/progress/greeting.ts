export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Greeting {
  text: string;        // "Good Morning"
  emoji: string;       // "☀️"
  period: TimeOfDay;
}

/**
 * Returns a time-aware greeting based on the user's local clock.
 * - 5:00–11:59 → Good Morning
 * - 12:00–16:59 → Good Afternoon
 * - 17:00–20:59 → Good Evening
 * - 21:00–4:59 → Good Night
 */
export function getGreeting(now: Date = new Date()): Greeting {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12)  return { text: "Good Morning",   emoji: "☀️",  period: "morning" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "🌤️", period: "afternoon" };
  if (hour >= 17 && hour < 21) return { text: "Good Evening",   emoji: "🌆",  period: "evening" };
  return { text: "Good Night", emoji: "🌙", period: "night" };
}

/** Returns just the first name (handles "Manas Jyoti Boruah" → "Manas"). */
export function getFirstName(fullName: string): string {
  if (!fullName) return "";
  return fullName.trim().split(/\s+/)[0];
}
