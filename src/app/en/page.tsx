'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Map from '@/components/Map';
import NewsFeed from '@/components/NewsFeed';
import DataTable from '@/components/DataTable';
import Footer from '@/components/Footer';
import { StatsData } from '@/types';
import { BASE_LOCATIONS_EN } from '@/lib/data';
import { extractLocationsFromArticles, mergeLocationData } from '@/lib/locationExtractor';

export default function HomeEN() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLocations, setMapLocations] = useState(BASE_LOCATIONS_EN);
  const [dateFilter, setDateFilter] = useState(7);

  const fetchData = async (force = false) => {
    setLoading(true);
    try {
      const url = force ? '/api/stats?force=true' : '/api/stats';
      const response = await fetch(url);
      const result = await response.json();
      setData(result);

      if (result.articles && result.articles.length > 0) {
        const articleLocations = extractLocationsFromArticles(result.articles, dateFilter);
        const mergedLocations = mergeLocationData(BASE_LOCATIONS_EN, articleLocations);
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
    if (data && data.articles && data.articles.length > 0) {
      const articleLocations = extractLocationsFromArticles(data.articles, days);
      const mergedLocations = mergeLocationData(BASE_LOCATIONS_EN, articleLocations);
      setMapLocations(mergedLocations);
    }
  };

  const serverTime = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString('en-US') : undefined;

  return (
    <div className="container">
      <Header data={data} onUpdate={handleUpdate} loading={loading} locale="en" />

      <div className="section">
        <Map locations={mapLocations} locale="en" />
      </div>

      <NewsFeed
        data={data}
        onDateFilterChange={handleDateFilterChange}
        currentDateFilter={dateFilter}
        locale="en"
      />
      <DataTable locations={mapLocations} locale="en" />
      <Footer serverTime={serverTime} locale="en" />
    </div>
  );
}
