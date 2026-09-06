"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Play,
  Pause,
  Share2,
  ExternalLink,
  Bed,
  Maximize2,
  Users,
  Check,
} from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import { GalleryPhoto } from "./types";
import { useSwipeable } from "react-swipeable";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  hotelName: string;
  entityKey: string;
}

export default function GalleryLightbox({
  photos,
  isOpen,
  currentIndex,
  onClose,
  onIndexChange,
  hotelName,
  entityKey,
}: GalleryLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [copied, setCopied] = useState(false);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex, showThumbnails]);

  // Reset zoom on index change
  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % photos.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));
  const resetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSlideshow = () => setIsSlideshow((prev) => !prev);

  // Slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSlideshow && isOpen && photos.length > 1) {
      timer = setInterval(() => {
        onIndexChange((currentIndex + 1) % photos.length);
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSlideshow, isOpen, currentIndex, photos.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "0":
          resetZoom();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "t":
        case "T":
          setShowThumbnails((prev) => !prev);
          break;
        case " ":
          e.preventDefault();
          if (photos.length > 1) toggleSlideshow();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
    delta: 25,
  });

  const handleShare = async () => {
    const currentPhoto = photos[currentIndex];
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentPhoto?.title || hotelName} - Spodia`,
          text: `Check out this photo of ${hotelName}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const safeIndex = Math.min(
    Math.max(0, currentIndex),
    Math.max(0, photos.length - 1)
  );

  if (!isOpen || !mounted || photos.length === 0) return null;

  const currentPhoto = photos[safeIndex] || photos[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden select-none animate-fade-in font-manrope"
      role="dialog"
      aria-modal="true"
      aria-label="Photo Gallery Viewer"
      {...swipeHandlers}
    >
      {/* Top Header / Control Bar */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left info: Hotel & Category pill */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-[60%] sm:max-w-[70%]">
          <span className="bg-[#FF9530] text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-sm">
            {currentPhoto?.category || "Photo"}
          </span>
          <span className="text-white/80 font-bold text-xs sm:text-sm truncate hidden sm:inline-block">
            {hotelName}
          </span>
          <span className="text-white/50 text-xs sm:text-sm font-semibold whitespace-nowrap">
            ({currentIndex + 1} of {photos.length})
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls (hidden on small touch screens) */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/15">
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="p-1.5 hover:bg-white/20 disabled:opacity-30 rounded-full text-white transition-colors"
              title="Zoom Out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-white px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="p-1.5 hover:bg-white/20 disabled:opacity-30 rounded-full text-white transition-colors"
              title="Zoom In (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Slideshow Button */}
          {photos.length > 1 && (
            <button
              onClick={toggleSlideshow}
              className={`p-2 rounded-full border transition-all ${
                isSlideshow
                  ? "bg-[#FF9530] text-white border-[#FF9530] shadow-md shadow-[#FF9530]/30"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/15"
              }`}
              title={isSlideshow ? "Pause Slideshow (Space)" : "Play Slideshow (Space)"}
              aria-label={isSlideshow ? "Pause slideshow" : "Play slideshow"}
            >
              {isSlideshow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full transition-colors"
            title="Toggle Fullscreen (F)"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Filmstrip Toggle */}
          <button
            onClick={() => setShowThumbnails((prev) => !prev)}
            className={`p-2 rounded-full border transition-all ${
              showThumbnails
                ? "bg-white/25 text-white border-white/30"
                : "bg-white/10 hover:bg-white/20 text-white border-white/15"
            }`}
            title="Toggle Thumbnails (T)"
            aria-label="Toggle thumbnail filmstrip"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full transition-colors relative"
            title="Share Photo"
            aria-label="Share photo"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 bg-white/15 hover:bg-red-500/80 text-white border border-white/20 hover:border-red-400 rounded-full transition-all ml-1"
            title="Close (Esc)"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center w-full px-2 sm:px-10 md:px-16 overflow-hidden py-2">
        {/* Navigation Arrow Left */}
        {photos.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/50 hover:bg-[#FF9530] text-white border border-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-md"
            title="Previous Photo (Left Arrow)"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Center Image Container with Zoom */}
        <div
          className="relative w-full h-full max-h-[74vh] sm:max-h-[80vh] md:max-h-[84vh] flex items-center justify-center"
          onDoubleClick={zoom > 1 ? resetZoom : zoomIn}
        >
          <div
            className="relative transition-transform duration-300 ease-out flex items-center justify-center max-w-full max-h-full"
            style={{
              transform: `scale(${zoom})`,
              cursor: zoom > 1 ? "grab" : "default",
            }}
          >
            <ImageWithFallback
              src={currentPhoto?.src}
              alt={currentPhoto?.title || `${hotelName} photo`}
              width={1920}
              height={1200}
              className="object-contain max-h-[72vh] sm:max-h-[78vh] md:max-h-[82vh] w-auto h-auto rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
              priority
            />
          </div>
        </div>

        {/* Navigation Arrow Right */}
        {photos.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/50 hover:bg-[#FF9530] text-white border border-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-md"
            title="Next Photo (Right Arrow)"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Information & Thumbnails Panel */}
      <div className="relative z-30 flex flex-col gap-2 pt-2 pb-4 sm:pb-5 px-4 sm:px-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        {/* Photo Title & Room CTA strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-[1400px] mx-auto w-full">
          <div>
            <h3 className="text-white text-base sm:text-lg font-black tracking-tight leading-snug">
              {currentPhoto?.title || hotelName}
            </h3>
            {currentPhoto?.roomDetails && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70 mt-1">
                {currentPhoto.roomDetails.bedType && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-[#FF9530]" />
                    {currentPhoto.roomDetails.bedType} Bed
                  </span>
                )}
                {currentPhoto.roomDetails.dimensions && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-[#FF9530]" />
                    {currentPhoto.roomDetails.dimensions}
                  </span>
                )}
                {(currentPhoto.roomDetails.maxAdults || 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#FF9530]" />
                    Up to {currentPhoto.roomDetails.maxAdults} Guests
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick CTA if this photo is linked to a room */}
          {currentPhoto?.categoryType === "room" && (
            <Link
              href={`/hotel/${entityKey}/rooms`}
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Room & Rates</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Thumbnail Filmstrip */}
        {showThumbnails && photos.length > 1 && (
          <div
            className="mt-2 w-full max-w-[1400px] mx-auto overflow-x-auto py-1.5 scrollbar-none [::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center gap-2 min-w-max px-2">
              {photos.map((photo, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={photo.id || idx}
                    ref={(el) => {
                      thumbnailRefs.current[idx] = el;
                    }}
                    onClick={() => onIndexChange(idx)}
                    className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 cursor-pointer ${
                      isActive
                        ? "border-[#FF9530] scale-110 shadow-lg shadow-[#FF9530]/40 ring-1 ring-[#FF9530]"
                        : "border-transparent opacity-50 hover:opacity-90 hover:border-white/40"
                    }`}
                    aria-label={`Jump to photo ${idx + 1}`}
                  >
                    <ImageWithFallback
                      src={photo.src}
                      alt={photo.title || ""}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
