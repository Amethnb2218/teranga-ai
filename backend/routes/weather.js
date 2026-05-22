const express = require('express');
const router = express.Router();

const SENEGAL_CITIES = {
  dakar: { lat: 14.7167, lon: -17.4677, zone: 'sahélienne' },
  thies: { lat: 14.7886, lon: -16.9260, zone: 'sahélienne' },
  saint_louis: { lat: 16.0326, lon: -16.4818, zone: 'sahélienne' },
  kaolack: { lat: 14.1652, lon: -16.0758, zone: 'soudanienne' },
  tambacounda: { lat: 13.7709, lon: -13.6673, zone: 'soudanienne' },
  ziguinchor: { lat: 12.5681, lon: -16.2719, zone: 'casamançaise' },
  kolda: { lat: 12.8983, lon: -14.9414, zone: 'casamançaise' },
  matam: { lat: 15.6596, lon: -13.2554, zone: 'sahélienne' },
  fatick: { lat: 14.3390, lon: -16.4111, zone: 'soudanienne' },
  louga: { lat: 15.6173, lon: -16.2240, zone: 'sahélienne' }
};

const MONTH_DATA = {
  1: { temp_min: 18, temp_max: 33, humidity: 30, rain_mm: 0, season: 'sèche' },
  2: { temp_min: 19, temp_max: 35, humidity: 25, rain_mm: 0, season: 'sèche' },
  3: { temp_min: 20, temp_max: 37, humidity: 25, rain_mm: 0, season: 'sèche' },
  4: { temp_min: 21, temp_max: 38, humidity: 30, rain_mm: 0, season: 'sèche' },
  5: { temp_min: 23, temp_max: 38, humidity: 40, rain_mm: 5, season: 'sèche' },
  6: { temp_min: 25, temp_max: 36, humidity: 55, rain_mm: 30, season: 'hivernage' },
  7: { temp_min: 25, temp_max: 34, humidity: 70, rain_mm: 100, season: 'hivernage' },
  8: { temp_min: 25, temp_max: 33, humidity: 80, rain_mm: 200, season: 'hivernage' },
  9: { temp_min: 25, temp_max: 34, humidity: 80, rain_mm: 180, season: 'hivernage' },
  10: { temp_min: 24, temp_max: 35, humidity: 65, rain_mm: 60, season: 'hivernage' },
  11: { temp_min: 22, temp_max: 35, humidity: 40, rain_mm: 5, season: 'sèche' },
  12: { temp_min: 19, temp_max: 33, humidity: 35, rain_mm: 0, season: 'sèche' }
};

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

router.get('/:city', (req, res) => {
  const cityKey = req.params.city.toLowerCase().replace(/[- ]/g, '_');
  const cityData = SENEGAL_CITIES[cityKey];

  if (!cityData) {
    return res.status(404).json({
      error: 'City not found',
      available_cities: Object.keys(SENEGAL_CITIES)
    });
  }

  const month = new Date().getMonth() + 1;
  const forecast = generateForecast(cityKey, cityData.zone);

  res.json({
    city: req.params.city,
    zone: cityData.zone,
    coordinates: { lat: cityData.lat, lon: cityData.lon },
    current_season: MONTH_DATA[month].season,
    forecast,
    agricultural_advice: getSeasonalAdvice(MONTH_DATA[month].season, cityData.zone)
  });
});

router.get('/', (req, res) => {
  res.json({ available_cities: Object.keys(SENEGAL_CITIES) });
});

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

module.exports = router;
