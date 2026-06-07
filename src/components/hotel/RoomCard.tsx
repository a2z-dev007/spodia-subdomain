"use client";

import React from "react";
import Image from "next/image";
import { Star, Heart, Bed, Bath, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Amenity {
  name: string;
  icon: string;
}

interface RoomCardProps {
  title: string;
  rating: number;
  price: number;
  image: string;
  amenities: Amenity[];
  category: string;
}

const iconMap: Record<string, any> = {
  Bed: Bed,
  Bath: Bath,
  Wifi: Wifi,
};

export default function RoomCard({
  title,
  rating,
  price,
  image,
  amenities,
  category,
}: RoomCardProps) {
  return (
    <div className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
            <span className="text-sm font-bold text-[#FF7A00]">{rating}</span>
          </div>
        </div>

        {/* Amenities Icons Row */}
        <div className="flex items-center gap-6 mb-8">
          {amenities.map((amenity, idx) => {
            const Icon = iconMap[amenity.icon] || Bed;
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-[12px] font-medium text-[#FF7A00]">
                  {amenity.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Starting From
            </span>
            <span className="text-2xl font-extrabold text-gray-900">₹ {price.toLocaleString("en-IN")}</span>
          </div>
          <Button className="bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold rounded-lg px-8 py-3.5 h-auto text-xs uppercase tracking-wider transition-all active:scale-95">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
