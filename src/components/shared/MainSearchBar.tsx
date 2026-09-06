"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumLocationSelect from "@/components/ui/PremiumLocationSelect";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import PremiumGuestSelect from "@/components/ui/PremiumGuestSelect";
import { useAppDispatch } from "@/lib/hooks";
import { setSearchFilters } from "@/lib/features/hotels/hotelSlice";

interface MainSearchBarProps {
  onSearch?: (params: any) => void;
  className?: string;
  initialData?: {
    location?: any;
    checkIn?: Date;
    checkOut?: Date;
    guests?: { adults: number; children: number };
    rooms?: number;
    childrenAges?: number[];
  };
}

export default function MainSearchBar({
  onSearch,
  className = "",
  initialData,
}: MainSearchBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState<any>(initialData?.location || null);
  const [startDate, setStartDate] = useState<Date | null>(initialData?.checkIn || null);
  const [endDate, setEndDate] = useState<Date | null>(initialData?.checkOut || null);
  const [rooms, setRooms] = useState(initialData?.rooms || 1);
  const [guests, setGuests] = useState(initialData?.guests || { adults: 1, children: 0 });
  const [childrenAges, setChildrenAges] = useState<number[]>(initialData?.childrenAges || []);

  const handleSearch = () => {
    const formatDate = (date: Date | null): string => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const searchData = {
      location: location ? (typeof location === 'string' ? location : location.label) : "",
      cityId: location?.value || null,
      checkIn: formatDate(startDate),
      checkOut: formatDate(endDate),
      guests,
      rooms,
      childrenAges,
    };

    dispatch(
      setSearchFilters({
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        city: searchData.cityId ? String(searchData.cityId) : "",
        cityName: searchData.location,
        noOfAdult: guests.adults,
        noOfChild: guests.children,
        rooms,
        childrenAges,
      })
    );

    if (onSearch) {
      onSearch(searchData);
      return;
    }

    const params = new URLSearchParams();
    if (searchData.location) params.set("cityName", searchData.location);
    if (searchData.cityId) params.set("city", String(searchData.cityId));
    if (searchData.checkIn) params.set("start_date", searchData.checkIn);
    if (searchData.checkOut) params.set("end_date", searchData.checkOut);
    params.set("no_of_adult", guests.adults.toString());
    params.set("no_of_child", guests.children.toString());
    params.set("rooms", rooms.toString());
    if (childrenAges.length > 0) params.set("childInfo", childrenAges.join(","));

    router.push(`/search-results?${params.toString()}`);
  };

  const onDateChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-2xl md:rounded-full p-3 sm:p-3.5 md:p-2 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 transition-all hover:shadow-[0_8px_35px_rgb(0,0,0,0.15)] ${className}`}>
      
      {/* Location */}
      <div className="flex-1 flex items-center px-3.5 sm:px-4 md:px-6 py-2.5 md:py-2 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/50 rounded-xl md:rounded-l-full md:rounded-r-none transition-colors group">
        <MapPin className="w-5 h-5 text-[#FF9530] mr-3 md:mr-4 shrink-0" strokeWidth={2.5} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">Location</p>
          <PremiumLocationSelect
            value={location}
            onChange={setLocation}
            placeholder="Where are you going?"
            className="w-full !p-0"
            containerClassName="!p-0"
            label=""
            icon={null}
          />
        </div>
      </div>

      {/* Date Range (Check In - Check Out) */}
      <div className="flex-1 flex items-center px-3.5 sm:px-4 md:px-6 py-2.5 md:py-2 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/50 transition-colors group">
        <Calendar className="w-5 h-5 text-[#FF9530] mr-3 md:mr-4 shrink-0" strokeWidth={2.5} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">Date</p>
          <div className="w-full">
            <PremiumDatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={onDateChange}
              placeholder="Check In - Check Out"
              className="!p-0 !min-h-0"
              containerClassName="!p-0"
              label=""
              showIcon={false}
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 flex items-center px-3.5 sm:px-4 md:px-6 py-2.5 md:py-2 hover:bg-gray-50/50 rounded-xl md:rounded-none transition-colors group">
        <Users className="w-5 h-5 text-[#FF9530] mr-3 md:mr-4 shrink-0" strokeWidth={2.5} />
        <div className="flex-1 min-w-0 relative">
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">Guests</p>
          <PremiumGuestSelect
            rooms={rooms}
            setRooms={setRooms}
            guests={guests}
            setGuests={setGuests}
            childrenAges={childrenAges}
            setChildrenAges={setChildrenAges}
            className="bg-transparent border-none p-0 !shadow-none ring-0 w-full hover:bg-transparent !h-auto"
            showIcon={false}
            label=""
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="pt-1 md:pt-0 md:pl-4 md:pr-1 w-full md:w-auto">
        <Button
          onClick={handleSearch}
          className="gradient-btn h-12 md:h-14 w-full md:w-14 rounded-xl md:rounded-full flex items-center justify-center p-0 shadow-lg hover:shadow-orange-200 transition-all duration-300 hover:scale-105 active:scale-95 text-white font-bold text-sm"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6 text-white shrink-0" strokeWidth={2.75} />
          <span className="inline md:hidden ml-2 font-semibold">Search Stays</span>
        </Button>
      </div>
    </div>
  );
}
