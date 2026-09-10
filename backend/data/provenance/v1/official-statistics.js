const OFFICIAL_STATISTICS = Object.freeze({
  rgph5_population: {
    dataset_id: 'rgph5_population_2023', values: {
      population_total: 18126390,
      population_urbaine: 9922399,
      part_urbaine_pct: 54.7,
      population_rurale: 8203991,
      part_rurale_pct: 45.3,
      croissance_annuelle_2013_2023_pct: 2.9,
      moins_15_ans_pct: 39.1,
      age_median_ans: 19
    }
  },
  rgph5_langues: {
    dataset_id: 'rgph5_population_2023', values: {
      wolof_premiere_langue_nationale_pct: 53.5,
      pulaar_premiere_langue_nationale_pct: 26.2,
      sereer_premiere_langue_nationale_pct: 9.6,
      joola_premiere_langue_nationale_pct: 2.9
    }
  },
  rgph5_agriculture: {
    dataset_id: 'rgph5_agriculture_2023', values: {
      menages_agricoles: 909638,
      part_des_menages_pct: 44.5,
      menages_agricoles_ruraux: 613907,
      menages_agricoles_urbains: 295731,
      pratiquent_agriculture: 648052,
      pratiquent_elevage: 792160,
      pratiquent_culture_pluviale: 613388,
      pratiquent_maraichage: 119442,
      possession_materiel_motorise_pct: 9.5,
      utilisation_materiel_motorise_pct: 17.6
    },
    aggregation_warning: 'Les catégories d’activités se chevauchent et ne doivent pas être additionnées.'
  },
  sesn_2024_productions: {
    dataset_id: 'sesn_2024_agriculture', unit: null, unit_status: 'unconfirmed', values: {
      mil: 675910, sorgho: 186054, mais: 495571, riz: 946209, fonio: 6275,
      arachide: 795585, coton: 13965, niebe: 123393, manioc: 740721,
      pasteque: 629488, sesame: 18573
    }
  }
});

module.exports = { OFFICIAL_STATISTICS };
