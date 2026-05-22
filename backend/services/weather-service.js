const { SENEGAL_CITIES, MONTH_DATA } = require('../config/constants');

function generateForecast(city, zone) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const baseData = MONTH_DATA[month];

  const zoneMultiplier = zone === 'casamançaise' ? 1.5 : zone === 'soudanienne' ? 1.2 : 1;

  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);

    const variation = (Math.random() - 0.5) * 4;
    forecast.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      temp_min: Math.round(baseData.temp_min + variation),
      temp_max: Math.round(baseData.temp_max + variation),
      humidity: Math.round(baseData.humidity + (Math.random() - 0.5) * 10),
      rain_probability: Math.min(95, Math.round(baseData.rain_mm > 0 ? 40 + Math.random() * 40 : Math.random() * 15)),
      rain_mm: Math.round(baseData.rain_mm / 30 * zoneMultiplier * (0.5 + Math.random())),
      condition: baseData.rain_mm > 50 ? (Math.random() > 0.4 ? 'rain' : 'cloudy') : (Math.random() > 0.8 ? 'cloudy' : 'sunny')
    });
  }

  return forecast;
}

function getSeasonalAdvice(season, zone) {
  if (season === 'hivernage') {
    return {
      status: '🌧️ Saison des pluies (Hivernage)',
      advice: [
        'Période idéale pour les semis de mil, arachide, maïs et niébé',
        'Surveillez le drainage de vos parcelles pour éviter l\'engorgement',
        'Préparez vos stocks de semences certifiées',
        'Appliquez les engrais de fond avant les premières pluies'
      ]
    };
  }
  return {
    status: '☀️ Saison sèche',
    advice: [
      'Concentrez-vous sur les cultures maraîchères irriguées (tomate, oignon, chou)',
      'Préparez vos parcelles pour la prochaine saison des pluies',
      'Entretenez vos systèmes d\'irrigation',
      'Stockez et conservez vos récoltes dans des conditions appropriées'
    ]
  };
}

function getCityWeather(cityKey) {
  const cityData = SENEGAL_CITIES[cityKey];
  if (!cityData) return null;

  const month = new Date().getMonth() + 1;
  const forecast = generateForecast(cityKey, cityData.zone);

  return {
    city: cityKey,
    zone: cityData.zone,
    coordinates: { lat: cityData.lat, lon: cityData.lon },
    current_season: MONTH_DATA[month].season,
    forecast,
    agricultural_advice: getSeasonalAdvice(MONTH_DATA[month].season, cityData.zone)
  };
}

function getAvailableCities() {
  return Object.keys(SENEGAL_CITIES);
}

module.exports = { getCityWeather, getAvailableCities };
