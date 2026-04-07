"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Where are your offices located?",
    answer:
      "Our main headquarters are strategically located in key business hubs. You can find our detailed address and office contacts on our official corporate website's contact page.",
  },
  {
    id: 2,
    question: "How do I contact Spodia support?",
    answer:
      "You can reach our support team through our Contact Us page, by emailing care@spodia.com, or by calling our helpline at +91-7399-666-688. We're available Monday to Sunday, 9 AM - 9 PM IST to assist you.",
  },
  {
    id: 3,
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes, you can modify or cancel your booking through the 'My Bookings' section on our platform. Please note that modifications are subject to availability and specific property policies.",
  },
  {
    id: 4,
    question: "Are there any cancellation fees?",
    answer:
      "Cancellation fees depend on the specific hotel policy and the timing of your cancellation. Always check the 'Cancellation Policy' on the hotel page before finalizing your booking.",
  },
];

export default function HotelFAQ() {
  const [openId, setOpenId] = useState<number | null>(2);

  return (
    <section className="bg-white py-10 px-6 w-full">
      <div className="max-w-[1600px] mx-auto bg-[#F9FBFF] rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.04)] p-8 md:p-16">
        {/* Section Header */}
        <div className="text-center mb-16 mx-auto">
          <h2 className="text-[32px] md:text-[38px] font-black text-[#2D3142] mb-6 whitespace-nowrap">
            Frequently Asked Questions About Booking Hotels on Spodia
          </h2>
          <p className="text-[#9CA3AF] font-medium text-[15px] leading-relaxed">
            Discover trusted hotels across countries, enjoy competitive rates,
            secure payments, and seamless booking experiences designed for
            global travelers.
          </p>
        </div>

        {/* FAQ List */}
        <div className="w-full space-y-4 px-1 md:px-2">
          {faqs.map((item) => (
            <div
              key={item.id}
              className={`rounded-[20px] transition-all duration-300 overflow-hidden border ${
                openId === item.id
                  ? "bg-[#F97316] border-[#F97316] shadow-lg shadow-orange-100"
                  : "bg-white border-gray-100 hover:border-orange-200"
              }`}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex justify-between items-center p-6 md:px-10 text-left group"
              >
                <span
                  className={`text-[17px] md:text-[19px] font-bold ${
                    openId === item.id ? "text-white" : "text-[#1a1a1a]"
                  }`}
                >
                  {item.question}
                </span>
                <div
                  className={`transition-transform duration-300 ${
                    openId === item.id ? "rotate-0" : "rotate-0"
                  }`}
                >
                  {openId === item.id ? (
                    <X size={24} className="text-white" />
                  ) : (
                    <Plus
                      size={24}
                      className="text-[#1a1a1a] opacity-40 group-hover:opacity-100"
                    />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openId === item.id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 md:px-8 md:pb-8 pt-0">
                  <p
                    className={`text-[15px] md:text-[16px] leading-relaxed font-medium ${
                      openId === item.id ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
