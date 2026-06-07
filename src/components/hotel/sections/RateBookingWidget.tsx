"use client";
import React, { useState } from "react";
import { Calendar, Users, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const RateBookingWidget = () => {
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 2)));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  return (
    <div className="sticky top-32 bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
      <div className="p-8 bg-gray-900 text-white">
        <h3 className="text-2xl font-black mb-2">Check Availability</h3>
        <p className="text-gray-400 text-sm font-medium">Book direct for the best rate guarantee.</p>
      </div>

      <div className="p-8 space-y-6">
        {/* Date Picker */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#FF9530]" /> Check-In
            </label>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900 cursor-pointer hover:border-[#FF9530] transition-colors">
              {format(checkIn, "dd MMM yyyy")}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#FF9530]" /> Check-Out
            </label>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900 cursor-pointer hover:border-[#FF9530] transition-colors">
              {format(checkOut, "dd MMM yyyy")}
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Users className="w-3 h-3 text-[#FF9530]" /> Guests & Rooms
          </label>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900 flex justify-between items-center cursor-pointer hover:border-[#FF9530] transition-colors">
            <span>{guests.adults} Adults · {guests.rooms} Room</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Real-time Update */}
        <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600 text-xs font-black uppercase tracking-wider">Only 2 rooms left!</span>
        </div>

        {/* Price Preview */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-gray-400 text-xs font-bold mb-1">Total Cost Preview</p>
              <h4 className="text-3xl font-black text-gray-900">₹12,800</h4>
            </div>
            <div className="text-right">
              <p className="text-gray-900 font-bold text-sm">2 Nights</p>
              <p className="text-gray-400 text-[10px] font-bold">Includes Taxes</p>
            </div>
          </div>

          <button className="w-full bg-[#FF9530] text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-orange-500/20 hover:bg-gray-900 transition-all flex items-center justify-center gap-3 group">
            Book Now & Pay Later
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center text-gray-400">
          <Info className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Free Cancellation Available</span>
        </div>
      </div>
    </div>
  );
};

export default RateBookingWidget;
