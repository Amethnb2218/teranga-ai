/**
 * Translation Service — Teranga AI
 * Uses Meta's NLLB (No Language Left Behind) via Hugging Face Inference API
 * Free tier: 1000 requests/day
 * Supports 200+ languages including Wolof, Pulaar, Mandinka, etc.
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

async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  const srcCode = NLLB_LANG_CODES[sourceLang] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[targetLang] || 'wol_Latn';

  if (srcCode === tgtCode) return text;

  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
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
      const errText = await response.text();
      console.error('NLLB translation error:', response.status, errText);

      if (response.status === 503) {
        await new Promise(r => setTimeout(r, 2000));
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
        if (retry.ok) {
          const data = await retry.json();
          return data[0]?.translation_text || null;
        }
      }
      return null;
    }

    const data = await response.json();
    return data[0]?.translation_text || null;
  } catch (error) {
    console.error('Translation service error:', error.message);
    return null;
  }
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;

  const chunks = text.split('\n\n');
  const translated = [];

  for (const chunk of chunks) {
    if (chunk.startsWith('**') || chunk.startsWith('#') || chunk.startsWith('-') || chunk.startsWith('•')) {
      const result = await translateText(chunk, 'fr', targetLang);
      translated.push(result || chunk);
    } else if (chunk.trim().length > 0) {
      const result = await translateText(chunk, 'fr', targetLang);
      translated.push(result || chunk);
    } else {
      translated.push(chunk);
    }
  }

  return translated.join('\n\n');
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
