// Villes du Sahel avec corrections de temperature par type de zone
// Les villes cotieres sont beaucoup plus fraiches
// Couvre 10 pays saheliens: Senegal, Niger, Mali, Burkina Faso, Tchad, Nigeria, Cameroun, Guinee, Gambie, Mauritanie
const SAHEL_CITIES = {
  // === SENEGAL ===
  dakar: { lat: 14.7167, lon: -17.4677, zone: 'sahelienne', type: 'cotiere', tempOffset: -11, country: 'Senegal' },
  thies: { lat: 14.7886, lon: -16.9260, zone: 'sahelienne', type: 'interieure', tempOffset: -3, country: 'Senegal' },
  diourbel: { lat: 14.6553, lon: -16.2314, zone: 'sahelienne', type: 'interieure', tempOffset: -1, country: 'Senegal' },
  saint_louis: { lat: 16.0326, lon: -16.4818, zone: 'fleuve', type: 'cotiere', tempOffset: -9, country: 'Senegal' },
  kaolack: { lat: 14.1652, lon: -16.0758, zone: 'soudanienne', type: 'interieure', tempOffset: 0, country: 'Senegal' },
  kaffrine: { lat: 14.1059, lon: -15.5508, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Senegal' },
  tambacounda: { lat: 13.7709, lon: -13.6673, zone: 'soudanienne', type: 'interieure', tempOffset: 2, country: 'Senegal' },
  kedougou: { lat: 12.5605, lon: -12.1747, zone: 'guineenne', type: 'interieure', tempOffset: 1, country: 'Senegal' },
  ziguinchor: { lat: 12.5681, lon: -16.2719, zone: 'guineenne', type: 'cotiere', tempOffset: -4, country: 'Senegal' },
  kolda: { lat: 12.8983, lon: -14.9414, zone: 'guineenne', type: 'interieure', tempOffset: 0, country: 'Senegal' },
  sedhiou: { lat: 12.7081, lon: -15.5569, zone: 'guineenne', type: 'interieure', tempOffset: -1, country: 'Senegal' },
  matam: { lat: 15.6596, lon: -13.2554, zone: 'sahelienne', type: 'interieure', tempOffset: 3, country: 'Senegal' },
  fatick: { lat: 14.3390, lon: -16.4111, zone: 'soudanienne', type: 'interieure', tempOffset: -1, country: 'Senegal' },
  louga: { lat: 15.6173, lon: -16.2240, zone: 'sahelienne', type: 'interieure', tempOffset: -2, country: 'Senegal' },

  // === NIGER ===
  niamey: { lat: 13.5116, lon: 2.1254, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Niger' },
  maradi: { lat: 13.5, lon: 7.1, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Niger' },
  zinder: { lat: 13.8, lon: 8.9, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Niger' },
  tillaberi: { lat: 14.2, lon: 1.4, zone: 'sahelienne', type: 'interieure', tempOffset: 2, country: 'Niger' },
  agadez: { lat: 16.97, lon: 7.99, zone: 'sahelienne', type: 'interieure', tempOffset: 4, country: 'Niger' },

  // === MALI ===
  bamako: { lat: 12.6392, lon: -8.0029, zone: 'soudanienne', type: 'interieure', tempOffset: 0, country: 'Mali' },
  sikasso: { lat: 11.3175, lon: -5.6827, zone: 'soudanienne', type: 'interieure', tempOffset: 0, country: 'Mali' },
  mopti: { lat: 14.4843, lon: -4.1870, zone: 'sahelienne', type: 'interieure', tempOffset: 2, country: 'Mali' },
  gao: { lat: 16.2667, lon: -0.0400, zone: 'sahelienne', type: 'interieure', tempOffset: 3, country: 'Mali' },
  segou: { lat: 13.4317, lon: -5.8853, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Mali' },

  // === BURKINA FASO ===
  ouagadougou: { lat: 12.3714, lon: -1.5197, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Burkina Faso' },
  bobo_dioulasso: { lat: 11.1771, lon: -4.2979, zone: 'guineenne', type: 'interieure', tempOffset: -1, country: 'Burkina Faso' },
  koudougou: { lat: 12.25, lon: -2.3625, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Burkina Faso' },
  dedougou: { lat: 12.4633, lon: -3.4606, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Burkina Faso' },

  // === TCHAD ===
  ndjamena: { lat: 12.1348, lon: 15.0557, zone: 'soudanienne', type: 'interieure', tempOffset: 2, country: 'Tchad' },
  moundou: { lat: 8.5667, lon: 16.0833, zone: 'guineenne', type: 'interieure', tempOffset: -1, country: 'Tchad' },
  abeche: { lat: 13.8292, lon: 20.8324, zone: 'sahelienne', type: 'interieure', tempOffset: 3, country: 'Tchad' },

  // === NIGERIA (Sahel belt) ===
  kano: { lat: 12.0, lon: 8.52, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Nigeria' },
  sokoto: { lat: 13.06, lon: 5.24, zone: 'sahelienne', type: 'interieure', tempOffset: 3, country: 'Nigeria' },
  maiduguri: { lat: 11.85, lon: 13.16, zone: 'sahelienne', type: 'interieure', tempOffset: 2, country: 'Nigeria' },

  // === CAMEROUN (Nord) ===
  maroua: { lat: 10.5906, lon: 14.3159, zone: 'soudanienne', type: 'interieure', tempOffset: 1, country: 'Cameroun' },
  garoua: { lat: 9.3, lon: 13.4, zone: 'soudanienne', type: 'interieure', tempOffset: 0, country: 'Cameroun' },

  // === GUINEE ===
  conakry: { lat: 9.6412, lon: -13.5784, zone: 'guineenne', type: 'cotiere', tempOffset: -5, country: 'Guinee' },
  kankan: { lat: 10.3856, lon: -9.3057, zone: 'guineenne', type: 'interieure', tempOffset: 0, country: 'Guinee' },

  // === GAMBIE ===
  banjul: { lat: 13.4549, lon: -16.5790, zone: 'soudanienne', type: 'cotiere', tempOffset: -7, country: 'Gambie' },

  // === MAURITANIE ===
  nouakchott: { lat: 18.0735, lon: -15.9582, zone: 'sahelienne', type: 'cotiere', tempOffset: -6, country: 'Mauritanie' },
  kiffa: { lat: 16.6167, lon: -11.4, zone: 'sahelienne', type: 'interieure', tempOffset: 3, country: 'Mauritanie' }
};

// Donnees calibrees pour zone interieure standard (Kaolack)
// Les offsets par ville ajustent ces valeurs
const MONTH_DATA = {
  1: { temp_min: 16, temp_max: 32, humidity: 30, rain_mm: 0, season: 'seche' },
  2: { temp_min: 17, temp_max: 34, humidity: 25, rain_mm: 0, season: 'seche' },
  3: { temp_min: 19, temp_max: 36, humidity: 22, rain_mm: 0, season: 'seche' },
  4: { temp_min: 21, temp_max: 38, humidity: 28, rain_mm: 0, season: 'seche' },
  5: { temp_min: 24, temp_max: 38, humidity: 45, rain_mm: 3, season: 'seche' },
  6: { temp_min: 24, temp_max: 35, humidity: 55, rain_mm: 30, season: 'hivernage' },
  7: { temp_min: 24, temp_max: 33, humidity: 72, rain_mm: 120, season: 'hivernage' },
  8: { temp_min: 24, temp_max: 32, humidity: 80, rain_mm: 220, season: 'hivernage' },
  9: { temp_min: 24, temp_max: 33, humidity: 80, rain_mm: 180, season: 'hivernage' },
  10: { temp_min: 23, temp_max: 34, humidity: 68, rain_mm: 50, season: 'hivernage' },
  11: { temp_min: 20, temp_max: 34, humidity: 40, rain_mm: 3, season: 'seche' },
  12: { temp_min: 17, temp_max: 32, humidity: 32, rain_mm: 0, season: 'seche' }
};

// Backward compatibility alias
const SENEGAL_CITIES = SAHEL_CITIES;

module.exports = { SAHEL_CITIES, SENEGAL_CITIES, MONTH_DATA };
