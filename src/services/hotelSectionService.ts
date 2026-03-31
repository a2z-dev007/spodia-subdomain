/**
 * Hotel Section Service
 * 
 * This service provides reusable functions to fetch different hotel sections
 * from the API using section labels
 * 
 * API Examples:
 * - Featured: show_featured=true
 * - Popular: show_popular=true
 * - Top Rated: show_top_rated=true
 * - Best Deals: show_best_deals=true
 * 
 * Usage Example:
 * ```typescript
 * import { fetchFeaturedHotels, fetchPopularHotels } from '@/services/hotelSectionService';
 * 
 * // In your component with React Query:
 * const { data, isLoading } = useQuery({
 *   queryKey: ['featuredHotels', cityId],
 *   queryFn: () => fetchFeaturedHotels(cityId, 10),
 *   enabled: !!cityId
 * });
 * 
 * const hotels = data?.records || [];
 * ```
 */

import { searchListings } from './api';

export type SectionLabel = 'show_featured' | 'show_popular' | 'show_top_rated' | 'show_best_deals';

export interface HotelSectionParams {
    cityId?: number;
    pageNumber?: number;
    numberOfRecords?: number;
    sectionLabel: SectionLabel;
}

export interface HotelSectionResponse {
    status: string;
    totalRecords: number;
    records: any[];
}

/**
 * Reusable function to fetch hotel sections with different labels
 * @param params - Parameters for the API call
 * @returns Promise with hotel section data
 */
export async function fetchHotelSection(params: HotelSectionParams): Promise<HotelSectionResponse> {
    const {
        cityId,
        pageNumber = 1,
        numberOfRecords = 15,
        sectionLabel
    } = params;

    try {
        // Build query parameters
        const queryParams = new URLSearchParams({
            page_number: pageNumber.toString(),
            number_of_records: numberOfRecords.toString(),
            [sectionLabel]: 'true'  // Add the section label with true value
        });

        // Add optional city parameter
        if (cityId && cityId > 0) {
            queryParams.append('city', cityId.toString());
        }

        console.log(`Fetching ${sectionLabel} hotels with params:`, Object.fromEntries(queryParams));

        const response = await searchListings(Object.fromEntries(queryParams) as any);

        if (!response.data || response.data.status === 'error') {
            console.error(`Failed to fetch ${sectionLabel} hotels`);
            return {
                status: 'error',
                totalRecords: 0,
                records: []
            };
        }

        const data = response.data;
        
        // Ensure the response has the expected structure
        return {
            status: data?.status || 'success',
            totalRecords: data?.totalRecords || 0,
            records: Array.isArray(data?.records) ? data.records : []
        };
    } catch (error) {
        console.error(`Error fetching ${sectionLabel} hotels:`, error);
        return {
            status: 'error',
            totalRecords: 0,
            records: []
        };
    }
}

/**
 * Fetch featured hotels
 * API: show_featured=true
 */
export async function fetchFeaturedHotels(cityId?: number, numberOfRecords = 8) {
    return fetchHotelSection({
        cityId,
        numberOfRecords,
        sectionLabel: 'show_featured'
    });
}

/**
 * Fetch popular hotels
 * API: show_popular=true
 */
export async function fetchPopularHotels(cityId?: number, numberOfRecords = 15) {
    return fetchHotelSection({
        cityId,
        numberOfRecords,
        sectionLabel: 'show_popular'
    });
}

/**
 * Fetch top rated hotels
 * API: show_top_rated=true
 */
export async function fetchTopRatedHotels(cityId?: number, numberOfRecords = 15) {
    return fetchHotelSection({
        cityId,
        numberOfRecords,
        sectionLabel: 'show_top_rated'
    });
}

/**
 * Fetch best deals hotels
 * API: show_best_deals=true
 */
export async function fetchBestDealsHotels(cityId?: number, numberOfRecords = 15) {
    return fetchHotelSection({
        cityId,
        numberOfRecords,
        sectionLabel: 'show_best_deals'
    });
}
