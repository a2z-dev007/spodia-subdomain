"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, Wifi, Bed, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { getPropertiesByFilters } from "@/services/similarPropertiesService";
import Link from "next/link";
import Image from "next/image";

interface SimilarPropertiesProps {
  currentHotel?: {
    id: number;
    property_type?: string;
    star_category?: number;
    review_rating?: number;
    city_id?: number;
  };
}

interface HotelCardData {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: string;
  amenities: {
    wifi: boolean;
    bed: string;
    area: string;
  };
  originalPrice: number;
  discountedPrice: number;
  discount: string;
  duration: string;
  imageUrl: string;
  href: string;
}

// Fallback images
const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
];

function DiscountBadge({ discount }: { discount?: string }) {
  if (!discount) return null;

  return (
    <div className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
      {discount}
    </div>
  );
}

function HotelImage({
  imageUrl,
  discount,
}: {
  imageUrl: string;
  discount?: string;
}) {
  return (
    <div className="relative h-[160px] w-full rounded-t-[12px] overflow-hidden">
      <Image
        src={imageUrl}
        alt="Hotel"
        fill
        className="object-cover"
        sizes="280px"
      />
      <div className="absolute top-0 right-0 p-[10px]">
        <DiscountBadge discount={discount} />
      </div>
    </div>
  );
}

function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: string;
}) {
  return (
    <div className="flex gap-1 items-center">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs text-gray-600">
        {rating} ({reviewCount})
      </span>
    </div>
  );
}

function AmenityItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  if (!text) return null;

  return (
    <div className="flex gap-1 items-center">
      {icon}
      <span className="text-xs text-gray-600">{text}</span>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelCardData }) {
  return (
    <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden w-[280px] h-full shrink-0 hover:shadow-lg transition-all duration-300 hover:border-orange-300 flex flex-col">
      <Link href={hotel.href} className="flex-shrink-0">
        <HotelImage imageUrl={hotel.imageUrl} discount={hotel.discount} />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={hotel.href} className="flex-grow">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-base mb-1.5 line-clamp-1 hover:text-orange-600 transition-colors">
              {hotel.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-1 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {hotel.location}
            </p>
          </div>

          {hotel.rating > 0 && (
            <div className="mb-3">
              <StarRating
                rating={hotel.rating}
                reviewCount={hotel.reviewCount}
              />
            </div>
          )}
        </Link>

        <div className="mt-auto pt-3 border-t border-gray-100">
          {hotel.discountedPrice > 0 && (
            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-0.5">
                {hotel.originalPrice > hotel.discountedPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{hotel.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xl font-bold text-gray-900">
                  ₹{hotel.discountedPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          )}

          <Link href={hotel.href} className="block">
            <button className="w-full gradient-btn text-white hover:bg-orange-500 text-dark font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SimilarProperties({ currentHotel }: SimilarPropertiesProps) {
  const [similarHotels, setSimilarHotels] = useState<HotelCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!currentHotel?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Debug: Log what we're sending
        console.log("🔍 SimilarProperties - Fetching with params:", {
          star_category: currentHotel.star_category,
          city_id: currentHotel.city_id,
          property_type: currentHotel.property_type,
          review_rating: currentHotel.review_rating,
          exclude_id: currentHotel.id,
          limit: 10,
        });

        const properties = await getPropertiesByFilters({
          star_category: currentHotel.star_category,
          city_id: currentHotel.city_id,
          property_type: currentHotel.property_type,
          review_rating: currentHotel.review_rating,
          exclude_id: currentHotel.id,
          limit: 10,
        });

        // Map API data to card format using exact data structure
        const mappedProperties: HotelCardData[] = properties.map(
          (hotel: any, index: number) => {
            // Get image from images array (cover_photo or first image)
            let imageUrl = "";
            if (
              hotel.images &&
              Array.isArray(hotel.images) &&
              hotel.images.length > 0
            ) {
              const coverPhoto = hotel.images.find(
                (img: any) => img.cover_photo,
              );
              imageUrl = coverPhoto?.file || hotel.images[0]?.file || "";
            }
            if (!imageUrl || imageUrl.trim() === "") {
              imageUrl = fallbackImages[index % fallbackImages.length];
            }

            const hotelSlug =
              hotel.slug ||
              `${hotel.name}-${hotel.city_name}`
                .replace(/\s+/g, "-")
                .toLowerCase();

            // Get room details for bed type and area
            let bedType = "1 King size bed";
            let roomArea = "455 sq ft";
            if (
              hotel.rooms &&
              Array.isArray(hotel.rooms) &&
              hotel.rooms.length > 0
            ) {
              const firstRoom = hotel.rooms[0];
              bedType =
                firstRoom.bed_type ||
                `${firstRoom.no_of_beds || 1} bed${firstRoom.no_of_beds > 1 ? "s" : ""}`;
              roomArea = firstRoom.dimensions || roomArea;
            }

            // Check for WiFi in facilities
            const hasWifi =
              hotel.facilitiesDetails?.some(
                (f: any) =>
                  f.name?.toLowerCase().includes("wifi") ||
                  f.name?.toLowerCase().includes("wi-fi"),
              ) || false;

            // Use sbr_rate for pricing
            const basePrice = hotel.sbr_rate || 0;

            // Calculate discount if there are promotions
            let discountPercent = 0;
            let originalPrice = basePrice;

            // Check for active promotions
            if (hotel.promotion_details) {
              const allPromotions = [
                ...(hotel.promotion_details.basic_promotion || []),
                ...(hotel.promotion_details.early_bird_promotion || []),
                ...(hotel.promotion_details.last_minute_promotion || []),
                ...(hotel.promotion_details.long_stay_promotion || []),
                ...(hotel.promotion_details.advance_purchase_promotion || []),
                ...(hotel.promotion_details.hotel_offer_promotion || []),
              ];

              // Get the best active promotion
              const activePromotion = allPromotions.find(
                (p: any) => p.status === true,
              );
              if (activePromotion && activePromotion.rate_or_percentage) {
                discountPercent = activePromotion.rate_or_percentage;
                if (activePromotion.type_of_offer === "percentage") {
                  originalPrice = Math.round(
                    basePrice / (1 - discountPercent / 100),
                  );
                }
              }
            }

            return {
              id: hotel.id,
              name: hotel.name || "Hotel",
              location:
                `${hotel.city_name || ""}${hotel.state_name ? `, ${hotel.state_name}` : ""}`.trim() ||
                "Location",
              rating: hotel.review_rating || 0,
              reviewCount: hotel.review_rating_count
                ? `${hotel.review_rating_count} Review${hotel.review_rating_count !== 1 ? "s" : ""}`
                : "0 Reviews",
              amenities: {
                wifi: hasWifi,
                bed: bedType,
                area: roomArea,
              },
              originalPrice: originalPrice,
              discountedPrice: basePrice,
              discount: discountPercent > 0 ? `${discountPercent}% off` : "",
              duration:
                basePrice > 0
                  ? `₹${(basePrice * 3).toLocaleString()} Total for 3 Nights`
                  : "",
              imageUrl: imageUrl,
              href: `/hotels/${hotelSlug}`,
            };
          },
        );

        setSimilarHotels(mappedProperties);
      } catch (error) {
        console.error("Error fetching similar properties:", error);
        setSimilarHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHotel?.id, currentHotel?.star_category, currentHotel?.city_id]);

  if (loading) {
    return (
      <div className="bg-white relative rounded-[20px] w-full max-w-full mb-12">
        <div className="flex flex-col justify-center relative w-full">
          <div className="box-border content-stretch flex flex-col gap-12 items-start justify-center overflow-clip p-[40px] relative w-full">
            <div className="flex flex-col font-bold leading-[0] w-full text-[28px] text-center text-gray-900">
              <p className="leading-[normal] text-left">
                Similar properties recommended for you
              </p>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-[12px] w-[280px] h-[400px] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (similarHotels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white relative rounded-[20px] w-full max-w-full mb-12 overflow-hidden">
      <div className="flex flex-col justify-center relative w-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-start justify-center p-[40px] relative w-full">
          <div className="flex flex-col font-bold leading-[0] w-full text-[28px] text-center text-gray-900">
            <p className="leading-[normal] text-left">
              Similar properties recommended for you
            </p>
          </div>

          <div className="relative w-full overflow-visible">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              grabCursor={true}
              watchSlidesProgress={true}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="!pb-8"
            >
              {similarHotels.map((hotel) => (
                <SwiperSlide
                  key={hotel.id}
                  className="!w-[280px] !flex-shrink-0 !h-auto"
                >
                  <HotelCard hotel={hotel} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              type="button"
              className="swiper-button-prev-custom absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 lg:left-4 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>

            <button
              type="button"
              className="swiper-button-next-custom absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 lg:right-4 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[20px]"
      />
    </div>
  );
}
