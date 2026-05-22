const express = require('express');
const { getCityWeather, getAvailableCities } = require('../services/weather-service');
const router = express.Router();

router.get('/:city', async (req, res) => {
  const cityKey = req.params.city.toLowerCase().replace(/[- ]/g, '_');
  const data = await getCityWeather(cityKey);

  if (!data) {
    return res.status(404).json({
      error: 'City not found',
      available_cities: getAvailableCities()
    });
  }

  res.json(data);
});

router.get('/', (req, res) => {
  res.json({ available_cities: getAvailableCities() });
});

module.exports = router;
