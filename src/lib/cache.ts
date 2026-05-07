const TTL_MS = 30 * 60 * 1000; // 30 minutos
let _cache: any = null;
let _cacheTime = 0;

export function get() {
  if (_cache && (Date.now() - _cacheTime) < TTL_MS) return _cache;
  return null;
}

export function set(data: any) { 
  _cache = data; 
  _cacheTime = Date.now(); 
}

export function age() { 
  return _cache ? Math.round((Date.now() - _cacheTime) / 1000 / 60) : null; 
}
