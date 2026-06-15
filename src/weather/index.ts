import { injectStyles } from "./style";
import { requestGeolocation, geocodeCity } from "./location";
import { fetchWeather, getWeatherEmoji } from "./api";
import {
  getCachedWeather,
  setCachedWeather,
  getCachedLocation,
  setCachedLocation,
} from "./cache";
import {
  createWeatherWidget,
  showLoading,
  showWeather,
  showError,
  showFallback,
  show,
  getInputElement,
  getToggleElement,
  convertTemp,
} from "./render";
import type { WeatherLocation } from "./types";

let unit: "C" | "F" = (localStorage.getItem("weather-unit") as "C" | "F") || "C";
let currentTempCelsius: number | null = null;
let currentEmoji = "";
let currentLocationName = "";

function displayWeather(tempCelsius: number, emoji: string, locationName: string): void {
  currentTempCelsius = tempCelsius;
  currentEmoji = emoji;
  currentLocationName = locationName;
  const displayTemp = convertTemp(tempCelsius, unit);
  showWeather(displayTemp, emoji, locationName, unit);
}

async function loadWeatherForLocation(loc: WeatherLocation): Promise<void> {
  try {
    const weather = await fetchWeather(loc.latitude, loc.longitude);
    const emoji = getWeatherEmoji(weather.weatherCode);

    setCachedWeather({
      data: weather,
      location: loc,
      fetchedAt: Date.now(),
    });
    setCachedLocation(loc);

    displayWeather(weather.temperature, emoji, loc.name);
  } catch {
    // On error, try to use expired cache
    const expiredRaw = localStorage.getItem("weather-data");
    if (expiredRaw) {
      try {
        const expired = JSON.parse(expiredRaw);
        const emoji = getWeatherEmoji(expired.data.weatherCode);
        displayWeather(expired.data.temperature, emoji, expired.location.name);
        return;
      } catch {
        // fall through
      }
    }
    showError("Unable to load weather");
  }
}

async function loadWeather(): Promise<void> {
  // 1. Check valid cache first
  const cached = getCachedWeather();
  if (cached) {
    const emoji = getWeatherEmoji(cached.data.weatherCode);
    displayWeather(cached.data.temperature, emoji, cached.location.name);
    return;
  }

  showLoading();

  // 2. Try cached location
  const savedLocation = getCachedLocation();
  if (savedLocation) {
    await loadWeatherForLocation(savedLocation);
    return;
  }

  // 3. Try geolocation
  const coords = await requestGeolocation();
  if (coords) {
    const loc: WeatherLocation = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      name: "Current location",
    };

    try {
      const weather = await fetchWeather(loc.latitude, loc.longitude);
      const emoji = getWeatherEmoji(weather.weatherCode);

      setCachedWeather({
        data: weather,
        location: loc,
        fetchedAt: Date.now(),
      });
      setCachedLocation(loc);

      displayWeather(weather.temperature, emoji, loc.name);
    } catch {
      showError("Unable to load weather");
    }
    return;
  }

  // 4. Geolocation denied — show fallback input
  showFallback();
  const input = getInputElement();
  if (input) {
    input.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;
      const city = input.value.trim();
      if (!city) return;

      showLoading();
      const loc = await geocodeCity(city);
      if (loc) {
        await loadWeatherForLocation(loc);
      } else {
        showError(`City "${city}" not found`);
      }
    });
  }
}

export function initWeather(): void {
  injectStyles();

  const widget = createWeatherWidget();
  const container = document.getElementById("widgets");
  if (container) {
    container.appendChild(widget);
  } else {
    document.body.appendChild(widget);
  }

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => show());
  });

  // Wire up °F/°C toggle
  const toggle = getToggleElement();
  if (toggle) {
    toggle.addEventListener("click", () => {
      unit = unit === "C" ? "F" : "C";
      localStorage.setItem("weather-unit", unit);
      if (currentTempCelsius !== null) {
        displayWeather(currentTempCelsius, currentEmoji, currentLocationName);
      }
    });
  }

  // Load weather async — never blocks page render
  loadWeather();
}
