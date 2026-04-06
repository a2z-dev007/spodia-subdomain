"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Plane, Train, Building, Church, Camera, Car } from "lucide-react";

const landmarks = [
  { id: 1, name: "Kamakhya Temple", dist: "7.5 km", time: "20 min", icon: <Church size={20} className="text-orange-500" /> },
  { id: 2, name: "Railway Station", dist: "1.2 km", time: "5 min", icon: <Train size={20} className="text-orange-500" /> },
  { id: 3, name: "LGBI Airport", dist: "22 km", time: "45 min", icon: <Plane size={20} className="text-orange-500" /> },
  { id: 4, name: "Umananda Island", dist: "3.5 km", time: "15 min", icon: <Camera size={20} className="text-orange-500" /> },
  { id: 5, name: "GS Road Market", dist: "2.8 km", time: "10 min", icon: <Building size={20} className="text-orange-500" /> },
  { id: 6, name: "ISBT Guwahati", dist: "12 km", time: "30 min", icon: <Car size={20} className="text-orange-500" /> }
];

export default function HotelLocationContent() {
  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto w-full group relative overflow-hidden">
      <div className="text-center mb-20 max-w-[1000px] mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] mb-8 leading-none tracking-tight">
          Location & <span className="text-orange-500 underline decoration-[6px] decoration-orange-500/20 underline-offset-[12px]">Access</span>
        </h2>
        <p className="text-gray-500 font-medium text-xl max-w-[700px] mx-auto leading-relaxed">
          Strategically located in the heart of Guwahati, we are well connected to all major transit hubs and tourist landmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">
        {/* Map Container */}
        <div className="relative h-[600px] w-full rounded-[60px] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-gray-100 group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114584.73484085442!2d91.66!3d26.11!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5a287f913d3d%3A0xc3b835e39d53d865!2sGuwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale transition-all duration-700 group-hover:grayscale-0"
          ></iframe>
          <div className="absolute top-10 left-10 bg-white p-6 rounded-[30px] shadow-2xl flex items-center gap-4 transition-transform group-hover:scale-105">
            <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-black text-[#1a1a1a]">Hotel Nandan</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Guwahati, Assam</p>
            </div>
          </div>
        </div>

        {/* Landmarks Container */}
        <div className="flex flex-col justify-center space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {landmarks.map((item) => (
              <div key={item.id} className="bg-white p-10 rounded-[40px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] border-[1.5px] border-gray-50 flex items-start gap-6 transition-all duration-300 hover:border-orange-500/30 hover:scale-[1.05] group">
                <div className="w-[60px] h-[60px] rounded-[20px] bg-orange-50 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1a1a1a] mb-2">{item.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{item.dist}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                    <span className="text-sm font-black text-orange-500 uppercase tracking-widest">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] -mr-[150px] -mt-[150px]" />
            <div className="relative z-10">
              <h4 className="text-3xl font-black text-white mb-4">Need a pickup?</h4>
              <p className="text-gray-400 font-medium text-lg mb-8 leading-relaxed">
                Contact our concierge desk for complimentary airport/railway station pickups for premium stays.
              </p>
              <button className="bg-white text-black px-10 py-5 rounded-[40px] font-black uppercase tracking-widest text-[13px] hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-[0.98]">
                Request Pickup →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
