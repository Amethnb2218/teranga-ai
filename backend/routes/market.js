const express = require('express');
const { getMarketPrices, getMarketTrends, getProductHistory } = require('../services/market-service');
const { getDatasetProvenance } = require('../services/provenance-service');
const router = express.Router();

router.get('/trends', (req, res) => {
  res.json(getMarketTrends());
});

router.get('/history/:product', (req, res) => {
  const { product } = req.params;
  const { city = 'dakar', days = 30 } = req.query;
  const parsedDays = Number.isFinite(parseInt(days)) ? parseInt(days) : 30;
  const history = getProductHistory(decodeURIComponent(product), city, parsedDays);
  res.json({
    product,
    city,
    days: parsedDays,
    history,
    served_at: new Date().toISOString(),
    availability: 'degraded',
    provenance: getDatasetProvenance('market_prices_simulation')
  });
});

router.get('/', (req, res) => {
  const { category, city } = req.query;
  res.json(getMarketPrices(category, city));
});

module.exports = router;
