import React, { useState, useEffect } from 'react';
import { Leaf, Brain } from 'lucide-react';
import CitySelector from './components/CitySelector';
import HeatMap from './components/HeatMap';
import ZoneAnalysis from './components/ZoneAnalysis';
import EnvironmentalData from './components/EnvironmentalData';
import ActionPlans from './components/ActionPlans';
import ClimateImpactAnalysis from './components/ClimateImpactAnalysis';
import { City, HeatZone, EnvironmentalData as EnvData, ActionPlan } from './types';
import { HeatIslandPredictor } from './ml/heatIslandAnalysis';
import { ActionPlanGenerator } from './ml/actionPlanGenerator';
import { ClimateImpactAnalyzer } from './ml/climateImpactAnalyzer';
import { temperaturePatterns } from './data/realCityData';

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [heatZones, setHeatZones] = useState<HeatZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<HeatZone | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvData | null>(null);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [climateImpact, setClimateImpact] = useState<any>(null);
  const [futurePredictions, setFuturePredictions] = useState<any[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModelTraining, setIsModelTraining] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const [predictor] = useState(() => new HeatIslandPredictor());
  const [planGenerator] = useState(() => new ActionPlanGenerator());
  const [climateAnalyzer] = useState(() => new ClimateImpactAnalyzer());

  useEffect(() => {
    const initializeModels = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.warn('Model training timeout, proceeding with fallback models');
          setIsModelTraining(false);
        }, 30000); // 30 second timeout

        // Suppress console errors from browser extensions
        const originalConsoleError = console.error;
        console.error = (...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('Host is not in insights whitelist') || 
              message.includes('Host validation failed') ||
              message.includes('Host is not supported')) {
            return; // Suppress these specific errors
          }
          originalConsoleError.apply(console, args);
        };

        await predictor.initialize();
        await planGenerator.initialize();
        await climateAnalyzer.initialize();
        
        await predictor.trainModel();
        setTrainingProgress(33);
        
        await planGenerator.trainModel();
        setTrainingProgress(66);
        
        await climateAnalyzer.trainModel();
        setTrainingProgress(100);
        
        clearTimeout(timeoutId);
        setIsModelTraining(false);
        
        // Restore original console.error
        console.error = originalConsoleError;
      } catch (error) {
        console.error('Error training models:', error);
        setIsModelTraining(false);
      }
    };

    initializeModels();
  }, [predictor, planGenerator, climateAnalyzer]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setHeatZones([]);
    setSelectedZone(null);
    setEnvironmentalData(null);
    setActionPlans([]);
  };

  const handleAnalyze = async () => {
    if (!selectedCity || isModelTraining) return;

    setIsAnalyzing(true);
    
    try {
      const zones = await predictor.generateHeatZones(selectedCity);
      const plans = await planGenerator.generatePlans(zones, selectedCity);
      const climateData = await climateAnalyzer.analyzeClimateImpact(zones, selectedCity);
      const predictions = await climateAnalyzer.predictFutureClimate(selectedCity, zones);
      
      const cityKey = selectedCity.id as keyof typeof temperaturePatterns;
      const tempData = temperaturePatterns[cityKey];
      
      const envData: EnvData = {
        city: selectedCity.name,
        temperatureData: tempData,
        vegetationData: {
          ndvi: selectedCity.vegetationCoverage / 100,
          treeCanopyCover: selectedCity.vegetationCoverage,
          greenSpaceRatio: selectedCity.vegetationCoverage * 1.2
        },
        urbanMetrics: {
          buildingDensity: 45 + Math.random() * 30,
          roadDensity: 25 + Math.random() * 20,
          populationDensity: selectedCity.population / 1000,
          imperviousSurface: 100 - selectedCity.vegetationCoverage
        }
      };

      setHeatZones(zones);
      setActionPlans(plans);
      setEnvironmentalData(envData);
      setClimateImpact(climateData);
      setFuturePredictions(predictions);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isModelTraining) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Models
            </h2>
            <p className="text-gray-600 mb-6">
              Preparing climate analysis models...
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-500">
              {trainingProgress < 33 ? 'Initializing...' : 
               trainingProgress < 66 ? 'Training models...' : 
               'Finalizing...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ReLeaf</h1>
                <p className="text-sm text-gray-600">Climate Intelligence Platform</p>
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!selectedCity || isAnalyzing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCity && !isAnalyzing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze City
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Urban Heat Island Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Analyze urban heat patterns, predict climate impacts, and generate actionable solutions for cities.
            </p>
          </div>

          <CitySelector 
            selectedCity={selectedCity}
            onCitySelect={handleCitySelect}
          />

          <HeatMap 
            city={selectedCity}
            heatZones={heatZones}
            actionPlans={actionPlans}
            onZoneSelect={setSelectedZone}
            isAnalyzing={isAnalyzing}
          />

          <div className="grid lg:grid-cols-2 gap-8">
            <ZoneAnalysis selectedZone={selectedZone} />
            <EnvironmentalData 
              data={environmentalData} 
              cityCoordinates={selectedCity?.coordinates}
              cityName={selectedCity?.name}
            />
          </div>

          <ClimateImpactAnalysis 
            climateImpact={climateImpact}
            futurePredictions={futurePredictions}
            cityName={selectedCity?.name}
          />

          <ActionPlans 
            actionPlans={actionPlans}
            cityName={selectedCity?.name || ''}
            heatZones={heatZones}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">ReLeaf</span>
            </div>
            <p className="text-gray-600">
              Climate intelligence for sustainable cities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;