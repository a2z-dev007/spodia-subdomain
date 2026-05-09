import RoomsHero from "@/components/hotel/sections/RoomsHero";
import RoomsListing from "@/components/hotel/sections/RoomsListing";
import RoomComparison from "@/components/hotel/sections/RoomComparison";
import DiscountBanner from "@/components/hotel/sections/DiscountBanner";
import RoomAmenities from "@/components/hotel/sections/RoomAmenities";
import RoomReviews from "@/components/hotel/sections/RoomReviews";
import RoomAddOns from "@/components/hotel/sections/RoomAddOns";
import RoomLocationFAQ from "@/components/hotel/sections/RoomLocationFAQ";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "rooms" });
}

export default async function Page({ params }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityKey } = await params;
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Section 1: Hero Slider */}
      <RoomsHero />

      {/* Section 2: Rooms Gallery with Filters/Sorting */}
      <RoomsListing />

      {/* Section 3: Comparison Table */}
      <RoomComparison />

      {/* Section 4: Promotions & Discounts */}
      <DiscountBanner />

      {/* Section 5: Global Room Amenities */}
      <RoomAmenities />

      {/* Section 6: Explore Add-ons */}
      <RoomAddOns />

      {/* Section 7: Guest Testimonials */}
      <RoomReviews />

      {/* Section 8: Location & FAQ */}
      <RoomLocationFAQ />
    </div>
  );
}
