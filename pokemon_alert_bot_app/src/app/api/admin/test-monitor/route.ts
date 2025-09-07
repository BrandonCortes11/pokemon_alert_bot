import { NextRequest, NextResponse } from "next/server";
import { monitorAllStores } from "@/server/monitoring/store-monitor";
import { getStoreStats } from "@/lib/seed-data";

export async function POST(request: NextRequest) {
  try {
    const { action, secret } = await request.json();
    
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    switch (action) {
      case 'test-monitoring':
        console.log('🔍 Starting manual monitoring test...');
        const startTime = Date.now();
        
        try {
          await monitorAllStores();
          const duration = Date.now() - startTime;
          
          const stats = await getStoreStats();
          const latestStockChecks = await getLatestStockChecks();
          
          return NextResponse.json({
            success: true,
            message: "Monitoring test completed successfully",
            data: {
              duration: `${duration}ms`,
              stats,
              latestStockChecks,
              timestamp: new Date().toISOString(),
            }
          });
          
        } catch (monitorError) {
          return NextResponse.json({
            success: false,
            message: "Monitoring test failed",
            error: monitorError instanceof Error ? monitorError.message : 'Unknown error',
            duration: `${Date.now() - startTime}ms`,
          }, { status: 500 });
        }

      case 'test-scraper':
        // Test individual scraper functionality
        const scraperTest = await testPokemonCenterScraper();
        return NextResponse.json({
          success: true,
          message: "Scraper test completed",
          data: scraperTest,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'test-monitoring' or 'test-scraper'" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Test monitor error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Helper function to get recent stock checks
async function getLatestStockChecks() {
  const { prisma } = await import('@/lib/prisma');
  
  try {
    const stockChecks = await prisma.stockCheck.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        product: {
          include: {
            store: true
          }
        }
      }
    });

    return stockChecks.map(check => ({
      id: check.id,
      timestamp: check.timestamp,
      status: check.status,
      price: check.price,
      product: {
        name: check.product.name,
        store: check.product.store.displayName,
      }
    }));
  } catch (error) {
    console.error('Error fetching stock checks:', error);
    return [];
  }
}

// Test Pokemon Center scraper without full monitoring
async function testPokemonCenterScraper() {
  try {
    const puppeteer = await import('puppeteer');
    
    console.log('🚀 Testing Puppeteer launch...');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('🌐 Testing Pokemon Center access...');
    const testUrl = 'https://www.pokemoncenter.com';
    const startTime = Date.now();
    
    try {
      await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const loadTime = Date.now() - startTime;
      
      // Get page title to verify successful load
      const title = await page.title();
      
      await browser.close();
      
      return {
        success: true,
        puppeteerWorking: true,
        siteAccessible: true,
        loadTime: `${loadTime}ms`,
        pageTitle: title,
        message: 'Pokemon Center scraper test successful'
      };
      
    } catch (pageError) {
      await browser.close();
      
      return {
        success: false,
        puppeteerWorking: true,
        siteAccessible: false,
        error: pageError instanceof Error ? pageError.message : 'Page load failed',
        message: 'Pokemon Center site not accessible'
      };
    }
    
  } catch (puppeteerError) {
    return {
      success: false,
      puppeteerWorking: false,
      siteAccessible: false,
      error: puppeteerError instanceof Error ? puppeteerError.message : 'Puppeteer launch failed',
      message: 'Puppeteer not working correctly'
    };
  }
}