/**
 * Redis Configuration
 * إعدادات Redis
 */

import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// Create Redis client
export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
});

/**
 * Connect to Redis
 * الاتصال بـ Redis
 */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    logger.info('✅ Redis connected');
  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    throw error;
  }
}

/**
 * Disconnect from Redis
 * قطع الاتصال بـ Redis
 */
export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    logger.info('Redis disconnected');
  } catch (error) {
    logger.error('Error disconnecting from Redis:', error);
    throw error;
  }
}

// Handle Redis events
redis.on('connect', () => {
  logger.info('Redis client connected');
});

redis.on('error', err => {
  logger.error('Redis client error:', err);
});

redis.on('close', () => {
  logger.info('Redis connection closed');
});

/**
 * Cache helper functions
 * دوال مساعدة للكاش
 */

/**
 * Set cache with TTL
 * تخزين في الكاش مع وقت انتهاء
 */
export async function setCache(key: string, value: unknown, ttl = 300): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}

/**
 * Get from cache
 * الحصول من الكاش
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) {
    return null;
  }
  return JSON.parse(data) as T;
}

/**
 * Delete from cache
 * حذف من الكاش
 */
export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Delete by pattern
 * حذف بالنمط
 */
export async function deleteCacheByPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Check if key exists
 * التحقق من وجود المفتاح
 */
export async function cacheExists(key: string): Promise<boolean> {
  const exists = await redis.exists(key);
  return exists === 1;
}
