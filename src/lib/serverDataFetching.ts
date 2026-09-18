// Server-side data fetching utilities with caching
import { BASE_URL, getV1Prefix } from "@/lib/api/apiClient";

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fetch with Next.js caching options
export async function fetchWithCache<T>(
  url: string,
  options: {
    revalidate?: number | false;
    tags?: string[];
  } = {}
): Promise<T> {
  const { revalidate = 3600, tags = [] } = options;

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        tags,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// Fetch best deals with ISR (1 hour revalidation)
export async function fetchBestDeals() {
  const currentDate = getCurrentDate();
  const url = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_best_deals=true&start_date=${currentDate}&end_date=${currentDate}&random=true`;
  
  return fetchWithCache(url, {
    revalidate: 3600, // 1 hour
    tags: ['best-deals'],
  });
}

// Fetch top rated hotels with ISR (1 hour revalidation)
export async function fetchTopRatedHotels() {
  const currentDate = getCurrentDate();
  const url = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_top_rated=true&start_date=${currentDate}&end_date=${currentDate}&random=true`;
  
  return fetchWithCache(url, {
    revalidate: 3600, // 1 hour
    tags: ['top-rated-hotels'],
  });
}

// Fetch footer data with longer cache (6 hours)
export async function fetchFooterDataServer() {
  const url = `${BASE_URL}/footer/`;
  
  return fetchWithCache(url, {
    revalidate: 21600, // 6 hours
    tags: ['footer-data'],
  });
}

// Fetch featured hotels with ISR (1 hour revalidation)
export async function fetchFeaturedHotels(cityId?: number | null) {
  const currentDate = getCurrentDate();
  let url = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=10&show_featured=true&start_date=${currentDate}&end_date=${currentDate}`;
  
  if (cityId) {
    url += `&city=${cityId}`;
  }
  
  return fetchWithCache(url, {
    revalidate: 3600, // 1 hour
    tags: ['featured-hotels'],
  });
}

// Fetch popular hotels with ISR (1 hour revalidation)
export async function fetchPopularHotels() {
  const currentDate = getCurrentDate();
  const url = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_popular=true&start_date=${currentDate}&end_date=${currentDate}&random=true`;
  
  return fetchWithCache(url, {
    revalidate: 3600, // 1 hour
    tags: ['popular-hotels'],
  });
}

// Fetch testimonials with ISR (6 hours revalidation)
export async function fetchTestimonials() {
  const url = `${BASE_URL}/testimonials/?show_homepage=1&random=true`;
  
  return fetchWithCache(url, {
    revalidate: 21600, // 6 hours
    tags: ['testimonials'],
  });
}

// Fetch amenities with long cache (24 hours)
export async function fetchAmenitiesServer() {
  const url = `${BASE_URL}/features-and-facilities/`;
  try {
    const data = await fetchWithCache<any>(url, {
      revalidate: 86400, // 24 hours
      tags: ['amenities'],
    });
    if (data && Array.isArray(data.records)) {
      return data.records;
    }
    if (data && Array.isArray(data.data?.records)) {
      return data.data.records;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch amenities from ${url}:`, error);
    return [];
  }
}

// Fetch search hotels with short cache (2 minutes)
export async function fetchSearchHotelsServer(params: {
  city?: string;
  cityName?: string;
  checkIn?: string;
  checkOut?: string;
  noOfAdult?: number;
  noOfChild?: number;
  childInfo?: string;
  page_number?: number;
  number_of_records?: number;
}) {
  const {
    city,
    cityName,
    checkIn,
    checkOut,
    noOfAdult = 2,
    noOfChild = 0,
    childInfo = '',
    page_number = 1,
    number_of_records = 12,
  } = params;

  let url = `${BASE_URL}${getV1Prefix()}/listings/search-promotion/?page_number=${page_number}&number_of_records=${number_of_records}&sortBy=top_reviewed`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  if (cityName) url += `&cityName=${encodeURIComponent(cityName)}`;
  if (checkIn) url += `&start_date=${encodeURIComponent(checkIn)}`;
  if (checkOut) url += `&end_date=${encodeURIComponent(checkOut)}`;
  if (noOfAdult) url += `&no_of_adult=${noOfAdult}`;
  if (noOfChild) url += `&no_of_child=${noOfChild}`;
  if (childInfo) url += `&childInfo=${encodeURIComponent(childInfo)}`;

  try {
    return await fetchWithCache<any>(url, {
      revalidate: 1800, // 30 minutes cache for search queries
      tags: ['search-hotels'],
    });
  } catch (error) {
    console.error(`Failed to fetch search hotels from ${url}:`, error);
    return null;
  }
}
