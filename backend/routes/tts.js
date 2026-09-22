const express = require('express');
const { LANGUAGES, ttsCode, googleTtsCode } = require('../config/languages');
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

// --- Google Translate TTS (voix gratuite, sans clé, sans serveur lourd) ---
// Couvre le haoussa (langue #1 du Sahel) et d'autres langues Google. Endpoint
// non officiel (limite ~200 caractères / requête) -> on découpe en morceaux et
// on concatène les MP3. Tourne sur le free tier (aucun modèle chargé).
function chunkText(text, max = 190) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > max) {
      if (current) chunks.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.slice(0, 8); // borne : ~1500 caractères parlés max
}

async function synthesizeWithGoogle(text, googleLang) {
  const chunks = chunkText(text);
  const buffers = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(googleLang)}&q=${encodeURIComponent(chunk)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      });
      if (!response.ok) throw Object.assign(new Error(`Google TTS ${response.status}`), { code: 'tts_error', status: 502 });
      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('audio')) throw Object.assign(new Error('Google TTS: pas d\'audio'), { code: 'unsupported_lang', status: 502 });
      buffers.push(Buffer.from(await response.arrayBuffer()));
    } finally {
      clearTimeout(timer);
    }
  }
  if (!buffers.length) throw Object.assign(new Error('Google TTS vide'), { code: 'tts_error', status: 502 });
  return { buffer: Buffer.concat(buffers), contentType: 'audio/mpeg' };
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

  const mmsLang = ttsCode(language);
  const googleLang = googleTtsCode(language);
  const clean = cleanForSpeech(text);

  // Ordre de préférence des moteurs de voix locale :
  //  1) micro-service MMS-TTS dédié (si configuré) -> meilleure couverture
  //  2) Google Translate TTS (gratuit, sans serveur lourd) -> ex. haoussa
  //  3) sinon 204 -> le navigateur lit via Web Speech
  try {
    if (MMS_TTS_URL && mmsLang) {
      const { buffer, contentType } = await synthesizeWithMMS(clean, mmsLang);
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('X-TTS-Engine', `mms-tts-${mmsLang}`);
      return res.send(buffer);
    }
    if (googleLang) {
      const { buffer, contentType } = await synthesizeWithGoogle(clean, googleLang);
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('X-TTS-Engine', `google-${googleLang}`);
      return res.send(buffer);
    }
  } catch (error) {
    console.error('TTS error:', { code: error.code || 'unknown', status: error.status || 500, lang: language });
    // Repli propre : le frontend lira via Web Speech.
    return res.status(error.status || 502).json({
      error: 'Synthèse vocale locale indisponible',
      code: error.code || 'tts_error',
      fallback: 'web-speech'
    });
  }

  // Aucune voix locale dispo pour cette langue -> Web Speech côté client.
  return res.status(204).json({ fallback: 'web-speech', reason: 'no_local_voice' });
});

// Expose la matrice des langues (pour l'UI : tiers, régions, capacités voix)
router.get('/languages', (req, res) => {
  const languages = Object.entries(LANGUAGES).map(([code, cfg]) => ({
    code,
    label: cfg.label,
    tier: cfg.tier,
    region: cfg.region,
    canTranslate: !!cfg.nllb,
    // Voix locale réelle dispo sans serveur payant (Google TTS gratuit)
    freeLocalVoice: !!cfg.googleTts,
    // Voix locale via micro-service MMS-TTS (si MMS_TTS_URL configuré)
    mmsVoice: !!cfg.mmsTts
  }));
  res.json({ languages, mmsBackend: !!MMS_TTS_URL });
});

module.exports = router;
