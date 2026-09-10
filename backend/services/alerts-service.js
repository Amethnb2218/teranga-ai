/**
 * Alerts & Resilience Service - Teranga AI
 *
 * Generates indicative climate-risk scenarios for all Sahel cities based on:
 * - Locally encoded monthly climatology
 * - Crop vulnerability thresholds
 * - Seasonal patterns typical for the Sahel belt
 *
 * These outputs are estimates, not observed events or official alerts.
 *
 * Alert types: drought, flood, heat, pest, sowing_window, food_security
 */

const { SAHEL_CITIES, MONTH_DATA } = require('../config/constants');
const { CROP_PROFILES } = require('./prediction-engine');

// Thresholds for alert generation (calibrated for Sahel realities)
const THRESHOLDS = {
  drought: {
    rain_7day_min: 25,       // less than 25mm in 7 days during rainy season = stress
    consecutive_dry_days: 7
  },
  flood: {
    rain_1day_max: 25,       // more than 25mm in a single day (Sahel soils can't absorb quickly)
    rain_3day_max: 80        // more than 80mm in 3 days
  },
  heat: {
    temp_max_critical: 38,   // above 38 degrees C = crop stress
    temp_max_high: 36        // above 36 for heat advisory
  },
  cold: {
    temp_min_critical: 15    // below 15 for cold-sensitive crops
  }
};

// Sahel rainy season months (varies by latitude)
const RAINY_SEASON = { start: 6, end: 9 };

/**
 * Generate a unique alert ID
 */
function generateAlertId(type, city, timestamp) {
  const hash = Buffer.from(`${type}-${city}-${timestamp}`).toString('base64').slice(0, 12);
  return `ALT-${type.toUpperCase().slice(0, 3)}-${hash}`;
}

/**
 * Determine affected crops based on alert type and zone
 */
function getAffectedCrops(alertType, zone) {
  const crops = [];
  for (const [key, profile] of Object.entries(CROP_PROFILES)) {
    switch (alertType) {
      case 'drought':
        if (profile.droughtTolerance < 0.5) crops.push(profile.name);
        break;
      case 'flood':
        if (profile.floodTolerance < 0.5) crops.push(profile.name);
        break;
      case 'heat':
        if (profile.tempMax < 40) crops.push(profile.name);
        break;
      case 'sowing_window':
        const month = new Date().getMonth() + 1;
        if (isInWindow(month, profile.optimalSowingWindow)) crops.push(profile.name);
        break;
      default:
        crops.push(profile.name);
    }
  }
  return crops.slice(0, 5); // Limit to top 5
}

function isInWindow(month, window) {
  if (window.start <= window.end) {
    return month >= window.start && month <= window.end;
  }
  return month >= window.start || month <= window.end;
}

/**
 * Calculate alert expiry based on type
 */
function getExpiry(type) {
  const now = new Date();
  const hours = {
    drought: 72,
    flood: 24,
    heat: 48,
    pest: 168,
    sowing_window: 336,  // 2 weeks
    food_security: 168   // 1 week
  };
  return new Date(now.getTime() + (hours[type] || 48) * 60 * 60 * 1000).toISOString();
}

/**
 * Generate simulated alerts based on current month and Sahel climate patterns.
 * In July (mid-rainy season): drought risk in northern zones, flood risk in southern,
 * heat stress in desert fringe.
 */
function generateAlerts() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const isRainySeason = month >= RAINY_SEASON.start && month <= RAINY_SEASON.end;
  const alerts = [];

  for (const [cityKey, cityData] of Object.entries(SAHEL_CITIES)) {
    const baseData = MONTH_DATA[month];
    const offset = cityData.tempOffset || 0;
    const tempMax = baseData.temp_max + offset;
    const tempMin = baseData.temp_min + offset;
    const zone = cityData.zone;
    const country = cityData.country;

    // Zone-based rain multiplier (relative to Kaolack reference)
    const zoneRainMult = (zone === 'guineenne') ? 2.5
      : (zone === 'soudanienne') ? 1.5
      : (zone === 'fleuve') ? 0.5
      : 0.5; // sahelienne - much drier

    const expectedDailyRain = (baseData.rain_mm * zoneRainMult) / 30;
    const expected7DayRain = expectedDailyRain * 7;

    // === DROUGHT ALERTS ===
    // Northern Sahel zones during rainy season with low rain
    if (isRainySeason && zone === 'sahelienne' && expected7DayRain < THRESHOLDS.drought.rain_7day_min) {
      alerts.push({
        id: generateAlertId('drought', cityKey, now.toISOString()),
        type: 'drought',
        severity: expected7DayRain < 2 ? 'critical' : 'high',
        country,
        city: cityKey,
        zone,
        lat: cityData.lat,
        lon: cityData.lon,
        title: `Scénario de sécheresse sévère - ${formatCityName(cityKey)}`,
        description: `La climatologie mensuelle codée implique moins de ${Math.round(expected7DayRain)} mm sur 7 jours. Il ne s’agit pas d’une prévision observée ; confirmez avec le service météo local.`,
        recommendation: `Activez l'irrigation d'appoint si disponible. Paillez les cultures pour reduire l'evaporation. Privilegiez les varietes tolerantes a la secheresse (mil Souna 3, niebe Melakh). Contactez les services agricoles locaux.`,
        affectedCrops: getAffectedCrops('drought', zone),
        timestamp: now.toISOString(),
        expiresAt: getExpiry('drought')
      });
    }

    // Moderate drought in soudanienne during early rainy season (June)
    if (month === 6 && zone === 'soudanienne' && expectedDailyRain < 1.5) {
      alerts.push({
        id: generateAlertId('drought', cityKey, now.toISOString()),
        type: 'drought',
        severity: 'medium',
        country,
        city: cityKey,
        zone,
        lat: cityData.lat,
        lon: cityData.lon,
        title: `Scénario de décalage de l'hivernage - ${formatCityName(cityKey)}`,
        description: `La climatologie mensuelle codée suggère un risque de démarrage tardif dans cette zone. Ce scénario n’est pas une observation de la campagne en cours.`,
        recommendation: `Attendez une pluie utile (>=20mm) avant de semer. Preparez les semences a cycle court en plan B. Consultez les previsions officielles quotidiennes.`,
        affectedCrops: getAffectedCrops('sowing_window', zone),
        timestamp: now.toISOString(),
        expiresAt: getExpiry('drought')
      });
    }

    // === FLOOD ALERTS ===
    // Southern/Guinean zones during peak rainy season (Jul-Sep)
    if ((month >= 7 && month <= 9) && (zone === 'guineenne' || zone === 'soudanienne')) {
      const peakDailyRain = expectedDailyRain * 3; // Peak events can be 3x average
      if (peakDailyRain > THRESHOLDS.flood.rain_1day_max) {
        alerts.push({
          id: generateAlertId('flood', cityKey, now.toISOString()),
          type: 'flood',
          severity: peakDailyRain > 120 ? 'critical' : 'high',
          country,
          city: cityKey,
          zone,
          lat: cityData.lat,
          lon: cityData.lon,
          title: `Scénario de fortes pluies - ${formatCityName(cityKey)}`,
          description: `La climatologie mensuelle codée produit un pic indicatif supérieur à ${Math.round(peakDailyRain)} mm/jour. Ce n’est pas une prévision ; confirmez avec le service météo local.`,
          recommendation: `Drainez les parcelles basses. Ne semez pas dans les bas-fonds cette semaine. Protegez les recoltes stockees. Verifiez les digues et canaux de drainage.`,
          affectedCrops: getAffectedCrops('flood', zone),
          timestamp: now.toISOString(),
          expiresAt: getExpiry('flood')
        });
      }
    }

    // === HEAT STRESS ALERTS ===
    if (tempMax >= THRESHOLDS.heat.temp_max_critical) {
      alerts.push({
        id: generateAlertId('heat', cityKey, now.toISOString()),
        type: 'heat',
        severity: tempMax >= 45 ? 'critical' : 'high',
        country,
        city: cityKey,
        zone,
        lat: cityData.lat,
        lon: cityData.lon,
        title: `Scénario de stress thermique - ${formatCityName(cityKey)}`,
        description: `La climatologie mensuelle codée estime une maximale de ${tempMax} °C. Ce n’est pas une observation ni une prévision en temps réel.`,
        recommendation: `Irriguez tot le matin ou tard le soir. Protegez le betail (ombre, eau). Evitez les traitements phytosanitaires aux heures chaudes. Paillez abondamment au pied des cultures.`,
        affectedCrops: getAffectedCrops('heat', zone),
        timestamp: now.toISOString(),
        expiresAt: getExpiry('heat')
      });
    } else if (tempMax >= THRESHOLDS.heat.temp_max_high) {
      alerts.push({
        id: generateAlertId('heat', cityKey, now.toISOString()),
        type: 'heat',
        severity: 'medium',
        country,
        city: cityKey,
        zone,
        lat: cityData.lat,
        lon: cityData.lon,
        title: `Scénario de forte chaleur - ${formatCityName(cityKey)}`,
        description: `La climatologie mensuelle codée estime une maximale de ${tempMax} °C. Ce n’est pas une observation ni une prévision en temps réel.`,
        recommendation: `Augmentez la frequence d'irrigation. Surveillez les signes de fletrissement. Reportez les operations de desherbage aux heures fraiches.`,
        affectedCrops: getAffectedCrops('heat', zone),
        timestamp: now.toISOString(),
        expiresAt: getExpiry('heat')
      });
    }

    // === SOWING WINDOW ALERTS ===
    // Only during the 2-week window before optimal sowing (May-June for most crops)
    if ((month === 5 || month === 6) && isRainySeason === false && zone !== 'sahelienne') {
      // Alert that sowing window is approaching
      alerts.push({
        id: generateAlertId('sowing_window', cityKey, now.toISOString()),
        type: 'sowing_window',
        severity: 'low',
        country,
        city: cityKey,
        zone,
        lat: cityData.lat,
        lon: cityData.lon,
        title: `Fenetre de semis imminente - ${formatCityName(cityKey)}`,
        description: `La fenetre optimale de semis pour les cultures pluviales approche. Preparez vos parcelles et intrants.`,
        recommendation: `Preparez le sol des maintenant. Verifiez la germination de vos semences. Achetez l'engrais NPK (6-20-10) et l'uree. Semez des la premiere pluie utile (>=20mm).`,
        affectedCrops: getAffectedCrops('sowing_window', zone),
        timestamp: now.toISOString(),
        expiresAt: getExpiry('sowing_window')
      });
    }

    // === FOOD SECURITY ALERTS ===
    // Combination: drought zone + late in dry season (soudure period: May-Jul)
    if ((month >= 5 && month <= 7) && zone === 'sahelienne' && cityData.type === 'interieure') {
      const isSoudure = month === 5 || month === 6;
      if (isSoudure) {
        alerts.push({
          id: generateAlertId('food_security', cityKey, now.toISOString()),
          type: 'food_security',
          severity: 'high',
          country,
          city: cityKey,
          zone,
          lat: cityData.lat,
          lon: cityData.lon,
          title: `Scénario saisonnier de soudure - ${formatCityName(cityKey)}`,
          description: `La période calendaire correspond habituellement à un risque accru de soudure. Aucun niveau de stock ni prix actuel n’est observé par ce moteur.`,
          recommendation: `Consultez les évaluations officielles de sécurité alimentaire et les services sociaux locaux. Envisagez, selon le contexte local, la diversification alimentaire et des cultures a cycle court.`,
          affectedCrops: ['Mil (souna)', 'Niebe', 'Mais'],
          timestamp: now.toISOString(),
          expiresAt: getExpiry('food_security')
        });
      }
    }
  }

  return alerts;
}

/**
 * Format city key to display name
 */
function formatCityName(cityKey) {
  const specialNames = {
    ndjamena: "N'Djamena",
    saint_louis: 'Saint-Louis',
    bobo_dioulasso: 'Bobo-Dioulasso',
    nouakchott: 'Nouakchott'
  };
  if (specialNames[cityKey]) return specialNames[cityKey];
  return cityKey.charAt(0).toUpperCase() + cityKey.slice(1).replace(/_/g, ' ');
}

/**
 * Get all active alerts, optionally filtered
 */
function getActiveAlerts(filters = {}) {
  const allAlerts = generateAlerts();
  const now = new Date().toISOString();

  let filtered = allAlerts.filter(a => a.expiresAt > now);

  if (filters.country) {
    filtered = filtered.filter(a => a.country.toLowerCase() === filters.country.toLowerCase());
  }
  if (filters.severity) {
    filtered = filtered.filter(a => a.severity === filters.severity);
  }
  if (filters.type) {
    filtered = filtered.filter(a => a.type === filters.type);
  }
  if (filters.city) {
    filtered = filtered.filter(a => a.city === filters.city.toLowerCase().replace(/[- ]/g, '_'));
  }

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  filtered.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return filtered;
}

/**
 * Get alerts summary: counts by country, type, severity
 */
function getAlertsSummary() {
  const alerts = getActiveAlerts();

  const byCountry = {};
  const byType = {};
  const bySeverity = {};

  for (const alert of alerts) {
    byCountry[alert.country] = (byCountry[alert.country] || 0) + 1;
    byType[alert.type] = (byType[alert.type] || 0) + 1;
    bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
  }

  return {
    total: alerts.length,
    byCountry,
    byType,
    bySeverity,
    mostAffectedCountry: Object.entries(byCountry).sort((a, b) => b[1] - a[1])[0] || null,
    criticalCount: bySeverity.critical || 0,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get alerts for a specific city
 */
function getCityAlerts(cityKey) {
  const normalizedKey = cityKey.toLowerCase().replace(/[- ]/g, '_');
  const cityData = SAHEL_CITIES[normalizedKey];
  if (!cityData) return null;

  const alerts = getActiveAlerts({ city: normalizedKey });

  return {
    city: normalizedKey,
    cityDisplayName: formatCityName(normalizedKey),
    country: cityData.country,
    zone: cityData.zone,
    coordinates: { lat: cityData.lat, lon: cityData.lon },
    alertCount: alerts.length,
    alerts
  };
}

module.exports = {
  getActiveAlerts,
  getAlertsSummary,
  getCityAlerts,
  generateAlerts,
  THRESHOLDS
};
