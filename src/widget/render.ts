import type { InspiringPerson } from "./types";

let widgetEl: HTMLElement | null = null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getOrCreateWidget(): HTMLElement {
  if (widgetEl) return widgetEl;

  const existing = document.querySelector(".inspiring-person-widget");
  if (existing instanceof HTMLElement) {
    widgetEl = existing;
    return widgetEl;
  }

  widgetEl = document.createElement("div");
  widgetEl.className = "inspiring-person-widget";

  const container = document.getElementById("widgets");
  if (container) {
    container.appendChild(widgetEl);
  } else {
    document.body.appendChild(widgetEl);
  }

  return widgetEl;
}

export function renderPerson(person: InspiringPerson): void {
  const el = getOrCreateWidget();

  const linksHtml = person.links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  el.innerHTML = `
    <div class="inspiring-person-widget__name">${escapeHtml(person.name)}</div>
    <blockquote class="inspiring-person-widget__quote">"${escapeHtml(person.quote)}"</blockquote>
    <p class="inspiring-person-widget__blurb">${escapeHtml(person.blurb)}</p>
    <div class="inspiring-person-widget__links">${linksHtml}</div>
  `;
}

export function fadeOut(): Promise<void> {
  const el = getOrCreateWidget();
  el.classList.add("fade-out");
  return new Promise((resolve) => setTimeout(resolve, 500));
}

export function fadeIn(): void {
  const el = getOrCreateWidget();
  el.classList.remove("fade-out");
}
