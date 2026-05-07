import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const rssParser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
});

export async function cdcScraper() {
  const articles: any[] = [];

  // 1. RSS HAN (Health Alert Network)
  try {
    const feed = await rssParser.parseURL('https://tools.cdc.gov/api/v2/resources/media/132608.rss');
    feed.items.forEach(item => articles.push({
      source: 'CDC-HAN',
      title: item.title?.trim() || '',
      description: (item.contentSnippet || '').trim().substring(0, 400),
      link: item.link || 'https://emergency.cdc.gov/han/',
      pubDate: item.pubDate || new Date().toISOString()
    }));
    console.log(`[CDC HAN] ${articles.length} artículos`);
  } catch (e: any) { console.warn('[CDC HAN]', e.message); }

  // 2. Scraping página hantavirus CDC
  try {
    const { data } = await axios.get('https://www.cdc.gov/hantavirus/index.html', {
      timeout: 12000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    const $ = cheerio.load(data);
    const pageArts: any[] = [];
    
    // Buscar fecha de última actualización en la página
    let lastUpdated = new Date('2024-01-01'); // Fecha por defecto antigua
    $('date, time, .date, .updated, .last-updated, [datetime]').each((_, el) => {
      const dateText = $(el).text() || $(el).attr('datetime') || '';
      const parsed = new Date(dateText);
      if (!isNaN(parsed.getTime()) && parsed > lastUpdated) {
        lastUpdated = parsed;
      }
    });
    
    // Si no encontramos fecha, usar una fecha base para contenido informativo
    if (lastUpdated.getFullYear() === 2024) {
      lastUpdated = new Date('2024-05-01'); // Fecha base para contenido CDC
    }
    
    $('p, li, h2, h3').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 30 && text.length < 600) pageArts.push({
        source: 'CDC-PAGE', 
        title: text.substring(0, 100), 
        description: text,
        link: 'https://www.cdc.gov/hantavirus/index.html', 
        pubDate: lastUpdated.toISOString()
      });
    });
    articles.push(...pageArts.slice(0, 10));
    console.log(`[CDC PAGE] total: ${articles.length}, fecha: ${lastUpdated.toISOString()}`);
  } catch (e: any) { console.warn('[CDC PAGE]', e.message); }

  // 3. RSS MMWR
  try {
    const feed = await rssParser.parseURL('https://www.cdc.gov/mmwr/feeds/mmwr_wk.xml');
    feed.items.forEach(item => articles.push({
      source: 'CDC-MMWR',
      title: item.title?.trim() || '',
      description: (item.contentSnippet || '').trim().substring(0, 400),
      link: item.link || 'https://www.cdc.gov/mmwr/',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString()
    }));
    console.log(`[CDC MMWR] total: ${articles.length}`);
  } catch (e: any) { console.warn('[CDC MMWR]', e.message); }

  return articles;
}
