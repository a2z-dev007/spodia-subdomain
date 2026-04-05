import HotelSubdomainHome from "@/components/hotel/HotelSubdomainHome";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "home" });
}

export default async function HotelTenantHomePage({ params }: Props) {
  const { entityKey } = await params;
  return <HotelSubdomainHome entityKey={entityKey} />;
}
