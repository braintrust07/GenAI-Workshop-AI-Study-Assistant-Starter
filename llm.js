// ============================================================
// llm.js — Gemini wrapper
//
// One function, callLLM(), so server.js doesn't have to deal with
// request/response formatting directly. This is infrastructure, not
// something to live-code — treat it like the starter UI: it's already
// built so class time goes to the AI concepts, not API plumbing.
//
// Uses Gemini's plain REST API — fetch is built into Node 18+, so no
// extra SDK/dependency is needed.
//
// Automatically retries a couple of times on "model overloaded" (503)
// or rate-limit (429) responses, with a short backoff. This matters
// most during the live session: if many students call the API around
// the same moment, brief "high demand" errors are expected on a free
// tier, and a retry usually clears it within a couple of seconds.
//
// Get a free key (no credit card) at https://aistudio.google.com/app/apikey
// and put it in .env as GEMINI_API_KEY.
// ============================================================

async function callLLM(userMessage, systemPrompt = "", retries = 3) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return data.candidates[0].content.parts[0].text;
    }

    const isRetryable = res.status === 503 || res.status === 429;
    const isLastAttempt = attempt === retries;

    if (isRetryable && !isLastAttempt) {
      const delayMs = attempt * 1000; // 1s, then 2s
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    throw new Error(data.error?.message || `Gemini API error (${res.status})`);
  }
}

module.exports = { callLLM };
