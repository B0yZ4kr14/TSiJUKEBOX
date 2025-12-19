import type { LyricsLine } from '@/lib/lrcParser';

export interface LyricsData {
  source: 'lrclib' | 'genius' | 'none';
  synced: boolean;
  lines: LyricsLine[];
  plainText?: string;
  trackName: string;
  artistName: string;
}

export interface CachedLyrics {
  data: LyricsData;
  cachedAt: number;
  version: number;
}

export interface CacheStats {
  entries: number;
  sizeBytes: number;
}
