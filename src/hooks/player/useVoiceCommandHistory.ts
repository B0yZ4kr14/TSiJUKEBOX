import { useState, useCallback, useEffect, useMemo } from 'react';

export interface VoiceCommandHistoryEntry {
  id: string;
  timestamp: number;
  transcript: string;
  confidence: number;
  action: string | null;
  searchQuery?: string;
  matchedPattern?: string;
  success: boolean;
  processingTimeMs?: number;
}

export interface VoiceHistoryStats {
  totalCommands: number;
  successRate: number;
  averageConfidence: number;
  mostUsedCommands: { action: string; count: number }[];
  failedCommands: number;
  commandsToday: number;
  commandsThisWeek: number;
}

export interface VoiceAnalyticsData {
  commandsByHour: { hour: string; count: number; success: number; failed: number }[];
  successRateOverTime: { date: string; rate: number; total: number }[];
  confidenceDistribution: { range: string; count: number; percentage: number }[];
  commandDistribution: { action: string; count: number; fill: string }[];
}

interface UseVoiceCommandHistoryReturn {
  history: VoiceCommandHistoryEntry[];
  stats: VoiceHistoryStats;
  analytics: VoiceAnalyticsData;
  addEntry: (entry: Omit<VoiceCommandHistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
  exportAsJSON: () => string;
  exportAsCSV: () => string;
  getFilteredHistory: (filter: HistoryFilter) => VoiceCommandHistoryEntry[];
}

export interface HistoryFilter {
  startDate?: Date;
  endDate?: Date;
  action?: string;
  successOnly?: boolean;
  failedOnly?: boolean;
  minConfidence?: number;
}

const STORAGE_KEY = 'tsijukebox-voice-history';
const MAX_ENTRIES = 500;

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function loadHistory(): VoiceCommandHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading voice history:', error);
  }
  return [];
}

function saveHistory(history: VoiceCommandHistoryEntry[]): void {
  try {
    const trimmed = history.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving voice history:', error);
  }
}

// Analytics helper functions
function getCommandsByHour(history: VoiceCommandHistoryEntry[]): VoiceAnalyticsData['commandsByHour'] {
  const last24h = Date.now() - (24 * 60 * 60 * 1000);
  const filtered = history.filter(h => h.timestamp >= last24h);
  
  const hourlyData: Record<number, { count: number; success: number; failed: number }> = {};
  
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { count: 0, success: 0, failed: 0 };
  }
  
  filtered.forEach(entry => {
    const hour = new Date(entry.timestamp).getHours();
    hourlyData[hour].count++;
    if (entry.success) {
      hourlyData[hour].success++;
    } else {
      hourlyData[hour].failed++;
    }
  });
  
  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: `${hour.padStart(2, '0')}h`,
    ...data
  }));
}

function getSuccessRateOverTime(history: VoiceCommandHistoryEntry[]): VoiceAnalyticsData['successRateOverTime'] {
  const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const filtered = history.filter(h => h.timestamp >= last7Days);
  
  const dailyData: Record<string, { success: number; total: number }> = {};
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    dailyData[dateKey] = { success: 0, total: 0 };
  }
  
  filtered.forEach(entry => {
    const dateKey = new Date(entry.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (dailyData[dateKey]) {
      dailyData[dateKey].total++;
      if (entry.success) {
        dailyData[dateKey].success++;
      }
    }
  });
  
  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    rate: data.total > 0 ? Math.round((data.success / data.total) * 100) : 0,
    total: data.total
  }));
}

function getConfidenceDistribution(history: VoiceCommandHistoryEntry[]): VoiceAnalyticsData['confidenceDistribution'] {
  const ranges = [
    { min: 0, max: 0.5, label: '0-50%' },
    { min: 0.5, max: 0.6, label: '50-60%' },
    { min: 0.6, max: 0.7, label: '60-70%' },
    { min: 0.7, max: 0.8, label: '70-80%' },
    { min: 0.8, max: 0.9, label: '80-90%' },
    { min: 0.9, max: 1.01, label: '90-100%' },
  ];
  
  const counts = ranges.map(range => ({
    range: range.label,
    count: history.filter(h => h.confidence >= range.min && h.confidence < range.max).length,
    percentage: 0
  }));
  
  const total = history.length;
  counts.forEach(item => {
    item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
  });
  
  return counts;
}

function getCommandDistribution(history: VoiceCommandHistoryEntry[]): VoiceAnalyticsData['commandDistribution'] {
  const counts: Record<string, number> = {};
  
  history.forEach(entry => {
    const action = entry.action || 'unknown';
    counts[action] = (counts[action] || 0) + 1;
  });
  
  return Object.entries(counts)
    .map(([action, count], index) => ({
      action,
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function useVoiceCommandHistory(): UseVoiceCommandHistoryReturn {
  const [history, setHistory] = useState<VoiceCommandHistoryEntry[]>(loadHistory);

  // Calculate stats
  const stats: VoiceHistoryStats = useMemo(() => ({
    totalCommands: history.length,
    successRate: history.length > 0 
      ? Math.round((history.filter(h => h.success).length / history.length) * 100)
      : 0,
    averageConfidence: history.length > 0
      ? Math.round((history.reduce((acc, h) => acc + h.confidence, 0) / history.length) * 100)
      : 0,
    mostUsedCommands: getMostUsedCommands(history),
    failedCommands: history.filter(h => !h.success).length,
    commandsToday: getCommandsInPeriod(history, 1),
    commandsThisWeek: getCommandsInPeriod(history, 7)
  }), [history]);

  // Calculate analytics data
  const analytics: VoiceAnalyticsData = useMemo(() => ({
    commandsByHour: getCommandsByHour(history),
    successRateOverTime: getSuccessRateOverTime(history),
    confidenceDistribution: getConfidenceDistribution(history),
    commandDistribution: getCommandDistribution(history)
  }), [history]);

  const addEntry = useCallback((entry: Omit<VoiceCommandHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: VoiceCommandHistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    setHistory(prev => {
      const updated = [...prev, newEntry];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const exportAsJSON = useCallback((): string => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  const exportAsCSV = useCallback((): string => {
    const headers = ['timestamp', 'transcript', 'confidence', 'action', 'success', 'searchQuery', 'processingTimeMs'];
    const rows = history.map(h => [
      new Date(h.timestamp).toISOString(),
      `\"${h.transcript.replace(/\"/g, '\"\"')}\"`,
      (h.confidence * 100).toFixed(1),
      h.action || '',
      h.success ? 'true' : 'false',
      h.searchQuery || '',
      h.processingTimeMs?.toFixed(2) || ''
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }, [history]);

  const getFilteredHistory = useCallback((filter: HistoryFilter): VoiceCommandHistoryEntry[] => {
    return history.filter(entry => {
      if (filter.startDate && entry.timestamp < filter.startDate.getTime()) return false;
      if (filter.endDate && entry.timestamp > filter.endDate.getTime()) return false;
      if (filter.action && entry.action !== filter.action) return false;
      if (filter.successOnly && !entry.success) return false;
      if (filter.failedOnly && entry.success) return false;
      if (filter.minConfidence && entry.confidence < filter.minConfidence) return false;
      return true;
    });
  }, [history]);

  // Listen for voice command events and record them
  useEffect(() => {
    const handleVoiceCommand = (event: CustomEvent) => {
      const { action, transcript, searchQuery, confidence, success, processingTimeMs, matchedPattern } = event.detail;
      
      if (typeof success === 'boolean') {
        addEntry({
          transcript,
          confidence,
          action,
          searchQuery,
          matchedPattern,
          success,
          processingTimeMs
        });
      }
    };

    window.addEventListener('voice-command-history', handleVoiceCommand as EventListener);
    return () => window.removeEventListener('voice-command-history', handleVoiceCommand as EventListener);
  }, [addEntry]);

  return {
    history,
    stats,
    analytics,
    addEntry,
    clearHistory,
    removeEntry,
    exportAsJSON,
    exportAsCSV,
    getFilteredHistory
  };
}

// Helper functions
function getMostUsedCommands(history: VoiceCommandHistoryEntry[]): { action: string; count: number }[] {
  const counts: Record<string, number> = {};
  history.forEach(h => {
    if (h.action) {
      counts[h.action] = (counts[h.action] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getCommandsInPeriod(history: VoiceCommandHistoryEntry[], days: number): number {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  return history.filter(h => h.timestamp >= cutoff).length;
}
