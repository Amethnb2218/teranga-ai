const express = require('express');
const { predictYield, optimizeCropCalendar, assessRiskBayesian, getModelMetrics } = require('../services/ml-engine');
const { fetchRealWeather } = require('../services/external/weather-api');
const router = express.Router();

// GET /api/ml/metrics — Model performance metrics
router.get('/metrics', (req, res) => {
  res.json({
    models: getModelMetrics(),
    algorithms: {
      regression: 'Ridge-regularized Multiple Linear Regression (12 features)',
      ensemble: 'Weighted Ensemble (OLS + KNN, dynamic R²-based weights)',
      optimization: 'Genetic Algorithm (GA) with BLX-α crossover, tournament selection',
      risk_assessment: 'Bayesian Belief Network (BBN) with crop-specific CPTs',
      pattern_matching: 'K-Nearest Neighbors (distance-weighted, min-max normalized)'
    },
    training_data: {
      source: 'DAPSA, ISRA, ANACIM, FAO/GIEWS, CSA Sénégal (2015-2026)',
      observations: '250+ data points across 14 regions',
      features: '12: rain_total, rain_peak, distribution, temp_avg, temp_stress, sow_month, zone, soil, fertilizer, fert_log, variety_cycle, rotation_bonus',
      target: 'yield_kg_per_hectare',
      validation: 'Leave-One-Out Cross-Validation (LOOCV)'
    },
    realtime_integration: {
      weather_source: 'OpenWeatherMap API (30min cache)',
      usage: 'Live temperature and rainfall injected into predictions when available'
    }
  });
});

// GET /api/ml/predict-yield/:crop/:city
router.get('/predict-yield/:crop/:city', async (req, res) => {
  const { crop, city } = req.params;
  const { month } = req.query;

  const { SENEGAL_CITIES, MONTH_DATA } = require('../config/constants');
  const cityKey = city.toLowerCase().replace(/[- ]/g, '_');
  const cityData = SENEGAL_CITIES[cityKey];
  if (!cityData) return res.status(404).json({ error: 'Ville non trouvée' });

  const sowMonth = parseInt(month) || new Date().getMonth() + 1;
  const monthData = MONTH_DATA[sowMonth];
  const zoneMultiplier = cityData.zone === 'casamançaise' ? 1.5 : cityData.zone === 'soudanienne' ? 1.2 : 0.8;

  let rainTotal = 0;
  let tempAvg = (monthData.temp_max + monthData.temp_min) / 2;
  let weatherSource = 'model_historical';

  // Inject real-time weather data when available
  const realWeather = await fetchRealWeather(cityKey);
  if (realWeather && realWeather.forecast && realWeather.forecast.length > 0) {
    const forecast = realWeather.forecast;
    const avgTemp = forecast.reduce((sum, d) => sum + (d.temp_max + d.temp_min) / 2, 0) / forecast.length;
    const totalRain7d = forecast.reduce((sum, d) => sum + (d.rain_mm || 0), 0);

    tempAvg = avgTemp;
    // Extrapolate 7-day rain to season total using zone patterns
    const seasonMonths = 4;
    const weeksInSeason = seasonMonths * 4.3;
    rainTotal = totalRain7d * weeksInSeason * zoneMultiplier * 0.6;

    // If we're in dry season, use historical average instead of extrapolation
    if (totalRain7d < 2) {
      rainTotal = 0;
      for (let i = 0; i < 4; i++) {
        const m = ((sowMonth - 1 + i) % 12) + 1;
        rainTotal += (MONTH_DATA[m]?.rain_mm || 0) * zoneMultiplier;
      }
    }
    weatherSource = 'openweathermap_realtime';
  } else {
    for (let i = 0; i < 4; i++) {
      const m = ((sowMonth - 1 + i) % 12) + 1;
      rainTotal += (MONTH_DATA[m]?.rain_mm || 0) * zoneMultiplier;
    }
  }

  const result = predictYield(crop, cityData.zone, rainTotal, tempAvg, sowMonth);

  // Add confidence interval and weather source
  if (result.ensemble) {
    const yieldPred = result.ensemble.predicted_yield_kg;
    const mape = parseFloat(result.ensemble.cv_mape) || 15;
    const margin = Math.round(yieldPred * mape / 100);
    result.ensemble.confidence_interval = {
      low: Math.max(0, yieldPred - margin),
      high: yieldPred + margin,
      level: '90%'
    };
  }

  result.weather_source = weatherSource;
  result.realtime_data = realWeather ? {
    current_temp: realWeather.current?.temp,
    humidity: realWeather.current?.humidity,
    forecast_days: realWeather.forecast?.length || 0
  } : null;

  res.json(result);
});

// POST /api/ml/optimize-calendar
router.post('/optimize-calendar', (req, res) => {
  const { crops, city, parcels } = req.body;

  if (!crops || !city) {
    return res.status(400).json({ error: 'crops (array) et city requis' });
  }

  const result = optimizeCropCalendar(
    Array.isArray(crops) ? crops : [crops],
    city.toLowerCase().replace(/[- ]/g, '_'),
    { parcels: parcels || 3 }
  );

  if (!result) return res.status(404).json({ error: 'Ville non trouvée' });
  res.json(result);
});

// GET /api/ml/risk/:crop/:city/:month
router.get('/risk/:crop/:city/:month', (req, res) => {
  const { crop, city, month } = req.params;
  const cityKey = city.toLowerCase().replace(/[- ]/g, '_');

  const result = assessRiskBayesian(crop, cityKey, parseInt(month));
  if (!result) return res.status(404).json({ error: 'Paramètres invalides' });

  res.json(result);
});

module.exports = router;
