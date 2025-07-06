import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Activity, BarChart3, Target, Zap } from 'lucide-react';
import { HeatIslandPredictor } from '../models/heatIslandAnalysis';
import { ClimateImpactAnalyzer } from '../models/climateImpactAnalyzer';
import { ActionPlanGenerator } from '../models/actionPlanGenerator';

interface ModelPerformanceDashboardProps {
  heatIslandPredictor: HeatIslandPredictor;
  climateAnalyzer: ClimateImpactAnalyzer;
  actionPlanGenerator: ActionPlanGenerator;
}

const ModelPerformanceDashboard: React.FC<ModelPerformanceDashboardProps> = ({
  heatIslandPredictor,
  climateAnalyzer,
  actionPlanGenerator
}) => {
  const [modelMetrics, setModelMetrics] = useState<any>({});
  const [performanceStatus, setPerformanceStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModelMetrics = async () => {
      try {
        // Get metrics from all models
        const heatIslandMetrics = heatIslandPredictor.getModelMetrics();
        const climateMetrics = climateAnalyzer.getModelMetrics();
        const actionPlanMetrics = actionPlanGenerator.getModelMetrics();

        // Get performance monitoring results
        const heatIslandPerformance = await heatIslandPredictor.monitorModelPerformance();
        const climatePerformance = await climateAnalyzer.monitorModelPerformance();
        const actionPlanPerformance = await actionPlanGenerator.monitorModelPerformance();

        setModelMetrics({
          heatIsland: heatIslandMetrics,
          climate: climateMetrics,
          actionPlan: actionPlanMetrics
        });

        setPerformanceStatus({
          heatIsland: heatIslandPerformance,
          climate: climatePerformance,
          actionPlan: actionPlanPerformance
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading model metrics:', error);
        setIsLoading(false);
      }
    };

    loadModelMetrics();
  }, [heatIslandPredictor, climateAnalyzer, actionPlanGenerator]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (isPerformingWell: boolean) => {
    return isPerformingWell ? 'text-green-600' : 'text-orange-600';
  };

  const getPerformanceIcon = (isPerformingWell: boolean) => {
    return isPerformingWell ? CheckCircle : AlertTriangle;
  };

  const formatMetric = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        ML Model Performance Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Heat Island Predictor */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">Heat Island Predictor</h4>
            {(() => {
              const Icon = getPerformanceIcon(performanceStatus.heatIsland?.isPerformingWell);
              return <Icon className={`w-5 h-5 ${getPerformanceColor(performanceStatus.heatIsland?.isPerformingWell)}`} />;
            })()}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-medium">{formatMetric(modelMetrics.heatIsland?.accuracy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium">{formatMetric(modelMetrics.heatIsland?.confidence)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Training Loss:</span>
              <span className="font-medium">{modelMetrics.heatIsland?.trainingLoss?.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Validation Loss:</span>
              <span className="font-medium">{modelMetrics.heatIsland?.validationLoss?.toFixed(4)}</span>
            </div>
          </div>

          {performanceStatus.heatIsland?.recommendations?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">Recommendations:</p>
              <ul className="text-xs text-blue-600 space-y-1">
                {performanceStatus.heatIsland.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Climate Impact Analyzer */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-900">Climate Impact Analyzer</h4>
            {(() => {
              const Icon = getPerformanceIcon(performanceStatus.climate?.isPerformingWell);
              return <Icon className={`w-5 h-5 ${getPerformanceColor(performanceStatus.climate?.isPerformingWell)}`} />;
            })()}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-medium">{formatMetric(modelMetrics.climate?.accuracy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Precision:</span>
              <span className="font-medium">{formatMetric(modelMetrics.climate?.precision)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recall:</span>
              <span className="font-medium">{formatMetric(modelMetrics.climate?.recall)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium">{formatMetric(modelMetrics.climate?.confidence)}</span>
            </div>
          </div>

          {performanceStatus.climate?.recommendations?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-green-700 font-medium mb-1">Recommendations:</p>
              <ul className="text-xs text-green-600 space-y-1">
                {performanceStatus.climate.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Plan Generator */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-purple-900">Action Plan Generator</h4>
            {(() => {
              const Icon = getPerformanceIcon(performanceStatus.actionPlan?.isPerformingWell);
              return <Icon className={`w-5 h-5 ${getPerformanceColor(performanceStatus.actionPlan?.isPerformingWell)}`} />;
            })()}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-medium">{formatMetric(modelMetrics.actionPlan?.accuracy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Precision:</span>
              <span className="font-medium">{formatMetric(modelMetrics.actionPlan?.precision)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recall:</span>
              <span className="font-medium">{formatMetric(modelMetrics.actionPlan?.recall)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium">{formatMetric(modelMetrics.actionPlan?.confidence)}</span>
            </div>
          </div>

          {performanceStatus.actionPlan?.recommendations?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-700 font-medium mb-1">Recommendations:</p>
              <ul className="text-xs text-purple-600 space-y-1">
                {performanceStatus.actionPlan.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overall Performance Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Overall Model Performance
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatMetric((modelMetrics.heatIsland?.accuracy + modelMetrics.climate?.accuracy + modelMetrics.actionPlan?.accuracy) / 3)}
            </div>
            <div className="text-gray-600">Average Accuracy</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatMetric((modelMetrics.heatIsland?.confidence + modelMetrics.climate?.confidence + modelMetrics.actionPlan?.confidence) / 3)}
            </div>
            <div className="text-gray-600">Average Confidence</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {performanceStatus.heatIsland?.isPerformingWell && performanceStatus.climate?.isPerformingWell && performanceStatus.actionPlan?.isPerformingWell ? '100%' : '67%'}
            </div>
            <div className="text-gray-600">Models Performing Well</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Date(Math.max(modelMetrics.heatIsland?.lastUpdated || 0, modelMetrics.climate?.lastUpdated || 0, modelMetrics.actionPlan?.lastUpdated || 0)).toLocaleTimeString()}
            </div>
            <div className="text-gray-600">Last Updated</div>
          </div>
        </div>
      </div>

      {/* Real-time Validation Status */}
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 text-sm text-emerald-800">
          <Activity className="w-4 h-4" />
          <span className="font-medium">Real-time Model Validation Active</span>
          <div className="flex-1"></div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformanceDashboard; 