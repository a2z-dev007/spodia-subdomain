"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Spa",
    time: "10AM - 10PM",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    photos: 7,
  },
  {
    id: 2,
    title: "Conference Room",
    time: "10AM - 10PM",
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    photos: 7,
  },
  {
    id: 3,
    title: "Coffee Shop",
    time: "10AM - 10PM",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    photos: 7,
  },
  {
    id: 4,
    title: "Restaurant",
    time: "10AM - 10PM",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    photos: 7,
  },
];

export default function HotelSpecialServices() {
  return (
    <section className="bg-white py-8 px-6 w-full relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10 px-4">
        {/* Section Header */}
        <div className="mb-14 px-2">
          <h2 className="text-[40px] font-black text-[#2D3142] mb-3">
            Special Services
          </h2>
          <p className="text-[#9CA3AF] font-medium text-[15px]">
            Click on any service to view all photos
          </p>
        </div>

        {/* Carousel Content */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center z-20 text-[#2D3142] hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110">
            <ChevronLeft size={24} />
          </button>

          <button className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center z-20 text-[#2D3142] hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110">
            <ChevronRight size={24} />
          </button>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="group/card cursor-pointer relative h-[300px] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-xl"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                />

                {/* Gallery Badge */}
                <div className="absolute top-5 right-5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 z-10">
                  <ImageIcon size={14} className="text-white" />
                  <span className="text-white font-bold text-[11px]">
                    {service.photos}
                  </span>
                </div>

                {/* Bottom Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-[20px] font-black text-white leading-tight mb-1">
                    {service.title}
                  </h3>
                  <p className="text-white/80 text-[12px] font-medium uppercase tracking-wide">
                    {service.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
