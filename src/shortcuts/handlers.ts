import { registerShortcut } from "./registry";
import { toggleHelpOverlay, isHelpOverlayVisible } from "./render";

export function registerDefaultShortcuts(): void {
  registerShortcut({
    key: "/",
    description: "Focus search bar",
    handler: (e) => {
      e.preventDefault();
      document.querySelector<HTMLInputElement>(".search-bar__input")?.focus();
    },
  });

  registerShortcut({
    key: "k",
    ctrl: true,
    description: "Focus search bar",
    handler: (e) => {
      e.preventDefault();
      document.querySelector<HTMLInputElement>(".search-bar__input")?.focus();
    },
  });

  registerShortcut({
    key: "t",
    description: "Toggle todo widget",
    handler: () => {
      const el = document.querySelector(".todo-widget");
      if (el) {
        el.classList.toggle("shortcuts-hidden");
      }
    },
  });

  registerShortcut({
    key: "?",
    description: "Show keyboard shortcuts",
    handler: () => {
      toggleHelpOverlay();
    },
  });

  registerShortcut({
    key: "Escape",
    description: "Close overlay / dismiss screensaver",
    handler: () => {
      if (isHelpOverlayVisible()) {
        toggleHelpOverlay();
        return;
      }

      const screensaver = document.querySelector("#screensaver.active");
      if (screensaver) {
        document.dispatchEvent(new MouseEvent("mousemove"));
      }
    },
  });
}
