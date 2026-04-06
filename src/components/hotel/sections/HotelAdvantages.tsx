"use client";

import React from "react";
import { 
  CreditCard, 
  CalendarCheck, 
  History, 
  Wifi, 
  Car, 
  XCircle 
} from "lucide-react";

const advantages = [
  {
    id: 1,
    title: "Best Price Guarantee",
    description: "Get budget-friendly prices with the best accommodation options in the city.",
    icon: <CreditCard className="w-6 h-6 text-[#F97316]" />
  },
  {
    id: 2,
    title: "Instant Booking",
    description: "Book in advance and get hassle-free check-ins without any waiting time.",
    icon: <CalendarCheck className="w-6 h-6 text-[#F97316]" />
  },
  {
    id: 3,
    title: "Flexible Check-out",
    description: "We provide late check-outs for our guests' convenience on prior notice.",
    icon: <History className="w-6 h-6 text-[#F97316]" />
  },
  {
    id: 4,
    title: "High-Speed Wi-Fi",
    description: "We always keep you connected with 24x7 free high-speed wifi access.",
    icon: <Wifi className="w-6 h-6 text-[#F97316]" />
  },
  {
    id: 5,
    title: "Airport Transfers",
    description: "We have seamless pickup and drop services for our guests' convenience.",
    icon: <Car className="w-6 h-6 text-[#F97316]" />
  },
  {
    id: 6,
    title: "Easy Cancellation",
    description: "Smooth cancellation process at one's convenience without extra charges.",
    icon: <XCircle className="w-6 h-6 text-[#F97316]" />
  }
];

export default function HotelAdvantages() {
  return (
    <section className="bg-black py-24 px-6 w-full overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] -mr-[300px] -mt-[300px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -ml-[300px] -mb-[300px]" />

      <div className="max-w-[1600px] mx-auto relative z-10 px-4 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-[#F97316] text-[12px] font-black uppercase tracking-[0.4em] block mb-6">
            OUR UNIQUE EDGE
          </span>
          <h2 className="text-4xl md:text-[64px] font-black text-white leading-tight tracking-tight">
            The Nandan Advantages
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 gap-y-24">
          {advantages.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center text-center transition-all duration-300 group"
            >
              {/* Icon Container */}
              <div className="bg-white/5 w-16 h-16 rounded-[22px] flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-orange-500/10">
                {item.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-[24px] font-black text-white mb-6 group-hover:text-[#F97316] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed text-[15px] max-w-[320px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

