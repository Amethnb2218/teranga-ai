import { useDashboard } from '../../hooks/useDashboard'
import CitySelector from './CitySelector'
import WeatherSection from './WeatherSection'
import MarketSection from './MarketSection'
import TrendsSection from './TrendsSection'
import NewsSection from './NewsSection'

function Dashboard() {
  const { city, setCity, weather, market, trends, news, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-stone-400 text-sm">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          Chargement des données...
        </div>
        <p className="text-xs text-stone-300 mt-3">Premier chargement : ~30s (démarrage serveur)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-stone-500 mb-3">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Marchés & Météo</h2>
          <p className="text-stone-500 text-sm mt-0.5">Données actualisées pour votre zone</p>
        </div>
        <CitySelector city={city} onChange={setCity} />
      </div>

      <WeatherSection weather={weather} city={city} />
      <MarketSection market={market} />
      <TrendsSection trends={trends} />
      <NewsSection news={news} />
    </div>
  );
}

export default Dashboard
