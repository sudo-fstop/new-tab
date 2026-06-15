export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  timestamp: number;
}

export interface CachedWeather {
  data: WeatherData;
  location: WeatherLocation;
  fetchedAt: number;
}
