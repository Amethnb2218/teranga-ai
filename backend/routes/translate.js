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
  const debugInfo = { input: text, groq_key: !!process.env.GROQ_API_KEY };

  try {
    // Direct Groq test
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const langName = { wo: 'wolof', pu: 'pulaar', en: 'English', ar: 'arabe' }[target] || 'wolof';
      const prompt = `Traduis en ${langName} : "${text}"`;

      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      debugInfo.groq_status = groqResp.status;
      if (groqResp.ok) {
        const data = await groqResp.json();
        debugInfo.groq_response = data.choices?.[0]?.message?.content;
      } else {
        debugInfo.groq_error = await groqResp.text();
      }
    }

    const result = await translateText(text, source, target);
    debugInfo.final_output = result;
    debugInfo.success = !!(result && result !== text);
    res.json(debugInfo);
  } catch (e) {
    debugInfo.error = e.message;
    debugInfo.stack = e.stack?.split('\n').slice(0, 3);
    res.json(debugInfo);
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
