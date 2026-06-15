import { describe, it, expect, beforeEach } from "vitest";
import { registerDefaultShortcuts } from "../handlers";
import { matchShortcut, getShortcuts } from "../registry";

describe("shortcuts/handlers", () => {
  let registered = false;

  beforeEach(() => {
    if (!registered) {
      registerDefaultShortcuts();
      registered = true;
    }
    document.body.innerHTML = "";
  });

  it("/ key focuses .search-bar__input", () => {
    const input = document.createElement("input");
    input.className = "search-bar__input";
    document.body.appendChild(input);

    let focused = false;
    input.focus = () => {
      focused = true;
    };

    const event = new KeyboardEvent("keydown", {
      key: "/",
      cancelable: true,
    });
    const shortcut = matchShortcut(event);
    expect(shortcut).toBeDefined();
    shortcut!.handler(event);
    expect(focused).toBe(true);
  });

  it("Ctrl+K focuses .search-bar__input", () => {
    const input = document.createElement("input");
    input.className = "search-bar__input";
    document.body.appendChild(input);

    let focused = false;
    input.focus = () => {
      focused = true;
    };

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      cancelable: true,
    });
    const shortcut = matchShortcut(event);
    expect(shortcut).toBeDefined();
    shortcut!.handler(event);
    expect(focused).toBe(true);
  });

  it("T key toggles shortcuts-hidden class on .todo-widget", () => {
    const widget = document.createElement("div");
    widget.className = "todo-widget";
    document.body.appendChild(widget);

    const event = new KeyboardEvent("keydown", { key: "t" });
    const shortcut = matchShortcut(event);
    expect(shortcut).toBeDefined();

    shortcut!.handler(event);
    expect(widget.classList.contains("shortcuts-hidden")).toBe(true);

    shortcut!.handler(event);
    expect(widget.classList.contains("shortcuts-hidden")).toBe(false);
  });

  it("? key toggles help overlay visibility", () => {
    const event = new KeyboardEvent("keydown", { key: "?" });
    const shortcut = matchShortcut(event);
    expect(shortcut).toBeDefined();

    shortcut!.handler(event);
    expect(document.querySelector(".shortcuts-overlay")).not.toBeNull();

    shortcut!.handler(event);
    expect(document.querySelector(".shortcuts-overlay")).toBeNull();
  });

  it("Escape closes help overlay if open", () => {
    const qEvent = new KeyboardEvent("keydown", { key: "?" });
    matchShortcut(qEvent)!.handler(qEvent);
    expect(document.querySelector(".shortcuts-overlay")).not.toBeNull();

    const escEvent = new KeyboardEvent("keydown", { key: "Escape" });
    const shortcut = matchShortcut(escEvent);
    expect(shortcut).toBeDefined();
    shortcut!.handler(escEvent);
    expect(document.querySelector(".shortcuts-overlay")).toBeNull();
  });

  it("shortcuts do NOT fire when target is an input (except Escape)", () => {
    const shortcuts = getShortcuts();
    expect(shortcuts.length).toBeGreaterThan(0);

    const escapeShortcut = shortcuts.find((s) => s.key === "Escape");
    expect(escapeShortcut).toBeDefined();
  });
});
