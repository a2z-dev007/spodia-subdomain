"use client";

import React from "react";
import Image from "next/image";
import { Plane, Sun, ShoppingBag, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import roomsData from "@/data/jsons/rooms.json";

const iconMap: Record<string, any> = {
  Plane,
  Sun,
  ShoppingBag,
};

export default function RoomLocationFAQ() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-20 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left Column: Location */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Location</h2>
          
          <div className="relative w-full h-[450px] rounded-[32px] overflow-hidden mb-8 border border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={roomsData.location.mapImage}
              alt="Hotel Location Map"
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="eager"
            />
            {/* Custom Orange Pin Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="relative">
                <MapPin className="w-12 h-12 text-[#FF7A00] fill-[#FF7A00]/20 drop-shadow-[0_4px_12px_rgba(255,122,0,0.5)] animate-bounce" />
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md" />
              </div>
              <div className="w-5 h-2 bg-black/10 rounded-full blur-[2px] -mt-1" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {roomsData.location.points.map((point, idx) => {
              const Icon = iconMap[point.icon] || Plane;
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[28px] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <Icon className="w-6 h-6 text-[#FF7A00] transition-transform group-hover:scale-110" />
                    <span className="text-lg font-bold text-gray-900 leading-none">{point.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-400 leading-none uppercase tracking-wider">{point.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: FAQ */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-2">
            {roomsData.faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id} 
                className="border-b border-gray-100 last:border-0 pb-1"
              >
                <AccordionTrigger className="text-left text-lg font-bold text-gray-900 hover:no-underline py-6 transition-all group [&[data-state=open]>svg]:text-[#FF7A00] [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[16px] font-medium text-gray-500 leading-relaxed pb-8 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
