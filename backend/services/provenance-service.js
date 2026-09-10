const registry = require('../data/provenance');

function getDatasetProvenance(datasetId, overrides = {}) {
  const dataset = registry.DATASETS[datasetId];
  if (!dataset) throw new Error(`Jeu de données de provenance inconnu: ${datasetId}`);
  const source = dataset.source_id ? registry.SOURCES[dataset.source_id] : null;
  return {
    registry_version: registry.REGISTRY_VERSION,
    dataset_id: dataset.dataset_id,
    type: overrides.type || dataset.type,
    verification: overrides.verification || dataset.verification,
    availability: overrides.availability || dataset.availability,
    observed_at: overrides.observed_at ?? null,
    published_at: source?.published_at || null,
    retrieved_at: overrides.retrieved_at ?? null,
    unit: dataset.unit,
    unit_status: dataset.unit_status,
    geography: dataset.geography,
    method: dataset.method,
    limitations: dataset.limitations,
    source: source ? {
      source_id: source.source_id,
      organization: source.organization,
      name: source.name,
      url: source.url
    } : null
  };
}

function getPublicRegistry() {
  return {
    schema_version: registry.SCHEMA_VERSION,
    registry_version: registry.REGISTRY_VERSION,
    generated_at: new Date().toISOString(),
    definitions: {
      official: 'Valeur directement reproduite d’une publication officielle précise.',
      live: 'Donnée obtenue d’un fournisseur externe pendant la requête ou depuis son cache.',
      static: 'Référentiel local versionné sans preuve suffisante pour être déclaré officiel.',
      estimated: 'Résultat de modèle, extrapolation ou heuristique.',
      simulated: 'Série ou scénario généré sans observation correspondante.'
    },
    sources: Object.values(registry.SOURCES),
    datasets: Object.values(registry.DATASETS),
    official_statistics: registry.OFFICIAL_STATISTICS
  };
}

module.exports = { getDatasetProvenance, getPublicRegistry };
