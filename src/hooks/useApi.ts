import { useQuery, useMutation } from "@tanstack/react-query";
import {
  searchListings,
  getPropertyByName,
  getPropertyById,
  searchRoomTypes,
  getFooter,
  getCountries,
  getStates,
  getCities,
  searchCityByName,
  becomeHost,
} from "@/services/api";

// ✅ Listings Search
export const useSearchListings = (params: { page_number?: number; show_landing?: boolean; number_of_records?: number }) =>
  useQuery({
    queryKey: ["listings", params],
    queryFn: () => searchListings(params).then((res) => res.data),
  });

// ✅ Property by name
export const usePropertyByName = (name: string) =>
  useQuery({
    queryKey: ["propertyByName", name],
    queryFn: () => getPropertyByName(name).then((res) => res.data),
    enabled: !!name,
  });

// ✅ Property by ID
export const usePropertyById = (id: string) =>
  useQuery({
    queryKey: ["propertyById", id],
    queryFn: () => getPropertyById(id).then((res) => res.data),
    enabled: !!id,
  });

// ✅ Room Types
export const useRoomTypes = (params: { page_number?: number; number_of_records?: number; name?: string }) =>
  useQuery({
    queryKey: ["roomTypes", params],
    queryFn: () => searchRoomTypes(params).then((res) => res.data),
  });

// ✅ Footer
export const useFooter = () =>
  useQuery({
    queryKey: ["footer"],
    queryFn: () => getFooter().then((res) => res.data),
  });

// ✅ Countries
export const useCountries = () =>
  useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries().then((res) => res.data),
  });

// ✅ States
export const useStates = (countryId: string | number) =>
  useQuery({
    queryKey: ["states", countryId],
    queryFn: () => getStates(countryId).then((res) => res.data),
    enabled: !!countryId,
  });

// ✅ Cities
export const useCities = (stateId: string | number) =>
  useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => getCities(stateId).then((res) => res.data),
    enabled: !!stateId,
  });

// ✅ Search City by name
export const useCitySearch = (name: string) =>
  useQuery({
    queryKey: ["citySearch", name],
    queryFn: () => searchCityByName(name).then((res) => res.data),
    enabled: !!name,
  });

// ✅ Become Host Mutation
export const useBecomeHost = () =>
  useMutation({
    mutationFn: (payload: any) => becomeHost(payload).then((res) => res.data),
  });
