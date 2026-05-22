const express = require('express');
const router = express.Router();

const MARKET_DATA = {
  cereales: [
    { name: 'Mil (souna)', unit: 'kg', prices: { dakar: 350, kaolack: 280, thies: 310, tambacounda: 260 }, trend: 'stable', season: 'toute année' },
    { name: 'Riz local (paddy)', unit: 'kg', prices: { dakar: 400, saint_louis: 320, ziguinchor: 300, kaolack: 380 }, trend: 'hausse', season: 'oct-jan' },
    { name: 'Maïs', unit: 'kg', prices: { dakar: 300, kaolack: 250, tambacounda: 230, fatick: 260 }, trend: 'stable', season: 'oct-dec' },
    { name: 'Sorgho', unit: 'kg', prices: { dakar: 320, tambacounda: 240, kolda: 260, matam: 280 }, trend: 'baisse', season: 'nov-jan' }
  ],
  legumineuses: [
    { name: 'Arachide (coque)', unit: 'kg', prices: { dakar: 500, kaolack: 400, thies: 450, fatick: 380 }, trend: 'hausse', season: 'nov-mar' },
    { name: 'Niébé', unit: 'kg', prices: { dakar: 600, louga: 480, thies: 550, matam: 450 }, trend: 'stable', season: 'oct-dec' },
    { name: 'Lentilles locales', unit: 'kg', prices: { dakar: 700, kaolack: 620, thies: 650 }, trend: 'stable', season: 'toute année' }
  ],
  maraichage: [
    { name: 'Tomate', unit: 'kg', prices: { dakar: 800, thies: 600, saint_louis: 500, ziguinchor: 550 }, trend: 'hausse', season: 'dec-mai' },
    { name: 'Oignon (violet de Galmi)', unit: 'kg', prices: { dakar: 450, thies: 350, saint_louis: 300, louga: 320 }, trend: 'stable', season: 'jan-avr' },
    { name: 'Pomme de terre', unit: 'kg', prices: { dakar: 550, thies: 480, saint_louis: 450 }, trend: 'hausse', season: 'dec-avr' },
    { name: 'Chou', unit: 'kg', prices: { dakar: 300, thies: 250, ziguinchor: 200, saint_louis: 230 }, trend: 'baisse', season: 'nov-mar' },
    { name: 'Piment', unit: 'kg', prices: { dakar: 1200, kaolack: 1000, ziguinchor: 800, tambacounda: 900 }, trend: 'stable', season: 'toute année' }
  ],
  fruits: [
    { name: 'Mangue (Kent)', unit: 'kg', prices: { dakar: 600, ziguinchor: 300, kolda: 250, tambacounda: 350 }, trend: 'baisse', season: 'mai-jul' },
    { name: 'Pastèque', unit: 'kg', prices: { dakar: 200, thies: 150, louga: 120, saint_louis: 140 }, trend: 'stable', season: 'mar-jun' },
    { name: 'Banane', unit: 'kg', prices: { dakar: 500, ziguinchor: 350, kolda: 300 }, trend: 'stable', season: 'toute année' }
  ]
};

router.get('/', (req, res) => {
  const { category, city } = req.query;

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

  res.json({
    currency: 'FCFA',
    last_updated: new Date().toISOString().split('T')[0],
    note: 'Prix indicatifs basés sur les moyennes des marchés locaux',
    data: result
  });
});

router.get('/trends', (req, res) => {
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
  res.json({ trends });
});

module.exports = router;
