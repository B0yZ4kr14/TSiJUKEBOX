import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GitHubSyncStatus {
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    authorAvatar?: string;
    date: string;
    url: string;
  } | null;
  syncStatus: 'synced' | 'pending' | 'error' | 'unknown';
  lastPush: string | null;
  lastUpdate: string | null;
  branch: string;
  repoUrl: string;
}

export interface UseGitHubSyncReturn {
  syncStatus: GitHubSyncStatus | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastRefresh: Date | null;
}

export function useGitHubSync(): UseGitHubSyncReturn {
  const [syncStatus, setSyncStatus] = useState<GitHubSyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch last commit
      const commitResponse = await supabase.functions.invoke('github-repo', {
        body: { action: 'last-commit' },
      });

      // Fetch repo info for sync status
      const repoResponse = await supabase.functions.invoke('github-repo', {
        body: { action: 'sync-status' },
      });

      if (commitResponse.error) {
        throw new Error(commitResponse.error.message || 'Failed to fetch commit');
      }

      if (repoResponse.error) {
        throw new Error(repoResponse.error.message || 'Failed to fetch repo info');
      }

      const commits = commitResponse.data?.data || [];
      const repoInfo = repoResponse.data?.data || {};

      const lastCommit = commits[0];

      // Determine sync status based on timestamps
      const pushedAt = repoInfo.pushed_at ? new Date(repoInfo.pushed_at) : null;
      const updatedAt = repoInfo.updated_at ? new Date(repoInfo.updated_at) : null;
      const now = new Date();

      let status: 'synced' | 'pending' | 'error' | 'unknown' = 'unknown';
      if (pushedAt) {
        const timeDiff = now.getTime() - pushedAt.getTime();
        const fiveMinutes = 5 * 60 * 1000;
        status = timeDiff < fiveMinutes ? 'synced' : 'synced';
      }

      setSyncStatus({
        lastCommit: lastCommit
          ? {
              sha: lastCommit.sha?.substring(0, 7) || '',
              message: lastCommit.commit?.message?.split('\n')[0] || '',
              author: lastCommit.commit?.author?.name || lastCommit.author?.login || 'Unknown',
              authorAvatar: lastCommit.author?.avatar_url,
              date: lastCommit.commit?.author?.date || '',
              url: lastCommit.html_url || '',
            }
          : null,
        syncStatus: status,
        lastPush: repoInfo.pushed_at || null,
        lastUpdate: repoInfo.updated_at || null,
        branch: repoInfo.default_branch || 'main',
        repoUrl: repoInfo.html_url || 'https://github.com/B0yZ4kr14/TSiJUKEBOX',
      });

      setLastRefresh(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('[useGitHubSync] Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    syncStatus,
    isLoading,
    error,
    refresh,
    lastRefresh,
  };
}
