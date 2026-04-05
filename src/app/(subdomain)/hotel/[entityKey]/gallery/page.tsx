import ImageGallery from "@/components/hotel/sections/ImageGallery";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "gallery" });
}

export default async function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <ImageGallery />
    </div>
  );
}
