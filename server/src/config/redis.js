const Redis = require('ioredis');

let redis = null;

// Only create Redis client if REDIS_URL is properly configured
if (process.env.REDIS_URL && !process.env.REDIS_URL.includes('placeholder')) {
  redis = new Redis(process.env.REDIS_URL, {
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis.on('connect', () => {
    console.log('✓ Redis connected');
  });

  redis.on('error', (err) => {
    console.error('⚠ Redis error (optional service):', err.message);
  });

  // Try to connect, but don't crash if it fails
  redis.connect().catch((err) => {
    console.warn('⚠ Redis unavailable - caching disabled (not critical for MVP)');
    redis = null;
  });

  // Handle graceful shutdown
  process.on('beforeExit', async () => {
    if (redis) await redis.quit();
  });
} else {
  console.log('ℹ Redis not configured - using PostgreSQL cache only (sufficient for MVP)');
}

module.exports = redis;
