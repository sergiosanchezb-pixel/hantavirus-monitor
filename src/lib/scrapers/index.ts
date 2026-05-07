import { whoScraper } from './who';
import { cdcScraper } from './cdc';
import { promedScraper } from './promed';
import { robustNewsScrapersService } from './robustNewsScrapers';
import { newsApiScraper } from './newsapi';

const KEYWORDS = [
  'hantavirus','hanta virus','andes virus','virus andes',
  'hps','hfrs','sin nombre','pulmonary syndrome','hantaviral',
  'rodent-borne hemorrhagic','hantaan','seoul virus'
];

function isRelevant(text = '') {
  const lower = text.toLowerCase();
  return KEYWORDS.some(kw => lower.includes(kw));
}

function extractNumbers(text = '') {
  const t = text.toLowerCase();
  let cases = 0, deaths = 0;
  const caseP = [/(\d+)\s*(confirmed\s*)?(cases?|positiv|infectad|caso)/gi, /cases?[:\s]+(\d+)/gi];
  const deathP = [/(\d+)\s*(deaths?|fatalities|fallecid|muert)/gi, /deaths?[:\s]+(\d+)/gi];
  
  for (const p of caseP) {
    for (const m of [...t.matchAll(p)]) {
      const n = parseInt(m[1] || m[2] || '0');
      if (n > cases) cases = n;
    }
  }
  
  for (const p of deathP) {
    for (const m of [...t.matchAll(p)]) {
      const n = parseInt(m[1] || m[2] || '0');
      if (n > deaths) deaths = n;
    }
  }
  
  return { cases, deaths };
}

export async function runAllScrapers() {
  const scrapers = [
    { fn: robustNewsScrapersService, name: 'RobustNews' },
    { fn: cdcScraper, name: 'CDC' },
    { fn: newsApiScraper, name: 'NewsAPI' },
    { fn: whoScraper, name: 'OMS' },
    { fn: promedScraper, name: 'ProMED' }
  ];

  const results = await Promise.allSettled(scrapers.map(s => s.fn()));
  const sources: any[] = [];
  let allArticles: any[] = [];

  results.forEach((r, i) => {
    const name = scrapers[i].name;
    if (r.status === 'fulfilled') {
      const relevant = r.value.filter((a: any) => isRelevant(a.title + ' ' + a.description));
      sources.push({ name, status: 'ok', count: relevant.length });
      allArticles = allArticles.concat(relevant);
    } else {
      sources.push({ 
        name, 
        status: 'error', 
        error: (r.reason as any)?.message?.substring(0, 60) || 'Error' 
      });
      console.error(`[SCRAPER ${name}]`, (r.reason as any)?.message);
    }
  });

  // Deduplicar
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    const key = a.title.substring(0, 50).toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });

  allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const combined = allArticles.map(a => a.title + ' ' + a.description).join(' ');
  const { cases, deaths } = extractNumbers(combined);

  return {
    updatedAt: new Date().toISOString(),
    stats: {
      confirmedCases: cases || null,
      deaths: deaths || null,
      activeAlerts: allArticles.length,
      sourcesOk: sources.filter(s => s.status === 'ok').length
    },
    sources,
    articles: allArticles.slice(0, 30)
  };
}
