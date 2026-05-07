import { Article, Location } from '@/types';

// Base de datos de ciudades con coordenadas
const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  // África
  'cape verde': { lat: 16.0021, lng: -24.0134, country: 'Cabo Verde' },
  'praia': { lat: 14.9333, lng: -23.5167, country: 'Cabo Verde' },
  'south africa': { lat: -30.5595, lng: 22.9375, country: 'Sudáfrica' },
  'johannesburg': { lat: -26.2041, lng: 28.0473, country: 'Sudáfrica' },
  'pretoria': { lat: -25.7479, lng: 28.2293, country: 'Sudáfrica' },
  
  // Europa
  'switzerland': { lat: 46.8182, lng: 8.2275, country: 'Suiza' },
  'zurich': { lat: 47.3769, lng: 8.5417, country: 'Suiza' },
  'geneva': { lat: 46.2044, lng: 6.1432, country: 'Suiza' },
  'netherlands': { lat: 52.1326, lng: 5.2913, country: 'Países Bajos' },
  'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Países Bajos' },
  'spain': { lat: 40.4637, lng: -3.7492, country: 'España' },
  'canary islands': { lat: 28.2916, lng: -16.6291, country: 'España' },
  'tenerife': { lat: 28.2916, lng: -16.6291, country: 'España' },
  'las palmas': { lat: 28.1235, lng: -15.4366, country: 'España' },
  'uk': { lat: 55.3781, lng: -3.4360, country: 'Reino Unido' },
  'london': { lat: 51.5074, lng: -0.1278, country: 'Reino Unido' },
  'united kingdom': { lat: 55.3781, lng: -3.4360, country: 'Reino Unido' },
  'britain': { lat: 55.3781, lng: -3.4360, country: 'Reino Unido' },
  
  // América
  'argentina': { lat: -38.4161, lng: -63.6167, country: 'Argentina' },
  'ushuaia': { lat: -54.8019, lng: -68.3025, country: 'Argentina' },
  'buenos aires': { lat: -34.6037, lng: -58.3816, country: 'Argentina' },
  'usa': { lat: 39.8283, lng: -98.5795, country: 'Estados Unidos' },
  'united states': { lat: 39.8283, lng: -98.5795, country: 'Estados Unidos' },
  'illinois': { lat: 40.6331, lng: -89.3985, country: 'Estados Unidos' },
  'wisconsin': { lat: 44.5267, lng: -89.5747, country: 'Estados Unidos' },
  'chicago': { lat: 41.8781, lng: -87.6298, country: 'Estados Unidos' },
  'milwaukee': { lat: 43.0389, lng: -87.9065, country: 'Estados Unidos' },
  
  // Asia
  'china': { lat: 35.8617, lng: 104.1954, country: 'China' },
  'beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'shanghai': { lat: 31.2304, lng: 121.4737, country: 'China' },
  'south korea': { lat: 35.9078, lng: 127.7669, country: 'Corea del Sur' },
  'seoul': { lat: 37.5665, lng: 126.9780, country: 'Corea del Sur' },
  
  // Oceanía
  'australia': { lat: -25.2744, lng: 133.7751, country: 'Australia' },
  'sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  
  // Medio Oriente
  'israel': { lat: 31.0461, lng: 34.8516, country: 'Israel' },
  'tel aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
  'jerusalem': { lat: 31.7683, lng: 35.2137, country: 'Israel' },
  
  // América Latina
  'chile': { lat: -35.6751, lng: -71.5430, country: 'Chile' },
  'santiago': { lat: -33.4489, lng: -70.6693, country: 'Chile' },
  'peru': { lat: -9.1900, lng: -75.0152, country: 'Perú' },
  'lima': { lat: -12.0464, lng: -77.0428, country: 'Perú' },
  'bolivia': { lat: -16.2902, lng: -63.5887, country: 'Bolivia' },
  'la paz': { lat: -16.4897, lng: -68.1193, country: 'Bolivia' },
  'ecuador': { lat: -1.8312, lng: -78.1834, country: 'Ecuador' },
  'quito': { lat: -0.1807, lng: -78.4678, country: 'Ecuador' },
  
  // América Central
  'mexico': { lat: 23.6345, lng: -102.5528, country: 'México' },
  'mexico city': { lat: 19.4326, lng: -99.1332, country: 'México' },
  'guatemala': { lat: 15.7835, lng: -90.2308, country: 'Guatemala' },
  'panama': { lat: 8.9956, lng: -79.5333, country: 'Panamá' },
  'costa rica': { lat: 9.7489, lng: -83.7534, country: 'Costa Rica' },
  
  // Caribe
  'cuba': { lat: 23.1136, lng: -82.3666, country: 'Cuba' },
  'havana': { lat: 23.1136, lng: -82.3666, country: 'Cuba' },
  'haiti': { lat: 18.9714, lng: -72.2852, country: 'Haití' },
  'jamaica': { lat: 18.1096, lng: -77.2975, country: 'Jamaica' },
  
  // Europa del Este
  'germany': { lat: 51.1657, lng: 10.4515, country: 'Alemania' },
  'berlin': { lat: 52.5200, lng: 13.4050, country: 'Alemania' },
  'france': { lat: 46.2276, lng: 2.2137, country: 'Francia' },
  'paris': { lat: 48.8566, lng: 2.3522, country: 'Francia' },
  'italy': { lat: 41.8719, lng: 12.5674, country: 'Italia' },
  'rome': { lat: 41.9028, lng: 12.4964, country: 'Italia' },
  'portugal': { lat: 39.3999, lng: -8.2245, country: 'Portugal' },
  'lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  
  // Asia Central
  'india': { lat: 20.5937, lng: 78.9629, country: 'India' },
  'new delhi': { lat: 28.6139, lng: 77.2090, country: 'India' },
  'mumbai': { lat: 19.0760, lng: 72.8777, country: 'India' },
  'pakistan': { lat: 30.3753, lng: 69.3451, country: 'Pakistán' },
  'islamabad': { lat: 33.6844, lng: 73.0479, country: 'Pakistán' },
  'bangladesh': { lat: 23.6850, lng: 90.3563, country: 'Bangladés' },
  'dhaka': { lat: 23.8103, lng: 90.4125, country: 'Bangladés' },
  
  // Sudeste Asiático
  'thailand': { lat: 15.8700, lng: 100.9925, country: 'Tailandia' },
  'bangkok': { lat: 13.7563, lng: 100.5018, country: 'Tailandia' },
  'vietnam': { lat: 14.0583, lng: 108.2772, country: 'Vietnam' },
  'hanoi': { lat: 21.0285, lng: 105.8542, country: 'Vietnam' },
  'malaysia': { lat: 4.2105, lng: 101.9758, country: 'Malasia' },
  'kuala lumpur': { lat: 3.1390, lng: 101.6869, country: 'Malasia' },
  'indonesia': { lat: -0.7893, lng: 113.9213, country: 'Indonesia' },
  'jakarta': { lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
  'philippines': { lat: 12.8797, lng: 121.7740, country: 'Filipinas' },
  'manila': { lat: 14.5995, lng: 120.9842, country: 'Filipinas' },
  
  // América del Sur adicional
  'brazil': { lat: -14.2350, lng: -51.9253, country: 'Brasil' },
  'sao paulo': { lat: -23.5505, lng: -46.6333, country: 'Brasil' },
  'rio de janeiro': { lat: -22.9068, lng: -43.1729, country: 'Brasil' },
  'colombia': { lat: 4.5709, lng: -74.2973, country: 'Colombia' },
  'bogota': { lat: 4.7110, lng: -74.0721, country: 'Colombia' },
  'venezuela': { lat: 6.4238, lng: -66.5897, country: 'Venezuela' },
  'caracas': { lat: 10.4806, lng: -66.9036, country: 'Venezuela' },
  'uruguay': { lat: -32.5228, lng: -55.7658, country: 'Uruguay' },
  'montevideo': { lat: -34.9011, lng: -56.1645, country: 'Uruguay' },
  'paraguay': { lat: -23.4425, lng: -58.4438, country: 'Paraguay' },
  'asuncion': { lat: -25.2637, lng: -57.5759, country: 'Paraguay' },
  
  // Norteamérica adicional
  'canada': { lat: 56.1304, lng: -106.3468, country: 'Canadá' },
  'toronto': { lat: 43.6532, lng: -79.3832, country: 'Canadá' },
  'vancouver': { lat: 49.2827, lng: -123.1207, country: 'Canadá' },
  'montreal': { lat: 45.5017, lng: -73.5673, country: 'Canadá' },
  
  // Rusia
  'russia': { lat: 61.5240, lng: 105.3188, country: 'Rusia' },
  'moscow': { lat: 55.7558, lng: 37.6173, country: 'Rusia' },
  'saint petersburg': { lat: 59.9343, lng: 30.3351, country: 'Rusia' },
  
  // Japón
  'japan': { lat: 36.2048, lng: 138.2529, country: 'Japón' },
  'tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japón' },
  'osaka': { lat: 34.6937, lng: 135.5023, country: 'Japón' },
  
  // África adicional
  'egypt': { lat: 26.8206, lng: 30.8025, country: 'Egipto' },
  'cairo': { lat: 30.0444, lng: 31.2357, country: 'Egipto' },
  'kenya': { lat: -0.0236, lng: 37.9062, country: 'Kenia' },
  'nairobi': { lat: -1.2921, lng: 36.8219, country: 'Kenia' },
  'nigeria': { lat: 9.0820, lng: 8.6753, country: 'Nigeria' },
  'lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  'cape town': { lat: -33.9249, lng: 18.4241, country: 'Sudáfrica' },
  
  // Cruceros y barcos (ubicaciones especiales)
  'cruise ship': { lat: 14.93, lng: -23.63, country: 'Crucero' },
  'ship': { lat: 14.93, lng: -23.63, country: 'Crucero' },
  'hondius': { lat: 14.93, lng: -23.63, country: 'Crucero' },
  'ms hondius': { lat: 14.93, lng: -23.63, country: 'Crucero' },
};

function extractLocationFromText(text: string): { lat: number; lng: number; country: string; name: string } | null {
  const lowerText = text.toLowerCase();
  
  // Buscar ciudades/países en orden de especificidad
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (lowerText.includes(city)) {
      return {
        ...coords,
        name: city.charAt(0).toUpperCase() + city.slice(1)
      };
    }
  }
  
  return null;
}

function extractNumbersFromText(text: string): { cases: number; deaths: number } {
  const lowerText = text.toLowerCase();
  let cases = 0;
  let deaths = 0;
  
  // Patrones para casos
  const casePatterns = [
    /(\d+)\s*(?:confirmed\s*)?(?:cases?|positiv|infectad|casos)/gi,
    /cases?[:\s]+(\d+)/gi,
    /(\d+)\s*(?:people|patients|personas|pacientes)/gi
  ];
  
  // Patrones para muertes
  const deathPatterns = [
    /(\d+)\s*(?:deaths?|fatalities|fallecid|muert|died)/gi,
    /deaths?[:\s]+(\d+)/gi,
    /(\d+)\s*(?:fatal|dead)/gi
  ];
  
  for (const pattern of casePatterns) {
    const matches = [...lowerText.matchAll(pattern)];
    for (const match of matches) {
      const num = parseInt(match[1] || match[2] || '0');
      if (num > cases) cases = num;
    }
  }
  
  for (const pattern of deathPatterns) {
    const matches = [...lowerText.matchAll(pattern)];
    for (const match of matches) {
      const num = parseInt(match[1] || match[2] || '0');
      if (num > deaths) deaths = num;
    }
  }
  
  return { cases, deaths };
}

function determineRiskLevel(cases: number, deaths: number, articleAge: number): 'critical' | 'high' | 'moderate' {
  if (deaths > 0 || cases >= 2) return 'critical';
  if (cases === 1 || articleAge < 7) return 'high';
  return 'moderate';
}

export function extractLocationsFromArticles(articles: Article[], maxDaysOld: number = 0): Location[] {
  const locationMap = new Map<string, Location>();
  const now = Date.now();
  
  const filteredArticles = maxDaysOld > 0 
    ? articles.filter(article => {
        const articleAge = (now - new Date(article.pubDate).getTime()) / (1000 * 60 * 60 * 24);
        return articleAge <= maxDaysOld;
      })
    : articles;
  
  filteredArticles.forEach(article => {
    const text = `${article.title} ${article.description}`;
    const location = extractLocationFromText(text);
    
    if (location) {
      const { cases, deaths } = extractNumbersFromText(text);
      const articleAge = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60 * 24); // días
      const level = determineRiskLevel(cases, deaths, articleAge);
      
      const key = `${location.lat}-${location.lng}`;
      
      if (locationMap.has(key)) {
        // Acumular datos si ya existe la ubicación
        const existing = locationMap.get(key)!;
        existing.cases = Math.max(existing.cases, cases);
        existing.deaths = Math.max(existing.deaths, deaths);
        existing.level = existing.level === 'critical' ? 'critical' : 
                        (level === 'critical' ? 'critical' : 
                         existing.level === 'high' || level === 'high' ? 'high' : 'moderate');
        existing.notes += ` | ${article.source}: ${article.title.substring(0, 50)}...`;
      } else {
        // Crear nueva ubicación
        locationMap.set(key, {
          name: location.name,
          lat: location.lat,
          lng: location.lng,
          cases,
          deaths,
          possible: 0,
          level,
          notes: `${article.source}: ${article.title.substring(0, 80)}...`
        });
      }
    }
  });
  
  return Array.from(locationMap.values());
}

export function mergeLocationData(baseLocations: Location[], articleLocations: Location[]): Location[] {
  const mergedMap = new Map<string, Location>();
  
  // Agregar ubicaciones base
  baseLocations.forEach(loc => {
    const key = `${loc.lat}-${loc.lng}`;
    mergedMap.set(key, { ...loc });
  });
  
  // Agregar/actualizar con ubicaciones de artículos
  articleLocations.forEach(articleLoc => {
    const key = `${articleLoc.lat}-${articleLoc.lng}`;
    
    if (mergedMap.has(key)) {
      // Actualizar ubicación existente
      const existing = mergedMap.get(key)!;
      existing.cases = Math.max(existing.cases, articleLoc.cases);
      existing.deaths = Math.max(existing.deaths, articleLoc.deaths);
      existing.level = existing.level === 'critical' || articleLoc.level === 'critical' ? 'critical' :
                      (existing.level === 'high' || articleLoc.level === 'high' ? 'high' : 'moderate');
      if (articleLoc.cases > 0 || articleLoc.deaths > 0) {
        existing.notes += ` | [NUEVO] ${articleLoc.notes}`;
      }
    } else {
      // Agregar nueva ubicación
      mergedMap.set(key, { ...articleLoc });
    }
  });
  
  return Array.from(mergedMap.values());
}
