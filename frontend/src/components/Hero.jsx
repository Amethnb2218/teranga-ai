import { FiMessageCircle, FiCloud, FiTrendingUp, FiGlobe } from 'react-icons/fi'

function Hero({ onStart }) {
  const features = [
    { icon: FiMessageCircle, title: 'Conseils IA personnalisés', desc: 'Posez vos questions agricoles et recevez des réponses adaptées à votre zone et culture' },
    { icon: FiCloud, title: 'Météo locale', desc: 'Prévisions à 7 jours pour toutes les régions du Sénégal avec alertes agricoles' },
    { icon: FiTrendingUp, title: 'Prix du marché', desc: 'Suivez les prix des cultures dans les marchés locaux en temps réel' },
    { icon: FiGlobe, title: 'Multilingue', desc: 'Disponible en Français et Wolof pour une accessibilité maximale' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
          Propulsé par l'Intelligence Artificielle
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          L'assistant agricole
          <br />
          <span className="text-primary-600">intelligent</span> pour l'Afrique de l'Ouest
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Teranga AI aide les exploitants agricoles sénégalais à prendre de meilleures décisions
          grâce à l'IA, la météo en temps réel et les données du marché.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onStart} className="btn-primary text-lg px-8 py-4">
            Commencer maintenant
          </button>
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            En savoir plus ↓
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="features">
        {features.map((feature, i) => (
          <div key={i} className="card hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
              <feature.icon className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 card bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">14 M+</div>
            <div className="text-primary-100 text-sm mt-1">Agriculteurs au Sénégal</div>
          </div>
          <div>
            <div className="text-3xl font-bold">70%</div>
            <div className="text-primary-100 text-sm mt-1">Population dépendant de l'agriculture</div>
          </div>
          <div>
            <div className="text-3xl font-bold">10+</div>
            <div className="text-primary-100 text-sm mt-1">Régions couvertes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
