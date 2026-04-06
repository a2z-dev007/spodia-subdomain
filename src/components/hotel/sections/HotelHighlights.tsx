"use client";

import React from "react";
import { CheckCircle2, Star, Sparkles, MapPin, Zap } from "lucide-react";

const highlights = [
  "Peaceful garden resort environment",
  "Spacious outdoor lounge areas",
  "Comfortable well-maintained rooms",
  "High-speed fiber optic Wi-Fi",
  "24/7 power backup facility",
  "In-house premium laundry service",
  "Secured multi-level car parking",
  "Temperature controlled swimming pool",
  "Multi-cuisine gourmet restaurant",
  "State-of-the-art business center",
  "Doctor on-call availability",
  "Airport & Railway transfers",
  "Dedicated travel desk support",
  "Premium bath amenities",
  "Electronic safe in all rooms",
  "Smart LED TV with satellite channels",
  "Well-stocked mini bar in suites",
  "Professional security & surveillance",
  "Concierge and valet services",
  "Customized wedding & event catering"
];

export default function HotelHighlights() {
  return (
    <section className="bg-orange-500 py-32 px-6 w-full -mt-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[200px] -mr-[400px] -mt-[400px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[150px] -ml-[300px] -mb-[300px]" />

      <div className="max-w-[1440px] mx-auto relative z-10 px-6">
        <div className="text-center mb-24 max-w-[1000px] mx-auto px-6">
          <span className="text-white text-sm font-black uppercase tracking-[0.4em] block mb-8 opacity-80">STAY EXCELLENCE</span>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-none mb-10 tracking-tighter">
            20 Unique <span className="text-orange-900/40">Features</span>
          </h2>
          <p className="text-white/80 font-medium max-w-[700px] mx-auto text-xl leading-relaxed">
            Every stay at our property in Guwahati is unique. We provide a range of specialized features to make your experience unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
          {highlights.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-[30px] border border-white/20 transition-all duration-300 hover:bg-white hover:scale-[1.05] group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-orange-500 transition-colors">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm leading-tight transition-colors group-hover:text-orange-500 group-hover:font-black">
                  {item}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
