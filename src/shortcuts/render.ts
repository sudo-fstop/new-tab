import { getShortcuts } from "./registry";

function formatKey(shortcut: { key: string; ctrl?: boolean }): string {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push("Ctrl");
  parts.push(shortcut.key === " " ? "Space" : shortcut.key.toUpperCase());
  return parts.join("+");
}

export function createHelpOverlay(): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = "shortcuts-overlay";

  const card = document.createElement("div");
  card.className = "shortcuts-overlay__card";

  const title = document.createElement("div");
  title.className = "shortcuts-overlay__title";
  title.textContent = "Keyboard Shortcuts";

  const closeBtn = document.createElement("button");
  closeBtn.className = "shortcuts-overlay__close";
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
  });

  card.appendChild(title);
  card.appendChild(closeBtn);

  const shortcuts = getShortcuts();
  for (const shortcut of shortcuts) {
    const row = document.createElement("div");
    row.className = "shortcuts-overlay__row";

    const keyEl = document.createElement("span");
    keyEl.className = "shortcuts-overlay__key";
    const kbd = document.createElement("kbd");
    kbd.textContent = formatKey(shortcut);
    keyEl.appendChild(kbd);

    const descEl = document.createElement("span");
    descEl.className = "shortcuts-overlay__desc";
    descEl.textContent = shortcut.description;

    row.appendChild(keyEl);
    row.appendChild(descEl);
    card.appendChild(row);
  }

  overlay.appendChild(card);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  return overlay;
}

export function toggleHelpOverlay(): void {
  const existing = document.querySelector(".shortcuts-overlay");
  if (existing) {
    existing.remove();
  } else {
    const overlay = createHelpOverlay();
    document.body.appendChild(overlay);
  }
}

export function isHelpOverlayVisible(): boolean {
  return document.querySelector(".shortcuts-overlay") !== null;
}
