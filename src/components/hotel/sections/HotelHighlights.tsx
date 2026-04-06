"use client";

import React from "react";
import { Check, BadgeCheck, ArrowRight } from "lucide-react";

const mainHighlights = [
  "Peaceful garden resort in Guwahati offering a calm stay surrounded by greenery and natural beauty.",
  "Spacious outdoor garden areas ideal for family gatherings and peaceful evening walks.",
  "Comfortable well maintained rooms providing a pleasant stay at this budget friendly resort.",
  "Perfect weekend getaway resort near Guwahati for travellers seeking nature and comfort.",
];

export default function HotelHighlights() {
  return (
    <section className="bg-white py-24 px-6 w-full">
      <div className="max-w-[1600px] mx-auto">

        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          {/* Header Area */}
          <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <BadgeCheck size={32} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-white text-[24px] md:text-[28px] font-black leading-tight">
                  Stay Highlights
                </h2>
                <p className="text-white/80 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] mt-1">
                  DISCOVER WHAT MAKES THIS PROPERTY SPECIAL
                </p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30">
              <span className="text-white font-black text-[12px] tracking-widest uppercase">
                20 UNIQUE FEATURES
              </span>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10">
              {mainHighlights.map((text, idx) => (
                <div key={idx} className="flex items-start gap-5 group">
                  <div className="min-w-[44px] h-[44px] rounded-xl bg-[#E6F8F3] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <p className="text-[#4B5563] text-[15px] md:text-[16px] font-medium leading-relaxed pt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Link */}
            <div className="mt-16 flex justify-center pt-8 border-t border-gray-50">
              <button className="flex items-center gap-2 group transition-all">
                <span className="text-[#F97316] font-black text-[13px] uppercase tracking-[0.2em] group-hover:mr-2 transition-all">
                  VIEW ALL 20 HIGHLIGHTS
                </span>
                <ArrowRight size={18} className="text-[#F97316]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

