import { describe, it, expect, beforeEach } from "vitest";
import { createWidget, updateWidget, show, flashWidget } from "../render";
import { createInitialState, WORK_DURATION_MS, type TimerState } from "../timer";

describe("createWidget", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="widgets"></div>';
  });

  it("creates element with pomodoro-widget class", () => {
    const el = createWidget();
    expect(el.classList.contains("pomodoro-widget")).toBe(true);
  });

  it("contains time display", () => {
    const el = createWidget();
    const timeEl = el.querySelector(".pomodoro-widget__time");
    expect(timeEl).not.toBeNull();
    expect(timeEl!.textContent).toBe("25:00");
  });

  it("contains mode label", () => {
    const el = createWidget();
    const modeEl = el.querySelector(".pomodoro-widget__mode");
    expect(modeEl).not.toBeNull();
    expect(modeEl!.textContent).toBe("Work");
  });

  it("contains buttons", () => {
    const el = createWidget();
    const startBtn = el.querySelector('[data-action="start"]');
    const pauseBtn = el.querySelector('[data-action="pause"]');
    const resetBtn = el.querySelector('[data-action="reset"]');
    expect(startBtn).not.toBeNull();
    expect(pauseBtn).not.toBeNull();
    expect(resetBtn).not.toBeNull();
  });

  it("contains sessions counter", () => {
    const el = createWidget();
    const sessionsEl = el.querySelector(".pomodoro-widget__sessions");
    expect(sessionsEl).not.toBeNull();
    expect(sessionsEl!.textContent).toBe("Sessions: 0");
  });

  it("appends to #widgets container", () => {
    const el = createWidget();
    const container = document.getElementById("widgets");
    expect(container!.contains(el)).toBe(true);
  });
});

describe("updateWidget", () => {
  let el: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="widgets"></div>';
    el = createWidget();
  });

  it("updates time display", () => {
    const state: TimerState = {
      ...createInitialState(),
      remainingMs: 5 * 60 * 1000,
    };
    updateWidget(el, state);
    const timeEl = el.querySelector(".pomodoro-widget__time");
    expect(timeEl!.textContent).toBe("05:00");
  });

  it("updates mode label and data-mode attribute", () => {
    const state: TimerState = {
      ...createInitialState(),
      mode: "break",
    };
    updateWidget(el, state);
    expect(el.dataset.mode).toBe("break");
    const modeEl = el.querySelector(".pomodoro-widget__mode");
    expect(modeEl!.textContent).toBe("Break");
  });

  it("updates sessions count", () => {
    const state: TimerState = {
      ...createInitialState(),
      sessions: 3,
    };
    updateWidget(el, state);
    const sessionsEl = el.querySelector(".pomodoro-widget__sessions");
    expect(sessionsEl!.textContent).toBe("Sessions: 3");
  });

  it("shows Start and hides Pause when idle", () => {
    const state = createInitialState();
    updateWidget(el, state);
    const startBtn = el.querySelector<HTMLButtonElement>('[data-action="start"]');
    const pauseBtn = el.querySelector<HTMLButtonElement>('[data-action="pause"]');
    expect(startBtn!.hidden).toBe(false);
    expect(pauseBtn!.hidden).toBe(true);
  });

  it("hides Start and shows Pause when running", () => {
    const state: TimerState = {
      ...createInitialState(),
      status: "running",
      endTime: Date.now() + WORK_DURATION_MS,
    };
    updateWidget(el, state);
    const startBtn = el.querySelector<HTMLButtonElement>('[data-action="start"]');
    const pauseBtn = el.querySelector<HTMLButtonElement>('[data-action="pause"]');
    expect(startBtn!.hidden).toBe(true);
    expect(pauseBtn!.hidden).toBe(false);
  });
});

describe("show", () => {
  it("adds visible class", () => {
    document.body.innerHTML = '<div id="widgets"></div>';
    const el = createWidget();
    expect(el.classList.contains("visible")).toBe(false);
    show(el);
    expect(el.classList.contains("visible")).toBe(true);
  });
});

describe("flashWidget", () => {
  it("adds flash class", () => {
    document.body.innerHTML = '<div id="widgets"></div>';
    const el = createWidget();
    flashWidget(el);
    expect(el.classList.contains("flash")).toBe(true);
  });
});
