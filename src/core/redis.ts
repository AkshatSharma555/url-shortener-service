import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('CRITICAL: REDIS_URL environment variable is missing.');
}

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});