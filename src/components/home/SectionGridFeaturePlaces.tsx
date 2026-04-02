"use client";
import React, { FC, ReactNode, useState, useMemo } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeaderFilter from "./cards/HeaderFilter";
import StayCard from "./cards/StayCard";
import StayCard2 from "./cards/StayCard2";
import { StayDataType, AuthorType, TaxonomyType } from "@/data/types";
import { DEMO_STAY_CATEGORIES } from "@/data/taxonomies";
import { useApiData } from '@/hooks/useApiData';
import { ShimmerPostList } from "react-shimmer-effects";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ViewMoreBtn from "../ui/ViewMoreBtn";
import ShimmerCardLoader from "../loaders/ShimmerCardLoader";
import { BASE_URL } from "@/lib/api/apiClient";
import {mapApiToStay} from "@/utils/helper";
import { LINKS } from "@/utils/const";

export interface SectionGridFeaturePlacesProps {
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate();
const API_URL = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_popular=true&start_date=${currentDate}&end_date=${currentDate}`;

// Helper to ensure image fields are always strings
const toUrl = (img: any) =>
  typeof img === "string"
    ? img
    : img?.src
      ? img.src
      : "https://via.placeholder.com/300";



const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  gridClass = "",
  heading = "Popular Nearby",
  subHeading = "Quality as judged by customers. Book at the ideal price!",
  headingIsCenter,
  tabs,
  cardType = "card2",
}) => {
  const { data: stays, loading, error } = useApiData<StayDataType>(API_URL, mapApiToStay);
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique property types from the API response
  const propertyTypes = useMemo(() => {
    if (!stays || stays.length === 0) return ["All"];
    
    const types = stays
      .map(stay => stay.listingCategory?.name)
      .filter((type): type is string => !!type && type.trim() !== "");
    
    // Normalize types to remove duplicates (e.g., "Resort" and "Resorts" -> "Resorts")
    const normalizedTypes = types.map(type => {
      const lower = type.toLowerCase();
      // Normalize singular to plural for common types
      if (lower === 'resort') return 'Resorts';
      if (lower === 'hotel') return 'Hotels';
      if (lower === 'villa') return 'Villas';
      if (lower === 'cottage') return 'Cottages';
      return type;
    });
    
    const uniqueTypes = Array.from(new Set(normalizedTypes));
    return ["All", ...uniqueTypes];
  }, [stays]);

  // Filter stays based on selected property type
  const filteredStays = useMemo(() => {
    if (activeFilter === "All") return stays;
    
    // Normalize the filter for comparison
    return stays.filter(stay => {
      const stayType = stay.listingCategory?.name;
      if (!stayType) return false;
      
      const normalizedStayType = stayType.toLowerCase();
      const normalizedFilter = activeFilter.toLowerCase();
      
      // Match both singular and plural forms
      return normalizedStayType === normalizedFilter || 
             normalizedStayType === normalizedFilter.replace(/s$/, '') ||
             normalizedStayType + 's' === normalizedFilter;
    });
  }, [stays, activeFilter]);


  if (error) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <HeaderFilter
          tabActive={tabs?.[0] || "All"}
          subHeading={subHeading}
          tabs={tabs || []}
          heading={heading}
        />

        <div className="flex items-center justify-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 bg-section-color">
      <div className="nc-SectionGridFeaturePlaces relative max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <HeaderFilter
          tabActive={activeFilter}
          subHeading={subHeading}
          tabs={propertyTypes}
          heading={heading}
          onClickTab={setActiveFilter}
        />


        <div className={`grid gap-8 mt-8 ${gridClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>

          {loading ? (
            <div className="col-span-full">
              <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <ShimmerCardLoader key={index} />
                ))}
              </div>
            </div>
          ) : filteredStays.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">No properties found for this filter.</p>
            </div>
          ) : (
            filteredStays.map((stay) => (
              <StayCard2 key={stay.id} data={stay} />
            ))
          )}
        </div>
      </div>
      {
        filteredStays?.length >0 &&  <div className="flex mt-16 justify-center items-center">
        <ViewMoreBtn onClick={() => router.push(`${LINKS.SEARCH_RESULTS}?show_popular=true`)} text="View More" />

      </div>
      }
     
    </section>
  );
};

export default SectionGridFeaturePlaces;
