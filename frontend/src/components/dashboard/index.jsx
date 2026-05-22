import { useDashboard } from '../../hooks/useDashboard'
import CitySelector from './CitySelector'
import WeatherSection from './WeatherSection'
import MarketSection from './MarketSection'
import TrendsSection from './TrendsSection'

function Dashboard() {
  const { city, setCity, weather, market, trends, loading } = useDashboard();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600 text-sm mt-1">Météo et prix du marché en temps réel</p>
        </div>
        <CitySelector city={city} onChange={setCity} />
      </div>

      <WeatherSection weather={weather} city={city} />
      <MarketSection market={market} />
      <TrendsSection trends={trends} />
    </div>
  );
}

export default Dashboard
