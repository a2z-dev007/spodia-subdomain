"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  MapPin,
  Grid3X3,
  LayoutList,
  Grid2X2,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Phone,
  Eye,
  Users,
  Bed,
  Building,
  Check,
  ChevronDown,
  Home,
  FlagTriangleLeft,
  TriangleRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BiSquare } from "react-icons/bi";
import { useSwipeable } from "react-swipeable";
import { HotelType } from "@/types/HotelType";
import RatingStars from "@/components/Rating/RatingStars";
import { GiMorgueFeet } from "react-icons/gi";
import { useAppDispatch } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setSearchFilters } from "@/lib/features/hotels/hotelSlice";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import {
  HotelCardListShimmer,
  HotelCardGridShimmer,
} from "@/components/ui/ShimmerLoader";
import PromotionalPricing from "@/components/hotels/PromotionalPricing";
import { calculatePromotionalPricing } from "@/utils/promotionalPricing";
import { getRatingLabel } from "@/lib/utils";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";
import GroupEnquiryModal from "@/components/hotels/hotel-details/GroupEnquiryModal";

interface HotelResultsProps {
  hotels: HotelType[];
  totalHotels: number;
  isLoading?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  recordsPerPage?: number;
}

const HotelResults = ({
  hotels = [],
  totalHotels = 0,
  isLoading = false,
  currentPage = 1,
  onPageChange,
  recordsPerPage = 6,
}: HotelResultsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Default to grid view on mobile, list view on desktop
  const [viewMode, setViewMode] = useState<"list" | "grid">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "grid" : "list",
  );
  const [favoriteHotels, setFavoriteHotels] = useState<Set<number>>(new Set());
  const dispatch = useDispatch();
  const [facilitiesModal, setFacilitiesModal] = useState<{
    isOpen: boolean;
    facilities: any[];
  }>({
    isOpen: false,
    facilities: [],
  });
  const [highlightsModal, setHighlightsModal] = useState<{
    isOpen: boolean;
    highlights: string[];
  }>({
    isOpen: false,
    highlights: [],
  });
  const [sortBy, setSortBy] = useState("top_reviewed");
  const [cityName, setCityName] = useState("");

  // Enquiry Modal State
  const [enquiryModal, setEnquiryModal] = useState<{
    isOpen: boolean;
    hotelName: string;
    hotelId: number;
  }>({
    isOpen: false,
    hotelName: "",
    hotelId: 0,
  });

  const openEnquiryModal = (hotelName: string, hotelId: number) => {
    setEnquiryModal({
      isOpen: true,
      hotelName,
      hotelId,
    });
  };

  const closeEnquiryModal = () => {
    setEnquiryModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Use the lightbox hook
  const {
    isOpen: isLightboxOpen,
    images: selectedImages,
    currentIndex: currentImageIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = 
      facilitiesModal.isOpen || 
      highlightsModal.isOpen || 
      enquiryModal.isOpen ||
      isLightboxOpen;

    if (isAnyModalOpen) {
      document.documentElement.style.setProperty("overflow", "hidden", "important");
      document.body.style.setProperty("overflow", "hidden", "important");
    } else {
      document.documentElement.style.setProperty("overflow", "unset", "important");
      document.body.style.setProperty("overflow", "unset", "important");
    }

    return () => {
      document.documentElement.style.setProperty("overflow", "unset", "important");
      document.body.style.setProperty("overflow", "unset", "important");
    };
  }, [facilitiesModal.isOpen, highlightsModal.isOpen, enquiryModal.isOpen, isLightboxOpen]);

  // Extract city name from URL
  useEffect(() => {
    const cityFromQuery =
      searchParams?.get("cityName") || searchParams?.get("location");

    if (cityFromQuery) {
      const formattedCity = cityFromQuery
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setCityName(formattedCity);
    } else if (pathname) {
      const pathParts = pathname.split("/").filter(Boolean);

      let cityFromPath = "";

      // Handle meta search path: /in/hotels/city/...
      const inIndex = pathParts.indexOf("in");
      const hotelsIndex = pathParts.indexOf("hotels");

      if (
        inIndex >= 0 &&
        hotelsIndex === inIndex + 1 &&
        pathParts.length > hotelsIndex + 1
      ) {
        // City name is always right after /in/hotels/
        cityFromPath = pathParts[hotelsIndex + 1];
      }

      if (cityFromPath && !cityFromPath.match(/^\d+$/)) {
        const formattedCity = cityFromPath
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setCityName(formattedCity);
      } else {
        setCityName(""); // not found
      }
    } else {
      setCityName(""); // not found
    }
  }, [pathname, searchParams]);

  // Force grid view on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };

    // Set initial view mode
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use hotels directly from props (no client-side slicing)
  const currentHotels = hotels;
  const totalPages = Math.ceil(totalHotels / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const toggleFavorite = (hotelId: number) => {
    setFavoriteHotels((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  const openFacilitiesModal = (facilities: any[]) => {
    setFacilitiesModal({ isOpen: true, facilities });
  };

  const closeFacilitiesModal = () => {
    setFacilitiesModal({ isOpen: false, facilities: [] });
  };

  const openHighlightsModal = (highlights: string[]) => {
    setHighlightsModal({ isOpen: true, highlights });
  };

  const closeHighlightsModal = () => {
    setHighlightsModal({ isOpen: false, highlights: [] });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getAmenityIcon = (facility: any) => {
    // If facility has an image, use it; otherwise fallback to static icons
    if (facility.image) {
      return (
        <div className="w-4 h-4 flex-shrink-0">
          <Image
            src={`${IMAGE_BASE_URL}${facility.image}`}
            alt={facility.name}
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
            onError={(e) => {
              // Fallback to static icon if image fails to load
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
              }
            }}
          />
        </div>
      );
    }

    // Fallback to static icons based on facility name
    const name = facility.name?.toLowerCase() || "";
    if (name.includes("wifi") || name.includes("internet"))
      return <Wifi className="w-4 h-4" />;
    if (name.includes("coffee") || name.includes("tea"))
      return <Coffee className="w-4 h-4" />;
    if (name.includes("restaurant") || name.includes("dining"))
      return <Utensils className="w-4 h-4" />;
    if (name.includes("phone") || name.includes("telephone"))
      return <Phone className="w-4 h-4" />;
    if (name.includes("parking") || name.includes("car"))
      return <Car className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const formatAddress = (hotel: any) => {
    if (hotel.address) return hotel.address;
    return `${hotel.city_name || ""}, ${hotel.state_name || ""}, ${hotel.country_name || ""}`;
  };

  const HotelCardList = ({ hotel }: { hotel: HotelType }) => {
    const hotelImages = hotel.images?.map((img: any) => img.file) || [];
    const coverImage =
      hotel.images?.find((img: any) => img.cover_photo)?.file ||
      hotelImages[0] ||
      "/placeholder.svg";
    const isFavorite = favoriteHotels.has(hotel.id || 0);
    const hotelSlug =
      hotel.slug ||
      `${hotel?.name || "hotel"}-${hotel?.city_name || "city"}`
        .replace(/\s+/g, "-")
        .toLowerCase();

    const originalPrice = hotel.sbr_rate || 0;
    const promotion_pricing = calculatePromotionalPricing(
      originalPrice,
      hotel.has_promotion || false,
      hotel.best_promotion || null,
    );
    // const discountedPrice = hotel?.discounted_price || 0
    // const discount = hotel?.discount || "0% Off"
    const rating = hotel.review_rating_count || 0;
    const reviewCount = hotel.review_rating || 0;

    return (
      <div className="bg-white rounded-[20px] cursor-pointer overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className=" flex flex-col md:flex-row p-3 sm:p-4 md:p-6 lg:p-[28px]">
          {/* LEFT: Images */}
          <div className="w-full md:w-72 flex flex-col">
            <div className="relative h-48 sm:h-52 md:h-40 rounded-2xl overflow-hidden">
              {/*{discount && (*/}
              {/*    <div*/}
              {/*        className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">*/}
              {/*        {discount}*/}
              {/*    </div>*/}
              {/*)}*/}
              <Link
                target="_blank"
                href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
              >
                <Image
                  src={coverImage}
                  alt={hotel.name || "Hotel"}
                  fill
                  className="object-cover"
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 288px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                />
              </Link>
              {/* Favorite Button */}
              {/* <button
                            onClick={() => toggleFavorite(hotel.id || 0)}
                            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"
                                    }`}
                            />
                        </button> */}
            </div>

            {hotelImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {hotelImages.slice(0, 2).map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative flex-1 h-[80px] sm:h-[100px] md:h-[104px] aspect-square rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(hotelImages, index)}
                  >
                    <Image
                      src={img}
                      alt={`${hotel.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={70}
                      sizes="(max-width: 768px) 80px, (max-width: 1024px) 100px, 104px"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                    />
                  </div>
                ))}
                {hotelImages.length > 3 && (
                  <button
                    onClick={() => openLightbox(hotelImages, 0)}
                    className="relative flex-1 h-[80px] sm:h-[100px] md:h-[104px] aspect-square rounded-2xl overflow-hidden group"
                  >
                    <Image
                      src={hotelImages[2]}
                      alt={`${hotel.name} - View All`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={70}
                      sizes="(max-width: 768px) 80px, (max-width: 1024px) 100px, 104px"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-70 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        View All
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Content */}
          <div
            className="flex-1 cursor-pointer mt-4 md:mt-0 md:pl-4 lg:pl-6 md:flex md:flex-row flex-col justify-between"

            // onClick={() => {

            //     const params = new URLSearchParams(searchParams.toString());
            //     router.push(`/hotels/${hotelSlug}?${params.toString()}`);
            // }}
          >
            {/* Header */}
            <div className="">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                <div className="flex-1">
                  {/* Property Highlights Badges */}
                  {hotel.property_highlights_details &&
                    hotel.property_highlights_details.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {hotel.property_highlights_details
                          .slice(0, 3)
                          .map((highlight: any) => (
                            <div
                              key={highlight.id}
                              className="relative inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] rounded-md font-semibold shadow-sm"
                              style={{
                                clipPath:
                                  "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%)",
                              }}
                            >
                              <span className="relative z-10">
                                {highlight.title}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                  <Link
                    target="_blank"
                    href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
                  >
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-1">
                      {hotel.name}
                    </h3>
                  </Link>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <RatingStars
                      rating={Number(hotel.star_category) || 0}
                      filledColor="text-orange-400"
                      emptyColor="text-gray-300"
                      size="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              {hotel.address && (
                <Link
                  target="_blank"
                  href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
                >
                  <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3 w-full">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{hotel.address}</span>
                  </div>
                </Link>
              )}

              {/* Property Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.property_type && (
                  <span className="px-2 sm:px-3 py-1 bg-orange-200 text-orange-700 text-xs sm:text-sm rounded-full">
                    {hotel.property_type}
                  </span>
                )}
                {hotel.highlights && hotel.highlights.split(",").length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openHighlightsModal(hotel?.highlights?.split(",") || []);
                    }}
                    className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs sm:text-sm rounded-full hover:bg-emerald-200 transition-colors"
                  >
                    Highlights ({hotel.highlights.split(",").length})
                  </button>
                )}
              </div>

              {/* Room Details */}
              {/* <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                                <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm">{hotel?.rooms?.[0]?.bed_type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TriangleRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
                                <span
                                    className="text-xs sm:text-sm">{hotel.rooms?.[0]?.dimensions?.includes("sq.ft") ? hotel.rooms?.[0]?.dimensions : hotel.rooms?.[0]?.dimensions + " sq.ft"}</span>
                            </div>
                        </div> */}

              {/* Amenities */}
              <div className="mb-4">
                {hotel.facilitiesDetails &&
                  hotel.facilitiesDetails.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hotel.facilitiesDetails
                        .slice(0, 2)
                        .map((facility: any) => (
                          <div
                            key={facility.id}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full"
                          >
                            {getAmenityIcon(facility)}
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {facility.name}
                            </span>
                          </div>
                        ))}
                      {hotel.facilitiesDetails.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFacilitiesModal(hotel.facilitiesDetails || []);
                          }}
                          className="px-2 sm:px-3 py-1 bg-gray-100 text-blue-600 text-xs sm:text-sm rounded-full hover:underline"
                        >
                          +{hotel.facilitiesDetails.length - 2} more
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
            <div className="w-[1px] bg-[#4B5563]/20 md:block hidden ml-2"></div>
            {/*Content right section*/}

            <div className="flex flex-col min-w-[120px] sm:min-w-[140px] items-start sm:items-end sm:ml-4 h-full justify-between">
              {/* Rating */}
              <div className="flex flex-col items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {getRatingLabel(rating)}
                  </span>
                  <div className="gradient-btn text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {rating}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {reviewCount.toLocaleString()} Reviews
                </span>
              </div>

              {/* Pricing pinned to bottom */}
              <div className="text-left sm:text-right w-full relative">
                <PromotionalPricing
                  type="list"
                  originalPrice={originalPrice}
                  hasPromotion={hotel.has_promotion || false}
                  bestPromotion={hotel.best_promotion || null}
                  className="mb-2"
                />
                {originalPrice > 0 ? (
                  <Link
                    href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" gradient-btn text-white px-3 sm:px-4 py-1.5 rounded-lg mt-2 transition-colors text-xs w-full inline-block text-center"
                  >
                    <span>Book Now</span>
                  </Link>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openEnquiryModal(hotel.name || "", hotel.id || 0);
                    }}
                    className=" blue-gradient-btn text-white px-3 sm:px-4 py-1.5 rounded-lg mt-2 transition-colors text-xs w-full inline-block text-center"
                  >
                    <span>Send Enquiry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {promotion_pricing?.hasPromotion && (
          <div className="pl-6 py-4 bg-emerald-100">
            <p className="text-emerald-700 text-xs">
              <span>Book between </span>
              {promotion_pricing?.formattedBookingPeriod} and get
              <span className=" ml-2 font-bold bg-gradient-to-r from-orange-500 to-red-500 text-xs py-1 text-white  px-2  rounded-full ">
                {promotion_pricing?.discountText}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  };

  const HotelCardGrid = ({ hotel }: { hotel: HotelType }) => {
    const hotelImages = hotel.images?.map((img: any) => img.file) || [];
    const coverImage =
      hotel.images?.find((img: any) => img.cover_photo)?.file ||
      hotelImages[0] ||
      "/placeholder.svg";
    const isFavorite = favoriteHotels.has(hotel.id || 0);
    const hotelSlug =
      hotel.slug ||
      `${hotel?.name || "hotel"}-${hotel?.city_name || "city"}`
        .replace(/\s+/g, "-")
        .toLowerCase();

    const originalPrice = hotel.sbr_rate || 0;
    const rating = hotel.review_rating_count || 0;
    const reviewCount = hotel.review_rating || 0;
    const promotion_pricing = calculatePromotionalPricing(
      originalPrice,
      hotel.has_promotion || false,
      hotel.best_promotion || null,
    );

    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
        {/* Main Image Section with improved aspect ratio */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Link
            target="_blank"
            href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
          >
            <Image
              src={coverImage}
              alt={hotel.name || "Hotel"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              quality={80}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
            />
          </Link>

          {/* Promotional Badge - Top Left */}
          {promotion_pricing?.hasPromotion && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm">
                {promotion_pricing?.discountText}
              </div>
            </div>
          )}

          {/* Image Count Badge - Bottom Right */}
          {hotelImages.length > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                openLightbox(hotelImages, 0);
              }}
              className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-all z-10 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{hotelImages.length} Photos</span>
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Property Highlights Badges */}
          {hotel.property_highlights_details &&
            hotel.property_highlights_details.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {hotel.property_highlights_details
                  .slice(0, 2)
                  .map((highlight: any) => (
                    <div
                      key={highlight.id}
                      className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs rounded-md font-semibold shadow-sm"
                    >
                      <span>{highlight.title}</span>
                    </div>
                  ))}
              </div>
            )}

          {/* Hotel Name */}
          <Link
            target="_blank"
            href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
          >
            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors leading-tight">
              {hotel.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <RatingStars
              rating={Number(hotel.star_category)|| 0}
              filledColor="text-orange-400"
              emptyColor="text-gray-300"
              size="w-4 h-4"
            />
          </div>

          {/* Location */}
          {hotel.address && (
            <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0 mt-0.5 text-gray-400" />
              <span className="line-clamp-2 leading-relaxed">
                {hotel.address}
              </span>
            </div>
          )}

          {/* Property Type & Highlights Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.property_type && (
              <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium border border-orange-200">
                {hotel.property_type}
              </span>
            )}
            {hotel.highlights && hotel.highlights.split(",").length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openHighlightsModal(hotel?.highlights?.split(",") || []);
                }}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full hover:bg-emerald-100 transition-colors font-medium border border-emerald-200"
              >
                {hotel.highlights.split(",").length} Highlights
              </button>
            )}
          </div>

          {/* Amenities */}
          {hotel.facilitiesDetails && hotel.facilitiesDetails.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.facilitiesDetails.slice(0, 2).map((facility: any) => (
                <div
                  key={facility.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 text-gray-700 text-xs rounded-lg border border-gray-200"
                >
                  {getAmenityIcon(facility)}
                  <span className="truncate max-w-[80px] sm:max-w-[100px]">
                    {facility.name}
                  </span>
                </div>
              ))}
              {hotel.facilitiesDetails.length > 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFacilitiesModal(hotel.facilitiesDetails || []);
                  }}
                  className="px-2.5 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                >
                  +{hotel.facilitiesDetails.length - 2}
                </button>
              )}
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <div className="gradient-btn text-white px-2.5 py-1.5 rounded-lg text-sm font-bold shadow-sm">
              {rating}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {getRatingLabel(rating)}
              </span>
              <span className="text-xs text-gray-500">
                {reviewCount.toLocaleString()} reviews
              </span>
            </div>
          </div>

          {/* Pricing Section - Pinned to bottom */}
          <div className="mt-auto">
            <PromotionalPricing
              type="grid"
              originalPrice={originalPrice}
              hasPromotion={hotel.has_promotion || false}
              bestPromotion={hotel.best_promotion || null}
              className="mb-3"
            />

            {originalPrice > 0 ? (
              <Link
                href={`/hotels/${hotelSlug}?${searchParams.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-btn text-white px-3 sm:px-4 py-1.5 rounded-lg mt-2 transition-colors text-xs w-full inline-block text-center"
              >
                <span>Book Now</span>
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openEnquiryModal(hotel.name || "", hotel.id || 0);
                }}
                className="blue-gradient-btn text-white px-3 sm:px-4 py-1.5 rounded-lg mt-2 transition-colors text-xs w-full inline-block text-center"
              >
                <span>Send Enquiry</span>
              </button>
            )}
          </div>
        </div>

        {/* Promotional Banner at bottom */}
        {promotion_pricing?.hasPromotion && (
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
            <p className="text-emerald-700 text-xs leading-relaxed">
              <span className="font-semibold">Limited Offer:</span> Book between{" "}
              {promotion_pricing?.formattedBookingPeriod}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Facilities Modal Component
  const FacilitiesModal = () => {
    if (!facilitiesModal.isOpen || facilitiesModal.facilities.length === 0)
      return null;

    return (
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              All Amenities & Facilities
            </h3>
            <button
              onClick={closeFacilitiesModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div 
            className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {facilitiesModal.facilities.map((facility: any) => (
                <div
                  key={facility.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getAmenityIcon(facility)}
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {facility.name}
                    </span>
                    {facility.name_hindi && (
                      <p className="text-xs text-gray-600 mt-1">
                        {facility.name_hindi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Highlights Modal Component
  const HighlightsModal = () => {
    if (!highlightsModal.isOpen || highlightsModal.highlights.length === 0)
      return null;

    return (
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              All Highlights
            </h3>
            <button
              onClick={closeHighlightsModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div 
            className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlightsModal.highlights.map(
                (highlight: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">
                      {highlight.trim()}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="">
        <div className="max-w-7xl mx-auto  py-1">
          <nav className="flex items-center text-sm text-gray-600">
            {/*<Home className="w-4 h-4 text-orange-500 mr-1"/>*/}
            <Link
              href={"/"}
              target="_blank"
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span>Hotels & more in {cityName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-2 pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {cityName ? (
                <>
                  {cityName}: {totalHotels.toLocaleString()} properties found
                </>
              ) : (
                <>{totalHotels.toLocaleString()} properties found</>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Sort By */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                Sort by:
              </span>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    dispatch(setSearchFilters({ sortBy: e.target.value }));
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                  <option value="top_reviewed">Top Reviewed</option>
                  <option value="price_low_to_high">Price: Low to High</option>
                  <option value="price_high_to_low">Price: High to Low</option>
                  {/*<option value="Rating">Rating</option>*/}
                  {/*<option value="Distance">Distance</option>*/}
                </select>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center border-storke bg-[#F5F5F5] rounded-full p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                  viewMode === "list"
                    ? "bg-white border-storke text-[#374151]"
                    : " text-gray-600 hover:text-gray-900"
                }`}
              >
                {/*<LayoutList className="w-4 h-4"/>*/}
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border-gray-300 transition-colors ${
                  viewMode === "grid"
                    ? "bg-white border-storke text-[#374151]"
                    : " text-gray-600 hover:text-gray-900"
                }`}
              >
                {/*<Grid3X3 className="w-4 h-4"/>*/}
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Hotel Results */}
        {isLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) =>
              viewMode === "list" ? (
                <HotelCardListShimmer key={i} />
              ) : (
                <HotelCardGridShimmer key={i} />
              ),
            )}
          </div>
        ) : currentHotels.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                : "space-y-4"
            }
          >
            {currentHotels.map((hotel) =>
              viewMode === "list" ? (
                <HotelCardList key={hotel.id} hotel={hotel} />
              ) : (
                <HotelCardGrid key={hotel.id} hotel={hotel} />
              ),
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg">
            <div className="text-gray-400 mb-6">
              <MapPin className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              No hotels found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any hotels matching your criteria. Try adjusting
              your search or explore different destinations.
            </p>
            {/*<Button*/}
            {/*    onClick={() => window.location.reload()}*/}
            {/*    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full transition-colors"*/}
            {/*>*/}
            {/*    Reset Search*/}
            {/*</Button>*/}
          </div>
        )}

        {/* Pagination - Only show if there are hotels and multiple pages */}
        {currentHotels.length > 0 && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 sm:px-6 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </Button>
            {generatePageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 transition-colors text-sm ${
                      page === currentPage
                        ? "main-bg hover:bg-orange-700 text-white border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 sm:px-6 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <Lightbox
        images={selectedImages}
        isOpen={isLightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText="Hotel image"
      />
      <FacilitiesModal />
      <HighlightsModal />
      {/* Enquiry Modal */}
      <GroupEnquiryModal
        isOpen={enquiryModal.isOpen}
        onClose={closeEnquiryModal}
        hotelName={enquiryModal.hotelName}
        hotelId={enquiryModal.hotelId}
        enquiryType="group"
        allowTypeSelection={true}
      />
    </div>
  );
};

export default HotelResults;
