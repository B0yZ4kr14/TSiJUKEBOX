import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppSettingsProvider, useAppSettings } from '../AppSettingsContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppSettingsProvider>{children}</AppSettingsProvider>
);

describe('AppSettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AppSettingsProvider', () => {
    it('should provide default values on initial render', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current.apiUrl).toBeTruthy();
      expect(typeof result.current.isDemoMode).toBe('boolean');
      expect(result.current.useWebSocket).toBe(true);
      expect(result.current.pollingInterval).toBe(2000);
      expect(result.current.musicProvider).toBe('spotify');
    });

    it('should load settings from localStorage on mount', () => {
      localStorage.setItem('tsi_jukebox_settings', JSON.stringify({
        isDemoMode: true,
        apiUrl: 'http://custom-api.com',
        useWebSocket: false,
        pollingInterval: 5000,
      }));

      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current.isDemoMode).toBe(true);
      expect(result.current.apiUrl).toBe('http://custom-api.com');
      expect(result.current.useWebSocket).toBe(false);
      expect(result.current.pollingInterval).toBe(5000);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('tsi_jukebox_settings', 'invalid-json');

      const { result } = renderHook(() => useAppSettings(), { wrapper });

      // Should use defaults when localStorage is corrupted
      expect(result.current.pollingInterval).toBe(2000);
    });

    it('should save settings to localStorage when changed', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setPollingInterval(3000);
      });

      const stored = JSON.parse(localStorage.getItem('tsi_jukebox_settings') || '{}');
      expect(stored.pollingInterval).toBe(3000);
    });
  });

  describe('setDemoMode', () => {
    it('should update isDemoMode state', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setDemoMode(true);
      });
      expect(result.current.isDemoMode).toBe(true);

      act(() => {
        result.current.setDemoMode(false);
      });
      expect(result.current.isDemoMode).toBe(false);
    });

    it('should persist demo mode to localStorage', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setDemoMode(true);
      });

      const stored = JSON.parse(localStorage.getItem('tsi_jukebox_settings') || '{}');
      expect(stored.isDemoMode).toBe(true);
    });
  });

  describe('setApiUrl', () => {
    it('should update apiUrl state', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setApiUrl('http://new-api.local');
      });

      expect(result.current.apiUrl).toBe('http://new-api.local');
    });

    it('should persist apiUrl to localStorage', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setApiUrl('http://persisted-api.local');
      });

      const stored = JSON.parse(localStorage.getItem('tsi_jukebox_settings') || '{}');
      expect(stored.apiUrl).toBe('http://persisted-api.local');
    });
  });

  describe('setUseWebSocket', () => {
    it('should toggle WebSocket preference', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current.useWebSocket).toBe(true);

      act(() => {
        result.current.setUseWebSocket(false);
      });
      expect(result.current.useWebSocket).toBe(false);

      act(() => {
        result.current.setUseWebSocket(true);
      });
      expect(result.current.useWebSocket).toBe(true);
    });
  });

  describe('setPollingInterval', () => {
    it('should update polling interval', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setPollingInterval(5000);
      });

      expect(result.current.pollingInterval).toBe(5000);
    });

    it('should accept valid numeric values', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setPollingInterval(1000);
      });
      expect(result.current.pollingInterval).toBe(1000);

      act(() => {
        result.current.setPollingInterval(10000);
      });
      expect(result.current.pollingInterval).toBe(10000);
    });
  });

  describe('setMusicProvider', () => {
    it('should update music provider', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setMusicProvider('youtube-music');
      });

      expect(result.current.musicProvider).toBe('youtube-music');
    });

    it('should persist to separate storage key', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setMusicProvider('spicetify');
      });

      const stored = localStorage.getItem('tsi_jukebox_music_provider');
      expect(stored).toBe('spicetify');
    });

    it('should support all provider types', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      const providers = ['spotify', 'spicetify', 'youtube-music', 'local'] as const;

      for (const provider of providers) {
        act(() => {
          result.current.setMusicProvider(provider);
        });
        expect(result.current.musicProvider).toBe(provider);
      }
    });
  });

  describe('setSpicetifyConfig', () => {
    it('should update spicetify settings partially', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setSpicetifyConfig({ isInstalled: true });
      });

      expect(result.current.spicetify.isInstalled).toBe(true);
      expect(result.current.spicetify.currentTheme).toBe('');
    });

    it('should merge with existing settings', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setSpicetifyConfig({ isInstalled: true, version: '2.0' });
      });

      act(() => {
        result.current.setSpicetifyConfig({ currentTheme: 'Dribbblish' });
      });

      expect(result.current.spicetify.isInstalled).toBe(true);
      expect(result.current.spicetify.version).toBe('2.0');
      expect(result.current.spicetify.currentTheme).toBe('Dribbblish');
    });
  });

  describe('setWeatherConfig', () => {
    it('should update weather settings partially', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setWeatherConfig({ isEnabled: true });
      });

      expect(result.current.weather.isEnabled).toBe(true);
    });

    it('should merge with existing settings', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setWeatherConfig({ city: 'São Paulo, SP' });
      });

      act(() => {
        result.current.setWeatherConfig({ apiKey: 'test-key' });
      });

      expect(result.current.weather.city).toBe('São Paulo, SP');
      expect(result.current.weather.apiKey).toBe('test-key');
    });

    it('should persist weather settings to separate storage key', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      act(() => {
        result.current.setWeatherConfig({ city: 'Rio de Janeiro, RJ', isEnabled: true });
      });

      const stored = JSON.parse(localStorage.getItem('tsi_jukebox_weather') || '{}');
      expect(stored.city).toBe('Rio de Janeiro, RJ');
      expect(stored.isEnabled).toBe(true);
    });
  });

  describe('useAppSettings', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppSettings());
      }).toThrow('useAppSettings must be used within an AppSettingsProvider');

      consoleSpy.mockRestore();
    });

    it('should return context value when inside provider', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current).toHaveProperty('isDemoMode');
      expect(result.current).toHaveProperty('setDemoMode');
      expect(result.current).toHaveProperty('apiUrl');
      expect(result.current).toHaveProperty('musicProvider');
      expect(result.current).toHaveProperty('weather');
    });
  });
});
