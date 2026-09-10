const path = require('path');
process.chdir(path.join(__dirname, '..'));

const { SOURCES, DATASETS, OFFICIAL_STATISTICS, validateRegistry } = require('../data/provenance');
const { getDatasetProvenance, getPublicRegistry } = require('../services/provenance-service');
const { getMarketPrices, getProductHistory } = require('../services/market-service');
const { getCityWeather } = require('../services/weather-service');
const { fetchAgriNews } = require('../services/external/news-service');

const originalFetch = global.fetch;
const originalWeatherKey = process.env.OPENWEATHER_API_KEY;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) { passed++; console.log(`  ✓ ${message}`); }
  else { failed++; console.error(`  ✗ FAIL: ${message}`); }
}

async function run() {
  console.log('\n=== Teranga AI — Provenance Tests ===\n');

  const validation = validateRegistry();
  assert(validation.valid, 'Le registre versionné est valide');
  const invalid = validateRegistry(SOURCES, {
    bad: { ...DATASETS.rgph5_population_2023, dataset_id: 'bad', source_id: null }
  });
  assert(!invalid.valid, 'Une donnée officielle sans URL/publication est rejetée');
  assert(DATASETS.sesn_2024_agriculture.unit === null, 'Aucune unité SESN n’est inventée');
  assert(DATASETS.sesn_2024_agriculture.unit_status === 'unconfirmed', 'L’unité SESN reste explicitement non confirmée');
  assert(Boolean(OFFICIAL_STATISTICS.rgph5_agriculture.aggregation_warning), 'Les catégories RGPH qui se chevauchent portent un avertissement');

  const market = getMarketPrices(null, 'dakar');
  assert(market.provenance.type === 'simulated', 'Les prix sont déclarés simulés');
  assert(market.observed_at === null && Boolean(market.served_at), 'Date de calcul et observation sont séparées');
  const history = getProductHistory('Mil (souna)', 'dakar', 2);
  assert(Array.isArray(history), 'Le contrat historique reste compatible');

  delete process.env.OPENWEATHER_API_KEY;
  const weather = await getCityWeather('dakar');
  assert(weather.provenance.type === 'estimated', 'Le fallback météo est déclaré estimé');
  assert(weather.availability === 'degraded', 'Le fallback météo est signalé dégradé');

  global.fetch = async () => ({ ok: false, text: async () => '' });
  const news = await fetchAgriNews();
  assert(Array.isArray(news) && news.length === 0, 'Une panne RSS ne fabrique aucun article');

  const publicRegistry = getPublicRegistry();
  assert(publicRegistry.registry_version === '1.0.0', 'Le catalogue public expose sa version');
  assert(getDatasetProvenance('ml_embedded_corpus').verification === 'quarantined', 'Le corpus ML non traçable est mis en quarantaine');
  assert(getDatasetProvenance('alert_scenarios_local').type === 'estimated', 'Les alertes locales sont déclarées comme scénarios estimés');
  const community = getDatasetProvenance('community_demo');
  assert(community.type === 'simulated' && community.verification === 'unverified', 'Le réseau communautaire embarqué est déclaré simulé et non vérifié');

  global.fetch = originalFetch;
  if (originalWeatherKey === undefined) delete process.env.OPENWEATHER_API_KEY;
  else process.env.OPENWEATHER_API_KEY = originalWeatherKey;
  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed ? 1 : 0;
}

run().catch(error => {
  global.fetch = originalFetch;
  if (originalWeatherKey === undefined) delete process.env.OPENWEATHER_API_KEY;
  else process.env.OPENWEATHER_API_KEY = originalWeatherKey;
  console.error(error);
  process.exitCode = 1;
});
