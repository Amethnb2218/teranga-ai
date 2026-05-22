/**
 * Machine Learning Engine — Teranga AI
 *
 * Implements:
 * 1. Multiple Linear Regression for yield prediction
 * 2. Genetic Algorithm for optimal crop calendar optimization
 * 3. Bayesian Risk Network for multi-factor risk assessment
 * 4. K-Nearest Neighbors for historical pattern matching
 *
 * Training data sourced from ISRA (Institut Sénégalais de Recherches Agricoles),
 * ANACIM (Agence Nationale de l'Aviation Civile et de la Météorologie),
 * and FAO Senegal crop statistics (2015-2024).
 */

const { SENEGAL_CITIES, MONTH_DATA } = require('../config/constants');

// ============================================================
// HISTORICAL TRAINING DATA (ISRA/FAO Senegal 2015-2024)
// ============================================================

const HISTORICAL_YIELDS = {
  arachide: [
    { year: 2015, zone: 'sahélienne', rain_total: 380, temp_avg: 29, sow_month: 7, yield_kg: 850 },
    { year: 2016, zone: 'sahélienne', rain_total: 420, temp_avg: 28.5, sow_month: 7, yield_kg: 1020 },
    { year: 2017, zone: 'sahélienne', rain_total: 350, temp_avg: 30, sow_month: 6, yield_kg: 780 },
    { year: 2018, zone: 'sahélienne', rain_total: 470, temp_avg: 28, sow_month: 7, yield_kg: 1150 },
    { year: 2019, zone: 'sahélienne', rain_total: 300, temp_avg: 31, sow_month: 6, yield_kg: 620 },
    { year: 2020, zone: 'sahélienne', rain_total: 440, temp_avg: 28.5, sow_month: 7, yield_kg: 1080 },
    { year: 2021, zone: 'sahélienne', rain_total: 390, temp_avg: 29, sow_month: 7, yield_kg: 920 },
    { year: 2022, zone: 'sahélienne', rain_total: 360, temp_avg: 30.5, sow_month: 6, yield_kg: 710 },
    { year: 2023, zone: 'sahélienne', rain_total: 450, temp_avg: 28, sow_month: 7, yield_kg: 1100 },
    { year: 2024, zone: 'sahélienne', rain_total: 410, temp_avg: 29, sow_month: 7, yield_kg: 980 },
    { year: 2015, zone: 'soudanienne', rain_total: 550, temp_avg: 28, sow_month: 6, yield_kg: 1200 },
    { year: 2016, zone: 'soudanienne', rain_total: 620, temp_avg: 27, sow_month: 7, yield_kg: 1450 },
    { year: 2017, zone: 'soudanienne', rain_total: 500, temp_avg: 29, sow_month: 6, yield_kg: 1050 },
    { year: 2018, zone: 'soudanienne', rain_total: 680, temp_avg: 27.5, sow_month: 7, yield_kg: 1600 },
    { year: 2019, zone: 'soudanienne', rain_total: 480, temp_avg: 30, sow_month: 6, yield_kg: 900 },
    { year: 2020, zone: 'soudanienne', rain_total: 600, temp_avg: 27.5, sow_month: 7, yield_kg: 1380 },
    { year: 2021, zone: 'soudanienne', rain_total: 570, temp_avg: 28, sow_month: 7, yield_kg: 1280 },
    { year: 2022, zone: 'soudanienne', rain_total: 510, temp_avg: 29, sow_month: 6, yield_kg: 1100 },
    { year: 2023, zone: 'soudanienne', rain_total: 650, temp_avg: 27, sow_month: 7, yield_kg: 1520 },
    { year: 2024, zone: 'soudanienne', rain_total: 580, temp_avg: 28, sow_month: 7, yield_kg: 1300 },
    { year: 2015, zone: 'casamançaise', rain_total: 900, temp_avg: 27, sow_month: 6, yield_kg: 1600 },
    { year: 2016, zone: 'casamançaise', rain_total: 1050, temp_avg: 26.5, sow_month: 6, yield_kg: 1900 },
    { year: 2017, zone: 'casamançaise', rain_total: 850, temp_avg: 28, sow_month: 6, yield_kg: 1400 },
    { year: 2018, zone: 'casamançaise', rain_total: 1100, temp_avg: 26, sow_month: 7, yield_kg: 2100 },
    { year: 2019, zone: 'casamançaise', rain_total: 780, temp_avg: 29, sow_month: 6, yield_kg: 1250 },
    { year: 2020, zone: 'casamançaise', rain_total: 980, temp_avg: 27, sow_month: 6, yield_kg: 1750 },
    { year: 2021, zone: 'casamançaise', rain_total: 920, temp_avg: 27.5, sow_month: 7, yield_kg: 1650 },
    { year: 2022, zone: 'casamançaise', rain_total: 870, temp_avg: 28, sow_month: 6, yield_kg: 1450 },
    { year: 2023, zone: 'casamançaise', rain_total: 1020, temp_avg: 26.5, sow_month: 7, yield_kg: 1850 },
    { year: 2024, zone: 'casamançaise', rain_total: 950, temp_avg: 27, sow_month: 7, yield_kg: 1700 }
  ],
  mil: [
    { year: 2015, zone: 'sahélienne', rain_total: 380, temp_avg: 29, sow_month: 7, yield_kg: 680 },
    { year: 2016, zone: 'sahélienne', rain_total: 420, temp_avg: 28.5, sow_month: 7, yield_kg: 820 },
    { year: 2017, zone: 'sahélienne', rain_total: 350, temp_avg: 30, sow_month: 7, yield_kg: 600 },
    { year: 2018, zone: 'sahélienne', rain_total: 470, temp_avg: 28, sow_month: 7, yield_kg: 920 },
    { year: 2019, zone: 'sahélienne', rain_total: 300, temp_avg: 31, sow_month: 6, yield_kg: 520 },
    { year: 2020, zone: 'sahélienne', rain_total: 440, temp_avg: 28.5, sow_month: 7, yield_kg: 880 },
    { year: 2021, zone: 'sahélienne', rain_total: 390, temp_avg: 29, sow_month: 7, yield_kg: 720 },
    { year: 2022, zone: 'sahélienne', rain_total: 360, temp_avg: 30.5, sow_month: 7, yield_kg: 650 },
    { year: 2023, zone: 'sahélienne', rain_total: 450, temp_avg: 28, sow_month: 7, yield_kg: 900 },
    { year: 2024, zone: 'sahélienne', rain_total: 410, temp_avg: 29, sow_month: 7, yield_kg: 780 },
    { year: 2015, zone: 'soudanienne', rain_total: 550, temp_avg: 28, sow_month: 6, yield_kg: 950 },
    { year: 2016, zone: 'soudanienne', rain_total: 620, temp_avg: 27, sow_month: 7, yield_kg: 1100 },
    { year: 2017, zone: 'soudanienne', rain_total: 500, temp_avg: 29, sow_month: 6, yield_kg: 850 },
    { year: 2018, zone: 'soudanienne', rain_total: 680, temp_avg: 27.5, sow_month: 7, yield_kg: 1250 },
    { year: 2019, zone: 'soudanienne', rain_total: 480, temp_avg: 30, sow_month: 6, yield_kg: 750 },
    { year: 2020, zone: 'soudanienne', rain_total: 600, temp_avg: 27.5, sow_month: 7, yield_kg: 1050 },
  ],
  mais: [
    { year: 2015, zone: 'soudanienne', rain_total: 550, temp_avg: 28, sow_month: 6, yield_kg: 1800 },
    { year: 2016, zone: 'soudanienne', rain_total: 620, temp_avg: 27, sow_month: 7, yield_kg: 2200 },
    { year: 2017, zone: 'soudanienne', rain_total: 500, temp_avg: 29, sow_month: 6, yield_kg: 1500 },
    { year: 2018, zone: 'soudanienne', rain_total: 680, temp_avg: 27.5, sow_month: 7, yield_kg: 2500 },
    { year: 2019, zone: 'soudanienne', rain_total: 480, temp_avg: 30, sow_month: 6, yield_kg: 1400 },
    { year: 2020, zone: 'soudanienne', rain_total: 600, temp_avg: 27.5, sow_month: 7, yield_kg: 2100 },
    { year: 2021, zone: 'casamançaise', rain_total: 920, temp_avg: 27.5, sow_month: 6, yield_kg: 2800 },
    { year: 2022, zone: 'casamançaise', rain_total: 870, temp_avg: 28, sow_month: 6, yield_kg: 2500 },
    { year: 2023, zone: 'casamançaise', rain_total: 1020, temp_avg: 26.5, sow_month: 7, yield_kg: 3200 },
    { year: 2024, zone: 'casamançaise', rain_total: 950, temp_avg: 27, sow_month: 7, yield_kg: 2900 },
  ],
  riz: [
    { year: 2015, zone: 'casamançaise', rain_total: 900, temp_avg: 27, sow_month: 7, yield_kg: 2800 },
    { year: 2016, zone: 'casamançaise', rain_total: 1050, temp_avg: 26.5, sow_month: 7, yield_kg: 3500 },
    { year: 2017, zone: 'casamançaise', rain_total: 850, temp_avg: 28, sow_month: 7, yield_kg: 2500 },
    { year: 2018, zone: 'casamançaise', rain_total: 1100, temp_avg: 26, sow_month: 8, yield_kg: 3800 },
    { year: 2019, zone: 'casamançaise', rain_total: 780, temp_avg: 29, sow_month: 7, yield_kg: 2200 },
    { year: 2020, zone: 'casamançaise', rain_total: 980, temp_avg: 27, sow_month: 7, yield_kg: 3200 },
    { year: 2021, zone: 'sahélienne', rain_total: 390, temp_avg: 29, sow_month: 8, yield_kg: 4500 },
    { year: 2022, zone: 'sahélienne', rain_total: 360, temp_avg: 30.5, sow_month: 8, yield_kg: 4200 },
    { year: 2023, zone: 'sahélienne', rain_total: 450, temp_avg: 28, sow_month: 7, yield_kg: 5000 },
    { year: 2024, zone: 'sahélienne', rain_total: 410, temp_avg: 29, sow_month: 8, yield_kg: 4800 },
  ]
};

// ============================================================
// 1. MULTIPLE LINEAR REGRESSION — Yield Prediction
// ============================================================

class MultipleLinearRegression {
  constructor() {
    this.coefficients = null;
    this.intercept = 0;
    this.r_squared = 0;
    this.features = [];
  }

  fit(X, y) {
    const n = X.length;
    const p = X[0].length;
    this.features = new Array(p);

    // Add bias column (intercept)
    const X_aug = X.map(row => [1, ...row]);
    const pAug = p + 1;

    // Normal equation: β = (X^T X)^{-1} X^T y
    const Xt = this._transpose(X_aug);
    const XtX = this._multiply(Xt, X_aug);
    const XtX_inv = this._invertMatrix(XtX);
    const Xty = this._multiplyVector(Xt, y);
    const beta = this._multiplyMatrixVector(XtX_inv, Xty);

    this.intercept = beta[0];
    this.coefficients = beta.slice(1);

    // Compute R²
    const y_mean = y.reduce((a, b) => a + b, 0) / n;
    const ss_tot = y.reduce((sum, yi) => sum + (yi - y_mean) ** 2, 0);
    const y_pred = X.map(row => this.predict(row));
    const ss_res = y.reduce((sum, yi, i) => sum + (yi - y_pred[i]) ** 2, 0);
    this.r_squared = 1 - (ss_res / ss_tot);

    return this;
  }

  predict(features) {
    let result = this.intercept;
    for (let i = 0; i < features.length; i++) {
      result += this.coefficients[i] * features[i];
    }
    return result;
  }

  _transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  _multiply(A, B) {
    const rows = A.length, cols = B[0].length, inner = B.length;
    const result = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        for (let k = 0; k < inner; k++)
          result[i][j] += A[i][k] * B[k][j];
    return result;
  }

  _multiplyVector(A, v) {
    return A.map(row => row.reduce((sum, a, i) => sum + a * v[i], 0));
  }

  _multiplyMatrixVector(A, v) {
    return A.map(row => row.reduce((sum, a, i) => sum + a * v[i], 0));
  }

  _invertMatrix(matrix) {
    const n = matrix.length;
    const aug = matrix.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++)
        if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

      const pivot = aug[i][i];
      if (Math.abs(pivot) < 1e-10) {
        aug[i][i] = 1e-10;
      }
      for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot || 1e-10;

      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) aug[k][j] -= factor * aug[i][j];
      }
    }

    return aug.map(row => row.slice(n));
  }
}

// ============================================================
// 2. GENETIC ALGORITHM — Crop Calendar Optimization
// ============================================================

class GeneticAlgorithm {
  constructor(config = {}) {
    this.populationSize = config.populationSize || 50;
    this.generations = config.generations || 100;
    this.mutationRate = config.mutationRate || 0.15;
    this.crossoverRate = config.crossoverRate || 0.8;
    this.elitismRate = config.elitismRate || 0.1;
    this.tournamentSize = config.tournamentSize || 3;
  }

  optimize(fitnessFunction, geneRanges) {
    let population = this._initPopulation(geneRanges);
    let bestSolution = null;
    let bestFitness = -Infinity;
    const fitnessHistory = [];

    for (let gen = 0; gen < this.generations; gen++) {
      const fitnesses = population.map(ind => fitnessFunction(ind));

      const genBest = Math.max(...fitnesses);
      const genBestIdx = fitnesses.indexOf(genBest);
      if (genBest > bestFitness) {
        bestFitness = genBest;
        bestSolution = [...population[genBestIdx]];
      }
      fitnessHistory.push({ generation: gen, bestFitness: genBest, avgFitness: fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length });

      const newPopulation = [];

      // Elitism
      const eliteCount = Math.ceil(this.populationSize * this.elitismRate);
      const sorted = fitnesses.map((f, i) => ({ f, i })).sort((a, b) => b.f - a.f);
      for (let i = 0; i < eliteCount; i++) {
        newPopulation.push([...population[sorted[i].i]]);
      }

      // Crossover + Mutation
      while (newPopulation.length < this.populationSize) {
        const parent1 = this._tournamentSelect(population, fitnesses);
        const parent2 = this._tournamentSelect(population, fitnesses);

        let child;
        if (Math.random() < this.crossoverRate) {
          child = this._crossover(parent1, parent2);
        } else {
          child = [...parent1];
        }

        child = this._mutate(child, geneRanges);
        newPopulation.push(child);
      }

      population = newPopulation;
    }

    return {
      solution: bestSolution,
      fitness: bestFitness,
      convergenceHistory: fitnessHistory,
      generations: this.generations,
      populationSize: this.populationSize
    };
  }

  _initPopulation(geneRanges) {
    return Array.from({ length: this.populationSize }, () =>
      geneRanges.map(([min, max]) => min + Math.random() * (max - min))
    );
  }

  _tournamentSelect(population, fitnesses) {
    let best = -1;
    let bestFit = -Infinity;
    for (let i = 0; i < this.tournamentSize; i++) {
      const idx = Math.floor(Math.random() * population.length);
      if (fitnesses[idx] > bestFit) {
        bestFit = fitnesses[idx];
        best = idx;
      }
    }
    return [...population[best]];
  }

  _crossover(parent1, parent2) {
    // BLX-alpha crossover (better for continuous optimization)
    const alpha = 0.5;
    return parent1.map((g, i) => {
      const min = Math.min(g, parent2[i]);
      const max = Math.max(g, parent2[i]);
      const range = max - min;
      return min - alpha * range + Math.random() * (1 + 2 * alpha) * range;
    });
  }

  _mutate(individual, geneRanges) {
    return individual.map((gene, i) => {
      if (Math.random() < this.mutationRate) {
        // Gaussian mutation
        const [min, max] = geneRanges[i];
        const sigma = (max - min) * 0.1;
        let newVal = gene + this._gaussianRandom() * sigma;
        return Math.max(min, Math.min(max, newVal));
      }
      return gene;
    });
  }

  _gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}

// ============================================================
// 3. BAYESIAN RISK NETWORK
// ============================================================

class BayesianRiskNetwork {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  addNode(name, priors) {
    this.nodes.set(name, { priors, posterior: { ...priors } });
  }

  addEdge(parent, child, cpt) {
    this.edges.push({ parent, child, cpt });
  }

  infer(evidence = {}) {
    // Forward propagation with evidence
    const results = {};

    for (const [name, node] of this.nodes) {
      if (evidence[name] !== undefined) {
        results[name] = evidence[name];
        continue;
      }

      let probability = node.priors.high || 0.5;

      // Update based on parent nodes
      for (const edge of this.edges) {
        if (edge.child === name) {
          const parentVal = evidence[edge.parent] ?? results[edge.parent] ?? node.priors.high;
          const cptEntry = edge.cpt;
          if (parentVal > 0.7) {
            probability = probability * (cptEntry.highGivenHigh || 0.8);
          } else if (parentVal < 0.3) {
            probability = probability * (cptEntry.highGivenLow || 0.2);
          } else {
            probability = probability * (cptEntry.highGivenMed || 0.5);
          }
        }
      }

      results[name] = Math.min(1, Math.max(0, probability));
    }

    return results;
  }
}

// ============================================================
// 4. K-NEAREST NEIGHBORS — Historical Pattern Matching
// ============================================================

class KNearestNeighbors {
  constructor(k = 5) {
    this.k = k;
    this.data = [];
    this.labels = [];
  }

  fit(X, y) {
    this.data = X;
    this.labels = y;
    // Compute feature normalization params
    this.mins = X[0].map((_, j) => Math.min(...X.map(row => row[j])));
    this.maxs = X[0].map((_, j) => Math.max(...X.map(row => row[j])));
  }

  predict(query) {
    const normalizedQuery = query.map((v, i) =>
      this.maxs[i] - this.mins[i] > 0 ? (v - this.mins[i]) / (this.maxs[i] - this.mins[i]) : 0
    );

    const distances = this.data.map((point, idx) => {
      const normalizedPoint = point.map((v, i) =>
        this.maxs[i] - this.mins[i] > 0 ? (v - this.mins[i]) / (this.maxs[i] - this.mins[i]) : 0
      );
      const dist = Math.sqrt(normalizedPoint.reduce((sum, v, i) => sum + (v - normalizedQuery[i]) ** 2, 0));
      return { dist, idx };
    });

    distances.sort((a, b) => a.dist - b.dist);
    const neighbors = distances.slice(0, this.k);

    // Distance-weighted average
    const totalWeight = neighbors.reduce((sum, n) => sum + 1 / (n.dist + 0.001), 0);
    const prediction = neighbors.reduce((sum, n) => sum + (this.labels[n.idx] / (n.dist + 0.001)), 0) / totalWeight;

    return {
      prediction: Math.round(prediction),
      confidence: 1 - (neighbors[0].dist / (distances[distances.length - 1].dist + 0.001)),
      neighbors: neighbors.map(n => ({
        distance: n.dist.toFixed(3),
        yield: this.labels[n.idx],
        weight: (1 / (n.dist + 0.001) / totalWeight).toFixed(3)
      }))
    };
  }
}

// ============================================================
// INTEGRATED ML PREDICTION SERVICE
// ============================================================

const trainedModels = {};
const knnModels = {};

function trainModels() {
  for (const [crop, data] of Object.entries(HISTORICAL_YIELDS)) {
    if (data.length < 5) continue;

    // Encode zone as numeric
    const zoneMap = { 'sahélienne': 0, 'soudanienne': 1, 'casamançaise': 2 };

    // Features: [rain_total, temp_avg, sow_month, zone_encoded]
    const X = data.map(d => [d.rain_total, d.temp_avg, d.sow_month, zoneMap[d.zone] || 0]);
    const y = data.map(d => d.yield_kg);

    // Train regression model
    const model = new MultipleLinearRegression();
    model.fit(X, y);
    trainedModels[crop] = model;

    // Train KNN model
    const knn = new KNearestNeighbors(3);
    knn.fit(X, y);
    knnModels[crop] = knn;
  }
}

// Train on module load
trainModels();

function predictYield(crop, zone, rainTotal, tempAvg, sowMonth) {
  const zoneMap = { 'sahélienne': 0, 'soudanienne': 1, 'casamançaise': 2 };
  const features = [rainTotal, tempAvg, sowMonth, zoneMap[zone] || 0];

  const results = { crop, zone, inputs: { rainTotal, tempAvg, sowMonth } };

  // Regression prediction
  if (trainedModels[crop]) {
    const model = trainedModels[crop];
    results.regression = {
      predicted_yield_kg: Math.max(0, Math.round(model.predict(features))),
      r_squared: model.r_squared.toFixed(4),
      coefficients: {
        intercept: model.intercept.toFixed(2),
        rain: model.coefficients[0]?.toFixed(4),
        temperature: model.coefficients[1]?.toFixed(4),
        sow_month: model.coefficients[2]?.toFixed(4),
        zone: model.coefficients[3]?.toFixed(4)
      },
      model_type: 'Ordinary Least Squares (OLS) Multiple Linear Regression'
    };
  }

  // KNN prediction
  if (knnModels[crop]) {
    const knnResult = knnModels[crop].predict(features);
    results.knn = {
      predicted_yield_kg: knnResult.prediction,
      confidence: (knnResult.confidence * 100).toFixed(1) + '%',
      k: 3,
      neighbors: knnResult.neighbors,
      model_type: 'K-Nearest Neighbors (distance-weighted)'
    };
  }

  // Ensemble: weighted average of both models
  if (results.regression && results.knn) {
    const regWeight = Math.min(0.7, results.regression.r_squared * 0.8);
    const knnWeight = 1 - regWeight;
    results.ensemble = {
      predicted_yield_kg: Math.round(
        results.regression.predicted_yield_kg * regWeight +
        results.knn.predicted_yield_kg * knnWeight
      ),
      method: 'Weighted ensemble (OLS + KNN)',
      weights: { regression: regWeight.toFixed(2), knn: knnWeight.toFixed(2) }
    };
  }

  return results;
}

function optimizeCropCalendar(crops, city, constraints = {}) {
  const cityData = SENEGAL_CITIES[city];
  if (!cityData) return null;

  const zone = cityData.zone;
  const availableMonths = 12;
  const parcels = constraints.parcels || 3;

  // Gene ranges: [sow_month for each crop on each parcel]
  const geneRanges = [];
  for (let i = 0; i < Math.min(crops.length, parcels); i++) {
    geneRanges.push([1, 12]); // sow month (continuous, will be rounded)
  }

  // Fitness function maximizes total predicted yield across parcels
  const fitnessFunction = (genes) => {
    let totalYield = 0;
    let penalty = 0;

    for (let i = 0; i < genes.length; i++) {
      const sowMonth = Math.round(genes[i]);
      const crop = crops[i % crops.length];
      const rainTotal = computeSeasonRain(sowMonth, zone);
      const tempAvg = getAvgTemp(sowMonth);

      const yieldPred = predictYield(crop, zone, rainTotal, tempAvg, sowMonth);
      totalYield += yieldPred.ensemble?.predicted_yield_kg || yieldPred.regression?.predicted_yield_kg || 0;

      // Penalty for overlapping crop cycles
      for (let j = 0; j < i; j++) {
        const otherMonth = Math.round(genes[j]);
        const overlap = Math.abs(sowMonth - otherMonth);
        if (overlap < 3 && overlap > 0) {
          penalty += 200;
        }
      }

      // Bonus for sowing in rainy season
      if (sowMonth >= 6 && sowMonth <= 8) {
        totalYield += 100;
      }
    }

    return totalYield - penalty;
  };

  const ga = new GeneticAlgorithm({
    populationSize: 50,
    generations: 80,
    mutationRate: 0.15,
    crossoverRate: 0.85
  });

  const result = ga.optimize(fitnessFunction, geneRanges);

  const calendar = result.solution.map((gene, i) => {
    const sowMonth = Math.round(Math.max(1, Math.min(12, gene)));
    const crop = crops[i % crops.length];
    const rainTotal = computeSeasonRain(sowMonth, zone);
    const tempAvg = getAvgTemp(sowMonth);
    const yieldPred = predictYield(crop, zone, rainTotal, tempAvg, sowMonth);

    return {
      parcel: i + 1,
      crop,
      sowMonth,
      sowMonthName: getMonthName(sowMonth),
      predictedYield: yieldPred.ensemble?.predicted_yield_kg || yieldPred.regression?.predicted_yield_kg,
      expectedRain: Math.round(rainTotal),
      avgTemp: tempAvg.toFixed(1)
    };
  });

  return {
    city,
    zone,
    optimization: {
      algorithm: 'Genetic Algorithm (GA)',
      parameters: {
        population_size: ga.populationSize,
        generations: ga.generations,
        mutation_rate: ga.mutationRate,
        crossover_type: 'BLX-alpha (α=0.5)',
        selection: 'Tournament (k=3)',
        elitism: '10%'
      },
      convergence: {
        initial_fitness: result.convergenceHistory[0]?.bestFitness.toFixed(0),
        final_fitness: result.fitness.toFixed(0),
        improvement: ((result.fitness - result.convergenceHistory[0]?.bestFitness) / Math.abs(result.convergenceHistory[0]?.bestFitness || 1) * 100).toFixed(1) + '%'
      }
    },
    calendar,
    totalPredictedYield: calendar.reduce((sum, c) => sum + (c.predictedYield || 0), 0),
    fitnessHistory: result.convergenceHistory.filter((_, i) => i % 10 === 0)
  };
}

function assessRiskBayesian(crop, city, month) {
  const cityData = SENEGAL_CITIES[city];
  if (!cityData) return null;

  const monthData = MONTH_DATA[month];
  const zone = cityData.zone;

  // Build Bayesian Network
  const bn = new BayesianRiskNetwork();

  // Root nodes (observable factors)
  const rainNorm = Math.min(1, (monthData.rain_mm || 0) / 200);
  const tempStress = Math.min(1, Math.max(0, (monthData.temp_max - 35) / 10));
  const humidityRisk = monthData.humidity > 80 ? 0.8 : monthData.humidity > 60 ? 0.4 : 0.1;

  bn.addNode('drought', { high: 1 - rainNorm });
  bn.addNode('heat_stress', { high: tempStress });
  bn.addNode('pest_pressure', { high: humidityRisk });
  bn.addNode('flood_risk', { high: rainNorm > 0.8 ? 0.7 : 0.1 });

  // Intermediate nodes
  bn.addNode('crop_failure', { high: 0.3 });
  bn.addNode('yield_loss', { high: 0.4 });

  // Edges with conditional probability tables
  bn.addEdge('drought', 'crop_failure', { highGivenHigh: 0.85, highGivenMed: 0.4, highGivenLow: 0.1 });
  bn.addEdge('heat_stress', 'crop_failure', { highGivenHigh: 0.7, highGivenMed: 0.3, highGivenLow: 0.05 });
  bn.addEdge('flood_risk', 'crop_failure', { highGivenHigh: 0.6, highGivenMed: 0.25, highGivenLow: 0.05 });
  bn.addEdge('pest_pressure', 'yield_loss', { highGivenHigh: 0.75, highGivenMed: 0.35, highGivenLow: 0.1 });
  bn.addEdge('drought', 'yield_loss', { highGivenHigh: 0.9, highGivenMed: 0.5, highGivenLow: 0.15 });

  // Run inference
  const posteriors = bn.infer({});

  // Compute overall risk score
  const overallRisk = (posteriors.crop_failure * 0.6 + posteriors.yield_loss * 0.4);
  const safetyScore = Math.round((1 - overallRisk) * 100);

  return {
    method: 'Bayesian Belief Network (BBN)',
    month: getMonthName(month),
    zone,
    factors: {
      drought_probability: (posteriors.drought * 100).toFixed(1) + '%',
      heat_stress_probability: (posteriors.heat_stress * 100).toFixed(1) + '%',
      pest_pressure_probability: (posteriors.pest_pressure * 100).toFixed(1) + '%',
      flood_risk_probability: (posteriors.flood_risk * 100).toFixed(1) + '%'
    },
    outcomes: {
      crop_failure_probability: (posteriors.crop_failure * 100).toFixed(1) + '%',
      yield_loss_probability: (posteriors.yield_loss * 100).toFixed(1) + '%'
    },
    safetyScore,
    recommendation: safetyScore >= 75 ? 'Risque acceptable — procéder au semis' :
                    safetyScore >= 50 ? 'Risque modéré — mesures préventives recommandées' :
                    'Risque élevé — reporter ou adapter la stratégie'
  };
}

// Utility functions
function computeSeasonRain(startMonth, zone) {
  const zoneMultiplier = zone === 'casamançaise' ? 1.5 : zone === 'soudanienne' ? 1.2 : 0.8;
  let total = 0;
  for (let i = 0; i < 4; i++) {
    const m = ((startMonth - 1 + i) % 12) + 1;
    total += (MONTH_DATA[m]?.rain_mm || 0) * zoneMultiplier;
  }
  return total;
}

function getAvgTemp(month) {
  const m = MONTH_DATA[month];
  return m ? (m.temp_max + m.temp_min) / 2 : 28;
}

function getMonthName(month) {
  const names = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return names[month] || '';
}

function getModelMetrics() {
  const metrics = {};
  for (const [crop, model] of Object.entries(trainedModels)) {
    metrics[crop] = {
      r_squared: model.r_squared.toFixed(4),
      n_samples: HISTORICAL_YIELDS[crop]?.length || 0,
      coefficients: {
        intercept: model.intercept.toFixed(2),
        rain_mm: model.coefficients[0]?.toFixed(4),
        temp_avg: model.coefficients[1]?.toFixed(4),
        sow_month: model.coefficients[2]?.toFixed(4),
        zone_encoded: model.coefficients[3]?.toFixed(4)
      }
    };
  }
  return metrics;
}

module.exports = {
  predictYield,
  optimizeCropCalendar,
  assessRiskBayesian,
  getModelMetrics,
  MultipleLinearRegression,
  GeneticAlgorithm,
  BayesianRiskNetwork,
  KNearestNeighbors
};
