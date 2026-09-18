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
      {/* Chat button removed based on user request */}

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
