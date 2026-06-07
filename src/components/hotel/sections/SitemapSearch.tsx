"use client";
import React from "react";
import { Search } from "lucide-react";

interface SitemapSearchProps {
  onSearch: (query: string) => void;
}

const SitemapSearch = ({ onSearch }: SitemapSearchProps) => {
  return (
    <div className="sticky top-32 z-30 px-6 py-6 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-12">
      <div className="max-w-[800px] mx-auto w-full flex items-center gap-6 bg-white p-5 rounded-2xl border border-gray-200 focus-within:border-[#FF9530] focus-within:shadow-lg transition-all">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search navigation..." 
          className="flex-grow bg-transparent border-none outline-none text-lg font-medium text-gray-900 placeholder:text-gray-400"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
           Quick Search
        </div>
      </div>
    </div>
  );
};

export default SitemapSearch;
