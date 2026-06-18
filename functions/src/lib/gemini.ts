/**
 * Gemini API helper — uses fetch directly, no extra dependencies.
 * Key is read from GEMINI_API_KEY environment variable (set in functions/.env).
 */

// Use gemini-2.5-flash-lite — the cheapest Gemini, built for high-volume /
// low-cost generation. ~5-6x cheaper output than 2.5-flash with equally strong
// Indic-language (Assamese) quality, and a higher free-tier daily limit. The
// mentor task (structured profile → bilingual JSON) doesn't need a frontier
// model, so Flash-Lite is the right cost/quality fit. See the cost analysis in
// chat (~₹62K/mo → ~₹14K/mo at 50K DAU).
const GEMINI_MODEL   = "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:      0.7,
        maxOutputTokens:  2048,                  // bumped — 2.5 Flash needs headroom
        responseMimeType: "application/json",
        // Disable Gemini 2.5's "thinking mode" — it consumes tokens internally
        // before generating visible output, which was truncating our JSON.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

/** Parse JSON from Gemini response, stripping any accidental markdown fences. */
export function parseGeminiJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("[gemini] JSON parse failed. Raw response was:", cleaned);
    throw err;
  }
}
