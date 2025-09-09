import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { StockStatus, PriceDirection } from "@prisma/client";

export const alertsRouter = createTRPCRouter({
  // Get all alerts for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const alerts = await ctx.prisma.alert.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: {
          include: {
            store: true,
            stockChecks: {
              orderBy: { timestamp: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return alerts.map((alert) => ({
      ...alert,
      product: {
        ...alert.product,
        latestStock: alert.product.stockChecks[0] || null,
        stockChecks: undefined,
      },
    }));
  }),

  // Get alert by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const alert = await ctx.prisma.alert.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          product: {
            include: {
              store: true,
              stockChecks: {
                orderBy: { timestamp: "desc" },
                take: 10,
              },
            },
          },
        },
      });

      if (!alert) {
        throw new Error("Alert not found");
      }

      return alert;
    }),

  // Create new alert
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string().min(1),
        stockConditions: z.array(z.nativeEnum(StockStatus)),
        priceThreshold: z.number().optional(),
        priceDirection: z.nativeEnum(PriceDirection).optional(),
        emailNotify: z.boolean().default(true),
        smsNotify: z.boolean().default(false),
        pushNotify: z.boolean().default(true),
        webhookUrl: z.string().url().optional().or(z.literal("")),
        discordWebhook: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { webhookUrl, discordWebhook, ...alertData } = input;

      return ctx.prisma.alert.create({
        data: {
          ...alertData,
          userId: ctx.session.user.id,
          webhookUrl: webhookUrl || null,
          discordWebhook: discordWebhook || null,
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
      });
    }),

  // Update alert
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        stockConditions: z.array(z.nativeEnum(StockStatus)).optional(),
        priceThreshold: z.number().optional().nullable(),
        priceDirection: z.nativeEnum(PriceDirection).optional().nullable(),
        emailNotify: z.boolean().optional(),
        smsNotify: z.boolean().optional(),
        pushNotify: z.boolean().optional(),
        webhookUrl: z.string().url().optional().or(z.literal("")),
        discordWebhook: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, webhookUrl, discordWebhook, ...updateData } = input;

      // Verify alert belongs to user
      const existingAlert = await ctx.prisma.alert.findFirst({
        where: {
          id: id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingAlert) {
        throw new Error("Alert not found or unauthorized");
      }

      return ctx.prisma.alert.update({
        where: { id },
        data: {
          ...updateData,
          webhookUrl: webhookUrl === "" ? null : webhookUrl,
          discordWebhook: discordWebhook === "" ? null : discordWebhook,
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
      });
    }),

  // Delete alert
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify alert belongs to user
      const existingAlert = await ctx.prisma.alert.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingAlert) {
        throw new Error("Alert not found or unauthorized");
      }

      return ctx.prisma.alert.delete({
        where: { id: input.id },
      });
    }),

  // Toggle alert active status
  toggle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify alert belongs to user
      const existingAlert = await ctx.prisma.alert.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingAlert) {
        throw new Error("Alert not found or unauthorized");
      }

      return ctx.prisma.alert.update({
        where: { id: input.id },
        data: {
          isActive: !existingAlert.isActive,
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
      });
    }),

  // Get alert statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalAlerts, activeAlerts, triggeredAlerts] = await Promise.all([
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
    ]);

    return {
      total: totalAlerts,
      active: activeAlerts,
      triggered: triggeredAlerts,
    };
  }),
});