import { FiCloud } from 'react-icons/fi'
import WeatherCard from './WeatherCard'

function WeatherSection({ weather, city }) {
  if (!weather) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FiCloud className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">
          Prévisions météo - {city.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
          Zone {weather.zone}
        </span>
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
          <WeatherCard key={i} day={day} />
        ))}
      </div>
    </section>
  );
}

export default WeatherSection
