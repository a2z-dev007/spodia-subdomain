import React from "react";
import Image from "next/image";
import Link from "next/link";
import HotelSearchbar from "@/components/hotel/HotelSearchbar";
import { IMAGES } from "@/assets/images";
import { hotelJsonLd } from "@/lib/seo/schema";
import { parseSubdomain } from "@/lib/resolver/parseSubdomain";
import { propertyData } from "@/lib/hotel/mockData";
import { Coffee, MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";

import HotelOffers from "@/components/hotel/sections/HotelOffers";
import HotelRooms from "@/components/hotel/sections/HotelRooms";
import HotelAdvantages from "@/components/hotel/sections/HotelAdvantages";
import HotelTestimonials from "@/components/hotel/sections/HotelTestimonials";
import HotelAmenities from "@/components/hotel/sections/HotelAmenities";
import HotelSpecialServices from "@/components/hotel/sections/HotelSpecialServices";
import HotelHighlights from "@/components/hotel/sections/HotelHighlights";
import HotelLocationContent from "@/components/hotel/sections/HotelLocationContent";
import HotelFAQ from "@/components/hotel/sections/HotelFAQ";
import HotelDescription from "@/components/hotel/sections/HotelDescription";

type Props = {
  entityKey: string;
  initialHotelData?: ListingDetail | null;
};

export default async function HotelSubdomainHome({ entityKey, initialHotelData }: Props) {
  const parsed = parseSubdomain(entityKey);
  
  // Fetch dynamic listing details if not passed initially
  const hotelData: ListingDetail | null = initialHotelData !== undefined 
    ? initialHotelData 
    : await fetchHotelDetails(entityKey);

  const name = hotelData?.name || propertyData.name;
  const location = hotelData?.address 
    || (hotelData?.city_name ? `${hotelData.city_name}, ${hotelData.state_name || ''}` : propertyData.location);
  const type = hotelData?.property_type || "Hotel";
  const starCategory = hotelData?.star_category;

  const rawCover = hotelData?.images?.find((i) => i.cover_photo)?.file || hotelData?.images?.[0]?.file;
  const heroImage = rawCover
    ? rawCover.startsWith("http") ? rawCover : `${IMAGE_BASE_URL}${rawCover.startsWith('/') ? '' : '/'}${rawCover}`
    : IMAGES.bgSection.src;

  const jsonLd = hotelJsonLd({
    name,
    url: `https://${entityKey}.spodia.com`,
    description: hotelData?.description || `Book ${name} in ${location} — Experience authentic ${type} hospitality.`,
    parsed,
  });

  return (
    <div className="flex flex-col font-manrope bg-white w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative min-h-[440px] h-[58vh] max-h-[600px] w-full flex items-center justify-center overflow-hidden pb-16">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={`${name} Hero`}
            fill
            className="object-cover scale-105 transition-transform duration-1000"
            priority
            unoptimized={heroImage.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto text-center px-4 md:px-6 pt-8 sm:pt-10">
          {/* Badges */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 md:gap-3 mb-5">
            {starCategory && (
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] md:text-xs font-black px-3.5 py-1.2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-white" />
                {starCategory} Star {type}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] md:text-xs font-bold px-3.5 py-1.2 rounded-full border border-white/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9530]" /> Eco-Certified Property
            </span>
            <StaticDataBadge text="static data - need this data on the api" className="bg-white/20 text-white border-white/30" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-md">
            {name}
          </h1>

          {/* Subtitle / Location */}
          <p className="text-xs sm:text-base md:text-lg text-white/95 max-w-[750px] mx-auto mb-8 leading-relaxed font-semibold drop-shadow-sm flex items-center justify-center gap-1">
            <MapPin className="inline-block w-4 h-4 md:w-5 md:h-5 text-[#FF9530] shrink-0" />
            <span>{location}</span>
            <span className="mx-1 text-white/60">·</span>
            <span className="text-orange-300 font-bold">Best Price Guarantee</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href={`/hotel/${entityKey}/rooms`}
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white shadow-xl shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/hotel/${entityKey}/rooms`}
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/40 hover:bg-white/30 active:scale-[0.98] transition-all"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Searchbar Section */}
      <section className="px-3 md:px-12 -mt-12 md:-mt-16 relative z-20 w-full flex justify-center">
        <HotelSearchbar />
      </section>

      {/* 1. Hotel About Section (First Section After Hero & Searchbar) */}
      <section className="pt-12 md:pt-16 pb-6 px-4 md:px-12 max-w-[1400px] mx-auto w-full">
        <HotelDescription hotelData={hotelData} entityKey={entityKey} />
      </section>

      {/* 2. Key Highlights Section */}
      <section className="py-12 md:py-16 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[#FF9530] text-xs font-black uppercase tracking-widest block">
              Why Stay With Us
            </span>
            <StaticDataBadge text="static data - need this data on the api" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Unmatched Excellence</h2>
          <p className="text-gray-600 text-base max-w-[650px] mx-auto font-medium">
            Experience the unique blend of comfort and culture that makes {name} the top choice in {location}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Coffee className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Authentic Dining</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">Enjoy traditional meals prepared with fresh, locally sourced ingredients.</p>
          </div>

          <div className="bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Prime Location</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">Centrally located with easy access to top attractions and hubs.</p>
          </div>

          <div className="bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Guest First Policy</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">24/7 support and assistance ensuring a seamless stay.</p>
          </div>
        </div>
      </section>

      {/* Sections with API Data & Badges */}
      <div className="w-full">
        <HotelOffers hotelData={hotelData} />
        <HotelRooms hotelData={hotelData} entityKey={entityKey} />
        <HotelAdvantages hotelData={hotelData} />
        <HotelTestimonials hotelData={hotelData} />
        <HotelAmenities hotelData={hotelData} />
        <HotelSpecialServices hotelData={hotelData} />
        <HotelHighlights hotelData={hotelData} />
        <HotelLocationContent hotelData={hotelData} />
        <HotelFAQ hotelData={hotelData} entityKey={entityKey} />
      </div>
    </div>
  );
}

