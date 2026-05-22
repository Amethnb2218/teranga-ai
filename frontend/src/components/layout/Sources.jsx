import { useState } from 'react'
import { FiExternalLink, FiDatabase, FiBook, FiGlobe, FiBarChart2, FiChevronDown } from 'react-icons/fi'

const SOURCES = [
  {
    category: 'Recherche agronomique',
    icon: FiBook,
    items: [
      {
        name: 'ISRA',
        full: 'Institut Sénégalais de Recherches Agricoles',
        url: 'https://www.isra.sn',
        desc: 'Variétés certifiées (Souna 3, Fleur 11, 55-437, Sahel 108...), itinéraires techniques, calendriers culturaux, résultats d\'essais variétaux.',
        data: 'Fiches techniques par culture, rendements en station, recommandations variétales par zone agro-écologique'
      },
      {
        name: 'ANCAR',
        full: 'Agence Nationale de Conseil Agricole et Rural',
        url: 'https://www.ancar.sn',
        desc: 'Vulgarisation agricole, fiches de bonnes pratiques, données de suivi des parcelles de démonstration.',
        data: 'Itinéraires techniques vulgarisés, protocoles de traitement phytosanitaire'
      },
      {
        name: 'CERAAS',
        full: 'Centre d\'Étude Régional pour l\'Amélioration de l\'Adaptation à la Sécheresse',
        url: 'https://www.ceraas.org',
        desc: 'Recherche sur l\'adaptation des cultures à la sécheresse, variétés tolérantes au stress hydrique.',
        data: 'Données de résistance variétale, seuils de stress hydrique par culture'
      }
    ]
  },
  {
    category: 'Climat et météorologie',
    icon: FiGlobe,
    items: [
      {
        name: 'ANACIM',
        full: 'Agence Nationale de l\'Aviation Civile et de la Météorologie',
        url: 'https://www.anacim.sn',
        desc: 'Données climatologiques sur 30 ans, prévisions saisonnières, bulletins agro-météorologiques décadaires.',
        data: 'Pluviométrie mensuelle/annuelle par station (1994-2024), températures, ETP, dates d\'installation des pluies'
      },
      {
        name: 'Open-Meteo',
        full: 'API météo open-source',
        url: 'https://open-meteo.com',
        desc: 'Prévisions météorologiques 7 jours, données historiques, modèles de réanalyse ERA5.',
        data: 'Prévisions température, pluie, humidité, vent — utilisées pour les alertes en temps réel'
      }
    ]
  },
  {
    category: 'Marchés et prix',
    icon: FiBarChart2,
    items: [
      {
        name: 'CSA',
        full: 'Commissariat à la Sécurité Alimentaire',
        url: 'https://www.secnsa.sn',
        desc: 'Suivi hebdomadaire des prix sur les principaux marchés du Sénégal. 20+ produits, 10 marchés.',
        data: 'Prix en FCFA/kg des céréales, légumineuses, oléagineux, tubercules — campagne 2024-2025'
      },
      {
        name: 'FAO/GIEWS',
        full: 'Système Mondial d\'Information et d\'Alerte Rapide (FAO)',
        url: 'https://www.fao.org/giews',
        desc: 'Surveillance de la sécurité alimentaire mondiale, indices de prix, alertes spéciales.',
        data: 'Prix internationaux, tendances import/export, bilans céréaliers nationaux'
      },
      {
        name: 'ARM',
        full: 'Agence de Régulation des Marchés',
        url: 'https://www.arm.sn',
        desc: 'Régulation et suivi des marchés agricoles sénégalais, stocks nationaux.',
        data: 'Prix de référence, stocks de sécurité, prévisions de campagne'
      }
    ]
  },
  {
    category: 'Statistiques et planification',
    icon: FiDatabase,
    items: [
      {
        name: 'DAPSA',
        full: 'Direction de l\'Analyse, de la Prévision et des Statistiques Agricoles',
        url: 'https://www.dapsa.gouv.sn',
        desc: 'Statistiques agricoles officielles du Sénégal. Production, superficies, rendements par culture et par région.',
        data: 'Séries historiques 2015-2024 : production (tonnes), superficie (ha), rendement (kg/ha) — par région et par culture'
      },
      {
        name: 'ANSD',
        full: 'Agence Nationale de la Statistique et de la Démographie',
        url: 'https://www.ansd.sn',
        desc: 'Données démographiques, enquêtes ménages, statistiques économiques du secteur agricole.',
        data: 'Données contextuelles : population rurale, revenus agricoles, indicateurs socio-économiques'
      }
    ]
  }
];

function Sources() {
  const [openSections, setOpenSections] = useState({0: true, 1: true, 2: true, 3: true});

  const toggleSection = (idx) => {
    setOpenSections(prev => ({...prev, [idx]: !prev[idx]}));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <p className="section-label mb-2">Transparence</p>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">Sources et méthodologie</h1>
        <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
          Toutes les données utilisées par Teranga AI proviennent de sources institutionnelles publiques et vérifiables.
          Aucune donnée n'est inventée ou générée par l'IA.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-8">
        {SOURCES.map((section, si) => (
          <div key={si} className="bg-white sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-stone-200 overflow-hidden">
            <button
              onClick={() => toggleSection(si)}
              className="flex items-center justify-between w-full gap-2 p-4 sm:p-0 sm:mb-4"
            >
              <div className="flex items-center gap-2">
                <section.icon className="text-amber-700" size={16} />
                <h2 className="font-bold text-stone-900 text-sm sm:text-base">{section.category}</h2>
              </div>
              <FiChevronDown className={`sm:hidden text-stone-400 transition-transform ${openSections[si] ? 'rotate-180' : ''}`} size={16} />
            </button>
            <div className={`${openSections[si] ? 'block' : 'hidden sm:block'} px-4 pb-4 sm:p-0`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((source, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{source.name}</h3>
                      <p className="text-xs text-stone-500">{source.full}</p>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-900 p-1"
                      title={`Visiter ${source.name}`}
                    >
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-3">{source.desc}</p>
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                    <p className="text-xs text-stone-500">
                      <span className="font-semibold text-stone-700">Données utilisées : </span>
                      {source.data}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Méthodologie */}
      <div className="mt-10 bg-stone-50 rounded-xl border border-stone-200 p-6">
        <h2 className="font-bold text-stone-900 text-base mb-4">Méthodologie algorithmique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-600">
          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Prédiction de rendement</h3>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-amber-600">•</span>Régression linéaire multiple (OLS) entraînée sur données DAPSA/ANACIM 2015-2024</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>KNN (k=3) avec pondération inverse de la distance euclidienne</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Ensemble : moyenne pondérée OLS (60%) + KNN (40%)</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Variables : pluviométrie, température, mois de semis, zone agro-écologique</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Optimisation calendrier</h3>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-amber-600">•</span>Algorithme génétique : population 50, 80 générations, mutation gaussienne σ=0.15</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Sélection par tournoi (k=3), crossover BLX-α (α=0.5), élitisme 10%</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Fonction fitness : rendement total pondéré par le risque bayésien</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Analyse de risques</h3>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-amber-600">•</span>Réseau bayésien à 6 nœuds : sécheresse, chaleur, parasites, inondation → échec cultural</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Probabilités conditionnelles calibrées sur historique ANACIM (30 ans)</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Inférence exacte par énumération (graphe acyclique dirigé)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Limites et précautions</h3>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-amber-600">•</span>Les prédictions sont des estimations basées sur les moyennes historiques</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Elles ne remplacent pas l'expertise d'un technicien de terrain</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Les prix du marché évoluent et ne sont pas des garanties</li>
              <li className="flex gap-2"><span className="text-amber-600">•</span>Toujours consulter l'agent ANCAR de votre zone pour valider</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sigles */}
      <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-bold text-stone-900 text-base mb-4">Glossaire des sigles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {[
            ['ISRA', 'Institut Sénégalais de Recherches Agricoles'],
            ['ANACIM', 'Agence Nationale de l\'Aviation Civile et de la Météorologie'],
            ['ANCAR', 'Agence Nationale de Conseil Agricole et Rural'],
            ['CSA', 'Commissariat à la Sécurité Alimentaire'],
            ['DAPSA', 'Direction de l\'Analyse, de la Prévision et des Statistiques Agricoles'],
            ['ARM', 'Agence de Régulation des Marchés'],
            ['FAO', 'Organisation des Nations Unies pour l\'alimentation et l\'agriculture'],
            ['GIEWS', 'Système Mondial d\'Information et d\'Alerte Rapide'],
            ['CNCAS', 'Caisse Nationale de Crédit Agricole du Sénégal (maintenant La Banque Agricole)'],
            ['DER', 'Délégation à l\'Entrepreneuriat Rapide'],
            ['FONGIP', 'Fonds de Garantie des Investissements Prioritaires'],
            ['CERAAS', 'Centre d\'Étude Régional pour l\'Amélioration de l\'Adaptation à la Sécheresse'],
            ['OLS', 'Ordinary Least Squares (méthode des moindres carrés)'],
            ['KNN', 'K-Nearest Neighbors (K plus proches voisins)'],
            ['BBN', 'Bayesian Belief Network (réseau bayésien)'],
            ['GA', 'Genetic Algorithm (algorithme génétique)'],
            ['FCFA', 'Franc de la Communauté Financière Africaine'],
            ['ETP', 'Évapotranspiration Potentielle'],
          ].map(([abbr, full]) => (
            <div key={abbr} className="flex gap-2 py-1.5 border-b border-stone-50">
              <span className="font-bold text-amber-800 w-14 flex-shrink-0">{abbr}</span>
              <span className="text-stone-600 text-xs leading-relaxed">{full}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sources
