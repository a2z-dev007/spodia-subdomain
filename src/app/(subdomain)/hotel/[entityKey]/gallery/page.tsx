import React from "react";
import { Metadata } from "next";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelGalleryClient from "@/components/hotel/gallery/HotelGalleryClient";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { getRequestHost } from "@/lib/seo/metadata";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { entityKey } = await params;
  const hotel = await fetchHotelDetails(entityKey);
  const host = await getRequestHost();
  const protocol = host.includes("localhost") ? "http" : "https";
  const canonical = `${protocol}://${host}/hotel/${entityKey}/gallery`;

  if (hotel) {
    const hotelName = hotel.name || entityKey.replace(/-/g, " ");
    const location = hotel.city_name
      ? `${hotel.city_name}, ${hotel.state_name || ""}`
      : "India";

    const title = `${hotelName} Photo Gallery - Official Pictures & Room Views | Spodia`;
    const description = `Explore authentic high-definition photos of ${hotelName} in ${location}. View detailed imagery of executive suites, deluxe rooms, property facade, dining, and amenities.`;

    // Find cover image or first image
    const coverImg =
      hotel.images?.find((img) => img.cover_photo)?.file ||
      hotel.images?.[0]?.file ||
      IMAGES.bgSection.src;

    return {
      title,
      description,
      keywords: `${hotelName} photos, ${hotelName} gallery, ${hotelName} room pictures, hotels in ${hotel.city_name || ''}`,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Spodia",
        type: "website",
        images: [
          {
            url: coverImg,
            width: 1200,
            height: 630,
            alt: `${hotelName} Photo Gallery`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [coverImg],
      },
    };
  }

  const fallbackTitle = `${entityKey.replace(/-/g, " ")} Photo Gallery | Spodia`;
  return {
    title: fallbackTitle,
    description: `Browse official photo gallery for ${entityKey.replace(/-/g, " ")} on Spodia.`,
    alternates: { canonical },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  const hotelName = hotelData?.name || entityKey.replace(/-/g, " ");
  const location = hotelData?.address || hotelData?.city_name || "";

  // Collect image URLs for Schema.org JSON-LD
  const allImages: string[] = [];
  if (hotelData?.images) {
    hotelData.images.forEach((img) => {
      if (img.file) allImages.push(img.file);
    });
  }
  if (hotelData?.rooms) {
    hotelData.rooms.forEach((r) => {
      r.images?.forEach((rImg) => {
        if (rImg.file) allImages.push(rImg.file);
      });
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${hotelName} Photo Gallery`,
    "description": `Official visual gallery of ${hotelName} in ${location} showcasing guest rooms, amenities, and property views.`,
    "image": allImages.length > 0 ? allImages.slice(0, 20) : [IMAGES.bgSection.src],
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelGalleryClient hotelData={hotelData} entityKey={entityKey} />
    </HotelPageShell>
  );
}
