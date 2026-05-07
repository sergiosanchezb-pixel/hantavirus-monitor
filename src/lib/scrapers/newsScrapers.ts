import axios from 'axios';
import * as cheerio from 'cheerio';

// Fuentes de noticias con scraping directo
const NEWS_SOURCES = [
  {
    name: 'BBC News',
    url: 'https://www.bbc.com/news',
    searchSelector: '.gs-c-promo-heading',
    linkSelector: 'a',
    dateSelector: 'time',
    baseUrl: 'https://www.bbc.com'
  },
  {
    name: 'CNN',
    url: 'https://www.cnn.com/search?q=hantavirus&from=0&size=10',
    searchSelector: '.container__item',
    linkSelector: 'a',
    dateSelector: '.container__date',
    baseUrl: 'https://www.cnn.com'
  },
  {
    name: 'Reuters',
    url: 'https://www.reuters.com/search/news?blob=hantavirus',
    searchSelector: '.search-result__heading',
    linkSelector: 'a',
    dateSelector: '.search-result__timestamp',
    baseUrl: 'https://www.reuters.com'
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/world/hantavirus',
    searchSelector: '.fc-item__title',
    linkSelector: 'a',
    dateSelector: '.fc-item__timestamp',
    baseUrl: 'https://www.theguardian.com'
  }
];

const HANTAVIRUS_KEYWORDS = [
  'hantavirus', 'hanta virus', 'andes virus', 'hps', 'hfrs',
  'pulmonary syndrome', 'hemorrhagic fever', 'sin nombre'
];

function isHantavirusRelated(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HANTAVIRUS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

async function scrapeBBCNews(): Promise<any[]> {
  try {
    const { data } = await axios.get('https://www.bbc.com/news', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    
    const $ = cheerio.load(data);
    const articles: any[] = [];
    
    $('.gs-c-promo-heading').each((_, element) => {
      const title = $(element).text().trim();
      const link = $(element).find('a').attr('href');
      
      if (title && link && isHantavirusRelated(title)) {
        articles.push({
          title,
          description: title.substring(0, 200),
          link: link.startsWith('http') ? link : `https://www.bbc.com${link}`,
          pubDate: new Date().toISOString(),
          source: 'BBC News'
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('[BBC] Error:', error);
    return [];
  }
}

async function scrapeCNN(): Promise<any[]> {
  try {
    const { data } = await axios.get('https://www.cnn.com/search?q=hantavirus&from=0&size=10', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    
    const $ = cheerio.load(data);
    const articles: any[] = [];
    
    $('.container__item').each((_, element) => {
      const title = $(element).find('.container__headline').text().trim();
      const link = $(element).find('a').attr('href');
      
      if (title && link && isHantavirusRelated(title)) {
        articles.push({
          title,
          description: title.substring(0, 200),
          link: link.startsWith('http') ? link : `https://www.cnn.com${link}`,
          pubDate: new Date().toISOString(),
          source: 'CNN'
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('[CNN] Error:', error);
    return [];
  }
}

async function scrapeReuters(): Promise<any[]> {
  try {
    const { data } = await axios.get('https://www.reuters.com/search/news?blob=hantavirus', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
    });
    
    const $ = cheerio.load(data);
    const articles: any[] = [];
    
    $('.search-result__heading').each((_, element) => {
      const title = $(element).text().trim();
      const link = $(element).find('a').attr('href');
      
      if (title && link && isHantavirusRelated(title)) {
        articles.push({
          title,
          description: title.substring(0, 200),
          link: link.startsWith('http') ? link : `https://www.reuters.com${link}`,
          pubDate: new Date().toISOString(),
          source: 'Reuters'
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('[Reuters] Error:', error);
    return [];
  }
}

// RSS feeds como alternativa
async function scrapeRSSFeeds(): Promise<any[]> {
  const RSS_SOURCES = [
    {
      name: 'WHO News',
      url: 'https://www.who.int/feeds/rss/hantavirus.xml'
    },
    {
      name: 'CDC News',
      url: 'https://www.cdc.gov/hantavirus/rss.xml'
    },
    {
      name: 'Health News RSS',
      url: 'https://rss.cnn.com/rss/health.xml'
    }
  ];

  const articles: any[] = [];
  
  for (const source of RSS_SOURCES) {
    try {
      const { data } = await axios.get(source.url, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HantaMonitor/1.0)' }
      });
      
      const $ = cheerio.load(data, { xmlMode: true });
      
      $('item').each((_, element) => {
        const title = $(element).find('title').text().trim();
        const description = $(element).find('description').text().trim();
        const link = $(element).find('link').text().trim();
        const pubDate = $(element).find('pubDate').text().trim();
        
        if (title && link && isHantavirusRelated(title + ' ' + description)) {
          articles.push({
            title,
            description: description.replace(/<[^>]*>/g, '').substring(0, 300),
            link,
            pubDate: pubDate || new Date().toISOString(),
            source: source.name
          });
        }
      });
      
      console.log(`[${source.name}] ${articles.length} artículos encontrados`);
    } catch (error: any) {
      console.error(`[${source.name}] Error:`, error.message);
    }
  }
  
  return articles;
}

export async function newsScrapersService() {
  try {
    console.log('[NEWS SCRAPERS] Iniciando scraping de noticias...');
    
    // Ejecutar scrapers en paralelo
    const [bbcArticles, cnnArticles, reutersArticles, rssArticles] = await Promise.allSettled([
      scrapeBBCNews(),
      scrapeCNN(),
      scrapeReuters(),
      scrapeRSSFeeds()
    ]);
    
    const allArticles: any[] = [];
    
    // Recolectar resultados exitosos
    if (bbcArticles.status === 'fulfilled') {
      allArticles.push(...bbcArticles.value);
    }
    
    if (cnnArticles.status === 'fulfilled') {
      allArticles.push(...cnnArticles.value);
    }
    
    if (reutersArticles.status === 'fulfilled') {
      allArticles.push(...reutersArticles.value);
    }
    
    if (rssArticles.status === 'fulfilled') {
      allArticles.push(...rssArticles.value);
    }
    
    // Eliminar duplicados
    const seen = new Set();
    const uniqueArticles = allArticles.filter(article => {
      const key = article.title.substring(0, 50).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Ordenar por fecha
    uniqueArticles.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    console.log(`[NEWS SCRAPERS] Total de artículos únicos: ${uniqueArticles.length}`);
    
    return uniqueArticles;
    
  } catch (error: any) {
    console.error('[NEWS SCRAPERS] Error general:', error);
    return [];
  }
}
