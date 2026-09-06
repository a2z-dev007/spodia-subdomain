import HotelSubdomainHome from "@/components/hotel/HotelSubdomainHome";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { Metadata } from "next";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { entityKey } = await params;
  const hotel = await fetchHotelDetails(entityKey);

  if (hotel) {
    const title = hotel.meta_title || `${hotel.name} - ${hotel.star_category ? hotel.star_category + " Star " : ""}Hotel in ${hotel.city_name || ''} | Book Now - Spodia`;
    const description = hotel.meta_description || hotel.description?.substring(0, 160) || `Book ${hotel.name} in ${hotel.city_name || ''}, ${hotel.state_name || ''}.`;
    return {
      title,
      description,
      keywords: hotel.meta_keywords || hotel.meta_tags || `${hotel.name}, hotels in ${hotel.city_name || ''}`,
    };
  }

  return {
    title: `${entityKey.replace(/-/g, " ")} | Spodia Stays`,
    description: `Book your stay at ${entityKey.replace(/-/g, " ")} with Spodia.`,
  };
}

export default async function HotelTenantHomePage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  return <HotelSubdomainHome entityKey={entityKey} initialHotelData={hotelData} />;
}
