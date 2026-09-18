import { cache } from 'react';
import * as api from '@/services/api';
import { fetchSearchHotelsServer, fetchAmenitiesServer } from '@/lib/serverDataFetching';

/**
 * Cached versions of API calls for use in Server Components.
 * This ensures that if multiple components (or generateMetadata) call the same function
 * with the same arguments during a single request, the API is only called once.
 */

export const getCachedPropertyByName = cache(async (name: string) => {
  return await api.getPropertyByName(name);
});

export const getCachedPropertyById = cache(async (id: string) => {
  return await api.getPropertyById(id);
});

export const getCachedSearchCityByName = cache(async (name: string) => {
  return await api.searchCityByName(name);
});

export const getCachedCityContent = cache(async (cityName: string) => {
  const response = await api.getCityContent(cityName);
  return response;
});

export const getCachedSearchHotelsApi = cache(async (params: any) => {
  try {
    const data = await fetchSearchHotelsServer(params);
    if (data) {
      return { data };
    }
  } catch (err) {
    console.error('fetchSearchHotelsServer failed, falling back to api:', err);
  }
  return await api.searchHotelsApi(params);
});

export const getCachedSearchListings = cache(async (params: any) => {
  return await api.searchListings(params);
});

export const getCachedAmenities = cache(async () => {
  try {
    const data = await fetchAmenitiesServer();
    if (data) {
      return { data };
    }
  } catch (err) {
    console.error('fetchAmenitiesServer failed, falling back to api:', err);
  }
  return await api.getAmenties();
});

export const getCachedCountries = cache(async () => {
  return await api.getCountries();
});

export const getCachedStates = cache(async (countryId: string | number) => {
  return await api.getStates(countryId);
});
