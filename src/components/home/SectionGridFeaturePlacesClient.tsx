"use client";
import React, { FC, ReactNode, useState, useMemo } from "react";
import HeaderFilter from "./cards/HeaderFilter";
import StayCard2 from "./cards/StayCard2";
import { StayDataType } from "@/data/types";
import { useRouter } from "next/navigation";
import ViewMoreBtn from "../ui/ViewMoreBtn";
import ShimmerCardLoader from "../loaders/ShimmerCardLoader";
import { LINKS } from "@/utils/const";

export interface SectionGridFeaturePlacesClientProps {
  initialStays: StayDataType[];
  initialError: string | null;
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlacesClient: FC<
  SectionGridFeaturePlacesClientProps
> = ({
  initialStays,
  initialError,
  gridClass = "",
  heading = "Popular Nearby",
  subHeading = "Quality as judged by customers. Book at the ideal price!",
  headingIsCenter,
  tabs,
  cardType = "card2",
}) => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique property types from the stays
  const propertyTypes = useMemo(() => {
    if (!initialStays || initialStays.length === 0) return ["All"];

    const types = initialStays
      .map((stay) => stay.listingCategory?.name)
      .filter((type): type is string => !!type && type.trim() !== "");

    // Normalize types to remove duplicates
    const normalizedTypes = types.map((type) => {
      const lower = type.toLowerCase();
      if (lower === "resort") return "Resorts";
      if (lower === "hotel") return "Hotels";
      if (lower === "villa") return "Villas";
      if (lower === "cottage") return "Cottages";
      return type;
    });

    const uniqueTypes = Array.from(new Set(normalizedTypes));
    return ["All", ...uniqueTypes];
  }, [initialStays]);

  // Filter stays based on selected property type
  const filteredStays = useMemo(() => {
    if (activeFilter === "All") return initialStays;

    return initialStays.filter((stay) => {
      const stayType = stay.listingCategory?.name;
      if (!stayType) return false;

      const normalizedStayType = stayType.toLowerCase();
      const normalizedFilter = activeFilter.toLowerCase();

      return (
        normalizedStayType === normalizedFilter ||
        normalizedStayType === normalizedFilter.replace(/s$/, "") ||
        normalizedStayType + "s" === normalizedFilter
      );
    });
  }, [initialStays, activeFilter]);

  if (initialError) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <HeaderFilter
          tabActive={tabs?.[0] || "All"}
          subHeading={subHeading}
          tabs={tabs || []}
          heading={heading}
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500 dark:text-red-400">{initialError}</p>
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

        <div
          className={`grid gap-4 sm:gap-8 mt-8 ${gridClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
        >
          {filteredStays.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">
                No properties found for this filter.
              </p>
            </div>
          ) : (
            filteredStays.map((stay) => <StayCard2 key={stay.id} data={stay} />)
          )}
        </div>
      </div>
      {filteredStays?.length > 0 && (
        <div className="flex mt-16 justify-center items-center">
          <ViewMoreBtn
            onClick={() =>
              router.push(`${LINKS.SEARCH_RESULTS}?show_popular=true`)
            }
            text="View More"
          />
        </div>
      )}
    </section>
  );
};

export default SectionGridFeaturePlacesClient;
