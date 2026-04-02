"use client";
import { useEffect } from "react";
import type { ListingDetail, Image, FacilitiesDetail } from "@/types/listingDetail";

interface HotelMetaTagsProps {
  hotel: ListingDetail;
}

export function HotelMetaTags({ hotel }: HotelMetaTagsProps) {
  useEffect(() => {
    const metaTitle =
      hotel.meta_title ||
      `${hotel.name} - ${hotel.star_category ? hotel.star_category + " Star Hotel" : "Hotel"} in ${hotel.city_name} | Book Now`;

    const metaDescription =
      hotel.meta_description ||
      hotel.description?.substring(0, 160) ||
      `Book ${hotel.name} in ${hotel.city_name}, ${hotel.state_name}. ${hotel.star_category ? hotel.star_category + " star hotel" : "Premium hotel"} with ${hotel.no_of_rooms} rooms. ${hotel.highlights || "Great amenities and service."}`;

    const metaKeywords =
      hotel.meta_keywords ||
      hotel.meta_tags ||
      `${hotel.name}, hotel in ${hotel.city_name}, ${hotel.city_name} hotels, ${hotel.state_name} hotels, ${hotel.star_category} star hotel, hotel booking, ${hotel.property_type || "hotel"}`;

    const primaryImage =
      hotel.images?.find((img: Image) => img.cover_photo)?.file ||
      hotel.images?.[0]?.file ||
      "/default-hotel-image.jpg";

    document.title = metaTitle;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    updateMetaTag("title", metaTitle);
    updateMetaTag("description", metaDescription);
    updateMetaTag("keywords", metaKeywords);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:title", metaTitle, true);
    updateMetaTag("og:description", metaDescription, true);
    updateMetaTag("og:image", primaryImage, true);
    updateMetaTag("og:site_name", "Spodia", true);
    updateMetaTag("og:locale", "en_IN", true);
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", metaTitle, true);
    updateMetaTag("twitter:description", metaDescription, true);
    updateMetaTag("twitter:image", primaryImage, true);
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "English");
    updateMetaTag("author", "Spodia");

    if (hotel.star_category) {
      updateMetaTag("hotel:star_rating", hotel.star_category, true);
    }
    if (hotel.city_name) {
      updateMetaTag("hotel:location", `${hotel.city_name}, ${hotel.state_name}`, true);
    }
    if (hotel.sbr_rate) {
      updateMetaTag("hotel:price", `₹${hotel.sbr_rate}`, true);
    }

    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href.split("?")[0];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      name: hotel.name,
      description: hotel.description,
      image: hotel.images?.map((img: Image) => img.file) || [],
      address: {
        "@type": "PostalAddress",
        streetAddress: hotel.address,
        addressLocality: hotel.city_name,
        addressRegion: hotel.state_name,
        addressCountry: hotel.country_name,
      },
      geo:
        hotel.lat && hotel.lon
          ? {
              "@type": "GeoCoordinates",
              latitude: hotel.lat,
              longitude: hotel.lon,
            }
          : undefined,
      starRating: hotel.star_category
        ? {
            "@type": "Rating",
            ratingValue: hotel.star_category,
          }
        : undefined,
      aggregateRating:
        hotel.review_rating && hotel.review_rating_count
          ? {
              "@type": "AggregateRating",
              ratingValue: hotel.review_rating,
              reviewCount: hotel.review_rating_count,
            }
          : undefined,
      priceRange: hotel.sbr_rate ? `₹${hotel.sbr_rate}+` : undefined,
      telephone: hotel.contactdetails?.[0]?.mobile,
      email: hotel.contactdetails?.[0]?.email,
      url: window.location.href.split("?")[0],
      checkInTime: hotel.check_in,
      checkOutTime: hotel.check_out,
      numberOfRooms: hotel.no_of_rooms,
      amenityFeature:
        hotel.facilitiesDetails?.map((facility: FacilitiesDetail) => ({
          "@type": "LocationFeatureSpecification",
          name: facility.name,
        })) || [],
    };

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [hotel]);

  return null;
}
