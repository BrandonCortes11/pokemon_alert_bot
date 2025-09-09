import { NextRequest, NextResponse } from 'next/server';
import { scrapeProductFromUrl } from '@/server/monitoring/pokemon-center-catalog';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(`🔍 Debug endpoint: Testing scrape for URL: ${url}`);
    
    const result = await scrapeProductFromUrl(url);
    
    console.log(`✅ Debug endpoint: Scraping result:`, result);
    
    return NextResponse.json({
      success: true,
      result,
      url
    });
    
  } catch (error) {
    console.error('❌ Debug endpoint: Scraping error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}