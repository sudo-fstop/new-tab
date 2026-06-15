// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("weather/render", () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '<div id="widgets"></div>';
  });

  async function loadRender() {
    return await import("../render");
  }

  it("createWeatherWidget creates correct DOM structure", async () => {
    const { createWeatherWidget } = await loadRender();
    const widget = createWeatherWidget();

    expect(widget.className).toBe("weather-widget");
    expect(widget.querySelector(".weather-widget__loading")).toBeTruthy();
    expect(widget.querySelector(".weather-widget__content")).toBeTruthy();
    expect(widget.querySelector(".weather-widget__error")).toBeTruthy();
    expect(widget.querySelector(".weather-widget__fallback")).toBeTruthy();
    expect(widget.querySelector(".weather-widget__input")).toBeTruthy();
    expect(widget.querySelector(".weather-widget__toggle")).toBeTruthy();
  });

  it("showWeather updates text content correctly", async () => {
    const { createWeatherWidget, showWeather } = await loadRender();
    const widget = createWeatherWidget();
    document.getElementById("widgets")!.appendChild(widget);

    showWeather(22, "☀️", "New York", "C");

    expect(widget.querySelector(".weather-widget__icon")?.textContent).toBe("☀️");
    expect(widget.querySelector(".weather-widget__temp")?.textContent).toBe("22°C");
    expect(widget.querySelector(".weather-widget__location")?.textContent).toBe("New York");
    expect(widget.querySelector(".weather-widget__toggle")?.textContent).toBe("°C");
  });

  it("showWeather displays Fahrenheit correctly", async () => {
    const { createWeatherWidget, showWeather } = await loadRender();
    const widget = createWeatherWidget();
    document.getElementById("widgets")!.appendChild(widget);

    showWeather(72, "🌧️", "London", "F");

    expect(widget.querySelector(".weather-widget__temp")?.textContent).toBe("72°F");
    expect(widget.querySelector(".weather-widget__toggle")?.textContent).toBe("°F");
  });

  it("showError displays message", async () => {
    const { createWeatherWidget, showError } = await loadRender();
    const widget = createWeatherWidget();
    document.getElementById("widgets")!.appendChild(widget);

    showError("Unable to load weather");

    const errorEl = widget.querySelector(".weather-widget__error") as HTMLElement;
    expect(errorEl.textContent).toBe("Unable to load weather");
    expect(errorEl.style.display).toBe("");
  });

  it("showFallback shows input", async () => {
    const { createWeatherWidget, showFallback } = await loadRender();
    const widget = createWeatherWidget();
    document.getElementById("widgets")!.appendChild(widget);

    showFallback();

    const fallback = widget.querySelector(".weather-widget__fallback") as HTMLElement;
    expect(fallback.style.display).toBe("");
    const loading = widget.querySelector(".weather-widget__loading") as HTMLElement;
    expect(loading.style.display).toBe("none");
  });

  it("show adds visible class", async () => {
    const { createWeatherWidget, show } = await loadRender();
    const widget = createWeatherWidget();
    document.getElementById("widgets")!.appendChild(widget);

    show();
    expect(widget.classList.contains("visible")).toBe(true);
  });

  it("convertTemp converts correctly", async () => {
    const { convertTemp } = await loadRender();

    expect(convertTemp(0, "C")).toBe(0);
    expect(convertTemp(0, "F")).toBe(32);
    expect(convertTemp(100, "F")).toBe(212);
    expect(convertTemp(100, "C")).toBe(100);
    expect(convertTemp(-40, "F")).toBe(-40);
  });

  it("getInputElement returns the input", async () => {
    const { createWeatherWidget, getInputElement } = await loadRender();
    createWeatherWidget();

    const input = getInputElement();
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input?.placeholder).toBe("Enter city name");
  });
});
