import { createTRPCRouter } from "./trpc";
import { alertsRouter } from "./routers/alerts";
import { productsRouter } from "./routers/products";
import { dashboardRouter } from "./routers/dashboard";
import { storesRouter } from "./routers/stores";

export const appRouter = createTRPCRouter({
  alerts: alertsRouter,
  products: productsRouter,
  dashboard: dashboardRouter,
  stores: storesRouter,
});

export type AppRouter = typeof appRouter;