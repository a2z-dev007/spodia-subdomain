import { useState, useEffect } from 'react';
import { BASE_URL } from '@/lib/api/apiClient';

interface CityRecord {
  id: number;
  country_name: string;
  country: number;
  state_name: string;
  state: number;
  name: string;
  meta_keyword: number | null;
  meta_keyword_name: string | null;
  description: string;
  file: string | null;
  key_name: string | null;
  created: string;
}

interface CityApiResponse {
  totalRecords: number;
  status: string;
  records: CityRecord[];
}

export const useCityId = (cityName: string | null | undefined) => {
  const [cityId, setCityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) {
      setCityId(null);
      setError(null);
      return;
    }

    const fetchCityId = async () => {
      setLoading(true);
      setError(null);

      try {
        // Normalize city name for API call
        let normalizedCityName = cityName.trim();
        
        // Handle special cases
        if (normalizedCityName.toLowerCase() === 'new delhi') {
          normalizedCityName = 'Delhi';
        }

        const response = await fetch(
          `${BASE_URL}/cities/?name=${encodeURIComponent(normalizedCityName)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch city data');
        }

        const data: CityApiResponse = await response.json();

        if (data.status === 'success' && data.records.length > 0) {
          // Get the first matching city (most relevant)
          const city = data.records[0];
          setCityId(city.id);
          console.log(`City ID for "${cityName}":`, city.id);
        } else {
          console.warn(`No city found for "${cityName}"`);
          setCityId(null);
        }
      } catch (err) {
        console.error('Error fetching city ID:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCityId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCityId();
  }, [cityName]);

  return { cityId, loading, error };
};
