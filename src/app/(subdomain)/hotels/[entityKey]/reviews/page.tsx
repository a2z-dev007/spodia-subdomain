import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import HotelTestimonials from "@/components/hotel/sections/HotelTestimonials";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "reviews" });
}

export default async function ReviewsPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={`${name} – Verified Guest Reviews`}
        subtitle="Real experiences and ratings from verified guests"
      />

      <div className="py-8">
        <HotelTestimonials hotelData={hotelData} />
      </div>
    </HotelPageShell>
  );
}
