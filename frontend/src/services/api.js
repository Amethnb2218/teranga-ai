const API_BASE = import.meta.env.VITE_API_URL || '';

export async function sendChatMessage(messages, language = 'fr') {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, language })
  });
  if (!response.ok) throw new Error('Network error');
  return response.json();
}

export async function fetchWeather(city) {
  const response = await fetch(`${API_BASE}/api/weather/${city}`);
  if (!response.ok) throw new Error('Weather fetch failed');
  return response.json();
}

export async function fetchMarketPrices(city) {
  const response = await fetch(`${API_BASE}/api/market?city=${city}`);
  if (!response.ok) throw new Error('Market fetch failed');
  return response.json();
}

export async function fetchMarketTrends() {
  const response = await fetch(`${API_BASE}/api/market/trends`);
  if (!response.ok) throw new Error('Trends fetch failed');
  return response.json();
}

export async function fetchNews() {
  const response = await fetch(`${API_BASE}/api/news`);
  if (!response.ok) throw new Error('News fetch failed');
  return response.json();
}

export async function fetchPrediction(crop, city) {
  const response = await fetch(`${API_BASE}/api/predict/${crop}/${city}`);
  if (!response.ok) throw new Error('Prediction fetch failed');
  return response.json();
}

export async function fetchAvailableCrops() {
  const response = await fetch(`${API_BASE}/api/predict/crops`);
  if (!response.ok) throw new Error('Crops fetch failed');
  return response.json();
}

export async function fetchYieldPrediction(crop, city, month) {
  const response = await fetch(`${API_BASE}/api/ml/predict-yield/${crop}/${city}?month=${month}`);
  if (!response.ok) throw new Error('ML prediction failed');
  return response.json();
}

export async function fetchOptimizeCalendar(crops, city, parcels = 3) {
  const response = await fetch(`${API_BASE}/api/ml/optimize-calendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crops, city, parcels })
  });
  if (!response.ok) throw new Error('Optimization failed');
  return response.json();
}

export async function fetchMLMetrics() {
  const response = await fetch(`${API_BASE}/api/ml/metrics`);
  if (!response.ok) throw new Error('Metrics fetch failed');
  return response.json();
}

export async function fetchBayesianRisk(crop, city, month) {
  const response = await fetch(`${API_BASE}/api/ml/risk/${crop}/${city}/${month}`);
  if (!response.ok) throw new Error('Risk fetch failed');
  return response.json();
}

export async function transcribeAudio(audioBase64, language = 'fr') {
  const response = await fetch(`${API_BASE}/api/speech/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: audioBase64, language })
  });
  if (!response.ok) throw new Error('Transcription failed');
  return response.json();
}
