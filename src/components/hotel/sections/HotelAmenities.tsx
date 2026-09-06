"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  Wifi,
  Waves,
  Dumbbell,
  ParkingCircle,
  CheckCircle,
  Tv,
  Coffee,
  Sparkles,
  Flame,
  ShieldCheck,
  ChevronDown,
  Search,
  X,
  Bath,
  Shirt,
  Wind,
  BedDouble,
  Armchair,
  Maximize2,
  Clock,
  Briefcase,
  Car
} from "lucide-react";
import type { ListingDetail, FacilitiesDetail } from "@/types/hotelDetails";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";

type Props = {
  hotelData?: ListingDetail | null;
};

interface AmenityItemData {
  id: string | number;
  name: string;
  desc?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: "orange" | "green";
}

const defaultAmenitiesList: AmenityItemData[] = [
  { id: "1", name: "Bathtub", desc: "LUXURY BATH", icon: <Bath size={24} className="text-[#F97316]" /> },
  { id: "2", name: "BBQ Grill", desc: "OUTDOOR GRILLING", icon: <Utensils size={24} className="text-[#F97316]" /> },
  { id: "3", name: "Bidet", desc: "SANITARYWARE", icon: <Sparkles size={24} className="text-[#F97316]" /> },
  { id: "4", name: "Blackout curtains", desc: "SLEEP CONFORT", icon: <ShieldCheck size={24} className="text-[#F97316]" /> },
  { id: "5", name: "Center Table", desc: "LIVING FURNITURE", icon: <Armchair size={24} className="text-[#F97316]" /> },
  { id: "6", name: "Charging points", desc: "POWER SOCKETS", icon: <Sparkles size={24} className="text-[#F97316]" /> },
  { id: "7", name: "Child safety socket covers", desc: "FAMILY SAFE", icon: <ShieldCheck size={24} className="text-[#F97316]" /> },
  { id: "8", name: "Closet", desc: "STORAGE", icon: <Briefcase size={24} className="text-[#F97316]" /> },
  { id: "9", name: "Cook & Butler Service", desc: "PERSONAL SERVICE", icon: <Utensils size={24} className="text-[#F97316]" /> },
  { id: "10", name: "Cooking Basics", desc: "KITCHENWARE", icon: <Coffee size={24} className="text-[#F97316]" /> },
  { id: "11", name: "Dishes and Silverware", desc: "DININGWARE", icon: <Utensils size={24} className="text-[#F97316]" /> },
  { id: "12", name: "Fan", desc: "AIR COOLING", icon: <Wind size={24} className="text-[#F97316]" /> },
  { id: "13", name: "Hot & Cold Water", desc: "24/7 RUNNING", icon: <Waves size={24} className="text-[#F97316]" /> },
  { id: "14", name: "Housekeeping", desc: "DAILY CLEANING", icon: <Shirt size={24} className="text-[#F97316]" /> },
  { id: "15", name: "In Room dining", desc: "24 HOURS", icon: <Coffee size={24} className="text-[#F97316]" /> },
  { id: "16", name: "Ironing", desc: "PRESS SERVICE", icon: <Shirt size={24} className="text-[#F97316]" /> },
  { id: "17", name: "Limited duration", desc: "CHECK-IN FLEX", icon: <Clock size={24} className="text-[#F97316]" /> },
  { id: "18", name: "Living Area", desc: "SPACIOUS LOUNGE", icon: <Armchair size={24} className="text-[#F97316]" /> },
  { id: "19", name: "Mosquito Net", desc: "PROTECTION", icon: <ShieldCheck size={24} className="text-[#F97316]" /> },
  { id: "20", name: "Pillow menu", desc: "COMFORT OPTION", icon: <BedDouble size={24} className="text-[#F97316]" /> },
  { id: "21", name: "Seating Area", desc: "RELAX SPACE", icon: <Armchair size={24} className="text-[#F97316]" /> },
];

export default function HotelAmenities({ hotelData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dynamicFacilities = hotelData?.facilitiesDetails || [];
  const hasDynamicFacilities = dynamicFacilities.length > 0;

  const allAmenities: AmenityItemData[] = hasDynamicFacilities
    ? dynamicFacilities.map((item: FacilitiesDetail, index: number) => ({
        id: item.id || `fac-${index}`,
        name: item.name,
        desc: item.description || "AVAILABLE",
        icon: item.image ? (
          <Image
            src={`${IMAGE_BASE_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`}
            alt={item.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <CheckCircle size={24} className="text-[#F97316]" />
        ),
      }))
    : defaultAmenitiesList;

  // 2 rows calculation: 4 columns on desktop (8 items total), 2 columns on mobile (4 items total)
  const itemsPerRow = isMobile ? 2 : 4;
  const initialDisplayCount = itemsPerRow * 2;
  const visibleAmenities = allAmenities.slice(0, initialDisplayCount);
  const hasMore = allAmenities.length > initialDisplayCount;

  const filteredAmenities = allAmenities.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white py-12 md:py-16 px-4 md:px-12 w-full relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-[800px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              World-Class Amenities
            </h2>
            {!hasDynamicFacilities && (
              <StaticDataBadge text="static data - need this data on the api" />
            )}
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
            Experience comfort and luxury tailored for your stay at {hotelData?.name || "our property"}.
          </p>
        </div>

        {/* 2 Rows Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {visibleAmenities.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50/80 hover:bg-white p-4 sm:p-6 rounded-2xl border border-gray-100/80 hover:border-orange-200 flex items-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {item.name}
                </h3>
                {item.desc && (
                  <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider truncate mt-0.5">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Centered See More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#F97316] font-bold text-sm border border-orange-200/70 hover:border-orange-300 transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-95"
            >
              <span>See More Amenities ({allAmenities.length - initialDisplayCount} More)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Amenities Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchTerm("");
        }}
        title="Amenities"
        maxWidth="2xl"
      >
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm text-gray-800 transition-all bg-gray-50/50"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredAmenities.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50/90 p-4 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-orange-50/50 hover:border-orange-200 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                {item.name}
              </span>
            </div>
          ))}

          {filteredAmenities.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400 text-sm font-medium">
              No amenities found matching "{searchTerm}"
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
}

