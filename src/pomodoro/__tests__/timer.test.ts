import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createInitialState,
  formatTime,
  start,
  pause,
  reset,
  tick,
  completePhase,
  saveState,
  loadState,
  saveSessions,
  loadSessions,
  WORK_DURATION_MS,
  BREAK_DURATION_MS,
} from "../timer";

describe("formatTime", () => {
  it("formats 25 minutes correctly", () => {
    expect(formatTime(25 * 60 * 1000)).toBe("25:00");
  });

  it("formats zero correctly", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats 1 minute 1 second correctly", () => {
    expect(formatTime(61000)).toBe("01:01");
  });

  it("formats 5 minutes correctly", () => {
    expect(formatTime(5 * 60 * 1000)).toBe("05:00");
  });

  it("clamps negative values to 00:00", () => {
    expect(formatTime(-1000)).toBe("00:00");
  });
});

describe("createInitialState", () => {
  it("returns correct initial state", () => {
    const state = createInitialState();
    expect(state.mode).toBe("work");
    expect(state.status).toBe("idle");
    expect(state.remainingMs).toBe(WORK_DURATION_MS);
    expect(state.endTime).toBeNull();
    expect(state.sessions).toBe(0);
  });
});

describe("start", () => {
  it("sets status to running and endTime to future", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = createInitialState();
    const started = start(state);

    expect(started.status).toBe("running");
    expect(started.endTime).toBe(now + WORK_DURATION_MS);

    vi.restoreAllMocks();
  });
});

describe("pause", () => {
  it("sets status to paused with remaining time", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = start(createInitialState());

    vi.spyOn(Date, "now").mockReturnValue(now + 5000);

    const paused = pause(state);
    expect(paused.status).toBe("paused");
    expect(paused.endTime).toBeNull();
    expect(paused.remainingMs).toBe(WORK_DURATION_MS - 5000);

    vi.restoreAllMocks();
  });
});

describe("reset", () => {
  it("resets to idle with full duration for work mode", () => {
    const state = start(createInitialState());
    const resetState = reset(state);

    expect(resetState.status).toBe("idle");
    expect(resetState.remainingMs).toBe(WORK_DURATION_MS);
    expect(resetState.endTime).toBeNull();
  });

  it("resets to idle with full duration for break mode", () => {
    const state = { ...createInitialState(), mode: "break" as const };
    const resetState = reset(state);

    expect(resetState.status).toBe("idle");
    expect(resetState.remainingMs).toBe(BREAK_DURATION_MS);
  });
});

describe("tick", () => {
  it("updates remainingMs when running with time left", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = start(createInitialState());

    vi.spyOn(Date, "now").mockReturnValue(now + 1000);

    const result = tick(state);
    expect(result.completed).toBe(false);
    expect(result.state.remainingMs).toBe(WORK_DURATION_MS - 1000);

    vi.restoreAllMocks();
  });

  it("returns completed true when time expired", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = start(createInitialState());

    vi.spyOn(Date, "now").mockReturnValue(now + WORK_DURATION_MS + 1000);

    const result = tick(state);
    expect(result.completed).toBe(true);
    expect(result.state.remainingMs).toBe(0);

    vi.restoreAllMocks();
  });

  it("returns unchanged state when not running", () => {
    const state = createInitialState();
    const result = tick(state);
    expect(result.completed).toBe(false);
    expect(result.state).toEqual(state);
  });
});

describe("completePhase", () => {
  it("switches from work to break and increments sessions", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = { ...createInitialState(), status: "running" as const };
    const next = completePhase(state);

    expect(next.mode).toBe("break");
    expect(next.sessions).toBe(1);
    expect(next.remainingMs).toBe(BREAK_DURATION_MS);
    expect(next.status).toBe("running");

    vi.restoreAllMocks();
  });

  it("switches from break to work without incrementing sessions", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const state = {
      ...createInitialState(),
      mode: "break" as const,
      status: "running" as const,
      sessions: 2,
    };
    const next = completePhase(state);

    expect(next.mode).toBe("work");
    expect(next.sessions).toBe(2);
    expect(next.remainingMs).toBe(WORK_DURATION_MS);

    vi.restoreAllMocks();
  });
});

describe("localStorage persistence", () => {
  const store: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };

  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal("localStorage", mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saveState / loadState round-trip", () => {
    const state = createInitialState();
    saveState(state);
    const loaded = loadState();
    expect(loaded).toEqual(state);
  });

  it("loadState returns null when no data", () => {
    expect(loadState()).toBeNull();
  });

  it("saveSessions / loadSessions round-trip", () => {
    saveSessions(5);
    expect(loadSessions()).toBe(5);
  });

  it("loadSessions returns 0 when no data", () => {
    expect(loadSessions()).toBe(0);
  });
});
