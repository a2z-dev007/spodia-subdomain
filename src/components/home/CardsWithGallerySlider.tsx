import React, { FC, useMemo } from "react";
import { StayDataType } from "@/data/types";
import StayCard from "./cards/StayCard";
import { useApiData } from "@/hooks/useApiData";
import { useCityId } from "@/hooks/useCityId";
import { BASE_URL } from "@/lib/api/apiClient";
import { mapApiToStay } from "@/utils/helper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardsWithGallerySliderProps {
  selectedCity?: string | null;
}

// Custom Shimmer Card Component
const ShimmerCard = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    {/* Image placeholder */}
    <div className="relative h-48 bg-gray-200">
      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>

    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

      {/* Location */}
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>

      {/* Rating and reviews */}
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>

      {/* Price */}
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>

      {/* Features */}
      <div className="flex space-x-2">
        <div className="h-3 bg-gray-200 rounded w-8"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  </div>
);

const CardsWithGallerySlider: FC<CardsWithGallerySliderProps> = ({
  selectedCity,
}) => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch city ID when city is selected
  const { cityId, loading: cityIdLoading } = useCityId(selectedCity);

  // Build API URL based on city ID
  const apiUrl = useMemo(() => {
    const currentDate = getCurrentDate();
    const baseUrl = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=10&show_featured=true&start_date=${currentDate}&end_date=${currentDate}&random=true`;

    if (cityId) {
      const url = `${baseUrl}&city=${cityId}`;
      console.log("API URL with city ID filter:", url);
      console.log("Selected city:", selectedCity, "City ID:", cityId);
      return url;
    }

    console.log("API URL without filter:", baseUrl);
    return baseUrl;
  }, [cityId, selectedCity]);

  const {
    data: allStays,
    loading: dataLoading,
    error,
  } = useApiData<StayDataType>(apiUrl, mapApiToStay);

  // Combined loading state
  const loading = cityIdLoading || dataLoading;

  // Use all stays directly (no client-side filtering needed since API handles it)
  const stays = allStays;

  // Limit to 2 rows: 8 items on xl, 6 on lg, 4 on md, 2 on sm
  const displayedStays = useMemo(() => stays.slice(0, 8), [stays]);
  const hasMore = stays.length > 8;

  // Debug: Log the selected city and data
  console.log("Selected city:", selectedCity);
  console.log("City ID:", cityId);
  console.log("Total stays:", allStays.length);

  if (loading) {
    return (
      <section className="pt-2 pb-10 ">
        <div className="nc-SectionGridFeaturePlaces relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <ShimmerCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative">
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No featured places found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-4 pb-14 ">
      <div className="nc-SectionGridFeaturePlaces relative max-w-7xl mx-auto px-4 lg:px-0">
        {/* Header with filter indicator */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-1">
            {/* {selectedCity ? `Hotels in ${selectedCity}` : "Featured Hotels"} */}
          </h2>
          {selectedCity && (
            <p className="text-xs sm:text-sm text-gray-500">
              Showing hotels in {selectedCity}
            </p>
          )}
        </div>

        <div
          className={`grid gap-3 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full`}
        >
          {displayedStays.map((stay) => (
            <div key={stay.id} className="h-full">
              <StayCard data={stay} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Link
              href="/search-results"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#FF9530] bg-white px-8 py-2.5 text-sm sm:text-base font-semibold text-[#FF9530] transition-colors duration-300 hover:bg-orange-50 hover:border-[#FF8000] hover:text-[#FF8000] active:scale-[0.98]"
            >
              View More
              <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardsWithGallerySlider;
