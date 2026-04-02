"use client";

import React, { FC, useRef, useState, useEffect } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface GuestsState {
  adults: number;
  children: number;
}

interface PremiumGuestSelectProps {
  label?: string;
  rooms: number;
  setRooms: (rooms: number) => void;
  guests: GuestsState;
  setGuests: React.Dispatch<React.SetStateAction<GuestsState>>;
  childrenAges: number[];
  setChildrenAges: React.Dispatch<React.SetStateAction<number[]>>;
  containerClassName?: string;
  className?: string;
}

const PremiumGuestSelect: FC<PremiumGuestSelectProps> = ({
  label = "Guests",
  rooms,
  setRooms,
  guests,
  setGuests,
  childrenAges,
  setChildrenAges,
  containerClassName = "",
  className = ""
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync children ages with guest count
  useEffect(() => {
    setChildrenAges((prev) => {
      if (guests.children > prev.length) {
        return [...prev, ...Array(guests.children - prev.length).fill(0)];
      } else {
        return prev.slice(0, guests.children);
      }
    });
  }, [guests.children, setChildrenAges]);

  const handleChildAgeChange = (index: number, age: number) => {
    setChildrenAges(prev => {
      const updated = [...prev];
      updated[index] = age;
      return updated;
    });
  };

  return (
    <div className={`flex items-center relative ${className} flex-1 min-w-[200px] ${containerClassName}`}>
      <div className="shrink-0 mr-2.5 transition-transform group-hover:scale-110">
        <Users className="w-5 h-5 text-[#FF9530]" />
      </div>
      <div className="flex-1 text-left min-w-0 pr-4 relative">
        {label && <p className="text-[12px] font-bold text-gray-400 capitalize mb-1">{label}</p>}
        
        <Popover open={showDropdown} onOpenChange={(open) => {
          if (!open && guests.children > 0 && childrenAges.some(age => age === 0)) {
            return;
          }
          setShowDropdown(open);
        }}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="w-full text-left bg-transparent border-none p-0 flex items-center justify-between focus:outline-none cursor-pointer"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowDropdown(true);
                }
              }}
            >
              <span 
                className="text-sm font-bold text-[#1E293B] truncate p-0 m-0"
                suppressHydrationWarning={true}
              >
                {rooms} room, {guests.adults} adults, {guests.children} children
              </span>
              <ChevronDown className="w-4 h-4 text-[#FF9530] shrink-0 ml-1" strokeWidth={3} />
            </div>
          </PopoverTrigger>

          <PopoverContent 
            className="w-[320px] bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.15)] p-5 z-[99999]" 
            onInteractOutside={(e) => {
              if (guests.children > 0 && childrenAges.some(age => age === 0)) {
                e.preventDefault();
              }
            }}
          >
            {/* Rooms */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-sm text-gray-700">Room</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                >-</Button>
                <span className="w-6 text-center text-sm font-semibold">{rooms}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setRooms(Math.min(10, rooms + 1))}
                >+</Button>
              </div>
            </div>

            {/* Adults */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-sm text-gray-700">Adults</p>
                <p className="text-[11px] text-gray-400">Ages 13+</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                >-</Button>
                <span className="w-6 text-center text-sm font-semibold">{guests.adults}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
                >+</Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-sm text-gray-700">Children</p>
                <p className="text-[11px] text-gray-400">Ages 1–10</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                >-</Button>
                <span className="w-6 text-center text-sm font-semibold">{guests.children}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 border-gray-200 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
                  onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
                >+</Button>
              </div>
            </div>

            {/* Children Ages */}
            {guests.children > 0 && (
              <div className="mt-4 space-y-3 bg-gray-50/50 p-3 rounded-xl">
                <p className="font-medium text-xs text-gray-700">Age of Children</p>
                <div className="grid grid-cols-2 gap-3">
                  {childrenAges.map((age, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-1 font-medium">Child {index + 1}</span>
                      <select
                        className="border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#FF9530] focus:ring-1 focus:ring-[#FF9530]"
                        value={age}
                        onChange={e => handleChildAgeChange(index, Number(e.target.value))}
                      >
                        <option value={0}>-- Select --</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(a => (
                          <option key={a} value={a}>{a} {a === 1 ? "yr" : "yrs"}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {childrenAges.some(age => age === 0) && (
                  <p className="text-red-500 text-[11px] mt-2 flex items-center gap-1 font-medium">
                    <span className="bg-red-100 text-red-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">!</span>
                    <span>Please select age for all children</span>
                  </p>
                )}
              </div>
            )}

            {/* Done Button */}
            <div className="mt-5">
              <button
                onClick={() => {
                  if (guests.children > 0 && childrenAges.some(age => age === 0)) return;
                  setShowDropdown(false);
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                  guests.children > 0 && childrenAges.some(age => age === 0)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white shadow-md shadow-orange-500/20 active:scale-95'
                }`}
                disabled={guests.children > 0 && childrenAges.some(age => age === 0)}
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PremiumGuestSelect;
