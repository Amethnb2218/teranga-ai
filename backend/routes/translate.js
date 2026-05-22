const express = require('express');
const router = express.Router();
const { translateText, isTranslationAvailable, NLLB_LANG_CODES } = require('../services/translate-service');

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
      model: 'nllb-200-distilled-600M',
      success: wasTranslated
    });
  } catch (error) {
    console.error('Translation route error:', error.message);
    res.status(500).json({ error: 'Translation failed', translated: req.body.text });
  }
});

router.post('/debug', async (req, res) => {
  const { text = 'Bonjour', source = 'fr', target = 'wo' } = req.body;
  try {
    const result = await translateText(text, source, target);
    res.json({
      input: text,
      output: result,
      translated: !!(result && result !== text),
      groq_available: !!process.env.GROQ_API_KEY,
      hf_available: !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY)
    });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.get('/languages', (req, res) => {
  res.json({
    supported: Object.entries(NLLB_LANG_CODES).map(([code, nllb]) => ({
      code, nllb, name: {
        fr: 'Français', wo: 'Wolof', pu: 'Pulaar', sr: 'Sérère',
        di: 'Diola', mn: 'Mandinka', sn: 'Soninké', en: 'English', ar: 'العربية'
      }[code]
    })),
    model: 'facebook/nllb-200-distilled-600M',
    available: isTranslationAvailable()
  });
});

module.exports = router;
