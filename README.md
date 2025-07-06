# ReLeaf

Urban heat island analysis platform.

## What it does

ReLeaf helps cities understand urban heat islands using machine learning. It analyzes temperature patterns, predicts climate impacts, and suggests solutions for urban planning.

## Features

- Heat island analysis and zone detection
- Climate impact predictions
- Action plan generation for cities
- Real-time weather and environmental data
- Interactive maps with heat zones
- Error handling with fallback data

## Tech stack

- React with TypeScript
- TensorFlow.js for ML
- Leaflet for maps
- Real-time APIs for data
- Error handling with CORS support

## Setup

```bash
npm install
npm run dev
```

## APIs

The app uses these APIs:

- Open-Meteo: Weather data (no key needed)
- EPA AQS Data Mart: Air quality data (key: dunkit68)
- US Census Bureau: Population data (key: 120fe3a38d5e7762f56e5527d6ee015b74ce0259)
- Utility APIs: Energy consumption data
- Real-time calculations: Emissions and energy data

## Data sources

All data comes from real APIs:
- Open-Meteo: Live weather data
- EPA AQS Data Mart: Air quality measurements
- US Census Bureau: Population and demographic data
- Utility APIs: Energy consumption from utility companies
- Real-time calculations: Emissions based on weather

## Error handling

The app handles:
- Real API integration from live sources
- EPA air quality measurements
- City-specific environmental data
- No fallback data - everything is real
- Clear error messages when APIs fail

## Troubleshooting

If you see API errors:
1. EPA API key is 'dunkit68'
2. Census API key is '120fe3a38d5e7762f56e5527d6ee015b74ce0259'
3. Open-Meteo doesn't need authentication
4. City data comes from official reports
5. All data is real-time

## License

MIT 