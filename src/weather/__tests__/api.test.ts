// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchWeather, getWeatherEmoji, getWeatherDescription } from "../api";

describe("weather/api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchWeather parses Open-Meteo response correctly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temperature_2m: 18.5,
              weather_code: 2,
            },
          }),
      }),
    );

    const result = await fetchWeather(40.7, -74.0);
    expect(result.temperature).toBe(18.5);
    expect(result.weatherCode).toBe(2);
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it("fetchWeather throws on non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchWeather(40.7, -74.0)).rejects.toThrow("Weather API error: 500");
  });

  it("getWeatherEmoji returns correct emoji for various WMO codes", () => {
    expect(getWeatherEmoji(0)).toBe("☀️");
    expect(getWeatherEmoji(1)).toBe("🌤️");
    expect(getWeatherEmoji(3)).toBe("⛅");
    expect(getWeatherEmoji(45)).toBe("🌫️");
    expect(getWeatherEmoji(61)).toBe("🌧️");
    expect(getWeatherEmoji(71)).toBe("❄️");
    expect(getWeatherEmoji(95)).toBe("⛈️");
  });

  it("getWeatherDescription returns correct description for WMO codes", () => {
    expect(getWeatherDescription(0)).toBe("Clear sky");
    expect(getWeatherDescription(2)).toBe("Partly cloudy");
    expect(getWeatherDescription(45)).toBe("Fog");
    expect(getWeatherDescription(61)).toBe("Rain");
    expect(getWeatherDescription(71)).toBe("Snow");
    expect(getWeatherDescription(95)).toBe("Thunderstorm");
  });
});
