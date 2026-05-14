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
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {sections.map((section) => (
            <a 
              key={section.id} 
              href={`#${section.id}`} 
              className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all border border-gray-100"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>

      <SitemapSearch onSearch={setSearchQuery} />

      {/* Categorized Sitemap Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
          {(searchQuery ? filteredSections : sections).map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-40">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                 <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center border border-gray-100">
                    <Map className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{section.title}</h2>
              </div>

              <div className="space-y-12">
                {section.categories.map((category, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">
                       {category.subTitle}
                    </h4>
                    <ul className="flex flex-col">
                      {category.links.filter(l => l.condition !== false).map((link, j) => (
                        <li key={j}>
                          <Link 
                            href={link.href} 
                            className="flex items-center justify-between group py-3 px-2 rounded-xl hover:bg-gray-50 transition-all"
                          >
                            <div className="flex items-center gap-4">
                               {link.icon && <span className="text-gray-400 group-hover:text-[#FF9530] transition-colors">{link.icon}</span>}
                               <span className="text-base font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
                                  {link.label}
                               </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF9530] group-hover:translate-x-1 transition-all" />
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
