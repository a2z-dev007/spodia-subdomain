"use client";

import React from "react";
import { 
  Thermometer, 
  Wine, 
  Shirt, 
  Coffee, 
  UserCheck, 
  Speaker, 
  Lock, 
  Monitor, 
  ChevronDown 
} from "lucide-react";
import roomsData from "@/data/jsons/rooms.json";

const iconMap: Record<string, any> = {
  Thermometer,
  Wine,
  Shirt,
  Coffee,
  UserCheck,
  Speaker,
  Lock,
  Monitor
};

export default function RoomAmenities() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-[32px] font-bold text-gray-900">All Room Amenities</h2>
        <button className="flex items-center gap-2 text-sm font-bold text-[#FF7A00] hover:opacity-80 transition-all">
          Show All <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Essentials */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF7A00] rounded-full" />
            <h3 className="text-xl font-bold text-gray-900">Essentials</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            {roomsData.globalAmenities.essentials.map((item, idx) => {
              const Icon = iconMap[item.icon] || Coffee;
              return (
                <div key={idx} className="flex items-center gap-4 group">
                  <Icon className="w-5 h-5 text-[#FF7A00] transition-transform group-hover:scale-110" />
                  <span className="text-[15px] font-medium text-gray-500">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF7A00] rounded-full" />
            <h3 className="text-xl font-bold text-gray-900">Premium</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            {roomsData.globalAmenities.premium.map((item, idx) => {
              const Icon = iconMap[item.icon] || Monitor;
              return (
                <div key={idx} className="flex items-center gap-4 group">
                  <Icon className="w-5 h-5 text-[#FF7A00] transition-transform group-hover:scale-110" />
                  <span className="text-[15px] font-medium text-gray-500">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
