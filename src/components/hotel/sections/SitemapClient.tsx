"use client";
import React, { useState } from "react";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import SitemapSearch from "./SitemapSearch";

interface LinkItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  condition?: boolean;
}

interface Category {
  subTitle: string;
  links: LinkItem[];
}

interface Section {
  id: string;
  title: string;
  categories: Category[];
}

interface SitemapClientProps {
  sections: Section[];
}

const SitemapClient = ({ sections }: SitemapClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = sections.map(section => ({
    ...section,
    categories: section.categories.map(category => ({
      ...category,
      links: category.links.filter(link => 
        link.label.toLowerCase().includes(searchQuery.toLowerCase()) && 
        link.condition !== false
      )
    })).filter(category => category.links.length > 0)
  })).filter(section => section.categories.length > 0);

  return (
    <>
      {/* Jump Links */}
      <div className="bg-gray-50/30 w-full pt-12 pb-6 border-b border-gray-100/50">
        <div className="max-w-[1200px] mx-auto px-2 md:px-6">
          <div className="flex flex-row flex-nowrap items-center justify-start xl:justify-center gap-1.5 md:gap-2 mb-2 overflow-x-auto scrollbar-hide w-full pb-4">
            {sections.map((section) => (
              <a 
                key={section.id} 
                href={`#${section.id}`} 
                className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 bg-white hover:bg-[#FF9530] rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-white transition-all shadow-sm hover:shadow-md border border-gray-200 hover:border-[#FF9530] whitespace-nowrap"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <SitemapSearch onSearch={setSearchQuery} />

      {/* Categorized Sitemap Grid */}
      <section className="bg-gray-50/30 pt-12 pb-32 px-6 md:px-12 w-full">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {(searchQuery ? filteredSections : sections).map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-40 bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                 <div className="w-12 h-12 bg-orange-50 text-[#FF9530] rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                    <Map className="w-6 h-6" />
                 </div>
                 <h2 className="text-[17px] sm:text-lg font-black text-gray-900 uppercase tracking-widest leading-tight">{section.title}</h2>
              </div>

              <div className="space-y-10">
                {section.categories.map((category, i) => (
                  <div key={i}>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF9530] mb-4 px-2">
                       {category.subTitle}
                    </h4>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {category.links.filter(l => l.condition !== false).map((link, j) => (
                        <li key={j}>
                          <Link 
                            href={link.href} 
                            className="flex items-center justify-between group py-3.5 px-4 bg-gray-50/80 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all hover:-translate-y-0.5"
                          >
                            <div className="flex items-center gap-3">
                               {link.icon && <span className="text-gray-400 group-hover:text-[#FF9530] transition-colors">{link.icon}</span>}
                               <span className="text-[15px] font-bold text-gray-700 group-hover:text-[#FF9530] transition-colors">
                                  {link.label}
                               </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF9530] transition-colors" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SitemapClient;
