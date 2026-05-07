'use client';

import { useState } from 'react';
import { StatsData } from '@/types';
import { BASE_LOCATIONS } from '@/lib/data';

interface HeaderProps {
  data: StatsData | null;
  onUpdate: () => void;
  loading: boolean;
}

export default function Header({ data, onUpdate, loading }: HeaderProps) {
  const stats = data?.stats;
  const totalCases = stats?.confirmedCases ?? BASE_LOCATIONS.reduce((a, b) => a + b.cases, 0);
  const totalDeaths = stats?.deaths ?? BASE_LOCATIONS.reduce((a, b) => a + b.deaths, 0);
  const activeAlerts = stats?.activeAlerts ?? '–';
  const activeSources = stats?.sourcesOk ? `${stats.sourcesOk}/${data?.sources?.length ?? 3}` : '–';

  const lastUpdate = data?.updatedAt ? new Date(data.updatedAt) : null;
  const lastUpdateText = lastUpdate 
    ? `${lastUpdate.toLocaleTimeString('es-ES')} · ${lastUpdate.toLocaleDateString('es-ES')}`
    : '–';

  return (
    <div className="header">
      <h1>🌍 HANTAMONITOR</h1>
      <p>
        <span className="live-dot"></span>
        SALA DE OPERACIONES GLOBAL &nbsp;•&nbsp; FUENTES OFICIALES EN TIEMPO REAL
      </p>

      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
        <button
          onClick={onUpdate}
          disabled={loading}
          className="btn-update"
        >
          🔄 ACTUALIZAR FUENTES EN VIVO
        </button>
        
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>ESCANEANDO FUENTES...</span>
          </div>
        )}
        
        <div className="last-update">
          ÚLTIMA SYNC: {lastUpdateText}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{totalCases}</div>
          <div className="stat-label">Casos Confirmados</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{totalDeaths}</div>
          <div className="stat-label">Muertes</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{activeAlerts}</div>
          <div className="stat-label">Alertas Activas</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{activeSources}</div>
          <div className="stat-label">Fuentes Activas</div>
        </div>
      </div>
    </div>
  );
}
