"use client";

import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Clock, 
  Wifi, 
  Car, 
  RotateCcw, 
  Star 
} from "lucide-react";

const advantages = [
  {
    id: 1,
    title: "Best Price Guarantee",
    description: "Always get the lowest rates and best deals when you book through us.",
    icon: <ShieldCheck size={48} className="text-orange-500" />
  },
  {
    id: 2,
    title: "Instant Confirmation",
    description: "Receive your booking voucher within seconds of completing the payment.",
    icon: <Zap size={48} className="text-orange-500" />
  },
  {
    id: 3,
    title: "Flexible Check-out",
    description: "Enjoy leisure time with our flexible check-in and check-out options.",
    icon: <Clock size={48} className="text-orange-500" />
  },
  {
    id: 4,
    title: "High-Speed Wi-Fi",
    description: "Stay connected throughout the property with high-speed fiber internet.",
    icon: <Wifi size={48} className="text-orange-500" />
  },
  {
    id: 5,
    title: "Free Airport Transfer",
    description: "Complimentary pickup and drop for all premium suite bookings.",
    icon: <Car size={48} className="text-orange-500" />
  },
  {
    id: 6,
    title: "Easy Cancellation",
    description: "Full refund on cancellations made up to 24 hours before check-in.",
    icon: <RotateCcw size={48} className="text-orange-500" />
  }
];

export default function HotelAdvantages() {
  return (
    <section className="bg-black py-32 px-6 w-full -mt-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[200px] -mr-[400px] -mt-[400px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -ml-[300px] -mb-[300px]" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="text-center mb-24 px-6">
          <span className="text-[#FF7A00] text-sm font-black uppercase tracking-[0.4em] block mb-8">OUR UNIQUE EDGE</span>
          <h2 className="text-5xl md:text-[80px] font-black text-white leading-none mb-10 tracking-tight">
            The Nandan <span className="text-[#FF7A00]">Advantage</span>
          </h2>
          <p className="text-gray-400 font-medium max-w-[700px] mx-auto text-xl leading-relaxed">
            Discover why thousands of travelers choose us for their stay in Guwahati. Luxury is not an option, it's our standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
          {advantages.map((item) => (
            <div 
              key={item.id} 
              className="bg-black p-12 transition-all duration-300 hover:bg-zinc-900 group border-[0.5px] border-white/5"
            >
              <div className="bg-white/5 w-[100px] h-[100px] rounded-[35px] flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-orange-500/10">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-white mb-6 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed text-lg transition-colors group-hover:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
