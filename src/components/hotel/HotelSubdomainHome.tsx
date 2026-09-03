import React from "react";
import Image from "next/image";
import Link from "next/link";
import HotelSearchbar from "@/components/hotel/HotelSearchbar";
import { IMAGES } from "@/assets/images";
import { hotelJsonLd } from "@/lib/seo/schema";
import { parseSubdomain } from "@/lib/resolver/parseSubdomain";
import { propertyData } from "@/lib/hotel/mockData";
import { CheckCircle, Star, MapPin, Coffee, Wifi, Car, ShieldCheck, ArrowRight } from "lucide-react";

import HotelOffers from "@/components/hotel/sections/HotelOffers";
import HotelRooms from "@/components/hotel/sections/HotelRooms";
import HotelAdvantages from "@/components/hotel/sections/HotelAdvantages";
import HotelTestimonials from "@/components/hotel/sections/HotelTestimonials";
import HotelAmenities from "@/components/hotel/sections/HotelAmenities";
import HotelSpecialServices from "@/components/hotel/sections/HotelSpecialServices";
import HotelHighlights from "@/components/hotel/sections/HotelHighlights";
import HotelLocationContent from "@/components/hotel/sections/HotelLocationContent";
import HotelFAQ from "@/components/hotel/sections/HotelFAQ";
import HotelFooterLinks from "@/components/hotel/sections/HotelFooterLinks";

type Props = { entityKey: string };

export default async function HotelSubdomainHome({ entityKey }: Props) {
  const parsed = parseSubdomain(entityKey);
  const { name, location, type, accommodations, amenities } = propertyData;

  const jsonLd = hotelJsonLd({
    name,
    url: `https://${entityKey}.spodia.com`,
    description: `Book ${name} in ${location} — Experience authentic ${type} hospitality.`,
    parsed,
  });

  return (
    <div className="flex flex-col font-manrope bg-white w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section - Compact Viewport Fit */}
      <section className="relative min-h-[380px] h-[52vh] max-h-[500px] w-full flex items-center justify-center overflow-hidden pb-12">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src={IMAGES.bgSection.src}
            alt={`${name} Hero`}
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-[1200px] mx-auto text-center px-4 md:px-6">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
            <span className="bg-white/15 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9530]" /> Eco-Certified
            </span>
            <span className="bg-white/15 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9530]" /> Hygiene Plus
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
            {name} – <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-200">
              {type === "Hotel" ? "Luxury Meets Local Heritage" : "Your Home Away from Home"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-[700px] mx-auto mb-6 leading-relaxed font-semibold">
            {amenities.slice(0, 4).join(" · ")} · Best Price Guarantee
          </p>

          {/* Refined CTA Buttons - Proportional & Elegant */}
          <div className="flex flex-row items-center justify-center gap-3">
            <Link
              href={`/hotel/${entityKey}/book`}
              className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/hotel/${entityKey}/rooms`}
              className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Searchbar Section (Tight Viewport Overlap) */}
      <section className="px-3 md:px-12 -mt-12 md:-mt-16 relative z-20 w-full flex justify-center">
        <HotelSearchbar />
      </section>

      {/* 2. Key Highlights Section (Modular Grid) */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-[#FF9530] text-xs font-black uppercase tracking-widest block mb-3">Why Stay With Us</span>
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
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Authentic Dining</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">Enjoy home-cooked traditional meals prepared with fresh, locally sourced ingredients.</p>
          </div>

          <div className="bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Prime Location</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">Centrally located with easy access to {location}'s top attractions and business hubs.</p>
          </div>

          <div className="bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Guest First Policy</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">From 24/7 support to personalized tours, our team ensures a seamless stay.</p>
          </div>
        </div>
      </section>

      {/* Remaining Sections */}
      <div className="w-full">
        <HotelOffers />
        <HotelRooms />
        <HotelAdvantages />
        <HotelTestimonials />

        {/* Amenities Showcase */}
        <section className="py-20 bg-gray-50 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-[600px]">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-left">World-Class Amenities</h2>
                <p className="text-gray-600 text-base text-left font-medium">Everything you need for a comfortable and productive stay, from high-speed WiFi to premium spa services.</p>
              </div>
              <button className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                View All Amenities
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {[{icon: <Wifi/>, label: "Free WiFi"}, {icon: <Coffee/>, label: "Breakfast"}, {icon: <Car/>, label: "Parking"}, {icon: <CheckCircle/>, label: "AC Rooms"}].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 hover:border-[#FF9530] transition-colors">
                  <div className="text-[#FF9530] mb-3 scale-110">{item.icon}</div>
                  <span className="font-bold text-gray-900 text-xs md:text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HotelSpecialServices />
        <HotelHighlights />
        <HotelLocationContent />

        {/* SEO-Optimized Content */}
        <section className="py-20 px-6 md:px-12 max-w-[1000px] mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Why Choose {name}?</h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
            {name}, located in {location}, offers {type === "Hotel" ? accommodations.hotel : accommodations.homestay}.
            Whether you’re seeking a productive business trip or a relaxing getaway, our {amenities.slice(0,3).join(", ")} ensure a memorable stay.
          </p>
        </section>

        <HotelFAQ />
      </div>
    </div>
  );
}
