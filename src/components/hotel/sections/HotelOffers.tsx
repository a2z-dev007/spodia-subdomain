"use client";

import React from "react";
import {
  CreditCard,
  Tag,
  Utensils,
  Landmark,
  Coffee,
  Percent,
} from "lucide-react";

interface Offer {
  id: number;
  bank: string;
  title: string;
  description: string;
  bgColor: string;
  accentColor: string;
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
}

const offers: Offer[] = [
  {
    id: 1,
    bank: "HDFC BANK",
    title: "Flat 10% Off",
    description: "on International Hotels with HDFC Bank Cards",
    bgColor: "bg-[#EEF4FF]",
    accentColor: "text-[#3B4CB8]",
    icon: <Landmark className="w-4 h-4" />,
    bgIcon: <CreditCard className="w-32 h-32 text-[#3B4CB8]/10" />,
  },
  {
    id: 2,
    bank: "KOTAK BANK",
    title: "Flat 15% Off",
    description: "on Domestic Stays with Kotak Credit Card EMI",
    bgColor: "bg-[#FFF0F0]",
    accentColor: "text-[#D32F2F]",
    icon: <Percent className="w-4 h-4" />,
    bgIcon: <Tag className="w-32 h-32 text-[#D32F2F]/10" />,
  },
  {
    id: 3,
    bank: "MEMBERS ONLY",
    title: "Free Breakfast",
    description: "on all LuxeStay curated boutique hotels",
    bgColor: "bg-[#FFFBEC]",
    accentColor: "text-[#996A12]",
    icon: <Coffee className="w-4 h-4" />,
    bgIcon: <Utensils className="w-32 h-32 text-[#996A12]/10" />,
  },
];

export default function HotelOffers() {
  return (
    <section className="pt-16 pb-4 px-4 max-w-[1600px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`${offer.bgColor} rounded-[32px] px-8 py-5 flex flex-col justify-center h-[190px] transition-all hover:shadow-xl cursor-pointer relative overflow-hidden group`}
          >
            {/* Content Container */}
            <div className="relative z-10 pl-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-8 h-8 rounded-full ${offer.bgColor} border border-white flex items-center justify-center shadow-sm ${offer.accentColor}`}
                >
                  {offer.icon}
                </div>
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-widest ${offer.accentColor}`}
                >
                  {offer.bank}
                </span>
              </div>

              <h3 className="text-[26px] font-black text-[#1a1a1a] mb-2 leading-tight">
                {offer.title}
              </h3>
              <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Faint Background Icon */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
              {offer.bgIcon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
