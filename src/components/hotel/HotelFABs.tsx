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
    console.log("Opening chat...");
  };

  return (
    <div className="fixed bottom-10 right-6 z-40 flex flex-col space-y-3 pointer-events-auto">
      {/* Chat Tooltip/FAB */}
      <button 
        type="button"
        onClick={openChat}
        className="w-12 h-12 md:w-14 md:h-14 bg-[#00B67A] text-white rounded-full flex items-center justify-center shadow-xl transform transition hover:scale-110 active:scale-95 group relative"
        aria-label="Chat with us"
      >
        <MessageSquare fill="currentColor" size={22} />
        <span className="absolute right-full mr-3 px-3 py-1 bg-white text-[#1A1A1A] text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </button>

      {/* Scroll To Top */}
      <button 
        type="button"
        className="w-12 h-12 md:w-14 md:h-14 bg-white text-gray-800 border border-gray-150 rounded-full flex items-center justify-center shadow-xl transition hover:scale-110 active:scale-95"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
};

export default HotelFABs;
