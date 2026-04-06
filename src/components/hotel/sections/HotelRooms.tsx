"use client";

import React from "react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const rooms = [
  {
    id: 1,
    title: "Deluxe Room",
    price: "4,499",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
    amenities: ["King Bed", "Jacuzzi", "Fiber WiFi"],
    rating: 4.8,
  },
  {
    id: 2,
    title: "Superior Room",
    price: "4,899",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    amenities: ["King Bed", "Garden View", "Premium Bar"],
    rating: 4.9,
  },
  {
    id: 3,
    title: "Executive Suite",
    price: "6,499",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    amenities: ["Suite Room", "Large Space", "Private Desk"],
    rating: 5.0,
  }
];

export default function HotelRooms() {
  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2 gap-8">
        <div>
          <h2 className="text-5xl md:text-6xl font-black text-[#1a1a1a] leading-none mb-6">
            Rooms & <span className="text-[#FF7A00]">Suites</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-[600px] text-lg">
            Experience unparalleled luxury in our carefully curated rooms designed for the modern traveler seeking comfort and elegance.
          </p>
        </div>
        <button className="bg-[#FF7A00] text-white px-10 py-5 rounded-[40px] font-black uppercase tracking-widest text-sm hover:bg-[#e66e00] transition-all shadow-xl shadow-orange-500/20 active:scale-95">
          View All Rooms
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {rooms.map((room) => (
          <div key={room.id} className="group cursor-pointer">
            <div className="relative h-[480px] w-full rounded-[40px] overflow-hidden mb-8 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <Image 
                src={room.image} 
                alt={room.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <span className="text-orange-500 font-black">★</span>
                <span className="text-sm font-bold text-[#1a1a1a]">{room.rating}</span>
                <span className="text-xs text-gray-400 font-bold border-l pl-2 border-gray-200">240+ REVIEWS</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="px-2">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-black text-[#1a1a1a]">{room.title}</h3>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Starting from</span>
                  <span className="text-2xl font-black text-[#FF7A00]">₹{room.price}<span className="text-sm text-gray-400 ml-1">/ NIGHT</span></span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-10 pb-8 border-b border-gray-100">
                {room.amenities.map(item => (
                  <span key={item} className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">{item}</span>
                ))}
              </div>
              
              <button className="w-full bg-[#1a1a1a] text-white py-5 rounded-[40px] font-black uppercase tracking-widest text-[13px] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]">
                Book This Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
