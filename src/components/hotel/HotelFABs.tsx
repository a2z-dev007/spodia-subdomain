"use client";

import React from "react";
import { MessageSquare, ArrowUp } from "lucide-react";

const HotelFABs: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openChat = () => {
    // Implement chat logic here
    console.log("Opening chat...");
  };

  return (
    <div className="fixed bottom-10 right-8 z-[100] flex flex-col space-y-4">
      {/* Chat Tooltip/FAB */}
      <button 
        onClick={openChat}
        className="w-14 h-14 bg-[#00B67A] text-white rounded-full flex items-center justify-center shadow-2xl transform transition hover:scale-110 active:scale-95 group relative"
      >
        <MessageSquare fill="currentColor" size={24} />
        <span className="absolute right-full mr-4 px-3 py-1 bg-white text-[#1A1A1A] text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </button>

      {/* Scroll To Top */}
      <button 
        className="w-14 h-14 bg-white text-[#1A1A1A] border border-gray-100 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95"
        onClick={scrollToTop}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default HotelFABs;
