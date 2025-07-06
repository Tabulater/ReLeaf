export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  population: number;
  averageTemp: number;
  vegetationCoverage: number;
  elevation: number;
  coastalDistance: number;
}

export interface HeatZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  temperature: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  landUseType: 'commercial' | 'residential' | 'industrial' | 'mixed';
  vegetationIndex: number;
  buildingDensity: number;
  surfaceAlbedo: number;
  predictions: {
    temperatureIncrease: number;
    riskScore: number;
    confidence: number;
  };
}

export interface EnvironmentalData {
  city: string;
  temperatureData: {
    hourly: number[];
    monthly: number[];
    historical: { year: number; avgTemp: number }[];
  };
  vegetationData: {
    ndvi: number;
    treeCanopyCover: number;
    greenSpaceRatio: number;
  };
  urbanMetrics: {
    buildingDensity: number;
    roadDensity: number;
    populationDensity: number;
    imperviousSurface: number;
  };
}

export interface ActionPlan {
  id: string;
  type: 'tree_planting' | 'green_roof' | 'cool_pavement' | 'urban_park' | 'shade_structure' | 'water_feature' | 'smart_irrigation' | 'cooling_center';
  location: [number, number];
  priority: 'high' | 'medium' | 'low';
  impact: {
    temperatureReduction: number;
    carbonSequestration: number;
    energySavings: number;
    airQualityImprovement: number;
  };
  implementation: {
    cost: number;
    timeframe: string;
    difficulty: 'easy' | 'moderate' | 'complex';
  };
}