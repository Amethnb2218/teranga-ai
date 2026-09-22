/**
 * Matrice des langues côté frontend — miroir de backend/config/languages.js.
 * tier: native | full | beta
 * serverVoice: true -> on tente une vraie voix via /api/tts (petit audio,
 *              OK faible connectivité). Aujourd'hui seul le haoussa (Google TTS)
 *              en a une hébergée gratuitement. Les autres utilisent la voix
 *              intégrée du téléphone (Web Speech) : 100% hors-ligne, gratuit,
 *              lit le texte déjà traduit (accent non natif).
 */

export const LANG_CONFIG = {
  fr:  { label: 'Français',  tier: 'native', speechLang: 'fr-FR', serverVoice: false },
  wo:  { label: 'Wolof',     tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  pu:  { label: 'Pulaar',    tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  ha:  { label: 'Haoussa',   tier: 'full',   speechLang: 'ha-NG', serverVoice: true },
  bm:  { label: 'Bambara',   tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  mos: { label: 'Mooré',     tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  dyu: { label: 'Dioula',    tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  kr:  { label: 'Kanouri',   tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  tmh: { label: 'Tamasheq',  tier: 'full',   speechLang: 'fr-FR', serverVoice: false },
  en:  { label: 'English',   tier: 'native', speechLang: 'en-US', serverVoice: false },
  ar:  { label: 'العربية',   tier: 'native', speechLang: 'ar-SA', serverVoice: false },
  sr:  { label: 'Sérère',    tier: 'beta',   speechLang: 'fr-FR', serverVoice: false },
  di:  { label: 'Diola',     tier: 'beta',   speechLang: 'fr-FR', serverVoice: false },
  mn:  { label: 'Mandinka',  tier: 'beta',   speechLang: 'fr-FR', serverVoice: false },
  sn:  { label: 'Soninké',   tier: 'beta',   speechLang: 'fr-FR', serverVoice: false }
};

// Ordre du sélecteur : pivot, langues complètes du Sahel, puis en/ar, puis beta.
export const LANGUAGE_ORDER = ['fr', 'wo', 'pu', 'ha', 'bm', 'mos', 'dyu', 'kr', 'tmh', 'en', 'ar', 'sr', 'di', 'mn', 'sn'];

export const LANG_LABELS = Object.fromEntries(
  Object.entries(LANG_CONFIG).map(([code, cfg]) => [code, cfg.label])
);

// Langue de repli navigateur : les langues locales du Sahel s'écrivent avec une
// orthographe proche du français -> une voix française les lit de façon
// intelligible. Arabe/anglais utilisent leur propre voix.
export function browserSpeechLang(code) {
  const cfg = LANG_CONFIG[code];
  if (!cfg) return 'fr-FR';
  // ha-NG n'existe pas côté navigateur -> repli français si Web Speech est utilisé.
  if (cfg.speechLang === 'ha-NG') return 'fr-FR';
  return cfg.speechLang;
}

// Débit Web Speech : plus lent pour les langues locales (plus clair à l'oreille).
export const SPEECH_RATE = Object.fromEntries(
  LANGUAGE_ORDER.map(code => [code, ['fr', 'en'].includes(code) ? 0.9 : code === 'ar' ? 0.82 : 0.78])
);
