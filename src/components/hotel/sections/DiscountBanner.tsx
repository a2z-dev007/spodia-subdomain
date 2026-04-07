"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function DiscountBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10">
      <div className="relative w-full bg-[#FF7A00] rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-orange-200 overflow-hidden group">
        
        {/* Animated Accent Shapes (Subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl transition-transform duration-700" />

        <div className="relative z-10 flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Extended Stay Discount
          </h2>
          <p className="text-base md:text-lg text-white/90 font-bold max-w-2xl leading-relaxed">
            Book 7+ Nights, Get 15% Off Your Entire Stay! Use code: <span className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 ml-1">LUXSTAY7</span>
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button className="bg-white hover:bg-gray-50 text-[#FF7A00] font-bold rounded-2xl px-12 py-7 h-auto text-lg shadow-xl shadow-black/5 active:scale-95 transition-all">
            Claim Discount
          </Button>
        </div>
      </div>
    </section>
  );
}
