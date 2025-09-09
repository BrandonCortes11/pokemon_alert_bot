import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { StockStatus } from '@prisma/client';

// Pokemon Center categories to scrape
export const POKEMON_CENTER_CATEGORIES = {
  'TCG': {
    name: 'Trading Card Game',
    urls: [
      'https://www.pokemoncenter.com/category/trading-card-game',
      'https://www.pokemoncenter.com/category/tcg-accessories',
      'https://www.pokemoncenter.com/category/deck-boxes',
      'https://www.pokemoncenter.com/category/sleeves',
    ]
  },
  'Plushies': {
    name: 'Plushies',
    urls: [
      'https://www.pokemoncenter.com/category/plush',
      'https://www.pokemoncenter.com/category/stuffed-animals',
    ]
  },
  'Apparel': {
    name: 'Apparel',
    urls: [
      'https://www.pokemoncenter.com/category/apparel',
      'https://www.pokemoncenter.com/category/clothing',
      'https://www.pokemoncenter.com/category/shirts',
      'https://www.pokemoncenter.com/category/hoodies',
    ]
  },
  'Accessories': {
    name: 'Accessories',
    urls: [
      'https://www.pokemoncenter.com/category/accessories',
      'https://www.pokemoncenter.com/category/bags',
      'https://www.pokemoncenter.com/category/home-office',
    ]
  },
  'New': {
    name: 'New Releases',
    urls: [
      'https://www.pokemoncenter.com/category/new',
      'https://www.pokemoncenter.com/category/new-arrivals',
    ]
  }
};

interface ScrapedProduct {
  name: string;
  url: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  category: string;
  sku?: string;
  stockStatus?: StockStatus;
}

interface ScrapeResult {
  products: ScrapedProduct[];
  totalFound: number;
  errors: string[];
}

export async function scrapePokemonCenterCatalog(
  categories: string[] = Object.keys(POKEMON_CENTER_CATEGORIES),
  maxProductsPerCategory: number = 100
): Promise<ScrapeResult> {
  console.log(`Starting Pokemon Center catalog scrape for categories: ${categories.join(', ')}`);
  
  const allProducts: ScrapedProduct[] = [];
  const errors: string[] = [];
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    // Scrape each category
    for (const categoryKey of categories) {
      const category = POKEMON_CENTER_CATEGORIES[categoryKey as keyof typeof POKEMON_CENTER_CATEGORIES];
      if (!category) {
        errors.push(`Unknown category: ${categoryKey}`);
        continue;
      }

      console.log(`Scraping category: ${category.name}`);
      
      for (const categoryUrl of category.urls) {
        try {
          const products = await scrapeCategoryPage(page, categoryUrl, category.name, maxProductsPerCategory);
          allProducts.push(...products);
          
          // Add delay between category pages
          await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
          
        } catch (error) {
          const errorMsg = `Error scraping ${categoryUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

  } catch (error) {
    const errorMsg = `Browser error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    errors.push(errorMsg);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Remove duplicates based on URL
  const uniqueProducts = allProducts.reduce((acc, product) => {
    const exists = acc.find(p => p.url === product.url);
    if (!exists) {
      acc.push(product);
    }
    return acc;
  }, [] as ScrapedProduct[]);

  console.log(`Catalog scrape complete. Found ${uniqueProducts.length} unique products with ${errors.length} errors`);

  return {
    products: uniqueProducts,
    totalFound: uniqueProducts.length,
    errors
  };
}

async function scrapeCategoryPage(
  page: any,
  url: string,
  category: string,
  maxProducts: number
): Promise<ScrapedProduct[]> {
  console.log(`Scraping category page: ${url}`);
  
  const products: ScrapedProduct[] = [];
  let currentPage = 1;
  const maxPages = Math.ceil(maxProducts / 24); // Assuming ~24 products per page

  while (products.length < maxProducts && currentPage <= maxPages) {
    const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`;
    
    try {
      await page.goto(pageUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Wait for products to load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract products from current page
      const pageProducts = await page.evaluate((categoryName: string) => {
        const products: ScrapedProduct[] = [];
        
        // Common selectors for Pokemon Center product listings
        const productSelectors = [
          '.product-tile',
          '.product-card',
          '.product-item',
          '[data-testid="product-tile"]',
          '.grid-tile',
          '.product-list-item'
        ];

        let productElements: Element[] = [];
        
        // Try each selector to find product containers
        for (const selector of productSelectors) {
          productElements = Array.from(document.querySelectorAll(selector));
          if (productElements.length > 0) break;
        }

        // Fallback: look for links containing "/product/" or "/p/"
        if (productElements.length === 0) {
          const allLinks = Array.from(document.querySelectorAll('a[href*="/product/"], a[href*="/p/"]'));
          productElements = allLinks.filter((link, index, arr) => 
            arr.findIndex(l => l.getAttribute('href') === link.getAttribute('href')) === index
          );
        }

        console.log(`Found ${productElements.length} product elements on page`);

        productElements.forEach((element) => {
          try {
            // Extract product URL
            const linkElement = element.querySelector('a') || element;
            const href = linkElement.getAttribute('href');
            if (!href) return;

            const url = href.startsWith('http') ? href : `https://www.pokemoncenter.com${href}`;
            
            // Extract product name
            const nameSelectors = [
              '.product-name',
              '.product-title', 
              '.tile-title',
              'h2',
              'h3',
              '[data-testid="product-name"]'
            ];
            
            let name = '';
            for (const selector of nameSelectors) {
              const nameElement = element.querySelector(selector);
              if (nameElement?.textContent?.trim()) {
                name = nameElement.textContent.trim();
                break;
              }
            }

            // Fallback: extract from URL or alt text
            if (!name) {
              const img = element.querySelector('img');
              name = img?.getAttribute('alt') || 
                     url.split('/').pop()?.replace(/-/g, ' ') || 
                     'Unknown Product';
            }

            // Extract image URL
            const img = element.querySelector('img');
            let imageUrl = img?.getAttribute('src') || img?.getAttribute('data-src');
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `https://www.pokemoncenter.com${imageUrl}`;
            }

            // Extract price
            const priceSelectors = [
              '.price',
              '.product-price',
              '.current-price',
              '[data-testid="price"]'
            ];
            
            let price: number | undefined;
            for (const selector of priceSelectors) {
              const priceElement = element.querySelector(selector);
              if (priceElement?.textContent) {
                const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
                const priceValue = parseFloat(priceText);
                if (!isNaN(priceValue) && priceValue > 0) {
                  price = priceValue;
                  break;
                }
              }
            }

            // Extract SKU from URL or data attributes
            let sku: string | undefined;
            const skuMatch = url.match(/\/([A-Z0-9-]+)$/);
            if (skuMatch) {
              sku = skuMatch[1];
            } else {
              sku = element.getAttribute('data-sku') || 
                    element.getAttribute('data-product-id') || 
                    undefined;
            }

            // Check stock status from page elements
            let stockStatus = StockStatus.UNKNOWN;
            const stockIndicators = element.textContent?.toLowerCase() || '';
            
            if (stockIndicators.includes('out of stock') || stockIndicators.includes('sold out')) {
              stockStatus = StockStatus.OUT_OF_STOCK;
            } else if (stockIndicators.includes('pre-order') || stockIndicators.includes('preorder')) {
              stockStatus = StockStatus.PREORDER;
            } else if (stockIndicators.includes('in stock') || stockIndicators.includes('available')) {
              stockStatus = StockStatus.IN_STOCK;
            }

            // Only add if we have minimum required data
            if (name && url) {
              products.push({
                name: name.substring(0, 255), // Limit name length
                url,
                imageUrl,
                price,
                category: categoryName,
                sku,
                stockStatus
              });
            }

          } catch (error) {
            console.error('Error extracting product:', error);
          }
        });

        return products;
      }, category);

      products.push(...pageProducts);
      console.log(`Page ${currentPage}: Found ${pageProducts.length} products (Total: ${products.length})`);

      // Check if there are more pages
      const hasNextPage = await page.evaluate(() => {
        const nextButtons = document.querySelectorAll('a[href*="page="], .pagination .next, .load-more');
        return nextButtons.length > 0;
      });

      if (!hasNextPage || pageProducts.length === 0) {
        break;
      }

      currentPage++;
      
      // Add delay between pages
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    } catch (error) {
      console.error(`Error on page ${currentPage}:`, error);
      break;
    }
  }

  return products.slice(0, maxProducts);
}

export async function saveCatalogToDatabase(
  products: ScrapedProduct[],
  storeId: string
): Promise<{ saved: number; updated: number; errors: string[] }> {
  console.log(`Saving ${products.length} products to database`);
  
  let saved = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const product of products) {
    try {
      // Check if product already exists (by URL or SKU)
      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { url: product.url },
            ...(product.sku ? [{ sku: product.sku }] : [])
          ]
        }
      });

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: product.name,
            imageUrl: product.imageUrl,
            category: product.category,
            currentStock: product.stockStatus || StockStatus.UNKNOWN,
            updatedAt: new Date(),
          }
        });
        updated++;
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: product.name,
            url: product.url,
            imageUrl: product.imageUrl,
            category: product.category,
            sku: product.sku || `PC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            storeId,
            currentStock: product.stockStatus || StockStatus.UNKNOWN,
          }
        });
        saved++;
      }

    } catch (error) {
      const errorMsg = `Error saving product ${product.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  console.log(`Database save complete. Saved: ${saved}, Updated: ${updated}, Errors: ${errors.length}`);
  
  return { saved, updated, errors };
}

export async function scrapeProductFromUrl(url: string): Promise<ScrapedProduct | null> {
  console.log(`🔍 Scraping individual product: ${url}`);
  
  let browser;
  try {
    // Validate URL format
    if (!url.includes('pokemoncenter.com')) {
      throw new Error('Invalid URL: Only Pokemon Center URLs are supported');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`📡 Navigating to URL: ${url}`);
    
    // Navigate with better error handling
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
    }

    console.log(`✅ Page loaded successfully (${response.status()})`);
    
    // Wait for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Debug: Take a screenshot for troubleshooting
    await page.screenshot({ path: 'debug-product-page.png', fullPage: false });
    
    // Debug: Save page HTML for inspection
    const pageHTML = await page.content();
    console.log(`📄 Page HTML length: ${pageHTML.length} characters`);
    
    // Debug: Check if page loaded correctly
    const pageTitle = await page.title();
    console.log(`📋 Page title: "${pageTitle}"`);
    
    // Debug: Check for common Pokemon Center elements
    const hasCommonElements = await page.evaluate(() => {
      const checks = {
        hasTitle: !!document.querySelector('title'),
        hasH1: !!document.querySelector('h1'),
        hasMetaTitle: !!document.querySelector('meta[property="og:title"]'),
        hasProductInfo: !!document.querySelector('[data-testid*="product"], .product, .pdp'),
        bodyText: document.body?.textContent?.substring(0, 200) || 'NO BODY TEXT',
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim()).filter(Boolean).slice(0, 5)
      };
      return checks;
    });
    
    console.log(`🔍 Page structure analysis:`, hasCommonElements);
    
    const product = await page.evaluate((productUrl: string) => {
      console.log('🔎 Starting product extraction...');
      
      // Multiple selector strategies for different Pokemon Center layouts
      const selectorStrategies = {
        modern: {
          name: [
            'h1[data-testid="pdp-product-name"]',
            'h1[data-testid="product-name"]', 
            'h1.pdp-product-name',
            '[data-testid="product-title"]'
          ],
          price: [
            '[data-testid="price-current"]',
            '[data-testid="current-price"]',
            '.price-current',
            '.pdp-price .price'
          ],
          image: [
            '[data-testid="pdp-product-image"]',
            '[data-testid="product-image-main"]',
            '.pdp-product-images img[src*="//"]:first-child'
          ]
        },
        legacy: {
          name: [
            'h1.product-title',
            '.product-details h1',
            '.product-info h1',
            'h1'
          ],
          price: [
            '.price',
            '.product-price',
            '.current-price'
          ],
          image: [
            '.product-image img',
            '.hero-image img',
            '.main-image img'
          ]
        },
        fallback: {
          name: [
            '[property="og:title"]',
            'title'
          ],
          price: [
            '*[text()*="$"]:not(script):not(style)'
          ],
          image: [
            '[property="og:image"]',
            'img[src*="pokemon"]'
          ]
        }
      };
      
      // Helper function to extract price from text
      function extractPriceFromText(text: string): number | undefined {
        console.log(`💰 Extracting price from text: "${text}"`);
        const priceMatch = text.match(/\$?([0-9]+(?:\.[0-9]{2})?)/);
        if (priceMatch) {
          const priceValue = parseFloat(priceMatch[1]);
          if (!isNaN(priceValue) && priceValue > 0) {
            console.log(`✅ Extracted price: $${priceValue}`);
            return priceValue;
          }
        }
        return undefined;
      }

      // Helper function to try multiple selectors
      function trySelectors(selectors: string[], type: 'text' | 'src' | 'content' = 'text'): string | null {
        for (const selector of selectors) {
          try {
            if (selector.startsWith('[property=') && type === 'content') {
              const meta = document.querySelector(selector) as HTMLMetaElement;
              if (meta?.content) {
                console.log(`✅ Found ${type} with meta selector "${selector}": ${meta.content}`);
                return meta.content;
              }
            } else if (type === 'src') {
              const img = document.querySelector(selector) as HTMLImageElement;
              if (img?.src && !img.src.includes('placeholder')) {
                console.log(`✅ Found image with selector "${selector}": ${img.src}`);
                return img.src;
              }
            } else {
              const element = document.querySelector(selector);
              if (element?.textContent?.trim()) {
                const text = element.textContent.trim();
                console.log(`✅ Found text with selector "${selector}": ${text}`);
                return text;
              }
            }
          } catch (e) {
            console.log(`❌ Error with selector "${selector}": ${e}`);
          }
        }
        return null;
      }
      
      // Try different strategies to extract product name
      let name = '';
      console.log('🏷️ Searching for product name...');
      
      // Strategy 1: Modern selectors
      name = trySelectors(selectorStrategies.modern.name);
      if (!name) {
        console.log('⚠️ Modern selectors failed, trying legacy...');
        // Strategy 2: Legacy selectors  
        name = trySelectors(selectorStrategies.legacy.name);
      }
      if (!name) {
        console.log('⚠️ Legacy selectors failed, trying fallback...');
        // Strategy 3: Fallback to meta tags
        name = trySelectors(selectorStrategies.fallback.name, 'content');
        if (name && name === document.title) {
          // Clean up title format
          name = name.split('|')[0]?.split(' - ')[0]?.trim() || name;
        }
      }
      
      if (!name) {
        console.log('❌ All name extraction strategies failed');
        // Log available headings for debugging
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map((h, i) => 
          `H${h.tagName.slice(-1)}[${i}]: "${h.textContent?.trim()}"`
        ).slice(0, 10);
        console.log('Available headings:', headings);
      }

      // Try different strategies to extract product image
      let imageUrl = '';
      console.log('🖼️ Searching for product image...');
      
      imageUrl = trySelectors(selectorStrategies.modern.image, 'src');
      if (!imageUrl) {
        console.log('⚠️ Modern image selectors failed, trying legacy...');
        imageUrl = trySelectors(selectorStrategies.legacy.image, 'src');
      }
      if (!imageUrl) {
        console.log('⚠️ Legacy image selectors failed, trying fallback...');
        imageUrl = trySelectors(selectorStrategies.fallback.image, 'content');
      }

      // Try different strategies to extract product price
      let price: number | undefined;
      console.log('💰 Searching for product price...');
      
      // Try modern price selectors first
      const modernPriceText = trySelectors(selectorStrategies.modern.price);
      if (modernPriceText) {
        price = extractPriceFromText(modernPriceText);
      }
      
      if (!price) {
        console.log('⚠️ Modern price selectors failed, trying legacy...');
        const legacyPriceText = trySelectors(selectorStrategies.legacy.price);
        if (legacyPriceText) {
          price = extractPriceFromText(legacyPriceText);
        }
      }
      
      if (!price) {
        console.log('⚠️ Legacy price selectors failed, trying text search...');
        // Fallback: search for price patterns in page text
        const bodyText = document.body?.textContent || '';
        const priceMatches = bodyText.match(/\$([0-9]+(?:\.[0-9]{2})?)/g);
        if (priceMatches && priceMatches.length > 0) {
          // Take the first reasonable price (between $1 and $1000)
          for (const match of priceMatches) {
            const priceValue = parseFloat(match.replace('$', ''));
            if (priceValue >= 1 && priceValue <= 1000) {
              price = priceValue;
              console.log(`✅ Found price via text search: $${price}`);
              break;
            }
          }
        }
      }

      // Enhanced description extraction
      const descSelectors = [
        '[data-testid="product-description"]',
        '.pdp-product-description',
        '.product-description',
        '.product-details',
        '.product-info .description',
        '.description',
        '.product-overview'
      ];
      
      let description = '';
      console.log('📝 Searching for product description...');
      for (const selector of descSelectors) {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) {
          description = element.textContent.trim();
          console.log(`✅ Found description with selector "${selector}"`);
          break;
        }
      }

      // Enhanced category detection
      let category = 'Unknown';
      const urlPath = productUrl.toLowerCase();
      console.log('📂 Determining product category...');
      
      if (urlPath.includes('tcg') || urlPath.includes('trading-card') || urlPath.includes('pokemon-tcg')) {
        category = 'TCG';
      } else if (urlPath.includes('plush') || urlPath.includes('stuffed')) {
        category = 'Plushies';
      } else if (urlPath.includes('apparel') || urlPath.includes('clothing') || urlPath.includes('shirt') || urlPath.includes('hoodie')) {
        category = 'Apparel';
      } else if (urlPath.includes('accessories') || urlPath.includes('figure') || urlPath.includes('toy')) {
        category = 'Accessories';
      } else if (urlPath.includes('new') || urlPath.includes('latest')) {
        category = 'New';
      }
      console.log(`📂 Category determined: ${category}`);

      // Enhanced SKU extraction
      let sku: string | undefined;
      // Try multiple SKU patterns
      const skuPatterns = [
        /product\/([A-Z0-9-]+)/,  // /product/ABC123
        /\/([A-Z0-9-]{6,})$/,     // /ABC123-DEF at end of URL
        /model-([A-Z0-9-]+)/,     // model-ABC123
      ];
      
      for (const pattern of skuPatterns) {
        const skuMatch = productUrl.match(pattern);
        if (skuMatch?.[1]) {
          sku = skuMatch[1];
          console.log(`🏷️ Found SKU: ${sku}`);
          break;
        }
      }

      // Enhanced stock status detection
      let stockStatus = StockStatus.UNKNOWN;
      const pageText = document.body.textContent?.toLowerCase() || '';
      
      console.log('📦 Checking stock status...');
      if (pageText.includes('out of stock') || pageText.includes('sold out') || pageText.includes('unavailable')) {
        stockStatus = StockStatus.OUT_OF_STOCK;
        console.log('📦 Stock status: OUT_OF_STOCK');
      } else if (pageText.includes('pre-order') || pageText.includes('preorder') || pageText.includes('pre order')) {
        stockStatus = StockStatus.PREORDER;
        console.log('📦 Stock status: PREORDER');
      } else if (pageText.includes('add to cart') || pageText.includes('buy now') || pageText.includes('add to bag')) {
        stockStatus = StockStatus.IN_STOCK;
        console.log('📦 Stock status: IN_STOCK');
      }

      // Final extraction summary with detailed logging
      const extractionResult = {
        name: name || null,
        hasImage: !!imageUrl,
        price: price || null,
        category,
        sku: sku || null,
        stockStatus,
        url: productUrl
      };
      
      console.log('📊 Final extraction summary:', extractionResult);
      
      // Enhanced error reporting
      if (!name) {
        console.log('❌ EXTRACTION FAILED: No product name found');
        console.log('🔍 Available DOM structure for debugging:');
        
        // Log more debugging info
        const debugInfo = {
          pageTitle: document.title,
          hasBody: !!document.body,
          bodyTextLength: document.body?.textContent?.length || 0,
          totalElements: document.querySelectorAll('*').length,
          h1Elements: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()).filter(Boolean),
          metaTags: Array.from(document.querySelectorAll('meta[property*="og:"], meta[name*="title"]')).map(m => ({
            name: m.getAttribute('name') || m.getAttribute('property'),
            content: m.getAttribute('content')
          })),
          dataTestIds: Array.from(document.querySelectorAll('[data-testid]')).map(el => el.getAttribute('data-testid')).slice(0, 20)
        };
        
        console.log('Debug info:', debugInfo);
        return null;
      }

      return {
        name,
        url: productUrl,
        imageUrl: imageUrl || undefined,
        price,
        description: description || undefined,
        category,
        sku,
        stockStatus
      };

    }, url);

    if (product) {
      console.log(`✅ Successfully scraped product: ${product.name}`);
      return product;
    } else {
      console.log('❌ Failed to extract product information - no name found');
      throw new Error('Unable to find product information on this Pokemon Center page. The page structure may have changed or the product may not be available. Please try with a different product URL or contact support.');
    }

  } catch (error) {
    console.error(`💥 Error scraping product from URL ${url}:`, error);
    
    // Provide more specific, user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('TimeoutError') || error.message.includes('timeout')) {
        throw new Error('The Pokemon Center website is taking too long to respond. Please try again in a few moments.');
      } else if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error('Unable to connect to Pokemon Center. Please check your internet connection and try again.');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        throw new Error('This Pokemon Center product page was not found. Please check the URL and try again.');
      } else if (error.message.includes('Unable to find product information')) {
        throw error; // Re-throw our custom error message
      } else if (error.message.includes('Invalid URL')) {
        throw error; // Re-throw URL validation errors
      }
    }
    
    throw new Error('An unexpected error occurred while trying to get product information. Please try again or contact support.');
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('🔒 Browser closed successfully');
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
}