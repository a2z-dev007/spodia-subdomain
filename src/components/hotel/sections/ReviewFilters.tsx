"use client";
import React from "react";
import { Search, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";

const ReviewFilters = () => {
  return (
    <div className="sticky top-[var(--hotel-header-height,115px)] z-30 py-6 px-6 md:px-12 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-12">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-6">
        
        {/* Search Bar */}
        <div className="relative flex-grow w-full lg:w-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search reviews by keyword (e.g., 'pool', 'breakfast')..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 font-bold text-gray-900 outline-none focus:border-[#FF9530] focus:ring-1 focus:ring-[#FF9530] transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-2 rounded-2xl">
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <SlidersHorizontal className="w-4 h-4 text-[#FF9530]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Sort: Newest</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
             </div>
             <div className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-xl transition-all cursor-pointer">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Traveler Type</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
             </div>
             <div className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-xl transition-all cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Stay Duration</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewFilters;
