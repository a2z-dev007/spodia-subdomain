"use client";

import { useState } from "react";
import PremiumHotelSearchBar from "./PremiumHotelSearchBar";
import PremiumEventSearchBar from "./PremiumEventSearchBar";
import { Building2, Clock, UtensilsCrossed, Sparkles, PartyPopper } from "lucide-react";

type TabId = "hotels" | "hourly" | "restaurants" | "spas" | "events";

const tabs = [
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "hourly", label: "Hourly Stays", icon: Clock },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { id: "spas", label: "Spas", icon: Sparkles },
  { id: "events", label: "Events", icon: PartyPopper },
];

export default function HomeSearchTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("hotels");

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 flex gap-1 overflow-x-auto hide-scrollbar max-w-[95%] sm:max-w-fit mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2.5 px-5  py-2.5 sm:py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 text-sm sm:text-base relative group ${
                isActive 
                  ? "text-[#FF9530] z-10" 
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              {/* Simple Glass Background for Active Tab */}
              {isActive && (
                <div className="absolute inset-0 z-[-1] bg-white/30 backdrop-blur-xl border border-white/20 rounded-full shadow-lg" />
              )}
              
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? "text-[#FF9530] scale-110" : "text-white/40"}`} />
              <span className={isActive ? "tracking-wide" : ""}>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="max-w-7xl w-full md:px-8 lg:px-8 px-2 relative min-h-[85px] z-50">
         {activeTab === "hotels" && <PremiumHotelSearchBar />}
         {activeTab === "hourly" && <PremiumHotelSearchBar />}
         {activeTab === "restaurants" && (
           <div className="text-center font-bold text-white text-base sm:text-lg py-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-[#FF9530] opacity-80" />
              Restaurants coming soon!
           </div>
         )}
         {activeTab === "spas" && (
           <div className="text-center font-bold text-white text-base sm:text-lg py-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#FF9530] opacity-80" />
              Spas coming soon!
           </div>
         )}
         {activeTab === "events" && <PremiumEventSearchBar />}
      </div>
    </div>
  );
}
