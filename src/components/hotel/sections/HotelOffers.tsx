"use client";

import React from "react";
import Image from "next/image";

const offers = [
  {
    id: 1,
    title: "Flat 10% Off",
    description: "On all bookings made via HDFC Bank Debit/Credit Cards.",
    bank: "HDFC BANK",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    tagColor: "bg-blue-600",
  },
  {
    id: 2,
    title: "Flat 15% Off",
    description: "Exclusive discount for Kotak Mahindra Bank customers.",
    bank: "KOTAK BANK",
    bgColor: "bg-red-50",
    textColor: "text-red-900",
    tagColor: "bg-red-600",
  },
  {
    id: 3,
    title: "Free Breakfast",
    description: "Become a member and enjoy free breakfast on every stay.",
    bank: "MEMBERS ONLY",
    bgColor: "bg-orange-50",
    textColor: "text-orange-900",
    tagColor: "bg-[#FF7A00]",
  }
];

export default function HotelOffers() {
  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className={`${offer.bgColor} rounded-3xl p-8 flex flex-col justify-between h-[240px] transition-transform hover:scale-[1.02] cursor-pointer shadow-sm relative overflow-hidden`}
          >
            <div>
              <span className={`${offer.tagColor} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
                {offer.bank}
              </span>
              <h3 className={`text-3xl font-black ${offer.textColor} mt-4`}>{offer.title}</h3>
              <p className={`text-sm ${offer.textColor}/80 mt-2 max-w-[200px]`}>{offer.description}</p>
            </div>
            <div className="flex justify-end">
              <button className="text-sm font-bold underline decoration-2 underline-offset-4">REDEEM NOW</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
