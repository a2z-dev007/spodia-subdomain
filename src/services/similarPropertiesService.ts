import apiClient from '@/lib/api/apiClient';

export interface SimilarPropertyParams {
  property_type?: string;
  star_category?: number;
  review_rating?: number;
  city_id?: number;
  exclude_id?: number;
  limit?: number;
}

export interface SimilarProperty {
  id: number;
  name: string;
  city_name: string;
  state_name: string;
  review_rating: number;
  review_count: number;
  property_type: string;
  star_category: number;
  address: string;
  images: Array<{ image_url: string }>;
  min_price?: number;
  amenities?: any[];
}

export const getSimilarProperties = async (params: SimilarPropertyParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.property_type) queryParams.append('property_type', params.property_type);
    if (params.star_category) queryParams.append('star_category', params.star_category.toString());
    if (params.review_rating) queryParams.append('review_rating', params.review_rating.toString());
    if (params.city_id) queryParams.append('city_id', params.city_id.toString());
    if (params.exclude_id) queryParams.append('exclude_id', params.exclude_id.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`/listing/similar?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    throw error;
  }
};

// Get properties by filters using the correct API endpoint
export const getPropertiesByFilters = async (params: SimilarPropertyParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Use correct parameter names: page_number and number_of_records
    queryParams.append('page_number', '1');
    queryParams.append('number_of_records', (params.limit || 10).toString());
    
    // Add all available filter parameters
    if (params.star_category) {
      queryParams.append('star_category', params.star_category.toString());
    }
    // Use 'city' parameter name (not 'city_id') to match the API
    if (params.city_id) {
      queryParams.append('city', params.city_id.toString());
    }
    if (params.property_type) {
      queryParams.append('property_type', params.property_type);
    }
    if (params.review_rating) {
      queryParams.append('review_rating', params.review_rating.toString());
    }

    const fullUrl = `/listings/search-promotion/?${queryParams.toString()}`;
    console.log('🌐 API Call URL:', fullUrl);
    console.log('📦 Params received:', params);

    // Use correct endpoint: /listings/search-promotion/ (with 's')
    const response = await apiClient.get(fullUrl);
    
    // Extract data from response - API returns { status, records, totalRecords }
    const properties = response.data?.records || response.data?.data || response.data?.results || [];
    
    // Filter out the current property
    const filteredProperties = params.exclude_id 
      ? properties.filter((p: any) => p.id !== params.exclude_id)
      : properties;
    
    return filteredProperties;
  } catch (error) {
    console.error('Error fetching properties by filters:', error);
    throw error;
  }
};
