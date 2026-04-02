import React, { FC } from "react";
import GallerySliderWrapper from "./GallerySliderWrapper";
import { StayDataType } from "@/data/types";
import StartRating from "./StartRating";
import BtnLikeIcon from "./BtnLikeIcon";
import Badge from "@/shared/Badge";
import Link from "next/link";
import { Bed, HotelIcon, MapPin } from "lucide-react";
import BookNowButton from "@/components/ui/BookNowButton";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { calculatePromotionalPricing } from "@/utils/promotionalPricing";

export interface StayCard2Props {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
  showCity?: boolean;
  onOpenLightbox?: (images: string[], startIndex: number) => void;
  disableInternalLightbox?: boolean;
}

const StayCard2: FC<StayCard2Props> = ({
  size = "default",
  className = "",
  showCity = true,
  data,
  onOpenLightbox,
  disableInternalLightbox = false,
}) => {
  // Lightbox hook (only used if not using external lightbox)
  const {
    isOpen,
    images,
    currentIndex,
    openLightbox: internalOpenLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  // Validate data before destructuring
  if (!data || !data.id || !data.title) {
    return (
      <div className={`nc-StayCard2 group relative ${className}`}>
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg aspect-w-12 aspect-h-11 flex items-center justify-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const {
    galleryImgs,
    listingCategory,
    address,
    title,
    bedrooms,
    href,
    like,
    saleOff,
    city_name,
    isAds,
    price,
    reviewStart,
    reviewCount,
    id,
    has_promotion,
    best_promotion,
    sbr_rate,
  } = data;

  // Calculate promotional pricing
  const originalPrice = sbr_rate || 0;
  const promotionData = calculatePromotionalPricing(
    originalPrice,
    has_promotion || false,
    best_promotion || null,
  );

  const renderSliderGallery = () => {
    // Validate gallery images
    const validGalleryImgs =
      galleryImgs && Array.isArray(galleryImgs) && galleryImgs.length > 0
        ? galleryImgs
        : ["/placeholder.jpg"];

    // Show only first 6 images in slider
    const sliderImages = validGalleryImgs.slice(0, 6);

    // Handle image click to open lightbox
    const handleImageClick = (e: React.MouseEvent, index: number) => {
      // Only open lightbox if clicking on the image itself, not navigation buttons
      const target = e.target as HTMLElement;
      if (target.closest("button")) {
        return; // Let the slider handle navigation
      }
      e.preventDefault();
      e.stopPropagation();
      // Convert images to strings for lightbox
      const imageStrings = validGalleryImgs.map((img) =>
        typeof img === "string" ? img : img.src,
      );

      // Use external lightbox if provided, otherwise use internal
      if (onOpenLightbox) {
        onOpenLightbox(imageStrings, index);
      } else {
        internalOpenLightbox(imageStrings, index);
      }
    };

    return (
      <div className="relative w-full">
        <GallerySliderWrapper
          uniqueID={`StayCard2_${id}`}
          ratioClass="aspect-w-12 aspect-h-11"
          galleryImgs={sliderImages}
          imageClass="rounded-[24px] sm:rounded-[32px]"
          height="h-40 sm:h-64"
          type="card2"
          onImageClick={handleImageClick}
        />
        {/* <BtnLikeIcon isLiked={like} className="absolute  right-3 top-3 z-[1]"/> */}

        {/* Promotion Badge on Image */}
        {promotionData.hasPromotion && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg z-[1]">
            {promotionData.discountText}
          </div>
        )}

        {validGalleryImgs.length > 6 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded-full z-[1]">
            +{validGalleryImgs.length - 6} more
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={`-mt-8 sm:-mt-11 bg-white shadow-lg relative z-10 rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-7 flex-1 flex flex-col`}
      >
        <div className="space-y-2">
          {/* rating */}
          {!!reviewStart && (
            <div className="flex items-center justify-end space-x-2 absolute -top-4 bg-white right-3 rounded-full px-2 py-1 border border-gray-200">
              <StartRating reviewCount={reviewStart || 0} point={reviewCount} />
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isAds && <Badge name="ADS" color="green" />}
            <h2
              className={` capitalize card-text-heading text-[12px] sm:text-base lg:text-lg line-clamp-1`}
            >
              {title}
            </h2>
          </div>
          <span className="text-[9px] sm:text-sm flex items-center gap-x-1 card-text-subheading line-clamp-1">
            <HotelIcon className="w-2.5 h-2.5 sm:w-4 sm:h-4" />{" "}
            {listingCategory?.name || "Hotel"}
          </span>
          {showCity && (
            <span className="text-[9px] sm:text-sm flex items-center gap-x-1 card-text-subheading line-clamp-1">
              <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> {city_name}
            </span>
          )}
        </div>
        {/* <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-2 sm:pt-4 gap-2">
          <div className="flex flex-col">
            {promotionData.hasPromotion ? (
              <>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-sm text-red-500 line-through">
                    ₹{promotionData.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-gray-900">
                    ₹{promotionData.discountedPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-neutral-500">
                  / person
                </span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  ₹{Math.round(originalPrice).toLocaleString()}
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-500">
                  / person
                </span>
              </>
            )}
          </div>
          <BookNowButton
            size="sm"
            className="py-1 px-3 sm:px-4 text-[10px] sm:text-xs w-full sm:w-auto"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-StayCard2 group relative h-full flex flex-col ${className}`}
      >
        {renderSliderGallery()}
        <Link target="_blank" href={href} className="flex-1 flex flex-col">
          {renderContent()}
        </Link>
      </div>

      {/* Lightbox Component - only render if not using external lightbox */}
      {!disableInternalLightbox && (
        <Lightbox
          images={images}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onIndexChange={setIndex}
          altText={title || "Hotel Images"}
        />
      )}
    </>
  );
};

export default StayCard2;
