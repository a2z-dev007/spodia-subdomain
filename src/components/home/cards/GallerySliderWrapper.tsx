"use client";

import { useState, useEffect } from "react";
import GallerySlider from "./GallerySlider";
import GallerySliderSimple from "./GallerySliderSimple";

export interface GallerySliderWrapperProps {
  className?: string;
  galleryImgs: (string | any)[];
  ratioClass?: string;
  uniqueID: string;
  href?: string;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
  height?: string;
  forceSimple?: boolean;
  type?: "card1" | "card2";
  onImageClick?: (e: React.MouseEvent, index: number) => void;
}

export default function GallerySliderWrapper({
  className = "",
  galleryImgs,
  ratioClass = "aspect-w-4 aspect-h-3",
  uniqueID = "uniqueID",
  href = "/listing-stay-detail",
  imageClass = "",
  galleryClass = "rounded-xl",
  navigation = true,
  height = "h-48",
  type = "card2",
  forceSimple = false,
  onImageClick,
}: GallerySliderWrapperProps) {
  const [useSimple, setUseSimple] = useState(forceSimple);
  const [aspectRatioSupported, setAspectRatioSupported] = useState(true);

  // Check if aspect ratio classes are supported
  useEffect(() => {
    if (forceSimple) {
      setUseSimple(true);
      return;
    }

    // Test if aspect ratio classes work
    const testElement = document.createElement('div');
    testElement.className = 'aspect-w-4 aspect-h-3';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const hasAspectRatio = computedStyle.aspectRatio !== 'auto' || 
                          testElement.classList.contains('aspect-w-4');
    
    document.body.removeChild(testElement);
    
    if (!hasAspectRatio) {
      console.warn('Aspect ratio classes not supported, using simple gallery slider');
      setUseSimple(true);
      setAspectRatioSupported(false);
    }
  }, [forceSimple]);

  if (useSimple || !aspectRatioSupported) {
    return (
      <GallerySliderSimple
        className={className}
        galleryImgs={galleryImgs}
        uniqueID={uniqueID}
        href={href}
        imageClass={imageClass}
        galleryClass={galleryClass}
        navigation={navigation}
        height={height}
        type={type}
      />
    );
  }

  return (
    <GallerySlider
      className={className}
      galleryImgs={galleryImgs}
      ratioClass={ratioClass}
      uniqueID={uniqueID}
      href={onImageClick ? undefined : href}
      imageClass={imageClass}
      galleryClass={galleryClass}
      navigation={navigation}
      type={type}
      onImageClick={onImageClick}
    />
  );
} 