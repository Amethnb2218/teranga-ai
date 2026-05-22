const express = require('express');
const { getAIResponse } = require('../services/ai-service');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages, language = 'fr' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const response = await getAIResponse(messages, language);
    res.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Veuillez réessayer dans quelques instants.'
    });
  }
});

module.exports = router;
