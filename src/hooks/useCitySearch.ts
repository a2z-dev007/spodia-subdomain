import { useCallback, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/lib/api/apiClient';

export interface CityOption {
  id: number;
  name: string;
  country_name: string;
  state_name: string;
}

export const useCitySearch = () => {
  const cancelToken = useRef<ReturnType<typeof axios.CancelToken.source> | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchCities = useCallback(async (inputValue: string) => {
    // Return empty array immediately if no input
    if (!inputValue) return [];

    // Return a promise that resolves after debounce delay
    return new Promise<any[]>((resolve) => {
      // Clear existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Cancel previous request if exists
      if (cancelToken.current) {
        cancelToken.current.cancel('Operation cancelled due to new request.');
      }

      // Set new debounce timer (500ms delay)
      debounceTimer.current = setTimeout(async () => {
        cancelToken.current = axios.CancelToken.source();
        
        try {
          const response = await axios.get(`${BASE_URL}/cities/`, {
            params: { name: inputValue },
            cancelToken: cancelToken.current.token,
          });
          
          if (response.data?.records) {
            const cities = response.data.records.map((city: any) => ({
              value: city.id,
              label: `${city.name}, ${city.state_name}, ${city.country_name}`,
              ...city,
            }));
            resolve(cities);
          } else {
            resolve([]);
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            resolve([]);
          } else {
            console.error('City search error:', error);
            resolve([]);
          }
        }
      }, 500); // 500ms debounce delay
    });
  }, []);

  return fetchCities;
}; 