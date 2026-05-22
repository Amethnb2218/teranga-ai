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

      {/* Algorithmes — section de crédibilité technique */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Approche scientifique</p>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                4 algorithmes ML implémentés from scratch
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Aucune dépendance à TensorFlow ou scikit-learn. Chaque algorithme est codé à la main avec une compréhension mathématique complète — optimisé pour les contraintes du Sahel.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-stone-600">OLS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">Régression linéaire multiple</p>
                    <p className="text-xs text-stone-500">Prédiction du rendement — R² = 0.82 à 0.91</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-stone-600">GA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">Algorithme génétique</p>
                    <p className="text-xs text-stone-500">Optimisation du calendrier cultural multi-parcelles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-stone-600">BBN</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">Réseau bayésien</p>
                    <p className="text-xs text-stone-500">Évaluation probabiliste multi-facteurs des risques</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-stone-600">KNN</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">K plus proches voisins</p>
                    <p className="text-xs text-stone-500">Pattern matching sur 10 ans de données historiques</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80"
                alt="Agriculteurs dans un champ d'arachide"
                className="rounded-xl w-full h-80 object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-stone-200">
                <div className="text-xs text-stone-400 mb-1">Données d'entraînement</div>
                <div className="text-lg font-bold text-stone-900">2015 — 2024</div>
                <div className="text-xs text-stone-500">ISRA / ANACIM / FAO</div>
              </div>
            </div>
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
