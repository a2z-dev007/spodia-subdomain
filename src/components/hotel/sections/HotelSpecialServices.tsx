"use client";

import React from "react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const services = [
  { id: 1, title: "Our Spa & Sauna", time: "10 AM - 10 PM", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Coffee Shop", time: "24/7 Service", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Conference Rooms", time: "Available 24/7", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Gourmet Restaurant", time: "11 AM - 11 PM", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" },
];

export default function HotelSpecialServices() {
  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto w-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-[150px] -mr-[200px] -mt-[200px]" />
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 px-6 gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] mb-8 leading-none tracking-tight">
            Special <span className="text-orange-500 underline decoration-[6px] decoration-orange-500/20 underline-offset-[12px]">Services</span>
          </h2>
          <p className="text-gray-500 font-medium text-xl max-w-[700px] mx-auto leading-relaxed">
            From rejuvenating spa treatments to state-of-the-art business facilities, explore our range of auxiliary services designed for your comfort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div key={service.id} className="group cursor-pointer relative h-[500px] rounded-[50px] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[0.98] active:scale-[0.95]">
            <Image 
              src={service.image} 
              alt={service.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-100" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest block mb-4 bg-white px-4 py-2 rounded-full w-max shadow-lg">
                {service.time}
              </span>
              <h3 className="text-3xl font-black text-white leading-tight transition-transform duration-500 group-hover:-translate-y-2">
                {service.title}
              </h3>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                Explore Details →
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
