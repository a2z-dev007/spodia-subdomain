import { fetchTopRatedHotels } from "@/lib/serverDataFetching";
import { mapApiToStay } from "@/utils/helper";
import TopRatedHotelsClient from "./TopRatedHotelsClient";
import { StayDataType } from "@/data/types";

// Server Component with ISR
export default async function TopRatedHotelsSSR() {
  let hotels: StayDataType[] = [];
  let error: string | null = null;

  try {
    const response: any = await fetchTopRatedHotels();
    // API returns: { status: "success", records: [...], totalRecords: 16 }
    const apiData = response?.records || [];
    hotels = apiData.map(mapApiToStay);
    
    // Sort by reviewStart (rating) descending and take top 8
    hotels = hotels
      .slice()
      .sort((a: StayDataType, b: StayDataType) => b.reviewStart - a.reviewStart)
      .slice(0, 8);
    
    console.log('TopRatedHotels SSR - Fetched hotels:', hotels.length);
  } catch (err) {
    console.error('Error fetching top rated hotels:', err);
    error = 'Failed to load top rated hotels';
  }

  return <TopRatedHotelsClient initialHotels={hotels} initialError={error} />;
}
