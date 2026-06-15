import { injectStyles } from "./style";
import { registerDefaultShortcuts } from "./handlers";
import { matchShortcut } from "./registry";

function isInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (target.getAttribute("contenteditable") === "true") return true;
  return false;
}

function startListening(): void {
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;

    if (isInputTarget(e.target) && e.key !== "Escape") return;

    const shortcut = matchShortcut(e);
    if (shortcut) {
      shortcut.handler(e);
    }
  });
}

export function initShortcuts(): void {
  injectStyles();
  registerDefaultShortcuts();
  startListening();
}
