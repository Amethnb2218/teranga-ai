/**
 * Translation Service — Teranga AI
 * Uses Meta's NLLB (No Language Left Behind) via Hugging Face Inference API
 * Supports Wolof, Pulaar, Sérère, Diola, Mandinka, Soninké
 */

const NLLB_LANG_CODES = {
  fr: 'fra_Latn',
  wo: 'wol_Latn',
  pu: 'ful_Latn',
  sr: 'srr_Latn',
  di: 'dyu_Latn',
  mn: 'bam_Latn',
  sn: 'snk_Latn',
  en: 'eng_Latn',
  ar: 'arb_Arab'
};

const HF_MODEL = 'facebook/nllb-200-distilled-600M';

async function callHFTranslation(text, srcCode, tgtCode, apiKey) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          src_lang: srcCode,
          tgt_lang: tgtCode
        }
      })
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    console.error('HF API error:', response.status, errBody);

    // Model loading (cold start) — wait and retry
    if (response.status === 503) {
      console.log('NLLB model loading, retrying in 5s...');
      await new Promise(r => setTimeout(r, 5000));
      const retry = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
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
      if (!retry.ok) return null;
      return await retry.json();
    }
    return null;
  }

  return await response.json();
}

function extractTranslation(data, originalText) {
  if (!data) return null;

  // Format 1: [{translation_text: "..."}]
  if (Array.isArray(data) && data[0]?.translation_text) {
    const result = data[0].translation_text;
    if (result && result !== originalText) return result;
  }

  // Format 2: [{generated_text: "..."}]
  if (Array.isArray(data) && data[0]?.generated_text) {
    const result = data[0].generated_text;
    if (result && result !== originalText) return result;
  }

  // Format 3: {translation_text: "..."}
  if (data.translation_text) {
    const result = data.translation_text;
    if (result && result !== originalText) return result;
  }

  // Format 4: direct string array
  if (Array.isArray(data) && typeof data[0] === 'string') {
    if (data[0] !== originalText) return data[0];
  }

  // Format 5: nested [{translation: "..."}]
  if (Array.isArray(data) && data[0]?.translation) {
    const result = data[0].translation;
    if (result && result !== originalText) return result;
  }

  console.log('NLLB response format unknown:', JSON.stringify(data).slice(0, 200));
  return null;
}

async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  const srcCode = NLLB_LANG_CODES[sourceLang] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[targetLang] || 'wol_Latn';

  if (srcCode === tgtCode) return text;
  if (!text || text.trim().length === 0) return text;

  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  try {
    // Try NLLB model
    const data = await callHFTranslation(text, srcCode, tgtCode, apiKey);
    const result = extractTranslation(data, text);
    if (result) return result;

    // If NLLB returns same text, try the dedicated translation pipeline endpoint
    const pipelineResponse = await fetch(
      `https://api-inference.huggingface.co/pipeline/translation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: HF_MODEL,
          inputs: text,
          parameters: {
            src_lang: srcCode,
            tgt_lang: tgtCode
          }
        })
      }
    );

    if (pipelineResponse.ok) {
      const pipeData = await pipelineResponse.json();
      const pipeResult = extractTranslation(pipeData, text);
      if (pipeResult) return pipeResult;
    }

    return null;
  } catch (error) {
    console.error('Translation service error:', error.message);
    return null;
  }
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  // For short texts, translate directly
  if (text.length < 500) {
    const result = await translateText(text, 'fr', targetLang);
    return result || text;
  }

  // For longer texts, split by paragraphs and translate each
  const paragraphs = text.split('\n\n');
  const results = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      results.push(para);
      continue;
    }
    const translated = await translateText(para, 'fr', targetLang);
    results.push(translated || para);
  }

  return results.join('\n\n');
}

function isTranslationAvailable() {
  return !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY);
}

module.exports = {
  translateText,
  translateForChat,
  isTranslationAvailable,
  NLLB_LANG_CODES
};
