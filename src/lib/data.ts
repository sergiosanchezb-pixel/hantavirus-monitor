import { Location } from '@/types';

export const BASE_LOCATIONS: Location[] = [
  { 
    name: 'M/V Hondius (Cabo Verde)', 
    lat: 14.93,  
    lng: -23.63, 
    cases: 7, 
    deaths: 2, 
    possible: 150, 
    level: 'critical', 
    notes: 'EPICENTRO · 150 cuarentena · Muertes: 11 abr / 2 may' 
  },
  { 
    name: 'Sudáfrica',                
    lat: -24.53, 
    lng: 25.26,  
    cases: 2, 
    deaths: 1, 
    possible: 82,  
    level: 'critical', 
    notes: 'Mujer británica fallecida · Doctor en UCI · 82 contactos' 
  },
  { 
    name: 'Suiza',                    
    lat: 46.82,  
    lng: 8.23,   
    cases: 1, 
    deaths: 0, 
    possible: 1,   
    level: 'high',     
    notes: 'Positivo UCI Zúrica · Desembarcó 21 abr' 
  },
  { 
    name: 'Países Bajos',             
    lat: 52.13,  
    lng: 5.29,   
    cases: 4, 
    deaths: 0, 
    possible: 0,   
    level: 'high',     
    notes: 'Evacuados a Ámsterdam' 
  },
  { 
    name: 'España (Canarias)',        
    lat: 28.23,  
    lng: -16.23, 
    cases: 0, 
    deaths: 0, 
    possible: 140,  
    level: 'high',     
    notes: '14 españoles · Hospital Gómez Ulla' 
  },
  { 
    name: 'Reino Unido',              
    lat: 55.38,  
    lng: -3.44,  
    cases: 2, 
    deaths: 0, 
    possible: 0,   
    level: 'moderate', 
    notes: 'UKHSA rastreando contactos' 
  },
  { 
    name: 'Argentina (Ushuaia)',      
    lat: -54.80, 
    lng: -68.30, 
    cases: 0, 
    deaths: 0, 
    possible: 0,   
    level: 'moderate', 
    notes: 'Punto de origen · 1 abril' 
  }
];

export const COLOR_MAP = {
  critical: '#ff0055',
  high: '#ff9500',
  moderate: '#00ff88'
};

export const ICON_MAP = {
  'OMS': '[OMS]',
  'CDC': '[CDC]',
  'ProMED': '[PROMED]',
  'NewsAPI': '[NEWS]'
};

export const LINK_MAP = {
  'OMS': 'https://www.who.int/emergencies/disease-outbreak-news',
  'CDC': 'https://emergency.cdc.gov/han/',
  'ProMED': 'https://promedmail.org',
  'NewsAPI': 'https://newsapi.org'
};
