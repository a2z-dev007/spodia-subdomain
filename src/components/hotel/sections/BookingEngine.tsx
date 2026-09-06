import React from "react";
import type { ListingDetail } from "@/types/hotelDetails";
import HotelRooms from "@/components/hotel/sections/HotelRooms";

type Props = {
  heading?: string;
  entityKey: string;
  hotelData?: ListingDetail | null;
};

export default function BookingEngine({ heading = "Book your stay", entityKey, hotelData }: Props) {
  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <section
      className="w-full rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm"
      aria-labelledby="booking-engine-heading"
    >
      <div className="mb-6">
        <h2 id="booking-engine-heading" className="text-2xl md:text-3xl font-black text-gray-900">
          {heading} – {name}
        </h2>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Select your dates, preferred room type, and number of guests.
        </p>
      </div>

      <HotelRooms hotelData={hotelData} entityKey={entityKey} />
    </section>
  );
}
