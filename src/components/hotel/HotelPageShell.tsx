import React from "react";
import { propertyData } from "@/lib/hotel/mockData";

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
      
      {/* Global Footer Placeholder */}
      <footer className="bg-[#0A0A0A] text-white py-16 px-6 w-full border-t border-white/10 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <p>123 {location} Road, {location}, India</p>
              <p>Phone: +91 12345 67890</p>
              <p>Email: info@{name.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Social Media</h4>
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400 cursor-pointer">FB</span>
              <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400 cursor-pointer">IG</span>
              <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400 cursor-pointer">TW</span>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Legal</h4>
            <div className="flex flex-col gap-4">
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Use</span>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
           © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
