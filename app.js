const themes = ["brutal", "noir", "terminal", "glass", "editorial", "sunset", "minimal"];
const root = document.documentElement;
const cards = document.querySelectorAll(".theme-card");
const statusEl = document.getElementById("net-status");
const helloBtn = document.getElementById("hello-btn");
const helloOutput = document.getElementById("hello-output");
const counterValue = document.getElementById("counter-value");
const counterBtn = document.getElementById("counter-btn");
let count = 0;
const soundState = { ctx: null, master: null };

function ensureAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!soundState.ctx) {
    soundState.ctx = new AudioContext();
    soundState.master = soundState.ctx.createGain();
    soundState.master.gain.value = 0.18;
    soundState.master.connect(soundState.ctx.destination);
  }
  if (soundState.ctx.state === "suspended") {
    soundState.ctx.resume();
  }
  return soundState.ctx;
}

function playTone({ frequency, duration, type = "sine", gain = 0.12 }) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = type;
  osc.frequency.value = frequency;
  amp.gain.setValueAtTime(0, now);
  amp.gain.linearRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(soundState.master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playClickSound() {
  playTone({ frequency: 720, duration: 0.08, type: "triangle", gain: 0.1 });
}

function setTheme(theme) {
  if (!themes.includes(theme)) return;
  root.dataset.theme = theme;
  localStorage.setItem("pwa-theme", theme);
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", themeColor(theme));
}

function themeColor(theme) {
  switch (theme) {
    case "terminal":
      return "#0a1b12";
    case "noir":
      return "#0b1022";
    case "glass":
      return "#c7f0ff";
    case "editorial":
      return "#3b2312";
    case "sunset":
      return "#102a2e";
    case "minimal":
      return "#f4f4f1";
    default:
      return "#0b0b0b";
  }
}

cards.forEach((card) => {
  card.addEventListener("click", () => setTheme(card.dataset.theme));
});

const saved = localStorage.getItem("pwa-theme");
if (saved) setTheme(saved);

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  playClickSound();
});

function updateStatus() {
  statusEl.textContent = navigator.onLine ? "Online" : "Offline (cached)";
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
updateStatus();

helloBtn.addEventListener("click", () => {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  helloOutput.textContent = `Hello from your PWA at ${stamp}.`;
});

counterBtn.addEventListener("click", () => {
  count += 1;
  counterValue.textContent = `${count}`;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failing should not block the app.
    });
  });
}
