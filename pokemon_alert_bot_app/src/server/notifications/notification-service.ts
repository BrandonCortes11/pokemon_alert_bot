import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
// import twilio from 'twilio'; // Uncomment when SMS is needed

// Initialize notification services
const resend = new Resend(process.env.RESEND_API_KEY);

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

export async function sendNotifications(
  alertId: string,
  userId: string,
  productId: string,
  notificationTypes: string[]
) {
  try {
    console.log(`Sending notifications for alert ${alertId}`);

    // Get alert details with related data
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        user: true,
        product: {
          include: {
            store: true,
            stockChecks: {
              orderBy: { timestamp: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    const product = alert.product;
    const user = alert.user;
    const latestStock = product.stockChecks[0];

    // Prepare notification data
    const notificationData = {
      alertName: alert.name,
      productName: product.name,
      productUrl: product.url,
      productImage: product.imageUrl,
      storeName: product.store.displayName,
      storeUrl: product.store.url,
      currentStock: product.currentStock,
      currentPrice: product.lastPrice,
      userName: user.name || user.email,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
    };

    const results = [];

    // Send email notification
    if (notificationTypes.includes('email') && user.email) {
      try {
        const emailResult = await sendEmailNotification(notificationData);
        results.push({ type: 'email', success: true, result: emailResult });
      } catch (error) {
        console.error('Email notification failed:', error);
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Send SMS notification (if configured)
    if (notificationTypes.includes('sms') && user.phone) {
      try {
        const smsResult = await sendSMSNotification(notificationData, user.phone);
        results.push({ type: 'sms', success: true, result: smsResult });
      } catch (error) {
        console.error('SMS notification failed:', error);
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Send push notification
    if (notificationTypes.includes('push')) {
      try {
        const pushResult = await sendPushNotification(notificationData, userId);
        results.push({ type: 'push', success: true, result: pushResult });
      } catch (error) {
        console.error('Push notification failed:', error);
        results.push({ type: 'push', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Send webhook notification
    if (notificationTypes.includes('webhook') && alert.webhookUrl) {
      try {
        const webhookResult = await sendWebhookNotification(notificationData, alert.webhookUrl);
        results.push({ type: 'webhook', success: true, result: webhookResult });
      } catch (error) {
        console.error('Webhook notification failed:', error);
        results.push({ type: 'webhook', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Send Discord notification
    if (notificationTypes.includes('discord') && alert.discordWebhook) {
      try {
        const discordResult = await sendDiscordNotification(notificationData, alert.discordWebhook);
        results.push({ type: 'discord', success: true, result: discordResult });
      } catch (error) {
        console.error('Discord notification failed:', error);
        results.push({ type: 'discord', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    console.log(`Completed notifications for alert ${alertId}:`, results);
    return results;

  } catch (error) {
    console.error(`Error sending notifications for alert ${alertId}:`, error);
    throw error;
  }
}

async function sendEmailNotification(data: any) {
  const subject = `🔥 Pokemon Card Alert: ${data.productName} - ${data.currentStock}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Pokemon Alert Bot 🎯</h2>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${data.alertName}</h3>
        <p style="margin: 0; color: #6b7280;">Your alert has been triggered!</p>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        ${data.productImage ? `<img src="${data.productImage}" alt="${data.productName}" style="max-width: 200px; border-radius: 4px; margin-bottom: 15px;">` : ''}
        
        <h4 style="margin: 0 0 10px 0; color: #1f2937;">${data.productName}</h4>
        <p style="margin: 5px 0;"><strong>Store:</strong> ${data.storeName}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> 
          <span style="background: ${getStatusColor(data.currentStock)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${formatStatus(data.currentStock)}
          </span>
        </p>
        ${data.currentPrice ? `<p style="margin: 5px 0;"><strong>Price:</strong> $${data.currentPrice}</p>` : ''}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.productUrl}" 
           style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
          View Product
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>Pokemon Alert Bot - Never miss a restock again!</p>
        <p>Alert triggered at ${new Date(data.timestamp).toLocaleString()}</p>
      </div>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.FROM_EMAIL || 'alerts@pokemon-alerts.com',
    to: data.userEmail,
    subject,
    html,
  });
}

async function sendSMSNotification(data: any, phoneNumber: string) {
  // Placeholder for SMS notification
  // Uncomment when Twilio is configured
  
  const message = `🎯 Pokemon Alert: ${data.productName} is now ${formatStatus(data.currentStock)} at ${data.storeName}! ${data.currentPrice ? `$${data.currentPrice} - ` : ''}Check it out: ${data.productUrl}`;

  console.log(`SMS notification (not sent): ${message}`);
  
  // return await twilioClient.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phoneNumber,
  // });

  return { message: 'SMS notification logged (Twilio not configured)' };
}

async function sendPushNotification(data: any, userId: string) {
  // Placeholder for web push notifications
  // This would integrate with service workers and push API
  
  const payload = {
    title: `🎯 ${data.productName}`,
    body: `${formatStatus(data.currentStock)} at ${data.storeName}${data.currentPrice ? ` - $${data.currentPrice}` : ''}`,
    icon: data.productImage || '/icons/pokemon-ball-icon.png',
    badge: '/icons/pokemon-ball-badge.png',
    url: data.productUrl,
    data: {
      alertId: data.alertId,
      productUrl: data.productUrl,
      timestamp: data.timestamp,
    },
  };

  console.log(`Push notification (not sent): ${JSON.stringify(payload)}`);
  
  return { message: 'Push notification logged (Web Push not configured)' };
}

async function sendWebhookNotification(data: any, webhookUrl: string) {
  const payload = {
    alert: {
      name: data.alertName,
      timestamp: data.timestamp,
    },
    product: {
      name: data.productName,
      url: data.productUrl,
      image: data.productImage,
      status: data.currentStock,
      price: data.currentPrice,
    },
    store: {
      name: data.storeName,
      url: data.storeUrl,
    },
    user: {
      name: data.userName,
      email: data.userEmail,
    },
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Pokemon-Alert-Bot/1.0',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
  }

  return await response.json().catch(() => ({ status: 'sent' }));
}

async function sendDiscordNotification(data: any, discordWebhookUrl: string) {
  const embed = {
    title: `🎯 Pokemon Card Alert`,
    description: `**${data.alertName}** has been triggered!`,
    color: getStatusColorHex(data.currentStock),
    fields: [
      {
        name: 'Product',
        value: data.productName,
        inline: false,
      },
      {
        name: 'Store',
        value: data.storeName,
        inline: true,
      },
      {
        name: 'Status',
        value: formatStatus(data.currentStock),
        inline: true,
      },
      ...(data.currentPrice ? [{
        name: 'Price',
        value: `$${data.currentPrice}`,
        inline: true,
      }] : []),
    ],
    thumbnail: data.productImage ? { url: data.productImage } : undefined,
    footer: {
      text: 'Pokemon Alert Bot',
    },
    timestamp: data.timestamp,
  };

  const payload = {
    username: 'Pokemon Alert Bot',
    avatar_url: 'https://example.com/pokemon-ball-icon.png',
    embeds: [embed],
  };

  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
  }

  return { status: 'sent', messageId: response.headers.get('X-Message-Id') };
}

// Utility functions
function formatStatus(status: string): string {
  switch (status) {
    case 'IN_STOCK':
      return 'In Stock';
    case 'OUT_OF_STOCK':
      return 'Out of Stock';
    case 'LIMITED_STOCK':
      return 'Limited Stock';
    case 'PREORDER':
      return 'Pre-order Available';
    default:
      return 'Unknown';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'IN_STOCK':
      return '#10b981';
    case 'LIMITED_STOCK':
      return '#f59e0b';
    case 'PREORDER':
      return '#3b82f6';
    case 'OUT_OF_STOCK':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

function getStatusColorHex(status: string): number {
  switch (status) {
    case 'IN_STOCK':
      return 0x10b981;
    case 'LIMITED_STOCK':
      return 0xf59e0b;
    case 'PREORDER':
      return 0x3b82f6;
    case 'OUT_OF_STOCK':
      return 0xef4444;
    default:
      return 0x6b7280;
  }
}