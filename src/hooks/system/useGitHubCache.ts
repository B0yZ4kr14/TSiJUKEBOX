import { useState, useCallback } from 'react';

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  size: number;
  keys: string[];
  lastUpdate: number | null;
}

const CACHE_PREFIX = 'github_cache_';

const TTL_CONFIG: Record<string, number> = {
  'repo-info': 30,      // 30 minutos
  'commits': 5,         // 5 minutos
  'contributors': 60,   // 60 minutos
  'releases': 30,       // 30 minutos
  'branches': 15,       // 15 minutos
  'languages': 60,      // 60 minutos
};

export function getFromCache<T>(key: string): T | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const parsedCache: CachedData<T> = JSON.parse(cached);
    
    if (Date.now() > parsedCache.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return parsedCache.data;
  } catch (error) {
    console.error(`[useGitHubCache] Error reading cache for ${key}:`, error);
    return null;
  }
}

export function setToCache<T>(key: string, data: T, ttlMinutes?: number): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const ttl = ttlMinutes ?? TTL_CONFIG[key] ?? 15;
    
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttl * 60 * 1000),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`[useGitHubCache] Error setting cache for ${key}:`, error);
  }
}

export function isExpired(key: string): boolean {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return true;
    
    const parsedCache: CachedData<unknown> = JSON.parse(cached);
    return Date.now() > parsedCache.expiresAt;
  } catch {
    return true;
  }
}

export function getCacheTimestamp(key: string): number | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const parsedCache: CachedData<unknown> = JSON.parse(cached);
    return parsedCache.timestamp;
  } catch {
    return null;
  }
}

export function getCacheExpiration(key: string): number | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const parsedCache: CachedData<unknown> = JSON.parse(cached);
    return parsedCache.expiresAt;
  } catch {
    return null;
  }
}

export function clearCache(key?: string): void {
  try {
    if (key) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } else {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
    }
  } catch (error) {
    console.error('[useGitHubCache] Error clearing cache:', error);
  }
}

export function getCacheStats(): CacheStats {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    let totalSize = 0;
    let lastUpdate: number | null = null;
    
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += value.length * 2; // UTF-16 bytes
        try {
          const parsed: CachedData<unknown> = JSON.parse(value);
          if (!lastUpdate || parsed.timestamp > lastUpdate) {
            lastUpdate = parsed.timestamp;
          }
        } catch {
          // ignore
        }
      }
    });
    
    return {
      size: totalSize,
      keys: keys.map(k => k.replace(CACHE_PREFIX, '')),
      lastUpdate,
    };
  } catch {
    return { size: 0, keys: [], lastUpdate: null };
  }
}

export function useGitHubCache() {
  const [stats, setStats] = useState<CacheStats>(() => getCacheStats());
  
  const refreshStats = useCallback(() => {
    setStats(getCacheStats());
  }, []);
  
  const clear = useCallback((key?: string) => {
    clearCache(key);
    refreshStats();
  }, [refreshStats]);
  
  return {
    getFromCache,
    setToCache,
    isExpired,
    getCacheTimestamp,
    getCacheExpiration,
    clearCache: clear,
    stats,
    refreshStats,
  };
}
