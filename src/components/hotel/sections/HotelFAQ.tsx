"use client";

import React, { useState } from "react";
import { ChevronDown, Plus, Minus, Search } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "How can I book a room online?",
    answer: "Booking a room is easy! Simply use the search tool at the top of the page, select your dates, and proceed to choose a room from the available list."
  },
  {
    id: 2,
    question: "What is your cancellation policy?",
    answer: "We offer full refunds for cancellations made at least 24 hours prior to check-in. Cancellations within 24 hours incur a 1-night stay charge."
  },
  {
    id: 3,
    question: "Do you offer free airport transfers?",
    answer: "Free airport transfers are available for all premium suite bookings. For other room types, transfers can be arranged for a nominal fee."
  },
  {
    id: 4,
    question: "Is breakfast included in the package?",
    answer: "Many of our room packages include complimentary continental breakfast. You can verify this during the room selection process."
  },
  {
    id: 5,
    question: "Can I host a corporate event here?",
    answer: "Yes, we have state-of-the-art conference rooms and banquet halls specifically designed for corporate summits and large events."
  },
  {
    id: 6,
    question: "What are the common payment methods?",
    answer: "We accept all major credit/debit cards (HDFC, Kotak, SBI, etc.), UPI payments, Net Banking, and cash at the reception."
  }
];

export default function HotelFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto w-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-[150px] -mr-[250px] -mt-[250px]" />
      
      <div className="text-center mb-24 max-w-[1000px] mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] mb-8 leading-none tracking-tight">
          Common <span className="text-orange-500 underline decoration-[6px] decoration-orange-500/20 underline-offset-[12px]">Inquiries</span>
        </h2>
        <p className="text-gray-500 font-medium text-xl max-w-[700px] mx-auto leading-relaxed">
          Need help? Here are some of the most frequently asked questions about our property and booking process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1280px] mx-auto px-6">
        <div className="space-y-6">
          {faqs.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-[40px] p-8 md:p-10 border-2 transition-all duration-300 cursor-pointer group shadow-[0_20px_60px_-20px_rgba(0,0,0,0.06)] hover:border-orange-500/30 ${openId === item.id ? 'border-orange-500' : 'border-gray-50'}`}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-black transition-colors ${openId === item.id ? 'text-orange-500' : 'text-[#1a1a1a]'}`}>
                  {item.question}
                </h3>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openId === item.id ? 'bg-orange-500 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-50'}`}>
                   {openId === item.id ? <Minus size={20} strokeWidth={4} /> : <Plus size={20} strokeWidth={4} />}
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === item.id ? 'max-h-[300px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 font-medium text-lg leading-relaxed border-t border-gray-50 pt-8">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {faqs.slice(3, 6).map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-[40px] p-8 md:p-10 border-2 transition-all duration-300 cursor-pointer group shadow-[0_20px_60px_-20px_rgba(0,0,0,0.06)] hover:border-orange-500/30 ${openId === item.id ? 'border-orange-500' : 'border-gray-50'}`}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-black transition-colors ${openId === item.id ? 'text-orange-500' : 'text-[#1a1a1a]'}`}>
                  {item.question}
                </h3>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openId === item.id ? 'bg-orange-500 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-50'}`}>
                   {openId === item.id ? <Minus size={20} strokeWidth={4} /> : <Plus size={20} strokeWidth={4} />}
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === item.id ? 'max-h-[300px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 font-medium text-lg leading-relaxed border-t border-gray-50 pt-8">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-24 bg-black p-12 md:p-20 rounded-[60px] max-w-[1280px] mx-auto text-center relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-orange-500/30 transition-transform group-hover:scale-110">
            <Search size={36} className="text-white" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Didn’t find the answer?</h3>
          <p className="text-gray-400 font-medium text-xl max-w-[600px] mb-12 leading-relaxed">
            Reach out to our 24/7 customer support team for any specialized inquiries or booking assistance.
          </p>
          <button className="bg-orange-500 text-white px-12 py-6 rounded-[3rem] font-black uppercase tracking-widest text-[14px] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-[0.98]">
            Contact Support Now
          </button>
        </div>
      </div>
    </section>
  );
}
