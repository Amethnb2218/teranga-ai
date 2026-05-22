// Prix indicatifs 2025-2026 basés sur données FAO/GIEWS, CSA Sénégal
// Dernière mise à jour : mai 2026
// Sources : FAO Country Brief Oct 2024, tendances WFP, ARM Sénégal
const MARKET_DATA = {
  cereales: [
    { name: 'Mil (souna)', unit: 'kg', prices: { dakar: 380, kaolack: 300, thies: 340, tambacounda: 280, fatick: 310, louga: 320 }, trend: 'baisse', season: 'toute année' },
    { name: 'Riz local (paddy)', unit: 'kg', prices: { dakar: 450, saint_louis: 360, ziguinchor: 340, kaolack: 420, matam: 380 }, trend: 'hausse', season: 'oct-jan' },
    { name: 'Riz importé brisé', unit: 'kg', prices: { dakar: 375, thies: 375, kaolack: 390, saint_louis: 380, ziguinchor: 400 }, trend: 'hausse', season: 'toute année' },
    { name: 'Maïs', unit: 'kg', prices: { dakar: 320, kaolack: 270, tambacounda: 250, fatick: 280, kolda: 260 }, trend: 'baisse', season: 'oct-dec' },
    { name: 'Sorgho', unit: 'kg', prices: { dakar: 340, tambacounda: 260, kolda: 280, matam: 300 }, trend: 'baisse', season: 'nov-jan' }
  ],
  legumineuses: [
    { name: 'Arachide (coque)', unit: 'kg', prices: { dakar: 550, kaolack: 450, thies: 500, fatick: 420, tambacounda: 400 }, trend: 'hausse', season: 'nov-mar' },
    { name: 'Arachide (décortiquée)', unit: 'kg', prices: { dakar: 900, kaolack: 750, thies: 820, fatick: 700 }, trend: 'hausse', season: 'nov-mar' },
    { name: 'Niébé', unit: 'kg', prices: { dakar: 650, louga: 520, thies: 580, matam: 480, tambacounda: 500 }, trend: 'stable', season: 'oct-dec' },
    { name: 'Lentilles locales', unit: 'kg', prices: { dakar: 750, kaolack: 660, thies: 700 }, trend: 'stable', season: 'toute année' }
  ],
  maraichage: [
    { name: 'Tomate (locale)', unit: 'kg', prices: { dakar: 900, thies: 650, saint_louis: 550, ziguinchor: 600, louga: 600 }, trend: 'hausse', season: 'dec-mai' },
    { name: 'Oignon (violet de Galmi)', unit: 'kg', prices: { dakar: 500, thies: 400, saint_louis: 350, louga: 360, fatick: 380 }, trend: 'stable', season: 'jan-avr' },
    { name: 'Pomme de terre', unit: 'kg', prices: { dakar: 600, thies: 520, saint_louis: 500, louga: 480 }, trend: 'hausse', season: 'dec-avr' },
    { name: 'Chou pommé', unit: 'kg', prices: { dakar: 350, thies: 280, ziguinchor: 220, saint_louis: 260 }, trend: 'baisse', season: 'nov-mar' },
    { name: 'Piment frais', unit: 'kg', prices: { dakar: 1400, kaolack: 1100, ziguinchor: 900, tambacounda: 1000 }, trend: 'hausse', season: 'toute année' },
    { name: 'Carotte', unit: 'kg', prices: { dakar: 500, thies: 420, saint_louis: 380, louga: 400 }, trend: 'stable', season: 'nov-avr' }
  ],
  fruits: [
    { name: 'Mangue (Kent)', unit: 'kg', prices: { dakar: 700, ziguinchor: 350, kolda: 280, tambacounda: 400 }, trend: 'baisse', season: 'mai-jul' },
    { name: 'Pastèque', unit: 'kg', prices: { dakar: 250, thies: 180, louga: 150, saint_louis: 160, fatick: 170 }, trend: 'stable', season: 'mar-jun' },
    { name: 'Banane', unit: 'kg', prices: { dakar: 550, ziguinchor: 380, kolda: 330, tambacounda: 400 }, trend: 'stable', season: 'toute année' },
    { name: 'Orange', unit: 'kg', prices: { dakar: 600, thies: 500, ziguinchor: 400 }, trend: 'stable', season: 'nov-fev' }
  ]
};

module.exports = { MARKET_DATA };
