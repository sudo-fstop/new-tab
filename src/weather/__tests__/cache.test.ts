import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CachedWeather, WeatherLocation } from "../types";

function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

function createTestCachedWeather(overrides?: Partial<CachedWeather>): CachedWeather {
  return {
    data: { temperature: 22, weatherCode: 0, timestamp: Date.now() },
    location: { latitude: 40.7, longitude: -74.0, name: "New York" },
    fetchedAt: Date.now(),
    ...overrides,
  };
}

describe("weather/cache", () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    vi.stubGlobal("localStorage", mockStorage);
  });

  async function importCache() {
    return await import("../cache");
  }

  it("getCachedWeather returns null when localStorage is empty", async () => {
    const { getCachedWeather } = await importCache();
    expect(getCachedWeather()).toBeNull();
  });

  it("setCachedWeather + getCachedWeather round-trip", async () => {
    const { setCachedWeather, getCachedWeather } = await importCache();
    const data = createTestCachedWeather();
    setCachedWeather(data);
    const result = getCachedWeather();
    expect(result).toEqual(data);
  });

  it("getCachedWeather returns null for expired data", async () => {
    const { setCachedWeather, getCachedWeather } = await importCache();
    const data = createTestCachedWeather({
      fetchedAt: Date.now() - 31 * 60 * 1000, // 31 minutes ago
    });
    setCachedWeather(data);
    expect(getCachedWeather()).toBeNull();
  });

  it("getCachedLocation / setCachedLocation round-trip", async () => {
    const { getCachedLocation, setCachedLocation } = await importCache();
    const loc: WeatherLocation = { latitude: 51.5, longitude: -0.1, name: "London" };
    setCachedLocation(loc);
    expect(getCachedLocation()).toEqual(loc);
  });

  it("getCachedLocation returns null when empty", async () => {
    const { getCachedLocation } = await importCache();
    expect(getCachedLocation()).toBeNull();
  });

  it("handles corrupted localStorage data gracefully", async () => {
    const { getCachedWeather } = await importCache();
    mockStorage.setItem("weather-data", "not valid json{{{");
    expect(getCachedWeather()).toBeNull();
  });

  it("isCacheValid returns true for recent data", async () => {
    const { isCacheValid } = await importCache();
    const data = createTestCachedWeather({ fetchedAt: Date.now() });
    expect(isCacheValid(data)).toBe(true);
  });

  it("isCacheValid returns false for old data", async () => {
    const { isCacheValid } = await importCache();
    const data = createTestCachedWeather({
      fetchedAt: Date.now() - 31 * 60 * 1000,
    });
    expect(isCacheValid(data)).toBe(false);
  });
});
