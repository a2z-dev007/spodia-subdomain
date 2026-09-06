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
  return buildHotelSegmentMetadata({ entityKey, segment: "events" });
}

export default async function EventsPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);
  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={`Host Unforgettable Events at ${name}`}
        subtitle="Weddings · Corporate Events · Social Gatherings"
      />

      <section className="py-16 px-6 max-w-[1200px] mx-auto w-full">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Event Venues & Packages</h2>
            <StaticDataBadge text="static data - need this data on the api" />
          </div>
          <p className="text-gray-600 text-base max-w-[700px] mx-auto leading-relaxed">
            Spacious banquet halls, lawns, and conference rooms designed for weddings, seminars, and social functions at {name}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-50 p-8 rounded-[24px] border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Grand Ballroom</h3>
              <p className="text-sm text-gray-500 mb-4">Seated: 200 · Cocktail: 300</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>

            <div className="bg-gray-50 p-8 rounded-[24px] border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Conference Hall</h3>
              <p className="text-sm text-gray-500 mb-4">Seated: 80 · Soundproof</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>

            <div className="bg-gray-50 p-8 rounded-[24px] border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lawn & Garden</h3>
              <p className="text-sm text-gray-500 mb-4">Seated: 300 · Outdoor</p>
              <StaticDataBadge text="static data - need this data on the api" />
            </div>
          </div>
        </div>
      </section>
    </HotelPageShell>
  );
}
