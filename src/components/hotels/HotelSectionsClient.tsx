"use client";

import { useEffect, useState } from "react";
import { HotelSection, HotelSectionItem } from "./HotelSection";
import {
  FooterApiResponse,
  formatCityRecordsForHotels,
  formatCityRecordsForHomestays,
  formatStateRecordsForHotels,
  formatStateRecordsForResorts
} from "@/services/footerService";

export function HotelSectionsClient({ footerData }: { footerData?: FooterApiResponse }) {
  const [sections, setSections] = useState<{
    hotelInCities: HotelSectionItem[];
    homeStayInCities: HotelSectionItem[];
    hotelsInStates: HotelSectionItem[];
    resortsInStates: HotelSectionItem[];
  }>({
    hotelInCities: [],
    homeStayInCities: [],
    hotelsInStates: [],
    resortsInStates: [],
  });
  const [loading, setLoading] = useState(!footerData);

  useEffect(() => {
    const processData = (data: FooterApiResponse) => {
      const hotelInCitiesItems = formatCityRecordsForHotels(data.data.best_records || []);
      const homeStayRecords = data.data.home_stay_records || [];
      const nearCityRecords = data.data.near_city_records || [];

      const homeStayInCitiesItems = formatCityRecordsForHomestays(
        homeStayRecords.length > 0
          ? homeStayRecords
          : nearCityRecords
      );
      const hotelsInStatesItems = formatStateRecordsForHotels(data.data.state_resorts_records || []);
      const resortsInStatesItems = formatStateRecordsForResorts(data.data.state_resorts_records || []);

      setSections({
        hotelInCities: hotelInCitiesItems,
        homeStayInCities: homeStayInCitiesItems,
        hotelsInStates: hotelsInStatesItems,
        resortsInStates: resortsInStatesItems,
      });
    };

    if (footerData) {
      processData(footerData);
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const { getFooter } = await import('@/services/api');
          const response = await getFooter();
          processData(response.data);
        } catch (error) {
          console.error("Failed to fetch footer data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [footerData]);

  if (loading) {
    return (
      <div className="py-8 sm:py-12 lg:py-16 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
                <div className="grid grid-cols-6 gap-4">
                  {[...Array(30)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-2">
        <HotelSection
          title="HOTELS IN CITIES"
          items={sections.hotelInCities}
        />

        <HotelSection
          title="HOME STAY IN CITIES"
          items={sections.homeStayInCities}
        />

        <HotelSection
          title="HOTELS IN STATES"
          items={sections.hotelsInStates}
        />

        <HotelSection
          title="RESORTS IN STATES"
          items={sections.resortsInStates}
        />
      </div>
    </div>
  );
}
