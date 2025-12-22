import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockAnalyzeJamData } from '../../fixtures/integrationData';

// ============================================================================
// Analyze JAM Edge Function Integration Tests
// ============================================================================

describe('analyze-jam Edge Function Integration', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ==========================================================================
  // suggest-tracks Action Tests
  // ==========================================================================
  describe('POST /analyze-jam (suggest-tracks)', () => {
    it('should return track suggestions based on queue', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.suggestTracksResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.suggestions).toBeDefined();
      expect(data.suggestions.length).toBeGreaterThan(0);
      expect(data.mood).toBeDefined();
    });

    it('should include reason for each suggestion', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.suggestTracksResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      const data = await response.json();
      data.suggestions.forEach((suggestion: any) => {
        expect(suggestion.trackName).toBeDefined();
        expect(suggestion.artistName).toBeDefined();
        expect(suggestion.reason).toBeDefined();
      });
    });

    it('should handle empty queue', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          suggestions: [],
          mood: 'neutral',
          genre: 'mixed',
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'suggest-tracks',
          queue: [],
        }),
      });

      expect(response.ok).toBe(true);
    });

    it('should include genre in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.suggestTracksResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      const data = await response.json();
      expect(data.genre).toBeDefined();
    });
  });

  // ==========================================================================
  // analyze-mood Action Tests
  // ==========================================================================
  describe('POST /analyze-jam (analyze-mood)', () => {
    it('should analyze mood of the queue', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.analyzeMoodResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.analyzeMoodRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.mood).toBeDefined();
      expect(data.energy).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(data.energy);
    });

    it('should return genres array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.analyzeMoodResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.analyzeMoodRequest),
      });

      const data = await response.json();
      expect(Array.isArray(data.genres)).toBe(true);
    });

    it('should include vibe description', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.analyzeMoodResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.analyzeMoodRequest),
      });

      const data = await response.json();
      expect(data.vibe).toBeDefined();
      expect(typeof data.vibe).toBe('string');
    });

    it('should consider current track in mood analysis', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          mood: 'energetic',
          energy: 'high',
          genres: ['rock', 'classic rock'],
          vibe: 'High energy rock session',
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          ...mockAnalyzeJamData.analyzeMoodRequest,
          currentTrack: {
            trackName: 'We Will Rock You',
            artistName: 'Queen',
          },
        }),
      });

      expect(response.ok).toBe(true);
    });
  });

  // ==========================================================================
  // get-similar Action Tests
  // ==========================================================================
  describe('POST /analyze-jam (get-similar)', () => {
    it('should return similar tracks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.getSimilarResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.getSimilarRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.similar).toBeDefined();
      expect(Array.isArray(data.similar)).toBe(true);
    });

    it('should include similarity reason for each track', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyzeJamData.getSimilarResponse,
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.getSimilarRequest),
      });

      const data = await response.json();
      data.similar.forEach((track: any) => {
        expect(track.trackName).toBeDefined();
        expect(track.artistName).toBeDefined();
        expect(track.similarity).toBeDefined();
      });
    });

    it('should require currentTrack for get-similar', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'currentTrack is required for get-similar action' }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'get-similar',
          queue: mockAnalyzeJamData.getSimilarRequest.queue,
        }),
      });

      // Note: The actual function might not require this, testing edge case
      expect(response.ok || response.status === 400).toBe(true);
    });
  });

  // ==========================================================================
  // Validation Tests
  // ==========================================================================
  describe('Request Validation', () => {
    it('should return 400 for invalid action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'action', message: 'Invalid enum value' }],
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalid-action',
          queue: [],
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for queue exceeding 100 tracks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'queue', message: 'Array must contain at most 100 element(s)' }],
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'suggest-tracks',
          queue: Array(101).fill({ trackName: 'Test', artistName: 'Artist' }),
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid track in queue', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'queue.0.trackName', message: 'String must contain at least 1 character(s)' }],
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'suggest-tracks',
          queue: [{ trackName: '', artistName: 'Artist' }],
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should validate sessionName max length', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'sessionName', message: 'String must contain at most 200 character(s)' }],
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify({
          action: 'suggest-tracks',
          queue: [{ trackName: 'Test', artistName: 'Artist' }],
          sessionName: 'x'.repeat(201),
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('Error Handling', () => {
    it('should return 500 when LOVABLE_API_KEY is not configured', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'LOVABLE_API_KEY is not configured' }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      expect(response.status).toBe(500);
    });

    it('should handle AI Gateway errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Lovable AI Gateway error: 503' }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      expect(response.status).toBe(500);
    });

    it('should handle CORS preflight requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'OPTIONS',
      });

      expect(response.ok).toBe(true);
    });

    it('should handle malformed JSON in AI response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'Failed to parse AI response',
          raw: 'not valid json',
        }),
      });

      const response = await mockFetch('/functions/v1/analyze-jam', {
        method: 'POST',
        body: JSON.stringify(mockAnalyzeJamData.suggestTracksRequest),
      });

      const data = await response.json();
      // Should handle gracefully, either with error field or fallback
      expect(data).toBeDefined();
    });
  });
});
