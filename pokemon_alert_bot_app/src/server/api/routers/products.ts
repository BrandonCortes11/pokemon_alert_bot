import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { 
  scrapePokemonCenterCatalog, 
  saveCatalogToDatabase,
  scrapeProductFromUrl,
  POKEMON_CENTER_CATEGORIES 
} from "@/server/monitoring/pokemon-center-catalog";
import { StockStatus } from "@prisma/client";

export const productsRouter = createTRPCRouter({
  // Search products by name
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
        storeId: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
          ...(input.storeId && { storeId: input.storeId }),
          ...(input.category && { category: input.category }),
        },
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
        take: input.limit,
        orderBy: { updatedAt: "desc" },
      });

      return products.map((product) => ({
        ...product,
        latestStock: product.stockChecks[0] || null,
        stockChecks: undefined,
      }));
    }),

  // Get products by store
  getByStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        limit: z.number().min(1).max(50).default(12),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          storeId: input.storeId,
        },
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { updatedAt: "desc" },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (products.length > input.limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products: products.map((product) => ({
          ...product,
          latestStock: product.stockChecks[0] || null,
          stockChecks: undefined,
        })),
        nextCursor,
      };
    }),

  // Get all stores
  getStores: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.store.findMany({
      where: { isActive: true },
      orderBy: { displayName: "asc" },
    });
  }),

  // Get popular products
  getPopular: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
          alerts: true,
        },
        take: input.limit,
        orderBy: { updatedAt: "desc" },
      });

      return products.map((product) => ({
        ...product,
        latestStock: product.stockChecks[0] || null,
        alertCount: product.alerts.length,
        stockChecks: undefined,
        alerts: undefined,
      }));
    }),

  // Get recently updated products
  getRecentlyUpdated: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
        take: input.limit,
        orderBy: { updatedAt: "desc" },
      });

      return products.map((product) => ({
        ...product,
        latestStock: product.stockChecks[0] || null,
        stockChecks: undefined,
      }));
    }),

  // Get product by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 20, // Show more history for detailed view
          },
          alerts: {
            where: { userId: ctx.session.user.id },
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        ...product,
        userAlerts: product.alerts,
        alerts: undefined,
      };
    }),

  // Get products with alerts for current user
  getWithAlerts: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        alerts: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        store: true,
        stockChecks: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
        alerts: {
          where: { userId: ctx.session.user.id },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return products.map((product) => ({
      ...product,
      latestStock: product.stockChecks[0] || null,
      userAlerts: product.alerts,
      stockChecks: undefined,
      alerts: undefined,
    }));
  }),

  // Get products by category
  getByCategory: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        category: z.string(),
        limit: z.number().min(1).max(100).default(24),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          storeId: input.storeId,
          category: input.category,
        },
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { updatedAt: "desc" },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (products.length > input.limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products: products.map((product) => ({
          ...product,
          latestStock: product.stockChecks[0] || null,
          stockChecks: undefined,
        })),
        nextCursor,
      };
    }),

  // Get available categories for a store
  getCategories: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.prisma.product.groupBy({
        by: ['category'],
        where: {
          storeId: input.storeId,
        },
        _count: {
          category: true,
        },
        orderBy: {
          _count: {
            category: 'desc',
          },
        },
      });

      return categories.map((cat) => ({
        name: cat.category,
        count: cat._count.category,
      }));
    }),

  // Scrape Pokemon Center catalog
  scrapeCatalog: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        categories: z.array(z.string()).optional(),
        maxProductsPerCategory: z.number().min(1).max(500).default(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify store exists and is Pokemon Center
      const store = await ctx.prisma.store.findUnique({
        where: { id: input.storeId },
      });

      if (!store || store.name !== 'pokemon_center') {
        throw new Error('Scraping is only available for Pokemon Center');
      }

      // Default to all categories if none specified
      const categoriesToScrape = input.categories || Object.keys(POKEMON_CENTER_CATEGORIES);

      // Scrape the catalog
      const scrapeResult = await scrapePokemonCenterCatalog(
        categoriesToScrape,
        input.maxProductsPerCategory
      );

      // Save to database
      const saveResult = await saveCatalogToDatabase(
        scrapeResult.products,
        input.storeId
      );

      return {
        scraped: scrapeResult.totalFound,
        saved: saveResult.saved,
        updated: saveResult.updated,
        errors: [...scrapeResult.errors, ...saveResult.errors],
      };
    }),

  // Add product from URL
  addFromUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        storeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate URL is from Pokemon Center
      if (!input.url.includes('pokemoncenter.com')) {
        throw new Error('Only Pokemon Center URLs are supported');
      }

      // Check if product already exists
      const existingProduct = await ctx.prisma.product.findFirst({
        where: { url: input.url },
      });

      if (existingProduct) {
        return {
          product: existingProduct,
          isNew: false,
        };
      }

      // Scrape product from URL
      const scrapedProduct = await scrapeProductFromUrl(input.url);
      
      if (!scrapedProduct) {
        throw new Error('Could not extract product information from URL');
      }

      // Create product in database
      const product = await ctx.prisma.product.create({
        data: {
          name: scrapedProduct.name,
          url: scrapedProduct.url,
          imageUrl: scrapedProduct.imageUrl,
          category: scrapedProduct.category,
          sku: scrapedProduct.sku || `PC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          storeId: input.storeId,
          currentStock: scrapedProduct.stockStatus || StockStatus.UNKNOWN,
        },
        include: {
          store: true,
          stockChecks: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      });

      return {
        product: {
          ...product,
          latestStock: product.stockChecks[0] || null,
          stockChecks: undefined,
        },
        isNew: true,
      };
    }),

  // Validate Pokemon Center URL
  validateUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      try {
        const parsedUrl = new URL(input.url);
        
        const isValidDomain = parsedUrl.hostname === 'www.pokemoncenter.com' || 
                             parsedUrl.hostname === 'pokemoncenter.com';
        
        const isProductUrl = parsedUrl.pathname.includes('/product/') || 
                            parsedUrl.pathname.includes('/p/');

        return {
          isValid: isValidDomain && isProductUrl,
          domain: parsedUrl.hostname,
          isProductPage: isProductUrl,
        };
      } catch (error) {
        return {
          isValid: false,
          domain: null,
          isProductPage: false,
        };
      }
    }),
});