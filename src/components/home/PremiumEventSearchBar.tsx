"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles, Home, Users } from "lucide-react";
import PremiumLocationSelect from "@/components/ui/PremiumLocationSelect";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import PremiumSelect from "@/components/ui/PremiumSelect";
import { fetchVenueTypes, fetchEventTypes } from "@/lib/api/eventsEndpoints";

export default function PremiumEventSearchBar() {
  const router = useRouter();

  const [location, setLocation] = useState<any>(null);
  const [venueType, setVenueType] = useState<any>(null);
  const [eventType, setEventType] = useState<any>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<any>(null);

  const { data: venueTypesData } = useQuery({ queryKey: ["venueTypes"], queryFn: fetchVenueTypes });
  const { data: eventTypesData } = useQuery({ queryKey: ["eventTypes"], queryFn: fetchEventTypes });

  const venueOptions = venueTypesData?.records?.map((r: any) => ({ value: r.id, label: r.name })) || [];
  const eventOptions = eventTypesData?.records?.map((r: any) => ({ value: r.id, label: r.name })) || [];

  const guestOptions = [
    { value: "100", label: "0-100" },
    { value: "300", label: "100-300" },
    { value: "600", label: "300-600" },
    { value: "601", label: "600+" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location?.value) {
      params.set("city", String(location.value));
      params.set("cityName", location.label);
    }
    if (venueType?.value) params.set("venue_type", String(venueType.value));
    if (eventType?.value) params.set("event_type", String(eventType.value));
    if (date) params.set("date", date.toISOString().split("T")[0]);
    if (guests?.value) params.set("guests", guests.value);
    router.push(`/events/search${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto z-[99] p-[4px] md:p-[5px] rounded-[32px] lg:rounded-full group/search-bar shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
       {/* Animated Snake Border Gradient (Right to Left) */}
       <div className="absolute inset-0 overflow-hidden rounded-[32px] lg:rounded-full pointer-events-none">
         <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_45deg,#FF9530_90deg,transparent_135deg)]" />
         <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_180deg,transparent_225deg,#FF9530_270deg,transparent_315deg)] opacity-40" />
       </div>

      {/* Main Content Container with Glass UI */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-[31px] lg:rounded-full p-2 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          <div className="flex-[1.5] py-4 lg:py-0">
            <PremiumLocationSelect value={location} onChange={setLocation} className="w-full" containerClassName="px-6 lg:px-5 py-2 lg:py-0" />
          </div>
          <PremiumSelect label="Event Type" icon={<Sparkles className="w-5 h-5 text-[#FF9530]" />} options={eventOptions} value={eventType} onChange={setEventType} placeholder="Any Event" className="flex-[1]" containerClassName="px-6 lg:px-4 py-2 lg:py-0" />
          <PremiumSelect label="Venue Type" icon={<Home className="w-5 h-5 text-[#FF9530]" />} options={venueOptions} value={venueType} onChange={setVenueType} placeholder="Any Type" className="flex-[1]" containerClassName="px-4 lg:px-4 py-2 lg:py-0" />
          <div className="flex-[1] flex items-center px-6 lg:px-4 py-4 lg:py-0 text-left min-w-0">
              <PremiumDatePicker selected={date} onChange={(d: Date | null) => setDate(d)} placeholder="Select Date" label="Date" />
          </div>
          <PremiumSelect label="Guests" icon={<Users className="w-5 h-5 text-[#FF9530]" />} options={guestOptions} value={guests} onChange={setGuests} placeholder="Guest Count" className="flex-[1]" containerClassName="px-6 lg:px-4 py-2 lg:py-0" />
          <div className="p-2 lg:p-1.5 lg:pl-2 shrink-0">
            <button onClick={handleSearch} className="w-full lg:w-[60px] lg:h-[60px] bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white rounded-2xl lg:rounded-full px-8 lg:px-0 py-2 lg:py-0 flex items-center justify-center gap-2 font-bold transition-all duration-300 hover:scale-[1.01] lg:hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20 group">
              <Search className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-500 group-hover:rotate-12" strokeWidth={3} />
              <span className="lg:hidden tracking-tight font-bold">Find Spaces</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
