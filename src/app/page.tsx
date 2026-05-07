'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Map from '@/components/Map';
import NewsFeed from '@/components/NewsFeed';
import DataTable from '@/components/DataTable';
import Footer from '@/components/Footer';
import { StatsData } from '@/types';
import { BASE_LOCATIONS } from '@/lib/data';
import { extractLocationsFromArticles, mergeLocationData } from '@/lib/locationExtractor';

export default function Home() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLocations, setMapLocations] = useState(BASE_LOCATIONS);
  const [dateFilter, setDateFilter] = useState(7); // Por defecto: última semana

  const fetchData = async (force = false) => {
    setLoading(true);
    try {
      const url = force ? '/api/stats?force=true' : '/api/stats';
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      
      // Extraer ubicaciones de los artículos y actualizar el mapa
      if (result.articles && result.articles.length > 0) {
        const articleLocations = extractLocationsFromArticles(result.articles, dateFilter);
        const mergedLocations = mergeLocationData(BASE_LOCATIONS, articleLocations);
        setMapLocations(mergedLocations);
      }
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

  const handleDateFilterChange = (days: number) => {
    setDateFilter(days);
    // Actualizar el mapa con el nuevo filtro sin recargar datos
    if (data && data.articles && data.articles.length > 0) {
      const articleLocations = extractLocationsFromArticles(data.articles, days);
      const mergedLocations = mergeLocationData(BASE_LOCATIONS, articleLocations);
      setMapLocations(mergedLocations);
    }
  };

  const serverTime = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString('es-ES') : undefined;

  return (
    <div className="container">
      <Header data={data} onUpdate={handleUpdate} loading={loading} />
      
      <div className="section">
        <Map locations={mapLocations} />
      </div>

      <NewsFeed 
        data={data} 
        onDateFilterChange={handleDateFilterChange} 
        currentDateFilter={dateFilter} 
      />
      <DataTable locations={mapLocations} />
      <Footer serverTime={serverTime} />
    </div>
  );
}
