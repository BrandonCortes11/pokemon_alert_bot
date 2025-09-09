import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const storesRouter = createTRPCRouter({
  // Get all stores with basic info
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.store.findMany({
      orderBy: [
        { isActive: "desc" }, // Active stores first
        { displayName: "asc" }
      ],
    });
  }),

  // Get stores with detailed statistics
  getWithStats: publicProcedure.query(async ({ ctx }) => {
    const stores = await ctx.prisma.store.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { isActive: "desc" },
        { displayName: "asc" }
      ],
    });

    // Get additional statistics for each store
    const storesWithStats = await Promise.all(
      stores.map(async (store) => {
        // Get recent stock checks count (last 24 hours)
        const recentChecks = await ctx.prisma.stockCheck.count({
          where: {
            product: {
              storeId: store.id,
            },
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
            },
          },
        });

        // Get products with active alerts
        const productsWithAlerts = await ctx.prisma.product.count({
          where: {
            storeId: store.id,
            alerts: {
              some: {
                isActive: true,
              },
            },
          },
        });

        // Get in-stock products count
        const inStockProducts = await ctx.prisma.product.count({
          where: {
            storeId: store.id,
            stockChecks: {
              some: {
                status: "IN_STOCK",
                timestamp: {
                  gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
                },
              },
            },
          },
        });

        return {
          ...store,
          stats: {
            totalProducts: store._count.products,
            productsWithAlerts,
            inStockProducts,
            recentChecks,
            lastUpdated: new Date(),
          },
          _count: undefined,
        };
      })
    );

    return storesWithStats;
  }),

  // Get store by ID with detailed stats
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { id: input.id },
        include: {
          products: {
            include: {
              stockChecks: {
                orderBy: { timestamp: "desc" },
                take: 1,
              },
              alerts: {
                where: { isActive: true },
              },
            },
            orderBy: { updatedAt: "desc" },
            take: 10, // Recent products
          },
        },
      });

      if (!store) {
        throw new Error("Store not found");
      }

      // Calculate store statistics
      const totalProducts = store.products.length;
      const inStockProducts = store.products.filter(
        (product) =>
          product.stockChecks[0]?.status === "IN_STOCK" &&
          product.stockChecks[0]?.timestamp > new Date(Date.now() - 60 * 60 * 1000)
      ).length;

      const productsWithAlerts = store.products.filter(
        (product) => product.alerts.length > 0
      ).length;

      return {
        ...store,
        stats: {
          totalProducts,
          inStockProducts,
          productsWithAlerts,
          lastUpdated: new Date(),
        },
        products: store.products.map((product) => ({
          ...product,
          latestStock: product.stockChecks[0] || null,
          stockChecks: undefined,
          alertCount: product.alerts.length,
          alerts: undefined,
        })),
      };
    }),

  // Get store health status
  getHealthStatus: publicProcedure.query(async ({ ctx }) => {
    const stores = await ctx.prisma.store.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            stockChecks: {
              orderBy: { timestamp: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    return stores.map((store) => {
      const productsWithRecentChecks = store.products.filter(
        (product) =>
          product.stockChecks[0]?.timestamp > new Date(Date.now() - 60 * 60 * 1000)
      ).length;

      const totalProducts = store.products.length;
      const healthPercentage = totalProducts > 0 
        ? Math.round((productsWithRecentChecks / totalProducts) * 100)
        : 0;

      let status: "healthy" | "warning" | "error" = "healthy";
      if (healthPercentage < 50) status = "error";
      else if (healthPercentage < 80) status = "warning";

      return {
        id: store.id,
        name: store.displayName,
        status,
        healthPercentage,
        totalProducts,
        recentlyChecked: productsWithRecentChecks,
        isActive: store.isActive,
      };
    });
  }),
});