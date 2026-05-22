import { FiArrowRight, FiMapPin, FiSun, FiDollarSign, FiMessageCircle } from 'react-icons/fi'

function Hero({ onStart }) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/70"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-amber-400 text-sm font-medium mb-4 tracking-wide uppercase">Pour les agriculteurs d'Afrique de l'Ouest</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Des décisions agricoles éclairées, chaque jour.
            </h1>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Accédez à des conseils agronomiques personnalisés, la météo de votre zone et les prix du marché — tout en un, en Français et en Wolof.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                Parler à l'assistant
                <FiArrowRight size={16} />
              </button>
              <a href="#how" className="border border-stone-500 text-stone-300 hover:text-white hover:border-stone-400 font-medium px-6 py-3 rounded-lg transition-colors text-center">
                Comment ça marche
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="section-label mb-3">Le problème</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
              Les petits exploitants prennent des décisions sans information fiable
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Au Sénégal, 70% de la population vit de l'agriculture. Pourtant, les agriculteurs n'ont pas accès aux conseils personnalisés, aux alertes météo contextualisées, ni aux prix du marché en temps réel. Résultat : mauvaises décisions de plantation, pertes de récoltes, vulnérabilité économique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-amber-700 mb-1">519 000</div>
              <p className="text-sm text-stone-500">personnes en insécurité alimentaire (FAO 2024)</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-amber-700 mb-1">+20%</div>
              <p className="text-sm text-stone-500">hausse du prix du riz importé en 1 an</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-amber-700 mb-1">3.8 M t</div>
              <p className="text-sm text-stone-500">production céréalière 2024 (+8% vs moyenne)</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-soil-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="section-label mb-3 text-center">Notre solution</p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-12 text-center">
            Trois outils essentiels, une seule plateforme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-stone-200 hover:border-stone-300 transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FiMessageCircle className="text-amber-700" size={18} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Conseiller IA agricole</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Posez vos questions en français ou wolof. L'IA connaît les variétés ISRA, le calendrier cultural sénégalais et les techniques locales.
              </p>
              <p className="text-xs text-stone-400 italic">"Quand semer l'arachide à Kaolack ?"</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-stone-200 hover:border-stone-300 transition-colors">
              <div className="w-10 h-10 bg-leaf-100 rounded-lg flex items-center justify-center mb-4">
                <FiSun className="text-leaf-700" size={18} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Météo & alertes agricoles</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Prévisions 7 jours pour 10 villes, avec des conseils adaptés à la saison : quand irriguer, quand traiter, quand récolter.
              </p>
              <p className="text-xs text-stone-400 italic">Zone sahélienne, soudanienne ou casamançaise</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-stone-200 hover:border-stone-300 transition-colors">
              <div className="w-10 h-10 bg-harvest-100 rounded-lg flex items-center justify-center mb-4">
                <FiDollarSign className="text-harvest-700" size={18} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Prix des marchés</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Suivez 20+ produits sur 10 marchés. Alertes quand vendre ou stocker, basées sur les tendances des prix en FCFA.
              </p>
              <p className="text-xs text-stone-400 italic">Sources : FAO, CSA, ARM Sénégal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Fiabilité des données</p>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                Basé sur les recherches de l'ISRA et les données du terrain
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Nos conseils s'appuient sur les variétés certifiées par l'Institut Sénégalais de Recherches Agricoles, les données climatiques de l'ANACIM et les relevés de prix du Commissariat à la Sécurité Alimentaire.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-stone-700">
                  <span className="w-5 h-5 bg-leaf-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-leaf-600 rounded-full"></span>
                  </span>
                  Variétés ISRA : Souna 3, Thialack 2, Fleur 11, 55-437, Xina
                </li>
                <li className="flex items-start gap-3 text-sm text-stone-700">
                  <span className="w-5 h-5 bg-leaf-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-leaf-600 rounded-full"></span>
                  </span>
                  Données météo calibrées sur les 3 zones climatiques du Sénégal
                </li>
                <li className="flex items-start gap-3 text-sm text-stone-700">
                  <span className="w-5 h-5 bg-leaf-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-leaf-600 rounded-full"></span>
                  </span>
                  Prix 2025-2026 actualisés (campagne en cours)
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80"
                alt="Agriculteur dans un champ au Sénégal"
                className="rounded-xl w-full h-72 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-stone-700 flex items-center gap-1.5">
                <FiMapPin size={12} className="text-amber-700" />
                Bassin arachidier, Sénégal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Prêt à améliorer vos rendements ?
          </h2>
          <p className="text-stone-400 mb-6 text-sm">Gratuit, sans inscription, en Français et en Wolof.</p>
          <button onClick={onStart} className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
            Commencer maintenant
            <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Hero

