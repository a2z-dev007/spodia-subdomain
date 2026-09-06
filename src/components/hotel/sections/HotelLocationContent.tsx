"use client";

import React from "react";
import { MapPin, Compass, Bus, Navigation } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";

type Props = {
  hotelData?: ListingDetail | null;
};

export default function HotelLocationContent({ hotelData }: Props) {
  const name = hotelData?.name || "Hotel Location";
  const address = hotelData?.address || `${hotelData?.city_name || 'Guwahati'}, ${hotelData?.state_name || 'Assam'}`;
  const lat = hotelData?.lat;
  const lon = hotelData?.lon;

  // Build clean Google Maps Embed URL
  const queryParam = lat && lon 
    ? `${lat},${lon}`
    : encodeURIComponent(`${name}, ${address}`);

  const mapSrc = `https://maps.google.com/maps?q=${queryParam}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="bg-white py-12 md:py-16 px-4 md:px-12 w-full relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Location &amp; Access
          </h2>
          <div className="text-gray-500 font-medium text-sm md:text-base">
            <p className="font-bold text-gray-800">{name}</p>
            <p className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <MapPin className="w-4 h-4 text-[#FF9530] shrink-0" />
              <span>{address}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Section */}
          <div className="lg:col-span-7 h-[400px] sm:h-[450px] md:h-[500px] rounded-3xl overflow-hidden relative shadow-sm border border-gray-200">
            <iframe
              title={`Google Map - ${name}`}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Map Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-gray-100 max-w-[340px]">
              <div className="bg-[#FF9530] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{name}</h4>
                <p className="text-xs text-gray-500 truncate">{address}</p>
              </div>
            </div>
          </div>

          {/* Info Side Card */}
          <div className="lg:col-span-5 bg-gray-50/80 rounded-3xl border border-gray-100 p-6 sm:p-8 md:p-10 shadow-xs">
            {/* Landmarks Group */}
            <div className="mb-8 pb-8 border-b border-gray-200/60">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-orange-100/70 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Compass size={18} className="text-[#FF9530]" />
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    KEY LANDMARKS
                  </span>
                </div>
                <StaticDataBadge text="static data - need this data on the api" />
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">City Center / Railway Station</span>
                  <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50">1.2 km</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">Famous Tourist Attraction</span>
                  <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50">5.4 km</span>
                </div>
              </div>
            </div>

            {/* Transport Group */}
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-orange-100/70 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Bus size={18} className="text-[#FF9530]" />
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    TRANSPORT HUB
                  </span>
                </div>
                <StaticDataBadge text="static data - need this data on the api" />
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">Main Bus Station</span>
                  <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50">3.5 km</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">Nearest Airport</span>
                  <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50">18 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

