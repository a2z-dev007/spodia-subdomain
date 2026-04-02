import React, { FC } from "react";
import GallerySliderWrapper from "./GallerySliderWrapper";
import { StayDataType } from "@/data/types";
import StartRating from "./StartRating";
import BtnLikeIcon from "./BtnLikeIcon";
import Link from "next/link";
import BookNowButton from "@/components/ui/BookNowButton";
import { MapPin } from "lucide-react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { calculatePromotionalPricing } from "@/utils/promotionalPricing";

export interface StayCardProps {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
}

const StayCard: FC<StayCardProps> = ({
  size = "default",
  className = "",
  data,
}) => {
  // Lightbox hook
  const {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  // Validate data before destructuring
  if (!data || !data.id || !data.title) {
    return (
      <div
        className={`nc-StayCard group relative  ${
          size === "default"
            ? "border border-neutral-100 dark:border-neutral-800 "
            : ""
        } rounded-2xl overflow-hidden hover:shadow-xl transition-shadow ${className}`}
        data-nc-id="StayCard"
      >
        <div className="bg-neutral-100 dark:bg-neutral-800 aspect-w-4 aspect-h-3 flex items-center justify-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const {
    galleryImgs,
    title,
    href,
    like,
    reviewStart,
    reviewCount,
    id,
    city_name,
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
      openLightbox(imageStrings, index);
    };

    return (
      <div className="relative w-full">
        <GallerySliderWrapper
          uniqueID={`StayCard_${id}`}
          ratioClass="aspect-w-4 aspect-h-3"
          galleryImgs={sliderImages}
          imageClass="rounded-t-2xl"
          galleryClass="rounded-t-2xl"
          height="h-32 sm:h-48"
          type="card1"
          onImageClick={handleImageClick}
        />
        {/* <BtnLikeIcon isLiked={like} className="absolute right-3 top-3 z-[1]" /> */}

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
      <div className="px-3 sm:px-5 py-3 sm:py-5">
        <div className="space-y-3">
          {/* Hotel Name */}
          <h2 className="capitalize card-text-heading text-[13px] sm:text-[15px] lg:text-[17px] line-clamp-1 group-hover:text-orange-600 transition-colors">
            {title}
          </h2>

          {/* Location and Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-x-1 card-text-subheading flex-1 min-w-0 text-[10px] sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">
                {city_name || "Address not available"}
              </span>
            </span>
            {!!reviewStart && (
              <StartRating
                reviewCount={reviewStart || 0}
                point={Math.floor(reviewCount)}
              />
            )}
          </div>

          {/* Pricing Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-2 gap-2">
            <div className="flex flex-col">
              {promotionData.hasPromotion ? (
                <>
                  <div className="flex items-baseline gap-1 sm:gap-1.5">
                    <span className="text-[10px] sm:text-sm text-red-500 line-through font-medium">
                      ₹{promotionData.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm sm:text-xl font-bold text-gray-900">
                      ₹{promotionData.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-neutral-500">
                    / person
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-xl font-bold text-gray-900">
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
              variant="gradient"
              className="w-full sm:w-auto text-[10px] sm:text-xs py-1 px-3"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-StayCard group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}
        data-nc-id="StayCard"
      >
        {renderSliderGallery()}
        <Link target="_blank" href={href}>
          {renderContent()}
        </Link>
      </div>

      {/* Lightbox Component */}
      <Lightbox
        images={images}
        isOpen={isOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText={title || "Hotel Images"}
      />
    </>
  );
};

export default StayCard;
