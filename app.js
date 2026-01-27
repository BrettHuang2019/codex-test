const themes = ["brutal", "noir", "terminal", "glass", "editorial"];
const root = document.documentElement;
const cards = document.querySelectorAll(".theme-card");
const statusEl = document.getElementById("net-status");
const helloBtn = document.getElementById("hello-btn");
const helloOutput = document.getElementById("hello-output");
const counterValue = document.getElementById("counter-value");
const counterBtn = document.getElementById("counter-btn");
let count = 0;

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
    default:
      return "#0b0b0b";
  }
}

cards.forEach((card) => {
  card.addEventListener("click", () => setTheme(card.dataset.theme));
});

const saved = localStorage.getItem("pwa-theme");
if (saved) setTheme(saved);

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
