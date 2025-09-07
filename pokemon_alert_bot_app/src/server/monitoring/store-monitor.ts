import { prisma } from '@/lib/prisma';
import { StockStatus } from '@prisma/client';

// Store-specific monitors
import { monitorPokemonCenter } from './stores/pokemon-center';

// Main store monitoring function
export async function monitorStore(storeId: string, storeName: string, url: string) {
  try {
    console.log(`Monitoring store: ${storeName} (${storeId})`);
    
    // Get store configuration from database
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: {
          where: { 
            // Only monitor products that have active alerts
            alerts: {
              some: { isActive: true }
            }
          }
        }
      }
    });

    if (!store || !store.isActive) {
      console.log(`Store ${storeName} is not active, skipping monitoring`);
      return;
    }

    // Route to appropriate store monitor
    switch (store.name) {
      case 'pokemon_center':
        await monitorPokemonCenter(store);
        break;
      
      case 'best_buy':
        // await monitorBestBuy(store);
        console.log('Best Buy monitoring not implemented yet');
        break;
        
      case 'target':
        // await monitorTarget(store);
        console.log('Target monitoring not implemented yet');
        break;
        
      case 'walmart':
        // await monitorWalmart(store);
        console.log('Walmart monitoring not implemented yet');
        break;
        
      default:
        console.log(`No monitor implemented for store: ${store.name}`);
    }

  } catch (error) {
    console.error(`Error monitoring store ${storeName}:`, error);
    throw error;
  }
}

// Monitor all active stores
export async function monitorAllStores() {
  try {
    console.log('Starting monitoring cycle for all stores');
    
    const activeStores = await prisma.store.findMany({
      where: { isActive: true }
    });

    const monitorPromises = activeStores.map(store => 
      monitorStore(store.id, store.displayName, store.url)
        .catch(error => {
          console.error(`Failed to monitor ${store.displayName}:`, error);
          return null; // Don't let one store failure stop others
        })
    );

    await Promise.allSettled(monitorPromises);
    console.log('Completed monitoring cycle for all stores');
    
  } catch (error) {
    console.error('Error in monitorAllStores:', error);
    throw error;
  }
}

// Utility function to update product stock status
export async function updateProductStock(
  productId: string,
  status: StockStatus,
  price?: number,
  metadata?: any
) {
  try {
    // Create stock check record
    const stockCheck = await prisma.stockCheck.create({
      data: {
        productId,
        status,
        price,
        metadata,
        timestamp: new Date(),
      }
    });

    // Update product current stock status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        currentStock: status,
        lastPrice: price || undefined,
        updatedAt: new Date(),
      }
    });

    // Check if we need to trigger alerts
    const activeAlerts = await prisma.alert.findMany({
      where: {
        productId,
        isActive: true,
        OR: [
          // Stock condition alerts
          {
            stockConditions: {
              has: status
            }
          },
          // Price condition alerts
          {
            AND: [
              { priceThreshold: { not: null } },
              { priceDirection: { not: null } },
              price ? {
                OR: [
                  {
                    AND: [
                      { priceDirection: 'BELOW' },
                      { priceThreshold: { gte: price } }
                    ]
                  },
                  {
                    AND: [
                      { priceDirection: 'ABOVE' },
                      { priceThreshold: { lte: price } }
                    ]
                  }
                ]
              } : {}
            ]
          }
        ]
      },
      include: {
        user: true,
        product: {
          include: {
            store: true
          }
        }
      }
    });

    // Trigger notifications for matched alerts
    for (const alert of activeAlerts) {
      const notificationTypes = [];
      if (alert.emailNotify) notificationTypes.push('email');
      if (alert.smsNotify) notificationTypes.push('sms');
      if (alert.pushNotify) notificationTypes.push('push');
      if (alert.webhookUrl) notificationTypes.push('webhook');
      if (alert.discordWebhook) notificationTypes.push('discord');

      if (notificationTypes.length > 0) {
        // Import and trigger notification job
        const { addNotificationJob } = await import('@/lib/queue');
        await addNotificationJob(alert.id, alert.userId, productId, notificationTypes);

        // Update alert trigger info
        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            lastTriggered: new Date(),
            triggerCount: { increment: 1 },
          }
        });
      }
    }

    return { stockCheck, updatedProduct, triggeredAlerts: activeAlerts.length };
    
  } catch (error) {
    console.error(`Error updating product stock for ${productId}:`, error);
    throw error;
  }
}