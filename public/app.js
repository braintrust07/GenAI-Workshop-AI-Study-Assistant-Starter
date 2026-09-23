// AI Study Assistant — Frontend
// This file is already wired to call the backend. You don't need to edit
// it during the live-coding steps — all the changes happen in server.js.
// (Exception: STEP 6 — uncomment the quiz panel line at the bottom.)

const questionEl = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const statusEl = document.getElementById("status");
const answerBox = document.getElementById("answerBox");
const answerText = document.getElementById("answerText");

askBtn.addEventListener("click", async () => {
  const question = questionEl.value.trim();
  if (!question) return;

  setLoading(true);
  answerBox.hidden = true;

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    answerText.textContent = data.answer;
    answerBox.hidden = false;
  } catch (err) {
    statusEl.textContent = err.message;
    return;
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  askBtn.disabled = isLoading;
  statusEl.textContent = isLoading ? "Thinking..." : "";
}

// --------------------------------------------------------
// STEP 6: Quiz generation (optional feature)
// --------------------------------------------------------
// 1. In index.html, remove `hidden` from <section id="quizPanel" ...>
// 2. Uncomment the block below.

/*
const topicEl = document.getElementById("topic");
const quizBtn = document.getElementById("quizBtn");
const quizList = document.getElementById("quizList");

quizBtn.addEventListener("click", async () => {
  const topic = topicEl.value.trim();
  if (!topic) return;

  quizBtn.disabled = true;
  quizList.innerHTML = "";

  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    data.questions.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q;
      quizList.appendChild(li);
    });
  } catch (err) {
    quizList.innerHTML = `<li>${err.message}</li>`;
  } finally {
    quizBtn.disabled = false;
  }
});
*/
