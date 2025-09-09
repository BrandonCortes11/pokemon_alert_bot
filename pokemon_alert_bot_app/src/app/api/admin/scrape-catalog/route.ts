import { NextRequest, NextResponse } from 'next/server';
import { 
  scrapePokemonCenterCatalog, 
  saveCatalogToDatabase,
  POKEMON_CENTER_CATEGORIES 
} from '@/server/monitoring/pokemon-center-catalog';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get request parameters
    const body = await request.json();
    const { 
      secret, 
      categories = Object.keys(POKEMON_CENTER_CATEGORIES).slice(0, 2), // Default to first 2 categories for testing
      maxProductsPerCategory = 10, // Small number for testing
      storeId 
    } = body;

    // Verify admin secret
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or find Pokemon Center store
    let pokemonCenterStore;
    if (storeId) {
      pokemonCenterStore = await prisma.store.findUnique({
        where: { id: storeId }
      });
    } else {
      pokemonCenterStore = await prisma.store.findFirst({
        where: { name: 'pokemon_center' }
      });
    }

    if (!pokemonCenterStore) {
      return NextResponse.json({ 
        error: 'Pokemon Center store not found. Please run seed data first.' 
      }, { status: 404 });
    }

    console.log(`🕷️ Starting catalog scrape for categories: ${categories.join(', ')}`);
    console.log(`📊 Max products per category: ${maxProductsPerCategory}`);

    // Scrape the catalog
    const scrapeResult = await scrapePokemonCenterCatalog(
      categories,
      maxProductsPerCategory
    );

    console.log(`✅ Scraping complete. Found ${scrapeResult.totalFound} products`);

    // Save to database
    const saveResult = await saveCatalogToDatabase(
      scrapeResult.products,
      pokemonCenterStore.id
    );

    console.log(`💾 Database save complete. Saved: ${saveResult.saved}, Updated: ${saveResult.updated}`);

    // Get final stats
    const totalProducts = await prisma.product.count({
      where: { storeId: pokemonCenterStore.id }
    });

    const categoryCounts = await prisma.product.groupBy({
      by: ['category'],
      where: { storeId: pokemonCenterStore.id },
      _count: { category: true }
    });

    return NextResponse.json({
      success: true,
      scraping: {
        categoriesScraped: categories,
        productsFound: scrapeResult.totalFound,
        errors: scrapeResult.errors
      },
      database: {
        saved: saveResult.saved,
        updated: saveResult.updated,
        errors: saveResult.errors
      },
      final: {
        totalProductsInStore: totalProducts,
        categoryCounts: categoryCounts.map(cat => ({
          category: cat.category,
          count: cat._count.category
        }))
      }
    });

  } catch (error) {
    console.error('❌ Catalog scraping error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Pokemon Center Catalog Scraper',
    usage: 'POST with { "secret": "your-admin-secret", "categories": ["TCG", "Plushies"], "maxProductsPerCategory": 10 }',
    availableCategories: Object.keys(POKEMON_CENTER_CATEGORIES),
    note: 'This endpoint will scrape live data from Pokemon Center'
  });
}