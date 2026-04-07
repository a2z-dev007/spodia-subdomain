"use client";

import React from "react";
import Image from "next/image";
import { BedDouble, Waves, Wifi, Car } from "lucide-react";

const rooms = [
  {
    id: 1,
    title: "Deluxe Room",
    label: "DELUXE",
    price: "4499",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
    description:
      "Specially designed keeping in mind the needs of the modern traveler.",
    amenities: [
      { icon: <BedDouble className="w-4 h-4" />, text: "King Bed" },
      { icon: <Waves className="w-4 h-4" />, text: "Jacuzzi" },
      { icon: <Wifi className="w-4 h-4" />, text: "Fiber WiFi" },
    ],
  },
  {
    id: 2,
    title: "Superior Room",
    label: "SUPERIOR",
    price: "4899",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    description:
      "Individualistic, classical and distinctive. Each room offers its own charm.",
    amenities: [
      { icon: <BedDouble className="w-4 h-4" />, text: "King Bed" },
      { icon: <Waves className="w-4 h-4" />, text: "Jacuzzi" },
      { icon: <Wifi className="w-4 h-4" />, text: "Fiber WiFi" },
    ],
  },
  {
    id: 3,
    title: "Suites",
    label: "SUITE",
    price: "6499",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    description:
      "Each of the 8 Suites has been designed specifically with luxury in mind.",
    amenities: [
      { icon: <BedDouble className="w-4 h-4" />, text: "King Bed" },
      { icon: <Waves className="w-4 h-4" />, text: "Jacuzzi" },
      { icon: <Wifi className="w-4 h-4" />, text: "Fiber WiFi" },
    ],
  },
  {
    id: 4,
    title: "Family Room",
    label: "FAMILY",
    price: "7999",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
    description:
      "For a nuclear family out on vacation, our family rooms reflect comfort.",
    amenities: [
      { icon: <BedDouble className="w-4 h-4" />, text: "King Bed" },
      { icon: <Waves className="w-4 h-4" />, text: "Jacuzzi" },
      { icon: <Wifi className="w-4 h-4" />, text: "Fiber WiFi" },
    ],
  },
];

export default function HotelRooms() {
  return (
    <section className="pt-10 pb-32 px-4 max-w-[1600px] mx-auto w-full ">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 px-2">
        <h2 className="text-[42px] md:text-[56px] font-black text-[#2D3142] leading-none mb-4">
          Rooms & <span className="text-[#F97316]">Suites</span>
        </h2>
        <p className="text-[#9CA3AF] font-medium text-[14px] md:text-[15px] tracking-wide">
          Book with confidence - Lowest Price Guaranteed
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col h-full group"
          >
            {/* Image Area */}
            <div className="relative h-[250px] w-full overflow-hidden">
              <Image
                src={room.image}
                alt={room.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-1.5 rounded-[10px] shadow-sm">
                <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.1em]">
                  {room.label}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-[22px] font-black text-[#1a1a1a] mb-1">
                {room.title}
              </h3>

              <div className="flex items-center gap-1 mb-3">
                <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-[0.05em]">
                  (WITH FREE AIRPORT PICKUP)*
                </span>
              </div>

              <p className="text-[13px] text-[#6B7280] font-medium leading-relaxed mb-6 line-clamp-2">
                {room.description}
              </p>

              {/* Amenities */}
              <div className="flex items-center gap-x-4 gap-y-2 flex-wrap mb-8 mt-auto">
                {room.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-[#F97316]"
                  >
                    {item.icon}
                    <span className="text-[11px] font-bold text-[#6B7280]">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
                    STARTING FROM
                  </span>
                  <span className="text-[20px] font-black text-[#1a1a1a]">
                    ₹ {room.price}
                  </span>
                </div>

                <button className="bg-[#F97316] text-white px-6 py-3 rounded-[12px] font-black uppercase tracking-widest text-[11px] hover:bg-[#EA580C] transition-all shadow-md shadow-orange-200">
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
