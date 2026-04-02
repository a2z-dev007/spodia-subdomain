"use client";

import { Heart, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import BookNowButton from "@/components/ui/BookNowButton";
import Image from "next/image";
import Link from "next/link";
import { useApiData } from "@/hooks/useApiData";
import { StayDataType, AuthorType, TaxonomyType } from "@/data/types";
import { DEMO_STAY_CATEGORIES } from "@/data/taxonomies";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Badge from "@/shared/Badge";
import { generateBadgeColor } from "@/lib/utils";
import { BASE_URL } from "@/lib/api/apiClient";
import { calculatePromotionalPricing } from "@/utils/promotionalPricing";

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate();
const API_URL = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_best_deals=true&start_date=${currentDate}&end_date=${currentDate}`;

// Helper to build AuthorType from API ownerdetails
const buildAuthorFromApi = (owner: any): AuthorType => ({
  id: owner?.id || 0,
  firstName: owner?.first_name || "",
  lastName: owner?.last_name || "",
  displayName: owner?.full_name?.trim() || owner?.username || "Hotel Owner",
  avatar: typeof owner?.profile_image === "string" ? owner.profile_image : "",
  bgImage: undefined,
  email: typeof owner?.email === "string" ? owner.email : undefined,
  count: 0,
  desc: "Hotel owner",
  jobName: "Hotelier",
  href: "/author",
  starRating: undefined,
});

// Helper to build TaxonomyType from API property_type
const buildCategoryFromApi = (
  propertyType: string | undefined,
): TaxonomyType => {
  let cat = DEMO_STAY_CATEGORIES[0];
  if (propertyType) {
    const found = DEMO_STAY_CATEGORIES.find(
      (cat) => cat.name.toLowerCase() === propertyType.toLowerCase(),
    );
    if (found) cat = found;
    else cat = { ...cat, name: propertyType };
  }
  return {
    id: cat.id,
    name: cat.name,
    href: typeof cat.href === "string" ? cat.href : String(cat.href),
    count: typeof cat.count === "number" ? cat.count : undefined,
    thumbnail: typeof cat.thumbnail === "string" ? cat.thumbnail : "",
    desc: typeof cat.desc === "string" ? cat.desc : undefined,
    color: typeof cat.color === "string" ? cat.color : undefined,
    taxonomy: cat.taxonomy,
    listingType: cat.listingType,
  };
};

const mapApiToStay = (item: any): StayDataType => {
  const category = buildCategoryFromApi(item.property_type);
  const author = buildAuthorFromApi(item.ownerdetails);
  const hotelSlug =
    item.slug ||
    `${item.name}-${item.city_name}`.replace(/\s+/g, "-").toLowerCase();
  return {
    id: item.id,
    author,
    city_name: typeof item.city_name === "string" ? item.city_name : "",
    date: typeof item.created === "string" ? item.created : "",
    href: `/hotels/${hotelSlug}`,
    title: typeof item.name === "string" ? item.name : "",
    featuredImage:
      typeof item.images?.find((img: any) => img.cover_photo)?.file === "string"
        ? item.images?.find((img: any) => img.cover_photo)?.file
        : typeof item.images?.[0]?.file === "string"
          ? item.images?.[0]?.file
          : "",
    commentCount:
      typeof item.review_rating_count === "number"
        ? item.review_rating_count
        : 0,
    viewCount: 0,
    address: typeof item.address === "string" ? item.address : "",
    reviewStart:
      typeof item.review_rating === "number" ? item.review_rating : 0,
    reviewCount:
      typeof item.review_rating_count === "number"
        ? item.review_rating_count
        : 0,
    like: !!item.is_favourite,
    galleryImgs: Array.isArray(item.images)
      ? item.images
          .map((img: any) => (typeof img.file === "string" ? img.file : ""))
          .filter(Boolean)
      : [],
    price:
      typeof item.sbr_rate === "number"
        ? `₹${Math.round(item.sbr_rate)}`
        : "₹0",
    listingCategory: category,
    maxGuests: typeof item.no_of_rooms === "number" ? item.no_of_rooms : 2,
    bedrooms: typeof item.no_of_floors === "number" ? item.no_of_floors : 1,
    bathrooms: 1,
    saleOff: null,
    isAds: null,
    map: {
      lat: typeof item.lat === "number" ? item.lat : 0,
      lng: typeof item.lon === "number" ? item.lon : 0,
    },
    // Promotion fields
    has_promotion:
      typeof item.has_promotion === "boolean" ? item.has_promotion : false,
    best_promotion: item.best_promotion || null,
    sbr_rate: typeof item.sbr_rate === "number" ? item.sbr_rate : 0,
  };
};

const PAGE_SIZE = 4;

const BestDeals = () => {
  const {
    data: deals,
    loading,
    error,
  } = useApiData<StayDataType>(API_URL, mapApiToStay);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(deals.length / PAGE_SIZE);
  const pagedDeals = deals.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="py-14 bg-section-color">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="flex items-center justify-between flex-col md:flex-row mb-12">
          <div className="">
            <h2 className=" mb-4 text-align-center md:text-left lg:text-left xl:text-left 2xl:text-left main-section-heading">
              Best Deal Hotels
            </h2>
            <p className="text-gray-600 text-center sm:text-left main-section-subheading mb-4 md:mb-0">
              Quality as judged by customers. Book at the ideal price!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-full border border-gray-300 disabled:opacity-50 [-webkit-tap-highlight-color:transparent]"
              onClick={handlePrev}
              disabled={page === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full border border-gray-300 disabled:opacity-50 [-webkit-tap-highlight-color:transparent]"
              onClick={handleNext}
              disabled={page === totalPages - 1 || totalPages === 0}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
              >
                {/* Image Skeleton */}
                <div className="relative w-full h-44 md:h-auto md:w-56 overflow-hidden bg-gray-100">
                  <Skeleton className="w-full h-full" />
                </div>
                {/* Content Skeleton */}
                <div className="flex-1 p-4 flex flex-col justify-between py-8">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2 mb-2" />

                    <div className="flex items-center justify-between mb-8">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-3 w-3 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mt-2">
                    <div>
                      <Skeleton className="h-6 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : pagedDeals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              No best deals found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagedDeals.map((deal) => {
              // Calculate promotional pricing
              const originalPrice = deal.sbr_rate || 0;
              const promotionData = calculatePromotionalPricing(
                originalPrice,
                deal.has_promotion || false,
                deal.best_promotion || null,
              );

              // Debug: Log rating data
              console.log(
                `Hotel: ${deal.title}, Rating: ${deal.reviewStart}, Review Count: ${deal.reviewCount}`,
              );

              return (
                <Link
                  key={deal.id}
                  href={deal.href}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative w-full h-56 md:h-full md:w-44 lg:w-56 xl:w-64 overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={deal.featuredImage || "/placeholder.svg"}
                      alt={deal.title}
                      fill
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      // sizes="(max-width: 768px) 100vw, 256px"
                    />
                    {/* <button
                    className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10 shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                    }}
                  >
                    <Heart className={`w-4 h-4 ${deal.like ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button> */}

                    {/* Promotion Badge on Image */}
                    {promotionData.hasPromotion && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                        {promotionData.discountText}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-3 lg:p-4 xl:p-5 flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
                    <div>
                      {/* Category Badge */}
                      <div className="flex items-start justify-between mb-2 md:mb-2 lg:mb-3">
                        {deal.listingCategory?.name && (
                          <Badge
                            name={deal?.listingCategory?.name}
                            color={
                              generateBadgeColor(
                                deal?.listingCategory?.name?.toLowerCase(),
                              ) as any
                            }
                          />
                        )}

                        {/* Rating Badge */}
                        {deal.reviewStart > 0 && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                            <span className="text-xs font-bold">
                              {deal.reviewStart.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hotel Name */}
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1.5 md:mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {deal.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-2 md:mb-3">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-1.5 text-orange-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm line-clamp-1">
                          {deal.city_name}
                        </span>
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mt-auto pt-3 md:pt-3 lg:pt-4 border-t border-gray-100">
                      <div className="flex flex-col flex-wrap lg:flex-row items-start lg:items-end justify-between gap-2 md:gap-2 lg:gap-3">
                        <div className="flex flex-col">
                          {promotionData.hasPromotion ? (
                            <>
                              <span className="text-xs md:text-sm text-red-500 line-through font-medium">
                                ₹{promotionData.originalPrice.toLocaleString()}
                              </span>
                              <div className="flex items-baseline gap-0.5 md:gap-1">
                                <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                  ₹
                                  {promotionData.discountedPrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] md:text-xs text-gray-500">
                                  / person
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-baseline gap-0.5 md:gap-1">
                              <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                ₹{Math.round(originalPrice).toLocaleString()}
                              </span>
                              <span className="text-[10px] md:text-xs text-gray-500">
                                / person
                              </span>
                            </div>
                          )}
                        </div>

                        <BookNowButton
                          size="md"
                          variant="gradient"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle book now functionality here
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestDeals;
