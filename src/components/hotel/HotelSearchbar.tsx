"use client";

import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { ChevronDown, Calendar, Users, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HotelSearchbarProps {
  onSearch?: (data: any) => void;
}

const HotelSearchbar: React.FC<HotelSearchbarProps> = ({ onSearch }) => {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(new Date());
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date(Date.now() + 86400000));
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ arrivalDate, departureDate, adults, children });
    }
    console.log("Searching availability...", { arrivalDate, departureDate, adults, children });
  };

  return (
    <div className="relative w-full max-w-[1550px] mx-auto z-20 px-4 md:px-12">
      <div className="bg-white rounded-[1.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)] p-4 md:p-6 lg:p-8 lg:py-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-10 border border-gray-50/50">
        
        {/* Arrival */}
        <div className="w-full lg:flex-1 relative group">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Arrival</label>
          <div className="relative">
            <ReactDatePicker
              selected={arrivalDate}
              onChange={(date: Date | null) => setArrivalDate(date)}
              placeholderText="Select Date"
              className="w-full bg-[#f8fbff] border-0 rounded-xl px-5 py-4 md:py-5 text-sm md:text-[15px] font-bold text-[#1a1a1a] cursor-pointer focus:ring-0 transition-all outline-none"
              dateFormat="dd MMM"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                {arrivalDate ? format(arrivalDate, "EEE") : "SUN"}
              </span>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="w-full lg:flex-1 relative group">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Departure</label>
          <div className="relative">
            <ReactDatePicker
              selected={departureDate}
              onChange={(date: Date | null) => setDepartureDate(date)}
              placeholderText="Select Date"
              className="w-full bg-[#f8fbff] border-0 rounded-xl px-5 py-4 md:py-5 text-sm md:text-[15px] font-bold text-[#1a1a1a] cursor-pointer focus:ring-0 transition-all outline-none"
              dateFormat="dd MMM"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                {departureDate ? format(departureDate, "EEE") : "MON"}
              </span>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="w-full lg:flex-[1.5] relative">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Guests</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="w-full bg-[#FAFBFF] border-0 rounded-xl px-4 py-3.5 text-[14px] font-bold text-[#1a1a1a] focus:ring-0 outline-none h-auto transition-colors hover:bg-[#F0F2FA]">
                  <SelectValue placeholder="Adults" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl rounded-xl">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="font-bold py-3">{num} Adult{num > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger className="w-full bg-[#FAFBFF] border-0 rounded-xl px-4 py-3.5 text-[14px] font-bold text-[#1a1a1a] focus:ring-0 outline-none h-auto transition-colors hover:bg-[#F0F2FA]">
                  <SelectValue placeholder="Children" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl rounded-xl">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="font-bold py-3">{num} Child{num !== 1 ? "ren" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full lg:flex-[0.7] flex flex-col justify-end pt-2 lg:pt-6">
          <button
            onClick={handleSearch}
            className="w-full bg-[#FF7D21] text-white px-8 py-5 rounded-[12px] font-bold uppercase tracking-widest text-[12px] hover:bg-[#e86d1a] transition-all shadow-[0_10px_30px_rgba(255,125,33,0.3)] hover:shadow-[0_15px_40px_rgba(255,125,33,0.4)] active:scale-[0.98]"
          >
            Check Availability
          </button>
        </div>

        {/* Close Button */}
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-white border border-gray-100 rounded-full shadow-lg text-gray-800 cursor-pointer hover:bg-gray-50 transition-all z-30">
          <X size={15} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default HotelSearchbar;
