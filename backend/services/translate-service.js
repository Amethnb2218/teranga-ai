/**
 * Translation Service — Teranga AI
 * ---------------------------------------------------------------------------
 * IMPORTANT (sept. 2026) : l'ancienne API d'inférence HuggingFace
 * (api-inference.huggingface.co) est HORS SERVICE, et NLLB-200 / MMS ne sont
 * plus servis par aucun fournisseur d'inférence HF gratuit. On traduit donc
 * désormais via le LLM (Gemini/Groq), qui gère très bien les grandes langues
 * du Sahel (wolof, haoussa, bambara, pulaar...).
 *
 * Le champ `nllb` de config/languages.js sert maintenant d'indicateur
 * "langue bien dotée / traduisible de façon fiable" (tier full). Les langues
 * beta (sérère, diola, mandinka, soninké) restent sans traduction fiable :
 * on renvoie null -> réponse en français.
 */

const { createAICompletion } = require('./ai-provider-service');
const { LANGUAGES, hasTranslation } = require('../config/languages');

const LANG_NAMES = Object.fromEntries(
  Object.entries(LANGUAGES).map(([code, cfg]) => [code, cfg.label])
);

// Indices agricoles pour aider le LLM sur le vocabulaire local.
const AGRI_HINTS = {
  wo: 'Vocabulaire wolof : gerte=arachide, dugub=mil, maalo=riz, mboq=maïs, tool=champ, nawet=hivernage, taw=pluie, ndox=eau.',
  pu: 'Vocabulaire pulaar : gerte=arachide, gawri=mil, maaro=riz, ngesa=champ, ndiyam=eau.',
  ha: 'Vocabulaire haoussa : gyada=arachide, gero=mil, shinkafa=riz, masara=maïs, gona=champ, ruwa=eau, damina=hivernage.',
  bm: 'Vocabulaire bambara : tiga=arachide, ɲɔ=mil, malo=riz, kaba=maïs, foro=champ, ji=eau, samiya=hivernage.'
};

function isLLMAvailable() {
  return !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
}

// Traduction via LLM. Renvoie null si indisponible / échec.
async function translateWithLLM(text, targetLang, sourceLang = 'fr') {
  if (!isLLMAvailable()) return null;
  const target = LANG_NAMES[targetLang] || targetLang;
  const source = LANG_NAMES[sourceLang] || sourceLang;
  const hint = AGRI_HINTS[targetLang] || AGRI_HINTS[sourceLang] || '';

  try {
    const result = await createAICompletion([{
      role: 'user',
      content: `Tu es traducteur agricole. Traduis ce texte du ${source} vers le ${target}. `
        + `Garde inchangés les nombres, unités, dates, sigles et noms de variétés. `
        + `${hint} `
        + `Réponds UNIQUEMENT par la traduction en ${target}, sans explication ni guillemets.\n\n${text}`
    }], { maxTokens: 1500, temperature: 0.2 });
    const out = (result.content || '').trim();
    return out && out !== text.trim() ? out : null;
  } catch {
    return null;
  }
}

// Traduit vers une langue cible (local, en, ar). null si non fiable.
async function translateText(text, sourceLang = 'fr', targetLang = 'wo') {
  if (sourceLang === targetLang) return text;
  if (!text || text.trim().length === 0) return text;

  const targetLocal = LANGUAGES[targetLang] && LANGUAGES[targetLang].tier !== 'native';
  // Langue locale beta (pas de traduction fiable) -> null (sortie française).
  if (targetLocal && !hasTranslation(targetLang)) return null;

  return await translateWithLLM(text, targetLang, sourceLang);
}

// Traduit une réponse française du conseiller vers la langue de l'agriculteur.
async function translateForChat(text, targetLang) {
  if (targetLang === 'fr') return text;
  if (!text) return text;

  // Langues locales beta : pas de traduction fiable -> français conservé.
  if (LANGUAGES[targetLang]?.tier === 'beta') return null;

  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/^[-•]\s*/gm, '')
    .replace(/#{1,3}\s*/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

  return await translateWithLLM(cleanText, targetLang, 'fr');
}

function isTranslationAvailable() {
  return isLLMAvailable();
}

module.exports = {
  translateText,
  translateForChat,
  isTranslationAvailable,
  translateWithLLM
};
