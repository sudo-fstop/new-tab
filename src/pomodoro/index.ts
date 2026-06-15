import { injectStyles } from "./style";
import { createWidget, updateWidget, flashWidget, show } from "./render";
import {
  createInitialState,
  start,
  pause,
  reset,
  tick,
  completePhase,
  saveState,
  loadState,
  saveSessions,
  loadSessions,
  type TimerState,
} from "./timer";
import { playBeep } from "./audio";

const TICK_INTERVAL = 250;

export function initPomodoro(): void {
  injectStyles();

  let state: TimerState = loadState() || createInitialState();
  state.sessions = loadSessions();

  const el = createWidget();
  updateWidget(el, state);

  // If state was running, tick immediately to catch up
  if (state.status === "running") {
    const result = tick(state);
    state = result.state;
    if (result.completed) {
      playBeep();
      flashWidget(el);
      state = completePhase(state);
      saveSessions(state.sessions);
    }
  }

  updateWidget(el, state);

  // Tick loop
  setInterval(() => {
    if (state.status !== "running") return;
    const result = tick(state);
    state = result.state;
    updateWidget(el, state);
    if (result.completed) {
      playBeep();
      flashWidget(el);
      state = completePhase(state);
      saveSessions(state.sessions);
      saveState(state);
      updateWidget(el, state);
    }
  }, TICK_INTERVAL);

  // Button handlers via event delegation
  el.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const action = target.dataset.action;
    if (!action) return;

    switch (action) {
      case "start":
        state = start(state);
        break;
      case "pause":
        state = pause(state);
        break;
      case "reset":
        state = reset(state);
        break;
    }
    saveState(state);
    updateWidget(el, state);
  });

  // Persist on visibility change
  document.addEventListener("visibilitychange", () => {
    saveState(state);
    if (document.visibilityState === "visible" && state.status === "running") {
      const result = tick(state);
      state = result.state;
      if (result.completed) {
        playBeep();
        flashWidget(el);
        state = completePhase(state);
        saveSessions(state.sessions);
        saveState(state);
      }
      updateWidget(el, state);
    }
  });

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      show(el);
    });
  });
}
