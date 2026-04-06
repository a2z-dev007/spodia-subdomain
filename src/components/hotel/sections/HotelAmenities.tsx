"use client";

import React from "react";
import { Utensils, Wifi, Waves, Dumbbell, Car, Coffee, ShieldCheck, WavesIcon } from "lucide-react";

const amenities = [
  { id: 1, name: "Restaurant", icon: <Utensils size={40} className="text-[#FF7A00]" />, desc: "Indian & Continental" },
  { id: 2, name: "High Speed Wi-Fi", icon: <Wifi size={40} className="text-[#FF7A00]" />, desc: "Fiber Optic 500Mbps" },
  { id: 3, name: "Swimming Pool", icon: <WavesIcon size={40} className="text-[#FF7A00]" />, desc: "Temperature Controlled" },
  { id: 4, name: "Gymnasium", icon: <Dumbbell size={40} className="text-[#FF7A00]" />, desc: "Modern Equipment" },
  { id: 5, name: "Secured Parking", icon: <Car size={40} className="text-[#FF7A00]" />, desc: "Valet & Multi-level" },
  { id: 6, name: "Coffee Shop", icon: <Coffee size={40} className="text-[#FF7A00]" />, desc: "24/7 Brewed Coffee" }
];

export default function HotelAmenities() {
  return (
    <section className="bg-[#fcfcfc] py-32 px-6 w-full -mt-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[180px] -mr-[300px] -mt-[300px]" />
      
      <div className="max-w-[1440px] mx-auto relative z-10 px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-[700px]">
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] mb-8 leading-none tracking-tight">
              World Class <span className="text-orange-500 underline decoration-[6px] decoration-orange-500/20 underline-offset-[12px]">Amenities</span>
            </h2>
            <p className="text-gray-500 font-medium text-xl leading-relaxed">
              Experience unparalleled hospitality and comfort in every corner of our property based in the heart of Guwahati city.
            </p>
          </div>
          <button className="bg-[#1a1a1a] text-white px-12 py-6 rounded-[3rem] font-black uppercase tracking-widest text-[14px] hover:bg-black transition-all shadow-2xl shadow-gray-200 active:scale-[0.98]">
            Explore All 29 Amenities
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((item) => (
            <div key={item.id} className="bg-white p-12 rounded-[50px] shadow-[0_45px_100px_-25px_rgba(0,0,0,0.08)] border-[1.5px] border-gray-50 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:border-orange-500/30 group">
              <div className="w-[110px] h-[110px] rounded-[35px] bg-white shadow-xl shadow-gray-100 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-4 group-hover:text-orange-500 transition-colors">
                {item.name}
              </h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
