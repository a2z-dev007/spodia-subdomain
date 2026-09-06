"use client";

import React, { useState } from "react";
import { Check, BadgeCheck, ChevronDown } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { ItemGridModal } from "@/components/ui/ItemGridModal";

type Props = {
  hotelData?: ListingDetail | null;
};

const defaultHighlights = [
  "Peaceful resort offering a calm stay surrounded by greenery and natural beauty.",
  "Spacious outdoor garden areas ideal for family gatherings and peaceful evening walks.",
  "Comfortable well maintained rooms providing a pleasant stay at this budget friendly property.",
  "Perfect weekend getaway for travellers seeking nature and comfort.",
  "24/7 dedicated guest care and room assistance during your stay.",
  "Prime location with easy accessibility to top attractions and hubs.",
  "Authentic local and multi-cuisine culinary options.",
  "Eco-friendly, well-ventilated properties with top safety standards."
];

export default function HotelHighlights({ hotelData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const highlightsString = hotelData?.highlights || hotelData?.title_highlights;
  const dynamicList = highlightsString
    ? highlightsString.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const hasDynamicHighlights = dynamicList.length > 0;
  const displayHighlights = hasDynamicHighlights ? dynamicList : defaultHighlights;

  // Show limited initial highlights (e.g. 4 items)
  const initialCount = 4;
  const visibleHighlights = displayHighlights.slice(0, initialCount);
  const hasMore = displayHighlights.length > initialCount;

  const gridModalItems = displayHighlights.map((text, idx) => ({
    id: idx,
    name: text,
  }));

  return (
    <section className="bg-white py-12 md:py-16 px-4 md:px-12 w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          {/* Header Area */}
          <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 sm:gap-5 text-center md:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                <BadgeCheck size={30} className="text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                    Stay Highlights
                  </h2>
                  {!hasDynamicHighlights && (
                    <StaticDataBadge
                      text="static data - need this data on the api"
                      className="bg-white/20 text-white border-white/40"
                    />
                  )}
                </div>
                <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mt-1">
                  DISCOVER WHAT MAKES THIS PROPERTY SPECIAL
                </p>
              </div>
            </div>
          </div>

          {/* Highlights Preview Grid */}
          <div className="p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              {visibleHighlights.map((text, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Centered See More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 rounded-full bg-orange-50 hover:bg-orange-100 text-[#F97316] font-bold text-sm border border-orange-200/70 hover:border-orange-300 transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-95"
                >
                  <span>See More Highlights ({displayHighlights.length - initialCount} More)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Highlights Modal */}
      <ItemGridModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Stay Highlights"
        subtitle={`All key highlights of ${hotelData?.name || "this property"}`}
        items={gridModalItems}
        type="check"
      />
    </section>
  );
}

