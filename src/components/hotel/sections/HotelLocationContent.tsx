"use client";

import React from "react";
import { MapPin, Compass, Train, Navigation, Plane, Umbrella, Bus } from "lucide-react";

export default function HotelLocationContent() {
  return (
    <section className="bg-white py-24 px-6 w-full relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10 px-4">
        
        {/* Section Header */}
        <div className="mb-14 px-2">
          <h2 className="text-[40px] font-black text-[#2D3142] mb-3">
            Location & Access
          </h2>
          <div className="text-[#9CA3AF] font-medium text-[15px] space-y-1">
            <p>Hotel Nandan</p>
            <p>Guwahati Railway Station</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Section */}
          <div className="lg:col-span-7 h-[500px] md:h-[600px] rounded-[24px] overflow-hidden relative shadow-sm border border-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.4435534241696!2d91.7482813!3d26.1822262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a597a7a14765d%3A0x6b876fc156e9df02!2sHotel%20Nandan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="filter grayscale-[0.2]"
            ></iframe>
            
            {/* Map Overlay Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-[20px] shadow-xl flex items-center gap-4 border border-gray-50 max-w-[280px] w-full">
              <div className="bg-[#F97316] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[16px] font-black text-[#1a1a1a] truncate">Hotel Nandan</h4>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Guwahati, Assam</p>
              </div>
            </div>
          </div>

          {/* Info Side Card */}
          <div className="lg:col-span-5 bg-white rounded-[24px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border border-gray-50 p-8 md:p-10 h-full">
            {/* Landmarks Group */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-orange-50 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Compass size={18} className="text-[#F97316]" />
                </div>
                <span className="text-[12px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                  LANDMARKS
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center transition-all hover:translate-x-1">
                  <span className="text-[15px] font-bold text-[#475569]">Guwahati Railway Station</span>
                  <span className="bg-[#F1F5F9] text-[#94A3B8] text-[11px] font-black px-3 py-1 rounded-md">0.5 km</span>
                </div>
                <div className="flex justify-between items-center transition-all hover:translate-x-1">
                  <span className="text-[15px] font-bold text-[#475569]">Kamakhya Temple</span>
                  <span className="bg-[#F1F5F9] text-[#94A3B8] text-[11px] font-black px-3 py-1 rounded-md">7.2 km</span>
                </div>
              </div>
            </div>

            {/* Transport Group */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-orange-50 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Bus size={18} className="text-[#F97316]" />
                </div>
                <span className="text-[12px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                  TRANSPORT
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center transition-all hover:translate-x-1">
                  <span className="text-[15px] font-bold text-[#475569]">ISBT Guwahati</span>
                  <span className="bg-[#F1F5F9] text-[#94A3B8] text-[11px] font-black px-3 py-1 rounded-md">12 km</span>
                </div>
                <div className="flex justify-between items-center transition-all hover:translate-x-1">
                  <span className="text-[15px] font-bold text-[#475569]">LGBI Airport</span>
                  <span className="bg-[#F1F5F9] text-[#94A3B8] text-[11px] font-black px-3 py-1 rounded-md">22 km</span>
                </div>
              </div>
            </div>

            {/* Special Info Cards */}
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] p-4 rounded-[18px] border border-gray-100 flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <Plane size={20} className="text-[#F97316] group-hover:scale-110 transition-transform" />
                  <span className="text-[14px] font-bold text-[#1a1a1a]">International Airport</span>
                </div>
                <span className="text-[#9CA3AF] text-[12px] font-medium">15 min drive</span>
              </div>
              
              <div className="bg-[#F8FAFC] p-4 rounded-[18px] border border-gray-100 flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <Umbrella size={20} className="text-[#F97316] group-hover:scale-110 transition-transform" />
                  <span className="text-[14px] font-bold text-[#1a1a1a]">Sunny Beach</span>
                </div>
                <span className="text-[#9CA3AF] text-[12px] font-medium">5 min walk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

