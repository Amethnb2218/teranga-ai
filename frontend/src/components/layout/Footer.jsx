function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white">🌾</span>
              </div>
              <span className="font-bold text-lg text-gray-900">TerangaAI</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Assistant agricole intelligent pour les exploitants d'Afrique de l'Ouest.
              Propulsé par l'IA pour démocratiser l'accès aux conseils agronomiques.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Fonctionnalités</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Conseils agricoles personnalisés par IA</li>
              <li>Prévisions météo locales</li>
              <li>Suivi des prix du marché</li>
              <li>Support multilingue (FR/Wolof)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Impact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Améliorer les rendements agricoles</li>
              <li>Réduire les pertes post-récolte</li>
              <li>Connecter les agriculteurs aux marchés</li>
              <li>Adaptation au changement climatique</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>Teranga AI &copy; 2026 — Conçu au Sénégal pour l'Afrique de l'Ouest</p>
          <p className="mt-1">AlgoFest Hackathon 2026 — Track: AI/ML & Social Impact</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
