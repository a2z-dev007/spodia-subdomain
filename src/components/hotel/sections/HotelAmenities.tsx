"use client";

import React from "react";
import {
  Utensils,
  Wifi,
  Waves,
  Dumbbell,
  Car,
  Coffee,
  ChefHat,
  ParkingCircle,
  ChevronDown,
} from "lucide-react";

const amenities = [
  {
    id: 1,
    name: "RESTAURANT",
    icon: <Utensils size={32} className="text-[#F97316]" />,
    desc: "FINE DINING",
  },
  {
    id: 2,
    name: "KITCHEN",
    icon: <ChefHat size={32} className="text-[#F97316]" />,
    desc: "FULLY EQUIPPED",
  },
  {
    id: 3,
    name: "WI-FI",
    icon: <Wifi size={32} className="text-[#F97316]" />,
    desc: "FIBER HIGH SPEED",
  },
  {
    id: 4,
    name: "POOL",
    icon: <Waves size={32} className="text-[#F97316]" />,
    desc: "TEMPERATURE CONTROL",
  },
  {
    id: 5,
    name: "GYMNASIUM",
    icon: <Dumbbell size={32} className="text-[#F97316]" />,
    desc: "24/7 ACCESS",
  },
  {
    id: 6,
    name: "PARKING",
    icon: <ParkingCircle size={32} className="text-[#F97316]" />,
    desc: "VALET & FREE",
  },
];

export default function HotelAmenities() {
  return (
    <section className="bg-white pt-12 pb-12 px-6 w-full relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-[800px] mx-auto">
          <h2 className="text-[40px] font-black text-[#2D3142] mb-6 leading-tight">
            World-Class Amenities
          </h2>
          <p className="text-[#9CA3AF] font-medium text-[15px] md:text-[16px] leading-relaxed">
            Our properties have been handpicked to deliver premium hospitality.
            Experience luxury that welcomes you like royalty in the heart of
            Guwahati.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-[24px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
            >
              <div className="mb-6 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-[14px] font-black text-[#1a1a1a] mb-2 tracking-[0.05em]">
                {item.name}
              </h3>
              <p className="text-[#9CA3AF] font-bold tracking-[0.02em] text-[10px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="flex justify-center">
          <button className="flex flex-col items-center gap-2 group">
            <span className="text-[#F97316] font-black text-[12px] uppercase tracking-[0.2em] border-b-2 border-orange-100 pb-1 group-hover:border-[#F97316] transition-all">
              EXPLORE ALL 29 AMENITIES
            </span>
            <ChevronDown size={20} className="text-[#F97316] animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
