const express = require('express');
const { LANGUAGES, ttsCode } = require('../config/languages');
const router = express.Router();

// Synthèse vocale locale via Meta MMS-TTS — donne une VRAIE voix dans la langue
// (wolof, haoussa, bambara...), contrairement au Web Speech du navigateur qui
// n'a aucune voix africaine. Essentiel pour les analphabètes.
//
// ATTENTION (sept. 2026) : l'API d'inférence HuggingFace historique est hors
// service et ne sert plus MMS-TTS. Ce chemin est donc DÉSACTIVÉ par défaut
// (MMS_TTS_URL vide) : la route renvoie 204 et le frontend lit via Web Speech.
// Pour réactiver, pointer MMS_TTS_URL vers un backend TTS fonctionnel (self-host
// transformers.js, Replicate, etc.) qui accepte {inputs} et renvoie de l'audio.
// La langue est injectée à la place de {lang} dans l'URL.
const MMS_TTS_URL = process.env.MMS_TTS_URL || ''; // ex: https://.../facebook/mms-tts-{lang}
const TTS_TIMEOUT_MS = Number(process.env.TTS_TIMEOUT_MS) || 25000;
const MAX_CHARS = 800; // les modèles MMS-TTS coupent au-delà ; on borne l'entrée

async function synthesizeWithMMS(text, langCode) {
  const hfKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!hfKey) throw Object.assign(new Error('No HF API key'), { code: 'not_configured', status: 503 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);
  try {
    const url = MMS_TTS_URL.includes('{lang}')
      ? MMS_TTS_URL.replace('{lang}', langCode)
      : `${MMS_TTS_URL}${langCode}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true, use_cache: true } })
    });

    if (response.status === 503) {
      throw Object.assign(new Error('Modèle TTS en cours de chargement'), { code: 'model_loading', status: 503 });
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw Object.assign(new Error(`MMS-TTS ${response.status}: ${detail.slice(0, 120)}`), { code: 'tts_error', status: 502 });
    }

    const contentType = response.headers.get('content-type') || 'audio/flac';
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
