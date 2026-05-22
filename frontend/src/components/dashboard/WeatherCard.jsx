import { FiDroplet } from 'react-icons/fi'

function getWeatherIcon(condition) {
  switch (condition) {
    case 'rain': return '🌧️'
    case 'cloudy': return '☁️'
    default: return '☀️'
  }
}

function WeatherCard({ day }) {
  return (
    <div className="card text-center p-4">
      <div className="text-xs text-gray-500 capitalize mb-2">{day.day}</div>
      <div className="text-2xl mb-2">{getWeatherIcon(day.condition)}</div>
      <div className="text-sm font-semibold text-gray-900">{day.temp_max}°</div>
      <div className="text-xs text-gray-500">{day.temp_min}°</div>
      <div className="flex items-center justify-center gap-1 mt-2">
        <FiDroplet size={10} className="text-blue-400" />
        <span className="text-xs text-gray-600">{day.rain_probability}%</span>
      </div>
    </div>
  );
}

export default WeatherCard
