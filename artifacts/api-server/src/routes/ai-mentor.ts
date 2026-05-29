import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import type { Request, Response } from "express";

const router: IRouter = Router();

const GEMINI_MODEL   = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const CACHE_TTL_MS   = 6 * 60 * 60 * 1000; // 6 hours

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error ${response.status}`);
  const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini returned empty response");
  return text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
}

// GET /api/ai/mentor
router.get("/ai/mentor", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = (req as Request & { user: { id: string; role: string } }).user;
  const uid  = user.id;

  // ── Cache check ────────────────────────────────────────────────────────────
  try {
    const cacheSnap = await db.collection("aiRecommendations").doc(uid).get();
    if (cacheSnap.exists) {
      const cached = cacheSnap.data() as { generatedAt?: { _seconds?: number } };
      const secs   = cached.generatedAt?._seconds ?? 0;
      if (Date.now() - secs * 1000 < CACHE_TTL_MS) {
        res.json(cacheSnap.data());
        return;
      }
    }
  } catch { /* cache miss — continue */ }

  // ── Read knowledge profile ─────────────────────────────────────────────────
  const profileSnap = await db.collection("studentKnowledgeProfiles").doc(uid).get();
  if (!profileSnap.exists) {
    res.status(202).json({ pending: true, message: "Profile not ready yet. Study a bit first!" });
    return;
  }

  const profile = profileSnap.data() as Record<string, any>;

  // ── Read student name ──────────────────────────────────────────────────────
  const studentSnap = await db.collection("students").doc(uid).get();
  const firstName   = ((studentSnap.data() as { name?: string })?.name ?? "Student").split(" ")[0];

  // ── Build prompt ──────────────────────────────────────────────────────────
  const weak        = Object.values(profile.weakTopicMap   ?? {}) as any[];
  const strong      = Object.values(profile.strongTopicMap ?? {}) as any[];
  const subjectMas  = Object.values(profile.subjectMastery ?? {}) as any[];
  const retry       = (profile.suggestedRetryQuestions ?? []) as any[];
  const revNeeded   = (profile.revisionProfile?.chaptersNeedingRevision ?? []) as string[];

  const weakFmt   = weak.slice(0,5).map((t: any) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100, MCQ accuracy ${t.mcqAccuracy}%, not studied in ${t.daysSinceStudy} days`).join("\n");
  const strongFmt = strong.slice(0,3).map((t: any) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100`).join("\n");
  const subjectFmt = subjectMas.map((s: any) => `- ${s.subjectName}: ${s.masteryScore}/100 (${s.trend})`).join("\n");
  const retryFmt  = retry.slice(0,5).map((q: any) => `- ${q.chapterTitle}: accuracy ${q.accuracy}%, wrong ${q.consecutiveWrong} times in a row`).join("\n");
  const revFmt    = revNeeded.slice(0,5).map((cid: string) => {
    const m = weak.find((t:any) => t.chapterId === cid) || strong.find((t:any) => t.chapterId === cid);
    return m ? `- ${m.chapterTitle} (${m.daysSinceStudy} days ago)` : `- Chapter ${cid}`;
  }).join("\n") || "None";

  const firstWeak   = weak[0]?.chapterId   ?? null;
  const firstRev    = revNeeded[0]          ?? null;
  const firstRetry  = retry[0]?.chapterId  ?? null;

  const isAssamese = (profile.medium ?? "English") === "Assamese";
  const langInstruction = isAssamese
    ? "Respond ENTIRELY in Assamese (Assamese script — অসমীয়া). Use simple, warm Assamese that a Class 9-10 student from Assam can easily understand. Chapter names and subject names may stay in English."
    : "Respond in simple English.";

  const prompt = `You are an AI Academic Mentor for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India. Be warm, specific, encouraging and practical. ${langInstruction}

Student: ${firstName}
Class: ${profile.classLevel || "9"}, Medium: ${profile.medium || "English"}
Exam Readiness: ${profile.examReadinessScore ?? 0}/100
Confidence: ${profile.confidenceScore ?? 0}/100
Study Streak: ${profile.studyBehavior?.currentStreak ?? 0} days
Overall MCQ Accuracy: ${profile.learningPattern?.averageMcqAccuracy ?? 0}%
Learning Trend: ${profile.learningPattern?.improvementTrend ?? "stable"}

Subject Mastery:
${subjectFmt || "No data yet"}

Weak Topics:
${weakFmt || "None identified yet"}

Strong Topics:
${strongFmt || "None yet"}

Chapters not revised in 7+ days:
${revFmt}

MCQ questions to retry:
${retryFmt || "None yet"}

Return ONLY this JSON (no markdown):
{
  "greeting": "short warm greeting using first name",
  "examReadinessMessage": "specific message about their ${profile.examReadinessScore ?? 0}/100 score",
  "topRecommendations": [
    {"priority":1,"type":"revision","icon":"🔄","title":"short title","message":"specific actionable advice","actionLabel":"2-3 word CTA","chapterId":"${firstRev ?? firstWeak ?? null}"},
    {"priority":2,"type":"retry","icon":"🎯","title":"short title","message":"specific advice about MCQ retry","actionLabel":"2-3 word CTA","chapterId":"${firstRetry ?? firstWeak ?? null}"},
    {"priority":3,"type":"study","icon":"📚","title":"short title","message":"next chapter to study","actionLabel":"2-3 word CTA","chapterId":"${firstWeak ?? null}"}
  ],
  "weakTopicAlert": "one sentence about biggest weakness or null",
  "revisionAlert": ${revNeeded.length > 0 ? '"one sentence about forgotten chapters"' : "null"},
  "motivationalMessage": "one sentence personal motivation",
  "nextBestAction": {"message":"the single most important thing to do RIGHT NOW","chapterId":"${firstRev ?? firstWeak ?? null}","tab":"notes"}
}`;

  // ── Call Gemini ────────────────────────────────────────────────────────────
  const raw    = await callGemini(prompt);
  const aiData = JSON.parse(raw);

  const result = {
    ...aiData,
    examReadinessScore: profile.examReadinessScore ?? 0,
    generatedAt: new Date(),
  };

  // ── Cache ──────────────────────────────────────────────────────────────────
  void db.collection("aiRecommendations").doc(uid).set(result);

  res.json(result);
});

// POST /api/ai/mentor/refresh — clear cache so next GET regenerates
router.post("/ai/mentor/refresh", requireAuth as (req: Request, res: Response, next: () => void) => void, async (req: Request, res: Response): Promise<void> => {
  const user = (req as Request & { user: { id: string } }).user;
  await db.collection("aiRecommendations").doc(user.id).delete();
  res.json({ ok: true });
});

export default router;
