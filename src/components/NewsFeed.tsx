'use client';

import { Article, StatsData } from '@/types';
import { ICON_MAP, LINK_MAP } from '@/lib/data';
import DateFilter from './DateFilter';

const safeIconMap = ICON_MAP as Record<string, string>;
const safeLinkMap = LINK_MAP as Record<string, string>;

interface NewsFeedProps {
  data: StatsData | null;
  onDateFilterChange?: (days: number) => void;
  currentDateFilter?: number;
}

export default function NewsFeed({ data, onDateFilterChange, currentDateFilter = 7 }: NewsFeedProps) {
  const classifyItem = (item: Article): 'critical' | 'high' | 'moderate' => {
    const text = (item.title + ' ' + item.description).toLowerCase();
    if (text.includes('death') || text.includes('fatal') || text.includes('muerte') || text.includes('died')) {
      return 'critical';
    }
    const age = (Date.now() - new Date(item.pubDate).getTime()) / 86400000;
    if (text.includes('confirmed') || text.includes('outbreak') || text.includes('confirmado') || age < 4) {
      return 'high';
    }
    return 'moderate';
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return '–';
      }
      
      // Formato personalizado para evitar problemas de localización
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      return date.toLocaleDateString('es-ES', options).toUpperCase();
    } catch {
      return '–';
    }
  };

  const renderFeedStats = () => {
    if (!data) return null;
    
    const ok = data.stats?.sourcesOk ?? '–';
    const total = data.sources?.length ?? '–';
    const alerts = data.stats?.activeAlerts ?? 0;
    const cache = data.fromCache
      ? <div className="feed-stat info">CACHE: HACE {data.cacheAgeMinutes} MIN</div>
      : <div className="feed-stat">DATOS FRESCOS DEL SERVIDOR</div>;

    return (
      <div className="feed-stats">
        <div className="feed-stat">[OK] FUENTES ACTIVAS: {ok}/{total}</div>
        <div className="feed-stat">█ ALERTAS: {alerts}</div>
        {cache}
      </div>
    );
  };

  const renderNews = () => {
    let articles = data?.articles || [];
    
    // Aplicar filtro por días si está configurado
    if (currentDateFilter > 0) {
      const now = Date.now();
      articles = articles.filter(article => {
        const articleAge = (now - new Date(article.pubDate).getTime()) / (1000 * 60 * 60 * 24);
        return articleAge <= currentDateFilter;
      });
    }
    
    if (!articles.length) {
      return (
        <div className="empty-state">
          [ NO SE ENCONTRARON ALERTAS DE HANTAVIRUS EN LOS FEEDS ACTUALES ]<br />
          <span style={{ fontSize: '.78rem' }}>Intenta de nuevo en unos minutos o consulta las fuentes directamente</span>
        </div>
      );
    }

    return articles.map((item, index) => {
      const cls = classifyItem(item);
      const desc = (item.description || '').substring(0, 280) + (item.description?.length > 280 ? '…' : '');
      
      return (
        <div
          key={index}
          className={`news-item ${cls}`}
        >
          <div className="news-date">█ {formatDate(item.pubDate)}</div>
          <div className="news-title">█ {item.title}</div>
          <span className="news-badge">█ {item.source}</span>
          <div className="news-desc">→ {desc}</div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener"
            className="news-link"
          >
            █ VER PUBLICACIÓN ORIGINAL
          </a>
        </div>
      );
    });
  };

  const renderSources = () => {
    const sources = data?.sources || [];
    const list = sources.length ? sources : [
      { name: 'OMS', status: 'loading' as const },
      { name: 'CDC', status: 'loading' as const },
      { name: 'ProMED', status: 'loading' as const },
      { name: 'NewsAPI', status: 'loading' as const }
    ];

    return list.map((source, index) => {
      let statusHtml;
      if (source.status === 'loading') {
        statusHtml = <span className="src-status src-loading">[CARGANDO] CONSULTANDO...</span>;
      } else if (source.status === 'ok') {
        statusHtml = <span className="src-status src-ok">[OK] ACTIVA · {source.count} artículos</span>;
      } else {
        statusHtml = <span className="src-status src-err">[ERROR] {source.error || 'Error de conexión'}</span>;
      }

      return (
        <div key={index} className="source-card">
          <div className="source-icon">{safeIconMap[source.name] || '[RSS]'}</div>
          <div className="source-name">█ {source.name}</div>
          <div className="source-desc">→ Feed RSS oficial · Filtrado por hantavirus</div>
          {statusHtml}<br />
          <a
            href={safeLinkMap[source.name] || '#'}
            target="_blank"
            rel="noopener"
            className="source-link"
          >
            █ IR A FUENTE OFICIAL
          </a>
        </div>
      );
    });
  };

  return (
    <div className="section">
      <h2 className="section-title">█ FEED EN VIVO — FUENTES OFICIALES</h2>
      <p className="section-sub">[OMS · CDC · ProMED · NewsAPI · FILTRADO POR HANTAVIRUS · TIEMPO REAL]</p>

      {onDateFilterChange && (
        <div style={{ marginBottom: '1.5rem' }}>
          <DateFilter 
            onFilterChange={onDateFilterChange} 
            currentFilter={currentDateFilter} 
          />
        </div>
      )}

      <div className="info-box">
        <strong>ℹ️ Origen de datos:</strong> Este feed consulta en tiempo real el backend propio de HantaMonitor
        que hace scraping de OMS (Disease Outbreak News), CDC (HAN + MMWR), ProMED Mail y NewsAPI.org.
        Los artículos son filtrados automáticamente por palabras clave de hantavirus y actualizados cada 30 minutos en el servidor.
      </div>

      {renderFeedStats()}
      <div id="news-feed" className="news-feed">
        {renderNews()}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 className="section-title">█ RED DE FUENTES — ESTADO EN TIEMPO REAL</h2>
        <p className="section-sub">[CONEXIÓN DIRECTA AL BACKEND · STATUS POR FUENTE · SCRAPERS ACTIVOS]</p>
        <div id="sources-container" className="sources-grid">
          {renderSources()}
        </div>
      </div>
    </div>
  );
}
