"use client";
import React, { useState } from "react";
import { Calendar, Users, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const RateBookingWidget = () => {
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 2)));
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });

  return (
    <div className="sticky top-28 bg-white rounded-[20px] shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 lg:p-5 bg-gray-900 text-white">
        <h3 className="text-lg font-bold mb-0.5">Check Availability</h3>
        <p className="text-gray-400 text-[11px] font-medium">Book direct for the best rate guarantee.</p>
      </div>

      <div className="p-4 lg:p-5 space-y-4">
        {/* Date Picker */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#FF9530]" /> Check-In
            </label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold text-sm text-gray-900 cursor-pointer hover:border-[#FF9530] transition-colors">
              {format(checkIn, "dd MMM yyyy")}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#FF9530]" /> Check-Out
            </label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold text-sm text-gray-900 cursor-pointer hover:border-[#FF9530] transition-colors">
              {format(checkOut, "dd MMM yyyy")}
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-[#FF9530]" /> Guests & Rooms
          </label>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold text-sm text-gray-900 flex justify-between items-center cursor-pointer hover:border-[#FF9530] transition-colors">
            <span>{guests.adults} Adults · {guests.rooms} Room</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Real-time Update */}
        <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 border border-red-100">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600 text-[10px] font-black uppercase tracking-wider">Only 2 rooms left!</span>
        </div>

        {/* Price Preview */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-gray-400 text-[11px] font-bold mb-0.5">Total Cost Preview</p>
              <h4 className="text-xl font-bold text-gray-900">₹12,800</h4>
            </div>
            <div className="text-right">
              <p className="text-gray-900 font-bold text-xs">2 Nights</p>
              <p className="text-gray-400 text-[9px] font-bold">Includes Taxes</p>
            </div>
          </div>

          <button className="w-full bg-[#FF9530] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group">
            Book Now & Pay Later
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
