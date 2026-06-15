let el: HTMLElement | null = null;

function getOrCreateWidget(): HTMLElement {
  if (el) return el;

  const existing = document.querySelector(".greeting-widget");
  if (existing instanceof HTMLElement) {
    el = existing;
    return el;
  }

  el = document.createElement("div");
  el.className = "greeting-widget";
  el.innerHTML = `
    <div class="greeting-widget__time"></div>
    <div class="greeting-widget__greeting"></div>
  `;

  const container = document.getElementById("widgets");
  if (container) {
    container.appendChild(el);
  } else {
    document.body.appendChild(el);
  }

  return el;
}

export function updateDisplay(time: string, greeting: string): void {
  const widget = getOrCreateWidget();

  const timeEl = widget.querySelector(".greeting-widget__time");
  if (timeEl) timeEl.textContent = time;

  const greetingEl = widget.querySelector(".greeting-widget__greeting");
  if (greetingEl) greetingEl.textContent = greeting;
}

export function show(): void {
  const widget = getOrCreateWidget();
  widget.classList.add("visible");
}
