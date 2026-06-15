import type { Shortcut } from "./types";

const shortcuts: Shortcut[] = [];

export function registerShortcut(shortcut: Shortcut): void {
  shortcuts.push(shortcut);
}

export function getShortcuts(): ReadonlyArray<Shortcut> {
  return shortcuts;
}

export function matchShortcut(e: KeyboardEvent): Shortcut | undefined {
  return shortcuts.find((s) => {
    const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
    const ctrlMatch = s.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
    return keyMatch && ctrlMatch;
  });
}
