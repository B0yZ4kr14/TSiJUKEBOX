// Lib utilities barrel export

// API clients
export * from './api';

// Auth
export * from './auth';

// Storage
export * from './storage';

// Validations
export * from './validations';

// Constants
export * from './constants';

// Core utilities
export { cn } from './utils';
export { extractDominantColors, generateAnimatedGradient, type ExtractedColors } from './colorExtractor';
export { 
  hslToRgb, 
  parseRgb, 
  hexToRgb, 
  parseColor, 
  getRelativeLuminance, 
  calculateContrastRatio, 
  meetsWCAGAA, 
  meetsWCAGAAA, 
  isLargeText, 
  getEffectiveBackgroundColor, 
  isLightColor, 
  isDarkColor, 
  suggestCorrection, 
  getContrastSeverity 
} from './contrastUtils';
export { 
  generateFullMarkdown, 
  generateFullHTML, 
  downloadMarkdown, 
  downloadHTML, 
  printDocument,
  type HelpSection,
  type HelpItem,
} from './documentExporter';
export { formatDuration, formatFileSize, formatDate, formatRelativeTime, formatNumber, formatPercentage, truncateText, formatTemperature } from './formatters';
export { 
  searchHelp, 
  searchWiki, 
  getSearchCategories, 
  getHelpCategories,
  type UnifiedSearchResult,
  type SearchFilters,
} from './globalSearch';
export { parseLRC, type LyricsLine } from './lrcParser';
export { generateCacheKey, getCachedLyrics, setCachedLyrics, clearLyricsCache, getCacheStats } from './lyricsCache';
export { applyThemeWithTransition, setHighContrast, setReducedMotion } from './theme-utils';
