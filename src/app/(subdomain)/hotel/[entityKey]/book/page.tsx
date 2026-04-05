import BookingEngine from "@/components/hotel/sections/BookingEngine";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "book" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <BookingEngine entityKey={entityKey} heading="Book online" />
    </div>
  );
}
