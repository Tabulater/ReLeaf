import React from 'react';
import { MapPin, Users, Thermometer, TreePine } from 'lucide-react';
import { City } from '../types';
import { cities } from '../data/realCityData';

interface CitySelectorProps {
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

export default function CitySelector({ selectedCity, onCitySelect }: CitySelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Select City</h2>
          <p className="text-sm text-gray-600">Choose a city to analyze heat island patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => onCitySelect(city)}
            className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
              selectedCity?.id === city.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{city.name}</h3>
                <p className="text-xs text-gray-500">{city.country}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="w-3 h-3" />
                <span>{city.population >= 1000000 ? `${Math.round(city.population / 1000000)}M` : `${Math.round(city.population / 1000)}K`} people</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Thermometer className="w-3 h-3" />
                <span>{city.averageTemp}°F avg</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <TreePine className="w-3 h-3" />
                <span>{city.vegetationCoverage}% vegetation</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}