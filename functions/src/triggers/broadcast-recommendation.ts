import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { db } from "@workspace/db";
import { FieldValue } from "firebase-admin/firestore";
import { callGemini, parseGeminiJson } from "../lib/gemini.js";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

interface BroadcastMessage {
  notificationId: string;
  contentType: string;
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
  targetClass: string | null;   // "Class IX" | "Class X" | null (null = all classes)
  targetMedium: string;         // "English" | "Assamese" | "Both"
  headline: string;
  message: string;
  callToAction: string;
  headline_as?: string;
  message_as?: string;
  callToAction_as?: string;
  urgency: "high" | "medium" | "low";
  actionLink: string;
  createdAt: FirebaseFirestore.FieldValue;
}

const typeLabels: Record<string, string> = {
  new_note:  "Study Notes",
  new_mcq:   "MCQ Practice Set",
  new_qa:    "Q&A Revision Material",
  new_video: "Video Lecture",
  new_paper: "Full Length Question Paper",
};

const tabMap: Record<string, string> = {
  new_note:  "notes",
  new_mcq:   "mcq",
  new_qa:    "qa",
  new_video: "notes",
  // Papers don't live under a chapter — the actionLink is overridden below
  // when type === "new_paper" to deep-link into /papers/:setId/:paperId instead.
  new_paper: "papers",
};

export const broadcastNewContent = onDocumentCreated(
  {
    document: "notifications/{notifId}",
    region:   "asia-south1",
    secrets:  [GEMINI_API_KEY],
  },
  async (event) => {
    const notif = event.data?.data();
    if (!notif) return;

    const { type, chapterId, chapterTitle, subjectName, classLevel, medium } = notif as {
      type: string;
      chapterId: string;
      chapterTitle: string;
      subjectName: string;
      classLevel: string | null;
      medium: string;
    };

    // Only broadcast content-addition events
    if (!["new_note", "new_mcq", "new_qa", "new_video", "new_paper"].includes(type)) return;

    const contentLabel  = typeLabels[type]  ?? "Content";
    const tab           = tabMap[type]      ?? "notes";
    const notifId       = event.params.notifId;
    const targetMedium  = medium ?? "Both";

    // Build prompt based on which language(s) are needed
    const needsEnglish  = targetMedium !== "Assamese";
    const needsAssamese = targetMedium !== "English";

    const jsonShape = needsEnglish && needsAssamese
      ? `{
  "headline": "max 8 words English, exciting, mention chapter name",
  "message": "2 sentences English — why important for exams, what students will learn",
  "callToAction": "2-3 words English action button label",
  "headline_as": "same headline in Assamese script (অসমীয়া)",
  "message_as": "same message in Assamese script (অসমীয়া)",
  "callToAction_as": "same CTA in Assamese script (অসমীয়া)",
  "urgency": "high"
}`
      : needsAssamese
      ? `{
  "headline": "max 8 words in Assamese script (অসমীয়া), exciting, mention chapter name",
  "message": "2 sentences in Assamese script — why important for exams, what students will learn",
  "callToAction": "2-3 words Assamese action button label",
  "urgency": "high"
}`
      : `{
  "headline": "max 8 words English, exciting, mention chapter name",
  "message": "2 sentences English — why important for exams, what students will learn",
  "callToAction": "2-3 words English action button label",
  "urgency": "high"
}`;

    try {
      const prompt = `You are an AI for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India.

The admin just added new ${contentLabel} for the chapter "${chapterTitle}" (Subject: ${subjectName}).

Write a short, engaging announcement to motivate students to check it out immediately.

Return ONLY this JSON (no markdown):
${jsonShape}`;

      const raw    = await callGemini(prompt);
      const aiData = parseGeminiJson<{
        headline: string; message: string; callToAction: string; urgency?: string;
        headline_as?: string; message_as?: string; callToAction_as?: string;
      }>(raw);

      // For Assamese-only chapters the main fields hold Assamese text
      const headline     = needsEnglish  ? aiData.headline    : (aiData.headline_as    ?? aiData.headline);
      const message      = needsEnglish  ? aiData.message     : (aiData.message_as     ?? aiData.message);
      const callToAction = needsEnglish  ? aiData.callToAction : (aiData.callToAction_as ?? aiData.callToAction);

      const broadcast: BroadcastMessage = {
        notificationId:  notifId,
        contentType:     type,
        chapterId,
        chapterTitle,
        subjectName,
        targetClass:     classLevel ?? null,
        targetMedium,
        headline,
        message,
        callToAction,
        ...(needsAssamese && needsEnglish && {
          headline_as:     aiData.headline_as,
          message_as:      aiData.message_as,
          callToAction_as: aiData.callToAction_as,
        }),
        urgency:         (aiData.urgency as BroadcastMessage["urgency"]) ?? "medium",
        // Papers deep-link into the paper reader (chapterId here is the setId);
        // everything else routes back into the chapter tabs view.
        actionLink:      type === "new_paper"
          ? `/papers/${chapterId}/${(notif as { refId?: string }).refId ?? ""}`
          : `/chapters/${chapterId}?tab=${tab}`,
        createdAt:       FieldValue.serverTimestamp(),
      };

      await db.collection("broadcastMessages").doc(notifId).set(broadcast);
    } catch (err) {
      console.error("[broadcastNewContent] Gemini call failed:", err);
    }
  }
);
