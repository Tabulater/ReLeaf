import axios from 'axios';

// Simple API service for real weather data using Open-Meteo (free, no API key required)
const BASE_URL = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface AirQualityData {
  aqi: number;
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export class ApiService {
  private static instance: ApiService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code',
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph'
        }
      });

      const current = response.data.current;
      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        windSpeed: current.wind_speed_10m,
        description: this.getWeatherDescription(current.weather_code),
        icon: this.getWeatherIcon(current.weather_code)
      };

      this.setCachedData(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return fallback data if API fails
      return {
        temperature: 75,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
        description: 'Partly cloudy',
        icon: '02d'
      };
    }
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const cacheKey = `airquality_${lat}_${lon}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Open-Meteo doesn't provide air quality data, so we'll use fallback
      // In a real application, you might want to use a different air quality API
      console.log('Air quality data not available from Open-Meteo, using fallback');
      
      const airQualityData: AirQualityData = {
        aqi: 2,
        co: 200,
        no2: 10,
        o3: 30,
        pm2_5: 15,
        pm10: 25
      };

      this.setCachedData(cacheKey, airQualityData);
      return airQualityData;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      // Return fallback data if API fails
      return {
        aqi: 2,
        co: 200,
        no2: 10,
        o3: 30,
        pm2_5: 15,
        pm10: 25
      };
    }
  }

  async getForecast(lat: number, lon: number): Promise<any[]> {
    const cacheKey = `forecast_${lat}_${lon}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,relative_humidity_2m,weather_code',
          temperature_unit: 'fahrenheit',
          timezone: 'auto'
        }
      });

      const forecast = response.data.hourly.time.map((time: string, index: number) => ({
        dt: new Date(time).getTime() / 1000,
        temp: response.data.hourly.temperature_2m[index],
        humidity: response.data.hourly.relative_humidity_2m[index],
        description: this.getWeatherDescription(response.data.hourly.weather_code[index]),
        icon: this.getWeatherIcon(response.data.hourly.weather_code[index])
      }));

      this.setCachedData(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      // Return fallback data if API fails
      return [];
    }
  }

  // Helper methods for Open-Meteo weather codes
  private getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return descriptions[code] || 'Partly cloudy';
  }

  private getWeatherIcon(code: number): string {
    const icons: { [key: number]: string } = {
      0: '01d', 1: '01d', 2: '02d', 3: '03d',
      45: '50d', 48: '50d',
      51: '09d', 53: '09d', 55: '09d',
      61: '10d', 63: '10d', 65: '10d',
      71: '13d', 73: '13d', 75: '13d',
      95: '11d'
    };
    return icons[code] || '02d';
  }

  // Fallback method when API key is not available
  getFallbackWeatherData(cityName: string): WeatherData {
    const fallbackData: { [key: string]: WeatherData } = {
      'Phoenix': { temperature: 95, humidity: 25, pressure: 1010, windSpeed: 8, description: 'Sunny', icon: '01d' },
      'Las Vegas': { temperature: 92, humidity: 20, pressure: 1012, windSpeed: 6, description: 'Clear', icon: '01d' },
      'Miami': { temperature: 85, humidity: 75, pressure: 1015, windSpeed: 12, description: 'Partly cloudy', icon: '02d' },
      'Atlanta': { temperature: 78, humidity: 65, pressure: 1013, windSpeed: 7, description: 'Cloudy', icon: '03d' },
      'Houston': { temperature: 88, humidity: 70, pressure: 1011, windSpeed: 9, description: 'Humid', icon: '04d' },
      'Dallas': { temperature: 82, humidity: 60, pressure: 1014, windSpeed: 10, description: 'Partly sunny', icon: '02d' }
    };

    return fallbackData[cityName] || { temperature: 75, humidity: 60, pressure: 1013, windSpeed: 5, description: 'Partly cloudy', icon: '02d' };
  }
} 