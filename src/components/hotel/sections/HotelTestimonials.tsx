"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { getReviews } from "@/services/api";

type Props = {
  hotelData?: ListingDetail | null;
};

const defaultTestimonials = [
  {
    id: 1,
    name: "Sonam Kumra",
    text: "The room and hospitality were breathtaking! Waking up to a serene atmosphere was exactly what I needed.",
    rating: 5,
    initial: "S",
  },
  {
    id: 2,
    name: "Kripa Sharma",
    text: "Incredible service. The suite had wonderful views and clean facilities. Highly recommended!",
    rating: 5,
    initial: "K",
  },
  {
    id: 3,
    name: "Vijay Savalia",
    text: "Perfect for our family trip. Staff were super helpful and check-in was smooth.",
    rating: 5,
    initial: "V",
  },
];

export default function HotelTestimonials({ hotelData }: Props) {
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    if (hotelData?.id) {
      getReviews(hotelData.id)
        .then((res) => {
          const records = res?.data?.records || res?.data?.reviews || res?.data;
          if (Array.isArray(records) && records.length > 0) {
            setReviewsList(
              records.slice(0, 6).map((item: any, idx: number) => ({
                id: item.id || idx + 1,
                name: item.user_name || item.name || "Guest",
                text: item.review_text || item.comment || item.review || "Wonderful stay!",
                rating: item.rating || 5,
                initial: (item.user_name || item.name || "G").charAt(0).toUpperCase(),
              }))
            );
          }
        })
        .catch(() => {
          // Ignore
        });
    }
  }, [hotelData?.id]);

  const displayTestimonials = reviewsList.length > 0 ? reviewsList : defaultTestimonials;
  const isUsingStatic = reviewsList.length === 0;

  return (
    <section className="bg-[#F9FBFF] pt-16 pb-20 w-full">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline md:items-center mb-10 gap-4 px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[36px] font-black text-[#2D3142]">
              Guest Experiences
            </h2>
            {isUsingStatic && <StaticDataBadge text="static data - need this data on the api" />}
          </div>
          {hotelData?.review_rating && (
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-xs">
              <Star size={16} className="text-[#FBBF24] fill-[#FBBF24]" />
              <span className="font-black text-gray-900 text-sm">
                {hotelData.review_rating} / 5
              </span>
              {hotelData.review_rating_count && (
                <span className="text-gray-400 text-xs font-medium">
                  ({hotelData.review_rating_count} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] px-8 py-7 border border-gray-100/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] flex flex-col h-full group transition-all hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(Number(item.rating) || 5)].map((_, i) => (
                  <Star key={i} size={15} className="text-[#FBBF24] fill-[#FBBF24]" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-[#1a1a1a] text-[14.5px] font-medium leading-[1.6] mb-6 min-h-[60px]">
                "{item.text}"
              </p>

              <div className="w-full h-px bg-gray-100 mb-4 mt-auto" />

              {/* Author Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-[13px]">
                  {item.initial}
                </div>
                <h4 className="text-[13.5px] font-bold text-[#1a1a1a]">{item.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
