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
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  const srcCode = NLLB_LANG_CODES[source] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[target] || 'wol_Latn';

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { src_lang: srcCode, tgt_lang: tgtCode }
        })
      }
    );
    const rawBody = await response.text();
    res.json({
      status: response.status,
      src_lang: srcCode,
      tgt_lang: tgtCode,
      raw_response: rawBody
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
