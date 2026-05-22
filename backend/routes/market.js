const express = require('express');
const { getMarketPrices, getMarketTrends } = require('../services/market-service');
const router = express.Router();

router.get('/', (req, res) => {
  const { category, city } = req.query;
  res.json(getMarketPrices(category, city));
});

router.get('/trends', (req, res) => {
  res.json(getMarketTrends());
});

module.exports = router;
