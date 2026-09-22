/**
 * Matrice des langues côté frontend — miroir de backend/config/languages.js.
 * tier: native | full | beta   (full = voix locale MMS + traduction NLLB)
 * hasLocalVoice: true -> on tente la synthèse MMS-TTS via /api/tts,
 *                        sinon (fr/en/ar) le navigateur (Web Speech).
 */

export const LANG_CONFIG = {
  fr:  { label: 'Français',  tier: 'native', speechLang: 'fr-FR', hasLocalVoice: false },
  wo:  { label: 'Wolof',     tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  pu:  { label: 'Pulaar',    tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  ha:  { label: 'Haoussa',   tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  bm:  { label: 'Bambara',   tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  mos: { label: 'Mooré',     tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  dyu: { label: 'Dioula',    tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  kr:  { label: 'Kanouri',   tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  tmh: { label: 'Tamasheq',  tier: 'full',   speechLang: 'fr-FR', hasLocalVoice: true },
  en:  { label: 'English',   tier: 'native', speechLang: 'en-US', hasLocalVoice: false },
  ar:  { label: 'العربية',   tier: 'native', speechLang: 'ar-SA', hasLocalVoice: false },
  sr:  { label: 'Sérère',    tier: 'beta',   speechLang: 'fr-FR', hasLocalVoice: true },
  di:  { label: 'Diola',     tier: 'beta',   speechLang: 'fr-FR', hasLocalVoice: true },
  mn:  { label: 'Mandinka',  tier: 'beta',   speechLang: 'fr-FR', hasLocalVoice: true },
  sn:  { label: 'Soninké',   tier: 'beta',   speechLang: 'fr-FR', hasLocalVoice: true }
};

// Ordre du sélecteur : pivot, langues complètes du Sahel, puis en/ar, puis beta.
export const LANGUAGE_ORDER = ['fr', 'wo', 'pu', 'ha', 'bm', 'mos', 'dyu', 'kr', 'tmh', 'en', 'ar', 'sr', 'di', 'mn', 'sn'];

export const LANG_LABELS = Object.fromEntries(
  Object.entries(LANG_CONFIG).map(([code, cfg]) => [code, cfg.label])
);

// Débit de lecture Web Speech (fallback) : plus lent pour les langues locales.
export const SPEECH_RATE = Object.fromEntries(
  LANGUAGE_ORDER.map(code => [code, ['fr', 'en'].includes(code) ? 0.92 : code === 'ar' ? 0.85 : 0.8])
);
