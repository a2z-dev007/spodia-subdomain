import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import HotelRooms from "@/components/hotel/sections/HotelRooms";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "rooms" });
}

export default async function RoomsPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  const heroTitle = hotelData?.name
    ? `${hotelData.name} – Rooms & Suites`
    : "Discover Our Exquisite Rooms & Suites";

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={heroTitle}
        subtitle="Free Cancellation · Best Price Guarantee · Premium Bedding"
      />

      <HotelRooms hotelData={hotelData} entityKey={entityKey} />
    </HotelPageShell>
  );
}
