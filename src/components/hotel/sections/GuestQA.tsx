"use client";
import React from "react";
import { MessageSquare, HelpCircle, ChevronRight, User } from "lucide-react";

const questions = [
  {
    q: "Is the pool heated?",
    a: "Yes, the main pool is maintained at a comfortable 28°C year-round! Our guests love it even during the cooler evenings.",
    author: "Hotel Staff"
  },
  {
    q: "Do rooms have kettles?",
    a: "Yes, all suites and deluxe rooms include electric kettles with a selection of teas and coffee.",
    author: "Verified Guest"
  }
];

const GuestQA = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
        
        {/* Left Side: Ask a Question */}
        <div className="lg:w-1/3 space-y-8 sticky top-40">
           <div className="inline-flex items-center gap-3 bg-[#FF9530]/10 px-4 py-2 rounded-full text-[#FF9530] font-black text-[10px] uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" /> Guest Community
           </div>
           <h2 className="text-4xl font-black text-gray-900 leading-tight">Have a Question? <br/> Ask Past Guests!</h2>
           <p className="text-gray-500 font-medium">Get real answers from people who have stayed here recently.</p>
           
           <div className="space-y-4">
              <textarea 
                placeholder="Ask about breakfast, WiFi, or nearby parking..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 font-bold text-gray-900 outline-none focus:border-[#FF9530] transition-all min-h-[150px]"
              />
              <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#FF9530] transition-all shadow-xl">
                 Ask Question
              </button>
           </div>
        </div>

        {/* Right Side: Questions List */}
        <div className="lg:w-2/3 w-full space-y-10">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Recently Answered</h3>
           <div className="space-y-8">
              {questions.map((item, i) => (
                <div key={i} className="group">
                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <MessageSquare className="w-24 h-24" />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                       <div className="flex gap-6">
                          <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl shrink-0 flex items-center justify-center font-black text-xl">Q</div>
                          <p className="text-2xl font-black text-gray-900 leading-tight pt-2">{item.q}</p>
                       </div>
                       
                       <div className="flex gap-6">
                          <div className="w-12 h-12 bg-[#FF9530] text-white rounded-2xl shrink-0 flex items-center justify-center font-black text-xl">A</div>
                          <div className="space-y-4 pt-2">
                             <p className="text-lg text-gray-600 font-bold leading-relaxed">{item.a}</p>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <User className="w-3 h-3" /> Answered by {item.author}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="text-center pt-8">
              <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#FF9530] transition-colors">
                 See All 15 Questions <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>
    </section>
  );
};

export default GuestQA;
