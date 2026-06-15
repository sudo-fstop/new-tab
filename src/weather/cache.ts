import type { CachedWeather, WeatherLocation } from "./types";

const WEATHER_DATA_KEY = "weather-data";
const WEATHER_LOCATION_KEY = "weather-location";
const TTL = 30 * 60 * 1000; // 30 minutes

export function isCacheValid(cached: CachedWeather): boolean {
  return Date.now() - cached.fetchedAt < TTL;
}

export function getCachedWeather(): CachedWeather | null {
  try {
    const raw = localStorage.getItem(WEATHER_DATA_KEY);
    if (!raw) return null;
    const cached: CachedWeather = JSON.parse(raw);
    if (!isCacheValid(cached)) return null;
    return cached;
  } catch {
    return null;
  }
}

export function setCachedWeather(data: CachedWeather): void {
  try {
    localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded or unavailable — silently ignore
  }
}

export function getCachedLocation(): WeatherLocation | null {
  try {
    const raw = localStorage.getItem(WEATHER_LOCATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeatherLocation;
  } catch {
    return null;
  }
}

export function setCachedLocation(loc: WeatherLocation): void {
  try {
    localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(loc));
  } catch {
    // silently ignore
  }
}
