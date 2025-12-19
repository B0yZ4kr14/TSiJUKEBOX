import type { LyricsData, CachedLyrics, CacheStats } from '@/types/lyrics';

const CACHE_KEY_PREFIX = 'lyrics_cache_';
const CACHE_INDEX_KEY = 'lyrics_cache_index';
const CACHE_VERSION = 1;
const MAX_CACHE_ENTRIES = 100;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function normalizeKey(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function generateCacheKey(trackName: string, artistName: string): string {
  const normalized = `${normalizeKey(trackName)}::${normalizeKey(artistName)}`;
  return `${CACHE_KEY_PREFIX}${btoa(encodeURIComponent(normalized))}`;
}

function getCacheIndex(): string[] {
  try {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch {
    return [];
  }
}

function setCacheIndex(index: string[]): void {
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch {
    // Storage full, will be handled by eviction
  }
}

function evictOldEntries(): void {
  const index = getCacheIndex();
  if (index.length < MAX_CACHE_ENTRIES) return;

  // Sort by cachedAt and remove oldest 20%
  const entries: { key: string; cachedAt: number }[] = [];
  
  for (const key of index) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed: CachedLyrics = JSON.parse(item);
        entries.push({ key, cachedAt: parsed.cachedAt });
      }
    } catch {
      localStorage.removeItem(key);
    }
  }

  entries.sort((a, b) => a.cachedAt - b.cachedAt);
  const toRemove = Math.ceil(entries.length * 0.2);
  
  for (let i = 0; i < toRemove; i++) {
    localStorage.removeItem(entries[i].key);
  }

  const remainingKeys = entries.slice(toRemove).map(e => e.key);
  setCacheIndex(remainingKeys);
}

export function getCachedLyrics(trackName: string, artistName: string): LyricsData | null {
  const key = generateCacheKey(trackName, artistName);
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const cached: CachedLyrics = JSON.parse(item);

    // Check version
    if (cached.version !== CACHE_VERSION) {
      localStorage.removeItem(key);
      return null;
    }

    // Check TTL
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      const index = getCacheIndex().filter(k => k !== key);
      setCacheIndex(index);
      return null;
    }

    return cached.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedLyrics(trackName: string, artistName: string, data: LyricsData): void {
  const key = generateCacheKey(trackName, artistName);

  const cached: CachedLyrics = {
    data,
    cachedAt: Date.now(),
    version: CACHE_VERSION,
  };

  try {
    evictOldEntries();
    localStorage.setItem(key, JSON.stringify(cached));
    
    const index = getCacheIndex();
    if (!index.includes(key)) {
      index.push(key);
      setCacheIndex(index);
    }
  } catch (error) {
    // Storage full - evict more aggressively
    console.warn('localStorage full, clearing lyrics cache');
    clearLyricsCache();
    try {
      localStorage.setItem(key, JSON.stringify(cached));
      setCacheIndex([key]);
    } catch {
      // Give up
    }
  }
}

export function clearLyricsCache(): void {
  const index = getCacheIndex();
  for (const key of index) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(CACHE_INDEX_KEY);
}

export function getCacheStats(): CacheStats {
  const index = getCacheIndex();
  let sizeBytes = 0;

  for (const key of index) {
    const item = localStorage.getItem(key);
    if (item) {
      sizeBytes += item.length * 2; // UTF-16
    }
  }

  return {
    entries: index.length,
    sizeBytes,
  };
}
