import { useState, useEffect } from 'react';
import { fetchWeather, fetchMarketPrices, fetchMarketTrends, fetchNews } from '../services/api';

export function useDashboard() {
  const [city, setCity] = useState('dakar');
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState(null);
  const [trends, setTrends] = useState(null);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [city]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      fetchWeather(city),
      fetchMarketPrices(city),
      fetchMarketTrends(),
      fetchNews()
    ]);

    const [weatherRes, marketRes, trendsRes, newsRes] = results;

    if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value);
    if (marketRes.status === 'fulfilled') setMarket(marketRes.value);
    if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value);
    if (newsRes.status === 'fulfilled') setNews(newsRes.value);

    const allFailed = results.every(r => r.status === 'rejected');
    if (allFailed) {
      setError('Le serveur démarre, veuillez patienter 30s puis actualiser.');
    }

    setLoading(false);
  };

  return { city, setCity, weather, market, trends, news, loading, error };
}
