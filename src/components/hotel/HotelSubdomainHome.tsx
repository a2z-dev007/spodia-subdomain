import React from "react";
import Image from "next/image";
import HotelSearchbar from "@/components/hotel/HotelSearchbar";
import { IMAGES } from "@/assets/images";
import { hotelJsonLd } from "@/lib/seo/schema";
import { parseSubdomain } from "@/lib/resolver/parseSubdomain";
import HotelFABs from "@/components/hotel/HotelFABs";
import { propertyData } from "@/lib/hotel/mockData";
import { CheckCircle, Star, MapPin, Coffee, Wifi, Car, ShieldCheck } from "lucide-react";

// Existing Sections (reusing where possible)
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

      {/* 1. Hero Section */}
      <section className="relative min-h-[600px] h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <Image
            src={IMAGES.bgSection.src}
            alt={`${name} Hero`}
            fill
            className="object-cover scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto text-center px-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF9530]" /> Eco-Certified
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF9530]" /> Hygiene Plus
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            {name} – <br /> {type === "Hotel" ? "Luxury Meets Local Heritage" : "Your Home Away from Home"}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-[800px] mx-auto mb-10 leading-relaxed font-medium">
            {amenities.slice(0, 4).join(" · ")} · Best Price Guarantee
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-[#FF9530] to-[#FFB347] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(255,149,48,0.4)] transition-all active:scale-95">
              Book Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
              View Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Searchbar Section (Overlapping) */}
      <section className="px-4 md:px-12 -mt-16 md:-mt-24 relative z-20 w-full flex justify-center">
        <HotelSearchbar />
      </section>

      <HotelFABs />

      {/* 2. Key Highlights Section (Modular Grid) */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-[#FF9530] text-sm font-bold uppercase tracking-widest block mb-4">Why Stay With Us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Unmatched Excellence</h2>
          <p className="text-gray-600 text-lg max-w-[700px] mx-auto">Experience the unique blend of comfort and culture that makes {name} the top choice in {location}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Coffee className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Authentic Dining</h3>
            <p className="text-gray-600 leading-relaxed">Enjoy home-cooked traditional meals prepared with fresh, locally sourced ingredients.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Prime Location</h3>
            <p className="text-gray-600 leading-relaxed">Centrally located with easy access to {location}'s top attractions and business hubs.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-[#FF9530]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Guest First Policy</h3>
            <p className="text-gray-600 leading-relaxed">From 24/7 support to personalized tours, our team ensures a seamless stay.</p>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <div className="w-full">
        <HotelOffers />
        <HotelRooms />
        <HotelAdvantages />
        <HotelTestimonials />
        
        {/* 6. Amenities Showcase */}
        <section className="py-24 bg-gray-50 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-[600px]">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-left">World-Class Amenities</h2>
                <p className="text-gray-600 text-lg text-left">Everything you need for a comfortable and productive stay, from high-speed WiFi to premium spa services.</p>
              </div>
              <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                View All Amenities
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[{icon: <Wifi/>, label: "Free WiFi"}, {icon: <Coffee/>, label: "Breakfast"}, {icon: <Car/>, label: "Parking"}, {icon: <CheckCircle/>, label: "AC Rooms"}].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 hover:border-[#FF9530] transition-colors">
                  <div className="text-[#FF9530] mb-4 scale-110">{item.icon}</div>
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HotelSpecialServices />
        <HotelHighlights />
        <HotelLocationContent />
        
        {/* 8. SEO-Optimized Content */}
        <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Why Choose {name}?</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            {name}, located in {location}, offers {type === "Hotel" ? accommodations.hotel : accommodations.homestay}. 
            Whether you’re seeking a productive business trip or a relaxing getaway, our {amenities.slice(0,3).join(", ")} ensure a memorable stay. 
            Explore nearby {propertyData.localGems[0].name} or unwind with our on-site services.
          </p>
        </section>

        <HotelFAQ />
        <HotelFooterLinks />
      </div>
    </div>
  );
}
