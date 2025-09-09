import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const dashboardRouter = createTRPCRouter({
  // Get dashboard statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [alertStats, productStats, recentActivity] = await Promise.all([
      // Alert statistics
      Promise.all([
        ctx.prisma.alert.count({
          where: { userId: ctx.session.user.id },
        }),
        ctx.prisma.alert.count({
          where: {
            userId: ctx.session.user.id,
            isActive: true,
          },
        }),
        ctx.prisma.alert.count({
          where: {
            userId: ctx.session.user.id,
            triggerCount: { gt: 0 },
          },
        }),
      ]),

      // Product statistics
      Promise.all([
        ctx.prisma.store.count({
          where: { isActive: true },
        }),
        ctx.prisma.product.count(),
      ]),

      // Recent activity
      ctx.prisma.alert.findMany({
        where: {
          userId: ctx.session.user.id,
          lastTriggered: { not: null },
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
        orderBy: { lastTriggered: "desc" },
        take: 5,
      }),
    ]);

    return {
      alerts: {
        total: alertStats[0],
        active: alertStats[1],
        triggered: alertStats[2],
      },
      products: {
        stores: productStats[0],
        total: productStats[1],
      },
      recentActivity: recentActivity.map((alert) => ({
        id: alert.id,
        name: alert.name,
        productName: alert.product.name,
        storeName: alert.product.store.displayName,
        triggeredAt: alert.lastTriggered,
        triggerCount: alert.triggerCount,
      })),
    };
  }),

  // Get system health status
  getSystemHealth: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Test database connection
      const dbTest = await ctx.prisma.user.count();
      
      // Check for recent stock updates (within last hour)
      const recentStockChecks = await ctx.prisma.stockCheck.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          },
        },
      });

      return {
        database: {
          status: "connected",
          userCount: dbTest,
        },
        monitoring: {
          status: recentStockChecks > 0 ? "active" : "inactive",
          recentChecks: recentStockChecks,
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      return {
        database: {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        monitoring: {
          status: "unknown",
          recentChecks: 0,
        },
        lastUpdated: new Date(),
      };
    }
  }),

  // Get alert analytics and performance metrics
  getAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const [
        alertTriggerHistory,
        topTriggeredAlerts,
        storePerformance,
        hourlyActivity,
      ] = await Promise.all([
        // Alert trigger history over time
        ctx.prisma.alert.findMany({
          where: {
            userId: ctx.session.user.id,
            lastTriggered: {
              gte: startDate,
            },
          },
          select: {
            id: true,
            name: true,
            triggerCount: true,
            lastTriggered: true,
            product: {
              select: {
                name: true,
                store: {
                  select: {
                    displayName: true,
                  },
                },
              },
            },
          },
          orderBy: { lastTriggered: "desc" },
        }),

        // Most triggered alerts
        ctx.prisma.alert.findMany({
          where: {
            userId: ctx.session.user.id,
            triggerCount: { gt: 0 },
          },
          include: {
            product: {
              include: {
                store: true,
              },
            },
          },
          orderBy: { triggerCount: "desc" },
          take: 5,
        }),

        // Store performance (stock check frequency)
        ctx.prisma.stockCheck.groupBy({
          by: ["productId"],
          where: {
            timestamp: {
              gte: startDate,
            },
            product: {
              alerts: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
          _count: {
            id: true,
          },
          orderBy: {
            _count: {
              id: "desc",
            },
          },
          take: 10,
        }),

        // Hourly activity pattern
        ctx.prisma.stockCheck.findMany({
          where: {
            timestamp: {
              gte: startDate,
            },
            product: {
              alerts: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
          select: {
            timestamp: true,
            status: true,
          },
        }),
      ]);

      // Process hourly activity data
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: 0,
      }));

      hourlyActivity.forEach((check) => {
        const hour = new Date(check.timestamp).getHours();
        hourlyData[hour].count++;
      });

      return {
        triggerHistory: alertTriggerHistory.map((alert) => ({
          id: alert.id,
          name: alert.name,
          productName: alert.product.name,
          storeName: alert.product.store.displayName,
          triggerCount: alert.triggerCount,
          lastTriggered: alert.lastTriggered,
        })),
        topAlerts: topTriggeredAlerts.map((alert) => ({
          id: alert.id,
          name: alert.name,
          productName: alert.product.name,
          storeName: alert.product.store.displayName,
          triggerCount: alert.triggerCount,
          isActive: alert.isActive,
        })),
        hourlyActivity: hourlyData,
        summary: {
          totalTriggers: alertTriggerHistory.reduce(
            (sum, alert) => sum + alert.triggerCount,
            0
          ),
          avgTriggersPerAlert:
            alertTriggerHistory.length > 0
              ? alertTriggerHistory.reduce(
                  (sum, alert) => sum + alert.triggerCount,
                  0
                ) / alertTriggerHistory.length
              : 0,
          mostActiveHour: hourlyData.reduce((max, current) =>
            current.count > max.count ? current : max
          ).hour,
        },
      };
    }),

  // Get detailed activity feed
  getActivityFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const activities = await ctx.prisma.stockCheck.findMany({
        where: {
          product: {
            alerts: {
              some: {
                userId: ctx.session.user.id,
                isActive: true,
              },
            },
          },
        },
        include: {
          product: {
            include: {
              store: true,
              alerts: {
                where: {
                  userId: ctx.session.user.id,
                },
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { timestamp: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (activities.length > input.limit) {
        const nextItem = activities.pop();
        nextCursor = nextItem!.id;
      }

      return {
        activities: activities.map((check) => ({
          id: check.id,
          timestamp: check.timestamp,
          status: check.status,
          price: check.price,
          product: {
            id: check.product.id,
            name: check.product.name,
            store: check.product.store.displayName,
          },
          alerts: check.product.alerts.map((alert) => ({
            id: alert.id,
            name: alert.name,
          })),
          metadata: check.metadata,
        })),
        nextCursor,
      };
    }),

  // Get trending alerts and insights
  getTrends: protectedProcedure.query(async ({ ctx }) => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      recentTriggers,
      oldTriggers,
      newAlertsThisWeek,
      stockCheckTrends,
    ] = await Promise.all([
      ctx.prisma.alert.count({
        where: {
          userId: ctx.session.user.id,
          lastTriggered: {
            gte: last7Days,
          },
        },
      }),

      ctx.prisma.alert.count({
        where: {
          userId: ctx.session.user.id,
          lastTriggered: {
            gte: last30Days,
            lt: last7Days,
          },
        },
      }),

      ctx.prisma.alert.count({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: last7Days,
          },
        },
      }),

      ctx.prisma.stockCheck.groupBy({
        by: ["status"],
        where: {
          timestamp: {
            gte: last7Days,
          },
          product: {
            alerts: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const triggerTrend = recentTriggers - oldTriggers;
    const stockTrends = stockCheckTrends.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      triggers: {
        thisWeek: recentTriggers,
        trend: triggerTrend,
        percentChange:
          oldTriggers > 0 ? ((triggerTrend / oldTriggers) * 100).toFixed(1) : "0",
      },
      newAlerts: newAlertsThisWeek,
      stockActivity: {
        inStock: stockTrends.IN_STOCK || 0,
        outOfStock: stockTrends.OUT_OF_STOCK || 0,
        preorder: stockTrends.PREORDER || 0,
        limitedStock: stockTrends.LIMITED_STOCK || 0,
      },
      insights: [
        recentTriggers > oldTriggers
          ? "📈 Alert activity is increasing!"
          : "📉 Alert activity has decreased",
        newAlertsThisWeek > 0
          ? `🎯 You created ${newAlertsThisWeek} new alerts this week`
          : "💡 Consider creating more alerts for better coverage",
        stockTrends.IN_STOCK > 0
          ? `🎉 ${stockTrends.IN_STOCK} products came back in stock!`
          : "⏳ No stock updates detected recently",
      ].filter(Boolean),
    };
  }),
});