"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";

export interface RoomImageCarouselProps {
  className?: string;
  images: string[];
  roomName: string;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
  height?: string;
  photoCount?: number;
}

// Fallback images for when external images fail
const FALLBACK_IMAGES = [
  "/placeholder.jpg",
  "/placeholder-user.jpg",
  "/placeholder-logo.png",
];

export default function RoomImageCarousel({
  className = "",
  images,
  roomName,
  imageClass = "",
  galleryClass = "rounded-[4px]",
  navigation = true,
  height = "h-[220px]",
  photoCount,
}: RoomImageCarouselProps) {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Validate and filter images
  const roomImages = images && Array.isArray(images) && images.length > 0
    ? images.filter(img => img && typeof img === 'string')
    : ["/placeholder.jpg"];

  // Reset index if it's out of bounds
  if (index >= roomImages.length) {
    setIndex(0);
  }

  function changePhotoId(newVal: number) {
    if (newVal >= 0 && newVal < roomImages.length) {
      if (newVal > index) {
        setDirection(1);
      } else {
        setDirection(-1);
      }
      setIndex(newVal);
      setImageError(false);
      setFallbackIndex(0);
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < roomImages?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = roomImages[index];

  // Fallback if no current image
  if (!currentImage) {
    currentImage = FALLBACK_IMAGES[0];
  }

  const handleImageError = () => {
    console.warn(`Failed to load room image: ${currentImage}`);

    // Try next fallback image
    if (fallbackIndex < FALLBACK_IMAGES.length - 1) {
      setFallbackIndex(fallbackIndex + 1);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded room image: ${currentImage}`);
    setLoaded(true);
    setImageError(false);
  };

  // Use fallback image if external image failed
  const displayImage = imageError ? FALLBACK_IMAGES[fallbackIndex] : currentImage;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className={`relative group ${className}`}
        {...handlers}
      >
        {/* Main image */}
        <div className={`w-full overflow-hidden relative ${galleryClass} ${height}`}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`${index}-${fallbackIndex}`}
              custom={direction}
              variants={variants(340, 1)}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {!imageError || fallbackIndex < FALLBACK_IMAGES.length ? (
                <Image
                  src={displayImage || ""}
                  fill
                  alt={`${roomName} - Room Image ${index + 1}`}
                  className={`object-cover ${imageClass}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  sizes="(max-width: 1025px) 100vw, 343px"
                  priority={index === 0}
                />
              ) : (
                // Final fallback when all images fail
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-neutral-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Room image unavailable
                    </p>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {!loaded && !imageError && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600"></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {loaded && navigation && roomImages.length > 1 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  className="absolute w-8 h-8 left-3 top-[calc(50%-16px)] bg-white/90 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none shadow-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    changePhotoId(index - 1);
                  }}
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
                </button>
              )}
              {index + 1 < roomImages.length && (
                <button
                  className="absolute w-8 h-8 right-3 top-[calc(50%-16px)] bg-white/90 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none shadow-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    changePhotoId(index + 1);
                  }}
                >
                  <ChevronRightIcon className="h-4 w-4 text-gray-700" />
                </button>
              )}
            </div>
          )}

          {/* Photo Count Badge */}
          {/* <div className="absolute bg-white bottom-4 h-[21px] left-4 rounded-[11px] px-3 shadow-sm z-10">
            <div className="absolute bg-clip-text bg-gradient-to-r flex flex-col from-[#fc6e1e] h-[15px] justify-center left-3.5 text-[12px] to-[#f0ac70] to-[112.78%] top-1/2 translate-y-[-50%] uppercase w-auto" style={{ WebkitTextFillColor: "transparent" }}>
              <p className="leading-[normal] whitespace-nowrap">
                {photoCount || roomImages.length} photo{(photoCount || roomImages.length) !== 1 ? 's' : ''}
              </p>
            </div>
          </div> */}

          {/* Bottom Nav Dots */}
          {roomImages.length > 1 && (
            <>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900/50 opacity-50 rounded-b-[4px]"></div>
              <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5 z-10">
                {roomImages?.slice(0, 6)?.map((_, i) => (
                  <button
                    className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/60"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      changePhotoId(i);
                    }}
                    key={i}
                  />
                ))}
                {roomImages.length > 6 && (
                  <span className="text-white text-xs ml-1">+{roomImages.length - 6}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}