'use client';

import { Location } from '@/types';
import { COLOR_MAP } from '@/lib/data';

interface DataTableProps {
  locations: Location[];
  locale?: 'es' | 'en';
}

export default function DataTable({ locations, locale = 'es' }: DataTableProps) {
  const title = locale === 'en' ? '█ DATA MATRIX — ACTIVE LOCATIONS' : '█ MATRIZ DE DATOS — UBICACIONES ACTIVAS';
  const sub = locale === 'en'
    ? '[VERIFIED WITH OFFICIAL REPORTS · CONTINUOUS UPDATES]'
    : '[BASE VERIFICADA CON REPORTES OFICIALES · ACTUALIZACIÓN CONTINUA]';
  const cols = locale === 'en'
    ? { location: 'Location', positive: 'Positive', deaths: 'Deaths', possible: 'Possible', level: 'Level', notes: 'Notes' }
    : { location: 'Ubicación', positive: 'Positivos', deaths: 'Muertes', possible: 'Posibles', level: 'Nivel', notes: 'Notas' };
  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-accent/20 text-accent border-accent';
      case 'high': return 'bg-warning/20 text-warning border-warning';
      case 'moderate': return 'bg-primary/20 text-primary border-primary';
      default: return 'bg-primary/20 text-primary border-primary';
    }
  };

  const getNumberClass = (level: string) => {
    switch (level) {
      case 'critical': return 'text-accent font-bold';
      case 'high': return 'text-warning font-bold';
      case 'moderate': return 'text-primary font-bold';
      default: return 'text-primary font-bold';
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{sub}</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{cols.location}</th>
              <th>{cols.positive}</th>
              <th>{cols.deaths}</th>
              <th>{cols.possible}</th>
              <th>{cols.level}</th>
              <th>{cols.notes}</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {locations.map((location, index) => (
              <tr key={index}>
                <td className="tcell-name">█ {location.name}</td>
                <td className={`n-${location.level}`}>{location.cases}</td>
                <td className={`n-${location.level}`}>{location.deaths}</td>
                <td>{location.possible}</td>
                <td><span className={`badge badge-${location.level}`}>{location.level.toUpperCase()}</span></td>
                <td style={{ fontSize: '.78rem' }}>{location.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
