"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sonam Kumra",
    role: "Business Traveler",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sonam",
    rating: 5,
    text: "The hospitality here is beyond words. Everything was meticulously arranged for our corporate summit. The rooms are spacious and the food at the restaurant was exceptional!"
  },
  {
    id: 2,
    name: "Kripa Vijay",
    role: "Family Stay",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kripa",
    rating: 5,
    text: "Guwahati's best kept secret. We stayed for 3 nights and felt like royalty. The garden resort vibe is peaceful and the staff is very courteous. Highly recommended for families."
  },
  {
    id: 3,
    name: "Sandeep Savalia",
    role: "Leisure Guest",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sandeep",
    rating: 5,
    text: "Absolutely stunning architecture and world-class amenities. The pool area is very well maintained and the high-speed fiber internet kept me connected for my remote work meetings."
  }
];

export default function HotelTestimonials() {
  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto w-full">
      <div className="text-center mb-24 max-w-[1000px] mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] mb-8 leading-none tracking-tight">
          What Our <span className="text-orange-500 underline decoration-[6px] decoration-orange-500/20 underline-offset-[12px]">Guests Say</span>
        </h2>
        <p className="text-gray-500 font-medium text-xl max-w-[700px] mx-auto leading-relaxed">
          Read real experiences from people who have stayed with us and enjoyed our hallmark hospitality in the Northeast.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {testimonials.map((item) => (
          <div key={item.id} className="bg-white border-[1.5px] border-gray-100 p-12 rounded-[50px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.06)] relative group hover:border-orange-500/30 transition-all duration-300">
            <div className="absolute top-10 right-10 opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Quote size={60} fill="#FF7A00" strokeWidth={0} />
            </div>
            
            <div className="flex gap-1 mb-8">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={18} fill="#FF7A00" className="text-orange-500" />
              ))}
            </div>
            
            <p className="text-[#1a1a1a] text-lg font-medium leading-[1.8] mb-12 italic">
              "{item.text}"
            </p>
            
            <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/10 shadow-inner">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#1a1a1a]">{item.name}</h4>
                <p className="text-sm font-bold text-orange-500 uppercase tracking-widest">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
