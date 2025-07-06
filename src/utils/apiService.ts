import axios from 'axios';

// Simple API service for real weather data
const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // You'll need to get a free API key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'imperial'
        }
      });

      const weatherData: WeatherData = {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
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
      const response = await axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: API_KEY
        }
      });

      const airQualityData: AirQualityData = {
        aqi: response.data.list[0].main.aqi,
        co: response.data.list[0].components.co,
        no2: response.data.list[0].components.no2,
        o3: response.data.list[0].components.o3,
        pm2_5: response.data.list[0].components.pm2_5,
        pm10: response.data.list[0].components.pm10
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
          lat,
          lon,
          appid: API_KEY,
          units: 'imperial'
        }
      });

      const forecast = response.data.list.map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));

      this.setCachedData(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      // Return fallback data if API fails
      return [];
    }
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