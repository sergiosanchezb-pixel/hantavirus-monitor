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
  locale?: 'es' | 'en';
}

const tx = {
  es: {
    feedTitle: '█ FEED EN VIVO — FUENTES OFICIALES',
    feedSub: '[OMS · CDC · ProMED · NewsAPI · FILTRADO POR HANTAVIRUS · TIEMPO REAL]',
    infoOrigin: 'Origen de datos:',
    infoBody: 'Este feed consulta en tiempo real el backend propio de HantaMonitor que hace scraping de OMS (Disease Outbreak News), CDC (HAN + MMWR), ProMED Mail y NewsAPI.org. Los artículos son filtrados automáticamente por palabras clave de hantavirus y actualizados cada 30 minutos en el servidor.',
    activeSources: 'FUENTES ACTIVAS',
    alerts: 'ALERTAS',
    cachePrefix: 'CACHE: HACE',
    cacheMin: 'MIN',
    freshData: 'DATOS FRESCOS DEL SERVIDOR',
    noAlerts: '[ NO SE ENCONTRARON ALERTAS DE HANTAVIRUS EN LOS FEEDS ACTUALES ]',
    noAlertsSub: 'Intenta de nuevo en unos minutos o consulta las fuentes directamente',
    viewPub: '█ VER PUBLICACIÓN ORIGINAL',
    sourceDesc: '→ Feed RSS oficial · Filtrado por hantavirus',
    goSource: '█ IR A FUENTE OFICIAL',
    loading: '[CARGANDO] CONSULTANDO...',
    okActive: 'ACTIVA',
    articles: 'artículos',
    connErr: 'Error de conexión',
    netTitle: '█ RED DE FUENTES — ESTADO EN TIEMPO REAL',
    netSub: '[CONEXIÓN DIRECTA AL BACKEND · STATUS POR FUENTE · SCRAPERS ACTIVOS]',
    dateLocale: 'es-ES',
  },
  en: {
    feedTitle: '█ LIVE FEED — OFFICIAL SOURCES',
    feedSub: '[WHO · CDC · ProMED · NewsAPI · FILTERED BY HANTAVIRUS · REAL TIME]',
    infoOrigin: 'Data source:',
    infoBody: 'This feed queries the HantaMonitor backend in real time, which scrapes WHO (Disease Outbreak News), CDC (HAN + MMWR), ProMED Mail, and NewsAPI.org. Articles are automatically filtered by hantavirus keywords and updated every 30 minutes on the server.',
    activeSources: 'ACTIVE SOURCES',
    alerts: 'ALERTS',
    cachePrefix: 'CACHE:',
    cacheMin: 'MIN AGO',
    freshData: 'FRESH SERVER DATA',
    noAlerts: '[ NO HANTAVIRUS ALERTS FOUND IN CURRENT FEEDS ]',
    noAlertsSub: 'Try again in a few minutes or check the sources directly',
    viewPub: '█ VIEW ORIGINAL PUBLICATION',
    sourceDesc: '→ Official RSS feed · Filtered by hantavirus',
    goSource: '█ GO TO OFFICIAL SOURCE',
    loading: '[LOADING] QUERYING...',
    okActive: 'ACTIVE',
    articles: 'articles',
    connErr: 'Connection error',
    netTitle: '█ SOURCE NETWORK — REAL-TIME STATUS',
    netSub: '[DIRECT BACKEND CONNECTION · SOURCE STATUS · ACTIVE SCRAPERS]',
    dateLocale: 'en-US',
  },
};

export default function NewsFeed({ data, onDateFilterChange, currentDateFilter = 7, locale = 'es' }: NewsFeedProps) {
  const l = tx[locale];

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
      if (isNaN(date.getTime())) return '–';
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return date.toLocaleDateString(l.dateLocale, options).toUpperCase();
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
      ? <div className="feed-stat info">{l.cachePrefix} {data.cacheAgeMinutes} {l.cacheMin}</div>
      : <div className="feed-stat">{l.freshData}</div>;

    return (
      <div className="feed-stats">
        <div className="feed-stat">[OK] {l.activeSources}: {ok}/{total}</div>
        <div className="feed-stat">█ {l.alerts}: {alerts}</div>
        {cache}
      </div>
    );
  };

  const renderNews = () => {
    let articles = data?.articles || [];
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
          {l.noAlerts}<br />
          <span style={{ fontSize: '.78rem' }}>{l.noAlertsSub}</span>
        </div>
      );
    }

    return articles.map((item, index) => {
      const cls = classifyItem(item);
      const desc = (item.description || '').substring(0, 280) + (item.description?.length > 280 ? '…' : '');
      return (
        <div key={index} className={`news-item ${cls}`}>
          <div className="news-date">█ {formatDate(item.pubDate)}</div>
          <div className="news-title">█ {item.title}</div>
          <span className="news-badge">█ {item.source}</span>
          <div className="news-desc">→ {desc}</div>
          <a href={item.link} target="_blank" rel="noopener" className="news-link">
            {l.viewPub}
          </a>
        </div>
      );
    });
  };

  const displaySourceName = (name: string) =>
    locale === 'en' && name === 'OMS' ? 'WHO' : name;

  const renderSources = () => {
    const sources = data?.sources || [];
    const placeholderName = locale === 'en' ? 'WHO' : 'OMS';
    const list = sources.length ? sources : [
      { name: placeholderName, status: 'loading' as const },
      { name: 'CDC', status: 'loading' as const },
      { name: 'ProMED', status: 'loading' as const },
      { name: 'NewsAPI', status: 'loading' as const },
    ];

    return list.map((source, index) => {
      let statusHtml;
      if (source.status === 'loading') {
        statusHtml = <span className="src-status src-loading">{l.loading}</span>;
      } else if (source.status === 'ok') {
        statusHtml = <span className="src-status src-ok">[OK] {l.okActive} · {source.count} {l.articles}</span>;
      } else {
        statusHtml = <span className="src-status src-err">[ERROR] {source.error || l.connErr}</span>;
      }

      const shownName = displaySourceName(source.name);
      const iconKey = source.name === 'WHO' ? 'OMS' : source.name;

      return (
        <div key={index} className="source-card">
          <div className="source-icon">{safeIconMap[iconKey] || '[RSS]'}</div>
          <div className="source-name">█ {shownName}</div>
          <div className="source-desc">{l.sourceDesc}</div>
          {statusHtml}<br />
          <a href={safeLinkMap[iconKey] || '#'} target="_blank" rel="noopener" className="source-link">
            {l.goSource}
          </a>
        </div>
      );
    });
  };

  return (
    <div className="section">
      <h2 className="section-title">{l.feedTitle}</h2>
      <p className="section-sub">{l.feedSub}</p>

      {onDateFilterChange && (
        <div style={{ marginBottom: '1.5rem' }}>
          <DateFilter
            onFilterChange={onDateFilterChange}
            currentFilter={currentDateFilter}
            locale={locale}
          />
        </div>
      )}

      <div className="info-box">
        <strong>ℹ️ {l.infoOrigin}</strong> {l.infoBody}
      </div>

      {renderFeedStats()}
      <div id="news-feed" className="news-feed">
        {renderNews()}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 className="section-title">{l.netTitle}</h2>
        <p className="section-sub">{l.netSub}</p>
        <div id="sources-container" className="sources-grid">
          {renderSources()}
        </div>
      </div>
    </div>
  );
}
