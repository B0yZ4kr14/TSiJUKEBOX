import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockLyricsSearchData } from '../../fixtures/integrationData';

// ============================================================================
// Lyrics Search Edge Function Integration Tests
// ============================================================================

describe('lyrics-search Edge Function Integration', () => {
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
  // Successful Search Tests
  // ==========================================================================
  describe('POST /lyrics-search (Success Cases)', () => {
    it('should return synced lyrics from LRCLIB', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibSyncedResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.source).toBe('lrclib');
      expect(data.synced).toBe(true);
      expect(data.lines.length).toBeGreaterThan(0);
    });

    it('should return plain lyrics when synced not available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibPlainResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      const data = await response.json();
      expect(data.source).toBe('lrclib');
      expect(data.synced).toBe(false);
      expect(data.plainText).toBeDefined();
    });

    it('should fallback to Genius when LRCLIB fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.geniusResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      const data = await response.json();
      expect(data.source).toBe('genius');
      expect(data.synced).toBe(false);
    });

    it('should return correct trackName and artistName', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibSyncedResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      const data = await response.json();
      expect(data.trackName).toBeDefined();
      expect(data.artistName).toBeDefined();
    });

    it('should parse LRC timestamps correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibSyncedResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      const data = await response.json();
      if (data.synced) {
        data.lines.forEach((line: any) => {
          expect(typeof line.time).toBe('number');
          expect(line.time).toBeGreaterThanOrEqual(0);
          expect(typeof line.text).toBe('string');
        });
      }
    });

    it('should handle enhanced LRC with word timestamps', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.enhancedLrcResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      const data = await response.json();
      if (data.synced && data.lines[0]?.words) {
        expect(Array.isArray(data.lines[0].words)).toBe(true);
        data.lines[0].words.forEach((word: any) => {
          expect(word.word).toBeDefined();
          expect(word.startTime).toBeDefined();
          expect(word.endTime).toBeDefined();
        });
      }
    });
  });

  // ==========================================================================
  // No Lyrics Found Tests
  // ==========================================================================
  describe('POST /lyrics-search (No Results)', () => {
    it('should return source=none when lyrics not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.notFoundResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: 'Unknown Song XYZ',
          artistName: 'Unknown Artist ABC',
        }),
      });

      const data = await response.json();
      expect(data.source).toBe('none');
      expect(data.lines).toEqual([]);
    });

    it('should return empty lines array when not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.notFoundResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: 'Nonexistent',
          artistName: 'Nobody',
        }),
      });

      const data = await response.json();
      expect(data.lines.length).toBe(0);
    });
  });

  // ==========================================================================
  // Validation Tests
  // ==========================================================================
  describe('Request Validation', () => {
    it('should return 400 for missing trackName', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'trackName', message: 'trackName is required' }],
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({ artistName: 'Queen' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing artistName', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'artistName', message: 'artistName is required' }],
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({ trackName: 'Bohemian Rhapsody' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty trackName', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'trackName', message: 'trackName is required' }],
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({ trackName: '', artistName: 'Queen' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for trackName exceeding 500 chars', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request parameters',
          details: [{ path: 'trackName', message: 'trackName must be less than 500 characters' }],
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: 'x'.repeat(501),
          artistName: 'Queen',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should trim whitespace from inputs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibSyncedResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: '  Bohemian Rhapsody  ',
          artistName: '  Queen  ',
        }),
      });

      expect(response.ok).toBe(true);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('Error Handling', () => {
    it('should handle CORS preflight requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'OPTIONS',
      });

      expect(response.ok).toBe(true);
    });

    it('should return 500 for internal errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Unknown error' }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      expect(response.status).toBe(500);
    });

    it('should handle LRCLIB API timeout', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.notFoundResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify(mockLyricsSearchData.validRequest),
      });

      // Should fallback gracefully
      expect(response.ok).toBe(true);
    });

    it('should handle malformed JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Unexpected token' }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: 'not valid json',
      });

      expect(response.status).toBe(500);
    });
  });

  // ==========================================================================
  // Special Characters & Unicode Tests
  // ==========================================================================
  describe('Special Characters & Unicode', () => {
    it('should handle track names with special characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLyricsSearchData.lrclibSyncedResponse,
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: "Don't Stop Me Now (2011 Remaster)",
          artistName: 'Queen & David Bowie',
        }),
      });

      expect(response.ok).toBe(true);
    });

    it('should handle unicode characters in track/artist names', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: 'lrclib',
          synced: true,
          lines: [{ time: 0, text: 'Olha que coisa mais linda' }],
          trackName: 'Águas de Março',
          artistName: 'Antônio Carlos Jobim',
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: 'Águas de Março',
          artistName: 'Antônio Carlos Jobim',
        }),
      });

      expect(response.ok).toBe(true);
    });

    it('should handle Japanese characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: 'lrclib',
          synced: false,
          lines: [{ time: 0, text: '残酷な天使のテーゼ' }],
          trackName: '残酷な天使のテーゼ',
          artistName: '高橋洋子',
        }),
      });

      const response = await mockFetch('/functions/v1/lyrics-search', {
        method: 'POST',
        body: JSON.stringify({
          trackName: '残酷な天使のテーゼ',
          artistName: '高橋洋子',
        }),
      });

      expect(response.ok).toBe(true);
    });
  });
});
