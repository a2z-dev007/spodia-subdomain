import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "dine" });
}

export default async function DiningPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);
  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={`Dining at ${name}`}
        subtitle="Experience fine culinary flavors and traditional regional cuisine"
      />

      <section className="py-16 px-6 max-w-[1200px] mx-auto w-full text-center">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl font-black text-gray-900">Culinary & Restaurant Menu</h2>
            <StaticDataBadge text="static data - need this data on the api" />
          </div>
          <p className="text-gray-600 text-base max-w-[700px] mx-auto leading-relaxed">
            Multi-cuisine dining options with local and international dishes prepared fresh at {name}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">In-House Restaurant</h3>
              <p className="text-xs text-gray-500 mb-3">07:00 AM – 10:30 PM</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>

            <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Room Service / In-Room Dining</h3>
              <p className="text-xs text-gray-500 mb-3">24/7 Available</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>

            <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Coffee & Lounge</h3>
              <p className="text-xs text-gray-500 mb-3">08:00 AM – 11:00 PM</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>
          </div>
        </div>
      </section>
    </HotelPageShell>
  );
}
