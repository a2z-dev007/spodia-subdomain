"use client";

import React from "react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import roomsData from "@/data/jsons/rooms.json";

export default function RoomReviews() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16">
      <div className="bg-[#F9F9F7] rounded-[48px] p-10 md:p-16 lg:p-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 tracking-tight">
            What Guests Say About Our Rooms
          </h2>
          <Link 
            href="#" 
            className="flex items-center gap-2 text-base font-bold text-[#FF7A00] hover:opacity-80 transition-all group"
          >
            See All Room Reviews
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomsData.reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-[32px] p-8 md:p-10 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? "fill-[#FF7A00] text-[#FF7A00]" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              
              <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed mb-12 flex-1">
                {review.text}
              </p>

              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm font-bold text-gray-400">
                  — {review.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
