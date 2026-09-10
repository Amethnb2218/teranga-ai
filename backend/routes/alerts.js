const express = require('express');
const { getActiveAlerts, getAlertsSummary, getCityAlerts } = require('../services/alerts-service');
const { getDatasetProvenance } = require('../services/provenance-service');
const router = express.Router();

// GET /api/alerts — all active alerts (with optional filters)
router.get('/', (req, res) => {
  const { country, severity, type } = req.query;
  const filters = {};
  if (country) filters.country = country;
  if (severity) filters.severity = severity;
  if (type) filters.type = type;

  const alerts = getActiveAlerts(filters);

  const servedAt = new Date().toISOString();
  res.json({
    count: alerts.length,
    filters: Object.keys(filters).length > 0 ? filters : 'none',
    served_at: servedAt,
    observed_at: null,
    availability: 'degraded',
    notice: 'Scénarios indicatifs calculés localement — à confirmer auprès des services officiels.',
    provenance: getDatasetProvenance('alert_scenarios_local'),
    alerts
  });
});

// GET /api/alerts/summary — counts by country, type, severity
router.get('/summary', (req, res) => {
  const summary = getAlertsSummary();
  const servedAt = new Date().toISOString();
  res.json({
    ...summary,
    served_at: servedAt,
    observed_at: null,
    availability: 'degraded',
    notice: 'Résumé de scénarios indicatifs, non d’alertes institutionnelles observées.',
    provenance: getDatasetProvenance('alert_scenarios_local')
  });
});

// GET /api/alerts/:city — alerts for a specific city
router.get('/:city', (req, res) => {
  const cityKey = req.params.city.toLowerCase().replace(/[- ]/g, '_');

  const result = getCityAlerts(cityKey);
  if (!result) {
    return res.status(404).json({
      error: 'Ville non trouvee',
      message: `La ville "${req.params.city}" n'est pas dans la base de donnees Sahel.`,
      availableCountries: ['Senegal', 'Niger', 'Mali', 'Burkina Faso', 'Tchad', 'Nigeria', 'Cameroun', 'Guinee', 'Gambie', 'Mauritanie']
    });
  }

  res.json({
    ...result,
    served_at: new Date().toISOString(),
    observed_at: null,
    availability: 'degraded',
    notice: 'Scénarios indicatifs calculés localement — à confirmer auprès des services officiels.',
    provenance: getDatasetProvenance('alert_scenarios_local')
  });
});

module.exports = router;
