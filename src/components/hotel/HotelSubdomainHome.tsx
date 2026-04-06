import React from "react";
import Image from "next/image";
import HotelSearchbar from "@/components/hotel/HotelSearchbar";
import { IMAGES } from "@/assets/images";
import { getRequestHost } from "@/lib/seo/metadata";
import { hotelJsonLd } from "@/lib/seo/schema";
import { parseSubdomain } from "@/lib/resolver/parseSubdomain";
import HotelFABs from "@/components/hotel/HotelFABs";

// Sections (keeping them for data structure but I'll focus on the UI now)
// Figma Optimized Sections
import HotelOffers from "@/components/hotel/sections/HotelOffers";
import HotelRooms from "@/components/hotel/sections/HotelRooms";
import HotelAdvantages from "@/components/hotel/sections/HotelAdvantages";
import HotelTestimonials from "@/components/hotel/sections/HotelTestimonials";
import HotelAmenities from "@/components/hotel/sections/HotelAmenities";
import HotelSpecialServices from "@/components/hotel/sections/HotelSpecialServices";
import HotelHighlights from "@/components/hotel/sections/HotelHighlights";
import HotelLocationContent from "@/components/hotel/sections/HotelLocationContent";
import HotelFAQ from "@/components/hotel/sections/HotelFAQ";

type Props = { entityKey: string };

function displayName(entityKey: string) {
  return entityKey
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function HotelSubdomainHome({ entityKey }: Props) {
  const host = await getRequestHost();
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/hotel/${entityKey}`;
  const parsed = parseSubdomain(entityKey);
  const name = displayName(parsed.slug || entityKey);
  const jsonLd = hotelJsonLd({
    name,
    url,
    description: `Book ${name} on Spodia — official subdomain experience.`,
    parsed,
  });

  return (
    <div className="flex flex-col font-manrope bg-white w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[500px] h-[80vh] w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <Image
            src={IMAGES.bgSection.src}
            alt="Hotel Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto text-center px-6 -mt-10 md:-mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-[80px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            The Perfect Venue For Your <br className="hidden md:block" /> Next Big Idea
          </h1>
          <p className="text-[15px] md:text-[18px] lg:text-[20px] text-white/90 max-w-[900px] mx-auto leading-relaxed font-medium">
            Experience world-class hospitality in the heart of {parsed.city || "Guwahati"}. From corporate summits to grand weddings, we make every moment unforgettable.
          </p>
        </div>
      </section>

      {/* Searchbar Section (Overlapping) */}
      <section className="px-4 md:px-12 -mt-16 md:-mt-24 relative z-20 w-full flex justify-center">
        <HotelSearchbar />
      </section>

      {/* Floating Action Buttons */}
      <HotelFABs />

      {/* Sections from Figma Design */}
      <div className="w-full">
        {/* Offers & Promotions */}
        <HotelOffers />

        {/* Rooms & Suites */}
        <HotelRooms />

        {/* The Nandan Advantages (Dark Mode) */}
        <HotelAdvantages />

        {/* Guest Experiences (Testimonials) */}
        <HotelTestimonials />

        {/* World-Class Amenities */}
        <HotelAmenities />

        {/* Special Services (Spa, Coffee Shop, etc.) */}
        <HotelSpecialServices />

        {/* Stay Highlights (20 Unique Features - Orange) */}
        <HotelHighlights />

        {/* Location & Access (Map & Landmarks) */}
        <HotelLocationContent />

        {/* Common Inquiries (FAQ) */}
        <HotelFAQ />
      </div>
    </div>
  );
}
