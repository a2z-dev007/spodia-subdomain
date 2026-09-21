import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import HotelAmenities from "@/components/hotel/sections/HotelAmenities";
import HotelSpecialServices from "@/components/hotel/sections/HotelSpecialServices";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "services" });
}

export default async function ServicesPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  const heroTitle = hotelData?.name
    ? `${hotelData.name} – Facilities & Services`
    : "World-Class Amenities & Services";

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={heroTitle}
        subtitle="Hygiene Certified & Verified Facilities · 24/7 Concierge"
      />

      <HotelAmenities hotelData={hotelData} />
      <HotelSpecialServices hotelData={hotelData} />
    </HotelPageShell>
  );
}
