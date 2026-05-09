"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import roomsData from "@/data/jsons/rooms.json";

export default function RoomAddOns() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16">
      <div className="bg-[#F0EDEA] rounded-[48px] p-10 md:p-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Explore Add-ons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomsData.addOns.map((addon) => (
            <div 
              key={addon.id} 
              className="bg-white rounded-[32px] p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden mb-6">
                <Image
                  src={addon.image}
                  alt={addon.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {addon.title}
              </h3>
              
              <p className="text-[15px] font-medium text-gray-500 leading-relaxed mb-8 flex-1">
                {addon.description}
              </p>

              <Button 
                variant="outline" 
                className="w-full border-2 border-[#FF7A00] text-[#FF7A00] hover:bg-orange-50 hover:text-[#FF7A00] font-bold py-6 rounded-2xl transition-all active:scale-95"
              >
                Add to Stay
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
