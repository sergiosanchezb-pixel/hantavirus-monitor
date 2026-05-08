'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Location } from '@/types';
import { COLOR_MAP } from '@/lib/data';

// Importar Leaflet dinámicamente para evitar SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapProps {
  locations: Location[];
  locale?: 'es' | 'en';
}

const mapTx = {
  es: {
    title: '█ MAPA TÁCTICO GLOBAL',
    sub: '[DISTRIBUCIÓN EPIDEMIOLÓGICA • ZOOM INTERACTIVO • DATOS VERIFICADOS]',
    positive: 'Positivos',
    deaths: 'Muertes',
    possible: 'Posibles',
    critical: 'CRÍTICO',
    criticalDesc: '2+ positivos · Muertes confirmadas',
    high: 'ALTO RIESGO',
    highDesc: '1+ positivos · Propagación secundaria',
    moderate: 'MODERADO',
    moderateDesc: 'Casos vinculados · Bajo riesgo',
  },
  en: {
    title: '█ GLOBAL TACTICAL MAP',
    sub: '[EPIDEMIOLOGICAL DISTRIBUTION • INTERACTIVE ZOOM • VERIFIED DATA]',
    positive: 'Positive',
    deaths: 'Deaths',
    possible: 'Possible',
    critical: 'CRITICAL',
    criticalDesc: '2+ positive · Confirmed deaths',
    high: 'HIGH RISK',
    highDesc: '1+ positive · Secondary spread',
    moderate: 'MODERATE',
    moderateDesc: 'Linked cases · Low risk',
  },
};

export default function Map({ locations, locale = 'es' }: MapProps) {
  const tx = mapTx[locale];
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Importar CSS de Leaflet solo en el cliente
    if (typeof window !== 'undefined') {
      import('leaflet/dist/leaflet.css');
    }
  }, []);

  const getRadius = (level: string) => {
    switch (level) {
      case 'critical': return 18;
      case 'high': return 13;
      case 'moderate': return 9;
      default: return 9;
    }
  };

  return (
    <>
      <h2 className="section-title">{tx.title}</h2>
      <p className="section-sub">{tx.sub}</p>
      
      <div id="map">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={18}
            style={{ height: '620px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='© OpenStreetMap'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              maxZoom={18}
            />
            
            {locations.map((location, index) => (
              <CircleMarker
                key={index}
                center={[location.lat, location.lng]}
                radius={getRadius(location.level)}
                fillColor={COLOR_MAP[location.level]}
                color="#ffffff"
                weight={2}
                opacity={1}
                fillOpacity={0.85}
              >
                <Popup>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", minWidth: '210px' }}>
                    <div 
                      style={{ fontWeight: '700', marginBottom: '8px', fontSize: '12px', color: COLOR_MAP[location.level] }}
                    >
                      █ {location.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#333', lineHeight: '2' }}>
                      <b>{tx.positive}:</b> {location.cases}<br />
                      <b>{tx.deaths}:</b> {location.deaths}<br />
                      <b>{tx.possible}:</b> {location.possible}<br />
                      <hr style={{ margin: '6px 0', borderColor: '#ddd' }} />
                      <span style={{ color: '#555' }}>{location.notes}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ff0055' }}></div>
          <div className="legend-text">
            <h3>{tx.critical}</h3>
            <p>{tx.criticalDesc}</p>
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ff9500' }}></div>
          <div className="legend-text">
            <h3>{tx.high}</h3>
            <p>{tx.highDesc}</p>
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#00ff88' }}></div>
          <div className="legend-text">
            <h3>{tx.moderate}</h3>
            <p>{tx.moderateDesc}</p>
          </div>
        </div>
      </div>
    </>
  );
}
