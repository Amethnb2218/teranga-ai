import { useState, useEffect } from 'react';
import { fetchWeather, fetchMarketPrices, fetchMarketTrends } from '../services/api';

export function useDashboard() {
  const [city, setCity] = useState('dakar');
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [city]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherData, marketData, trendsData] = await Promise.all([
        fetchWeather(city),
        fetchMarketPrices(city),
        fetchMarketTrends()
      ]);
      setWeather(weatherData);
      setMarket(marketData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { city, setCity, weather, market, trends, loading };
}
