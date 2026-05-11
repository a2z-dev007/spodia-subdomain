import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Wifi, Car, Coffee, ShieldCheck, Dumbbell, Waves, Briefcase, Sparkles, Clock, Map } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, amenities } = propertyData;

  const categories = [
    {
      title: "Core Services",
      desc: "Essentials for a seamless stay.",
      items: [
        { icon: <Clock />, label: "24/7 Room Service" },
        { icon: <Sparkles />, label: "Daily Housekeeping" },
        { icon: <ShieldCheck />, label: "Laundry & Dry Cleaning" },
        { icon: <Briefcase />, label: "Concierge Desk" }
      ]
    },
    {
      title: "Wellness & Leisure",
      desc: "Recharge your mind and body.",
      items: [
        { icon: <Waves />, label: "Infinity Pool" },
        { icon: <Dumbbell />, label: "Modern Fitness Center" },
        { icon: <Sparkles />, label: "Luxury Spa & Sauna" },
        { icon: <Coffee />, label: "Coffee Shop & Lounge" }
      ]
    },
    {
      title: "Business & Travel",
      desc: "Connect and explore with ease.",
      items: [
        { icon: <Wifi />, label: "High-Speed Fiber WiFi" },
        { icon: <Briefcase />, label: "Conference & Meeting Rooms" },
        { icon: <Car />, label: "Airport Pick-up & Drop" },
        { icon: <Map />, label: "Local Sightseeing Tours" }
      ]
    }
  ];

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="World-Class Facilities"
        subtitle={`Every service at ${name} is designed with your comfort in mind. From arrival to departure, experience excellence.`}
      />

      {/* 2. Adaptive Icon Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {amenities.map((amenity, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm hover:border-[#FF9530] hover:shadow-xl transition-all cursor-pointer group">
                 <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:scale-110 transition-all">
                    <Sparkles className="w-8 h-8 text-[#FF9530]" />
                 </div>
                 <span className="font-black text-gray-900 text-sm tracking-tight">{amenity}</span>
              </div>
            ))}
         </div>
      </section>

      {/* 3. Detailed Service Blocks */}
      <section className="py-24 bg-gray-50 overflow-hidden">
         <div className="max-w-[1200px] mx-auto px-6 space-y-32">
            {categories.map((cat, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-20`}>
                 <div className="lg:w-1/2 relative">
                    <div className="absolute -inset-4 bg-orange-200/30 rounded-[64px] blur-2xl pointer-events-none" />
                    <div className="relative h-[500px] rounded-[56px] overflow-hidden shadow-2xl">
                       <Image src={i === 0 ? IMAGES.bgSection.src : i === 1 ? IMAGES.bgSection.src : IMAGES.eventHero.src} alt={cat.title} fill className="object-cover" />
                    </div>
                 </div>
                 <div className="lg:w-1/2">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">{cat.title}</h2>
                    <p className="text-gray-600 text-xl font-medium mb-12 leading-relaxed">{cat.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {cat.items.map((item, j) => (
                         <div key={j} className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#FF9530] group-hover:text-white transition-all text-[#FF9530]">
                               {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
                            </div>
                            <span className="text-lg font-black text-gray-800">{item.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 7. Hygiene & Safety Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full text-center">
         <div className="bg-gray-900 rounded-[64px] p-12 md:p-24 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />
            <ShieldCheck className="w-24 h-24 text-[#FF9530] mx-auto mb-10" />
            <h2 className="text-3xl md:text-5xl font-black mb-8">Your Safety is Our Priority</h2>
            <p className="text-gray-400 text-xl max-w-[700px] mx-auto mb-12 font-medium leading-relaxed">
               We adhere to international hygiene standards. Every room and common area is sanitized regularly using medical-grade protocols.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <span className="bg-white/10 px-8 py-4 rounded-2xl font-bold border border-white/20">ISO 9001 Certified</span>
               <span className="bg-white/10 px-8 py-4 rounded-2xl font-bold border border-white/20">Hygiene Plus Gold Badge</span>
               <span className="bg-white/10 px-8 py-4 rounded-2xl font-bold border border-white/20">100% Sanitized Environment</span>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
         <h2 className="text-4xl font-black text-gray-900 mb-8">Experience it All</h2>
         <p className="text-gray-600 text-xl mb-12 max-w-[600px] mx-auto font-medium">Ready to experience the finest hospitality in {propertyData.location}?</p>
         <button className="bg-[#FF9530] text-white px-12 py-6 rounded-2xl font-black text-xl hover:shadow-2xl transition-all active:scale-95">
            Book Your Stay Now
         </button>
      </section>

    </HotelPageShell>
  );
}
