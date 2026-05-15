import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { ShieldCheck, CheckCircle2, Zap, Headphones, ArrowRight } from "lucide-react";
import TariffRoomCard from "@/components/hotel/sections/TariffRoomCard";
import RateBookingWidget from "@/components/hotel/sections/RateBookingWidget";
import SpecialOffers from "@/components/hotel/sections/SpecialOffers";
import PriceComparison from "@/components/hotel/sections/PriceComparison";
import PaymentTrust from "@/components/hotel/sections/PaymentTrust";
import TariffFAQ from "@/components/hotel/sections/TariffFAQ";
import BookingReviews from "@/components/hotel/sections/BookingReviews";
import RateAddOns from "@/components/hotel/sections/RateAddOns";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  const { name, location } = propertyData;
  
  return {
    title: `Best Rates at ${name} | Book Now & Save | ${location}`,
    description: `Secure the best rates for ${name} in ${location}. Enjoy luxury amenities with free cancellation & instant confirmation. Book direct & save!`,
  };
}

export default async function TariffPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, rooms, type } = propertyData;

  const isLuxury = type === "Hotel" || type === "Resort";
  const heroTitle = isLuxury 
    ? "Exclusive Rates – Luxury Redefined, Affordably Priced." 
    : "Smart Savings – Comfort Without Compromise.";

  // Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "priceRange": isLuxury ? "₹₹₹₹" : "₹₹",
    "image": rooms[0]?.images[0],
    "makesOffer": {
      "@type": "Offer",
      "price": rooms[0]?.price.toString(),
      "priceCurrency": "INR",
      "availability": "InStock"
    }
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={rooms[0]?.images[0] || "/images/hotels/banner1.jpg"} 
            alt={name} 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-[1000px]">
          <div className="inline-flex items-center gap-2 bg-[#FF9530] text-white px-4 py-2 rounded-full mb-8 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Official Direct Rates</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight animate-fade-in-up delay-100">
            {heroTitle}
          </h1>
          <p className="text-gray-200 text-xl md:text-2xl font-medium mb-12 animate-fade-in-up delay-200">
            Best Price Guarantee · Free Cancellation · Instant Confirmation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up delay-300">
             {[
               { icon: <CheckCircle2 className="w-5 h-5 text-[#FF9530]" />, text: "No Hidden Fees" },
               { icon: <Zap className="w-5 h-5 text-[#FF9530]" />, text: "SSL Secure Payments" },
               { icon: <Headphones className="w-5 h-5 text-[#FF9530]" />, text: "24/7 Support" }
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                  {item.icon}
                  <span className="text-white font-black text-sm uppercase tracking-wider">{item.text}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 2. Room Rates & Booking Widget */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Room Rates */}
          <div className="w-full lg:w-2/3">
             <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Select Your Room</h2>
                <p className="text-gray-500 text-xl font-medium">Compare categories and find the perfect match for your stay.</p>
             </div>
             
             <div className="space-y-12">
                {rooms.map((room) => (
                  <TariffRoomCard key={room.id} room={room} />
                ))}
             </div>
          </div>

          {/* Right: Sticky Booking Widget */}
          <div className="w-full lg:w-1/3">
             <RateBookingWidget />
          </div>
        </div>
      </section>

      {/* 3. Special Offers & Packages */}
      <SpecialOffers />

      {/* 4. Price Comparison Tool */}
      <PriceComparison />

      {/* 5. Add-Ons & Upsells */}
      <section className="py-24 bg-white px-6">
         <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Enhance Your Stay</h2>
               <p className="text-gray-600 text-xl font-medium">Add these exclusive services to your booking for a seamless experience.</p>
            </div>
            <RateAddOns />
         </div>
      </section>

      {/* 6. Guest Reviews */}
      <BookingReviews />

      {/* 7. Flexible Payment Options */}
      <PaymentTrust />

      {/* 8. FAQ */}
      <TariffFAQ />

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 md:hidden flex justify-between items-center">
         <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Starting From</p>
            <p className="text-xl font-black text-gray-900">₹{rooms[0]?.price.toLocaleString()} <span className="text-xs font-bold text-gray-400">/night</span></p>
         </div>
         <button className="bg-[#FF9530] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-2">
            Book Now <ArrowRight className="w-4 h-4" />
         </button>
      </div>

    </HotelPageShell>
  );
}

