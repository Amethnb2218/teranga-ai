import { FiArrowRight, FiMapPin, FiSun, FiDollarSign, FiMessageCircle, FiTarget, FiMic } from 'react-icons/fi'

function Hero({ onStart }) {
  return (
    <div className="relative">
      {/* Hero Section — immersive avec photo plein écran */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80"
            alt="Champs agricoles en Afrique de l'Ouest"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/60 to-stone-900/30"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L12 22M12 2C9 7 5 8 2 9C5 10 9 13 12 22M12 2C15 7 19 8 22 9C19 10 15 13 12 22"/>
                </svg>
              </div>
              <span className="text-white/80 text-sm font-medium">Teranga AI</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-[1.15]">
              Cultivez mieux.<br/>
              <span className="text-amber-400">Décidez mieux.</span>
            </h1>
            <p className="text-stone-300 text-base md:text-lg mb-8 leading-relaxed max-w-md">
              Outil d'aide à la décision agricole pour les exploitants du Sénégal. Données réelles, algorithmes de prédiction, 9 langues locales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30">
                Poser une question
                <FiArrowRight size={16} />
              </button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors text-center">
                Découvrir les outils
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <FiMic size={11} />
                Vocal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-stone-500 rounded-full"></span>
                Wolof, Pulaar, Sérère, Diola...
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-stone-500 rounded-full"></span>
                Gratuit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900">10</div>
              <p className="text-xs text-stone-500 mt-1">régions couvertes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900">6</div>
              <p className="text-xs text-stone-500 mt-1">cultures analysées</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900">4</div>
              <p className="text-xs text-stone-500 mt-1">algorithmes ML</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900">9</div>
              <p className="text-xs text-stone-500 mt-1">langues supportées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features — plus visuels avec images */}
      <section id="features" className="bg-earth-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Fonctionnalités</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              Quatre outils pour de meilleures récoltes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Outil 1 */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 group hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&q=75"
                  alt="Conseiller agricole sur le terrain"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiMessageCircle className="text-amber-700" size={15} />
                  <h3 className="font-semibold text-stone-900 text-sm">Conseiller vocal intelligent</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Parlez ou tapez en Wolof, Pulaar, Français... L'IA comprend votre contexte et répond avec des conseils ISRA adaptés à votre zone.
                </p>
              </div>
            </div>

            {/* Outil 2 */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 group hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=75"
                  alt="Champ pendant la saison des pluies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="text-amber-700" size={15} />
                  <h3 className="font-semibold text-stone-900 text-sm">Prédiction de semis (ML)</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Algorithme génétique + régression + réseau bayésien. Calcule le moment optimal pour semer selon votre culture et votre localisation.
                </p>
              </div>
            </div>

            {/* Outil 3 */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 group hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504387828636-abeb50778c0c?w=600&q=75"
                  alt="Soleil et climat sahélien"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiSun className="text-amber-700" size={15} />
                  <h3 className="font-semibold text-stone-900 text-sm">Météo & alertes agricoles</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Prévisions calibrées pour les 3 zones climatiques du Sénégal. Alertes contextualisées : irrigation, traitement, récolte.
                </p>
              </div>
            </div>

            {/* Outil 4 */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 group hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=75"
                  alt="Marché de légumes en Afrique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="text-amber-700" size={15} />
                  <h3 className="font-semibold text-stone-900 text-sm">Intelligence des marchés</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  20+ produits suivis en FCFA sur 10 marchés. Tendances, saisonnalité, et conseils achat/vente basés sur les données FAO/GIEWS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithmes — section crédibilité technique */}
      <section className="bg-stone-900 border-t border-stone-800 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Moteur de calcul</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Intelligence algorithmique, pas un simple wrapper IA
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-sm leading-relaxed">
              4 algorithmes implémentés sans aucune librairie ML externe. Code mathématique pur, entraîné sur 10 ans de données terrain ISRA et ANACIM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* OLS */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-400">OLS</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{width: '88%'}}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400">R²=0.88</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Régression multiple</h4>
              <p className="text-stone-400 text-xs leading-relaxed">Prédit le rendement (kg/ha) à partir de la pluviométrie, température, mois de semis et zone agro-écologique.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                β̂ = (XᵀX)⁻¹ · Xᵀy
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
                <span className="text-xs font-mono text-green-400">80 gén.</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Algorithme génétique</h4>
              <p className="text-stone-400 text-xs leading-relaxed">Optimise le calendrier de semis multi-parcelles. Crossover BLX-α, sélection par tournoi, mutation gaussienne.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
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
                <span className="text-xs font-mono text-blue-400">6 nœuds</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Réseau bayésien</h4>
              <p className="text-stone-400 text-xs leading-relaxed">Graphe probabiliste : sécheresse, chaleur, parasites, inondation → probabilité d'échec cultural.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
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
              <p className="text-stone-400 text-xs leading-relaxed">Trouve les saisons passées les plus similaires et interpole le rendement par pondération inverse de distance.</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-stone-500 font-mono">
                ŷ = Σ(yᵢ·wᵢ) / Σwᵢ
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Données ISRA (2015-2024)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Climatologie ANACIM
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Statistiques FAO/GIEWS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Zéro dépendance ML externe
            </span>
          </div>
        </div>
      </section>

      {/* Section accessibilité */}
      <section className="bg-amber-50 border-t border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-stone-900 mb-3">Conçu pour tous les agriculteurs</h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Pas besoin de savoir lire. Parlez dans votre langue, écoutez la réponse. Teranga AI fonctionne en Wolof, Pulaar, Sérère, Diola, Mandinka, Soninké, Français, Anglais et Arabe.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Wolof', 'Pulaar', 'Sérère', 'Diola', 'Mandinka', 'Soninké', 'Français', 'English', 'العربية'].map(lang => (
                <span key={lang} className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-stone-700 border border-amber-200">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Améliorez vos rendements dès aujourd'hui
          </h2>
          <p className="text-stone-400 mb-6 text-sm">Gratuit. Sans inscription. En votre langue.</p>
          <button onClick={onStart} className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-900/30">
            Commencer maintenant
            <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Hero
