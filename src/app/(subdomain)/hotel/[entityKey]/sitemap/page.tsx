import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Link2, Map as MapIcon, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function SitemapPage({ params }: Props) {
  const { entityKey } = await params;
  const { name } = propertyData;

  const sections = [
    {
      title: "Core Navigation",
      links: [
        { label: "Home / Overview", href: `/hotel/${entityKey}` },
        { label: "About Us", href: `/hotel/${entityKey}/about` },
        { label: "Rooms & Suites", href: `/hotel/${entityKey}/rooms` },
        { label: "Contact Us", href: `/hotel/${entityKey}/contact` }
      ]
    },
    {
      title: "Services & Leisure",
      links: [
        { label: "Dining & Menu", href: `/hotel/${entityKey}/dine` },
        { label: "Event Venues", href: `/hotel/${entityKey}/events` },
        { label: "Facilities & Services", href: `/hotel/${entityKey}/services` },
        { label: "Photo Gallery", href: `/hotel/${entityKey}/gallery` }
      ]
    },
    {
      title: "Guest Information",
      links: [
        { label: "Rates & Tariffs", href: `/hotel/${entityKey}/tariff` },
        { label: "Places to Visit", href: `/hotel/${entityKey}/explore` },
        { label: "Common FAQs", href: `/hotel/${entityKey}/faqs` },
        { label: "Guest Reviews", href: `/hotel/${entityKey}/reviews` }
      ]
    },
    {
      title: "Legal & Other",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Sitemap", href: `/hotel/${entityKey}/sitemap` }
      ]
    }
  ];

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Website Sitemap"
        subtitle={`A direct path to every section of ${name}'s digital experience. Easily navigate through our rooms, services, and local guides.`}
      />

      {/* 6. Search Input */}
      <section className="px-6 -mt-10 md:-mt-16 relative z-20 w-full flex justify-center">
         <div className="max-w-[800px] w-full bg-white rounded-[32px] p-4 md:p-6 shadow-2xl flex items-center gap-4 border border-gray-100">
            <div className="bg-orange-50 p-4 rounded-2xl">
               <Search className="w-6 h-6 text-[#FF9530]" />
            </div>
            <input type="text" placeholder="Jump to a section..." className="flex-grow bg-transparent border-none outline-none text-lg font-bold text-gray-900 placeholder:text-gray-400" />
         </div>
      </section>

      {/* 2-5. Categorized Links */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {sections.map((section, i) => (
              <div key={i} className="space-y-10">
                 <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                       <MapIcon className="w-5 h-5 text-[#FF9530]" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{section.title}</h2>
                 </div>
                 
                 <ul className="space-y-6">
                    {section.links.map((link, j) => (
                      <li key={j}>
                         <Link href={link.href} className="flex items-center justify-between group hover:text-[#FF9530] transition-colors">
                            <span className="text-lg font-bold text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-3">
                               <Link2 className="w-4 h-4 text-gray-300 group-hover:text-[#FF9530]" />
                               {link.label}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-200 group-hover:translate-x-1 group-hover:text-[#FF9530] transition-all" />
                         </Link>
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
         </div>
      </section>

      {/* Bottom Visual */}
      <section className="py-24 px-6 text-center">
         <div className="max-w-[800px] mx-auto bg-gray-50 rounded-[48px] p-16 border border-gray-100">
            <h3 className="text-3xl font-black text-gray-900 mb-6">Need Immediate Assistance?</h3>
            <p className="text-gray-600 text-lg mb-10 font-medium">If you can't find what you're looking for, our support team is available 24/7 via live chat or phone.</p>
            <button className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#FF9530] transition-all active:scale-95 shadow-lg">
               Contact Support
            </button>
         </div>
      </section>

    </HotelPageShell>
  );
}
