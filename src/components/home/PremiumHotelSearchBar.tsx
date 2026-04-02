"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setSearchFilters } from "@/lib/features/hotels/hotelSlice";
import { Search } from "lucide-react";
import PremiumLocationSelect from "@/components/ui/PremiumLocationSelect";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import PremiumGuestSelect from "@/components/ui/PremiumGuestSelect";

interface PremiumHotelSearchBarProps {
  callingFrom?: string;
  onSearch?: (params: any) => void;
  initialLocation?: any;
  initialCheckIn?: any;
  initialCheckOut?: any;
  initialGuests?: { adults: number; children: number };
  initialRooms?: number;
  initialChildrenAges?: number[];
  /** Passed from city listing pages; reserved for future use */
  metaName?: string;
  /** premium: animated border. minimal: clean white pill (home hero). */
  variant?: "premium" | "minimal";
  /** Overrides default max-w-7xl when set */
  containerClassName?: string;
}

export default function PremiumHotelSearchBar({
  callingFrom = "home",
  onSearch,
  initialLocation,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  initialRooms,
  initialChildrenAges,
  variant = "premium",
  containerClassName,
}: PremiumHotelSearchBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState<any>(
    initialLocation ? { value: initialLocation.id, label: initialLocation.name } : null
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialCheckIn ? new Date(initialCheckIn) : null,
    initialCheckOut ? new Date(initialCheckOut) : null,
  ]);
  const [checkInDate, checkOutDate] = dateRange;
  const [rooms, setRooms] = useState(initialRooms || 1);
  const [guests, setGuests] = useState(initialGuests || { adults: 1, children: 0 });
  const [childrenAges, setChildrenAges] = useState<number[]>(initialChildrenAges || []);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    dispatch(
      setSearchFilters({
        rooms,
        noOfAdult: guests.adults,
        noOfChild: guests.children,
        childrenAges,
      })
    );
  }, [rooms, guests, childrenAges, dispatch]);

  const handleSearch = () => {
    const formatDate = (date: Date | null): string => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    dispatch(
      setSearchFilters({
        checkIn: formatDate(checkInDate),
        checkOut: formatDate(checkOutDate),
        city: location ? String(location.value) : "",
        cityName: location ? location.label : "",
        noOfAdult: guests.adults,
        noOfChild: guests.children,
        rooms,
        childrenAges,
      })
    );

    let newErrors: any = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!location) newErrors.location = "Please select a location.";
    if (!checkInDate) newErrors.checkInDate = "Select check-in.";
    if (!checkOutDate) newErrors.checkOutDate = "Select check-out.";
    if (guests.children > 0 && childrenAges.some((age) => age === 0)) {
      newErrors.guests = "Select children ages";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (onSearch) {
      onSearch({
        location: location ? location.label : "",
        cityId: location ? location.value : null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        rooms,
        childrenAges,
      });
      return;
    }

    const currentParams = new URLSearchParams();
    if (checkInDate) currentParams.set("start_date", formatDate(checkInDate));
    if (checkOutDate) currentParams.set("end_date", formatDate(checkOutDate));
    if (guests.adults) currentParams.set("no_of_adult", String(guests.adults));
    if (guests.children) currentParams.set("no_of_child", String(guests.children));
    if (rooms) currentParams.set("rooms", String(rooms));
    if (childrenAges.length > 0) currentParams.set("childInfo", childrenAges.join(","));
    if (location) {
      currentParams.set("city", String(location.value));
      currentParams.set("cityName", location.label);
    }

    router.push(`/search-results?${currentParams.toString()}`);
  };

  const isMinimal = variant === "minimal";
  const widthClass = containerClassName ?? "max-w-7xl";

  return (
    <div
      className={`relative w-full mx-auto z-[100] group/search-bar ${widthClass} ${
        isMinimal
          ? "rounded-[2rem] lg:rounded-full shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
          : "p-[4px] md:p-[5px] rounded-[32px] lg:rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
      }`}
    >
      {!isMinimal && (
        <div className="absolute inset-0 overflow-hidden rounded-[32px] lg:rounded-full pointer-events-none">
          <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_45deg,#FF9530_90deg,transparent_135deg)]" />
          <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_180deg,transparent_225deg,#FF9530_270deg,transparent_315deg)] opacity-40" />
        </div>
      )}

      <div
        className={`relative z-10 w-full p-2 ${
          isMinimal
            ? "bg-white rounded-[1.875rem] lg:rounded-full border border-gray-100/80"
            : "bg-white/95 backdrop-blur-2xl rounded-[31px] lg:rounded-full"
        }`}
      >
        <div
          className={`flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x relative ${
            isMinimal ? "divide-gray-200" : "divide-gray-100"
          }`}
        >
          {/* Location */}
          <div className=" flex-[1.5] py-4 lg:py-0 relative">
            <PremiumLocationSelect
              value={location}
              onChange={(val) => {
                setLocation(val);
                setErrors((prev: any) => ({ ...prev, location: undefined }));
              }}
              placeholder="Where are you going?"
              className="w-full"
              containerClassName="px-6 lg:px-5 py-2 lg:py-0"
            />
            {errors.location && (
              <span className="absolute -bottom-6 left-6 text-red-500 text-xs font-bold bg-white/90 px-2 py-0.5 rounded shadow-sm">{errors.location}</span>
            )}
          </div>

          {/* Date Range */}
          <div className="flex-[1.5] flex items-center px-6 lg:px-4 py-4 lg:py-0 relative">
            <div className="flex items-center w-full min-w-0">
               <PremiumDatePicker
                 selected={checkInDate}
                 startDate={checkInDate}
                 endDate={checkOutDate}
                 onChange={(update: [Date | null, Date | null] | null) => {
                   if (update === null) {
                     setDateRange([null, null]);
                   } else {
                     setDateRange(update);
                   }
                   setErrors((prev: any) => ({ ...prev, checkInDate: undefined, checkOutDate: undefined }));
                 }}
                 selectsRange={true}
                 placeholder="Check In - Check Out"
                 label="Date"
               />
            </div>
            {(errors.checkInDate || errors.checkOutDate) && (
              <span className="absolute -bottom-6 left-6 text-red-500 text-xs font-bold bg-white/90 px-2 py-0.5 rounded shadow-sm">
                {errors.checkInDate || errors.checkOutDate}
              </span>
            )}
          </div>

          {/* Guests */}
          <div className="flex-[1.5] flex items-center px-6 lg:px-4 py-4 lg:py-0">
             <PremiumGuestSelect
               rooms={rooms}
               setRooms={setRooms}
               guests={guests}
               setGuests={setGuests}
               childrenAges={childrenAges}
               setChildrenAges={setChildrenAges}
             />
          </div>

          {/* Search Button */}
          <div className="p-2 lg:p-1.5 lg:pl-2 shrink-0">
            <button
              onClick={handleSearch}
              className={`w-full text-white flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95 group ${
                isMinimal
                  ? "lg:w-[56px] lg:h-[56px] lg:min-w-[56px] bg-[#FF9530] hover:bg-[#FF8000] rounded-2xl lg:rounded-full px-8 lg:px-0 py-3 lg:py-0 shadow-md shadow-orange-500/25 lg:hover:scale-105"
                  : "lg:w-[60px] lg:h-[60px] bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] rounded-2xl lg:rounded-full px-8 lg:px-0 py-2 lg:py-0 shadow-lg shadow-orange-500/20 hover:scale-[1.01] lg:hover:scale-110"
              }`}
            >
              <Search className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-500 group-hover:rotate-12" strokeWidth={3} />
              <span className="lg:hidden tracking-tight font-bold">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
