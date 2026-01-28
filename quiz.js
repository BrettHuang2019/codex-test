const form = document.getElementById("quiz-form");
const titleInput = document.getElementById("quiz-title");
const styleInput = document.getElementById("quiz-style");
const questionsInput = document.getElementById("quiz-questions");
const answersInput = document.getElementById("quiz-answers");
const hintsInput = document.getElementById("quiz-hints");
const output = document.getElementById("quiz-html");
const copyBtn = document.getElementById("copy-html");
const downloadBtn = document.getElementById("download-html");
const gameStartBtn = document.getElementById("game-start");
const gameRerollBtn = document.getElementById("game-reroll");
const gameScore = document.getElementById("game-score");
const gameStreak = document.getElementById("game-streak");
const gameLives = document.getElementById("game-lives");
const gameLevel = document.getElementById("game-level");
const gameTimerText = document.getElementById("game-timer-text");
const gameTimerBar = document.getElementById("game-timer-bar");
const gameQuestionTitle = document.getElementById("game-question-title");
const gameQuestionText = document.getElementById("game-question-text");
const gameQuestionHint = document.getElementById("game-question-hint");
const gameAnswers = document.getElementById("game-answers");
const gameMessage = document.getElementById("game-message");
const gameSummary = document.getElementById("game-summary");

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

const GAME_TIME = 12;
const GAME_LIVES = 3;

const MOCK_QUESTIONS = [
  {
    prompt: "Which animal is the fastest land runner?",
    hint: "It can hit speeds over 60 mph in short bursts.",
    answers: [
      { label: "Cheetah", correct: true },
      { label: "Lion", correct: false },
      { label: "Gazelle", correct: false },
      { label: "Horse", correct: false },
      { label: "Ostrich", correct: false },
      { label: "Pronghorn", correct: false }
    ]
  },
  {
    prompt: "What is the largest animal on Earth?",
    hint: "It lives in the ocean and can be over 90 feet long.",
    answers: [
      { label: "Blue whale", correct: true },
      { label: "Elephant", correct: false },
      { label: "Giraffe", correct: false },
      { label: "Great white shark", correct: false },
      { label: "Hippopotamus", correct: false },
      { label: "Orca", correct: false }
    ]
  },
  {
    prompt: "Which animal is known for changing its skin color to blend in?",
    hint: "This reptile uses camouflage to hide and hunt.",
    answers: [
      { label: "Chameleon", correct: true },
      { label: "Iguana", correct: false },
      { label: "Gecko", correct: false },
      { label: "Anole", correct: false },
      { label: "Komodo dragon", correct: false },
      { label: "Salamander", correct: false }
    ]
  },
  {
    prompt: "Which bird is famous for mimicking human speech?",
    hint: "It is a highly intelligent parrot species.",
    answers: [
      { label: "African grey parrot", correct: true },
      { label: "Bald eagle", correct: false },
      { label: "Penguin", correct: false },
      { label: "Peacock", correct: false },
      { label: "Toucan", correct: false },
      { label: "Flamingo", correct: false }
    ]
  },
  {
    prompt: "Which mammal can fly?",
    hint: "It uses wings made of stretched skin.",
    answers: [
      { label: "Bat", correct: true },
      { label: "Flying squirrel", correct: false },
      { label: "Sugar glider", correct: false },
      { label: "Penguin", correct: false },
      { label: "Ostrich", correct: false },
      { label: "Platypus", correct: false }
    ]
  },
  {
    prompt: "What is a group of lions called?",
    hint: "It starts with the letter P.",
    answers: [
      { label: "Pride", correct: true },
      { label: "Pack", correct: false },
      { label: "Herd", correct: false },
      { label: "Flock", correct: false },
      { label: "Colony", correct: false },
      { label: "School", correct: false }
    ]
  },
  {
    prompt: "Which animal is famous for building dams?",
    hint: "It uses sticks and mud to slow rivers.",
    answers: [
      { label: "Beaver", correct: true },
      { label: "Otter", correct: false },
      { label: "Muskrat", correct: false },
      { label: "Raccoon", correct: false },
      { label: "Moose", correct: false },
      { label: "Badger", correct: false }
    ]
  },
  {
    prompt: "Which animal has black and white stripes?",
    hint: "It looks like a horse with bold patterns.",
    answers: [
      { label: "Zebra", correct: true },
      { label: "Skunk", correct: false },
      { label: "Tiger", correct: false },
      { label: "Okapi", correct: false },
      { label: "Dalmatian", correct: false },
      { label: "Panda", correct: false }
    ]
  },
  {
    prompt: "What is the slowest moving mammal?",
    hint: "It spends most of its life hanging in trees.",
    answers: [
      { label: "Sloth", correct: true },
      { label: "Koala", correct: false },
      { label: "Pangolin", correct: false },
      { label: "Armadillo", correct: false },
      { label: "Hedgehog", correct: false },
      { label: "Lemur", correct: false }
    ]
  },
  {
    prompt: "Which animal is known for its long neck?",
    hint: "It is the tallest land animal.",
    answers: [
      { label: "Giraffe", correct: true },
      { label: "Camel", correct: false },
      { label: "Llama", correct: false },
      { label: "Moose", correct: false },
      { label: "Alpaca", correct: false },
      { label: "Ostrich", correct: false }
    ]
  },
  {
    prompt: "Which sea creature has eight arms?",
    hint: "It is a clever invertebrate.",
    answers: [
      { label: "Octopus", correct: true },
      { label: "Squid", correct: false },
      { label: "Starfish", correct: false },
      { label: "Jellyfish", correct: false },
      { label: "Crab", correct: false },
      { label: "Lobster", correct: false }
    ]
  },
  {
    prompt: "Which animal is known as the king of the jungle?",
    hint: "It is a big cat with a mane.",
    answers: [
      { label: "Lion", correct: true },
      { label: "Tiger", correct: false },
      { label: "Leopard", correct: false },
      { label: "Jaguar", correct: false },
      { label: "Cheetah", correct: false },
      { label: "Cougar", correct: false }
    ]
  }
];

let gameDeck = [];
let gameState = {
  currentIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lives: GAME_LIVES,
  timeLeft: GAME_TIME,
  timerId: null,
  inProgress: false,
  answered: false
};

function repeat(count, mapper) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    items.push(mapper(i));
  }
  return items.join("\n");
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildQuizModel() {
  const quizTitle = titleInput.value.trim() || "My Quiz";
  const questionCount = Math.max(1, Number.parseInt(questionsInput.value, 10) || 1);
  const answerCount = Math.max(2, Number.parseInt(answersInput.value, 10) || 2);
  const style = styleMap[styleInput.value] || styleMap["text-text"];
  const includeHints = hintsInput.value === "yes";

  const questions = Array.from({ length: questionCount }, (_, index) => {
    const qNumber = index + 1;
    const mock = MOCK_QUESTIONS[index % MOCK_QUESTIONS.length];
    const hint = includeHints ? mock.hint : "";
    const answers = mock.answers.slice(0, answerCount);
    return {
      id: qNumber,
      title: quizTitle,
      prompt: mock.prompt,
      hint,
      answers,
      style
    };
  });

  return {
    title: quizTitle,
    questionCount,
    answerCount,
    style,
    includeHints,
    questions
  };
}

function questionMarkup(question, includeHints) {
  const questionText = question.prompt;
  const hint = includeHints && question.hint ? `\n      <p class="quiz-hint">${question.hint}</p>` : "";

  const mediaBlocks = [];
  if (question.style.question.video) {
    mediaBlocks.push(
      "      <video class=\"quiz-media\" controls poster=\"https://placehold.co/720x405?text=Question+Video\">",
      "        <source src=\"path/to/question-video.mp4\" type=\"video/mp4\" />",
      "        Your browser does not support the video tag.",
      "      </video>"
    );
  }
  if (question.style.question.audio) {
    mediaBlocks.push(
      "      <audio class=\"quiz-audio\" controls>",
      "        <source src=\"path/to/question-audio.mp3\" type=\"audio/mpeg\" />",
      "        Your browser does not support the audio element.",
      "      </audio>"
    );
  }

  const textBlock = question.style.question.text
    ? `      <p class="quiz-question">${questionText}</p>${hint}`
    : "";

  return [textBlock, mediaBlocks.join("\n")].filter(Boolean).join("\n");
}

function answerMarkup(style, answers) {
  return repeat(answers.length, (index) => {
    const answer = answers[index];
    const isCorrect = answer.correct ? "true" : "false";
    const answerLabel = answer.label;
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
  const model = buildQuizModel();
  const { title: quizTitle, questionCount, answerCount, style, includeHints } = model;

  const pages = repeat(questionCount, (index) => {
    const qNumber = index + 1;
    const question = model.questions[index];
    return `      <section class=\"quiz-page\" data-page=\"${qNumber}\">
        <h2 class=\"quiz-page-title\">${quizTitle}</h2>
        <div class=\"quiz-question-wrap\">
${questionMarkup(question, includeHints)}
        </div>
        <div class=\"quiz-answers\">
${answerMarkup(style, question.answers)}
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
        progress.textContent = "Question " + (current + 1) + " of " + pages.length;
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
  primeGame(model);
}

function primeGame(model) {
  gameDeck = shuffle(
    model.questions.map((question) => {
      return {
        ...question,
        answers: shuffle(question.answers)
      };
    })
  );
  resetGameState();
  renderGamePreview(model);
}

function resetGameState() {
  if (gameState.timerId) {
    clearInterval(gameState.timerId);
  }
  gameState = {
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    lives: GAME_LIVES,
    timeLeft: GAME_TIME,
    timerId: null,
    inProgress: false,
    answered: false
  };
  updateGameStats();
  updateTimerDisplay();
}

function renderGamePreview(model) {
  gameQuestionTitle.textContent = model ? model.title : "Ready?";
  gameQuestionText.textContent = model
    ? `You have ${model.questionCount} questions waiting.`
    : "Generate a quiz and hit start to play.";
  gameQuestionHint.textContent = model && model.includeHints ? "Hints are on for this run." : "";
  gameAnswers.innerHTML = "";
  gameMessage.textContent = "No game running yet.";
  gameSummary.hidden = true;
}

function updateGameStats() {
  gameScore.textContent = gameState.score;
  gameStreak.textContent = gameState.streak;
  gameLives.textContent = "❤".repeat(Math.max(gameState.lives, 0));
  const displayIndex = gameState.inProgress ? gameState.currentIndex + 1 : 0;
  gameLevel.textContent = `${Math.min(displayIndex, gameDeck.length)}/${gameDeck.length}`;
}

function updateTimerDisplay() {
  gameTimerText.textContent = `${gameState.timeLeft}s`;
  const percent = (gameState.timeLeft / GAME_TIME) * 100;
  gameTimerBar.style.width = `${Math.max(0, percent)}%`;
}

function buildGameAnswer(answer, index, style) {
  const parts = [];
  if (style.answer.image) {
    parts.push(
      `<img src="https://placehold.co/240x160?text=${encodeURIComponent(answer.label)}" alt="${answer.label}" />`
    );
  }
  if (style.answer.text) {
    parts.push(`<span>${answer.label}</span>`);
  }
  if (style.answer.audio) {
    parts.push(`<span class="quiz-game-media">🔊 Sound clue</span>`);
  }
  return `<button class="quiz-game-answer" data-index="${index}" data-correct="${answer.correct}">
${parts.join("\n")}
  </button>`;
}

function renderGameQuestion() {
  const question = gameDeck[gameState.currentIndex];
  if (!question) {
    endGame();
    return;
  }

  gameQuestionTitle.textContent = `Level ${gameState.currentIndex + 1}`;
  gameQuestionText.textContent = question.prompt;
  gameQuestionHint.textContent = question.hint;
  gameAnswers.innerHTML = question.answers
    .map((answer, index) => buildGameAnswer(answer, index, question.style))
    .join("\n");
  gameMessage.textContent = "Pick the best answer!";
  gameSummary.hidden = true;
  updateGameStats();
  updateTimerDisplay();
}

function startTimer() {
  if (gameState.timerId) {
    clearInterval(gameState.timerId);
  }
  gameState.timerId = setInterval(() => {
    if (!gameState.inProgress || gameState.answered) {
      return;
    }
    gameState.timeLeft -= 1;
    updateTimerDisplay();
    if (gameState.timeLeft <= 0) {
      handleAnswer(null);
    }
  }, 1000);
}

function handleAnswer(answerIndex) {
  if (!gameState.inProgress || gameState.answered) {
    return;
  }

  gameState.answered = true;
  if (gameState.timerId) {
    clearInterval(gameState.timerId);
  }

  const answers = gameDeck[gameState.currentIndex].answers;
  const answer = answers[answerIndex];
  const isCorrect = answer ? answer.correct : false;
  const bonus = Math.max(0, gameState.timeLeft) * 5;
  const baseScore = 100;

  if (isCorrect) {
    gameState.score += baseScore + bonus + gameState.streak * 10;
    gameState.streak += 1;
    gameState.bestStreak = Math.max(gameState.bestStreak, gameState.streak);
    gameMessage.textContent = `Correct! +${baseScore + bonus}`;
  } else {
    gameState.lives -= 1;
    gameState.streak = 0;
    gameMessage.textContent = answer ? "Oops! Try the next one." : "Time's up! Keep going.";
  }

  const buttons = Array.from(gameAnswers.querySelectorAll(".quiz-game-answer"));
  buttons.forEach((button) => {
    const correct = button.dataset.correct === "true";
    button.classList.toggle("correct", correct);
    if (answerIndex !== null) {
      const chosen = Number.parseInt(button.dataset.index, 10) === answerIndex;
      if (chosen && !correct) {
        button.classList.add("wrong");
      }
    }
  });

  updateGameStats();

  setTimeout(() => {
    if (gameState.lives <= 0) {
      endGame();
      return;
    }
    gameState.currentIndex += 1;
    if (gameState.currentIndex >= gameDeck.length) {
      endGame();
      return;
    }
    gameState.timeLeft = GAME_TIME;
    gameState.answered = false;
    renderGameQuestion();
    startTimer();
  }, 1200);
}

function startGame() {
  if (!gameDeck.length) {
    primeGame(buildQuizModel());
  }
  resetGameState();
  gameState.inProgress = true;
  gameState.timeLeft = GAME_TIME;
  renderGameQuestion();
  startTimer();
}

function endGame() {
  gameState.inProgress = false;
  if (gameState.timerId) {
    clearInterval(gameState.timerId);
  }
  gameMessage.textContent = "Game over!";
  gameSummary.hidden = false;
  gameSummary.innerHTML = `
    <h3>Adventure complete!</h3>
    <p>You scored <strong>${gameState.score}</strong> points with a best streak of <strong>${gameState.bestStreak}</strong>.</p>
    <p>Press start to play again or remix to reshuffle the questions.</p>
  `;
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
gameStartBtn.addEventListener("click", startGame);
gameRerollBtn.addEventListener("click", () => {
  primeGame(buildQuizModel());
});
gameAnswers.addEventListener("click", (event) => {
  const button = event.target.closest(".quiz-game-answer");
  if (!button) return;
  const index = Number.parseInt(button.dataset.index, 10);
  handleAnswer(Number.isNaN(index) ? null : index);
});

// Initial generation on load.
generateQuizHtml();
