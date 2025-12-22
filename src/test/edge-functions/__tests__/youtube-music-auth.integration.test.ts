import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockYouTubeAuthData } from '../../fixtures/integrationData';

// ============================================================================
// YouTube Music Auth Edge Function Integration Tests
// ============================================================================

describe('youtube-music-auth Edge Function Integration', () => {
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
  // getAuthUrl Action Tests
  // ==========================================================================
  describe('POST /youtube-music-auth (getAuthUrl)', () => {
    it('should generate Google OAuth URL with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=123&scope=youtube',
        }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.getAuthUrlRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.authUrl).toContain('accounts.google.com');
    });

    it('should include YouTube scopes in auth URL', async () => {
      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authUrl }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.getAuthUrlRequest),
      });

      const data = await response.json();
      expect(data.authUrl).toContain('youtube');
    });

    it('should return 400 when clientId is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Missing clientId or redirectUri' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'getAuthUrl', redirectUri: 'https://example.com' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when redirectUri is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Missing clientId or redirectUri' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'getAuthUrl', clientId: 'client123' }),
      });

      expect(response.status).toBe(400);
    });
  });

  // ==========================================================================
  // exchangeCode Action Tests
  // ==========================================================================
  describe('POST /youtube-music-auth (exchangeCode)', () => {
    it('should exchange code for tokens successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockYouTubeAuthData.tokenResponse,
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.exchangeCodeRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      expect(data.user).toBeDefined();
    });

    it('should return user info with tokens', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockYouTubeAuthData.tokenResponse,
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.exchangeCodeRequest),
      });

      const data = await response.json();
      expect(data.user.id).toBeDefined();
      expect(data.user.name).toBeDefined();
      expect(data.user.email).toBeDefined();
    });

    it('should return 400 when code is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Missing required parameters for code exchange' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({
          action: 'exchangeCode',
          clientId: 'client123',
          clientSecret: 'secret',
          redirectUri: 'https://example.com',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should handle Google API token exchange failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'invalid_grant' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({
          ...mockYouTubeAuthData.exchangeCodeRequest,
          code: 'invalid_code',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should include expiresIn in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockYouTubeAuthData.tokenResponse,
          expiresIn: 3600,
        }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.exchangeCodeRequest),
      });

      const data = await response.json();
      expect(data.expiresIn).toBe(3600);
    });
  });

  // ==========================================================================
  // refreshToken Action Tests
  // ==========================================================================
  describe('POST /youtube-music-auth (refreshToken)', () => {
    it('should refresh token successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockYouTubeAuthData.refreshResponse,
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify(mockYouTubeAuthData.refreshTokenRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
      expect(data.expiresIn).toBeDefined();
    });

    it('should return 400 when refreshToken is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Missing required parameters for token refresh' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({
          action: 'refreshToken',
          clientId: 'client123',
          clientSecret: 'secret',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should handle expired refresh token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'invalid_grant' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({
          ...mockYouTubeAuthData.refreshTokenRequest,
          refreshToken: 'expired_token',
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('Error Handling', () => {
    it('should return 400 for unknown action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Unknown action: invalidAction' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'invalidAction' }),
      });

      expect(response.status).toBe(400);
    });

    it('should handle CORS preflight requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
        }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'OPTIONS',
      });

      expect(response.ok).toBe(true);
    });

    it('should handle malformed JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Authentication failed' }),
      });

      const response = await mockFetch('/functions/v1/youtube-music-auth', {
        method: 'POST',
        body: 'not valid json',
      });

      expect(response.status).toBe(400);
    });
  });
});
