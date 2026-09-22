/**
 * Matrice de couverture linguistique — Teranga AI (source unique de vérité)
 * ---------------------------------------------------------------------------
 * Une langue n'est réellement utilisable pour un agriculteur analphabète que si
 * la boucle vocale complète existe :
 *     STT (parler) -> NLLB (comprendre) -> MMS-TTS (répondre à voix haute)
 *
 * Codes VÉRIFIÉS :
 *  - nllb : présent dans la liste officielle FLORES-200 (sinon null)
 *  - mmsTts / mmsAsr : modèle Meta MMS existant pour cette langue
 *  - whisper : code Whisper large-v3 (uniquement les langues réellement supportées)
 *
 * Tiers :
 *  - native : langue "pivot" du LLM (fr) ou langue à voix navigateur (en, ar)
 *  - full   : NLLB + voix MMS -> traduction fidèle + voix locale de bout en bout
 *  - beta   : voix MMS existe mais PAS de traduction NLLB fiable -> compréhension
 *             routée via wolof/français, sortie française (voix navigateur).
 */

const LANGUAGES = {
  // --- Langues pivots / à voix navigateur ---
  fr: { label: 'Français',  tier: 'native', region: 'Sahel',                 nllb: 'fra_Latn', whisper: 'fr', mmsAsr: null,  mmsTts: null,  speechLang: 'fr-FR' },
  en: { label: 'English',   tier: 'native', region: '—',                     nllb: 'eng_Latn', whisper: 'en', mmsAsr: null,  mmsTts: null,  speechLang: 'en-US' },
  ar: { label: 'العربية',   tier: 'native', region: 'Mauritanie/Tchad',      nllb: 'arb_Arab', whisper: 'ar', mmsAsr: null,  mmsTts: null,  speechLang: 'ar-SA' },

  // --- Couverture COMPLÈTE (NLLB + voix MMS) ---
  wo:  { label: 'Wolof',    tier: 'full', region: 'Sénégal',                 nllb: 'wol_Latn', whisper: null, mmsAsr: 'wol', mmsTts: 'wol', speechLang: 'fr-FR' },
  pu:  { label: 'Pulaar',   tier: 'full', region: 'Sahel (SN→Tchad)',        nllb: 'fuv_Latn', whisper: null, mmsAsr: 'fuv', mmsTts: 'fuv', speechLang: 'fr-FR' },
  ha:  { label: 'Haoussa',  tier: 'full', region: 'Niger/Nigéria/Tchad',     nllb: 'hau_Latn', whisper: 'ha', mmsAsr: 'hau', mmsTts: 'hau', speechLang: 'fr-FR' },
  bm:  { label: 'Bambara',  tier: 'full', region: 'Mali',                    nllb: 'bam_Latn', whisper: null, mmsAsr: 'bam', mmsTts: 'bam', speechLang: 'fr-FR' },
  mos: { label: 'Mooré',    tier: 'full', region: 'Burkina Faso',            nllb: 'mos_Latn', whisper: null, mmsAsr: 'mos', mmsTts: 'mos', speechLang: 'fr-FR' },
  dyu: { label: 'Dioula',   tier: 'full', region: 'Burkina/Côte d’Ivoire',   nllb: 'dyu_Latn', whisper: null, mmsAsr: 'dyu', mmsTts: 'dyu', speechLang: 'fr-FR' },
  kr:  { label: 'Kanouri',  tier: 'full', region: 'Niger/Tchad/Nigéria',     nllb: 'knc_Latn', whisper: null, mmsAsr: 'knc', mmsTts: 'knc', speechLang: 'fr-FR' },
  tmh: { label: 'Tamasheq', tier: 'full', region: 'Mali/Niger',             nllb: 'taq_Latn', whisper: null, mmsAsr: 'taq', mmsTts: 'taq', speechLang: 'fr-FR' },

  // --- BETA : voix MMS disponible, pas de traduction NLLB (sortie française) ---
  sr:  { label: 'Sérère',   tier: 'beta', region: 'Sénégal',                 nllb: null, whisper: null, mmsAsr: 'srr', mmsTts: 'srr', speechLang: 'fr-FR' },
  di:  { label: 'Diola',    tier: 'beta', region: 'Casamance',               nllb: null, whisper: null, mmsAsr: 'dyo', mmsTts: 'dyo', speechLang: 'fr-FR' },
  mn:  { label: 'Mandinka', tier: 'beta', region: 'Sénégal/Gambie',          nllb: null, whisper: null, mmsAsr: 'mnk', mmsTts: 'mnk', speechLang: 'fr-FR' },
  sn:  { label: 'Soninké',  tier: 'beta', region: 'Mali/Sénégal/Mauritanie', nllb: null, whisper: null, mmsAsr: 'snk', mmsTts: 'snk', speechLang: 'fr-FR' }
};

// Ordre d'affichage dans le sélecteur (pivots, puis full, puis beta)
const DISPLAY_ORDER = ['fr', 'wo', 'pu', 'ha', 'bm', 'mos', 'dyu', 'kr', 'tmh', 'en', 'ar', 'sr', 'di', 'mn', 'sn'];

// Langues locales africaines (nécessitent la couche traduction/voix)
const LOCAL_LANGS = Object.keys(LANGUAGES).filter(
  code => LANGUAGES[code].tier === 'full' || LANGUAGES[code].tier === 'beta'
);

// Langues traduisibles par NLLB (couverture complète)
const NLLB_LANGS = Object.keys(LANGUAGES).filter(code => LANGUAGES[code].nllb);

function getLanguage(code) {
  return LANGUAGES[code] || null;
}

function nllbCode(code) {
  return LANGUAGES[code]?.nllb || null;
}

function hasTranslation(code) {
  return !!LANGUAGES[code]?.nllb;
}

function ttsCode(code) {
  return LANGUAGES[code]?.mmsTts || null;
}

module.exports = {
  LANGUAGES,
  DISPLAY_ORDER,
  LOCAL_LANGS,
  NLLB_LANGS,
  getLanguage,
  nllbCode,
  hasTranslation,
  ttsCode
};
