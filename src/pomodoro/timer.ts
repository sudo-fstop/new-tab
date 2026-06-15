export type TimerMode = "work" | "break";
export type TimerStatus = "idle" | "running" | "paused";

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  remainingMs: number;
  endTime: number | null;
  sessions: number;
}

export const WORK_DURATION_MS = 25 * 60 * 1000;
export const BREAK_DURATION_MS = 5 * 60 * 1000;

const STATE_KEY = "pomodoro-state";
const SESSIONS_KEY = "pomodoro-sessions";

export function createInitialState(): TimerState {
  return {
    mode: "work",
    status: "idle",
    remainingMs: WORK_DURATION_MS,
    endTime: null,
    sessions: 0,
  };
}

export function formatTime(ms: number): string {
  if (ms < 0) ms = 0;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function start(state: TimerState): TimerState {
  return {
    ...state,
    status: "running",
    endTime: Date.now() + state.remainingMs,
  };
}

export function pause(state: TimerState): TimerState {
  return {
    ...state,
    status: "paused",
    remainingMs: Math.max(0, state.endTime! - Date.now()),
    endTime: null,
  };
}

export function reset(state: TimerState): TimerState {
  return {
    ...state,
    status: "idle",
    remainingMs: state.mode === "work" ? WORK_DURATION_MS : BREAK_DURATION_MS,
    endTime: null,
  };
}

export function tick(state: TimerState): { state: TimerState; completed: boolean } {
  if (state.status !== "running" || state.endTime === null) {
    return { state, completed: false };
  }
  const remainingMs = Math.max(0, state.endTime - Date.now());
  const completed = remainingMs <= 0;
  return {
    state: { ...state, remainingMs },
    completed,
  };
}

export function completePhase(state: TimerState): TimerState {
  const wasWork = state.mode === "work";
  const nextMode: TimerMode = wasWork ? "break" : "work";
  const sessions = wasWork ? state.sessions + 1 : state.sessions;
  const remainingMs = nextMode === "work" ? WORK_DURATION_MS : BREAK_DURATION_MS;
  return {
    mode: nextMode,
    status: "running",
    remainingMs,
    endTime: Date.now() + remainingMs,
    sessions,
  };
}

export function saveState(state: TimerState): void {
  localStorage.setItem(
    STATE_KEY,
    JSON.stringify({
      mode: state.mode,
      status: state.status,
      remainingMs: state.remainingMs,
      endTime: state.endTime,
      sessions: state.sessions,
    }),
  );
}

export function loadState(): TimerState | null {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode,
      status: parsed.status,
      remainingMs: parsed.remainingMs,
      endTime: parsed.endTime,
      sessions: parsed.sessions,
    };
  } catch {
    return null;
  }
}

export function saveSessions(count: number): void {
  localStorage.setItem(SESSIONS_KEY, String(count));
}

export function loadSessions(): number {
  return parseInt(localStorage.getItem(SESSIONS_KEY) || "0", 10);
}
