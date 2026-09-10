const express = require('express');
const { fetchAgriNews } = require('../services/external/news-service');
const { getDatasetProvenance } = require('../services/provenance-service');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const news = await fetchAgriNews();
    const servedAt = new Date().toISOString();
    const availability = news.length > 0 ? 'available' : 'unavailable';
    res.json({
      news,
      count: news.length,
      last_updated: servedAt,
      served_at: servedAt,
      availability,
      provenance: getDatasetProvenance('news_google_rss', { availability, retrieved_at: servedAt })
    });
  } catch (error) {
    console.error('News error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
