/**
 * Translation Service — Teranga AI
 * NLLB for local African languages (Wolof, Pulaar, Sérère, etc.)
 * Groq LLM for English/Arabic only
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
  wo: 'wolof', pu: 'pulaar', sr: 'sérère', di: 'diola',
  mn: 'mandinka', sn: 'soninké', en: 'English', ar: 'arabe'
};

const LOCAL_LANGS = ['wo', 'pu', 'sr', 'di', 'mn', 'sn'];

async function translateWithNLLB(text, sourceLang, targetLang, retries = 2) {
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  const srcCode = NLLB_LANG_CODES[sourceLang] || 'fra_Latn';
  const tgtCode = NLLB_LANG_CODES[targetLang] || 'wol_Latn';

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
        const wait = Math.min(info.estimated_time || 15, 25);
        console.log(`NLLB loading, waiting ${wait}s (attempt ${attempt + 1})`);
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
        if (result && result !== text) return result;
      }
      return null;
    } catch (error) {
      console.error('NLLB fetch error:', error.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function translateWithGroq(text, targetLang) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (LOCAL_LANGS.includes(targetLang)) return null;

  const langName = LANG_NAMES[targetLang] || 'English';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Translate to ${langName}. Keep numbers, names, acronyms unchanged. Only output the translation:\n\n${text}` }],
        max_tokens: 2000,
        temperature: 0.2
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();
    if (result && result !== text.trim()) return result;
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

  const groqResult = await translateWithGroq(text, targetLang);
  if (groqResult) return groqResult;

  return await translateWithNLLB(text, sourceLang, targetLang);
}

async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  if (LOCAL_LANGS.includes(targetLang)) {
    // Clean markdown for better NLLB results
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/^[-•]\s*/gm, '')
      .replace(/#{1,3}\s*/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

    // Split into sentences for NLLB (works better on short text)
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
    // If most sentences failed (still French), return null to trigger fallback
    const frenchWords = output.match(/\b(est|les|des|pour|dans|avec|sur|que|qui|une|pas)\b/gi) || [];
    if (frenchWords.length > output.split(' ').length * 0.3) {
      return null;
    }
    return output;
  }

  return await translateText(text, 'fr', targetLang);
}

function isTranslationAvailable() {
  return !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || process.env.GROQ_API_KEY);
}

module.exports = {
  translateText,
  translateForChat,
  isTranslationAvailable,
  NLLB_LANG_CODES
};
