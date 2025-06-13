import { Request, Response, NextFunction } from 'express';

interface CacheItem {
  data: any;
  expiry: number;
}

const cache: Record<string, CacheItem> = {};

// Cache duration in milliseconds (default: 5 minutes)
const DEFAULT_DURATION = 5 * 60 * 1000;

export const cacheMiddleware = (duration = DEFAULT_DURATION) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = req.originalUrl;
    const now = Date.now();
    
    // If the cache key exists and hasn't expired, return cached data
    if (cache[key] && cache[key].expiry > now) {
      res.json(cache[key].data);
      return;
    }
    
    // Override res.json to store in cache before sending response
    const originalJson = res.json;
    res.json = function(body) {
      cache[key] = {
        data: body,
        expiry: now + duration
      };
      return originalJson.call(this, body);
    };
    
    next();
  };
};

// Utility to clear cache
export const clearCache = (key?: string): void => {
  if (key) {
    delete cache[key];
  } else {
    // Clear all cache
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};