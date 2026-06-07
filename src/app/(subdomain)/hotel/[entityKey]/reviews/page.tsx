import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import ReviewHero from "@/components/hotel/sections/ReviewHero";
import RatingBreakdown from "@/components/hotel/sections/RatingBreakdown";
import ReviewFilters from "@/components/hotel/sections/ReviewFilters";
import ReviewGrid from "@/components/hotel/sections/ReviewGrid";
import HotelTestimonials from "@/components/hotel/sections/HotelTestimonials";
import WriteReviewForm from "@/components/hotel/sections/WriteReviewForm";
import GuestQA from "@/components/hotel/sections/GuestQA";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  const { name, location } = propertyData;
  
  return {
    title: `${name} Reviews | Real Guest Experiences & Ratings | ${location}`,
    description: `Read 1,200+ verified reviews of ${name}. Guests rate us 4.8/5 for service, cleanliness & location. Book your stay in ${location} today!`,
  };
}

export default async function ReviewsPage({ params }: Props) {
  const { entityKey } = await params;
  const { name } = propertyData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1200"
    },
    "review": [
      {
        "@type": "Review",
        "author": "Rajesh K.",
        "datePublished": "2024-06-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "description": "Perfect family getaway! The staff went above and beyond to make our stay memorable."
      }
    ]
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReviewHero hotelName={name} />
      
      <RatingBreakdown />

      <ReviewFilters />

      <ReviewGrid />

      {/* 5. Featured Testimonials Carousel */}
      <div className="bg-gray-50 py-12">
        <HotelTestimonials />
      </div>

      <WriteReviewForm />

      <GuestQA />
      
    </HotelPageShell>
  );
}
