import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WallpaperPhoto } from "../types";

function createTestPhoto(overrides: Partial<WallpaperPhoto> = {}): WallpaperPhoto {
  return {
    id: "test-123",
    fullUrl: "https://images.unsplash.com/photo-123?w=3840&q=80&fit=clamp&auto=format",
    smallUrl: "https://images.unsplash.com/photo-123?w=400",
    photographerName: "Jane Doe",
    photographerUrl: "https://unsplash.com/@janedoe",
    unsplashUrl: "https://unsplash.com/photos/test-123",
    downloadEndpoint: "https://api.unsplash.com/photos/test-123/download",
    fetchedAt: 1700000000000,
    ...overrides,
  };
}

/** Simple in-memory localStorage mock */
function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe("cache", () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    vi.stubGlobal("localStorage", mockStorage);
  });

  // Dynamic import to get fresh module after stubbing localStorage
  async function importCache() {
    // Re-import the module (vitest caches modules so we just use the same import)
    const mod = await import("../cache");
    return mod;
  }

  it("getCachedPhoto returns null when localStorage is empty", async () => {
    const { getCachedPhoto } = await importCache();
    expect(getCachedPhoto()).toBeNull();
  });

  it("saveCachedPhoto + getCachedPhoto round-trip", async () => {
    const { saveCachedPhoto, getCachedPhoto } = await importCache();
    const photo = createTestPhoto();
    saveCachedPhoto(photo);
    const result = getCachedPhoto();
    expect(result).toEqual(photo);
  });

  it("savePrefetchedPhoto + getPrefetchedPhoto round-trip", async () => {
    const { savePrefetchedPhoto, getPrefetchedPhoto } = await importCache();
    const photo = createTestPhoto({ id: "prefetch-456" });
    savePrefetchedPhoto(photo);
    const result = getPrefetchedPhoto();
    expect(result).toEqual(photo);
  });

  it("promotePrefetch moves prefetch to current", async () => {
    const { savePrefetchedPhoto, promotePrefetch, getCachedPhoto, getPrefetchedPhoto } = await importCache();
    const photo = createTestPhoto({ id: "promote-789" });
    savePrefetchedPhoto(photo);

    const promoted = promotePrefetch();
    expect(promoted).toEqual(photo);
    expect(getCachedPhoto()).toEqual(photo);
    expect(getPrefetchedPhoto()).toBeNull();
  });

  it("promotePrefetch returns null when no prefetch exists", async () => {
    const { promotePrefetch } = await importCache();
    expect(promotePrefetch()).toBeNull();
  });

  it("handles corrupted localStorage data gracefully", async () => {
    const { getCachedPhoto } = await importCache();
    mockStorage.setItem("wallpaper_current", "not valid json{{{");
    expect(getCachedPhoto()).toBeNull();
  });

  it("handles localStorage quota errors gracefully", async () => {
    const { saveCachedPhoto } = await importCache();
    // Override setItem to throw
    mockStorage.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    // Should not throw
    expect(() => saveCachedPhoto(createTestPhoto())).not.toThrow();
  });
});
