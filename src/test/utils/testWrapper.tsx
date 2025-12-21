import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface TestWrapperProps {
  children: React.ReactNode;
}

interface TestWrapperOptions {
  queryClient?: QueryClient;
}

/**
 * Creates a test wrapper with QueryClientProvider
 * Use for testing hooks and components that need react-query
 */
export function createTestWrapper(options?: TestWrapperOptions) {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  return function TestWrapper({ children }: TestWrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

/**
 * Mock values for AppSettings context in tests
 */
export const mockAppSettings = {
  isDemoMode: false,
  setDemoMode: vi.fn(),
  apiUrl: 'http://localhost:3000/api',
  setApiUrl: vi.fn(),
  useWebSocket: true,
  setUseWebSocket: vi.fn(),
  pollingInterval: 2000,
  setPollingInterval: vi.fn(),
  spicetify: {
    isInstalled: false,
    currentTheme: '',
    version: '',
  },
  setSpicetifyConfig: vi.fn(),
  musicProvider: 'spotify' as const,
  setMusicProvider: vi.fn(),
  weather: {
    apiKey: '',
    city: 'Test City',
    isEnabled: false,
  },
  setWeatherConfig: vi.fn(),
};

/**
 * Mock values for Theme context in tests
 */
export const mockThemeSettings = {
  theme: 'blue' as const,
  setTheme: vi.fn(),
  themeMode: 'dark' as const,
  setThemeMode: vi.fn(),
  language: 'pt-BR' as const,
  setLanguage: vi.fn(),
  soundEnabled: true,
  setSoundEnabled: vi.fn(),
  animationsEnabled: true,
  setAnimationsEnabled: vi.fn(),
  highContrast: false,
  setHighContrast: vi.fn(),
  reducedMotion: false,
  setReducedMotion: vi.fn(),
  isDarkMode: true,
};

/**
 * Mock values for Spotify context in tests
 */
export const mockSpotifySettings = {
  spotify: {
    clientId: '',
    clientSecret: '',
    tokens: null,
    user: null,
    isConnected: false,
  },
  setSpotifyCredentials: vi.fn(),
  setSpotifyTokens: vi.fn(),
  setSpotifyUser: vi.fn(),
  clearSpotifyAuth: vi.fn(),
};

/**
 * Mock values for YouTube Music context in tests
 */
export const mockYouTubeMusicSettings = {
  youtubeMusic: {
    tokens: null,
    user: null,
    isConnected: false,
  },
  setYouTubeMusicTokens: vi.fn(),
  setYouTubeMusicUser: vi.fn(),
  clearYouTubeMusicAuth: vi.fn(),
};

/**
 * Combined mock for useSettings hook
 */
export const mockUseSettings = {
  ...mockAppSettings,
  ...mockThemeSettings,
  ...mockSpotifySettings,
  ...mockYouTubeMusicSettings,
};
