import { Queue, Worker, Job } from 'bullmq';
import redis from './redis';

// Define job types
export interface StoreMonitorJob {
  storeId: string;
  storeName: string;
  url: string;
}

export interface AlertJob {
  alertId: string;
  userId: string;
  productId: string;
  notificationTypes: string[];
}

// Create job queues
export const monitoringQueue = new Queue('store-monitoring', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    attempts: 3,
  },
});

export const notificationQueue = new Queue('notifications', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    attempts: 5,
  },
});

// Job processing functions
export async function processStoreMonitoring(job: Job<StoreMonitorJob>) {
  const { storeId, storeName, url } = job.data;
  
  try {
    console.log(`Starting monitoring for store: ${storeName} (${storeId})`);
    
    // Import the store monitor dynamically to avoid circular dependencies
    const { monitorStore } = await import('@/server/monitoring/store-monitor');
    await monitorStore(storeId, storeName, url);
    
    console.log(`Completed monitoring for store: ${storeName}`);
  } catch (error) {
    console.error(`Error monitoring store ${storeName}:`, error);
    throw error;
  }
}

export async function processNotification(job: Job<AlertJob>) {
  const { alertId, userId, productId, notificationTypes } = job.data;
  
  try {
    console.log(`Processing notification for alert: ${alertId}`);
    
    // Import notification service dynamically
    const { sendNotifications } = await import('@/server/notifications/notification-service');
    await sendNotifications(alertId, userId, productId, notificationTypes);
    
    console.log(`Completed notification for alert: ${alertId}`);
  } catch (error) {
    console.error(`Error sending notification for alert ${alertId}:`, error);
    throw error;
  }
}

// Create workers (only in Node.js environment, not in browsers)
let monitoringWorker: Worker | null = null;
let notificationWorker: Worker | null = null;

if (typeof window === 'undefined') {
  // Initialize workers only on server side
  monitoringWorker = new Worker('store-monitoring', processStoreMonitoring, {
    connection: redis,
    concurrency: 5,
  });

  notificationWorker = new Worker('notifications', processNotification, {
    connection: redis,
    concurrency: 10,
  });

  // Worker event handlers
  monitoringWorker.on('completed', (job) => {
    console.log(`Store monitoring job ${job.id} completed`);
  });

  monitoringWorker.on('failed', (job, err) => {
    console.error(`Store monitoring job ${job?.id} failed:`, err);
  });

  notificationWorker.on('completed', (job) => {
    console.log(`Notification job ${job.id} completed`);
  });

  notificationWorker.on('failed', (job, err) => {
    console.error(`Notification job ${job?.id} failed:`, err);
  });
}

// Schedule recurring monitoring jobs
export async function scheduleStoreMonitoring() {
  try {
    // Schedule monitoring every 5 minutes for active stores
    await monitoringQueue.add(
      'monitor-all-stores',
      { task: 'monitor-all-stores' },
      {
        repeat: { pattern: '*/5 * * * *' }, // Every 5 minutes
        jobId: 'recurring-store-monitoring',
      }
    );
    
    console.log('Store monitoring scheduled successfully');
  } catch (error) {
    console.error('Error scheduling store monitoring:', error);
  }
}

// Utility functions
export async function addStoreMonitoringJob(storeId: string, storeName: string, url: string) {
  return await monitoringQueue.add('monitor-store', {
    storeId,
    storeName,
    url,
  });
}

export async function addNotificationJob(alertId: string, userId: string, productId: string, notificationTypes: string[]) {
  return await notificationQueue.add('send-notification', {
    alertId,
    userId,
    productId,
    notificationTypes,
  });
}

export { monitoringWorker, notificationWorker };