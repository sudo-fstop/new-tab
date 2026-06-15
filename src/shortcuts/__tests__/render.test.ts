import { describe, it, expect, beforeEach } from "vitest";
import { registerShortcut } from "../registry";
import {
  createHelpOverlay,
  toggleHelpOverlay,
  isHelpOverlayVisible,
} from "../render";

describe("shortcuts/render", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("createHelpOverlay returns element with correct class", () => {
    const overlay = createHelpOverlay();
    expect(overlay.classList.contains("shortcuts-overlay")).toBe(true);
  });

  it("overlay contains shortcut rows matching registered shortcuts", () => {
    registerShortcut({
      key: "r",
      description: "Test render shortcut",
      handler: () => {},
    });

    const overlay = createHelpOverlay();
    const rows = overlay.querySelectorAll(".shortcuts-overlay__row");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("toggleHelpOverlay adds overlay to DOM when not present", () => {
    expect(isHelpOverlayVisible()).toBe(false);
    toggleHelpOverlay();
    expect(isHelpOverlayVisible()).toBe(true);
  });

  it("toggleHelpOverlay removes overlay from DOM when present", () => {
    toggleHelpOverlay();
    expect(isHelpOverlayVisible()).toBe(true);
    toggleHelpOverlay();
    expect(isHelpOverlayVisible()).toBe(false);
  });

  it("isHelpOverlayVisible returns correct boolean", () => {
    expect(isHelpOverlayVisible()).toBe(false);
    toggleHelpOverlay();
    expect(isHelpOverlayVisible()).toBe(true);
    toggleHelpOverlay();
    expect(isHelpOverlayVisible()).toBe(false);
  });

  it("close button removes overlay", () => {
    toggleHelpOverlay();
    const closeBtn =
      document.querySelector<HTMLButtonElement>(".shortcuts-overlay__close");
    expect(closeBtn).not.toBeNull();
    closeBtn!.click();
    expect(isHelpOverlayVisible()).toBe(false);
  });

  it("clicking backdrop (outside card) removes overlay", () => {
    toggleHelpOverlay();
    const overlay = document.querySelector<HTMLElement>(".shortcuts-overlay");
    expect(overlay).not.toBeNull();
    overlay!.click();
    expect(isHelpOverlayVisible()).toBe(false);
  });
});
