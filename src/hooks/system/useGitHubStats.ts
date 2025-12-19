import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFromCache, setToCache, clearCache, getCacheStats } from './useGitHubCache';

export interface GitHubRepoInfo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  size: number;
  language: string;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
}

export interface GitHubBranch {
  name: string;
  protected: boolean;
}

export interface GitHubLanguages {
  [key: string]: number;
}

interface CacheStats {
  size: number;
  keys: string[];
  lastUpdate: number | null;
}

interface UseGitHubStatsReturn {
  repoInfo: GitHubRepoInfo | null;
  commits: GitHubCommit[];
  contributors: GitHubContributor[];
  releases: GitHubRelease[];
  branches: GitHubBranch[];
  languages: GitHubLanguages;
  isLoading: boolean;
  error: string | null;
  fromCache: boolean;
  cacheStats: CacheStats;
  refetch: (force?: boolean) => Promise<void>;
  clearAllCache: () => void;
}

async function fetchGitHubData<T>(action: string, path: string = ''): Promise<T | null> {
  try {
    const { data, error } = await supabase.functions.invoke('github-repo', {
      body: { action, path }
    });

    if (error) {
      console.error(`[useGitHubStats] Error fetching ${action}:`, error);
      return null;
    }

    if (!data?.success) {
      console.error(`[useGitHubStats] Failed ${action}:`, data?.error);
      return null;
    }

    return data.data as T;
  } catch (err) {
    console.error(`[useGitHubStats] Exception in ${action}:`, err);
    return null;
  }
}

async function fetchWithCache<T>(action: string, forceRefresh: boolean = false): Promise<{ data: T | null; fromCache: boolean }> {
  if (!forceRefresh) {
    const cached = getFromCache<T>(action);
    if (cached) {
      console.log(`[useGitHubStats] Cache hit for ${action}`);
      return { data: cached, fromCache: true };
    }
  }

  console.log(`[useGitHubStats] Fetching ${action} from API`);
  const data = await fetchGitHubData<T>(action);
  
  if (data) {
    setToCache(action, data);
  }
  
  return { data, fromCache: false };
}

export function useGitHubStats(): UseGitHubStatsReturn {
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [languages, setLanguages] = useState<GitHubLanguages>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheStats, setCacheStats] = useState<CacheStats>(() => getCacheStats());

  const fetchAllData = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await Promise.all([
        fetchWithCache<GitHubRepoInfo>('repo-info', forceRefresh),
        fetchWithCache<GitHubCommit[]>('commits', forceRefresh),
        fetchWithCache<GitHubContributor[]>('contributors', forceRefresh),
        fetchWithCache<GitHubRelease[]>('releases', forceRefresh),
        fetchWithCache<GitHubBranch[]>('branches', forceRefresh),
        fetchWithCache<GitHubLanguages>('languages', forceRefresh)
      ]);

      const [repoData, commitsData, contributorsData, releasesData, branchesData, languagesData] = results;

      // Verificar se algum dado veio do cache
      const anyFromCache = results.some(r => r.fromCache);
      setFromCache(anyFromCache);

      if (repoData.data) setRepoInfo(repoData.data);
      if (commitsData.data) setCommits(commitsData.data);
      if (contributorsData.data) setContributors(contributorsData.data);
      if (releasesData.data) setReleases(releasesData.data);
      if (branchesData.data) setBranches(branchesData.data);
      if (languagesData.data) setLanguages(languagesData.data);

      if (!repoData.data && !commitsData.data && !contributorsData.data) {
        setError('Falha ao carregar dados do GitHub');
      }
      
      setCacheStats(getCacheStats());
    } catch (err) {
      console.error('[useGitHubStats] Error:', err);
      setError('Erro ao conectar com o GitHub');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllCache = useCallback(() => {
    clearCache();
    setCacheStats(getCacheStats());
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    repoInfo,
    commits,
    contributors,
    releases,
    branches,
    languages,
    isLoading,
    error,
    fromCache,
    cacheStats,
    refetch: fetchAllData,
    clearAllCache
  };
}
