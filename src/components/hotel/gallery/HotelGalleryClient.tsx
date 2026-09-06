"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
  Camera,
  Bed,
  Maximize2,
  Users,
  Search,
  LayoutGrid,
  Layers,
  ArrowRight,
  Play,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  Expand,
  Building2,
  PhoneCall,
} from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import GalleryLightbox from "./GalleryLightbox";
import { GalleryPhoto, GalleryCategory, GalleryViewMode } from "./types";
import { ListingDetail } from "@/types/hotelDetails";
import { IMAGES } from "@/assets/images";

interface HotelGalleryClientProps {
  hotelData: ListingDetail | null;
  entityKey: string;
}

export default function HotelGalleryClient({
  hotelData,
  entityKey,
}: HotelGalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<GalleryViewMode>("editorial");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallerySectionRef = useRef<HTMLDivElement>(null);

  // 1. Hotel core info
  const hotelName = hotelData?.name || "Hotel Centre Point";
  const hotelAddress =
    hotelData?.address ||
    (hotelData?.city_name
      ? `${hotelData.city_name}, ${hotelData.state_name || ""}`
      : "Assam, India");
  const starCategory = Number(hotelData?.star_category) || 3;

  // 2. Extract and organize all photos from API data
  const { allPhotos, categories, coverPhoto, roomCollections } = useMemo(() => {
    const photos: GalleryPhoto[] = [];
    const catMap = new Map<string, GalleryCategory>();
    const roomsList: {
      roomName: string;
      roomId?: number;
      specs?: any;
      coverImage: string;
      photosCount: number;
    }[] = [];

    // Fallback images if API photos are completely missing
    const fallbackList = [
      {
        src: IMAGES.bgSection.src,
        title: `${hotelName} - Grand Suite`,
        category: "Rooms & Suites",
      },
      {
        src: IMAGES.eventHero.src,
        title: `${hotelName} - Dining & Lounge`,
        category: "Dining",
      },
      {
        src: IMAGES.herobg.src,
        title: `${hotelName} - Property View`,
        category: "Property",
      },
      {
        src: IMAGES.listingHeroBg.src,
        title: `${hotelName} - Executive Room`,
        category: "Rooms & Suites",
      },
    ];

    // A. Main property images
    const rawHotelImages = [...(hotelData?.images || [])].sort((a: any, b: any) => {
      if (a.cover_photo !== b.cover_photo) return a.cover_photo ? -1 : 1;
      return (a.order || 0) - (b.order || 0);
    });

    const propertyCategoryName = "Hotel & Ambience";
    let propCount = 0;

    rawHotelImages.forEach((img: any, idx: number) => {
      if (!img?.file) return;
      propCount++;
      photos.push({
        id: img.id || `prop-${idx}`,
        src: img.file,
        category: propertyCategoryName,
        categoryType: "property",
        title: img.cover_photo
          ? `${hotelName} - Main Facade & Entrance`
          : `${hotelName} - Property View ${idx + 1}`,
        description:
          img.status_remark || `High resolution view of ${hotelName} property and facilities`,
        isCover: !!img.cover_photo,
        order: img.order || idx,
        globalIndex: 0,
      });
    });

    if (propCount > 0) {
      catMap.set("property", {
        id: "property",
        name: propertyCategoryName,
        count: propCount,
        type: "property",
      });
    }

    // B. Room images
    if (Array.isArray(hotelData?.rooms)) {
      hotelData.rooms.forEach((room: any, rIdx: number) => {
        const roomTitle =
          room.costume_room_name || room.room_name || `Room Category ${rIdx + 1}`;
        const roomImages = room.images || [];
        let rCount = 0;
        let roomCover = "";

        roomImages.forEach((rImg: any, iIdx: number) => {
          if (!rImg?.file) return;
          rCount++;
          if (!roomCover || rImg.cover_photo) {
            roomCover = rImg.file;
          }

          photos.push({
            id: rImg.id || `room-${rIdx}-${iIdx}`,
            src: rImg.file,
            category: roomTitle,
            categoryType: "room",
            title: `${roomTitle} - Photo ${iIdx + 1}`,
            roomName: roomTitle,
            roomDetails: {
              bedType: room.bed_type || "Comfortable Bedding",
              dimensions: room.dimensions || "Spacious Layout",
              maxAdults: room.maximum_adults || room.base_adults || 2,
              maxChildren: room.maximum_children || 1,
              roomId: room.id,
            },
            isCover: !!rImg.cover_photo,
            order: rImg.order || iIdx,
            globalIndex: 0,
          });
        });

        if (rCount > 0) {
          const catId = `room-${room.id || rIdx}`;
          catMap.set(catId, {
            id: catId,
            name: roomTitle,
            count: rCount,
            type: "room",
            roomData: room,
          });

          roomsList.push({
            roomName: roomTitle,
            roomId: room.id,
            specs: {
              bedType: room.bed_type || "Premium Bed",
              dimensions: room.dimensions || "Spacious Room",
              guests: room.maximum_adults || room.base_adults || 2,
            },
            coverImage: roomCover || photos[0]?.src || IMAGES.bgSection.src,
            photosCount: rCount,
          });
        }
      });
    }

    // C. Service images (if any)
    if (Array.isArray(hotelData?.servicedetails)) {
      hotelData.servicedetails.forEach((service: any, sIdx: number) => {
        const sImages = service.images || [];
        const sName = service.name || service.typeofService || "Services & Amenities";
        let sCount = 0;

        sImages.forEach((sImg: any, sImgIdx: number) => {
          const file = sImg?.file || (typeof sImg === "string" ? sImg : null);
          if (!file) return;
          sCount++;
          photos.push({
            id: sImg?.id || `srv-${sIdx}-${sImgIdx}`,
            src: file,
            category: sName,
            categoryType: "service",
            title: `${sName} - ${sImgIdx + 1}`,
            globalIndex: 0,
          });
        });

        if (sCount > 0) {
          catMap.set(`service-${sIdx}`, {
            id: `service-${sIdx}`,
            name: sName,
            count: sCount,
            type: "service",
          });
        }
      });
    }

    // D. If no photos at all from API, use graceful fallback
    if (photos.length === 0) {
      fallbackList.forEach((fb, idx) => {
        photos.push({
          id: `fb-${idx}`,
          src: fb.src,
          category: fb.category,
          categoryType: "property",
          title: fb.title,
          globalIndex: idx,
        });
      });

      catMap.set("property", {
        id: "property",
        name: "Property",
        count: fallbackList.length,
        type: "property",
      });
    }

    // Re-index all photos
    photos.forEach((p, index) => {
      p.globalIndex = index;
    });

    const categoryList: GalleryCategory[] = [
      {
        id: "all",
        name: "All Photos",
        count: photos.length,
        type: "all",
      },
      ...Array.from(catMap.values()),
    ];

    const cover =
      photos.find((p) => p.isCover)?.src ||
      photos[0]?.src ||
      IMAGES.bgSection.src;

    return {
      allPhotos: photos,
      categories: categoryList,
      coverPhoto: cover,
      roomCollections: roomsList,
    };
  }, [hotelData, hotelName]);

  // 3. Filter photos based on activeCategory and searchQuery
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory !== "all") {
        const selectedCat = categories.find((c) => c.id === activeCategory);
        if (selectedCat) {
          matchesCategory = photo.category === selectedCat.name;
        }
      }

      // Search query match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          photo.title.toLowerCase().includes(q) ||
          photo.category.toLowerCase().includes(q) ||
          (photo.roomName && photo.roomName.toLowerCase().includes(q));
      }

      return matchesCategory && matchesSearch;
    });
  }, [allPhotos, activeCategory, categories, searchQuery]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery("");
  };

  const handleOpenLightbox = (indexInFiltered: number) => {
    setLightboxIndex(indexInFiltered);
  };

  const handleScrollToGrid = () => {
    gallerySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col w-full bg-white font-manrope">
      {/* 1. HERO SECTION WITH HOTEL'S ACTUAL COVER PHOTO */}
      <section className="relative min-h-[460px] lg:min-h-[520px] w-full flex items-center justify-center overflow-hidden font-manrope">
        {/* Background Image with Cinematic Dark Gradient */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={coverPhoto}
            alt={`${hotelName} Cover`}
            fill
            priority
            className="object-cover scale-105 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5">
            <span className="bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#FF9530]" /> Official Gallery
            </span>
            <span className="bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FF9530]" /> Verified Photos
            </span>
            <div className="bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
              {Array.from({ length: Math.min(starCategory, 5) }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 text-[#FF9530] fill-[#FF9530]"
                />
              ))}
              <span className="ml-1 text-white/90">
                {starCategory} Star Hotel
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-tight max-w-[1000px]">
            Photo Gallery –{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] via-[#FFA44D] to-[#FF8000]">
              {hotelName}
            </span>
          </h1>

          {/* Location & Description */}
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm sm:text-base font-semibold max-w-[700px] mb-8">
            <MapPin className="w-4 h-4 text-[#FF9530] flex-shrink-0" />
            <span className="truncate">{hotelAddress}</span>
          </div>

          {/* Live Stats Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-5 max-w-[650px] w-full mb-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {allPhotos.length}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">
                High-Res Photos
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-white/15">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {roomCollections.length || 1}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">
                Room Types
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-[#FF9530]">
                100%
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">
                Real Imagery
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={`/hotel/${entityKey}/rooms`}
              className="px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Book Your Stay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleOpenLightbox(0)}
              className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Launch Fullscreen Slideshow</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BENTO HIGHLIGHTS (When "All Photos" is selected) */}
      {activeCategory === "all" && allPhotos.length >= 5 && (
        <section className="pt-12 sm:pt-16 pb-6 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#FF9530] mb-1">
                <Building2 className="w-4 h-4" />
                <span>Featured Property Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Curated Highlights
              </h2>
            </div>
            <button
              onClick={handleScrollToGrid}
              className="text-xs sm:text-sm font-extrabold text-[#FF9530] hover:text-[#FF8000] flex items-center gap-1.5 transition-colors"
            >
              <span>Browse All {allPhotos.length} Photos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Image Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 sm:gap-4 h-[420px] sm:h-[480px] md:h-[520px] rounded-3xl overflow-hidden">
            {/* 1. Large Feature Card */}
            <div
              onClick={() => handleOpenLightbox(0)}
              className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
            >
              <ImageWithFallback
                src={allPhotos[0]?.src}
                alt={allPhotos[0]?.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-6">
                <span className="bg-[#FF9530] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 self-start">
                  {allPhotos[0]?.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {allPhotos[0]?.title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand className="w-4 h-4" />
              </div>
            </div>

            {/* 2. Top-Mid Card */}
            <div
              onClick={() => handleOpenLightbox(1)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 hidden md:block"
            >
              <ImageWithFallback
                src={allPhotos[1]?.src}
                alt={allPhotos[1]?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold truncate">
                  {allPhotos[1]?.title}
                </span>
              </div>
            </div>

            {/* 3. Top-Right Card */}
            <div
              onClick={() => handleOpenLightbox(2)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 hidden md:block"
            >
              <ImageWithFallback
                src={allPhotos[2]?.src}
                alt={allPhotos[2]?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold truncate">
                  {allPhotos[2]?.title}
                </span>
              </div>
            </div>

            {/* 4. Bottom-Mid Card */}
            <div
              onClick={() => handleOpenLightbox(3)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 hidden md:block"
            >
              <ImageWithFallback
                src={allPhotos[3]?.src}
                alt={allPhotos[3]?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold truncate">
                  {allPhotos[3]?.title}
                </span>
              </div>
            </div>

            {/* 5. Bottom-Right Card with +More Overlay */}
            <div
              onClick={() => handleOpenLightbox(4)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 hidden md:block"
            >
              <ImageWithFallback
                src={allPhotos[4]?.src}
                alt={allPhotos[4]?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/75 transition-colors flex flex-col items-center justify-center p-4 text-center">
                <span className="text-white text-2xl font-black mb-1">
                  +{allPhotos.length - 4}
                </span>
                <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                  View Full Album
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. STICKY CATEGORY & FILTER TOOLBAR */}
      <section
        ref={gallerySectionRef}
        className="sticky top-[var(--hotel-header-height,100px)] z-20 bg-white/95 backdrop-blur-md border-y border-gray-200 shadow-xs py-3.5 px-4 sm:px-6 lg:px-8 transition-all"
      >
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 flex-shrink-0 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-[#FF9530] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Toolbar: Search & View Mode Switcher */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by photo or room..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-[#FF9530] focus:ring-1 focus:ring-[#FF9530] rounded-xl text-xs font-bold text-gray-800 placeholder-gray-400 outline-none transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 flex-shrink-0">
              <button
                onClick={() => setViewMode("editorial")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "editorial"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Bento Editorial Layout"
                aria-label="Editorial View"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline-block">Editorial</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Standard Grid Layout"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline-block">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN PHOTO GALLERY GRID */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        {/* Active Filter Info Counter */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-gray-900">
              Showing {filteredPhotos.length} Photos
            </span>
            {searchQuery && (
              <span className="text-xs text-gray-500 font-medium">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-gray-400">
            Click any image to view in fullscreen
          </span>
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-8">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-gray-900 mb-1">
              No Photos Found
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              No images match your current filter. Try clearing your search or
              selecting another category.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-gray-800 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Grid Display */}
        {filteredPhotos.length > 0 && (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === "editorial"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
            }`}
          >
            {filteredPhotos.map((photo, index) => {
              // In editorial mode, make every 7th item span 2 columns on larger screens
              const isFeatureTile =
                viewMode === "editorial" && index % 7 === 0 && index !== 0;

              return (
                <div
                  key={photo.id || index}
                  onClick={() => handleOpenLightbox(index)}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 border border-gray-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 ${
                    isFeatureTile
                      ? "col-span-2 aspect-[16/10]"
                      : "aspect-square"
                  }`}
                >
                  {/* Photo Image */}
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                    {/* Top Row: Category tag and Expand icon */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#FF9530] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {photo.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-[#FF9530] transition-colors">
                        <Expand className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Row: Title and Room specs */}
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white text-xs sm:text-sm font-black line-clamp-2 leading-tight mb-1">
                        {photo.title}
                      </h4>
                      {photo.roomDetails && (
                        <p className="text-white/70 text-[10px] sm:text-xs font-medium truncate">
                          {photo.roomDetails.bedType} ·{" "}
                          {photo.roomDetails.dimensions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. EXPLORE BY ROOM CATEGORY (Curated Showcase) */}
      {roomCollections.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
          <div className="max-w-[1360px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF9530] mb-2 block">
                Accommodations
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                Explore Rooms &amp; Suites
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Browse detailed high-definition photography of each room
                category available at {hotelName}.
              </p>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomCollections.map((room, idx) => (
                <div
                  key={room.roomId || idx}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => {
                      const matchedCat = categories.find(
                        (c) => c.name === room.roomName
                      );
                      if (matchedCat) {
                        setActiveCategory(matchedCat.id);
                        handleScrollToGrid();
                      }
                    }}
                    className="relative aspect-[16/10] overflow-hidden cursor-pointer group bg-gray-100"
                  >
                    <ImageWithFallback
                      src={room.coverImage}
                      alt={room.roomName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Camera className="w-3.5 h-3.5 text-[#FF9530]" />
                      <span>{room.photosCount} Photos</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                        {room.roomName}
                      </h3>

                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 mb-6">
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          <Bed className="w-3.5 h-3.5 text-[#FF9530]" />
                          {room.specs.bedType}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          <Maximize2 className="w-3.5 h-3.5 text-[#FF9530]" />
                          {room.specs.dimensions}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          <Users className="w-3.5 h-3.5 text-[#FF9530]" />
                          Max {room.specs.guests}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          const matchedCat = categories.find(
                            (c) => c.name === room.roomName
                          );
                          if (matchedCat) {
                            setActiveCategory(matchedCat.id);
                            handleScrollToGrid();
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 text-gray-900 font-extrabold text-xs transition-colors text-center"
                      >
                        View Photos
                      </button>

                      <Link
                        href={`/hotel/${entityKey}/rooms`}
                        className="flex-1 py-2.5 rounded-xl bg-[#FF9530] hover:bg-[#FF8000] text-white font-extrabold text-xs transition-colors text-center shadow-md shadow-orange-500/20"
                      >
                        Book Room
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BOOKING ASSURANCE & CONTACT BANNER */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="text-[#FF9530] text-xs font-black uppercase tracking-widest mb-3 block">
              Experience Authentic Hospitality
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
              Ready to stay at <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] to-[#FFB347]">
                {hotelName}
              </span>
              ?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed mb-6">
              Lock in the best guaranteed rates with zero hidden booking fees,
              flexible cancellation policies, and instant confirmation.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF9530]" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF9530]" />
                <span>Verified Guest Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF9530]" />
                <span>24/7 Front Desk Help</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF9530]" />
                <span>Instant Voucher Confirmation</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Link
              href={`/hotel/${entityKey}/rooms`}
              className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Check Room Availability</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/hotel/${entityKey}/contact`}
              className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#FF9530]" />
              <span>Contact Hotel Desk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={filteredPhotos}
          isOpen={lightboxIndex !== null}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
          hotelName={hotelName}
          entityKey={entityKey}
        />
      )}
    </div>
  );
}
