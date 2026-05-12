import React from "react";
import { propertyData } from "@/lib/hotel/mockData";
import HotelFooter from "./HotelFooter";
import HotelFABs from "./HotelFABs";

type Props = {
  children: React.ReactNode;
  entityKey: string;
};

export default function HotelPageShell({ children, entityKey }: Props) {
  // In a real app, you'd fetch data based on entityKey
  const name = propertyData.name;
  const location = propertyData.location;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": "India"
    }
  };

  return (
    <div className="flex flex-col font-manrope bg-white w-full overflow-x-hidden min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {children}
      
      <HotelFooter />
      <HotelFABs />
    </div>
  );
}
