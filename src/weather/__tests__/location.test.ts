// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { requestGeolocation, geocodeCity } from "../location";

describe("weather/location", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("requestGeolocation", () => {
    it("returns coordinates on success", async () => {
      vi.stubGlobal("navigator", {
        geolocation: {
          getCurrentPosition: (success: PositionCallback) => {
            success({
              coords: { latitude: 40.7, longitude: -74.0 },
            } as GeolocationPosition);
          },
        },
      });

      const result = await requestGeolocation();
      expect(result).toEqual({ latitude: 40.7, longitude: -74.0 });
    });

    it("returns null on denial", async () => {
      vi.stubGlobal("navigator", {
        geolocation: {
          getCurrentPosition: (_success: PositionCallback, error?: PositionErrorCallback) => {
            if (error) error({} as GeolocationPositionError);
          },
        },
      });

      const result = await requestGeolocation();
      expect(result).toBeNull();
    });

    it("returns null when geolocation is not available", async () => {
      vi.stubGlobal("navigator", {});
      const result = await requestGeolocation();
      expect(result).toBeNull();
    });
  });

  describe("geocodeCity", () => {
    it("parses geocoding response correctly", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                { latitude: 51.5074, longitude: -0.1278, name: "London" },
              ],
            }),
        }),
      );

      const result = await geocodeCity("London");
      expect(result).toEqual({
        latitude: 51.5074,
        longitude: -0.1278,
        name: "London",
      });
    });

    it("returns null when no results", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        }),
      );

      const result = await geocodeCity("xyznonexistent");
      expect(result).toBeNull();
    });

    it("returns null on fetch error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error")),
      );

      const result = await geocodeCity("London");
      expect(result).toBeNull();
    });
  });
});
