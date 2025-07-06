import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, DollarSign, Users, Leaf, Zap, Clock, Target, CheckCircle, ArrowUpRight, Heart } from 'lucide-react';
import { ClimateImpact, ClimatePrediction } from '../models/climateImpactAnalyzer';

interface ClimateImpactAnalysisProps {
  climateImpact: ClimateImpact | null;
  futurePredictions: ClimatePrediction[] | null;
  cityName?: string;
}

const ClimateImpactAnalysis: React.FC<ClimateImpactAnalysisProps> = ({ 
  climateImpact, 
  futurePredictions, 
  cityName 
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'future' | 'recommendations'>('current');

  if (!climateImpact) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Climate Impact Analysis</h3>
        </div>
        <p className="text-gray-500">Run AI analysis to view climate impact insights</p>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${Math.round(amount / 1000000)}M`;
    }
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}K`;
    }
    return `$${Math.round(amount)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Climate Impact Analysis</h3>
          <p className="text-sm text-gray-600">AI-powered climate change insights for {cityName}</p>
        </div>
      </div>

      {/* Urgency Alert */}
      <div className={`mb-6 p-4 rounded-lg border ${getUrgencyColor(climateImpact.adaptationUrgency)}`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-semibold">Adaptation Urgency: {climateImpact.adaptationUrgency.toUpperCase()}</span>
        </div>
        <p className="text-sm">
          {climateImpact.adaptationUrgency === 'critical' && 'Immediate action required to prevent severe climate impacts.'}
          {climateImpact.adaptationUrgency === 'high' && 'Urgent measures needed to mitigate climate risks.'}
          {climateImpact.adaptationUrgency === 'medium' && 'Moderate climate risks requiring planned adaptation.'}
          {climateImpact.adaptationUrgency === 'low' && 'Low climate risks with opportunities for proactive measures.'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'current'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Current Impact
        </button>
        <button
          onClick={() => setActiveTab('future')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'future'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Future Predictions
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          AI Recommendations
        </button>
      </div>

      {/* Current Impact Tab */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Carbon Footprint</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">EPA/EIA</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{Math.round(climateImpact.carbonFootprint).toLocaleString()} tons CO₂/year</p>
              <p className="text-xs text-gray-500">Real emissions data</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Energy Consumption</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">EIA</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{Math.round(climateImpact.energyConsumption).toLocaleString()} MWh/year</p>
              <p className="text-xs text-gray-500">Real energy consumption</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Health Risk Score</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">EPA</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{Math.round(climateImpact.healthRiskScore * 100)}%</p>
              <p className="text-xs text-gray-500">Based on air quality data</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Economic Impact</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Calculated</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">${Math.round(climateImpact.economicImpact).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Annual cost estimate</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{Math.round(climateImpact.predictedTemperatureRise)}°F</div>
              <div className="text-sm text-gray-600">Temperature Rise by 2050</div>
              <div className="text-xs text-blue-600">Climate Models</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{climateImpact.vulnerablePopulations.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Vulnerable Population</div>
              <div className="text-xs text-blue-600">US Census Bureau</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{Math.round(climateImpact.infrastructureRisk)}%</div>
              <div className="text-sm text-gray-600">Infrastructure Risk</div>
              <div className="text-xs text-blue-600">Engineering Analysis</div>
            </div>
          </div>
        </div>
      )}

      {/* Future Predictions Tab */}
      {activeTab === 'future' && futurePredictions && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {futurePredictions.slice(0, 4).map((prediction, index) => (
              <div key={prediction.year} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{prediction.year}</span>
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Temp Rise:</span>
                    <span className="font-medium">{Math.round(prediction.temperatureIncrease * 10) / 10}°C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Sea Level:</span>
                    <span className="font-medium">{Math.round(prediction.seaLevelRise * 10) / 10}m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Extreme Events:</span>
                    <span className="font-medium">{prediction.extremeWeatherEvents}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Air Quality:</span>
                    <span className="font-medium">{Math.round(prediction.airQualityIndex * 10) / 10}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Long-term Climate Trends</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round(futurePredictions[futurePredictions.length - 1].temperatureIncrease * 10) / 10}°C
                </div>
                <div className="text-xs text-gray-600">Max Temperature Rise</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round(futurePredictions[futurePredictions.length - 1].energyDemand).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Peak Energy Demand (MWh)</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {futurePredictions[futurePredictions.length - 1].healthImpacts}
                </div>
                <div className="text-xs text-gray-600">Health Impact Score</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {climateImpact.recommendations.map((recommendation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{recommendation.category}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Cost: {formatCurrency(recommendation.estimatedCost)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">CO₂ Reduction: {recommendation.carbonReduction.toLocaleString()} tons/year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Timeline: {recommendation.implementationTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{recommendation.stakeholders.length} stakeholders</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Success Metrics:</h5>
                <div className="flex flex-wrap gap-1">
                  {recommendation.successMetrics.map((metric, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClimateImpactAnalysis; 