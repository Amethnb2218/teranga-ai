const express = require('express');
const router = express.Router();
const { translateText, isTranslationAvailable } = require('../services/translate-service');
const { LANGUAGES, hasTranslation } = require('../config/languages');

router.post('/', async (req, res) => {
  try {
    const { text, source = 'fr', target = 'wo' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    if (!isTranslationAvailable()) {
      return res.status(503).json({ error: 'Translation service not configured', translated: text });
    }

    const result = await translateText(text, source, target);
    const wasTranslated = result && result !== text;
    res.json({
      translated: result || text,
      source,
      target,
      engine: 'llm',
      success: wasTranslated
    });
  } catch (error) {
    console.error('Translation route error:', error.message);
    res.status(500).json({ error: 'Translation failed', translated: req.body.text });
  }
});

router.get('/languages', (req, res) => {
  res.json({
    supported: Object.entries(LANGUAGES).map(([code, cfg]) => ({
      code,
      name: cfg.label,
      tier: cfg.tier,
      translatable: hasTranslation(code) || cfg.tier === 'native'
    })),
    engine: 'llm (Gemini/Groq)',
    available: isTranslationAvailable()
  });
});

module.exports = router;
