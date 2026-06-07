"use client";
import React from "react";
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Share2, Flag, ChevronRight } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    id: 1,
    author: "Rajesh K.",
    location: "Mumbai",
    stayDetails: "Stayed 3 Nights · June 2024 · Family Trip",
    rating: 5,
    title: "Perfect Family Getaway!",
    text: "The staff went above and beyond to make our family stay memorable. The kids loved the pool, and the breakfast spread was incredible. The ocean view from our balcony was the highlight of each morning.",
    helpfulVotes: 12,
    date: "June 15, 2024",
    response: "Thank you, Rajesh! We're thrilled your family had such a wonderful time. We hope to host you again soon!"
  },
  {
    id: 2,
    author: "Anita S.",
    location: "Bangalore",
    stayDetails: "Stayed 2 Nights · May 2024 · Couple",
    rating: 5,
    title: "Romantic Sunset Dinners",
    text: "Everything was perfect. The candlelit dinner by the beach arranged by the concierge was the most romantic experience we've had. Clean rooms and very polite staff.",
    helpfulVotes: 8,
    date: "May 28, 2024",
    response: "It was our pleasure, Anita! So glad we could help make your trip special."
  },
  {
    id: 3,
    author: "David M.",
    location: "London",
    stayDetails: "Stayed 5 Nights · April 2024 · Business",
    rating: 4,
    title: "Fast WiFi & Quiet Workspaces",
    text: "As a business traveler, I appreciated the stable high-speed internet and the quiet lounge area. The room was spacious and the desk was comfortable. Only minor issue was the morning traffic noise.",
    helpfulVotes: 15,
    date: "April 10, 2024",
    response: "Thank you for the detailed feedback, David. We're glad the facilities met your professional needs!"
  }
];

const ReviewGrid = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
      <div className="space-y-12">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-[40px] p-10 md:p-16 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
              {/* Guest Profile */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF9530] to-[#FFB347] rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-orange-100 transform group-hover:rotate-6 transition-transform">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 mb-1">{review.author} · <span className="text-gray-400 font-bold text-lg">{review.location}</span></h4>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {review.stayDetails}
                    <span className="w-1.5 h-1.5 bg-[#00B67A] rounded-full"></span>
                    <span className="text-[#00B67A] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Verified Stay
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating & Actions */}
              <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-6 h-6 ${i <= review.rating ? "text-[#FF9530] fill-[#FF9530]" : "text-gray-100 fill-gray-100"}`} />
                  ))}
                </div>
                <div className="flex gap-4">
                  <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#FF9530] transition-colors border border-gray-100">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors border border-gray-100">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h5 className="text-2xl font-black text-gray-900 mb-4">{review.title}</h5>
              <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
                "{review.text}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-gray-50">
               <button className="flex items-center gap-3 bg-gray-50 hover:bg-orange-50 px-6 py-3 rounded-2xl border border-gray-100 transition-all group/btn">
                  <ThumbsUp className="w-5 h-5 text-gray-400 group-hover/btn:text-[#FF9530] group-hover/btn:-translate-y-1 transition-all" />
                  <span className="text-sm font-black text-gray-500 group-hover/btn:text-[#FF9530]">{review.helpfulVotes} found this helpful</span>
               </button>
               <span className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">{review.date}</span>
            </div>

            {/* Manager Response */}
            {review.response && (
              <div className="mt-12 bg-gray-50/50 p-8 md:p-12 rounded-[32px] border-l-8 border-[#FF9530] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <MessageSquare className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="w-10 h-10 bg-[#FF9530] rounded-xl flex items-center justify-center text-white">
                      <MessageSquare className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Response from Hotel Manager</span>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed font-bold relative z-10">
                  {review.response}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
         <div className="inline-flex items-center gap-8 bg-white border border-gray-100 p-3 rounded-3xl shadow-xl shadow-gray-100/50">
            <button className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#FF9530] transition-all uppercase tracking-widest shadow-lg shadow-gray-200">
               Load More Reviews
            </button>
            <p className="pr-8 text-sm font-bold text-gray-400">Showing 1–3 of 1,200 Reviews</p>
         </div>
      </div>
    </section>
  );
};

export default ReviewGrid;
