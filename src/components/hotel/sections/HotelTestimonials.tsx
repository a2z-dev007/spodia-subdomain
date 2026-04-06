"use client";

import React from "react";
import { Star, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sonam Kumra",
    text: "The ocean-view villa was breathtaking! Waking up to the sound of waves was exactly what I needed.",
    rating: 5,
    initial: "S"
  },
  {
    id: 2,
    name: "Kripa",
    text: "Incredible service. The Penthouse Suite had the best city views I've ever seen. Highly recommended!",
    rating: 5,
    initial: "S"
  },
  {
    id: 3,
    name: "Vijay Savalia",
    text: "Perfect for our family. The kids loved the pool and the kitchenette made our long stay very convenient.",
    rating: 5,
    initial: "S"
  }
];

export default function HotelTestimonials() {
  return (
    <section className="bg-[#F9FBFF] pt-20 pb-24 w-full">
      <div className="max-w-[1600px] mx-auto px-6">


      {/* Section Header */}


      <div className="flex flex-col md:flex-row justify-between items-baseline md:items-center mb-10 gap-4 px-2">
        <h2 className="text-[40px] font-black text-[#2D3142]">
          Guest Experiences
        </h2>
        <button className="flex items-center gap-1 text-[#F97316] font-bold text-[14px] hover:underline transition-all">
          See All Reviews <ChevronRight size={18} />
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-[20px] px-8 py-7 border border-gray-100/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] flex flex-col h-full group transition-all hover:shadow-md"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="text-[#FBBF24]" strokeWidth={2.5} />
              ))}
            </div>
            
            {/* Quote Text */}
            <p className="text-[#1a1a1a] text-[14.5px] font-medium leading-[1.6] mb-8 min-h-[70px]">
              "{item.text}"
            </p>
            
            {/* Divider */}
            <div className="w-full h-px bg-gray-100 mb-6" />
            
            {/* Author Section */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-10 h-10 rounded-full bg-[#E6F8F3] flex items-center justify-center text-[#10B981] font-bold text-[13px]">
                {item.initial}
              </div>
              <h4 className="text-[13.5px] font-bold text-[#1a1a1a]">{item.name}</h4>
              
              {/* Optional verification icon or dot placeholder at far right */}
              <div className="ml-auto opacity-10">
                <div className="w-4 h-1 bg-gray-800 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}


