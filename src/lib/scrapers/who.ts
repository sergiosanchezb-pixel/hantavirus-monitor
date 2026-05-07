import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const rssParser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
});

export async function whoScraper() {
  const articles: any[] = [];

  // 1. RSS OMS noticias generales
  try {
    const feed = await rssParser.parseURL('https://www.who.int/rss-feeds/news-releases.xml');
    feed.items.forEach(item => articles.push({
      source: 'OMS',
      title: item.title?.trim() || '',
      description: (item.contentSnippet || item.content || '').replace(/<[^>]+>/g, '').trim().substring(0, 400),
      link: item.link || 'https://www.who.int',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString()
    }));
    console.log(`[WHO RSS] ${articles.length} artículos`);
  } catch (e: any) { console.warn('[WHO RSS]', e.message); }

  // 2. Scraping HTML Disease Outbreak News
  try {
    const { data } = await axios.get('https://www.who.int/emergencies/disease-outbreak-news', {
      timeout: 12000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    const $ = cheerio.load(data);
    $('a[href*="/emergencies/disease-outbreak-news/item/"]').each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href') || '';
      const link = href.startsWith('http') ? href : `https://www.who.int${href}`;
      if (title && title.length > 10) articles.push({
        source: 'OMS-DON', title, description: title,
        link, pubDate: new Date().toISOString()
      });
    });
    console.log(`[WHO HTML] total: ${articles.length}`);
  } catch (e: any) { console.warn('[WHO HTML]', e.message); }

  return articles;
}
