import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ============================================================================
// Schema definitions for YouTube Music Auth edge function
// ============================================================================

// GetAuthUrl request schema
const YouTubeGetAuthUrlRequestSchema = z.object({
  action: z.literal('getAuthUrl'),
  clientId: z.string().min(1, 'clientId is required'),
  redirectUri: z.string().url('redirectUri must be a valid URL'),
});

// ExchangeCode request schema
const YouTubeExchangeCodeRequestSchema = z.object({
  action: z.literal('exchangeCode'),
  code: z.string().min(1, 'code is required'),
  clientId: z.string().min(1, 'clientId is required'),
  clientSecret: z.string().min(1, 'clientSecret is required'),
  redirectUri: z.string().url('redirectUri must be a valid URL'),
});

// RefreshToken request schema
const YouTubeRefreshTokenRequestSchema = z.object({
  action: z.literal('refreshToken'),
  refreshToken: z.string().min(1, 'refreshToken is required'),
  clientId: z.string().min(1, 'clientId is required'),
  clientSecret: z.string().min(1, 'clientSecret is required'),
});

// Auth URL response schema
const YouTubeAuthUrlResponseSchema = z.object({
  authUrl: z.string().url(),
});

// Token response schema
const YouTubeTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().int().positive(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    imageUrl: z.string().url().optional(),
  }).optional(),
});

// Refresh response schema
const YouTubeRefreshResponseSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number().int().positive(),
});

// ============================================================================
// Tests
// ============================================================================

describe('YouTube Music Auth Schemas', () => {
  describe('YouTubeGetAuthUrlRequestSchema', () => {
    it('should validate valid getAuthUrl request', () => {
      const result = YouTubeGetAuthUrlRequestSchema.safeParse({
        action: 'getAuthUrl',
        clientId: 'google-client-id-123',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing clientId', () => {
      const result = YouTubeGetAuthUrlRequestSchema.safeParse({
        action: 'getAuthUrl',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing redirectUri', () => {
      const result = YouTubeGetAuthUrlRequestSchema.safeParse({
        action: 'getAuthUrl',
        clientId: 'google-client-id-123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid redirectUri', () => {
      const result = YouTubeGetAuthUrlRequestSchema.safeParse({
        action: 'getAuthUrl',
        clientId: 'google-client-id-123',
        redirectUri: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('should reject wrong action', () => {
      const result = YouTubeGetAuthUrlRequestSchema.safeParse({
        action: 'exchangeCode',
        clientId: 'google-client-id-123',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('YouTubeExchangeCodeRequestSchema', () => {
    it('should validate valid exchangeCode request', () => {
      const result = YouTubeExchangeCodeRequestSchema.safeParse({
        action: 'exchangeCode',
        code: 'auth-code-from-google',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing code', () => {
      const result = YouTubeExchangeCodeRequestSchema.safeParse({
        action: 'exchangeCode',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing clientSecret', () => {
      const result = YouTubeExchangeCodeRequestSchema.safeParse({
        action: 'exchangeCode',
        code: 'auth-code',
        clientId: 'google-client-id-123',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty code', () => {
      const result = YouTubeExchangeCodeRequestSchema.safeParse({
        action: 'exchangeCode',
        code: '',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('YouTubeRefreshTokenRequestSchema', () => {
    it('should validate valid refreshToken request', () => {
      const result = YouTubeRefreshTokenRequestSchema.safeParse({
        action: 'refreshToken',
        refreshToken: 'refresh-token-123',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing refreshToken', () => {
      const result = YouTubeRefreshTokenRequestSchema.safeParse({
        action: 'refreshToken',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty refreshToken', () => {
      const result = YouTubeRefreshTokenRequestSchema.safeParse({
        action: 'refreshToken',
        refreshToken: '',
        clientId: 'google-client-id-123',
        clientSecret: 'google-client-secret',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('YouTubeAuthUrlResponseSchema', () => {
    it('should validate valid auth URL response', () => {
      const result = YouTubeAuthUrlResponseSchema.safeParse({
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=123&scope=youtube',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = YouTubeAuthUrlResponseSchema.safeParse({
        authUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('YouTubeTokenResponseSchema', () => {
    it('should validate valid token response with user', () => {
      const result = YouTubeTokenResponseSchema.safeParse({
        accessToken: 'ya29.access-token',
        refreshToken: 'refresh-token-123',
        expiresIn: 3600,
        user: {
          id: 'google-user-123',
          name: 'John Doe',
          email: 'john@gmail.com',
          imageUrl: 'https://lh3.googleusercontent.com/photo.jpg',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should validate token response without user', () => {
      const result = YouTubeTokenResponseSchema.safeParse({
        accessToken: 'ya29.access-token',
        expiresIn: 3600,
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative expiresIn', () => {
      const result = YouTubeTokenResponseSchema.safeParse({
        accessToken: 'ya29.access-token',
        expiresIn: -1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('YouTubeRefreshResponseSchema', () => {
    it('should validate valid refresh response', () => {
      const result = YouTubeRefreshResponseSchema.safeParse({
        accessToken: 'ya29.new-access-token',
        expiresIn: 3600,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing accessToken', () => {
      const result = YouTubeRefreshResponseSchema.safeParse({
        expiresIn: 3600,
      });
      expect(result.success).toBe(false);
    });
  });
});
