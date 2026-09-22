/**
 * Translation Service — Teranga AI
 * NLLB for local African languages (Wolof, Pulaar, Sérère, etc.)
 * Groq LLM for English/Arabic only
 */

const { createAICompletion } = require('./ai-provider-service');
const { LANGUAGES, LOCAL_LANGS, nllbCode, hasTranslation } = require('../config/languages');

// Codes NLLB dérivés de la matrice centrale (config/languages.js) — plus de
// codes en dur : les langues sans code NLLB (sérère, diola, mandinka, soninké)
// ne sont PAS envoyées à NLLB (échec silencieux évité).
const NLLB_LANG_CODES = Object.fromEntries(
  Object.entries(LANGUAGES).filter(([, cfg]) => cfg.nllb).map(([code, cfg]) => [code, cfg.nllb])
);

const LANG_NAMES = Object.fromEntries(
  Object.entries(LANGUAGES).map(([code, cfg]) => [code, cfg.label.toLowerCase()])
);

let nllbWarm = false;

async function warmupNLLB() {
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey || nllbWarm) return;
  try {
    await fetch('https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: 'Bonjour', parameters: { src_lang: 'fra_Latn', tgt_lang: 'wol_Latn' }, options: { wait_for_model: true } })
    });
    nllbWarm = true;
    console.log('NLLB model warmed up');
  } catch (e) {
    console.log('NLLB warmup failed:', e.message);
  }
}

// Warmup at start + keep alive every 10 min
const warmupTimer = setTimeout(warmupNLLB, 2000);
const keepAliveTimer = setInterval(warmupNLLB, 10 * 60 * 1000);
warmupTimer.unref?.();
keepAliveTimer.unref?.();

async function translateWithNLLB(text, sourceLang, targetLang, retries = 3) {
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  const srcCode = nllbCode(sourceLang);
  const tgtCode = nllbCode(targetLang);
  // Langue absente de NLLB (sérère, diola, mandinka, soninké) -> on n'appelle pas
  // l'API (elle échouerait ou renverrait du charabia).
  if (!srcCode || !tgtCode) return null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: text,
            parameters: { src_lang: srcCode, tgt_lang: tgtCode },
            options: { wait_for_model: true, use_cache: true }
          })
        }
      );

      if (response.status === 503) {
        const info = await response.json().catch(() => ({}));
        const wait = Math.min(info.estimated_time || 20, 30);
        console.log(`NLLB loading, waiting ${wait}s (attempt ${attempt + 1}/${retries + 1})`);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, wait * 1000));
          continue;
        }
        return null;
      }

      if (!response.ok) {
        console.error('NLLB error:', response.status);
        return null;
      }

      const data = await response.json();
      if (Array.isArray(data) && data[0]?.translation_text) {
        const result = data[0].translation_text;
        nllbWarm = true;
        if (result && result !== text) return result;
      }
      return null;
    } catch (error) {
      console.error('NLLB fetch error:', error.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function translateWithAI(text, targetLang) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) return null;
  if (LOCAL_LANGS.includes(targetLang)) return null;

  const langName = LANG_NAMES[targetLang] || 'English';

  try {
    const result = await createAICompletion([{
      role: 'user',
      content: `Translate to ${langName}. Keep numbers, names, acronyms unchanged. Only output the translation:\n\n${text}`
    }], { maxTokens: 2000, temperature: 0.2 });
    if (result.content && result.content !== text.trim()) return result.content;
    return null;
  } catch (error) {
    return null;
  }
}

async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  if (sourceLang === targetLang) return text;
  if (!text || text.trim().length === 0) return text;

  if (LOCAL_LANGS.includes(targetLang)) {
    return await translateWithNLLB(text, sourceLang, targetLang);
  }

  const aiResult = await translateWithAI(text, targetLang);
  if (aiResult) return aiResult;

  return await translateWithNLLB(text, sourceLang, targetLang);
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  if (LOCAL_LANGS.includes(targetLang)) {
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/^[-•]\s*/gm, '')
      .replace(/#{1,3}\s*/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

    // Try translating the full text first (faster, works for short responses)
    if (cleanText.length < 500) {
      const fullResult = await translateWithNLLB(cleanText, 'fr', targetLang, 1);
      if (fullResult) {
        const frenchWords = fullResult.match(/\b(est|les|des|pour|dans|avec|sur|que|qui|une|pas)\b/gi) || [];
        if (frenchWords.length <= fullResult.split(' ').length * 0.3) {
          return fullResult;
        }
      }
    }

    // Split into sentences for longer text
    const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

    const translated = [];
    for (const sentence of sentences) {
      if (sentence.length < 5) {
        translated.push(sentence);
        continue;
      }
      const result = await translateWithNLLB(sentence, 'fr', targetLang, 1);
      translated.push(result || sentence);
    }

    const output = translated.join(' ');
    const frenchWords = output.match(/\b(est|les|des|pour|dans|avec|sur|que|qui|une|pas)\b/gi) || [];
    if (frenchWords.length > output.split(' ').length * 0.3) {
      return null;
    }
    return output;
  }

  return await translateText(text, 'fr', targetLang);
}

function isTranslationAvailable() {
  return !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
}

module.exports = {
  translateText,
  translateForChat,
  isTranslationAvailable,
  NLLB_LANG_CODES
};
