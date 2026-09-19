import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import HotelLocationContent from "@/components/hotel/sections/HotelLocationContent";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "explore" });
}

export default async function ExplorePage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);
  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={`Explore Around ${name}`}
        subtitle="Discover nearby landmarks, city attractions, and local experiences"
      />

      <HotelLocationContent hotelData={hotelData} />

      <section className="py-16 px-6 max-w-[1200px] mx-auto w-full text-center">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl font-black text-gray-900">Local Attractions & Experiences</h2>
            <StaticDataBadge text="static data - need this data on the api" />
          </div>
          <p className="text-gray-600 text-base max-w-[700px] mx-auto leading-relaxed">
            Discover historic sites, shopping markets, and natural beauty around {name}.
          </p>
        </div>
      </section>
    </HotelPageShell>
  );
}
