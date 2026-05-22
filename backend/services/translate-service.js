/**
 * Translation Service — Teranga AI
 * Strategy: Use Groq LLM (already working) for translation to Wolof and local languages
 * Fallback: NLLB via Hugging Face if available
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

const LANG_NAMES = {
  wo: 'wolof', pu: 'pulaar (fula)', sr: 'sérère', di: 'diola (jola)',
  mn: 'mandinka (bambara)', sn: 'soninké', en: 'English', ar: 'arabe'
};

async function translateWithGroq(text, targetLang) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const langName = LANG_NAMES[targetLang] || 'wolof';

  const prompt = `Tu es un traducteur expert français → ${langName}. Traduis le texte suivant en ${langName}.
Règles :
- Garde les noms de variétés (55-437, Souna 3, Sahel 108, etc.) en l'état
- Garde les chiffres, unités (kg/ha, mm, FCFA) et sigles (ISRA, ANACIM) en l'état
- Garde le formatage markdown (**, •, etc.)
- Ne traduis PAS les noms propres de lieux
- Donne UNIQUEMENT la traduction, pas d'explication

Texte :
${text}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('Groq translate error:', response.status);
      return null;
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    if (result && result.trim() !== text.trim()) return result.trim();
    return null;
  } catch (error) {
    console.error('Groq translate fetch error:', error.message);
    return null;
  }
}

async function translateWithNLLB(text, sourceLang, targetLang) {
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  const srcCode = NLLB_LANG_CODES[sourceLang] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[targetLang] || 'wol_Latn';

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
          options: { wait_for_model: true }
        })
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.translation_text) {
      const result = data[0].translation_text;
      if (result !== text) return result;
    }
    return null;
  } catch (error) {
    console.error('NLLB error:', error.message);
    return null;
  }
}

const LOCAL_LANGS = ['wo', 'pu', 'sr', 'di', 'mn', 'sn'];

async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  if (sourceLang === targetLang) return text;
  if (!text || text.trim().length === 0) return text;

  // For local African languages: NLLB ONLY (Llama generates garbage for these)
  if (LOCAL_LANGS.includes(targetLang)) {
    const nllbResult = await translateWithNLLB(text, sourceLang, targetLang);
    if (nllbResult) return nllbResult;
    return null;
  }

  // For other languages (en, ar): Groq LLM works fine
  const groqResult = await translateWithGroq(text, targetLang);
  if (groqResult) return groqResult;

  const nllbResult = await translateWithNLLB(text, sourceLang, targetLang);
  if (nllbResult) return nllbResult;

  return null;
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  // For local languages: split into chunks for NLLB (max ~200 words per chunk)
  if (LOCAL_LANGS.includes(targetLang)) {
    const sentences = text.split(/(?<=[.!?\n])\s+/).filter(s => s.trim());
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
      if ((current + ' ' + sentence).split(' ').length > 150) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current = current ? current + ' ' + sentence : sentence;
      }
    }
    if (current) chunks.push(current.trim());

    const translated = [];
    for (const chunk of chunks) {
      const result = await translateWithNLLB(chunk, 'fr', targetLang);
      translated.push(result || chunk);
    }
    return translated.join(' ');
  }

  const result = await translateText(text, 'fr', targetLang);
  return result || text;
}

function isTranslationAvailable() {
  return !!(process.env.GROQ_API_KEY || process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY);
}

module.exports = {
  translateText,
  translateForChat,
  isTranslationAvailable,
  NLLB_LANG_CODES
};
