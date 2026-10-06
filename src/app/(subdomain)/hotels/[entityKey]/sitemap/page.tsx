import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { ShieldCheck, Map, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Pin as Pinterest } from "lucide-react";
import Link from "next/link";
import SitemapClient from "@/components/hotel/sections/SitemapClient";
import HotelHeroPremium from "@/components/hotel/sections/HotelHeroPremium";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  const { name } = propertyData;
  
  return {
    title: `Sitemap | ${name} | Quick Access to All Pages`,
    description: `Navigate ${name}’s website effortlessly. Explore rooms, amenities, policies, and more via our structured sitemap.`,
  };
}

export default async function SitemapPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, amenities } = propertyData;

  const sections = [
    {
      id: "accommodation",
      title: "Accommodation & Services",
      categories: [
        {
          subTitle: "Rooms & Rates",
          links: [
            { label: "All Rooms", href: `/hotels/${entityKey}/rooms` },
            { label: "Suite Options", href: `/hotels/${entityKey}/rooms` },
            { label: "Seasonal Offers", href: `/hotels/${entityKey}/tariff` },
            { label: "Price Comparison", href: `/hotels/${entityKey}/tariff` }
          ]
        },
        {
          subTitle: "Amenities",
          links: [
            { label: "Spa & Wellness", href: `/hotels/${entityKey}/services`, condition: amenities.includes("Spa") },
            { label: "Dining Menus", href: `/hotels/${entityKey}/dine` },
            { label: "Event Venues", href: `/hotels/${entityKey}/events`, condition: true },
            { label: "Pool & Gym", href: `/hotels/${entityKey}/services`, condition: amenities.includes("Pool") }
          ]
        },
        {
          subTitle: "Booking",
          links: [
            { label: "Check Availability", href: `/hotels/${entityKey}/rooms` },
            { label: "Special Packages", href: `/hotels/${entityKey}/tariff` },
            { label: "Group Bookings", href: `/hotels/${entityKey}/contact` },
            { label: "Cancellation Policy", href: `/hotels/${entityKey}/tariff` }
          ]
        }
      ]
    },
    {
      id: "experiences",
      title: "Experiences & Activities",
      categories: [
        {
          subTitle: "Local Attractions",
          links: [
            { label: "Places to Visit", href: `/hotels/${entityKey}/explore` },
            { label: "Guided Tours", href: `/hotels/${entityKey}/explore` },
            { label: "Adventure Activities", href: `/hotels/${entityKey}/explore` },
            { label: "Cultural Experiences", href: `/hotels/${entityKey}/explore` }
          ]
        },
        {
          subTitle: "On-Site Experiences",
          links: [
            { label: "Cooking Classes", href: `/hotels/${entityKey}/about` },
            { label: "Yoga Sessions", href: `/hotels/${entityKey}/services` },
            { label: "Theme Nights", href: `/hotels/${entityKey}/events` },
            { label: "Workshops", href: `/hotels/${entityKey}/events` }
          ]
        }
      ]
    },
    {
      id: "resources",
      title: "Guest Resources",
      categories: [
        {
          subTitle: "Planning Tools",
          links: [
            { label: "FAQs", href: `/hotels/${entityKey}/faqs` },
            { label: "Reviews", href: `/hotels/${entityKey}/reviews` },
            { label: "Travel Guides", href: `/hotels/${entityKey}/explore` },
            { label: "Packing Tips", href: `/hotels/${entityKey}/faqs` }
          ]
        },
        {
          subTitle: "Support",
          links: [
            { label: "Contact Us", href: `/hotels/${entityKey}/contact` },
            { label: "Live Chat", href: `#` },
            { label: "Emergency Numbers", href: `/hotels/${entityKey}/contact` },
            { label: "Feedback Form", href: `/hotels/${entityKey}/contact` }
          ]
        }
      ]
    },
    {
      id: "legal",
      title: "Legal & Policies",
      categories: [
        {
          subTitle: "Terms",
          links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Use", href: "#" },
            { label: "Cookie Policy", href: "#" }
          ]
        },
        {
          subTitle: "Corporate",
          links: [
            { label: "About Us", href: `/hotels/${entityKey}/about` },
            { label: "Careers", href: "#" },
            { label: "Sustainability", href: `/hotels/${entityKey}/about` },
            { label: "Press Kit", href: "#" }
          ]
        }
      ]
    },
    {
      id: "connect",
      title: "Connect With Us",
      categories: [
        {
          subTitle: "Social Media",
          links: [
            { label: "Facebook", href: "#", icon: <Facebook className="w-4 h-4" /> },
            { label: "Instagram", href: "#", icon: <Instagram className="w-4 h-4" /> },
            { label: "LinkedIn", href: "#", icon: <Linkedin className="w-4 h-4" /> },
            { label: "Twitter", href: "#", icon: <Twitter className="w-4 h-4" /> },
            { label: "Pinterest", href: "#", icon: <Pinterest className="w-4 h-4" /> }
          ]
        },
        {
          subTitle: "Partnerships",
          links: [
            { label: "List Your Property", href: "#" },
            { label: "Affiliate Program", href: "#" },
            { label: "Travel Agents", href: "#" }
          ]
        }
      ]
    }
  ];

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Sitemap for ${name}`,
    "itemListElement": sections.flatMap(s => s.categories.flatMap(c => c.links)).map((link, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://${entityKey}.spodia.com${link.href}`
    }))
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <HotelHeroPremium 
        pillIcon={<Map className="w-5 h-5" />}
        pillText="Site Directory"
        backgroundImage="/images/hotels/banner1.jpg"
        title={
          <>
            Site Navigation – <br className="hidden sm:inline" />
            Explore <span className="text-[#FF9530]">{name}</span> with Ease.
          </>
        }
        subtitle="Find everything you need in one place. Jump to any page quickly!"
        primaryBtnText="Book Now"
        primaryBtnHref={`/hotels/${entityKey}/rooms`}
        secondaryBtnText="Explore Rooms"
        secondaryBtnHref={`/hotels/${entityKey}/rooms`}
        badges={[
          { icon: <ShieldCheck className="w-5 h-5" />, text: "Secure Booking" },
          { icon: <ShieldCheck className="w-5 h-5" />, text: "Verified Reviews" },
          { icon: <ShieldCheck className="w-5 h-5" />, text: "24/7 Support" }
        ]}
      />

      {/* 2. Jump Links, Search & Grid (Client-side) */}
      <div className="bg-white">
        <SitemapClient sections={sections} />
      </div>

      {/* Bottom CTA */}
      <section className="py-16 md:py-32 px-4 sm:px-6 bg-gray-50">
         <div className="max-w-[1000px] mx-auto text-center bg-white p-8 sm:p-12 md:p-20 rounded-[32px] sm:rounded-[48px] md:rounded-[64px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full -mr-[200px] -mt-[200px] pointer-events-none" />
            <div className="relative z-10">
               <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-8 leading-tight">Need Immediate <br/> <span className="text-[#FF9530]">Assistance?</span></h2>
               <p className="text-gray-600 text-sm sm:text-base md:text-xl font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                  If you can't find what you're looking for, our support team is available 24/7 to help you navigate our services.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
                  <button className="w-full sm:w-auto bg-gray-900 text-white px-6 sm:px-8 lg:px-12 py-3.5 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl md:rounded-[24px] font-black text-sm sm:text-base lg:text-xl hover:bg-[#FF9530] transition-all shadow-xl shadow-gray-200 whitespace-nowrap">
                     Contact Support
                  </button>
                  <button className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-100 px-6 sm:px-8 lg:px-12 py-3.5 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl md:rounded-[24px] font-black text-sm sm:text-base lg:text-xl hover:bg-gray-50 transition-all whitespace-nowrap">
                     Back to Homepage
                  </button>
               </div>
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}

