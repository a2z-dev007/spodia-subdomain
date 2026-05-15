"use client";
import React, { useState } from "react";
import { Star, Upload, Info, Check } from "lucide-react";

const WriteReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-[1000px] mx-auto">
        <div className="bg-white rounded-[64px] p-10 md:p-20 shadow-2xl border border-gray-100 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full -mr-[250px] -mt-[250px] z-0" />

          <div className="relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 px-6 py-2 rounded-full mb-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
                  <Check className="w-4 h-4 text-green-500" /> Verified Guest Program
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Share Your Experience</h2>
               <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
                 Your honest feedback helps us improve and guides fellow travelers in finding their perfect stay.
               </p>
            </div>

            <form className="space-y-12">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-4">
                 <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Overall Rating</span>
                 <div className="flex gap-3">
                   {[1, 2, 3, 4, 5].map((i) => (
                     <button
                       key={i}
                       type="button"
                       onMouseEnter={() => setHoverRating(i)}
                       onMouseLeave={() => setHoverRating(0)}
                       onClick={() => setRating(i)}
                       className="transition-all transform hover:scale-125"
                     >
                       <Star 
                         className={`w-12 h-12 ${
                           i <= (hoverRating || rating) ? "text-[#FF9530] fill-[#FF9530]" : "text-gray-100 fill-gray-100"
                         }`} 
                       />
                     </button>
                   ))}
                 </div>
                 {rating > 0 && (
                   <span className="text-orange-500 font-black text-xl animate-bounce">
                     {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Average" : "Poor"}
                   </span>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Review Title</label>
                    <input 
                      type="text" 
                      placeholder="Summarize your experience" 
                      className="w-full bg-gray-50 border border-transparent rounded-[24px] p-6 font-bold text-gray-900 outline-none focus:bg-white focus:border-[#FF9530] transition-all shadow-inner"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Trip Type</label>
                    <select className="w-full bg-gray-50 border border-transparent rounded-[24px] p-6 font-bold text-gray-900 outline-none focus:bg-white focus:border-[#FF9530] transition-all shadow-inner appearance-none">
                       <option>Select Type</option>
                       <option>Family Trip</option>
                       <option>Business Trip</option>
                       <option>Couple Getaway</option>
                       <option>Solo Adventure</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Your Review</label>
                 <textarea 
                   rows={6}
                   placeholder="Share details of your stay... What did you like? What can we improve?" 
                   className="w-full bg-gray-50 border border-transparent rounded-[32px] p-8 font-bold text-gray-900 outline-none focus:bg-white focus:border-[#FF9530] transition-all shadow-inner"
                 />
              </div>

              {/* Photo Upload */}
              <div className="space-y-6">
                 <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Add Photos (Max 5)</label>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <button type="button" className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center gap-2 hover:border-[#FF9530] hover:bg-orange-50 transition-all group">
                       <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#FF9530]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#FF9530]">Upload</span>
                    </button>
                    {[1,2,3,4].map(i => (
                      <div key={i} className="aspect-square bg-gray-50/50 border border-gray-100 rounded-[24px]" />
                    ))}
                 </div>
              </div>

              {/* Guidelines Info */}
              <div className="bg-blue-50 p-6 rounded-[24px] flex gap-4">
                 <Info className="w-6 h-6 text-blue-500 shrink-0" />
                 <p className="text-xs font-bold text-blue-700 leading-relaxed">
                   By submitting, you agree to our Review Guidelines. Your review will be moderated and typically appears within 24-48 hours.
                 </p>
              </div>

              <div className="text-center pt-8">
                 <button className="bg-gray-900 text-white px-16 py-6 rounded-[32px] font-black text-xl hover:bg-[#FF9530] transition-all shadow-2xl hover:shadow-orange-200 uppercase tracking-widest">
                    Submit Review
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriteReviewForm;
