import React, { useState, useEffect, useCallback, Suspense, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getRoomInventoryAndPricing,
  checkRoomAvailability,
  saveBooking,
  getSelectedRooms,
  getBookingSummary,
} from "@/services/api";
import type { PriceDetail, RoomDetail } from "@/types/roomInventory";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice";
import { calculateFinalAmount } from "@/utils/taxCalculation";
import {
  validateBeforeCheckout,
  type SearchParameters,
  type SelectedRoomForValidation,
} from "@/utils/roomOccupancyValidation";
import { buildSaveBookingRoomsPayload } from "@/utils/buildSaveBookingRoomsPayload";
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing";
import svgPaths from "./svg-aceuvymh6m";
import { IMAGES } from "@/assets/images";
import {
  ChevronDown,
  X,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Phone,
  Shirt,
  Bed as BedLucide,
  Snowflake,
  Droplets,
  Armchair,
  Fan as FanLucide,
  Sparkles,
} from "lucide-react";
import RoomImageCarousel from "./RoomImageCarousel";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import BookingSummary from "./BookingSummary";
import { calculateRoomPlanPromotionalPricing } from "@/utils/roomPromotionalPricing";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";
import Image from "next/image";
import { Star } from "lucide-react";
import MobileRoomCard, { MobileRateAddons } from "./MobileRoomCard";
import StickyBookingBar from "./StickyBookingBar";
import PriceBreakdownModal from "@/components/booking/PriceBreakdownModal";
import ChangeDatesGuestsSearch, {
  type ChangeDatesGuestsSearchParams,
} from "./ChangeDatesGuestsSearch";
import { HotelRoomTypesListShimmer } from "./HotelRoomTypeShimmer";

// Icon Components
function SquareFootIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="square_foot">
          <path d={svgPaths.p2ead0500} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

function LakeViewIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g clipPath="url(#clip0_1_1242)">
          <path d={svgPaths.p5f2df70} fill="var(--fill-0, #4A4A4A)" />
        </g>
        <defs>
          <clipPath id="clip0_1_1242">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function BedIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="bed">
          <path d={svgPaths.p197a9000} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

function BathtubIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="bathtub">
          <path d={svgPaths.p3ef54980} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="acute">
          <path d={svgPaths.pd691fc0} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

function FastfoodIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fastfood">
          <path d={svgPaths.p1f092580} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

function LocalBarIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="local_bar">
          <path d={svgPaths.pcf35100} fill="var(--fill-0, #4A4A4A)" />
        </g>
      </svg>
    </div>
  );
}

interface RoomDetailsProps {
  size: string;
  view: string;
  bed: string;
  bathroom: string;
}

function RoomDetails({ size, view, bed, bathroom }: RoomDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 w-full">
      {size && (
        <div className="flex gap-3 items-center">
          <SquareFootIcon />
          <p className=" text-[#4a4a4a] text-[14px] leading-[20px]">{size}</p>
        </div>
      )}
      {view && (
        <div className="flex gap-3 items-center">
          <LakeViewIcon />
          <p className=" text-[#4a4a4a] text-[14px] leading-[20px]">{view}</p>
        </div>
      )}
      {bed && (
        <div className="flex gap-3 items-center">
          <BedIcon />
          <p className=" text-[#4a4a4a] text-[14px] leading-[20px]">{bed}</p>
        </div>
      )}
      {bathroom && (
        <div className="flex gap-3 items-center">
          <BathtubIcon />
          <p className=" text-[#4a4a4a] text-[14px] leading-[20px]">
            {bathroom}
          </p>
        </div>
      )}
    </div>
  );
}

function RoomAmenities({ amenities }: { amenities?: any[] }) {
  const [showModal, setShowModal] = useState(false);
  if (!amenities || amenities.length === 0) {
    return null;
  }

  // Helper function to get icon for amenity
  const getAmenityIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("air conditioning") || lowerName.includes("ac")) {
      return <Snowflake className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("wifi") || lowerName.includes("internet")) {
      return <Wifi className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("tv") || lowerName.includes("television")) {
      return <Tv className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (
      lowerName.includes("bath") ||
      lowerName.includes("shower") ||
      lowerName.includes("toilet")
    ) {
      return <BathtubIcon />;
    } else if (lowerName.includes("bed") || lowerName.includes("blanket")) {
      return <BedLucide className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("kettle") || lowerName.includes("coffee")) {
      return <Coffee className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("bar") || lowerName.includes("minibar")) {
      return <LocalBarIcon />;
    } else if (
      lowerName.includes("chair") ||
      lowerName.includes("sofa") ||
      lowerName.includes("furniture")
    ) {
      return <Armchair className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("fan")) {
      return <FanLucide className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (
      lowerName.includes("housekeeping") ||
      lowerName.includes("cleaning")
    ) {
      return <Sparkles className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("telephone") || lowerName.includes("phone")) {
      return <Phone className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("charging") || lowerName.includes("power")) {
      return <Wind className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (lowerName.includes("water") || lowerName.includes("geyser")) {
      return <Droplets className="w-5 h-5 text-[#4a4a4a]" />;
    } else if (
      lowerName.includes("toiletries") ||
      lowerName.includes("towel")
    ) {
      return <Shirt className="w-5 h-5 text-[#4a4a4a]" />;
    } else {
      return <Sparkles className="w-5 h-5 text-[#4a4a4a]" />;
    }
  };

  const displayedAmenities = amenities.slice(0, 6);
  const hasMoreForMobile = amenities.length > 4;
  const hasMoreForDesktop = amenities.length > 6;

  // Using CSS Grid for proper 2-column layout

  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full">
        {displayedAmenities?.map((amenity, amenityIndex) => (
          <div key={amenityIndex} className={`gap-2 items-center ${amenityIndex >= 4 ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-shrink-0">
              {amenity.image ? (
                <div className="w-5 h-5 flex-shrink-0">
                  <Image
                    src={`${IMAGE_BASE_URL}${amenity.image}`}
                    alt={amenity.name || amenity}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      // Fallback to static icon if image fails to load
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                      }
                    }}
                  />
                </div>
              ) : (
                <Star className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <p className="text-[#4a4a4a] text-[14px] leading-[16px] whitespace-normal">
              {amenity.name || amenity}
            </p>
          </div>
        ))}
      </div>

      {hasMoreForMobile && (
        <button
          onClick={() => setShowModal(true)}
          className="text-left text-[14px] text-orange-500 hover:text-orange-600 font-medium transition-colors mt-2 md:hidden block"
        >
          +{amenities.length - 4} more amenities
        </button>
      )}
      {hasMoreForDesktop && (
        <button
          onClick={() => setShowModal(true)}
          className="text-left text-[14px] text-orange-500 hover:text-orange-600 font-medium transition-colors mt-2 hidden md:block"
        >
          +{amenities.length - 6} more amenities
        </button>
      )}

      {/* Modal */}
      {showModal && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200 border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-extrabold text-gray-900">Amenities</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center p-3 bg-gray-50/80 border border-gray-100 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      {amenity.image ? (
                        <div className="w-5 h-5 flex-shrink-0">
                          <Image
                            src={`${IMAGE_BASE_URL}${amenity.image}`}
                            alt={amenity.name || amenity}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML =
                                  '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <Star className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <span className="text-gray-800 text-sm font-semibold">
                      {amenity.name || amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function RoomImage({
  images,
  roomName,
  photoCount,
  onImageClick,
}: {
  images: string[];
  roomName: string;
  photoCount?: number;
  onImageClick?: () => void;
}) {
  return (
    <div onClick={onImageClick} className="cursor-pointer">
      <RoomImageCarousel
        images={images}
        roomName={roomName}
        height="h-[220px]"
        photoCount={photoCount}
        className="w-full"
        galleryClass="rounded-[4px]"
        navigation={true}
      />
    </div>
  );
}

interface BookingOptionProps {
  title: string;
  features: Array<{
    icon?: React.ReactNode;
    text: string;
    type?: "bullet" | "icon";
  }>;
  originalPrice: string;
  discountedPrice: string;
  taxes: string;
  roomType: string;
  memberRate?: number;
  planName?: string;
  planId?: number;
  baseAdults?: number;
  maximumAdults?: number;
  maximumOccupancy?: number;
  maximumChildren?: number;
  extraBedAllowed?: boolean;
  availableRooms?: number;
  pricingData?: any;
  childrenAges?: number[];
  roomId?: number;
  roomName?: string;
  roomData?: any;
  onRoomSelect?: (roomData: any) => void;
  isDisabled?: boolean;
  disabledMessage?: string;
  searchAdults?: number;
  selectedRoomsByKey?: { [key: string]: number };
  promotionDetails?: any[];
  searchDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
  };
}

function BookingOption({
  title,
  features,
  originalPrice,
  discountedPrice,
  taxes,
  roomType,
  memberRate,
  planName,
  planId,
  baseAdults = 1,
  maximumAdults,
  extraBedAllowed = false,
  availableRooms = 0,
  extraBedPrice = 0,
  pricingData,
  childrenAges = [],
  roomId,
  roomName,
  roomData,
  onRoomSelect,
  isDisabled = false,
  disabledMessage = "",
  maximumOccupancy = 0,
  maximumChildren = 0,
  searchAdults = 1,
  selectedRoomsByKey = {},
  promotionDetails = [],
  searchDates,
}: BookingOptionProps & {
  extraBedPrice?: number;
  maximumOccupancy?: number;
  maximumChildren?: number;
  searchAdults?: number;
  selectedRoomsByKey?: { [key: string]: number };
  roomData?: any;
}) {
  const [selectedBedType, setSelectedBedType] = useState<number>(searchAdults);
  const [showFeaturesModal, setShowFeaturesModal] = useState<boolean>(false);

  useEffect(() => {
    setSelectedBedType(searchAdults);
  }, [searchAdults]);

  // Helper function to get current selection for a specific adult count
  const getCurrentSelection = (adultCount: number): number => {
    if (!roomId || !planId) return 0;
    const key = `${roomId}-${planId}-${adultCount}`;
    return selectedRoomsByKey[key] || 0;
  };

  // Get pricing from API with fallback to standard rate structure
  const singleBedRate =
    pricingData?.sbr_rate ||
    pricingData?.single_bed_rate ||
    roomData?.sbr_rate ||
    roomData?.single_bed_rate ||
    (planName?.includes("CP") ? 3300 : 3051);

  const doubleBedRate =
    pricingData?.dbr_rate ||
    pricingData?.double_bed_rate ||
    roomData?.dbr_rate ||
    roomData?.double_bed_rate ||
    (planName?.includes("CP") ? 3600 : 3381);

  const extraBedRate =
    pricingData?.extra_bed_rate ||
    roomData?.extra_bed_rate ||
    roomData?.extra_person_charge ||
    0;

  const child_2_5_rate = pricingData?.child_2_5_rate || 0;
  const child_6_10_rate = pricingData?.child_6_10_rate || 0;

  // Calculate child pricing
  const childrenCount = childrenAges.length;
  const children_6_10_count = childrenAges.filter(
    (age) => age >= 6 && age <= 10,
  ).length;
  const children_2_5_count = childrenAges.filter(
    (age) => age >= 2 && age <= 5,
  ).length;
  const childPricing =
    children_6_10_count * child_6_10_rate + children_2_5_count * child_2_5_rate;

  // Calculate total maximum adults: use maximum_occupancy as the absolute max, or base_adults if no max set
  const totalMaxAdults =
    maximumOccupancy > 0 ? Math.max(baseAdults, maximumOccupancy) : baseAdults;

  // Count only CHARGEABLE children (age >= 6) for validation
  const chargeableChildrenCount = childrenAges
    ? childrenAges.filter((age) => age >= 6).length
    : 0;

  // Validation: Check if CHARGEABLE children exceed maximum
  const childrenExceedMax =
    maximumChildren > 0 && chargeableChildrenCount > maximumChildren;

  // Generate adult options (1, 2, 3, 4, etc.)
  const adultOptions = [];
  for (let i = baseAdults; i <= totalMaxAdults; i++) {
    adultOptions.push(i);
  }

  // Calculate price for specific adult count
  const calculatePriceForAdults = (adultCount: number) => {
    let baseRate = 0;
    let baseAdultsCovered = 0;

    if (adultCount >= 2 && doubleBedRate > 0) {
      baseRate = doubleBedRate;
      baseAdultsCovered = 2;
    } else if (singleBedRate > 0) {
      baseRate = singleBedRate;
      baseAdultsCovered = 1;
    } else {
      baseRate = doubleBedRate || singleBedRate || 3051;
      baseAdultsCovered = baseAdults;
    }

    const extraAdults = Math.max(0, adultCount - baseAdultsCovered);
    const totalPrice = Math.round(baseRate + extraAdults * extraBedRate);

    const apiPromo =
      roomId && planId
        ? calculateRoomPlanPromotionalPricing(
            totalPrice,
            roomId,
            planId,
            promotionDetails,
            searchDates?.checkIn,
            searchDates?.checkOut,
          )
        : null;

    const promotionalPricing =
      apiPromo && apiPromo.hasPromotion
        ? apiPromo
        : {
            hasPromotion: true,
            originalPrice: totalPrice,
            discountedPrice: Math.round(totalPrice * 0.8),
            savings: Math.round(totalPrice * 0.2),
            discountPercentage: 20,
            promotionName: "20% OFF",
            discountText: "20% OFF",
            offerType: "Percentage" as const,
            bookingStart: null,
            bookingEnd: null,
            stayStart: "2026-08-09",
            stayEnd: "2026-12-31",
            formattedBookingPeriod: "9 Aug 2026 - 31 Dec 2026",
            isValidForRoom: true,
            isValidForPlan: true,
          };

    return {
      totalPrice: promotionalPricing.discountedPrice,
      originalPrice: promotionalPricing.originalPrice,
      baseRate,
      extraAdults,
      extraBedCharge: extraAdults * extraBedRate,
      hasPromotion: true,
      promotionData: promotionalPricing,
    };
  };

  const isPriceValid = true;

  // Get bed type label based on adult count
  const getBedTypeLabel = (adultCount: number) => {
    if (adultCount === 1) return "Single";
    if (adultCount === 2) return "Double";
    if (adultCount === 3) return "Triple";
    if (adultCount === 4) return "Quadruple";
    return `${adultCount} Beds`;
  };

  // Get bed type display price for button
  const getBedDisplayPrice = (adultCount: number) => {
    const pricing = calculatePriceForAdults(adultCount);
    return pricing.totalPrice;
  };

  // Check if both SBR and DBR are available
  const hasBothBedTypes = singleBedRate > 0 && doubleBedRate > 0;

  // Set default selected bed type based on search adults on mount
  React.useEffect(() => {
    if (searchAdults >= baseAdults && searchAdults <= totalMaxAdults) {
      setSelectedBedType(searchAdults);
    }
  }, [searchAdults, baseAdults, totalMaxAdults]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Bed Type Selector - Show if both SBR and DBR available */}
      {/* Children Exceed Maximum Error */}
      {childrenExceedMax && (
        <div className="flex flex-col gap-2 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold text-sm mb-1">
                Chargeable Children Limit Exceeded
              </h4>
              <p className="text-red-700 text-xs">
                This room allows a maximum of{" "}
                <strong>
                  {maximumChildren} chargeable{" "}
                  {maximumChildren === 1 ? "child" : "children"} (age 6+)
                </strong>
                , but you have selected{" "}
                <strong>
                  {chargeableChildrenCount} chargeable{" "}
                  {chargeableChildrenCount === 1 ? "child" : "children"}
                </strong>
                . Children under 6 years are not counted against this limit.
                Please reduce the number of children aged 6+ or select a
                different room.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Child Pricing Info - Show if children are present and within limit */}
      {childrenCount > 0 && childPricing > 0 && !childrenExceedMax && (
        <div className="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-800">
              👶 Child Pricing (Added to Room Rate)
            </span>
            {maximumChildren > 0 && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                Max {maximumChildren} chargeable{" "}
                {maximumChildren === 1 ? "child" : "children"} (age 6+)
              </span>
            )}
          </div>
          <div className="space-y-1">
            {children_6_10_count > 0 && (
              <div className="flex justify-between items-center text-xs text-blue-700">
                <span>
                  {children_6_10_count} Child
                  {children_6_10_count > 1 ? "ren" : ""} (aged 6-10):
                </span>
                <span className="font-semibold">
                  ₹{(children_6_10_count * child_6_10_rate).toLocaleString()}
                </span>
              </div>
            )}
            {children_2_5_count > 0 && (
              <div className="flex justify-between items-center text-xs text-blue-700">
                <span>
                  {children_2_5_count} Child
                  {children_2_5_count > 1 ? "ren" : ""} (aged 2-5):
                </span>
                <span className="font-semibold">
                  ₹{(children_2_5_count * child_2_5_rate).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-bold text-blue-800 pt-1 border-t border-blue-200">
              <span>Total Child Pricing:</span>
              <span>₹{childPricing.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout - Show meal plan and features at top */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg lg:hidden">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`text-white px-3 py-1.5 rounded-lg font-bold text-sm text-center ${
                planName === "EP"
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : planName === "CP"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400"
                    : planName === "MAP"
                      ? "bg-gradient-to-r from-orange-500 to-orange-400"
                      : planName === "AP"
                        ? "bg-gradient-to-r from-red-500 to-red-400"
                        : "bg-gradient-to-r from-gray-500 to-gray-400"
              }`}
            >
              {planName || "CP"}
            </div>
            <h4 className="flex-1 text-[15px] font-bold text-gray-900 leading-tight">
              {title}
            </h4>
          </div>
          
          <div className="space-y-1.5 ml-2 mt-1">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <svg
                  className="w-[14px] h-[14px] text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-gray-700 text-[13px] font-medium leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Vertical stacked cards layout */}
      <div className="hidden lg:flex flex-col gap-3 my-2">
        {/* Select Bed Type Bar for THIS plan */}
        {adultOptions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/90 shadow-2xs">
            <span className="text-sm font-extrabold text-gray-800 whitespace-nowrap flex-shrink-0">
              Select Bed Type:
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {adultOptions.map((adultCount) => {
                const bedLabel = getBedTypeLabel(adultCount);
                const priceVal = getBedDisplayPrice(adultCount);
                const isSelected = selectedBedType === adultCount;

                return (
                  <button
                    key={adultCount}
                    onClick={() => setSelectedBedType(adultCount)}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap font-bold ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white border-orange-500 shadow-md scale-[1.02]"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"
                    }`}
                  >
                    <span>{bedLabel}</span>
                    {priceVal > 0 && (
                      <span
                        className={`ml-1 text-xs font-semibold ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        (₹{priceVal.toLocaleString()})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Room Capacity Info for THIS plan */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200/90 text-sm text-gray-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span>
              <strong className="font-extrabold text-gray-900">
                Maximum Adults:
              </strong>{" "}
              {totalMaxAdults}
            </span>
          </div>
          {maximumChildren > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-base">👶</span>
              <span>
                <strong className="font-extrabold text-gray-900">
                  Maximum Chargeable Children (age 6+):
                </strong>{" "}
                {maximumChildren}
                <span className="text-xs text-gray-500 ml-1 font-medium">
                  (Children under 6 are free)
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row border rounded-xl overflow-hidden bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          {/* Left Side: Plan Title & Features */}
          <div className="w-[300px] xl:w-[350px] p-5 md:pl-6 border-b md:border-b-0 md:border-r border-gray-100 bg-white shrink-0 flex flex-col ">
            <div className="flex flex-col gap-2 mb-4">
              <h4 className="text-[17px] font-bold text-gray-900 leading-tight">
                {title}
              </h4>
            </div>
            {features.length > 0 && (
              <div className="space-y-2.5">
                {features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2.5">
                    <svg className="w-[16px] h-[16px] text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-gray-600 text-[13.5px] font-medium leading-relaxed">{feature.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Adult Options Grid */}
          <div className="flex-1 flex flex-col bg-white">
            {adultOptions.map((adultCount, index) => {
              const pricing = calculatePriceForAdults(adultCount);
              const taxAmount = Math.round(pricing.totalPrice * 0.12);
              const currentSelection = getCurrentSelection(adultCount);
              const remainingWithCurrent = availableRooms + currentSelection;
              const maxSelectable = Math.min(remainingWithCurrent, 10);

              // Debug log for first adult option only
              if (index === 0) {
                console.log("💵 Pricing calculated for display:", {
                  adultCount,
                  hasPromotion: pricing.hasPromotion,
                  originalPrice: pricing.originalPrice,
                  totalPrice: pricing.totalPrice,
                  promotionData: pricing.promotionData,
                });
              }

              return (
                <div key={adultCount} className={`flex items-stretch min-h-[100px] ${index > 0 ? "border-t border-gray-100" : ""} ${currentSelection > 0 ? "bg-orange-50/20" : ""}`}>
                   {/* Adult Icons - Fixed Width */}
                   <div className="w-[140px] flex items-center justify-center border-r border-gray-50">
                     <div className="flex flex-wrap items-center justify-center gap-1.5 px-2">
                      {Array.from({ length: adultCount }).map((_, idx) => (
                        <svg key={idx} className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                      ))}
                     </div>
                   </div>

                   {/* Pricing - Expanding area */}
                   <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 border-r border-gray-50 relative">
                      {pricing.hasPromotion && (
                        <div className="absolute top-3 bg-gradient-to-r from-orange-500/50 to-red-500/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                           <span>🎉</span>
                           <span>{pricing.promotionData.discountText}</span>
                        </div>
                      )}
                      
                      <div className="flex items-end justify-center gap-2 mt-3">
                        {pricing.hasPromotion && (
                          <span className="text-[14px] line-through text-red-500/70 font-medium mb-[3px]">₹{pricing.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-[22px] font-black text-slate-800 leading-none">₹{pricing.totalPrice.toLocaleString()}</span>
                      </div>
                      
                      <p className="text-[11px] text-center text-gray-500 font-medium mt-1 ">
                        +₹{taxAmount.toLocaleString()} Taxes & Fees
                      </p>
                      
                      {pricing.promotionData.formattedBookingPeriod && (
                        <p className="text-[10px] text-center text-gray-400 mt-1.5 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
                          Valid: {pricing.promotionData.formattedBookingPeriod}
                        </p>
                      )}
                   </div>

                   {/* Action (Select) - Fixed Width */}
                   <div className="w-[180px] flex flex-col items-center justify-center px-5 py-4 relative group">
                     {currentSelection === 0 ? (
                        <button
                          onClick={() => {
                            if (onRoomSelect && roomId) {
                              onRoomSelect({
                                roomId,
                                roomName: roomName || roomType,
                                planName: planName || "CP",
                                planId: planId || 1,
                                planFeatures: features.map((f) => f.text),
                                quantity: 1,
                                pricePerNight: pricing.totalPrice,
                                childPrice: childPricing,
                                isExtraBed: pricing.extraAdults > 0,
                                adults: adultCount,
                              });
                            }
                          }}
                          disabled={isDisabled || !isPriceValid || availableRooms === 0 || childrenExceedMax}
                          className={`w-full py-2 rounded-lg font-black text-[13px] uppercase tracking-wide text-center transition-all ${
                            isDisabled || !isPriceValid || availableRooms === 0 || childrenExceedMax
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                              : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm border border-orange-600 active:scale-[0.98]"
                          }`}
                        >
                          Select
                        </button>
                      ) : (
                        <div className="flex items-center border border-orange-400 rounded-lg overflow-hidden h-10 bg-white w-full shadow-sm">
                          <button
                            onClick={() => {
                              if (onRoomSelect && roomId) {
                                onRoomSelect({
                                  roomId,
                                  roomName: roomName || roomType,
                                  planName: planName,
                                  planId: planId,
                                  planFeatures: features.map((f) => f.text),
                                  quantity: currentSelection - 1,
                                  pricePerNight: pricing.totalPrice,
                                  childPrice: childPricing,
                                  isExtraBed: pricing.extraAdults > 0,
                                  adults: adultCount,
                                });
                              }
                            }}
                            className="w-10 h-full flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors active:bg-orange-100"
                          >
                            {currentSelection === 1 ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                            )}
                          </button>
                          <div className="flex-1 flex items-center justify-center text-[14px] font-black text-orange-900 border-x border-orange-100 h-full bg-orange-50/50">
                            {currentSelection}
                          </div>
                          <button
                            onClick={() => {
                              if (onRoomSelect && roomId) {
                                onRoomSelect({
                                  roomId,
                                  roomName: roomName || roomType,
                                  planName: planName,
                                  planId: planId,
                                  planFeatures: features.map((f) => f.text),
                                  quantity: currentSelection + 1,
                                  pricePerNight: pricing.totalPrice,
                                  childPrice: childPricing,
                                  isExtraBed: pricing.extraAdults > 0,
                                  adults: adultCount,
                                });
                              }
                            }}
                            disabled={currentSelection >= maxSelectable}
                            className={`w-10 h-full flex items-center justify-center transition-colors active:bg-orange-100 ${currentSelection >= maxSelectable ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-50'}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                      )}

                      <div className="text-[11.5px] font-bold text-gray-500 mt-2.5 text-center">
                        {remainingWithCurrent > 0 ? `${remainingWithCurrent} left` : "Sold out"}
                      </div>
                      
                      {/* Tooltip for disabled state */}
                      {isDisabled && disabledMessage && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          <div className="relative">
                            {disabledMessage}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}

                      {/* Tooltip for children exceed max */}
                      {childrenExceedMax && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg text-center leading-relaxed">
                          <div className="relative">
                            Maximum {maximumChildren} chargeable {maximumChildren === 1 ? "child" : "children"} (age 6+) allowed. Children under 6 are free.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Show individual rows */}
      <div className="lg:hidden space-y-4">
        {adultOptions.map((adultCount, index) => {
          const pricing = calculatePriceForAdults(adultCount);
          const taxAmount = Math.round(pricing.totalPrice * 0.12);

          return (
            <div
              key={adultCount}
              className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              {/* Price & Selection Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Adults Icons */}
                <div className="flex items-center justify-center gap-1 sm:justify-start">
                  {Array.from({ length: adultCount }).map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-5 h-5 sm:w-5 sm:h-5 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  ))}
                </div>

                {/* Price Display */}
                <div className="flex flex-col items-center justify-center">
                  {pricing.hasPromotion ? (
                    <div className="text-center space-y-1">
                      {/* Promotion Badge */}
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold mb-1">
                        <span>🎉</span>
                        <span>{pricing.promotionData.discountText}</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg line-through text-red-500">
                          ₹{pricing.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          ₹{pricing.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 text-center">
                        +₹{taxAmount.toLocaleString()} Taxes & Fees
                      </p>

                      {/* Booking Period */}
                      {pricing.promotionData.formattedBookingPeriod && (
                        <p className="text-[10px] text-gray-500">
                          Valid: {pricing.promotionData.formattedBookingPeriod}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₹{pricing.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 text-center mt-1">
                        +₹{taxAmount.toLocaleString()} Taxes & Fees
                      </p>
                    </>
                  )}
                </div>

                {/* Room Selection Dropdown */}
                <div className="w-full relative group">
                  {(() => {
                    const currentSelection = getCurrentSelection(adultCount);
                    const remainingWithCurrent =
                      availableRooms + currentSelection;
                    const maxSelectable = Math.min(remainingWithCurrent, 10);

                    return (
                      <>
                        <select
                          value={currentSelection}
                          onChange={(e) => {
                            const quantity = Number(e.target.value);

                            if (onRoomSelect && roomId) {
                              onRoomSelect({
                                roomId,
                                roomName: roomName || roomType,
                                planName: planName || "CP",
                                planId: planId || 1,
                                planFeatures: features.map((f) => f.text),
                                quantity,
                                pricePerNight: pricing.totalPrice,
                                childPrice: childPricing,
                                isExtraBed: pricing.extraAdults > 0,
                                adults: adultCount,
                              });
                            }
                          }}
                          disabled={
                            isDisabled ||
                            !isPriceValid ||
                            (availableRooms === 0 && currentSelection === 0) ||
                            childrenExceedMax
                          }
                          className={`w-full p-1 rounded-lg font-semibold text-sm text-center transition-all min-h-[35px] ${
                            isDisabled ||
                            !isPriceValid ||
                            (availableRooms === 0 && currentSelection === 0) ||
                            childrenExceedMax
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-orange-500 to-orange-400 text-white cursor-pointer hover:shadow-lg"
                          }`}
                          style={{
                            color:
                              isDisabled ||
                              !isPriceValid ||
                              (availableRooms === 0 &&
                                currentSelection === 0) ||
                              childrenExceedMax
                                ? "#6b7280"
                                : "white",
                          }}
                          title={`${remainingWithCurrent} available`}
                        >
                          <option value={0} className="bg-white text-gray-900">
                            Select
                          </option>
                          {Array.from(
                            { length: maxSelectable },
                            (_, i) => i + 1,
                          ).map((num) => (
                            <option
                              key={num}
                              value={num}
                              className="bg-white text-gray-900"
                            >
                              {num}
                            </option>
                          ))}
                        </select>
                        {/* Show remaining count */}
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          {remainingWithCurrent > 0
                            ? `${remainingWithCurrent} left`
                            : "Sold out"}
                        </div>
                      </>
                    );
                  })()}

                  {/* Tooltip for disabled state */}
                  {isDisabled && disabledMessage && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      <div className="relative">
                        {disabledMessage}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}

                  {/* Tooltip for children exceed max */}
                  {childrenExceedMax && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg max-w-xs">
                      <div className="relative">
                        Maximum {maximumChildren} chargeable{" "}
                        {maximumChildren === 1 ? "child" : "children"} (age 6+)
                        allowed. Children under 6 are free.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      {showFeaturesModal && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowFeaturesModal(false)}
          />
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200 border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-gray-900">Room Features</h3>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <svg className="w-[18px] h-[18px] text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700 text-[14px] font-medium leading-relaxed">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white py-2.5 px-6 rounded-xl font-bold transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function RoomCard({
  images,
  roomType,
  roomData,
  pricingData,
  availableRooms,
  childrenAges = [],
  onRoomSelect,
  isDisabled = false,
  disabledMessage = "",
  searchAdults = 1,
  selectedRoomsByKey = {},
  roomId,
  promotionDetails = [],
  searchDates,
}: {
  images: string[];
  roomType: string;
  roomData?: any;
  pricingData?: any;
  availableRooms?: number;
  childrenAges?: number[];
  onRoomSelect?: (roomData: any) => void;
  isDisabled?: boolean;
  selectedRoomsByKey?: { [key: string]: number };
  roomId?: number;
  disabledMessage?: string;
  searchAdults?: number;
  promotionDetails?: any[];
  searchDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
  };
}) {
  // Lightbox hook
  const {
    isOpen,
    images: lightboxImages,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  const baseAdults = roomData?.base_adults || 1;
  const maximumOccupancy = roomData?.maximum_occupancy || 0;
  const maximumAdults = roomData?.maximum_adults || baseAdults;
  const totalMaxAdults =
    maximumOccupancy > 0
      ? Math.max(baseAdults, maximumOccupancy)
      : Math.max(baseAdults, maximumAdults);
  const maximumChildren = roomData?.maximum_children || 0;

  const adultOptions: number[] = [];
  for (let i = baseAdults; i <= totalMaxAdults; i++) {
    adultOptions.push(i);
  }

  const [selectedBedType, setSelectedBedType] = useState<number>(searchAdults);

  useEffect(() => {
    setSelectedBedType(searchAdults);
  }, [searchAdults]);

  const getBedTypeLabel = (count: number) => {
    if (count === 1) return "Single";
    if (count === 2) return "Double";
    if (count === 3) return "Triple";
    if (count === 4) return "Quadruple";
    return `${count} Beds`;
  };

  const getBedDisplayPrice = (adultCount: number) => {
    const firstPlan = roomData?.plans?.[0];
    const planPricing = firstPlan
      ? pricingData?.[firstPlan.plan_name?.toLowerCase()] ||
        pricingData?.[firstPlan.plan || firstPlan.id]
      : null;

    const singleRate =
      planPricing?.sbr_rate ||
      roomData?.sbr_rate ||
      roomData?.ep_rate ||
      3051;
    const doubleRate =
      planPricing?.dbr_rate ||
      roomData?.dbr_rate ||
      3381;
    const extraRate =
      planPricing?.extra_bed_rate ||
      roomData?.extra_bed_rate ||
      0;

    let base = singleRate;
    let baseCovered = 1;
    if (adultCount >= 2 && doubleRate > 0) {
      base = doubleRate;
      baseCovered = 2;
    }
    const extra = Math.max(0, adultCount - baseCovered);
    const rawPrice = Math.round(base + extra * extraRate);

    const apiPromo =
      roomData?.id && firstPlan
        ? calculateRoomPlanPromotionalPricing(
            rawPrice,
            roomData.id,
            firstPlan.plan || firstPlan.id,
            promotionDetails,
            searchDates?.checkIn,
            searchDates?.checkOut,
          )
        : null;

    if (apiPromo && apiPromo.hasPromotion) {
      return apiPromo.discountedPrice;
    }

    return Math.round(rawPrice * 0.8);
  };
  // Helper function to get pricing from API data
  const getRoomPricing = (roomData: any, pricingData?: any) => {
    // Use API pricing data if available
    const cpPricing = pricingData?.cp;
    const epPricing = pricingData?.ep;

    const basePrice = cpPricing?.sbr_rate || 0;
    const originalPrice = epPricing?.sbr_rate || Math.round(basePrice * 1.4);
    const taxAmount = Math.round(basePrice * 0.12); // 12% GST
    const memberRate = Math.round(basePrice * 0.9);

    return {
      basePrice: basePrice,
      originalPrice: originalPrice,
      taxAmount: taxAmount,
      memberRate: memberRate,
      breakfastPrice: cpPricing?.sbr_rate || Math.round(basePrice * 1.2),
      breakfastOriginalPrice: Math.round(
        (cpPricing?.sbr_rate || basePrice) * 1.4,
      ),
      extraBedRate: cpPricing?.extra_bed_rate || 0,
      childRate: cpPricing?.child_6_10_rate || 0,
    };
  };

  const pricing = getRoomPricing(roomData, pricingData);

  // Generate features based on actual room data
  const generateRoomFeatures = (roomData: any, includeBreakfast = false) => {
    const features = [];

    // Meal information
    if (includeBreakfast) {
      features.push({
        text: "Breakfast Included",
        icon: <FastfoodIcon />,
        type: "icon" as const,
      });
    } else {
      features.push({ text: "No meals included", type: "bullet" as const });
    }

    // Room-specific features based on actual data
    if (roomData?.extra_bed_allowed) {
      features.push({
        text: `Extra ${roomData.extra_bed_type || "bed"} available`,
        type: "bullet" as const,
      });
    }

    if (roomData?.smoking_allowed) {
      features.push({ text: "Smoking allowed", type: "bullet" as const });
    } else if (roomData?.smoking_allowed === false) {
      features.push({ text: "Non-smoking room", type: "bullet" as const });
    }

    if (roomData?.suitable_for_kids) {
      features.push({ text: "Child-friendly", type: "bullet" as const });
    }

    if (roomData?.pets_allowed) {
      features.push({ text: "Pet-friendly", type: "bullet" as const });
    }

    // Add some common hotel features (these could come from hotel-level data)
    // features.push(
    //   { text: "Early Check-In subject to availability", icon: <ClockIcon />, type: "icon" as const },
    //   { text: "Late Check-out subject to availability", icon: <ClockIcon />, type: "icon" as const }
    // );

    // Cancellation policy based on room data
    if (roomData?.cancellation_policy) {
      features.push({
        text: roomData.cancellation_policy,
        type: "bullet" as const,
      });
    } else {
      features.push({
        text: "Standard cancellation policy",
        type: "bullet" as const,
      });
    }

    return features;
  };

  const roomOnlyFeatures = generateRoomFeatures(roomData, false);
  const roomWithBreakfastFeatures = generateRoomFeatures(roomData, true);

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 w-full max-w-[1287px]">
      {/* Upgrade Banner */}
      {roomData?.upgrade_available && (
        <div className="rounded-tl-[15px] rounded-tr-[15px] bg-orange-50">
          <div className="px-5 py-3.5">
            <p className=" text-[#4a4a4a] text-[16px] leading-[19px]">
              {roomData.upgrade_message ||
                `Upgrade to a room with ${roomData.upgrade_features || "Balcony, and larger size"} for ₹${roomData.upgrade_price || "151"}`}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-2 rounded-bl-[20px] rounded-br-[20px] lg:items-start relative">
        {/* Left side - Room image and details */}
        <div className="p-5 lg:w-[343px] lg:sticky lg:top-[190px] h-fit self-start">
          <div className="flex flex-col gap-4">
            <RoomImage
              images={images}
              roomName={roomData?.room_name || roomType}
              photoCount={roomData?.images?.length || images.length}
              onImageClick={() => openLightbox(images, 0)}
            />

            <div className="flex flex-col  gap-x-6 gap-y-2 w-full">
              <div className="flex items-center justify-between">
                <h2
                  className=" text-black text-lg
                 font-bold leading-[normal]"
                >
                  {roomData?.room_name ||
                    roomData?.costume_room_name ||
                    roomType}
                </h2>
                {/* {availableRooms !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${availableRooms > 5 ? 'bg-green-100 text-green-700' :
                    availableRooms > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {availableRooms > 0 ? `${availableRooms} available` : 'Sold out'}
                  </span>
                )} */}
              </div>

              <RoomDetails
                size={
                  roomData?.dimensions ? `${roomData.dimensions} sq.ft` : ""
                }
                view={roomData?.room_view}
                bed={
                  roomData?.no_of_beds && roomData?.bed_type
                    ? `${roomData.no_of_beds} ${roomData.bed_type} Bed${roomData.no_of_beds > 1 ? "s" : ""}`
                    : ""
                }
                bathroom={
                  roomData?.facilitiesDetails
                    ? (() => {
                        const bathCount = roomData.facilitiesDetails.filter(
                          (f: any) =>
                            f.name.toLowerCase().includes("bath") ||
                            f.name.toLowerCase().includes("toilet") ||
                            f.name.toLowerCase().includes("washroom"),
                        ).length;
                        return bathCount > 0
                          ? `${bathCount} Bathroom${bathCount > 1 ? "s" : ""}`
                          : "";
                      })()
                    : ""
                }
              />

              <RoomAmenities amenities={roomData?.facilitiesDetails} />

              {/* <div className="bg-clip-text bg-gradient-to-r  from-[#fc6e1e] text-[14px] to-[#f0ac70] to-[112.78%]" style={{ WebkitTextFillColor: "transparent" }}>
                <p className="leading-[18px]">More Details</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Vertical separator */}
        <div className="hidden lg:flex items-center justify-center self-stretch shrink-0 w-[1px]">
          <div className="h-full w-[1px] bg-[#E5E7EB]" />
        </div>

        {/* Right side - Booking options */}
        <div className="flex flex-col md:gap-4 gap-3 p-5 flex-1">
          {/* Show all available plans dynamically */}
          {roomData?.plans?.map((plan: any, index: number) => {
            const planPricing =
              pricingData?.[
                plan.plan_name.toLowerCase() as keyof typeof pricingData
              ];
            const planPrice = planPricing?.sbr_rate || 0;
            const planOriginalPrice = Math.round(planPrice * 1.4);
            const planTaxes = Math.round(planPrice * 0.12);
              console.log("roomData---------",roomData)
            // Generate features for this plan
            const planFeatures =
              plan.plan_items?.map((item: any) => ({
                text: item.name,
                type: "bullet" as const,
              })) || [];

            // Add room-specific features
            if (roomData?.extra_bed_allowed) {
              planFeatures.push({
                text: `Extra ${roomData.extra_bed_type || "bed"} available`,
                type: "bullet" as const,
              });
            }
            // if (roomData?.smoking_allowed === false) {
            //   planFeatures.push({
            //     text: "Non-smoking room",
            //     type: "bullet" as const,
            //   });
            // }

            // Map abbreviated plan names to full user-friendly descriptions
            const getPlanDisplayName = (planName: string) => {
              switch (planName?.trim().toUpperCase()) {
                case 'EP': return 'Room Only';
                case 'CP': return 'Room with Breakfast Included';
                case 'MAP': return 'Room with Breakfast and Lunch or Dinner Included';
                case 'AP': return 'Breakfast, Lunch & Dinner Included';
                default: return `Room with ${planName}`;
              }
            };
            // const getPlanDisplayName = (planName: string) => {
            //   switch (planName?.trim().toUpperCase()) {
            //     case 'EP': return 'Room Only';
            //     case 'CP': return 'Room with Breakfast Included';
            //     case 'MAP': return 'Room with Breakfast and Lunch or Dinner Included';
            //     case 'AP': return 'Breakfast, Lunch & Dinner Included';
            //     default: return `Room with ${planName}`;
            //   }
            // };

            return (
              <React.Fragment key={plan.id}>
                {index > 0 && <div className="h-[1px] bg-[#E5E7EB] w-full" />}
                <BookingOption
                  title={getPlanDisplayName(plan.plan_name)}
                  features={planFeatures}
                  originalPrice={`₹ ${planOriginalPrice.toLocaleString()}`}
                  discountedPrice={`₹ ${planPrice.toLocaleString()}`}
                  taxes={`+₹ ${planTaxes} Taxes & Fees`}
                  roomType={getPlanDisplayName(plan.plan_name)}
                  memberRate={Math.round(planPrice * 0.9)}
                  planName={plan.plan_name}
                  planId={plan.plan || plan.id}
                  baseAdults={roomData?.base_adults || 1}
                  maximumAdults={
                    roomData?.maximum_adults || roomData?.base_adults
                  }
                  maximumOccupancy={roomData?.maximum_occupancy || 0}
                  maximumChildren={roomData?.maximum_children || 0}
                  extraBedAllowed={roomData?.extra_bed_allowed || false}
                  availableRooms={availableRooms}
                  extraBedPrice={planPricing?.extra_bed_rate || 0}
                  pricingData={planPricing}
                  childrenAges={childrenAges}
                  roomId={roomId}
                  roomName={roomData?.room_name || roomData?.costume_room_name}
                  roomData={roomData}
                  onRoomSelect={onRoomSelect}
                  isDisabled={isDisabled}
                  disabledMessage={disabledMessage}
                  searchAdults={searchAdults}
                  selectedRoomsByKey={selectedRoomsByKey}
                  promotionDetails={promotionDetails}
                  searchDates={searchDates}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Lightbox Component */}
      <Lightbox
        images={lightboxImages}
        isOpen={isOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText={roomData?.room_name || roomType || "Room Images"}
      />
    </div>
  );
}

interface SelectedRoom {
  roomId: number;
  roomName: string;
  planName: string;
  planId?: number;
  planFeatures: string[];
  quantity: number;
  pricePerNight: number;
  isExtraBed: boolean;
  adults: number;
}

function mapBackendSelectionToSelectedRooms(
  records: Array<{ room_id: number; plan_id: number; adults: number; qty: number }>,
  hotelData: HotelRoomBookingProps["hotelData"],
  pricing: PriceDetail[],
): SelectedRoom[] {
  const groupedRecords: typeof records = [];
  records.forEach((rec) => {
    const match = groupedRecords.find(
      (g) =>
        g.room_id === rec.room_id &&
        g.plan_id === rec.plan_id &&
        g.adults === rec.adults,
    );
    if (match) {
      match.qty += rec.qty;
    } else {
      groupedRecords.push({ ...rec });
    }
  });

  const rooms = hotelData?.rooms || [];
  return groupedRecords.map((rec) => {
    const room = rooms.find((r: { id?: number }) => r.id === rec.room_id);
    const plan = room?.plans?.find(
      (p: { plan?: number; id?: number }) =>
        p.plan === rec.plan_id || p.id === rec.plan_id,
    );
    const pricingEntry = pricing.find(
      (p) => p.room === rec.room_id && p.plan === rec.plan_id,
    );
    let pricePerNight = 0;
    if (pricingEntry) {
      pricePerNight =
        rec.adults === 1
          ? pricingEntry.sbr_rate || 0
          : pricingEntry.dbr_rate || pricingEntry.sbr_rate || 0;
    } else {
      pricePerNight = Number(plan?.price) || 0;
    }

    return {
      roomId: rec.room_id,
      roomName: room?.room_name || room?.costume_room_name || `Room ${rec.room_id}`,
      planName: plan?.plan_name || "CP",
      planId: rec.plan_id,
      planFeatures: plan?.plan_items?.map((item: { name: string }) => item.name) || [],
      quantity: rec.qty,
      pricePerNight,
      isExtraBed: rec.adults > 2,
      adults: rec.adults,
    };
  });
}

function selectedRoomsToKeyMap(rooms: SelectedRoom[]): Record<string, number> {
  const map: Record<string, number> = {};
  rooms.forEach((room) => {
    const key = `${room.roomId}-${room.planId || 1}-${room.adults}`;
    map[key] = room.quantity;
  });
  return map;
}

interface HotelRoomBookingProps {
  hotelData?: any;
  roomPricing?: any[];
  roomInventory?: any[];
  promotionDetails?: any[];
  isPricingLoading?: boolean;
  searchDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
  };
  childrenAges?: number[];
  onRoomSelect?: (roomData: SelectedRoom) => void;
  isDisabled?: boolean;
  disabledMessage?: string;
  entityKey?: string;
}

export default function HotelRoomBooking({
  hotelData,
  roomPricing = [],
  roomInventory = [],
  promotionDetails = [],
  isPricingLoading = false,
  searchDates,
  childrenAges = [],
  onRoomSelect,
  isDisabled = false,
  disabledMessage = "",
  entityKey,
}: HotelRoomBookingProps) {
  const rooms = hotelData?.rooms || [];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { bookingFormData } = useAppSelector(
    (state) => state?.booking ?? { bookingFormData: {} },
  );

  const [bookingId, setBookingId] = useState<string | number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const skipNextSync = useRef(false);
  const isFirstRender = useRef(true);
  const lastSavedSelectionRef = useRef<{
    rooms: SelectedRoom[];
    dates: {
      checkIn: Date | null;
      checkOut: Date | null;
      guests: { adults: number; children: number };
      rooms: number;
      childrenAges: number[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("booking_id");
    if (id) setBookingId(id);
  }, []);

  // Debug: Log when promotionDetails changes
  useEffect(() => {
    console.log("🏨 HotelRoomBooking received promotionDetails:", {
      length: promotionDetails?.length || 0,
      hasData: promotionDetails && promotionDetails.length > 0,
      data: promotionDetails,
    });
  }, [promotionDetails]);

  // State for selected rooms - Track by roomId-planId-adultCount
  const [selectedRoomsByKey, setSelectedRoomsByKey] = useState<{
    [key: string]: number;
  }>({});


  const queryClient = useQueryClient();

  const [appliedSearch, setAppliedSearch] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
    rooms: number;
    childrenAges: number[];
    applyKey: number;
  }>(() => ({
    checkIn: searchDates?.checkIn ?? new Date(),
    checkOut: searchDates?.checkOut ?? new Date(Date.now() + 86400000),
    guests: {
      adults: searchDates?.guests?.adults ?? 1,
      children: searchDates?.guests?.children ?? 0,
    },
    rooms: 1,
    childrenAges: childrenAges?.length ? childrenAges : [],
    applyKey: 0,
  }));

  const handleApplyDateSearch = useCallback(
    (params: ChangeDatesGuestsSearchParams) => {
      setAppliedSearch((prev) => ({
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: { ...params.guests },
        rooms: params.rooms,
        childrenAges: [...params.childrenAges],
        applyKey: prev.applyKey + 1,
      }));
      setSelectedRoomsByKey({});

      queryClient.invalidateQueries({ queryKey: ["roomPricing"] });
      queryClient.invalidateQueries({ queryKey: ["roomAvailability"] });

      requestAnimationFrame(() => {
        document
          .getElementById("rooms")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [queryClient],
  );

  const propertyId = hotelData?.id?.toString();
  const searchStartDate = appliedSearch.checkIn
    ? format(appliedSearch.checkIn, "yyyy-MM-dd")
    : null;
  const searchEndDate = appliedSearch.checkOut
    ? format(appliedSearch.checkOut, "yyyy-MM-dd")
    : null;

  const {
    data: pricingResponse,
    isLoading: isPricingQueryLoading,
    isFetching: isPricingFetching,
  } = useQuery({
    queryKey: [
      "roomPricing",
      propertyId,
      searchStartDate,
      searchEndDate,
      appliedSearch.applyKey,
    ],
    queryFn: () =>
      getRoomInventoryAndPricing({
        propertyId: propertyId!,
        customerType: null,
        startDate: searchStartDate!,
        endDate: searchEndDate!,
      }),
    enabled: !!propertyId && !!searchStartDate && !!searchEndDate,
  });

  const {
    data: availabilityResponse,
    isFetching: isAvailabilityFetching,
  } = useQuery({
    queryKey: [
      "roomAvailability",
      propertyId,
      searchStartDate,
      searchEndDate,
      appliedSearch.applyKey,
    ],
    queryFn: () =>
      checkRoomAvailability({
        listing: propertyId!,
        start_date: searchStartDate!,
        end_date: searchEndDate!,
      }),
    enabled: !!propertyId && !!searchStartDate && !!searchEndDate,
    retry: false,
  });

  const activeRoomPricing = useMemo<PriceDetail[]>(() => {
    if (roomPricing.length > 0) return roomPricing;
    return pricingResponse?.data?.price_detail ?? [];
  }, [roomPricing, pricingResponse]);

  const activePromotionDetails = useMemo(() => {
    if (promotionDetails.length > 0) return promotionDetails;
    return pricingResponse?.data?.promotion_detail ?? [];
  }, [promotionDetails, pricingResponse]);

  const activeRoomInventory = useMemo<RoomDetail[]>(() => {
    if (roomInventory.length > 0) return roomInventory;
    return (pricingResponse?.data?.room_detail ?? []).map((room) => ({
      ...room,
      available_rooms: Math.max(0, (room.value || 0) - (room.sold || 0)),
    }));
  }, [roomInventory, pricingResponse]);

  const showRoomShimmer =
    appliedSearch.applyKey > 0 &&
    (isPricingFetching ||
      isAvailabilityFetching ||
      isPricingQueryLoading);

  const isHotelAvailable =
    !availabilityResponse?.data ||
    (availabilityResponse.data.status === "success" &&
      availabilityResponse.data.available === "yes");

  const activeSearchDates = {
    checkIn: appliedSearch.checkIn,
    checkOut: appliedSearch.checkOut,
    guests: appliedSearch.guests,
  };
  const appliedChildrenAges = appliedSearch.childrenAges;

  // Helper function to get pricing for a specific room and plan
  const getRoomPlanPricing = (roomId: number, planId: number) => {
    return activeRoomPricing.find((p) => p.room === roomId && p.plan === planId);
  };

  // Helper function to get BASE inventory for a specific room (value - sold)
  // Returns the MINIMUM available rooms across all dates in the range
  const getBaseRoomInventory = (
    roomId: number,
  ): { total: number; sold: number; available: number } => {
    const inventory = activeRoomInventory.filter((inv) => inv.room === roomId);

    if (inventory.length === 0) {
      const room = rooms.find((r: { id?: number }) => r.id === roomId);
      const fallbackAvailable = room?.no_of_rooms ?? 10;
      return {
        total: fallbackAvailable,
        sold: 0,
        available: fallbackAvailable,
      };
    }
    // This ensures we don't oversell if one date has fewer rooms
    console.log(`\n=== ROOM ${roomId} INVENTORY BREAKDOWN ===`);
    const availabilityPerDate = inventory.map((inv) => {
      const available = Math.max(0, (inv.value || 0) - (inv.sold || 0));
      console.log(
        `Date: ${inv.season_start || "N/A"} | Value: ${inv.value || 0} | Sold: ${inv.sold || 0} | Available: ${available}`,
      );
      return available;
    });

    const minAvailable = Math.min(...availabilityPerDate);
    const totalValue = inventory.reduce(
      (sum, inv) => sum + (inv.value || 0),
      0,
    );
    const totalSold = inventory.reduce((sum, inv) => sum + (inv.sold || 0), 0);

    console.log(`MINIMUM Available across all dates: ${minAvailable}`);
    console.log(`Total Value: ${totalValue}, Total Sold: ${totalSold}`);
    console.log(`=========================================\n`);

    return { total: totalValue, sold: totalSold, available: minAvailable };
  };

  // Calculate total selected rooms for a specific room type (across all plans and adult counts)
  const getTotalSelectedForRoomType = (roomId: number): number => {
    let total = 0;
    Object.keys(selectedRoomsByKey).forEach((key) => {
      const [keyRoomId] = key.split("-").map(Number);
      if (keyRoomId === roomId) {
        total += selectedRoomsByKey[key];
      }
    });
    console.log(`Room ${roomId} total selected: ${total}`);
    return total;
  };

  // Calculate remaining available rooms for a room type (considering selections)
  const getRemainingRoomsForType = (roomId: number): number => {
    const baseInventory = getBaseRoomInventory(roomId);
    const totalSelected = getTotalSelectedForRoomType(roomId);
    const remaining = baseInventory.available - totalSelected;

    console.log(
      `Room ${roomId} - Base Available: ${baseInventory.available}, Selected: ${totalSelected}, Remaining: ${remaining}`,
    );
    return Math.max(0, remaining);
  };

  // Helper function to handle room selection from BookingOption
  const handleRoomSelectionFromOption = (roomData: any) => {
    const key = `${roomData.roomId}-${roomData.planId}-${roomData.adults}`;

    setSelectedRoomsByKey((prev) => {
      const newState = { ...prev };

      if (roomData.quantity > 0) {
        newState[key] = roomData.quantity;
      } else {
        delete newState[key];
      }

      console.log("Updated selected rooms:", newState);
      return newState;
    });

    // Also call parent's onRoomSelect if provided
    if (onRoomSelect) {
      onRoomSelect(roomData);
    }
  };

  const nights =
    appliedSearch.checkIn && appliedSearch.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (appliedSearch.checkOut.getTime() - appliedSearch.checkIn.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const minLengthOfStay = availabilityResponse?.data?.min_stay || 0;
  const bookingRules = availabilityResponse?.data?.booking_rules || null;

  const hotelImages = useMemo(() => {
    const imgs = hotelData?.images || [];
    return imgs
      .map((img: { file?: string }) => {
        const file = img?.file;
        if (!file) return null;
        if (file.startsWith("http")) return file;
        return `${IMAGE_BASE_URL}${file.startsWith("/") ? "" : "/"}${file}`;
      })
      .filter(Boolean) as string[];
  }, [hotelData?.images]);

  const selectedRoomsList: SelectedRoom[] = Object.keys(selectedRoomsByKey)
    .filter((key) => selectedRoomsByKey[key] > 0)
    .map((key) => {
      const [roomId, planId, adults] = key.split("-").map(Number);
      const quantity = selectedRoomsByKey[key];
      const room = rooms.find((r: { id?: number }) => r.id === roomId);
      const plan = room?.plans?.find(
        (p: { plan?: number; id?: number }) => (p.plan || p.id) === planId,
      );
      const planName = plan?.plan_name || "EP";

      const planPricing = getRoomPlanPricing(roomId, planId);
      const pricePerNight =
        (adults === 1 ? planPricing?.sbr_rate : planPricing?.dbr_rate) ||
        planPricing?.sbr_rate ||
        planPricing?.dbr_rate ||
        (planName.toLowerCase() === "ep"
          ? room?.ep_rate
          : planName.toLowerCase() === "cp"
            ? room?.cp_rate
            : planName.toLowerCase() === "map"
              ? room?.map_rate
              : planName.toLowerCase() === "ap"
                ? room?.ap_rate
                : room?.ep_rate || room?.sbr_rate || 0) ||
        0;

      return {
        roomId,
        planId,
        roomName: room?.room_name || room?.costume_room_name || "Room",
        planName,
        planFeatures: plan?.plan_items?.map((item: { name: string }) => item.name) || [],
        quantity,
        pricePerNight,
        isExtraBed: false,
        adults: adults || 1,
      };
    });

  useEffect(() => {
    const loadBookingFromBackend = async () => {
      if (!bookingId || !hotelData || activeRoomPricing.length === 0) return;

      try {
        const response = await getSelectedRooms(bookingId);
        if (response.data?.status === "success" && response.data?.records) {
          const mappedRooms = mapBackendSelectionToSelectedRooms(
            response.data.records,
            hotelData,
            activeRoomPricing,
          );
          skipNextSync.current = true;
          setSelectedRoomsByKey(selectedRoomsToKeyMap(mappedRooms));
          dispatch(updateBookingFormData({ bookingId }));

          try {
            const summaryResponse = await getBookingSummary(bookingId);
            if (
              summaryResponse.data?.status === "success" &&
              summaryResponse.data?.records
            ) {
              const records = summaryResponse.data.records;
              dispatch(
                updateBookingFormData({
                  apiSummary: records,
                  pricingSummary: mapBookingSummaryToPricing(records),
                }),
              );
            }
          } catch (sumErr) {
            console.error("Error fetching booking summary on mount:", sumErr);
          }

          lastSavedSelectionRef.current = {
            rooms: JSON.parse(JSON.stringify(mappedRooms)),
            dates: {
              checkIn: appliedSearch.checkIn,
              checkOut: appliedSearch.checkOut,
              guests: { ...appliedSearch.guests },
              rooms: appliedSearch.rooms,
              childrenAges: [...appliedSearch.childrenAges],
            },
          };
        }
      } catch (error) {
        console.error("Error loading selected rooms from backend:", error);
      }
    };

    if (
      bookingId &&
      hotelData &&
      activeRoomPricing.length > 0 &&
      isFirstRender.current
    ) {
      isFirstRender.current = false;
      loadBookingFromBackend();
    }
  }, [bookingId, hotelData, activeRoomPricing, dispatch, appliedSearch]);

  useEffect(() => {
    if (!bookingId || !lastSavedSelectionRef.current) return;

    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    const savedDates = lastSavedSelectionRef.current.dates;
    const checkInChanged =
      appliedSearch.checkIn?.getTime() !== savedDates.checkIn?.getTime();
    const checkOutChanged =
      appliedSearch.checkOut?.getTime() !== savedDates.checkOut?.getTime();
    const adultsChanged =
      appliedSearch.guests.adults !== savedDates.guests.adults;
    const childrenChanged =
      appliedSearch.guests.children !== savedDates.guests.children;

    const clearBookingId = () => {
      setBookingId(null);
      dispatch(updateBookingFormData({ bookingId: undefined }));
      const currentUrlParams = new URLSearchParams(window.location.search);
      if (currentUrlParams.has("booking_id")) {
        currentUrlParams.delete("booking_id");
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${currentUrlParams.toString()}`,
        );
      }
    };

    if (checkInChanged || checkOutChanged || adultsChanged || childrenChanged) {
      clearBookingId();
      return;
    }

    const currentRoomsSummary = selectedRoomsList
      .map(
        (r) => `${r.roomId}-${r.planId || 1}-${r.quantity}-${r.adults}`,
      )
      .sort()
      .join(",");
    const savedRoomsSummary = lastSavedSelectionRef.current.rooms
      .map(
        (r) => `${r.roomId}-${r.planId || 1}-${r.quantity}-${r.adults}`,
      )
      .sort()
      .join(",");

    if (currentRoomsSummary !== savedRoomsSummary) {
      clearBookingId();
    }
  }, [selectedRoomsList, appliedSearch, bookingId, dispatch]);

  const checkRoomAvailabilityForDates = (
    roomId: number,
  ): { available: boolean; soldOutDates: string[] } => {
    if (!appliedSearch.checkIn || !appliedSearch.checkOut) {
      return { available: true, soldOutDates: [] };
    }

    const soldOutDates: string[] = [];
    const currentDate = new Date(appliedSearch.checkIn);
    const endDate = new Date(appliedSearch.checkOut);

    while (currentDate < endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const inventory = activeRoomInventory.find(
        (inv) =>
          inv.room === roomId &&
          inv.season_start &&
          format(new Date(inv.season_start), "yyyy-MM-dd") === dateStr,
      );

      if (inventory) {
        const availableRooms = (inventory.value || 0) - (inventory.sold || 0);
        if (availableRooms <= 0) {
          soldOutDates.push(format(currentDate, "MMM dd, yyyy"));
        }
      } else {
        soldOutDates.push(format(currentDate, "MMM dd, yyyy"));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      available: soldOutDates.length === 0,
      soldOutDates,
    };
  };

  const validateRoomOccupancy = () => {
    const searchParamsForValidation: SearchParameters = {
      totalAdults: appliedSearch.guests.adults,
      totalChildren: appliedSearch.guests.children,
      totalRooms: appliedSearch.rooms,
      childrenAges: appliedSearch.childrenAges,
    };

    const roomsForValidation: SelectedRoomForValidation[] = selectedRoomsList
      .filter((room) => room.quantity > 0)
      .map((room) => {
        const roomDetails = rooms.find((r: { id?: number }) => r.id === room.roomId);
        return {
          roomId: room.roomId,
          roomName: room.roomName,
          quantity: room.quantity,
          adults: room.adults,
          capacityData: {
            base_adults: roomDetails?.base_adults || 1,
            maximum_adults: roomDetails?.maximum_adults || 2,
            maximum_children: roomDetails?.maximum_children || 0,
            maximum_occupancy: roomDetails?.maximum_occupancy || 2,
          },
        };
      });

    return validateBeforeCheckout(
      searchParamsForValidation,
      roomsForValidation,
      appliedSearch.childrenAges,
    );
  };

  const validateBooking = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!isHotelAvailable) {
      errors.push(
        "This hotel is not available for the selected dates. Please choose different dates.",
      );
    }

    if (minLengthOfStay > 0 && nights < minLengthOfStay) {
      errors.push(
        `Minimum stay of ${minLengthOfStay} night${minLengthOfStay > 1 ? "s" : ""} is required for the selected dates.`,
      );
    }

    if (selectedRoomsList.length === 0) {
      errors.push("Please select at least one room.");
    }

    if (selectedRoomsList.some((room) => room.quantity <= 0)) {
      errors.push("All selected rooms must have a quantity greater than 0.");
    }

    if (
      appliedSearch.guests.children > 0 &&
      appliedSearch.childrenAges.some((age) => age === 0)
    ) {
      errors.push("Please select age for all children.");
    }

    if (!appliedSearch.checkIn || !appliedSearch.checkOut) {
      errors.push("Please select valid check-in and check-out dates.");
    }

    if (
      appliedSearch.checkOut &&
      appliedSearch.checkIn &&
      appliedSearch.checkOut <= appliedSearch.checkIn
    ) {
      errors.push("Check-out date must be after check-in date.");
    }

    selectedRoomsList.forEach((selectedRoom) => {
      const availabilityCheck = checkRoomAvailabilityForDates(selectedRoom.roomId);
      if (!availabilityCheck.available) {
        errors.push(
          `${selectedRoom.roomName} is not available for all selected dates. Sold out on: ${availabilityCheck.soldOutDates.join(", ")}`,
        );
      }
    });

    if (bookingRules) {
      if (bookingRules.closed_to_arrival) {
        errors.push("Check-in is not allowed on the selected date.");
      }
      if (bookingRules.closed_to_departure) {
        errors.push("Check-out is not allowed on the selected date.");
      }
      if (bookingRules.stop_sell) {
        errors.push("Rooms are not available for booking on the selected dates.");
      }
      if (bookingRules.max_los && nights > bookingRules.max_los) {
        errors.push(`Maximum stay of ${bookingRules.max_los} nights is allowed.`);
      }
    }

    const occupancyValidation = validateRoomOccupancy();
    if (!occupancyValidation.isValid) {
      errors.push(...occupancyValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleBookNow = async () => {
    const validation = validateBooking();
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      setValidationErrors(validation.errors);
      return;
    }

    if (!propertyId) {
      toast.error("Hotel information is missing. Please refresh and try again.");
      return;
    }

    setValidationErrors([]);
    setIsSaving(true);

    try {
      let perDatePricing: PriceDetail[] = [];
      try {
        const pricingResponse = await getRoomInventoryAndPricing({
          propertyId,
          customerType: null,
          startDate: format(appliedSearch.checkIn!, "yyyy-MM-dd"),
          endDate: format(appliedSearch.checkOut!, "yyyy-MM-dd"),
        });
        perDatePricing = pricingResponse?.data?.price_detail || [];
      } catch {
        toast.error("Failed to fetch pricing data. Please try again.");
        setIsSaving(false);
        return;
      }

      const getPricingForDate = (
        roomId: number,
        planId: number,
        dateStr: string,
      ) =>
        perDatePricing.find(
          (p) =>
            p.room === roomId &&
            p.plan === planId &&
            p.season_start &&
            format(new Date(p.season_start), "yyyy-MM-dd") === dateStr,
        );

      const childrenCount = appliedSearch.guests.children;
      let hotelPrice = 0;

      selectedRoomsList.forEach((room) => {
        for (let dayOffset = 0; dayOffset < nights; dayOffset++) {
          const currentDate = new Date(appliedSearch.checkIn!);
          currentDate.setDate(currentDate.getDate() + dayOffset);
          const dateStr = format(currentDate, "yyyy-MM-dd");
          const pricingForDate = getPricingForDate(
            room.roomId,
            room.planId || 1,
            dateStr,
          );

          if (pricingForDate) {
            const roomRate =
              room.adults === 1
                ? pricingForDate.sbr_rate || 0
                : pricingForDate.dbr_rate || 0;
            hotelPrice += roomRate * room.quantity;
          } else {
            hotelPrice += room.pricePerNight * room.quantity;
          }
        }
      });

      let totalChildPrice = 0;
      selectedRoomsList.forEach((room, roomIndex) => {
        if (roomIndex >= childrenCount) return;

        for (let dayOffset = 0; dayOffset < nights; dayOffset++) {
          const currentDate = new Date(appliedSearch.checkIn!);
          currentDate.setDate(currentDate.getDate() + dayOffset);
          const dateStr = format(currentDate, "yyyy-MM-dd");
          const pricingForDate = getPricingForDate(
            room.roomId,
            room.planId || 1,
            dateStr,
          );

          if (pricingForDate) {
            const childAge = appliedSearch.childrenAges[roomIndex] || 0;
            let childRate = 0;
            if (childAge >= 6 && childAge <= 10) {
              childRate = pricingForDate.child_6_10_rate || 0;
            } else if (childAge >= 2 && childAge <= 5) {
              childRate = pricingForDate.child_2_5_rate || 0;
            }
            totalChildPrice += childRate * room.quantity;
          }
        }
      });

      const subtotal = hotelPrice + totalChildPrice;
      const taxationDetails = hotelData?.taxation_details || [];
      const deductionDetails = hotelData?.deduction_details || [];
      const calculationResult = calculateFinalAmount(
        subtotal,
        taxationDetails,
        deductionDetails,
      );
      const gstDetail = calculationResult.taxes.find((t) => t.name === "GST");
      const serviceChargeDetail = calculationResult.deductions.find(
        (d) => d.name === "Service Charge",
      );
      const tax = gstDetail ? gstDetail.amount : 0;
      const serviceCharge = serviceChargeDetail ? serviceChargeDetail.amount : 0;
      const finalPrice = subtotal;

      if (finalPrice <= 0) {
        toast.error("Invalid booking amount. Please check your room selection.");
        setIsSaving(false);
        return;
      }

      let currentBookingId =
        bookingId ||
        new URLSearchParams(window.location.search).get("booking_id") ||
        (bookingFormData as { bookingId?: string | number }).bookingId;

      if (!currentBookingId) {
        const payload = {
          property_id: Number(propertyId),
          check_in: format(appliedSearch.checkIn!, "yyyy-MM-dd"),
          check_out: format(appliedSearch.checkOut!, "yyyy-MM-dd"),
          rooms: buildSaveBookingRoomsPayload(
            selectedRoomsList,
            appliedSearch.guests.children,
          ),
        };

        const response = await saveBooking(payload);
        if (
          response.data?.status === "success" &&
          response.data?.records?.booking_id
        ) {
          currentBookingId = response.data.records.booking_id;
          setBookingId(currentBookingId);
          skipNextSync.current = true;
          lastSavedSelectionRef.current = {
            rooms: JSON.parse(JSON.stringify(selectedRoomsList)),
            dates: {
              checkIn: appliedSearch.checkIn,
              checkOut: appliedSearch.checkOut,
              guests: { ...appliedSearch.guests },
              rooms: appliedSearch.rooms,
              childrenAges: [...appliedSearch.childrenAges],
            },
          };
        } else {
          toast.error("Failed to save booking details. Please try again.");
          setIsSaving(false);
          return;
        }
      }

      if (currentBookingId) {
        const currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set("booking_id", currentBookingId.toString());
        currentUrlParams.set("start_date", format(appliedSearch.checkIn!, "yyyy-MM-dd"));
        currentUrlParams.set("end_date", format(appliedSearch.checkOut!, "yyyy-MM-dd"));
        currentUrlParams.set("no_of_adult", String(appliedSearch.guests.adults));
        currentUrlParams.set("no_of_child", String(appliedSearch.guests.children));
        if (appliedSearch.childrenAges.length > 0) {
          currentUrlParams.set("childInfo", appliedSearch.childrenAges.join(","));
        }
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${currentUrlParams.toString()}`,
        );
      }

      dispatch(
        updateBookingFormData({
          bookingId: currentBookingId || undefined,
          hotelId: propertyId,
          hotelName: hotelData?.name,
          hotelLocation: [
            hotelData?.address,
            hotelData?.city_name,
            hotelData?.state_name,
            hotelData?.country_name,
          ]
            .filter(Boolean)
            .join(", "),
          hotelImages,
          hotelRating: parseInt(String(hotelData?.star_category || "0"), 10),
          hotelCheckInTime: hotelData?.check_in,
          hotelCheckOutTime: hotelData?.check_out,
          checkInDate: format(appliedSearch.checkIn!, "MM/dd/yyyy"),
          checkOutDate: format(appliedSearch.checkOut!, "MM/dd/yyyy"),
          adults: appliedSearch.guests.adults,
          children: appliedSearch.guests.children,
          childrenAges: appliedSearch.childrenAges,
          rooms: selectedRoomsList,
          hotelPrice,
          childPrice: totalChildPrice,
          totalPrice: subtotal,
          finalPrice,
          tax,
          serviceCharge,
          taxationDetails,
          deductionDetails,
          perDatePricing: perDatePricing as Parameters<typeof updateBookingFormData>[0]["perDatePricing"],
          promotionDetails: activePromotionDetails,
          cancellationPolicies: hotelData?.cancellation_policies || [],
          initialSearchAdults: appliedSearch.guests.adults,
          initialSearchChildren: appliedSearch.guests.children,
          initialSearchRooms: appliedSearch.rooms,
          initialSearchChildrenAges: appliedSearch.childrenAges,
        }),
      );

      const checkInStr = format(appliedSearch.checkIn!, "yyyy-MM-dd");
      const checkOutStr = format(appliedSearch.checkOut!, "yyyy-MM-dd");
      const childInfo = appliedSearch.childrenAges.join(",");
      router.push(
        `/booking?booking_id=${currentBookingId || ""}&hotelId=${propertyId}&checkIn=${checkInStr}&checkOut=${checkOutStr}&adults=${appliedSearch.guests.adults}&children=${appliedSearch.guests.children}&childInfo=${childInfo}`,
      );
    } catch (err) {
      console.error("Error during booking:", err);
      toast.error("An error occurred during booking. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearBooking = () => {
    skipNextSync.current = true;
    setSelectedRoomsByKey({});
    setBookingId(null);
    setValidationErrors([]);
    setShowSummaryModal(false);
    lastSavedSelectionRef.current = null;

    dispatch(
      updateBookingFormData({
        bookingId: undefined,
        apiSummary: undefined,
        pricingSummary: undefined,
        appliedCoupon: null,
        memberOnlyPromotion: null,
        rooms: [],
      }),
    );

    const url = new URL(window.location.href);
    url.searchParams.delete("booking_id");
    window.history.replaceState(null, "", url.toString());
    toast.info("Booking selection cleared.");
  };

  const handleViewSummary = async () => {
    const validation = validateBooking();
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      setValidationErrors(validation.errors);
      return;
    }

    if (!propertyId) {
      toast.error("Hotel information is missing. Please refresh and try again.");
      return;
    }

    setValidationErrors([]);

    let perDatePricing: PriceDetail[] = [...activeRoomPricing];
    if (perDatePricing.length === 0) {
      try {
        const pricingResponse = await getRoomInventoryAndPricing({
          propertyId,
          customerType: null,
          startDate: format(appliedSearch.checkIn!, "yyyy-MM-dd"),
          endDate: format(appliedSearch.checkOut!, "yyyy-MM-dd"),
        });
        perDatePricing = pricingResponse?.data?.price_detail || [];
      } catch {
        toast.error("Failed to fetch pricing data. Please try again.");
        return;
      }
    }

    dispatch(
      updateBookingFormData({
        bookingId: bookingId || undefined,
        hotelId: propertyId,
        hotelName: hotelData?.name,
        checkInDate: format(appliedSearch.checkIn!, "MM/dd/yyyy"),
        checkOutDate: format(appliedSearch.checkOut!, "MM/dd/yyyy"),
        adults: appliedSearch.guests.adults,
        children: appliedSearch.guests.children,
        childrenAges: appliedSearch.childrenAges,
        rooms: selectedRoomsList,
        perDatePricing: perDatePricing as Parameters<typeof updateBookingFormData>[0]["perDatePricing"],
        promotionDetails: activePromotionDetails,
        taxationDetails: hotelData?.taxation_details || [],
        deductionDetails: hotelData?.deduction_details || [],
      }),
    );

    let currentBookingId =
      bookingId ||
      new URLSearchParams(window.location.search).get("booking_id") ||
      (bookingFormData as { bookingId?: string | number }).bookingId;

    if (!currentBookingId) {
      try {
        const payload = {
          property_id: Number(propertyId),
          check_in: format(appliedSearch.checkIn!, "yyyy-MM-dd"),
          check_out: format(appliedSearch.checkOut!, "yyyy-MM-dd"),
          rooms: buildSaveBookingRoomsPayload(
            selectedRoomsList,
            appliedSearch.guests.children,
          ),
        };
        const response = await saveBooking(payload);
        if (
          response.data?.status === "success" &&
          response.data?.records?.booking_id
        ) {
          currentBookingId = response.data.records.booking_id;
          setBookingId(currentBookingId);
          dispatch(updateBookingFormData({ bookingId: currentBookingId }));

          const currentUrlParams = new URLSearchParams(window.location.search);
          currentUrlParams.set("booking_id", currentBookingId.toString());
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${currentUrlParams.toString()}`,
          );
        }
      } catch (error) {
        console.error("Error saving booking for summary modal:", error);
      }
    }

    setShowSummaryModal(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1287px] mx-auto relative pb-20 font-manrope">
      
      <Suspense fallback={null}>
        <ChangeDatesGuestsSearch
          hotelCheckInTime={hotelData?.check_in}
          hotelCheckOutTime={hotelData?.check_out}
          onApply={handleApplyDateSearch}
          className="mt-0 mb-4"
        />
      </Suspense>

      {appliedSearch.applyKey > 0 && appliedSearch.checkIn && appliedSearch.checkOut && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-900 font-semibold">
          Showing rates for{" "}
          {format(appliedSearch.checkIn, "d MMM yyyy")} –{" "}
          {format(appliedSearch.checkOut, "d MMM yyyy")} ·{" "}
          {appliedSearch.rooms} {appliedSearch.rooms === 1 ? "Room" : "Rooms"},{" "}
          {appliedSearch.guests.adults}{" "}
          {appliedSearch.guests.adults === 1 ? "Adult" : "Adults"}
          {appliedSearch.guests.children > 0 &&
            `, ${appliedSearch.guests.children} ${appliedSearch.guests.children === 1 ? "Child" : "Children"}`}
        </div>
      )}

      {!isHotelAvailable && availabilityResponse?.data && !showRoomShimmer && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-sm text-red-800">
          This property is not available for the selected dates. Please choose different dates.
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
          <h4 className="text-red-800 font-semibold text-sm mb-2">
            Booking Validation Issues
          </h4>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-700 text-xs md:text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Room Cards */}
      <div className="flex flex-col">
        {rooms.length > 0 ? (
          <>
            {showRoomShimmer ? (
              <HotelRoomTypesListShimmer count={rooms.length} />
            ) : (
              <>
            {rooms.map((room: any, index: number) => {
              const roomImages =
                room.images && room.images.length > 0
                  ? room.images.map((img: any) => img.file)
                  : [IMAGES.listingHeroBg.src];

              const roomPlans = room.plans || [];

              const pricingData: { [key: string]: any } = {};
              roomPlans.forEach((plan: any) => {
                const planName = plan.plan_name?.toLowerCase();
                const planId = plan.plan || plan.id;
                const apiPricing = getRoomPlanPricing(room.id, planId);

                // Fallback rate calculations if API pricing row is missing or 0
                const fallbackSingle =
                  room.sbr_rate || room.single_bed_rate || room.ep_rate || room.cp_rate || 0;
                const fallbackDouble =
                  room.dbr_rate || room.double_bed_rate || fallbackSingle || 0;
                const fallbackExtra =
                  room.extra_bed_rate || room.extra_person_charge || 0;

                const pricingObj = {
                  sbr_rate: apiPricing?.sbr_rate || fallbackSingle,
                  dbr_rate: apiPricing?.dbr_rate || fallbackDouble,
                  extra_bed_rate: apiPricing?.extra_bed_rate || fallbackExtra,
                  child_2_5_rate: apiPricing?.child_2_5_rate || room.child_2_5_rate || 0,
                  child_6_10_rate: apiPricing?.child_6_10_rate || room.child_6_10_rate || 0,
                  ...apiPricing,
                };

                if (planName) {
                  pricingData[planName] = pricingObj;
                }
                if (planId) {
                  pricingData[planId] = pricingObj;
                }
              });

              const remainingRooms = getRemainingRoomsForType(room.id);
              const baseInventory = getBaseRoomInventory(room.id);

              return (
                <div key={`${room.id || index}-${appliedSearch.applyKey}`}>
                  <div className="flex items-center justify-between gap-2 md:mt-6 mb-4">
                    {index === 0 && (
                      <div className="flex items-center gap-2">
                        <h1 className="text-black text-[18px] font-extrabold leading-[21.6px] capitalize">
                          {rooms.length} Room Types Available
                        </h1>
                      </div>
                    )}
                    {/* Inventory Badge */}
                    <div className="hidden lg:flex items-center ml-auto gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          remainingRooms > 5
                            ? "bg-green-100 text-green-700"
                            : remainingRooms > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {remainingRooms} of {baseInventory.available} Available
                      </span>
                    </div>
                  </div>

                  <div className="block lg:hidden">
                    <MobileRoomCard
                      images={roomImages}
                      roomData={room}
                      hotel={hotelData}
                      pricingData={pricingData}
                      availableRooms={remainingRooms}
                      onRoomSelect={handleRoomSelectionFromOption}
                      selectedRoomsByKey={selectedRoomsByKey}
                      promotionDetails={activePromotionDetails}
                      searchDates={activeSearchDates}
                      searchAdults={activeSearchDates.guests?.adults || 1}
                      isDisabled={isDisabled}
                      disabledMessage={disabledMessage}
                    />
                  </div>
                  <div className="hidden lg:block">
                    <RoomCard
                      images={roomImages}
                      roomType={room.room_name || room.costume_room_name || ""}
                      roomData={room}
                      pricingData={pricingData}
                      availableRooms={remainingRooms}
                      childrenAges={appliedChildrenAges}
                      onRoomSelect={handleRoomSelectionFromOption}
                      isDisabled={isDisabled}
                      disabledMessage={disabledMessage}
                      searchAdults={activeSearchDates.guests?.adults || 1}
                      selectedRoomsByKey={selectedRoomsByKey}
                      roomId={room.id}
                      promotionDetails={activePromotionDetails}
                      searchDates={activeSearchDates}
                    />
                  </div>
                </div>
              );
            })}

            {/* Mobile-only Contact/Services Section at the end of room list */}
            <div className="block lg:hidden">
              <MobileRateAddons hotel={hotelData} />
            </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Room Information Available
            </h3>
            <p className="text-gray-600 mb-6">
              Room details are not currently available for this property.
            </p>
            <button className="bg-gradient-to-r from-[#fc6e1e] to-[#f0ac70] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
              Contact Hotel for Room Details
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Pricing Bar */}
      <StickyBookingBar
        selectedRooms={selectedRoomsList}
        isVisible={
          selectedRoomsList.length > 0 &&
          selectedRoomsList.some((room) => room.quantity > 0)
        }
        isValidationPassed={validateBooking().isValid}
        correctHotelPrice={0}
        appliedDates={activeSearchDates}
        isSaving={isSaving}
        bookingId={bookingId}
        onClearBooking={handleClearBooking}
        onViewSummary={handleViewSummary}
        onBookNow={() => {
          const validation = validateBooking();
          if (!validation.isValid) {
            validation.errors.forEach((error) => toast.error(error));
            setValidationErrors(validation.errors);
            return;
          }
          setValidationErrors([]);
          handleBookNow();
        }}
      />

      <PriceBreakdownModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        showBookButton={true}
        onBookNow={() => {
          const validation = validateBooking();
          if (!validation.isValid) {
            validation.errors.forEach((error) => toast.error(error));
            setValidationErrors(validation.errors);
            return;
          }
          setValidationErrors([]);
          setShowSummaryModal(false);
          handleBookNow();
        }}
      />
    </div>
  );
}
