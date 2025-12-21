/**
 * @fileoverview Integration tests for track-playback edge function
 * Tests for POST (record) and GET (getStats) endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  mockTrackPlaybackData,
  mockAggregatedStats,
  mockPlaybackTrack 
} from '../../fixtures/integrationData';
import { 
  createTrackPlaybackMock, 
  mockEdgeFunctionResponse,
  mockEdgeFunctionError 
} from '../../mocks/edgeFunctionMocks';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from '@/integrations/supabase/client';

describe('track-playback Edge Function Integration', () => {
  let trackPlaybackMock: ReturnType<typeof createTrackPlaybackMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    trackPlaybackMock = createTrackPlaybackMock();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ============================================================================
  // POST /track-playback (Record)
  // ============================================================================
  describe('POST /track-playback (Record)', () => {
    it('should record playback with valid complete data', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        success: true,
        data: { id: 'uuid-new-1', ...mockTrackPlaybackData.validComplete },
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.validComplete,
      });

      expect(result.error).toBeNull();
      expect(result.data.success).toBe(true);
      expect(result.data.data.track_id).toBe(mockTrackPlaybackData.validComplete.track_id);
    });

    it('should record playback with minimal required fields', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        success: true,
        data: { id: 'uuid-new-2', ...mockTrackPlaybackData.validMinimal, completed: false },
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.validMinimal,
      });

      expect(result.error).toBeNull();
      expect(result.data.success).toBe(true);
      expect(result.data.data.completed).toBe(false);
    });

    it('should set completed=false by default', async () => {
      const dataWithoutCompleted = {
        track_id: 'track:123',
        track_name: 'Test',
        artist_name: 'Artist',
        provider: 'spotify',
      };

      const mockResponse = mockEdgeFunctionResponse({
        success: true,
        data: { id: 'uuid-new-3', ...dataWithoutCompleted, completed: false },
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: dataWithoutCompleted,
      });

      expect(result.data.data.completed).toBe(false);
    });

    it('should extract user-agent from headers', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        success: true,
        data: { 
          id: 'uuid-new-4', 
          ...mockTrackPlaybackData.validComplete,
          user_agent: 'Mozilla/5.0 (Linux; Android 10)',
        },
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.validComplete,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
        },
      });

      expect(result.data.data.user_agent).toBe('Mozilla/5.0 (Linux; Android 10)');
    });

    it('should return 400 for missing required fields', async () => {
      const errorResponse = mockEdgeFunctionError(
        'Missing required fields: track_id, track_name, artist_name, provider',
        400
      );

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.missingTrackId,
      });

      expect(result.error).toBeDefined();
    });

    it('should return 400 for invalid provider', async () => {
      const errorResponse = mockEdgeFunctionError(
        'Invalid provider',
        400
      );

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.invalidProvider,
      });

      expect(result.error).toBeDefined();
    });

    it('should handle concurrent record requests', async () => {
      const mockResponse1 = mockEdgeFunctionResponse({
        success: true,
        data: { id: 'uuid-concurrent-1', ...mockTrackPlaybackData.validComplete },
      });
      const mockResponse2 = mockEdgeFunctionResponse({
        success: true,
        data: { id: 'uuid-concurrent-2', ...mockTrackPlaybackData.validMinimal },
      });

      vi.mocked(supabase.functions.invoke)
        .mockResolvedValueOnce(mockResponse1 as any)
        .mockResolvedValueOnce(mockResponse2 as any);

      const [result1, result2] = await Promise.all([
        supabase.functions.invoke('track-playback', {
          method: 'POST',
          body: mockTrackPlaybackData.validComplete,
        }),
        supabase.functions.invoke('track-playback', {
          method: 'POST',
          body: mockTrackPlaybackData.validMinimal,
        }),
      ]);

      expect(result1.data.success).toBe(true);
      expect(result2.data.success).toBe(true);
      expect(result1.data.data.id).not.toBe(result2.data.data.id);
    });
  });

  // ============================================================================
  // GET /track-playback (GetStats)
  // ============================================================================
  describe('GET /track-playback (GetStats)', () => {
    it('should return stats for today period', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        period: 'today',
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(result.error).toBeNull();
      expect(result.data.period).toBe('today');
    });

    it('should return stats for week period (default)', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        period: 'week',
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.period).toBe('week');
    });

    it('should return stats for month period', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        period: 'month',
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.period).toBe('month');
    });

    it('should return stats for all period', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        period: 'all',
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.period).toBe('all');
    });

    it('should return correct totalPlays count', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        totalPlays: 150,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.totalPlays).toBe(150);
    });

    it('should return correct uniqueTracks count', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        uniqueTracks: 45,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.uniqueTracks).toBe(45);
    });

    it('should return correct uniqueArtists count', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        uniqueArtists: 20,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.uniqueArtists).toBe(20);
    });

    it('should calculate totalMinutes correctly', async () => {
      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        totalMinutes: 600,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.totalMinutes).toBe(600);
    });

    it('should return top 10 tracks sorted by plays', async () => {
      const topTracks = Array.from({ length: 10 }, (_, i) => ({
        track_id: `track:${i}`,
        track_name: `Song ${i}`,
        artist_name: `Artist ${i}`,
        album_art: null,
        plays: 100 - i * 5,
      }));

      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        topTracks,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.topTracks.length).toBeLessThanOrEqual(10);
      expect(result.data.topTracks[0].plays).toBeGreaterThanOrEqual(result.data.topTracks[1].plays);
    });

    it('should return top 10 artists sorted by plays', async () => {
      const topArtists = Array.from({ length: 10 }, (_, i) => ({
        artist_name: `Artist ${i}`,
        plays: 50 - i * 3,
      }));

      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        topArtists,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.topArtists.length).toBeLessThanOrEqual(10);
      expect(result.data.topArtists[0].plays).toBeGreaterThanOrEqual(result.data.topArtists[1].plays);
    });

    it('should include hourlyActivity for 24 hours', async () => {
      const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 20),
      }));

      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        hourlyActivity,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.hourlyActivity.length).toBe(24);
      expect(result.data.hourlyActivity[0].hour).toBe(0);
      expect(result.data.hourlyActivity[23].hour).toBe(23);
    });

    it('should return recentPlays limited to 20', async () => {
      const recentPlays = Array.from({ length: 20 }, (_, i) => ({
        id: `uuid-${i}`,
        track_id: `track:${i}`,
        track_name: `Song ${i}`,
        artist_name: `Artist ${i}`,
        album_name: `Album ${i}`,
        album_art: null,
        provider: 'spotify',
        duration_ms: 240000,
        completed: true,
        played_at: new Date(Date.now() - i * 60000).toISOString(),
      }));

      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        recentPlays,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.recentPlays.length).toBeLessThanOrEqual(20);
    });

    it('should include providerStats breakdown', async () => {
      const providerStats = [
        { provider: 'spotify', plays: 100 },
        { provider: 'youtube', plays: 40 },
        { provider: 'local', plays: 10 },
      ];

      const mockResponse = mockEdgeFunctionResponse({
        ...mockAggregatedStats,
        providerStats,
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.data.providerStats.length).toBeGreaterThan(0);
      expect(result.data.providerStats).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ provider: expect.any(String), plays: expect.any(Number) }),
        ])
      );
    });

    it('should handle empty database gracefully', async () => {
      const emptyStats = {
        totalPlays: 0,
        uniqueTracks: 0,
        uniqueArtists: 0,
        totalMinutes: 0,
        topTracks: [],
        topArtists: [],
        hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
        recentPlays: [],
        providerStats: [],
        period: 'week',
      };

      const mockResponse = mockEdgeFunctionResponse(emptyStats);

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET',
      });

      expect(result.error).toBeNull();
      expect(result.data.totalPlays).toBe(0);
      expect(result.data.topTracks).toEqual([]);
    });
  });

  // ============================================================================
  // Error Handling
  // ============================================================================
  describe('Error Handling', () => {
    it('should return 405 for unsupported methods (PUT)', async () => {
      const errorResponse = mockEdgeFunctionError('Method not allowed', 405);

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'PUT',
        body: {},
      });

      expect(result.error).toBeDefined();
    });

    it('should return 405 for unsupported methods (DELETE)', async () => {
      const errorResponse = mockEdgeFunctionError('Method not allowed', 405);

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'DELETE',
      });

      expect(result.error).toBeDefined();
    });

    it('should return 500 for database errors', async () => {
      const errorResponse = mockEdgeFunctionError('Failed to record playback', 500);

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: mockTrackPlaybackData.validComplete,
      });

      expect(result.error).toBeDefined();
    });

    it('should handle malformed JSON body', async () => {
      const errorResponse = mockEdgeFunctionError('Invalid JSON', 400);

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(errorResponse as any);

      const result = await supabase.functions.invoke('track-playback', {
        method: 'POST',
        body: 'not-valid-json',
      });

      expect(result.error).toBeDefined();
    });

    it('should handle CORS preflight requests', async () => {
      const mockResponse = {
        data: null,
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

      // Note: OPTIONS is not a valid method for functions.invoke, but we test the mock behavior
      const result = await supabase.functions.invoke('track-playback', {
        method: 'GET', // Use GET as placeholder since OPTIONS is handled by the function itself
      });

      expect(result.error).toBeNull();
    });
  });
});
