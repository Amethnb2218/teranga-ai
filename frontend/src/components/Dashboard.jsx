import { useState, useEffect } from 'react'
import { FiCloud, FiDroplet, FiSun, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

const CITIES = ['dakar', 'thies', 'kaolack', 'saint_louis', 'tambacounda', 'ziguinchor', 'kolda', 'fatick', 'louga', 'matam']

function Dashboard() {
  const [city, setCity] = useState('dakar')
  const [weather, setWeather] = useState(null)
  const [market, setMarket] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [city])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [weatherRes, marketRes, trendsRes] = await Promise.all([
        fetch(`/api/weather/${city}`),
        fetch(`/api/market?city=${city}`),
        fetch('/api/market/trends')
      ])
      setWeather(await weatherRes.json())
      setMarket(await marketRes.json())
      setTrends(await trendsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'rain': return '🌧️'
      case 'cloudy': return '☁️'
      default: return '☀️'
    }
  }

  const getTrendIcon = (trend) => {
    if (trend === 'hausse') return <FiTrendingUp className="text-red-500" />
    if (trend === 'baisse') return <FiTrendingDown className="text-green-600" />
    return <FiMinus className="text-gray-400" />
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-gray-500">Chargement des données...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600 text-sm mt-1">Météo et prix du marché en temps réel</p>
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {CITIES.map(c => (
            <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {weather && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiCloud className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Prévisions météo - {city.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">Zone {weather.zone}</span>
          </div>

          {weather.agricultural_advice && (
            <div className="card bg-gradient-to-r from-primary-50 to-green-50 border-primary-100 mb-4">
              <p className="font-medium text-primary-800 mb-2">{weather.agricultural_advice.status}</p>
              <ul className="space-y-1">
                {weather.agricultural_advice.advice.map((a, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weather.forecast?.map((day, i) => (
              <div key={i} className="card text-center p-4">
                <div className="text-xs text-gray-500 capitalize mb-2">{day.day}</div>
                <div className="text-2xl mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-sm font-semibold text-gray-900">{day.temp_max}°</div>
                <div className="text-xs text-gray-500">{day.temp_min}°</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <FiDroplet size={10} className="text-blue-400" />
                  <span className="text-xs text-gray-600">{day.rain_probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {market && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Prix du marché (FCFA)</h3>
            <span className="text-xs text-gray-500">Mis à jour : {market.last_updated}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(market.data).map(([category, products]) => (
              products.length > 0 && (
                <div key={category} className="card">
                  <h4 className="font-medium text-gray-900 capitalize mb-3 pb-2 border-b border-gray-100">
                    {category === 'cereales' ? '🌾 Céréales' :
                     category === 'legumineuses' ? '🫘 Légumineuses' :
                     category === 'maraichage' ? '🥬 Maraîchage' :
                     '🍎 Fruits'}
                  </h4>
                  <div className="space-y-2">
                    {products.map((product, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{product.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{product.price_local} F/{product.unit}</span>
                          {getTrendIcon(product.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {trends && trends.trends.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Alertes et tendances</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trends.trends.map((trend, i) => (
              <div key={i} className={`card p-4 border-l-4 ${trend.trend === 'hausse' ? 'border-l-orange-400 bg-orange-50/50' : 'border-l-blue-400 bg-blue-50/50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getTrendIcon(trend.trend)}
                  <span className="font-medium text-sm text-gray-900">{trend.product}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${trend.trend === 'hausse' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {trend.trend === 'hausse' ? '↑ Hausse' : '↓ Baisse'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{trend.advice}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard
