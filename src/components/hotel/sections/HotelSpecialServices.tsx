"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { ListingDetail, Servicedetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";

type Props = {
  hotelData?: ListingDetail | null;
};

const defaultServices = [
  {
    id: 1,
    title: "Spa & Wellness",
    time: "10AM - 10PM",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    photos: 5,
  },
  {
    id: 2,
    title: "Conference Hall",
    time: "08AM - 09PM",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    photos: 4,
  },
  {
    id: 3,
    title: "Coffee Lounge",
    time: "07AM - 11PM",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    photos: 6,
  },
  {
    id: 4,
    title: "Fine Dining Restaurant",
    time: "07AM - 11PM",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    photos: 8,
  },
];

export default function HotelSpecialServices({ hotelData }: Props) {
  const dynamicServices = hotelData?.servicedetails || [];
  const hasDynamicServices = dynamicServices.length > 0;

  return (
    <section className="bg-white py-8 px-6 w-full relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10 px-4">
        {/* Section Header */}
        <div className="mb-10 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[36px] font-black text-[#2D3142]">
                Special Services
              </h2>
              {!hasDynamicServices && <StaticDataBadge text="static data - need this data on the api" />}
            </div>
            <p className="text-[#9CA3AF] font-medium text-[15px]">
              {hasDynamicServices ? "Services available at property" : "Click on any service to view details"}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {hasDynamicServices
            ? dynamicServices.map((service: Servicedetail) => {
                const rawImg = service.images?.[0]?.file || service.images?.[0];
                const imgSrc = typeof rawImg === "string"
                  ? rawImg.startsWith("http") ? rawImg : `${IMAGE_BASE_URL}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`
                  : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800";

                const timeText = service.openTime && service.closeTime
                  ? `${service.openTime} - ${service.closeTime}`
                  : service.serviceType || "AVAILABLE";

                return (
                  <div
                    key={service.id || service.name}
                    className="group/card relative h-[280px] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-xl bg-gray-100"
                  >
                    <Image
                      src={imgSrc}
                      alt={service.name || "Service"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      unoptimized={imgSrc.startsWith("http")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <h3 className="text-[20px] font-black text-white leading-tight mb-1">
                        {service.name}
                      </h3>
                      <p className="text-white/80 text-[12px] font-medium uppercase tracking-wide">
                        {timeText}
                      </p>
                    </div>
                  </div>
                );
              })
            : defaultServices.map((service) => (
                <div
                  key={service.id}
                  className="group/card relative h-[280px] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-xl"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
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
    </section>
  );
}
