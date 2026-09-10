/**
 * ML Engine Tests — Validate experimental model contracts and output ranges
 * Run: node backend/tests/ml-engine.test.js
 */

const path = require('path');
process.chdir(path.join(__dirname, '..'));

const { predictYield, optimizeCropCalendar, assessRiskBayesian, getModelMetrics, getCorpusManifest } = require('../services/ml-engine');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertRange(value, min, max, message) {
  assert(value >= min && value <= max, `${message} — got ${value}, expected [${min}, ${max}]`);
}

console.log('\n=== Teranga AI — ML Engine Tests ===\n');

// --- Test 1: Model Metrics ---
console.log('▸ Model Metrics');
const corpus = getCorpusManifest();
assert(corpus.corpus_status === 'experimental', 'Corpus is explicitly experimental');
assert(corpus.record_counts.total === 304, 'Corpus exposes its exact record count');
assert(corpus.record_counts.verified === 0, 'No records are claimed as verified without lineage');
assert(corpus.record_counts.quarantined === 0, 'No records are claimed as quarantined without a manifest');
assert(corpus.record_counts.unreviewed === corpus.record_counts.total, 'Records without review evidence are counted as unreviewed');
assert(corpus.features.count === 13, 'Manifest reports the 13 implemented features');
assert(corpus.crops.count === 9, 'Manifest reports the 9 trained crops');
assert(corpus.period.min_year === 2015 && corpus.period.max_year === 2026, 'Manifest period matches embedded records');

const metrics = getModelMetrics();
assert(metrics !== null, 'getModelMetrics() returns data');
const cropKeys = metrics.crops ? Object.keys(metrics.crops) : Object.keys(metrics);
assert(cropKeys.length >= 6, 'At least 6 crops trained');

for (const [crop, stats] of Object.entries(metrics.crops || metrics)) {
  assertRange(parseFloat(stats.r_squared), 0.5, 1.0, `${crop} R² is valid`);
  assertRange(stats.n_samples || stats.training_samples, 10, 500, `${crop} has sufficient training samples`);
}

// --- Test 2: Yield Predictions within expected experimental ranges ---
console.log('\n▸ Yield Predictions (experimental corpus ranges)');

const EXPECTED_RANGES = {
  arachide: { min: 600, max: 2200 },
  mil: { min: 400, max: 1800 },
  mais: { min: 800, max: 3500 },
  riz: { min: 1500, max: 5000 },
  sorgho: { min: 500, max: 2000 },
  niebe: { min: 200, max: 1500 },
};

const TEST_CASES = [
  { crop: 'arachide', city: 'kaolack', rain: 650, temp: 29, month: 7 },
  { crop: 'mil', city: 'diourbel', rain: 450, temp: 30, month: 7 },
  { crop: 'riz', city: 'ziguinchor', rain: 1200, temp: 27, month: 7 },
  { crop: 'mais', city: 'kolda', rain: 900, temp: 28, month: 6 },
  { crop: 'sorgho', city: 'tambacounda', rain: 700, temp: 29, month: 7 },
  { crop: 'niebe', city: 'louga', rain: 300, temp: 31, month: 7 },
  { crop: 'arachide', city: 'niamey', rain: 500, temp: 32, month: 7 },
  { crop: 'mil', city: 'ouagadougou', rain: 600, temp: 30, month: 6 },
];

for (const tc of TEST_CASES) {
  const result = predictYield(tc.crop, tc.city, tc.rain, tc.temp, tc.month);
  assert(result !== null, `predictYield(${tc.crop}, ${tc.city}) returns data`);

  if (result && result.ensemble) {
    const yieldKg = result.ensemble.predicted_yield_kg;
    const range = EXPECTED_RANGES[tc.crop];
    assertRange(yieldKg, range.min, range.max, `${tc.crop}@${tc.city} yield=${yieldKg} within expected range`);
  }
}

// --- Test 3: Ensemble Structure ---
console.log('\n▸ Ensemble Structure');
const ensResult = predictYield('arachide', 'kaolack', 650, 29, 7);
assert(ensResult.regression !== undefined, 'Has regression component');
assert(ensResult.knn !== undefined, 'Has KNN component');
assert(ensResult.ensemble !== undefined, 'Has ensemble');
assert(ensResult.ensemble.method && ensResult.ensemble.method.includes('Ensemble'), 'Ensemble method is correct');
assert(ensResult.ensemble.accuracy !== undefined, 'Keeps accuracy for compatibility');
assert(ensResult.ensemble.deprecated === true, 'Marks accuracy as deprecated');
assert(ensResult.ensemble.accuracy_definition === '100 - MAPE (MAPE from LOOCV)', 'Defines compatibility accuracy as 100 - MAPE');
const accNum = parseFloat(ensResult.ensemble.accuracy);
assertRange(accNum, 0, 100, 'Deprecated accuracy follows percentage bounds');
assert(Math.abs(accNum - (100 - parseFloat(ensResult.ensemble.cv_mape))) < 0.11, 'Accuracy equals 100 - MAPE');
assert(ensResult.ensemble.error_band?.kind === 'mape_error_band', 'Prediction exposes a MAPE error band');
assert(ensResult.ensemble.error_band?.level === null, 'Error band has no confidence level');
assert(ensResult.ensemble.error_band?.calibrated === false, 'Error band is explicitly uncalibrated');
assert(ensResult.ensemble.confidence_interval === undefined, 'Prediction has no misleading confidence interval');
assert(ensResult.provenance?.corpus_status === 'experimental', 'Prediction exposes experimental provenance');
assert(ensResult.ensemble.provenance?.source_verification === 'unverified', 'Ensemble does not claim verified sources');
assert(!/verified|official/i.test(ensResult.ensemble.data_source), 'Data source has no verified/official claim');

// --- Test 4: Genetic Algorithm ---
console.log('\n▸ Genetic Algorithm (Calendar Optimization)');
const gaResult = optimizeCropCalendar(['arachide', 'mil'], 'kaolack', { parcels: 2 });
assert(gaResult !== null, 'optimizeCropCalendar returns data');
assert(gaResult.calendar && gaResult.calendar.length === 2, 'Returns 2 parcels');
assert(gaResult.provenance?.operation === 'calendar_optimization', 'Optimization exposes provenance');

for (const entry of gaResult.calendar || []) {
  assertRange(entry.sowMonth, 1, 12, `Sow month valid for ${entry.crop}`);
  assert(entry.predictedYield > 0, `Predicted yield > 0 for ${entry.crop}`);
}

if (gaResult.optimization) {
  assert(gaResult.optimization.algorithm && gaResult.optimization.algorithm.includes('Genetic'), 'GA algorithm identified');
  assertRange(gaResult.optimization.parameters.population_size || gaResult.optimization.parameters.population, 30, 100, 'Population size reasonable');
  assertRange(gaResult.optimization.parameters.generations, 50, 200, 'Generations reasonable');
}

// --- Test 5: Bayesian Risk Network ---
console.log('\n▸ Bayesian Belief Network (Risk Assessment)');
const riskResult = assessRiskBayesian('arachide', 'kaolack', 7);
assert(riskResult !== null, 'assessRiskBayesian returns data');
assertRange(riskResult.safetyScore, 0, 100, 'Safety score in [0, 100]');
assert(riskResult.factors !== undefined, 'Has risk factors');
assert(riskResult.outcomes !== undefined, 'Has outcomes');
assert(riskResult.recommendation !== undefined, 'Has recommendation string');
assert(riskResult.provenance?.operation === 'risk_assessment', 'Risk assessment exposes provenance');

// Dry season should have higher drought risk
const dryResult = assessRiskBayesian('arachide', 'louga', 3);
if (dryResult) {
  const dryDrought = parseFloat(dryResult.factors.drought_probability) || 0;
  assert(dryDrought > 30, `Dry season drought risk > 30% (got ${dryDrought}%)`);
}

// --- Test 6: Edge Cases ---
console.log('\n▸ Edge Cases');
const unknownCity = predictYield('arachide', 'unknown_city', 500, 28, 7);
assert(unknownCity !== null, 'Unknown city still returns prediction (uses fallback)');

const extremeRain = predictYield('riz', 'ziguinchor', 2500, 26, 8);
assert(extremeRain !== null, 'Extreme rain does not crash');
if (extremeRain && extremeRain.ensemble) {
  assert(extremeRain.ensemble.predicted_yield_kg > 0, 'Extreme rain still gives positive yield');
}

// --- Summary ---
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
