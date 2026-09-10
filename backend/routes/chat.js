const express = require('express');
const { getAIResponse } = require('../services/ai-service');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages, language = 'fr' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const result = await getAIResponse(messages, language);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', {
      code: error.code || 'unknown_error',
      category: error.category || 'unknown',
      status: error.status || 500
    });
    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Veuillez réessayer dans quelques instants.'
    });
  }
});

module.exports = router;
