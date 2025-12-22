import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ============================================================================
// Schema definitions copied from edge function for testing
// ============================================================================

// Login request schema
const SpotifyLoginRequestSchema = z.object({
  clientId: z.string()
    .min(1, 'clientId is required')
    .max(100, 'clientId must be less than 100 characters'),
  clientSecret: z.string()
    .min(1, 'clientSecret is required')
    .max(100, 'clientSecret must be less than 100 characters')
    .optional(),
  redirectUri: z.string()
    .url('redirectUri must be a valid URL')
    .optional(),
});

// Exchange code request schema
const SpotifyExchangeRequestSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  clientSecret: z.string().min(1, 'clientSecret is required'),
  redirectUri: z.string().url('redirectUri must be a valid URL'),
  code: z.string().min(1, 'code is required'),
});

// Refresh token request schema
const SpotifyRefreshRequestSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  clientSecret: z.string().min(1, 'clientSecret is required'),
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

// Validate token request schema
const SpotifyValidateRequestSchema = z.object({
  accessToken: z.string().min(1, 'accessToken is required'),
});

// Token response schema
const SpotifyTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().int().positive(),
  scope: z.string().optional(),
});

// User profile response schema
const SpotifyUserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(),
  email: z.string().email().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  product: z.enum(['premium', 'free', 'open']).optional(),
});

// Validate response schema
const SpotifyValidateResponseSchema = z.object({
  valid: z.boolean(),
  user: SpotifyUserProfileSchema.optional(),
  error: z.string().optional(),
});

// ============================================================================
// Tests
// ============================================================================

describe('Spotify Auth Schemas', () => {
  describe('SpotifyLoginRequestSchema', () => {
    it('should validate valid login request with clientId only', () => {
      const result = SpotifyLoginRequestSchema.safeParse({
        clientId: 'abc123clientid',
      });
      expect(result.success).toBe(true);
    });

    it('should validate valid login request with all fields', () => {
      const result = SpotifyLoginRequestSchema.safeParse({
        clientId: 'abc123clientid',
        clientSecret: 'secret456',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty clientId', () => {
      const result = SpotifyLoginRequestSchema.safeParse({
        clientId: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('clientId is required');
      }
    });

    it('should reject missing clientId', () => {
      const result = SpotifyLoginRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject clientId exceeding 100 chars', () => {
      const result = SpotifyLoginRequestSchema.safeParse({
        clientId: 'x'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('clientId must be less than 100 characters');
      }
    });

    it('should reject invalid redirectUri URL', () => {
      const result = SpotifyLoginRequestSchema.safeParse({
        clientId: 'abc123',
        redirectUri: 'not-a-url',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('redirectUri must be a valid URL');
      }
    });
  });

  describe('SpotifyExchangeRequestSchema', () => {
    it('should validate valid exchange request', () => {
      const result = SpotifyExchangeRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
        redirectUri: 'https://example.com/callback',
        code: 'authcode789',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing code', () => {
      const result = SpotifyExchangeRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
        redirectUri: 'https://example.com/callback',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing clientSecret', () => {
      const result = SpotifyExchangeRequestSchema.safeParse({
        clientId: 'client123',
        redirectUri: 'https://example.com/callback',
        code: 'authcode789',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty code', () => {
      const result = SpotifyExchangeRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
        redirectUri: 'https://example.com/callback',
        code: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('code is required');
      }
    });
  });

  describe('SpotifyRefreshRequestSchema', () => {
    it('should validate valid refresh request', () => {
      const result = SpotifyRefreshRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
        refreshToken: 'refresh_token_abc',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing refreshToken', () => {
      const result = SpotifyRefreshRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty refreshToken', () => {
      const result = SpotifyRefreshRequestSchema.safeParse({
        clientId: 'client123',
        clientSecret: 'secret456',
        refreshToken: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('refreshToken is required');
      }
    });
  });

  describe('SpotifyValidateRequestSchema', () => {
    it('should validate valid validate request', () => {
      const result = SpotifyValidateRequestSchema.safeParse({
        accessToken: 'Bearer_abc123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing accessToken', () => {
      const result = SpotifyValidateRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty accessToken', () => {
      const result = SpotifyValidateRequestSchema.safeParse({
        accessToken: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('accessToken is required');
      }
    });
  });

  describe('SpotifyTokenResponseSchema', () => {
    it('should validate valid token response', () => {
      const result = SpotifyTokenResponseSchema.safeParse({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
        expiresAt: Date.now() + 3600000,
        scope: 'user-read-playback-state playlist-read-private',
      });
      expect(result.success).toBe(true);
    });

    it('should validate token response without optional fields', () => {
      const result = SpotifyTokenResponseSchema.safeParse({
        accessToken: 'access_token_123',
        expiresAt: Date.now() + 3600000,
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative expiresAt', () => {
      const result = SpotifyTokenResponseSchema.safeParse({
        accessToken: 'access_token_123',
        expiresAt: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-integer expiresAt', () => {
      const result = SpotifyTokenResponseSchema.safeParse({
        accessToken: 'access_token_123',
        expiresAt: 123.456,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SpotifyValidateResponseSchema', () => {
    it('should validate valid response with user profile', () => {
      const result = SpotifyValidateResponseSchema.safeParse({
        valid: true,
        user: {
          id: 'user123',
          displayName: 'John Doe',
          email: 'john@example.com',
          imageUrl: 'https://example.com/avatar.jpg',
          product: 'premium',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should validate invalid token response', () => {
      const result = SpotifyValidateResponseSchema.safeParse({
        valid: false,
        error: 'Token expired',
      });
      expect(result.success).toBe(true);
    });

    it('should validate response with minimal user profile', () => {
      const result = SpotifyValidateResponseSchema.safeParse({
        valid: true,
        user: {
          id: 'user123',
          displayName: null,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid product type', () => {
      const result = SpotifyValidateResponseSchema.safeParse({
        valid: true,
        user: {
          id: 'user123',
          displayName: 'John',
          product: 'invalid_product',
        },
      });
      expect(result.success).toBe(false);
    });
  });
});
