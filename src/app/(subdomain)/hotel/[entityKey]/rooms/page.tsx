import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { BedDouble, Users, Maximize, Map, Star, ChevronRight, Check } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "rooms" });
}

export default async function RoomsPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, type, rooms, location } = propertyData;
  const isHotel = type === "Hotel" || type === "Resort";

  const heroTitle = isHotel 
    ? "Luxury Awaits – Discover Our Exquisite Rooms & Suites" 
    : "Cozy Comfort – Your Home Away from Home";

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title={heroTitle}
        subtitle="Free Cancellation · Best Price Guarantee · Premium Bedding"
      />

      {/* 2. Sticky Filters (Simulated) */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-6 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["All Rooms", "Suites", "Villas", "Specials"].map((tab) => (
              <button key={tab} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${tab === "All Rooms" ? "bg-[#FF9530] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sort By:</span>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#FF9530] outline-none">
              <option>Price (Low to High)</option>
              <option>Most Popular</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Room Listing Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
              {/* Image Container */}
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image 
                  src={IMAGES.bgSection.src} 
                  alt={room.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm">
                   <div className="flex items-center gap-1 text-[#FF9530]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-gray-900">4.9</span>
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#FF9530] transition-colors">{room.name}</h3>
                
                <div className="grid grid-cols-2 gap-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <BedDouble className="w-5 h-5 text-[#FF9530]" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{room.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-[#FF9530]" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{room.sleeps}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Maximize className="w-5 h-5 text-[#FF9530]" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{room.size}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Map className="w-5 h-5 text-[#FF9530]" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{room.view} View</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-bold line-through mb-1">₹{room.oldPrice.toLocaleString()}</p>
                    <p className="text-2xl font-black text-gray-900">₹{room.price.toLocaleString()}<span className="text-sm font-bold text-gray-400">/night</span></p>
                  </div>
                  <button className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-[#FF9530] transition-all group/btn">
                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Room Comparison Table */}
      <section className="py-24 px-6 bg-gray-50 overflow-x-auto">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Compare Rooms</h2>
            <p className="text-gray-600 text-lg">Find the perfect space for your needs.</p>
          </div>
          
          <div className="min-w-[800px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-8 font-bold text-lg">Room Type</th>
                  <th className="p-8 font-bold text-lg">Sleeps</th>
                  <th className="p-8 font-bold text-lg">Size</th>
                  <th className="p-8 font-bold text-lg">View</th>
                  <th className="p-8 font-bold text-lg text-right">Price/Night</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-8 font-bold text-gray-900">{room.name}</td>
                    <td className="p-8 text-gray-600 font-medium">{room.sleeps}</td>
                    <td className="p-8 text-gray-600 font-medium">{room.size}</td>
                    <td className="p-8 text-gray-600 font-medium">{room.view}</td>
                    <td className="p-8 text-gray-900 font-black text-right text-lg">₹{room.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Special Offers Banner */}
      <section className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto bg-gradient-to-r from-[#FF9530] to-[#FFB347] rounded-[40px] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />
           <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 inline-block">Exclusive Offer</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">Extended Stay Discount</h2>
              <p className="text-white/90 text-xl font-medium">Book 7+ Nights & Get 15% Off Your Entire Stay!</p>
           </div>
           <button className="relative z-10 bg-white text-[#FF9530] px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap">
             Unlock Discount
           </button>
        </div>
      </section>

      {/* 6. Room Amenities */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">Premium Room Amenities</h2>
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">Each room is thoughtfully designed to provide the ultimate comfort and luxury experience.</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {["High-Speed WiFi", "Air Conditioning", "Safe Box", "Coffee Maker", "Premium Bedding", "Smart TV"].map((amenity) => (
                <div key={amenity} className="flex items-center gap-4 text-gray-800 font-bold">
                   <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#FF9530]" />
                   </div>
                   {amenity}
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl">
             <Image src={IMAGES.eventHero.src} alt="Amenities" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section className="py-24 px-6 bg-gray-900 text-white w-full overflow-hidden relative">
         <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FF9530]/5 rounded-full blur-[120px] -ml-[300px] -mt-[300px] pointer-events-none" />
         <div className="max-w-[800px] mx-auto relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Room FAQs</h2>
               <p className="text-gray-400">Everything you need to know about your stay.</p>
            </div>
            <div className="space-y-6">
               {[
                 {q: "What’s included in the room price?", a: "Free breakfast, WiFi, and access to all common amenities like the pool and gym."},
                 {q: "Can I request a late check-out?", a: "Late check-out is subject to availability and may incur a nominal fee. Please contact the front desk."}
               ].map((faq, i) => (
                 <details key={i} className="group bg-white/5 border border-white/10 rounded-[32px] [&_summary::-webkit-details-marker]:hidden">
                   <summary className="flex items-center justify-between cursor-pointer p-8 font-bold text-xl">
                      {faq.q}
                      <span className="text-[#FF9530] transition-transform duration-300 group-open:rotate-180">+</span>
                   </summary>
                   <div className="px-8 pb-8 text-gray-400 text-lg leading-relaxed">
                      {faq.a}
                   </div>
                 </details>
               ))}
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}
