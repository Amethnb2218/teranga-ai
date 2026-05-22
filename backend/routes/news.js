const express = require('express');
const { fetchAgriNews } = require('../services/external/news-service');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const news = await fetchAgriNews();
    res.json({ news, count: news.length, last_updated: new Date().toISOString() });
  } catch (error) {
    console.error('News error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
