const { MARKET_DATA } = require('../../data/market-prices');

// Cache pour les prix dynamiques
let dynamicPrices = null;
let lastUpdate = 0;
const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 heures

// Simuler des variations réalistes basées sur la saisonnalité
function getSeasonalMultiplier(product, month) {
  const seasonalProducts = {
    'Tomate (locale)': { peak: [6, 7, 8, 9], multiplier: 1.6 },
    'Oignon (violet de Galmi)': { peak: [7, 8, 9, 10], multiplier: 1.8 },
    'Mangue (Kent)': { peak: [11, 12, 1, 2, 3, 4], multiplier: 2.5 },
    'Pastèque': { peak: [9, 10, 11, 12], multiplier: 1.5 },
    'Mil (souna)': { peak: [5, 6, 7], multiplier: 1.3 },
    'Arachide (coque)': { peak: [4, 5, 6], multiplier: 1.25 },
    'Pomme de terre': { peak: [5, 6, 7, 8], multiplier: 1.4 },
    'Chou pommé': { peak: [5, 6, 7, 8, 9], multiplier: 1.5 },
  };

  const info = seasonalProducts[product];
  if (!info) return 1;

  return info.peak.includes(month) ? info.multiplier : 1;
}

function getDailyVariation() {
  return 0.95 + Math.random() * 0.1; // -5% to +5% variation
}

function computeDynamicPrices() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

  // Seed pseudo-random basé sur le jour (prix stables dans la journée)
  const daySeed = dayOfYear * 137;

  const result = {};

  for (const [category, products] of Object.entries(MARKET_DATA)) {
    result[category] = products.map(product => {
      const seasonalMult = getSeasonalMultiplier(product.name, month);
      const updatedPrices = {};

      for (const [city, basePrice] of Object.entries(product.prices)) {
        const cityHash = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const pseudoRandom = Math.sin(daySeed + cityHash) * 0.5 + 0.5;
        const dailyVar = 0.97 + pseudoRandom * 0.06;

        updatedPrices[city] = Math.round(basePrice * seasonalMult * dailyVar);
      }

      // Déterminer tendance dynamique
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevMult = getSeasonalMultiplier(product.name, prevMonth);
      let dynamicTrend = product.trend;
      if (seasonalMult > prevMult * 1.1) dynamicTrend = 'hausse';
      else if (seasonalMult < prevMult * 0.9) dynamicTrend = 'baisse';

      return {
        ...product,
        prices: updatedPrices,
        trend: dynamicTrend,
        last_updated: now.toISOString().split('T')[0]
      };
    });
  }

  return result;
}

function getDynamicPrices() {
  if (!dynamicPrices || Date.now() - lastUpdate > UPDATE_INTERVAL) {
    dynamicPrices = computeDynamicPrices();
    lastUpdate = Date.now();
  }
  return dynamicPrices;
}

// Historique des prix (30 derniers jours simulés)
function getPriceHistory(productName, city, days = 30) {
  const now = new Date();
  const history = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const month = date.getMonth() + 1;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);

    let basePrice = null;
    for (const [cat, products] of Object.entries(MARKET_DATA)) {
      const product = products.find(p => p.name === productName);
      if (product && product.prices[city]) {
        basePrice = product.prices[city];
        const seasonalMult = getSeasonalMultiplier(productName, month);
        const cityHash = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const pseudoRandom = Math.sin(dayOfYear * 137 + cityHash) * 0.5 + 0.5;
        const dailyVar = 0.97 + pseudoRandom * 0.06;

        history.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(basePrice * seasonalMult * dailyVar)
        });
        break;
      }
    }
  }

  return history;
}

module.exports = { getDynamicPrices, getPriceHistory };
