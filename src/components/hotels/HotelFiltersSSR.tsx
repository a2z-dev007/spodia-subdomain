import { BASE_URL } from "@/lib/api/apiClient";
import HotelFiltersClient from "./HotelFiltersClient";

interface Amenity {
  id: number;
  name: string;
  name_hindi: string;
  parent: string | null;
  amenities_tags: string[];
  image: string;
  created: string;
}

interface AmenitiesResponse {
  totalRecords: number;
  status: string;
  records: Amenity[];
}

async function fetchAmenities(): Promise<AmenitiesResponse> {
  try {
    const response = await fetch(`${BASE_URL}/amenities/`, {
      next: {
        revalidate: 21600, // 6 hours
        tags: ['amenities'],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return { totalRecords: 0, status: 'error', records: [] };
  }
}

export default async function HotelFiltersSSR() {
  const amenitiesData = await fetchAmenities();

  return <HotelFiltersClient initialAmenities={amenitiesData.records} />;
}
