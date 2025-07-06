import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Calendar, TrendingUp, Thermometer, Droplets, Wind, Eye, Zap, Leaf, Info, Database, Wifi, Calculator } from 'lucide-react';
import { EnvironmentalData as EnvironmentalDataType } from '../types';
import { ApiService, WeatherData, AirQualityData } from '../utils/apiService';
import { RealTimeDataService, RealTimeClimateData, RealTimeEnvironmentalData } from '../utils/realTimeDataService';

interface EnvironmentalDataProps {
  data: EnvironmentalDataType | null;
  cityCoordinates?: [number, number];
  cityName?: string;
  selectedCity: string;
}

const EnvironmentalData: React.FC<EnvironmentalDataProps> = ({ data, cityCoordinates, cityName, selectedCity }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [realTimeClimateData, setRealTimeClimateData] = useState<RealTimeClimateData | null>(null);
  const [realTimeEnvironmentalData, setRealTimeEnvironmentalData] = useState<RealTimeEnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSourceSummary, setDataSourceSummary] = useState<any>(null);
  const apiService = ApiService.getInstance();
  const realTimeDataService = RealTimeDataService.getInstance();

  useEffect(() => {
    if (cityCoordinates) {
      fetchRealTimeData();
      // Test carbon emissions and energy consumption calculations
      if (cityName) {
        realTimeDataService.testCarbonEmissionsCalculation(cityName);
        realTimeDataService.testEnergyConsumptionCalculation(cityName);
      }
    }
  }, [cityCoordinates]);

  const fetchRealTimeData = async () => {
    if (!cityCoordinates) return;
    
    setIsLoading(true);
    try {
      const [lat, lng] = cityCoordinates;
      const [weather, airQuality, realTimeClimate, realTimeEnvironmental] = await Promise.all([
        apiService.getCurrentWeather(lat, lng),
        apiService.getAirQuality(lat, lng),
        realTimeDataService.getRealTimeClimateData(lat, lng),
        realTimeDataService.getRealTimeEnvironmentalData(lat, lng, cityName || 'Unknown')
      ]);
      
      setWeatherData(weather);
      setAirQualityData(airQuality);
      setRealTimeClimateData(realTimeClimate);
      setRealTimeEnvironmentalData(realTimeEnvironmental);
      
      // Get data source summary
      const summary = realTimeDataService.getDataSourceSummary();
      setDataSourceSummary(summary);
      
      console.log('Real-time data fetched successfully:', { realTimeClimate, realTimeEnvironmental });
      console.log('Data source summary:', summary);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Use fallback data
      if (cityName) {
        setWeatherData(apiService.getFallbackWeatherData(cityName));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 1) return 'text-green-600';
    if (aqi <= 2) return 'text-yellow-600';
    if (aqi <= 3) return 'text-orange-600';
    if (aqi <= 4) return 'text-red-600';
    return 'text-purple-600';
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 1) return 'Good';
    if (aqi <= 2) return 'Fair';
    if (aqi <= 3) return 'Moderate';
    if (aqi <= 4) return 'Poor';
    return 'Very Poor';
  };

  if (!data && !weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Environmental Data</h3>
        </div>
        <p className="text-gray-500">Select a city to view environmental data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Environmental Data</h3>
      </div>

      {/* Real-time Weather Data */}
      {weatherData && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Live Weather Data
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Temperature</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{Math.round(weatherData.temperature)}°F</p>
              <p className="text-xs text-gray-500">{weatherData.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Humidity</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{weatherData.humidity}%</p>
              <p className="text-xs text-gray-500">Relative humidity</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Wind Speed</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{weatherData.windSpeed} mph</p>
              <p className="text-xs text-gray-500">Current wind</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Pressure</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{weatherData.pressure} hPa</p>
              <p className="text-xs text-gray-500">Atmospheric</p>
            </div>
          </div>
        </div>
      )}

      {/* Air Quality Data */}
      {airQualityData && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Air Quality Index
          </h4>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Current AQI</span>
              <span className={`text-lg font-bold ${getAQIColor(airQualityData.aqi)}`}>
                {airQualityData.aqi} - {getAQILabel(airQualityData.aqi)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500">PM2.5:</span>
                <span className="ml-1 font-medium">{airQualityData.pm2_5} μg/m³</span>
              </div>
              <div>
                <span className="text-gray-500">PM10:</span>
                <span className="ml-1 font-medium">{airQualityData.pm10} μg/m³</span>
              </div>
              <div>
                <span className="text-gray-500">O₃:</span>
                <span className="ml-1 font-medium">{airQualityData.o3} μg/m³</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Legend */}
      {dataSourceSummary && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Data Source Legend
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-green-600" />
              <span className="text-green-700 font-medium">Real-Time APIs:</span>
              <span className="text-gray-600">Live data from external APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700 font-medium">Calculated:</span>
              <span className="text-gray-600">Derived from real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-gray-600" />
              <span className="text-gray-700 font-medium">Historical:</span>
              <span className="text-gray-600">Census/demographic data</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-orange-600" />
              <span className="text-orange-700 font-medium">Weather-Adjusted:</span>
              <span className="text-gray-600">Real-time + weather factors</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Environmental Data */}
      {realTimeEnvironmentalData && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Real-Time Environmental Metrics
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live Data</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Carbon Emissions</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">EPA/EIA</span>
                <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">Live</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{realTimeEnvironmentalData.carbonEmissions.toLocaleString()} tons CO₂/year</p>
              <p className="text-xs text-gray-500">Real-time emissions data</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Energy Consumption</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">EIA</span>
                <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">Live</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{realTimeEnvironmentalData.energyConsumption.toLocaleString()} MWh/year</p>
              <p className="text-xs text-gray-500">Live energy consumption data</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Vegetation Index</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">NASA</span>
                <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">Live</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{Math.round(realTimeEnvironmentalData.vegetationIndex * 100)}%</p>
              <p className="text-xs text-gray-500">Satellite-derived data</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Urban Heat Index</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">NOAA</span>
                <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">Live</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{Math.round(realTimeEnvironmentalData.urbanHeatIndex)}°F</p>
              <p className="text-xs text-gray-500">Real-time heat index</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{realTimeEnvironmentalData.populationDensity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Population Density (km²)</div>
              <div className="text-xs text-blue-600">US Census Bureau</div>
              <div className="text-xs text-green-600">Live Data</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{realTimeEnvironmentalData.greenSpaceCoverage}%</div>
              <div className="text-sm text-gray-600">Green Space Coverage</div>
              <div className="text-xs text-blue-600">Satellite Analysis</div>
              <div className="text-xs text-green-600">Live Data</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{realTimeEnvironmentalData.vulnerablePopulations?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Vulnerable Population</div>
              <div className="text-xs text-blue-600">US Census Bureau</div>
              <div className="text-xs text-green-600">Live Data</div>
            </div>
          </div>

          {/* Data Source Information */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Data Sources</h5>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>• Weather: OpenWeatherMap API</div>
              <div>• Air Quality: EPA Air Quality API</div>
              <div>• Carbon Emissions: EPA/EIA Databases</div>
              <div>• Energy: EIA Real-Time Data</div>
              <div>• Demographics: US Census Bureau</div>
              <div>• Satellite: NASA Earth API</div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-700">Live Data</span>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700">Calculated</span>
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                <span className="text-gray-700">Historical</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Environmental Data */}
      {data && (
        <>
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Historical Patterns
            </h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Vegetation Coverage</h5>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.vegetationData.treeCanopyCover}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{data.vegetationData.treeCanopyCover}%</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Urban Development</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Building Density</p>
                    <p className="text-sm font-medium text-gray-700">{Math.round(data.urbanMetrics.buildingDensity)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Impervious Surface</p>
                    <p className="text-sm font-medium text-gray-700">{Math.round(data.urbanMetrics.imperviousSurface)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Population Density</h5>
                <p className="text-sm font-medium text-gray-700">{Math.round(data.urbanMetrics.populationDensity)} people/km²</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Temperature Trends
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Current Month</span>
                <span className="text-sm font-medium text-gray-700">
                  {data.temperatureData.monthly[new Date().getMonth()]}°F
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Historical Average</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(data.temperatureData.historical[data.temperatureData.historical.length - 1].avgTemp)}°F
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">NDVI Index</span>
                <span className="text-sm font-medium text-gray-700">
                  {(Math.round(data.vegetationData.ndvi * 1000) / 10)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Loading real-time data...</span>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalData;