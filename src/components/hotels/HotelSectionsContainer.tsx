import { HotelSection } from "./HotelSection";
import { 
  formatCityRecordsForHotels, 
  formatCityRecordsForHomestays,
  formatStateRecordsForHotels,
  formatStateRecordsForResorts,
  FooterApiResponse
} from "@/services/footerService";
import { fetchFooterDataServer } from "@/lib/serverDataFetching";

export async function HotelSectionsContainer() {
  let footerData: FooterApiResponse | null = null;
  
  try {
    const data = await fetchFooterDataServer();
    footerData = data as FooterApiResponse;
  } catch (error) {
    console.error("Failed to fetch footer data:", error);
    // Return empty sections if API fails
    return (
      <div className="py-8 sm:py-12 lg:py-16 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <HotelSection title="HOTELS IN CITIES" items={[]} />
          <HotelSection title="HOME STAY IN CITIES" items={[]} />
          <HotelSection title="HOTELS IN STATES" items={[]} />
          <HotelSection title="RESORTS IN STATES" items={[]} />
        </div>
      </div>
    );
  }

  // Format data for each section
  // Use best_records for Hotels in Cities (has good data)
  const hotelInCitiesItems = formatCityRecordsForHotels(footerData.data.best_records || []);
  
  // Use home_stay_records for Home Stay in Cities (currently empty, will show when data available)
  const homeStayInCitiesItems = formatCityRecordsForHomestays(
    (footerData.data.home_stay_records && footerData.data.home_stay_records.length > 0)
      ? footerData.data.home_stay_records 
      : (footerData.data.near_city_records || []) // Fallback to near_city_records
  );
  
  // Use state_resorts_records for Hotels in States
  const hotelsInStatesItems = formatStateRecordsForHotels(footerData.data.state_resorts_records || []);
  
  // Use state_resorts_records for Resorts in States
  const resortsInStatesItems = formatStateRecordsForResorts(footerData.data.state_resorts_records || []);

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-2">
        <HotelSection 
          title="HOTELS IN CITIES" 
          items={hotelInCitiesItems} 
        />
        
        <HotelSection 
          title="HOME STAY IN CITIES" 
          items={homeStayInCitiesItems} 
        />
        
        <HotelSection 
          title="HOTELS IN STATES" 
          items={hotelsInStatesItems} 
        />
        
        <HotelSection 
          title="RESORTS IN STATES" 
          items={resortsInStatesItems} 
        />
      </div>
    </div>
  );
}
