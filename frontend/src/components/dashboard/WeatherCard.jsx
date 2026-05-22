function getWeatherIcon(condition) {
  switch (condition) {
    case 'rain': return '🌧'
    case 'cloudy': return '☁'
    default: return '☀'
  }
}

function WeatherCard({ day, isToday }) {
  return (
    <div className={`text-center p-3 rounded-lg ${isToday ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-stone-100'}`}>
      <div className="text-xs text-stone-500 capitalize mb-1.5">
        {isToday ? 'Auj.' : day.day.slice(0, 3)}
      </div>
      <div className="text-xl mb-1">{getWeatherIcon(day.condition)}</div>
      <div className="text-sm font-semibold text-stone-800">{day.temp_max}°</div>
      <div className="text-xs text-stone-400">{day.temp_min}°</div>
      {day.rain_probability > 30 && (
        <div className="text-xs text-blue-600 mt-1">{day.rain_probability}%</div>
      )}
    </div>
  );
}

export default WeatherCard
