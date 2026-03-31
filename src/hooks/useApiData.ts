import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseApiDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useApiData<T = any>(
  apiUrl: string,
  mapFn: (item: any) => T
): UseApiDataResult<T> {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['apiData', apiUrl],
    queryFn: async () => {
      const res = await axios.get(apiUrl);
      // Use .records or .results depending on your API response
      const records = res.data.records || res.data.results || [];
      return records.map(mapFn);
    },
    // staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    // gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: isError ? (error instanceof Error ? error.message : 'Failed to load data.') : null,
  };
}