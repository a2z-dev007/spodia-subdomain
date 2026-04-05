import stateMhInData from '@/data/jsons/state-mh-in.json';
import cityMumbaiInData from '@/data/jsons/city-mumbai-in.json';
import locationColabaInData from '@/data/jsons/location-colaba-in.json';

/**
 * Mock service to fetch enriched metadata for State, City, and Location entities.
 * Following the Spodia PRD requirements for editorial content.
 */

export interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    trustBadges: string[];
  };
  topItems?: Array<{
    id: string;
    name: string;
    image: string;
    startingPrice: number;
    currency: string;
    tags: string[];
    slug: string;
  }>;
  featuredProperties: Array<{
    id: string;
    name: string;
    location: string;
    price: number;
    currency: string;
    rating: number;
    reviews: number;
    image: string;
    tags: string[];
    cta: string;
  }>;
  whySpodia: Array<{
    title: string;
    icon?: string;
  }>;
  hotelChains: Array<{
    name: string;
    slug: string;
    logo?: string;
  }>;
  ecosystem: {
    spas: Array<{ name: string; price: number; image?: string }>;
    venues: Array<{ name: string; capacity: number; image?: string }>;
    restaurants: Array<{ name: string; location: string; image?: string }>;
  };
  deals: Array<{
    title: string;
    validTill: string;
    urgencyTag?: string;
    discount?: string;
  }>;
  seoSections: {
    links: Array<{ title: string; items: string[] }>;
  };
}

export async function getEntityLandingData(type: 'state' | 'city' | 'location', slug: string): Promise<LandingPageData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const dataMap: Record<string, any> = {
    'state-maharashtra': stateMhInData,
    'city-mumbai': cityMumbaiInData,
    'location-colaba': locationColabaInData,
  };

  const key = `${type}-${slug.toLowerCase()}`;
  const data = dataMap[key] || (type === 'state' ? stateMhInData : type === 'city' ? cityMumbaiInData : locationColabaInData);

  return data as LandingPageData;
}
