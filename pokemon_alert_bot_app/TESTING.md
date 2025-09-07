# Phase 2 Testing Guide - Pokemon Alert Bot

## Prerequisites Setup

### 1. Environment Variables
Ensure your `.env` file has all required variables:

```bash
# Essential for Phase 2 testing
DATABASE_URL="your-supabase-or-local-postgresql-url"
NEXTAUTH_SECRET="your-generated-secret"
REDIS_URL="redis://localhost:6379"  # or cloud Redis
ADMIN_SECRET="your-admin-secret"

# Optional but recommended for full testing
RESEND_API_KEY="your-resend-key"  # for email notifications
FROM_EMAIL="alerts@yourdomain.com"
```

### 2. Services Running
```bash
# Start Redis (if local)
redis-server

# Start the application
npm run dev
```

## Step 1: Visual Interface Testing

### 1.1 Homepage UI (shadcn/ui Components)
**Test URL**: `http://localhost:3000`

**What to Check**:
- ✅ Clean, modern design with shadcn/ui styling
- ✅ Feature cards with proper spacing and typography
- ✅ Responsive layout (test on different screen sizes)
- ✅ Button styles (primary, outline, secondary variants)
- ✅ Status indicators showing Phase 2 completion

**Expected Results**:
- Professional-looking interface with consistent styling
- Cards should have subtle shadows and proper borders
- Buttons should have hover effects and proper focus states
- Mobile layout should stack components vertically

### 1.2 Authentication Pages
**Test URLs**: 
- `http://localhost:3000/auth/signin`
- `http://localhost:3000/auth/signup`

**What to Check**:
- ✅ Form styling matches new design system
- ✅ Input fields have proper focus states
- ✅ Google OAuth button displays correctly
- ✅ Error states show appropriate styling
- ✅ Responsive design on mobile devices

## Step 2: System Initialization Testing

### 2.1 Database Status Check
**Test URL**: `http://localhost:3000/api/test`

**Expected Response**:
```json
{
  "status": "ok",
  "message": "API and database connection working",
  "userCount": 0,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2.2 System Stats Check
**Test URL**: `http://localhost:3000/api/admin/seed` (GET request)

**Expected Response**:
```json
{
  "message": "Pokemon Alert Bot - System Status",
  "data": {
    "stores": 0,
    "products": 0,
    "alerts": 0,
    "users": 1
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2.3 Seed Store Data
**Method**: POST to `http://localhost:3000/api/admin/seed`

**Request Body**:
```json
{
  "action": "seed-stores",
  "secret": "your-admin-secret-from-env"
}
```

**Expected Response**:
```json
{
  "message": "Store data seeded successfully",
  "data": {
    "stores": {
      "pokemonCenter": { "id": "...", "name": "pokemon_center" },
      "bestBuy": { "id": "...", "name": "best_buy" },
      "target": { "id": "...", "name": "target" },
      "walmart": { "id": "...", "name": "walmart" }
    },
    "productCount": 4
  }
}
```

**Verification**: After seeding, GET `/api/admin/seed` should show:
- `stores: 4`
- `products: 4`

## Step 3: Monitoring Engine Testing

### 3.1 Manual Store Monitoring Test
Create a test file to manually trigger monitoring:

**Test Command**:
```bash
# In Node.js console or create a test script
node -e "
const { monitorAllStores } = require('./src/server/monitoring/store-monitor.ts');
monitorAllStores().then(() => console.log('Test complete')).catch(console.error);
"
```

### 3.2 Job Queue Testing (If Redis is running)
**Test scheduling monitoring**:

**Method**: POST to `http://localhost:3000/api/admin/seed`
```json
{
  "action": "schedule-monitoring",
  "secret": "your-admin-secret"
}
```

**Expected Response**:
```json
{
  "message": "Store monitoring scheduled successfully"
}
```

### 3.3 Individual Product Monitoring
**Manual Test**: Check if scraper can access Pokemon Center:

1. Look at browser network tab when visiting Pokemon Center product pages
2. Check if the scraper selectors work with current site structure
3. Verify stock status detection logic

**Common Issues to Check**:
- ✅ Puppeteer launches without errors
- ✅ Pokemon Center pages load successfully
- ✅ Stock detection selectors find elements
- ✅ Price extraction works correctly

## Step 4: Notification System Testing

### 4.1 Email Notification Test (If Resend configured)
**Create test notification job**:

```javascript
// Test script to run in Node.js
const { sendNotifications } = require('./src/server/notifications/notification-service');

// This would normally be called by the job queue
sendNotifications(
  'test-alert-id',
  'test-user-id', 
  'test-product-id',
  ['email']
).then(console.log).catch(console.error);
```

### 4.2 Notification Job Processing
**Check job queue functionality**:

1. Verify Redis connection: `redis-cli ping` should return `PONG`
2. Check BullMQ dashboard (if installed): `npm install bull-board`
3. Monitor job processing logs in console

### 4.3 Webhook Testing
**Test webhook functionality**:
- Use webhook.site or similar service to create test webhook URL
- Configure alert with webhook URL
- Trigger notification and verify payload delivery

## Step 5: End-to-End Integration Testing

### 5.1 Complete Alert Flow
**Prerequisites**: 
- User account created
- Store data seeded
- Test alert created

**Test Steps**:
1. **Create Test Alert**:
   ```javascript
   // Via Prisma or API
   const alert = await prisma.alert.create({
     data: {
       userId: 'your-user-id',
       productId: 'pokemon-center-product-id',
       name: 'Test Pokemon Card Alert',
       stockConditions: ['IN_STOCK'],
       emailNotify: true,
       isActive: true
     }
   });
   ```

2. **Trigger Monitoring**: 
   - Manual monitoring run
   - Or wait for scheduled job (every 5 minutes)

3. **Verify Stock Detection**:
   - Check `stock_checks` table for new records
   - Verify product `currentStock` updates
   - Check alert `lastTriggered` timestamp

4. **Verify Notification Delivery**:
   - Check email inbox (if configured)
   - Review notification job logs
   - Verify alert `triggerCount` increment

### 5.2 Performance Testing
**Check system resources**:
- Monitor memory usage during monitoring cycles
- Check database query performance
- Verify Redis memory usage
- Test concurrent job processing

### 5.3 Error Handling Testing
**Test failure scenarios**:

1. **Network Issues**:
   - Disconnect internet during monitoring
   - Verify graceful error handling
   - Check job retry logic

2. **Invalid URLs**:
   - Test with non-existent product URLs
   - Verify error logging and recovery

3. **Service Outages**:
   - Test behavior when Redis is down
   - Test behavior when database is unavailable
   - Verify notification service failures

## Verification Checklist

### ✅ Phase 2 Components Working
- [ ] shadcn/ui interface displays correctly
- [ ] Database connection and seeding works
- [ ] Pokemon Center scraper functions
- [ ] Job queue system processes tasks
- [ ] Notification system sends alerts
- [ ] Admin API endpoints respond
- [ ] Error handling works gracefully

### ✅ System Integration
- [ ] End-to-end alert flow functions
- [ ] Stock changes trigger notifications
- [ ] Multiple notification channels work
- [ ] System handles concurrent operations
- [ ] Performance is acceptable
- [ ] Logs provide useful debugging info

## Troubleshooting Common Issues

### 1. Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# Start Redis (macOS with Homebrew)
brew services start redis

# Or direct start
redis-server
```

### 2. Puppeteer Issues
```bash
# Install system dependencies (Linux)
sudo apt-get install -y libgbm1 libnss3 libatk-bridge2.0-0 libdrm2

# macOS - no additional setup needed
```

### 3. Database Connection Issues
- Verify DATABASE_URL in .env
- Check if database server is running
- Ensure tables are created with `npm run db:push`

### 4. Notification Issues
- Verify API keys in environment variables
- Check service provider documentation
- Test with simple payload first

## Success Indicators

**Phase 2 is working correctly when**:
1. 🎨 **UI**: Modern, responsive interface with shadcn/ui
2. 📊 **Data**: Store and product data seeds successfully
3. 🔄 **Monitoring**: Pokemon Center products are checked and stock status updates
4. 📧 **Notifications**: Email and other channels deliver alerts
5. ⚡ **Performance**: System handles monitoring cycles efficiently
6. 🛠️ **Admin**: Management APIs work for seeding and stats

**Next**: Ready for Phase 3 - Alert Management UI and tRPC API integration!