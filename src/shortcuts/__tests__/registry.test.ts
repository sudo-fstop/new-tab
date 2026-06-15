import { describe, it, expect, beforeEach } from "vitest";

describe("shortcuts/registry", () => {
  it("registerShortcut adds to the list and getShortcuts returns them", async () => {
    const { registerShortcut, getShortcuts } = await import("../registry");
    const initialLength = getShortcuts().length;

    registerShortcut({
      key: "a",
      description: "Test shortcut A",
      handler: () => {},
    });

    expect(getShortcuts().length).toBe(initialLength + 1);
    expect(getShortcuts()[getShortcuts().length - 1]!.key).toBe("a");
  });

  it("matchShortcut correctly matches by key (case-insensitive)", async () => {
    const { registerShortcut, matchShortcut } = await import("../registry");

    registerShortcut({
      key: "b",
      description: "Test shortcut B",
      handler: () => {},
    });

    const event = new KeyboardEvent("keydown", { key: "B" });
    const match = matchShortcut(event);
    expect(match).toBeDefined();
    expect(match!.key).toBe("b");
  });

  it("matchShortcut correctly matches Ctrl modifier", async () => {
    const { registerShortcut, matchShortcut } = await import("../registry");

    registerShortcut({
      key: "x",
      ctrl: true,
      description: "Test Ctrl+X",
      handler: () => {},
    });

    const withCtrl = new KeyboardEvent("keydown", { key: "x", ctrlKey: true });
    expect(matchShortcut(withCtrl)?.key).toBe("x");

    const withMeta = new KeyboardEvent("keydown", { key: "x", metaKey: true });
    expect(matchShortcut(withMeta)?.key).toBe("x");
  });

  it("matchShortcut returns undefined for non-matching keys", async () => {
    const { matchShortcut } = await import("../registry");

    const event = new KeyboardEvent("keydown", { key: "z" });
    const match = matchShortcut(event);
    expect(match).toBeUndefined();
  });

  it("matchShortcut returns undefined when Ctrl is required but not pressed", async () => {
    const { registerShortcut, matchShortcut } = await import("../registry");

    registerShortcut({
      key: "y",
      ctrl: true,
      description: "Test Ctrl+Y",
      handler: () => {},
    });

    const withoutCtrl = new KeyboardEvent("keydown", { key: "y" });
    const match = matchShortcut(withoutCtrl);
    expect(match?.ctrl).not.toBe(true);
  });
});
