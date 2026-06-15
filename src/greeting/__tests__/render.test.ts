import { describe, it, expect, beforeEach, vi } from "vitest";

describe("render", () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '<div id="widgets"></div>';
  });

  async function loadRender() {
    return await import("../render");
  }

  it("creates the widget element in #widgets", async () => {
    const { updateDisplay } = await loadRender();
    updateDisplay("2:35 PM", "Good afternoon");

    const widget = document.querySelector(".greeting-widget");
    expect(widget).toBeTruthy();
    expect(document.getElementById("widgets")?.contains(widget!)).toBe(true);
  });

  it("sets time and greeting text correctly", async () => {
    const { updateDisplay } = await loadRender();
    updateDisplay("10:30 AM", "Good morning");

    const timeEl = document.querySelector(".greeting-widget__time");
    const greetingEl = document.querySelector(".greeting-widget__greeting");

    expect(timeEl?.textContent).toBe("10:30 AM");
    expect(greetingEl?.textContent).toBe("Good morning");
  });

  it("updates text on subsequent calls without creating duplicates", async () => {
    const { updateDisplay } = await loadRender();
    updateDisplay("10:30 AM", "Good morning");
    updateDisplay("2:00 PM", "Good afternoon");

    const widgets = document.querySelectorAll(".greeting-widget");
    expect(widgets.length).toBe(1);

    const timeEl = document.querySelector(".greeting-widget__time");
    expect(timeEl?.textContent).toBe("2:00 PM");
  });

  it("adds the visible class when show() is called", async () => {
    const { updateDisplay, show } = await loadRender();
    updateDisplay("5:00 PM", "Good evening");
    show();

    const widget = document.querySelector(".greeting-widget");
    expect(widget?.classList.contains("visible")).toBe(true);
  });

  it("falls back to document.body when #widgets doesn't exist", async () => {
    document.body.innerHTML = "";
    const { updateDisplay } = await loadRender();
    updateDisplay("9:00 PM", "Good night");

    const widget = document.querySelector(".greeting-widget");
    expect(widget).toBeTruthy();
    expect(document.body.contains(widget!)).toBe(true);
  });
});
