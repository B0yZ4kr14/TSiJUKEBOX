import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { isDemoMode, useMockStatus } from '@/hooks/useMockData';
import type { SystemStatus } from '@/lib/api/types';

export function useStatus(enabled: boolean = true) {
  const mockData = useMockStatus();

  const query = useQuery<SystemStatus>({
    queryKey: ['status'],
    queryFn: () => api.getStatus(),
    refetchInterval: isDemoMode ? false : 2000, // Reduced from 1s to 2s for optimization
    enabled: enabled && !isDemoMode,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000,
  });

  // Return mock data in demo mode
  if (isDemoMode) {
    return {
      data: mockData.status,
      isLoading: false,
      error: null,
      isError: false,
    };
  }

  return query;
}
