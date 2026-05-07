export interface Location {
  name: string;
  lat: number;
  lng: number;
  cases: number;
  deaths: number;
  possible: number;
  level: 'critical' | 'high' | 'moderate';
  notes: string;
}

export interface Article {
  source: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

export interface SourceStatus {
  name: string;
  status: 'ok' | 'error' | 'loading';
  count?: number;
  error?: string;
}

export interface StatsData {
  updatedAt: string;
  stats: {
    confirmedCases: number | null;
    deaths: number | null;
    activeAlerts: number;
    sourcesOk: number;
  };
  sources: SourceStatus[];
  articles: Article[];
  fromCache?: boolean;
  cacheAgeMinutes?: number;
}
