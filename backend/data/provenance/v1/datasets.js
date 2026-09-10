const DATASETS = Object.freeze({
  rgph5_population_2023: {
    dataset_id: 'rgph5_population_2023', source_id: 'ansd_rgph5_population', type: 'official',
    observed_period: '2023', geography: 'Sénégal', unit: 'personnes', unit_status: 'confirmed',
    method: 'Recensement général de la population et de l’habitat', derived_from: [],
    limitations: ['La classification urbain/rural du RGPH-5 constitue une rupture méthodologique avec les recensements précédents.'],
    availability: 'available', verification: 'verified'
  },
  rgph5_agriculture_2023: {
    dataset_id: 'rgph5_agriculture_2023', source_id: 'ansd_rgph5_agriculture', type: 'official',
    observed_period: '2023', geography: 'Sénégal', unit: 'ménages', unit_status: 'confirmed',
    method: 'Module agriculture du RGPH-5', derived_from: [],
    limitations: ['Les activités agriculture, élevage, culture pluviale et maraîchage se chevauchent et ne doivent pas être additionnées.'],
    availability: 'available', verification: 'verified'
  },
  sesn_2024_agriculture: {
    dataset_id: 'sesn_2024_agriculture', source_id: 'ansd_sesn_2024', type: 'official',
    observed_period: 'campagne 2024-2025', geography: 'Sénégal', unit: null, unit_status: 'unconfirmed',
    method: 'Tableau de production de la SESN 2024', derived_from: [],
    limitations: ['L’unité du tableau extrait n’a pas été confirmée ; les valeurs ne sont donc pas affichées avec une unité.'],
    availability: 'available', verification: 'partial'
  },
  weather_openweathermap: {
    dataset_id: 'weather_openweathermap', source_id: 'openweathermap', type: 'live',
    observed_period: 'requête et prévision à cinq jours', geography: 'ville', unit: 'unités météorologiques SI', unit_status: 'confirmed',
    method: 'API fournisseur, cache local maximal de 30 minutes', derived_from: [],
    limitations: ['Prévisions fournisseur, non observations ANACIM.', 'La probabilité de pluie affichée est dérivée localement du volume prévu.'],
    availability: 'available', verification: 'verified'
  },
  weather_seasonal_fallback: {
    dataset_id: 'weather_seasonal_fallback', source_id: null, type: 'estimated',
    observed_period: 'mois courant', geography: 'ville et zone agroclimatique', unit: 'unités météorologiques SI', unit_status: 'confirmed',
    method: 'Climatologie locale codée et variation pseudo-déterministe', derived_from: [],
    limitations: ['Ce n’est ni une observation ni une prévision météorologique officielle.'],
    availability: 'degraded', verification: 'unverified'
  },
  market_prices_simulation: {
    dataset_id: 'market_prices_simulation', source_id: null, type: 'simulated',
    observed_period: null, geography: 'villes du référentiel local', unit: 'FCFA/kg sauf indication produit', unit_status: 'partial',
    method: 'Prix de base locaux, multiplicateurs saisonniers et variation pseudo-déterministe', derived_from: [],
    limitations: ['Aucun relevé récent ARM, CSAR/SIM ou FPMA n’alimente ces valeurs.', 'La date de calcul n’est pas une date d’observation.'],
    availability: 'degraded', verification: 'unverified'
  },
  news_google_rss: {
    dataset_id: 'news_google_rss', source_id: 'google_news_rss', type: 'live',
    observed_period: 'flux courant', geography: 'Sénégal', unit: null, unit_status: 'not_applicable',
    method: 'Agrégation et filtrage de titres du flux Google News RSS', derived_from: [],
    limitations: ['Les articles proviennent de médias variés et ne sont pas tous des publications institutionnelles.'],
    availability: 'available', verification: 'partial'
  },
  alert_scenarios_local: {
    dataset_id: 'alert_scenarios_local', source_id: null, type: 'estimated',
    observed_period: null, geography: 'villes du référentiel local', unit: null, unit_status: 'not_applicable',
    method: 'Scénarios calculés depuis une climatologie mensuelle codée, la zone agroclimatique et des seuils locaux', derived_from: [],
    limitations: ['Ce ne sont ni des observations, ni des prévisions météo en temps réel, ni des alertes institutionnelles.', 'Les scénarios doivent être confirmés auprès des services météorologiques, agricoles ou de protection civile locaux.'],
    availability: 'degraded', verification: 'unverified'
  },
  community_demo: {
    dataset_id: 'community_demo', source_id: null, type: 'simulated',
    observed_period: null, geography: 'exemples multi-pays du Sahel', unit: null, unit_status: 'not_applicable',
    method: 'Jeu de démonstration embarqué pour illustrer une future interface communautaire', derived_from: [],
    limitations: ['Les profils, observations, effectifs et pourcentages sont fictifs.', 'Aucune observation n’est vérifiée par une institution ou une équipe de modération.'],
    availability: 'degraded', verification: 'unverified'
  },
  ml_embedded_corpus: {
    dataset_id: 'ml_embedded_corpus', source_id: 'faostat_qcl', type: 'static',
    observed_period: '2015-2024 pour l’entraînement; 2025-2026 en quarantaine', geography: 'cinq pays du Sahel', unit: 'kg/ha', unit_status: 'confirmed',
    method: 'Corpus embarqué enrichi de variables agro-environnementales', derived_from: ['faostat_qcl'],
    limitations: ['Aucun export brut, filtre, flag FAOSTAT, date d’extraction ou hash n’est archivé.', 'Les variables enrichies ne sont pas traçables observation par observation.', 'Les 39 lignes 2025-2026 sont mises en quarantaine et exclues de l’entraînement.', 'Les 265 lignes 2015-2024 utilisées restent non examinées et les sorties sont expérimentales.'],
    availability: 'degraded', verification: 'quarantined'
  }
});

module.exports = { DATASETS };
