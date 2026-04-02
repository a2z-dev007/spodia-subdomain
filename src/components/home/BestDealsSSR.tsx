import { fetchBestDeals } from "@/lib/serverDataFetching";
import { mapApiToStay } from "@/utils/helper";
import BestDealsClient from "./BestDealsClient";
import { StayDataType } from "@/data/types";

// Server Component with ISR
export default async function BestDealsSSR() {
  let deals: StayDataType[] = [];
  let error: string | null = null;

  try {
    const response: any = await fetchBestDeals();
    // API returns: { status: "success", records: [...], totalRecords: 16 }
    const apiData = response?.records || [];
    deals = apiData.map(mapApiToStay);
    
    console.log('BestDeals SSR - Fetched deals:', deals.length);
  } catch (err) {
    console.error('Error fetching best deals:', err);
    error = 'Failed to load best deals';
  }

  return <BestDealsClient initialDeals={deals} initialError={error} />;
}
