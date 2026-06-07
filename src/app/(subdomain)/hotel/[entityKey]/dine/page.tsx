import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Utensils, Clock, Users, Star, ChevronRight, Music, Coffee, Wine } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function DiningPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, location, dining } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title={`Dine at ${dining.restaurantName}`}
        subtitle={`Experience the authentic flavors of ${location}. From traditional Assamese delicacies to global favorites, every dish tells a story.`}
        image={IMAGES.bgSection.src}
      />

      {/* 2. Restaurant Highlights */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-[48px] overflow-hidden shadow-2xl">
               <Image src={IMAGES.bgSection.src} alt="Restaurant" fill className="object-cover" />
               <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 text-white">
                  <p className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">Chef's Special</p>
                  <h4 className="text-3xl font-black mb-2">Traditional Assamese Thali</h4>
                  <p className="font-medium text-white/90">A curated collection of regional delights served with love.</p>
               </div>
            </div>
            <div>
               <span className="text-[#FF9530] text-sm font-bold uppercase tracking-widest block mb-4">Culinary Excellence</span>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">A Feast for the Senses</h2>
               <p className="text-gray-600 text-xl leading-relaxed mb-12">
                  {dining.description} Our chefs use only the freshest seasonal ingredients to create masterpieces that satisfy both the palate and the soul.
               </p>
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Clock className="w-7 h-7 text-[#FF9530]" />
                     </div>
                     <div>
                        <p className="text-xl font-bold text-gray-900">{dining.hours}</p>
                        <p className="text-gray-500 font-medium">Daily Service</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Utensils className="w-7 h-7 text-[#FF9530]" />
                     </div>
                     <div>
                        <p className="text-xl font-bold text-gray-900">Multi-Cuisine Selection</p>
                        <p className="text-gray-500 font-medium">Local, Continental & Oriental</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Digital Menu Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF9530]/5 rounded-full blur-[150px] -mr-[400px] -mt-[400px] pointer-events-none" />
         <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div className="max-w-[600px]">
                  <h2 className="text-3xl md:text-5xl font-black mb-6 text-left">Explore Our Menu</h2>
                  <p className="text-gray-400 text-xl text-left font-medium">Handcrafted dishes designed to delight.</p>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {["All", "Starters", "Main Course", "Beverages"].map(cat => (
                    <button key={cat} className={`px-8 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${cat === "All" ? "bg-[#FF9530] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                       {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {dining.menu.map((category, idx) => (
                 <div key={idx} className="space-y-8">
                    <h3 className="text-2xl font-black text-[#FF9530] flex items-center gap-4">
                       <span className="w-10 h-[2px] bg-[#FF9530]"></span>
                       {category.category}
                    </h3>
                    <div className="space-y-8">
                       {category.items.map((item, i) => (
                         <div key={i} className="flex justify-between items-start group cursor-pointer">
                            <div>
                               <h4 className="text-xl font-bold mb-2 group-hover:text-[#FF9530] transition-colors">{item}</h4>
                               <p className="text-gray-500 text-sm italic">Freshly prepared with local spices and herbs.</p>
                            </div>
                            <span className="text-xl font-black text-white group-hover:scale-110 transition-transform">₹{(350 + i*100).toLocaleString()}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Table Reservation CTA */}
      <section className="py-24 px-6">
         <div className="max-w-[1200px] mx-auto bg-gray-50 rounded-[64px] p-12 md:p-24 text-center border border-gray-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
               <span className="text-[#FF9530] text-sm font-bold uppercase tracking-[0.3em] block mb-6">Reservation</span>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">Secure Your Table</h2>
               <p className="text-gray-600 text-xl max-w-[700px] mx-auto mb-12 font-medium">
                  Whether it's a romantic dinner, a family celebration, or a business lunch, we provide the perfect setting.
               </p>
               <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <button className="w-full md:w-auto bg-gray-900 text-white px-12 py-6 rounded-[28px] font-bold text-xl hover:bg-[#FF9530] transition-all active:scale-95 shadow-xl">
                     Book Online
                  </button>
                  <button className="w-full md:w-auto bg-white text-gray-900 border border-gray-200 px-12 py-6 rounded-[28px] font-bold text-xl hover:bg-gray-100 transition-all shadow-sm">
                     Call for Group Booking
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 6. Themed Nights / Extra Services */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center">
               <Music className="w-12 h-12 text-[#FF9530] mx-auto mb-8" />
               <h4 className="text-2xl font-bold text-gray-900 mb-4">Live Music</h4>
               <p className="text-gray-600 font-medium italic">Every Friday & Saturday Night</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center">
               <Wine className="w-12 h-12 text-[#FF9530] mx-auto mb-8" />
               <h4 className="text-2xl font-bold text-gray-900 mb-4">Wine Tasting</h4>
               <p className="text-gray-600 font-medium italic">Monthly Special Events</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center">
               <Coffee className="w-12 h-12 text-[#FF9530] mx-auto mb-8" />
               <h4 className="text-2xl font-bold text-gray-900 mb-4">Sunday Brunch</h4>
               <p className="text-gray-600 font-medium italic">11:00 AM - 4:00 PM</p>
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}
