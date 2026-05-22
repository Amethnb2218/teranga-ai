const express = require('express');
const { predictYield, optimizeCropCalendar, assessRiskBayesian, getModelMetrics } = require('../services/ml-engine');
const router = express.Router();

// GET /api/ml/metrics — Model performance metrics
router.get('/metrics', (req, res) => {
  res.json({
    models: getModelMetrics(),
    algorithms: {
      regression: 'Ordinary Least Squares (OLS) Multiple Linear Regression',
      optimization: 'Genetic Algorithm (GA) with BLX-α crossover',
      risk_assessment: 'Bayesian Belief Network (BBN)',
      pattern_matching: 'K-Nearest Neighbors (distance-weighted)'
    },
    training_data: {
      source: 'ISRA / FAO Senegal / ANACIM (2015-2024)',
      features: ['rainfall_mm', 'temperature_avg', 'sowing_month', 'agro_ecological_zone'],
      target: 'yield_kg_per_hectare'
    }
  });
});

// GET /api/ml/predict-yield/:crop/:city
router.get('/predict-yield/:crop/:city', (req, res) => {
  const { crop, city } = req.params;
  const { month } = req.query;

  const { SENEGAL_CITIES, MONTH_DATA } = require('../config/constants');
  const cityData = SENEGAL_CITIES[city.toLowerCase().replace(/[- ]/g, '_')];
  if (!cityData) return res.status(404).json({ error: 'Ville non trouvée' });

  const sowMonth = parseInt(month) || new Date().getMonth() + 1;
  const monthData = MONTH_DATA[sowMonth];
  const zoneMultiplier = cityData.zone === 'casamançaise' ? 1.5 : cityData.zone === 'soudanienne' ? 1.2 : 0.8;

  let rainTotal = 0;
  for (let i = 0; i < 4; i++) {
    const m = ((sowMonth - 1 + i) % 12) + 1;
    rainTotal += (MONTH_DATA[m]?.rain_mm || 0) * zoneMultiplier;
  }

  const tempAvg = (monthData.temp_max + monthData.temp_min) / 2;
  const result = predictYield(crop, cityData.zone, rainTotal, tempAvg, sowMonth);

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
