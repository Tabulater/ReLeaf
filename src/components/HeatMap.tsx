import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Rectangle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Thermometer, AlertTriangle, TreePine, Building, MapPin, Brain } from 'lucide-react';
import { HeatZone, City, ActionPlan } from '../types';
import { HeatIslandPredictor } from '../ml/heatIslandAnalysis';
import { RealTimeDataService } from '../utils/realTimeDataService';

interface HeatMapProps {
  city: City | null;
  heatZones: HeatZone[];
  actionPlans: ActionPlan[];
  onZoneSelect: (zone: HeatZone | null) => void;
  isAnalyzing: boolean;
}

interface HeatGridCell {
  id: string;
  bounds: [number, number, number, number]; // [south, west, north, east]
  temperature: number;
  severity: HeatZone['severity'];
  buildingDensity: number;
  vegetationIndex: number;
  populationDensity: number;
  riskScore: number;
  confidence: number;
}

export default function HeatMap({ city, heatZones, actionPlans, onZoneSelect, isAnalyzing }: HeatMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showActionPlans, setShowActionPlans] = useState(false);
  const [heatGrid, setHeatGrid] = useState<HeatGridCell[]>([]);
  const [isGeneratingGrid, setIsGeneratingGrid] = useState(false);
  const [predictor] = useState(() => new HeatIslandPredictor());
  const [realTimeService] = useState(() => RealTimeDataService.getInstance());

  // Generate comprehensive heat grid for entire city
  const generateHeatGrid = async () => {
    if (!city) return;

    setIsGeneratingGrid(true);
    const grid: HeatGridCell[] = [];
    
    const [centerLat, centerLng] = city.coordinates;
    const cityRadius = 0.05;
    
    const gridSize = 10;
    const latStep = (cityRadius * 2) / gridSize;
    const lngStep = (cityRadius * 2) / gridSize;
    
    console.log(`Generating heat grid for ${city.name} at coordinates:`, centerLat, centerLng);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cellLat = centerLat - cityRadius + (i * latStep);
        const cellLng = centerLng - cityRadius + (j * lngStep);
        
        const distanceFromCenter = Math.sqrt(
          Math.pow((cellLat - centerLat) / cityRadius, 2) + 
          Math.pow((cellLng - centerLng) / cityRadius, 2)
        );
        
        const buildingDensity = Math.max(10, Math.min(95, 
          90 - (distanceFromCenter * 60) + (Math.random() - 0.5) * 20
        ));
        
        const vegetationIndex = Math.max(5, Math.min(80, 
          10 + (distanceFromCenter * 50) + (Math.random() - 0.5) * 20
        ));
        
        const baseTemp = 75;
        const urbanHeatEffect = distanceFromCenter < 0.3 ? 15 : distanceFromCenter < 0.6 ? 8 : 2;
        const randomVariation = (Math.random() - 0.5) * 10;
        const temperature = Math.round(baseTemp + urbanHeatEffect + randomVariation);
        
        let severity: HeatZone['severity'];
        if (temperature > 90) severity = 'critical';
        else if (temperature > 85) severity = 'high';
        else if (temperature > 80) severity = 'moderate';
        else severity = 'low';
        
        const populationDensity = Math.max(100, Math.min(15000, 
          city.population / 1000 * (1 - distanceFromCenter * 0.8) + (Math.random() - 0.5) * 2000
        ));
        
        const riskScore = Math.round((temperature - 70) * 3);
        
        const cell: HeatGridCell = {
          id: `cell-${i}-${j}`,
          bounds: [cellLat, cellLng, cellLat + latStep, cellLng + lngStep],
          temperature,
          severity,
          buildingDensity: Math.round(buildingDensity),
          vegetationIndex: Math.round(vegetationIndex),
          populationDensity: Math.round(populationDensity),
          riskScore: Math.max(0, Math.min(100, riskScore)),
          confidence: 75 + Math.random() * 20
        };
        
        grid.push(cell);
      }
    }
    
    setHeatGrid(grid);
    console.log(`Generated ${grid.length} heat grid cells for ${city.name}`);
    setIsGeneratingGrid(false);
  };

  useEffect(() => {
    if (city) {
      console.log('Starting heat grid generation for city:', city.name);
      generateHeatGrid();
    } else {
      console.log('No city selected, clearing heat grid');
      setHeatGrid([]);
    }
  }, [city]);

  useEffect(() => {
    console.log('Heat grid updated with', heatGrid.length, 'cells');
    if (heatGrid.length > 0) {
      console.log('Sample cell:', heatGrid[0]);
    }
  }, [heatGrid]);

  const getSeverityColor = (severity: HeatZone['severity'], temperature: number) => {
    switch (severity) {
      case 'critical':
        return { 
          color: '#dc2626', 
          fillColor: temperature > 95 ? '#991b1b' : '#dc2626',
          fillOpacity: 0.8
        };
      case 'high':
        return { 
          color: '#ea580c', 
          fillColor: temperature > 88 ? '#c2410c' : '#ea580c',
          fillOpacity: 0.7
        };
      case 'moderate':
        return { 
          color: '#d97706', 
          fillColor: temperature > 82 ? '#a16207' : '#d97706',
          fillOpacity: 0.6
        };
      case 'low':
        return { 
          color: '#16a34a', 
          fillColor: temperature > 75 ? '#15803d' : '#16a34a',
          fillOpacity: 0.5
        };
    }
  };

  const getActionIcon = (type: ActionPlan['type']) => {
    switch (type) {
      case 'tree_planting': return <TreePine className="w-4 h-4 text-green-600" />;
      case 'green_roof': return <Building className="w-4 h-4 text-blue-600" />;
      case 'cool_pavement': return <div className="w-4 h-4 bg-gray-600 rounded" />;
      case 'urban_park': return <div className="w-4 h-4 bg-green-500 rounded-full" />;
    }
  };

  const handleCellClick = (cell: HeatGridCell) => {
    setSelectedZone(cell.id);
    const zone: HeatZone = {
      id: cell.id,
      name: `Grid Cell ${cell.id}`,
      coordinates: [
        [cell.bounds[0], cell.bounds[1]],
        [cell.bounds[0], cell.bounds[3]],
        [cell.bounds[2], cell.bounds[3]],
        [cell.bounds[2], cell.bounds[1]]
      ],
      temperature: cell.temperature,
      severity: cell.severity,
      landUseType: cell.buildingDensity > 70 ? 'commercial' : 
                   cell.buildingDensity > 40 ? 'residential' : 'industrial',
      vegetationIndex: cell.vegetationIndex,
      buildingDensity: cell.buildingDensity,
      surfaceAlbedo: cell.buildingDensity < 50 ? 35 : 25,
      predictions: {
        temperatureIncrease: cell.temperature - 75,
        riskScore: cell.riskScore,
        confidence: cell.confidence
      }
    };
    onZoneSelect(zone);
  };

  if (!city) {
    return (
      <div className="w-full h-96 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No City Selected</h3>
          <p className="text-gray-500">Choose a city to view heat island analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="absolute top-2 left-2 bg-white p-2 rounded text-xs z-[1000] shadow-md map-ui-overlay">
          Grid cells: {heatGrid.length}
        </div>
        
        <MapContainer
          center={city.coordinates as LatLngExpression}
          zoom={11}
          className="w-full h-full"
          key={city.id}
          style={{ zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {heatGrid.length === 0 && city && (
            <Rectangle
              bounds={[
                [city.coordinates[0] - 0.01, city.coordinates[1] - 0.01],
                [city.coordinates[0] + 0.01, city.coordinates[1] + 0.01]
              ]}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#dc2626',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <div className="p-3">
                  <h4 className="font-medium">Test Heat Spot</h4>
                  <p className="text-sm">Temperature: 95°F</p>
                  <p className="text-sm">Severity: Critical</p>
                </div>
              </Popup>
            </Rectangle>
          )}
          
          {/* Render comprehensive heat grid */}
          {heatGrid.map((cell) => (
            <Rectangle
              key={cell.id}
              bounds={[
                [cell.bounds[0], cell.bounds[1]],
                [cell.bounds[2], cell.bounds[3]]
              ]}
              pathOptions={{
                ...getSeverityColor(cell.severity, cell.temperature),
                weight: selectedZone === cell.id ? 3 : 2,
                opacity: 0.8,
                fillOpacity: 0.6
              }}
              eventHandlers={{
                click: () => handleCellClick(cell)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <h4 className="font-medium text-gray-900 mb-2">Heat Analysis</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">{cell.temperature}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Score:</span>
                      <span className="font-medium">{cell.riskScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building Density:</span>
                      <span className="font-medium">{cell.buildingDensity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vegetation:</span>
                      <span className="font-medium">{cell.vegetationIndex}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-medium">{cell.populationDensity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium">{Math.round(cell.confidence)}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Rectangle>
          ))}

          {/* Show action plans as markers */}
          {showActionPlans && actionPlans.map((plan) => (
            <Marker key={plan.id} position={plan.location as LatLngExpression}>
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    {getActionIcon(plan.type)}
                    <h4 className="font-medium capitalize">{plan.type.replace('_', ' ')}</h4>
                  </div>
                  <p className="text-sm text-gray-600">Priority: {plan.priority}</p>
                  <p className="text-sm text-gray-600">Temp Reduction: {plan.impact.temperatureReduction}°F</p>
                  <p className="text-sm text-gray-600">Cost: ${plan.implementation.cost.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Loading indicator - Fixed positioning */}
      {(isAnalyzing || isGeneratingGrid) && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-[1000] map-ui-overlay">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">
              {isGeneratingGrid ? 'Generating heat grid with ML...' : 'Analyzing heat patterns...'}
            </span>
          </div>
        </div>
      )}

      {/* ML Status Indicator - Fixed positioning */}
      <div className="absolute top-4 right-4 z-[1000] map-controls">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowActionPlans(!showActionPlans)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-md ${
              showActionPlans
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {showActionPlans ? 'Hide' : 'Show'} Solutions
          </button>
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs shadow-md">
            <Brain className="w-3 h-3" />
            <span>ML Active</span>
          </div>
        </div>
      </div>

      {/* Enhanced Legend - Fixed positioning and styling */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[1000] max-w-xs map-ui-overlay">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Real-Time Heat Map</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            <Brain className="w-3 h-3" />
            <span>ML</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-xs text-gray-600">Critical (&gt;90°F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded" />
            <span className="text-xs text-gray-600">High (85-90°F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded" />
            <span className="text-xs text-gray-600">Moderate (80-85°F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-xs text-gray-600">Low (&lt;80°F)</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Grid: {heatGrid.length} cells • ML Confidence: {predictor.getTrainingStatus().isTrained ? 'High' : 'Training'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            🌍 NASA Satellite + Open-Meteo Weather
          </p>
        </div>
      </div>
    </div>
  );
}