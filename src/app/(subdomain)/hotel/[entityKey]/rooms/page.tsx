import RoomsHero from "@/components/hotel/sections/RoomsHero";
import RoomsListing from "@/components/hotel/sections/RoomsListing";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "rooms" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Section 1: Hero Slider */}
      <RoomsHero />

      {/* Section 2: Rooms Gallery with Filters/Sorting */}
      <RoomsListing />
    </div>
  );
}
