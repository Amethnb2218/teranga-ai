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

module.exports = { SENEGAL_CITIES, MONTH_DATA };
