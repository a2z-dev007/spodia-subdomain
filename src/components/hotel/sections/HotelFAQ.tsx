"use client";

import React, { useState, useEffect } from "react";
import { Plus, HelpCircle, ArrowRight, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import type { ListingDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { getFAQs } from "@/services/api";

type Props = {
  hotelData?: ListingDetail | null;
  entityKey?: string;
};

const defaultFaqs = [
  {
    id: 1,
    question: "What are the check-in and check-out times?",
    answer: "Standard check-in is from 12:00 PM and check-out is until 11:00 AM. Early check-in or late check-out is subject to room availability and property policies.",
  },
  {
    id: 2,
    question: "How do I contact support or property reception?",
    answer: "You can reach customer support at care@spodia.com or call our 24/7 hotline. Property specific contact details are provided upon booking confirmation.",
  },
  {
    id: 3,
    question: "Can I modify or cancel my reservation?",
    answer: "Yes, modifications and cancellations can be managed from 'My Bookings' on your dashboard according to the property's cancellation policy.",
  },
  {
    id: 4,
    question: "What documents are required during check-in?",
    answer: "A valid government-issued photo ID (Passport, Aadhaar Card, Driving License) and your booking confirmation voucher are required at check-in.",
  },
  {
    id: 5,
    question: "Is parking available at the property?",
    answer: "Yes, complimentary or valet parking is available for guests staying at the property.",
  },
  {
    id: 6,
    question: "Are pets allowed at the property?",
    answer: "Pet policies vary by room category. Please contact reception prior to arrival if traveling with pets.",
  },
  {
    id: 7,
    question: "Do you offer airport transfer services?",
    answer: "Yes, airport pickup and drop-off services can be arranged upon request with our concierge.",
  },
  {
    id: 8,
    question: "Is breakfast included in the booking rate?",
    answer: "Breakfast options depend on your chosen rate plan (CP, MAP, AP include breakfast, while EP is room-only).",
  },
  {
    id: 9,
    question: "Is high-speed Wi-Fi provided in all rooms?",
    answer: "Complimentary high-speed fiber Wi-Fi is available across all guest rooms and common areas.",
  },
  {
    id: 10,
    question: "What payment methods are accepted?",
    answer: "We accept all major Credit/Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Razorpay payments.",
  },
  {
    id: 11,
    question: "Can I request extra bedding or an extra bed in my room?",
    answer: "Yes, extra mattresses/beds are available for an additional charge depending on room capacity.",
  },
  {
    id: 12,
    question: "Is 24/7 room service available?",
    answer: "Yes, in-room dining and guest assistance are available 24 hours a day.",
  }
];

export default function HotelFAQ({ hotelData, entityKey }: Props) {
  const [openId, setOpenId] = useState<number | null>(1);
  const [faqList, setFaqList] = useState<any[]>([]);

  const slug = entityKey || hotelData?.entityKey || hotelData?.slug || "palm-resort";
  const name = hotelData?.name || "HM Resort";

  useEffect(() => {
    if (hotelData?.id) {
      getFAQs({ listing: hotelData.id })
        .then((res) => {
          const records = res?.data?.records || res?.data?.faqs || res?.data;
          if (Array.isArray(records) && records.length > 0) {
            setFaqList(
              records.map((item: any, idx: number) => ({
                id: item.id || idx + 1,
                question: item.question || item.faq_question,
                answer: item.answer || item.faq_answer,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [hotelData?.id]);

  const displayFaqs = faqList.length > 0 ? faqList : defaultFaqs;
  const isUsingStatic = faqList.length === 0;

  // Limit to top 10 questions on main hotel details page
  const visibleFaqs = displayFaqs.slice(0, 10);

  return (
    <section className="bg-gradient-to-b from-white via-gray-50/50 to-white py-16 md:py-24 px-4 md:px-12 w-full font-manrope">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 max-w-[750px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/80 text-[#FF9530] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-2xs">
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {name} FAQs
            </h2>
            {isUsingStatic && (
              <StaticDataBadge text="static data - need this data on the api" />
            )}
          </div>
          
          <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
            Find quick answers to common questions regarding check-in policies, room amenities, and booking procedures.
          </p>
        </div>

        {/* Clean Modern Accordion List */}
        <div className="space-y-3.5 mb-10">
          {visibleFaqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-2xs overflow-hidden ${
                  isOpen 
                    ? "border-orange-300 ring-2 ring-orange-500/10 shadow-md" 
                    : "border-gray-200/90 hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className={`w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 transition-colors duration-200 ${
                    isOpen ? "bg-orange-50/40" : "bg-white hover:bg-gray-50/60"
                  }`}
                >
                  <span className="font-extrabold text-sm sm:text-base md:text-lg text-gray-900 leading-snug">
                    {item.question}
                  </span>
                  
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#FF9530] text-white rotate-45 shadow-xs"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Animated Accordion Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 pt-2 border-t border-orange-100/70 bg-white">
                      <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 font-medium">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered See All FAQs CTA Button */}
        <div className="flex flex-col items-center justify-center pt-2">
          <Link
            href={`/hotel/${slug}/faqs`}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
          >
            <span>See All FAQs ({displayFaqs.length} Total Questions)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-gray-400 text-xs font-semibold mt-2.5">
            Can't find your question? Explore our dedicated FAQ page or contact reception.
          </span>
        </div>

      </div>
    </section>
  );
}
