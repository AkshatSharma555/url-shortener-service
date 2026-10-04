import { generateShortCode } from '../../utils/base62';
import { createUrlRecord, getUrlByShortCode, incrementClickCount } from './url.repository';
import { redis } from '../../core/redis';

const CACHE_TTL = 86400; // Cache expire time: 24 hours (in seconds)

export async function shortenUrl(originalUrl: string) {
  const shortCode = generateShortCode();
  const record = await createUrlRecord({ originalUrl, shortCode });
  
  // Cache the newly created URL immediately
  await redis.set(`url:${shortCode}`, originalUrl, 'EX', CACHE_TTL);
  
  return record;
}

export async function resolveUrl(shortCode: string) {
  // 1. Check Redis cache first
  const cachedUrl = await redis.get(`url:${shortCode}`);
  
  if (cachedUrl) {
    // Increment click count in background without blocking the response
    incrementClickCount(shortCode).catch(console.error);
    return { originalUrl: cachedUrl };
  }

  // 2. Cache Miss: Fallback to PostgreSQL Database
  const record = await getUrlByShortCode(shortCode);
  if (!record) return null;

  // 3. Populate Redis cache for subsequent requests
  await redis.set(`url:${shortCode}`, record.originalUrl, 'EX', CACHE_TTL);

  // Increment click count in background
  incrementClickCount(shortCode).catch(console.error);

  return record;
}