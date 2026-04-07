"use client";

import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { ChevronDown, Calendar, Users, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotelSearchbarProps {
  onSearch?: (data: any) => void;
}

const HotelSearchbar: React.FC<HotelSearchbarProps> = ({ onSearch }) => {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(new Date());
  const [departureDate, setDepartureDate] = useState<Date | null>(
    new Date(Date.now() + 86400000),
  );
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ arrivalDate, departureDate, adults, children });
    }
    console.log("Searching availability...", {
      arrivalDate,
      departureDate,
      adults,
      children,
    });
  };

  return (
    <div className="relative w-full max-w-[1600px] mx-auto z-20 px-4">
      <div className="bg-white rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] px-6 py-6 lg:py-7 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6 border border-gray-100/50">
        {/* Arrival */}
        <div className="w-full lg:flex-1 relative">
          <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-3 px-2">
            Arrival
          </label>
          <div className="relative bg-[#F3F6F9] rounded-[14px] hover:bg-[#EDF1F5] transition-colors">
            <ReactDatePicker
              selected={arrivalDate}
              onChange={(date: Date | null) => setArrivalDate(date)}
              placeholderText="Select Date"
              className="w-full bg-transparent border-0 rounded-[14px] px-5 h-[56px] text-[15px] font-bold text-[#1a1a1a] cursor-pointer focus:ring-0 outline-none"
              dateFormat="dd MMM"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">
                {arrivalDate ? format(arrivalDate, "EEE") : "SUN"}
              </span>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="w-full lg:flex-1 relative">
          <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-3 px-2">
            Departure
          </label>
          <div className="relative bg-[#F3F6F9] rounded-[14px] hover:bg-[#EDF1F5] transition-colors">
            <ReactDatePicker
              selected={departureDate}
              onChange={(date: Date | null) => setDepartureDate(date)}
              placeholderText="Select Date"
              className="w-full bg-transparent border-0 rounded-[14px] px-5 h-[56px] text-[15px] font-bold text-[#1a1a1a] cursor-pointer focus:ring-0 outline-none"
              dateFormat="dd MMM"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">
                {departureDate ? format(departureDate, "EEE") : "MON"}
              </span>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="w-full lg:flex-[1.8] relative">
          <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-3 px-2">
            Guests
          </label>
          <div className="flex gap-3 h-[56px]">
            <div className="flex-1">
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="w-full bg-[#F3F6F9] border-0 rounded-[14px] px-5 h-full text-[14px] font-bold text-[#1a1a1a] focus:ring-0 outline-none hover:bg-[#EDF1F5] transition-colors">
                  <SelectValue placeholder="Adults" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl rounded-xl">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="font-bold py-3"
                    >
                      {num} Adult{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger className="w-full bg-[#F3F6F9] border-0 rounded-[14px] px-5 h-full text-[14px] font-bold text-[#1a1a1a] focus:ring-0 outline-none hover:bg-[#EDF1F5] transition-colors">
                  <SelectValue placeholder="Children" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl rounded-xl">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="font-bold py-3"
                    >
                      {num} Child{num !== 1 ? "ren" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full lg:flex-[1.2] flex flex-col justify-end">
          <button
            onClick={handleSearch}
            className="w-full bg-[#F97316] text-white h-[56px] rounded-[14px] font-bold uppercase tracking-widest text-[13px] hover:bg-[#EA580C] transition-all"
          >
            Check Availability
          </button>
        </div>

        {/* Close Button */}
        <div className="absolute -top-2.5 -right-0.5 flex items-center justify-center w-8 h-8 bg-white border border-gray-100 rounded-full shadow-lg text-gray-800 cursor-pointer hover:bg-gray-50 transition-all z-30">
          <X size={15} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default HotelSearchbar;
