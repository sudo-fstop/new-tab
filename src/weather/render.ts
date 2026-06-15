let el: HTMLElement | null = null;

export function createWeatherWidget(): HTMLElement {
  if (el) return el;

  el = document.createElement("div");
  el.className = "weather-widget";
  el.innerHTML = `
    <div class="weather-widget__loading">Loading weather…</div>
    <div class="weather-widget__content" style="display:none">
      <span class="weather-widget__icon"></span>
      <span class="weather-widget__temp"></span>
      <button class="weather-widget__toggle">°C</button>
      <div class="weather-widget__location"></div>
    </div>
    <div class="weather-widget__error" style="display:none"></div>
    <div class="weather-widget__fallback" style="display:none">
      <input class="weather-widget__input" placeholder="Enter city name" />
    </div>
  `;

  return el;
}

export function showLoading(): void {
  if (!el) return;
  getEl("loading").style.display = "";
  getEl("content").style.display = "none";
  getEl("error").style.display = "none";
  getEl("fallback").style.display = "none";
}

export function showWeather(temp: number, emoji: string, location: string, unit: "C" | "F"): void {
  if (!el) return;
  getEl("loading").style.display = "none";
  getEl("content").style.display = "";
  getEl("error").style.display = "none";
  getEl("fallback").style.display = "none";

  const iconEl = el.querySelector(".weather-widget__icon");
  if (iconEl) iconEl.textContent = emoji;

  const tempEl = el.querySelector(".weather-widget__temp");
  if (tempEl) tempEl.textContent = `${Math.round(temp)}°${unit}`;

  const toggleEl = el.querySelector(".weather-widget__toggle");
  if (toggleEl) toggleEl.textContent = `°${unit}`;

  const locEl = el.querySelector(".weather-widget__location");
  if (locEl) locEl.textContent = location;
}

export function showError(message: string): void {
  if (!el) return;
  getEl("loading").style.display = "none";
  getEl("content").style.display = "none";
  getEl("error").style.display = "";
  getEl("fallback").style.display = "none";

  const errorEl = el.querySelector(".weather-widget__error");
  if (errorEl) errorEl.textContent = message;
}

export function showFallback(): void {
  if (!el) return;
  getEl("loading").style.display = "none";
  getEl("content").style.display = "none";
  getEl("error").style.display = "none";
  getEl("fallback").style.display = "";
}

export function show(): void {
  if (!el) return;
  el.classList.add("visible");
}

export function getInputElement(): HTMLInputElement | null {
  if (!el) return null;
  return el.querySelector(".weather-widget__input") as HTMLInputElement | null;
}

export function getToggleElement(): HTMLButtonElement | null {
  if (!el) return null;
  return el.querySelector(".weather-widget__toggle") as HTMLButtonElement | null;
}

export function convertTemp(celsius: number, unit: "C" | "F"): number {
  if (unit === "F") return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

function getEl(suffix: string): HTMLElement {
  return el!.querySelector(`.weather-widget__${suffix}`) as HTMLElement;
}
