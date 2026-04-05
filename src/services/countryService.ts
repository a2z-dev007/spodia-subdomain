import countryInData from '@/data/jsons/country-in.json';

export interface CountryPageData {
  country: string;
  currency: string;
  locale: string;
  data: {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage: string;
      trustBadges: string[];
    };
    topCities: Array<{
      id: string;
      name: string;
      image: string;
      startingPrice: number;
      currency: string;
      tags: string[];
      slug: string;
    }>;
    collections: Array<{
      id: string;
      title: string;
      type: string;
      image: string;
      description: string;
      cta: string;
    }>;
    whySpodia: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    hotelChains: Array<{
      name: string;
      logo: string;
      slug: string;
      propertyCount: number;
    }>;
    blogs: Array<{
      id: string;
      title: string;
      slug: string;
      image: string;
      excerpt: string;
      readTime: string;
      publishedDate: string;
    }>;
    ecosystem: {
      spas: Array<{
        id: string;
        name: string;
        location: string;
        image: string;
        startingPrice: number;
        currency: string;
        rating: number;
        reviewCount: number;
        specialties: string[];
        slug: string;
      }>;
      restaurants: Array<{
        id: string;
        name: string;
        location: string;
        image: string;
        cuisine: string;
        type: string;
        michelinStars: number;
        awards: string[];
        priceRange: string;
        slug: string;
      }>;
      venues: Array<{
        id: string;
        name: string;
        location: string;
        image: string;
        type: string;
        capacity: number;
        startingPrice: number;
        currency: string;
        features: string[];
        slug: string;
      }>;
    };
    deals: Array<{
      id: string;
      title: string;
      discount: number;
      discountType: 'percentage' | 'fixed';
      currency?: string;
      validFrom: string;
      validTill: string;
      description: string;
      cta: string;
      imageUrl: string;
      terms: string;
    }>;
    seoSections: {
      nearbyCities: Array<{ name: string; slug: string }>;
      bestHotels: Array<{ name: string; slug: string; city: string }>;
      categories: string[];
    };
    footer: {
      columns: Array<{
        title: string;
        links: Array<{ label: string; slug: string }>;
      }>;
      newsletter: {
        title: string;
        description: string;
        offer: string;
        placeholder: string;
      };
      socialLinks: {
        facebook: string;
        instagram: string;
        twitter: string;
        youtube: string;
      };
      contactInfo: {
        phone: string;
        email: string;
        address: string;
      };
    };
  };
}

/**
 * Mock API service to fetch country page data
 * In production, this will be replaced with actual API calls
 */
export async function getCountryData(countryCode: string): Promise<CountryPageData> {
  // Simulate API delay for realistic loading states
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return country-specific data (extend for other countries later)
  const dataMap: Record<string, CountryPageData> = {
    in: countryInData as unknown as CountryPageData,
    // Add more countries as needed:
    // ae: countryAeData,
    // th: countryThData,
  };

  return dataMap[countryCode] || (countryInData as unknown as CountryPageData);
}

/**
 * Helper function to get country name from country code
 */
export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    in: 'India',
    ae: 'United Arab Emirates',
    th: 'Thailand',
    us: 'United States',
    gb: 'United Kingdom',
  };

  return countryNames[countryCode.toLowerCase()] || countryCode.toUpperCase();
}
