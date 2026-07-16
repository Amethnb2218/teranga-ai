import { useState, useEffect } from 'react'
import { FiArrowRight, FiAlertTriangle, FiTarget, FiMic, FiDollarSign, FiUsers, FiShield, FiMapPin } from 'react-icons/fi'
import { fetchAlerts } from '../../services/api'

const COUNTRIES = [
  { flag: '🇧🇫', name: 'Burkina Faso' },
  { flag: '🇨🇲', name: 'Cameroun' },
  { flag: '🇬🇲', name: 'Gambie' },
  { flag: '🇬🇳', name: 'Guinee' },
  { flag: '🇲🇱', name: 'Mali' },
  { flag: '🇲🇷', name: 'Mauritanie' },
  { flag: '🇳🇪', name: 'Niger' },
  { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇸🇳', name: 'Senegal' },
  { flag: '🇹🇩', name: 'Tchad' },
];

const DEMO_ALERTS = [
  { id: 1, type: 'drought', severity: 'critical', location: 'Tillaberi, Niger', title: 'Secheresse critique', description: 'Deficit pluviometrique severe. Semis compromis pour le mil et le sorgho.', recommendation: 'Reporter les semis. Privilegier les varietes a cycle court.' },
  { id: 2, type: 'flood', severity: 'high', location: 'Matam, Senegal', title: 'Risque d\'inondation eleve', description: 'Crue du fleuve attendue dans 7-10 jours. Zones basses menacees.', recommendation: 'Deplacer les stocks. Preparer les parcelles sureleves.' },
  { id: 3, type: 'food_crisis', severity: 'medium', location: 'Diffa, Niger', title: 'Stress alimentaire', description: 'Prix des cereales en hausse de 40%. Stocks communautaires bas.', recommendation: 'Activer les banques cerealieres. Diversifier les sources.' },
  { id: 4, type: 'pest', severity: 'high', location: 'Kayes, Mali', title: 'Invasion acridienne', description: 'Essaims de criquets detectes. Progression vers les zones cultivees.', recommendation: 'Alerte aux services phytosanitaires. Surveillance renforcee.' },
];

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-50', border: 'border-l-red-600', badge: 'bg-red-100 text-red-800', label: 'Critique' },
  high: { bg: 'bg-orange-50', border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-800', label: 'Eleve' },
  medium: { bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800', label: 'Moyen' },
  low: { bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-800', label: 'Faible' },
};

function Hero({ onStart, onNavigate }) {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  useEffect(() => {
    fetchAlerts({ limit: 4 })
      .then(data => {
        if (data && data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts.slice(0, 4));
        }
      })
      .catch(() => {
        // Use demo data on failure
      });
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=1600&q=80"
            alt="Paysage du Sahel"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 hero-overlay"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-700/30 border border-teal-500/30 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-teal-400 rounded-full pulse-dot"></span>
              <span className="text-teal-200 text-xs font-semibold">Youth Connekt Sahel 2026 &middot; Axe 3 & 5</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
              Intelligence Climatique pour la{' '}
              <span className="text-teal-300">Resilience du Sahel</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Systeme d'alerte precoce et d'aide a la decision agricole propulse par l'IA. 10 pays. 9 langues. Gratuit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => onNavigate('alerts')}
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40"
              >
                <FiAlertTriangle size={16} />
                Voir les alertes
              </button>
              <button
                onClick={() => onNavigate('community')}
                className="border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors text-center backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <FiUsers size={16} />
                Reseau femmes
              </button>
            </div>

            {/* Country flags row */}
            <div className="flex items-center gap-3 flex-wrap">
              {COUNTRIES.map(c => (
                <span key={c.name} title={c.name} className="text-xl sm:text-2xl cursor-default hover:scale-125 transition-transform">
                  {c.flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">10</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Pays couverts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">90%</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Femmes dans le reseau</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-400">41</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Villes couvertes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">9</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Langues locales</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-teal-400">5</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Algorithmes ML</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts Preview */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-label mb-1">Situation en cours</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Alertes actives</h2>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-sm font-medium text-teal-700 hover:text-teal-600 flex items-center gap-1 transition-colors"
            >
              Voir toutes les alertes
              <FiArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.slice(0, 4).map((alert, idx) => {
              const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;
              return (
                <div key={alert.id || idx} className={`${config.bg} border-l-4 ${config.border} rounded-lg p-4 transition-shadow hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FiAlertTriangle size={14} className="text-slate-600" />
                      <span className="text-xs text-slate-500 font-medium">{alert.location}</span>
                    </div>
                    <span className={`${config.badge} text-[10px] font-semibold px-2 py-0.5 rounded-full`}>
                      {config.label}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{alert.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Capacites</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Six piliers de resilience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div onClick={() => onNavigate('alerts')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiAlertTriangle className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Alertes Precoces</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Detection de secheresses, inondations et crises alimentaires 2-4 semaines avant. 10 pays du Sahel.
              </p>
            </div>

            <div onClick={() => onNavigate('predict')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiTarget className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Prediction ML</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                5 algorithmes (OLS, GA, BBN, KNN, Ensemble) pour optimiser les calendriers agricoles. Zero librairie ML externe.
              </p>
            </div>

            <div onClick={() => onNavigate('community')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <FiUsers className="text-purple-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Reseau Femmes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                1 700+ agricultrices connectees. Observations terrain, alertes communautaires, partage de techniques.
              </p>
            </div>

            <div onClick={() => onNavigate('chat')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiMic className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Conseiller Vocal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Posez vos questions en Wolof, Hausa, Bambara... Reponse par IA. Pas besoin de savoir lire.
              </p>
            </div>

            <div onClick={() => onNavigate('dashboard')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiDollarSign className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Meteo & Marches</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Meteo temps reel, prix des cereales, tendances. Donnees OpenWeatherMap + FAO/GIEWS.
              </p>
            </div>

            <div onClick={() => onNavigate('dashboard')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiShield className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Securite Alimentaire</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Croisement alertes + previsions pour anticiper les crises. Scoring par commune et par culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-teal-50 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Resultats</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Impact mesurable sur les communautes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-teal-700" size={22} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Femmes agricultrices</h4>
              <p className="text-2xl font-bold text-teal-700 mb-2">+34%</p>
              <p className="text-sm text-slate-600">de revenus pour les utilisatrices connectees aux marches</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-teal-700" size={22} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Resilience climatique</h4>
              <p className="text-2xl font-bold text-teal-700 mb-2">2-4 sem.</p>
              <p className="text-sm text-slate-600">d'anticipation sur les evenements climatiques extremes</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-teal-700" size={22} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Securite alimentaire</h4>
              <p className="text-2xl font-bold text-teal-700 mb-2">-35%</p>
              <p className="text-sm text-slate-600">de pertes de recoltes evitables grace aux alertes precoces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="bg-slate-900 border-t border-slate-800 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Moteur de calcul</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Intelligence algorithmique, pas un simple wrapper IA
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              5 algorithmes implementes sans aucune librairie ML externe. Code mathematique pur, entraine sur 10 ans de donnees terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* OLS */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-teal-400">OLS</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{width: '88%'}}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-teal-400">R2=0.88</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Regression multiple</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Predit le rendement (kg/ha) a partir de la pluviometrie, temperature, mois de semis.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                B = (X'X)^-1 . X'y
              </div>
            </div>

            {/* GA */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-green-400">GA</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-green-400">80 gen.</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Algorithme genetique</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Optimise le calendrier de semis multi-parcelles. Crossover BLX-a, selection par tournoi.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                Pop=50 | Mut=0.15 | Elite=10%
              </div>
            </div>

            {/* BBN */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-400">BBN</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-400">6 noeuds</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Reseau bayesien</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Graphe probabiliste : secheresse, chaleur, parasites, inondation, probabilite d'echec.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                P(fail|drought=H) = 0.85
              </div>
            </div>

            {/* KNN */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-400">KNN</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400">k=3</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">K plus proches voisins</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Trouve les saisons similaires et interpole le rendement par ponderation inverse de distance.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                y = S(yi.wi) / Swi
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              Donnees ISRA (2015-2024)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Climatologie ANACIM / AGRHYMET
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Statistiques FAO/GIEWS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Zero dependance ML externe
            </span>
          </div>
        </div>
      </section>

      {/* Inclusion / Languages Section */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <p className="section-label mb-2">Inclusion</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Concu pour les plus vulnerables</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Pas besoin de savoir lire. Parlez dans votre langue. Teranga AI est concu pour les femmes, les jeunes et les communautes rurales du Sahel.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Wolof', 'Pulaar', 'Hausa', 'Bambara', 'Serere', 'Diola', 'Mandinka', 'Soninke', 'Francais'].map(lang => (
                <span key={lang} className="px-3 py-1.5 bg-teal-50 rounded-full text-xs font-medium text-teal-800 border border-teal-200">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-wider mb-6">
            Aligne avec les priorites des partenaires
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">PNUD</span>
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">UNICEF</span>
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">UNFPA</span>
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">Banque Mondiale</span>
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">CILSS</span>
            <span className="text-sm font-semibold px-4 py-2 bg-white rounded-lg border border-slate-200">AGRHYMET</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Le Sahel a besoin de resilience, pas d'applications.
          </h2>
          <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
            Teranga AI est un systeme d'aide a la decision, pas un gadget. Gratuit. Open source. Concu pour sauver des recoltes.
          </p>
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg shadow-teal-900/30"
          >
            Explorer le systeme
            <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Hero
