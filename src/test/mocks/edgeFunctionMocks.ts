/**
 * @fileoverview Mock utilities for edge function testing
 * Provides mock factories and helpers for simulating edge function responses
 */

import { vi } from 'vitest';
import { mockAggregatedStats, mockPlaybackTrack } from '../fixtures/integrationData';

// ============================================================================
// Types
// ============================================================================

/** Compatible with Supabase functions.invoke response */
export interface FunctionsResponse<T = unknown> {
  data: T | null;
  error: { name: string; message: string; context?: { status?: number } } | null;
}

export interface EdgeFunctionResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

export interface TrackPlaybackRecordData {
  track_id: string;
  track_name: string;
  artist_name: string;
  album_name?: string | null;
  album_art?: string | null;
  provider: 'spotify' | 'youtube' | 'soundcloud' | 'local';
  duration_ms?: number | null;
  completed?: boolean;
}

export interface TrackPlaybackStatsResponse {
  totalPlays: number;
  uniqueTracks: number;
  uniqueArtists: number;
  totalMinutes: number;
  topTracks: Array<{
    track_id: string;
    track_name: string;
    artist_name: string;
    album_art: string | null;
    plays: number;
  }>;
  topArtists: Array<{
    artist_name: string;
    plays: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    count: number;
  }>;
  recentPlays: Array<{
    id: string;
    track_id: string;
    track_name: string;
    artist_name: string;
    album_name: string | null;
    album_art: string | null;
    provider: string;
    duration_ms: number | null;
    completed: boolean;
    played_at: string;
  }>;
  providerStats: Array<{
    provider: string;
    plays: number;
  }>;
  period: string;
}

// ============================================================================
// Mock Factories
// ============================================================================

/**
 * Creates a mock for the track-playback edge function
 */
export function createTrackPlaybackMock() {
  return {
    record: vi.fn().mockResolvedValue({
      data: { 
        success: true, 
        data: { 
          id: 'uuid-mock-1',
          ...mockPlaybackTrack,
          played_at: new Date().toISOString(),
        } 
      },
      error: null,
    }),

    getStats: vi.fn().mockResolvedValue({
      data: mockAggregatedStats,
      error: null,
    }),

    // Reset all mocks
    reset: function() {
      this.record.mockClear();
      this.getStats.mockClear();
    },

    // Configure error response
    setRecordError: function(message: string, status = 500) {
      this.record.mockResolvedValue({
        data: null,
        error: new Error(message),
      });
    },

    setStatsError: function(message: string, status = 500) {
      this.getStats.mockResolvedValue({
        data: null,
        error: new Error(message),
      });
    },
  };
}

/**
 * Creates a generic edge function response mock compatible with Supabase FunctionsResponse
 */
export function mockEdgeFunctionResponse<T>(data: T): FunctionsResponse<T> {
  return {
    data,
    error: null,
  };
}

/**
 * Creates an edge function error response mock compatible with Supabase FunctionsResponse
 */
export function mockEdgeFunctionError(message: string, status = 500): FunctionsResponse<null> {
  return {
    data: null,
    error: {
      name: 'FunctionsHttpError',
      message,
      context: { status },
    } as any,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a mock for recording playback with custom data
 */
export function createRecordPlaybackMock(customData?: Partial<TrackPlaybackRecordData>) {
  const defaultData: TrackPlaybackRecordData = {
    track_id: 'spotify:track:test123',
    track_name: 'Test Track',
    artist_name: 'Test Artist',
    provider: 'spotify',
    completed: false,
  };

  return {
    success: true,
    data: {
      id: `uuid-${Date.now()}`,
      ...defaultData,
      ...customData,
      played_at: new Date().toISOString(),
    },
  };
}

/**
 * Creates a mock stats response with custom values
 */
export function createStatsMock(customStats?: Partial<TrackPlaybackStatsResponse>): TrackPlaybackStatsResponse {
  const defaultStats: TrackPlaybackStatsResponse = {
    totalPlays: 150,
    uniqueTracks: 45,
    uniqueArtists: 20,
    totalMinutes: 600,
    topTracks: [
      { track_id: '1', track_name: 'Top Song 1', artist_name: 'Artist 1', album_art: null, plays: 25 },
      { track_id: '2', track_name: 'Top Song 2', artist_name: 'Artist 2', album_art: null, plays: 20 },
      { track_id: '3', track_name: 'Top Song 3', artist_name: 'Artist 3', album_art: null, plays: 15 },
    ],
    topArtists: [
      { artist_name: 'Artist 1', plays: 50 },
      { artist_name: 'Artist 2', plays: 40 },
      { artist_name: 'Artist 3', plays: 30 },
    ],
    hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 10),
    })),
    recentPlays: [
      {
        id: 'uuid-recent-1',
        track_id: 'track:recent1',
        track_name: 'Recent Song',
        artist_name: 'Recent Artist',
        album_name: 'Recent Album',
        album_art: null,
        provider: 'spotify',
        duration_ms: 240000,
        completed: true,
        played_at: new Date().toISOString(),
      },
    ],
    providerStats: [
      { provider: 'spotify', plays: 100 },
      { provider: 'youtube', plays: 40 },
      { provider: 'local', plays: 10 },
    ],
    period: 'week',
  };

  return {
    ...defaultStats,
    ...customStats,
  };
}

/**
 * Mock for simulating network latency
 */
export function createDelayedMock<T>(data: T, delayMs: number): Promise<EdgeFunctionResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        error: null,
      });
    }, delayMs);
  });
}

/**
 * Mock for simulating intermittent failures
 */
export function createFlakeyMock<T>(
  data: T, 
  failureRate: number = 0.3
): () => Promise<EdgeFunctionResponse<T | null>> {
  return async () => {
    if (Math.random() < failureRate) {
      return {
        data: null,
        error: new Error('Intermittent failure'),
      };
    }
    return {
      data,
      error: null,
    };
  };
}

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * Generates mock playback records for testing
 */
export function generateMockPlaybacks(count: number): TrackPlaybackRecordData[] {
  const providers: Array<'spotify' | 'youtube' | 'soundcloud' | 'local'> = [
    'spotify', 'youtube', 'soundcloud', 'local'
  ];

  return Array.from({ length: count }, (_, i) => ({
    track_id: `track:${i + 1}`,
    track_name: `Test Song ${i + 1}`,
    artist_name: `Test Artist ${(i % 10) + 1}`,
    album_name: `Test Album ${(i % 5) + 1}`,
    album_art: i % 2 === 0 ? `https://example.com/art${i}.jpg` : null,
    provider: providers[i % providers.length],
    duration_ms: 180000 + (i * 10000),
    completed: i % 3 !== 0,
  }));
}

/**
 * Generates hourly activity data for testing
 */
export function generateHourlyActivity(): Array<{ hour: number; count: number }> {
  return Array.from({ length: 24 }, (_, hour) => {
    // Simulate realistic listening patterns
    // More activity in evening hours (18-23), less in early morning (2-6)
    let baseCount = 5;
    if (hour >= 18 && hour <= 23) {
      baseCount = 15;
    } else if (hour >= 2 && hour <= 6) {
      baseCount = 1;
    } else if (hour >= 7 && hour <= 9) {
      baseCount = 8;
    }
    
    return {
      hour,
      count: baseCount + Math.floor(Math.random() * 5),
    };
  });
}
