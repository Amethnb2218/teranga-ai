const express = require('express');
const { LANGUAGES, ttsCode } = require('../config/languages');
const router = express.Router();

// Synthèse vocale locale via Meta MMS-TTS — donne une VRAIE voix dans la langue
// (wolof, haoussa, bambara...), contrairement au Web Speech du navigateur qui
// n'a aucune voix africaine. Essentiel pour les analphabètes.
//
// L'API d'inférence HuggingFace historique est hors service ; on délègue donc à
// un micro-service TTS dédié (voir /tts-service), pointé par MMS_TTS_URL. S'il
// n'est pas configuré, la route renvoie 204 -> le frontend lit via Web Speech.
// Contrat du service : POST {text, lang} -> audio/wav.
const MMS_TTS_URL = process.env.MMS_TTS_URL || ''; // ex: https://teranga-tts.onrender.com/
const TTS_AUTH_TOKEN = process.env.TTS_AUTH_TOKEN || '';
const TTS_TIMEOUT_MS = Number(process.env.TTS_TIMEOUT_MS) || 25000;
const MAX_CHARS = 800; // les modèles MMS-TTS coupent au-delà ; on borne l'entrée

async function synthesizeWithMMS(text, langCode) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (TTS_AUTH_TOKEN) headers['Authorization'] = `Bearer ${TTS_AUTH_TOKEN}`;
    const response = await fetch(MMS_TTS_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({ text, lang: langCode })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const code = response.status === 503 ? 'model_loading' : 'tts_error';
      throw Object.assign(new Error(`TTS ${response.status}: ${detail.slice(0, 120)}`), { code, status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'audio/wav';
    const buffer = Buffer.from(await response.arrayBuffer());
    return { buffer, contentType };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw Object.assign(new Error('Délai TTS dépassé'), { code: 'timeout', status: 504 });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Nettoie le markdown avant synthèse (les modèles TTS lisent les * et # sinon).
function cleanForSpeech(text) {
  return String(text)
    .replace(/[*#_`|>]/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/^[-•]\s*/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CHARS);
}

router.post('/', async (req, res) => {
  const { text, language = 'fr' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text requis' });
  }

  const langCode = ttsCode(language);
  // Langues sans voix MMS (fr, en, ar) : le navigateur gère via Web Speech.
  if (!langCode) {
    return res.status(204).json({ fallback: 'web-speech', reason: 'no_mms_voice' });
  }
  // Aucun backend MMS-TTS configuré (HF hors service) -> Web Speech côté client.
  if (!MMS_TTS_URL) {
    return res.status(204).json({ fallback: 'web-speech', reason: 'tts_backend_not_configured' });
  }

  try {
    const { buffer, contentType } = await synthesizeWithMMS(cleanForSpeech(text), langCode);
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('X-TTS-Engine', `mms-tts-${langCode}`);
    return res.send(buffer);
  } catch (error) {
    console.error('TTS error:', { code: error.code || 'unknown', status: error.status || 500, lang: langCode });
    // Le frontend retombera sur Web Speech si la synthèse locale échoue.
    return res.status(error.status || 502).json({
      error: 'Synthèse vocale locale indisponible',
      code: error.code || 'tts_error',
      fallback: 'web-speech'
    });
  }
});

// Expose la matrice des langues (pour l'UI : tiers, régions, capacités voix)
router.get('/languages', (req, res) => {
  const languages = Object.entries(LANGUAGES).map(([code, cfg]) => ({
    code,
    label: cfg.label,
    tier: cfg.tier,
    region: cfg.region,
    canTranslate: !!cfg.nllb,
    hasLocalVoice: !!cfg.mmsTts
  }));
  res.json({ languages });
});

module.exports = router;
