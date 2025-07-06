import React from 'react';
import { Thermometer, AlertTriangle, TrendingUp, Building, TreePine } from 'lucide-react';
import { HeatZone } from '../types';

interface ZoneAnalysisProps {
  selectedZone: HeatZone | null;
}

export default function ZoneAnalysis({ selectedZone }: ZoneAnalysisProps) {
  if (!selectedZone) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Thermometer className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Zone Analysis</h3>
        <p className="text-gray-600">Select a zone on the map to view detailed analysis</p>
      </div>
    );
  }

  const getSeverityInfo = (severity: HeatZone['severity']) => {
    switch (severity) {
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical Risk' };
      case 'high':
        return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High Risk' };
      case 'moderate':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Moderate Risk' };
      case 'low':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Low Risk' };
    }
  };

  const severityInfo = getSeverityInfo(selectedZone.severity);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{selectedZone.name}</h3>
            <p className="text-blue-100 text-sm mt-1">Heat Island Analysis</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${severityInfo.bg} ${severityInfo.border} ${severityInfo.color}`}>
            {severityInfo.label}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{selectedZone.temperature}°F</div>
            <div className="text-sm text-gray-600">Current Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">+{selectedZone.predictions.temperatureIncrease}°F</div>
            <div className="text-sm text-gray-600">Heat Island Effect</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Risk Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${selectedZone.predictions.riskScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{selectedZone.predictions.riskScore}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-700">Building Density</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{selectedZone.buildingDensity}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TreePine className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-700">Vegetation Index</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{selectedZone.vegetationIndex}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-700">ML Confidence</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{Math.round(selectedZone.predictions.confidence)}%</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Land Use Analysis</h4>
          <p className="text-sm text-blue-800">
            This {selectedZone.landUseType} area shows elevated heat retention due to 
            {selectedZone.buildingDensity > 60 ? ' high building density' : ' moderate development'} and 
            {selectedZone.vegetationIndex < 25 ? ' limited vegetation coverage' : ' adequate green space'}.
            {selectedZone.severity === 'critical' && ' Immediate intervention recommended.'}
          </p>
        </div>
      </div>
    </div>
  );
}