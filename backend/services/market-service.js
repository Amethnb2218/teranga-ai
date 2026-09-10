const { getDynamicPrices, getPriceHistory } = require('./external/price-updater');
const { getDatasetProvenance } = require('./provenance-service');

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

  const servedAt = new Date().toISOString();
  return {
    currency: 'FCFA',
    last_updated: servedAt,
    served_at: servedAt,
    observed_at: null,
    availability: 'degraded',
    source: 'Simulation locale indicative — aucun relevé de marché en temps réel',
    note: 'Prix simulés à partir de valeurs statiques et de multiplicateurs saisonniers. Ne pas utiliser comme cotation officielle.',
    provenance: getDatasetProvenance('market_prices_simulation'),
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
  const servedAt = new Date().toISOString();
  return {
    trends,
    last_updated: servedAt,
    served_at: servedAt,
    availability: 'degraded',
    provenance: getDatasetProvenance('market_prices_simulation')
  };
}

function getProductHistory(productName, city, days) {
  return getPriceHistory(productName, city, days);
}

module.exports = { getMarketPrices, getMarketTrends, getProductHistory };
