'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Map from '@/components/Map';
import NewsFeed from '@/components/NewsFeed';
import DataTable from '@/components/DataTable';
import Footer from '@/components/Footer';
import { StatsData } from '@/types';
import { BASE_LOCATIONS } from '@/lib/data';

export default function Home() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (force = false) => {
    setLoading(true);
    try {
      const url = force ? '/api/stats?force=true' : '/api/stats';
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    fetchData(true);
  };

  const serverTime = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString('es-ES') : undefined;

  return (
    <div className="container">
      <Header data={data} onUpdate={handleUpdate} loading={loading} />
      
      <div className="section">
        <Map locations={BASE_LOCATIONS} />
      </div>

      <NewsFeed data={data} />
      <DataTable locations={BASE_LOCATIONS} />
      <Footer serverTime={serverTime} />
    </div>
  );
}
