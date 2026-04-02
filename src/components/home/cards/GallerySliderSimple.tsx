"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";
import { Route } from "@/routers/types";
import { variants } from "@/utils/animationVariants";

export interface GallerySliderSimpleProps {
  className?: string;
  galleryImgs: (StaticImageData | string)[];
  uniqueID: string;
  href?: Route<string>;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
  height?: string;
}

// Fallback images for when external images fail
const FALLBACK_IMAGES = [
  "/placeholder.jpg",
  "/placeholder-user.jpg",
  "/placeholder-logo.png",
];

export default function GallerySliderSimple({
  className = "",
  galleryImgs,
  imageClass = "",
  uniqueID = "uniqueID",
  galleryClass = "rounded-xl",
  href = "/listing-stay-detail",
  navigation = true,
  height = "h-48",
}: GallerySliderSimpleProps) {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Validate and filter images
  const images =
    galleryImgs && Array.isArray(galleryImgs) && galleryImgs.length > 0
      ? galleryImgs.filter((img) => img && (typeof img === "string" || img.src))
      : ["/placeholder.jpg"];

  // Reset index if it's out of bounds
  if (index >= images.length) {
    setIndex(0);
  }

  function changePhotoId(newVal: number) {
    if (newVal >= 0 && newVal < images.length) {
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
      if (index < images?.length - 1) {
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

  let currentImage = images[index];

  // Fallback if no current image
  if (!currentImage) {
    currentImage = FALLBACK_IMAGES[0];
  }

  const handleImageError = () => {
    console.warn(`Failed to load image: ${currentImage}`);

    // Try next fallback image
    if (fallbackIndex < FALLBACK_IMAGES.length - 1) {
      setFallbackIndex(fallbackIndex + 1);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image: ${currentImage}`);
    setLoaded(true);
    setImageError(false);
  };

  // Use fallback image if external image failed
  const displayImage = imageError
    ? FALLBACK_IMAGES[fallbackIndex]
    : currentImage;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className={`relative group ${className}`} {...handlers}>
        {/* Main image */}
        <div className={`w-full overflow-hidden ${galleryClass}`}>
          <Link href={href}>
            <div className={`relative ${height} w-full`}>
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
                      alt="listing card gallery"
                      className={`object-cover ${imageClass}`}
                      onLoadingComplete={handleImageLoad}
                      onError={handleImageError}
                      sizes="(max-width: 1025px) 100vw, 300px"
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
                          Image unavailable
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
            </div>
          </Link>
        </div>

        {/* Buttons + bottom nav bar */}
        <>
          {/* Buttons */}
          {loaded && navigation && images.length > 1 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  className="absolute w-8 h-8 left-3 top-[calc(50%-16px)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-6000 dark:hover:border-neutral-500 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none"
                  onClick={() => changePhotoId(index - 1)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
              )}
              {index + 1 < images.length && (
                <button
                  className="absolute w-8 h-8 right-3 top-[calc(50%-16px)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-6000 dark:hover:border-neutral-500 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none"
                  onClick={() => changePhotoId(index + 1)}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Bottom Nav bar */}
          {images.length > 1 && (
            <>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 opacity-50"></div>
              <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5">
                {images?.slice(0, 6)?.map((_, i) => (
                  <button
                    className={`w-2 h-2 rounded-full ${
                      i === index ? "bg-white" : "bg-white/60 "
                    }`}
                    onClick={() => changePhotoId(i)}
                    key={i}
                  />
                ))}
              </div>
            </>
          )}
        </>
      </div>
    </MotionConfig>
  );
}
