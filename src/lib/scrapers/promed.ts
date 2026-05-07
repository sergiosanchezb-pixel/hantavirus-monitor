import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const rssParser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
});

export async function promedScraper() {
  const articles: any[] = [];

  // 1. ProMED RSS
  try {
    const feed = await rssParser.parseURL('https://promedmail.org/feed/');
    feed.items.forEach(item => articles.push({
      source: 'ProMED',
      title: item.title?.trim() || '',
      description: (item.contentSnippet || item.content || '').replace(/<[^>]+>/g, '').trim().substring(0, 400),
      link: item.link || 'https://promedmail.org',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString()
    }));
    console.log(`[ProMED RSS] ${articles.length} artículos`);
  } catch (e: any) { console.warn('[ProMED RSS]', e.message); }

  // 2. Búsqueda ProMED por "hantavirus"
  try {
    const { data } = await axios.get('https://promedmail.org/?search=hantavirus', {
      timeout: 12000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    const $ = cheerio.load(data);
    $('article, .post, .report-item').each((_, el) => {
      const titleEl = $(el).find('h2 a, h3 a, .title a').first();
      const title = titleEl.text().trim();
      const href = titleEl.attr('href') || '';
      const link = href.startsWith('http') ? href : `https://promedmail.org${href}`;
      const desc = $(el).find('p, .excerpt').first().text().trim().substring(0, 400);
      const dateStr = $(el).find('time').first().attr('datetime') || new Date().toISOString();
      if (title && title.length > 5) articles.push({
        source: 'ProMED-SEARCH', title, description: desc || title, link, pubDate: dateStr
      });
    });
    console.log(`[ProMED SEARCH] total: ${articles.length}`);
  } catch (e: any) { console.warn('[ProMED SEARCH]', e.message); }

  return articles;
}
