const { MARKET_DATA } = require('../data/market-prices');

function getMarketPrices(category, city) {
  let result = MARKET_DATA;

  if (category && MARKET_DATA[category]) {
    result = { [category]: MARKET_DATA[category] };
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
    last_updated: new Date().toISOString().split('T')[0],
    note: 'Prix indicatifs basés sur les moyennes des marchés locaux',
    data: result
  };
}

function getMarketTrends() {
  const trends = [];
  for (const [category, products] of Object.entries(MARKET_DATA)) {
    for (const product of products) {
      if (product.trend !== 'stable') {
        trends.push({
          product: product.name,
          category,
          trend: product.trend,
          advice: product.trend === 'hausse'
            ? `Bon moment pour vendre votre ${product.name}`
            : `Considérez le stockage de ${product.name}, les prix pourraient remonter`
        });
      }
    }
  }
  return { trends };
}

module.exports = { getMarketPrices, getMarketTrends };
