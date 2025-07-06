import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Thermometer, AlertTriangle, TreePine, Building, MapPin } from 'lucide-react';
import { HeatZone, City, ActionPlan } from '../types';

interface HeatMapProps {
  city: City | null;
  heatZones: HeatZone[];
  actionPlans: ActionPlan[];
  onZoneSelect: (zone: HeatZone | null) => void;
  isAnalyzing: boolean;
}

export default function HeatMap({ city, heatZones, actionPlans, onZoneSelect, isAnalyzing }: HeatMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showActionPlans, setShowActionPlans] = useState(false);

  const getSeverityColor = (severity: HeatZone['severity']) => {
    switch (severity) {
      case 'critical': return { color: '#dc2626', fillColor: '#dc2626' };
      case 'high': return { color: '#ea580c', fillColor: '#ea580c' };
      case 'moderate': return { color: '#d97706', fillColor: '#d97706' };
      case 'low': return { color: '#16a34a', fillColor: '#16a34a' };
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

  const handleZoneClick = (zone: HeatZone) => {
    setSelectedZone(zone.id);
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
        <MapContainer
          center={city.coordinates as LatLngExpression}
          zoom={11}
          className="w-full h-full"
          key={city.id}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {heatZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates as LatLngExpression[]}
              pathOptions={{
                ...getSeverityColor(zone.severity),
                fillOpacity: selectedZone === zone.id ? 0.7 : 0.5,
                weight: selectedZone === zone.id ? 3 : 1,
                opacity: 0.8
              }}
              eventHandlers={{
                click: () => handleZoneClick(zone)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-sm text-gray-600">Temperature: {zone.temperature}°F</p>
                  <p className="text-sm text-gray-600">Risk Score: {zone.predictions.riskScore}%</p>
                  <p className="text-sm text-gray-600">Land Use: {zone.landUseType}</p>
                </div>
              </Popup>
            </Polygon>
          ))}

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

      {isAnalyzing && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Analyzing heat patterns...</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowActionPlans(!showActionPlans)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showActionPlans
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {showActionPlans ? 'Hide' : 'Show'} Solutions
        </button>
      </div>

      {heatZones.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Heat Risk Levels</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span className="text-xs text-gray-600">Critical (&gt;90°F)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full" />
              <span className="text-xs text-gray-600">High (85-90°F)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full" />
              <span className="text-xs text-gray-600">Moderate (80-85°F)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-xs text-gray-600">Low (&lt;80°F)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}