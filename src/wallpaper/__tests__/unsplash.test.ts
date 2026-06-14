import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScreenWidth, fetchRandomPhoto, triggerDownload } from "../unsplash";
import type { UnsplashApiResponse } from "../types";

function createMockApiResponse(): UnsplashApiResponse {
  return {
    id: "abc123",
    urls: {
      raw: "https://images.unsplash.com/photo-abc123",
      small: "https://images.unsplash.com/photo-abc123?w=400",
    },
    user: {
      name: "John Smith",
      links: {
        html: "https://unsplash.com/@johnsmith",
      },
    },
    links: {
      html: "https://unsplash.com/photos/abc123",
      download_location: "https://api.unsplash.com/photos/abc123/download",
    },
  };
}

describe("getScreenWidth", () => {
  const originalScreen = window.screen;
  const originalDPR = window.devicePixelRatio;

  afterEach(() => {
    Object.defineProperty(window, "screen", { value: originalScreen, writable: true });
    Object.defineProperty(window, "devicePixelRatio", { value: originalDPR, writable: true });
  });

  it("caps at 3840", () => {
    Object.defineProperty(window, "screen", {
      value: { width: 2560 },
      writable: true,
    });
    Object.defineProperty(window, "devicePixelRatio", { value: 2, writable: true });
    expect(getScreenWidth()).toBe(3840);
  });

  it("computes correctly for normal resolution", () => {
    Object.defineProperty(window, "screen", {
      value: { width: 1440 },
      writable: true,
    });
    Object.defineProperty(window, "devicePixelRatio", { value: 1, writable: true });
    expect(getScreenWidth()).toBe(1440);
  });

  it("computes correctly for 1920x2 DPR", () => {
    Object.defineProperty(window, "screen", {
      value: { width: 1920 },
      writable: true,
    });
    Object.defineProperty(window, "devicePixelRatio", { value: 2, writable: true });
    expect(getScreenWidth()).toBe(3840);
  });
});

describe("fetchRandomPhoto", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("constructs correct WallpaperPhoto from API response", async () => {
    const mockResponse = createMockApiResponse();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const photo = await fetchRandomPhoto();

    expect(photo.id).toBe("abc123");
    expect(photo.fullUrl).toContain("https://images.unsplash.com/photo-abc123");
    expect(photo.fullUrl).toContain("&q=80&fit=clamp&auto=format");
    expect(photo.smallUrl).toBe("https://images.unsplash.com/photo-abc123?w=400");
    expect(photo.photographerName).toBe("John Smith");
    expect(photo.photographerUrl).toBe("https://unsplash.com/@johnsmith");
    expect(photo.downloadEndpoint).toBe("https://api.unsplash.com/photos/abc123/download");
    expect(photo.fetchedAt).toBeGreaterThan(0);
  });

  it("throws on non-200 response", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    });

    await expect(fetchRandomPhoto()).rejects.toThrow("Unsplash API error: 403 Forbidden");
  });

  it("throws on rate limit (429)", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    });

    await expect(fetchRandomPhoto()).rejects.toThrow("rate limit");
  });
});

describe("triggerDownload", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls fetch with correct auth header", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });

    await triggerDownload("https://api.unsplash.com/photos/abc/download");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.unsplash.com/photos/abc/download",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Client-ID"),
        }),
      })
    );
  });

  it("swallows errors silently", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Network error"));

    // Should not throw
    await expect(triggerDownload("https://example.com/download")).resolves.toBeUndefined();
  });
});
