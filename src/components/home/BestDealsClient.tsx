"use client";

import { Heart, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import BookNowButton from "@/components/ui/BookNowButton";
import Image from "next/image";
import Link from "next/link";
import { StayDataType } from "@/data/types";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Badge from "@/shared/Badge";
import { generateBadgeColor } from "@/lib/utils";
import { calculatePromotionalPricing } from "@/utils/promotionalPricing";

const PAGE_SIZE = 4;

interface BestDealsClientProps {
  initialDeals: StayDataType[];
  initialError: string | null;
}

const BestDealsClient = ({
  initialDeals,
  initialError,
}: BestDealsClientProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(initialDeals.length / PAGE_SIZE);
  const pagedDeals = initialDeals.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="py-14 bg-section-color">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="flex items-center justify-between flex-col md:flex-row mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Best Deal Hotels
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Quality as judged by customers. Book at the ideal price!
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4">
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
        {initialError ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500 dark:text-red-400">{initialError}</p>
          </div>
        ) : pagedDeals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              No best deals found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {pagedDeals.map((deal) => {
              // Calculate promotional pricing
              const originalPrice = deal.sbr_rate || 0;
              const promotionData = calculatePromotionalPricing(
                originalPrice,
                deal.has_promotion || false,
                deal.best_promotion || null,
              );

              return (
                <Link
                  key={deal.id}
                  href={deal.href}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative w-full h-32 sm:h-56 md:h-full md:w-44 lg:w-56 xl:w-64 overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={deal.featuredImage || "/placeholder.svg"}
                      alt={deal.title}
                      fill
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Promotion Badge on Image */}
                    {promotionData.hasPromotion && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                        {promotionData.discountText}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-2 sm:p-4 md:p-3 lg:p-4 xl:p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[200px] md:min-h-[220px]">
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
                      <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2 line-clamp-1 sm:line-clamp-2 group-hover:text-orange-600 transition-colors">
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
                              <span className="text-[10px] sm:text-sm text-red-500 line-through font-medium">
                                ₹{promotionData.originalPrice.toLocaleString()}
                              </span>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">
                                  ₹
                                  {promotionData.discountedPrice.toLocaleString()}
                                </span>
                                <span className="text-[8px] sm:text-xs text-gray-500">
                                  / person
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">
                                ₹{Math.round(originalPrice).toLocaleString()}
                              </span>
                              <span className="text-[8px] sm:text-xs text-gray-500">
                                / person
                              </span>
                            </div>
                          )}
                        </div>

                        <BookNowButton
                          variant="gradient"
                          className="w-full sm:w-auto text-[10px] sm:text-sm h-7 sm:h-9 px-2 sm:px-5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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

export default BestDealsClient;
