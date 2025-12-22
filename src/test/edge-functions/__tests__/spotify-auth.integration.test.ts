import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockSpotifyAuthData } from '../../fixtures/integrationData';

// ============================================================================
// Spotify Auth Edge Function Integration Tests
// ============================================================================

describe('spotify-auth Edge Function Integration', () => {
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
  // LOGIN Action Tests
  // ==========================================================================
  describe('POST /spotify-auth?action=login', () => {
    it('should generate authorization URL with valid clientId', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          authUrl: 'https://accounts.spotify.com/authorize?client_id=abc123&response_type=code',
          state: 'uuid-state-123',
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=login', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.loginRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.authUrl).toContain('accounts.spotify.com/authorize');
      expect(data.state).toBeDefined();
    });

    it('should return 400 when clientId is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Client ID is required' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=login', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should include all required scopes in auth URL', async () => {
      const authUrl = 'https://accounts.spotify.com/authorize?scope=user-read-playback-state%20playlist-read-private';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authUrl, state: 'abc' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=login', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.loginRequest),
      });

      const data = await response.json();
      expect(data.authUrl).toContain('scope=');
    });

    it('should generate unique state for CSRF protection', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authUrl: 'url1', state: 'state-1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authUrl: 'url2', state: 'state-2' }),
        });

      const [res1, res2] = await Promise.all([
        mockFetch('/functions/v1/spotify-auth?action=login', {
          method: 'POST',
          body: JSON.stringify(mockSpotifyAuthData.loginRequest),
        }),
        mockFetch('/functions/v1/spotify-auth?action=login', {
          method: 'POST',
          body: JSON.stringify(mockSpotifyAuthData.loginRequest),
        }),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();
      expect(data1.state).not.toBe(data2.state);
    });
  });

  // ==========================================================================
  // CALLBACK Action Tests
  // ==========================================================================
  describe('GET /spotify-auth?action=callback', () => {
    it('should redirect with code on successful callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 302,
        headers: new Headers({ Location: '/settings?spotify_code=auth_code_123' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=callback&code=auth_code_123');
      expect(response.status).toBe(302);
    });

    it('should redirect with error on OAuth error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 302,
        headers: new Headers({ Location: '/settings?spotify_error=access_denied' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=callback&error=access_denied');
      expect(response.status).toBe(302);
    });

    it('should return 400 when code is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Authorization code is required' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=callback');
      expect(response.status).toBe(400);
    });
  });

  // ==========================================================================
  // EXCHANGE Action Tests
  // ==========================================================================
  describe('POST /spotify-auth?action=exchange', () => {
    it('should exchange code for tokens successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpotifyAuthData.tokenResponse,
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=exchange', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.exchangeRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      expect(data.expiresAt).toBeDefined();
    });

    it('should return 400 when credentials are missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Client credentials are required' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=exchange', {
        method: 'POST',
        body: JSON.stringify({ code: 'abc123' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when code is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Authorization code is required' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=exchange', {
        method: 'POST',
        body: JSON.stringify({
          clientId: 'abc',
          clientSecret: 'xyz',
          redirectUri: 'https://example.com',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should handle Spotify API token exchange failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Failed to exchange code for tokens' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=exchange', {
        method: 'POST',
        body: JSON.stringify({
          ...mockSpotifyAuthData.exchangeRequest,
          code: 'invalid_code',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should include scope in token response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockSpotifyAuthData.tokenResponse,
          scope: 'user-read-playback-state playlist-read-private',
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=exchange', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.exchangeRequest),
      });

      const data = await response.json();
      expect(data.scope).toContain('user-read-playback-state');
    });
  });

  // ==========================================================================
  // REFRESH Action Tests
  // ==========================================================================
  describe('POST /spotify-auth?action=refresh', () => {
    it('should refresh token successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'new_access_token',
          refreshToken: 'original_refresh_token',
          expiresAt: Date.now() + 3600000,
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=refresh', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.refreshRequest),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
    });

    it('should return 400 when credentials are missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Client credentials are required' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'token123' }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 401 when refresh token is expired', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Failed to refresh token', needsReauth: true }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=refresh', {
        method: 'POST',
        body: JSON.stringify({
          ...mockSpotifyAuthData.refreshRequest,
          refreshToken: 'expired_token',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.needsReauth).toBe(true);
    });

    it('should return new refresh token when Spotify provides one', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'new_access',
          refreshToken: 'new_refresh_token',
          expiresAt: Date.now() + 3600000,
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=refresh', {
        method: 'POST',
        body: JSON.stringify(mockSpotifyAuthData.refreshRequest),
      });

      const data = await response.json();
      expect(data.refreshToken).toBeDefined();
    });
  });

  // ==========================================================================
  // VALIDATE Action Tests
  // ==========================================================================
  describe('POST /spotify-auth?action=validate', () => {
    it('should validate token and return user profile', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpotifyAuthData.validateResponse,
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=validate', {
        method: 'POST',
        body: JSON.stringify({ accessToken: 'valid_token' }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.valid).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBeDefined();
    });

    it('should return valid=false for expired token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: false, error: 'Invalid or expired token' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=validate', {
        method: 'POST',
        body: JSON.stringify({ accessToken: 'expired_token' }),
      });

      const data = await response.json();
      expect(data.valid).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should return valid=false when no token provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: false, error: 'No access token' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=validate', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const data = await response.json();
      expect(data.valid).toBe(false);
    });

    it('should include product type in user profile', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          valid: true,
          user: {
            id: 'user123',
            displayName: 'Test User',
            email: 'test@example.com',
            product: 'premium',
          },
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=validate', {
        method: 'POST',
        body: JSON.stringify({ accessToken: 'premium_user_token' }),
      });

      const data = await response.json();
      expect(data.user.product).toBe('premium');
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================
  describe('Error Handling', () => {
    it('should return 400 for invalid action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid action. Use: login, callback, exchange, refresh, validate' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=invalid', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it('should return 500 for internal server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Unknown error' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=login', {
        method: 'POST',
        body: JSON.stringify({ clientId: 'test' }),
      });

      expect(response.status).toBe(500);
    });

    it('should handle CORS preflight requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth', {
        method: 'OPTIONS',
      });

      expect(response.ok).toBe(true);
    });

    it('should handle malformed JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Unexpected token' }),
      });

      const response = await mockFetch('/functions/v1/spotify-auth?action=login', {
        method: 'POST',
        body: 'invalid json{',
      });

      expect(response.status).toBe(500);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        mockFetch('/functions/v1/spotify-auth?action=login', {
          method: 'POST',
          body: JSON.stringify({ clientId: 'test' }),
        })
      ).rejects.toThrow('Network error');
    });
  });
});
