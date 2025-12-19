import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  BackupProvider, 
  BackupItem, 
  BackupHistoryItem, 
  CloudConfig, 
  ScheduleConfig,
  BackupType 
} from '../types';

const STORAGE_KEYS = {
  local: 'tsi_jukebox_local_backups',
  cloud: 'tsi_jukebox_cloud_config',
  schedule: 'tsi_jukebox_backup_schedule',
  history: 'tsi_jukebox_backup_history',
};

const DEFAULT_SCHEDULE: ScheduleConfig = {
  enabled: false,
  frequency: 'daily',
  time: '03:00',
  retention: 7,
  providers: ['local'],
};

interface UseBackupManagerParams {
  enabledProviders: BackupProvider[];
  isDemoMode?: boolean;
}

interface UseBackupManagerReturn {
  backups: Record<BackupProvider, BackupItem[]>;
  history: BackupHistoryItem[];
  cloudConfig: CloudConfig;
  scheduleConfig: ScheduleConfig;
  isLoading: boolean;
  
  // Actions
  createBackup: (provider: BackupProvider, type?: BackupType) => Promise<BackupItem | null>;
  restoreBackup: (provider: BackupProvider, backupId: string) => Promise<boolean>;
  deleteBackup: (provider: BackupProvider, backupId: string) => Promise<boolean>;
  
  // Config
  setCloudConfig: (config: CloudConfig) => void;
  setScheduleConfig: (config: ScheduleConfig) => void;
  
  // Utils
  getProviderBackups: (provider: BackupProvider) => BackupItem[];
  refreshBackups: () => void;
}

export function useBackupManager({ 
  enabledProviders, 
  isDemoMode = false 
}: UseBackupManagerParams): UseBackupManagerReturn {
  const [isLoading, setIsLoading] = useState(false);
  
  // Load initial state from localStorage
  const [backups, setBackups] = useState<Record<BackupProvider, BackupItem[]>>(() => {
    const result: Record<BackupProvider, BackupItem[]> = {
      local: [],
      cloud: [],
      distributed: [],
    };
    
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.local);
      if (saved) {
        const parsed = JSON.parse(saved);
        result.local = parsed;
      }
    } catch {
      // Use defaults
    }
    
    return result;
  });

  const [history, setHistory] = useState<BackupHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.history);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cloudConfig, setCloudConfigState] = useState<CloudConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.cloud);
      return saved ? JSON.parse(saved) : { provider: '' };
    } catch {
      return { provider: '' };
    }
  });

  const [scheduleConfig, setScheduleConfigState] = useState<ScheduleConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.schedule);
      return saved ? { ...DEFAULT_SCHEDULE, ...JSON.parse(saved) } : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  const addToHistory = useCallback((item: Omit<BackupHistoryItem, 'id' | 'date'>) => {
    const newItem: BackupHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const createBackup = useCallback(async (
    provider: BackupProvider, 
    type: BackupType = 'full'
  ): Promise<BackupItem | null> => {
    if (isDemoMode) {
      toast.info(`Demo: Backup ${type} criado (${provider})`);
      return null;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/backup/${provider}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newBackup: BackupItem = {
          id: result.id || crypto.randomUUID(),
          name: result.name || `backup_${new Date().toISOString()}_${type}.db`,
          type,
          size: result.size || '0 KB',
          date: new Date().toISOString(),
          provider,
          status: 'completed',
        };
        
        setBackups(prev => {
          const updated = {
            ...prev,
            [provider]: [newBackup, ...prev[provider]],
          };
          if (provider === 'local') {
            localStorage.setItem(STORAGE_KEYS.local, JSON.stringify(updated.local));
          }
          return updated;
        });
        
        addToHistory({
          provider,
          type,
          status: 'completed',
          size: newBackup.size,
        });
        
        toast.success(`Backup ${type} criado com sucesso`);
        return newBackup;
      } else {
        toast.error(`Erro ao criar backup: ${result.message}`);
        addToHistory({
          provider,
          type,
          status: 'failed',
          size: '0 KB',
        });
        return null;
      }
    } catch (error) {
      toast.error('Erro ao criar backup');
      addToHistory({
        provider,
        type,
        status: 'failed',
        size: '0 KB',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode, addToHistory]);

  const restoreBackup = useCallback(async (
    provider: BackupProvider, 
    backupId: string
  ): Promise<boolean> => {
    if (isDemoMode) {
      toast.info('Demo: Backup restaurado');
      return true;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/backup/${provider}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Backup restaurado com sucesso');
        return true;
      } else {
        toast.error(`Erro ao restaurar: ${result.message}`);
        return false;
      }
    } catch {
      toast.error('Erro ao restaurar backup');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  const deleteBackup = useCallback(async (
    provider: BackupProvider, 
    backupId: string
  ): Promise<boolean> => {
    if (isDemoMode) {
      toast.info('Demo: Backup excluído');
      return true;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/backup/${provider}/${backupId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBackups(prev => {
          const updated = {
            ...prev,
            [provider]: prev[provider].filter(b => b.id !== backupId),
          };
          if (provider === 'local') {
            localStorage.setItem(STORAGE_KEYS.local, JSON.stringify(updated.local));
          }
          return updated;
        });
        
        toast.success('Backup excluído');
        return true;
      } else {
        toast.error(`Erro ao excluir: ${result.message}`);
        return false;
      }
    } catch {
      toast.error('Erro ao excluir backup');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  const setCloudConfig = useCallback((config: CloudConfig) => {
    setCloudConfigState(config);
    localStorage.setItem(STORAGE_KEYS.cloud, JSON.stringify(config));
  }, []);

  const setScheduleConfig = useCallback((config: ScheduleConfig) => {
    setScheduleConfigState(config);
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(config));
  }, []);

  const getProviderBackups = useCallback((provider: BackupProvider) => {
    return backups[provider] || [];
  }, [backups]);

  const refreshBackups = useCallback(() => {
    // Trigger re-fetch from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.local);
      if (saved) {
        setBackups(prev => ({
          ...prev,
          local: JSON.parse(saved),
        }));
      }
    } catch {
      // Ignore
    }
  }, []);

  return {
    backups,
    history,
    cloudConfig,
    scheduleConfig,
    isLoading,
    createBackup,
    restoreBackup,
    deleteBackup,
    setCloudConfig,
    setScheduleConfig,
    getProviderBackups,
    refreshBackups,
  };
}
