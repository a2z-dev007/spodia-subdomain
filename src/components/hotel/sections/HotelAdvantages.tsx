"use client";

import React from "react";
import { 
  Banknote, 
  CalendarCheck, 
  History, 
  Wifi, 
  CarFront, 
  XCircle 
} from "lucide-react";

const advantages = [
  {
    id: 1,
    title: "Best Price Guarantee",
    description: "Get budget-friendly prices with the best accommodation options in the city.",
    icon: <Banknote className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  },
  {
    id: 2,
    title: "Instant Booking",
    description: "Book in advance and get hassle-free check-ins without any waiting time.",
    icon: <CalendarCheck className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  },
  {
    id: 3,
    title: "Flexible Check-out",
    description: "We provide late check-outs for our guests' convenience on prior notice.",
    icon: <History className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  },
  {
    id: 4,
    title: "High-Speed Wi-Fi",
    description: "We always keep you connected with 24x7 free high-speed wifi access.",
    icon: <Wifi className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  },
  {
    id: 5,
    title: "Airport Transfers",
    description: "We have seamless pickup and drop services for our guests' convenience.",
    icon: <CarFront className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  },
  {
    id: 6,
    title: "Easy Cancellation",
    description: "Smooth cancellation process at one's convenience without extra charges.",
    icon: <XCircle className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
  }
];

export default function HotelAdvantages() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6 w-full overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] bg-[#EA580C]/10 rounded-full blur-[120px] -ml-[300px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[600px] bg-[#EA580C]/10 rounded-full blur-[120px] -mr-[300px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10 px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">
            OUR UNIQUE EDGE
          </span>
          <h2 className="text-3xl md:text-[44px] font-bold text-white leading-tight tracking-tight">
            The Nandan Advantages
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {advantages.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div className="bg-[#121212] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] inset-0 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                {item.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-[20px] font-bold text-white mb-3 group-hover:text-[#F97316] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-[#9CA3AF] font-normal leading-[1.6] text-[15px] max-w-[300px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
