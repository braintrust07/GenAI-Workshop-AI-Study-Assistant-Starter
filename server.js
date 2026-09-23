// ============================================================
// AI Study Assistant — Backend
// Speaker 3: Build with GenAI
//
// This file has checkpoints matching the workshop steps.
// Look for "STEP 3", "STEP 4", "STEP 5", "STEP 6" comments below.
// If you fall behind, check solution/server.js for the finished code.
//
// Uses Gemini (free API key) — see llm.js and .env.example.
// You don't need to touch llm.js.
// ============================================================

require("dotenv").config();
const express = require("express");
const path = require("path");
const { callLLM } = require("./llm");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// --------------------------------------------------------
// STEP 3: Connect the GenAI API (2:25–2:45)
// --------------------------------------------------------
// 1. Run: npm install
// 2. Copy .env.example to .env
// 3. Get a free key at https://aistudio.google.com/app/apikey and set
//    GEMINI_API_KEY in .env.
// 4. Restart the server (npm start) and check /api/health below —
//    it should say aiConnected: true once your key is in place.

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConnected: Boolean(process.env.GEMINI_API_KEY) });
});

// --------------------------------------------------------
// STEP 4: Send the user's question (2:45–3:00)
// --------------------------------------------------------
// Replace the placeholder response below with a real call to the LLM
// using the callLLM() helper from llm.js.
//
// Target shape:
//   POST /api/ask   body: { question: "..." }
//   response:        { answer: "..." }
//
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Please provide a question." });
  }

  try {
    // TODO (Step 4): call the LLM here instead of returning this placeholder.
    //
    // const answer = await callLLM(question);
    // return res.json({ answer });

    const answer = `(placeholder) You asked: "${question}". Wire up STEP 4 in server.js to get a real AI answer.`;
    res.json({ answer });
  } catch (err) {
    console.error("Error calling GenAI API:", err.message);
    res.status(500).json({ error: "Something went wrong talking to the AI provider." });
  }
});

// --------------------------------------------------------
// STEP 5: Add prompt engineering (3:00–3:15)
// --------------------------------------------------------
// Instead of sending the raw question, define a system prompt that
// gives the model a role, audience, and response structure, and pass
// it as the second argument to callLLM(). Update the call in STEP 4:
//
// const STUDY_ASSISTANT_SYSTEM_PROMPT = `You are a friendly study assistant helping a student understand a topic.
// - Explain concepts clearly and simply, assuming a beginner audience.
// - Structure longer answers with short paragraphs or bullet points.
// - If the question is unclear, ask a brief clarifying question instead of guessing.`;
//
// const answer = await callLLM(question, STUDY_ASSISTANT_SYSTEM_PROMPT);

// --------------------------------------------------------
// STEP 6: Add one useful feature — Quiz Generation (3:15–3:30)
// --------------------------------------------------------
// Target shape:
//   POST /api/quiz   body: { topic: "..." }
//   response:         { questions: ["...", "...", "...", "...", "..."] }
//
// This feature is optional — skip it if the group is behind schedule
// and spend the time debugging the core /api/ask flow instead.
app.post("/api/quiz", async (req, res) => {
  const { topic } = req.body;

  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "Please provide a topic." });
  }

  try {
    // TODO (Step 6): ask the LLM for 5 quiz questions on `topic` and
    // parse them into an array of strings before responding.
    //
    // const quizPrompt = "You generate exactly 5 short quiz questions on a topic. Reply with one question per line, no numbering, no extra text.";
    // const raw = await callLLM(topic, quizPrompt);
    // const questions = raw.split("\n").map((q) => q.trim()).filter(Boolean);
    // return res.json({ questions });

    res.json({ questions: [`(placeholder) Wire up STEP 6 to generate quiz questions about "${topic}".`] });
  } catch (err) {
    console.error("Error generating quiz:", err.message);
    res.status(500).json({ error: "Something went wrong generating the quiz." });
  }
});

app.listen(PORT, () => {
  console.log(`AI Study Assistant running at http://localhost:${PORT}`);
});
