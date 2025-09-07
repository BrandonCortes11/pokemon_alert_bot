import puppeteer from 'puppeteer';
import { Store, Product, StockStatus } from '@prisma/client';
import { updateProductStock } from '../store-monitor';

// Type for store with products
type StoreWithProducts = Store & {
  products: Product[];
};

export async function monitorPokemonCenter(store: StoreWithProducts) {
  console.log('Starting Pokemon Center monitoring...');
  
  if (store.products.length === 0) {
    console.log('No products to monitor for Pokemon Center');
    return;
  }

  let browser;
  try {
    // Launch browser with specific settings for Pokemon Center
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport and headers
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Monitor each product
    for (const product of store.products) {
      try {
        await monitorPokemonCenterProduct(page, product);
        
        // Add delay between products to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000)); // 2-5 second random delay
        
      } catch (error) {
        console.error(`Error monitoring product ${product.name}:`, error);
        
        // Mark as unknown if we can't check
        await updateProductStock(product.id, StockStatus.UNKNOWN, undefined, {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    }

  } catch (error) {
    console.error('Error in Pokemon Center monitoring:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function monitorPokemonCenterProduct(page: any, product: Product) {
  console.log(`Checking product: ${product.name}`);
  
  try {
    // Navigate to product page
    await page.goto(product.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Wait for page to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract product information
    const productInfo = await page.evaluate(() => {
      // Common Pokemon Center selectors
      const selectors = {
        // Stock status indicators
        addToCart: 'button[data-testid="add-to-cart"], .add-to-cart, button:contains("Add to Cart")',
        outOfStock: '.out-of-stock, .unavailable, [data-testid="out-of-stock"]',
        preOrder: '.pre-order, [data-testid="pre-order"], button:contains("Pre-order")',
        
        // Price selectors
        price: '.price, .product-price, [data-testid="price"]',
        salePrice: '.sale-price, .discounted-price',
        originalPrice: '.original-price, .was-price',
        
        // Product info
        title: 'h1, .product-title, [data-testid="product-title"]',
        availability: '.availability, .stock-status, [data-testid="availability"]',
      };

      const result: any = {
        title: '',
        price: null,
        status: 'UNKNOWN',
        available: false,
        metadata: {}
      };

      // Get product title
      const titleElement = document.querySelector(selectors.title);
      if (titleElement) {
        result.title = titleElement.textContent?.trim() || '';
      }

      // Check for out of stock indicators
      const outOfStockElement = document.querySelector(selectors.outOfStock);
      if (outOfStockElement) {
        result.status = 'OUT_OF_STOCK';
        result.available = false;
        return result;
      }

      // Check for pre-order
      const preOrderElement = document.querySelector(selectors.preOrder);
      if (preOrderElement) {
        result.status = 'PREORDER';
        result.available = true;
      }

      // Check for add to cart button
      const addToCartElement = document.querySelector(selectors.addToCart);
      if (addToCartElement && !addToCartElement.hasAttribute('disabled')) {
        result.status = result.status === 'PREORDER' ? 'PREORDER' : 'IN_STOCK';
        result.available = true;
      }

      // Extract price information
      const priceElement = document.querySelector(selectors.price) || 
                          document.querySelector(selectors.salePrice);
      
      if (priceElement) {
        const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '') || '';
        const priceValue = parseFloat(priceText);
        if (!isNaN(priceValue)) {
          result.price = priceValue;
        }
      }

      // Get availability text
      const availabilityElement = document.querySelector(selectors.availability);
      if (availabilityElement) {
        result.metadata.availabilityText = availabilityElement.textContent?.trim();
      }

      // If we couldn't determine status, try to infer from page content
      if (result.status === 'UNKNOWN') {
        const bodyText = document.body.textContent?.toLowerCase() || '';
        
        if (bodyText.includes('out of stock') || bodyText.includes('sold out')) {
          result.status = 'OUT_OF_STOCK';
        } else if (bodyText.includes('pre-order') || bodyText.includes('preorder')) {
          result.status = 'PREORDER';
        } else if (bodyText.includes('add to cart') || bodyText.includes('buy now')) {
          result.status = 'IN_STOCK';
        }
      }

      return result;
    });

    // Map status to our enum
    let stockStatus: StockStatus = StockStatus.UNKNOWN;
    switch (productInfo.status) {
      case 'IN_STOCK':
        stockStatus = StockStatus.IN_STOCK;
        break;
      case 'OUT_OF_STOCK':
        stockStatus = StockStatus.OUT_OF_STOCK;
        break;
      case 'PREORDER':
        stockStatus = StockStatus.PREORDER;
        break;
      case 'LIMITED_STOCK':
        stockStatus = StockStatus.LIMITED_STOCK;
        break;
      default:
        stockStatus = StockStatus.UNKNOWN;
    }

    // Update product stock in database
    const result = await updateProductStock(
      product.id,
      stockStatus,
      productInfo.price,
      {
        ...productInfo.metadata,
        scrapedAt: new Date().toISOString(),
        url: product.url,
        available: productInfo.available,
      }
    );

    console.log(`Updated ${product.name}: ${stockStatus} ${productInfo.price ? `($${productInfo.price})` : ''} - Triggered ${result.triggeredAlerts} alerts`);

  } catch (error) {
    console.error(`Error scraping product ${product.name}:`, error);
    throw error;
  }
}