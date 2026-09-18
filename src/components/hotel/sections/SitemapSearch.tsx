"use client";
import React from "react";
import { Search } from "lucide-react";

interface SitemapSearchProps {
  onSearch: (query: string) => void;
}

const SitemapSearch = ({ onSearch }: SitemapSearchProps) => {
  return (
    <div className="sticky top-32 z-30 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-6">
      <div className="max-w-[800px] mx-auto w-full flex items-center gap-6 bg-white p-5 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200 focus-within:border-[#FF9530] focus-within:shadow-[0_8px_30px_rgba(255,149,48,0.15)] transition-all">
        <Search className="w-6 h-6 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for pages, rooms, amenities..." 
          className="flex-grow bg-transparent border-none outline-none text-[17px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl text-[10px] font-black text-[#FF9530] uppercase tracking-widest border border-orange-100">
           Quick Search
        </div>
      </div>
    </div>
  );
};

export default SitemapSearch;
