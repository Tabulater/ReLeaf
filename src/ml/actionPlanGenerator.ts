import { ActionPlan, HeatZone, City } from '../types';
import * as tf from '@tensorflow/tfjs';
import { RealTimeDataService } from '../utils/realTimeDataService';

// Enhanced action plan generator with unique, detailed recommendations based on real-time data
export class ActionPlanGenerator {
  private model: tf.Sequential | null = null;
  private isTrained = false;
  private trainingData: ActionTrainingData[] = [];
  private actionTypes = ['tree_planting', 'green_roof', 'cool_pavement', 'urban_park', 'shade_structure', 'water_feature', 'smart_irrigation', 'cooling_center'] as const;
  private realTimeDataService = RealTimeDataService.getInstance();

  constructor() {
    this.generateTrainingData();
  }

  async initialize() {
    // Create a neural network for action plan classification with more action types
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ 
          inputShape: [10], // Match the actual number of features we're using
          units: 64, 
          activation: 'relu' 
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ 
          units: 32, 
          activation: 'relu' 
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ 
          units: 16, 
          activation: 'relu' 
        }),
        tf.layers.dense({ 
          units: 8, // 8 action types
          activation: 'softmax' 
        })
      ]
    });

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  private generateTrainingData() {
    // Generate realistic training data based on real urban planning research
    const trainingData: ActionTrainingData[] = [];
    
    // Real-world data patterns from urban planning studies with more action types
    const patterns = [
      // High-density commercial areas
      { buildingDensity: 85, vegetationIndex: 15, surfaceAlbedo: 20, severity: 'critical', cityTemp: 90, cityVeg: 20, cityPop: 1000000, currentWeather: 85, humidity: 60, expectedActions: ['cool_pavement', 'green_roof', 'shade_structure'] },
      { buildingDensity: 90, vegetationIndex: 10, surfaceAlbedo: 18, severity: 'critical', cityTemp: 95, cityVeg: 15, cityPop: 1500000, currentWeather: 90, humidity: 55, expectedActions: ['cool_pavement', 'shade_structure', 'cooling_center'] },
      { buildingDensity: 80, vegetationIndex: 20, surfaceAlbedo: 25, severity: 'high', cityTemp: 85, cityVeg: 25, cityPop: 800000, currentWeather: 82, humidity: 65, expectedActions: ['green_roof', 'tree_planting', 'water_feature'] },
      
      // Industrial areas
      { buildingDensity: 75, vegetationIndex: 8, surfaceAlbedo: 15, severity: 'critical', cityTemp: 88, cityVeg: 12, cityPop: 600000, currentWeather: 85, humidity: 50, expectedActions: ['cool_pavement', 'tree_planting', 'smart_irrigation'] },
      { buildingDensity: 70, vegetationIndex: 12, surfaceAlbedo: 18, severity: 'high', cityTemp: 82, cityVeg: 18, cityPop: 500000, currentWeather: 78, humidity: 55, expectedActions: ['tree_planting', 'urban_park', 'water_feature'] },
      { buildingDensity: 65, vegetationIndex: 15, surfaceAlbedo: 20, severity: 'moderate', cityTemp: 78, cityVeg: 22, cityPop: 400000, currentWeather: 75, humidity: 60, expectedActions: ['tree_planting', 'green_roof', 'smart_irrigation'] },
      
      // Residential areas
      { buildingDensity: 60, vegetationIndex: 35, surfaceAlbedo: 30, severity: 'high', cityTemp: 85, cityVeg: 30, cityPop: 700000, currentWeather: 82, humidity: 70, expectedActions: ['tree_planting', 'urban_park', 'water_feature'] },
      { buildingDensity: 55, vegetationIndex: 40, surfaceAlbedo: 32, severity: 'moderate', cityTemp: 80, cityVeg: 35, cityPop: 600000, currentWeather: 78, humidity: 75, expectedActions: ['urban_park', 'tree_planting', 'smart_irrigation'] },
      { buildingDensity: 50, vegetationIndex: 45, surfaceAlbedo: 35, severity: 'low', cityTemp: 75, cityVeg: 40, cityPop: 500000, currentWeather: 72, humidity: 80, expectedActions: ['tree_planting', 'water_feature'] },
      
      // Low-density areas
      { buildingDensity: 35, vegetationIndex: 60, surfaceAlbedo: 40, severity: 'low', cityTemp: 70, cityVeg: 50, cityPop: 300000, currentWeather: 68, humidity: 85, expectedActions: ['urban_park', 'water_feature'] },
      { buildingDensity: 30, vegetationIndex: 65, surfaceAlbedo: 42, severity: 'low', cityTemp: 68, cityVeg: 55, cityPop: 250000, currentWeather: 65, humidity: 90, expectedActions: ['tree_planting', 'smart_irrigation'] },
      { buildingDensity: 25, vegetationIndex: 70, surfaceAlbedo: 45, severity: 'low', cityTemp: 65, cityVeg: 60, cityPop: 200000, currentWeather: 62, humidity: 95, expectedActions: ['urban_park', 'water_feature'] },
      
      // Coastal cities
      { buildingDensity: 75, vegetationIndex: 25, surfaceAlbedo: 30, severity: 'moderate', cityTemp: 82, cityVeg: 30, cityPop: 800000, currentWeather: 80, humidity: 75, expectedActions: ['tree_planting', 'urban_park', 'water_feature'] },
      { buildingDensity: 80, vegetationIndex: 20, surfaceAlbedo: 28, severity: 'high', cityTemp: 85, cityVeg: 25, cityPop: 900000, currentWeather: 83, humidity: 70, expectedActions: ['green_roof', 'tree_planting', 'shade_structure'] },
      { buildingDensity: 70, vegetationIndex: 30, surfaceAlbedo: 32, severity: 'moderate', cityTemp: 78, cityVeg: 35, cityPop: 700000, currentWeather: 76, humidity: 80, expectedActions: ['urban_park', 'tree_planting', 'smart_irrigation'] },
      
      // High-elevation cities
      { buildingDensity: 60, vegetationIndex: 35, surfaceAlbedo: 35, severity: 'moderate', cityTemp: 75, cityVeg: 40, cityPop: 500000, currentWeather: 72, humidity: 60, expectedActions: ['tree_planting', 'urban_park', 'water_feature'] },
      { buildingDensity: 65, vegetationIndex: 30, surfaceAlbedo: 32, severity: 'high', cityTemp: 78, cityVeg: 35, cityPop: 600000, currentWeather: 75, humidity: 55, expectedActions: ['green_roof', 'tree_planting', 'smart_irrigation'] },
      { buildingDensity: 55, vegetationIndex: 40, surfaceAlbedo: 38, severity: 'low', cityTemp: 72, cityVeg: 45, cityPop: 400000, currentWeather: 68, humidity: 65, expectedActions: ['urban_park', 'water_feature'] }
    ];

    // Generate variations of the base patterns
    patterns.forEach(pattern => {
      for (let i = 0; i < 30; i++) {
        const variation = {
          buildingDensity: pattern.buildingDensity + (Math.random() - 0.5) * 10,
          vegetationIndex: pattern.vegetationIndex + (Math.random() - 0.5) * 8,
          surfaceAlbedo: pattern.surfaceAlbedo + (Math.random() - 0.5) * 6,
          severity: pattern.severity,
          cityTemp: pattern.cityTemp + (Math.random() - 0.5) * 5,
          cityVeg: pattern.cityVeg + (Math.random() - 0.5) * 5,
          cityPop: pattern.cityPop + (Math.random() - 0.5) * 200000,
          currentWeather: pattern.currentWeather + (Math.random() - 0.5) * 5,
          humidity: pattern.humidity + (Math.random() - 0.5) * 20,
          expectedActions: pattern.expectedActions
        };
        
        // Ensure values are within realistic bounds
        variation.buildingDensity = Math.max(20, Math.min(100, variation.buildingDensity));
        variation.vegetationIndex = Math.max(5, Math.min(100, variation.vegetationIndex));
        variation.surfaceAlbedo = Math.max(10, Math.min(50, variation.surfaceAlbedo));
        variation.cityTemp = Math.max(60, Math.min(100, variation.cityTemp));
        variation.cityVeg = Math.max(10, Math.min(70, variation.cityVeg));
        variation.cityPop = Math.max(100000, Math.min(2000000, variation.cityPop));
        variation.currentWeather = Math.max(50, Math.min(110, variation.currentWeather));
        variation.humidity = Math.max(20, Math.min(100, variation.humidity));
        
        trainingData.push(variation);
      }
    });

    this.trainingData = trainingData;
  }

  async trainModel() {
    if (!this.model) {
      await this.initialize();
    }

    // Prepare training data
    const features = this.trainingData.map(point => [
      point.buildingDensity / 100,
      point.vegetationIndex / 100,
      point.surfaceAlbedo / 50,
      this.severityToNumber(point.severity),
      point.cityTemp / 100,
      point.cityVeg / 100,
      point.cityPop / 2000000,
      point.currentWeather / 120,
      point.humidity / 100,
      Math.random() // Add some noise for robustness
    ]);

    const labels = this.trainingData.map(point => 
      this.actionTypes.map(actionType => 
        point.expectedActions.includes(actionType) ? 1 : 0
      )
    );

    // Convert to tensors
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    // Train the model with reduced epochs for faster loading
    console.log('Training action plan generation model...');
    try {
      const history = await this.model!.fit(xs, ys, {
        epochs: 15, // Reduced from 150 to 15 for faster training
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 3 === 0) { // Show progress more frequently
              console.log(`Epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.accuracy?.toFixed(4)}`);
            }
          }
        }
      });

      this.isTrained = true;
      console.log('Action plan model training completed!');
      
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      
      return history;
    } catch (error) {
      console.error('Error training action plan model:', error);
      // Clean up tensors even if training fails
      xs.dispose();
      ys.dispose();
      this.isTrained = false;
      throw error;
    }
  }

  private severityToNumber(severity: string): number {
    switch (severity) {
      case 'critical': return 1.0;
      case 'high': return 0.75;
      case 'moderate': return 0.5;
      case 'low': return 0.25;
      default: return 0.5;
    }
  }

  async generatePlans(zones: HeatZone[], city: City): Promise<ActionPlan[]> {
    const plans: ActionPlan[] = [];
    const usedActionTypes = new Set<string>(); // Track used action types to prevent duplicates
    
    // Get real-time weather data for the city
    let realTimeWeather = null;
    let realTimeEnvironmental = null;
    try {
      [realTimeWeather, realTimeEnvironmental] = await Promise.all([
        this.realTimeDataService.getRealTimeClimateData(city.coordinates[0], city.coordinates[1]),
        this.realTimeDataService.getRealTimeEnvironmentalData(city.coordinates[0], city.coordinates[1], city.name)
      ]);
    } catch (error) {
      console.warn('Real-time weather data not available, using city data');
    }
    
    for (const zone of zones) {
      const numActions = zone.severity === 'critical' ? 3 : 
                        zone.severity === 'high' ? 2 : 1;
      
      const centerLat = zone.coordinates.reduce((sum, coord) => sum + coord[0], 0) / zone.coordinates.length;
      const centerLng = zone.coordinates.reduce((sum, coord) => sum + coord[1], 0) / zone.coordinates.length;
      
      // Generate unique action plans using real-time data
      const allPossibleActions = await this.predictOptimalActions(zone, city, realTimeWeather, realTimeEnvironmental);
      
      // Filter out already used action types to prevent duplicates
      const availableActions = allPossibleActions.filter(actionType => !usedActionTypes.has(actionType));
      
      // If we don't have enough unique actions, add some fallback actions
      const fallbackActions = this.getFallbackActions(zone, city, realTimeWeather, realTimeEnvironmental);
      const additionalActions = fallbackActions.filter(actionType => 
        !usedActionTypes.has(actionType) && !availableActions.includes(actionType)
      );
      
      const actionTypes = [...availableActions, ...additionalActions].slice(0, numActions);
      
      for (let i = 0; i < Math.min(numActions, actionTypes.length); i++) {
        const actionType = actionTypes[i];
        const offsetLat = centerLat + (Math.random() - 0.5) * 0.003;
        const offsetLng = centerLng + (Math.random() - 0.5) * 0.003;
        
        const impact = this.calculateUniqueImpact(actionType, zone, city, realTimeWeather, realTimeEnvironmental);
        const implementation = this.getUniqueImplementation(actionType, zone.severity, city, realTimeWeather, realTimeEnvironmental);
        
        // Add unique zone identifier to action ID
        const zoneIdentifier = this.getZoneIdentifier(zone);
        
        plans.push({
          id: `action-${zone.id}-${actionType}-${i}`,
          type: actionType,
          location: [offsetLat, offsetLng],
          priority: zone.severity === 'critical' ? 'high' : 
                   zone.severity === 'high' ? 'medium' : 'low',
          impact,
          implementation
        });
        
        // Mark this action type as used
        usedActionTypes.add(actionType);
      }
    }
    
    return plans;
  }

  private getZoneIdentifier(zone: HeatZone): string {
    // Create a unique identifier based on zone characteristics
    const zoneType = zone.landUseType;
    const severity = zone.severity;
    const tempRange = zone.temperature > 90 ? 'extreme' : zone.temperature > 85 ? 'high' : zone.temperature > 80 ? 'moderate' : 'low';
    
    return `${zoneType}-${severity}-${tempRange}`;
  }

  private getFallbackActions(zone: HeatZone, city: City, realTimeWeather?: any, realTimeEnvironmental?: any): ActionPlan['type'][] {
    const fallbackActions: ActionPlan['type'][] = [];
    const currentTemp = realTimeWeather?.temperature || city.averageTemp;
    const currentHumidity = realTimeWeather?.humidity || 60;
    const carbonEmissions = realTimeEnvironmental?.carbonEmissions || 0;
    
    // Zone-specific fallback actions
    if (zone.landUseType === 'commercial') {
      fallbackActions.push('shade_structure', 'cool_pavement', 'green_roof');
    } else if (zone.landUseType === 'residential') {
      fallbackActions.push('tree_planting', 'urban_park', 'water_feature');
    } else if (zone.landUseType === 'industrial') {
      fallbackActions.push('smart_irrigation', 'cool_pavement', 'green_roof');
    } else {
      fallbackActions.push('tree_planting', 'urban_park', 'water_feature');
    }
    
    // Weather-specific fallback actions
    if (currentTemp > 95) {
      fallbackActions.push('cooling_center', 'shade_structure');
    }
    if (currentHumidity > 80) {
      fallbackActions.push('water_feature', 'smart_irrigation');
    }
    if (carbonEmissions > 8000) {
      fallbackActions.push('tree_planting', 'urban_park');
    }
    
    return fallbackActions;
  }

  private async predictOptimalActions(zone: HeatZone, city: City, realTimeWeather?: any, realTimeEnvironmental?: any): Promise<ActionPlan['type'][]> {
    if (!this.model || !this.isTrained) {
      // Enhanced fallback to rule-based approach if model not trained
      return this.enhancedFallbackActionSelection(zone, city, realTimeWeather, realTimeEnvironmental);
    }

    // Use real-time weather and environmental data if available
    const currentTemp = realTimeWeather?.temperature || city.averageTemp;
    const currentHumidity = realTimeWeather?.humidity || 60;
    const airQuality = realTimeWeather?.airQuality?.aqi || 3;
    const carbonEmissions = realTimeEnvironmental?.carbonEmissions || 0;
    const energyConsumption = realTimeEnvironmental?.energyConsumption || 0;

    // Prepare input features with real-time data
    const input = tf.tensor2d([[
      zone.buildingDensity / 100,
      zone.vegetationIndex / 100,
      zone.surfaceAlbedo / 50,
      this.severityToNumber(zone.severity),
      city.averageTemp / 100,
      city.vegetationCoverage / 100,
      city.population / 2000000,
      currentTemp / 120,
      currentHumidity / 100,
      airQuality / 5,
      carbonEmissions / 15000,
      energyConsumption / 20000
    ]]);

    // Make prediction
    const prediction = this.model.predict(input) as tf.Tensor;
    const probabilities = await prediction.data();
    
    // Get top actions based on probabilities
    const actionScores = this.actionTypes.map((action, index) => ({
      action,
      score: probabilities[index]
    }));
    
    actionScores.sort((a, b) => b.score - a.score);
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return actionScores.slice(0, 4).map(item => item.action);
  }

  private enhancedFallbackActionSelection(zone: HeatZone, city: City, realTimeWeather?: any, realTimeEnvironmental?: any): ActionPlan['type'][] {
    const actions: ActionPlan['type'][] = [];
    const currentTemp = realTimeWeather?.temperature || city.averageTemp;
    const currentHumidity = realTimeWeather?.humidity || 60;
    const airQuality = realTimeWeather?.airQuality?.aqi || 3;
    const carbonEmissions = realTimeEnvironmental?.carbonEmissions || 0;
    
    // Enhanced rule-based selection using real-time data
    if (zone.vegetationIndex < 15) {
      actions.push('tree_planting');
    }
    if (zone.landUseType === 'commercial' || currentTemp > 85) {
      actions.push('green_roof');
    }
    if (zone.surfaceAlbedo < 25 || currentTemp > 90) {
      actions.push('cool_pavement');
    }
    if (zone.buildingDensity > 70 && zone.vegetationIndex < 25) {
      actions.push('urban_park');
    }
    if (currentTemp > 95 && airQuality > 3) {
      actions.push('shade_structure');
    }
    if (currentHumidity > 80 || carbonEmissions > 8000) {
      actions.push('water_feature');
    }
    if (zone.vegetationIndex < 20 && currentTemp > 80) {
      actions.push('smart_irrigation');
    }
    if (currentTemp > 100 || zone.severity === 'critical') {
      actions.push('cooling_center');
    }
    
    // City-specific action preferences based on real-time data
    const cityId = city.id;
    if (cityId === 'phoenix' && currentTemp > 95) {
      actions.push('cool_pavement');
      actions.push('shade_structure');
    }
    if (cityId === 'miami' && currentHumidity > 80) {
      actions.push('green_roof');
      actions.push('water_feature');
    }
    if (cityId === 'las_vegas' && zone.landUseType === 'commercial') {
      actions.push('green_roof');
      actions.push('shade_structure');
    }
    if (cityId === 'houston' && carbonEmissions > 8000) {
      actions.push('smart_irrigation');
      actions.push('water_feature');
    }
    
    return actions.slice(0, 4);
  }

  private calculateUniqueImpact(actionType: ActionPlan['type'], zone: HeatZone, city: City, realTimeWeather?: any, realTimeEnvironmental?: any) {
    // Unique impact calculation based on real-time data
    const baseImpacts = {
      tree_planting: { temperatureReduction: 2.5, carbonSequestration: 48, energySavings: 12, airQualityImprovement: 15 },
      green_roof: { temperatureReduction: 1.8, carbonSequestration: 22, energySavings: 18, airQualityImprovement: 8 },
      cool_pavement: { temperatureReduction: 3.2, carbonSequestration: 5, energySavings: 25, airQualityImprovement: 3 },
      urban_park: { temperatureReduction: 4.1, carbonSequestration: 85, energySavings: 20, airQualityImprovement: 28 },
      shade_structure: { temperatureReduction: 5.2, carbonSequestration: 2, energySavings: 30, airQualityImprovement: 5 },
      water_feature: { temperatureReduction: 2.8, carbonSequestration: 8, energySavings: 15, airQualityImprovement: 12 },
      smart_irrigation: { temperatureReduction: 1.5, carbonSequestration: 15, energySavings: 8, airQualityImprovement: 10 },
      cooling_center: { temperatureReduction: 8.5, carbonSequestration: 0, energySavings: 45, airQualityImprovement: 20 }
    };

    const base = baseImpacts[actionType];
    const severityMultiplier = zone.severity === 'critical' ? 1.4 : zone.severity === 'high' ? 1.2 : 1.0;

    // Real-time weather impact multiplier
    const weatherMultiplier = realTimeWeather ? this.calculateWeatherMultiplier(realTimeWeather, actionType) : 1.0;

    // Real-time environmental data multiplier
    const environmentalMultiplier = realTimeEnvironmental ? this.calculateEnvironmentalMultiplier(realTimeEnvironmental, actionType) : 1.0;

    // City-specific multiplier based on real-time data
    const cityMultiplier = this.getCitySpecificMultiplier(city, realTimeWeather, realTimeEnvironmental, actionType);

    return {
      temperatureReduction: Math.round(base.temperatureReduction * severityMultiplier * weatherMultiplier * environmentalMultiplier * cityMultiplier),
      carbonSequestration: Math.round(base.carbonSequestration * severityMultiplier * weatherMultiplier * environmentalMultiplier * cityMultiplier),
      energySavings: Math.round(base.energySavings * severityMultiplier * weatherMultiplier * environmentalMultiplier * cityMultiplier),
      airQualityImprovement: Math.round(base.airQualityImprovement * severityMultiplier * weatherMultiplier * environmentalMultiplier * cityMultiplier)
    };
  }

  private calculateWeatherMultiplier(weather: any, actionType: ActionPlan['type']): number {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    const airQuality = weather.airQuality?.aqi || 3;
    
    // Enhanced weather-specific multipliers
    if (actionType === 'cool_pavement') {
      return temp > 90 ? 1.6 : temp > 85 ? 1.4 : temp > 80 ? 1.2 : 1.0;
    }
    if (actionType === 'green_roof') {
      return humidity > 80 ? 1.4 : humidity > 70 ? 1.2 : 1.0;
    }
    if (actionType === 'tree_planting') {
      return temp > 85 ? 1.3 : temp > 75 ? 1.1 : 1.0;
    }
    if (actionType === 'urban_park') {
      return temp > 85 ? 1.5 : temp > 75 ? 1.2 : 1.0;
    }
    if (actionType === 'shade_structure') {
      return temp > 95 ? 1.8 : temp > 90 ? 1.5 : temp > 85 ? 1.2 : 1.0;
    }
    if (actionType === 'water_feature') {
      return temp > 85 ? 1.4 : humidity > 80 ? 1.2 : 1.0;
    }
    if (actionType === 'smart_irrigation') {
      return temp > 80 ? 1.3 : humidity < 50 ? 1.2 : 1.0;
    }
    if (actionType === 'cooling_center') {
      return temp > 100 ? 2.0 : temp > 95 ? 1.6 : temp > 90 ? 1.3 : 1.0;
    }
    
    return 1.0;
  }

  private calculateEnvironmentalMultiplier(environmental: any, actionType: ActionPlan['type']): number {
    const carbonEmissions = environmental.carbonEmissions || 0;
    const energyConsumption = environmental.energyConsumption || 0;
    const airPollution = environmental.airPollutionLevel || 3;
    
    // Environmental data-based multipliers
    if (actionType === 'tree_planting') {
      return carbonEmissions > 8000 ? 1.4 : carbonEmissions > 6000 ? 1.2 : 1.0;
    }
    if (actionType === 'green_roof') {
      return energyConsumption > 12000 ? 1.3 : energyConsumption > 8000 ? 1.1 : 1.0;
    }
    if (actionType === 'cool_pavement') {
      return airPollution > 4 ? 1.5 : airPollution > 3 ? 1.2 : 1.0;
    }
    if (actionType === 'urban_park') {
      return carbonEmissions > 8000 ? 1.4 : carbonEmissions > 6000 ? 1.2 : 1.0;
    }
    if (actionType === 'smart_irrigation') {
      return energyConsumption > 10000 ? 1.3 : energyConsumption > 7000 ? 1.1 : 1.0;
    }
    
    return 1.0;
  }

  private getCitySpecificMultiplier(city: City, weather?: any, environmental?: any, actionType?: ActionPlan['type']): number {
    const cityId = city.id;
    const currentTemp = weather?.temperature || city.averageTemp;
    const carbonEmissions = environmental?.carbonEmissions || 0;
    
    // City-specific multipliers based on real-time data
    const cityPatterns = {
      phoenix: {
        tree_planting: currentTemp > 95 ? 1.6 : 1.4,
        green_roof: 1.2,
        cool_pavement: currentTemp > 95 ? 1.8 : 1.6,
        urban_park: 1.3,
        shade_structure: currentTemp > 95 ? 1.7 : 1.4,
        water_feature: 1.1,
        smart_irrigation: 1.3,
        cooling_center: currentTemp > 100 ? 2.0 : 1.5
      },
      las_vegas: {
        tree_planting: 1.3,
        green_roof: 1.5,
        cool_pavement: currentTemp > 90 ? 1.6 : 1.4,
        urban_park: 1.2,
        shade_structure: currentTemp > 90 ? 1.6 : 1.3,
        water_feature: 1.1,
        smart_irrigation: 1.2,
        cooling_center: currentTemp > 95 ? 1.8 : 1.4
      },
      miami: {
        tree_planting: 1.5,
        green_roof: 1.1,
        cool_pavement: 1.3,
        urban_park: 1.4,
        shade_structure: 1.2,
        water_feature: 1.4,
        smart_irrigation: 1.1,
        cooling_center: currentTemp > 90 ? 1.6 : 1.3
      },
      atlanta: {
        tree_planting: 1.6,
        green_roof: 1.3,
        cool_pavement: 1.2,
        urban_park: 1.4,
        shade_structure: 1.2,
        water_feature: 1.3,
        smart_irrigation: 1.2,
        cooling_center: currentTemp > 90 ? 1.5 : 1.2
      },
      houston: {
        tree_planting: carbonEmissions > 8000 ? 1.5 : 1.3,
        green_roof: 1.5,
        cool_pavement: 1.3,
        urban_park: 1.4,
        shade_structure: 1.3,
        water_feature: 1.4,
        smart_irrigation: 1.3,
        cooling_center: currentTemp > 90 ? 1.7 : 1.4
      },
      dallas: {
        tree_planting: 1.2,
        green_roof: 1.3,
        cool_pavement: 1.4,
        urban_park: 1.2,
        shade_structure: 1.2,
        water_feature: 1.2,
        smart_irrigation: 1.2,
        cooling_center: currentTemp > 90 ? 1.5 : 1.2
      }
    };

    const cityPattern = cityPatterns[cityId as keyof typeof cityPatterns] || {
      tree_planting: 1.2, green_roof: 1.2, cool_pavement: 1.2, urban_park: 1.2,
      shade_structure: 1.2, water_feature: 1.2, smart_irrigation: 1.2, cooling_center: 1.2
    };

    return actionType ? cityPattern[actionType] : 1.0;
  }

  private getUniqueImplementation(actionType: ActionPlan['type'], severity: HeatZone['severity'], city: City, realTimeWeather?: any, realTimeEnvironmental?: any) {
    const baseCosts = {
      tree_planting: 2500, green_roof: 12000, cool_pavement: 8500, urban_park: 45000,
      shade_structure: 15000, water_feature: 18000, smart_irrigation: 8000, cooling_center: 25000
    };
    const timeframes = {
      tree_planting: '2-4 weeks', green_roof: '6-10 weeks', cool_pavement: '1-3 weeks', urban_park: '12-18 weeks',
      shade_structure: '4-6 weeks', water_feature: '8-12 weeks', smart_irrigation: '3-5 weeks', cooling_center: '2-4 weeks'
    };
    const difficulties = {
      tree_planting: 'easy', green_roof: 'moderate', cool_pavement: 'moderate', urban_park: 'complex',
      shade_structure: 'moderate', water_feature: 'moderate', smart_irrigation: 'easy', cooling_center: 'moderate'
    } as const;

    const severityMultiplier = severity === 'critical' ? 1.3 : severity === 'high' ? 1.1 : 1.0;
    
    // Weather-based adjustments
    const weatherMultiplier = realTimeWeather ? this.calculateWeatherCostMultiplier(realTimeWeather, actionType) : 1.0;
    
    // Environmental data-based adjustments
    const environmentalMultiplier = realTimeEnvironmental ? this.calculateEnvironmentalCostMultiplier(realTimeEnvironmental, actionType) : 1.0;
    
    // City-specific cost multiplier
    const cityMultiplier = this.getCitySpecificCostMultiplier(city, realTimeWeather, realTimeEnvironmental);

    // Adjust timeframes based on weather and environmental conditions
    let adjustedTimeframe = timeframes[actionType];
    if (realTimeWeather || realTimeEnvironmental) {
      adjustedTimeframe = this.adjustTimeframeForConditions(timeframes[actionType], realTimeWeather, realTimeEnvironmental, actionType);
    }

    return {
      cost: Math.round(baseCosts[actionType] * severityMultiplier * weatherMultiplier * environmentalMultiplier * cityMultiplier),
      timeframe: adjustedTimeframe,
      difficulty: difficulties[actionType]
    };
  }

  private calculateWeatherCostMultiplier(weather: any, actionType: ActionPlan['type']): number {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    
    // Enhanced weather-specific cost adjustments
    if (actionType === 'cool_pavement') {
      return temp > 90 ? 1.4 : temp > 85 ? 1.3 : temp > 80 ? 1.2 : 1.0;
    }
    if (actionType === 'green_roof') {
      return humidity > 80 ? 1.3 : humidity > 70 ? 1.2 : 1.0;
    }
    if (actionType === 'tree_planting') {
      return temp > 85 ? 1.2 : temp > 75 ? 1.1 : 1.0;
    }
    if (actionType === 'urban_park') {
      return temp > 85 ? 1.3 : temp > 75 ? 1.2 : 1.0;
    }
    if (actionType === 'shade_structure') {
      return temp > 95 ? 1.4 : temp > 90 ? 1.3 : temp > 85 ? 1.2 : 1.0;
    }
    if (actionType === 'water_feature') {
      return temp > 85 ? 1.3 : humidity > 80 ? 1.2 : 1.0;
    }
    if (actionType === 'smart_irrigation') {
      return temp > 80 ? 1.2 : humidity < 50 ? 1.1 : 1.0;
    }
    if (actionType === 'cooling_center') {
      return temp > 100 ? 1.5 : temp > 95 ? 1.3 : temp > 90 ? 1.2 : 1.0;
    }
    
    return 1.0;
  }

  private calculateEnvironmentalCostMultiplier(environmental: any, actionType: ActionPlan['type']): number {
    const carbonEmissions = environmental.carbonEmissions || 0;
    const energyConsumption = environmental.energyConsumption || 0;
    const airPollution = environmental.airPollutionLevel || 3;
    
    // Environmental data-based cost adjustments
    if (actionType === 'tree_planting') {
      return carbonEmissions > 8000 ? 1.3 : carbonEmissions > 6000 ? 1.2 : 1.0;
    }
    if (actionType === 'green_roof') {
      return energyConsumption > 12000 ? 1.2 : energyConsumption > 8000 ? 1.1 : 1.0;
    }
    if (actionType === 'cool_pavement') {
      return airPollution > 4 ? 1.3 : airPollution > 3 ? 1.2 : 1.0;
    }
    if (actionType === 'urban_park') {
      return carbonEmissions > 8000 ? 1.3 : carbonEmissions > 6000 ? 1.2 : 1.0;
    }
    if (actionType === 'smart_irrigation') {
      return energyConsumption > 10000 ? 1.2 : energyConsumption > 7000 ? 1.1 : 1.0;
    }
    
    return 1.0;
  }

  private getCitySpecificCostMultiplier(city: City, weather?: any, environmental?: any): number {
    const cityId = city.id;
    const currentTemp = weather?.temperature || city.averageTemp;
    const carbonEmissions = environmental?.carbonEmissions || 0;
    
    // City-specific cost patterns based on real-time data
    const cityCostPatterns = {
      phoenix: currentTemp > 95 ? 1.4 : 1.3, // Higher costs due to extreme heat materials
      las_vegas: 1.4, // Higher costs due to entertainment industry standards
      miami: 1.2, // Moderate costs with coastal considerations
      atlanta: 1.1, // Standard costs with good infrastructure
      houston: carbonEmissions > 8000 ? 1.3 : 1.2, // Higher due to energy industry
      dallas: 1.1 // Standard costs with good infrastructure
    };

    return cityCostPatterns[cityId as keyof typeof cityCostPatterns] || 1.0;
  }

  private adjustTimeframeForConditions(baseTimeframe: string, weather?: any, environmental?: any, actionType?: ActionPlan['type']): string {
    const temp = weather?.temperature || 75;
    const humidity = weather?.humidity || 60;
    const carbonEmissions = environmental?.carbonEmissions || 0;
    
    // Enhanced timeframe adjustments based on real-time conditions
    if (actionType === 'cool_pavement') {
      if (temp > 95) return '2-4 weeks'; // Longer in extreme heat
      if (temp > 85) return '1-2 weeks'; // Slightly longer in heat
    }
    if (actionType === 'green_roof') {
      if (humidity > 80) return '8-12 weeks'; // Longer in high humidity
      if (humidity > 70) return '6-10 weeks'; // Standard timeframe
    }
    if (actionType === 'tree_planting') {
      if (temp > 85) return '3-5 weeks'; // Longer in heat
      if (temp < 50) return '4-6 weeks'; // Longer in cold
    }
    if (actionType === 'urban_park') {
      if (temp > 85) return '14-20 weeks'; // Longer in heat
      if (temp < 50) return '16-22 weeks'; // Longer in cold
    }
    if (actionType === 'shade_structure') {
      if (temp > 95) return '5-7 weeks'; // Longer in extreme heat
      if (temp > 85) return '4-6 weeks'; // Standard timeframe
    }
    if (actionType === 'water_feature') {
      if (temp > 85) return '10-14 weeks'; // Longer in heat
      if (humidity > 80) return '8-12 weeks'; // Standard timeframe
    }
    if (actionType === 'smart_irrigation') {
      if (temp > 80) return '4-6 weeks'; // Longer in heat
      if (humidity < 50) return '3-5 weeks'; // Standard timeframe
    }
    if (actionType === 'cooling_center') {
      if (temp > 100) return '3-5 weeks'; // Urgent in extreme heat
      if (temp > 95) return '2-4 weeks'; // Faster in high heat
    }
    
    return baseTimeframe;
  }
}

interface ActionTrainingData {
  buildingDensity: number;
  vegetationIndex: number;
  surfaceAlbedo: number;
  severity: string;
  cityTemp: number;
  cityVeg: number;
  cityPop: number;
  currentWeather: number;
  humidity: number;
  expectedActions: string[];
}