"use client";
import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";

const TariffFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I modify my dates after booking?",
      a: "Yes! You can modify your dates up to 48 hours before your check-in time without any additional charges, subject to room availability.",
    },
    {
      q: "Is breakfast included in the rate?",
      a: "Most of our rates include a complimentary buffet breakfast. However, please check the 'Includes' section on your selected room card to confirm.",
    },
    {
      q: "Are there any hidden fees or taxes?",
      a: "No, we believe in 100% transparency. The total price shown in the booking widget includes all applicable taxes and fees.",
    },
    {
      q: "What is your cancellation policy?",
      a: "We offer free cancellation up to 48 hours before check-in. Cancellations made within 48 hours will incur a charge for the first night.",
    },
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Booking Queries?</h2>
          <p className="text-gray-600 text-lg font-medium">Everything you need to know about rates, payments, and policies.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border rounded-[32px] overflow-hidden transition-all duration-300 ${openIndex === i ? "border-[#FF9530] bg-orange-50/30" : "border-gray-100 bg-white"}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 flex justify-between items-center text-left"
              >
                <span className="text-lg font-black text-gray-900">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? "bg-[#FF9530] text-white" : "bg-gray-50 text-gray-400"}`}>
                  {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-[300px] pb-8 px-8" : "max-h-0"}`}>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <button className="inline-flex items-center gap-3 text-[#FF9530] font-black uppercase tracking-widest hover:gap-5 transition-all">
              View Full Booking Policy
              <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default TariffFAQ;
