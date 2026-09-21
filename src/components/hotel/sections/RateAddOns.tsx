"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane, Coffee, Flower2, Map, Check } from "lucide-react";

const RateAddOns = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const addons = [
    { id: 1, title: "Airport Transfer", price: 1000, icon: <Plane className="w-5 h-5" />, desc: "Private pickup from the airport." },
    { id: 2, title: "Daily Breakfast", price: 500, icon: <Coffee className="w-5 h-5" />, desc: "Unlimited buffet breakfast/person." },
    { id: 3, title: "Spa Access Pass", price: 2000, icon: <Flower2 className="w-5 h-5" />, desc: "Full day access to spa & sauna." },
    { id: 4, title: "Guided City Tour", price: 1500, icon: <Map className="w-5 h-5" />, desc: "4-hour guided heritage walk." },
  ];

  const toggleAddon = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addons.map((addon) => (
        <div 
          key={addon.id} 
          onClick={() => toggleAddon(addon.id)}
          className={`p-5 md:p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border-2 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6 group ${selected.includes(addon.id) ? "border-[#FF9530] bg-orange-50/50 shadow-lg" : "border-gray-100 bg-white hover:border-gray-200"}`}
        >
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selected.includes(addon.id) ? "bg-[#FF9530] text-white" : "bg-gray-50 text-gray-400 group-hover:text-gray-900"}`}>
              {addon.icon}
            </div>
            <div>
              <h4 className="text-base lg:text-lg font-black text-gray-900">{addon.title}</h4>
              <p className="text-gray-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest leading-relaxed mt-1">{addon.desc}</p>
            </div>
          </div>
          
          <div className="flex items-center w-full lg:w-auto mt-2 lg:mt-0 lg:justify-end">
            {/* Tick Circle (Left on mobile/tablet, Right on Desktop) */}
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 lg:order-2 lg:ml-8 ${selected.includes(addon.id) ? "bg-[#FF9530] border-[#FF9530] text-white" : "border-gray-200 text-transparent"}`}>
              <Check className="w-4 h-4" />
            </div>
            
            {/* Price (Centered on mobile/tablet, Left on Desktop) */}
            <div className="flex-1 flex justify-center lg:flex-none lg:order-1">
              <span className="text-lg lg:text-xl font-black text-gray-900 -ml-8 lg:ml-0">₹{addon.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RateAddOns;
