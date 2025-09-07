#!/usr/bin/env node

// Redis Connection Check for Pokemon Alert Bot
// Run with: node check-redis.js

const Redis = require('ioredis');

async function checkRedis() {
  console.log('🔍 Checking Redis Connection for Pokemon Alert Bot\n');

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  console.log(`📡 Connecting to: ${redisUrl}`);

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    connectTimeout: 5000,
  });

  try {
    // Test basic connection
    console.log('🔄 Testing connection...');
    const pong = await redis.ping();
    
    if (pong === 'PONG') {
      console.log('✅ Redis connection successful!');
      
      // Test basic operations
      console.log('\n🧪 Testing basic operations...');
      
      // Set and get test
      await redis.set('pokemon-test-key', 'pikachu', 'EX', 60);
      const value = await redis.get('pokemon-test-key');
      console.log(`✅ Set/Get test: ${value === 'pikachu' ? 'PASSED' : 'FAILED'}`);
      
      // Clean up
      await redis.del('pokemon-test-key');
      
      // Get Redis info
      const info = await redis.info('server');
      const version = info.match(/redis_version:([^\r\n]+)/)?.[1] || 'unknown';
      console.log(`📊 Redis version: ${version}`);
      
      // Check memory usage
      const memory = await redis.info('memory');
      const usedMemory = memory.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'unknown';
      console.log(`💾 Memory usage: ${usedMemory}`);
      
      // Test BullMQ compatibility
      console.log('\n🚛 Testing BullMQ compatibility...');
      
      // Create a test queue key
      const queueKey = 'bull:test-queue:waiting';
      await redis.lpush(queueKey, JSON.stringify({ test: 'data' }));
      const queueLength = await redis.llen(queueKey);
      console.log(`✅ Queue operations: ${queueLength > 0 ? 'PASSED' : 'FAILED'}`);
      
      // Clean up
      await redis.del(queueKey);
      
      console.log('\n🎉 Redis is ready for Pokemon Alert Bot job queues!');
      
      // Show configuration recommendations
      console.log('\n📋 Configuration Status:');
      console.log(`   🔗 Connection URL: ${redisUrl}`);
      console.log(`   🏪 Job Queue: Ready for BullMQ`);
      console.log(`   📊 Monitoring: Ready for scheduled tasks`);
      console.log(`   📧 Notifications: Ready for background processing`);
      
    } else {
      console.log('❌ Redis ping failed');
    }

  } catch (error) {
    console.log('❌ Redis connection failed!');
    console.log(`   Error: ${error.message}`);
    
    console.log('\n🔧 Troubleshooting:');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('   • Redis server is not running');
      console.log('   • Start Redis with: redis-server');
      console.log('   • Or install Redis: brew install redis (macOS)');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('   • Check your REDIS_URL in .env file');
      console.log('   • Verify the hostname/port are correct');
    } else if (error.message.includes('timeout')) {
      console.log('   • Redis server may be overloaded');
      console.log('   • Check network connectivity');
    }
    
    console.log('\n⚠️  Impact on Pokemon Alert Bot:');
    console.log('   • Job queue system will not work');
    console.log('   • Scheduled monitoring will be disabled');
    console.log('   • Manual monitoring can still work');
    
  } finally {
    await redis.quit();
  }
}

// Alternative check without Redis dependency
function checkRedisAlternative() {
  console.log('\n🔄 Alternative Redis Check (without ioredis dependency)...');
  
  const net = require('net');
  const url = require('url');
  
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const parsed = new URL(redisUrl);
  const host = parsed.hostname;
  const port = parseInt(parsed.port) || 6379;
  
  const socket = new net.Socket();
  socket.setTimeout(5000);
  
  socket.connect(port, host, () => {
    console.log(`✅ TCP connection to ${host}:${port} successful`);
    socket.write('PING\r\n');
  });
  
  socket.on('data', (data) => {
    const response = data.toString();
    if (response.includes('PONG')) {
      console.log('✅ Redis server is responding');
    } else {
      console.log('❌ Unexpected response from Redis');
    }
    socket.destroy();
  });
  
  socket.on('error', (error) => {
    console.log(`❌ TCP connection failed: ${error.message}`);
  });
  
  socket.on('timeout', () => {
    console.log('❌ Connection timeout');
    socket.destroy();
  });
}

// Run the check
if (require.main === module) {
  checkRedis().catch(() => {
    console.log('\n🔄 Falling back to basic connectivity check...');
    checkRedisAlternative();
    
    setTimeout(() => {
      console.log('\n📖 For more help, see TESTING.md');
      process.exit(1);
    }, 2000);
  });
}

module.exports = { checkRedis };