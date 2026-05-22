// Villes avec corrections de température par type de zone
// Les villes côtières (Dakar, Saint-Louis) sont beaucoup plus fraîches
const SENEGAL_CITIES = {
  dakar: { lat: 14.7167, lon: -17.4677, zone: 'sahélienne', type: 'côtière', tempOffset: -11 },
  thies: { lat: 14.7886, lon: -16.9260, zone: 'sahélienne', type: 'intérieure', tempOffset: -3 },
  diourbel: { lat: 14.6553, lon: -16.2314, zone: 'sahélienne', type: 'intérieure', tempOffset: -1 },
  saint_louis: { lat: 16.0326, lon: -16.4818, zone: 'sahélienne', type: 'côtière', tempOffset: -9 },
  kaolack: { lat: 14.1652, lon: -16.0758, zone: 'soudanienne', type: 'intérieure', tempOffset: 0 },
  kaffrine: { lat: 14.1059, lon: -15.5508, zone: 'soudanienne', type: 'intérieure', tempOffset: 1 },
  tambacounda: { lat: 13.7709, lon: -13.6673, zone: 'soudanienne', type: 'intérieure', tempOffset: 2 },
  kedougou: { lat: 12.5605, lon: -12.1747, zone: 'casamançaise', type: 'intérieure', tempOffset: 1 },
  ziguinchor: { lat: 12.5681, lon: -16.2719, zone: 'casamançaise', type: 'côtière', tempOffset: -4 },
  kolda: { lat: 12.8983, lon: -14.9414, zone: 'casamançaise', type: 'intérieure', tempOffset: 0 },
  sedhiou: { lat: 12.7081, lon: -15.5569, zone: 'casamançaise', type: 'intérieure', tempOffset: -1 },
  matam: { lat: 15.6596, lon: -13.2554, zone: 'sahélienne', type: 'intérieure', tempOffset: 3 },
  fatick: { lat: 14.3390, lon: -16.4111, zone: 'soudanienne', type: 'intérieure', tempOffset: -1 },
  louga: { lat: 15.6173, lon: -16.2240, zone: 'sahélienne', type: 'intérieure', tempOffset: -2 }
};

// Données calibrées pour zone intérieure standard (Kaolack)
// Les offsets par ville ajustent ces valeurs
const MONTH_DATA = {
  1: { temp_min: 16, temp_max: 32, humidity: 30, rain_mm: 0, season: 'sèche' },
  2: { temp_min: 17, temp_max: 34, humidity: 25, rain_mm: 0, season: 'sèche' },
  3: { temp_min: 19, temp_max: 36, humidity: 22, rain_mm: 0, season: 'sèche' },
  4: { temp_min: 21, temp_max: 38, humidity: 28, rain_mm: 0, season: 'sèche' },
  5: { temp_min: 24, temp_max: 38, humidity: 45, rain_mm: 3, season: 'sèche' },
  6: { temp_min: 24, temp_max: 35, humidity: 55, rain_mm: 30, season: 'hivernage' },
  7: { temp_min: 24, temp_max: 33, humidity: 72, rain_mm: 120, season: 'hivernage' },
  8: { temp_min: 24, temp_max: 32, humidity: 80, rain_mm: 220, season: 'hivernage' },
  9: { temp_min: 24, temp_max: 33, humidity: 80, rain_mm: 180, season: 'hivernage' },
  10: { temp_min: 23, temp_max: 34, humidity: 68, rain_mm: 50, season: 'hivernage' },
  11: { temp_min: 20, temp_max: 34, humidity: 40, rain_mm: 3, season: 'sèche' },
  12: { temp_min: 17, temp_max: 32, humidity: 32, rain_mm: 0, season: 'sèche' }
};

module.exports = { SENEGAL_CITIES, MONTH_DATA };
