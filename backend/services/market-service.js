const { getDynamicPrices, getPriceHistory } = require('./external/price-updater');

function getMarketPrices(category, city) {
  const currentPrices = getDynamicPrices();
  let result = currentPrices;

  if (category && currentPrices[category]) {
    result = { [category]: currentPrices[category] };
  }

  if (city) {
    const cityKey = city.toLowerCase().replace(/[- ]/g, '_');
    const filtered = {};
    for (const [cat, products] of Object.entries(result)) {
      filtered[cat] = products
        .filter(p => p.prices[cityKey] !== undefined)
        .map(p => ({
          ...p,
          price_local: p.prices[cityKey],
          currency: 'FCFA'
        }));
    }
    result = filtered;
  }

  return {
    currency: 'FCFA',
    last_updated: new Date().toISOString(),
    source: 'Données actualisées (FAO/CSA/ARM Sénégal)',
    note: 'Prix indicatifs basés sur les moyennes des marchés locaux, ajustés en temps réel',
    data: result
  };
}

function getMarketTrends() {
  const currentPrices = getDynamicPrices();
  const trends = [];

  for (const [category, products] of Object.entries(currentPrices)) {
    for (const product of products) {
      if (product.trend !== 'stable') {
        trends.push({
          product: product.name,
          category,
          trend: product.trend,
          advice: product.trend === 'hausse'
            ? `Bon moment pour vendre votre ${product.name} — les prix augmentent`
            : `Stockez ${product.name} si possible — les prix devraient remonter`
        });
      }
    }
  }
  return { trends, last_updated: new Date().toISOString() };
}

function getProductHistory(productName, city, days) {
  return getPriceHistory(productName, city, days);
}

module.exports = { getMarketPrices, getMarketTrends, getProductHistory };
