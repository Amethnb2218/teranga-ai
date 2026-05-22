const { SENEGAL_CITIES, MONTH_DATA } = require('../config/constants');
const { fetchRealWeather } = require('./external/weather-api');

function generateFallbackForecast(cityKey, zone) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const baseData = MONTH_DATA[month];
  const cityInfo = SENEGAL_CITIES[cityKey];
  const offset = cityInfo ? cityInfo.tempOffset : 0;
  const zoneRainMult = zone === 'casamançaise' ? 1.5 : zone === 'soudanienne' ? 1.2 : 0.8;

  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const pseudoRand = Math.sin(dayOfYear * 97 + i * 31) * 0.5 + 0.5;

    const tempMax = baseData.temp_max + offset + Math.round((pseudoRand - 0.5) * 2);
    const tempMin = baseData.temp_min + offset + Math.round((pseudoRand - 0.5) * 2);

    forecast.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      temp_min: tempMin,
      temp_max: tempMax,
      humidity: Math.round(baseData.humidity + (pseudoRand - 0.5) * 8),
      rain_probability: Math.min(95, Math.round(
        baseData.rain_mm > 0 ? 30 + pseudoRand * 50 * zoneRainMult : pseudoRand * 10
      )),
      rain_mm: Math.round(baseData.rain_mm / 30 * zoneRainMult * (0.3 + pseudoRand * 0.7)),
      condition: baseData.rain_mm > 50 ? (pseudoRand > 0.4 ? 'rain' : 'cloudy') : (pseudoRand > 0.85 ? 'cloudy' : 'sunny')
    });
  }

  return forecast;
}

function getSeasonalAdvice(season, zone) {
  const month = new Date().getMonth() + 1;

  const advice = {
    hivernage: {
      6: ['Début hivernage — semez dès la première pluie utile (≥20mm)', 'Priorité aux variétés à cycle court si semis tardif', 'Traitez les semences avant semis', 'Préparez les poquets : 5-7 graines/poquet pour le mil'],
      7: ['Période critique de semis — ne dépassez pas mi-juillet pour l\'arachide', 'Premier sarclage 15 jours après levée', 'Appliquez le NPK au moment du semis', 'Surveillez les criquets en zone sahélienne'],
      8: ['Démariage et 2ème sarclage en cours', 'Urée au tallage pour le mil (30 jours)', 'Surveillez l\'engorgement des parcelles basses', 'Risque maladies fongiques — traitez préventivement'],
      9: ['Maturation — ne plus toucher les arachides', 'Surveillez les oiseaux granivores sur le mil', 'Préparez le stockage : nettoyez greniers', 'Dernières irrigations complémentaires'],
      10: ['Début des récoltes : variétés précoces en premier', 'Séchez les récoltes à 14% humidité max', 'Récoltez l\'arachide quand feuilles jaunissent', 'Prix bas post-récolte — stockez si possible']
    },
    sèche: {
      11: ['Finissez récoltes et séchage', 'Lancez les cultures de contre-saison', 'Pépinières d\'oignon pour repiquage en décembre', 'Entretenez le matériel agricole'],
      12: ['Repiquage oignons et tomates', 'Irrigation régulière du maraîchage', 'Bon moment pour labourer', 'Prix céréales commencent à monter'],
      1: ['Pleine saison maraîchère', 'Traitements préventifs tomate et chou', 'Récolte riz contre-saison (Fleuve)', 'Attention nuits fraîches'],
      2: ['Récolte oignons fin février', 'Période de soudure approche', 'Bon moment de vente mil et riz', 'Commandez semences pour hivernage'],
      3: ['Fin récoltes maraîchères', 'Renforcez irrigation (chaleur intense)', 'Achetez engrais maintenant (pénurie en juin)', 'Début mangue — diversification'],
      4: ['Soudure — prix céréaliers au plus haut', 'Préparez parcelles pour hivernage', 'Achetez semences et intrants MAINTENANT', 'Formations pré-campagne'],
      5: ['Dernières préparations avant hivernage', 'Labourez dès les premières pluies d\'annonce', 'Vérifiez germination de vos semences', 'Subventions engrais via coopératives']
    }
  };

  const seasonAdvice = season === 'hivernage' ? advice.hivernage : advice.sèche;
  const monthAdvice = seasonAdvice[month] || seasonAdvice[Object.keys(seasonAdvice)[0]];

  return {
    status: season === 'hivernage' ? 'Saison des pluies (Hivernage)' : 'Saison sèche',
    advice: monthAdvice
  };
}

async function getCityWeather(cityKey) {
  const cityData = SENEGAL_CITIES[cityKey];
  if (!cityData) return null;

  const month = new Date().getMonth() + 1;
  const season = MONTH_DATA[month].season;

  // Tenter la météo en temps réel
  const realWeather = await fetchRealWeather(cityKey);
  if (realWeather) {
    return {
      ...realWeather,
      current_season: season,
      agricultural_advice: getSeasonalAdvice(season, cityData.zone)
    };
  }

  // Fallback calibré
  return {
    city: cityKey,
    zone: cityData.zone,
    coordinates: { lat: cityData.lat, lon: cityData.lon },
    current_season: season,
    forecast: generateFallbackForecast(cityKey, cityData.zone),
    agricultural_advice: getSeasonalAdvice(season, cityData.zone),
    source: 'model',
    last_updated: new Date().toISOString()
  };
}

function getAvailableCities() {
  return Object.keys(SENEGAL_CITIES);
}

module.exports = { getCityWeather, getAvailableCities };
