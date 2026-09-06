"use client";

import React, { useState } from "react";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import { Search } from "lucide-react";
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

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      setArrivalDate(dates[0]);
      setDepartureDate(dates[1]);
    } else {
      setArrivalDate(null);
      setDepartureDate(null);
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] mx-auto z-20 px-2 sm:px-4">
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] p-5 sm:p-6 lg:p-7 border border-gray-100/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4 sm:gap-5 lg:gap-6">
          
          {/* Dates of Stay */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-extrabold text-[#1A202C] uppercase tracking-widest mb-2 px-1">
              Dates of Stay
            </label>
            <div className="bg-[#F8FAFC] border border-gray-200/90 hover:border-[#FF9530] rounded-[14px] h-[52px] px-4 flex items-center transition-colors">
              <PremiumDatePicker
                selectsRange
                startDate={arrivalDate}
                endDate={departureDate}
                onChange={handleDateChange}
                placeholder="Check In - Check Out"
                label=""
                className="w-full !p-0"
                containerClassName="w-full !p-0"
                showIcon={true}
              />
            </div>
          </div>

          {/* Adults */}
          <div className="w-full">
            <label className="block text-[11px] font-extrabold text-[#1A202C] uppercase tracking-widest mb-2 px-1">
              Adults
            </label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger className="w-full bg-[#F8FAFC] border border-gray-200/90 rounded-[14px] px-4 h-[52px] text-[14px] font-bold text-[#1A202C] focus:ring-0 outline-none hover:bg-[#F1F5F9] hover:border-[#FF9530] transition-colors">
                <SelectValue placeholder="Adults" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-2xl rounded-xl z-[9999]">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="font-bold py-2.5 cursor-pointer"
                  >
                    {num} Adult{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Children */}
          <div className="w-full">
            <label className="block text-[11px] font-extrabold text-[#1A202C] uppercase tracking-widest mb-2 px-1">
              Children
            </label>
            <Select value={children} onValueChange={setChildren}>
              <SelectTrigger className="w-full bg-[#F8FAFC] border border-gray-200/90 rounded-[14px] px-4 h-[52px] text-[14px] font-bold text-[#1A202C] focus:ring-0 outline-none hover:bg-[#F1F5F9] hover:border-[#FF9530] transition-colors">
                <SelectValue placeholder="Children" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-2xl rounded-xl z-[9999]">
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="font-bold py-2.5 cursor-pointer"
                  >
                    {num} Child{num !== 1 ? "ren" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <label className="hidden lg:block text-[11px] font-extrabold uppercase tracking-widest mb-2 px-1 opacity-0 pointer-events-none select-none">
              Search
            </label>
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white h-[52px] rounded-[14px] font-bold uppercase tracking-wider text-[13px] sm:text-[14px] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
              <span>Check Availability</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelSearchbar;
