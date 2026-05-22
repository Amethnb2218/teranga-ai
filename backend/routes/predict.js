const express = require('express');
const { findOptimalSowingDate, getAvailableCrops } = require('../services/prediction-engine');
const router = express.Router();

router.get('/crops', (req, res) => {
  res.json({ crops: getAvailableCrops() });
});

router.get('/:crop/:city', (req, res) => {
  const { crop, city } = req.params;
  const cityKey = city.toLowerCase().replace(/[- ]/g, '_');

  const prediction = findOptimalSowingDate(crop, cityKey);
  if (!prediction) {
    return res.status(404).json({ error: 'Culture ou ville non trouvée', available_crops: getAvailableCrops() });
  }

  res.json(prediction);
});

module.exports = router;
