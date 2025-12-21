import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';
import React from 'react';

// Mock the media provider storage hook to avoid complex setup
vi.mock('@/hooks/common/useMediaProviderStorage', () => ({
  useMediaProviderStorage: vi.fn(() => ({
    settings: {
      tokens: null,
      user: null,
      isConnected: false,
      clientId: '',
      clientSecret: '',
    },
    setTokens: vi.fn(),
    setUser: vi.fn(),
    setCredentials: vi.fn(),
    clearAuth: vi.fn(),
  })),
}));

// Mock API clients
vi.mock('@/lib/api/spotify', () => ({
  spotifyClient: {
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    setCredentials: vi.fn(),
    validateToken: vi.fn(),
  },
}));

vi.mock('@/lib/api/youtubeMusic', () => ({
  youtubeMusicClient: {
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    validateToken: vi.fn(),
  },
}));

// Mock theme-utils
vi.mock('@/lib/theme-utils', () => ({
  setHighContrast: vi.fn(),
  setReducedMotion: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe('SettingsContext', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Setup matchMedia mock
    mockMatchMedia = vi.fn((query: string) => ({
      matches: query.includes('dark'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', mockMatchMedia);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  describe('SettingsProvider', () => {
    it('should compose all child providers correctly', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      // Should have access to all aggregated settings
      expect(result.current).toBeDefined();
      expect(typeof result.current.isDemoMode).toBe('boolean');
    });

    it('should render children without error', () => {
      const TestChild = () => {
        const settings = useSettings();
        return <div data-testid="test">{settings.musicProvider}</div>;
      };

      expect(() => {
        renderHook(() => useSettings(), { wrapper });
      }).not.toThrow();
    });
  });

  describe('useSettings aggregation', () => {
    it('should include app settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      expect(result.current).toHaveProperty('isDemoMode');
      expect(result.current).toHaveProperty('setDemoMode');
      expect(result.current).toHaveProperty('apiUrl');
      expect(result.current).toHaveProperty('setApiUrl');
      expect(result.current).toHaveProperty('useWebSocket');
      expect(result.current).toHaveProperty('pollingInterval');
      expect(result.current).toHaveProperty('musicProvider');
      expect(result.current).toHaveProperty('setMusicProvider');
      expect(result.current).toHaveProperty('weather');
      expect(result.current).toHaveProperty('spicetify');
    });

    it('should include spotify settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      expect(result.current).toHaveProperty('spotify');
      expect(result.current).toHaveProperty('setSpotifyCredentials');
      expect(result.current).toHaveProperty('setSpotifyTokens');
      expect(result.current).toHaveProperty('setSpotifyUser');
      expect(result.current).toHaveProperty('clearSpotifyAuth');
    });

    it('should include youtube music settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      expect(result.current).toHaveProperty('youtubeMusic');
      expect(result.current).toHaveProperty('setYouTubeMusicTokens');
      expect(result.current).toHaveProperty('setYouTubeMusicUser');
      expect(result.current).toHaveProperty('clearYouTubeMusicAuth');
    });

    it('should include theme settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('language');
      expect(result.current).toHaveProperty('setLanguage');
      expect(result.current).toHaveProperty('soundEnabled');
      expect(result.current).toHaveProperty('setSoundEnabled');
      expect(result.current).toHaveProperty('animationsEnabled');
      expect(result.current).toHaveProperty('setAnimationsEnabled');
    });
  });

  describe('useSettings', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSettings());
      }).toThrow('useSettings must be used within a SettingsProvider');

      consoleSpy.mockRestore();
    });

    it('should return all aggregated settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      // Check all major setting groups are present
      const settings = result.current;
      
      // App settings
      expect('isDemoMode' in settings).toBe(true);
      expect('apiUrl' in settings).toBe(true);
      expect('musicProvider' in settings).toBe(true);
      
      // Provider settings
      expect('spotify' in settings).toBe(true);
      expect('youtubeMusic' in settings).toBe(true);
      
      // Theme settings
      expect('theme' in settings).toBe(true);
      expect('language' in settings).toBe(true);
    });
  });

  describe('cross-context functionality', () => {
    it('should allow updating app settings', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      act(() => {
        result.current.setDemoMode(true);
      });

      expect(result.current.isDemoMode).toBe(true);
    });

    it('should allow updating music provider', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      act(() => {
        result.current.setMusicProvider('youtube-music');
      });

      expect(result.current.musicProvider).toBe('youtube-music');
    });

    it('should allow updating theme', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      act(() => {
        result.current.setTheme('purple');
      });

      expect(result.current.theme).toBe('purple');
    });

    it('should allow updating language', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
    });
  });

  describe('backward compatibility', () => {
    it('should export SettingsContextType interface', async () => {
      const module = await import('../SettingsContext');
      expect(module.SettingsProvider).toBeDefined();
      expect(module.useSettings).toBeDefined();
    });
  });
});
