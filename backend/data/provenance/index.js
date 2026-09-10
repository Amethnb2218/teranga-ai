const REGISTRY_VERSION = '1.0.0';
const SCHEMA_VERSION = '1.0.0';
const { SOURCES } = require('./v1/sources');
const { DATASETS } = require('./v1/datasets');
const { OFFICIAL_STATISTICS } = require('./v1/official-statistics');

const VALID_TYPES = ['official', 'live', 'static', 'estimated', 'simulated'];
const VALID_VERIFICATION = ['verified', 'partial', 'unverified', 'quarantined'];
const VALID_AVAILABILITY = ['available', 'degraded', 'unavailable'];

function validateRegistry(sources = SOURCES, datasets = DATASETS) {
  const errors = [];
  for (const [id, dataset] of Object.entries(datasets)) {
    if (dataset.dataset_id !== id) errors.push(`${id}: dataset_id incohérent`);
    if (!VALID_TYPES.includes(dataset.type)) errors.push(`${id}: type invalide`);
    if (!VALID_VERIFICATION.includes(dataset.verification)) errors.push(`${id}: vérification invalide`);
    if (!VALID_AVAILABILITY.includes(dataset.availability)) errors.push(`${id}: disponibilité invalide`);
    if (dataset.type === 'official') {
      const source = sources[dataset.source_id];
      if (!source?.url || !source?.published_at) errors.push(`${id}: donnée officielle sans URL ou publication`);
    }
    if (dataset.unit === undefined || !dataset.unit_status) errors.push(`${id}: unité ou statut d’unité absent`);
    if (!Array.isArray(dataset.limitations)) errors.push(`${id}: limites absentes`);
  }
  return { valid: errors.length === 0, errors };
}

const validation = validateRegistry();
if (!validation.valid) throw new Error(`Registre de provenance invalide: ${validation.errors.join('; ')}`);

module.exports = {
  SCHEMA_VERSION,
  REGISTRY_VERSION,
  SOURCES,
  DATASETS,
  OFFICIAL_STATISTICS,
  validateRegistry
};
