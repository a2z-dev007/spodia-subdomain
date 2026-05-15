"use client";
import React from "react";
import { Star } from "lucide-react";

const RatingBreakdown = () => {
  const categories = [
    { label: "Cleanliness", score: 4.6, total: 5 },
    { label: "Service", score: 4.8, total: 5 },
    { label: "Location", score: 4.4, total: 5 },
    { label: "Value", score: 4.5, total: 5 },
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full -mt-20 relative z-20">
      <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-16 border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Overall Score */}
        <div className="text-center lg:border-r lg:border-gray-100 lg:pr-16">
          <div className="inline-block p-4 bg-orange-50 rounded-3xl mb-6">
             <Star className="w-12 h-12 text-[#FF9530] fill-[#FF9530]" />
          </div>
          <h2 className="text-7xl md:text-8xl font-black text-gray-900 mb-4">4.5<span className="text-3xl text-gray-300">/5</span></h2>
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-8 h-8 text-[#FF9530] fill-[#FF9530]" />
            ))}
            <Star className="w-8 h-8 text-gray-200 fill-gray-200" />
          </div>
          <p className="text-gray-500 font-bold text-lg uppercase tracking-widest">
            Based on 1,200 Verified Reviews
          </p>
        </div>

        {/* Right Side: Category Breakdown */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-gray-900 mb-8">Category Breakdown</h3>
          {categories.map((cat, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest text-gray-500">{cat.label}</span>
                <span className="text-lg font-black text-gray-900">{cat.score}<span className="text-xs text-gray-300">/5</span></span>
              </div>
              <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF9530] to-[#FFB347] rounded-full" 
                  style={{ width: `${(cat.score / cat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingBreakdown;
