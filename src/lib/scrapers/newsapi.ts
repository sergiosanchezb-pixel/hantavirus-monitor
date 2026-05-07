import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY || '9d82f7abf6b64732becba8f2d2b364be';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Cache simple para evitar múltiples solicitudes
let newsApiCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Combinar palabras clave en una sola búsqueda para reducir solicitudes
const SEARCH_QUERY = 'hantavirus OR "hanta virus" OR "andes virus" OR hps OR hfrs OR "pulmonary syndrome"';

export async function newsApiScraper() {
  try {
    const now = Date.now();
    
    // Usar caché si está disponible y no ha expirado
    if (newsApiCache && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('[NEWSAPI] Using cached data');
      return newsApiCache;
    }

    console.log('[NEWSAPI] Fetching fresh data');
    
    // Hacer una sola solicitud con todas las palabras clave
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: SEARCH_QUERY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50, // Aumentar pageSize para obtener más resultados en una sola solicitud
        apiKey: NEWS_API_KEY
      },
      timeout: 15000 // Aumentar timeout
    });

    if (response.data?.articles) {
      const filteredArticles = response.data.articles
        .filter((article: any) => {
          // Filtrar artículos válidos
          return article.title && 
                 article.description &&
                 article.url &&
                 article.title.length > 10 && // Evitar títulos muy cortos
                 article.description.length > 20; // Evitar descripciones muy cortas
        })
        .map((article: any) => ({
          title: article.title,
          description: article.description,
          link: article.url,
          pubDate: article.publishedAt,
          source: article.source?.name || 'NewsAPI'
        }));

      // Eliminar duplicados basados en título y URL
      const seen = new Set();
      const uniqueArticles = filteredArticles.filter((article: any) => {
        const titleKey = article.title.substring(0, 50).toLowerCase().trim();
        const urlKey = article.link;
        const key = `${titleKey}-${urlKey}`;
        
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Ordenar por fecha (más recientes primero)
      uniqueArticles.sort((a: any, b: any) => 
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      // Guardar en caché
      newsApiCache = uniqueArticles;
      lastFetchTime = now;

      console.log(`[NEWSAPI] Successfully fetched ${uniqueArticles.length} articles`);
      return uniqueArticles;
    }

    return [];

  } catch (error) {
    console.error('[NEWSAPI] Error fetching articles:', error);
    
    // Si hay error de rate limiting, devolver caché si existe
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.log('[NEWSAPI] Rate limited, using cache if available');
      if (newsApiCache) {
        return newsApiCache;
      }
      throw new Error(`NewsAPI Rate Limit: ${error.response?.data?.message || 'Too many requests'}`);
    }
    
    if (axios.isAxiosError(error)) {
      throw new Error(`NewsAPI Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to fetch NewsAPI data');
  }
}
