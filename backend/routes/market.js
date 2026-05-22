const express = require('express');
const { getMarketPrices, getMarketTrends, getProductHistory } = require('../services/market-service');
const router = express.Router();

router.get('/trends', (req, res) => {
  res.json(getMarketTrends());
});

router.get('/history/:product', (req, res) => {
  const { product } = req.params;
  const { city = 'dakar', days = 30 } = req.query;
  const history = getProductHistory(decodeURIComponent(product), city, parseInt(days));
  res.json({ product, city, days: parseInt(days), history });
});

router.get('/', (req, res) => {
  const { category, city } = req.query;
  res.json(getMarketPrices(category, city));
});

module.exports = router;
