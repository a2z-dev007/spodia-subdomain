'use client'

import { Search, MapPin, Calendar, Users, Home, Sparkles } from 'lucide-react'
import PremiumDatePicker from '../ui/PremiumDatePicker'
import PremiumSelect from '../ui/PremiumSelect'
import PremiumLocationSelect from '../ui/PremiumLocationSelect'

interface Option {
  value: any
  label: string
}

interface PremiumSearchBarProps {
  location: any
  setLocation: (val: any) => void
  eventType: any
  setEventType: (val: any) => void
  venueType: any
  setVenueType: (val: any) => void
  date: Date | null
  setDate: (val: Date | null) => void
  guests: any
  setGuests: (val: any) => void
  handleSearch: () => void
  eventOptions: Option[]
  venueOptions: Option[]
  guestOptions: Option[]
  className?: string
  searchButtonText?: string
  requiredLocation?: boolean
}

export default function PremiumSearchBar({
  location,
  setLocation,
  eventType,
  setEventType,
  venueType,
  setVenueType,
  date,
  setDate,
  guests,
  setGuests,
  handleSearch,
  eventOptions,
  venueOptions,
  guestOptions,
  className = "",
  searchButtonText = "Find Spaces",
  requiredLocation = false
}: PremiumSearchBarProps) {
  return (
    <div className={`relative w-full mx-auto z-[99] p-[4px] md:p-[5px] rounded-2xl lg:rounded-full group/search-bar shadow-[0_30px_60px_rgba(0,0,0,0.25)] ${className}`}>
      {/* Animated Snake Border Gradient */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl lg:rounded-full pointer-events-none">
        <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_45deg,#FF9530_90deg,transparent_135deg)]" />
        <div className="absolute inset-[-500%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_180deg,transparent_225deg,#FF9530_270deg,transparent_315deg)] opacity-40" />
      </div>

      <div className="bg-white/95 backdrop-blur-2xl rounded-[14px] lg:rounded-full p-2 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* Location */}
          <div className="flex-[1.8] py-1.5 lg:py-0">
            <PremiumLocationSelect
              value={location}
              onChange={setLocation}
              className="w-full"
              containerClassName="px-6 lg:px-5 py-1 lg:py-0"
              placeholder="Where is the event?"
              required={requiredLocation}
            />
          </div>

          {/* Event Type */}
          <PremiumSelect
            label="Event Type"
            icon={<Sparkles className="w-5 h-5 text-[#FF9530]" />}
            options={eventOptions}
            value={eventType}
            onChange={setEventType}
            placeholder="Any Event"
            className="flex-1"
            containerClassName="px-6 lg:px-4 py-1 lg:py-0"
          />

          {/* Venue Type */}
          <PremiumSelect
            label="Venue Type"
            icon={<Home className="w-5 h-5 text-[#FF9530]" />}
            options={venueOptions}
            value={venueType}
            onChange={setVenueType}
            placeholder="Any Type"
            className="flex-1"
            containerClassName="px-6 lg:px-4 py-1 lg:py-0"
          />

          {/* Premium Date Picker */}
          <div className="flex-1 flex items-center px-6 lg:px-4 py-1 lg:py-0">
            <PremiumDatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              placeholder="Select Date"
              label="Date"
            />
          </div>

          {/* Guests */}
          <PremiumSelect
            label="Guests"
            icon={<Users className="w-5 h-5 text-[#FF9530]" />}
            options={guestOptions}
            value={guests}
            onChange={setGuests}
            placeholder="Guest Count"
            className="flex-1"
            containerClassName="px-6 lg:px-4 py-1 lg:py-0"
          />

          {/* Search Button */}
          <div className="p-2 lg:p-1.5 lg:pl-2">
            <button
              onClick={handleSearch}
              className="w-full lg:w-[60px] lg:h-[60px] bg-gradient-to-r from-[#FF9530] to-[#FF8000] hover:from-[#FF8000] hover:to-[#F97316] text-white rounded-2xl lg:rounded-full px-8 lg:px-0 py-2 lg:py-0 flex items-center justify-center gap-2 font-bold transition-all duration-300 hover:scale-[1.01] lg:hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20 group"
            >
              <Search className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-500 group-hover:rotate-12" strokeWidth={3} />
              <span className="lg:hidden tracking-tight font-bold">{searchButtonText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
