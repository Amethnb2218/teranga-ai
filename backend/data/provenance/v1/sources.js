const SOURCES = Object.freeze({
  ansd_rgph5_population: {
    source_id: 'ansd_rgph5_population',
    organization: 'Agence nationale de la statistique et de la démographie (ANSD)',
    name: 'RGPH-5 — État et structure de la population',
    url: 'https://www.ansd.sn/sites/default/files/recensements/rapport/Chapitre-1_ETAT-STRUCTURE-POPULATION-Rapport-def-RGPH-5.pdf',
    published_at: '2025-07-01',
    verification: 'verified'
  },
  ansd_rgph5_agriculture: {
    source_id: 'ansd_rgph5_agriculture',
    organization: 'Agence nationale de la statistique et de la démographie (ANSD)',
    name: 'RGPH-5 — Agriculture',
    url: 'https://www.ansd.sn/sites/default/files/recensements/rapport/Chapitre-10_AGRICULTURE-Rapport-def-RGPH-5.pdf',
    published_at: '2025-07-01',
    verification: 'verified'
  },
  ansd_sesn_2024: {
    source_id: 'ansd_sesn_2024',
    organization: 'Agence nationale de la statistique et de la démographie (ANSD)',
    name: 'Situation économique et sociale nationale 2024',
    url: 'https://www.ansd.sn/sites/default/files/2026-02/SESN%202024.pdf',
    published_at: '2026-02-18',
    verification: 'partial'
  },
  dapsa_eaa_2023_2024: {
    source_id: 'dapsa_eaa_2023_2024',
    organization: 'Direction de l’Analyse, de la Prévision et des Statistiques agricoles (DAPSA)',
    name: 'Rapport de l’Enquête agricole annuelle 2023-2024',
    url: 'https://dapsa.gouv.sn/sites/default/files/publications/Rapport%20EAA%202023%202024_FINAL_03.pdf',
    published_at: null,
    verification: 'partial'
  },
  anacim_produits_gtp_2025: {
    source_id: 'anacim_produits_gtp_2025',
    organization: 'Agence nationale de l’aviation civile et de la météorologie (ANACIM)',
    name: 'Produits du Groupe de travail pluridisciplinaire 2025',
    url: 'https://www.anacim.sn/spip.php?article1431',
    published_at: null,
    verification: 'partial'
  },
  anacim_hivernage_2026: {
    source_id: 'anacim_hivernage_2026',
    organization: 'Agence nationale de l’aviation civile et de la météorologie (ANACIM)',
    name: 'Suivi de l’hivernage 2026',
    url: 'https://www.anacim.sn/spip.php?article1831',
    published_at: null,
    verification: 'partial'
  },
  isra_bilan_semencier_2025: {
    source_id: 'isra_bilan_semencier_2025',
    organization: 'Institut sénégalais de recherches agricoles (ISRA)',
    name: 'Bilan de la production semencière 2025 et campagne 2026',
    url: 'https://isra.sn/2026/07/28/production-semenciere-lisra-fait-le-bilan-de-2025-et-fixe-le-cap-pour-la-campagne-agricole-2026/',
    published_at: '2026-07-28',
    verification: 'verified'
  },
  csar_rapport_2025: {
    source_id: 'csar_rapport_2025',
    organization: 'Commissariat à la Sécurité alimentaire et à la Résilience (CSAR)',
    name: 'Rapport annuel d’activités 2025',
    url: 'https://www.vie-publique.sn/documents/13838/rapport-annuel-activites-2025-csar',
    published_at: null,
    verification: 'partial'
  },
  openweathermap: {
    source_id: 'openweathermap',
    organization: 'OpenWeather',
    name: 'OpenWeatherMap Current Weather et 5 Day / 3 Hour Forecast',
    url: 'https://openweathermap.org/forecast5',
    published_at: null,
    verification: 'verified'
  },
  google_news_rss: {
    source_id: 'google_news_rss',
    organization: 'Google News',
    name: 'Flux RSS de recherche agriculture Sénégal',
    url: 'https://news.google.com/rss',
    published_at: null,
    verification: 'partial'
  },
  faostat_qcl: {
    source_id: 'faostat_qcl',
    organization: 'Organisation des Nations unies pour l’alimentation et l’agriculture',
    name: 'FAOSTAT Production: Crops and livestock products (QCL)',
    url: 'https://www.fao.org/faostat/en/#data/QCL',
    published_at: null,
    verification: 'partial'
  }
});

module.exports = { SOURCES };
