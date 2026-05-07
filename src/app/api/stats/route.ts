import { NextRequest, NextResponse } from 'next/server';
import { get, set, age } from '@/lib/cache';
import { runAllScrapers } from '@/lib/scrapers';

export async function GET(request: NextRequest) {
  try {
    const force = request.nextUrl.searchParams.get('force') === 'true';
    const cached = get();
    
    if (cached && !force) {
      return NextResponse.json({ 
        ...cached, 
        fromCache: true, 
        cacheAgeMinutes: age() 
      });
    }

    console.log(`[API] Scraping — force=${force}`);
    const data = await runAllScrapers();
    set(data);
    
    return NextResponse.json({ 
      ...data, 
      fromCache: false, 
      cacheAgeMinutes: 0 
    });
  } catch (err: any) {
    console.error('[API ERROR]', err.message);
    return NextResponse.json(
      { error: 'Error al obtener datos', message: err.message },
      { status: 500 }
    );
  }
}
