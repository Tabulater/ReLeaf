# ReLeaf

Urban heat island analysis and climate intelligence platform.

## Overview

ReLeaf analyzes urban heat patterns, predicts climate impacts, and generates actionable solutions for cities. The platform uses real-time environmental data and machine learning to provide insights for urban planning and climate mitigation.

## Features

- **Heat Island Analysis**: Identify and analyze urban heat zones
- **Climate Impact Prediction**: Forecast future climate scenarios
- **Action Plan Generation**: Create city-specific mitigation strategies
- **Real-time Data**: Live weather, air quality, and environmental metrics
- **Interactive Maps**: Visualize heat zones and recommended actions
- **Graceful Error Handling**: Works with or without API keys using realistic fallback data

## Technology

- React with TypeScript
- TensorFlow.js for client-side ML
- Leaflet for interactive mapping
- Real-time APIs for environmental data
- Enhanced error handling with CORS proxy support

## Getting Started

```bash
npm install
npm run dev
```

## API Configuration

The application uses several external APIs for real-time data. The following APIs are configured:

- **Open-Meteo**: Weather data (no API key required)
- **NASA**: Satellite and environmental data
- **US Census Bureau**: Demographic data
- **Energy Information Administration**: Energy consumption data

### Quick Setup

1. Create a `.env` file in the project root
2. Add your API keys (NASA and EIA keys are recommended)
3. Restart the development server

### Without API Keys

The application works without API keys using realistic fallback data based on:
- City-specific environmental reports
- Time-based weather patterns
- Population demographics
- Energy consumption estimates

## Data Sources

- **Open-Meteo**: Weather data, air quality, UV index
- **NASA Earth API**: Satellite imagery, vegetation data
- **US Census Bureau**: Demographic data, vulnerable populations
- **Energy Information Administration**: Energy consumption, carbon emissions

## Error Handling

The application now includes:
- ✅ **Improved Error Handling**: Better fallback mechanisms
- ✅ **CORS Proxy Support**: For government APIs
- ✅ **Environment Variable Support**: Proper API key configuration
- ✅ **Graceful Degradation**: App works without API keys
- ✅ **Realistic Fallback Data**: Based on city-specific information

## Troubleshooting

If you see API errors in the console:
1. Check [API_SETUP.md](./API_SETUP.md) for configuration help
2. Verify your API keys are valid
3. Restart the development server after configuration changes
4. The app will continue to work with fallback data

## License

MIT 