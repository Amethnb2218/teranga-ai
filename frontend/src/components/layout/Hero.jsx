import { useState, useEffect } from 'react'
import { FiArrowRight, FiAlertTriangle, FiTarget, FiMic, FiDollarSign, FiUsers, FiShield, FiMapPin } from 'react-icons/fi'
import { fetchAlerts } from '../../services/api'

const COUNTRIES = [
  { flag: '\u{1F1E7}\u{1F1EB}', name: 'Burkina Faso' },
  { flag: '\u{1F1E8}\u{1F1F2}', name: 'Cameroun' },
  { flag: '\u{1F1EC}\u{1F1F2}', name: 'Gambie' },
  { flag: '\u{1F1EC}\u{1F1F3}', name: 'Guinée' },
  { flag: '\u{1F1F2}\u{1F1F1}', name: 'Mali' },
  { flag: '\u{1F1F2}\u{1F1F7}', name: 'Mauritanie' },
  { flag: '\u{1F1F3}\u{1F1EA}', name: 'Niger' },
  { flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigéria' },
  { flag: '\u{1F1F8}\u{1F1F3}', name: 'Sénégal' },
  { flag: '\u{1F1F9}\u{1F1E9}', name: 'Tchad' },
];

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-50', border: 'border-l-red-600', badge: 'bg-red-100 text-red-800', label: 'Critique' },
  high: { bg: 'bg-orange-50', border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-800', label: 'Élevé' },
  medium: { bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800', label: 'Moyen' },
  low: { bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-800', label: 'Faible' },
};

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1768775517205-7f4bc1b3f771?w=1600&q=80', alt: 'Agriculteur labourant un champ au Sahel' },
  { src: 'https://images.unsplash.com/photo-1703604787785-e9ed9639ea6c?w=1600&q=80', alt: 'Champ de cultures au Sénégal' },
  { src: 'https://images.unsplash.com/photo-1652002112237-bf53040554cc?w=1600&q=80', alt: 'Travailleurs agricoles au Sénégal' },
  { src: 'https://images.unsplash.com/photo-1651999739984-0dc2a15dcd66?w=1600&q=80', alt: 'Paysage sahélien avec arbre et champ' },
];

function Hero({ onStart, onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [alertsNotice, setAlertsNotice] = useState('Chargement des scénarios indicatifs…');
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchAlerts({ limit: 4 })
      .then(data => {
        setAlerts(Array.isArray(data?.alerts) ? data.alerts.slice(0, 4) : []);
        setAlertsNotice(data?.notice || 'Scénarios indicatifs calculés localement, non alertes institutionnelles.');
      })
      .catch(() => {
        setAlerts([]);
        setAlertsNotice('Scénarios indisponibles. Consultez les services officiels locaux.');
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % HERO_IMAGES.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          {HERO_IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImage ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 hero-overlay"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-700/30 border border-teal-500/30 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-teal-400 rounded-full pulse-dot"></span>
              <span className="text-teal-200 text-xs font-semibold">Youth Connekt Sahel 2026 &middot; Axe 3 & 5</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
              Intelligence Climatique pour la{' '}
              <span className="text-teal-300">R&eacute;silience du Sahel</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Syst&egrave;me d&rsquo;alerte pr&eacute;coce et d&rsquo;aide &agrave; la d&eacute;cision agricole propuls&eacute; par l&rsquo;IA. Tout le Sahel. 15 langues. Gratuit.
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
                R&eacute;seau communautaire
              </button>
            </div>

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
              <div className="text-2xl md:text-3xl font-bold text-purple-400">Estimation</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Scénarios à confirmer</p>
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
              <p className="section-label mb-1">Indications locales</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Scénarios de vigilance</h2>
              <p className="text-xs text-slate-500 mt-1">{alertsNotice}</p>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-sm font-medium text-teal-700 hover:text-teal-600 flex items-center gap-1 transition-colors"
            >
              Voir toutes les alertes
              <FiArrowRight size={14} />
            </button>
          </div>

          {alerts.length > 0 ? (
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
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Aucun scénario disponible. Pour une alerte opérationnelle, consultez les autorités météo et de protection civile.
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Capacit&eacute;s</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Six piliers de r&eacute;silience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div onClick={() => onNavigate('alerts')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiAlertTriangle className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Alertes Pr&eacute;coces</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scénarios indicatifs de sécheresse, fortes pluies et stress thermique issus d’une climatologie locale. À confirmer auprès des services officiels.
              </p>
            </div>

            <div onClick={() => onNavigate('predict')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiTarget className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Pr&eacute;diction ML</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                5 algorithmes (OLS, GA, BBN, KNN, Ensemble) pour optimiser les calendriers agricoles. Z&eacute;ro librairie ML externe.
              </p>
            </div>

            <div onClick={() => onNavigate('community')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <FiUsers className="text-purple-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">R&eacute;seau Femmes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Réseau communautaire en développement. Observations terrain, partage de techniques et entraide locale.
              </p>
            </div>

            <div onClick={() => onNavigate('chat')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiMic className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Conseiller Vocal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Posez vos questions en Wolof, Hausa, Bambara... R&eacute;ponse par IA. Pas besoin de savoir lire.
              </p>
            </div>

            <div onClick={() => onNavigate('dashboard')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiDollarSign className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">M&eacute;t&eacute;o & March&eacute;s</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Météo OpenWeatherMap lorsqu’elle est disponible, climatologie locale estimée et prix de marché simulés clairement signalés.
              </p>
            </div>

            <div onClick={() => onNavigate('dashboard')} className="bg-slate-50 rounded-xl border border-slate-200 p-6 group hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <FiShield className="text-teal-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">S&eacute;curit&eacute; Alimentaire</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Croisement alertes + pr&eacute;visions pour anticiper les crises. Scoring par commune et par culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Validation goals */}
      <section className="bg-teal-50 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Objectifs de validation</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Impacts à mesurer avec les communautés
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <FiUsers className="text-teal-700 mx-auto mb-4" size={24} />
              <h4 className="font-bold text-slate-900 mb-2">Accès au marché</h4>
              <p className="text-sm text-slate-600">Mesurer l’évolution des revenus avant toute revendication d’impact.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <FiShield className="text-teal-700 mx-auto mb-4" size={24} />
              <h4 className="font-bold text-slate-900 mb-2">Décision climatique</h4>
              <p className="text-sm text-slate-600">Comparer les scénarios locaux aux bulletins officiels et aux observations terrain.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-teal-100 text-center">
              <FiMapPin className="text-teal-700 mx-auto mb-4" size={24} />
              <h4 className="font-bold text-slate-900 mb-2">Pertes agricoles</h4>
              <p className="text-sm text-slate-600">Évaluer les pertes évitées par essais pilotes, sans chiffre non vérifié.</p>
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
              5 algorithmes impl&eacute;ment&eacute;s sans librairie ML externe. Corpus exp&eacute;rimental embarqu&eacute; : 265 lignes 2015-2024 utilis&eacute;es, aucune encore revendiqu&eacute;e comme v&eacute;rifi&eacute;e.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span className="text-xs font-mono text-teal-400">R&sup2;=0.88</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">R&eacute;gression multiple</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Pr&eacute;dit le rendement (kg/ha) &agrave; partir de la pluviom&eacute;trie, temp&eacute;rature, mois de semis.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                B = (X&rsquo;X)&sup2;&sup1; &middot; X&rsquo;y
              </div>
            </div>

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
                <span className="text-xs font-mono text-green-400">80 g&eacute;n.</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Algorithme g&eacute;n&eacute;tique</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Optimise le calendrier de semis multi-parcelles. Crossover BLX-&alpha;, s&eacute;lection par tournoi.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                Pop=50 | Mut=0.15 | Elite=10%
              </div>
            </div>

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
                <span className="text-xs font-mono text-blue-400">6 n&oelig;uds</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">R&eacute;seau bay&eacute;sien</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Graphe probabiliste : s&eacute;cheresse, chaleur, parasites, inondation, probabilit&eacute; d&rsquo;&eacute;chec.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                P(fail|drought=H) = 0.85
              </div>
            </div>

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
              <p className="text-slate-400 text-xs leading-relaxed">Trouve les saisons similaires et interpole le rendement par pond&eacute;ration inverse de distance.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                y = &Sigma;(yi&middot;wi) / &Sigma;wi
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Corpus exp&eacute;rimental non v&eacute;rifi&eacute;
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              265 lignes d&rsquo;entra&icirc;nement (2015-2024)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              39 lignes 2025-2026 en quarantaine
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Z&eacute;ro d&eacute;pendance ML externe
            </span>
          </div>
        </div>
      </section>

      {/* Inclusion / Languages Section */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1611258900587-7ec9262dac1c?w=800&q=80"
                alt="Femme dans un champ au S&eacute;n&eacute;gal"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="section-label mb-2">Inclusion</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Con&ccedil;u pour les plus vuln&eacute;rables</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Pas besoin de savoir lire. Parlez dans votre langue. Teranga AI est con&ccedil;u pour les femmes, les jeunes et les communaut&eacute;s rurales du Sahel.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Wolof', 'Pulaar', 'Hausa', 'Bambara', 'Sérère', 'Diola', 'Mandinka', 'Soninké', 'Français'].map(lang => (
                  <span key={lang} className="px-3 py-1.5 bg-teal-50 rounded-full text-xs font-medium text-teal-800 border border-teal-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-wider mb-6">
            Align&eacute; avec les priorit&eacute;s des partenaires
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
            Le Sahel a besoin de r&eacute;silience, pas d&rsquo;applications.
          </h2>
          <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
            Teranga AI est un syst&egrave;me d&rsquo;aide &agrave; la d&eacute;cision, pas un gadget. Gratuit. Open source. Con&ccedil;u pour sauver des r&eacute;coltes.
          </p>
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg shadow-teal-900/30"
          >
            Explorer le syst&egrave;me
            <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Hero
