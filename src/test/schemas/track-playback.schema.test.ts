/**
 * @fileoverview Schema validation tests for track-playback edge function
 * Tests for record (POST) and getStats (GET) request/response validation
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Schema for POST /track-playback - Record playback
 */
export const TrackPlaybackRecordSchema = z.object({
  track_id: z.string().min(1, 'track_id is required').max(500, 'track_id exceeds 500 characters'),
  track_name: z.string().min(1, 'track_name is required').max(500, 'track_name exceeds 500 characters'),
  artist_name: z.string().min(1, 'artist_name is required').max(500, 'artist_name exceeds 500 characters'),
  album_name: z.string().max(500).optional().nullable(),
  album_art: z.string().url('album_art must be a valid URL').optional().or(z.literal('')).or(z.null()),
  provider: z.enum(['spotify', 'youtube', 'soundcloud', 'local'], {
    errorMap: () => ({ message: 'provider must be one of: spotify, youtube, soundcloud, local' })
  }),
  duration_ms: z.number().int('duration_ms must be an integer').positive('duration_ms must be positive').optional().nullable(),
  completed: z.boolean().optional().default(false),
});

/**
 * Schema for GET /track-playback query params
 */
export const TrackPlaybackStatsQuerySchema = z.object({
  period: z.enum(['today', 'week', 'month', 'all']).default('week'),
});

/**
 * Schema for top track in stats response
 */
const TopTrackSchema = z.object({
  track_id: z.string(),
  track_name: z.string(),
  artist_name: z.string(),
  album_art: z.string().nullable().optional(),
  plays: z.number().int().nonnegative(),
});

/**
 * Schema for top artist in stats response
 */
const TopArtistSchema = z.object({
  artist_name: z.string(),
  plays: z.number().int().nonnegative(),
});

/**
 * Schema for hourly activity in stats response
 */
const HourlyActivitySchema = z.object({
  hour: z.number().int().min(0).max(23),
  count: z.number().int().nonnegative(),
});

/**
 * Schema for provider stats in stats response
 */
const ProviderStatsSchema = z.object({
  provider: z.string(),
  plays: z.number().int().nonnegative(),
});

/**
 * Schema for recent play in stats response
 */
const RecentPlaySchema = z.object({
  id: z.string(),
  track_id: z.string(),
  track_name: z.string(),
  artist_name: z.string(),
  album_name: z.string().nullable().optional(),
  album_art: z.string().nullable().optional(),
  provider: z.string(),
  duration_ms: z.number().nullable().optional(),
  completed: z.boolean().nullable().optional(),
  played_at: z.string(),
});

/**
 * Schema for GET /track-playback stats response
 */
export const TrackPlaybackStatsResponseSchema = z.object({
  totalPlays: z.number().int().nonnegative(),
  uniqueTracks: z.number().int().nonnegative(),
  uniqueArtists: z.number().int().nonnegative(),
  totalMinutes: z.number().nonnegative(),
  topTracks: z.array(TopTrackSchema).max(10),
  topArtists: z.array(TopArtistSchema).max(10),
  hourlyActivity: z.array(HourlyActivitySchema).length(24),
  recentPlays: z.array(RecentPlaySchema).max(20),
  providerStats: z.array(ProviderStatsSchema),
  period: z.string(),
});

// ============================================================================
// TESTS
// ============================================================================

describe('TrackPlaybackRecordSchema', () => {
  describe('Valid requests', () => {
    it('should validate record request with all fields', () => {
      const validComplete = {
        track_id: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        track_name: 'Bohemian Rhapsody',
        artist_name: 'Queen',
        album_name: 'A Night at the Opera',
        album_art: 'https://i.scdn.co/image/ab67616d0000b273',
        provider: 'spotify' as const,
        duration_ms: 354000,
        completed: true,
      };

      const result = TrackPlaybackRecordSchema.safeParse(validComplete);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validComplete);
      }
    });

    it('should validate record request with minimal required fields', () => {
      const validMinimal = {
        track_id: 'yt:video:abc123',
        track_name: 'Test Track',
        artist_name: 'Test Artist',
        provider: 'youtube' as const,
      };

      const result = TrackPlaybackRecordSchema.safeParse(validMinimal);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false); // Default value
      }
    });

    it('should validate record with spotify provider', () => {
      const data = {
        track_id: 'spotify:track:123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify' as const,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate record with youtube provider', () => {
      const data = {
        track_id: 'yt:video:123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'youtube' as const,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate record with soundcloud provider', () => {
      const data = {
        track_id: 'sc:track:123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'soundcloud' as const,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate record with local provider', () => {
      const data = {
        track_id: '/path/to/file.mp3',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'local' as const,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept empty string for album_art', () => {
      const data = {
        track_id: 'track:123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify' as const,
        album_art: '',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept null for optional fields', () => {
      const data = {
        track_id: 'track:123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify' as const,
        album_name: null,
        album_art: null,
        duration_ms: null,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid requests', () => {
    it('should reject missing track_id', () => {
      const data = {
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('track_id');
      }
    });

    it('should reject missing track_name', () => {
      const data = {
        track_id: '123',
        artist_name: 'Artist',
        provider: 'spotify',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('track_name');
      }
    });

    it('should reject missing artist_name', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        provider: 'spotify',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('artist_name');
      }
    });

    it('should reject missing provider', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        artist_name: 'Artist',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('provider');
      }
    });

    it('should reject track_id exceeding 500 characters', () => {
      const data = {
        track_id: 'a'.repeat(501),
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500 characters');
      }
    });

    it('should reject invalid album_art URL', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify',
        album_art: 'not-a-valid-url',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('URL');
      }
    });

    it('should reject negative duration_ms', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify',
        duration_ms: -1000,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive');
      }
    });

    it('should reject non-integer duration_ms', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'spotify',
        duration_ms: 1000.5,
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('integer');
      }
    });

    it('should reject invalid provider', () => {
      const data = {
        track_id: '123',
        track_name: 'Song',
        artist_name: 'Artist',
        provider: 'invalid_provider',
      };

      const result = TrackPlaybackRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('provider');
      }
    });
  });
});

describe('TrackPlaybackStatsQuerySchema', () => {
  it('should validate query with today period', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({ period: 'today' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('today');
    }
  });

  it('should validate query with week period', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({ period: 'week' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('week');
    }
  });

  it('should validate query with month period', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({ period: 'month' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('month');
    }
  });

  it('should validate query with all period', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({ period: 'all' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('all');
    }
  });

  it('should use default period when not provided', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('week');
    }
  });

  it('should reject invalid period value', () => {
    const result = TrackPlaybackStatsQuerySchema.safeParse({ period: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('TrackPlaybackStatsResponseSchema', () => {
  it('should validate complete stats response structure', () => {
    const validResponse = {
      totalPlays: 150,
      uniqueTracks: 45,
      uniqueArtists: 20,
      totalMinutes: 600,
      topTracks: [
        { track_id: '1', track_name: 'Song 1', artist_name: 'Artist 1', album_art: null, plays: 10 },
        { track_id: '2', track_name: 'Song 2', artist_name: 'Artist 2', album_art: 'https://example.com/art.jpg', plays: 8 },
      ],
      topArtists: [
        { artist_name: 'Artist 1', plays: 25 },
        { artist_name: 'Artist 2', plays: 20 },
      ],
      hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, count: Math.floor(Math.random() * 10) })),
      recentPlays: [
        {
          id: 'uuid-1',
          track_id: 'track:1',
          track_name: 'Recent Song',
          artist_name: 'Recent Artist',
          album_name: 'Album',
          album_art: 'https://example.com/art.jpg',
          provider: 'spotify',
          duration_ms: 240000,
          completed: true,
          played_at: new Date().toISOString(),
        },
      ],
      providerStats: [
        { provider: 'spotify', plays: 100 },
        { provider: 'youtube', plays: 50 },
      ],
      period: 'week',
    };

    const result = TrackPlaybackStatsResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should validate empty stats response', () => {
    const emptyResponse = {
      totalPlays: 0,
      uniqueTracks: 0,
      uniqueArtists: 0,
      totalMinutes: 0,
      topTracks: [],
      topArtists: [],
      hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
      recentPlays: [],
      providerStats: [],
      period: 'today',
    };

    const result = TrackPlaybackStatsResponseSchema.safeParse(emptyResponse);
    expect(result.success).toBe(true);
  });
});
