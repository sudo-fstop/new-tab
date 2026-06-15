import type { WeatherLocation } from "./types";

export function requestGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 10_000 },
    );
  });
}

export async function geocodeCity(city: string): Promise<WeatherLocation | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const results = json.results;
    if (!Array.isArray(results) || results.length === 0) return null;

    const first = results[0];
    return {
      latitude: first.latitude,
      longitude: first.longitude,
      name: first.name,
    };
  } catch {
    return null;
  }
}
