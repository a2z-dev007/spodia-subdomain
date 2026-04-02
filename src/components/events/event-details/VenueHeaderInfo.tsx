'use client'

import React from 'react'
import { MapPin, ShieldCheck } from 'lucide-react'

interface VenueHeaderInfoProps {
  venueName: string
  venueLoc: string
  onSelection?: () => void
}

export function VenueHeaderInfo({ 
  venueName, 
  venueLoc, 
  onSelection 
}: VenueHeaderInfoProps) {
  return (
    <div className="w-full bg-white pb-6 pt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Name and Location */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {venueName}
            </h2>
            <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 text-[#FF9530]" />
            <span className="text-sm md:text-base font-bold">{venueLoc}</span>
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="flex items-center gap-6 md:gap-10">
          <button 
            onClick={onSelection}
            className="px-6 py-3.5 md:px-10 md:py-4 bg-[#FF9530] text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl shadow-[0_10px_20px_rgba(255,149,48,0.3)] hover:bg-[#FF8000] hover:scale-[1.02] transition-all active:scale-95"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  )
}
