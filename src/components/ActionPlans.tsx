import React, { useState } from 'react';
import { TreePine, Building, Download, ExternalLink, Umbrella, Droplets, Zap, Thermometer, MapPin } from 'lucide-react';
import { ActionPlan, HeatZone } from '../types';

interface ActionPlansProps {
  actionPlans: ActionPlan[];
  cityName: string;
  heatZones?: HeatZone[];
}

export default function ActionPlans({ actionPlans, cityName, heatZones }: ActionPlansProps) {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const getActionIcon = (type: ActionPlan['type']) => {
    switch (type) {
      case 'tree_planting': return <TreePine className="w-5 h-5 text-green-600" />;
      case 'green_roof': return <Building className="w-5 h-5 text-blue-600" />;
      case 'cool_pavement': return <div className="w-5 h-5 bg-gray-600 rounded" />;
      case 'urban_park': return <div className="w-5 h-5 bg-green-500 rounded-full" />;
      case 'shade_structure': return <Umbrella className="w-5 h-5 text-orange-600" />;
      case 'water_feature': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'smart_irrigation': return <Zap className="w-5 h-5 text-purple-600" />;
      case 'cooling_center': return <Thermometer className="w-5 h-5 text-red-600" />;
    }
  };

  const getActionTitle = (type: ActionPlan['type']) => {
    const titles = {
      'tree_planting': 'Tree Planting Initiative',
      'green_roof': 'Green Roof Installation',
      'cool_pavement': 'Cool Pavement Application',
      'urban_park': 'Urban Park Development',
      'shade_structure': 'Shade Structure Installation',
      'water_feature': 'Water Feature Installation',
      'smart_irrigation': 'Smart Irrigation System',
      'cooling_center': 'Emergency Cooling Center'
    };
    return titles[type] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getActionDescription = (type: ActionPlan['type']) => {
    const descriptions = {
      'tree_planting': 'Strategic tree planting to provide shade and reduce urban heat island effect',
      'green_roof': 'Installation of vegetation on building rooftops to improve insulation and air quality',
      'cool_pavement': 'Application of reflective materials to reduce surface temperature',
      'urban_park': 'Development of green spaces to provide cooling and recreational areas',
      'shade_structure': 'Installation of permanent shade structures for immediate cooling relief',
      'water_feature': 'Installation of fountains, misting systems, or water gardens for evaporative cooling',
      'smart_irrigation': 'Automated irrigation systems that optimize water usage based on real-time conditions',
      'cooling_center': 'Emergency cooling facilities for vulnerable populations during extreme heat events'
    };
    return descriptions[type] || 'Environmental improvement action';
  };

  const getPriorityColor = (priority: ActionPlan['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getZoneLabel = (planId: string) => {
    // Extract zone information from plan ID
    // Action plan ID format: action-zone-{cityId}-{zoneIndex}-{actionType}-{actionIndex}
    const parts = planId.split('-');
    if (parts.length >= 4) {
      const cityId = parts[2];
      const zoneIndex = parts[3];
      const zoneId = `zone-${cityId}-${zoneIndex}`;
      
      if (heatZones) {
        const zone = heatZones.find(z => z.id === zoneId);
        if (zone) {
          return `${zone.name} (${zone.landUseType}) - ${zone.severity} priority`;
        }
      }
      return `Zone ${zoneIndex}`;
    }
    return `Zone ${planId.split('-')[1] || 'Unknown'}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Group actions by zone to show zone-specific organization
  const groupedPlans = actionPlans.reduce((groups, plan) => {
    // Extract zone ID from action plan ID format: action-zone-{cityId}-{zoneIndex}-{actionType}-{actionIndex}
    const parts = plan.id.split('-');
    let zoneId = 'unknown';
    if (parts.length >= 4) {
      const cityId = parts[2];
      const zoneIndex = parts[3];
      zoneId = `zone-${cityId}-${zoneIndex}`;
    } else {
      zoneId = plan.id.split('-')[1] || 'unknown';
    }
    
    if (!groups[zoneId]) {
      groups[zoneId] = [];
    }
    groups[zoneId].push(plan);
    return groups;
  }, {} as Record<string, ActionPlan[]>);

  const filteredPlans = selectedPriority === 'all' 
    ? actionPlans 
    : actionPlans.filter(plan => plan.priority === selectedPriority);

  const totalCarbonSequestration = actionPlans.reduce((sum, plan) => sum + plan.impact.carbonSequestration, 0);
  const totalEnergySavings = actionPlans.reduce((sum, plan) => sum + plan.impact.energySavings, 0) / actionPlans.length;
  const totalCost = actionPlans.reduce((sum, plan) => sum + plan.implementation.cost, 0);

  const handleExportReport = () => {
    const reportData = {
      city: cityName,
      generatedAt: new Date().toISOString(),
      summary: {
        totalActions: actionPlans.length,
        carbonSequestration: totalCarbonSequestration,
        avgEnergySavings: totalEnergySavings,
        estimatedCost: totalCost
      },
      actionPlans: actionPlans.map(plan => ({
        type: getActionTitle(plan.type),
        description: getActionDescription(plan.type),
        zone: getZoneLabel(plan.id),
        priority: plan.priority,
        location: plan.location,
        impact: plan.impact,
        implementation: plan.implementation
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cityName.replace(/\s+/g, '_')}_Heat_Action_Plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFindVolunteers = () => {
    const searchQuery = `environmental volunteer tree planting ${cityName}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
  };

  if (actionPlans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">Action Plans</h3>
        <p className="text-gray-500">Run analysis to generate environmental action plans</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Action Plans</h3>
              <p className="text-green-100 text-sm">{cityName} - {Object.keys(groupedPlans).length} zones, {actionPlans.length} unique actions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
            <button
              onClick={handleFindVolunteers}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Find Volunteers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{totalCarbonSequestration}</div>
            <div className="text-sm text-green-700">tons CO₂/year</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(totalEnergySavings)}%</div>
            <div className="text-sm text-blue-700">avg energy savings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">${Math.round(totalCost / 1000)}K</div>
            <div className="text-sm text-purple-700">total investment</div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by priority:</span>
          <div className="flex gap-2">
            {['all', 'high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPriority === priority
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {Object.entries(groupedPlans).map(([zoneId, zonePlans]) => {
            const filteredZonePlans = selectedPriority === 'all' 
              ? zonePlans 
              : zonePlans.filter(plan => plan.priority === selectedPriority);
            
            if (filteredZonePlans.length === 0) return null;
            
            const zoneLabel = getZoneLabel(zonePlans[0].id);
            const zoneSeverity = heatZones?.find(z => z.id === zoneId)?.severity || 'moderate';
            
            return (
              <div key={zoneId} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{zoneLabel}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(zoneSeverity)}`}>
                      {zoneSeverity} heat zone
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {filteredZonePlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                            {getActionIcon(plan.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-medium text-gray-900">
                                {getActionTitle(plan.type)}
                              </h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(plan.priority)}`}>
                                {plan.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{getActionDescription(plan.type)}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Temp Reduction:</span> {plan.impact.temperatureReduction}°F
                              </div>
                              <div>
                                <span className="font-medium">Carbon:</span> {plan.impact.carbonSequestration} tons/year
                              </div>
                              <div>
                                <span className="font-medium">Timeline:</span> {plan.implementation.timeframe}
                              </div>
                              <div>
                                <span className="font-medium">Cost:</span> ${plan.implementation.cost.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}