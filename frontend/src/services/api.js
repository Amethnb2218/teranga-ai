const API_BASE = import.meta.env.VITE_API_URL || '';

function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .then(res => { clearTimeout(timer); return res; })
    .catch(err => { clearTimeout(timer); throw err; });
}

async function fetchWithRetry(url, options = {}, { timeoutMs = 15000, retries = 2, delay = 1500 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok) return response;
      if (response.status >= 500 && attempt < retries) {
        await new Promise(r => setTimeout(r, delay * (attempt + 1)));
        continue;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay * (attempt + 1)));
    }
  }
}

export async function sendChatMessage(messages, language = 'fr') {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, language })
    }, 30000);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le conseiller met trop de temps à répondre. Veuillez réessayer.');
    }
    throw new Error('Impossible de joindre le conseiller. Vérifiez votre connexion puis réessayez.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Le conseiller est temporairement indisponible.');
  }
  if (!data?.message || typeof data.message !== 'string') {
    throw new Error('La réponse du conseiller est invalide. Veuillez réessayer.');
  }
  return data;
}

export async function fetchWeather(city) {
  const response = await fetchWithRetry(`${API_BASE}/api/weather/${city}`);
  return response.json();
}

export async function fetchMarketPrices(city) {
  const response = await fetchWithRetry(`${API_BASE}/api/market?city=${city}`);
  return response.json();
}

export async function fetchMarketTrends() {
  const response = await fetchWithRetry(`${API_BASE}/api/market/trends`);
  return response.json();
}

export async function fetchNews() {
  const response = await fetchWithRetry(`${API_BASE}/api/news`);
  return response.json();
}

export async function fetchPrediction(crop, city) {
  const response = await fetchWithRetry(`${API_BASE}/api/predict/${crop}/${city}`, {}, { timeoutMs: 20000 });
  return response.json();
}

export async function fetchAvailableCrops() {
  const response = await fetchWithRetry(`${API_BASE}/api/predict/crops`);
  return response.json();
}

export async function fetchYieldPrediction(crop, city, month) {
  const response = await fetchWithRetry(`${API_BASE}/api/ml/predict-yield/${crop}/${city}?month=${month}`, {}, { timeoutMs: 20000 });
  return response.json();
}

export async function fetchOptimizeCalendar(crops, city, parcels = 3) {
  const response = await fetchWithRetry(`${API_BASE}/api/ml/optimize-calendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crops, city, parcels })
  }, { timeoutMs: 15000 });
  return response.json();
}

export async function fetchMLMetrics() {
  const response = await fetchWithRetry(`${API_BASE}/api/ml/metrics`);
  return response.json();
}

export async function fetchBayesianRisk(crop, city, month) {
  const response = await fetchWithRetry(`${API_BASE}/api/ml/risk/${crop}/${city}/${month}`);
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

export async function fetchAlerts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetchWithRetry(`${API_BASE}/api/alerts${query ? '?' + query : ''}`);
  return response.json();
}

export async function fetchAlertsSummary() {
  const response = await fetchWithRetry(`${API_BASE}/api/alerts/summary`);
  return response.json();
}

export async function fetchCommunity(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetchWithRetry(`${API_BASE}/api/community${query ? '?' + query : ''}`);
  return response.json();
}

export async function fetchCommunityGroups() {
  const response = await fetchWithRetry(`${API_BASE}/api/community/groups`);
  return response.json();
}

export async function fetchCommunityStats() {
  const response = await fetchWithRetry(`${API_BASE}/api/community/stats`);
  return response.json();
}
