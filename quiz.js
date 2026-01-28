const form = document.getElementById("quiz-form");
const titleInput = document.getElementById("quiz-title");
const styleInput = document.getElementById("quiz-style");
const questionsInput = document.getElementById("quiz-questions");
const answersInput = document.getElementById("quiz-answers");
const hintsInput = document.getElementById("quiz-hints");
const output = document.getElementById("quiz-html");
const copyBtn = document.getElementById("copy-html");
const downloadBtn = document.getElementById("download-html");

const styleMap = {
  "text-text": {
    label: "Question: Textual, Answers: Textual",
    question: { text: true, audio: false, video: false },
    answer: { text: true, image: false, audio: false }
  },
  "text-audio-image": {
    label: "Question: Textual + Sound, Answers: Images",
    question: { text: true, audio: true, video: false },
    answer: { text: false, image: true, audio: false }
  },
  "video-audio-image-audio": {
    label: "Question: Video + Sound, Answers: Images + Sound",
    question: { text: false, audio: true, video: true },
    answer: { text: false, image: true, audio: true }
  }
};

function repeat(count, mapper) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    items.push(mapper(i));
  }
  return items.join("\n");
}

function questionMarkup(style, index, includeHints) {
  const qNumber = index + 1;
  const questionText = `Question ${qNumber}: Replace this with your question text.`;
  const hint = includeHints ? `\n      <p class="quiz-hint">Hint: Add a fun clue for this question.</p>` : "";

  const mediaBlocks = [];
  if (style.question.video) {
    mediaBlocks.push(
      "      <video class=\"quiz-media\" controls poster=\"https://placehold.co/720x405?text=Question+Video\">",
      "        <source src=\"path/to/question-video.mp4\" type=\"video/mp4\" />",
      "        Your browser does not support the video tag.",
      "      </video>"
    );
  }
  if (style.question.audio) {
    mediaBlocks.push(
      "      <audio class=\"quiz-audio\" controls>",
      "        <source src=\"path/to/question-audio.mp3\" type=\"audio/mpeg\" />",
      "        Your browser does not support the audio element.",
      "      </audio>"
    );
  }

  const textBlock = style.question.text
    ? `      <p class="quiz-question">${questionText}</p>${hint}`
    : "";

  return [textBlock, mediaBlocks.join("\n")].filter(Boolean).join("\n");
}

function answerMarkup(style, answerCount) {
  return repeat(answerCount, (index) => {
    const isCorrect = index === 0 ? "true" : "false";
    const answerLabel = `Answer ${index + 1}`;
    const parts = [];

    if (style.answer.image) {
      parts.push(
        `        <img src=\"https://placehold.co/220x160?text=${encodeURIComponent(answerLabel)}\" alt=\"${answerLabel}\" />`
      );
    }

    if (style.answer.text) {
      parts.push(`        <span>${answerLabel}</span>`);
    }

    if (style.answer.audio) {
      parts.push(
        "        <audio controls>",
        "          <source src=\"path/to/answer-audio.mp3\" type=\"audio/mpeg\" />",
        "          Your browser does not support the audio element.",
        "        </audio>"
      );
    }

    return `      <button class=\"quiz-answer\" data-correct=\"${isCorrect}\">
${parts.join("\n")}
      </button>`;
  });
}

function generateQuizHtml() {
  const quizTitle = titleInput.value.trim() || "My Quiz";
  const questionCount = Math.max(1, Number.parseInt(questionsInput.value, 10) || 1);
  const answerCount = Math.max(2, Number.parseInt(answersInput.value, 10) || 2);
  const style = styleMap[styleInput.value] || styleMap["text-text"];
  const includeHints = hintsInput.value === "yes";

  const pages = repeat(questionCount, (index) => {
    const qNumber = index + 1;
    return `      <section class=\"quiz-page\" data-page=\"${qNumber}\">
        <h2 class=\"quiz-page-title\">${quizTitle}</h2>
        <div class=\"quiz-question-wrap\">
${questionMarkup(style, index, includeHints)}
        </div>
        <div class=\"quiz-answers\">
${answerMarkup(style, answerCount)}
        </div>
      </section>`;
  });

  const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${quizTitle}</title>
    <style>
      :root {
        --quiz-bg: #fff9e6;
        --quiz-card: #ffffff;
        --quiz-accent: #ff7a4a;
        --quiz-accent-2: #2ec4b6;
        --quiz-ink: #2b2b2b;
        --quiz-shadow: 0 14px 30px rgba(50, 50, 93, 0.18);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Fredoka", "Trebuchet MS", sans-serif;
        color: var(--quiz-ink);
        background: radial-gradient(circle at top, #ffe8a6 0%, #fff3c4 40%, #d7f9f4 100%);
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem 1.5rem;
      }

      .quiz-shell {
        width: min(980px, 96vw);
        display: grid;
        gap: 1.5rem;
      }

      .quiz-banner {
        background: var(--quiz-card);
        border-radius: 24px;
        padding: 1.2rem 1.6rem;
        box-shadow: var(--quiz-shadow);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .quiz-banner h1 {
        margin: 0;
        font-size: clamp(1.6rem, 3vw, 2.4rem);
      }

      .quiz-progress {
        font-weight: 600;
        background: #fff1d6;
        border-radius: 999px;
        padding: 0.4rem 1rem;
      }

      .quiz-stage {
        background: var(--quiz-card);
        border-radius: 28px;
        padding: clamp(1.5rem, 2.8vw, 2.2rem);
        box-shadow: var(--quiz-shadow);
        position: relative;
        overflow: hidden;
      }

      .quiz-page {
        display: none;
        gap: 1.2rem;
      }

      .quiz-page.active {
        display: grid;
      }

      .quiz-page-title {
        text-transform: uppercase;
        letter-spacing: 0.24em;
        font-size: 0.85rem;
        margin: 0;
        color: #f06d42;
      }

      .quiz-question-wrap {
        background: var(--quiz-bg);
        border-radius: 20px;
        padding: 1rem 1.2rem;
        display: grid;
        gap: 0.8rem;
      }

      .quiz-question {
        font-size: clamp(1.2rem, 2.4vw, 1.6rem);
        margin: 0;
      }

      .quiz-hint {
        margin: 0;
        font-size: 0.95rem;
        opacity: 0.75;
      }

      .quiz-media,
      .quiz-audio {
        width: 100%;
        border-radius: 16px;
      }

      .quiz-answers {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.9rem;
      }

      .quiz-answer {
        border: none;
        background: #ffffff;
        border-radius: 18px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        padding: 0.8rem;
        display: grid;
        gap: 0.6rem;
        text-align: center;
        font-family: inherit;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .quiz-answer:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
      }

      .quiz-answer.is-correct {
        outline: 3px solid var(--quiz-accent-2);
      }

      .quiz-answer.is-wrong {
        outline: 3px solid #ff595e;
      }

      .quiz-answer img {
        width: 100%;
        border-radius: 14px;
        object-fit: cover;
      }

      .quiz-answer audio {
        width: 100%;
      }

      .quiz-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
      }

      .quiz-btn {
        border: none;
        border-radius: 999px;
        padding: 0.6rem 1.4rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        background: var(--quiz-accent);
        color: #ffffff;
      }

      .quiz-btn.secondary {
        background: #ffffff;
        color: var(--quiz-ink);
        border: 2px solid #ffd3b8;
      }

      .quiz-note {
        font-size: 0.9rem;
        opacity: 0.7;
      }

      @media (max-width: 600px) {
        .quiz-banner {
          flex-direction: column;
          align-items: flex-start;
        }
        .quiz-controls {
          flex-direction: column;
          align-items: stretch;
        }
        .quiz-btn {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <!-- Quiz generated with style: ${style.label} -->
    <!-- Replace the content inside each Quiz Page section. Keep only one data-correct="true". -->
    <main class="quiz-shell">
      <header class="quiz-banner">
        <h1>${quizTitle}</h1>
        <div class="quiz-progress" id="quiz-progress">Question 1 of ${questionCount}</div>
      </header>
      <section class="quiz-stage" id="quiz-stage">
${pages}
      </section>
      <div class="quiz-controls">
        <button class="quiz-btn secondary" id="prev-btn" type="button">Previous</button>
        <p class="quiz-note" id="quiz-note">Tap an answer to continue.</p>
        <button class="quiz-btn" id="next-btn" type="button">Next</button>
      </div>
    </main>
    <script>
      const pages = Array.from(document.querySelectorAll(".quiz-page"));
      const progress = document.getElementById("quiz-progress");
      const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");
      const note = document.getElementById("quiz-note");
      let current = 0;

      function updatePage() {
        pages.forEach((page, index) => {
          page.classList.toggle("active", index === current);
        });
        progress.textContent = `Question ${current + 1} of ${pages.length}`;
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === pages.length - 1;
        note.textContent = current === pages.length - 1 ? "Last question!" : "Tap an answer to continue.";
      }

      document.getElementById("quiz-stage").addEventListener("click", (event) => {
        const answer = event.target.closest(".quiz-answer");
        if (!answer) return;
        pages[current].querySelectorAll(".quiz-answer").forEach((btn) => {
          btn.classList.remove("is-correct", "is-wrong");
        });
        const isCorrect = answer.dataset.correct === "true";
        answer.classList.add(isCorrect ? "is-correct" : "is-wrong");
      });

      prevBtn.addEventListener("click", () => {
        if (current > 0) {
          current -= 1;
          updatePage();
        }
      });

      nextBtn.addEventListener("click", () => {
        if (current < pages.length - 1) {
          current += 1;
          updatePage();
        }
      });

      updatePage();
    </script>
  </body>
</html>`;

  output.value = template;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(output.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy to clipboard";
    }, 1500);
  } catch (error) {
    copyBtn.textContent = "Copy failed";
  }
}

function downloadHtml() {
  const blob = new Blob([output.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quiz.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateQuizHtml();
});

copyBtn.addEventListener("click", copyToClipboard);
downloadBtn.addEventListener("click", downloadHtml);

// Initial generation on load.
generateQuizHtml();
