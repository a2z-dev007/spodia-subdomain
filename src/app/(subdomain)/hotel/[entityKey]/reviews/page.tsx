import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Filter, PenLine } from "lucide-react";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function ReviewsPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, reviews } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Guest Experiences"
        subtitle={`See what our guests have to say about their stay at ${name}. Authentic reviews from verified travelers.`}
      />

      {/* 2. Aggregate Rating Display */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="bg-white rounded-[48px] p-10 md:p-20 border border-gray-100 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="text-center lg:border-r border-gray-100">
               <h3 className="text-8xl font-black text-gray-900 mb-4">4.8</h3>
               <div className="flex justify-center gap-2 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-8 h-8 text-[#FF9530] fill-current" />)}
               </div>
               <p className="text-gray-500 font-bold text-lg uppercase tracking-widest">Based on 1,240 Reviews</p>
            </div>
            
            <div className="lg:col-span-1 space-y-4">
               {[
                 {label: "Excellence", val: 85},
                 {label: "Good", val: 10},
                 {label: "Average", val: 3},
                 {label: "Poor", val: 2},
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-bold text-gray-500 uppercase">{item.label}</span>
                    <div className="flex-grow h-3 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-[#FF9530] rounded-full" style={{width: `${item.val}%`}} />
                    </div>
                    <span className="w-12 text-sm font-black text-gray-900">{item.val}%</span>
                 </div>
               ))}
            </div>

            <div className="text-center lg:pl-12">
               <h4 className="text-2xl font-black text-gray-900 mb-6">Had a great stay?</h4>
               <p className="text-gray-500 mb-10 font-medium">Your feedback helps us and other travelers. Share your story!</p>
               <button className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#FF9530] transition-all flex items-center justify-center gap-3 mx-auto group">
                  <PenLine className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Write a Review
               </button>
            </div>
         </div>
      </section>

      {/* 4. Review List & Filters */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="text-3xl font-black text-gray-900">All Guest Voices</h2>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-widest">
                  <Filter className="w-4 h-4" /> Filter By:
               </div>
               <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-black text-gray-900 outline-none">
                  <option>Newest First</option>
                  <option>Highest Rated</option>
                  <option>Lowest Rated</option>
               </select>
            </div>
         </div>

         <div className="space-y-10">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-10 md:p-16 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-[#FF9530] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200">
                          {review.author.charAt(0)}
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-gray-900 mb-1">{review.author}</h4>
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-bold text-gray-400">{review.location}</span>
                             <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                             <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Verified Stay
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => (
                         <Star key={i} className={`w-6 h-6 ${i <= review.rating ? "text-[#FF9530] fill-current" : "text-gray-100 fill-current"}`} />
                       ))}
                    </div>
                 </div>

                 <p className="text-2xl font-medium text-gray-700 leading-relaxed italic mb-10">
                    "{review.quote}"
                 </p>

                 <div className="flex items-center justify-between border-t border-gray-50 pt-8 mt-10">
                    <div className="flex gap-4">
                       <button className="flex items-center gap-2 text-gray-400 hover:text-[#FF9530] transition-colors font-bold text-sm">
                          <ThumbsUp className="w-5 h-5" /> Helpful (24)
                       </button>
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Oct 12, 2023</span>
                 </div>

                 {/* 6. Response from Owner (Simulated) */}
                 <div className="mt-12 bg-gray-50 p-8 rounded-[32px] border-l-4 border-[#FF9530]">
                    <div className="flex items-center gap-3 mb-4">
                       <MessageSquare className="w-5 h-5 text-[#FF9530]" />
                       <span className="font-black text-gray-900 uppercase text-xs tracking-widest">Response from {name}</span>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">
                       Thank you so much for your kind words, {review.author}! We're thrilled to hear you enjoyed your stay. We hope to welcome you back soon for another wonderful experience.
                    </p>
                 </div>
              </div>
            ))}
         </div>
         
         <div className="mt-20 text-center">
            <button className="bg-gray-50 text-gray-400 border border-gray-100 px-12 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all uppercase tracking-widest">
               Load More Reviews
            </button>
         </div>
      </section>

    </HotelPageShell>
  );
}
