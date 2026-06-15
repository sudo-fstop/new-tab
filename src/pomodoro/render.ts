import { formatTime, type TimerState } from "./timer";

export function createWidget(): HTMLElement {
  const el = document.createElement("div");
  el.className = "pomodoro-widget";
  el.innerHTML = `
    <div class="pomodoro-widget__mode">Work</div>
    <div class="pomodoro-widget__time">25:00</div>
    <div class="pomodoro-widget__controls">
      <button class="pomodoro-widget__btn" data-action="start">Start</button>
      <button class="pomodoro-widget__btn" data-action="pause" hidden>Pause</button>
      <button class="pomodoro-widget__btn" data-action="reset">Reset</button>
    </div>
    <div class="pomodoro-widget__sessions">Sessions: 0</div>
  `;

  const container = document.getElementById("widgets") || document.body;
  container.appendChild(el);
  return el;
}

export function updateWidget(el: HTMLElement, state: TimerState): void {
  el.dataset.mode = state.mode;

  const modeEl = el.querySelector(".pomodoro-widget__mode");
  if (modeEl) modeEl.textContent = state.mode === "work" ? "Work" : "Break";

  const timeEl = el.querySelector(".pomodoro-widget__time");
  if (timeEl) timeEl.textContent = formatTime(state.remainingMs);

  const sessionsEl = el.querySelector(".pomodoro-widget__sessions");
  if (sessionsEl) sessionsEl.textContent = `Sessions: ${state.sessions}`;

  const startBtn = el.querySelector<HTMLButtonElement>('[data-action="start"]');
  const pauseBtn = el.querySelector<HTMLButtonElement>('[data-action="pause"]');

  if (startBtn && pauseBtn) {
    if (state.status === "running") {
      startBtn.hidden = true;
      pauseBtn.hidden = false;
    } else {
      startBtn.hidden = false;
      pauseBtn.hidden = true;
    }
  }
}

export function flashWidget(el: HTMLElement): void {
  el.classList.add("flash");
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove("flash");
    },
    { once: true },
  );
}

export function show(el: HTMLElement): void {
  el.classList.add("visible");
}
