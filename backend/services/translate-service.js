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
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  const srcCode = NLLB_LANG_CODES[sourceLang] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[targetLang] || 'wol_Latn';

  if (srcCode === tgtCode) return text;
  if (!text || text.trim().length === 0) return text;

  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  const payload = JSON.stringify({
    inputs: text,
    parameters: {
      src_lang: srcCode,
      tgt_lang: tgtCode
    },
    options: {
      wait_for_model: true
    }
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: payload,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`NLLB error ${response.status}:`, errText.slice(0, 200));
      return null;
    }

    const data = await response.json();

    // Parse response formats
    if (Array.isArray(data)) {
      const item = data[0];
      if (item?.translation_text && item.translation_text !== text) return item.translation_text;
      if (item?.generated_text && item.generated_text !== text) return item.generated_text;
      if (typeof item === 'string' && item !== text) return item;
    }
    if (data?.translation_text && data.translation_text !== text) return data.translation_text;

    console.log('NLLB returned same text or unknown format:', JSON.stringify(data).slice(0, 150));
    return null;
  } catch (error) {
    console.error('Translation fetch error:', error.message);
    return null;
  }
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  if (text.length < 500) {
    const result = await translateText(text, 'fr', targetLang);
    return result || text;
  }

  const paragraphs = text.split('\n\n');
  const results = [];
  for (const para of paragraphs) {
    if (!para.trim()) { results.push(para); continue; }
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
  NLLB_LANG_CODES,
  HF_API_URL
};
