import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";

export interface StudentProfile {
  uid: string;
  name: string;
  phone: string;
  classLevel: "Class IX" | "Class X" | string;
  medium: "Assamese" | "English" | string;
  board: "SEBA" | "CBSE" | string;
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}

const CACHE_KEY = "trueconcept_student_profile";
const CACHE_TTL_MS = 60 * 60 * 1000;   // 1 hour — profile rarely changes

interface CachedProfile {
  uid: string;
  data: StudentProfile;
  cachedAt: number;
}

function readCache(uid: string): StudentProfile | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: CachedProfile = JSON.parse(raw);
    if (cache.uid !== uid) return null;
    if (Date.now() - cache.cachedAt > CACHE_TTL_MS) return null;
    return cache.data;
  } catch {
    return null;
  }
}

function writeCache(uid: string, data: StudentProfile) {
  try {
    const cache: CachedProfile = { uid, data, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or disabled — silent fallback to network only
  }
}

/** Clear the cached profile (call on logout). */
export function clearProfileCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}

/**
 * Fetches a student's full profile from Firestore.
 * Uses local cache (1h TTL) to avoid repeated reads on every page load.
 */
export async function fetchStudentProfile(uid: string): Promise<StudentProfile | null> {
  // Try cache first
  const cached = readCache(uid);
  if (cached) return cached;

  // Fall back to Firestore
  const snap = await getDoc(doc(db, "students", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  const profile: StudentProfile = {
    uid,
    name: data.name ?? "",
    phone: data.phone ?? "",
    classLevel: data.classLevel ?? "Class IX",
    medium: data.medium ?? "English",
    board: data.board ?? "SEBA",
    createdAt: data.createdAt,
    lastLogin: data.lastLogin,
  };

  writeCache(uid, profile);
  return profile;
}
