import WeatherCard from './WeatherCard'
import ProvenanceNotice from '../common/ProvenanceNotice'

function WeatherSection({ weather, city, provenance }) {
  if (!weather) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-stone-900 text-sm">Prévisions 7 jours</h3>
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
            Zone {weather.zone}
          </span>
        </div>
        <span className="text-xs text-stone-400">{weather.current_season === 'hivernage' ? 'Saison des pluies' : 'Saison sèche'}</span>
      </div>

      <ProvenanceNotice
        provenance={provenance}
        scope="weather"
        title="Origine météo"
        fallback={weather.provenance || {
          type: weather.source === 'openweathermap' ? 'live' : 'simulated',
          availability: weather.forecast?.length ? 'available' : 'unavailable',
          source: weather.source === 'openweathermap' ? 'OpenWeatherMap' : 'Modèle saisonnier interne',
          source_url: weather.source === 'openweathermap' ? 'https://openweathermap.org/' : null,
          note: weather.source === 'openweathermap'
            ? 'Prévisions reçues de l’API ; elles restent susceptibles d’évoluer.'
            : 'Prévisions synthétiques produites à partir de moyennes mensuelles et de variations déterministes. Elles ne constituent pas des observations météo.'
        }}
        className="mb-4"
      />

      {weather.agricultural_advice && (
        <div className="bg-leaf-50 border border-leaf-200 rounded-lg p-4 mb-4">
          <p className="font-medium text-leaf-800 text-sm mb-2">{weather.agricultural_advice.status}</p>
          <ul className="space-y-1.5">
            {weather.agricultural_advice.advice.map((a, i) => (
              <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                <span className="text-leaf-500 mt-0.5">—</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {weather.forecast?.map((day, i) => (
          <WeatherCard key={i} day={day} isToday={i === 0} />
        ))}
      </div>
    </section>
  );
}

export default WeatherSection
