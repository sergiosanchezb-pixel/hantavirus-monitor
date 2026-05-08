'use client';

import Link from 'next/link';
import { StatsData } from '@/types';
import { BASE_LOCATIONS } from '@/lib/data';

interface HeaderProps {
  data: StatsData | null;
  onUpdate: () => void;
  loading: boolean;
  locale?: 'es' | 'en';
}

const t = {
  es: {
    subtitle: 'Monitoreo en tiempo real de brotes de hantavirus a nivel global. Ayúdanos a mejorar el sitio: hantanow@gmail.com',
    ops: 'SALA DE OPERACIONES GLOBAL',
    sources: 'FUENTES OFICIALES EN TIEMPO REAL',
    updateBtn: 'ACTUALIZAR FUENTES EN VIVO',
    scanning: 'ESCANEANDO FUENTES...',
    lastSync: 'ÚLTIMA SYNC',
    cases: 'Casos Confirmados',
    deaths: 'Muertes',
    alerts: 'Alertas Activas',
    activeSources: 'Fuentes Activas',
    locale: 'es-ES',
  },
  en: {
    subtitle: 'Real-time monitoring of hantavirus outbreaks worldwide. Help us improve the site: hantanow@gmail.com',
    ops: 'GLOBAL OPERATIONS CENTER',
    sources: 'REAL-TIME OFFICIAL SOURCES',
    updateBtn: 'UPDATE LIVE SOURCES',
    scanning: 'SCANNING SOURCES...',
    lastSync: 'LAST SYNC',
    cases: 'Confirmed Cases',
    deaths: 'Deaths',
    alerts: 'Active Alerts',
    activeSources: 'Active Sources',
    locale: 'en-US',
  },
};

export default function Header({ data, onUpdate, loading, locale = 'es' }: HeaderProps) {
  const tx = t[locale];
  const stats = data?.stats;
  const totalCases = stats?.confirmedCases ?? BASE_LOCATIONS.reduce((a, b) => a + b.cases, 0);
  const totalDeaths = stats?.deaths ?? BASE_LOCATIONS.reduce((a, b) => a + b.deaths, 0);
  const activeAlerts = stats?.activeAlerts ?? '–';
  const activeSources = stats?.sourcesOk ? `${stats.sourcesOk}/${data?.sources?.length ?? 3}` : '–';

  const lastUpdate = data?.updatedAt ? new Date(data.updatedAt) : null;
  const lastUpdateText = lastUpdate
    ? `${lastUpdate.toLocaleTimeString(tx.locale)} · ${lastUpdate.toLocaleDateString(tx.locale)}`
    : '–';

  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <Link
          href="/"
          title="Español"
          style={{
            fontSize: '1.6rem', textDecoration: 'none', lineHeight: 1,
            opacity: locale === 'es' ? 1 : 0.4,
            borderBottom: locale === 'es' ? '2px solid #00ff88' : '2px solid transparent',
            paddingBottom: '2px',
          }}
        >
          🇲🇽
        </Link>
        <Link
          href="/en"
          title="English"
          style={{
            fontSize: '1.6rem', textDecoration: 'none', lineHeight: 1,
            opacity: locale === 'en' ? 1 : 0.4,
            borderBottom: locale === 'en' ? '2px solid #00ff88' : '2px solid transparent',
            paddingBottom: '2px',
          }}
        >
          🇬🇧
        </Link>
      </div>

      <h1>HANTAMONITOR</h1>
      <p className="subtitle">{tx.subtitle}</p>
      <p>
        <span className="live-dot"></span>
        {tx.ops} &nbsp;•&nbsp; {tx.sources}
      </p>

      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
        <button
          onClick={onUpdate}
          disabled={loading}
          className="btn-update"
        >
          {tx.updateBtn}
        </button>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>{tx.scanning}</span>
          </div>
        )}

        <div className="last-update">
          {tx.lastSync}: {lastUpdateText}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{totalCases}</div>
          <div className="stat-label">{tx.cases}</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{totalDeaths}</div>
          <div className="stat-label">{tx.deaths}</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{activeAlerts}</div>
          <div className="stat-label">{tx.alerts}</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{activeSources}</div>
          <div className="stat-label">{tx.activeSources}</div>
        </div>
      </div>
    </div>
  );
}
