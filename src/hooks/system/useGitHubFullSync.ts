import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FileToSync {
  path: string;
  content: string;
}

export interface SyncResult {
  success: boolean;
  commit?: {
    sha: string;
    url: string;
    message: string;
    filesChanged: number;
  };
  error?: string;
}

export interface UseGitHubFullSyncReturn {
  isSyncing: boolean;
  error: string | null;
  lastSync: SyncResult | null;
  syncFiles: (files: FileToSync[], commitMessage?: string) => Promise<SyncResult>;
  clearError: () => void;
}

export function useGitHubFullSync(): UseGitHubFullSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<SyncResult | null>(null);

  const syncFiles = useCallback(async (
    files: FileToSync[], 
    commitMessage?: string
  ): Promise<SyncResult> => {
    setIsSyncing(true);
    setError(null);

    try {
      const message = commitMessage || `[TSiJUKEBOX v4.1.0] Full repository sync - ${new Date().toISOString()}`;

      console.log(`[useGitHubFullSync] Syncing ${files.length} files...`);

      const { data, error: fnError } = await supabase.functions.invoke('full-repo-sync', {
        body: {
          files,
          commitMessage: message,
          branch: 'main'
        }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to sync repository');
      }

      if (!data.success) {
        throw new Error(data.error || 'Sync failed');
      }

      const result: SyncResult = {
        success: true,
        commit: data.commit
      };

      setLastSync(result);
      toast.success('Repository synced!', {
        description: `${data.commit.filesChanged} files pushed to GitHub`
      });

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      const result: SyncResult = {
        success: false,
        error: errorMessage
      };
      
      setLastSync(result);
      toast.error('Sync failed', { description: errorMessage });
      
      return result;

    } finally {
      setIsSyncing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSyncing,
    error,
    lastSync,
    syncFiles,
    clearError
  };
}
