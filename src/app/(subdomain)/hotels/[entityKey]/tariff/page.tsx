import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
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
      <HotelHeroSimple 
        title={heroTitle}
        subtitle="Best Price Guarantee · Free Cancellation · Instant Confirmation"
        badgeText="Official Direct Rates"
        primaryBtnText="Book Now"
        primaryBtnHref={`/hotel/${entityKey}/rooms`}
        secondaryBtnText="Explore Rooms"
        secondaryBtnHref={`/hotel/${entityKey}/rooms`}
      />

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

