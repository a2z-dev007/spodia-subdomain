import { fetchPopularHotels } from "@/lib/serverDataFetching";
import { mapApiToStay } from "@/utils/helper";
import SectionGridFeaturePlacesClient from "./SectionGridFeaturePlacesClient";
import { StayDataType } from "@/data/types";

// Server Component with ISR
export default async function SectionGridFeaturePlacesSSR() {
  let stays: StayDataType[] = [];
  let error: string | null = null;

  try {
    const response: any = await fetchPopularHotels();
    // API returns: { status: "success", records: [...], totalRecords: X }
    const apiData = response?.records || [];
    stays = apiData.map(mapApiToStay);
    
    console.log('Popular Hotels SSR - Fetched hotels:', stays.length);
  } catch (err) {
    console.error('Error fetching popular hotels:', err);
    error = 'Failed to load popular hotels';
  }

  return <SectionGridFeaturePlacesClient initialStays={stays} initialError={error} />;
}
