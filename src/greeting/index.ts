import { injectStyles } from "./style";
import { getGreeting, formatTime } from "./greeting";
import { updateDisplay, show } from "./render";

const UPDATE_INTERVAL = 60_000; // 1 minute

function tick(): void {
  const now = new Date();
  updateDisplay(formatTime(now), getGreeting(now.getHours()));
}

export function initGreeting(): void {
  injectStyles();
  tick();

  // Fade in after a brief delay to ensure DOM is ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      show();
    });
  });

  // Update every minute
  setInterval(tick, UPDATE_INTERVAL);

  // Re-sync when tab becomes visible (handles sleep/background)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      tick();
    }
  });
}
