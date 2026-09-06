"use client";

import React from "react";
import HotelRoomBooking from "@/components/hotels/hotel-details/HotelsSection";
import type { ListingDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";

type Props = {
  hotelData?: ListingDetail | null;
  entityKey?: string;
};

export default function HotelRooms({ hotelData, entityKey }: Props) {
  const dynamicRooms = hotelData?.rooms || [];
  const hasDynamicRooms = dynamicRooms.length > 0;

  return (
    <section id="rooms" className="pt-10 pb-20 px-4 max-w-[1400px] mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10 px-2">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-[32px] sm:text-[42px] md:text-[52px] font-black text-[#2D3142] leading-none">
            Rooms &amp; <span className="text-[#F97316]">Suites</span>
          </h2>
          {!hasDynamicRooms && <StaticDataBadge text="static data - need this data on the api" />}
        </div>
        <p className="text-[#6B7280] font-semibold text-[14px] md:text-[16px] tracking-wide">
          Select your preferred room type &amp; plan — Best Rate Guaranteed
        </p>
      </div>

      {/* Spodia Hotel Interactive Room Booking Section */}
      <HotelRoomBooking hotelData={hotelData} entityKey={entityKey} />
    </section>
  );
}
