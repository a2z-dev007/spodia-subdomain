"use client";

import React, { useState, useMemo } from "react";
import RoomCard from "@/components/hotel/RoomCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import roomsData from "@/data/jsons/rooms.json";

export default function RoomsListing() {
  const [activeCategory, setActiveCategory] = useState("All Rooms");
  const [sortBy, setSortBy] = useState("low-to-high");

  const filteredRooms = useMemo(() => {
    let result = [...roomsData.rooms];
    
    if (activeCategory !== "All Rooms") {
      result = result.filter(room => room.category === activeCategory);
    }

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "top-rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10">
      {/* Filters & Sorting Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        {/* Categories Tabs */}
        <div className="flex items-center gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {roomsData.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#FF7A00] text-white shadow-md shadow-orange-100"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold text-gray-900 whitespace-nowrap">Sort By:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] rounded-2xl border-gray-200 h-10 px-4 text-xs font-medium text-gray-500">
              <SelectValue placeholder="Select Sort Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100">
              <SelectItem value="low-to-high" className="text-xs">Price (Low to High)</SelectItem>
              <SelectItem value="high-to-low" className="text-xs">Price (High to Low)</SelectItem>
              <SelectItem value="top-rated" className="text-xs">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="w-full h-px bg-gray-100 mb-12" />

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-gray-400 text-lg font-medium">No rooms found in this category.</p>
          <button 
            onClick={() => setActiveCategory("All Rooms")}
            className="mt-4 text-brand-orange font-bold underline"
          >
            Show all rooms
          </button>
        </div>
      )}
    </section>
  );
}
