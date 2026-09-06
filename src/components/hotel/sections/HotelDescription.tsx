"use client";

import React, { useState } from "react";
import { 
  MapPin, Star, ShieldCheck, Clock, Bed, Building, 
  ChevronDown, ChevronUp, Sparkles, CheckCircle2, Images, Camera, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ListingDetail } from "@/types/hotelDetails";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { IMAGES } from "@/assets/images";

type Props = {
  hotelData?: ListingDetail | null;
  entityKey?: string;
};

// Helper function to strip HTML tags to get raw plain text length for truncating
function stripHtml(htmlStr: string): string {
  if (!htmlStr) return "";
  return htmlStr.replace(/<[^>]*>?/gm, "").trim();
}

// Helper function to render HTML safely or formatted into clean paragraphs
function FormattedDescription({ htmlContent }: { htmlContent: string }) {
  if (!htmlContent) return null;

  const hasHtml = /<[a-z][\s\S]*>/i.test(htmlContent);

  if (hasHtml) {
    return (
      <div 
        className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed font-normal 
          [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 
          [&>strong]:text-gray-900 [&>strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  const paragraphs = htmlContent.split(/\n\s*\n/).filter(Boolean);
  return (
    <div className="space-y-3 text-gray-700 leading-relaxed font-normal text-sm sm:text-base">
      {paragraphs.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </div>
  );
}

export default function HotelDescription({ hotelData, entityKey }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, images: lightboxImages, currentIndex, openLightbox, closeLightbox, setIndex } = useLightbox();

  const name = hotelData?.name || "HM Resort";
  const location = hotelData?.address 
    || (hotelData?.city_name ? `${hotelData.city_name}, ${hotelData.state_name || ''}` : "Dibrugarh, Assam, India");
  const propertyType = hotelData?.property_type || "Resort";
  const starCategory = hotelData?.star_category || "3";
  const checkIn = hotelData?.check_in || "12:00 PM";
  const checkOut = hotelData?.check_out || "11:00 AM";
  const roomCount = hotelData?.no_of_rooms || 45;

  // Extract all property photos for Lightbox
  const allImages: string[] = (hotelData?.images || [])
    .map((img) => {
      const raw = img.file;
      if (!raw) return "";
      return raw.startsWith("http")
        ? raw
        : `${IMAGE_BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
    })
    .filter(Boolean);

  const displayImages = allImages.length > 0 ? allImages : [IMAGES.eventHero.src, IMAGES.bgSection.src, IMAGES.herobg.src];
  const featureImage = displayImages[0];

  const descriptionRaw = hotelData?.description || 
    `Welcome to ${name}, a modern and comfortable hospitality destination located in ${location}. Perfect for business travelers, families, couples, and leisure guests, the resort offers a peaceful atmosphere combined with premium amenities and warm hospitality. With stylish interiors and thoughtfully designed accommodations, ${name} ensures a memorable and relaxing stay experience in the heart of Assam.`;

  const plainText = stripHtml(descriptionRaw);
  const isLongDescription = plainText.length > 250;

  const keyStats = [
    { label: "PROPERTY TYPE", value: propertyType, icon: <Building className="w-4 h-4 text-[#FF9530]" /> },
    { label: "STAR CATEGORY", value: `${starCategory} Star`, icon: <Star className="w-4 h-4 text-[#FF9530]" /> },
    { label: "CHECK-IN / OUT", value: `${checkIn} / ${checkOut}`, icon: <Clock className="w-4 h-4 text-[#FF9530]" /> },
    { label: "ROOMS & SUITES", value: `${roomCount} Rooms`, icon: <Bed className="w-4 h-4 text-[#FF9530]" /> },
  ];

  const handleOpenGallery = (startIndex: number = 0) => {
    openLightbox(displayImages, startIndex);
  };

  return (
    <section id="about-property" className="w-full bg-white font-manrope">
      
      {/* Fullscreen Interactive Photo Lightbox Modal */}
      <Lightbox
        isOpen={isOpen}
        images={lightboxImages}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText={`${name} Property Photo`}
      />

      {/* Main Outer Double-Bezel Card Container */}
      <div className="bg-[#FAFBFD] rounded-[28px] md:rounded-[36px] border border-gray-200/90 p-5 sm:p-8 md:p-10 shadow-xs relative overflow-hidden space-y-8">
        
        {/* Top Header Row with Badges, Title & Location */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-orange-100/70 text-[#D97706] border border-orange-200 text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              ABOUT {name.toUpperCase()}
            </span>

            {starCategory && (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {starCategory} Star Rating
              </span>
            )}

            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Spodia Assured
            </span>

            {!hotelData?.description && (
              <StaticDataBadge text="static data - need this data on the api" />
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-1.5">
              Discover Comfort &amp; Luxury at {name}
            </h2>
            
            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-semibold">
              <MapPin className="w-4 h-4 text-[#FF9530] shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Balanced 2-Column Content Split (No Vertical Whitespace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Description & Action Buttons (7 Cols on LG) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            
            <div className="relative flex-1">
              <div
                className={`transition-all duration-500 ease-in-out relative ${
                  !isExpanded && isLongDescription
                    ? "max-h-[140px] overflow-hidden"
                    : "max-h-full"
                }`}
              >
                <FormattedDescription htmlContent={descriptionRaw} />

                {!isExpanded && isLongDescription && (
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
                )}
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-3">
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-[#FF9530] bg-orange-50/90 border border-orange-200 hover:bg-orange-100 transition-all active:scale-95"
                >
                  <span>{isExpanded ? "See Less" : "See More About Hotel"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => handleOpenGallery(0)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-[#FF9530]" />
                <span>View All Photos ({displayImages.length})</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-3 flex flex-wrap gap-2.5 text-xs font-bold text-gray-700">
              <div className="flex items-center gap-1.5 bg-emerald-50/60 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>24/7 Front Desk</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50/60 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free High-Speed Wi-Fi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50/60 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prime Location Access</span>
              </div>
            </div>

          </div>

          {/* Right Column: Feature Photo Card with Lightbox Trigger (5 Cols on LG) */}
          <div className="lg:col-span-5 flex flex-col">
            <div 
              onClick={() => handleOpenGallery(0)}
              className="group relative w-full h-full min-h-[240px] sm:min-h-[280px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer"
            >
              <Image
                src={featureImage}
                alt={`${name} View`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized={featureImage.startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-4 group-hover:bg-black/35 transition-colors">
                <span className="text-white text-xs font-black bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  {name} Overview
                </span>

                <button
                  type="button"
                  className="bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-all"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>{displayImages.length} Photos</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Property Details & Direct Booking Bar (Full Width, NO info (i) icon) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
              PROPERTY DETAILS
            </h3>
            <span className="text-[11px] font-bold text-[#FF9530] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/80">
              Verified Stay Information
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {keyStats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50/90 p-3.5 rounded-xl border border-gray-150/80">
                <div className="flex items-center gap-1.5 mb-1">
                  {stat.icon}
                  <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">{stat.label}</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-gray-900 truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* View Rooms & Rates Action CTA */}
          <div className="pt-2 flex justify-end">
            <Link
              href={`/hotel/${entityKey || "hm-resort-dibrugarh"}/rooms`}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>VIEW ROOMS &amp; RATES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
