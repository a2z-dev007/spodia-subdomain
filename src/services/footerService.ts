import { getFooter } from "./api";

export interface Record {
  id?: number;
  city_id?: number | null;
  city__name?: null | string;
  total?: number;
}

export interface StateResortsRecord {
  id?: number;
  state_id?: number;
  state__name?: string;
  total?: number;
}

export interface FooterAPIType {
  two_star_records?: Record[];
  three_star_records?: Record[];
  four_star_records?: Record[];
  five_star_records?: Record[];
  budget_records?: Record[];
  deluxe_records?: Record[];
  luxury_records?: Record[];
  cheap_records?: Record[];
  club_records?: any[];
  resorts_records?: Record[];
  best_records?: Record[];
  search_records?: Record[];
  boutique_records?: Record[];
  family_records?: Record[];
  near_city_records?: Record[];
  country_records?: any[];
  top_records?: any[];
  most_search_records?: any[];
  state_resorts_records?: StateResortsRecord[];
  popular_records?: any[];
  home_stay_records?: any[];
}

export interface FooterApiResponse {
  status: string;
  data: FooterAPIType;
}

// Legacy type aliases for backward compatibility
export type FooterRecord = Record;
export type StateFooterRecord = StateResortsRecord;

export const fetchFooterData = async (): Promise<FooterApiResponse> => {
  try {
    const response = await getFooter();
    const data = response.data;
    
    // Ensure all record arrays exist
    const emptyRecords: Record[] = [];
    const emptyAnyRecords: any[] = [];
    const emptyStateRecords: StateResortsRecord[] = [];
    
    return {
      status: data?.status || 'success',
      data: {
        two_star_records: data?.data?.two_star_records || emptyRecords,
        three_star_records: data?.data?.three_star_records || emptyRecords,
        four_star_records: data?.data?.four_star_records || emptyRecords,
        five_star_records: data?.data?.five_star_records || emptyRecords,
        budget_records: data?.data?.budget_records || emptyRecords,
        deluxe_records: data?.data?.deluxe_records || emptyRecords,
        luxury_records: data?.data?.luxury_records || emptyRecords,
        cheap_records: data?.data?.cheap_records || emptyRecords,
        club_records: data?.data?.club_records || emptyAnyRecords,
        resorts_records: data?.data?.resorts_records || emptyRecords,
        best_records: data?.data?.best_records || emptyRecords,
        search_records: data?.data?.search_records || emptyRecords,
        boutique_records: data?.data?.boutique_records || emptyRecords,
        family_records: data?.data?.family_records || emptyRecords,
        near_city_records: data?.data?.near_city_records || emptyRecords,
        country_records: data?.data?.country_records || emptyAnyRecords,
        top_records: data?.data?.top_records || emptyAnyRecords,
        most_search_records: data?.data?.most_search_records || emptyAnyRecords,
        state_resorts_records: data?.data?.state_resorts_records || emptyStateRecords,
        popular_records: data?.data?.popular_records || emptyAnyRecords,
        home_stay_records: data?.data?.home_stay_records || emptyAnyRecords,
      }
    };
  } catch (error) {
    console.error('Error fetching footer data:', error);
    throw error;
  }
};

// Helper function to generate URL-friendly slug from city name
export const generateCitySlug = (cityName: string | null | undefined): string => {
  if (!cityName || typeof cityName !== 'string') {
    return 'hotels';
  }
  return cityName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Helper function to generate hotel link for a city
export const generateHotelLink = (cityName: string | null | undefined, cityId?: number | null): string => {
  if (!cityName) {
    return '/in/hotels';
  }
  const slug = generateCitySlug(cityName);
  return `/in/hotels/${slug}`;
};

// Helper function to generate homestay link for a city
export const generateHomestayLink = (cityName: string | null | undefined, cityId?: number | null): string => {
  if (!cityName) {
    return '/in/hotels/homestays';
  }
  const slug = generateCitySlug(cityName);
  return `/in/hotels/${slug}/homestays`;
};

// Helper function to generate 5-star hotel link for a city
export const generateFiveStarLink = (cityName: string | null | undefined, cityId?: number | null): string => {
  if (!cityName) {
    return '/in/hotels/5-star-hotels';
  }
  const slug = generateCitySlug(cityName);
  return `/in/hotels/${slug}/5-star-hotels`;
};

// Helper function to generate budget hotel link for a city
export const generateBudgetHotelLink = (cityName: string | null | undefined, cityId?: number | null): string => {
  if (!cityName) {
    return '/in/hotels/budget-hotels';
  }
  const slug = generateCitySlug(cityName);
  return `/in/hotels/${slug}/budget-hotels`;
};

// Helper function to generate resort link for a city
export const generateResortLink = (cityName: string | null | undefined, cityId?: number | null): string => {
  if (!cityName) {
    return '/in/hotels/resorts';
  }
  const slug = generateCitySlug(cityName);
  return `/in/hotels/${slug}/resorts`;
};

// Helper function to generate state slug
export const generateStateSlug = (stateName: string | null | undefined): string => {
  if (!stateName || typeof stateName !== 'string') {
    return 'state';
  }
  return stateName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Helper function to generate hotel link for a state
export const generateStateHotelLink = (stateName: string | null | undefined, stateId?: number | null): string => {
  if (!stateName) {
    return '/in/hotels/state';
  }
  const slug = generateStateSlug(stateName);
  return `/in/hotels/${slug}`;
};

// Helper function to generate resort link for a state
export const generateStateResortLink = (stateName: string | null | undefined, stateId?: number | null): string => {
  if (!stateName) {
    return '/in/hotels/state/resorts';
  }
  const slug = generateStateSlug(stateName);
  return `/in/hotels/${slug}/resorts`;
};

// Helper functions to format footer data for HotelSection component
import { HotelSectionItem } from '@/components/hotels/HotelSection';

export const formatCityRecordsForHotels = (records: Record[]): HotelSectionItem[] => {
  return records.map(record => ({
    label: `Hotels in ${record.city__name}`,
    href: generateHotelLink(record.city__name, record.city_id)
  }));
};

export const formatCityRecordsForHomestays = (records: Record[]): HotelSectionItem[] => {
  return records.map(record => ({
    label: `Home Stay in ${record.city__name}`,
    href: generateHomestayLink(record.city__name, record.city_id)
  }));
};

export const formatStateRecordsForHotels = (records: StateResortsRecord[]): HotelSectionItem[] => {
  return records.map(record => ({
    label: `Hotels in ${record.state__name}`,
    href: generateStateHotelLink(record.state__name, record.state_id)
  }));
};

export const formatStateRecordsForResorts = (records: StateResortsRecord[]): HotelSectionItem[] => {
  return records.map(record => ({
    label: `Resorts in ${record.state__name}`,
    href: generateStateResortLink(record.state__name, record.state_id)
  }));
};
