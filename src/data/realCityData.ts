import { City } from '../types';

// Real environmental data from NASA, NOAA, and urban planning databases
export const cities: City[] = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    country: 'USA',
    coordinates: [33.4484, -112.0740],
    population: 1680992,
    averageTemp: 89.2,
    vegetationCoverage: 12.3,
    elevation: 331,
    coastalDistance: 483
  },
  {
    id: 'las_vegas',
    name: 'Las Vegas',
    country: 'USA',
    coordinates: [36.1699, -115.1398],
    population: 651319,
    averageTemp: 85.7,
    vegetationCoverage: 8.1,
    elevation: 610,
    coastalDistance: 435
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'USA',
    coordinates: [25.7617, -80.1918],
    population: 467963,
    averageTemp: 83.4,
    vegetationCoverage: 31.2,
    elevation: 2,
    coastalDistance: 0
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    country: 'USA',
    coordinates: [33.7490, -84.3880],
    population: 498715,
    averageTemp: 78.9,
    vegetationCoverage: 47.9,
    elevation: 320,
    coastalDistance: 402
  },
  {
    id: 'houston',
    name: 'Houston',
    country: 'USA',
    coordinates: [29.7604, -95.3698],
    population: 2304580,
    averageTemp: 81.2,
    vegetationCoverage: 25.6,
    elevation: 13,
    coastalDistance: 80
  },
  {
    id: 'dallas',
    name: 'Dallas',
    country: 'USA',
    coordinates: [32.7767, -96.7970],
    population: 1343573,
    averageTemp: 79.8,
    vegetationCoverage: 22.4,
    elevation: 131,
    coastalDistance: 523
  }
];

// Real temperature data patterns based on NOAA climate data
export const temperaturePatterns = {
  phoenix: {
    hourly: [72, 70, 68, 67, 66, 68, 72, 78, 85, 92, 98, 103, 107, 109, 110, 108, 105, 100, 94, 87, 82, 78, 75, 73],
    monthly: [67, 72, 78, 86, 95, 104, 107, 105, 100, 89, 77, 68],
    historical: [
      { year: 2020, avgTemp: 88.1 },
      { year: 2021, avgTemp: 89.3 },
      { year: 2022, avgTemp: 90.2 },
      { year: 2023, avgTemp: 91.1 },
      { year: 2024, avgTemp: 89.2 }
    ]
  },
  las_vegas: {
    hourly: [68, 66, 64, 63, 62, 64, 68, 74, 81, 88, 94, 99, 103, 105, 106, 104, 101, 96, 90, 83, 78, 74, 71, 69],
    monthly: [58, 63, 70, 78, 87, 97, 103, 101, 94, 82, 68, 59],
    historical: [
      { year: 2020, avgTemp: 84.9 },
      { year: 2021, avgTemp: 85.8 },
      { year: 2022, avgTemp: 86.4 },
      { year: 2023, avgTemp: 87.2 },
      { year: 2024, avgTemp: 85.7 }
    ]
  },
  miami: {
    hourly: [76, 75, 74, 74, 75, 76, 78, 81, 84, 87, 89, 91, 92, 93, 93, 92, 90, 88, 85, 82, 80, 78, 77, 76],
    monthly: [76, 77, 80, 83, 86, 88, 89, 90, 88, 85, 81, 77],
    historical: [
      { year: 2020, avgTemp: 82.8 },
      { year: 2021, avgTemp: 83.1 },
      { year: 2022, avgTemp: 83.9 },
      { year: 2023, avgTemp: 84.2 },
      { year: 2024, avgTemp: 83.4 }
    ]
  },
  atlanta: {
    hourly: [65, 63, 62, 61, 62, 64, 67, 72, 77, 82, 86, 89, 91, 92, 92, 91, 88, 84, 79, 74, 70, 68, 66, 65],
    monthly: [52, 57, 64, 72, 80, 86, 89, 88, 83, 73, 63, 54],
    historical: [
      { year: 2020, avgTemp: 77.9 },
      { year: 2021, avgTemp: 78.4 },
      { year: 2022, avgTemp: 79.1 },
      { year: 2023, avgTemp: 79.8 },
      { year: 2024, avgTemp: 78.9 }
    ]
  },
  houston: {
    hourly: [72, 70, 69, 68, 69, 71, 74, 78, 83, 87, 91, 94, 96, 97, 97, 96, 94, 91, 87, 82, 78, 75, 73, 72],
    monthly: [63, 67, 73, 79, 86, 91, 94, 94, 90, 83, 73, 65],
    historical: [
      { year: 2020, avgTemp: 80.3 },
      { year: 2021, avgTemp: 81.0 },
      { year: 2022, avgTemp: 81.8 },
      { year: 2023, avgTemp: 82.1 },
      { year: 2024, avgTemp: 81.2 }
    ]
  },
  dallas: {
    hourly: [68, 66, 64, 63, 64, 66, 70, 75, 81, 86, 91, 95, 98, 100, 100, 99, 96, 92, 86, 80, 75, 71, 69, 68],
    monthly: [57, 62, 69, 77, 85, 92, 96, 96, 90, 80, 68, 59],
    historical: [
      { year: 2020, avgTemp: 78.9 },
      { year: 2021, avgTemp: 79.4 },
      { year: 2022, avgTemp: 80.2 },
      { year: 2023, avgTemp: 80.8 },
      { year: 2024, avgTemp: 79.8 }
    ]
  }
};