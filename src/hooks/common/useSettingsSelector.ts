import { useMemo, useRef, useCallback } from 'react';
import { useSettings, type SettingsContextType } from '@/contexts/SettingsContext';

/**
 * Context selector hook for optimized settings access.
 * Only re-renders when the selected portion of settings changes.
 * 
 * @example
 * // Only re-renders when theme changes
 * const theme = useSettingsSelector(s => s.theme);
 * 
 * @example
 * // Select multiple related values
 * const { isDemoMode, apiUrl } = useSettingsSelector(s => ({
 *   isDemoMode: s.isDemoMode,
 *   apiUrl: s.apiUrl
 * }));
 */
export function useSettingsSelector<T>(
  selector: (settings: SettingsContextType) => T,
  equalityFn: (a: T, b: T) => boolean = Object.is
): T {
  const settings = useSettings();
  const selectedRef = useRef<T>();
  
  const selected = useMemo(() => {
    const newSelected = selector(settings);
    
    // Use equality function to determine if we should return a new reference
    if (selectedRef.current !== undefined && equalityFn(selectedRef.current, newSelected)) {
      return selectedRef.current;
    }
    
    selectedRef.current = newSelected;
    return newSelected;
  }, [settings, selector, equalityFn]);
  
  return selected;
}

/**
 * Shallow equality comparison for objects
 */
export function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  
  return true;
}

// Pre-built selectors for common use cases
export const selectTheme = (s: SettingsContextType) => s.theme;
export const selectLanguage = (s: SettingsContextType) => s.language;
export const selectIsDemoMode = (s: SettingsContextType) => s.isDemoMode;
export const selectMusicProvider = (s: SettingsContextType) => s.musicProvider;
export const selectSpotify = (s: SettingsContextType) => s.spotify;
export const selectYoutubeMusic = (s: SettingsContextType) => s.youtubeMusic;
export const selectAnimationsEnabled = (s: SettingsContextType) => s.animationsEnabled;
export const selectSoundEnabled = (s: SettingsContextType) => s.soundEnabled;
