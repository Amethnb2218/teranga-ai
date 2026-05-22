import { useState, useEffect } from 'react';
import { fetchWeather, fetchMarketPrices, fetchMarketTrends, fetchNews } from '../services/api';

export function useDashboard() {
  const [city, setCity] = useState('dakar');
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState(null);
  const [trends, setTrends] = useState(null);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [city]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherData, marketData, trendsData, newsData] = await Promise.all([
        fetchWeather(city),
        fetchMarketPrices(city),
        fetchMarketTrends(),
        fetchNews().catch(() => ({ news: [] }))
      ]);
      setWeather(weatherData);
      setMarket(marketData);
      setTrends(trendsData);
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { city, setCity, weather, market, trends, news, loading };
}
