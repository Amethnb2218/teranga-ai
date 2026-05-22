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
