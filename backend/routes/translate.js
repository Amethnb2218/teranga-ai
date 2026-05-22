const express = require('express');
const router = express.Router();
const { translateText, isTranslationAvailable, NLLB_LANG_CODES, HF_API_URL } = require('../services/translate-service');

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

  if (!apiKey) {
    return res.json({ error: 'No API key configured', key_env: 'HF_API_KEY or HUGGINGFACE_API_KEY' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: { src_lang: srcCode, tgt_lang: tgtCode },
        options: { wait_for_model: true }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const rawBody = await response.text();
    res.json({
      status: response.status,
      src_lang: srcCode,
      tgt_lang: tgtCode,
      api_url: HF_API_URL,
      has_key: !!apiKey,
      key_prefix: apiKey ? apiKey.slice(0, 6) + '...' : null,
      raw_response: rawBody
    });
  } catch (e) {
    res.json({ error: e.message, type: e.name });
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
